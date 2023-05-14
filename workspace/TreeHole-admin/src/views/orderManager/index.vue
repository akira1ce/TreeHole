<!--
 * @Author: Akira
 * @Date: 2023-02-23 15:08:04
 * @LastEditTime: 2023-05-14 10:18:24
-->
<script lang="ts" setup>
import { reactive, ref, watch, onMounted } from "vue"
import { ElMessage, ElMessageBox } from "element-plus"
import type { FormInstance, FormRules, UploadProps, UploadUserFile } from "element-plus"
import { Search, Refresh, CirclePlus, Delete, Download, RefreshRight } from "@element-plus/icons-vue"
import { usePagination } from "@/hooks/usePagination"
import { GetTreeApi, ModifyTreeApi, AddTreeApi, RemoveTreeApi } from "@/api/tree"
import { ITree, img } from "@/api/tree/types/tree"
import { IUser } from "@/api/user/types/user"
import { GetUserApi } from "@/api/user"
import { RemoveFileApi } from "@/api/upload"
import _ from "lodash"
import { RemoveOrderApi, GetOrderApi } from "@/api/order"

const loading = ref<boolean>(false)
const { paginationData, handleCurrentChange, handleSizeChange } = usePagination()

//#region 增
/** 分页用户列表 */
const userList = reactive<IUser[]>([])
const pageNo = ref<number>(1)
const limit = ref<number>(10)

const getUserData = async () => {
  const res = await GetUserApi({ pageNo: pageNo.value, limit: limit.value })
  const list = res.data.list
  if (list.length != 0) {
    userList.push(...list)
    pageNo.value++
  }
}
//#endregion

//#region 删
const handleDelete = (row: any) => {
  if (row.status != "2") {
    ElMessage.error("交易正在进行")
    return
  }
  ElMessageBox.confirm(`正在删除吗订单：${row._id}，确认删除？`, "提示", {
    confirmButtonText: "确定",
    cancelButtonText: "取消",
    type: "warning"
  }).then(async () => {
    await RemoveOrderApi({ _id: row._id })
    ElMessage.success("删除成功")
    getTableData()
  })
}
//#endregion

//#region 查
const tableData = ref<any[]>([])
const searchFormRef = ref<FormInstance | null>(null)
const searchData = reactive({
  type: "",
  userID: ""
})
const getTableData = async () => {
  loading.value = true
  const res = await GetOrderApi({
    pageNo: paginationData.currentPage,
    limit: paginationData.pageSize,
    type: searchData.type || undefined,
    userID: searchData.userID || undefined
  })
  paginationData.total = res.data.count
  tableData.value = res.data.list
  loading.value = false
}
const handleSearch = () => {
  if (paginationData.currentPage === 1) {
    getTableData()
  }
  paginationData.currentPage = 1
}
const resetSearch = () => {
  searchFormRef.value?.resetFields()
  if (paginationData.currentPage === 1) {
    getTableData()
  }
  paginationData.currentPage = 1
}
const handleRefresh = () => {
  getTableData()
}
const timeFormat = (time: string) => {
  time = new Date(time).toLocaleString()
  return time
}
//#endregion

/** 监听分页参数的变化 */
watch([() => paginationData.currentPage, () => paginationData.pageSize], getTableData, { immediate: true })

onMounted(async () => {
  await getUserData()
})
</script>

<template>
  <div class="app-container">
    <!-- 搜索 -->
    <el-card v-loading="loading" shadow="never" class="search-wrapper">
      <el-form ref="searchFormRef" :inline="true" :model="searchData">
        <el-form-item prop="type" label="苗木类型">
          <el-input v-model="searchData.type" placeholder="请输入苗木类型" />
        </el-form-item>
        <el-form-item prop="userID" label="用户">
          <el-select v-model="searchData.userID" v-loadmore="getUserData">
            <el-option
              v-for="user in userList"
              :label="user.name"
              :value="user._id as string"
              :key="user._id"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" :icon="Search" @click="handleSearch">查询</el-button>
          <el-button :icon="Refresh" @click="resetSearch">重置</el-button>
        </el-form-item>
      </el-form>
    </el-card>
    <!-- 列表 -->
    <el-card v-loading="loading" shadow="never">
      <div class="toolbar-wrapper">
        <div>
          <el-tooltip content="刷新表格">
            <el-button type="primary" :icon="RefreshRight" circle @click="handleRefresh" />
          </el-tooltip>
        </div>
      </div>
      <div class="table-wrapper">
        <el-table :data="tableData">
          <el-table-column prop="tree.imgs" label="苗木图片" align="center">
            <template #default="scope">
              <el-image
                style="height: 65px;aspect-ratio: 1.74;"
                :src="scope.row.tree.imgs[0]?.url || 'https://s2.loli.net/2023/02/25/Gdm9sxjTYKDg8t3.png'"
                fit="cover"
              />
            </template>
          </el-table-column>
          <el-table-column prop="tree.type" label="苗木类型" align="center" />
          <el-table-column prop="buyer" label="买方" align="center">
            <template #default="scope">
              <span>{{ scope.row.buyer.name }}</span>
            </template>
          </el-table-column>
          <el-table-column prop="seller" label="卖方" align="center">
            <template #default="scope">
              <span>{{ scope.row.seller.name }}</span>
            </template>
          </el-table-column>
          <el-table-column prop="tree.price" label="价格" align="center">
            <template #default="scope">
              <span>{{ scope.row.tree.price }}</span>
            </template>
          </el-table-column>
          <el-table-column prop="time" label="创建时间" align="center">
            <template #default="scope">
              <span>{{ timeFormat(scope.row.time) }}</span>
            </template>
          </el-table-column>
          <el-table-column prop="payTime" label="支付时间" align="center">
            <template #default="scope">
              <span>{{ scope.row.payTime || "--" }}</span>
            </template>
          </el-table-column>
          <el-table-column prop="status" label="状态" align="center">
            <template #default="scope">
              <el-tag v-if="scope.row.status == '0'" type="danger" effect="plain">待付款</el-tag>
              <el-tag v-else-if="scope.row.status == '1'" type="warning" effect="plain">待收货</el-tag>
              <el-tag v-else type="success" effect="plain">已完成</el-tag>
            </template>
          </el-table-column>
          <el-table-column fixed="right" label="操作" width="150" align="center">
            <template #default="scope">
              <el-button type="danger" text bg size="small" @click="handleDelete(scope.row)">删除</el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <div class="pager-wrapper">
        <el-pagination
          background
          :layout="paginationData.layout"
          :page-sizes="paginationData.pageSizes"
          :total="paginationData.total"
          :page-size="paginationData.pageSize"
          :currentPage="paginationData.currentPage"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
        />
      </div>
    </el-card>
    <!-- 新增/修改 -->
  </div>
</template>

<style lang="scss" scoped>
.search-wrapper {
  margin-bottom: 20px;
  :deep(.el-card__body) {
    padding-bottom: 2px;
  }
}

.toolbar-wrapper {
  display: flex;
  justify-content: space-between;
  margin-bottom: 20px;
}

.table-wrapper {
  margin-bottom: 20px;
}

.pager-wrapper {
  display: flex;
  justify-content: flex-end;
}
</style>

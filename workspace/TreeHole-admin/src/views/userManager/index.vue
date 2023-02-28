<script lang="ts" setup>
import { reactive, ref, watch } from "vue"
import { createTableDataApi, deleteTableDataApi, updateTableDataApi, getTableDataApi } from "@/api/table"
import { type FormInstance, type FormRules, ElMessage, ElMessageBox } from "element-plus"
import { Search, Refresh, CirclePlus, Delete, Download, RefreshRight } from "@element-plus/icons-vue"
import { usePagination } from "@/hooks/usePagination"
import { GetUserApi, ModifyUserApi, AddUserApi, RemoveUserApi } from "@/api/user"
import { IUser } from "@/api/user/types/user"

const loading = ref<boolean>(false)
const { paginationData, handleCurrentChange, handleSizeChange } = usePagination()

//#region 增
const dialogVisible = ref<boolean>(false)
const formRef = ref<FormInstance | null>(null)
const formData = reactive<IUser>({
  account: "",
  password: "",
  name: "",
  location: "",
  role: "0",
  sex: "1",
  status: "1"
})
const formRules: FormRules = reactive({
  account: [{ required: true, trigger: "blur", message: "请输入账号" }],
  password: [{ required: true, trigger: "blur", message: "请输入密码" }],
  name: [{ required: true, trigger: "blur", message: "请输入用户名" }],
  location: [{ required: true, trigger: "blur", message: "请输入所在地区" }]
})
const handleCreate = () => {
  formRef.value?.validate(async (valid: boolean) => {
    if (valid) {
      if (currentUpdateId.value === undefined) {
        await AddUserApi(formData)
        ElMessage.success("新增成功")
        dialogVisible.value = false
        getTableData()
      } else {
        await ModifyUserApi({ _id: currentUpdateId.value, ...formData })
        ElMessage.success("修改成功")
        dialogVisible.value = false
        getTableData()
      }
    } else {
      return false
    }
  })
}
const resetForm = () => {
  currentUpdateId.value = undefined
  formData.account = ""
  formData.password = ""
  formData.name = ""
  formData.location = ""
  formData.role = "0"
  formData.sex = "1"
  formData.status = "1"
}
//#endregion

//#region 删
const handleDelete = (row: any) => {
  ElMessageBox.confirm(`正在删除用户：${row.account}，确认删除？`, "提示", {
    confirmButtonText: "确定",
    cancelButtonText: "取消",
    type: "warning"
  }).then(async () => {
    await RemoveUserApi({ _id: row._id })
    ElMessage.success("删除成功")
    getTableData()
  })
}
//#endregion

//#region 改
const currentUpdateId = ref<undefined | string>(undefined)
const handleUpdate = (row: any) => {
  currentUpdateId.value = row._id
  Object.keys(formData).forEach((key) => (formData[key] = row[key]))
  dialogVisible.value = true
}
//#endregion

//#region 查
const tableData = ref<any[]>([])
const searchFormRef = ref<FormInstance | null>(null)
const searchData = reactive({
  account: "",
  name: ""
})
const getTableData = async () => {
  loading.value = true
  const res = await GetUserApi({
    pageNo: paginationData.currentPage,
    limit: paginationData.pageSize,
    account: searchData.account || undefined,
    name: searchData.name || undefined
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
//#endregion

/** 监听分页参数的变化 */
watch([() => paginationData.currentPage, () => paginationData.pageSize], getTableData, { immediate: true })
</script>

<template>
  <div class="app-container">
    <el-card v-loading="loading" shadow="never" class="search-wrapper">
      <el-form ref="searchFormRef" :inline="true" :model="searchData">
        <el-form-item prop="account" label="账号">
          <el-input v-model="searchData.account" placeholder="请输入账号" />
        </el-form-item>
        <el-form-item prop="name" label="用户名">
          <el-input v-model="searchData.name" placeholder="请输入用户名" />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" :icon="Search" @click="handleSearch">查询</el-button>
          <el-button :icon="Refresh" @click="resetSearch">重置</el-button>
        </el-form-item>
      </el-form>
    </el-card>
    <el-card v-loading="loading" shadow="never">
      <div class="toolbar-wrapper">
        <el-button type="primary" :icon="CirclePlus" @click="dialogVisible = true">新增用户</el-button>
        <div>
          <el-tooltip content="刷新表格">
            <el-button type="primary" :icon="RefreshRight" circle @click="handleRefresh" />
          </el-tooltip>
        </div>
      </div>
      <div class="table-wrapper">
        <el-table :data="tableData">
          <el-table-column prop="account" label="账号" align="center" />
          <el-table-column prop="role" label="角色" align="center">
            <template #default="scope">
              <el-tag v-if="scope.row.role == 0" effect="plain">种植苗木用户</el-tag>
              <el-tag v-else-if="scope.row.role == 1" type="warning" effect="plain">收购苗木用户</el-tag>
              <el-tag v-else type="danger" effect="plain">管理员</el-tag>
            </template>
          </el-table-column>
          <el-table-column prop="name" label="用户名" align="center" />
          <el-table-column prop="location" label="地区" align="center" />
          <el-table-column prop="sex" label="性别" align="center">
            <template #default="scope">
              <el-tag v-if="scope.row.sex == 1" effect="plain">男</el-tag>
              <el-tag v-else type="danger" effect="plain">女</el-tag>
            </template>
          </el-table-column>
          <el-table-column prop="status" label="状态" align="center">
            <template #default="scope">
              <el-tag v-if="scope.row.status == 1" type="success" effect="plain">启用</el-tag>
              <el-tag v-else type="danger" effect="plain">禁用</el-tag>
            </template>
          </el-table-column>
          <el-table-column fixed="right" label="操作" width="150" align="center">
            <template #default="scope">
              <el-button type="primary" text bg size="small" @click="handleUpdate(scope.row)">修改</el-button>
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
    <el-dialog
      v-model="dialogVisible"
      :title="currentUpdateId === undefined ? '新增用户' : '修改用户'"
      @close="resetForm"
      width="30%"
    >
      <el-form ref="formRef" :model="formData" :rules="formRules" label-width="100px" label-position="left">
        <el-form-item prop="account" label="账号">
          <el-input v-model="formData.account" placeholder="请输入账号" />
        </el-form-item>
        <el-form-item prop="password" label="密码">
          <el-input v-model="formData.password" placeholder="请输入密码" type="password"/>
        </el-form-item>
        <el-form-item prop="name" label="用户名">
          <el-input v-model="formData.name" placeholder="请输入用户名" />
        </el-form-item>
        <el-form-item prop="location" label="地区">
          <el-input v-model="formData.location" placeholder="请输入所在地区：xx-xx 如：安徽-安庆" />
        </el-form-item>
        <el-form-item prop="role" label="角色">
          <el-radio-group v-model="formData.role" class="ml-4">
            <el-radio label="0" size="large">种植苗木用户</el-radio>
            <el-radio label="1" size="large">收购苗木用户</el-radio>
            <el-radio label="2" size="large">管理员</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item prop="sex" label="性别">
          <el-radio-group v-model="formData.sex" class="ml-4">
            <el-radio label="1" size="large">男</el-radio>
            <el-radio label="0" size="large">女</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item prop="status" label="状态">
          <el-switch
            v-model="formData.status"
            active-color="#13ce66"
            inactive-color="#ff4949"
            active-value="1"
            inactive-value="0"
          >
          </el-switch>
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" @click="handleCreate">确认</el-button>
      </template>
    </el-dialog>
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

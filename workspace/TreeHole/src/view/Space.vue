<!--
 * @Author: Akira
 * @Date: 2022-11-16 16:41:23
 * @LastEditTime: 2023-04-12 14:52:34
-->
<script setup>
import { regionData, provinceAndCityData, CodeToText, TextToCode } from "element-china-area-data";
import { computed, onMounted, reactive, ref, toRaw } from "vue-demi";
import { Edit, Delete } from "@element-plus/icons-vue";
import TreeCard from "../components/TreeCard.vue";
import { Plus } from "@element-plus/icons-vue";
import { local, defaultState } from "../util";
import { ElMessage } from "element-plus";
import { useRouter } from "vue-router";
import request from "../api/request";
import api from "../api";
import _ from "lodash";

const router = useRouter();

const form_user_Ref = ref();
const form_tree_Ref = ref();

// 表单规则
const form_user_Rules = {
  name: [{ required: true, message: "请输入姓名", trigger: "blur" }],
  location: [{ required: true, message: "请选择所在地区", trigger: "blur" }],
};
const form_tree_Rules = {
  title: [{ required: true, message: "请输入标题", trigger: "blur" }],
  describe: [{ required: true, message: "请输入描述", trigger: "blur" }],
  location: [{ required: true, message: "请选择所在地区", trigger: "blur" }],
  price: [{ required: true, message: "请输入价格", trigger: "blur" }],
  type: [{ required: true, message: "请输入苗木种类", trigger: "blur" }],
  height: [{ required: true, message: "请输入苗木高度", trigger: "blur" }],
  branchPoint: [{ required: true, message: "请输入苗木分支点", trigger: "blur" }],
  diameter: [{ required: true, message: "请输入苗木直径", trigger: "blur" }],
  crownDiameter: [{ required: true, message: "请输入苗木冠径", trigger: "blur" }],
  imgs: [{ required: true, trigger: "blur", message: "请至少上传一张图片" }],
};

const loginUser = local.getItem("user");
const spaceUser = history.state.spaceUser || loginUser;

const state = reactive({
  user: spaceUser,
  /** 分页 */
  infiniteScroll: false,
  treeList: [],
  pageNo: 1,
  limit: 4,
  /** 关注数 */
  followCount: 0,
  /** 粉丝数 */
  fansCount: 0,
  /** 是否关注 */
  isFollow: false,
  /** 用户弹出层 */
  dialog_user: false,
  form_user: { ...loginUser },
  /** 苗木弹出层 */
  dialog_tree: false,
  form_tree: { ...defaultState.tree },
  fileList: [],
  /** 预览图片 */
  dialog_previewImg: false,
  dialogImageUrl: "",
  dialogImageVisible: false,
  /** 更新苗木下标 */
  updateTreeIndex: undefined,
  /** 地区选择 */
  treeLocation: [],
  userLocation: [],
  isLoading: true,
});

/** 是否是当前用户 */
const isCurrentUser = computed(() => {
  return state.user._id == loginUser._id;
});

//#region 用户
/** 编辑用户个人信息 */
const editUserInfo = () => {
  state.dialog_user = true;
  state.form_user = { ...loginUser };
};

/** 更新用户信息 */
const updateUserInfo = async () => {
  await request.post(api.user.modifyById, state.form_user);
  /** 更新缓存 */
  ElMessage.success("用户信息更新成功");
  local.setItem("user", state.form_user);
  if (spaceUser) history.state.spaceUser = toRaw(state.form_user);
  state.dialog_user = false;
};

/**
 * 头像上传成功回调
 * @param {object} response
 * @param {file} uploadFile
 */
const handleAvatarSuccess = async (response, uploadFile) => {
  state.user.avator = response.data.url;
  await request.post(api.user.modifyById, toRaw(state.user));
  local.setItem("user", state.user);
  ElMessage.success("头像上传成功");
};

/** 跳转记录 */
const toRecord = (mode) => {
  if (isCurrentUser.value) router.push({ name: "Record", state: { mode } });
};

/** 关注 */
const handleFollow = async (fromUserID, toUserID) => {
  await request.post(api.follow.addFollow, { fromUserID, toUserID });
  await getCount(spaceUser._id);
  state.isFollow = !state.isFollow;
  ElMessage.success("关注成功！");
};

/** 取消关注 */
const handleUnFollow = async (fromUserID, toUserID) => {
  await request.post(api.follow.removeFollow, { fromUserID, toUserID });
  await getCount(spaceUser._id);
  state.isFollow = !state.isFollow;
  ElMessage.success("取消关注成功！");
};

//#endregion

//#region 苗木
/** 苗木高阔比计算 */
const updateHci = () => {
  const { form_tree } = state;
  form_tree.hci = parseFloat((parseInt(form_tree.height) / parseInt(form_tree.crownDiameter)).toFixed(2));
};

/** 发布苗木 */
const release = () => {
  state.dialog_tree = true;
  state.form_tree = { ...defaultState.tree };
  state.form_tree.imgs = [];
  state.treeLocation = [];
  state.fileList = [];
};

/** 地区选择器监听 */
const handleCascadarChange = (location, mode) => {
  if (mode == 0) state.form_user.location = `${CodeToText[location[0]]}-${CodeToText[location[1]]}`;
  else state.form_tree.location = `${CodeToText[location[0]]}-${CodeToText[location[1]]}-${CodeToText[location[2]]}`;
};

/** 更新/发布 苗木信息 */
const updateTreeInfo = async () => {
  if (state.form_tree._id == "") {
    /** 发布 */
    delete state.form_tree._id;
    delete state.form_tree.time;
    state.form_tree.ownerID = loginUser._id;
    /** 更新 hci */
    updateHci();
    const { tree } = await request.post(api.tree.addTree, state.form_tree);
    tree.owner = loginUser;
    state.dialog_tree = false;
    /** 更新缓存 */
    state.treeList.unshift(tree);
    /** 数据重置 */
    state.form_tree = { ...defaultState.tree };
    ElMessage.success("发布成功");
  } else {
    /** 编辑 */
    updateHci();
    await request.post(api.tree.modifyById, state.form_tree);
    state.dialog_tree = false;
    state.form_tree = { ...defaultState.tree };
    ElMessage.success("编辑成功");
  }
};

/**
 * 图片上传之前回调
 * @param {file} rawFile
 */
const beforeImageUpload = (rawFile) => {
  if (["image/jpeg", "image/png"].indexOf(rawFile.type) == -1) {
    /** 图片资源格式验证 */
    ElMessage.error("Picture must be JPG/PNG format!");
    return false;
  } else if (rawFile.size / 1024 / 1024 > 5) {
    /** 图片大小限制 */
    ElMessage.error("Picture size can not exceed 5MB!");
    return false;
  }
  return true;
};

/** 图片预览 */
const handleImagePreview = (uploadFile) => {
  state.dialogImageUrl = uploadFile.url;
  state.dialogImageVisible = true;
};

/** 图片删除前 */
const handleBeforeRemove = async (uploadFile, uploadFiles) => {
  const index = state.fileList.findIndex((item) => item.name == uploadFile.name);
  if (index == -1) return false;
  await request.post(api.uploadCenter.remove, { filename: state.form_tree.imgs[index].name });
  state.form_tree.imgs.splice(index, 1);
  return true;
};

/** 图片上传成功 */
const handleSuccess = (response, uploadFile, uploadFiles) => {
  if (response.data) state.form_tree.imgs.push(response.data);
};

/**
 * 下拉菜单回调
 * @param {object} command { mode: xx, index: xx }
 */
const handleCommand = async (command) => {
  const tree = state.treeList[command.index];
  const loc = tree.location.split("-");
  state.treeLocation = [TextToCode[loc[0]].code, TextToCode[loc[0]][loc[1]].code, TextToCode[loc[0]][loc[1]][loc[2]].code];
  if (command.mode == 0) {
    /** 编辑 */
    if (tree.status > 0) {
      ElMessage.error("苗木正在交易或交易完成，无法编辑");
      return;
    }
    state.dialog_tree = true;
    state.form_tree = tree;
    state.fileList = _.cloneDeep(tree.imgs);
  } else {
    /** 删除 */
    if (tree.status == 1) {
      ElMessage.error("苗木正在交易中，无法删除");
      return;
    }
    await request.post(api.tree.removeById, { _id: tree._id });
    const filename = tree.imgs.map((item) => {
      return item.name;
    });
    if (filename.length == 1) await request.post(api.uploadCenter.remove, { filename: filename[0] });
    else if (filename.length > 1) await request.post(api.uploadCenter.remove, { filename });
    state.treeList.splice(command.index, 1);
    ElMessage.success("删除成功");
  }
};

/**
 * 下拉菜单回调传递参数
 * @param {number} mode 0：修改 1：删除
 * @param {object} index 苗木索引值
 * @returns { mode, index}
 */
const beforeHandleCommand = (mode, index) => {
  return { mode, index };
};

/**
 * 提交并校验 表单
 * - mode
 *    - 0: 苗木表单
 *    - 1: 用户表单
 * @param {object} formRef
 * @param {number} mode
 */
const submitForm = async (formRef, mode) => {
  if (!formRef) return;
  await formRef.validate((valid, fields) => {
    if (valid) {
      if (mode == 0) updateTreeInfo();
      else if (mode == 1) updateUserInfo();
    }
  });
};

/**
 * 获取树列表
 */
const getTreeList = async () => {
  const { pageNo, limit } = state;
  const userID = state.user._id;
  const baseStatus = isCurrentUser.value ? -1 : 0;
  const { list } = await request.post(api.tree.getTreeListByUserID, { userID, pageNo, limit, baseStatus });
  if (list.length < limit) state.infiniteScroll = true;
  state.treeList.push(...list);
  state.pageNo++;
};

const getCount = async (userID) => {
  const { followCount, fansCount } = await request.post(api.follow.getFollowCount, { userID });
  state.followCount = followCount;
  state.fansCount = fansCount;
};

const isEmpty = computed(() => {
  return state.treeList.length == 0;
});

onMounted(async () => {
  try {
    await getCount(spaceUser._id);
    /** 非当前用户是否关注 */
    if (!isCurrentUser.value) state.isFollow = await request.post(api.follow.isFollow, { fromUserID: loginUser._id, toUserID: spaceUser._id });
    /** 获取苗木列表 */
    await getTreeList();
    /** 地区 */
    const loc = state.user.location.split("-");
    state.userLocation = [TextToCode[loc[0]]?.code, TextToCode[loc[0]][loc[1]]?.code];
  } catch (error) {
    ElMessage.error(error.message);
  }
  setTimeout(() => {
    state.isLoading = false;
  }, 500);
});
</script>

<template>
  <div class="container scroll" v-infinite-scroll="getTreeList" infinite-scroll-immediate="false" :infinite-scroll-disabled="state.infiniteScroll">
    <!-- 个人空间-顶部 -->
    <div class="container__top">
      <!-- 封面 -->
      <div class="top__cover"></div>
      <!-- 用户信息 -->
      <div class="top__user">
        <div class="user_info">
          <span class="user__name">{{ state.user.name }}</span>
          <div class="btnOption">
            <el-button class="editUserInfo" v-if="isCurrentUser" @click="editUserInfo">编辑个人资料</el-button>
            <div class="unFollow btn" @click="handleUnFollow(loginUser._id, spaceUser._id)" v-if="!isCurrentUser && state.isFollow">取消关注</div>
            <div class="unFollow btn" @click="handleFollow(loginUser._id, spaceUser._id)" v-if="!isCurrentUser && !state.isFollow">关注</div>
          </div>
        </div>
        <!-- 个人记录 关注 粉丝 -->
        <div class="user__record">
          <div class="record__item" @click="toRecord(0)">
            <span class="item__count">{{ state.followCount }}</span>
            <span class="item__type">关注</span>
          </div>
          <div class="record__item" @click="toRecord(1)">
            <span class="item__count">{{ state.fansCount }}</span>
            <span class="item__type">粉丝</span>
          </div>
        </div>
      </div>
      <!-- 头像 -->
      <el-upload class="avatar-uploader" action="/api/uploadCenter/upload" :show-file-list="false" :on-success="handleAvatarSuccess" :before-upload="beforeImageUpload" :disabled="!isCurrentUser">
        <img class="avator" :src="state.user.avator" />
      </el-upload>
    </div>
    <!-- 主体-树列表 -->
    <div class="container__main" v-loading="state.isLoading">
      <!-- 发布 -->
      <div class="release" v-if="isCurrentUser" @click="release">发布🙌</div>
      <el-empty description="他好像没有发布苗木~" v-if="isEmpty" />
      <!-- 苗木卡片 -->
      <TreeCard v-for="(item, index) in state.treeList" :key="item._id" :tree="item">
        <el-button v-if="isCurrentUser" :icon="Edit" circle @click="handleCommand(beforeHandleCommand(0, index))" />
        <el-button v-if="isCurrentUser" :icon="Delete" circle @click="handleCommand(beforeHandleCommand(1, index))" />
      </TreeCard>
    </div>
    <!-- 苗木 对话框 -->
    <el-dialog class="treeDialog" title="苗木信息" v-model="state.dialog_tree" width="40%" align-center v-if="isCurrentUser">
      <el-scrollbar height="65vh">
        <!-- 苗木表单 -->
        <el-form class="treeForm" :model="state.form_tree" ref="form_tree_Ref" :rules="form_tree_Rules" label-width="100px" label-position="left">
          <el-form-item label="地区" prop="location">
            <el-cascader v-model="state.treeLocation" placeholder="请选择所在地区" :options="regionData" @change="handleCascadarChange($event, 1)"> </el-cascader>
          </el-form-item>
          <el-form-item label="标题" prop="title">
            <el-input v-model="state.form_tree.title" />
          </el-form-item>
          <el-form-item label="描述" prop="describe">
            <el-input v-model="state.form_tree.describe" :rows="2" type="textarea" />
          </el-form-item>
          <el-form-item label="价格(元)" prop="price">
            <el-input v-model="state.form_tree.price" />
          </el-form-item>
          <el-form-item label="苗木种类" prop="type">
            <el-input v-model="state.form_tree.type" />
          </el-form-item>
          <el-form-item label="高度(cm)" prop="height">
            <el-input v-model="state.form_tree.height" />
          </el-form-item>
          <el-form-item label="冠径(cm)" prop="crownDiameter">
            <el-input v-model="state.form_tree.crownDiameter" />
          </el-form-item>
          <el-form-item label="分支点(cm)" prop="branchPoint">
            <el-input v-model="state.form_tree.branchPoint" />
          </el-form-item>
          <el-form-item label="直径(cm)" prop="diameter">
            <el-input v-model="state.form_tree.diameter" />
          </el-form-item>
          <el-form-item label="图片" prop="imgs">
            <el-upload v-model:file-list="state.fileList" action="/api/uploadCenter/upload" list-type="picture-card" :on-preview="handleImagePreview" :before-remove="handleBeforeRemove" :before-upload="beforeImageUpload" :on-success="handleSuccess">
              <el-icon><Plus /></el-icon>
            </el-upload>
            <el-dialog v-model="state.dialogImageVisible">
              <img w-full :src="state.dialogImageUrl" alt="Preview Image" style="width: 100%" />
            </el-dialog>
          </el-form-item>
        </el-form>
      </el-scrollbar>
      <!-- 底部操作按钮 -->
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="state.dialog_tree = false">取消</el-button>
          <el-button type="primary" @click="submitForm(form_tree_Ref, 0)">保存</el-button>
        </span>
      </template>
    </el-dialog>
    <!-- 用户信息对话框 -->
    <el-dialog title="用户信息" v-model="state.dialog_user" align-center v-if="isCurrentUser" width="40%">
      <!-- 用户表单 -->
      <el-form :model="state.form_user" label-width="auto" ref="form_user_Ref" :rules="form_user_Rules">
        <el-form-item label="账号" prop="account">
          <el-input v-model="state.form_user.account" autocomplete="off" disabled />
        </el-form-item>
        <el-form-item label="用户名" prop="name">
          <el-input v-model="state.form_user.name" />
        </el-form-item>
        <el-form-item label="地区" prop="location">
          <el-cascader v-model="state.userLocation" placeholder="请选择所在地区" :options="provinceAndCityData" @change="handleCascadarChange($event, 0)"> </el-cascader>
        </el-form-item>
        <el-form-item label="性别">
          <el-radio-group v-model="state.form_user.sex">
            <el-radio :label="'0'">🤦‍♀️</el-radio>
            <el-radio :label="'1'">🤦‍♂️</el-radio>
          </el-radio-group>
        </el-form-item>
      </el-form>
      <!-- 底部操作按钮 -->
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="state.dialog_user = false">取消</el-button>
          <el-button type="primary" @click="submitForm(form_user_Ref, 1)">保存</el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<style lang="less" scoped>
//color
@defaultColor: rgb(155, 161, 166);
@activeColor: rgb(94, 161, 97);

// calc sidebar topbar
@sidebar_width: 65px;
@topbar_height: 75px;

.flex__column {
  display: flex;
  flex-direction: column;
}
.flex__row {
  display: flex;
  flex-direction: row;
}

.btn {
  font-size: 14px;
  padding: 10px;
  border-radius: 8px;
  transition: all 0.3s;
  cursor: pointer;
}

.container {
  height: calc(100vh - @topbar_height);
  overflow-y: overlay;
  position: relative;
  :deep(.el-dialog) {
    .treeForm {
      margin-right: 20px;
    }
    .el-row {
      // gap: 10px;
    }
    .el-col {
      margin-bottom: 20px;
    }
  }

  .container__top {
    .flex__column();
    height: 300px;
    position: relative;
    .top__cover {
      width: 100%;
      height: 70%;
      background: url("../assets/spaceBack.png");
      background-position: bottom;
      background-repeat: no-repeat;
      background-attachment: fixed;
      background-size: cover;
    }
    .top__user {
      .flex__row();
      flex: 1;
      justify-content: space-between;
      align-items: center;
      margin-left: calc(2.5vw + 130px);
      .user_info {
        .flex__column();
        align-items: center;
        gap: 10px;
        .user__name {
          font-size: 20px;
          font-weight: bold;
          padding-top: 15px;
          align-self: flex-start;
        }
        .btnOption {
          gap: 10px;
          .flex__row();
          .editUserInfo {
            bottom: 10px;
          }
          .unFollow {
            color: @activeColor;
            background-color: rgba(94, 161, 97, 0.11);
            &:hover {
              color: white;
              background-color: @activeColor;
            }
          }
          .message {
            color: black;
            background-color: rgba(164, 179, 165, 0.144);
          }
        }
      }
      .user__record {
        .flex__row();
        margin-right: 4.167vw;
        cursor: pointer;
        .record__item {
          .flex__column();
          align-items: center;
          margin: 0 20px;
          .item__count {
            font-size: 20px;
            font-weight: 500;
            padding: 10px;
          }
          .item__type {
            font-size: 13px;
            color: @defaultColor;
          }
        }
      }
    }
    .avator {
      width: 100px;
      border-radius: 100px;
      border: 2px solid white;
      position: absolute;
      bottom: 0.833vw;
      left: 2.5vw;
    }
    .avatar-uploader {
      .el-upload {
        border: 1px dashed var(--el-border-color-darker);
        border-radius: 6px;
        cursor: pointer;
        position: relative;
        overflow: hidden;
        transition: var(--el-transition-duration-fast);
      }
      .el-upload:hover {
        border-color: var(--el-color-primary);
      }
      .el-icon.avatar-uploader-icon {
        font-size: 28px;
        color: #8c939d;
        width: 100px;
        height: 100px;
        text-align: center;
      }
    }
  }
  .container__main {
    .flex__column();
    gap: 5px;
    align-items: center;
    background-color: rgb(241, 242, 243);
    padding: 5px 265px;
    min-height: calc(100vh - 376px);
    position: relative;
    .el-dropdown-link {
      cursor: pointer;
    }
    .icon-gengduo {
      font-weight: bold;
    }
    .release {
      position: absolute;
      top: 20px;
      right: 40px;
      padding: 12px;
      border-radius: 10px;
      background-color: @activeColor;
      color: white;
      cursor: pointer;
      transition: all 0.2s;
      &:hover {
        transform: scale(1.05);
      }
    }
  }
}
</style>

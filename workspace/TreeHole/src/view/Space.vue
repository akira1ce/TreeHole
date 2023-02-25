<!--
 * @Author: Akira
 * @Date: 2022-11-16 16:41:23
 * @LastEditTime: 2023-02-25 19:34:57
-->
<script setup>
import api from "../api";
import request from "../api/request";
import { computed, nextTick, onMounted, reactive, ref, toRaw } from "vue-demi";
import { local, defaultState, recordHandle } from "../util";
import TreeCard from "../components/TreeCard.vue";
import { Edit, Delete } from "@element-plus/icons-vue";
import { useRouter } from "vue-router";
import { ElMessage } from "element-plus";
import { Plus } from "@element-plus/icons-vue";

const router = useRouter();

const form_user_Ref = ref();
const form_tree_Ref = ref();
const imgUploadRef = ref();

// 表单规则
const form_user_Rules = {
  name: [
    { required: true, message: "请输入姓名", trigger: "blur" },
    { min: 3, max: 18, message: "Length should be 3 to 18", trigger: "blur" },
  ],
  location: [
    { required: true, message: "请输入地区：xx(省)-xx(市) 如：安徽-安庆", trigger: "blur" },
    { min: 5, max: 10, message: "Length should be 5 to 10", trigger: "blur" },
  ],
};
const form_tree_Rules = {
  title: [
    { required: true, message: "请输入标题", trigger: "blur" },
    { min: 1, max: 20, message: "Length should be 1 to 20", trigger: "blur" },
  ],
  describe: [
    { required: true, message: "请输入描述", trigger: "blur" },
    { min: 5, max: 200, message: "Length should be 5 to 200", trigger: "blur" },
  ],
  location: [
    { required: true, message: "请输入地区：xx(省)xx(市)xx(县)xx(镇) 如：安徽省安庆市怀宁县金拱镇", trigger: "blur" },
    { min: 3, max: 20, message: "Length should be 3 to 20", trigger: "blur" },
  ],
  price: [
    { required: true, message: "请输入价格", trigger: "blur" },
    { min: 2, max: 5, message: "Length should be 2 to 5", trigger: "blur" },
  ],
  type: [
    { required: true, message: "请输入苗木种类", trigger: "blur" },
    { min: 1, max: 4, message: "Length should be 1 to 4", trigger: "blur" },
  ],
  height: [
    { required: true, message: "请输入苗木高度", trigger: "blur" },
    { min: 2, max: 4, message: "Length should be 2 to 4", trigger: "blur" },
  ],
  branchPoint: [
    { required: true, message: "请输入苗木分支点", trigger: "blur" },
    { min: 2, max: 4, message: "Length should be 2 to 4", trigger: "blur" },
  ],
  diameter: [
    { required: true, message: "请输入苗木直径", trigger: "blur" },
    { min: 2, max: 4, message: "Length should be 2 to 4", trigger: "blur" },
  ],
  crownDiameter: [
    { required: true, message: "请输入苗木冠径", trigger: "blur" },
    { min: 2, max: 4, message: "Length should be 2 to 4", trigger: "blur" },
  ],
};

const loginUser = local.getItem("user");
const spaceUser = history.state.spaceUser;

const state = reactive({
  user: spaceUser || loginUser,
  record: defaultState.record,
  loginRecord: defaultState.record,
  infiniteScroll: false,
  treeList: [],
  // 分页
  pageNo: 1,
  limit: 4,
  isFollow: false,
  // 弹出层
  dialog_user: false,
  dialog_tree: false,
  dialog_previewImg: false,
  form_user: { ...loginUser },
  form_tree: { ...defaultState.tree },
  updateTreeIndex: undefined,
  previewImgUrl: "",
  isEmpty: false,
});

// [methods]
/**
 * 编辑用户个人信息
 */
const editUserInfo = () => {
  state.dialog_user = true;
  state.form_user = { ...loginUser };
};

/**
 * 更新用户信息
 */
const updateUserInfo = async () => {
  // 验证地区格式
  if (state.form_user.location.split("-").length != 2) {
    ElMessage.error("地区格式有误，正确格式：xx(省)-xx(市) 如：安徽-安庆");
    return;
  }
  await request.post(api.user.modifyById, state.form_user);
  // 更新缓存
  ElMessage.success("用户信息更新成功");
  local.setItem("user", state.form_user);
  state.dialog_user = false;
};

/**
 * 头像上传成功回调
 * @param {object} response
 * @param {file} uploadFile
 */
const handleAvatarSuccess = async (response, uploadFile) => {
  state.user.avator = response.message;
  await request.post(api.user.modifyById, toRaw(state.user));
  local.setItem("user", state.user);
  ElMessage.success("头像上传成功");
};

/**
 * 头像上传成功之前回调
 * @param {file} rawFile
 */
const beforeAvatarUpload = (rawFile) => {
  if (rawFile.type !== "image/jpeg") {
    // 图片资源格式验证
    ElMessage.error("Avatar picture must be JPG format!");
    return false;
  } else if (rawFile.size / 1024 / 1024 > 2) {
    // 图片大小限制
    ElMessage.error("Avatar picture size can not exceed 2MB!");
    return false;
  }
  return true;
};

/**
 * 苗木高阔比计算
 */
const updateHci = () => {
  const { form_tree } = state;
  form_tree.hci = parseFloat((parseInt(form_tree.height) / parseInt(form_tree.crownDiameter)).toFixed(2))
};
/**
 * 发布苗木
 */
const release = () => {
  state.dialog_tree = true;
  state.form_tree = { ...defaultState.tree };
};

/**
 * 更新/发布 苗木信息
 */
const updateTreeInfo = async () => {
  if (state.form_tree._id == "") {
    // 发布
    delete state.form_tree._id;
    delete state.form_tree.time;
    // 更新 hci
    updateHci();
    const { tree } = await request.post(api.tree.addTree, state.form_tree);
    tree.owner = state.user;
    state.dialog_tree = false;
    // 更新缓存
    state.treeList.unshift(tree);
    // 数据重置
    state.form_tree = defaultState.tree;
    ElMessage.success("发布成功");
  } else {
    // 编辑
    updateHci();
    await request.post(api.tree.modifyById, state.form_tree);
    state.dialog_tree = false;
    state.form_tree = defaultState.tree;
    ElMessage.success("编辑成功");
  }
};

/**
 * 手动上传苗木图片
 */
const submitImageUpload = async () => {
  await imgUploadRef.value.submit();
};

/**
 * 苗木图片上传成功回调
 * @param {object} response
 * @param {file} uploadFile
 */
const handleImageSuccess = async (response, uploadFile) => {
  state.form_tree.imgs.push(response.message);
};

/**
 * 苗木图片上传成功之前回调
 * @param {file} rawFile
 */
const beforeImageUpload = (rawFile) => {
  if (["image/jpeg", "image/png"].indexOf(rawFile.type) == -1) {
    // 图片资源格式验证
    ElMessage.error("Picture must be JPG/PNG format!");
    return false;
  } else if (rawFile.size / 1024 / 1024 > 5) {
    // 图片大小限制
    ElMessage.error("Picture size can not exceed 5MB!");
    return false;
  }
  return true;
};

/**
 * 移除苗木图片
 * @param {number} index
 */
const removeImg = (index) => {
  state.form_tree.imgs.splice(index, 1);
};

/**
 * 预览苗木图片
 * @param {string} imgUrl
 */
const previewImg = (imgUrl) => {
  state.dialog_previewImg = true;
  state.previewImgUrl = imgUrl;
};

/**
 * 下拉菜单回调
 * @param {object} command { mode: xx, index: xx }
 */
const handleCommand = async (command) => {
  const tree = state.treeList[command.index];
  if (command.mode == 0) {
    // 编辑
    if (tree.status > 0) {
      ElMessage.error("苗木正在交易或交易完成，无法编辑");
      return;
    }
    state.dialog_tree = true;
    state.form_tree = tree;
  } else {
    // 删除
    if (tree.status == 1) {
      ElMessage.error("苗木正在交易中，无法删除");
      return;
    }
    await request.post(api.tree.removeById, { _id: tree._id });
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
 * 收藏
 * @param {string} treeID
 */
const collectHandle = (tree) => {
  recordHandle.collect(state.record, loginUser._id, tree._id);
};

/**
 * 跳转记录
 */
const toRecord = (mode) => {
  if (isCurrentUser.value) router.push({ name: "Record", state: { mode } });
};

/**
 * 关注/取消关注
 */
const followHandle = async (userID1, userID2) => {
  recordHandle.follow(state.loginRecord, userID1, userID2);

  // 更新缓存
  const { fans } = state.record;
  const index = fans.indexOf(loginUser._id);

  if (index == -1) fans.push(loginUser._id);
  else fans.splice(index, 1);
  state.isFollow = !state.isFollow;
};

/**
 * 获取树列表
 */
const getTreeList = async () => {
  const { pageNo, limit } = state;
  const userID = state.user._id;
  if (userID) {
    const trees = await request.post(api.tree.getTreeListByUserID, { userID, pageNo, limit });
    if (trees.length < limit) state.infiniteScroll = true;
    state.treeList.push(...trees);
    state.pageNo++;
  }
};

// [computed]
const record = computed(() => state.record);

// 是否是当前用户
const isCurrentUser = computed(() => {
  return state.user._id == loginUser._id;
});

onMounted(async () => {
  if (loginUser._id != state.user._id) state.loginRecord = await request.post(api.record.getRecordByUserID, { userID: loginUser._id });
  state.record = await request.post(api.record.getRecordByUserID, { userID: state.user._id });
  if (!isCurrentUser.value) state.isFollow = state.record.fans.indexOf(loginUser._id) != -1;
  await getTreeList();
  if (state.treeList.length == 0) state.isEmpty = true;
});
</script>

<template>
  <div class="container scroll" v-infinite-scroll="getTreeList" infinite-scroll-immediate="false" :infinite-scroll-disabled="state.infiniteScroll">
    <el-dialog v-model="state.dialog_previewImg">
      <img w-full :src="state.previewImgUrl" alt="Preview Image" />
    </el-dialog>
    <!-- 苗木 对话框 -->
    <el-dialog class="treeDialog" title="苗木信息" v-model="state.dialog_tree" align-center>
      <el-scrollbar height="65vh">
        <!-- 苗木表单 -->
        <el-form class="treeForm" :model="state.form_tree" label-width="auto" ref="form_tree_Ref" :rules="form_tree_Rules">
          <el-form-item label="标题" prop="title">
            <el-input v-model="state.form_tree.title" />
          </el-form-item>
          <el-form-item label="描述" prop="describe">
            <el-input v-model="state.form_tree.describe" :rows="2" type="textarea" />
          </el-form-item>
          <el-form-item label="地区" prop="location">
            <el-input v-model="state.form_tree.location" />
          </el-form-item>
          <el-form-item label="价格(元)" prop="price">
            <el-input v-model="state.form_tree.price" />
          </el-form-item>
          <el-form-item label="苗木种类" prop="type">
            <el-input v-model="state.form_tree.type" />
          </el-form-item>
          <el-form-item label="基本信息">
            <el-row>
              <el-col :span="12">
                <el-form-item label="高度(cm)" prop="height">
                  <el-input v-model="state.form_tree.height" />
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="冠径(cm)" prop="crownDiameter">
                  <el-input v-model="state.form_tree.crownDiameter" />
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="分支点(cm)" prop="branchPoint">
                  <el-input v-model="state.form_tree.branchPoint" />
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="直径(cm)" prop="diameter">
                  <el-input v-model="state.form_tree.diameter" />
                </el-form-item>
              </el-col>
            </el-row>
          </el-form-item>
          <el-form-item label="图片" prop="imgs">
            <div class="form_item_imgs">
              <div class="imgList">
                <div class="imgList_item" v-for="(item, index) in state.form_tree.imgs" :key="item">
                  <img class="item_img" :src="item" />
                  <div class="item_options">
                    <div class="options_previewImg" @click="previewImg(item)"><i class="iconfont icon-fangda"></i></div>
                    <div class="options_removeImg" @click="removeImg(index)"><i class="iconfont icon-lajitong"></i></div>
                  </div>
                </div>
              </div>
              <el-upload ref="imgUploadRef" class="imgUpload" action="/api/uploadCenter/upload" :before-upload="beforeImageUpload" :on-success="handleImageSuccess" :auto-upload="false">
                <template #trigger>
                  <el-button type="primary">select file</el-button>
                </template>
                <el-button style="margin-left: 10px" type="success" @click="submitImageUpload"> upload to server </el-button>
                <template #tip>
                  <div class="el-upload__tip">jpg/png files with a size less than 5M</div>
                </template>
              </el-upload>
            </div>
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
    <el-dialog title="用户信息" v-model="state.dialog_user" align-center>
      <!-- 用户表单 -->
      <el-form :model="state.form_user" label-width="auto" ref="form_user_Ref" :rules="form_user_Rules">
        <el-form-item label="账号" prop="account">
          <el-input v-model="state.form_user.account" autocomplete="off" disabled />
        </el-form-item>
        <el-form-item label="用户名" prop="name">
          <el-input v-model="state.form_user.name" />
        </el-form-item>
        <el-form-item label="地区" prop="location">
          <el-input v-model="state.form_user.location" />
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
            <div class="unFollow btn" @click="followHandle(loginUser._id, spaceUser._id)" v-if="!isCurrentUser">{{ state.isFollow ? "取消关注" : "关注" }}</div>
          </div>
        </div>
        <!-- 个人记录 关注 粉丝 -->
        <div class="user__record">
          <div class="record__item" @click="toRecord(0)">
            <span class="item__count">{{ record.following?.length || "-" }}</span>
            <span class="item__type">关注</span>
          </div>
          <div class="record__item" @click="toRecord(1)">
            <span class="item__count">{{ record.fans?.length || "-" }}</span>
            <span class="item__type">粉丝</span>
          </div>
        </div>
      </div>
      <!-- 头像 -->
      <el-upload class="avatar-uploader" action="/api/uploadCenter/upload" :show-file-list="false" :on-success="handleAvatarSuccess" :before-upload="beforeAvatarUpload" :disabled="!isCurrentUser">
        <img :src="state.user.avator || 'https://bpic.51yuansu.com/pic3/cover/01/69/80/595f67c042c1b_610.jpg?x-oss-process=image/resize,w_260/sharpen,100'" class="avator" />
      </el-upload>
    </div>
    <!-- 主体-树列表 -->
    <div class="container__main">
      <!-- 发布 -->
      <div class="release" v-if="isCurrentUser" @click="release">发布🙌</div>
      <el-empty description="他好像没有发布苗木~" v-if="state.isEmpty" />
      <!-- 苗木卡片 -->
      <TreeCard v-for="(item, index) in state.treeList" :key="item._id" :tree="item" :record="state.loginRecord" :collectHandle="collectHandle">
        <el-button v-if="isCurrentUser" :icon="Edit" circle @click="handleCommand(beforeHandleCommand(0, index))" />
        <el-button v-if="isCurrentUser" :icon="Delete" circle @click="handleCommand(beforeHandleCommand(1, index))" />
      </TreeCard>
    </div>
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
    border-radius: 18px;
    .el-dialog__body {
      img {
        width: 100%;
      }
    }
    .treeForm {
      margin-right: 20px;
    }
    .el-col {
      margin-bottom: 20px;
    }
    .form_item_imgs {
      .flex__column();
      gap: 10px;
      .imgList {
        .flex__row();
        gap: 10px;
        .imgList_item {
          position: relative;
          height: fit-content;
          .item_img {
            height: 100px;
            min-width: 100px;
          }
          .item_options {
            .flex__row();
            justify-content: center;
            gap: 10px;
            align-items: center;
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100px;
            background-color: rgba(0, 0, 0, 0.5);
            opacity: 0;
            transition: all 0.3s;
            color: white;
            &:hover {
              opacity: 1;
            }
            .options_previewImg,
            .options_removeImg {
              cursor: pointer;
              .iconfont {
                font-size: 22px;
              }
            }
          }
        }
      }
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
    align-items: center;
    background-color: rgb(241, 242, 243);
    padding: 0 265px;
    min-height: calc(100vh - 395px);
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

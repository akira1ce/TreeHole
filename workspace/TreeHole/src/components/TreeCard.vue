<script setup>
import { defineProps } from "vue-demi";

const props = defineProps(["tree", "user", "switchFollow"]);
const { tree, user, switchFollow } = props;
</script>

<template>
  <el-card class="treeCard" shadow="hover">
    <div class="treeCard__header">
      <div class="header__left">
        <img class="header__avator" :src="user.avator" />
        <div class="header__info">
          <span class="info__name">{{ user.name }}</span>
          <span class="info__time">{{
            tree.time.split(" ")[0].substring(5).split("/").join("-")
          }}</span>
        </div>
      </div>
      <div class="header__right">
        <div class="unFollow" @click="switchFollow">
          {{ user.isFollow ? "取消关注" : "关注" }}
        </div>
      </div>
    </div>
    <div class="treeCard__main">
      <div class="main__describe">
        {{ tree.describe }}
      </div>
      <div class="main__imgList">
        <photo-provider>
          <photo-consumer
            v-for="src in tree.imgs"
            :intro="src"
            :key="src"
            :src="src"
          >
            <img :src="src" class="view-box" />
          </photo-consumer>
        </photo-provider>
      </div>
    </div>
  </el-card>
</template>

<style lang="less" scoped>
//font
@defaultFont: PingFang SC, Microsoft YaHei;

//color
@defaultColor: rgb(241, 242, 243);
@deepDefaultColor: rgb(227, 229, 231);
@activeColor: rgb(94, 161, 97);

.flex__column {
  display: flex;
  flex-direction: column;
}
.flex__row {
  display: flex;
  flex-direction: row;
}

.treeCard {
  border-radius: 5px;
  margin: 5px 0;
  .treeCard__header {
    .flex__row();
    justify-content: space-between;
    align-items: center;
    .header__left {
      .flex__row();
      .header__avator {
        width: 36px;
        margin-right: 12px;
        border-radius: 36px;
        cursor: pointer;
      }
      .header__info {
        .flex__column();
        .info__name {
          font-size: 16px;
          font-weight: bold;
          margin-bottom: 10px;
          color: @activeColor;
          cursor: pointer;
        }
        .info__time {
          color: rgb(150, 152, 153);
          font-size: 12px;
        }
      }
    }
    .header__right {
      .unFollow {
        font-size: 14px;
        padding: 10px;
        color: @activeColor;
        cursor: pointer;
        background-color: rgba(94, 161, 97, 0.11);
        border-radius: 8px;
        transition: all 0.3s;
        &:hover {
          color: white;
          background-color: @activeColor;
        }
      }
    }
  }
  .treeCard__main {
    .flex__column();
    .main__describe {
      padding: 15px 0;
      font-size: 16px;
      user-select: text;
    }
    .main__imgList {
      .view-box {
        padding: 2px;
        width: 180px;
        cursor: pointer;
      }
    }
  }
}
</style>

<script setup>
const props = defineProps(["tree"]);
const { tree } = props;
</script>

<template>
  <div class="card">
    <div class="card__tree">
      <div class="tree__cover">
        <img :src="tree.imgs[0]" />
      </div>
      <div class="tree__info">
        <span class="info__title">{{ tree.title }}</span>
        <span class="info__describe">{{ tree.describe }}</span>
      </div>
      <div class="tree__options">
        <span class="options__price">￥{{ tree.price }}</span>
        <el-button type="warning" round>立即购买</el-button>
      </div>
    </div>
    <div class="card__tips">look here 👀</div>
  </div>
</template>

<style lang="less" scoped>
.flex__column {
  display: flex;
  flex-direction: column;
}
.flex__row {
  display: flex;
  flex-direction: row;
}
.card {
  .flex__column();
  align-items: center;
  width: 500px;
  max-height: 155px;
  font-family: inherit;
  position: absolute;
  left: 50%;
  top: -145px;
  transform: translateX(-50%);
  transition: all 0.5s;
  &:hover {
    top: 20px;
  }
  .card__tips {
    padding-top: 20px;
  }
  .card__tree {
    .flex__row();
    gap: 10px;
    padding: 20px;
    border-radius: 10px;
    background-color: white;
    .tree__cover {
      img {
        width: 180px;
      }
    }
    .tree__info {
      .flex__column();
      flex: 1;
      gap: 10px;
      justify-content: flex-start;
      font-size: 18px;
      .info__describe {
        font-size: 16px;
        color: grey;
      }
    }
    .tree__options {
      .flex__column();
      align-items: center;
      justify-content: space-between;
      .options__price {
        font-weight: bold;
        color: rgb(255, 75, 75);
      }
    }
  }
}
</style>

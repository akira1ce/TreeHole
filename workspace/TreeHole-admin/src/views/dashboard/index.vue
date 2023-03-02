<!--
 * @Author: Akira
 * @Date: 2023-02-22 13:55:42
 * @LastEditTime: 2023-03-02 10:42:49
-->
<script lang="ts" setup>
import { onMounted, ref } from "vue"
import { GetDataAnalyseApi } from "@/api/order"
import * as echarts from "echarts"

const userCount = ref<number>(0)
const treeCount = ref<number>(0)
const orderCount = ref<number>(0)
const weeklyCount = ref<number>(0)

const weeklyVolume = ref<number[]>([])
const popularType = ref<{ name: string; value: number }[]>([])

type EChartsOption = echarts.EChartsOption

const lineEchart = ref<HTMLElement | null>(null)
const pieEchart = ref<HTMLElement | null>(null)

const lineOption = {
  title: {
    left: "center",
    text: "近一周交易量"
  },
  xAxis: {
    type: "category",
    data: ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"]
  },
  yAxis: {
    type: "value"
  },
  series: [
    {
      data: [] as number[],
      type: "line",
      smooth: true
    }
  ]
}
const pieOption = {
  title: {
    text: "热门苗木种类",
    left: "center"
  },
  tooltip: {
    trigger: "item"
  },
  legend: {
    orient: "vertical",
    left: "left"
  },
  series: [
    {
      name: "Access From",
      type: "pie",
      radius: "50%",
      data: [] as any[],
      emphasis: {
        itemStyle: {
          shadowBlur: 10,
          shadowOffsetX: 0,
          shadowColor: "rgba(0, 0, 0, 0.5)"
        }
      }
    }
  ]
}

onMounted(async () => {
  const res = await GetDataAnalyseApi()
  userCount.value = res.data.userCount
  treeCount.value = res.data.treeCount
  orderCount.value = res.data.orderCount
  weeklyCount.value = res.data.weeklyVolume.reduce((pre, cur) => {
    return pre + cur
  })

  weeklyVolume.value = res.data.weeklyVolume
  popularType.value = res.data.popularType

  lineOption.series[0].data = weeklyVolume.value
  pieOption.series[0].data = popularType.value

  const lineChart = echarts.init(lineEchart.value as HTMLElement)
  const pieChart = echarts.init(pieEchart.value as HTMLElement)

  lineChart.setOption(lineOption)
  pieChart.setOption(pieOption)
})
</script>

<template>
  <div class="app-container center">
    <div class="container__top">
      <el-card class="top__card" shadow="hover">
        <i class="iconfont icon-user"></i>
        <div class="card__info">
          <span class="info__title">用户总数</span>
          <span class="info__count">{{ userCount }}</span>
        </div>
      </el-card>
      <el-card class="top__card" shadow="hover">
        <i class="iconfont icon-ziyuan6"></i>
        <div class="card__info">
          <span class="info__title">苗木总数</span>
          <span class="info__count">{{ treeCount }}</span>
        </div>
      </el-card>
      <el-card class="top__card" shadow="hover">
        <i class="iconfont icon-dingdan"></i>
        <div class="card__info">
          <span class="info__title">订单总数</span>
          <span class="info__count">{{ orderCount }}</span>
        </div>
      </el-card>
      <el-card class="top__card" shadow="hover">
        <i class="iconfont icon-xiaoliangyuce"></i>
        <div class="card__info">
          <span class="info__title">周交易</span>
          <span class="info__count">{{ weeklyCount }}</span>
        </div>
      </el-card>
    </div>
    <div class="container__main">
      <div class="main__lineEchart" ref="lineEchart" style="width: 70%; height: 600px"></div>
      <div class="main__pieEchart" ref="pieEchart" style="width: 30%; height: 600px"></div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.app-container {
  height: 100%;
  min-height: 852px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 50px;
  .container__top {
    width: 100%;
    display: flex;
    gap: 30px;
    .top__card {
      padding: 20px;
      flex: 1;
      &:hover {
        .iconfont::before {
          background-color: rgba(221, 221, 221, 0.315);
          box-shadow: 5px 5px 5px rgba(0, 0, 0, 0.3);
        }
        .iconfont {
          transform: perspective(500px) rotateY(20deg);
        }
      }
      :deep(.el-card__body) {
        display: flex;
        flex-direction: row;
        justify-content: space-between;
      }
      .iconfont {
        font-size: 65px;
        transition: all 0.5s;
        &::before {
          padding: 15px;
          border-radius: 10px;
          transition: all 0.2s;
        }
      }
      .card__info {
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        align-items: end;
        gap: 20px;
        .info__title {
          font-size: 20px;
        }
        .info__count {
          font-size: 30px;
        }
      }
    }
  }
  .container__main {
    flex: 1;
    display: flex;
    width: 100%;
    height: 100%;
    position: relative;
    .main__lineEchart,
    .main__pieEchart {
      height: 100%;
    }
  }
}
</style>

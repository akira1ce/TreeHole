<!--
 * @Author: Akira
 * @Date: 2022-12-06 21:00:11
 * @LastEditTime: 2023-02-20 16:07:17
-->
<script setup>
import { onMounted } from "vue-demi";
import { useRoute } from "vue-router";

const route = useRoute();
const TMap = window.TMap;

const { location } = route.query;

onMounted(() => {
  const map = new TMap.Map("container", {
    zoom: 14,
    center: new TMap.LatLng(39.986785, 116.301012),
  });
  /** 新建一个正逆地址解析类 */
  const geocoder = new TMap.service.Geocoder();
  const markers = new TMap.MultiMarker({
    map: map,
    geometries: [],
  });

  function convert(location) {
    markers.setGeometries([]);
    /** 将给定的地址转换为坐标位置 */
    geocoder.getLocation({ address: location }).then((result) => {
      markers.updateGeometries([
        {
          id: "container",
          /** 将得到的坐标位置用点标记标注在地图上 */
          position: result.result.location,
        },
      ]);
      map.setCenter(result.result.location);
      console.log(result.result.location);
    });
  }

  convert(location);
});
</script>

<template>
  <div id="container"></div>
</template>

<style lang="less" scoped>
#container {
  overflow: hidden;
  height: calc(100vh - 76px);
}
</style>

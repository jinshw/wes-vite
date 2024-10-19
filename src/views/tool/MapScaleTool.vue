<template>
    <div class="my-map-scale">
        <div class="mymap-scale-item">地图比例尺:1:{{ scalVal }}</div>
        <div class="mymap-scale-item">影像等级:{{ mapLevel }}</div>
        <div class="mymap-scale-item">相机:{{ cameraHeight }}米</div>
        <div class="mymap-scale-item">经纬度:{{ cameraLon }},{{ cameraLat }}</div>
    </div>
</template>

<script setup>
import { onMounted, ref, reactive} from "vue";
import * as Cesium from "cesium";
import env from "@/mapcore/env";

let scalVal = ref(9028);
let mapLevel = ref(16);
let cameraHeight = ref(15000);
let cameraLon = ref(120.8556);
let cameraLat = ref(32.0672);
let scaleMap = {
    1: 36978669,
    2: 18489335,
    3: 9244667,
    4: 4622334,
    5: 2311167,
    6: 1155583,
    7: 577792,
    8: 288896,
    9: 144448,
    10: 72224,
    11: 36112,
    12: 18056,
    13: 9028,
    14: 4514,
    15: 2257,
    16: 1129,
    17: 564,
    18: 282,
    19: 141,
    20: 71,
    21: 35,
    22: 15,
    23: 6,
    24: 3,
    25: 1
};
// let parentProps = defineProps({
//     changeMap: {
//         type: Function
//     }
// })
 
const screenSpaceEventTypeWHEEL = (viewer) => {
    let handler = new Cesium.ScreenSpaceEventHandler(viewer.scene.canvas);
    
    //监听鼠标滚轮事件
    handler.setInputAction((movement) => {
        let cameraHeight1 = Math.ceil(viewer.camera.positionCartographic.height)
        //根据相机高度显示隐藏倾斜摄影
        let isShow = cameraHeight1 < 280 ? false: true
        //parentProps.changeMap(isShow,cameraHeight1)

        //从Cesium中获取当前地图瓦片等级
        let tiles = [];
        let tilesToRender = viewer.scene.globe._surface._tilesToRender;
        //console.log(tilesToRender,'tilesToRender======')
        if (Cesium.defined(tilesToRender)) {
            for (let i = 0; i < tilesToRender.length; i++) {
                // tiles.add(tilesToRender[i].level);
                tiles.push(tilesToRender[i].level);
            }
            
            // console.log('当前地图瓦片级别为:');
            // console.log('当前地图瓦片级别为:',tiles[0], scaleMap[tiles[0]]);
            scalVal.value = scaleMap[tiles[0]]
            mapLevel.value = tiles[0];
            if (scalVal.value == "") {
                scalVal.value = "1"
            }
        }
        
        // 当前视角相机的离地高度
        cameraHeight.value = Math.round(viewer.camera.positionCartographic.height);
        var cartographic = Cesium.Ellipsoid.WGS84.cartesianToCartographic(viewer.camera.position);
        var longitude = Cesium.Math.toDegrees(cartographic.longitude);
        var latitude = Cesium.Math.toDegrees(cartographic.latitude);
        var altitude = cartographic.height;

        cameraLon.value = longitude.toFixed(4);
        cameraLat.value = latitude.toFixed(4);

        //console.log(cameraHeight, longitude, latitude, altitude);
        //console.log("cameras",getCamera(viewer));
    }, Cesium.ScreenSpaceEventType.WHEEL);
};

//将坐标转化为84坐标
const  get84Cood=(positon) => { 
    let zb = Cesium.Cartographic.fromCartesian(positon);
    let lat = Cesium.Math.toDegrees(zb.latitude);
    let lon = Cesium.Math.toDegrees(zb.longitude);
    let height = zb.height;
    return {
    lon,
    lat,
    height
    };
};
//获取相机参数
const getCamera=(viewer)  => {
    let p = get84Cood(viewer.camera.position);
    let position = [p.lon, p.lat, p.height];
    return {
    position,
    heading: viewer.camera.heading,
    pitch: viewer.camera.pitch,
    roll: viewer.camera.roll
    };
};


defineExpose({
    screenSpaceEventTypeWHEEL
});


</script>

<style lang="scss" scoped>
.my-map-scale {
    background-color: rgba(0, 0, 0, 0.5);
    width: 100%;
    height: 22px;
    position: absolute;
    left: 0px;
    bottom: 0px;
    text-align: center;
    font-size: 14px;
    line-height: 14px;
    color: #FFF;
    font-family: 'Roboto', sans-serif;
    line-height: 22px;
    display: flex;
    justify-content: flex-start;
}

/* .my-map-scale {
  background-color: rgba(0, 0, 0, 0);
  width: 300px;
  height: 30px;
  position: absolute;
  left: 49%;
  bottom: 5px;
  text-align: center;
  font-size: 14px;
  line-height: 14px;
  color: #FFF;
  font-family: 'Roboto', sans-serif;
} */
.mymap-scale-item {
    margin-right: 10px;
    margin-left: 20px
}
</style>

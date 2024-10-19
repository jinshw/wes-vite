<script setup lang="ts">
import { reactive, toRaw, toRefs, ref, nextTick, onMounted } from 'vue';
import { ElMessage, ElMessageBox } from "element-plus";
import {
  selectGltfList
} from "@/api/map/map-device";

let fileURL: string = "";
const gltfList = ref([]);

defineOptions({
  name: "Welcome"
});
onMounted(() => {
  //initMap()
});

let map = null;

const initMap = () => {
  /**
      * 全局参数设置
      */
  minemap.domainUrl = 'https://minemap.minedata.cn';
  minemap.dataDomainUrl = 'https://minemap.minedata.cn';
  minemap.serverDomainUrl = 'https://sd-data.minedata.cn';
  minemap.spriteUrl = 'https://minemap.minedata.cn/minemapapi/v4.0.0/sprite/sprite';
  minemap.serviceUrl = 'https://service.minedata.cn/service';

  minemap.key = '655e196a809b48d0bb98749672e07278';
  // minemap.key = '381fce1d640b4717823b0da1cc6023d6';
  minemap.solution = "1098572457161904128";
  // minemap.solution = "1153388924604350464";

  // SOLUTION: '1098572457161904128',
  // KEY: '655e196a809b48d0bb98749672e07278'

  // 定义空底图样式
  var style = {
    "glyphs": "minemap://fonts/{fontstack}/{range}",
    "sprite": "minemap://sprite/sprite",
    "sources": {},
    "layers": [],
    "version": 8
  };
  const center = [116.248767585006, 40.118466147532]
  map = new minemap.Map({
    container: 'map3D',
    style: "https://service.minedata.cn/map/solu/style/1153388924604350464",
    // style: style, /*球面矢量底图样式*/
    center: center, /*地图中心点*/
    zoom: 16, /*地图默认缩放等级*/
    pitch: 0, /*地图俯仰角度*/
    bearing: 0,/*地图旋转角度*/
    maxZoom: 22, /*地图最大缩放等级*/
    minZoom: 1,  /*地图最小缩放等级*/
    projection: 'MERCATOR'
  });

  map.repaint = true;

  map.on('load', function () {

    map.addSource("serve", {
      type: "3d-tiles",
      maximumMemoryUsage: 512, // 控制内存，最好不要过大
      baseScreenSpaceError: 1024,
      // maximumScreenSpaceError: 16, //几何误差
      // heightOffset:100,
      // maximumScreenSpaceError: 16, //几何误差
      translation: [0, 0, 0],
      throttleRequests: true,
      urls: [
        {
          url: "data/futian1208_result/test/tileset.json",
          // url: "data/outfutian20231207_result/test/tileset.json",
          name: "serve",
        },
      ],
      sourceLoaded: (e) => {
        window.center = e.getTilesSourceConfig();
      },
    })

    map.addLayer({
      "type": "3d-tiles",
      "id": "serve",
      "source": "serve",
      "minzoom": 1
    });


    getGltfDeviceList();


  });


};

const getGltfDeviceList = () => {
  selectGltfList({}).then((response: any) => {
    console.log("selectGltfList...",response);
    gltfList.value = response.list;
    fileURL = response.fileURL;
    addModelLayer();
  });
};

const addModelLayer = () => {
  let gltfObj = null;
  for (let i = 0; i < gltfList.value.length; i++) {
    gltfObj = gltfList.value[i];
    addModel(gltfObj, i);
  }
};

const addModel = (gltfObj, index) => {

  let gltfPath = gltfObj.gltfPath;
  if (gltfPath == undefined || gltfPath == "") {
    ElMessage({
      message: "请检查，OBJ没有生成GLTF文件！",
      type: "warning"
    });
    return;
  }

  let gltf = fileURL + "/" + gltfPath;


  let lon = 0;
  let lat = 0;
  let alt = 0;
  let heading = 0;
  let pitch = 0;
  let roll = 0;

  if (gltfObj.lon != null || gltfObj.lon != undefined || gltfObj.lon != '') {
    lon = gltfObj.lon;
    lat = gltfObj.lat;
    alt = gltfObj.alt;
    // heading = gltfObj.heading;
    // pitch = gltfObj.pitch;
    // roll = gltfObj.roll;
    heading = minemap.Math.toRadians(gltfObj.heading - 90);
    pitch = minemap.Math.toRadians(gltfObj.pitch - 90);
    roll = minemap.Math.toRadians(gltfObj.roll);
  }

  let modelID = "myModel-" + index;
  let modelName = "myModelName-" + index;

  let myModel = map.getSceneComponent("myModel");
  if (myModel == null || myModel == "" || myModel == undefined) {
    //GLTF模型实例化
    map.addSceneComponent({
      id: modelID,
      type: "3d-model",
      data: gltf,
      // data: "https://minedata.cn/nce-static/support/assets/models/SWTX-ALL/SWFX-ALL.gltf",
      modelFolder: "",// 该数据引用图片等资源的文件夹路径
      positions: [new minemap.Math.Vector3([lon, lat, alt])], //实例化顶点数组([new minemap.Math.Vector3])(必须)
      rotations: [new minemap.Math.HeadingPitchRoll(heading, pitch, roll)], // 实例化旋转参数数组([minemap.Math.HeadingPitchRoll])(非必须)
      // rotations: [minemap.Math.HeadingPitchRoll.fromDegrees(0, 0, 0)], // 实例化旋转参数数组([minemap.Math.HeadingPitchRoll])(非必须)
      scales: [new minemap.Math.Vector3([1, 1, 1])], // 实例化缩放参数数组([new minemap.Math.Vector3])(非必须)
      instanceNames: [modelName], // 实例化id数组([string])(非必须)
      colors: [new minemap.Color(0, 0, 0, 0)], // 实例化color数组([minemap.Color])(非必须)
      shows: [true], // 实例化show数组([boolean])(非必须)
    });
  }
};


</script>

<template>
  <div id="map3D"></div>
</template>
<style scoped lang="scss">
#map3D {
  width: calc(100% - 44px);
  height: calc(100% - 44px);
  position: relative;
  background: url('/static/image/welcomebg.png') no-repeat;
  background-size: 100% 100%;
}

:deep(.minemap-ctrl-logo) {
  display: none !important;
}
</style>
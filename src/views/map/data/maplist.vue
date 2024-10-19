<template>
    <div style="width: 100%; height: 100%">
        <div :id="mapId"></div>
        <button-bar ref="buttonBarRef"></button-bar>

        <!-- 模型下拉选择 -->
        <el-select class="tiles-select" size="medium" v-model="curTiles" placeholder="请选择3dTiles"
            @change="tilesSelectChange">
            <el-option v-for="item in tile3DList" :key="item.dataId" :label="item.dataName"
                :value="item.dataId"></el-option>
        </el-select>

        <!-- 模型图层开关列表 -->
        <div class="layer-icon">
            <img :src="layerSwitchImg" alt="" @click="onOpenCheckLayer"
                :style="isLayerList ? 'display:none;' : 'display:block;'" />
        </div>
        <div class="layer-tools" :style="isLayerList ? 'display:block;' : 'display:none;'">
            <div class="close" @click="handleCheckLayerClose">
                <i class="el-icon-close"></i>
            </div>
            <el-checkbox :indeterminate="isIndeterminate" v-model="checkAll" @change="handleCheckAllChange">全选</el-checkbox>
            <el-checkbox-group v-model="checkedLayers" @change="handleCheckedLayersChange">
                <el-checkbox v-for="(item, index) in tile3DList" :label="index" :key="index"
                    style="display: block; padding-top: 10px; margin-left: 10px">{{ item.dataName }}</el-checkbox>
            </el-checkbox-group>

            <ul>
            </ul>
        </div>
    </div>
</template>

<script lang="ts" setup>
import { reactive, toRaw, toRefs, ref, nextTick, onMounted } from "vue";
import { ElMessage, ElMessageBox } from "element-plus";

import map3D from "@/utils/map3D";
import ButtonBar from "@/components/ButtonBar.vue";
import { mapDataList } from "@/api/map/map-data";

const mapId = "map";
const mecGeojson = null;
const tile3DList = ref([]);
const curTiles = ref("");
const tileUrl = ref("");
const checkedLayers = ref([]);
const checkAll = ref(true);
const isIndeterminate = ref(true);
const isLayerList = ref(false);

const layerSwitchImg = ref("@/static/image/layer-switch.png");


defineOptions({
    name: "MapList"
});


onMounted(() => {
    nextTick(() => {
        initMap();
    });
});

const initMap = () => {
    /**
     * 全局参数设置
     */
    minemap.domainUrl = "https://minemap.minedata.cn";
    minemap.dataDomainUrl = "https://minemap.minedata.cn";
    minemap.serverDomainUrl = "https://sd-data.minedata.cn";
    minemap.spriteUrl =
        "https://minemap.minedata.cn/minemapapi/v4.0.0/sprite/sprite";
    minemap.serviceUrl = "https://service.minedata.cn/service";

    minemap.key = "16be596e00c44c86bb1569cb53424dc9";
    minemap.solution = 11001;

    if (map3D.map) {
        map3D.map.remove();
        map3D.map = null;
    }

    map3D.map = new minemap.Map({
        container: mapId,
        style: "https://service.minedata.cn/map/solu/style/11001",
        center: [116.50989879582212, 39.792909548430416], //亦庄
        zoom: 9,
        pitch: 0,
        maxZoom: 21,
        minZoom: 3,
        projection: "MERCATOR",
    });

    map3D.map.on("load", function () {
        /* 添加栅格图 */
        map3D.map.addSource("IMAGERY_SOURCE", {
            type: "raster", // 数据源类型：栅格数据源
            tiles: [
                "https://services.minedata.cn/service/data/satellite?x={x}&y={y}&z={z}",
            ], // 瓦片服务地址
            tileSize: 256, // 瓦片尺寸
        });

        map3D.map.addLayer({
            id: "IMAGERY",
            type: "raster", // 图层类型为"raster"
            source: "IMAGERY_SOURCE",
            minzoom: 1,
            maxzoom: 23,
            paint: {
                "raster-opacity": 1,
            },
        });

        // map3D.map.setLayoutProperty("IMAGERY", 'visibility', 'visible')
        map3D.map.setLayoutProperty("IMAGERY", "visibility", "none");

        get3dTiles();
    });

};

const get3dTiles = () => {

    mapDataList({ pageSize: 10000 }).then((response) => {
        console.log("mapDataList...", response);
        tileUrl.value = response.fileUrl;
        tile3DList.value = response.data.list;
    });
};

const tilesSelectChange = (val) => {
    console.log("tilesSelectChange......");

    const len = tile3DList.value.length;
    for (let i = 0; i < len; i++) {
        const item = tile3DList.value[i];
        const serveId = "serve" + i;
        if (val === item.dataId) {
            // 判断模型是否加载，如果没有加载进行加载，如果已经加载打开图层
            if (map3D.map.getLayer(serveId)) {
                map3D.map.setLayoutProperty(serveId, "visibility", "visible");
            } else {
                load3dTils(tileUrl.value, item.tilesPath, i);
            }
            // 地图定位模型位置
            map3D.map.flyTo({
                center: [item.objLon, item.objLat],
                zoom: 15,
                bearing: 0,
                pitch: 45,
                duration: 2000,
            });
        } else {
            // 如果不是当前点击模型，则关闭图层
            if (map3D.map.getLayer(serveId)) {
                map3D.map.setLayoutProperty(serveId, "visibility", "none");
            }
        }
    }
};

const load3dTils = (url, uri, index) => {
    map3D.map.addSource("serve" + index, {
        type: "3d-tiles",
        // minzoom: 1,
        maximumMemoryUsage: 512, // 控制内存，最好不要过大
        baseScreenSpaceError: 1024,
        // maximumScreenSpaceError: 16, //几何误差
        // heightOffset:100,
        // maximumScreenSpaceError: 16, //几何误差
        translation: [0, 0, 0],
        throttleRequests: true,
        urls: [
            {
                url: url + "/" + uri,
                name: "serve" + index,
            },
        ],
        sourceLoaded: (e) => {
            window.center = e.getTilesSourceConfig();
        },
    });
    map3D.map.addLayer({
        type: "3d-tiles",
        id: "serve" + index,
        source: "serve" + index,
        minzoom: 1,
    });
};

const handleCheckedLayersChange = (value) => {
    const checkedCount = value.length
    checkAll.value = checkedCount === tile3DList.value.length
    isIndeterminate.value = checkedCount > 0 && checkedCount < tile3DList.value.length

    layerSwitch(value)
};
const handleCheckAllChange = (val) => {
    checkedLayers.value = []
    if (val) {
        for (var i = 0; i < tile3DList.value.length; i++) {
            checkedLayers.value.push(i)
        }
    }

    // this.checkedLayers = val ? this.tile3DList : []
    isIndeterminate.value = false
    layerSwitch(this.checkedLayers)
};

const initCheckedLayers = () => {
    checkedLayers.value = []
    for (var i = 0; i < tile3DList.value.length; i++) {
        checkedLayers.value.push(i)
    }
};

const layerSwitch = (checkeds) => {
    for (var k = 0; k < tile3DList.value.length; k++) {
        const serveId = 'serve' + k
        if (map3D.map.getLayer(serveId)) {
            map3D.map.setLayoutProperty(serveId, 'visibility', 'none')
        }
    }
    for (var i = 0; i < checkeds.length; i++) {
        const serveId = 'serve' + checkeds[i]
        if (map3D.map.getLayer(serveId)) {
            map3D.map.setLayoutProperty(serveId, 'visibility', 'visible')
        } else {
            const itemIndex = checkeds[i]
            const item = tile3DList.value[itemIndex]
            load3dTils(tileUrl.value, item.tilesPath, itemIndex)
        }
    }
};
const handleCheckLayerClose = () => {
    isLayerList.value = false
};

const onOpenCheckLayer = () => {
    get3dTiles()
    isLayerList.value = true
};


</script>

<style lang="scss" scoped>
#map {
    width: 100%;
    height: 100%;
}

.dashboard {
    &-container {
        margin: 30px;
    }

    &-text {
        font-size: 30px;
        line-height: 46px;
    }
}

.tiles-select {
    position: absolute;
    z-index: 1000;
    left: 30px;
    top: 5px;
}

.layer-icon {
    position: absolute;
    right: 20px;
    top: 20px;
    z-index: 50000;
    width: 15px;
    height: 15px;
    cursor: pointer;
}

.layer-tools {
    width: auto;
    height: auto;
    background-color: #e1e1e1;
    z-index: 50000;
    position: absolute;
    right: 10px;
    top: 20px;
}

.layer-tools>ul {
    padding: 10px;
}

.layer-tools>ul>li {
    padding: 5px;
    cursor: pointer;
}

.layer-tools>ul>li>input {
    margin-left: 4px;
}

.layer-tools .close {
    display: block;
    position: absolute;
    right: 0px;
    cursor: pointer;
    width: 15px;
    height: 15px;
}
:deep(.minemap-ctrl-logo){
  display: none!important;
}
</style>

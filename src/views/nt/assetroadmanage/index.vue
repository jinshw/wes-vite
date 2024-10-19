<template>
    <div>
        <div>
            <el-form :inline="true">
                <el-row>
                    <el-col :span="18">
                        <el-form-item label="路线名称">
                            <el-input v-model.trim="searchObj.name" type="text" placeholder="请输入路线名称" />
                        </el-form-item>
                    </el-col>

                    <el-col :span="6" class="btn-textright">
                        <el-button @click="search">查询</el-button>
                        <el-button type="primary" @click="handleAdd">新增</el-button>
                        <el-button type="primary" @click="handleSearchReset">重置</el-button>
                    </el-col>
                </el-row>
            </el-form>
        </div>
        <!-- 结果返回列表 -->
        <div class="table-box table-wrap">
            <el-table :data="tableData" height="auto">
                <el-table-column type="selection" width="55" />
                <el-table-column type="index" label="序号" width="60" />
                <el-table-column prop="name" label="路线名称" width="200" />
                <el-table-column prop="roadCode" label="路线编码" width="200"/>
                <el-table-column prop="locationStart" label="路线起点" width="200"/>
                <el-table-column prop="locationEnd" label="路线终点" width="200"/>
                <el-table-column prop="roadLevel" label="道路等级" width="200"/>
                <el-table-column prop="optTime" label="更新时间"  :formatter="formatDate" width="160"/>

                <el-table-column label="操作" fixed="right" align="center" width="140">
                    <template #default="scope">
                        <el-button link type="primary" size="small" @click="handleEdit(scope.$index, scope.row)"><i
                                class="iconfont">&#xe732;</i> 编辑</el-button>
                        <el-button link type="primary" size="small" @click="handleDelete(scope.$index, scope.row)"><i
                                class="iconfont">&#xe74e;</i> 删除</el-button>
                    </template>
                </el-table-column>
            </el-table>
            <div align="center">
                <el-pagination :current-page="currentPage" :page-sizes="[10, 20, 30, 40]" :page-size="pagesize"
                    layout="total, sizes, prev, pager, next, jumper" :total="totalCount" @size-change="handleSizeChange"
                    @current-change="handleCurrentChange" />
            </div>
        </div>

        <!-- new and edit -->
        <el-dialog :title="dialogTitle" v-model="addDialogVisible" :fullscreen="true" @open="mapOpenCallback"
            :before-close="handleDialogBeforeClose" :close-on-click-modal="false">
            <el-form ref="addFormRef" :inline="true" label-width="190px" size="small" :rules="rules" :model="dataRow"
                class="dialogElForm">
                <el-form-item label="路线名称" prop="name">
                    <el-input v-model="dataRow.name" auto-complete="off" placeholder="请输入路线名称" />
                </el-form-item>
                <el-form-item label="路线编码" prop="roadCode">
                    <el-input v-model="dataRow.roadCode" auto-complete="off" placeholder="请输入路线编码"/>
                </el-form-item>
                <el-form-item label="区域范围" prop="polygon">
                    <el-input v-model="dataRow.polygon" auto-complete="off" placeholder="请输入区域范围" disabled>
                    </el-input>
                </el-form-item>
                <el-form-item label="路线起点" prop="locationStart">
                    <el-input v-model="dataRow.locationStart" auto-complete="off" placeholder="请输入路线起点"/>
                </el-form-item>
                <el-form-item label="路线终点" prop="locationEnd">
                    <el-input v-model="dataRow.locationEnd" auto-complete="off" placeholder="请输入路线终点"/>
                </el-form-item>
                <el-form-item label="道路等级" prop="roadLevel">
                    <el-input v-model="dataRow.roadLevel" auto-complete="off" placeholder="请输入道路等级"/>
                </el-form-item>
                <el-form-item label="备注" prop="desc">
                    <el-input v-model="dataRow.desc" auto-complete="off" placeholder="请输入备注"/>
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" size="small" @click="resetForm" v-show="saveType == 1">重置</el-button>
                    <el-button type="primary" size="small" @click="commitEventForm">保存</el-button>
                </el-form-item>
            </el-form>
            <div>
                <div v-if="mapType == 'cesium'" id="cesiumMap" ref="cesiumMap" style="width: calc(100vw-0px); height: calc(100vh - 205px);"></div>
                <MapScaleTool ref="mapScale"></MapScaleTool>
                <cesium-draw class="draw-viewer-box" ref="cesiumDrawRef" v-show="isStartEdit"  @dataSent="handleChildEmit"></cesium-draw>
                <!-- 地图切换 -->
                <div class="map-switch">
                    <div @click="mapChange = !mapChange" v-show="!mapChange">
                        <img src="/static/image/up.png" width="40" alt="">
                        <div> 底图</div>
                    </div>
                    <div v-show="mapChange">
                        <img src="/static/image/down.png" width="40" alt="" @click="mapChange = !mapChange">
                        <div :class="yingxiangChecked ? 'checked' : ''" @click="changeMap('yingxiang')"> 影像</div>
                        <div :class="hadChecked ? 'checked' : ''" @click="changeMap('had')"> 路网 <br> HAD</div>
                    </div>
                </div>
            </div>
        </el-dialog>
    </div>
</template>

<script lang="ts" setup>
import { reactive, toRaw, toRefs, ref, nextTick, onMounted } from "vue";
import { ElMessage, ElMessageBox } from "element-plus";
import type { FormInstance, FormRules } from 'element-plus'
import moment from "moment";
import "cesium/Build/Cesium/Widgets/widgets.css";
import * as Cesium from "cesium";
window.Cesium = Cesium;
import { useStore } from 'vuex';
import env from "@/mapcore/env";
import MapScaleTool from "@/views/tool/MapScaleTool.vue";
import CesiumDraw from "@/components/cesiumDrawViewer.vue";
let mapScale = ref();

import {
    assetAssetRoadListByPage,
    addAssetRoad,
    updateAssetRoad,
    deleteAssetRoad,
} from "@/api/nt/asset-manage";

let searchObj = reactive({ name: "" });
let dialogTitle = ref("新增");
let addDialogVisible = ref(false);
let saveType = ref(1);
const tableData = ref([]);

let mapType = ref("cesium");
let mapTypeInit = ref(false);
let viewer = null;
let cesiumMap = ref<HTMLDivElement>();
let cesiumDrawRef = ref();
const isStartEdit = ref(false); //是否开始编辑 
const mapChange = ref(false);
const showDraw = ref(false);
const yingxiangChecked = ref(true);
const qxsyChecked = ref(true);
const hadChecked = ref(true);
const natongwmsChecked = ref(true);
const yingxiangLayer = ref(null);
const hadLayer = ref(null);
const hadHQLLayer = ref(null);
const yingxiangUrl = anbaoConfig.mapUrl.yingxiangUrl;// 主城区影像地址
const hadUrl = anbaoConfig.mapUrl.hadUrl;//南通高精路网数据

// 默认每页数据量
let pagesize = ref(10);
// 当前页码
let currentPage = ref(1);
// 查询的页码
let start = ref(1);
// 默认数据总数
let totalCount = ref(1000);
let dataRow = reactive({ roadId:"", name: "", roadCode: "", polygon: "", lineColor:"", lineStyle:"", lineWidth:"", 
                        outlineColor:"", outlineStyle:"", outlineWidth:"", polygonCenter:"", desc:"", locationStart:"", locationEnd:"", roadLevel:"",id:""});
let rules = reactive({
    name: [
        { required: true, message: "请输名称", trigger: "blur" },
        {
            min: 2,
            max: 30,
            message: "长度在2 到 30 个字符",
            trigger: ["blur", "change"],
        },
    ],
    roadCode: [{ required: true, message: "请输路线编码", trigger: "blur" }],
    polygon: [{ required: true, message: "请选择区域范围", trigger: "blur" }],
});

let addFormRef = ref<FormInstance>();


onMounted(() => {
    search();
});

// 搜索
const search = () => {
    getList(currentPage.value, pagesize.value);
};

const getList = (pageNum, pageSize) => {
    searchObj.pageNum = pageNum;
    searchObj.pageSize = pageSize;
    assetAssetRoadListByPage(searchObj).then((response) => {
        tableData.value = response.data.list;
        totalCount = response.number;
    });
};

const handleAdd = () => {
    dialogTitle.value = "新增";
    addDialogVisible.value = true;
    saveType.value = 1;
    resetForm();
};

const handleEdit = (index, row) => {
    dialogTitle.value = "编辑";
    addDialogVisible.value = true;
    saveType.value = 2;
    initRowToObj(row);
};
const initRowToObj = (row) => {
    dataRow.roadId = row.roadId;
    dataRow.name = row.name;
    dataRow.roadCode = row.roadCode;
    dataRow.polygon = row.polygon;
    dataRow.polygonCenter = row.polygonCenter;
    dataRow.lineColor = row.lineColor;
    dataRow.lineStyle = row.lineStyle;
    dataRow.lineWidth = row.lineWidth;
    dataRow.outlineColor = row.outlineColor;
    dataRow.outlineStyle = row.outlineStyle;
    dataRow.outlineWidth = row.outlineWidth;
    dataRow.desc = row.desc;
    dataRow.locationStart = row.locationStart;
    dataRow.locationEnd = row.locationEnd;
    dataRow.roadLevel = row.roadLevel;
    dataRow.id = row.id;
};

const handleDelete = (index, row) => {
    ElMessageBox.confirm("此操作将永久删除该记录, 是否继续?", "提示", {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: "warning"
    })
        .then(() => {
            deleteAssetRoad({ roadId: row.roadId }).then((response) => {
                if (response.status != 200) {
                    ElMessage({
                        message: "无法删除！",
                        type: "warning"
                    });
                } else if (response) {
                    ElMessage({
                        message: "执行成功",
                        type: "success"
                    });
                    search();
                }
            });
        })
        .catch(() => {
            ElMessage({
                message: "已取消删除！",
                type: "info"
            });
        });
};

const commitEventForm = () => {
    var that = this;
    addFormRef.value.validate((isValid, invalidFields) => {
        if (isValid) {
            if (saveType.value == 1) {
                // 新增
                addAssetRoad(dataRow).then((response) => {
                    if (response.status == 200) {
                        ElMessage({
                            message: "新增保存成功!",
                            type: "success"
                        });
                        addDialogVisible.value = false;
                        search();
                    } else if (response.status == 201) {
                        ElMessage({
                            message: "新增保存失败!",
                            type: "error"
                        });

                    }
                });
            } else {
                // 2:编辑
                updateAssetRoad(dataRow).then((response) => {
                    if (response.status == 200) {
                        ElMessage({
                            message: "修改保存成功!",
                            type: "success"
                        });
                        addDialogVisible.value = false;
                        search();
                    }else if (response.status == 201) {
                        ElMessage({
                            message: "修改保存失败!",
                            type: "error"
                        });

                    }
                });
            }
        } else {
            console.log(invalidFields);
            console.log("验证不通过，不能提交，请检查");
            return false;
        }
    });
};

const handleDialogBeforeClose = (done) => {
    cesiumDrawRef.value.clearGraphic()
    done();
};

const resetForm = () => {
    dataRow = reactive({ roadId:"", name: "", roadCode: "", polygon: "", lineColor:"", lineStyle:"", lineWidth:"", 
                         outlineColor:"", outlineStyle:"", outlineWidth:"", polygonCenter:"", desc:"", locationStart:"", locationEnd:"", roadLevel:"",id:""});
    resetClearValidate();
};
const resetClearValidate = (event) => {
    // this.$nextTick(() => {
    //     this.$refs.addFormRef.clearValidate();
    // });
    nextTick(() => {
        if (addFormRef.value) {
            addFormRef.value.clearValidate();
        }

    });
};

const handleSearchReset = () => {
    searchObj.name = "";
};

// 每页显示数据量变更
const handleSizeChange = (val) => {
    pagesize.value = val;
    search();
};

// 页码变更
const handleCurrentChange = (val) => {
    currentPage.value = val;
    search();
};

const formatDate = (row, column) => {
    // 获取单元格数据
    const date = row[column.property];
    if (date === undefined || date === null) {
        return "";
    }
    return moment(date).format("YYYY-MM-DD HH:mm:ss");
};
const mapOpenCallback = () => {
    if (mapType.value == "minedata") {
    } else if (mapType.value == "cesium") {
        initCesiumMap();
    }
};

const initCesiumMap = () => {
    if(!mapTypeInit.value){
        viewer = new Cesium.Viewer(cesiumMap.value as HTMLElement, {
            // 离线无网络情况下添加本地默认瓦片
            imageryProvider: new Cesium.TileMapServiceImageryProvider({
                url: Cesium.buildModuleUrl("Assets/Textures/NaturalEarthII"),
            }),
            navigation: false, // 显示导航控件
            // 是否显示信息窗口
            infoBox: false,
            // 是否创建动画
            animation: false,
            // 是否显示图层选择器
            baseLayerPicker: false,
            // 是否显示全屏按钮
            fullscreenButton: false,
            // 是否显示右上角的查询按钮
            geocoder: false,
            // 是否显示HOME按钮
            homeButton: false,
            // 是否显示场景控制按钮
            sceneModePicker: false,
            // 是否显示帮助按钮
            navigationHelpButton: false,
            selectionIndicator: false, //是否显示选取指示器组件 点击时出现的
            // 是否显示时间轴
            timeline: false,

        })
        viewer.cesiumWidget.creditContainer.style.display = "none"//取消版权信息
        mapTypeInit.value  = true;
        setTimeout(function () {
            showDrawManager();
        }, 100);
    }
    
    //加载影像地图
    const yingxiangImageryProvider = new Cesium.UrlTemplateImageryProvider({
        url: yingxiangUrl,
        //maximumLevel : 15
    });

    //加载高精地图
    const hadImageryProvider = new Cesium.Cesium3DTileset({
        //开启地下可视化
        //开启高程遮挡模型（默认不开启）
        // viewer.scene.globe.depthTestAgainstTerrain = true;
        url: hadUrl,
        //控制切片视角显示的数量，可调整性能
        maximumScreenSpaceError: 2,
        maximumNumberOfLoadedTiles: 1000000,
    });

    //加载影像地图
    yingxiangLayer.value = new Cesium.ImageryLayer(yingxiangImageryProvider);
    viewer.imageryLayers.add(yingxiangLayer.value);

    //加载高精路网地图
    hadLayer.value = viewer.scene.primitives.add(hadImageryProvider);

    let pointCenter = [120.88707566139853, 31.96994037316282]
    if(saveType.value == 2){
        pointCenter = JSON.parse(dataRow.polygonCenter)
    }
    viewer.camera.flyTo({
        destination: Cesium.Cartesian3.fromDegrees(pointCenter[0], pointCenter[1], 1200),
    });
    
    mouseHandlerChange();
    //监听鼠标滚轮事件
    mapScale.value.screenSpaceEventTypeWHEEL(viewer);

    env.viewer = viewer;
    
    setTimeout(function () {
        loadCurrDataRow();
    }, 400);
}

const mouseHandlerChange = () => {
    //var viewer = viewer// 定义一个标志，判断鼠标右键是否按下

    // 倾斜视图 鼠标右键旋转
    viewer.scene.screenSpaceCameraController.tiltEventTypes = [
      Cesium.CameraEventType.RIGHT_DRAG,
    ];
    // 缩放设置 重新设置缩放成员
    viewer.scene.screenSpaceCameraController.zoomEventTypes = [
      Cesium.CameraEventType.MIDDLE_DRAG,
      Cesium.CameraEventType.WHEEL,
      Cesium.CameraEventType.PINCH,
    ];
    // 平移 添加鼠标右键  鼠标左键平移
    viewer.scene.screenSpaceCameraController.rotateEventTypes = [
      Cesium.CameraEventType.LEFT_DRAG,
    ];
}

/**
 * 调用绘制插件
 * @param {*} isShow 
 * @param {*} width 
 */
const showDrawManager = () => {
  isStartEdit.value = true;
  if (isStartEdit.value && viewer) {
    cesiumDrawRef.value.init(viewer)
  } else{
    //结束编辑、销毁实例
    //cesiumDrawRef.value.clearGraphic()
  }
}

/**
 * 加载区域
 */
const loadCurrDataRow = () => {
    let currDataList = [];
    if(dataRow.polygon){
        currDataList.push(dataRow);
    }
    if (viewer) {
        cesiumDrawRef.value.initTreeData(currDataList)
    }
}

/*
 *  画区域
 */
const handleChildEmit = (data) =>{
    if(data.points.length>0){
        if(data.areaPolygonType=="1"){
            dataRow.polygon = JSON.stringify(data.points)
            dataRow.lineColor = data.lineColor
            dataRow.outlineColor = data.outlineColor
            dataRow.outlineWidth = data.outlineWidth
        }
    }else{
        loadCurrDataRow();
    }
}

/*
* 切换 影像/倾斜摄影地图
* type: 影像/倾斜摄影
*/
function changeMap(type) {
  if (type === "yingxiang") {
    yingxiangChecked.value = !yingxiangChecked.value
    if (yingxiangChecked.value) {
      yingxiangLayer.value.show = true;
    } else {
      yingxiangLayer.value.show = false;
    }

  } 
  else if (type === "had") {
    hadChecked.value = !hadChecked.value
    if (hadChecked.value) {
      hadLayer.value.show = true;
      hadHQLLayer.value.show = true;
    } else {
      hadLayer.value.show = false;
      hadHQLLayer.value.show = false;
    }
  }
}

</script>


<style lang="scss" scoped>
.map-switch {
  position: absolute;
  bottom: 30px;
  right: 25px;
  z-index: 9999;
  width: 72px;
  cursor: pointer;

  >div {
    height: auto;

    >div {
      height: 62px;
      background: url('/static/image/unselect.png') no-repeat;
      background-size: 100% 100%;
      font-weight: 400;
      font-size: 14px;
      color: #FFFFFF;
      line-height: 20px;
      margin-bottom: 12px;
      display: flex;
      align-items: center;
      /* 垂直居中 */
      justify-content: center;
      /* 水平居中 */
    }

    .checked {
      background: url('/static/image/selected.png') no-repeat;
      background-size: 100% 100%;
    }
  }
}
.draw-btn{
  position: absolute;
  cursor: pointer;
  top: 200px;
  right: 50px;
  z-index: 999999;
  width: 42px;
  height: 42px;
      background: url('/static/image/unselect.png') no-repeat;
      background-size: 100% 100%;
      font-weight: 400;
      font-size: 14px;
      color: #FFFFFF;
      line-height: 20px;
      margin-bottom: 12px;
      display: flex;
      align-items: center;
      /* 垂直居中 */
      justify-content: center;
      /* 水平居中 */
      &.checked {
      background: url('/static/image/selected.png') no-repeat;
      background-size: 100% 100%;
    }

}
.draw-viewer-box{
}
</style>

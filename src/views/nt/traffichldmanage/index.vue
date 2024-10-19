<template>
    <div>
        <div>
            <el-form :inline="true">
                <el-row>
                    <el-col :span="18">
                        <el-form-item label="交通灯名称">
                            <el-input v-model.trim="searchObj.name" type="text" placeholder="请输入交通灯名称" />
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
                <el-table-column prop="crossName" label="所属路口" width="200" />
                <el-table-column prop="poleId" label="所属设备杆" width="200" :formatter='formatterPoleId'/>
                <el-table-column prop="name" label="交通灯名称" width="200" />
                <el-table-column prop="lightCode" label="交通灯编码" width="200"/>
                <el-table-column prop="lightType" label="交通灯类型" width="200" :formatter='formatterLightType'/>
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
            <el-form ref="addFormRef" :inline="true" label-width="110px" size="small" :rules="rules" :model="dataRow"
                class="dialogElForm">
                <el-form-item label="所属设备杆" prop="poleId">
                    <el-select class="inputW" v-model="dataRow.poleId" filterable allow-create
                        default-first-option placeholder="请选择" @change="poleChangeTodeviceModel">
                        <el-option v-for="item in poleDataList" :key="item.poleId" :label="item.name"
                            :value="item.poleId"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="所属路口" prop="crossId">
                    <el-select class="inputW" v-model="dataRow.crossId" filterable allow-create
                        default-first-option placeholder="请选择">
                        <el-option v-for="item in crossDataList" :key="item.crossId" :label="item.name"
                            :value="item.crossId"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="区域范围" prop="polygon">
                    <el-input v-model="dataRow.polygon" auto-complete="off" placeholder="请输入区域范围" disabled>
                    </el-input>
                </el-form-item>
                <el-form-item label="交通灯名称" prop="name">
                    <el-input v-model="dataRow.name" auto-complete="off" placeholder="请输入交通灯名称" />
                </el-form-item>
                <el-form-item label="交通灯编码" prop="lightCode">
                    <el-input v-model="dataRow.lightCode" auto-complete="off" placeholder="请输入交通灯编码"/>
                </el-form-item>
                <el-form-item label="交通灯类型" prop="lightType">
                    <el-select class="inputW" v-model="dataRow.lightType" filterable allow-create
                        default-first-option placeholder="请选择">
                        <el-option v-for="item in lightTypeList" :key="item.code" :label="item.name"
                            :value="item.code" />
                    </el-select>
                </el-form-item>
                <el-form-item label="关联模型" prop="deviceId">
                    <el-select class="inputW" v-model="dataRow.deviceId" filterable allow-create
                        default-first-option placeholder="请选择">
                        <el-option v-for="item in mapDeviceList" :key="item.id" :label="item.poleCode"
                            :value="item.id" />
                    </el-select>
                    <el-button type="primary" size="small" @click="locationGltfAddModel">定位</el-button>
                </el-form-item>
                <el-form-item label="位置" prop="location">
                    <el-input v-model="dataRow.location" auto-complete="off" placeholder="请输入"/>
                </el-form-item>
                <el-form-item label="厂家" prop="manufacturer">
                    <el-input v-model="dataRow.manufacturer" auto-complete="off" placeholder="请输入"/>
                </el-form-item>
                <el-form-item label="备注" prop="desc">
                    <el-input v-model="dataRow.desc" auto-complete="off" placeholder="请输入备注"/>
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" size="small" @click="resetForm" v-show="saveType == 1">重置</el-button>
                    <el-button type="primary" size="small" @click="commitEventForm">保存</el-button>
                    <!-- <el-button type="primary" size="small" @click="lightSimulate">信号灯模拟</el-button> -->
                </el-form-item>
            </el-form>
            <div>
                <div v-if="mapType == 'cesium'" id="cesiumMap" ref="cesiumMap" style="width: calc(100vw-0px); height: calc(100vh - 205px);"></div>
                <MapScaleTool ref="mapScale"></MapScaleTool>
                <!-- <cesium-draw class="draw-viewer-box" ref="cesiumDrawRef" v-show="isStartEdit"  @dataSent="handleChildEmit"></cesium-draw> -->
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
//import Cesium from 'cesium';
window.Cesium = Cesium;
import { useStore } from 'vuex';
import env from "@/mapcore/env";
import MapScaleTool from "@/views/tool/MapScaleTool.vue";
import CesiumDraw from "@/components/cesiumDrawViewer.vue";
let mapScale = ref();
let { VITE_PUBLIC_PATH } = import.meta.env

import {
    trafficHldListByPage,
    addTrafficHld,
    updateTrafficHld,
    deleteTrafficHld,
    trafficPoleList,
    getTrafficPoleDataById,
    assetCrossingDataList,
    getCrossingDataByPoleId
} from "@/api/nt/asset-manage";
import {
    mapDeviceListByDeviceType
} from "@/api/map/map-device";
import { debug } from "console";

let searchObj = reactive({ name: "" });
let dialogTitle = ref("新增");
let addDialogVisible = ref(false);
let saveType = ref(1);
const crossDataList = ref([]);
const tableData = ref([]);
let currDevice = ref({});

const lightTypeList = ref([{"code":"1","name":"红绿灯"},{"code":"2","name":"计数器"}]);

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
const hadUrl = anbaoConfig.mapUrl.hadNoArrowLightUrl;//南通高精路网数据

// 默认每页数据量
let pagesize = ref(10);
// 当前页码
let currentPage = ref(1);
// 查询的页码
let start = ref(1);
// 默认数据总数
let totalCount = ref(1000);
let dataRow = reactive({ lightId:"", name: "", lightCode: "",lightType: "", desc:"", polygon: "", polygonCenter:"", poleId:"",deviceId:"",
                        location:"",manufacturer:"",crossId:""});
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
    lightCode: [{ required: true, message: "请输交通灯编码", trigger: "blur" }],
    poleId :  [{ required: true, message: "请选择所属设备杆", trigger: "blur" }],
    //polygon: [{ required: true, message: "请选择区域范围", trigger: "blur" }],
});

let addFormRef = ref<FormInstance>();
const roadDataList = ref([]);
const poleDataList = ref([]);
const mapDeviceList = ref([]);

onMounted(() => {
    getAssetCrossingDataList();
    getMapDeviceListByDeviceType();
    getTrafficPoleList();
    search();
});

// 搜索
const search = () => {
    getList(currentPage.value, pagesize.value);
};

const getList = (pageNum, pageSize) => {
    searchObj.pageNum = pageNum;
    searchObj.pageSize = pageSize;
    trafficHldListByPage(searchObj).then((response) => {
        tableData.value = response.data.list;
        console.log("tableData.value==",tableData.value);
        totalCount = response.number;
    });
};

const getTrafficPoleList= () => {
    trafficPoleList({"deviceTypeCode":"trafficpole"}).then((response) => {
        poleDataList.value = response.data;
    });
};

const getMapDeviceListByDeviceType= () => {
    mapDeviceListByDeviceType({"deviceTypeCode":"trafficpole"}).then((response) => {
        mapDeviceList.value = response.data;
        console.log("mapDeviceList===",mapDeviceList.value);
    });
};

const getAssetCrossingDataList= () => {
    assetCrossingDataList({}).then((response) => {
        crossDataList.value = response.data;
    });
};

const poleChangeTodeviceModel= (val) => {
    trafficPoleList({"poleId":val}).then((response) => {
        let poleOneDatas = response.data;
        let deviceOne = poleOneDatas[0].deviceList[0];
        dataRow.deviceId = deviceOne.id;
        currDevice = deviceOne;
        getCrossingDataChange(val);
    });
};

const getCrossingDataChange= (val) => {
    getCrossingDataByPoleId({"poleId":val}).then((response) => {
        let data = response.data;
        dataRow.polygon = data.polygon;
        dataRow.polygonCenter = data.polygonCenter;
        dataRow.crossId = data.crossId;
        addDialogVisible.value = true;
    });
};

const handleAdd = () => {
    dialogTitle.value = "新增";
    addDialogVisible.value = true;
    saveType.value = 1;
    resetForm();
};

const handleEdit = (index, row) => {
    console.log("row===",row);
    dialogTitle.value = "编辑";
    saveType.value = 2;
    initRowToObj(row);
    currDevice = ref({});
    poleChangeTodeviceModel(dataRow.poleId);
};
const initRowToObj = (row) => {
    dataRow.lightId = row.lightId;
    dataRow.name = row.name;
    dataRow.lightCode = row.lightCode;
    dataRow.lightType = row.lightType;
    dataRow.desc = row.desc;
    dataRow.poleId = row.poleId;
    dataRow.deviceId = row.deviceId;
    dataRow.location = row.location;
    dataRow.manufacturer = row.manufacturer;
};

const handleDelete = (index, row) => {
    ElMessageBox.confirm("此操作将永久删除该记录, 是否继续?", "提示", {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: "warning"
    })
        .then(() => {
            deleteTrafficHld({ lightId: row.lightId }).then((response) => {
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
                addTrafficHld(dataRow).then((response) => {
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
                updateTrafficHld(dataRow).then((response) => {
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
    done();
};

const resetForm = () => {
    dataRow = reactive({ lightId:"", name: "", lightCode: "",lightType: "", desc:"", polygon: "", polygonCenter:"", poleId:"",deviceId:"",
                location:"",manufacturer:"",crossId:""});
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

const formatterPoleId = (row, column, cellValue, index)=> {
    const poleId = row[column.property];
    let name = "";
    if (poleId) {
        let rData = poleDataList.value
        for (let i = 0; i < rData.length; i++) {
            if (rData[i].poleId == poleId) {
                name = rData[i].name;
            }
        }
    }
    return name;
};

const formatterLightType = (row, column, cellValue, index)=> {
    const type = row[column.property];
    let name = "";
    if (type) {
        let rData = lightTypeList.value
        for (let i = 0; i < rData.length; i++) {
            if (rData[i].code == type) {
                name = rData[i].name;
            }
        }
    }
    return name;
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
        //loadCurrDataRow();
        if(saveType.value == 2){
            let deArr = [];
            deArr.push(currDevice);
            loadCurrGltf(deArr);
        }
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
    if(saveType.value == 2){
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
        dataRow.polygon = JSON.stringify(data.points)
        dataRow.lineColor = data.lineColor
        dataRow.outlineColor = data.outlineColor
        dataRow.outlineWidth = data.outlineWidth
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

//按entities加载
const loadGltfEntityOne = function(itemObj){
    var position = Cesium.Cartesian3.fromDegrees(itemObj.lon,itemObj.lat,itemObj.alt)
    var modelEntity = viewer.entities.add({
        id: itemObj.id,
        name: itemObj.id,
        position: position,
        orientation:Cesium.Transforms.headingPitchRollQuaternion(
            position,
            new Cesium.HeadingPitchRoll( Cesium.Math.toRadians(itemObj.heading),  Cesium.Math.toRadians(itemObj.pitch),Cesium.Math.toRadians(itemObj.roll) )
        ) ,
        model: {
            uri: itemObj.url, // 模型文件路径
            minimumPixelSize: 128,
            maximumScale: 20000
        }
    });
}

//加载当前gltf==start
const loadCurrGltf = function(data){
    let currGltfArr = [];
    for(let i=0;i<data.length;i++){
        let obj = {};
        obj.id = data[i].id;
        obj.url = data[i].gltfPath;
        obj.lon = data[i].lon;
        obj.lat = data[i].lat;
        obj.alt = data[i].alt;
        obj.heading = data[i].heading;
        obj.pitch = data[i].pitch;
        obj.roll = data[i].roll;
        currGltfArr.push(obj);
    }
    currGltfArr.forEach(function (itemObj) {
        loadGltfOne(itemObj)
    });
}

//定位entity
const locationAddModel = () => {
    let id = currDevice.id;
    if (id) {
        let myModel = viewer.entities.getById(id);
        // 获取模型的材质
        if (myModel != null && myModel != undefined) {
            viewer.flyTo(myModel, {
                duration: 1,
                orientation: {
                    heading: Cesium.Math.toRadians(0),
                    pitch: Cesium.Math.toRadians(-90),
                    roll: 0.0,
                },
            });
        }
    }
};

//定位gltf
const locationGltfAddModel = () => {
    let id = currDevice.id;
    if (id) {
        let myModel;
        const pris = viewer.scene.primitives;
        pris._primitives.forEach(function (item, idx) {
            if(item.id == id){
                myModel = item;
            }
        })
        // 获取模型的材质
        if (myModel != null && myModel != undefined) {
            let caProperty = JSON.parse(currDevice.cameraProperty);
            viewer.camera.flyTo({
                destination: Cesium.Cartesian3.fromDegrees(caProperty.position[0],caProperty.position[1],caProperty.position[2]),
                orientation: {
                    heading: caProperty.heading,
                    pitch: caProperty.pitch,
                    roll: caProperty.roll
                },
                complete:function callback() {
                    // 定位完成之后的回调函数
                }
            });
        }
    }
};

/*
** 加载gltf
*/
const loadGltfOne = function(itemObj){
    var position = Cesium.Cartesian3.fromDegrees(itemObj.lon,itemObj.lat,itemObj.alt)
    var hpr = new Cesium.HeadingPitchRoll( Cesium.Math.toRadians(itemObj.heading),  Cesium.Math.toRadians(itemObj.pitch),Cesium.Math.toRadians(itemObj.roll) );  // 设置方向角
    var modelMatrix1 = Cesium.Transforms.headingPitchRollToFixedFrame(
        position,
        hpr
    );
    var model = viewer.scene.primitives.add(Cesium.Model.fromGltf({//fromGltfAsync
        id: itemObj.id,
        url: itemObj.url, 
        modelMatrix: modelMatrix1,
        scale: 1.0     //放大倍数
    }));
}

//信号灯组数
let groupDengNum=3;
//模拟
const lightSimulate = () => {// currDevice--当前模型数据
    let id = currDevice.id;
    let modelObj;
    const pris = viewer.scene.primitives;
    pris._primitives.forEach(function (item, idx) {
        if(item.id == id){
            modelObj = item;
        }
    })

    //changeHld(modelObj);//红路灯变化
    //changeJianShiQi(modelObj);//监视器数变化
    changeJianShiQiDynamicLink(modelObj);//监视器数和灯动态联动
};

/**
 * 更改模型的纹理贴图
 *
 * @param modelObj 模型对象
 * @returns 无返回值
 */
const changeHld = (modelObj) => {
  const _baseColorTextureMap = _getChdModel(modelObj);
  // 当模型加载完成后执行
  modelObj.readyPromise.then(function (model) {

    //setXinHaoDengState("lvdeng", _baseColorTextureMap, model);
    let count = 0;
    let hldTimer = setInterval(function () {
        count = count + 1;
        setXinHaoHeiDeng(_baseColorTextureMap, model);
        let type = count % groupDengNum;
        switch (type) {
            case 0:
                for(let m=1;m<groupDengNum;m++){
                    setXinHaoDengState("hongdeng"+m, _baseColorTextureMap, model);
                }
                break;
            case 1:
                for(let n=1;n<groupDengNum;n++){
                    setXinHaoDengState("huangdeng"+n, _baseColorTextureMap, model);
                }
                break;
            default:
                for(let k=1;k<groupDengNum;k++){
                    setXinHaoDengState("lvdeng"+k, _baseColorTextureMap, model);
                }
        }
    }, 2000);
  })
}

const _getChdModel = (model) => {
    let _baseColorTextureMap = {}; //子模型map
    let childModelArrs = model._sceneGraph._components.nodes; //获取当前模型的子模型数组
    childModelArrs.forEach(function (item, idx) {
        let name = item.name;
        let primitive = item.primitives[0];
        let material = primitive.material;
        let baseColorTexture = material.metallicRoughness.baseColorTexture;
        _baseColorTextureMap[name] = baseColorTexture;
        switch (name) {
            case "D1_1":
                _baseColorTextureMap["hongdeng1"] = baseColorTexture;
                break;
            case "D1_2":
                _baseColorTextureMap["huangdeng1"] = baseColorTexture;
                break;
            case "D1_3":
                _baseColorTextureMap["lvdeng1"] = baseColorTexture;
                break;
            case "D2_1":
                _baseColorTextureMap["hongdeng2"] = baseColorTexture;
                break;
            case "D2_2":
                _baseColorTextureMap["huangdeng2"] = baseColorTexture;
                break;
            case "D2_3":
                _baseColorTextureMap["lvdeng2"] = baseColorTexture;
                break;
            case "J1_1":
                _baseColorTextureMap["tens"] = baseColorTexture; // 十位
                break;
            case "J1_2":
                _baseColorTextureMap["ones"] = baseColorTexture; // 个位
                break;
            default:
                break;
        }
    });
  return _baseColorTextureMap;
}

/**
 * 获取模型中的子模型纹理贴图
 *
 * @param model 模型对象
 * @returns 子模型纹理贴图
 */
const _getChdModel_bak = (model) => {
  let _baseColorTextureMap = {};
  const _pickObjects = model._pipelineResources[0]._pickObjects;
  for (let key of Object.keys(_pickObjects)) {
    //console.log(key, _pickObjects[key]);
    let _pickObject = _pickObjects[key];
    if(!_pickObject.detail){
        continue;
    }
    let node = _pickObject.detail.primitive.node;
    let name = node.name;
    console.log(name);
    let primitive = node.primitives[0];
    let material = primitive.material;
    let baseColorTexture = material.metallicRoughness.baseColorTexture;
    _baseColorTextureMap[name] = baseColorTexture;

    switch (name) {
      case "D1_1":
        _baseColorTextureMap["hongdeng1"] = baseColorTexture;
        break;
      case "D1_2":
        _baseColorTextureMap["huangdeng1"] = baseColorTexture;
        break;
      case "D1_3":
        _baseColorTextureMap["lvdeng1"] = baseColorTexture;
        break;
      case "D2_1":
        _baseColorTextureMap["hongdeng2"] = baseColorTexture;
        break;
      case "D2_2":
        _baseColorTextureMap["huangdeng2"] = baseColorTexture;
        break;
      case "D2_3":
        _baseColorTextureMap["lvdeng2"] = baseColorTexture;
        break;  
      case "J1_1":
        _baseColorTextureMap["tens"] = baseColorTexture; // 十位
        break;
      case "J1_2":
        _baseColorTextureMap["ones"] = baseColorTexture; // 个位
        break;
      default:
        break;
    }
  }
  return _baseColorTextureMap;
}
/**
 * 设置信号灯为黑色
 *
 * @param dengpianObj 信号灯对象
 * @param model 模型对象
 */
const setXinHaoHeiDeng = (dengpianObj, model) => {
    let dengArr = ["hongdeng","huangdeng","lvdeng"];
    for(let i=1;i<groupDengNum;i++){
        for(let j=0;j<dengArr.length;j++){
            const baseColorTextureD = dengpianObj[dengArr[j]+i];
            let newTextureUrl = VITE_PUBLIC_PATH+'/static/data/xinghaodeng/heideng.jpg';
            var resource = new Cesium.Resource({ url: newTextureUrl });
            resource.fetchImage().then(function (image) {
                var context =viewer.scene.context;
                var newTexture = new Cesium.Texture({
                context: context,
                source: image
                });
                baseColorTextureD.texture = newTexture;
                model._texturesLoaded = true;
                viewer.scene.requestRender();
            });
        }
    }
}

/**
 * 设置信号灯状态
 *
 * @param state 信号灯状态，可选值为 'hongdeng'（红灯）、'huangdeng'（黄灯）、'lvdeng'（绿灯）
 * @param dengpianObj 信号灯面板对象，包含不同颜色灯的图片资源
 * @param model 3D 模型对象
 */
const setXinHaoDengState = (state, dengpianObj, model) => {
  let baseColorTexture = null;
  let newTextureUrl = VITE_PUBLIC_PATH+'static/data/xinghaodeng/';
  switch (state) {
    case "hongdeng1":
      newTextureUrl = newTextureUrl + "hongdeng.jpg"
      baseColorTexture = dengpianObj.hongdeng1;
      break;
    case "huangdeng1":
      newTextureUrl = newTextureUrl + "huangdeng.jpg"
      baseColorTexture = dengpianObj.huangdeng1;
      break;
    case "lvdeng1":
      newTextureUrl = newTextureUrl + "lvdeng.jpg"
      baseColorTexture = dengpianObj.lvdeng1;
      break;
    case "hongdeng2":
      newTextureUrl = newTextureUrl + "hongdeng.jpg"
      baseColorTexture = dengpianObj.hongdeng2;
      break;
    case "huangdeng2":
      newTextureUrl = newTextureUrl + "huangdeng.jpg"
      baseColorTexture = dengpianObj.huangdeng2;
      break;
    case "lvdeng2":
      newTextureUrl = newTextureUrl + "lvdeng.jpg"
      baseColorTexture = dengpianObj.lvdeng2;
      break;
    default:
      break;
  }
  var resource = new Cesium.Resource({ url: newTextureUrl });
  resource.fetchImage().then(function (image) {
    var context = viewer.scene.context;
    var newTexture =new Cesium.Texture({
      context: context,
      source: image
    });
    baseColorTexture.texture = newTexture;
    model._texturesLoaded = true;
    viewer.scene.requestRender();
  });
}


const changeJianShiQi = (modelObj) => {
  const _baseColorTextureMap = _getChdModel(modelObj);
  // 当模型加载完成后执行
  modelObj.readyPromise.then(function (model) {
    console.log('Model loaded successfully');

    let count = 0;
    let currentSecond = 30;
    let JianShiQiTimer = setInterval(function () {
        if (currentSecond < 0) {
            currentSecond = 30;
        }
        // 设置监视器显示秒数
        setJSQState(_baseColorTextureMap, model, currentSecond);
        currentSecond--;
    }, 1000);
  })
}

/**
 * 设置信号灯状态
 *
 * @param state 信号灯状态，可选值为 'hongdeng'（红灯）、'huangdeng'（黄灯）、'lvdeng'（绿灯）
 * @param dengpianObj 信号灯面板对象，包含不同颜色灯的图片资源
 * @param model 3D 模型对象
 */
const setJSQState = (dengpianObj, model, sencond) => {
    let texUrlType = "lv";
    if (sencond <= 10) {
        texUrlType = "hong";
    }

    let tens_num = Math.floor(sencond / 10);
    let ones_num = sencond % 10;
    console.log("十位/个位",tens_num,ones_num);
    
    let newTextureUrl = VITE_PUBLIC_PATH+'static/data/xinghaodeng/';
    
    let tenTextureUrl = newTextureUrl+texUrlType+tens_num+".jpg";
    let tensBaseColorTexture = dengpianObj.tens;

    let onesTextureUrl = newTextureUrl+texUrlType+ones_num+".jpg";
    let onesBaseColorTexture = dengpianObj.ones;
  
    var resourceTens = new Cesium.Resource({ url: tenTextureUrl });
    resourceTens.fetchImage().then(function (image) {
        var context = viewer.scene.context;
        var newTexture =new Cesium.Texture({
            context: context,
            source: image,
            flipY : false
        });
        tensBaseColorTexture.texture = newTexture;
        model._texturesLoaded = true;
        viewer.scene.requestRender();
    });

    var resourceones = new Cesium.Resource({ url: onesTextureUrl });
    resourceones.fetchImage().then(function (image) {
        var context = viewer.scene.context;
        var newTexture =new Cesium.Texture({
            context: context,
            source: image,
            flipY : false
        });
        onesBaseColorTexture.texture = newTexture;
        model._texturesLoaded = true;
        viewer.scene.requestRender();
    });
}

//监视器计数-动态联动
const changeJianShiQiDynamicLink = (modelObj) => {
    console.log("modelObj==",modelObj);
  const _baseColorTextureMap = _getChdModel(modelObj);
  // 当模型加载完成后执行
  modelObj.readyPromise.then(function (model) {
    console.log('Model loaded successfully');

    let hlSecondArr = [20,5,30];//红灯、黄灯、绿
    let texUrlType = "hong";
    let currentSecond = 0;
    let sIndex = 0;
    let tempSecond = 0;
    let JianShiQiTimer2 = setInterval(function () {
        console.log("tempSecond==currentSecond==",tempSecond,currentSecond);
        if(tempSecond==55){
            tempSecond = 0;
        }
        if(tempSecond == 0){
            sIndex =0;
            currentSecond = hlSecondArr[sIndex];
            texUrlType = "hong";
            tempSecond =0;
            const _baseColorTextureMap = _getChdModel(modelObj);
            setXinHaoHeiDeng(_baseColorTextureMap, model);
            for(let m=1;m<groupDengNum;m++){
                setXinHaoDengState("hongdeng"+m, _baseColorTextureMap, model);
            }
        }else if(tempSecond==20){
            sIndex =1;
            currentSecond = hlSecondArr[sIndex];
            texUrlType = "hong";
            const _baseColorTextureMap = _getChdModel(modelObj);
            setXinHaoHeiDeng(_baseColorTextureMap, model);
            for(let n=1;n<groupDengNum;n++){
                setXinHaoDengState("huangdeng"+n, _baseColorTextureMap, model);
            }
        }else if(tempSecond==25){
            sIndex =2;
            currentSecond = hlSecondArr[sIndex];
            texUrlType = "lv";
            const _baseColorTextureMap = _getChdModel(modelObj);
            setXinHaoHeiDeng(_baseColorTextureMap, model);
            for(let k=1;k<groupDengNum;k++){
                setXinHaoDengState("lvdeng"+k, _baseColorTextureMap, model);
            }
        }
        // 设置监视器显示秒数
        setJSQStateDynamic (_baseColorTextureMap, model, currentSecond,texUrlType);
        currentSecond--;
        tempSecond++;
    }, 1000);
  })
}

//设置监视器动态
const setJSQStateDynamic = (dengpianObj, model, sencond, texUrlType) => {
    let tens_num = Math.floor(sencond / 10);
    let ones_num = sencond % 10;
    console.log("十位/个位",tens_num,ones_num);
    
    let newTextureUrl = VITE_PUBLIC_PATH+'static/data/xinghaodeng/';
    
    let tenTextureUrl = newTextureUrl+texUrlType+tens_num+".jpg";
    let tensBaseColorTexture = dengpianObj.tens;

    let onesTextureUrl = newTextureUrl+texUrlType+ones_num+".jpg";
    let onesBaseColorTexture = dengpianObj.ones;
  
    var resourceTens = new Cesium.Resource({ url: tenTextureUrl });
    resourceTens.fetchImage().then(function (image) {
        var context = viewer.scene.context;
        var newTexture =new Cesium.Texture({
            context: context,
            source: image,
            flipY : false
        });
        tensBaseColorTexture.texture = newTexture;
        model._texturesLoaded = true;
        viewer.scene.requestRender();
    });

    var resourceones = new Cesium.Resource({ url: onesTextureUrl });
    resourceones.fetchImage().then(function (image) {
        var context = viewer.scene.context;
        var newTexture =new Cesium.Texture({
            context: context,
            source: image,
            flipY : false
        });
        onesBaseColorTexture.texture = newTexture;
        model._texturesLoaded = true;
        viewer.scene.requestRender();
    });
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
.inputW{
    width: 160px;
}
</style>

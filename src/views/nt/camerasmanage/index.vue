<template>
    <div>
        <div>
            <el-form :inline="true">
                <el-row>
                    <el-col :span="6">
                        <el-form-item label="摄像头名称">
                            <el-input v-model.trim="searchObj.name" type="text" placeholder="请输入摄像头名称" />
                        </el-form-item>
                    </el-col>
                    <el-col :span="6">
                        <el-form-item label="状态">
                            <el-select v-model="searchObj.collStatus" filterable allow-create
                                default-first-option placeholder="请选择">
                                <el-option v-for="item in collStatusVerifyDict" :key="item.code" :label="item.name"
                                    :value="item.code"></el-option>
                            </el-select>
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
                <el-table-column prop="crossId" label="所属路口" width="200" :formatter='formatterCrossId'/>
                <el-table-column prop="poleId" label="所属设备杆" width="200" :formatter='formatterPoleId'/>
                <el-table-column prop="name" label="摄像头名称" width="200" />
                <el-table-column prop="gbIndexCode" label="国标编号" width="200"/>
                <!-- <el-table-column prop="transTypeName" label="协议类型" width="120"/> -->
                <el-table-column prop="deviceCode" label="摄像头编码" width="200"/>
                <el-table-column prop="infoSource" label="数据来源" width="150" :formatter='formatterInfoSource'/>
                <el-table-column prop="collStatus" label="状态" width="150">
                    <template #default="scope">
                        <span :class="scope.row.collStatus == 1 ? 'claColor1' : 'claColor2'">{{ dictNameFormat(scope.row.collStatus
                        , 'collStatusDict') }}</span>
                    </template>
                </el-table-column>
                <el-table-column prop="modifyTime" width="160" label="更新时间"  :formatter="formatDate" />

                <el-table-column label="操作" fixed="right" align="center">
                    <template #default="scope">
                        <el-button link type="primary" size="small" @click="handleEdit(scope.$index, scope.row)"><i
                                class="iconfont">&#xe732;</i> 编辑</el-button>
                        <el-button link type="primary" size="small" @click="handleDelete(scope.$index, scope.row)"><i
                                class="iconfont">&#xe74e;</i> 删除</el-button>
                        <el-button type="text" size="medium" @click="handleVerify(scope.$index, scope.row)" :disabled="scope.row.collStatus != 1">审批</el-button>
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
                        <el-option v-for="item in poleDataList" :key="item.poleId" :label="item.name+'('+item.poleCode+')'"
                            :value="item.poleId"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="所属路口" prop="">
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
                <el-form-item label="摄像头名称" prop="name">
                    <el-input v-model="dataRow.name" auto-complete="off" placeholder="请输入摄像头名称" />
                </el-form-item>
                <el-form-item label="国标编号" prop="">
                    <el-input v-model="dataRow.gbIndexCode" auto-complete="off" placeholder="请输入国标编号"/>
                </el-form-item>
                <el-form-item label="摄像头编码" prop="deviceCode">
                    <el-input v-model="dataRow.deviceCode" auto-complete="off" placeholder="请输入摄像头编码"/>
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

        <el-dialog :title="dialogTitle" v-model="verifyDialogVisible" :before-close="handleDialogBeforeClose"
            :close-on-click-modal="false" custom-class="dialogCustomWidthVerify">
            <el-form ref="verifyFormRef" :inline="true" label-width="160px" size="mini" :rules="rules" :model="verifyRow"
                class="">
                <el-form-item label="审批意见" prop="collStatus">
                <el-radio-group v-model="verifyRow.collStatus" v-for="item in collStatusVerifyDict" :key="item.code">
                    <el-radio :label="item.code" style="margin-right:30px;">{{ item.name }}</el-radio>
                </el-radio-group>
                </el-form-item>
                <el-form-item label="描述">
                <el-input type="textarea" style="width:340px;" :rows="4" placeholder="请输入描述" v-model="verifyRow.desc">
                </el-input>
                </el-form-item>
            </el-form>

            <template #footer>
                <el-button type="primary" @click="cancleFormFactorVerify">取消</el-button>
                <el-button type="primary" @click="commitEventFactorVerify('culvertFormRef')">确定</el-button>
            </template>
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
    assetCamerasListByPage,
    addAssetCameras,
    updateAssetCameras,
    deleteAssetCameras,
    verifyAssetCamerasCommit,
    assetCrossingDataList,
    getCrossingDataById,
    trafficPoleList,
    getCrossingDataByPoleId
} from "@/api/nt/asset-manage";
import {
    mapDeviceListByDeviceType
} from "@/api/map/map-device";
import { debug } from "console";

let searchObj = reactive({ name: "", collStatus:"" });
let dialogTitle = ref("新增");
let addDialogVisible = ref(false);
let saveType = ref(1);
const tableData = ref([]);
let currDevice = ref({});

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
let dataRow = reactive({ cameraIndexCode:"", name: "", gbIndexCode: "", desc:"", polygon: "", polygonCenter:"", crossId:"",deviceId:"",deviceType:"",
                        deviceCode:"",poleId:"",location:"",manufacturer:""});
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
    gbIndexCode: [{ required: true, message: "请输国标编号", trigger: "blur" }],
    crossId :  [{ required: true, message: "请选择所属路口", trigger: "blur" }],
    collStatus: [{ required: true, message: '请选择审批意见', trigger: 'blur' }],
    //polygon: [{ required: true, message: "请选择区域范围", trigger: "blur" }],
});

let addFormRef = ref<FormInstance>();
const roadDataList = ref([]);
const crossDataList = ref([]);
const mapDeviceList = ref([]);
const poleDataList = ref([]);
const infoSourceList = ref([{"code":1,"name":"专用车采"},{"code":2,"name":"app采集"}]);
const collStatusList = ref([{"code":1,"name":"待审核"},{"code":2,"name":"审核通过"},{"code":3,"name":"审核驳回"},{"code":3,"name":"废弃"}]);
const collStatusVerifyDict = ref([{code:2,name:'通过'},{code:3,name:'驳回'},{code:4,name:'废弃'}]);
const verifyDialogVisible = ref(false);
let verifyFormRef = ref<FormInstance>();
let verifyRow = reactive({ cameraIndexCode:"", collStatus:"", desc: ""});

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
    assetCamerasListByPage(searchObj).then((response) => {
        tableData.value = response.data.list;
        totalCount = response.number;
    });
};

const getAssetCrossingDataList= () => {
    assetCrossingDataList({}).then((response) => {
        crossDataList.value = response.data;
    });
};

const getMapDeviceListByDeviceType= () => {
    mapDeviceListByDeviceType({"deviceTypeCodeList":["camera","cameraPoleTemplate","cameraTemplate"]}).then((response) => {
        mapDeviceList.value = response.data;
    });
};

const getTrafficPoleList= () => {
    trafficPoleList({"deviceTypeCodeList":["camera","cameraPoleTemplate","cameraTemplate"]}).then((response) => {
        poleDataList.value = response.data;
    });
};

const poleChangeTodeviceModel= (val) => {
    trafficPoleList({"poleId":val}).then((response) => {
        let poleOneDatas = response.data;
        let deviceOne = poleOneDatas[0].deviceList[0];
        dataRow.deviceId = deviceOne.id;
        dataRow.deviceType = deviceOne.deviceType;
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
    dialogTitle.value = "编辑";
    saveType.value = 2;
    initRowToObj(row);
    currDevice = ref({});
    currDevice = row.deviceList[0]
    if(dataRow.crossId){
        getCrossingDataById({"crossId":dataRow.crossId}).then((response) => {
            let data = response.data;
            dataRow.polygon = data.polygon;
            dataRow.polygonCenter = data.polygonCenter;
            addDialogVisible.value = true;
        });
    }else{
        addDialogVisible.value = true;
    }
};
const initRowToObj = (row) => {
    dataRow.cameraIndexCode = row.cameraIndexCode;
    dataRow.name = row.name;
    dataRow.gbIndexCode = row.gbIndexCode;
    dataRow.desc = row.desc;
    dataRow.crossId = row.crossId;
    dataRow.deviceId = row.deviceId;
    dataRow.location = row.location;
    dataRow.manufacturer = row.manufacturer;
    dataRow.deviceCode = row.deviceCode;
    dataRow.poleId = row.poleId;
    
};

const handleDelete = (index, row) => {
    ElMessageBox.confirm("此操作将永久删除该记录, 是否继续?", "提示", {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: "warning"
    })
        .then(() => {
            deleteAssetCameras({ cameraIndexCode: row.cameraIndexCode }).then((response) => {
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
                console.log("dataRow===aaadddd",dataRow);
                // 新增
                addAssetCameras(dataRow).then((response) => {
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
                updateAssetCameras(dataRow).then((response) => {
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
    dataRow = reactive({ cameraIndexCode:"", name: "", gbIndexCode: "", desc:"", polygon: "", polygonCenter:"", crossId:"",deviceId:"",deviceType:"",
                        deviceCode:"",poleId:"",location:"",manufacturer:""});
    verifyRow = reactive({ cameraIndexCode:"", collStatus:"", desc: ""});
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
    searchObj.collStatus = "";
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

const formatterCrossId = (row, column, cellValue, index)=> {
    const crossId = row[column.property];
    let name = "";
    if (crossId) {
        let rData = crossDataList.value
        for (let i = 0; i < rData.length; i++) {
            if (rData[i].crossId == crossId) {
                name = rData[i].name;
            }
        }
    }
    return name;
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
const formatterInfoSource= (row, column, cellValue, index)=> {
    const cloV = row[column.property];
    let name = "";
    if (cloV) {
        let rData = infoSourceList.value
        for (let i = 0; i < rData.length; i++) {
            if (rData[i].code == cloV) {
                name = rData[i].name;
            }
        }
    }
    return name;
};
const formatterCollStatus= (row, column, cellValue, index)=> {
    const cloV = row[column.property];
    let name = "";
    if (cloV) {
        let rData = collStatusList.value
        for (let i = 0; i < rData.length; i++) {
            if (rData[i].code == cloV) {
                name = rData[i].name;
            }
        }
    }
    return name;
};
const dictNameFormat = (code, dictName) => {
    let name = "";
    if (code) {
        let rData = collStatusList.value
        for (let i = 0; i < rData.length; i++) {
            if (rData[i].code == code) {
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

const handleVerify = (index, row) => {
    dialogTitle.value = '执行审批'
    verifyDialogVisible.value = true
    saveType.value = 4
    verifyRow.cameraIndexCode = row.cameraIndexCode;
    verifyRow.desc = row.desc;
};

const cancleFormFactorVerify= function(){
    verifyDialogVisible.value = false
    nextTick(() => {
        verifyFormRef.value.clearValidate();
    });
}
const commitEventFactorVerify= function(){
    verifyFormRef.value.validate((isValid) => {
        if (isValid) {
        verifyAssetCamerasCommit(verifyRow).then(res => {
            if (res.status == 200) {
                ElMessage({
                    type: 'success',
                    message: '操作成功!'
                })
                verifyDialogVisible.value = false
                search()
            } else {
                ElMessage({
                    type: 'info',
                    message: '操作失败!'
                })
            }
        })
        } else {
            console.log('error submit!!')
            return false
        }
    })
}

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
    if(saveType.value == 2 && dataRow.polygonCenter){
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
dialogCustomWidthVerify {
  margin-top: 1vh;
  width: 30%;
  border: 1px solid #2f84ee;
}
.claColor1 {
  color: #eab92c;
}

.claColor2 {
  color: #60e51e;
}
</style>

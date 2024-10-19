<template>
    <div>
        <!-- search filter -->
        <el-row class="d2-mb search-form">
            <el-form :inline="true">
                <el-row>
                    <el-col :span="8">
                        <el-form-item label="设备编号">
                            <el-input v-model.trim="searchObj.deviceCode" type="text" placeholder="请输入设备编号" />
                        </el-form-item>
                    </el-col>
                    <el-col :span="16" class="btn-textright">
                        <!-- <el-button @click="search" v-permission="'mecdata:list'"
              >查询</el-button
            > -->
                        <!-- <el-button type="primary" @click="handleAdd" size="mini"
                    >新增</el-button
                  >-->
                        <el-button type="primary" @click="handleDeleteofSelected">批量删除
                        </el-button>
                        <el-button type="primary" @click="handleExport">导出 </el-button>
                        <el-button type="primary" @click="handleAdd">添加 </el-button>
                        <el-button type="primary" @click="search">查询 </el-button>
                    </el-col>
                </el-row>
            </el-form>
        </el-row>

        <el-container class="mainbox">
            <el-aside class="left-box">
                <div class="textH2">设备类型({{ deviceTypeTreeData.length }})</div>
                <div class="left-tree">
                    <el-tree class="tree-box" ref="deviceTypeTree" :data="deviceTypeTreeData" :props="defaultProps"
                        node-key="code" :default-expanded-keys="['1000']" highlight-current @node-click="clickNode">
                    </el-tree>
                </div>
            </el-aside>
            <el-main class="right-box">
                <!-- 结果返回列表 -->
                <div class="textH2" style="padding-left: 24px">设备列表：</div>
                <div class="table-box">
                    <el-table :data="tableData" ref="deviceRef" @selection-change="handleSelectionChange">
                        <el-table-column type="selection" width="55" />
                        <el-table-column type="index" label="序号" width="100" />
                        <el-table-column prop="deviceCode" label="设备编号" width="200" />
                        <!-- <el-table-column prop="deviceType" label="设备类别" width="150"/> -->
                        <el-table-column prop="objPath" label="OBJ模型" />
                        <el-table-column prop="gltfPath" label="GLTF模型" />
                        <el-table-column prop="raodLocation" label="位置" />
                        <!-- <el-table-column prop="status" label="设备状态" /> -->
                        <!-- <el-table-column prop="effectiveRadius" label="有效距离" /> -->

                        <el-table-column label="操作" fixed="right" align="center" min-width="240">
                            <template #default="scope">

                                <el-upload ref="upload" class="upload-demo inline-block"
                                    action="https://jsonplacehoder.typeicon.com/posts/" :show-file-list="false"
                                    :on-preview="handlePreview" :on-remove="handleRemove" :auto-upload="true"
                                    :before-upload="(file) => beforeUpload(file, scope.$index, scope.row)"
                                    :on-success="onSuccess">
                                    <el-tooltip class="box-item" effect="dark"
                                        content="只能上传zip文件，并且zip文件中是同名文件夹，例如：20595885.zip>20595885>test.obj"
                                        placement="top">
                                        <el-button type="text"
                                            style="font-size:12px;font-weight:500;margin-right: 10px;">上传</el-button>
                                    </el-tooltip>
                                </el-upload>
                                <el-button type="text" size="small" @click="handleEdit(scope.$index, scope.row)"><i
                                        class="iconfont">&#xe732;</i> 编辑
                                </el-button>
                                <el-button type="text" size="small" @click="handleDelete(scope.$index, scope.row)"><i
                                        class="iconfont">&#xe74e;</i> 删除
                                </el-button>
                            </template>

                        </el-table-column>




                    </el-table>

                    <div align="right">
                        <el-pagination :current-page="currentPage" :page-sizes="[10, 20, 30, 40]" :page-size="pagesize"
                            layout=" prev, pager, next" :total="totalCount" @size-change="handleSizeChange"
                            @current-change="handleCurrentChange" />
                    </div>
                </div>
            </el-main>
        </el-container>

        <!-- new and edit -->
        <el-dialog :title="dialogTitle" v-model="addDialogVisible" :before-close="handleDialogBeforeClose"
            :close-on-click-modal="false">
            <el-divider content-position="center">设备基本信息</el-divider>
            <el-form ref="addFormRef" :inline="true" label-width="190px" size="mini" :rules="rules" :model="dataRow"
                class="dialogElForm">
                <el-form-item label="设备编号" prop="deviceCode">
                    <el-input v-model="dataRow.deviceCode" auto-complete="off" placeholder="请输入设备编号" />
                </el-form-item>
                <el-form-item label="设备类型" prop="deviceType">
                    <el-select class="inputW" v-model="dataRow.deviceType" style="width: 100%" filterable allow-create
                        size="mini" default-first-option placeholder="请选状态">
                        <el-option v-for="item in options.deviceTypeOption" :key="item.code" :label="item.name"
                            :value="item.code"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="序列号" prop="serialNumber">
                    <el-input v-model="dataRow.serialNumber" auto-complete="off" placeholder="请输入设备序列号" />
                </el-form-item>
                <el-form-item label="品牌" prop="brand">
                    <el-input v-model="dataRow.brand" auto-complete="off" placeholder="请输入设备品牌" />
                </el-form-item>
                <el-divider content-position="center">设备位置信息</el-divider>
                <el-form-item label="立杆编号" prop="poleCode">
                    <el-input v-model="dataRow.poleCode" auto-complete="off" placeholder="请输入立杆编号" />
                </el-form-item>
                <!-- <el-form-item label="所属MEC" prop="connectMec">
                    <el-input v-model="dataRow.connectMec" auto-complete="off" placeholder="请输入所属MEC" />
                </el-form-item> -->
                <!-- <el-form-item label="朝向" prop="orientation">
                    <el-input v-model="dataRow.orientation" auto-complete="off" placeholder="请输入朝向">
                        <template #append>
                            <el-button :icon="MapLocation" @click="locationMap" />
                        </template>
                    </el-input>
                </el-form-item> -->
                <el-form-item label="道路上位置" prop="roadLoction">
                    <el-input v-model="dataRow.roadLoction" auto-complete="off" placeholder="请输入道路上位置" />
                </el-form-item>
                <el-form-item label="经度" prop="lon">
                    <el-input v-model="dataRow.lon" auto-complete="off" placeholder="请输入经度">
                        <!-- <template #append>
                            <el-button-group>
                                <el-button type="primary" :icon="MapLocation" @click="locationMap" circle />
                            </el-button-group>
                        </template> -->
                    </el-input>
                </el-form-item>
                <el-form-item label="纬度" prop="lat">
                    <el-input v-model="dataRow.lat" auto-complete="off" placeholder="请输入纬度">
                    </el-input>
                </el-form-item>
                <el-form-item label="高程" prop="alt">
                    <el-input v-model="dataRow.alt" auto-complete="off" placeholder="请输入高程">
                        <template #append>
                            <el-button-group>
                                <el-button type="primary" :icon="Location" @click="locationCesiumMap" circle />
                            </el-button-group>
                        </template>
                    </el-input>
                </el-form-item>
                <el-form-item label="旋转角度" prop="heading">
                    <el-input v-model="dataRow.heading" auto-complete="off">
                    </el-input>
                </el-form-item>
                <el-form-item label="俯仰角度" prop="pitch">
                    <el-input v-model="dataRow.pitch" auto-complete="off" />
                </el-form-item>
                <el-form-item label="滚动角度" prop="roll">
                    <el-input v-model="dataRow.roll" auto-complete="off" />
                </el-form-item>
                <!-- <el-divider content-position="center">设备网络信息</el-divider>
                <el-form-item label="设备IP" prop="ip">
                    <el-input v-model="dataRow.ip" auto-complete="off" placeholder="请输入设备IP" />
                </el-form-item>
                <el-form-item label="掩码" prop="mask">
                    <el-input v-model="dataRow.mask" auto-complete="off" placeholder="请输入掩码" />
                </el-form-item>
                <el-form-item label="网关" prop="gateway">
                    <el-input v-model="dataRow.gateway" auto-complete="off" placeholder="请输入网关" />
                </el-form-item>
                <el-form-item label="服务地址" prop="serverConnect">
                    <el-input v-model="dataRow.serverConnect" auto-complete="off" placeholder="请输入服务地址" />
                </el-form-item> -->
            </el-form>

            <template #footer>
                <span class="dialog-footer">
                    <el-button type="primary" size="small" @click="resetForm">重置</el-button>
                    <el-button type="primary" size="small" @click="commitEventForm">保存</el-button>
                </span>
            </template>

        </el-dialog>
        <!-- select map location -->
        <el-dialog title="地图" v-model="mapDialogVisible" :fullscreen="true" @open="mapOpenCallback">
            <div>
                <el-form :inline="true" v-model="dataRow">
                    <el-form-item label="经度" prop="lon">
                        <el-input v-model="dataRow.lon" auto-complete="off" type="number" step="0.0001"
                            @change="changeOffset" />
                    </el-form-item>
                    <el-form-item label="纬度" prop="lat">
                        <el-input v-model="dataRow.lat" auto-complete="off" type="number" step="0.0001"
                            @change="changeOffset" />
                    </el-form-item>
                    <el-form-item label="高程" prop="ele">
                        <el-input v-model="dataRow.alt" auto-complete="off" type="number" step="0.0001"
                            @change="changeOffset" />
                    </el-form-item>
                    <!-- <el-form-item label="朝向" prop="orientation">
                        <el-input v-model="modelObj.orientation" auto-complete="off" />
                    </el-form-item> -->
                    <el-form-item label="旋转角度(heading)" prop="heading">
                        <el-input v-model="dataRow.heading" auto-complete="off" type="number" step="0.0001"
                            @change="changeOffset" />
                    </el-form-item>
                    <el-form-item label="俯仰角度(pitch)" prop="pitch">
                        <el-input v-model="dataRow.pitch" auto-complete="off" type="number" step="0.0001"
                            @change="changeOffset" />
                    </el-form-item>
                    <el-form-item label="滚动角度(roll)" prop="roll">
                        <el-input v-model="dataRow.roll" auto-complete="off" type="number" step="0.0001"
                            @change="changeOffset" />
                    </el-form-item>
                    <el-form-item label="相机参数" prop="cameraProperty">
                        <el-input v-model="dataRow.cameraProperty" auto-complete="off" />
                    </el-form-item>
                    <el-form-item>
                        <el-button type="primary" size="small" @click="locationAddModel">定位</el-button>
                        <el-button type="primary" size="small" @click="openControl"
                            v-if="mapType == 'minedata'">开启</el-button>
                        <el-button type="primary" size="small" @click="closeControl"
                            v-if="mapType == 'minedata'">关闭</el-button>
                        <el-button type="primary" size="small" @click="addModelLocation">确定</el-button>
                    </el-form-item>
                </el-form>
            </div>
            <div v-if="mapType == 'minedata'" id="selectMap" style="width: calc(100vw-0px); height: calc(100vh - 165px);">
            </div>
            <div v-if="mapType == 'cesium'" id="cesiumMap" ref="cesiumMap"
                style="width: calc(100vw-0px); height: calc(100vh - 205px);"></div>
        </el-dialog>

    </div>
</template>

<script lang="ts" setup>
import { reactive, toRaw, toRefs, ref, nextTick, onMounted } from "vue";
import { ElMessage, ElMessageBox } from "element-plus";
import type { FormInstance, FormRules } from 'element-plus'
import { MapLocation, Location } from '@element-plus/icons-vue'
import moment from "moment";
import "cesium/Build/Cesium/Widgets/widgets.css";
import * as Cesium from "cesium";

import {
    mapDeviceTypeList,
    mapDeviceListByPage,
    addDevice,
    updateDevice,
    deleteDevice,
    deleteSelectedDevice,
    exportExcel,
    fileUpload
} from "@/api/map/map-device";

let viewer = null;
let cesiumMap = ref<HTMLDivElement>();
let leftDownFlag = false; // 鼠标左键是否按下
let pickedEntity = null; //被选中的Entity

let searchObj = reactive({
    deviceCode: ""
});
let dialogTitle = ref("新增");
let addDialogVisible = ref(false);
let mapDialogVisible = ref(false);
let mapCesiumDialogVisible = ref(false);
let mapType = ref("cesium");//ref("minedata");
let mapTypeInit = ref(false);
const yingxiangLayer = ref(null);

let saveType = ref(1);
let dataRow = ref({});
let deviceTypeTreeData = ref([]);
let tableData = ref([]);
let defaultProps = reactive({
    children: "children",
    label: "typeName",
});
let activeNames = reactive(["1"]);
let pagesize = ref(10);
let currentPage = ref(1);
let start = ref(1);
let totalCount = ref(1000);
let currentNodeData = ref(null);
let rules = reactive({
    deviceCode: [
        { required: true, message: "请输设备编号", trigger: "blur" },
        {
            min: 2,
            max: 30,
            message: "长度在2 到 30 个字符",
            trigger: ["blur", "change"],
        },
    ],
    deviceType: [
        { required: true, message: "请输设备类别", trigger: "blur" },
    ],
    poleCode: [{ required: true, message: "请输立杆编号", trigger: "blur" }],
});

let options = reactive({
    deviceTypeOption: <object>[]
});
let addFormRef = ref<FormInstance>();
let deviceRef = ref<FormInstance>();
const multipleSelection = ref([]);
let map = null;
const modelObj = ref({ lon: 0, lat: 0, alt: 0, heading: 0, pitch: 0, roll: 0 });
let fileURL = "";
let modelControl;
const fileTypes = ['zip'];

// cesium默认资源路径
// window.CESIUM_BASE_URL = "/";
// 设置默认的视角为中国
// Cesium.Camera.DEFAULT_VIEW_RECTANGLE = Cesium.Rectangle.fromDegrees(
//     // 西边经度
//     89.5,
//     // 南边维度
//     20.4,
//     // 东边经度
//     110.4,
//     // 北边维度
//     61.2
// );


onMounted(() => {
    getDeviceTypeList();
});

const search = () => {
    getDeviceList();
};

const getDeviceTypeList = () => {
    mapDeviceTypeList({}).then((response) => {
        if (response.status == 200) {
            deviceTypeTreeData.value = response.data;
            getDeviceTypeOption();
        } else {
            ElMessage({
                message: "查询设备类型失败!",
                type: "warning"
            });

        }
    });
};

const handleSelectionChange = (val) => {
    multipleSelection.value = val
};

const handleDeleteofSelected = () => {
    // let selectedList = deviceRef.value.selection;
    if (multipleSelection.value.length == 0) {
        ElMessage({
            message: "请选择需要删除的数据！",
            type: "warning"
        });
        return;
    }

    ElMessageBox.confirm("此操作将永久删除该记录, 是否继续?", "提示", {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: "warning"
    })
        .then(() => {
            deleteSelectedDevice(multipleSelection.value).then((response) => {
                if (response.status == 200) {
                    ElMessage({
                        message: "已取消删除！",
                        type: "success"
                    });
                    getDeviceList();
                } else {
                    ElMessage({
                        message: "删除失败！",
                        type: "warning"
                    });
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
const handleExport = () => {
    if (currentNodeData.value == null) {
        ElMessage({
            message: "请先选一个设备分类!",
            type: "success"
        });

        return;
    }
    searchObj.deviceType = currentNodeData.value.dtId

    exportExcel(searchObj).then((res) => {
        let ret = res;
        if (ret) {
            //这里res.data是返回的blob对象
            let blob = new Blob([ret]); //application/vnd.openxmlformats-officedocument.spreadsheetml.sheet这里表示xlsx类型
            let downloadElement = document.createElement("a");
            let href = window.URL.createObjectURL(blob); //创建下载的链接

            downloadElement.href = href;
            // downloadElement.download = "车辆信息表"; //下载后文件名
            downloadElement.setAttribute("download", "路测模型信息表.xls");
            document.body.appendChild(downloadElement);

            downloadElement.click(); //点击下载
            document.body.removeChild(downloadElement); //下载完成移除元素
            window.URL.revokeObjectURL(href); //释放掉blob对象
        }
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
    // dataRow = JSON.parse(JSON.stringify(row));
    dataRow.value = JSON.parse(JSON.stringify(row));
};
const handleDelete = (index, row) => {
    ElMessageBox.confirm("此操作将永久删除该记录, 是否继续?", "提示", {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: "warning"
    })
        .then(() => {
            deleteDevice({ id: row.id }).then((response) => {
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
                    getDeviceList();
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

const handleRestart = (index, row) => { };
const handleShutdown = (index, row) => { };

const commitEventForm = () => {
    addFormRef.value.validate((isValid, invalidFields) => {
        if (isValid) {
            if (saveType.value == 1) {
                // 新增
                addDevice(dataRow.value).then((response) => {
                    if (response.status == 200) {
                        ElMessage({
                            message: "新增保存成功",
                            type: "success"
                        });

                        addDialogVisible.value = false;
                        getDeviceList();
                    } else if (response.status == 501) {
                        ElMessage({
                            message: "设备编号已经存在，请更换一个!",
                            type: "error"
                        });
                    }
                });
            } else {
                // 2:编辑
                updateDevice(dataRow.value).then((response) => {
                    if (response) {
                        ElMessage({
                            message: "保存成功!",
                            type: "success"
                        });
                        addDialogVisible.value = false;
                        getDeviceList();
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

const resetForm = () => {
    dataRow.value = {
        deviceCode: "",
        deviceType: "",
        deviceModel: "",
        brand: "",
        ip: "",
        mesh: "",
        gateway: "",
        serverConnect: "",
        cameraProperty:""
    };
    resetClearValidate();
};

const resetClearValidate = (event) => {
    nextTick(() => {
        if (addFormRef.value) {
            addFormRef.value.clearValidate();
        }
    });
};

const clickNode = (data, node, obj) => {
    currentNodeData.value = data;
    searchObj.pageNum = 1;
    searchObj.pageSize = 10;
    getDeviceList();
};
const getDeviceList = () => {
    searchObj.pageNum = currentPage;
    searchObj.pageSize = pagesize;
    searchObj.deviceType = currentNodeData.value.dtId;

    mapDeviceListByPage(searchObj).then((response: any) => {
        tableData.value = response.data.list;
        totalCount = response.number;
        fileURL = response.fileURL;
    });
};
const getDeviceTypeOption = () => {
    for (let i = 0; i < deviceTypeTreeData.value.length; i++) {
        let _typeObj = deviceTypeTreeData.value[i];
        options.deviceTypeOption.push({
            code: _typeObj.dtId,
            name: _typeObj.typeName,
        });
    }
};

// 每页显示数据量变更
const handleSizeChange = (val) => {
    pagesize.value = val;
    getDeviceList();
};

// 页码变更
const handleCurrentChange = (val) => {
    currentPage.value = val;
    getDeviceList();
};

const formatDate = (row, column) => {
    // 获取单元格数据
    const date = row[column.property];
    if (date === undefined || date === null) {
        return "";
    }
    return moment(date).format("YYYY-MM-DD HH:mm:ss");
};

const handleDialogBeforeClose = (done) => {
    done();
};


const handleRemove = (file, fileList) => {
    console.log(file, fileList)
};
const handlePreview = (file) => {
    console.log(file)
};

const beforeUpload = (file, index, row) => {
    console.log("file===", file)
    console.log("index===", index)
    console.log("row===", row)

    // 如果上传的文件不符合条件
    var checkMessage = fileCheck(file)
    if (checkMessage !== '') {
        ElMessage({
            message: checkMessage,
            type: "warning"
        });
        return
    }
    var formData = new FormData()
    formData.append('file', file)
    formData.append('id', row.id)
    formData.append('deviceType', row.deviceType)
    fileUpload(formData).then(response => {
        console.log(response)
        if (response.status === 200) {
            ElMessage({
                type: 'success',
                message: '文件上传成功'
            });

            search()
        } else if (response.status === 500) {
            ElMessage({
                type: 'warning',
                message: `文件上传失败,失败原因${response.msg}`
            });
        }
    })
};

// 前端校验文件上传是否符合条件
const fileCheck = (file) => {
    var ret = ''
    if (file === undefined) {
        ret = ''
    }
    var max_file_size = 200 * 1024 * 1024
    if (file.size > max_file_size) {
        ret = '不能大于200Mb'
    }
    var fileType = file.name.substring(file.name.lastIndexOf('.') + 1)
    if (!validFile(fileType)) {
        ret = '文件类型不符合要求'
    }
    return ret
};

const validFile = (type) => {
    var result = false
    for (var i = 0; i < fileTypes.length; i++) {
        if (fileTypes[i] === type) {
            result = true
            return result
        }
    }
    return result
};

const locationMap = () => {
    mapType.value = "minedata"
    mapDialogVisible.value = true;
};
const locationCesiumMap = () => {
    mapType.value = "cesium"
    mapDialogVisible.value = true;
};

const mapOpenCallback = () => {
    if (mapType.value == "minedata") {
        dataRow.value.heading = dataRow.value.heading - 90;
        dataRow.value.pitch = dataRow.value.pitch - 90;
        initMap();
    } else {
        initCesiumMap();
    }

};

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
    const center = [120.89054554812031, 31.968683167278154]//[116.248767585006, 40.118466147532]
    map = new minemap.Map({
        container: 'selectMap',
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
                    url: "data/nantongtiyuchang_result/3dtiels/tileset.json",
                    //url: "data/futian1208_result/test/tileset.json",
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

        addModel();
    });
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

        //加载影像地图
        const yingxiangImageryProvider = new Cesium.UrlTemplateImageryProvider({
            url: anbaoConfig.mapUrl.yingxiangUrl,
            //maximumLevel : 15
        });

        //加载影像地图
        yingxiangLayer.value = new Cesium.ImageryLayer(yingxiangImageryProvider);
        viewer.imageryLayers.add(yingxiangLayer.value);
    }

    // 添加路网模型
    let _tilesObj = new Cesium.Cesium3DTileset({
        url: anbaoConfig.mapUrl.hadUrl,//"http://172.19.250.35/ntroad/tileset.json",
        //控制切片视角显示的数量，可调整性能
        maximumScreenSpaceError: 2,
        maximumNumberOfLoadedTiles: 100000,
    });
    //添加到场景
    viewer.scene.primitives.add(_tilesObj);

    viewer.screenSpaceEventHandler.setInputAction((e) => {
        leftDownAction(e);
    }, Cesium.ScreenSpaceEventType.LEFT_DOWN);

    viewer.screenSpaceEventHandler.setInputAction((e) => {
        mouseMoveAction(e);
    }, Cesium.ScreenSpaceEventType.MOUSE_MOVE);

    viewer.screenSpaceEventHandler.setInputAction((e) => {
        leftUpAction(e);
        getMousePosition(e);
    }, Cesium.ScreenSpaceEventType.LEFT_UP);


    // 定位到模型位置
    viewer.flyTo(_tilesObj, {
        duration: 1,
        orientation: {
            heading: Cesium.Math.toRadians(0),
            pitch: Cesium.Math.toRadians(-90),
            roll: 0.0,
        },
    });

    setTimeout(function () {
        addModelCesium();
    }, 2000);
}

const getMousePosition = (event) => {
    //-start 获取鼠标点击位置经纬度
    let _cartesian = viewer.camera.pickEllipsoid(event.position);
    let _cartographic = Cesium.Cartographic.fromCartesian(_cartesian);
    let _lng = Cesium.Math.toDegrees(_cartographic.longitude); // 经度
    let _lat = Cesium.Math.toDegrees(_cartographic.latitude); // 纬度
    let _alt = _cartographic.height; // 高度，椭球面height永远等于0
    console.log("click this lon,lat,alt =",_lng,_lat,_alt);
    //-end 获取鼠标点击位置经纬度
};

const openControl = () => {
    if (modelControl) return;
    modelControl = new minemap.ModelControl(map, {
        callback: (e) => {
            console.log("openControl...", e);
            let myModel = map.getSceneComponent("myModel").modelInstanceCollection.getByName("myModel-1");
            let lonlat = minemap.Transforms.cartesian3ToCartographic(myModel.position);
            let rotation = myModel.rotation;
            console.log("position=", myModel.position, "  rotation=", myModel.rotation, "  lonlat=", lonlat);

            let lon = lonlat[0].toFixed(8);
            let lat = lonlat[1].toFixed(8);
            let alt = lonlat[2].toFixed(8);
            let heading = rotation.heading.toFixed(8);
            let pitch = rotation.pitch.toFixed(8);
            let roll = rotation.roll.toFixed(8);
            let minVal = 0.0001;
            dataRow.value.lon = lon > minVal ? lon : 0;
            dataRow.value.lat = lat > minVal ? lat : 0;
            dataRow.value.alt = alt > minVal ? alt : 0;
            // dataRow.value.heading = heading > minVal ? heading : 0;
            // dataRow.value.pitch = pitch > minVal ? pitch : 0;
            // dataRow.value.roll = roll > minVal ? roll : 0;
            dataRow.value.heading = Number(minemap.Math.toDegrees(heading).toFixed(8));
            dataRow.value.pitch = Number(minemap.Math.toDegrees(pitch).toFixed(8));
            dataRow.value.roll = Number(minemap.Math.toDegrees(roll).toFixed(8));

            // 弧度值转换为角度
            // let headingDegrees = minemap.Math.toDegrees(Number(heading));
            // 角度值转弧度
            // let headingRadians = minemap.Math.toRadians(headingDegrees);

            // console.log("------------------------------------------------------");
            // console.log("heading="+heading," headingDegrees="+headingDegrees," headingRadians="+headingRadians);
            // console.log("------------------------------------------------------");

        },
    });
};
const closeControl = () => {
    if (!modelControl) return;
    modelControl.destroy();
    modelControl = null;
};


const addModel = () => {
    let gltfPath = dataRow.value.gltfPath;
    if (gltfPath == undefined || gltfPath == "") {
        ElMessage({
            message: "请检查，OBJ没有生成GLTF文件！",
            type: "warning"
        });
        return;
    }

    let gltf = fileURL + "/" + gltfPath;


    let lon = null;
    let lat = null;
    let alt = null;
    let heading = 0;
    let pitch = 0;
    let roll = 0;

    if (dataRow.value.lon == null || dataRow.value.lon == undefined || dataRow.value.lon == '') {
        let lngLat = map.getCenter();
        lon = lngLat.lng;
        lat = lngLat.lat;
        alt = 0;
    } else {
        lon = dataRow.value.lon;
        lat = dataRow.value.lat;
        alt = dataRow.value.alt;
        heading = minemap.Math.toRadians(dataRow.value.heading);
        pitch = minemap.Math.toRadians(dataRow.value.pitch) ;
        roll = minemap.Math.toRadians(dataRow.value.roll);
        // heading = dataRow.value.heading;
        // pitch = dataRow.value.pitch;
        // roll = dataRow.value.roll;
    }



    // let myModel = map.getSceneComponent("myModel");
    // if (myModel == null || myModel == "" || myModel == undefined) {
    //GLTF模型实例化
    map.addSceneComponent({
        id: "myModel",
        type: "3d-model",
        data: gltf,
        // data: "https://minedata.cn/nce-static/support/assets/models/SWTX-ALL/SWFX-ALL.gltf",
        modelFolder: "",// 该数据引用图片等资源的文件夹路径
        positions: [new minemap.Math.Vector3([lon, lat, alt])], //实例化顶点数组([new minemap.Math.Vector3])(必须)
        rotations: [new minemap.Math.HeadingPitchRoll(heading, pitch, roll)], // 实例化旋转参数数组([minemap.Math.HeadingPitchRoll])(非必须)
        // rotations: [minemap.Math.HeadingPitchRoll.fromDegrees(0, 0, 0)], // 实例化旋转参数数组([minemap.Math.HeadingPitchRoll])(非必须)
        scales: [new minemap.Math.Vector3([1, 1, 1])], // 实例化缩放参数数组([new minemap.Math.Vector3])(非必须)
        instanceNames: ["myModel-1"], // 实例化id数组([string])(非必须)
        colors: [new minemap.Color(0, 0, 0, 0)], // 实例化color数组([minemap.Color])(非必须)
        shows: [true], // 实例化show数组([boolean])(非必须)
    });
    // }

};
const addModelCesium = () => {
    
    let gltfPath = dataRow.value.gltfPath;
    if (gltfPath == undefined || gltfPath == "") {
        ElMessage({
            message: "请检查，OBJ没有生成GLTF文件！",
            type: "warning"
        });
        return;
    }

    let gltf = fileURL + "/" + gltfPath;
    console.log("===addModelCesium==",gltf);
    console.log("===dataRow==9999",dataRow);


    let lon = null;
    let lat = null;
    let alt = null;
    let heading = 0;
    let pitch = Cesium.Math.toRadians(90);
    // Cesium.Math.toRadians(degrees)：将角度转换为弧度。
    // Cesium.Math.toDegrees(radians)：将弧度转换为角度。

    // console.log("Degrees == 90","  pitch="+pitch,"  toDegrees="+Cesium.Math.toDegrees(pitch));

    let roll = 0;

    if (dataRow.value.lon == null || dataRow.value.lon == undefined || dataRow.value.lon == '') {
        let lngLat = getCenterPosition(viewer);
        lon = lngLat.lng;
        lat = lngLat.lat;
        alt = 0;
    } else {
        lon = dataRow.value.lon;
        lat = dataRow.value.lat;
        alt = dataRow.value.alt;
        heading = Number(Cesium.Math.toRadians(dataRow.value.heading).toFixed(8));
        pitch = Number(Cesium.Math.toRadians(dataRow.value.pitch).toFixed(8));
        roll = Number(Cesium.Math.toRadians(dataRow.value.roll).toFixed(8));
    }

    console.log("lon=" + lon + " lat=" + lat + " alt=" + alt + " heading=" + heading + " pitch=" + pitch + " roll=" + roll);

    // let myModel = viewer.entities.getById("myModel");
    // if (myModel == null || myModel == "" || myModel == undefined) {
    //GLTF模型实例化
    // map.addSceneComponent({
    //     id: "myModel",
    //     type: "3d-model",
    //     data: gltf,
    //     // data: "https://minedata.cn/nce-static/support/assets/models/SWTX-ALL/SWFX-ALL.gltf",
    //     modelFolder: "",// 该数据引用图片等资源的文件夹路径
    //     positions: [new minemap.Math.Vector3([lon, lat, alt])], //实例化顶点数组([new minemap.Math.Vector3])(必须)
    //     rotations: [new minemap.Math.HeadingPitchRoll(heading, pitch, roll)], // 实例化旋转参数数组([minemap.Math.HeadingPitchRoll])(非必须)
    //     // rotations: [minemap.Math.HeadingPitchRoll.fromDegrees(0, 0, 0)], // 实例化旋转参数数组([minemap.Math.HeadingPitchRoll])(非必须)
    //     scales: [new minemap.Math.Vector3([1, 1, 1])], // 实例化缩放参数数组([new minemap.Math.Vector3])(非必须)
    //     instanceNames: ["myModel-1"], // 实例化id数组([string])(非必须)
    //     colors: [new minemap.Color(0, 0, 0, 0)], // 实例化color数组([minemap.Color])(非必须)
    //     shows: [true], // 实例化show数组([boolean])(非必须)
    // });

    const position = Cesium.Cartesian3.fromDegrees(lon, lat, alt);
    const hpr = new Cesium.HeadingPitchRoll(heading, pitch, roll);
    const orientation = Cesium.Transforms.headingPitchRollQuaternion(
        position,
        hpr
    );
    console.log("dataRow.value.id====",dataRow.value.id);
    var entity = viewer.entities.add({
        id: dataRow.value.id,
        position: position, //模型的位置
        orientation: orientation,
        model: {
            uri: gltf,
            // minimumPixelSize: 500,
            // maximumScale: 10000,
            // show: true,
        },
    });
    // 让摄像机视口快速定位到模型位置
    // viewer.trackedEntity = entity;
    viewer.flyTo(entity, {
        duration: 1,
        orientation: {
            heading: Cesium.Math.toRadians(0),
            pitch: Cesium.Math.toRadians(-90),
            roll: 0.0,
        },
    });

};

/*
** 加载gltf
*/
const loadGltfTest = function(){
    var gltfTestArr =
    [
        {
            "url":"http://172.19.250.34:9111/tiles/obj/adb7fc97ff0843caa033cd49c357fb66/20240402001/20240402001.gltf",
            "lon":120.890568,
            "lat":31.970895,
            "alt":0,
            "heading":-285,
            "pitch":-270,
            "roll":0
        },{
            "url":"http://172.19.250.34:9111/tiles/obj/58d8ac18210e4bfba3014e76724056a6/gan/gan.gltf",
            "lon":120.8874484057169,
            "lat":31.970148758802637,
            "alt":0.5,
            "heading":180,
            "pitch":90,
            "roll":0
        },{
            "url":"http://172.19.250.34:9111/tiles/obj/7057ce0c463d4588890493a9797d2829/qiangtou/qiangtou.gltf",
            "lon":120.88744676411915,
            "lat":31.970121290751656,
            "alt":7,
            "heading":270,
            "pitch":90,
            "roll":0
        }
    ];
    gltfTestArr.forEach(function (itemObj) {
        loadGltfTestOne(itemObj)
    });
}

const loadGltfTestOne = function(itemObj){
    var position = Cesium.Cartesian3.fromDegrees(itemObj.lon,itemObj.lat,itemObj.alt)
    var modelEntity = viewer.entities.add({
        name: 'My Model',
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

const getCenterPosition = (viewer) => {
    let centerResult = viewer.camera.pickEllipsoid(
        new Cesium.Cartesian2(
            viewer.canvas.clientWidth / 2,
            viewer.canvas.clientHeight / 2,
        ),
    )
    if (!centerResult) {
        return null
    }
    let curPosition = Cesium.Ellipsoid.WGS84.cartesianToCartographic(centerResult);
    if (curPosition) {
        let curLongitude = (curPosition.longitude * 180) / Math.PI;
        let curLatitude = (curPosition.latitude * 180) / Math.PI;
        return {
            lng: curLongitude,
            lat: curLatitude,
        }
    }
}

const _getCenter = () => {
    let lnglat = null;
    if (mapType.value == "minedata") {
        lnglat = map.getCenter();
    } else {
        lnglat = getCenterPosition(viewer);
    }
    return lnglat;
}
const locationAddModel = () => {
    let lon = null;
    let lat = null;
    let alt = null;
    let heading = 0;
    let pitch = 0;
    let roll = 0;

    if (dataRow.value.lon == null || dataRow.value.lon == undefined || dataRow.value.lon == '') {
        let lngLat = _getCenter();
        // let lngLat = map.getCenter();
        lon = lngLat.lng;
        lat = lngLat.lat;
        alt = 0;
    } else {
        lon = dataRow.value.lon;
        lat = dataRow.value.lat;
        alt = dataRow.value.alt;
        heading = dataRow.value.heading;
        pitch = dataRow.value.pitch;
        roll = dataRow.value.roll;
    }
    if (mapType.value == "minedata") {
        map.flyTo({
            center: [lon, lat],
            zoom: 21,
            bearing: 0,
            pitch: 45,
            duration: 2000
        });
    } else {
        let myModel = viewer.entities.getById(dataRow.value.id);
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

const addModelLocation = () => {
    mapDialogVisible.value = false;
    mapCesiumDialogVisible.value = false;

    if(mapType.value == "minedata"){
        dataRow.value.heading = Number(dataRow.value.heading) + 90;
        dataRow.value.pitch = Number(dataRow.value.pitch) + 90;
    }
    
};

// 拖拽模型-左键按下
const leftDownAction = (e) => {
    leftDownFlag = true;
    let picked = viewer.scene.pick(e.position);
    if (picked) {
        document.body.style.cursor = 'move';
        pickedEntity = Cesium.defaultValue(picked.id, picked.primitive.id);
        if (pickedEntity instanceof Cesium.Entity && pickedEntity.model) {
            //锁定相机
            viewer.scene.screenSpaceCameraController.enableRotate = false;
        }
    }
};

// 拖拽模型-鼠标移动
const mouseMoveAction = (e) => {
    if (leftDownFlag && pickedEntity) {
        // let ray = viewer.camera.getPickRay(e.endPosition);
        // let cartesian = viewer.scene.globe.pick(ray, viewer.scene);
        console.log(e.endPosition, viewer.scene.globe.ellipsoid, e)
        let cartesian = viewer.scene.camera.pickEllipsoid(
            e.endPosition,
            viewer.scene.globe.ellipsoid
        );
        pickedEntity.position = cartesian;

        dragModel();
    }
};

// 拖拽模型-左键抬起
const leftUpAction = (e) => {
    console.log("leftUpAction--e:", e)
    dataRow.value.cameraProperty = JSON.stringify(getCamera(viewer));
        console.log("cameras===",dataRow.value.cameraProperty);
    document.body.style.cursor = 'default';
    leftDownFlag = false;
    pickedEntity = null;
    // 解除相机锁定
    viewer.scene.screenSpaceCameraController.enableRotate = true;
};

const dragModel = () => {
    let myModel = viewer.entities.getById(dataRow.value.id);
    if (myModel != null && myModel != undefined) {
        let lonlat = getPositionsByEnity(myModel);
        console.log("lonlat===", lonlat)

        let lon = lonlat.lng;
        let lat = lonlat.lat;
        let alt = lonlat.alt;
        let heading = 0;
        let pitch = Cesium.Math.toRadians(90);
        let roll = 0;
        let minVal = 0.0001;
        dataRow.value.lon = lon > minVal ? lon : 0;
        dataRow.value.lat = lat > minVal ? lat : 0;
        if(dataRow.value.alt){
            alt = dataRow.value.alt;
        }
        dataRow.value.alt = alt > minVal ? alt : 0;
        changeOffset();
        // dataRow.value.heading = heading > minVal ? heading : 0;
        // dataRow.value.pitch = pitch > minVal ? pitch : 0;
        // dataRow.value.roll = roll > minVal ? roll : 0;
    }
}

const changeOffset = () => {
    let myModel = viewer.entities.getById(dataRow.value.id);
    if (myModel != null && myModel != undefined) {
        let lon = Number(dataRow.value.lon);
        let lat = Number(dataRow.value.lat);
        let alt = Number(dataRow.value.alt);
        let heading = Cesium.Math.toRadians(Number(dataRow.value.heading));
        let pitch = Cesium.Math.toRadians(Number(dataRow.value.pitch));
        let roll = Cesium.Math.toRadians(Number(dataRow.value.roll));
        // let heading = Number(dataRow.value.heading);
        // let pitch = Number(dataRow.value.pitch);
        // let roll = Number(dataRow.value.roll);
        const position = Cesium.Cartesian3.fromDegrees(lon, lat, alt);
        const hpr = new Cesium.HeadingPitchRoll(heading, pitch, roll);
        const orientation = Cesium.Transforms.headingPitchRollQuaternion(
            position,
            hpr
        );

        myModel.position = position;
        myModel.orientation = orientation;
    }
}


/**
 * 获取实体的位置 并转换成string
 * @param {\} entity 多边形 矩形 点 圆形 多段线
 * @returns
 */
const getPositionsByEnity = (entity) => {
    if (entity) {
        if (entity.polygon) {
            return JSON.stringify(
                getLngLatByCartesian3(entity.polygon.hierarchy.getValue().positions, "point")
            );
        } else if (entity.rectangle) {
            let rectangle = entity.rectangle.coordinates.getValue();
            let result = [];
            Cesium.Rectangle.subsample(
                rectangle,
                Cesium.Ellipsoid.WGS84,
                rectangle.height,
                result
            );
            return JSON.stringify(getLngLatByCartesian3(result, "point"));
        } else if (entity.point) {
            return JSON.stringify(
                getLngLatByCartesian3(entity.position._value, "point")
            );
        } else if (entity.ellipse) {
            let res = {
                center: getLngLatByCartesian3(entity.position._value, "point"),
                radius: entity.ellipse.semiMajorAxis.getValue(),
            };

            return JSON.stringify(res);
        } else if (entity.polyline) {
            return getLngLatByCartesian3(entity.polyline.positions.getValue(), 'polyline')
        } else if (entity.position) {
            return getLngLatByCartesian3(entity.position._value, "point")
        }
    }
    return undefined;
};

/**
   * 笛卡尔坐标转换经纬度坐标
   * @param {*} car3_ps
   * @returns
   */
const getLngLatByCartesian3 = (car3_ps, type) => {
    let result = null;
    if (car3_ps instanceof Cesium.Cartesian3) {
        let _cartographic = Cesium.Cartographic.fromCartesian(car3_ps);
        let _lat = Cesium.Math.toDegrees(_cartographic.latitude);
        let _lng = Cesium.Math.toDegrees(_cartographic.longitude);
        let _alt = _cartographic.height;
        if (type == 'polyline') {
            result = { longitude: _lng, latitude: _lat, elevation: _alt }
        } else {
            result = { lng: _lng, lat: _lat, alt: _alt }
        }
        return result;
    } else if (car3_ps instanceof Array) {
        let res = [];
        for (let i = 0; i < car3_ps.length; i++) {
            let _cartographic = Cesium.Cartographic.fromCartesian(car3_ps[i]);
            let _lat = Cesium.Math.toDegrees(_cartographic.latitude);
            let _lng = Cesium.Math.toDegrees(_cartographic.longitude);
            let _alt = _cartographic.height;
            if (type == 'polyline') {
                res.push({ longitude: _lng, latitude: _lat, elevation: _alt })
            } else {
                res.push({ lng: _lng, lat: _lat, alt: _alt })
            }
        }
        return res;
    }
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


</script>

<style lang="scss" scoped>
.mainbox {
    width: 100%;
    position: relative;
    padding: 24px 0;
    box-sizing: border-box;
}

.left-box {
    width: 270px !important;
    padding: 0 24px;
    height: calc(100vh - 298px);
    border-right: 2px solid#D1D4DC;
}

.right-box {
    padding: 0;
    height: calc(100vh - 298px);
    overflow-y: auto;
}

.table-box {
    width: 100%;
    height: calc(100vh - 317px);
    border-radius: 4px 4px;
    padding: 20px;
    padding-bottom: 0;
}

:deep .el-tree--highlight-current .el-tree-node.is-current>.el-tree-node__content {
    background-color: #4091f7;
    color: #ffffff;
}
</style>

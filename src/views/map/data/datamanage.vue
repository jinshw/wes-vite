<template>
  <div>
    <div>
      <el-form :inline="true">
        <el-row>
          <el-col :span="6">
            <el-form-item label="数据名称">
              <el-input v-model.trim="searchObj.dataName" type="text" placeholder="请输入数据名称" />
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="数据类型">
              <el-select class="inputW" v-model="searchObj.dataType" style="width: 100%" filterable allow-create
                default-first-option placeholder="请选数据类型">
                <el-option v-for="item in options.dataTypeOption" :key="item.code" :label="item.name"
                  :value="item.code"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="6" :offset="6" class="btn-textright">
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
        <el-table-column type="index" label="序号" width="100" />
        <el-table-column prop="dataName" label="数据名称" width="180" />
        <el-table-column prop="code" label="编码" />
        <el-table-column prop="version" label="版本" />
        <!-- <el-table-column
          prop="status"
          label="状态"
          :formatter="formatterOptions"
        /> -->
        <el-table-column prop="dataType" label="数据类型" width="180" />
        <el-table-column prop="mainFile" label="是否上传" width="180" :formatter="formatterOptions" />
        <!-- <el-table-column prop="path" label="路径" width="180" /> -->
        <el-table-column prop="mainFile" label="文件" width="180" />
        <el-table-column prop="tilesPath" label="3dtiles" width="180" />
        <el-table-column prop="updateTime" label="更新时间" width="180" :formatter="formatDate" />

        <el-table-column label="操作" fixed="right" align="center" width="320">
          <template #default="scope">
            <!-- <el-upload ref="upload" class="upload-demo inline-block" action="https://jsonplacehoder.typeicon.com/posts/"
              :show-file-list="false" :on-preview="handlePreview" :on-remove="handleRemove" :auto-upload="true"
              :before-upload="(file) => beforeUpload(file, scope.$index, scope.row)
                " :on-success="onSuccess">
              <el-tooltip v-show="scope.row.dataType != 'geojson' &&
                sliceFileType.indexOf(scope.row.dataType) == -1
                " slot="trigger" class="item" effect="dark" content="obj:只能上传zip文件，并且zip文件中是同名文件夹，例如：obj.zip>obj"
                placement="top-start">
                <el-button type="text" style="font-size: 12px; font-weight: 500; margin-right: 10px">上传</el-button>
              </el-tooltip>
            </el-upload> -->
            <el-button type="text" size="small" @click="handleEdit(scope.$index, scope.row)"
              v-permission="'service:edit'"><i class="iconfont">&#xe732;</i> 编辑</el-button>
            <el-button type="text" size="small" @click="handleDelete(scope.$index, scope.row)"
              v-permission="'service:delete'"><i class="iconfont">&#xe74e;</i> 删除</el-button>
            <el-button type="text" size="small" @click="handleDownload(scope.$index, scope.row)"
              v-permission="'service:download'"><i class="iconfont">&#xe73d;</i> 下载</el-button>

            <!-- <el-button style="margin-left: 10px;" size="small" type="success" @click="submitUpload">上传到服务器</el-button> -->

          </template>
        </el-table-column>
      </el-table>

      <div align="right">
        <el-pagination :current-page="currentPage" :page-sizes="[10, 20, 30, 40]" :page-size="pagesize"
          layout="prev, pager, next" :total="totalCount" @size-change="handleSizeChange"
          @current-change="handleCurrentChange" />
      </div>
    </div>

    <el-dialog :title="dialogTitle" v-model="addDialogVisible" :before-close="handleDialogBeforeClose"
      :close-on-click-modal="false">
      <el-form ref="mapDataFormRef" :inline="true" label-width="190px" size="mini" :rules="rules" :model="dataRow"
        class="dialogElForm">
        <el-form-item label="数据名称" prop="dataName">
          <el-input v-model="dataRow.dataName" auto-complete="off" placeholder="请输入数据名称" />
        </el-form-item>
        <el-form-item label="编码" prop="code">
          <el-input v-model="dataRow.code" auto-complete="off" placeholder="请输入编码" :disabled="saveType == 2" />
        </el-form-item>
        <el-form-item label="版本号" prop="version">
          <el-input v-model="dataRow.version" auto-complete="off" placeholder="请输入版本号" />
        </el-form-item>
        <el-form-item label="状态" prop="status">
          <el-select class="inputW" v-model="dataRow.status" style="width: 100%" filterable allow-create size="mini"
            default-first-option placeholder="请选状态">
            <el-option v-for="item in options.statusOption" :key="item.code" :label="item.name"
              :value="item.code"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item prop="dataType" label="数据类型">
          <el-select class="inputW" v-model="dataRow.dataType" style="width: 100%" filterable allow-create size="mini"
            default-first-option placeholder="请选数据类型" @change="dataTypeChange">
            <el-option v-for="item in options.dataTypeOption" :key="item.code" :label="item.name"
              :value="item.code"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="附件上传" v-show="sliceFileType.indexOf(dataRow.dataType) > -1">
          <el-upload ref="upload" class="upload-demo inline-block" action="https://jsonplacehoder.typeicon.com/posts/"
            :show-file-list="false" :on-preview="handlePreview" :on-remove="handleRemove" :auto-upload="true"
            :before-upload="beforeUploadAdd" accept="" :on-success="onSuccess">
            <el-button slot="trigger" type="primary">上传文件</el-button>
          </el-upload>
        </el-form-item>

        <el-form-item label="主文件" prop="mainFile">
          <el-input v-model="dataRow.mainFile" auto-complete="off" placeholder="请输入主文件" />
        </el-form-item>
        <el-form-item label="Geojson数据" prop="content" v-show="dataRow.dataType == 'geojson'">
          <vue-json-editor style="width: 940px" class="dialogGeojsonWidth" v-model="dataRow.content" :show-btns="false"
            :mode="'code'" lang="zh"></vue-json-editor>
        </el-form-item>
      </el-form>


      <template #footer>
        <span class="dialog-footer">
          <el-button type="primary" size="mini" @click="resetForm" v-show="saveType == 1">重置</el-button>
          <el-button type="primary" size="mini" @click="commitEventForm">保存</el-button>
        </span>
      </template>
    </el-dialog>



  </div>
</template>

<script lang="ts" setup>
import { reactive, toRaw, toRefs, ref, nextTick, onMounted } from "vue";
import { ElMessage, ElMessageBox } from "element-plus";
import type { FormInstance, FormRules } from 'element-plus'
import moment from "moment";
import pubRules from "@/utils/pubRules.js";

import {
  updateMapData,
  deleteMapData,
  mapDataList,
  addMapData,
  fileUpload,
  fileUploadGetContent,
  fileDownLoad,
} from "@/api/map/map-data";

const dialogTitle = ref("新增");
const tableData = ref([]);
const addDialogVisible = ref(false);
const saveType = ref(1); //1:新增，2：编辑 3：分发
const filePathName = "";

const dataRow: any = ref({
  dataId: 0,
  dataName: "",
  version: "1.0",
  status: 1,
  dataType: "xodr",
  path: "",
  mainFile: "",
  mongoId: "",
  code: "",
  content: "",
  updateTime: null,
  updatePerson: 0,
});

let searchObj = reactive({
  dataName: "",
  code: "",
  dataType: ""
});

const options = reactive({
  // 状态：1未发布、2已经发布、3 已经废除
  statusOption: [
    { code: 1, name: "未发布" },
    { code: 2, name: "已经发布" },
    { code: 3, name: "已经废除" },
  ],
  // 数据类型：例如：geojson,obj,gltf,shape
  dataTypeOption: [
    { code: "xodr", name: "xodr" },
    { code: "geojson", name: "geojson" },
    { code: "json", name: "json" },
    { code: "xml", name: "xml" },
    // { code: "obj", name: "obj" },
    // { code: "gltf", name: "gltf" },
    // { code: "shape", name: "shape" },
    // { code: "xa_json", name: "xa_json" },
  ],

  roadOption: [],
});

const rules = reactive(
  {
    dataName: [
      { required: true, message: "请输数据名称", trigger: "blur" },
      {
        min: 3,
        max: 50,
        message: "长度在3 到 30 个字符",
        trigger: ["blur", "change"],
      },
    ],
    code: [{ required: true, message: "请输编码", trigger: "blur" }],
    version: [{ required: true, message: "请输入版本号", trigger: "blur" }],
    lon: [
      {
        required: true,
        message: "该项不能为空",
      },
      {
        validator: pubRules.numValidate,
      },
    ],
    lat: [
      {
        required: true,
        message: "该项不能为空",
      },
      {
        validator: pubRules.numValidate,
      },
    ],
    allLen: [
      {
        validator: pubRules.numValidate,
      },
    ],
    rampLen: [
      {
        validator: pubRules.numValidate,
      },
    ],
    connectLen: [
      {
        validator: pubRules.numValidate,
      },
    ],
    auxiliaryroadLen: [
      {
        validator: pubRules.numValidate,
      },
    ],
    convertLen: [
      {
        validator: pubRules.numValidate,
      },
    ],
    pavementWidth: [
      {
        validator: pubRules.numValidate,
      },
    ],
  }
);

// 默认每页数据量
const pagesize = ref(10);
// 当前页码
const currentPage = ref(1);

const totalCount = ref(100);

const sliceFileType = ref(["geojson", "xodr", "xml", "json", "xa_json"]);

let mapDataFormRef = ref<FormInstance>();

defineOptions({
  name: "MapDataManage"
});

onMounted(() => {
  search();
});

const search = () => {
  getList(currentPage.value, pagesize.value);
};

const getList = (pageNum, pageSize) => {
  searchObj.pageNum = pageNum;
  searchObj.pageSize = pageSize;

  mapDataList(searchObj).then((response) => {
    tableData.value = response.data.list;
    totalCount.value = response.number;
  });
};

const handleAdd = () => {
  dialogTitle.value = "新增";
  addDialogVisible.value = true;
  saveType.value = 1;
  resetForm();
};

const commitEventForm = () => {
  mapDataFormRef.value.validate((isValid, invalidFields) => {
    if (isValid) {
      dataRow.value.content = JSON.stringify(dataRow.value.content);
      if (saveType.value == 1) {
        // 新增
        addMapData(dataRow.value).then((response) => {
          if (response.status == 200) {
            ElMessage({
              message: "新增保存成功!",
              type: "success"
            });
            addDialogVisible.value = false;
            search();
          } else if (response.status == 501) {
            ElMessage({
              message: "code已经存在，请更换一个!",
              type: "error"
            });
          }
        });
      } else {
        // 2:编辑
        updateMapData(dataRow.value).then((response) => {
          if (response) {
            ElMessage({
              message: "保存成功!",
              type: "success"
            });
            addDialogVisible.value = false;
            search();
          }
        });
      }
    } else {
      console.log("error submit!!");
      return false;
    }
  });
};

const handleEdit = (index, row) => {
  dialogTitle.value = "编辑";
  addDialogVisible.value = true;
  saveType.value = 2;
  initRowToObj(row);
};

const initRowToObj = (row) => {
  dataRow.value = JSON.parse(JSON.stringify(row));
  dataRow.value.content = JSON.parse(dataRow.value.content);
};

const handleDelete = (index, row) => {
  ElMessageBox.confirm("此操作将永久删除该记录, 是否继续?", "提示", {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: "warning"
  })
    .then(() => {
      deleteMapData({ dataId: row.dataId, code: row.code }).then(
        (response) => {
          if (response.status == 600) {
            ElMessage({
              message: "该路段已被引用，无法删除！",
              type: "warning"
            });

          } else if (response) {
            ElMessage({
              message: "执行成功",
              type: "success"
            });
            search();
          }
        }
      );
    })
    .catch(() => {
      ElMessage({
        message: "已取消删除！",
        type: "info"
      });
    });
};

const handleSearchReset = () => {
  searchObj = {
    dataName: "",
    code: "",
    dataType: ""
  };
};

const resetForm = () => {
  dataRow.value = {
    dataName: "",
    version: "1.0",
    status: 1,
    dataType: "xodr",
    path: "",
    mainFile: "",
    code: "",
  };
  resetClearValidate();
};

const resetClearValidate = () => {
  nextTick(() => {
    if (mapDataFormRef.value) {
      mapDataFormRef.value.clearValidate();
    }
  });
};

const handleDialogBeforeClose = (done) => {
  done();
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

const formatterOptions = (row, column) => {
  const prop = column.property;
  const val = row[prop];
  let result = "";
  switch (prop) {
    case "status":
      result = statusOption(val);
      break;
    case "path":
      result = pathOption(val);
      break;
    case "mainFile":
      result = mainFileOption(val);
      break;
    default:
      result = "";
  }
  return result;
};

const statusOption = (val) => {
  // 状态：1未发布、2已经发布、3 已经废除
  let result = "";
  switch (val) {
    case 1:
      result = "未发布";
      break;
    case 2:
      result = "已经发布";
      break;
    case 3:
      result = "已经废除";
      break;
    default:
      result = "";
  }
  return result;
};

const pathOption = (val) => {
  let result = "";
  if (val == "" || val == null) {
    result = "未上传";
  } else if (val != "") {
    result = "已经上传";
  }
  return result;
};

const mainFileOption = (val) => {
  let result = "";
  if (val == "" || val == null) {
    result = "未上传";
  } else if (val != "") {
    result = "已经上传";
  }
  return result;
};

const handleRemove = (file, fileList) => {
  console.log(file, fileList);
};
const handlePreview = (file) => {
  console.log(file);
};

const beforeUpload = (file, index, row) => {

  // 如果上传的文件不符合条件
  var checkMessage = fileCheck(file);
  if (checkMessage !== "") {
    ElMessage({
      message: checkMessage,
      type: "warning"
    });
    return;
  }
  var formData = new FormData();
  formData.append("file", file);
  formData.append("dataId", row.dataId);
  formData.append("dataType", row.dataType);
  fileUpload(formData).then((response) => {
    console.log(response);
    if (response.status === 200) {
      ElMessage({
        type: 'success',
        message: '文件上传成功'
      });
      search();
    } else if (response.status === 500) {
      ElMessage({
        type: 'warning',
        message: `文件上传失败,失败原因${response.msg}`
      });
    }
  });
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
  // var fileType = file.name.substring(file.name.lastIndexOf('.') + 1)
  // if (!this.validFile(fileType)) {
  //   ret = '文件类型不符合要求'
  // }
  return ret
};

const beforeUploadAdd = (file) => {
  // 如果上传的文件不符合条件
  var checkMessage = fileCheck(file);
  if (checkMessage !== "") {
    ElMessage({
      message: checkMessage,
      type: "warning"
    });
    return;
  }
  var formData = new FormData();
  formData.append("file", file);
  formData.append("dataType", dataRow.value.dataType);
  fileUploadGetContent(formData).then((response) => {
    console.log(response);
    if (response.status === 200) {
      ElMessage({
        type: 'success',
        message: '文件上传成功'
      });

      if (response.data !== "") {
        dataRow.value.content = JSON.parse(response.data);
      }

      if (sliceFileType.value.indexOf(dataRow.value.dataType) > -1) {
        // if (that.dataRow.dataType == "xodr" || that.dataRow.dataType == "xml" || that.dataRow.dataType == "json") {
        dataRow.value.mainFile = response.filePathName;
      }

      search();
    } else if (response.status === 500) {
      ElMessage({
        type: 'warning',
        message: `文件上传失败,失败原因${response.msg}`
      });
    }
  });
};

const onSuccess = (response, file, fileList) => {
  console.log(response, file, fileList);
};

const handleDownload = (index, row) => {

  fileDownLoad(row).then((response) => {
    const msg = response.msg;
    let dataType = row.dataType;
    if (msg) {
      ElMessage({
        type: "warning",
        message: "下载失败," + msg + "!",
      });
      return;
    }
    console.log(response);
    const fileName = row.code;
    let mainFile = row.mainFile;
    let fileTypeArr = mainFile.split(".");
    let fileType = fileTypeArr[1];

    let url: string = "";
    url = window.URL.createObjectURL(new Blob([response]));

    // const url = window.URL.createObjectURL(new Blob([data]))
    const a = document.createElement("a");
    a.style.display = "none";
    a.href = url;
    a.setAttribute("download", fileName + "." + fileType);
    document.body.appendChild(a);
    // 点击下载
    a.click();
    // 下载完成移除元素
    document.body.removeChild(a);
    // 释放掉blob对象
    window.URL.revokeObjectURL(url);
    console.log("下载完成");
  });
};

// 数据类型选择事件
const dataTypeChange = (val) => {
  console.log("dataTypeChange...", val);
};

</script>

<style lang="scss" scoped></style>

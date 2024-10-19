<template>
  <div class="pageWrap">
    <div class="pageWrap-top clearfix">
      <div class="fd-fl">
        <el-form inline label-width="90px">
          <el-form-item label="数据名称">
            <el-input
              placeholder="请输入数据名称"
              v-model.trim="searchObj.dataName"
            />
          </el-form-item>
          <el-form-item label="数据类型">
            <el-select
              placeholder="请选择数据类型"
              v-model="searchObj.dataType"
              clearable
            >
              <el-option
                v-for="item in dataTypeOptions"
                :key="item.code"
                :label="item.name"
                :value="item.code"
              />
            </el-select>
          </el-form-item>
        </el-form>
      </div>
      <div class="fd-fr">
        <el-button @click="getList">查询</el-button>
        <el-button type="primary" @click="createClick">新建</el-button>
      </div>
    </div>
    <div class="pageWrap-main">
      <div class="wrap-table-div">
        <el-table style="width: 100%" :data="tableData">
          <el-table-column type="selection" width="55" />
          <el-table-column type="index" label="序号" width="60" />
          <el-table-column prop="dataName" label="数据名称" width="180" />
          <el-table-column prop="code" label="编码" />
          <el-table-column prop="version" label="版本" />
          <el-table-column prop="dataType" label="数据类型" width="180" />
          <el-table-column
            prop="mainFile"
            label="是否上传"
            width="180"
            :formatter="formatterOptions"
          />
          <el-table-column prop="mainFile" label="文件" width="180" />
          <el-table-column
            prop="updateTime"
            label="更新时间"
            width="180"
            :formatter="formatDate"
          />
          <el-table-column label="操作" fixed="right" align="center">
            <template #default="scope">
              <el-button
                link
                type="primary"
                size="small"
                @click="editClick(scope.row)"
              >
                <template #icon>
                  <Edit />
                </template>
                编辑
              </el-button>
              <el-button
                link
                type="primary"
                size="small"
                @click="delClick(scope.row)"
              >
                <template #icon>
                  <Delete />
                </template>
                删除
              </el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>
    </div>
    <el-dialog
      :title="dialogTitle"
      v-model="dialogShow"
      :close-on-click-modal="false"
      @open="dialogOpen"
    >
      <el-form
        label-width="100px"
        ref="editForm"
        inline
        :rules="rules"
        :model="dataRow"
      >
        <el-form-item label="数据名称" prop="dataName">
          <el-input
            v-model="dataRow.dataName"
            auto-complete="off"
            placeholder="请输入数据名称"
          />
        </el-form-item>
        <el-form-item label="编码" prop="code">
          <el-input
            v-model="dataRow.code"
            auto-complete="off"
            placeholder="请输入编码"
          />
        </el-form-item>
        <el-form-item label="版本号" prop="version">
          <el-input
            v-model="dataRow.version"
            auto-complete="off"
            placeholder="请输入版本号"
          />
        </el-form-item>
        <el-form-item label="状态" prop="status">
          <el-select
            class="inputW"
            v-model="dataRow.status"
            style="width: 100%"
            filterable
            allow-create
            default-first-option
            placeholder="请选状态"
          >
            <el-option
              v-for="item in statusOption"
              :key="item.code"
              :label="item.name"
              :value="item.code"
            />
          </el-select>
        </el-form-item>
        <el-form-item prop="dataType">
          <template #label>
            <span class="span-box">
              <span>数据类型</span>
              <el-tooltip
                style="diaplay: inline"
                effect="dark"
                content="数据类型"
                placement="top"
              >
                <QuestionFilled />
              </el-tooltip>
            </span>
          </template>

          <el-select
            class="inputW"
            v-model="dataRow.dataType"
            style="width: 100%"
            filterable
            allow-create
            default-first-option
            placeholder="请选数据类型"
          >
            <el-option
              v-for="item in dataTypeOptions"
              :key="item.code"
              :label="item.name"
              :value="item.code"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="主文件" prop="mainFile">
          <el-input
            v-model="dataRow.mainFile"
            auto-complete="off"
            placeholder="请输入主文件"
          />
          <el-upload ref="upload" class="upload-demo inline-block" action="https://jsonplacehoder.typeicon.com/posts/"
            :show-file-list="false" :on-preview="handlePreview" :on-remove="handleRemove" :auto-upload="true"
            :before-upload="beforeUploadAdd" accept="" :on-success="onSuccess">
            <i class="upload-btn iconfont" slot="trigger" type="primary">&#xe623;</i>
          </el-upload>


        </el-form-item>
        <el-form-item
          label="geojson"
          style="width: 100%"
          v-if="dataRow.dataType === 'geojson'"
        >
          <JsonEditorVue v-model="jsonVal" style="width: 100%" />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="cancelClick">取消</el-button>
        <el-button type="primary" @click="submitClick">提交</el-button>
      </template>
    </el-dialog>
  </div>
</template>
<script setup lang="ts">
import { reactive, toRaw, toRefs, ref, nextTick } from "vue";
import { Delete, Edit, QuestionFilled } from "@element-plus/icons-vue";
import userColFormat from "@/utils/pubHooks/useColFormat";
import {
  queryServiceList,
  addServiceList,
  deleteServiceList,
  updateServiceList
} from "@/api/service/manage";
import {fileUploadGetContent} from "@/api/map/map-data";

import useStaticData from "./hooks/useStaticData";
import JsonEditorVue from "json-editor-vue3";
import { ElMessage, ElMessageBox } from "element-plus";
defineOptions({
  name: "serviceManage"
});
const editForm = ref();
const state = reactive({
  searchObj: {
    code: "",
    dataName: "",
    pageNum: 1,
    pageSize: 10,
    dataType: ""
  },
  tableData: [],
  dialogTitle: "新增",
  dialogShow: false,
  dataRow: {},
  jsonVal: null
});
const { searchObj, tableData, dialogTitle, dialogShow, dataRow, jsonVal } =
  toRefs(state);
const { formatterOptions, formatDate } = userColFormat();
const getList = () => {
  const p = toRaw(searchObj.value);
  queryServiceList(p).then(res => {
    if (res["status"] === 200) {
      tableData.value = res["data"].list;
    }
  });
};
getList();
const { dataTypeOptions, statusOption, rules } = useStaticData();
const createClick = () => {
  dialogTitle.value = "新增";
  dataRow.value = {};
  jsonVal.value = null;
  dialogShow.value = true;
};
const cancelClick = () => {
  dialogShow.value = false;
};
const editClick = row => {
  dialogTitle.value = "编辑";
  dataRow.value = JSON.parse(JSON.stringify(row));
  jsonVal.value = dataRow.value.content;
  dialogShow.value = true;
};

const delClick = row => {
  ElMessageBox.confirm("此操作将永久删除该记录, 是否继续?", "提示", {
    type: "warning"
  })
    .then(() => {
      serviceDel(row);
    })
    .catch(() => {});
};
const serviceDel = row => {
  deleteServiceList({ dataId: row.dataId, code: row.code }).then(res => {
    if (res.status === 600) {
      ElMessage({
        message: "该路段已被引用，无法删除！",
        type: "warning"
      });
    } else {
      ElMessage({
        message: "执行成功",
        type: "success"
      });
      getList();
    }
  });
};
const submitClick = () => {
  editForm.value.validate(valid => {
    dataRow.value.content = JSON.stringify(jsonVal.value);
    if (valid) {
      if (dialogTitle.value === "新增") {
        serviceAdd();
      } else {
        serviceUpdate();
      }
    }
  });
};
const serviceAdd = () => {
  const p = toRaw(dataRow.value);
  addServiceList(p).then(res => {
    if (res.status === 200) {
      ElMessage({
        message: "执行成功",
        type: "success"
      });
      getList();
      dialogShow.value = false;
    }
  });
};
const serviceUpdate = () => {
  const p = toRaw(dataRow.value);
  updateServiceList(p).then(res => {
    if (res.status === 200) {
      ElMessage({
        message: "执行成功",
        type: "success"
      });
      getList();
      dialogShow.value = false;
    }
  });
};
const dialogOpen = () => {
  nextTick(() => {
    editForm.value.clearValidate();
  });
};

const handleRemove = (file, fileList) =>{
  console.log(file, fileList);
};

const handlePreview = (file) => {
  console.log(file);
};

const beforeUploadAdd = (file) => {
  let that = this;
  console.log("file===", file);
  // 如果上传的文件不符合条件
  var checkMessage = fileCheck(file);
  if (checkMessage !== "") {
    ElMessage({
      message: checkMessage,
      type: "success"
    });
    return;
  }
  var formData = new FormData();
  formData.append("file", file);
  formData.append("dataType", toRaw(dataRow.dataType));
  fileUploadGetContent(formData).then((response) => {
    console.log(response);
    if (response.status === 200) {
      ElMessage({
        message: "文件上传成功",
        type: "success"
      });


    } else if (response.status === 500) {
      ElMessage({
        message: `文件上传失败,失败原因${response.msg}`,
        type: "warning"
      });

    }
  });
};
const onSuccess = (response, file, fileList) => {
  console.log(response, file, fileList);
};


</script>
<style scoped lang="scss">
@import url(@/assets/css/pageCom.scss);
:deep(.el-form--inline .el-form-item) {
  width: 50%;
  margin-right: 0;
}
.span-box {
  svg {
    width: 15px;
    height: 15px;
    display: inline-block;
    position: relative;
    top: 3px;
  }
}
</style>

<template>
  <div class="pageWrap">
    <div class="pageWrap-top clearfix">
      <div class="fd-fl">
        <el-input placeholder="字典名称" v-model.trim="searchObj.dictName">
          <template #append>
            <el-button @click="getList">查询</el-button>
          </template>
        </el-input>
      </div>
      <div class="fd-fr">
        <el-button type="primary" @click="createClick">新建</el-button>
      </div>
    </div>
    <div class="pageWrap-main">
      <div class="wrap-table-div">
        <el-table
          style="width: 100%"
          row-key="dictId"
          height="100%"
          :data="tableData"
        >
          <el-table-column prop="dictId" label="字典ID" />
          <el-table-column prop="dictName" label="名称" />
          <el-table-column prop="dictGroupName" label="分组名称" />
          <el-table-column prop="dictValue" label="字典值" />
          <el-table-column prop="orders" label="排序号" />
          <el-table-column prop="remark" label="备注" />
          <el-table-column label="操作" fixed="right" align="center">
            <template #default="scope">
              <el-button
                link
                type="primary"
                size="small"
                @click="seeClick(scope.row)"
              >
                <template #icon>
                  <View />
                </template>
                查看
              </el-button>
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
    <el-dialog :title="dialogTitle" v-model="dialogShow">
      <el-form
        label-width="100px"
        ref="editForm"
        :disabled="dialogTitle == '详情'"
      >
        <el-form-item label="字典名称">
          <el-input v-model="dict.dictName" auto-complete="off" />
        </el-form-item>
        <el-form-item label="字典组名称">
          <el-input v-model="dict.dictGroupName" auto-complete="off" />
        </el-form-item>
        <el-form-item label="字典值">
          <el-input v-model="dict.dictValue" auto-complete="off" />
        </el-form-item>
        <el-form-item label="备注">
          <el-input v-model="dict.remark" auto-complete="off" />
        </el-form-item>
        <el-form-item label="排序号">
          <el-input-number
            v-model="dict.orders"
            :step="1"
            :min="0"
            :max="1000000"
            controls-position="right"
          />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="cancelClick">取消</el-button>
        <el-button
          type="primary"
          @click="submitClick"
          v-show="dialogTitle !== '详情'"
          >提交</el-button
        >
      </template>
    </el-dialog>
  </div>
</template>
<script setup lang="ts">
import { reactive, toRaw, toRefs } from "vue";
import { Delete, Edit, View } from "@element-plus/icons-vue";
import { ElMessage, ElMessageBox } from "element-plus";
import { getDicts, addDict, editDict, deleteDict } from "@/api/sys/dict";
defineOptions({
  name: "dict"
});
const state = reactive({
  searchObj: {
    dictGroupName: "",
    dictId: 0,
    dictName: "",
    dictValue: "",
    orders: 0
  },
  tableData: [],
  dialogTitle: "新增",
  dialogShow: false,
  dict: {}
});
const { tableData, dict, searchObj, dialogTitle, dialogShow } = toRefs(state);
const getList = (): void => {
  const p = toRaw(searchObj.value);
  getDicts(p).then(res => {
    if (res) {
      tableData.value = res["data"] || [];
    }
  });
};
getList();
const createClick = () => {
  dialogTitle.value = "新增";
  dict.value = {
    dictId: 0,
    dictName: "",
    dictGroupName: "",
    dictValue: "",
    orders: 0
  };
  dialogShow.value = true;
};
const submitClick = () => {
  if (dialogTitle.value === "新增") {
    dictAdd();
  } else {
    dictEdit();
  }
};
const dictAdd = () => {
  const p = toRaw(dict.value);
  addDict(p).then(res => {
    if (res) {
      ElMessage({
        message: "执行成功",
        type: "success"
      });
      getList();
      dialogShow.value = false;
    }
  });
};
const dictEdit = () => {
  const p = toRaw(dict.value);
  editDict(p).then(res => {
    if (res) {
      ElMessage({
        message: "执行成功",
        type: "success"
      });
      getList();
      dialogShow.value = false;
    }
  });
};
const cancelClick = () => {
  dialogShow.value = false;
};
const editClick = row => {
  dialogTitle.value = "编辑";
  dict.value = JSON.parse(JSON.stringify(row));
  dialogShow.value = true;
};
const delClick = row => {
  ElMessageBox.confirm("此操作将永久删除该记录, 是否继续?", "提示", {
    type: "warning"
  })
    .then(() => {
      dictDel(row);
    })
    .catch(() => {});
};
const dictDel = row => {
  deleteDict({ dictId: row.dictId }).then(res => {
    if (res) {
      ElMessage({
        message: "删除成功",
        type: "success"
      });
      getList();
    }
  });
};
const seeClick = row => {
  dialogTitle.value = "详情";
  dict.value = JSON.parse(JSON.stringify(row));
  dialogShow.value = true;
};
</script>
<style scoped lang="scss">
@import url(@/assets/css/pageCom.scss);
.wrap-table-div {
  height: 100%;
}
</style>

<template>
  <div class="pageWrap">
    <div class="pageWrap-top clearfix">
      <div class="fd-fr">
        <el-button type="primary" @click="createClick">新建</el-button>
      </div>
    </div>
    <div class="pageWrap-main">
      <div class="wrap-table-div">
        <el-table
          style="width: 100%"
          :data="tableData"
          row-key="deptId"
          :tree-props="{ children: 'children' }"
        >
          <el-table-column prop="deptId" label="部门ID" />
          <el-table-column prop="name" label="名称" />
          <el-table-column prop="parentName" label="上级部门" />
          <el-table-column prop="orderNum" label="排序号" />
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
    <el-dialog :title="dialogTitle" v-model="dialogShow">
      <el-form label-width="80px">
        <el-form-item label="部门名称">
          <el-input v-model="deptObj.name" />
        </el-form-item>
        <el-form-item label="上级部门">
          <el-input readonly v-model="deptObj.parentName" @click="openDept" />
        </el-form-item>
        <el-form-item label="排序号">
          <el-input-number
            v-model="deptObj.orderNum"
            :step="1"
            :min="0"
            :max="1000000"
            controls-position="right"
          />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="cancelClick">取消</el-button>
        <el-button type="primary" @click="submitClick">提交</el-button>
      </template>
    </el-dialog>
    <el-dialog
      title="上级部门"
      :close-on-click-modal="false"
      v-model="dptTreeShow"
    >
      <el-container
        style="
          height: 400px;
          width: 100%;
          border: 1px solid #eee;
          overflow-y: scroll;
        "
      >
        <el-tree
          ref="dptTree"
          style="width: 100%"
          :data="data2"
          node-key="id"
          highlight-current
          :props="defaultProps"
        />
      </el-container>
      <template #footer>
        <el-button @click="closeDeptDia">取消</el-button>
        <el-button type="primary" @click="dptTreeSure">确定</el-button>
      </template>
    </el-dialog>
  </div>
</template>
<script setup lang="ts">
import { ElMessage, ElMessageBox } from "element-plus";
import { Delete, Edit } from "@element-plus/icons-vue";
import { getDeptTree } from "@/api/sys/role";
import { reactive, ref, toRaw, toRefs } from "vue";
import { addDept, deleteDept, editDept } from "@/api/sys/dept";
defineOptions({
  name: "dept"
});
const dptTree = ref();
const defaultProps = {
  children: "children",
  label: "name"
};
const state = reactive({
  tableData: [],
  dialogTitle: "新增",
  dialogShow: false,
  deptObj: {},
  data2: [],
  dptTreeShow: false
});
const { tableData, dialogTitle, dialogShow, deptObj, data2, dptTreeShow } =
  toRefs(state);
const getList = () => {
  getDeptTree({ deptId: "-1" }).then(({ data }) => {
    tableData.value = data ? data.children : [];
  });
};
getList();
const createClick = () => {
  deptObj.value = {
    deptId: 0,
    parentId: -1,
    parentName: "一级部门",
    name: "",
    orderNum: 0,
    delFlag: 0
  };
  dialogTitle.value = "新增";
  dialogShow.value = true;
};
const cancelClick = () => {
  dialogShow.value = false;
};
const submitClick = () => {
  if (dialogTitle.value === "新增") {
    deptAdd();
  } else {
    deptEdit();
  }
};

const deptAdd = () => {
  const p = toRaw(deptObj.value);
  addDept(p).then(res => {
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

const editClick = row => {
  dialogTitle.value = "编辑";
  deptObj.value = JSON.parse(JSON.stringify(row));
  dialogShow.value = true;
};

const deptEdit = () => {
  const p = toRaw(deptObj.value);
  editDept(p).then(res => {
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

const delClick = row => {
  ElMessageBox.confirm("此操作将永久删除该记录, 是否继续?", "提示", {
    type: "warning"
  })
    .then(() => {
      delRow(row);
    })
    .catch(() => {});
};
const delRow = row => {
  deleteDept({ deptId: row.deptId }).then(res => {
    if (res) {
      ElMessage({
        message: "删除成功",
        type: "success"
      });
      getList();
    }
  });
};

const openDept = () => {
  getDeptTree({ deptId: "-1" }).then(({ data }) => {
    data2.value = data ? [data] : [];
  });
  dptTreeShow.value = true;
};
const closeDeptDia = () => {
  dptTreeShow.value = false;
};
const dptTreeSure = () => {
  const curNode = dptTree.value.getCurrentNode();
  deptObj.value.parentId = curNode.deptId;
  deptObj.value.parentName = curNode.name;
  dptTreeShow.value = false;
};
</script>
<style scoped lang="scss">
@import url(@/assets/css/pageCom.scss);
</style>

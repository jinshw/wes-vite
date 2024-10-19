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
          row-key="menuId"
          :tree-props="{ children: 'children' }"
          height="100%"
        >
          <el-table-column prop="name" label="名称" />
          <el-table-column prop="icon" label="图标" />
          <el-table-column prop="type" label="类型">
            <template #default="scope">
              <template v-if="scope.row.type == '0'">
                <el-tag>目录</el-tag>
              </template>
              <template v-else-if="scope.row.type == '1'">
                <el-tag type="success">菜单</el-tag>
              </template>
              <template v-else-if="scope.row.type == '2'">
                <el-tag type="info">按钮</el-tag>
              </template>
            </template>
          </el-table-column>
          <el-table-column prop="orderNum" label="排序号" />
          <el-table-column prop="url" label="路由" />
          <el-table-column prop="perms" label="授权标识" />
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
      <el-form label-width="80px" :rules="rules" :model="menu" ref="editForm">
        <el-form-item label="类型">
          <el-radio-group v-model="menu.type" @change="changeType">
            <el-radio :label="0">目录</el-radio>
            <el-radio :label="1">菜单</el-radio>
            <el-radio :label="2">按钮</el-radio>
          </el-radio-group>
        </el-form-item>
        <template v-if="menu.type == '0'">
          <el-form-item label="目录名称" prop="name">
            <el-input v-model="menu.name" auto-complete="off" />
          </el-form-item>
          <el-form-item label="上级菜单" prop="parentName">
            <el-input
              v-model="menu.parentName"
              auto-complete="off"
              readonly="readonly"
              @click="openMenu"
            />
          </el-form-item>
          <el-form-item label="菜单路由" prop="url">
            <el-input v-model="menu.url" auto-complete="off" />
          </el-form-item>
          <el-form-item label="排序号" prop="orderNum">
            <el-input-number
              v-model="menu.orderNum"
              :step="1"
              :min="0"
              :max="1000000"
              controls-position="right"
            />
          </el-form-item>
          <el-form-item label="图标" prop="icon">
            <el-input v-model="menu.icon" auto-complete="off" />
          </el-form-item>
        </template>
        <template v-if="menu.type == '1'">
          <el-form-item label="菜单名称" prop="name">
            <el-input v-model="menu.name" auto-complete="off" />
          </el-form-item>
          <el-form-item label="上级菜单" prop="parentName">
            <el-input
              v-model="menu.parentName"
              auto-complete="off"
              readonly="readonly"
              @click="openMenu"
            />
          </el-form-item>
          <el-form-item label="菜单路由" prop="url">
            <el-input v-model="menu.url" auto-complete="off" />
          </el-form-item>
          <el-form-item label="授权标识" prop="perms">
            <el-input v-model="menu.perms" auto-complete="off" />
          </el-form-item>
          <el-form-item label="图标" prop="icon">
            <el-input v-model="menu.icon" auto-complete="off" />
          </el-form-item>
          <el-form-item label="排序号" prop="orderNum">
            <el-input-number
              v-model="menu.orderNum"
              :step="1"
              :min="0"
              :max="1000000"
              controls-position="right"
            />
          </el-form-item>
        </template>
        <template v-if="menu.type == '2'">
          <el-form-item label="按钮名称" prop="name">
            <el-input v-model="menu.name" auto-complete="off" />
          </el-form-item>
          <el-form-item label="上级菜单" prop="parentName">
            <el-input
              v-model="menu.parentName"
              auto-complete="off"
              readonly="readonly"
              @click="openMenu"
            />
          </el-form-item>
          <el-form-item label="菜单路由" prop="url">
            <el-input v-model="menu.url" auto-complete="off" />
          </el-form-item>
          <el-form-item label="授权标识" prop="perms">
            <el-input v-model="menu.perms" auto-complete="off" />
          </el-form-item>
        </template>
      </el-form>
      <template #footer>
        <el-button @click="cancelClick">取消</el-button>
        <el-button type="primary" @click="submitClick">提交</el-button>
      </template>
    </el-dialog>
    <el-dialog
      title="上级菜单"
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
import { getMenuTree } from "@/api/sys/role";
import { reactive, ref, toRaw, toRefs } from "vue";
import { addMenu, editMenu, deleteMenu } from "@/api/sys/menu";
defineOptions({
  name: "menu"
});
const dptTree = ref();
const defaultProps = {
  children: "children",
  label: "name"
};
const rules = {
  name: [{ required: true, message: "请填写名称", trigger: "blur" }],
  url: [{ required: true, message: "菜单路由不能为空", trigger: "blur" }],
  perms: [{ required: true, message: "授权标识不能为空", trigger: "blur" }],
  icon: [{ required: true, message: "图标不能为空", trigger: "blur" }]
};
const state = reactive({
  tableData: [],
  dialogTitle: "新增",
  dialogShow: false,
  menu: {},
  data2: [],
  dptTreeShow: false
});
const { tableData, dialogTitle, dialogShow, menu, data2, dptTreeShow } =
  toRefs(state);
const getList = () => {
  getMenuTree({ menuId: "-1", searchText: "" }).then(({ data }) => {
    tableData.value = data ? data.children : [];
  });
};
getList();
const createClick = () => {
  menu.value = {
    menuId: 0,
    name: "",
    type: 0,
    url: "",
    perms: "",
    parentId: "-1",
    parentName: "一级菜单",
    icon: "",
    orderNum: 0
  };
  dialogTitle.value = "新增";
  dialogShow.value = true;
};
const cancelClick = () => {
  dialogShow.value = false;
};
const submitClick = () => {
  if (dialogTitle.value === "新增") {
    menuAdd();
  } else {
    menuEdit();
  }
};

const menuAdd = () => {
  const p = toRaw(menu.value);
  addMenu(p).then(res => {
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
  menu.value = JSON.parse(JSON.stringify(row));
  dialogTitle.value = "编辑";
  dialogShow.value = true;
};

const menuEdit = () => {
  const p = toRaw(menu.value);
  editMenu(p).then(res => {
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
  deleteMenu({ menuId: row.menuId }).then(res => {
    if (res) {
      ElMessage({
        message: "删除成功",
        type: "success"
      });
      getList();
    }
  });
};

const openMenu = () => {
  getMenuTree({ menuId: "-1", searchText: "" }).then(({ data }) => {
    data2.value = data ? [data] : [];
  });
  dptTreeShow.value = true;
};
const closeDeptDia = () => {
  dptTreeShow.value = false;
};
const dptTreeSure = () => {
  const curNode = dptTree.value.getCurrentNode();
  menu.value.parentId = curNode.menuId;
  menu.value.parentName = curNode.name;
  dptTreeShow.value = false;
};
const changeType = () => {};
</script>
<style scoped lang="scss">
@import url(@/assets/css/pageCom.scss);
.wrap-table-div {
  height: 100%;
}
</style>

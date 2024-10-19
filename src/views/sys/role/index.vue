<template>
  <div class="pageWrap">
    <div class="pageWrap-top clearfix">
      <div class="fd-fl">
        <el-input placeholder="角色名称" v-model="searchText">
          <template #append>
            <el-button @click="getList">查询</el-button>
          </template>
        </el-input>
      </div>
      <div class="fd-fr">
        <el-button type="primary" @click="create">新建</el-button>
      </div>
    </div>
    <div class="pageWrap-main">
      <el-table :data="tableData" style="width: 100%">
        <el-table-column type="selection" width="55" />
        <el-table-column prop="roleId" label="角色id" />
        <el-table-column prop="roleName" label="角色名称" />
        <el-table-column prop="remark" label="角色描述" />
        <el-table-column prop="" label="操作">
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
              @click="delclick(scope)"
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
    <el-dialog :title="dialogTitle" v-model="dialogShow" @open="dialogOpen">
      <el-form label-width="80ox">
        <el-form-item label="角色名称">
          <el-input auto-complete="off" v-model="searchObj.roleName" />
        </el-form-item>
        <el-form-item label="角色描述">
          <el-input auto-complete="off" v-model="searchObj.remark" />
        </el-form-item>
        <el-form-item class="role-search-tree">
          <el-col :span="12">
            <el-form-item label="菜单授权">
              <el-tree
                :data="menuTreeData"
                :props="defaultProps"
                show-checkbox
                :default-expand-all="true"
                ref="menuTree"
                node-key="menuId"
              />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="数据授权">
              <el-tree
                :data="deptTreeData"
                :props="defaultProps"
                show-checkbox
                :default-expand-all="true"
                ref="deptTree"
                node-key="deptId"
              />
            </el-form-item>
          </el-col>
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="cancelClick">取消</el-button>
        <el-button type="primary" @click="submit">提交</el-button>
      </template>
    </el-dialog>
  </div>
</template>
<script setup lang="ts">
import {
  getRoleList,
  getMenuTree,
  getDeptTree,
  addRole,
  editRole,
  deleteRole
} from "@/api/sys/role";
import { reactive, ref, toRaw, nextTick } from "vue";
import { ElMessage, ElMessageBox } from "element-plus";
import { Delete, Edit } from "@element-plus/icons-vue";
defineOptions({
  name: "roles"
});
/**数据部分 */
const searchText = ref("");
const searchObj = reactive({
  roleName: "",
  remark: "",
  roleId: 0,
  menus: []
});
const tableData = ref([]);
const dialogTitle = ref("新增");
const dialogShow = ref(false);
let menuTreeData = reactive([]);
const deptTreeData = ref([]);
const defaultProps = reactive({
  children: "children",
  label: "name"
});
const menuTree = ref();
const deptTree = ref();
let curRow = {}; // 不需要在页面上展示无需响应式
/**方法部分 */
const resetObj = () => {
  searchObj.roleName = "";
  searchObj.remark = "";
  searchObj.menus = [];
  searchObj.roleId = 0;
};
const getList = () => {
  searchObj.roleName = searchText.value;
  const param = toRaw(searchObj); // axios参数需为原生对象
  getRoleList(param).then(({ data }) => {
    tableData.value = data;
  });
  getMenuTree({ searchText: searchText.value, menuId: -1 }).then(({ data }) => {
    menuTreeData = [data];
  });
  getDeptTree({ deptId: "-1" }).then(({ data }) => {
    deptTreeData.value = data ? [data] : [];
  });
};
getList();
const create = () => {
  dialogTitle.value = "新增";
  dialogShow.value = true;
};
const cancelClick = () => {
  dialogShow.value = false;
};
const submit = () => {
  const menus = menuTree.value.getCheckedNodes();
  const rawMenus = menus.map(item => toRaw(item));
  const depts = deptTree.value.getCheckedNodes();
  const rawDepts = depts.map(item => toRaw(item));
  const param = {
    depts: rawDepts,
    menus: rawMenus,
    remark: searchObj.remark,
    roleName: searchObj.roleName
  };
  if (dialogTitle.value === "新增") {
    addRole(param).then(({ status }) => {
      if (status === 200) {
        ElMessage({
          message: "执行成功",
          type: "success"
        });
        resetObj();
        dialogShow.value = false;
        getList();
      }
    });
  } else {
    param.roleId = curRow.roleId;
    param.createTime = curRow.createTime;
    editRole(param).then(res => {
      if (res) {
        ElMessage({
          message: "执行成功",
          type: "success"
        });
        resetObj();
        dialogShow.value = false;
        getList();
      }
    });
  }
};
const delclick = scope => {
  ElMessageBox.confirm("此操作将永久删除该记录, 是否继续?", "提示", {
    type: "warning"
  })
    .then(() => {
      delRow(scope.row);
    })
    .catch(() => {});
};
const delRow = row => {
  deleteRole({ roleId: row.roleId }).then(({ status }) => {
    console.log(status);
    if (status === 200) {
      ElMessage({
        message: "删除成功",
        type: "success"
      });
      resetObj();
      getList();
    }
  });
};

const editClick = row => {
  //   console.log(row);
  dialogTitle.value = "编辑";
  curRow = row;
  dialogShow.value = true;
};

const setCheckey = (arr, target, key) => {
  arr.length = 0;
  function recrusion(target, key) {
    target.forEach(element => {
      if (element[key] !== -1) {
        arr.push(element[key]);
      }
    });
    if (target.children && target.children.length > 0) {
      recrusion(target.children, key);
    }
  }
  recrusion(target, key);
};
/**
 * dialog弹出-若是编辑赋初始值
 */
const dialogOpen = () => {
  if (dialogTitle.value === "新增") {
    nextTick(() => {
      menuTree.value.setCheckedKeys([]);
      deptTree.value.setCheckedKeys([]);
      resetObj();
    });
  } else {
    nextTick(() => {
      // 菜单授权树赋值
      const menuArr = [];
      setCheckey(menuArr, curRow.menus, "menuId");
      menuTree.value.setCheckedKeys(menuArr);
      // 数据授权树赋值
      const deptsArr = [];
      setCheckey(deptsArr, curRow.depts, "deptId");
      deptTree.value.setCheckedKeys(deptsArr);
      //** */
      searchObj.roleName = curRow.roleName;
      searchObj.remark = curRow.remark;
    });
  }
};
</script>
<style scoped lang="scss">
@import url(@/assets/css/pageCom.scss);
.role-search-tree :deep(.el-tree) {
  width: 100%;
}
.role-search-tree :deep(.el-form-item__content) {
  align-items: baseline;
}
</style>

<template>
  <div class="pageWrap">
    <div class="pageWrap-top clearfix">
      <div class="fd-fl">
        <el-form inline>
          <el-form-item label="账号">
            <el-input placeholder="账号" v-model="searchObj.username" />
          </el-form-item>
          <el-form-item label="角色">
            <el-select multiple v-model="searchObj.roles">
              <el-option
                v-for="item in rolesArr"
                :key="item.roleId"
                :label="item.roleName"
                :value="item.roleId"
              />
            </el-select>
          </el-form-item>
          <el-form-item>
            <el-button @click="getList">查询</el-button>
          </el-form-item>
        </el-form>
      </div>
      <div class="fd-fr">
        <el-button type="primary" @click="createClick">新建</el-button>
      </div>
    </div>
    <div class="pageWrap-main">
      <div class="wrap-table-div">
        <el-table :data="tableData" style="width: 100%">
          <el-table-column type="selection" width="55" />
          <el-table-column prop="username" label="账号" />
          <el-table-column prop="nickname" label="昵称" />
          <el-table-column prop="sysDept.name" label="所属部门" />
          <el-table-column
            prop="roleList"
            label="角色"
            :formatter="formatRoles"
          />
          <el-table-column label="状态">
            <template #default="scope">
              <template v-if="scope.row.status == '0'">
                <el-tag type="info">禁用</el-tag>
              </template>
              <template v-else-if="scope.row.status == '1'">
                <el-tag type="success">正常</el-tag>
              </template>
            </template>
          </el-table-column>
          <el-table-column label="操作">
            <template #default="scope">
              <el-button
                link
                type="primary"
                size="small"
                @click="editClick(scope)"
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
              <el-button
                link
                type="primary"
                size="small"
                @click="resetPwdClick(scope.row)"
              >
                <template #icon>
                  <Lock />
                </template>
                重置密码
              </el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>
    </div>
    <!-- 新增&&编辑弹框 -->
    <el-dialog
      :title="dialogTitle"
      v-model="dialogShow"
      :close-on-click-modal="false"
      @open="diaOpen"
    >
      <el-form label-width="80px" :rules="rules" :model="user" ref="editForm">
        <el-form-item label="登录账号" prop="username">
          <el-input v-model="user.username" auto-complete="off" />
        </el-form-item>
        <el-form-item label="昵称" prop="nickname">
          <el-input v-model="user.nickname" auto-complete="off" />
        </el-form-item>
        <el-form-item label="登录密码" prop="password">
          <el-input
            v-model="user.password"
            auto-complete="off"
            type="password"
            show-password
          />
        </el-form-item>
        <el-form-item label="所属部门" prop="deptId">
          <el-input
            v-model="user.deptName"
            auto-complete="off"
            readonly
            @click="openDeptDialog"
          >
            <template #append>
              <el-button @click="openDeptDialog">
                <template #icon><Search /></template>
              </el-button>
            </template>
          </el-input>
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="user.email" type="email" auto-complete="off" />
        </el-form-item>
        <el-form-item label="手机">
          <el-input v-model="user.mobile" auto-complete="off" />
        </el-form-item>
        <el-form-item label="角色" prop="roles">
          <el-select
            v-model="rolesSelect"
            style="width: 100%"
            multiple
            filterable
            allow-create
            default-first-option
            placeholder="请选择角色"
          >
            <el-option
              v-for="item in rolesArr"
              :key="item.roleId"
              :label="item.roleName"
              :value="item.roleId"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="状态">
          <el-radio-group v-model="user.status">
            <el-radio :label="0">禁用</el-radio>
            <el-radio :label="1">正常</el-radio>
          </el-radio-group>
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="cancel">取消</el-button>
        <el-button type="primary" @click="submitClick">提交</el-button>
      </template>
    </el-dialog>
    <el-dialog
      title="选择"
      v-model="deptDialogShow"
      :close-on-click-modal="false"
      @open="deptDiaOpen"
    >
      <el-container
        style="
          height: 400px;
          width: 100%;
          border: 1px solid #eee;
          overflow-y: auto;
        "
      >
        <el-tree
          ref="deptTree"
          show-checkbox
          :check-strictly="true"
          style="width: 100%"
          :data="deptTreeData"
          node-key="deptId"
          highlight-current
          :props="defaultProps"
          :default-expanded-keys="defaultExpandKeys"
          @node-click="nodeCick"
          @check-change="checkChange"
        />
      </el-container>
      <template #footer>
        <el-button @click="closeDeptDia">取消</el-button>
        <el-button type="primary" @click="treeSure">提交</el-button>
      </template>
    </el-dialog>
  </div>
</template>
<script setup lang="ts">
import { Delete, Edit, Lock, Search } from "@element-plus/icons-vue";
import { reactive, ref, toRaw, nextTick } from "vue";
import { ElMessage, ElMessageBox } from "element-plus";
import {
  getUserList,
  addUser,
  delUser,
  editUser,
  resetUserPassword
} from "@/api/sys/user";
import { getRoleList } from "@/api/sys/role";
import useDeptChose from "./hooks/useDeptChose";
defineOptions({
  name: "user"
});
/**数据部分*/
const tableData = ref([]);
const searchObj = reactive({
  username: "",
  roles: [],
  pageNum: 1,
  pageSize: 10
});
const rolesArr = ref([]);
const dialogTitle = ref("新增");
const dialogShow = ref(false);
const user = ref({});
const rolesSelect = ref([]);
const rules = {
  username: [
    { required: true, message: "请输账号", trigger: "blur" },
    {
      min: 3,
      max: 50,
      message: "长度在3 到 30 个字符",
      trigger: ["blur", "change"]
    }
  ],
  nickname: [
    { required: true, message: "请输昵称", trigger: "blur" },
    {
      min: 2,
      max: 50,
      message: "长度在2 到 30 个字符",
      trigger: ["blur", "change"]
    }
  ],
  deptId: [{ required: true, message: "请输部门", trigger: "change" }],
  password: [
    { required: true, message: "请输入登录密码", trigger: "blur" },
    {
      min: 4,
      max: 50,
      message: "长度在 4 到 50 个字符",
      trigger: ["blur", "change"]
    }
  ],
  email: [
    { required: true, message: "请输入邮箱地址", trigger: "blur" },
    {
      type: "email",
      message: "请输入正确的邮箱地址",
      trigger: ["blur", "change"]
    }
  ]
};
const editForm = ref();
/**方法部分 */
const getRols = () => {
  getRoleList({}).then(res => {
    rolesArr.value = res.data || [];
  });
};
getRols();
const getList = () => {
  getUserList(searchObj).then(res => {
    if (res["data"]) {
      tableData.value = res.data.list || [];
      console.log("===user==",tableData.value);
    }
  });
};
getList();
const diaOpen = () => {
  nextTick(() => {
    editForm.value.clearValidate();
  });
};
const createClick = () => {
  user.value = {};
  rolesSelect.value.length = 0;
  dialogTitle.value = "新增";
  dialogShow.value = true;
};
const cancel = () => {
  dialogShow.value = false;
};
const submitClick = () => {
  editForm.value.validate(valid => {
    if (valid) {
      user.value.roles = rolesSelect.value;
      if (dialogTitle.value === "新增") {
        userAdd();
      } else {
        user.value.password = "";
        userEdit();
        console.log(user);
      }
    } else {
      console.log("验证未通过");
    }
  });
};
const userAdd = () => {
  const p = toRaw(user.value);
  addUser(p).then(res => {
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
const userEdit = () => {
  const p = toRaw(user.value);
  editUser(p).then(res => {
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
const editClick = scope => {
  dialogTitle.value = "编辑";
  user.value = JSON.parse(JSON.stringify(scope.row));
  user.value.deptName = scope.row.sysDept.name;
  rolesSelect.value = user.value.roles.slice();
  dialogShow.value = true;
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
  delUser({ userId: row.userId }).then(res => {
    if (res) {
      ElMessage({
        message: "删除成功",
        type: "success"
      });
      getList();
    }
  });
};
const openDeptDialog = () => {
  getDTree();
  deptDialogShow.value = true;
};
const deptDiaOpen = () => {
  nextTick(() => {
    if (dialogTitle.value === "新增") {
      defaultExpandKeys.value.length = 0;
      deptTree.value.setCheckedKeys([]);
    } else {
      defaultExpandKeys.value = [user.value.deptId];
      deptTree.value.setCheckedKeys([user.value.deptId]);
    }
  });
};
//重置密码
const resetPwdClick = row => {
  ElMessageBox.confirm("重置该用户密码, 是否继续?", "提示", {
    type: "warning"
  })
    .then(() => {
      resetPwd(row);
    })
    .catch(() => {});
};
const resetPwd = async row => {
  const res = await resetUserPassword({ userId: row.userId });
  if (res) {
    ElMessage({
      message: "执行成功",
      type: "success"
    });
    getList();
  }
};
/**
 *
 * @param row
 * @param column
 */
const formatRoles = (row, column) => {
  let result = "";
  // 获取单元格数据
  const val = row[column.property];
  let temp = null;
  for (let i = 0; i < val.length; i++) {
    temp = val[i];
    result = result + temp.roleName + "|";
  }
  return result;
};

const treeSure = () => {
  const result = getTreeChecked()[0];
  user.value.deptId = result.deptId;
  user.value.deptName = result.name;
  closeDeptDia();
};

const {
  deptDialogShow,
  closeDeptDia,
  deptTreeData,
  defaultProps,
  getDTree,
  deptTree,
  getTreeChecked,
  defaultExpandKeys,
  nodeCick,
  checkChange
} = useDeptChose();
</script>
<style scoped lang="scss">
@import url(@/assets/css/pageCom.scss);
</style>

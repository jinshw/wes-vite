<template>
    <div>
        <div>
            <el-form :inline="true">
                <el-row>
                    <el-col :span="18">
                        <el-form-item label="设备类型">
                            <el-input v-model.trim="searchObj.typeName" type="text" placeholder="请输入设备类型名称" />
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
                <el-table-column type="index" label="序号" width="100" />
                <el-table-column prop="typeName" label="类型名称" width="200" />
                <el-table-column prop="code" label="编码" width="200"/>
                <el-table-column prop="optTime" label="更新时间"  :formatter="formatDate" />

                <el-table-column label="操作" fixed="right" align="center">
                    <!-- <template slot-scope="scope">
                        <el-button type="text" size="small" @click="handleEdit(scope.$index, scope.row)"><i
                                class="iconfont">&#xe732;</i> 编辑</el-button>
                        <el-button type="text" size="small" @click="handleDelete(scope.$index, scope.row)"><i
                                class="iconfont">&#xe74e;</i> 删除</el-button>
                    </template> -->

                    <template #default="scope">
                        <el-button type="text" size="small" @click="handleEdit(scope.$index, scope.row)"><i
                                class="iconfont">&#xe732;</i> 编辑</el-button>
                        <el-button type="text" size="small" @click="handleDelete(scope.$index, scope.row)"><i
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
        <el-dialog :title="dialogTitle" v-model="addDialogVisible" :before-close="handleDialogBeforeClose"
            :close-on-click-modal="false">
            <el-form ref="addFormRef" :inline="true" label-width="190px" size="mini" :rules="rules" :model="dataRow"
                class="dialogElForm">
                <el-form-item label="设备类型名称" prop="typeName">
                    <el-input v-model="dataRow.typeName" auto-complete="off" placeholder="请输入设备类型名称" />
                </el-form-item>
                <el-form-item label="编码" prop="code">
                    <el-input v-model="dataRow.code" auto-complete="off" placeholder="请输入编码"
                        :disabled="saveType == 2" />
                </el-form-item>
            </el-form>

            <!-- <div slot="footer" class="dialog-footer">
                <el-button type="primary" size="small" @click="resetForm" v-show="saveType == 1">重置</el-button>
                <el-button type="primary" size="small" @click="commitEventForm('addFormRef')">保存</el-button>
            </div> -->

            <template #footer>
                <span class="dialog-footer">
                    <el-button type="primary" size="small" @click="resetForm" v-show="saveType == 1">重置</el-button>
                    <el-button type="primary" size="small" @click="commitEventForm">保存</el-button>
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
import {
    mapDeviceTypeListByPage,
    addDeviceType,
    updateDeviceType,
    deleteDeviceType,
} from "@/api/map/map-device";

let searchObj = reactive({ typeName: "" });
let dialogTitle = ref("新增");
let addDialogVisible = ref(false);
let saveType = ref(1);
// const state = reactive({
//     tableData: [],
// });
// const { tableData } = toRefs(state);
const tableData = ref([]);


let activeNames = reactive(["1", "2"]);
// 默认每页数据量
let pagesize = ref(10);
// 当前页码
let currentPage = ref(1);
// 查询的页码
let start = ref(1);
// 默认数据总数
let totalCount = ref(1000);
let dataRow = reactive({ typeName: "", code: "", isDel: "0" });
let rules = reactive({
    typeName: [
        { required: true, message: "请输名称", trigger: "blur" },
        {
            min: 2,
            max: 30,
            message: "长度在2 到 30 个字符",
            trigger: ["blur", "change"],
        },
    ],
    code: [{ required: true, message: "请输编码", trigger: "blur" }],
});

let addFormRef = ref<FormInstance>();

onMounted(() => {
    search();
});

// 搜索
const search = () => {
    getList(currentPage.value, pagesize.value);
};

const getList = (pageNum, pageSize) => {
    searchObj.pageNum = pageNum;
    searchObj.pageSize = pageSize;
    mapDeviceTypeListByPage(searchObj).then((response) => {
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

const handleEdit = (index, row) => {
    dialogTitle.value = "编辑";
    addDialogVisible.value = true;
    saveType.value = 2;
    initRowToObj(row);
};
const initRowToObj = (row) => {
    // dataRow.value = JSON.parse(JSON.stringify(row));
    dataRow.dtId= row.dtId;
    dataRow.typeName= row.typeName;
    dataRow.code =  row.code;
};

const handleDelete = (index, row) => {
    ElMessageBox.confirm("此操作将永久删除该记录, 是否继续?", "提示", {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: "warning"
    })
        .then(() => {
            deleteDeviceType({ dtId: row.dtId }).then((response) => {
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
    // that.$refs[formRef].validate((valid) => {
    addFormRef.value.validate((isValid, invalidFields) => {
        if (isValid) {
            if (saveType.value == 1) {
                // 新增
                addDeviceType(dataRow).then((response) => {
                    if (response.status == 200) {
                        ElMessage({
                            message: "新增保存成功!",
                            type: "success"
                        });
                        addDialogVisible.value = false;
                        search();
                    } else if (response.status == 501) {
                        ElMessage({
                            message: "编码已经存在，请更换一个!",
                            type: "error"
                        });

                    }
                });
            } else {
                // 2:编辑
                updateDeviceType(dataRow).then((response) => {
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
    dataRow.value = { typeName: "", code: "", isDel: "0" };
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
    searchObj.typeName = "";
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
</script>

<style lang="scss" scoped></style>

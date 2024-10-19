<template>
    <div>
        <div id="top" class="search-form" style="text-align: right;">
            <el-button @click="search">查询</el-button>
            <el-button type="primary" @click="handleadd">添加</el-button>
        </div>

        <div class="table-wrap">
            <el-table ref="testTable" :data="tableData" style="width: 100%">
                <el-table-column prop="job_name" label="任务名称" sortable show-overflow-tooltip />

                <el-table-column prop="job_group" label="任务所在组" sortable />

                <el-table-column prop="job_class_name" label="任务类名" sortable />

                <el-table-column prop="trigger_name" label="触发器名称" sortable />

                <el-table-column prop="trigger_group" label="触发器所在组" sortable />

                <el-table-column prop="cron_expression" label="表达式" sortable />
                <el-table-column prop="trigger_state" label="状态" sortable />

                <el-table-column prop="time_zone_id" label="时区" sortable />

                <el-table-column label="操作" width="300">
                    <template #default="scope">
                        <el-button size="small" type="text" @click="handlePause(scope.$index, scope.row)">暂停</el-button>

                        <el-button size="small" type="text" @click="handleResume(scope.$index, scope.row)">恢复</el-button>

                        <el-button size="small" type="text" @click="handleDelete(scope.$index, scope.row)">删除</el-button>

                        <el-button size="small" type="text" @click="handleUpdate(scope.$index, scope.row)">修改</el-button>
                    </template>
                </el-table-column>
            </el-table>

            <div align="center">
                <el-pagination :current-page="currentPage" :page-sizes="[10, 20, 30, 40]" :page-size="pagesize"
                    layout="total, sizes, prev, pager, next, jumper" :total="totalCount" @size-change="handleSizeChange"
                    @current-change="handleCurrentChange" />
            </div>
        </div>

        <el-dialog title="添加任务" :close-on-click-modal="false" v-model="dialogFormVisible">
            <el-form :model="form" label-width="120px">
                <el-form-item label="任务名称">
                    <el-input v-model="form.jobName" auto-complete="off" placeholder="com.site.job.HelloJob" />
                </el-form-item>
                <el-form-item label="任务分组">
                    <el-input v-model="form.jobGroup" auto-complete="off" placeholder="分组名称" />
                </el-form-item>
                <el-form-item label="表达式">
                    <el-input v-model="form.cronExpression" auto-complete="off" placeholder="*/10 * * * * ?" />
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="dialogFormVisible = false">取 消</el-button>
                <el-button type="primary" @click="add">确 定</el-button>
            </div>
        </el-dialog>

        <el-dialog title="修改任务" v-model="updateFormVisible">
            <el-form :model="updateform">
                <el-form-item label="表达式" label-width="120px" style="width: 35%">
                    <el-input v-model="updateform.cronExpression" auto-complete="off" />
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="updateFormVisible = false">取 消</el-button>
                <el-button type="primary" @click="update">确 定</el-button>
            </div>
        </el-dialog>
    </div>
</template>

<script setup>
import { reactive, ref, toRaw, toRefs, onMounted } from "vue";
import { ElMessage, ElMessageBox } from "element-plus";
import { queryjob, addjob, pausejob, resumejob, deletejob, reschedulejob } from '@/api/sys/job'

const state = reactive({
    tableData: [],

});

const { tableData } = toRefs(state);

let form = reactive({
    jobName: '',
    jobGroup: '',
    cronExpression: ''
})

let updateform = reactive({
    jobName: '',
    jobGroup: '',
    cronExpression: ''
});

let pagesize = ref(10);
let currentPage = ref(1);
let start = ref(1);
let totalCount = ref(1000);
let dialogFormVisible = ref(false);
let updateFormVisible = ref(false);

onMounted(() => {
    loadData(currentPage.value, pagesize.value)
});


// 从服务器读取数据
const loadData = (pageNum, pageSize) => {
    queryjob({ pageNum: pageNum, pageSize: pageSize }).then(response => {
        console.log("response....",response)
        tableData.value = response.JobAndTrigger.list
        totalCount.value = response.number
    })
};

// 单行删除
const handleDelete = function (index, row) {
    // this.$confirm('此操作将永久删除该记录, 是否继续?', '提示', {
    //     confirmButtonText: '确定',
    //     cancelButtonText: '取消',
    //     type: 'warning'
    // })
    //     .then(() => {
    //         deletejob({ 'jobClassName': row.job_name, 'jobGroupName': row.job_group }).then(response => {
    //             that.loadData(this.currentPage, this.pagesize)
    //         })
    //     })
    //     .catch(() => {
    //         that.$message({
    //             type: 'info',
    //             message: '已取消删除'
    //         })
    //     });

    ElMessageBox.confirm("此操作将永久删除该记录, 是否继续?", "提示", {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: "warning"
    })
        .then(() => {
            deletejob({ 'jobClassName': row.job_name, 'jobGroupName': row.job_group }).then(response => {
                loadData(currentPage.value, pagesize.value)
            })
        })
        .catch(() => {
            ElMessage({
                message: "已取消删除！",
                type: "info"
            });
        });

};

// 暂停任务
const handlePause = function (index, row) {
    pausejob({ 'jobClassName': row.job_name, 'jobGroupName': row.job_group }).then(response => {
        loadData(currentPage.value, pagesize.value)
    })
};

// 恢复任务
const handleResume = function (index, row) {
    console.log("handleResume...",index, row);
    resumejob({ 'jobClassName': row.job_name, 'jobGroupName': row.job_group }).then(response => {
        loadData(currentPage.value, pagesize.value)
    })
};

// 搜索
const search = function () {
    loadData(currentPage.value, pagesize.value)
};

// 弹出对话框
const handleadd = function () {
    console.log("handleadd....");
    dialogFormVisible.value = true
    form.value = {
        jobName: '',
        jobGroup: '',
        cronExpression: ''
    };
};

// 添加
const add = function () {
    addjob({
        'jobClassName': form.jobName,
        'jobGroupName': form.jobGroup, 'cronExpression': form.cronExpression
    }).then(response => {
        loadData(currentPage.value, pagesize.value)
        dialogFormVisible.value = false
    })

};

// 更新
const handleUpdate = function (index, row) {
    console.log("handleUpdate...");
    updateFormVisible.value = true
    updateform.jobName = row.job_class_name
    updateform.jobGroup = row.job_group
    updateform.cronExpression = row.cron_expression
};

// 更新任务
const update = function () {
    reschedulejob({
        'jobClassName': updateform.jobName,
        'jobGroupName': updateform.jobGroup, 'cronExpression': updateform.cronExpression
    }).then(response => {
        loadData(currentPage.value, pagesize.value)
        updateFormVisible.value = false
    })
};

// 每页显示数据量变更
const handleSizeChange = function (val) {
    pagesize.value = val
    loadData(currentPage.value, pagesize.value)
};

// 页码变更
const handleCurrentChange = function (val) {
    currentPage.value = val
    loadData(currentPage.value, pagesize.value)
};

</script>

<style lang="scss" scoped></style>

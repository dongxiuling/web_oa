<template>
  <div class="app-container">
    <el-form ref="queryForm" :inline="true">
      <el-form-item label="工作名称" prop="name">
        <el-input
          v-model="search.name"
          placeholder="请输入工作名称"
          clearable
          size="small"
          style="width: 240px"
        />
      </el-form-item>
      <el-form-item>
        <el-button
          type="primary"
          icon="el-icon-search"
          size="mini"
          @click="onSearch"
          >搜索</el-button
        >
        <el-button icon="el-icon-refresh" size="mini" @click="onReset"
          >重置</el-button
        >
      </el-form-item>
    </el-form>

    <el-row :gutter="10" class="mb8">
      <el-col :span="1.5">
        <el-button
          type="primary"
          icon="el-icon-plus"
          size="mini"
          @click="$router.push('/worklists/addInspect')"
          >添加检查类工作</el-button
        >
      </el-col>
    </el-row>

    <el-table
      v-loading="loading"
      ref="multipleTable"
      :data="workList"
      tooltip-effect="dark"
      style="width: 100%"
      @row-click="detailHandle"
    >
      <!-- <el-table-column type="selection" width="55"></el-table-column> -->
      <el-table-column align="center" label="序号" width="50px" type="index">
        <!-- <template slot-scope="scope">{{ scope.row.id }}</template> -->
      </el-table-column>
      <el-table-column
        align="center"
        prop="name"
        label="工作名称"
      ></el-table-column>
      <el-table-column
        align="center"
        prop="createTime"
        label="创建时间"
      ></el-table-column>
      <el-table-column
        align="center"
        prop="remark"
        label="工作内容"
      ></el-table-column>
      <el-table-column label="操作" align="center" width="340px">
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="text"
            icon="el-icon-tickets"
            @click.stop="detailHandle(scope.row)"
            >查看详情</el-button
          >
          <el-button
            size="mini"
            type="text"
            icon="el-icon-s-tools"
            @click.stop="queryScore(scope.row)"
            >结果录入</el-button
          >
          <el-button
            size="mini"
            type="text"
            icon="el-icon-edit"
            @click.stop="editStepHandle(scope.row)"
            >修改步骤</el-button
          >
          <!-- <el-button
            size="mini"
            type="text"
            icon="el-icon-edit"
            @click="editHandle(scope.row)"
            >修改</el-button
          >-->
          <el-button
            size="mini"
            type="text"
            icon="el-icon-delete"
            @click.stop="delHandle(scope.row)"
            >删除工作</el-button
          >
        </template>
      </el-table-column>
    </el-table>

    <!-- 删除提示 -->
    <el-dialog
      title="提示"
      :visible.sync="dialogVisible"
      width="30%"
      :before-close="
        () => {
          dialogVisible = false;
        }
      "
    >
      <span>确认删除该项工作吗？删除后无法恢复。</span>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="doDelHandle">确 定</el-button>
      </span>
    </el-dialog>

    <el-dialog
      title="修改步骤"
      :visible.sync="stepDialogVisible"
      width="500px"
      :before-close="handleClose"
    >
      <el-form ref="stepsForm" :inline="true">
        <el-form-item
          v-for="(step, index) in steps"
          :key="index"
          :label="index + 1 + ''"
          prop="step"
        >
          <el-input
            v-model="step.stepName"
            placeholder="请输入工作名称"
            style="width: 120px"
          />
          <el-date-picker
            v-model="step.finishTime"
            type="datetime"
            placeholder="请选择步骤完成时间"
            style="width: 240px"
          ></el-date-picker>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="stepDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="updateStep">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import {
  selectInspect,
  delWorklistById,
  getStep,
  updateStep
} from '@/api/worklist'
import { dateFormat } from "@/utils/format";

export default {
  data() {
    return {
      workList: [],
      search: {
        name: '',
      },
      dialogVisible: false,
      id: null,
      loading: false,
      stepDialogVisible: false, // 添加步骤dialog
      steps: []
    };
  },
  methods: {
    async selectInspect(searchData = {}) {
      this.loading = true
      const res = await selectInspect(searchData)
      // console.log(res)
      if (res && res.code === '200') {
        const { data } = res
        this.workList = data
      }
      this.loading = false
    },
    delHandle({ id }) {
      this.dialogVisible = true
      this.id = id
    },
    async doDelHandle() {
      // console.log('doDelHandle');
      this.dialogVisible = false
      const res = await delWorklistById(this.id)
      this.$message({
        message: '删除成功',
        type: 'success'
      })
      this.selectInspect(this.search)
    },
    onReset() {
      this.search = {
        name: '',
      }
      this.selectInspect()
    },
    onSearch() {
      this.selectInspect(this.search)
    },
    detailHandle({ id }) {
      this.$router.push(`/worklists/getInspectDetail/${id}`)
    },
    editHandle({ id }) {
      this.$router.push(`/meetings/addRoom/${id}`)
    },
    async editStepHandle({ id }) {
      this.stepDialogVisible = true
      const res = await getStep(id)
      if (res && res.code && res.code === '200') {
        this.steps = res.data
      }
    },
    handleClose() {
      this.stepDialogVisible = false
      // this.worklist.step = ''
    },
    async updateStep() {
      const stepsTemp = []
      this.steps.forEach(item => {
        stepsTemp.push(Object.assign(item, {
          stepName: item.stepName,
          finishTime: dateFormat("YYYY-mm-dd HH:MM:SS", item.finishTime)
        }))
      })
      // console.log(stepsTemp);
      const res = await updateStep({
        steps: stepsTemp
      })
      // console.log(res);
      if (res && res.code === '200') {
        this.stepDialogVisible = false
        this.$message({
          message: "修改成功",
          type: "success"
        });
        this.$router.push("/worklist/inspect");
      }
    },
    queryScore({ id }) {
      this.$router.push(`/worklist/score/${id}`);
    }
  },
  created() {
    this.selectInspect()
  },
};
</script>

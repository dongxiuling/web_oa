<template>
  <div class="app-container">
    <el-form ref="queryForm" :inline="true">
      <!-- <el-form-item label="日期" prop="start">
        <el-date-picker
          v-model="search.dateRange"
          size="small"
          style="width: 240px"
          value-format="yyyy-MM-dd"
          type="daterange"
          range-separator="-"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
        ></el-date-picker>
      </el-form-item> -->
      <el-form-item label="时间筛选">
        <el-date-picker
          style="width: 380px"
          v-model="search.time"
          type="datetimerange"
          range-separator="至"
          start-placeholder="开始时间"
          end-placeholder="结束时间"
        ></el-date-picker>
      </el-form-item>
      <el-form-item label="值班部门" prop="deptId">
        <el-select
          v-model="search.deptId"
          placeholder="请选择值班部门"
          style="width: 160px"
        >
          <el-option
            v-for="item in deptList"
            :key="item.deptId"
            :label="item.deptName"
            :value="item.deptId"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="姓名" prop="userId">
        <el-select
          v-model="search.userId"
          placeholder="请选择姓名"
          style="width: 160px"
        >
          <el-option
            v-for="item in personList"
            :key="item.id"
            :label="item.name"
            :value="item.id"
          ></el-option>
        </el-select>
      </el-form-item>

      <el-form-item>
        <el-button
          type="primary"
          icon="el-icon-search"
          size="mini"
          @click="searchHandle()"
          >搜索</el-button
        >
        <el-button icon="el-icon-refresh" size="mini" @click="reSetHandle()"
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
          @click="$router.push('/dutys/addDuty')"
          >创建值班</el-button
        >
      </el-col>
    </el-row>
    <el-table :data="list" style="width: 100%" v-loading="loading">
      <el-table-column
        align="center"
        type="index"
        label="序号"
        :index="(currentPage - 1) * pageSize + 1"
      ></el-table-column>
      <el-table-column
        align="center"
        prop="startTime"
        label="值班时间"
      ></el-table-column>
      <!-- <el-table-column prop="endTime" label="结束时间"></el-table-column> -->
      <el-table-column
        align="center"
        prop="deptName"
        label="值班部门"
      ></el-table-column>
      <el-table-column
        align="center"
        prop="username"
        label="值班人员"
      ></el-table-column>
      <el-table-column
        align="center"
        prop="pos"
        label="值班地点"
      ></el-table-column>
      <el-table-column
        align="center"
        prop="remark"
        label="备注"
      ></el-table-column>
      <el-table-column align="center" label="操作" width="220">
        <template slot-scope="scope">
          <!-- <el-button
            size="mini"
            type="text"
            icon="el-icon-tickets"
            @click="lookHandle(scope.row)"
            >查看详情</el-button
          > -->
          <el-button
            size="mini"
            type="text"
            icon="el-icon-edit"
            @click="editHandle(scope.row)"
            >修改</el-button
          >
          <el-button
            size="mini"
            type="text"
            icon="el-icon-delete"
            @click="delHandle(scope.row)"
            >删除</el-button
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
      <span>确认删除吗</span>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="doDelHandle">确 定</el-button>
      </span>
    </el-dialog>
    <div class="page-box">
      <el-pagination
        style="width: 100%"
        background
        layout="total, prev, pager, next"
        :total="total"
        :current-page.sync="currentPage"
        :page-size="pageSize"
        @current-change="handleCurrentChange"
      ></el-pagination>
    </div>
  </div>
</template>

<script>
import { getDutyList, delDuty } from "@/api/duty"
import { lastDept } from "@/api/system/dept"
import { selectPerson } from "@/api/insider"
import { dateFormat } from "@/utils/format"

export default {
  data() {
    return {
      list: [],
      currentPage: 1,
      pageSize: 10,
      cateData: [],
      search: {
        deptId: 0,
        userId: '',
        time: ''
      },
      total: 0, //分页总页数
      loading: true,
      dialogVisible: false,
      id: null,
      deptList: [],
      personList: [],
      startTime: null,
      endTime: null,
    };
  },
  watch: {
    changeDeptId(val) {
      this.personList = []
      this.search.userId = ''
      this.getPersonInfoByDeptId(val)
    }
  },
  computed: {
    changeDeptId() { return this.search.deptId },
  },
  methods: {
    async getDeptList() {
      const res = await lastDept()
      if (res && res.code == 200 && res.data) {
        this.deptList = res.data
        this.deptList.unshift({ deptId: 0, deptName: "全部部门" });
      }
    },
    async getData() {
      const res = await getDutyList({
        current: this.currentPage,
        size: this.pageSize,
        deptId: this.search.deptId,
        userId: this.search.userId,
        startTime: this.startTime,
        endTime: this.endTime,
      })
      // console.log(res);
      if (res.code === '200' && res.data) {
        this.list = res.data.records;
        this.total = res.data.total;
        this.loading = false;
      }
    },
    async getPersonInfoByDeptId(deptId) {
      const res = await selectPerson({
        deptId,
        current: 0,
        size: 999,
      })
      if (res.code === '200' && res.data) {
        this.personList = res.data.records
      }
    },
    searchHandle() {
      this.endTime = dateFormat("YYYY-mm-dd HH:MM:SS", this.search.time[1])
      this.startTime = dateFormat("YYYY-mm-dd HH:MM:SS", this.search.time[0])
      this.getData();
    },
    reSetHandle() {
      const now = new Date()
      this.endTime = dateFormat("YYYY-mm-dd HH:MM:SS", now)
      this.startTime = dateFormat("YYYY-mm-dd HH:MM:SS", now.setMonth((new Date().getMonth() - 1)))
      this.search.time = [this.startTime, this.endTime]
      this.search.deptId = 0;
      this.search.userId = null;
      this.getData();
    },
    handleCurrentChange(value) {
      this.currentPage = value;
      this.getData();
    },
    /* lookHandle({ id }) {
      this.$router.push(`/dutys/addDuty/${id}`)
    }, */
    editHandle({ id }) {
      this.$router.push(`/dutys/addDuty/${id}`)
    },
    delHandle({ id }) {
      this.dialogVisible = true
      this.id = id
    },
    async doDelHandle() {
      this.dialogVisible = false
      const res = await delDuty(this.id)
      this.$message({
        message: '删除成功',
        type: 'success'
      })
      this.getData()
    },
  },
  created() {
    const now = new Date()
    this.endTime = dateFormat("YYYY-mm-dd HH:MM:SS", now)
    this.startTime = dateFormat("YYYY-mm-dd HH:MM:SS", now.setMonth((new Date().getMonth() - 1)))
    this.search.time = [this.startTime, this.endTime]

    this.getDeptList();
    this.getData();
  },

};
</script>
<style lang="scss" scoped>
.page-box {
  text-align: right;
  margin-top: 20px;
}
.el-tag {
  cursor: pointer;
}
</style>

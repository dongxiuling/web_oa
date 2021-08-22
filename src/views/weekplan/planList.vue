<template>
  <div class="app-container">
    <el-form ref="queryForm" :inline="true">
      <el-form-item label="选择周">
        <!--  <el-date-picker
          style="width: 360px"
          v-model="search.time"
          type="daterange"
          range-separator="至"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
          :picker-options="{
            firstDayOfWeek: 1,
          }"
        ></el-date-picker> -->
        <!-- format="yyyy-MM-dd年 第 WW 周" -->

        <el-date-picker
          v-model="search.time"
          type="week"
          placeholder="选择周"
          style="width: 300px"
          id="week"
          :picker-options="{
            firstDayOfWeek: 1,
          }"
          :format="startTime + ' 至 ' + endTime"
          @change="changeWeek"
        >
        </el-date-picker>
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
        label="电话号码"
      ></el-table-column>
      <el-table-column
        align="center"
        prop="remark"
        label="备注"
      ></el-table-column>
    </el-table>
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
import { weekplanStatistics } from "@/api/weekplan"
import { lastDept } from "@/api/system/dept"
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
      startTime: "",
      endTime: ""
    };
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
      const res = await weekplanStatistics({
        current: this.currentPage,
        size: this.pageSize,
        deptId: this.search.deptId,
        startTime: this.startTime,
        endTime: this.endTime,
      })
      console.log(res);
      if (res.code === '200' && res.data) {
        this.list = res.data.records;
        this.total = res.data.total;
        this.loading = false;
      }
    },
    searchHandle() {
      // this.endTime = dateFormat("YYYY-mm-dd HH:MM:SS", this.search.time[1])
      // this.startTime = dateFormat("YYYY-mm-dd HH:MM:SS", this.search.time[0])


      this.getData();
    },
    reSetHandle() {
      const now = new Date()
      this.endTime = dateFormat("YYYY-mm-dd HH:MM:SS", now)
      this.startTime = dateFormat("YYYY-mm-dd HH:MM:SS", new Date(now - 7 * 24 * 3600 * 1000))
      this.search.time = [this.startTime, this.endTime]
      this.search.deptId = 0;
      this.getData();
    },
    handleCurrentChange(value) {
      this.currentPage = value;
      this.getData();
    },
    fun(unixtimestamp) {
      var unixtimestamp = new Date(unixtimestamp);
      var year = 1900 + unixtimestamp.getYear();
      var month = "0" + (unixtimestamp.getMonth() + 1);
      var date = "0" + unixtimestamp.getDate();
      return year + "-" + month.substring(month.length - 2, month.length) + "-" + date.substring(date.length - 2, date
        .length)
    },
    changeWeek(val) {
      let timeStamp = val.getTime(); //标准时间转为时间戳，毫秒级别
      this.startTime = this.fun(timeStamp - 24 * 60 * 60 * 1000); //开始时间
      this.endTime = this.fun(timeStamp + (24 * 60 * 60 * 1000) * 5); //结束时间
      // console.log(this.startTime, this.endTime);
    },
    getFirstDayOfWeek(date) {
      return date.getTime() - (date.getDay() - 1) * 24 * 60 * 60 * 1000
    },
    getLastDayOfWeek(date) {
      return date.getTime() + (7 - date.getDay()) * 24 * 60 * 60 * 1000
    },
  },
  created() {
    const now = new Date()
    this.startTime = dateFormat("YYYY-mm-dd", this.getFirstDayOfWeek(now))
    this.endTime = dateFormat("YYYY-mm-dd", this.getLastDayOfWeek(now))
    this.search.time = new Date(this.startTime)

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

<template>
  <div class="app-container">
    <el-form ref="queryForm" :inline="true">
      <el-form-item label="选择周" prop="time">
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
          @click="$router.push('/workuploads/addUpload')"
          >创建周工作安排</el-button
        >
      </el-col>
    </el-row>
    <el-table :data="list" style="width: 100%" v-loading="loading">
      <!-- <el-table-column
        align="center"
        type="index"
        label="序号"
        :index="(currentPage - 1) * pageSize + 1"
      ></el-table-column> -->
      <el-table-column align="center" label="序号" type="index" />

      <el-table-column
        align="center"
        prop="showTime"
        label="周工作安排"
      ></el-table-column>
      <!-- <el-table-column prop="endTime" label="结束时间"></el-table-column> -->
      <el-table-column
        align="center"
        prop="remark"
        label="备注"
      ></el-table-column>
      <el-table-column prop="url" label="工作安排表格">
        <template slot-scope="scope">
          <el-button
            icon="el-icon-view"
            size="small"
            type="primary"
            @click="openfile(scope.row.url)"
            >查看</el-button
          >
        </template>
      </el-table-column>
      <el-table-column align="center" label="操作">
        <template slot-scope="scope">
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
import { selectWorkupload, delWorkuploadById } from "@/api/workupload"
import { dateFormat } from "@/utils/format"

export default {
  data() {
    return {
      list: [],
      currentPage: 1,
      pageSize: 10,
      search: {
        time: ''
      },
      total: 0,
      loading: true,
      dialogVisible: false,
      id: null,
      startTime: null,
      endTime: null,
    };
  },
  methods: {
    async getData() {
      const res = await selectWorkupload({
        current: this.currentPage,
        size: this.pageSize,
        startTime: this.startTime,
        type: 1,
      })
      //   console.log(res);
      if (res.code === '200' && res.data) {
        res.data.records.map(rec => {
          let startDate = new Date(rec.startTime)
          let endDate = new Date(rec.endTime)
          rec.showTime = startDate.getFullYear() + '年' + (startDate.getMonth() + 1) + '月' + startDate.getDate() + '日' + ' - ' +
            endDate.getFullYear() + '年' + (endDate.getMonth() + 1) + '月' + endDate.getDate() + '日'
        })
        this.list = res.data.records;
        this.total = res.data.total;
        this.loading = false;
      }
    },
    searchHandle() {
      this.getData();
    },
    reSetHandle() {
      const now = new Date()
      this.startTime = dateFormat("YYYY-mm-dd", this.getFirstDayOfWeek(now))
      this.endTime = dateFormat("YYYY-mm-dd", this.getLastDayOfWeek(now))
      this.search.time = new Date(this.startTime)
      this.getData();
    },
    handleCurrentChange(value) {
      this.currentPage = value;
      this.getData();
    },
    delHandle({ id }) {
      this.dialogVisible = true
      this.id = id
    },
    async doDelHandle() {
      this.dialogVisible = false
      const res = await delWorkuploadById(this.id)
      this.$message({
        message: '删除成功',
        type: 'success'
      })
      this.getData()
    },
    openfile(url) {
      window.open(url, "_blank");
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
      return date.getTime() - ((date.getDay() || 7) - 1) * 24 * 60 * 60 * 1000
    },
    getLastDayOfWeek(date) {
      return date.getTime() + (7 - (date.getDay() || 7)) * 24 * 60 * 60 * 1000
    },
  },
  created() {
    // this.search.time = dateFormat("YYYY-mm-dd", new Date())
    const now = new Date()
    this.startTime = dateFormat("YYYY-mm-dd", this.getFirstDayOfWeek(now))
    this.endTime = dateFormat("YYYY-mm-dd", this.getLastDayOfWeek(now))
    this.search.time = new Date(this.startTime)
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

<template>
  <div class="app-container">
    <el-form ref="queryForm" :inline="true">
      <el-form-item label="会议名称">
        <el-input
          placeholder="请输入会议名称"
          v-model="search.title"
          clearable
          size="small"
        />
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
    <el-table :data="meetingList" style="width: 100%" v-loading="loading">
      <el-table-column
        align="center"
        type="index"
        label="序号"
        :index="(currentPage - 1) * pageSize + 1"
      ></el-table-column>
      <el-table-column
        align="center"
        prop="title"
        label="会议名称"
      ></el-table-column>
      <el-table-column
        align="center"
        prop="startTime"
        label="开始时间"
        width="180"
      ></el-table-column>
      <el-table-column
        align="center"
        prop="endTime"
        label="结束时间"
        width="180"
      ></el-table-column>
      <el-table-column
        align="center"
        prop="content"
        label="会议要求"
      ></el-table-column>
      <el-table-column align="center" label="操作">
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="text"
            icon="el-icon-thumb"
            @click="detailHandle(scope.row)"
            >查看</el-button
          >
        </template>
      </el-table-column>
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
import { getMeetingList } from "@/api/meeting.js";

export default {
  data() {
    return {
      meetingList: [],
      currentPage: 1,
      pageSize: 10,
      cateData: [],
      search: {
        title: "",
        categoryId: 0,
        level: 0
      },
      total: 0, //分页总页数
      loading: true
    };
  },
  methods: {
    getData() {
      getMeetingList({
        current: this.currentPage,
        size: this.pageSize,
        title: this.search.title
      }).then(res => {
        this.meetingList = res.data.records;
        this.total = res.data.total;
        this.loading = false;
      });
    },
    searchHandle() {
      this.getData();
    },
    reSetHandle() {
      this.search.title = "";
      this.search.categoryId = "";
      this.getData();
    },
    handleCurrentChange(value) {
      this.currentPage = value;
      this.getData();
    },
    detailHandle(_data) {
      this.$router.push({
        path: "/meetings/detail",
        query: { id: _data.id, type: 2 }
      });
    }
  },
  created() {
    this.getData();
  }
};
</script>
<style lang="scss" scoped>
.page-box {
  text-align: right;
  margin-top: 20px;
}
</style>
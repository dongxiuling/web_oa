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

    <el-row :gutter="10" class="mb8">
      <el-col :span="1.5">
        <el-button
          type="primary"
          icon="el-icon-plus"
          size="mini"
<<<<<<< HEAD
          @click="$router.push('/meeting/meetadd')"
        >会议预定</el-button>
=======
          @click="$router.push('/meeting/add')"
          >发布会议</el-button
        >
>>>>>>> 30c183fa6afda0b7fdbc0083685a031f01b468a9
      </el-col>
    </el-row>

    <el-table :data="meetingList" style="width: 100%" v-loading="loading">
      <el-table-column
        align="center"
        type="index"
        width="150"
        label="序号"
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
      ></el-table-column>
      <el-table-column
        align="center"
        prop="endTime"
        label="结束时间"
      ></el-table-column>
      <el-table-column
        align="center"
        prop="content"
        label="会议要求"
      ></el-table-column>
      <el-table-column align="center" label="操作" width="200">
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="text"
            icon="el-icon-edit"
            @click="updateHandle(scope.row)"
            >修改</el-button
          >
          <el-button
            size="mini"
            type="text"
            icon="el-icon-search"
            @click="detailHandle(scope.row)"
            >查看</el-button
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
    <div class="page-box">
      <el-pagination
        style="width: 100%"
        background
        layout="prev, pager, next"
        :total="total"
        :current-page.sync="currentPage"
        :page-size="pageSize"
        @current-change="handleCurrentChange"
      ></el-pagination>
    </div>
  </div>
</template>

<script>

import { getAddList, deleteMeeting } from "@/api/meeting.js";

export default {
  data() {
    return {
      search: {
        title: "",
      },
      currentPage: 1,
      pageSize: 10,
      meetingList: [],
      loading: true,
      total: 0
    };
  },
  methods: {
    getData() {
      getAddList({
        current: this.currentPage,
        size: this.pageSize,
        title: this.search.title,
      }).then(res => {
        this.meetingList = res.data.records;
        this.total = res.data.total;
        this.loading = false;
      });
    },
    handleCurrentChange(value) {
      this.currentPage = value;
      this.getData();
    },
    /** 删除按钮操作 */
    delHandle(_data) {
      this.$confirm("此操作将永久删除考试题且无法恢复, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          deleteMeeting({
            id: _data.id
          }).then(res => {
            this.$message({
              message: "删除成功",
              type: "success"
            });
            this.getData();
          });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除"
          });
        });
    },
    updateHandle(_data) {
      this.$router.push({
        path: "/meeting/add",
        query: { id: _data.id }
      });
    },
    detailHandle(_data) {
      this.$router.push({
        path: "/meetings/detail",
        query: { id: _data.id, type: 1 }
      });
    },
    searchHandle() {
      this.getData();
    },
    reSetHandle() {
      this.search.title = "";
      this.getData();
    },

  },
  mounted() {
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
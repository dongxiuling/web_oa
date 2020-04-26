<template>
    <div>
       <div class="app-container">
    <el-form ref="queryForm" :inline="true">
      <el-form-item label="问卷名称">
        <el-input
          placeholder="请输入问卷名称"
          v-model="search.title"
          clearable
          size="small"
          style="width: 240px"
        />
      </el-form-item>
      <el-form-item>
        <el-button type="primary" icon="el-icon-search" size="mini" @click="searchHandle()">搜索</el-button>
        <el-button icon="el-icon-refresh" size="mini" @click="reSetHandle()">重置</el-button>
      </el-form-item>
    </el-form>
    <el-table :data="quesList" style="width: 100%" v-loading="loading">
      <el-table-column label="序号">
        <template slot-scope="scope">{{ scope.row.id }}</template>
      </el-table-column>
      <el-table-column prop="title" label="问卷名称"></el-table-column>
      <el-table-column prop="endDate" label="截止时间" ></el-table-column>
      <el-table-column label="操作" >
        <template slot-scope="scope">
          <el-button size="mini" type="text" icon="el-icon-edit" @click="updateHandle(scope.row)">修改</el-button>
          <el-button
            size="mini"
            type="text"
            icon="el-icon-search"
            @click="detailHandle(scope.row)"
          >查看</el-button>
          <el-button size="mini" type="text" icon="el-icon-delete" @click="delHandle(scope.row)">删除</el-button>
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
    </div>
</template>

<script>
import { getMyQuestion } from "@/api/question/index.js";
import { getCreatedExam, delExam } from "@/api/exam";
export default {
  data() {
    return {
      cateData: [],
      categoryId: "",
      quesList: [],
      total: 0,
      currentPage: 1,
      pageSize: 10,
      search: {
        title: "",
        categoryId: ""
      },
      loading: true
    };
  },
  methods: {
    getData() {
      getMyQuestion({
        current: this.currentPage,
        size: this.pageSize,
        title: this.search.title
      }).then(res => {
        this.quesList = res.data.records;
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
      this.$confirm("此操作将永久删除问卷且无法恢复, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(() => {
        delExam({
          id: _data.id
        }).then(res => {
          this.$message({
            message: "删除成功",
            type: "success"
          })
          this.getData();
        });
      }).catch(() => {
        this.$message({
          type: "info",
          message: "已取消删除"
        });
      });
    },
    updateHandle(_data) {
      this.$router.push({
        path: "/questionnaire/add",
        query: { id: _data.id }
      });
    },
    detailHandle(_data) {
      this.$router.push({
        path: "/questionnaire/detail",
        query: { id: _data.id }
      });
    },
    searchHandle() {
      this.getData();
    },
    reSetHandle() {
      this.search.title = "";
      this.getData();
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
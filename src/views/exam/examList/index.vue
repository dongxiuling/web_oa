<template>
  <div class="app-container">
    <el-form ref="queryForm" :inline="true">
      <el-form-item label="考试名称">
        <el-input
          placeholder="请输入考试名称"
          v-model="search.title"
          clearable
          size="small"
          style="width: 240px"
        />
      </el-form-item>
      <el-form-item label="考试类型">
        <el-select v-model="search.categoryId" placeholder="请选择考试类型">
          <el-option
            v-for="item in cateData"
            :key="item.id"
            :label="item.name"
            :value="item.id"
          ></el-option>
        </el-select>
      </el-form-item>
      <!-- <el-form-item label="状态" prop="status">
        <el-select placeholder="请选择" clearable size="small" style="width: 240px">
          <el-option />
        </el-select>
      </el-form-item>-->
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
    <el-table :data="examList" style="width: 100%" v-loading="loading">
      <el-table-column
      align="center"
        type="index"
        label="序号"
        :index="(currentPage - 1) * pageSize + 1"
      ></el-table-column>
      <el-table-column align="center" prop="title" label="考试名称"></el-table-column>
      <el-table-column
      align="center"
        prop="startDate"
        label="开始时间"
        width="180"
      ></el-table-column>
      <el-table-column
      align="center"
        prop="endDate"
        label="截止时间"
        width="180"
      ></el-table-column>
      <el-table-column align="center" prop="categoryName" label="模块"></el-table-column>
      <el-table-column align="center" prop="duration" label="时长(分钟)"></el-table-column>
      <el-table-column align="center" label="操作">
        <template slot-scope="scope">
          
          <el-button
            size="mini"
            type="text"
            icon="el-icon-thumb"
            @click="
              $router.push({
                path: '/exams/detail',
                query: { examId: scope.row.id },
              })
            "
            >查看</el-button
          >
          <el-button
              size="mini"
              type="text"
              icon="el-icon-delete"
              @click.stop="delItem(scope.row)"
              >删除</el-button
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
import { getMyExam, getExamCate, delExam } from "@/api/exam.js";
// import { getCategory } from "@/api/tool/category.js";
export default {
  data() {
    return {
      examList: [],
      currentPage: 1,
      pageSize: 10,
      cateData: [],
      search: {
        title: "",
        categoryId: "",
      },
      total: 0, //分页总页数
      loading: true,
    };
  },
  methods: {
    handleUpdate() {},
    getData() {
      let categoryId;
      if (!this.search.categoryId) {
        categoryId = 0;
      } else {
        categoryId = this.search.categoryId;
      }
      getMyExam({
        current: this.currentPage,
        size: this.pageSize,
        title: this.search.title,
        categoryId: categoryId,
      }).then((res) => {
        this.examList = res.data.records;
        this.total = res.data.total;
        this.loading = false;
      });
    },
    // 获取分类列表
    getCateList() {
      getExamCate({
        pageNum: 1,
        pageSize: 1000,
        // dictType: "sys_module_name",
      }).then((res) => {
        this.cateData = res.data.records;
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
    delItem(item) {
      this.$confirm("此操作将永久删除且无法恢复, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          // console.log(item)
          delExam(item.id).then((res) => {
            this.$message({
              message: "删除成功",
              type: "success",
            });
            this.getData();
          });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除",
          });
        });

    },
  },
  created() {
    this.getData();
    this.getCateList();
  },
};
</script>
<style lang="scss" scoped>
.page-box {
  text-align: right;
  margin-top: 20px;
}
</style>
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
      <el-form-item label="考试模块" >
        <el-select v-model="search.categoryId" placeholder="请选择考试模块">
          <el-option
            v-for="item in cateData"
            :key="item.dictCode"
            :label="item.dictLabel"
            :value="item.dictCode"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" icon="el-icon-search" size="mini" @click="searchHandle()">搜索</el-button>
        <el-button icon="el-icon-refresh" size="mini" @click="reSetHandle()">重置</el-button>
      </el-form-item>
    </el-form>

    <el-row :gutter="10" class="mb8">
      <el-col :span="1.5">
        <el-button
          type="primary"
          icon="el-icon-plus"
          size="mini"
          @click="$router.push('/exam/add')"
        >新增</el-button>
      </el-col>
    </el-row>

    <el-table :data="examList" style="width: 100%" v-loading="loading">
      <el-table-column label="序号">
        <template slot-scope="scope">{{ scope.row.id }}</template>
      </el-table-column>
      <el-table-column prop="title" label="考试名称"></el-table-column>
      <el-table-column prop="startDate" label="开始时间" width="180"></el-table-column>
      <el-table-column prop="endDate" label="结束时间" width="180"></el-table-column>
      <el-table-column prop="categoryName" label="模块"></el-table-column>
      <el-table-column prop="duration" label="时长"></el-table-column>
      <el-table-column label="操作" width="200">
        <template slot-scope="scope">
          <el-button size="mini" type="text" icon="el-icon-edit" @click="handleUpdate(scope.row)">修改</el-button>
          <el-button size="mini" type="text" icon="el-icon-search" @click="handleAdd(scope.row)">查看</el-button>
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
</template>

<script>
import { getCategory } from "@/api/tool/category.js";
import { getCreatedExam, delExam } from "@/api/exam";
export default {
  data() {
    return {
      cateData: [],
      categoryId: "",
      examList: [],
      total: 0,
      currentPage: 1,
      pageSize: 10,
      search: {
        title: "",
        categoryId: ""
      },
      loading:true
    };
  },
  methods: {
    getData() {
      let categoryId;
      if (!this.search.categoryId) {
        categoryId = 0;
      } else {
        categoryId = this.search.categoryId;
      }
      getCreatedExam({
        current: this.currentPage,
        size: this.pageSize,
        title: this.search.title,
        categoryId: categoryId
      }).then(res => {
        this.examList = res.data.records;
        this.total = res.data.total;
        this.loading = false;
      });
    },
    // 获取分类列表
    getCateList() {
      getCategory({
        pageNum: 1,
        pageSize: 1000,
        dictType: "sys_module_name"
      }).then(res => {
        this.cateData = res.rows;
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
          delExam({
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
    handleUpdate(_data) {
      this.$router.push({
        path: "/exam/add",
        query: { id: _data.id }
      });
    },
    searchHandle() {
      this.getData();
    },
    reSetHandle() {
      this.search.title = "";
      this.search.categoryId = "";
      this.getData();
    }
  },
  created() {
    this.getData();
    this.getCateList(); //获取分类
  }
};
</script>
<style lang="scss" scoped>
.page-box {
  text-align: right;
  margin-top: 20px;
}
</style>
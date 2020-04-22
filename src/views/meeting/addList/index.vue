<template>
  <div class="app-container">
    <el-form ref="queryForm" :inline="true">
      <el-form-item label="资料名称">
        <el-input
          placeholder="请输入资料名称"
          v-model="search.title"
          clearable
          size="small"
          style="width: 240px"
        />
      </el-form-item>
      <el-form-item label="资料模块">
        <el-select v-model="search.categoryId" placeholder="请选择资料模块">
          <el-option
            v-for="item in cateData"
            :key="item.dictCode"
            :label="item.dictLabel"
            :value="item.dictCode"
          ></el-option>
        </el-select>
      </el-form-item>
     <el-form-item label="资料级别" prop="level">
        <el-select v-model="search.level" placeholder="请选择资料级别">
          <el-option v-for="item in levels" :key="item.id" :label="item.name" :value="item.id"></el-option>
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
          @click="$router.push('/file/add')"
        >发布文件</el-button>
      </el-col>
    </el-row>

    <el-table :data="fileList" style="width: 100%" v-loading="loading">
      <el-table-column label="序号">
        <template slot-scope="scope">{{ scope.row.id }}</template>
      </el-table-column>
      <el-table-column prop="title" label="文件名称"></el-table-column>
      <el-table-column prop="createTime" label="更新时间" width="180"></el-table-column>
      <el-table-column prop="categoryName" label="模块"></el-table-column>
      <el-table-column label="操作" width="200">
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
</template>

<script>
import { getCategory } from "@/api/tool/category.js";
import { getAddList, deleteFile } from "@/api/file.js";

export default {
  data() {
    return {
      search: {
        title: "",
        categoryId: 0,
        level:0
      },
      cateData: [],
      currentPage: 1,
      pageSize: 10,
      fileList: [],
      loading: true,
      total: 0,
     levels: [
        {id:0,name:"全部事件"},
        { id: 1, name: "紧急事件" },
        { id: 2, name: "重点关注事件" },
        { id: 3, name: "一般事件" }
      ]
    };
  },
  methods: {
    getData() {
      getAddList({
        current: this.currentPage,
        size: this.pageSize,
        title: this.search.title,
        cateId: this.search.categoryId,
        level:this.search.level
      }).then(res => {
        this.fileList = res.data.records;
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
          deleteFile({
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
        path: "/file/add",
        query: { id: _data.id }
      });
    },
    detailHandle(_data) {
      this.$router.push({
        path: "/fil/detail",
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
    },
    // 获取分类列表
    getCateList() {
      getCategory({
        pageNum: 1,
        pageSize: 1000,
        dictType: "file_module_status"
      }).then(res => {
        this.cateData = res.rows;
        this.cateData.unshift(
            { dictCode: 0, dictLabel: "全部模块" }
        );
      });
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
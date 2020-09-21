<template>
  <div class="app-container">
    <el-form ref="queryForm" :inline="true">
      <el-form-item label="法规名称">
        <el-input placeholder="请输入法规名称" v-model="search.title" clearable size="small" />
      </el-form-item>
      <el-form-item label="法规分类">
        <el-select v-model="search.cateId" placeholder="请选择法规分类">
          <el-option
            v-for="item in cateData"
            :key="item.dictCode"
            :label="item.dictLabel"
            :value="item.dictCode"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="法规级别" prop="level">
        <el-select v-model="search.level" placeholder="请选择法规级别">
          <el-option v-for="item in levels" :key="item.id" :label="item.name" :value="item.id"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" icon="el-icon-search" size="mini" @click="searchHandle()">搜索</el-button>
        <el-button icon="el-icon-refresh" size="mini" @click="reSetHandle()">重置</el-button>
      </el-form-item>
    </el-form>
    <el-table :data="fileList" style="width: 100%" v-loading="loading">
      <el-table-column type="index" width="50" label="序号" :index="(currentPage-1)*pageSize+1"></el-table-column>
      <el-table-column prop="title" label="法规名称" width="180"></el-table-column>
      <el-table-column prop="createTime" label="上传时间" width="160"></el-table-column>
      <el-table-column prop="readTime" label="查阅时间" width="160"></el-table-column>
      <el-table-column prop="categoryName" label="模块"></el-table-column>
      <el-table-column label="查看状态">
        <template slot-scope="scope">
          <span v-if="scope.row.isRead">已查看</span>
          <span v-else>未查看</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" width="220">
        <template slot-scope="scope">
          <el-button type="primary" plain size="mini" @click="downHandle(scope.row )">下载</el-button>
          <el-button type="success" plain size="mini" @click="lookHandle(scope.row)" v-if="scope.row.readUrl">查看</el-button>
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
import { getALlList, downLoadFile, readFile, finishFile } from "@/api/file.js";
export default {
  data() {
    return {
      fileList: [],
      currentPage: 1,
      pageSize: 10,
      cateData: [],
      search: {
        title: "",
        cateId: 0,
        level: 0
      },
      total: 0, //分页总页数
      levels: [
        { id: 0, name: "全部事件" },
        { id: 1, name: "紧急事件" },
        { id: 2, name: "重点关注事件" },
        { id: 3, name: "一般事件" }
      ],
      loading: true
    };
  },
  methods: {
    handleUpdate() {},
    getData() {
      getALlList({
        current: this.currentPage,
        size: this.pageSize,
        title: this.search.title,
        cateId: this.search.cateId,
        level: this.search.level
      }).then(res => {
        this.fileList = res.data.records;
        this.total = res.data.total;
        this.loading = false;
      });
    },
    // 获取分类列表
    getCateList() {
      getCategory({
        pageNum: 1,
        pageSize: 1000,
        dictType: "file_module_status"
      }).then(res => {
        this.cateData = res.rows;
        this.cateData.unshift({ dictCode: 0, dictLabel: "全部分类" });
      });
    },
    searchHandle() {
      this.getData();
    },
    reSetHandle() {
      this.search.title = "";
      this.search.cateId = 0;
      this.getData();
    },
    handleCurrentChange(value) {
      this.currentPage = value;
      this.getData();
    },
    lookHandle(obj) {
      // console.log(obj.id)
      readFile({
        id: obj.id
      }).then(res => {
        window.open(obj.readUrl);
        this.getData();
      });
    },
    downHandle(obj) {
      // 调用下载资料接口
      // downLoadFile({ id: obj.id }).then(res => {
        window.open(obj.url);
        //  this.getData();
      // });
    },
    finishHandle(obj) {
      console.log(111)
      // 调用下载资料接口
      finishFile({ id: obj.id }).then(res => {
        // window.open(obj.url);
         this.getData();
      });
    }
  },
  created() {
    this.getData();
    this.getCateList();
  }
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

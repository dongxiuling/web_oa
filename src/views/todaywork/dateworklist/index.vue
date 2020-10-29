<template>
  <div class="app-container">
    <el-form ref="queryForm" :inline="true">
      <el-form-item label="工作名称">
        <el-input
          placeholder="请输入工作名称"
          v-model="search.title"
          clearable
          size="small"
        />
      </el-form-item>
      <el-form-item label="工作分类">
        <el-select v-model="search.cateId" placeholder="请选择工作分类">
          <el-option
            v-for="item in cateData"
            :key="item.id"
            :label="item.cateName"
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
    <el-table :data="list" style="width: 100%" v-loading="loading">
      <el-table-column
        type="index"
        label="序号"
        :index="(currentPage - 1) * pageSize + 1"
      ></el-table-column>
      <el-table-column prop="title" label="工作名称"></el-table-column>
      <el-table-column prop="cateName" label="工作分类"></el-table-column>
      <el-table-column prop="createTime" label="创建时间"></el-table-column>
      <el-table-column label="操作" width="220">
        <template slot-scope="scope">
          <el-button
            type="success"
            plain
            size="mini"
            @click="lookHandle(scope.row)"
            >查看</el-button
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
import { getTodayworkCate, getTodaywork, getTodayworkById } from "@/api/todaywork.js";

export default {
  data() {
    return {
      list: [],
      currentPage: 1,
      pageSize: 10,
      cateData: [],
      search: {
        title: "",
        cateId: 0,
      },
      total: 0, //分页总页数
      loading: true
    };
  },
  methods: {
    async getData() {
      const res = await getTodaywork({
        current: this.currentPage,
        size: this.pageSize,
        title: this.search.title,
        cateId: this.search.cateId,
      })
      // console.log(res);
      if (res.code === '200' && res.data) {
        this.list = res.data.records;
        this.total = res.data.total;
        this.loading = false;
      }

    },
    // 获取分类列表
    async getCateList() {
      const { code, data } = await getTodayworkCate({
        size: 1000,
      })
      if (code === '200' && data.records) {
        this.cateData = data.records;
        this.cateData.unshift({ id: 0, cateName: "全部分类" });
      }
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
    lookHandle({ id }) {
      this.$router.push(`/todayworks/getCateDetail/${id}`)
    },
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

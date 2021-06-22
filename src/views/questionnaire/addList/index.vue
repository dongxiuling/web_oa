<template>
  <div class="list">
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
          @click="$router.push('/questions/add')"
          >创建问卷</el-button
        >
      </el-col>
    </el-row>
    <el-table border :data="addList" style="width: 100%">
      <el-table-column
        type="index"
        label="序号"
        :index="(currentPage - 1) * pageSize + 1"
      ></el-table-column>
      <el-table-column label="问卷名称">
        <template slot-scope="scope">
          <span>{{ scope.row.title }}</span>
        </template>
      </el-table-column>
      <el-table-column class="handle_row" label="操作">
        <template slot-scope="scope">
          <el-button size="mini" @click="goExcises(scope.row)"
            >编辑问卷</el-button
          >
          <el-button size="mini" @click="look(scope.row)">查看结果</el-button>
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
import { getAddList } from "@/api/question/index";
export default {
  data() {
    return {
      search: {},
      addList: [],
      total: 0,
      currentPage: 1,
      pageSize: 10
    };
  },
  mounted() {
    this.getData();
  },
  methods: {
    getData() {
      getAddList({
        title: this.search.title,
        pageNum: this.currentPage,
        pageSize: this.pageSize
      }).then(res => {
        this.addList = res.data.records;
      });
    },
    goExcises(_data) {
      this.$router.push({
        path: "/questions/test/",
        query: { naireId: _data.id }
      });
    },
    look(_data) {
      this.$router.push({
        path: "/questions/detailList/",
        query: { naireId: _data.id }
      });
    },
    handleCurrentChange(value) {
      this.currentPage = value;
      this.getData();
    },
    searchHandle() {
      this.getData();
    },
    reSetHandle() {
      this.search.title = "";
      this.getData();
    }
  }
};
</script>
<style lang="scss" scoped>
.list {
  padding: 20px;
}
.add_btn {
  float: right;
  margin-bottom: 10px;
}
.pages {
  float: right;
}
</style>
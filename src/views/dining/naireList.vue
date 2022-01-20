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
            @click="$router.push('/dinings/add')"
            >创建问卷</el-button
          >
        </el-col>
      </el-row>
      <el-table :data="quesList" style="width: 100%" v-loading="loading">
        <el-table-column label="序号" align="center" type="index">
        </el-table-column>
        <el-table-column
          align="center"
          prop="title"
          label="问卷名称"
        ></el-table-column>
        <el-table-column
          align="center"
          prop="endDate"
          label="截止时间"
        ></el-table-column>
        <el-table-column
          align="center"
          class="handle_row"
          label="操作"
        >
          <template slot-scope="scope">
            <el-button
              size="mini"
              type="text"
              icon="el-icon-edit"
              @click.stop="goExcises(scope.row)"
              >编辑问题</el-button
            >
            <el-button
              size="mini"
              type="text"
              icon="el-icon-view"
              @click.stop="look(scope.row)"
              >查看排名</el-button
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
  </div>
</template>

<script>
import { findDiningNaire, delNaireById } from "@/api/dining";
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
      findDiningNaire({
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
    delItem(_data) {
      this.$confirm("此操作将永久删除问卷且无法恢复, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(() => {
        delNaireById(_data.id).then(res => {
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
        path: "/dining/questionAdd",
        query: { id: _data.id }
      });
    },
    // detailHandle(_data) {
    //   this.$router.push({
    //     path: "/questionnaire/detail",
    //     query: { id: _data.id, title: _data.title }
    //   });
    // },
    searchHandle() {
      this.getData();
    },
    reSetHandle() {
      this.search.title = "";
      this.getData();
    },
    goExcises(_data) {
      console.log(_data)
      this.$router.push({
        path: "/dinings/questionList/",
        query: { naireId: _data.id }
      });
    },
    look(_data) {
      this.$router.push({
        path: "/dinings/detailList/",
        query: { naireId: _data.id, type: _data.type, month: _data.month, title: _data.title  }
      });
    },
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
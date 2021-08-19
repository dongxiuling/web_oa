<template>
  <div
    class="app-container"
    v-loading.fullscreen.lock="fullscreenLoading"
    v-if="!fullscreenLoading"
  >
    <el-form ref="queryForm" :inline="true">
      <el-form-item label="部门" prop="deptId">
        <el-select
          v-model="search.deptId"
          placeholder="请选择部门"
          style="width: 240px"
        >
          <el-option
            v-for="item in deptList"
            :key="item.deptId"
            :label="item.deptName"
            :value="item.deptId"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button
          type="primary"
          icon="el-icon-search"
          size="mini"
          @click="getDetail()"
          >搜索</el-button
        >
        <el-button icon="el-icon-refresh" size="mini" @click="reSetHandle()"
          >重置</el-button
        >
        <el-button icon="el-icon-back" size="mini" @click="$router.go(-1)"
          >返回</el-button
        >
      </el-form-item>
    </el-form>
    <el-table :data="detailList" style="width: 100%">
      <el-table-column type="index" width="150" label="序号"></el-table-column>
      <el-table-column prop="userName" label="姓名"></el-table-column>
      <el-table-column prop="deptName" label="部门"></el-table-column>
      <el-table-column prop="isCompleted" label="完成情况" align="center">
        <template scope="scope">
          <el-tag v-if="scope.row.isCompleted != '0'" type="success"
            >已完成</el-tag
          >
          <el-tag v-else type="danger">未完成</el-tag>
        </template>
      </el-table-column>
      <el-table-column class="handle_row" label="操作">
        <template slot-scope="scope">
          <el-button
            v-if="scope.row.isCompleted != '0'"
            size="mini"
            @click="look(scope.row)"
            >问卷详情</el-button
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
import { lastDept } from "@/api/system/dept"
import { selectNaireInfo } from "@/api/question/index";
export default {
  data() {
    return {
      naireId: this.$route.query.naireId,
      detailList: [],
      deptList: [],
      search: {
        deptId: 0,
      },

      total: 0,
      currentPage: 1,
      pageSize: 10,
      fullscreenLoading: true
    };
  },
  methods: {
    async getDetail() {
      const res = await selectNaireInfo({
        deptId: this.search.deptId,
        naireId: this.naireId,
        current: this.currentPage,
        size: this.pageSize
      })
      // console.log(res);
      if (res && res.code === '200') {
        this.detailList = res.data.records
        this.total = res.data.total;
        this.fullscreenLoading = false;
      }
    },
    async look({ userId }) {
      this.$router.push({
        path: "/questions/testDetail/",
        query: { naireId: this.naireId, userId }
      });
    },
    handleCurrentChange(value) {
      this.currentPage = value;
      this.getDetail();
    },
    async getDeptList() {
      const res = await lastDept()
      if (res && res.code == 200 && res.data) {
        this.deptList = res.data
        this.deptList.unshift({ deptId: 0, deptName: "全部部门" });
      }
    },
    reSetHandle() {
      this.search.deptId = 0;
      this.getDetail();
    },
  },
  mounted() {
    this.getDeptList();
    this.getDetail();
  }
};
</script>

<style lang="scss" scoped>
.page-box {
  text-align: right;
  margin-top: 20px;
}
</style>
<template>
  <div
    class="app-container"
    v-loading.fullscreen.lock="fullscreenLoading"
    v-if="!fullscreenLoading"
  >
    <el-button
      icon="el-icon-back"
      size="mini"
      type="primary"
      style="marginbottom: 20px"
      @click="$router.go(-1)"
      >返回</el-button
    >

    <el-card class="box-card" shadow="always">
      <h2 class="title">{{ title }}</h2>
      <el-table :data="detailList" style="width: 100%" class="table">
        <el-table-column
          type="index"
          width="150"
          label="排名"
          align="center"
        ></el-table-column>
        <el-table-column
          align="center"
          prop="name"
          label="单位"
        ></el-table-column>
        <el-table-column
          align="center"
          prop="avg"
          label="平均分"
        ></el-table-column>
        <el-table-column
          align="center"
          prop="count"
          label="参与人数"
        ></el-table-column>
        <el-table-column align="center" class="handle_row" label="操作">
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
    </el-card>
  </div>
</template>

<script>
import { lastDept } from "@/api/system/dept"
import { getScore } from "@/api/dining";

export default {
  data() {
    return {
      naireId: this.$route.query.naireId,
      type: this.$route.query.type,
      month: this.$route.query.month,
      title: this.$route.query.title,
      detailList: [],
      deptList: [],
      search: {
        deptId: 0,
      },

      total: 0,
      currentPage: 1,
      pageSize: 999,
      fullscreenLoading: true,
      nsList: [],
    };
  },
  methods: {
    async getDetail() {
      const res = await getScore({
        month: this.month
      })
      if (res && res.code === '200') {
        this.detailList = res.data
        // this.total = res.data.total;
        this.fullscreenLoading = false;
      }
    },
    async look(_data) {
      this.$router.push({
        path: "/dinings/testDetail/",
        query: { naireId: this.naireId, id: _data.id, title: _data.name }
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
    this.getDetail();
  }
};
</script>

<style lang="scss" scoped>
.page-box {
  text-align: right;
  margin-top: 20px;
}
.box-card {
  margin-top: 20px;
  .item {
    margin-bottom: 10px;
  }
}
.title {
  text-align: center;
}
</style>
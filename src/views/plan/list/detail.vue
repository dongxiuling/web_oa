<template>
  <div
    class="app-container"
    v-loading.fullscreen.lock="fullscreenLoading"
    v-if="!fullscreenLoading"
  >
    <el-form ref="form" :model="plan" label-width="100px" size="medium">
      <el-form-item label="工作名称：">{{ plan.title }}</el-form-item>
      <el-form-item label="开始时间：">{{ plan.startTime }}</el-form-item>
      <el-form-item label="结束时间：">{{ plan.endTime }}</el-form-item>
      <el-form-item label="工作内容：">{{ plan.content }}</el-form-item>
      <el-form-item label="附件：">
        <template v-if="plan.files && plan.files[0] && plan.files[0].url">
          <el-button
            @click="openTabWin(plan.files[0].url, 'view')"
            icon="el-icon-view"
            size="small"
            type="primary"
            >查看附件</el-button
          >
        </template>
        <div v-else>无附件</div>
      </el-form-item>
      <el-form-item label="备注">{{ plan.remark }}</el-form-item>
      <el-form-item>
        <el-button type="primary" @click="$router.go(-1)">返回</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import { getWorkplanById } from "@/api/workplan.js";
export default {
  data() {
    return {
      wordId: this.$route.params.id,
      total: 0,
      currentPage: 1,
      pageSize: 10,
      plan: {
        title: "",
        content: ""
      },
      fullscreenLoading: true
    };
  },
  methods: {
    async getListDetail() {
      // console.log('wordId', this.wordId);
      const res = await getWorkplanById(this.wordId)
      // console.log(res);
      if (res.code === '200') {
        this.plan = res.data;
        this.total = res.data.total;
        this.fullscreenLoading = false;
      }

    },
    handleCurrentChange(value) {
      this.currentPage = value;
      this.getDetail();
    },
    openTabWin(url, type) {
      window.open(url, "_blank");
    },
  },
  mounted() {
    this.getListDetail();
  }
};
</script>

<style lang="scss" scoped>
.page-box {
  text-align: right;
  margin-top: 20px;
}
</style>
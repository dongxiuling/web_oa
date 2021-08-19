<template>
  <div
    class="app-container"
    v-loading.fullscreen.lock="fullscreenLoading"
    v-if="!fullscreenLoading"
  >
    <el-form ref="form" :model="plan" label-width="100px" size="medium">
      <el-form-item label="单位：">{{ plan.deptName }}</el-form-item>
      <el-form-item v-if="plan.type == 1 || plan.type == 2" label="日期：">{{ plan.week }}</el-form-item>
      <el-form-item v-if="plan.type == 3" label="特殊项名称">{{ plan.itemName }}</el-form-item>
      <el-form-item label="内容：">{{ plan.content }}</el-form-item>
      <el-form-item label="加减分：">{{ plan.fraction }}</el-form-item>
      <el-form-item label="备注">{{ plan.remark }}</el-form-item>
      <el-form-item>
        <el-button type="primary" @click="$router.go(-1)">返回</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import { itemDetail } from "@/api/evaluation.js";
export default {
  data() {
    return {
      id: this.$route.params.id,
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
      const res = await itemDetail(this.id)
      console.log(res);
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
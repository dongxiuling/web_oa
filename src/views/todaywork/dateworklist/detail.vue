<template>
  <div
    class="app-container"
    v-loading.fullscreen.lock="fullscreenLoading"
    v-if="!fullscreenLoading"
  >
    <el-form ref="form" :model="todaywork" label-width="100px" size="medium">
      <el-form-item label="工作名称：">{{ todaywork.title }}</el-form-item>
      <el-form-item label="创建时间：">{{ todaywork.createTime }}</el-form-item>
      <el-form-item label="工作内容：">{{ todaywork.content }}</el-form-item>
      <el-form-item>
        <el-button type="primary" @click="$router.go(-1)">返回</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import { getTodayworkById } from "@/api/todaywork.js";
export default {
  data() {
    return {
      wordId: this.$route.params.id,
      total: 0,
      currentPage: 1,
      pageSize: 10,
      todaywork: {
        title: "",
        content: ""
      },
      fullscreenLoading: true
    };
  },
  methods: {
    async getListDetail() {
      console.log('wordId', this.wordId);
      // 查看我的会议详情
      const res = await getTodayworkById({
        id: this.wordId,
        current: this.currentPage,
        size: this.pageSize
      })
      console.log(res);
      if (res.code === '200') {
        this.todaywork = res.data;
        this.total = res.data.total;
        this.fullscreenLoading = false;
      }

    },
    handleCurrentChange(value) {
      this.currentPage = value;
      this.getDetail();
    }
  },
  created() {
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
<template>
  <div class="app-container"  v-loading.fullscreen.lock="fullscreenLoading" v-if="!fullscreenLoading">
    <el-form ref="form" :model="examDetail" label-width="100px" size="medium">
      <el-form-item label="考试名称：">{{examDetail.title}}</el-form-item>
      <el-form-item label="考试类型：">{{examDetail.categoryName}}</el-form-item>
      <el-form-item label="考试时间：">{{examDetail.startDate}} 至 {{examDetail.endDate}}</el-form-item>
      <el-form-item
        label="单选题："
      >{{examDetail.singleNum}}个，每题{{examDetail.singleScore}}分，共{{examDetail.singleNum*examDetail.singleScore}}分</el-form-item>
      <el-form-item
        label="多选题："
      >{{examDetail.multipleNum}}个，每题{{examDetail.multipleScore}}分，共{{examDetail.multipleNum*examDetail.multipleScore}}分</el-form-item>
      <el-form-item
        label="判断题："
      >{{examDetail.judgmentNum}}个，每题{{examDetail.judgmentScore}}分，共{{examDetail.judgmentNum*examDetail.judgmentScore}}分</el-form-item>
      <el-form-item label="考试总分：">{{totalScore}}</el-form-item>
    </el-form>
   
  </div>
</template>

<script>
import { getExamDetail } from "@/api/exam";
export default {
  data() {
    return {
      examId: this.$route.query.id,
      total: 0,
      currentPage: 1,
      pageSize: 10,
      examDetail: {
        title: "科目一考试",
        categoryName: "司法",
        singleNum:0,
        singleScore:0,
        multipleNum:0,
        multipleScore:0,
        judgmentNum:0,
        judgmentScore:0
      },
      fullscreenLoading:true
    };
  },
  computed:{
      totalScore(){
          return this.examDetail.singleNum*this.examDetail.singleScore + this.examDetail.multipleNum*this.examDetail.multipleScore + this.examDetail.judgmentNum*this.examDetail.judgmentScore;
      }
  },
  methods: {
    getDetail() {
      console.log(1213334)
      getExamDetail({
        id: this.examId,
        current: this.currentPage,
        size: this.pageSize
      }).then(res => {
        this.examDetail = res.data;
        this.total = res.data.ue.total;
        this.fullscreenLoading = false;
      });
    },
    handleCurrentChange(value) {
      this.currentPage = value;
      this.getDetail();
    }
  },
  created() {
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
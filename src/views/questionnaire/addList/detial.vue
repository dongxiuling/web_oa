<template>
  <div class="app-container"  v-loading.fullscreen.lock="fullscreenLoading" v-if="!fullscreenLoading">
    <el-form ref="form" :model="quesDetail" label-width="100px" size="medium">
      <el-form-item label="问卷名称：">{{quesDetail.title}}</el-form-item>
      <el-form-item label="问卷类型：">司法问卷</el-form-item>
      <el-form-item label="问卷时间：">{{quesDetail.startDate}} 至 {{quesDetail.endDate}}</el-form-item>
      <el-form-item
        label="单选题："
      >{{quesDetail.singleNum}}个</el-form-item>
      <!-- <el-form-item
        label="多选题："
      >{{examDetail.multipleNum}}个，每题{{examDetail.multipleScore}}分，共{{examDetail.multipleNum*examDetail.multipleScore}}分</el-form-item> -->
      <el-form-item
        label="简答题："
      >{{quesDetail.judgmentNum}}个</el-form-item>
      <!-- <el-form-item label="问卷总分：">{{totalScore}}</el-form-item> -->
    </el-form>
    <el-table :data="quesDetail.ue.records" style="width: 100%">
      <el-table-column label="序号">
        <template slot-scope="scope">{{ scope.row.id }}</template>
      </el-table-column>
      <el-table-column prop="userName" label="参考人"></el-table-column>
      <el-table-column prop="deptName" label="部门"></el-table-column>
      <!-- <el-table-column prop="score" label="分数"></el-table-column> -->
      <el-table-column prop="createTime" label="答题时间" width="180"></el-table-column>
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
import { getExamDetail } from "@/api/exam";
export default {
  data() {
    return {
      quesId: this.$route.query.id,
      total: 0,
      currentPage: 1,
      pageSize: 10,
      quesDetail: {
        title: "科目一考试",
        categoryName: "司法",
        singleNum:0,
        // singleScore:0,
        // multipleNum:0,
        // multipleScore:0,
        judgmentNum:0,
        // judgmentScore:0
      },
      fullscreenLoading:true
    };
  },
//   computed:{
//       totalScore(){
//           return this.quesDetail.singleNum*this.quesDetail.singleScore + this.quesDetail.multipleNum*this.quesDetail.multipleScore + this.quesDetail.judgmentNum*this.quesDetail.judgmentScore;
//       }
//   },
  methods: {
    getDetail() {
      getExamDetail({
        id: this.quesId,
        current: this.currentPage,
        size: this.pageSize
      }).then(res => {
        this.quesDetail = res.data;
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
<template>
  <div class="analytic-container">
    <el-row>
      <el-card class="box-card">
        <div slot="header" class="clearfix">
          <span>考试成绩</span>
        </div>
        <div style="margin-bottom:50px;">
          <h4>
            <i class="el-icon-pie-chart"></i>
            得分：{{score}}
          </h4>
          <h4>考试名称：{{title}}</h4>
          <h4>正确题数： {{rightNum}}/{{total}}</h4>
        </div>
      </el-card>
    </el-row>
  </div>
</template>

<script>
import {  getExamScore } from "@/api/exam";

export default {
  data() {
    return {
      examId: this.$route.query.examId,
      rightNum: 0,
      score: 0,
      title: "",
      total: 0
    };
  },
  methods: {
    getData() {
      getExamScore({
        examId: this.examId
      }).then(res => {
        this.rightNum = res.data.rightNum;
        this.score = res.data.score;
        this.title = res.data.title;
        this.total = res.data.totalNum;
      });
    }
  },
  created() {
    this.getData();
  }
};
</script>

<style lang="scss"  scoped>
.analytic-container {
  background-color: #f0f2f5;
  padding: 30px;
  min-height: calc(100vh - 84px);
  .el-icon-pie-chart {
    color: #47b893;
    margin-right: 15px;
  }
}
</style>

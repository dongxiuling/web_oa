<template>
  <div class="analytic-container">
    <el-row>
      <el-card class="box-card">
        <div slot="header" class="clearfix">
          <span>考试成绩</span>
        </div>
        <div style="margin-bottom:50px;">
            <h4><i class="el-icon-pie-chart"></i>得分：40.0</h4>
            <h4>试卷： 计算机基础-数组专项练习</h4>
            <h4>正确题数： 2/5</h4>
            <h4>用时： 00:00:14</h4>
            <el-button type="warning" @click="$router.push('/exam/done')">答案解析</el-button>
        </div>
      </el-card>
    </el-row>
  </div>
</template>

<script>


export default {

}
</script>

<style lang="scss"  scoped>
.analytic-container {
  background-color: #f0f2f5;
  padding: 30px;
  min-height: calc(100vh - 84px);
  .el-icon-pie-chart{
      color:#47b893;
      margin-right: 15px;
  }
}

</style>

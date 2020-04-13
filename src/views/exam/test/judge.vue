<template>
  <div class="app-container">
    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <span>判断题</span>
      </div>
      <el-main>
        <el-form ref="form">
          <h3>以下关于继承的叙述正确的是？</h3>

          <el-radio-group v-model="judge">
            <el-radio :label="true">正确</el-radio>
            <el-radio :label="false">错误</el-radio>
          </el-radio-group>
          <el-form-item align="right">
            <el-button type="primary" @click="$router.push('/exam/analytic')">下一题</el-button>
          </el-form-item>
        </el-form>
      </el-main>
    </el-card>
  </div>
</template>

<script>
export default {
  data() {
    return {
      judge: true
    };
  },
  methods: {}
};
</script>

<style scoped>
.line {
  text-align: center;
}
.el-radio {
  /* display: block; */
  margin-top: 20px;

  margin-bottom: 20px;
  white-space: normal;
}
.el-radio.is-bordered + .el-radio.is-bordered {
  margin-left: 0px;
  height: auto;
  padding-bottom: 10px;
  line-height: 1.5;
}
</style>


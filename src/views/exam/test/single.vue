<template>
  <div class="app-container">
    <el-card class="box-card">
       <div slot="header" class="clearfix">
          <span>单选题</span>
        </div>
        <el-main >
          <el-form ref="form" >
            <h3>以下关于继承的叙述正确的是？</h3>

            <el-radio-group v-model="single" >
              <el-radio :label="'A'" border >A.在Java中类只允许单一继承</el-radio>
              <el-radio :label="'B'" border>B.在Java中一个类不能同时继承一个类和实现一个接口</el-radio>
              <el-radio :label="'C'" border>C.渲染表单的 React 组件还控制着用户输入过程中表单发生的操作。渲染表单的 React 组件还控制着用户输入过程中表单发生的操作。渲染表单的 React 组件还控制着用户输入过程中表单发生的操作。</el-radio>
              <el-radio :label="'D'" border size="medium">D.渲染表单的 React 组件还控制着用户输入过程中表单发生的操作。</el-radio>
            </el-radio-group>
            <el-form-item align="right">
              <el-button type="primary" @click="$router.push('/exam/multiple')">下一题</el-button>
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
      single:'A'
    };
  },
  methods: {
    
  }
};
</script>

<style scoped>
.line {
  text-align: center;
}
.el-radio {
  /* display: block; */
  width:98%;
  margin-bottom: 20px;
  white-space: normal;
}
.el-radio.is-bordered+.el-radio.is-bordered{
  margin-left:0px;
  height: auto;
  padding-bottom: 10px;
  line-height: 1.5;
}

</style>


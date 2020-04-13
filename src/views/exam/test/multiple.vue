<template>
  <div class="app-container multiple-box">
    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <span>多选题</span>
      </div>
      <el-main>
        <el-form ref="form">
          <h3>以下关于继承的叙述正确的是？</h3>

          <el-checkbox-group v-model="multiple">
            <el-checkbox :label="'A'" border>A.在Java中类只允许单一继承</el-checkbox>
            <el-checkbox :label="'B'" border>B.在Java中一个类不能同时继承一个类和实现一个接口</el-checkbox>
            <el-checkbox
              :label="'C'"
              border
            >C.渲染表单的 React 组件还控制着用户输入过程中表单发生的操作。渲染表单的 React 组件还控制着用户输入过程中表单发生的操作。渲染表单的 React 组件还控制着用户输入过程中表单发生的操作。</el-checkbox>
            <el-checkbox :label="'D'" border size="medium">D.渲染表单的 React 组件还控制着用户输入过程中表单发生的操作。</el-checkbox>
          </el-checkbox-group>
          <el-form-item align="right">
            <el-button type="primary" @click="$router.push('/exam/judge')">下一题</el-button>
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
      multiple: ["A"]
    };
  },
  methods: {}
};
</script>

<style >
.multiple-box .line {
  text-align: center;
}
.multiple-box .el-checkbox {
  /* display: block; */
  width: 98%;
  margin-bottom: 20px;
  white-space: normal;
}
.multiple-box .el-checkbox.is-bordered + .el-checkbox.is-bordered {
  margin-left: 0px;
  padding-bottom: 10px;
  height: auto;
  /* height: auto;
  padding-bottom: 10px;
  line-height: 1.5; */
}
.multiple-box .el-checkbox.is-bordered.el-checkbox--medium .el-checkbox__label {
  white-space: normal;
  display: inline !important;
}
</style>


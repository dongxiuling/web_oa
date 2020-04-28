<!-- 动态表单元素 -->
<template>
  <div>
    <el-col v-if="formInfo.fieldType == 'input'" :span="12">
      <el-form-item :label="formInfo.filedName">
        <el-input :placeholder="'请输入'+formInfo.filedName" v-model="inpVal"></el-input>
      </el-form-item>
    </el-col>
    <el-col v-if="formInfo.fieldType == 'timedate'" :span="12">
      <el-form-item :label="formInfo.filedName">
        <el-date-picker type="date" placeholder="选择日期" v-model="inpVal" style="width: 100%;"></el-date-picker>
      </el-form-item>
    </el-col>
    <el-col v-if="formInfo.fieldType == 'textarea'" :span="24">
      <el-form-item :label="formInfo.filedName">
        <el-input type="textarea" v-model="inpVal"></el-input>
      </el-form-item>
    </el-col>
    <el-col v-if="formInfo.fieldType == 'ref'" :span="12">
      <el-form-item :label="formInfo.filedName">
        <el-button
          type="text"
          size="mini"
          icon="el-icon-edit"
        >{{formInfo.filedName}}</el-button>
      </el-form-item>
    </el-col>
  </div>
</template>

<script>
export default {
  data() {
    return {
      inpVal: undefined
    };
  },
  props: ["formInfo"],
  //生命周期 - 创建完成（访问当前this实例）
  created() {},
  //生命周期 - 挂载完成（访问DOM元素）
  mounted() {},
  watch: {
    inpVal(val) {
      this.$emit("getVal", val);
    }
  }
};
</script>
<style scoped>
/* @import url(); 引入css类 */
</style>
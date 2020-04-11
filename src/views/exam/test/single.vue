<template>
  <div class="app-container">
    <el-form ref="queryForm" :inline="true">
      <el-radio-group v-model="single" @change="change()">
        <el-radio :label="'A'">备选项</el-radio>
        <el-radio :label="'B'">备选项</el-radio>
        <el-radio :label="'C'">备选项</el-radio>
        <el-radio :label="'D'">备选项</el-radio>
      </el-radio-group>
    </el-form>
  </div>
</template>

<script>
export default {
  data() {
    return {
      single: 'A'
    };
  },
  methods:{
      change(){
          console.log(this.single);
      }
  }
};
</script>

<style lang="scss" scoped>
</style>
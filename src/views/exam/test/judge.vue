<template>
  <div>
    <el-page-header @back="goBack" content="判断题"></el-page-header>
    <el-radio-group v-model="judge">
      <el-radio :label="true">对</el-radio>
      <el-radio :label="false">错</el-radio>
    </el-radio-group>
  </div>
</template>

<script>
export default {
  data() {
    return {
      judge: true
    };
  }
};
</script>

<style lang="scss" scoped>
</style>
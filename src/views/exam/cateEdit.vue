<template>
  <div class="list">
    <div>
      <el-page-header @back="$router.back()" :content="number==1?'编辑分类':'添加分类信息'"></el-page-header>
      <el-divider></el-divider>
    </div>
    <el-form label-width="100px">
      <el-form-item label="考试ID">
        <el-input v-model="cateId" placeholder="ID" :disabled="true"></el-input>
      </el-form-item>
      <el-form-item label="分类名称">
        <el-input v-model="cateName" clearable></el-input>
      </el-form-item>
    </el-form>
    <el-button class="btn" size="medium" type="primary" >确认修改</el-button>
    <el-button  class="btn" size="medium" type="primary" >增加</el-button>
  </div>
</template>
<script>

export default {
    data(){
        return {
            cateId: this.$route.query.cateId * 1,
            cateName: "司法"
        }
    }
};
</script>
<style lang="scss" scoped>
.list{
  padding: 20px;
}
.btn {
  float: right;
  margin: 20px 0px 20px 20px;
}
.path-img{
  width: 60px;
  vertical-align: middle;
}
</style>
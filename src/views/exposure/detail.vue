<template>
  <div class="container">
    <div class="title">{{ dataInfo.title }}</div>
    <div class="time">{{ dataInfo.createTime }}</div>
    <div class="content" v-html="dataInfo.content"></div>
  </div>
</template>
<script>
import { exposureDetail } from "@/api/exposure";
export default {
  data() {
    return {
      dataInfo: {},
    };
  },
  created() {
    this.getData(this.$route.params.id);
  },
  methods: {
    // 获取详情信息
    getData(id) {
      exposureDetail(id).then((res) => {
        console.log(res);
        this.dataInfo = res.data;
        console.log(this.dataInfo);
      });
    },
  },
};
</script>
<style scoped>
.container{
    margin: 20px;
    padding-top: 30px;
    overflow: hidden;
}
.container .title{
    margin: 20px 0;
    font-size: 40px;
    font-weight: bold;
    text-align: center;
}
.container .time{
    text-align: center;
    font-size: 14px;
    color: #999;
}
.container .content{
    width: 1000px;
    margin: 50px auto 0;
}
</style>
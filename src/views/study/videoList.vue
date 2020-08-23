<!-- 学习园地视频 -->
<template>
  <div>
    <button @click="testHandle">test</button>
  </div>
</template>

<script>
import { testSocket } from "@/api/study";
export default {
  data() {
    return {};
  },
  methods:{
    testHandle(){
      
      testSocket().then((res)=>{
        console.log(res);
      })
    }
  },
  //生命周期 - 创建完成（访问当前this实例）
  created() {},
  //生命周期 - 挂载完成（访问DOM元素）
  mounted() {}
};
</script>
<style scoped>
/* @import url(); 引入css类 */
</style>
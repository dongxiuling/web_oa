<!-- 动态表单 -->
<template>
  <div>
    <el-form ref="form" label-width="100px">
      <form-item v-for="item in formList" :key="item.id" :formInfo="item" @getVal="getFormVal" />
      <el-form-item>
        <el-button type="primary" @click="onSubmit">发起申请</el-button>
        <el-button>保存</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import formItem from "./ApplyFormItem.vue";
import { getForm } from "@/api/apply/add";
export default {
  data() {
    return {
      test: {
        filedName: "申请人",
        fieldType: "input"
      },
      formList:[]
    };
  },
  components: {
    formItem
  },
  methods: {
    getFormVal(val) {
      console.log(val);
    },
    //获取添加表单
    getApplyForm() {
      let type = "car";
      getForm({ type }).then(res => {
        this.formList = res.data;
      });
    },
    //提交数据
    onSubmit(){

    }
  },
  //生命周期 - 创建完成（访问当前this实例）
  created() {},
  //生命周期 - 挂载完成（访问DOM元素）
  mounted() {
    this.getApplyForm();
  }
};
</script>
<style scoped>
/* @import url(); 引入css类 */
</style>
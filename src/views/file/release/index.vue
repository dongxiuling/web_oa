<!-- 发布法规 -->
<template>
  <div class="app-container">
    <el-form ref="form" :model="form" :rules="rules" label-width="160px">
      <el-form-item label="法规名称" prop="title">
        <el-input v-model="form.title" style="width: 300px"></el-input>
      </el-form-item>
      <el-form-item label="法规简介" prop="desc">
        <el-input
          type="textarea"
          :autosize="{ minRows: 2, maxRows: 8 }"
          placeholder="请输入法规简介"
          v-model="form.desc"
          style="width: 300px"
        ></el-input>
      </el-form-item>
      <el-form-item label="法规内容" prop="title">
        <tinymce v-model="form.content" :height="300" />
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="submitForm('form')"
          >立即创建</el-button
        >
        <el-button @click="resetForm('form')">取消</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import Tinymce from "@/components/Tinymce/index";
import { addContent } from "@/api/file";
import { encode, decode } from 'js-base64';
export default {
  data() {
    return {
      form: {},
      rules: {
        title: [{ required: true, message: "请输入法规名称", trigger: "blur" }],
        desc: [{ required: true, message: "请输入法规简介", trigger: "blur" }],
      },
    };
  },
  methods: {
    // 提交表单操作
    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.addHandle();
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
    //   清除表单内容
    resetForm(formName) {
      this.$refs[formName].resetFields();
    },
    // 添加法规内容
    addHandle(){
      addContent({
        remark:this.form.desc,
        name:this.form.title,
        content:encode(this.form.content)
      }).then((res)=>{
        this.$router.push({
        path: "/lawlist",
      });
      })
    }
  },
  //生命周期 - 创建完成（访问当前this实例）
  mounted() {},
  components: { Tinymce },
};
</script>
<style scoped>
</style>
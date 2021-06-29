<!-- 发布法规 -->
<template>
  <div v-loading="loading" class="app-container">
    <el-form ref="form" :model="form" :rules="rules" label-width="130px">
      <el-form-item label="曝光标题" prop="title">
        <el-input v-model="form.title" style="width: 300px"></el-input>
      </el-form-item>
      <el-form-item label="曝光内容" prop="content">
        <tinymce v-model="form.content" :height="300" />
        <!-- <VueUeditorWrap :config="myConfig" v-model="form.content" /> -->
      </el-form-item>
      <el-form-item>
        <el-button v-if="isChange" type="primary" @click="editForm('form')"
          >立即修改</el-button
        >
        <el-button v-else type="primary" @click="submitForm('form')"
          >立即创建</el-button
        >
        <el-button @click="resetForm('form')">取消</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import Tinymce from "@/components/Tinymce/index";
// import VueUeditorWrap from "vue-ueditor-wrap";
import { addExposure, exposureDetail,exposureUpdate } from "@/api/exposure";
export default {
  data() {
    return {
      loading: false,
      form: {
        title: "",
        content: "",
      },
      rules: {
        title: [{ required: true, message: "请输入标题", trigger: "blur" }],
        content: [{ required: true, message: "请输入内容", trigger: "blur" }],
      },

      isChange: false, //false添加 true修改
    };
  },
  methods: {
    //   修改内容
    editForm(formName) {
      this.loading = true;
      this.$refs[formName].validate((valid) => {
        if (valid) {
          exposureUpdate({
            title: this.form.title,
            type: 2,
            id:this.$route.query.id,
            content: this.form.content,
          }).then((res) => {
            this.$message({
              message: "修改成功",
              type: "success",
            });
            this.loading = false;
            this.$router.push("/exposure/list");
          });
        } else {
          console.log(valid, "error submit!!");
        }
      });
    },
    // 提交表单操作
    submitForm(formName) {
      this.loading = true;
      this.$refs[formName].validate((valid) => {
        if (valid) {
          addExposure({
            title: this.form.title,
            type: 2,
            content: this.form.content,
          }).then((res) => {
            this.$message({
              message: "添加成功",
              type: "success",
            });
            this.loading = false;
            this.$router.push("/exposure/list");
          });
        } else {
          console.log(valid, "error submit!!");
        }
      });
    },
    //   清除表单内容
    resetForm(formName) {
      this.$refs[formName].resetFields();
    },
    // 修改曝光问题
    initUpdate(id) {
      this.loading = true;
      this.isChange = true;
      exposureDetail(id).then((res) => {
        let _data = {
          title: res.data.title,
          content: res.data.content,
        };
        this.form = _data;
        this.loading = false;
      });
    },
  },
  //生命周期 - 创建完成（访问当前this实例）
  mounted() {
    let _id = this.$route.query.id;
    if (_id) {
      this.initUpdate(_id);
    }
  },
  components: {
    Tinymce,
    // VueUeditorWrap
  },
};
</script>
<style scoped>
</style>
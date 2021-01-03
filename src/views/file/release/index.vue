<!-- 发布法规 -->
<template>
  <div class="app-container">
    <el-form ref="form" :model="form" :rules="rules" label-width="130px">
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
      <el-form-item label="法规文件上传(请上传word文件)" prop="title">
        <!-- <tinymce v-model="form.content" :height="300" /> -->
        <!-- <VueUeditorWrap :config="myConfig" v-model="form.content" /> -->
        <Uploader
          v-on:getFile="getFileUrl(arguments)"
          :change="isChange"
          :name="file.name"
        ></Uploader>
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
// import Tinymce from "@/components/Tinymce/index";
// import VueUeditorWrap from "vue-ueditor-wrap";
import { addContent } from "@/api/file";
import { encode, decode } from 'js-base64';
import Uploader from "@/components/Uploader";

export default {
  data() {
    return {
      form: {},
      myConfig: {
        elementPathEnabled: false,
        wordCount: false, //是否开启字数统计
        // 初始容器高度
        initialFrameHeight: 380,
        // 初始容器宽度
        initialFrameWidth: "100%",
        // 上传文件接口（这个地址是我为了方便各位体验文件上传功能搭建的临时接口，请勿在生产环境使用！！！）
        serverUrl: "http://www.gxxmglzx.com/tender/ueditor/controller.php",
        // UEditor 资源文件的存放路径，如果你使用的是 vue-cli 生成的项目，通常不需要设置该选项，vue-ueditor-wrap 会自动处理常见的情况，如果需要特殊配置，参考下方的常见问题2
        UEDITOR_HOME_URL: process.env.BASE_URL + "UEditor/"
      },
      rules: {
        title: [{ required: true, message: "请输入法规名称", trigger: "blur" }],
        desc: [{ required: true, message: "请输入法规简介", trigger: "blur" }],
      },
      file: {
        title: "",
        url: "http://www.rr.cc",
        readUrl: "http://www.rr.cc",
        type: "regulatory_documents",
        name: ""
      },
      isChange: false, //false添加 true修改
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
    addHandle() {
      if(!this.file.url){
        this.$message.error('请上传法规word文件');
        return
      }
      console.log(this.file);
      const url = this.file.url.slice(7)
      console.log(url);
      const urlArr = url.split('/')
      
      addContent({
        remark: this.form.desc,
        name: this.form.title,
        // content: encode(this.form.content)
        content: '',
        fid: urlArr[1],
        ip: urlArr[0].split(':')[0],
        port: urlArr[0].split(':')[1]
      }).then((res) => {
        this.$router.push({
          path: "/lawlist",
        });
      })
    },
    getFileUrl(args) {
      this.file.url = args[1];
      this.file.readUrl = args[2];
      this.file.name = args[0];
      this.isChange = true;
    },
  },
  //生命周期 - 创建完成（访问当前this实例）
  mounted() { },
  components: {
    // Tinymce,
    // VueUeditorWrap 
    Uploader
  },
};
</script>
<style scoped>
</style>
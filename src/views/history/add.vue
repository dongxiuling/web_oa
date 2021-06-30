<!-- 发布法规 -->
<template>
  <div v-loading="loading" class="app-container">
    <el-form ref="form" :model="form" :rules="rules" label-width="130px">
      <el-form-item label="文章标题" prop="title">
        <el-input v-model="form.title" style="width: 300px"></el-input>
      </el-form-item>
      <el-form-item label="活动时间" required>
      <el-form-item prop="date">
        <el-date-picker type="date" placeholder="选择日期" v-model="form.date" style="width: 300px;"></el-date-picker>
      </el-form-item>
    
  </el-form-item>
      <el-form-item label="文章内容" prop="content">
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
import {dateFormat} from "../../utils/format";
import Tinymce from "@/components/Tinymce/index";
import VueUeditorWrap from "vue-ueditor-wrap";
import { addExposure, exposureDetail,exposureUpdate } from "@/api/exposure";
export default {
  data() {
    return {
      // myConfig: {
      //   elementPathEnabled: false,
      //   wordCount: false, //是否开启字数统计
      //   // 初始容器高度
      //   initialFrameHeight: 380,
      //   // 初始容器宽度
      //   initialFrameWidth: "100%",
      //   // 上传文件接口（这个地址是我为了方便各位体验文件上传功能搭建的临时接口，请勿在生产环境使用！！！）
      //   serverUrl: "http://www.gxxmglzx.com/tender/ueditor/controller.php",
      //   // UEditor 资源文件的存放路径，如果你使用的是 vue-cli 生成的项目，通常不需要设置该选项，vue-ueditor-wrap 会自动处理常见的情况，如果需要特殊配置，参考下方的常见问题2
      //   UEDITOR_HOME_URL: process.env.BASE_URL + "UEditor/"
      // },
      loading: false,
      form: {
        title: "",
        content: "",
      },
      rules: {
        title: [{ required: true, message: "请输入标题", trigger: "blur" }],
        date: [{ required: true, message: "请选择时间", trigger: "blur" }],
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
            type: 1,
            id:this.$route.query.id,
            content: this.form.content,
            time:dateFormat("YYYY-mm-dd HH:MM:SS",this.form.date)
          }).then((res) => {
            this.$message({
              message: "修改成功",
              type: "success",
            });
            this.loading = false;
            this.$router.push("/history/list");
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
            type: 1,
            content: this.form.content,
            time:dateFormat("YYYY-mm-dd HH:MM:SS",this.form.date)
          }).then((res) => {
            this.$message({
              message: "添加成功",
              type: "success",
            });
            this.loading = false;
            this.$router.push("/history/list");
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
          date:res.data.time,
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
    VueUeditorWrap
  },
};
</script>
<style scoped>
</style>
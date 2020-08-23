<!-- 添加学习内容 -->
<template>
  <div class="app-container">
    <div class="add-form">
      <div class="form-content">
        <el-form :rules="rules" ref="form" :model="form" label-width="120px">
          <el-form-item label>
            <el-radio-group v-model="addType" style="margin-bottom: 30px;">
              <el-radio-button label="video">添加视频学习内容</el-radio-button>
              <el-radio-button label="document">添加文档学习内容</el-radio-button>
            </el-radio-group>
          </el-form-item>
          <el-form-item label="内容名称" prop="name">
            <el-input placeholder="请输入当前学习内容的名称" v-model="form.name"></el-input>
          </el-form-item>
          <el-form-item label="内容类型" prop="type">
            <el-select style="width:100%" v-model="form.type" placeholder="请选择活动区域">
              <el-option label="类型一" value="1"></el-option>
              <el-option label="类型二" value="2"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item :label="addType == 'document'?'上传文件':'上传视频'" prop="file">
            <el-input type="text" v-model="form.file" style="display:none"></el-input>
            <Uploader v-on:getFile="getFileUrl(arguments)"></Uploader>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="onSubmit('form')">提交</el-button>
            <el-button>取消</el-button>
          </el-form-item>
        </el-form>
      </div>
    </div>
  </div>
</template>

<script>
import { addStudy, getType } from "@/api/study";
import Uploader from "@/components/Uploader";
export default {
  data() {
    return {
      rules: {
        name: [{ required: true, message: "请输入名称", trigger: "blur" }],
        type: [{ required: true, message: "请选择类型", trigger: "change" }],
        file: [{ required: true, message: "请上传文件", trigger: "blur" }]
      },
      addType: "document",
      typeList:[],
      form: {
        name: "",
        type: "1",
        file: "test"
      }
    };
  },
  components: {
    Uploader
  },
  methods: {
    //提交操作
    onSubmit(formName) {
      console.log(this.$refs.form);
      this.$refs[formName].validate(valid => {
        if (valid) {
          let { name, type, file: url } = this.form;
          addStudy({
            name,
            type,
            url
          }).then(res => {
            console.log(res);
            this.$message({
              message: "提交成功！",
              type: "success"
            });
          });
        } else {
          return false;
        }
      });
    },
    //上传成功获取回调
    getFileUrl(file) {
      console.log(file);
    },
    // 初始化数据
    initData() {
      getType({
        pageNum: 1,
        pageSize: 10,
        dictType: "study_document_type"
      }).then(res => {
        console.log(res.rows);
        this.typeList = res.rows
      });
    }
  },
  //生命周期 - 创建完成（访问当前this实例）
  created() {},
  //生命周期 - 挂载完成（访问DOM元素）
  mounted() {}
};
</script>
<style scoped>
.add-form {
  padding-top: 50px;
  width: 45%;
  margin: 0 auto;
}
.type-tab {
  text-align: center;
}
</style>
<template>
  <div class="app-container">
    <el-form
      ref="todaywork"
      :model="todaywork"
      :rules="rules"
      label-width="80px"
    >
      <el-form-item label="标题" prop="title" style="width: 400px">
        <el-input v-model="todaywork.title" ></el-input>
      </el-form-item>
      <el-form-item label="类型" prop="type" style="width: 400px">
        <el-radio v-model="todaywork.type" :label="1">总场站图</el-radio>
        <el-radio v-model="todaywork.type" :label="2">连队图</el-radio>
      </el-form-item>
      <!-- <el-form-item label="工作内容" prop="content">
        <el-input
          style="width: 400px"
          type="textarea"
          :autosize="{ minRows: 2, maxRows: 4 }"
          placeholder="请输入工作内容"
          v-model="todaywork.content"
        ></el-input> -->
      </el-form-item>

      <el-form-item>
        <el-button
          v-if="$route.params.id"
          type="primary"
          @click="updateHandle('todaywork')"
          >确定修改</el-button
        >
        <el-button v-else type="primary" @click="submitForm('todaywork')"
          >立即创建</el-button
        >
        <el-button @click="resetForm('todaywork')">取消</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import { saveSafety } from "@/api/safety.js";


export default {
  data() {
    return {
      cateData: [],
      id: this.$route.params.id,
      todaywork: {
        title: '',
        type: 1
      },
      rules: {
        title: [{ required: true, message: "请输入标题", trigger: "blur" }],
        type: [
          { required: true, message: "请选择类型", trigger: "change" }
        ],
      }
    };
  },
  methods: {
    submitForm(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          this.addHandle();
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
    resetForm(formName) {
      this.$refs[formName].resetFields();
      this.$router.push("/todaywork/alltodaywork");
    },
    async addHandle() {
      const res = await saveSafety(this.todaywork);
      if (res.code === '200') {
        this.$message({
          message: "添加成功",
          type: "success"
        });
        this.$router.push("/safeUpload/upload");
      }
    },
  },
  async mounted() {
    /* const { id } = this.$route.params
    if (id) { // 修改
      const res = await getTodayworkById(id)
      //   console.log(res)
      if (res && res.code === '200') {
        this.todaywork = res.data
      }
    } */
  }
};
</script>
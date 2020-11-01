<template>
  <div class="app-container">
    <el-form
      ref="todaywork"
      :model="todaywork"
      :rules="rules"
      label-width="80px"
    >
      <el-form-item label="工作分类" prop="cateId">
        <el-select v-model="todaywork.cateId" placeholder="请选择工作分类">
          <el-option
            v-for="item in cateData"
            :key="item.id"
            :label="item.cateName"
            :value="item.id"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="工作名称" prop="title">
        <el-input v-model="todaywork.title" style="width: 300px"></el-input>
      </el-form-item>
      <el-form-item label="工作内容" prop="content">
        <el-input
          type="textarea"
          :autosize="{ minRows: 2, maxRows: 4 }"
          placeholder="请输入工作内容"
          v-model="todaywork.content"
        ></el-input>
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
import { getTodayworkCate, saveTodaywork, getTodayworkById, updateTodaywork } from "@/api/todaywork.js";
import { listUser, getTreeUser } from "@/api/system/user";
import Uploader from "@/components/Uploader";

export default {
  data() {
    return {
      cateData: [],
      id: this.$route.query.id,
      todaywork: {
        cateId: '',
        title: '',
        content: ''
      },
      rules: {
        title: [{ required: true, message: "请输入工作名称", trigger: "blur" }],
        cateId: [
          { required: true, message: "请选择工作分类", trigger: "change" }
        ],
        content: [{ required: true, message: "请输入工作内容", trigger: "blur" }],
      }
    };
  },
  methods: {
    // 获取分类列表
    async getCateList() {
      const { code, data } = await getTodayworkCate({
        size: 1000,
      })
      if (code === '200' && data.records) {
        this.cateData = data.records;
      }
    },
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
    // 添加法规
    async addHandle() {
      const res = await saveTodaywork(this.todaywork);
      if (res.code === '200') {
        this.$message({
          message: "添加成功",
          type: "success"
        });
        this.$router.push("/todaywork/alltodaywork");
      }
    },
    async updateHandle() {
      const res = await updateTodaywork(this.todaywork)
      //   console.log(res);
      if (res && res.code === '200') {
        this.$message({
          message: '修改成功',
          type: 'success'
        })
        this.$router.go(-1)
      } else {
        this.$message({
          message: '修改失败',
          type: 'error'
        })
        console.error(res)
      }
    },
    // 修改法规获取信息
    getFileById(id) {
      getFileById({ id }).then(res => {
        this.file = res.data;
      });
    },
  },
  async mounted() {
    const { id } = this.$route.params
    if (id) { // 修改
      const res = await getTodayworkById(id)
      //   console.log(res)
      if (res && res.code === '200') {
        this.todaywork = res.data
      }
    }

    // 获取分类列表
    this.getCateList();
  }
};
</script>
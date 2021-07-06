<template>
  <div class="app-container">
    <el-form ref="plan" :model="plan" :rules="rules" label-width="80px">
      <el-form-item label="计划名称" prop="title">
        <el-input v-model="plan.title" style="width: 400px"></el-input>
      </el-form-item>
      <el-form-item label="计划时间" prop="date">
        <el-date-picker
          style="width: 400px"
          v-model="plan.date"
          type="daterange"
          range-separator="至"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
        ></el-date-picker>
        <!-- <el-date-picker
          v-model="plan.date"
          type="week"
          format="yyyy 第 WW 周"
          placeholder="选择周"
        >
        </el-date-picker> -->
      </el-form-item>
      <el-form-item label="计划内容" prop="content">
        <el-input
          type="textarea"
          style="width: 400px"
          v-model="plan.content"
        ></el-input>
      </el-form-item>
      <el-form-item label="上传资料">
        <Uploader v-on:getFile="getFileUrl(arguments)"></Uploader>
      </el-form-item>
      <el-form-item label="备注" prop="remark">
        <el-input
          type="textarea"
          :autosize="{ minRows: 2, maxRows: 8 }"
          placeholder="请输入备注"
          v-model="plan.remark"
          style="width: 400px"
        ></el-input>
      </el-form-item>
      <el-form-item>
        <el-button
          v-if="$route.params.id"
          type="primary"
          @click="updateHandle('plan')"
          >确定修改</el-button
        >
        <el-button v-else type="primary" @click="submitForm('plan')"
          >立即创建</el-button
        >
        <el-button @click="resetForm('plan')">取消</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import { saveWorkplan, getWorkplanById, upldateWorkplan } from "@/api/workplan"
import { dateFormat } from "@/utils/format"
import Uploader from "@/components/Uploader"

export default {
  data() {
    return {
      plan: {
        title: '',
        date: '',
        content: '',
      },
      id: this.$route.params.id,
      rules: {
        title: [{ required: true, message: '请输入计划名称', trigger: 'blur' }],
        content: [{ required: true, message: '请输入计划内容', trigger: 'blur' }],
        date: [
          {
            required: true,
            message: '请选择日期',
            trigger: 'change'
          }
        ]
      },
      time: [],
      file: {
        title: "",
        url: "",
        readUrl: "",
        type: "regulatory_documents",
        name: ""
      },
    }
  },
  components: {
    Uploader
  },
  methods: {
    submitForm(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          this.addHandle();
        } else {
          console.log('error submit!!');
          return false;
        }
      });
    },
    resetForm(formName) {
      this.$refs[formName].resetFields();
    },
    async addHandle() {
      let params = {
        ...this.plan,
        files: [this.file],
        startTime: dateFormat("YYYY-mm-dd HH:MM:SS", new Date(this.plan.date[0])),
        endTime: dateFormat("YYYY-mm-dd HH:MM:SS", new Date(this.plan.date[1])),
      };
      console.log(params);
      const res = await saveWorkplan(params);
      // console.log(res);
      if (res && res.code === '200') {
        this.$message({
          message: '添加成功',
          type: 'success'
        });
        this.$router.push('/plan/planList');
      }

    },
    async updateHandle() {
      let params = {
        ...this.plan,
        files: [this.file],
        startTime: dateFormat("YYYY-mm-dd HH:MM:SS", new Date(this.plan.date[0])),
        endTime: dateFormat("YYYY-mm-dd HH:MM:SS", new Date(this.plan.date[1])),
      };
      const res = await upldateWorkplan(params)
      if (res && res.code === '200') {
        this.$message({
          message: '修改成功',
          type: 'success'
        });
        this.$router.push('/plan/planList');
      }


    },
    // 获取wFid和nFid
    getFileUrl(args) {
      this.file.name = args[0];
      this.file.url = args[1];
      this.file.readUrl = args[1];
    }
  },
  async mounted() {
    if (this.id) {
      // console.log(this.id)
      const { data } = await getWorkplanById(this.id);
      this.plan = data
      this.plan.date = [data.startTime, data.endTime]
      if (data.files && data.files[0]) {
        this.file = data.files[0]
      }
    }
  }
};
</script>
<template>
  <div class="app-container">
    <el-form
      ref="worklist"
      :model="worklist"
      :rules="rules"
      label-width="160px"
    >
      <el-form-item label="工作阶段" prop="steps">
        <el-button
          type="primary"
          icon="el-icon-plus"
          size="mini"
          @click="stepDialogVisible = true"
          >添加步骤</el-button
        >
        <el-steps style="width: 600px" id="step-container">
          <el-step
            v-for="(item, index) in worklist.steps"
            :title="item.stepName"
            :key="index"
            status="finish"
            :description="item.finishTime"
          ></el-step>
        </el-steps>
      </el-form-item>

      <el-form-item label="工作名称" prop="name">
        <el-input
          v-model="worklist.name"
          style="width: 600px"
          placeholder="请输入工作名称"
        ></el-input>
      </el-form-item>
      <el-form-item label="工作说明" prop="remark">
        <el-input
          type="textarea"
          :autosize="{ minRows: 2, maxRows: 8 }"
          placeholder="请输入工作说明"
          v-model="worklist.remark"
          style="width: 600px"
        ></el-input>
      </el-form-item>
      <el-form-item>
        <el-button
          v-if="$route.query.id"
          type="primary"
          @click="updateHandle('worklist')"
          >确定修改</el-button
        >
        <el-button v-else type="primary" @click="submitForm('worklist')"
          >立即创建</el-button
        >
        <el-button @click="$router.go(-1)">返回</el-button>
      </el-form-item>
    </el-form>

    <el-dialog
      title="添加步骤"
      :visible.sync="stepDialogVisible"
      width="500px"
      :before-close="handleClose"
    >
      <el-form ref="step" :model="step" :rules="stepRules" label-width="110px">
        <el-form-item label="步骤名称" prop="stepName">
          <el-input
            v-model="step.stepName"
            style="width: 300px"
            placeholder="请输入步骤名称"
          ></el-input>
        </el-form-item>
        <el-form-item label="完成时间" prop="finishTime">
          <el-date-picker
            v-model="step.finishTime"
            required
            type="datetime"
            placeholder="请选择步骤完成时间"
            style="width: 300px"
          ></el-date-picker>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="stepDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addStep('step')">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { dateFormat } from "@/utils/format";
import { saveActivity } from '@/api/worklist'

export default {
  data() {
    return {
      worklist: {
        steps: []
      },
      rules: {
        name: [{ required: true, message: "请输入工作名称", trigger: "blur" }],
        remark: [{ required: true, message: "请输入工作说明", trigger: "blur" }],
        steps: [{ required: true, message: "请添加工作步骤", trigger: "blur" }],
      },
      step: {
        stepName: '',
        finishTime: ''
      },
      stepRules: {
        stepName: [{ required: true, message: "请输入步骤名称", trigger: "blur" }],
        finishTime: [{ required: true, message: "请输入步骤完成时间", trigger: "blur" }],
      },
      props: {
        label: "name",
        children: "zones"
      },
      stepDialogVisible: false, // 添加步骤dialog
    }
  },
  methods: {
    addStep(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          console.log(this.step);
          this.worklist.steps.push({
            stepName: this.step.stepName,
            finishTime: dateFormat("YYYY-mm-dd HH:MM:SS", this.step.finishTime)
          })
          this.stepDialogVisible = false
          this.step = {
            stepName: '',
            finishTime: ''
          }
        } else {
          this.$message.error('请检查工作步骤是否填写完整');
          return false;
        }
      });
    },
    handleClose() {
      this.stepDialogVisible = false
      this.step = {
        stepName: '',
        finishTime: ''
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
    },
    addHandle() {
      saveActivity(this.worklist).then(res => {
        this.$message({
          message: "添加成功",
          type: "success"
        });
        this.$router.push("/worklist/activity");
      });
    },
    updateHandle() {
      updateFile({ ...this.worklist, type: "regulatory_documents" }).then(res => {
        this.$message({
          message: "修改成功",
          type: "success"
        });
        this.$router.push("/worklist/activity");
      });
    },
  }
}
</script>

<style>
</style>
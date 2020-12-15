<template>
  <div class="app-container" v-if="worklist">
    <el-form ref="worklist" :model="worklist" label-width="120px">
      <el-form-item label="工作步骤" prop="steps">
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
      <el-form-item label="创建时间" prop="createTime">
        <el-input
          v-model="worklist.createTime"
          style="width: 600px"
          :disabled="true"
        ></el-input>
      </el-form-item>
      <el-form-item label="工作名称" prop="name">
        <el-input
          v-model="worklist.name"
          style="width: 600px"
          :disabled="true"
        ></el-input>
      </el-form-item>
      <el-form-item label="工作说明" prop="remark">
        <el-input
          type="textarea"
          :autosize="{ minRows: 2, maxRows: 8 }"
          :disabled="true"
          v-model="worklist.remark"
          style="width: 600px"
        ></el-input>
      </el-form-item>

      <el-form-item>
        <el-button type="primary" @click="$router.go(-1)">返回</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import {
  getActivityById
} from '@/api/worklist'
export default {
  data() {
    return {
      worklist: {},
    }
  },
  async mounted() {
    const id = this.$route.params.id
    const res = await getActivityById(id)
    if (res && res.code === '200') {
      this.worklist = res.data
    }
  }
}
</script>

<style>
</style>
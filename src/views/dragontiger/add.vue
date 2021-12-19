<template>
  <div class="app-container">
    <el-form ref="activity" :model="activity" :rules="rules" label-width="80px">
      <el-form-item label="活动名称" prop="title">
        <el-input v-model="activity.title" style="width: 400px"></el-input>
      </el-form-item>
     <!--  <el-form-item label="活动分类" prop="cateId">
        <el-select
          style="width: 400px"
          v-model="activity.cateId"
          placeholder="请选择活动分类"
        >
          <el-option
            v-for="item in cateData"
            :key="item.id"
            :label="item.cateName"
            :value="item.id"
          ></el-option>
        </el-select>
      </el-form-item> -->
      <el-form-item label="活动时间" prop="time">
        <el-date-picker
          v-model="activity.time"
          type="datetimerange"
          range-separator="至"
          start-placeholder="开始时间"
          end-placeholder="结束时间"
        >
        </el-date-picker>
      </el-form-item>

      <el-form-item label="活动内容" prop="content">
        <el-input
          style="width: 400px"
          type="textarea"
          :autosize="{ minRows: 2, maxRows: 4 }"
          placeholder="请输入工作内容"
          v-model="activity.content"
        ></el-input>
      </el-form-item>
      <el-form-item label="备注" prop="remark">
        <el-input
          type="textarea"
          style="width: 400px"
          v-model="activity.remark"
        ></el-input>
      </el-form-item>

      <el-form-item>
        <el-button
          v-if="$route.params.id"
          type="primary"
          @click="updateHandle('activity')"
          >确定修改</el-button
        >
        <el-button v-else type="primary" @click="submitForm('activity')"
          >立即创建</el-button
        >
        <el-button @click="resetForm('activity')">取消</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import { selectCate, saveActivity, getActivityById, updateActivity } from "@/api/activity.js";
import { dateFormat } from "@/utils/format"

export default {
  data() {
    return {
      cateData: [],
      id: this.$route.query.id,
      activity: {
        // cateId: '',
        title: '',
        content: '',
        time: ''
      },
      rules: {
        title: [{ required: true, message: "请输入活动名称", trigger: "blur" }],
        // cateId: [
        //   { required: true, message: "请选择活动分类", trigger: "change" }
        // ],
        content: [{ required: true, message: "请输入活动内容", trigger: "blur" }],
        time: [{ required: true, message: "请输入活动时间", trigger: "blur" }],
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
      this.$router.go(-1)
    },
    async addHandle() {
      let startTime = null
      let endTime = null
      if (this.activity.time) {
        startTime = dateFormat("YYYY-mm-dd HH:MM:SS", this.activity.time[0])
        endTime = dateFormat("YYYY-mm-dd HH:MM:SS", this.activity.time[1])
      }
      this.activity.startTime = startTime
      this.activity.endTime = endTime
      delete this.activity.time

      const res = await saveActivity(this.activity);
      if (res.code === '200') {
        this.$message({
          message: "添加成功",
          type: "success"
        });
        this.$router.push("/dragontiger/dragontigerList");
      }
    },
    async updateHandle() {
      let startTime = null
      let endTime = null
      if (this.activity.time) {
        startTime = dateFormat("YYYY-mm-dd HH:MM:SS", this.activity.time[0])
        endTime = dateFormat("YYYY-mm-dd HH:MM:SS", this.activity.time[1])
      }
      this.activity.startTime = startTime
      this.activity.endTime = endTime
      const res = await updateActivity(this.activity)
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
    async selectCate() {
      const res = await selectCate()
      // console.log(res);
      if (res.code == 200) {
        this.cateData = res.data.records
      }
    }
  },
  async mounted() {
    // this.selectCate()

    const { id } = this.$route.params
    if (id) { // 修改
      const res = await getActivityById(id)
      // console.log(res)
      if (res && res.code === '200') {
        res.data.time = [res.data.startTime, res.data.endTime]
        this.activity = res.data
      }
    }
  }
};
</script>
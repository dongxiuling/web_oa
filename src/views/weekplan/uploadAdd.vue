<template>
  <div class="app-container">
    <el-form ref="weekplan" :model="weekplan" :rules="rules" label-width="80px">
      <el-form-item label="选择周" prop="time">
        <el-date-picker
          v-model="weekplan.time"
          type="week"
          placeholder="选择周"
          style="width: 400px"
          id="week"
          :picker-options="{
            firstDayOfWeek: 1,
          }"
          :format="startTime + ' 至 ' + endTime"
          @change="changeWeek"
        >
        </el-date-picker>
      </el-form-item>
      <el-form-item label="上传表格" prop="file">
        <Uploader
          style="width: 400px"
          v-on:getFile="getFileUrl(arguments)"
          :change="isChange"
          :name="file.name"
        ></Uploader>
        <!-- <el-button @click="openTabWin(file.readUrl,'view')" v-if="file.readUrl"  icon="el-icon-view" size="small" type="primary">预览文件</el-button> -->
        <el-button
          v-if="id"
          @click="openTabWin(file.url, 'download')"
          icon="el-icon-download"
          size="small"
          type="success"
          >下载文件</el-button
        >
      </el-form-item>
      <el-form-item label="备注" prop="remark">
        <el-input
          style="width: 400px"
          type="textarea"
          :autosize="{ minRows: 2, maxRows: 4 }"
          placeholder="请输入备注"
          v-model="weekplan.remark"
        ></el-input>
      </el-form-item>

      <el-form-item>
        <el-button
          v-if="$route.params.id"
          type="primary"
          @click="updateHandle('weekplan')"
          >确定修改</el-button
        >
        <el-button v-else type="primary" @click="submitForm('weekplan')"
          >立即创建</el-button
        >
        <el-button @click="resetForm('weekplan')">取消</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import { saveWorkupload, getTodayworkById, updateTodaywork } from "@/api/workupload.js";
import { getFileById } from "@/api/file";

import Uploader from "@/components/Uploader";

import { dateFormat } from "@/utils/format"


export default {
  data() {
    return {
      cateData: [],
      id: this.$route.query.id,
      weekplan: {
        type: 1, // 1是周工作安排  2是周值班
        time: ''
      },
      startTime: "",
      endTime: "",
      file: {
        title: "",
        url: "",
        readUrl: "",
        type: "regulatory_documents",
        name: ""
      },
      isChange: false, //false添加 true修改
      rules: {
        // time: [{ required: true, message: "请选择周", trigger: "blur" }],
        // file: [{ required: true, message: "请输入工作内容", trigger: "blur" }],
      }
    };
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
          console.log("error submit!!");
          return false;
        }
      });
    },
    resetForm(formName) {
      this.$refs[formName].resetFields();
      this.$router.push("/weekplan/weekplanUpload");
    },
    async addHandle() {
      const res = await saveWorkupload({
        ...this.weekplan,
        startTime: this.startTime,
        endTime: this.endTime,
        url: this.file.readUrl
      });
      if (res.code === '200') {
        this.$message({
          message: "添加成功",
          type: "success"
        });
        this.$router.push("/weekplan/weekplanUpload");
      }
    },
    async updateHandle() {
      const res = await updateTodaywork(this.weekplan)
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
    getFileById(id) {
      getFileById({ id }).then(res => {
        this.file = res.data;
      });
    },

    fun(unixtimestamp) {
      var unixtimestamp = new Date(unixtimestamp);
      var year = 1900 + unixtimestamp.getYear();
      var month = "0" + (unixtimestamp.getMonth() + 1);
      var date = "0" + unixtimestamp.getDate();
      return year + "-" + month.substring(month.length - 2, month.length) + "-" + date.substring(date.length - 2, date
        .length)
    },
    changeWeek(val) {
      let timeStamp = val.getTime(); //标准时间转为时间戳，毫秒级别
      this.startTime = this.fun(timeStamp - 24 * 60 * 60 * 1000); //开始时间
      this.endTime = this.fun(timeStamp + (24 * 60 * 60 * 1000) * 5); //结束时间
      // console.log(this.startTime, this.endTime);
    },
    getFirstDayOfWeek(date) {
      return date.getTime() - ((date.getDay() || 7) - 1) * 24 * 60 * 60 * 1000
    },
    getLastDayOfWeek(date) {
      return date.getTime() + (7 - (date.getDay() || 7)) * 24 * 60 * 60 * 1000
    },
    // 获取wFid和nFid
    getFileUrl(args, index) {
      console.log(args);
      this.file.url = args[1];
      this.file.readUrl = args[2];
      this.file.name = args[0];
      this.isChange = true;
    },
    // 下载或预览操作
    async openTabWin(url, type) {
      // if (type == "view") {
      //   await readFile({ id: this.file.id })
      // } else if (type = "download") {
      //   await downLoadFile({ id: this.file.id })
      // }
      window.open(url, "_blank");
    },
  },
  async mounted() {
    const now = new Date()
    this.startTime = dateFormat("YYYY-mm-dd", this.getFirstDayOfWeek(now))
    this.endTime = dateFormat("YYYY-mm-dd", this.getLastDayOfWeek(now))
    this.weekplan.time = new Date(this.startTime)



    const { id } = this.$route.params
    if (id) { // 修改
      const res = await getTodayworkById(id)
      //   console.log(res)
      if (res && res.code === '200') {
        this.weekplan = res.data
      }
    }
  }
};
</script>
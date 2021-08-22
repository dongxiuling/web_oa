<template>
  <div class="app-container">
    <el-form ref="duty" :model="duty" :rules="rules" label-width="80px">
      <el-form-item label="日期" prop="startTime">
        <el-date-picker
          v-model="duty.startTime"
          type="date"
          placeholder="请选择日期"
          style="width: 400px"
        ></el-date-picker>
      </el-form-item>
      <el-form-item label="星期" prop="week">
        <el-input disabled v-model="duty.week" style="width: 400px"></el-input>
      </el-form-item>
      <el-form-item label="单位" prop="deptId">
        <el-select
          v-model="duty.deptId"
          placeholder="请选择单位"
          style="width: 400px"
        >
          <el-option
            v-for="item in deptList"
            :key="item.deptId"
            :label="item.deptName"
            :value="item.deptId"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="工作内容" prop="content">
        <el-input
          type="textarea"
          style="width: 400px"
          :autosize="{ minRows: 2, maxRows: 4 }"
          placeholder="请输入备注"
          v-model="duty.content"
        ></el-input>
      </el-form-item>
      <el-form-item label="人员" prop="userId">
        <el-select
          v-model="duty.userId"
          placeholder="请选择人员"
          style="width: 400px"
        >
          <el-option
            v-for="item in personList"
            :key="item.id"
            :label="item.name"
            :value="item.id"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="责任人" prop="resUserId">
        <el-select
          v-model="duty.resUserId"
          placeholder="请选择责任人"
          style="width: 400px"
        >
          <el-option
            v-for="item in personList"
            :key="item.id"
            :label="item.name"
            :value="item.id"
          ></el-option>
        </el-select>
      </el-form-item>
       <el-form-item label="地点" prop="pos">
        <el-input v-model="duty.pos" style="width: 400px"></el-input>
      </el-form-item>
      <el-form-item label="天气预报" prop="weather">
        <el-input v-model="duty.weather" style="width: 400px"></el-input>
      </el-form-item>
      <el-form-item label="备注" prop="remark">
        <el-input
          type="textarea"
          style="width: 400px"
          :autosize="{ minRows: 2, maxRows: 4 }"
          placeholder="请输入备注"
          v-model="duty.remark"
        ></el-input>
      </el-form-item>

      <el-form-item>
        <el-button
          v-if="$route.params.id"
          type="primary"
          @click="updateHandle('duty')"
          >确定修改</el-button
        >
        <el-button v-else type="primary" @click="submitForm('duty')"
          >立即创建</el-button
        >
        <el-button @click="resetForm('duty')">取消</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import { lastDept, getDept } from "@/api/system/dept";
import { selectPerson } from "@/api/insider.js";
import { saveWeekplan, getWeekplanById, updateWeekplan } from "@/api/weekplan"
import { dateFormat } from "@/utils/format"

export default {
  data() {
    return {
      deptList: [],
      personList: [],
      id: this.$route.query.id,
      duty: {
        deptId: '',
        userId: '',
        startTime: '',
        remark: '',
        week: '',
        content: '',
        pos: '',
        weather: '',
        resUserId: '', // 责任人
      },
      rules: {
        startTime: [{ required: true, message: '请选择值班时间', trigger: 'change' }],
        deptId: [
          { required: true, message: "请选择值班部门", trigger: "change" }
        ],
        userId: [
          { required: true, message: "请选择值班人员", trigger: "change" }
        ],
        resUserId: [
          { required: true, message: "请选择责任人", trigger: "change" }
        ],
        content: [{ required: true, message: "请输入工作内容", trigger: "blur" }],
        week: [{ required: true, message: "请输入星期", trigger: "blur" }],
        pos: [{ required: true, message: "请输入地点", trigger: "blur" }],
        weather: [{ required: true, message: "请输入天气预报", trigger: "blur" }],
      }
    };
  },
  computed: {
    changeDeptId() { return this.duty.deptId },
    changeStartTime() { return this.duty.startTime },
  },
  watch: {
    changeDeptId(val) {
      // console.log('val', val);
      this.personList = []
      this.duty.userId = ''
      this.duty.resUserId = ''
      this.getPersonInfoByDeptId(val)
    },
    changeStartTime(val) {
      const startDate = new Date(val)
      switch (startDate.getDay()) {
        case 1:
          this.duty.week = '周一'
          break;
        case 2:
          this.duty.week = '周二'
          break;
        case 3:
          this.duty.week = '周三'
          break;
        case 4:
          this.duty.week = '周四'
          break;
        case 5:
          this.duty.week = '周五'
          break;
        case 6:
          this.duty.week = '周六'
          break;
        case 0:
          this.duty.week = '周日'
          break;
      }
    },
  },
  methods: {
    async getDeptList() {
      const res = await lastDept()
      if (res && res.code == 200 && res.data) {
        this.deptList = res.data
        this.resDeptList = res.data
      }
    },
    async getPersonInfoByDeptId(deptId) {
      const res = await selectPerson({
        deptId,
        current: 0,
        size: 999,
      })
      // console.log(res);
      if (res.code === '200' && res.data) {
        this.personList = res.data.records
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
      this.$router.push("/duty/dutyList");
    },
    async addHandle() {
      // const [startTime, endTime] = this.duty.time
      // const res = await saveWeekplan({ ...this.duty, startTime, endTime });
      this.duty.startTime = dateFormat("YYYY-mm-dd", new Date(this.duty.startTime))
      console.log(this.duty);
      const res = await saveWeekplan(this.duty);
      if (res.code === '200') {
        this.$message({
          message: "添加成功",
          type: "success"
        });
        this.$router.push("/weekplan/weekplanList");
      }
    },
    async updateHandle() {
      // const [startTime, endTime] = this.duty.time
      // const res = await updateWeekplan({ ...this.duty, startTime, endTime })
      this.duty.startTime = dateFormat("YYYY-mm-dd HH:MM:SS", new Date(this.duty.startTime))
      this.duty.endTime = null
      const res = await updateWeekplan(this.duty)
      // console.log(res);
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
  },
  async mounted() {
    await this.getDeptList();
    const { id } = this.$route.params
    if (id) { // 修改
      const res = await getWeekplanById(id)
      if (res && res.code === '200') {
        this.duty.deptId = res.data.deptId
        setTimeout(() => {
          this.duty = res.data
          // this.duty.time = [res.data.startTime, res.data.endTime]
        }, 1000)
      }
    }
  }
};
</script>
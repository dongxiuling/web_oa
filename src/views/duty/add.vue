<template>
  <div class="app-container">
    <el-form ref="duty" :model="duty" :rules="rules" label-width="80px">
      <el-form-item label="值班时间" prop="startTime">
        <!-- <el-date-picker
          style="width: 400px"
          v-model="duty.time"
          type="datetimerange"
          range-separator="至"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
          value-format="yyyy-MM-dd HH:mm:ss"
        ></el-date-picker> -->
        <el-date-picker
          v-model="duty.startTime"
          type="datetime"
          placeholder="请选择时间"
          style="width: 400px"
        ></el-date-picker>
      </el-form-item>
      <el-form-item label="值班部门" prop="deptId">
        <el-select
          v-model="duty.deptId"
          placeholder="请选择值班部门"
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
      <el-form-item label="值班人员" prop="userId">
        <el-select
          v-model="duty.userId"
          placeholder="请选择所值班人员"
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
      <el-form-item label="值班地点" prop="pos">
        <el-input v-model="duty.pos" style="width: 400px"></el-input>
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
import { lastDept } from "@/api/system/dept";
import { selectPerson } from "@/api/insider.js";
import { saveDuty, getDutyById, updateDuty } from "@/api/duty"
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
        remark: ''
      },
      rules: {
        startTime: [{ required: true, message: '请选择值班时间', trigger: 'change' }],
        deptId: [
          { required: true, message: "请选择值班部门", trigger: "change" }
        ],
        userId: [
          { required: true, message: "请选择值班人员", trigger: "change" }
        ],
      }
    };
  },
  computed: {
    changeDeptId() { return this.duty.deptId }
  },
  watch: {
    changeDeptId(val) {
      // console.log('val', val);
      this.personList = []
      this.duty.userId = ''
      this.getPersonInfoByDeptId(val)
    }
  },
  methods: {
    async getDeptList() {
      const res = await lastDept()
      if (res && res.code == 200 && res.data) {
        this.deptList = res.data
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
      // const res = await saveDuty({ ...this.duty, startTime, endTime });
      this.duty.startTime = dateFormat("YYYY-mm-dd HH:MM:SS", new Date(this.duty.startTime))
      this.duty.endTime = null
      const res = await saveDuty(this.duty);
      if (res.code === '200') {
        this.$message({
          message: "添加成功",
          type: "success"
        });
        this.$router.push("/duty/dutyList");
      }
    },
    async updateHandle() {
      // const [startTime, endTime] = this.duty.time
      // const res = await updateDuty({ ...this.duty, startTime, endTime })
      this.duty.startTime = dateFormat("YYYY-mm-dd HH:MM:SS", new Date(this.duty.startTime))
      this.duty.endTime = null
      const res = await updateDuty(this.duty)
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
      const res = await getDutyById(id)
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
<template>
  <div class="app-container">
    <el-form ref="info" :model="info" :rules="rules" label-width="100px">
      <el-form-item label="所属连队" prop="deptId">
        <el-select
          v-model="info.deptId"
          placeholder="请选择所属连队"
          style="width: 300px"
        >
          <el-option
            v-for="item in deptList"
            :key="item.deptId"
            :label="item.deptName"
            :value="item.deptId"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="姓名" prop="name">
        <el-input
          v-model="info.name"
          style="width: 300px"
          placeholder="请输入姓名"
        ></el-input>
      </el-form-item>
      <el-form-item label="身份证号码" prop="idCard">
        <el-input
          v-model="info.idCard"
          style="width: 300px"
          placeholder="请输入身份证号码"
        ></el-input>
      </el-form-item>
      <el-form-item label="性别" prop="sex">
        <el-radio v-model="info.sex" label="男">男</el-radio>
        <el-radio v-model="info.sex" label="女">女</el-radio>
      </el-form-item>
      <el-form-item label="部职别" prop="jobName">
        <el-input
          v-model="info.jobName"
          style="width: 300px"
          placeholder="请输入部职别"
        ></el-input>
      </el-form-item>
      <el-form-item label="身份" prop="jobType">
        <el-select
          v-model="info.jobType"
          placeholder="请选择"
          style="width: 300px"
        >
          <el-option
            v-for="item in jobTypes"
            :key="item.id"
            :label="item.name"
            :value="item.id"
          >
          </el-option>
        </el-select>
      </el-form-item>

      <el-form-item label="军衔" prop="remark1">
        <el-input
          v-model="info.remark1"
          style="width: 300px"
          placeholder="请输入军衔"
        ></el-input>
      </el-form-item>

      <!-- <el-form-item label="备注" prop="remark1">
        <el-input
          type="textarea"
          style="width: 300px"
          :autosize="{ minRows: 2, maxRows: 4 }"
          placeholder="请输入备注"
          v-model="info.remark1"
        ></el-input>
      </el-form-item> -->

      <el-form-item>
        <el-button
          v-if="$route.params.id"
          type="primary"
          @click="updateHandle('info')"
          >确定修改</el-button
        >
        <el-button v-else type="primary" @click="submitForm('info')"
          >立即创建</el-button
        >
        <el-button @click="$router.go(-1)">返回</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import { savePerson, getPersonById, updatePerson } from "@/api/insider.js";
import { lastDept } from "@/api/system/dept";
import Uploader from "@/components/Uploader";

export default {
  data() {
    return {
      deptList: [],
      id: this.$route.query.id,
      info: {
        deptId: '',
        name: '',
        idCard: '',
        jobName: '',
        sex: '男',
        jobType: '义务兵'
      },
      jobTypes: [
        {
          id: '1',
          name: '主官'
        }, {
          id: '2',
          name: '干部'
        }, {
          id: '3',
          name: '义务兵'
        },
      ],
      rules: {
        name: [{ required: true, message: "请输入姓名", trigger: "blur" }],
        idCard: [{ required: true, message: "请输入身份证号码", trigger: "blur" }],
        jobName: [{ required: true, message: "请输入部职别", trigger: "blur" }],
        remark1: [{ required: true, message: "请输入军衔", trigger: "blur" }],
        deptId: [
          { required: true, message: "请选择所属连队", trigger: "change" }
        ],
        sex: [{ required: true, message: "请输入工作内容", trigger: "change" }],
        jobType: [{ required: true, message: "请输入身份", trigger: "change" }],
      }
    };
  },
  methods: {
    async getDeptList() {
      const res = await lastDept()
      if (res && res.code == 200 && res.data) {
        this.deptList = res.data
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
    async addHandle() {
      const res = await savePerson(this.info);
      if (res.code === '200') {
        this.$message({
          message: "添加成功",
          type: "success"
        });
        this.$router.push("/insiderManage/insider");
      }
    },
    async updateHandle() {
      const res = await updatePerson(this.info)
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
  },
  async mounted() {
    await this.getDeptList();
    const { id } = this.$route.params
    if (id) { // 修改
      const res = await getPersonById(id)
        console.log(res)
      if (res && res.code === '200') {
        this.info = res.data
      }
    }
  }
};
</script>
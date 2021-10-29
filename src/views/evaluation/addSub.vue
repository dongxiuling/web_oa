<template>
  <!-- 创建加减分项 -->
  <div class="app-container">
    <el-form ref="data" :model="data" :rules="rules" label-width="120px">
      <el-form-item label="选择项" prop="type">
        <el-radio-group v-model="data.type">
          <el-radio :label="1">加分项</el-radio>
          <el-radio :label="2">减分项</el-radio>
          <el-radio :label="3">特殊项</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item
        label="评比周"
        prop="week"
        v-if="data.type == 1 || data.type == 2"
      >
        <el-date-picker
          v-model="data.week"
          type="week"
          format="第 WW 周"
          placeholder="选择周"
          style="width: 400px"
          id="week"
          :picker-options="{
            firstDayOfWeek: 1,
          }"
        >
        </el-date-picker>
      </el-form-item>
      <el-form-item label="特殊项名称" prop="itemName" v-if="data.type == 3">
        <el-input v-model="data.itemName" style="width: 400px"></el-input>
      </el-form-item>
      <el-form-item label="评比单位" prop="deptId">
        <el-select
          v-model="data.deptId"
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

      <el-form-item label="分值" prop="fraction">
        <el-input v-model="data.fraction" style="width: 400px"></el-input>
        <span style="color: #f00"
          >（分值需要填写正负值，比如：加分项+2，减分项-2）</span
        >
      </el-form-item>
      <el-form-item label="内容" prop="content">
        <el-input v-model="data.content" style="width: 400px"></el-input>
      </el-form-item>
      <el-form-item label="备注" prop="remark">
        <el-input
          type="textarea"
          style="width: 400px"
          :autosize="{ minRows: 2, maxRows: 4 }"
          placeholder="请输入备注"
          v-model="data.remark"
        ></el-input>
      </el-form-item>

      <el-form-item>
        <el-button
          v-if="$route.params.id"
          type="primary"
          @click="updateHandle('data')"
          >确定修改</el-button
        >
        <el-button v-else type="primary" @click="submitForm('data')"
          >立即创建</el-button
        >
        <el-button @click="resetForm('data')">取消</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import { lastDept } from "@/api/system/dept";
import { selectPerson } from "@/api/insider.js";
import { addItem, itemDetail, itemUpdate } from "@/api/evaluation"
import { dateFormat } from "@/utils/format"

export default {
  data() {
    return {
      deptList: [],
      personList: [],
      id: this.$route.params.id,
      quanId: this.$route.params.quanId,
      data: {
        type: 1,
        week: '',
        deptId: '',
        fraction: '',
        content: '',
        itemName: '',
        remark: ''
      },
      rules: {
        week: [{ required: true, message: '请选择评比周', trigger: 'change' }],
        deptId: [
          { required: true, message: "请选择评比单位", trigger: "change" }
        ],
        type: [
          { required: true, message: "请选择加减分项", trigger: "change" }
        ],
        fraction: [{ required: true, message: "请输入分值", trigger: "blur" }],
        content: [{ required: true, message: "请输入内容", trigger: "blur" }],
        itemName: [{ required: true, message: "请输入特殊项名称", trigger: "blur" }],
      }
    };
  },
  // computed: {
  //   changeItem() { return this.data.item }
  // },
  // watch: {
  //   changeItem(val) {
  //     console.log('val', val);
  //   }
  // },
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
    resetForm(formName) {
      // this.$refs[formName].resetFields();
      // this.$router.push("/duty/dutyList");
      this.$router.go(-1)
    },
    async addHandle() {

      this.data.quanId = this.quanId
      if (this.data.type == 3) {
        this.data.week = ''
      } else {
        const weekVal = document.querySelector('#week').value
        this.data.week = weekVal
      }
      // console.log(this.data);
      const res = await addItem(this.data);
      if (res.code === '200') {
        this.$message({
          message: "添加成功",
          type: "success"
        });
        // this.$router.push("/duty/dutyList");
        this.$router.go(-1);
      }
    },
    async updateHandle() {
      const res = await itemUpdate(this.data)
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
      const res = await itemDetail(id)
      if (res && res.code === '200') {
        this.data.deptId = res.data.deptId
        setTimeout(() => {
          this.data = res.data
        }, 1000)
      }
    }
  }
};
</script>
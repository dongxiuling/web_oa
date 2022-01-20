<template>
  <div class="app-container">
    <el-form ref="question" :model="question" :rules="rules" label-width="80px">
      <el-form-item label="问卷名称" prop="title">
        <el-input v-model="question.title" style="width: 400px"></el-input>
      </el-form-item>
      <el-form-item label="调查月份" prop="month">
        <el-select
          v-model="question.month"
          placeholder="请选择调查月份"
          style="width: 400px"
        >
          <el-option
            v-for="item in months"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          >
          </el-option>
        </el-select>
        <template slot="append"></template>
      </el-form-item>
      <!-- <el-form-item label="是否匿名" prop="type" style="width: 400px">
        <el-radio v-model="question.type" :label="1">实名调查</el-radio>
        <el-radio v-model="question.type" :label="2">匿名调查</el-radio>
      </el-form-item> -->
      <el-form-item label="问卷简介" prop="content">
        <el-input
          type="textarea"
          :autosize="{ minRows: 2, maxRows: 4 }"
          v-model="question.content"
          style="width: 400px"
        ></el-input>
      </el-form-item>
      <el-form-item label="截止日期" prop="endDate">
        <el-date-picker
          v-model="question.endDate"
          style="width: 400px"
          value-format="yyyy-MM-dd HH:mm:ss"
          placeholder="选择日期"
        ></el-date-picker>
      </el-form-item>
      <el-form-item>
        <el-button
          v-if="$route.query.id"
          type="primary"
          @click="updateHandle('question')"
          >确定修改</el-button
        >
        <el-button v-else type="primary" @click="submitForm('question')"
          >立即创建</el-button
        >
        <el-button @click="resetForm('question')">取消</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import {
  diningCreate,
  getDiningNaire,
  diningUpdate
} from "@/api/dining"
export default {
  data() {
    return {
      deptTree: [],
      months: [{
        value: '1',
        label: '1月'
      }, {
        value: '2',
        label: '2月'
      }, {
        value: '3',
        label: '3月'
      }, {
        value: '4',
        label: '4月'
      }, {
        value: '5',
        label: '5月'
      }, {
        value: '6',
        label: '6月'
      }, {
        value: '7',
        label: '7月'
      }, {
        value: '8',
        label: '8月'
      }, {
        value: '9',
        label: '9月'
      }, {
        value: '10',
        label: '10月'
      }, {
        value: '11',
        label: '11月'
      }, {
        value: '12',
        label: '12月'
      }],
      question: {
        title: "",
        type: 2, // 匿名
        content: '',
        endDate: null
      },
      id: this.$route.query.id,
      rules: {
        title: [{ required: true, message: "请输入问卷名称", trigger: "blur" }],
        endDate: [{ required: true, message: "请输入截止日期", trigger: "blur" }],
        type: [{ required: true, message: "请输入截止日期", trigger: "blur" }],
        month: [{ required: true, message: "请选择调查月份", trigger: "blur" }],
      },
      props: {
        label: "name",
        children: "zones"
      },
      defaultProps: {
        children: "children",
        label: "label",
        isLeaf: "leaf"
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
      this.$refs[formName].resetFields();
    },
    // 添加问卷
    addHandle() {
      let params = {
        ...this.question,
      };
      diningCreate(params).then(res => {
        this.$message({
          message: "添加成功",
          type: "success"
        });
        this.$router.push("/dining/naireList");
      });
    },
    // 修改考试
    updateHandle() {
      let params = {
        ...this.question,
        startDate: this.time[0],
        endDate: this.time[1],
      };
      diningUpdate(params).then(res => {
        this.$message({
          message: "修改成功",
          type: "success"
        });
        this.$router.push("/dining/naireList");
      });
    },
    // 修改考试获取信息
    getExamById(id) {
      getDiningNaire({ id }).then(res => {
        this.question = res.data;
        this.time = [res.data.startDate, res.data.endDate];
      });
    }
  },
  created() {
    if (this.id) {
      // console.log(this.id)
      this.getExamById(this.id);
    }
  }
};
</script>

<template>
  <div class="app-container">
    <el-form ref="question" :model="question" :rules="rules" label-width="80px">
      <el-form-item label="问卷名称" prop="title">
        <el-input v-model="question.title" style="width:400px"></el-input>
      </el-form-item>
      <el-form-item label="是否匿名" prop="type" style="width: 400px">
        <el-radio v-model="question.type" :label="1">实名调查</el-radio>
        <el-radio v-model="question.type" :label="2">匿名调查</el-radio>
      </el-form-item>
      <el-form-item label="问卷简介" prop="content">
        <el-input
          type="textarea"
          :autosize="{ minRows: 2, maxRows: 4}"
          v-model="question.content"
          style="width:400px"
        ></el-input>
      </el-form-item>
      <el-form-item label="截止日期" prop="endDate">
        <el-date-picker v-model="question.endDate"  style="width:400px"
        value-format="yyyy-MM-dd HH:mm:ss" placeholder="选择日期"></el-date-picker>
      </el-form-item>
      <!-- <el-form-item label="参与人员">
        <el-tree
          :data="deptTree"
          show-checkbox
          node-key="id"
          ref="tree"
          :props="defaultProps"
          @check="getCheckedNodes()"
          :default-checked-keys="userIds"
        ></el-tree>
      </el-form-item>
       -->
      <el-form-item>
        <el-button v-if="$route.query.id" type="primary" @click="updateHandle('question')">确定修改</el-button>
        <el-button v-else type="primary" @click="submitForm('question')">立即创建</el-button>
        <el-button @click="resetForm('question')">取消</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import {
  addQue, //createQues
  getExamById, //fetQuesById
  updateExam //updateQues
} from "@/api/question/index"; //"@/api/ques"
import { getTreeUser } from "@/api/system/user";
export default {
  data() {
    return {
      deptTree:[],
      question: {
        title: "",
        type: 1,
        content: '',
        endDate: null
      },
      id: this.$route.query.id,
      rules: {
        title: [{ required: true, message: "请输入问卷名称", trigger: "blur" }],
        endDate: [{ required: true, message: "请输入截止日期", trigger: "blur" }],
        type: [{ required: true, message: "请输入截止日期", trigger: "blur" }],
      },
      userIds: [],
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
    //获取选中状态下的人员数据
    getCheckedNodes() {
      this.userIds = this.$refs.tree.getCheckedNodes(true).map(item => {
        return item.id;
      });
    },
    /** 查询部门树结构 */
    getDeptTreeselect() {
      getTreeUser().then(response => {
        this.deptTree = response.data;
      });
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
    // 添加问卷
    addHandle() {
      let params = {
        ...this.question,
        userIds: this.userIds
      };
      addQue(params).then(res => {
        this.$message({
          message: "添加成功",
          type: "success"
        });
        this.$router.push("/questionnaire/questionnaireEdit");
      });
    },
    // 修改考试
    updateHandle() {
      let params = {
        ...this.question,
        startDate: this.time[0],
        endDate: this.time[1],
        userIds: this.userIds
      };
      updateExam(params).then(res => {
        this.$message({
          message: "修改成功",
          type: "success"
        });
        this.$router.push("/question/addList");
      });
    },
    // 修改考试获取信息
    getExamById(id) {
      getExamById({ id }).then(res => {
        this.question = res.data;
        this.time = [res.data.startDate, res.data.endDate];
        this.userIds = res.data.userIds;
      });
    }
  },
  created() {
    // 获取部门树形结构
    // this.getDeptTreeselect();
    if (this.id) {
      // console.log(this.id)
      this.getExamById(this.id);
    }
  }
};
</script>

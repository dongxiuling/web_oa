<template>
  <div class="app-container">
    <el-form ref="plan" :model="plan" :rules="rules" label-width="80px">
      <el-form-item label="计划名称" prop="name">
        <el-input v-model="plan.name" style="width:400px"></el-input>
      </el-form-item>
      <el-form-item label="计划时间" prop="date">
        <el-date-picker
          style="width:400px"
          v-model="plan.date"
          type="daterange"
          range-separator="至"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
          format="yyyy 年 MM 月 dd 日"
          value-format="yyyy-MM-dd"
        ></el-date-picker>
      </el-form-item>
      <el-form-item label="计划内容" prop="content">
        <el-input type="textarea" style="width:400px" v-model="plan.content"></el-input>
      </el-form-item>
      <el-form-item label="上传资料">
        <Uploader v-on:getFile="getFileUrl(arguments)"></Uploader>
      </el-form-item>
      <el-form-item label="关联人员">
        <el-tree
          :data="deptTree"
          show-checkbox
          node-key="id"
          ref="tree"
          :props="defaultProps"
          @check="getCheckedNodes()"
          :default-checked-keys="plan.userIds"
        ></el-tree>
      </el-form-item>
      <el-form-item>
        <el-button v-if="$route.query.id" type="primary" @click="updateHandle('exam')">确定修改</el-button>
        <el-button v-else type="primary" @click="submitForm('exam')">立即创建</el-button>
        <el-button @click="resetForm('exam')">取消</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import { getCategory } from '@/api/tool/category.js';
import {
  createExam,
  getExamById,
  updateExam
} from '@/api/exam';
import { listUser, getTreeUser } from '@/api/system/user';
import Uploader from "@/components/Uploader";

export default {
  data() {
    return {
      deptTree: [],
      plan: {
        name: '',
        data: '',
        content: '',
        userIds: []
      },
      id: this.$route.query.id,
      rules: {
        name: [{ required: true, message: '请输入计划名称', trigger: 'blur' }],
        content: [{ required: true, message: '请输入计划内容', trigger: 'blur' }],
        date: [
          {
            type: 'date',
            required: true,
            message: '请选择日期',
            trigger: 'change'
          }
        ]
      },
      time: [],
      userIds: [],
      props: {
        label: 'name',
        children: 'zones'
      },
      defaultProps: {
        children: 'children',
        label: 'label',
        isLeaf: 'leaf'
      }
    }
  },
  components: {
    Uploader
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
    // 获取分类列表ç
    getCateList() {
      getExamCategory({
        pageNum: 1,
        pageSize: 1000,
        dictType: 'sys_module_name'
      }).then(res => {
        this.cateData = res.rows;
      });
    },
    submitForm(formName) {
      console.log(11111);
      this.$refs[formName].validate(valid => {
        if (valid) {
          this.addHandle();
        } else {
          console.log('error submit!!');
          return false;
        }
      });
    },
    resetForm(formName) {
      this.$refs[formName].resetFields();
    },
    // 添加考试
    addHandle() {
      let params = {
        ...this.exam,
        startDate: this.time[0],
        endDate: this.time[1],
        userIds: this.userIds.join(',')
      };
      createExam(params).then(res => {
        this.$message({
          message: '添加成功',
          type: 'success'
        });
        this.$router.push('/exam/addlist');
      });
    },
    // 修改考试
    updateHandle() {
      let params = {
        ...this.exam,
        startDate: this.time[0],
        endDate: this.time[1],
        userIds: this.userIds.join(',')
      };
      updateExam(params).then(res => {
        this.$message({
          message: '修改成功',
          type: 'success'
        });
        this.$router.push('/exam/addlist');
      });
    },
    // 修改考试获取信息
    getExamById(id) {
      getExamById({ id }).then(res => {
        this.exam = res.data;
        this.time = [res.data.startDate, res.data.endDate];
        this.userIds = res.data.userIds.split(',');
      })
    },
    // 获取wFid和nFid
    getFileUrl(args) {
      this.file.url = args[0];
      this.file.readUrl = args[1];
    }
  },
  created() {
    // 获取分类列表
    // this.getCateList();
    // // 获取部门树形结构
    this.getDeptTreeselect();
    // if(this.id){
    //   // console.log(this.id)
    //   this.getExamById(this.id);
    // }
  }
};
</script>
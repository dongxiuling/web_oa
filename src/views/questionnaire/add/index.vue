<template>
  <div class="app-container">
    <el-form ref="question" :model="question" :rules="rules" label-width="80px">
      <el-form-item label="问卷名称" prop="title">
        <el-input v-model="question.title" style="width:300px"></el-input>
      </el-form-item>
      <el-form-item label="问卷类型" prop="categoryId">
        <el-select v-model="question.categoryId" placeholder="请选择问卷类型">
          <el-option
            v-for="item in cateData"
            :key="item.dictCode"
            :label="item.dictLabel"
            :value="item.dictCode"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="问卷时长" prop="duration">
        <el-input v-model="question.duration" type="number" min="0" style="width:200px">
          <span slot="suffix">分钟</span>
        </el-input>
      </el-form-item>
      <el-form-item label="问卷时间">
        <el-date-picker  style="width:400px"
          v-model="time"
          type="daterange"
          range-separator="至"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
          format="yyyy 年 MM 月 dd 日"
          value-format="yyyy-MM-dd HH:mm:ss"
        ></el-date-picker>
      </el-form-item>
      <el-form-item label="单选题">
        <el-col :span="3">
          <el-form-item prop="singleNum">
            <el-input v-model="question.singleNum" type="number" size="small" min="0">
              <template slot="append">个</template>
            </el-input>
          </el-form-item>
        </el-col>
        <!-- <el-col :span="5">
          <el-form-item prop="singleScore">
            <el-input v-model="question.singleScore" type="number" size="small" min="0">
              <template slot="prepend">每题</template>
              <template slot="append">分</template>
            </el-input>
          </el-form-item>
        </el-col> -->
      </el-form-item>
      <el-form-item label="简答题">
        <el-col :span="3">
          <el-form-item prop="shortNum">
            <el-input v-model="question.shortNum" type="number" size="small" min="0">
              <template slot="append">个</template>
            </el-input>
          </el-form-item>
        </el-col>
        <!-- <el-col :span="5">
          <el-form-item prop="shortScore">
            <el-input v-model="question.shortScore" type="number" size="small" min="0">
              <template slot="prepend">每题</template>
              <template slot="append">分</template>
            </el-input>
          </el-form-item>
        </el-col> -->
      </el-form-item>
      <el-form-item>
        <el-button v-if="$route.query.id" type="primary" @click="updateHandle('question')">确定修改</el-button>
        <el-button v-else type="primary" @click="submitForm('question')">立即创建</el-button>
        <el-button @click="resetForm('question')">取消</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
// import { getCategory } from '@/api/tool/category.js'
import {
  createExam,       //createQues
  getExamById,      //fetQuesById
  updateExam        //updateQues
} from '@/api/exam'     //"@/api/ques"
import { getTreeUser } from '@/api/system/user'
export default {
  data() {
    return {
      cateData: [
        { dictCode: 1, dictLabel: 'aa' }
      ],
      selectCate: '',
      deptTree: [],
      question: {
        title: "",
        duration: "",
        categoryId: "",
        singleNum: 0,
        // singleScore: 0,
        shortNum: 0,
        // shortScore: 0
      },
      id: this.$route.query.id,
      rules: {
        title: [{ required: true, message: "请输入问卷名称", trigger: "blur" }],
        duration: [
          { required: true, message: "请输入问卷时长", trigger: "blur" }
          //  { type: 'number', message: '考试时长必须为数字值', trigger: 'blur' },
        ],
        categoryId: [
          { required: true, message: "请选择问卷类目", trigger: "change" }
        ],
        singleNum: [
          { required: true, message: "请输入单选题个数", trigger: "blur" }
        ],
        // singleScore: [
        //   { required: true, message: "请输入单选题个数", trigger: "blur" }
        // ],
        shortNum: [
          { required: true, message: "请输入简答题个数", trigger: "blur" }
        ],
        // shortScore: [
        //   { required: true, message: "请输入简答题个数", trigger: "blur" }
        // ]
        // time: [
        //   {
        //     type: "date",
        //     required: true,
        //     message: "请选择日期",
        //     trigger: "change"
        //   }
        // ]
      },
      time: [],
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
    // 获取分类列表ç
    getCateList() {
      getExamCategory({
        pageNum: 1,
        pageSize: 1000,
        dictType: "sys_module_name"         //
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
          console.log("error submit!!");
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
        ...this.question,
        startDate: this.time[0],
        endDate: this.time[1],
        userIds: this.userIds.join(",")
      };
      createExam(params).then(res => {
        this.$message({
          message: "添加成功",
          type: "success"
        });
        this.$router.push("/questionnaire/addlist");
      });
    },
    // 修改考试
    updateHandle() {
      let params = {
        ...this.question,
        startDate: this.time[0],
        endDate: this.time[1],
        userIds: this.userIds.join(",")
      };
      updateExam(params).then(res => {
        this.$message({
          message: "修改成功",
          type: "success"
        })
        this.$router.push('/questionnaire/addlist')
      })
    },
    // 修改考试获取信息
    getExamById(id) {
      getExamById({ id }).then(res => {
        this.question = res.data
        this.time = [res.data.startDate, res.data.endDate]
        this.userIds = res.data.userIds.split(',')
      })
    }
  },
  created() {
    // 获取分类列表
    this.getCateList()
    // 获取部门树形结构
    this.getDeptTreeselect()
    if (this.id) {
      // console.log(this.id)
      this.getExamById(this.id)
    }
  }
}
</script>

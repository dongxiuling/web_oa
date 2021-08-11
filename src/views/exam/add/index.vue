<template>
  <div class="app-container">
    <el-form ref="exam" :model="exam" :rules="rules" label-width="80px">
      <el-form-item label="考试名称" prop="title">
        <el-input v-model="exam.title" style="width: 380px"></el-input>
      </el-form-item>
      <el-form-item label="考试类型" prop="categoryId">
        <el-select
          v-model="exam.categoryId"
          placeholder="请选择考试类型"
          style="width: 380px"
        >
          <el-option
            v-for="item in cateData"
            :key="item.id"
            :label="item.name"
            :value="item.id"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="考试时长" prop="duration">
        <el-input
          v-model="exam.duration"
          type="number"
          min="0"
          style="width: 380px"
        >
          <span slot="suffix">分钟</span>
        </el-input>
      </el-form-item>
      <el-form-item label="考试时间">
        <el-date-picker
          style="width: 380px"
          v-model="time"
          type="datetimerange"
          range-separator="至"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
          value-format="yyyy-MM-dd HH:mm:ss"
        ></el-date-picker>
      </el-form-item>
      <el-form-item label="单选题">
        <el-col :span="3">
          <el-form-item prop="singleNum">
            <el-input
              v-model="exam.singleNum"
              type="number"
              size="small"
              min="0"
            >
              <template slot="append">个</template>
            </el-input>
          </el-form-item>
        </el-col>
        <el-col :span="5">
          <el-form-item prop="singleScore">
            <el-input
              v-model="exam.singleScore"
              type="number"
              size="small"
              min="0"
            >
              <template slot="prepend">每题</template>
              <template slot="append">分</template>
            </el-input>
          </el-form-item>
        </el-col>
      </el-form-item>
      <el-form-item label="多选题">
        <el-col :span="3">
          <el-form-item prop="multipleNum">
            <el-input
              v-model="exam.multipleNum"
              type="number"
              size="small"
              min="0"
            >
              <template slot="append">个</template>
            </el-input>
          </el-form-item>
        </el-col>
        <el-col :span="5">
          <el-form-item prop="multipleScore">
            <el-input
              v-model="exam.multipleScore"
              type="number"
              size="small"
              min="0"
            >
              <template slot="prepend">每题</template>
              <template slot="append">分</template>
            </el-input>
          </el-form-item>
        </el-col>
      </el-form-item>
      <el-form-item label="判断题">
        <el-col :span="3">
          <el-form-item prop="judgmentNum">
            <el-input
              v-model="exam.judgmentNum"
              type="number"
              size="small"
              min="0"
            >
              <template slot="append">个</template>
            </el-input>
          </el-form-item>
        </el-col>
        <el-col :span="5">
          <el-form-item prop="judgmentScore">
            <el-input
              v-model="exam.judgmentScore"
              type="number"
              size="small"
              min="0"
            >
              <template slot="prepend">每题</template>
              <template slot="append">分</template>
            </el-input>
          </el-form-item>
        </el-col>
      </el-form-item>
       <el-form-item label="简答题">
        <el-col :span="3">
          <el-form-item prop="essayNum">
            <el-input
              v-model="exam.essayNum"
              type="number"
              size="small"
              min="0"
            >
              <template slot="append">个</template>
            </el-input>
          </el-form-item>
        </el-col>
        <!-- <el-col :span="5">
          <el-form-item prop="essayScore">
            <el-input
              v-model="exam.essayScore"
              type="number"
              size="small"
              min="0"
            >
              <template slot="prepend">每题</template>
              <template slot="append">分</template>
            </el-input>
          </el-form-item>
        </el-col> -->
      </el-form-item>
      <!-- <el-form-item label="参考人员">
        <el-tree
          :data="deptTree"
          show-checkbox
          node-key="id"
          ref="tree"
          :props="defaultProps"
          @check="getCheckedNodes()"
          :default-checked-keys="userIds"
        ></el-tree>
      </el-form-item> -->
      <el-form-item>
        <el-button
          v-if="$route.query.id"
          type="primary"
          @click="updateHandle('exam')"
          >确定修改</el-button
        >
        <el-button v-else type="primary" @click="submitForm('exam')"
          >立即创建</el-button
        >
        <el-button @click="resetForm('exam')">取消</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import { createExam, getExamById, updateExam, getExamCate } from "@/api/exam";
import { listUser, getTreeUser } from "@/api/system/user";
export default {
  data() {
    return {
      cateData: [],
      selectCate: "",
      exam: {
        title: "",
        duration: "",
        categoryId: "",
        singleNum: 0,
        singleScore: 0,
        multipleNum: 0,
        multipleScore: 0,
        judgmentNum: 0,
        judgmentScore: 0,
        essayNum: 0,
        essayScore: 0,
      },
      id: this.$route.query.id,
      rules: {
        title: [{ required: true, message: "请输入考试名称", trigger: "blur" }],
        duration: [
          { required: true, message: "请输入考试时长", trigger: "blur" },
          //  { type: 'number', message: '考试时长必须为数字值', trigger: 'blur' },
        ],
        categoryId: [
          { required: true, message: "请选择考试类目", trigger: "change" },
        ],
        singleNum: [
          { required: true, message: "请输入单选题个数", trigger: "blur" },
        ],
        singleScore: [
          { required: true, message: "请输入单选题个数", trigger: "blur" },
        ],
        multipleNum: [
          { required: true, message: "请输入多选题个数", trigger: "blur" },
        ],
        multipleScore: [
          { required: true, message: "请输入多选题个数", trigger: "blur" },
        ],
        judgmentNum: [
          { required: true, message: "请输入判断题个数", trigger: "blur" },
        ],
        judgmentScore: [
          { required: true, message: "请输入判断题个数", trigger: "blur" },
        ]
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
      // userIds: [],
      props: {
        label: "name",
        children: "zones",
      },
      defaultProps: {
        children: "children",
        label: "label",
        isLeaf: "leaf",
      },
    };
  },
  methods: {
    //获取选中状态下的人员数据
    // getCheckedNodes() {
    //   this.userIds = this.$refs.tree.getCheckedNodes(true).map(item => {
    //     return item.id;
    //   });
    // },
    // /** 查询部门树结构 */
    // getDeptTreeselect() {
    //   getTreeUser().then(response => {
    //     this.deptTree = response.data;
    //   });
    // },
    // 获取分类列表
    getCateList() {
      getExamCate({
        ...this.search,
        size: 1000,
        current: 1,
      }).then((res) => {
        // console.log(res);
        this.cateData = res.data.records;
      });
      // getCategory({
      //   pageNum: 1,
      //   pageSize: 1000,
      //   dictType: "sys_module_name"
      // }).then(res => {
      //   this.cateData = res.rows;
      // });
    },
    submitForm(formName) {
      // console.log(11111);
      this.$refs[formName].validate((valid) => {
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
        ...this.exam,
        startDate: this.time[0],
        endDate: this.time[1],
        type: "exam_notice",
      };
      createExam(params).then((res) => {
        this.$message({
          message: "添加成功",
          type: "success",
        });
        this.$router.push("/exam/list");
      });
    },
    // 修改考试
    updateHandle() {
      let params = {
        ...this.exam,
        startDate: this.time[0],
        endDate: this.time[1],
      };
      updateExam(params).then((res) => {
        this.$message({
          message: "修改成功",
          type: "success",
        });
        this.$router.push("/exam/list");
      });
    },
    // 修改考试获取信息
    getExamById(id) {
      getExamById({ id }).then((res) => {
        this.exam = res.data;
        this.time = [res.data.startDate, res.data.endDate];
      });
    },
  },
  created() {
    // 获取分类列表
    this.getCateList();
    // 获取部门树形结构
    if (this.id) {
      // console.log(this.id)
      this.getExamById(this.id);
    }
  },
};
</script>
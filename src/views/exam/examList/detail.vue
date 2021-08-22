<template>
  <div
    class="app-container"
    v-loading.fullscreen.lock="fullscreenLoading"
    v-if="!fullscreenLoading"
  >
    <el-form ref="form" :model="examDetail" label-width="100px" size="medium">
      <el-form-item label="考试名称：">{{ examDetail.title }}</el-form-item>
      <el-form-item label="考试类型：">{{
        examDetail.categoryName
      }}</el-form-item>
      <el-form-item label="考试时间："
        >{{ examDetail.startDate }} 至 {{ examDetail.endDate }}</el-form-item
      >
      <el-form-item v-if="examDetail.singleNum" label="单选题："
        >{{ examDetail.singleNum }}个，每题{{ examDetail.singleScore }}分，共{{
          examDetail.singleNum * examDetail.singleScore
        }}分</el-form-item
      >
      <el-form-item v-if="examDetail.multipleNum" label="多选题："
        >{{ examDetail.multipleNum }}个，每题{{
          examDetail.multipleScore
        }}分，共{{
          examDetail.multipleNum * examDetail.multipleScore
        }}分</el-form-item
      >
      <el-form-item v-if="examDetail.judgmentNum" label="判断题："
        >{{ examDetail.judgmentNum }}个，每题{{
          examDetail.judgmentScore
        }}分，共{{
          examDetail.judgmentNum * examDetail.judgmentScore
        }}分</el-form-item
      >
      <el-form-item v-if="examDetail.essayNum" label="简答题：">
        {{ examDetail.essayNum }}个
        <!-- {{ examDetail.essayNum }}个
        ，每题{{ examDetail.essayScore }}分，共{{
          examDetail.essayNum * examDetail.essayScore
        }}分 -->
      </el-form-item>
      <el-form-item label="考试总分：">{{ totalScore }} 分</el-form-item>
    </el-form>
    <el-table
      :data="examDetail.ue.records"
      style="width: 100%"
      v-loading="fullscreenLoading"
    >
      <el-table-column
        align="center"
        type="index"
        label="序号"
        :index="(currentPage - 1) * pageSize + 1"
      ></el-table-column>
      <el-table-column
        align="center"
        prop="deptName"
        label="部门"
      ></el-table-column>
      <el-table-column
        align="center"
        prop="userName"
        label="姓名"
      ></el-table-column>
      <el-table-column
        align="center"
        prop="createTime"
        label="考试时间"
      ></el-table-column>
      <el-table-column align="center" prop="score" label="成绩">
        <template slot-scope="scope">
          <span v-if="scope.row.score == null">0</span>
          <span v-else>{{scope.row.score}}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="操作" width="200">
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="text"
            icon="el-icon-search"
            @click="detailHandle(scope.row)"
            >考试详情</el-button
          >
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
import { getExamDetail } from "@/api/exam";

export default {
  data() {
    return {
      examId: this.$route.query.examId,
      total: 0,
      currentPage: 1,
      pageSize: 10,
      examDetail: {
        title: "科目一考试",
        categoryName: "司法",
        singleNum: 0,
        singleScore: 0,
        multipleNum: 0,
        multipleScore: 0,
        judgmentNum: 0,
        judgmentScore: 0,
        essayNum: 0,
        // essayScore: 0
      },
      fullscreenLoading: true
    };
  },
  computed: {
    totalScore() {
      let total = 0
      if (this.examDetail.singleNum) {
        total += this.examDetail.singleNum * this.examDetail.singleScore
      }
      if (this.examDetail.multipleNum) {
        total += this.examDetail.multipleNum * this.examDetail.multipleScore
      }
      if (this.examDetail.judgmentNum) {
        total += this.examDetail.judgmentNum * this.examDetail.judgmentScore
      }
      // if (this.examDetail.essayNum) {
      //   total += this.examDetail.essayNum * this.examDetail.essayScore
      // }
      return total
    }
  },
  methods: {
    getDetail() {
      getExamDetail({
        id: this.examId,
        current: this.currentPage,
        size: this.pageSize
      }).then(res => {
        console.log(res);
        this.examDetail = res.data;
        // console.log(this.examDetail.ue.records);
        this.total = res.data.ue.total;
        this.fullscreenLoading = false;
      });
    },
    handleCurrentChange(value) {
      this.currentPage = value;
      this.getDetail();
    },
    async detailHandle(_data) {
      console.log(146);
      console.log(this.examDetail);
      this.$router.push({
        path: "/exams/testDetail/",
        query: {
          examId: _data.examId,
          userId: _data.userId,
          title: this.examDetail.title
        }
      });

      // console.log(_data);
      // const res = await getExamAnswerInfo({
      //   examId: _data.examId,
      //   userId: _data.userId
      // })
      // console.log(res);

      // this.$router.push({
      //   path: "/exams/detail",
      //   query: { id: _data.id }
      // });
    },
  },
  created() {
    this.getDetail();
  }
};
</script>

<style lang="scss" scoped>
.page-box {
  text-align: right;
  margin-top: 20px;
}
</style>
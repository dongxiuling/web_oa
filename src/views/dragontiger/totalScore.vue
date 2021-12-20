<template>
  <el-main>
    <div class="main-content">
      <div class="app-container">
        <el-form ref="queryForm" :inline="true">
          <el-form-item label="性别">
            <el-select
              size="mini"
              v-model="search.sex"
              placeholder="请选择性别"
            >
              <el-option
                v-for="item in sexData"
                :key="item.id"
                :label="item.name"
                :value="item.id"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item>
            <el-button
              type="primary"
              icon="el-icon-search"
              size="mini"
              @click="searchHandle()"
              >搜索</el-button
            >
            <el-button icon="el-icon-refresh" size="mini" @click="reSetHandle()"
              >重置</el-button
            >
            <el-button
              type="primary"
              icon="el-icon-back"
              size="mini"
              @click="$router.go(-1)"
              >返回</el-button
            >
          </el-form-item>
        </el-form>
        <h2 class="title" v-if="activity">{{ activity.title }}龙虎榜</h2>
        <!-- <el-form-item label="活动名称:" prop="title">
      <div>{{ activity.title }}</div>
    </el-form-item>
    <el-form-item label="活动分类:" prop="cateId">
      <div>{{ activity.type }}</div>
    </el-form-item>
    <el-form-item label="活动时间:" prop="time">
      <div>{{ activity.time }}</div>
    </el-form-item>

    <el-form-item label="活动内容:" prop="content">
      <div>{{ activity.content }}</div>
    </el-form-item>
    <el-form-item label="备注:" prop="remark">
      <div>{{ activity.remark }}</div>
    </el-form-item> -->

        <el-table :data="list" style="width: 100%" v-loading="loading">
          <el-table-column
            align="center"
            type="index"
            label="排名"
          ></el-table-column>
          <el-table-column property="avatar" label="照片" align="center">
            <template slot-scope="scope">
              <el-image
                v-if="scope.row.avatar"
                style="width: 60px; height: 60px"
                :src="scope.row.avatar"
              >
              </el-image>
            </template>
          </el-table-column>
          <el-table-column
            align="center"
            prop="name"
            label="姓名"
          ></el-table-column>
          <el-table-column
            align="center"
            prop="deptName"
            label="所属连队"
          ></el-table-column>
          <el-table-column
            align="center"
            prop="result1"
            label="引体向上/俯卧撑"
          ></el-table-column>
          <el-table-column
            align="center"
            prop="result2"
            label="仰卧起坐"
          ></el-table-column>
          <el-table-column
            align="center"
            prop="result3"
            label="30米×2蛇形跑"
          ></el-table-column>
          <el-table-column
            align="center"
            prop="result4"
            label="3000米跑"
          ></el-table-column>
          <el-table-column
            align="center"
            prop="score"
            label="总成绩"
          ></el-table-column>
          <el-table-column
            align="center"
            prop="resultStr"
            label="级别"
          ></el-table-column>
        </el-table>

        <!-- <div class="page-box">
      <el-pagination
        style="width: 100%"
        background
        layout="total, prev, pager, next"
        :total="total"
        :current-page.sync="currentPage"
        :page-size="pageSize"
        @current-change="handleCurrentChange"
      ></el-pagination>
    </div> -->
      </div>
    </div>
  </el-main>
</template>

<script>
import { selectCate, selectScore, getActivityById } from "@/api/activity.js";

export default {
  data() {
    return {
      list: [],
      currentPage: 1,
      pageSize: 9999,
      cateData: [],
      sexData: [{
        id: '男',
        name: '男'
      }, {
        id: '女',
        name: '女'
      }],
      search: {
        sex: '男',
      },
      total: 0, //分页总页数
      loading: true,
      dialogVisible: false,
      activityId: null,
      typeId: null,
      activity: null,
      imgAvatar: require('@/assets/image/avatar.jpeg'),
    };
  },
  methods: {
    async getData() {
      const res = await selectScore({
        ...this.search,
        activityId: this.activityId,
        // typeId: this.typeId
      })
      if (res.code === '200' && res.data) {
        res.data.records.map((elem, index) => {

          if (index < 10) {
            if (elem.url) {
              elem.avatar = elem.url
            } else {
              elem.avatar = this.imgAvatar
            }
          } else {
            elem.avatar = ''
          }
          if (elem.item1) {
            elem.result1 = `${elem.score1}（${elem.item1}个）`
          } else {
            elem.result1 = 0
          }
          if (elem.item2) {
            elem.result2 = `${elem.score2}（${elem.item2}个）`
          } else {
            elem.result2 = 0
          }
          if (elem.item3) {
            elem.result3 = `${elem.score3}（${elem.item3}）`
          } else {
            elem.result3 = 0
          }

          if (elem.item4) {
            elem.result4 = `${elem.score4}（${elem.item4}）`
          } else {
            elem.result4 = 0
          }

          if (elem.flag == 0) {
            elem.resultStr = '不及格'
          } else {
            if (elem.score == 0) {
              elem.resultStr = '无成绩'
            } else if (elem.score > 0 && elem.score < 240) {
              elem.resultStr = '不及格'
            } else if (elem.score >= 240 && elem.score < 320) {
              elem.resultStr = '及格'
            } else if (elem.score >= 320 && elem.score < 360) {
              elem.resultStr = '良好'
            } else if (elem.score >= 360 && elem.score < 440) {
              elem.resultStr = '优秀'
            } else if (elem.score >= 440 && elem.score < 480) {
              elem.resultStr = '特3级'
            } else if (elem.score >= 480 && elem.score < 500) {
              elem.resultStr = '特2级'
            } else if (elem.score >= 500) {
              elem.resultStr = '特1级'
            }
          }
        })
        this.list = res.data.records;
        this.total = res.data.total;
        this.loading = false;
      }
    },
    // 获取分类列表
    async getCateList() {
      const { code, data } = await selectCate({
        size: 1000,
      })
      if (code === '200' && data.records) {
        this.cateData = data.records;
        this.cateData.unshift({ id: 0, cateName: "全部分类" });
      }
    },
    searchHandle() {
      this.getData();
    },
    reSetHandle() {
      this.search.sex = "男";
      this.getData();
    },
    handleCurrentChange(value) {
      this.currentPage = value;
      this.getData();
    },
    deptScore({ id }) {
      this.$router.push(`/dragontigers/totalScore/${id}`)
    },
    async getActivity() {
      const res = await getActivityById(this.activityId)
      if (res && res.code === '200') {
        this.cateData.map(item => {
          if (res.data.cateId == item.id) {
            res.data.type = item.cateName
          }
        })
        res.data.time = res.data.startTime + ' 至 ' + res.data.endTime
        this.activity = res.data
      }
    }
  },
  async mounted() {
    const { id, typeId } = this.$route.params
    this.activityId = id
    this.typeId = typeId


    this.getActivity()
    this.getData();
    // this.getCateList();
  },

};
</script>
<style lang="scss" scoped>
.page-box {
  text-align: right;
  margin-top: 20px;
}
.el-tag {
  cursor: pointer;
}
.title {
  text-align: center;
  margin-bottom: 30px;
}
</style>

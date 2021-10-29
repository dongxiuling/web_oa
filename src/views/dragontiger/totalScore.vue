<template>
  <div class="app-container">
    <el-button
      type="primary"
      icon="el-icon-back"
      size="mini"
      @click="$router.go(-1)"
      >返回</el-button
    >
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
        prop="result"
        label="成绩"
      ></el-table-column>
      <!-- <el-table-column align="center" label="操作">
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="text"
            icon="el-icon-edit-outline"
            @click="scoreHandle(scope.row)"
            >上传头像</el-button
          >
        </template>
      </el-table-column> -->
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
      search: {
        title: "",
        cateId: 0,
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
        activityId: this.activityId,
        typeId: this.typeId
      })
      if (res.code === '200' && res.data) {
        res.data.records.map((elem, index) => {
          if (elem.count) {
            elem.result = elem.count + '个'
          } else {
            elem.result = elem.minute + '分' + elem.second + '秒'
          }

          if (index < 10) {
            if (elem.url) {
              elem.avatar = elem.url
            } else {
              elem.avatar = this.imgAvatar
            }
          } else {
            elem.avatar = ''
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
      this.search.title = "";
      this.search.cateId = 0;
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
    this.getCateList();
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
}
</style>

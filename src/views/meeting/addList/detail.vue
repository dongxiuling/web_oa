<template>
  <div
    class="app-container"
    v-loading.fullscreen.lock="fullscreenLoading"
    v-if="!fullscreenLoading"
  >
    <el-form ref="form" :model="meeting" label-width="100px" size="medium">
      <el-form-item label="会议名称：">{{meeting.title}}</el-form-item>
      <el-form-item label="会议时间：">{{meeting.startTime}}</el-form-item>
      <el-form-item label="会议内容：">{{meeting.content}}</el-form-item>
    </el-form>
    <el-table :data="meeting.users.records" style="width: 100%">
      <el-table-column label="序号">
        <template slot-scope="scope">{{ scope.row.id }}</template>
      </el-table-column>
      <el-table-column prop="userName" label="参会人"></el-table-column>
      <el-table-column prop="deptName" label="部门"></el-table-column>
      <el-table-column prop="score" label="是否查看">
        <template slot-scope="scope">
          <el-tag v-if="scope.row.isRead" type="success">已查看</el-tag>
          <el-tag v-else type="info">未查看</el-tag>
        </template>
      </el-table-column>
    </el-table>
    <div class="page-box">
      <el-pagination
        style="width: 100%"
        background
        layout="prev, pager, next"
        :total="total"
        :current-page.sync="currentPage"
        :page-size="pageSize"
        @current-change="handleCurrentChange"
      ></el-pagination>
    </div>
  </div>
</template>

<script>
import { getMeetingDetail,getMyMeetingDetail} from "@/api/meeting";
export default {
  data() {
    return {
      meetingId: this.$route.query.id,
      total: 0,
      currentPage: 1,
      pageSize: 10,
      meeting: {
        title: "",
        content: ""
      },
      fullscreenLoading: true
    };
  },
  methods: {
    getAddDetail() {
      //查看我发布的详情
      getMeetingDetail({
        id: this.meetingId*1,
        current: this.currentPage,
        size: this.pageSize
      }).then(res => {
        this.meeting = res.data;
        this.total = res.data.users.total;
        this.fullscreenLoading = false;
      });
      // 查看我的会议详情
      getMeetingDetail({
        id: this.meetingId*1,
        current: this.currentPage,
        size: this.pageSize
      }).then(res => {
        this.meeting = res.data;
        this.total = res.data.users.total;
        this.fullscreenLoading = false;
      });
    },
    getListDetail(){
      // 查看我的会议详情
      getMyMeetingDetail({
        id: this.meetingId*1,
        current: this.currentPage,
        size: this.pageSize
      }).then(res => {
        this.meeting = res.data;
        this.total = res.data.users.total;
        this.fullscreenLoading = false;
      });
    },
    handleCurrentChange(value) {
      this.currentPage = value;
      this.getDetail();
    }
  },
  created() {
    if(this.$route.query.type == 1){
      this.getAddDetail();
    }else if(this.$route.query.type == 2){
      this.getListDetail();
    }
  }
};
</script>

<style lang="scss" scoped>
.page-box {
  text-align: right;
  margin-top: 20px;
}
</style>
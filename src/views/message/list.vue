<!-- 消息中心-列表 -->
<template>
  <div class="container">
    <div class="app-container">
      <el-tabs v-model="msgType" @tab-click="changeType">
        <el-tab-pane label="未读消息" name="new"></el-tab-pane>
        <el-tab-pane label="已读消息" name="old"></el-tab-pane>
      </el-tabs>
      <div class="table-content">
        <el-table v-loading="loading" :data="dataList" style="width: 100%">
          <el-table-column prop="title" label="消息名称">
            <template slot-scope="scope">
              <i class="el-icon-chat-line-square" style="color:#F56C6C"></i>
              <span style="margin-left: 10px">{{ scope.row.title }}</span>
            </template>
          </el-table-column>
          <el-table-column prop="type" label="消息类型" width="180"></el-table-column>
          <el-table-column prop="date" label="下发日期" width="180"></el-table-column>
          <el-table-column prop="commander" label="消息下发者" width="180"></el-table-column>
          <el-table-column label="操作" width="150">
            <template slot-scope="scope">
              <el-button
                @click="goDetail(scope.row.typeId,scope.row.id,scope.row.contentId)"
                icon="el-icon-search"
                type="text"
                size="small"
              >查看</el-button>
              <el-button
                v-if="msgType == 'new'"
                @click="setStatus(scope.row.id)"
                icon="el-icon-edit"
                type="text"
                size="small"
              >标记已读</el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <div class="pagination">
        <el-pagination :current-page.sync="currentPage" @current-change="changePage" :page-size="10" background layout="total, prev, pager, next" :total="message"></el-pagination>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import { doneMessage, messageList, getType, changeMessageStatus } from "@/api/message";
import { dateFormat } from "@/utils/format";
export default {
  data() {
    return {
      currentPage:1,
      msgType:"new",
      messageType: {},
      loading: false,
      dataList: []
    };
  },
  methods: {
    //切换消息类型
    async changeType(tab,event){
      this.currentPage = 1;
      await this.getMessageList();
    },
    //初始化数据
    async initData() {
      this.$store.dispatch("checkMessage"); //修改铃铛状态;
      await this.getMessageType();
      await this.getMessageList(10, 1);
    },
    //获取消息类型
    getMessageType() {
      return new Promise((resolve, reject) => {
        getType({
          pageNum: 1,
          pageSize: 10,
          dictType: "message_type"
        }).then(res => {
          var _data = {};
          res.rows.map(item => {
            _data[item.dictValue] = item.dictLabel;
          });
          this.messageType = _data;
          resolve();
        });
      });
    },
    // 分页数据
    async changePage(current){
      await this.getMessageList(10, current);
    },
    //获取消息列表
    getMessageList(count, page) {
      this.loading = true;
      return new Promise((resolve, reject) => {
        let _fun = this.msgType=='new'? messageList:doneMessage;
        _fun({
          current: page,
          size: count
        }).then(res => {
          let _data = res.data.records;
          _data = _data.map(item => {
            return {
              date: dateFormat("YYYY-mm-dd", item.createTime),
              commander: item.userName,
              title: item.title,
              type: this.messageType[item.type],
              typeId: item.type,
              id: item.id,
              contentId:item.contentId
            };
          });
          this.dataList = _data;
          this.loading = false;
          resolve();
        });
      });
    },
    // 查看消息
    goDetail(type, id,detailId) {
      this.setStatus(id).then(res => {
        if(type === 'regulatory_documents'){
          this.$router.push("/files/detail/"+detailId);
        }else if(type === 'meeting_notice'){
          this.$router.push(`/meetings/detail?id=${detailId}&type=1`)
        } else if(type === 'exam_notice'){
          this.$router.push(`/exams/detail?id=${detailId}`)
        }
      });
    },
    // 设置消息为已读
    setStatus(id) {
      return new Promise((resolve, reject) => {
        changeMessageStatus({
          id
        }).then(res => {
          this.initData();
          this.$store.dispatch("checkMessage"); //修改铃铛状态;
          resolve();
        });
      });
    }
  },
  computed: {
    ...mapGetters(["message"])
  },
  //生命周期 - 创建完成（访问当前this实例）
  created() {
    this.initData();
  },
  //生命周期 - 挂载完成（访问DOM元素）
  mounted() {}
};
</script>
<style scoped>
.container {
  min-height: calc(100vh - 84px);
  background-color: #f3f4fa;
}
.table-content {
  background-color: #fff;
  box-shadow: 0 0 3px rgba(0, 0, 0, 0.3);
}
.pagination{
  display: flex;
  justify-content: center;
  margin: 20px 0;
}
</style>
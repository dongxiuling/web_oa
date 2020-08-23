<!-- 消息中心-列表 -->
<template>
  <div class="container">
    <div class="app-container">
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
          <el-table-column label="操作" width="200">
            <template slot-scope="scope">
              <el-button icon="el-icon-search" type="text" size="small">查看</el-button>
              <el-button icon="el-icon-edit" type="text" size="small">编辑</el-button>
              <el-button icon="el-icon-delete" type="text" size="small">删除</el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>
    </div>
  </div>
</template>

<script>
import { messageList, getType } from "@/api/message";
import { dateFormat } from "@/utils/format"
export default {
  data() {
    return {
      messageType: {},
      loading: false,
      dataList: []
    };
  },
  methods: {
    //初始化数据
    async initData() {
      this.loading = true;
      await this.getMessageType();
      await this.getMessageList(10, 1);
      this.loading = false;
    },
    //获取消息类型
    getMessageType() {
      return new Promise((resolve, reject) => {
        getType({
          pageNum: 1,
          pageSize: 10,
          dictType: "message_type"
        }).then(res => {
          var _data = [];
          _data = res.rows.map((item)=>{
            return{
              [item.dictCode]:item.dictLabel
            }
          })
          this.messageType = _data;
          resolve();
        });
      });
    },
    //获取消息列表
    getMessageList(count, page) {
      return new Promise((resolve, reject) => {
        messageList({
          current: 0,
          size: 10
        }).then(res => {
          let _data = res.data.records;
          _data = _data.map((item)=>{
            return{
              date: dateFormat('YYYY-mm-dd',item.createTime),
              commander: item.userName,
              title: item.title,
              type: this.messageType[item.type]
            }
          })
          this.dataList = _data;
          console.log(res.data.records)
          resolve();
        });
      });
    }
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
</style>
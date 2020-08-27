<!-- 文件详情 -->
<template>
  <div class="container">
    <div class="content" v-loading="loading">
      <el-form label-width="180px">
        <el-form-item label="法规文件名称">
          <b>{{detailInfo.title}}</b>
        </el-form-item>
        <el-form-item label="法规分类">
          <b>{{detailInfo.cateStr}}</b>
        </el-form-item>
        <el-form-item label="法规级别">
          <b>{{detailInfo.levelStr}}</b>
        </el-form-item>
        <el-form-item label="法规下发时间">
          <b>{{detailInfo.timeStr}}</b>
        </el-form-item>
        <el-form-item label="法规发布者">
          <b>{{detailInfo.userName}}</b>
        </el-form-item>
        <el-form-item label="已查看：">
          <span v-for="(user,index) in users" :key="index">
            <el-tag v-if="user.isRead" type="success">{{user.deptName}}-{{user.userName}}</el-tag>
          </span>
        </el-form-item>
        <el-form-item label="未查看：">
          <span v-for="(user,index) in users" :key="index">
            <el-tag v-if="!user.isRead" type="info">{{user.deptName}}-{{user.userName}}</el-tag>
          </span>
        </el-form-item>
        <el-form-item label="已落实：">
          <span v-for="(user,index) in users" :key="index">
            <el-tag v-if="user.isRead" type="success">{{user.deptName}}-{{user.userName}}</el-tag>
          </span>
        </el-form-item>
        <el-form-item label="未落实：">
          <span v-for="(user,index) in users" :key="index">
            <el-tag v-if="!user.isRead" type="info">{{user.deptName}}-{{user.userName}}</el-tag>
          </span>
        </el-form-item>
        <el-form-item label="操作">
          <el-button @click="openTabWin(detailInfo.readUrl,'view')" v-if="detailInfo.readUrl"  icon="el-icon-view" size="small" type="primary">预览文件</el-button>
          <el-button @click="openTabWin(detailInfo.url,'download')" icon="el-icon-download" size="small" type="info">下载文件</el-button>
          <!-- <el-button @click="doneFile" v-if="!detailInfo.isDone" icon="el-icon-s-claim" size="small" type="warning">落实</el-button> -->
        </el-form-item>
        <el-form-item label="提示" v-if="!detailInfo.readUrl">
          <el-alert style="padding:0;width:auto" title="当前文件格式暂不支持预览" type="info" :closable="false"></el-alert>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
import { getCategory } from "@/api/tool/category.js";
import { getFileById,readFile,downLoadFile,finishFile,getResources } from "@/api/file";
import { dateFormat } from "@/utils/format";
export default {
  data() {
    return {
      loading:false,
      detailInfo: {},
      cateData: [],
      levels: ["紧急事件", "重点关注事件", "一般事件"],
      users:[]//记录用户查看 落实状态
    };
  },
  methods: {
    // 落实操作
    doneFile(){
      this.loading = true;
      finishFile({ id: this.detailInfo.id }).then(res => {
        this.loading = false;
        this.$router.push("/file/filelist");
      });
    },
    // 下载或预览操作
    async openTabWin(url,type){
      if(type=="view"){
        await readFile({id:this.detailInfo.id})
      }else if(type="download"){
        await downLoadFile({id:this.detailInfo.id})
      }
      window.open(url,"_blank");
    },
    // 初始化数据
    async initData(id) {
      this.loading = true;
      await this.getCateList();
      await this.getFileById(id);
      this.loading = false;
    },
    // 获取分类列表
    getCateList() {
      return new Promise((resolve, reject) => {
        getCategory({
          pageNum: 1,
          pageSize: 1000,
          dictType: "file_module_status"
        }).then(res => {
          this.cateData = res.rows;
          resolve();
        });
      });
    },
    // 获取文件详情
    getFileById(id) {
      return new Promise((resolve, reject) => {
        getFileById({ id }).then(res => {
          this.detailInfo = res.data;
          this.detailInfo.levelStr = this.levels[res.data.level - 1];
          this.detailInfo.timeStr = dateFormat(
            "YYYY-mm-dd",
            res.data.createTime
          );
          this.cateData.map(item => {
            if (item.dictCode == res.data.cateId) {
              this.detailInfo.cateStr = item.dictLabel;
            }
          });
          resolve();
        });
      });
    },
    // 获取阅读详情
    getReadDetail(id) {
      getResources({ id }).then(res => {
        this.users = res.data.users;
        // console.log(res.data.users)
      });
    }
  },
  //生命周期 - 创建完成（访问当前this实例）
  created() {
    this.initData(this.$route.params.id);
    this.getReadDetail(this.$route.params.id);
  },
  //生命周期 - 挂载完成（访问DOM元素）
  mounted() {}
};
</script>
<style scoped>
.container {
  overflow: hidden;
  min-height: calc(100vh - 84px);
  background-color: #f3f4fa;
  
}
.content {
  padding:20px;
  border-radius: 10px;
  margin: 20px auto;
  width: 80%;
  background-color: #fff;
  box-shadow: 0 0 5px rgba(0, 0, 0, 0.2);
}
</style>
<!-- 文件详情 -->
<template>
  <div class="container">
    <div class="content" v-loading="loading">
      <el-form label-width="180px">
        <el-form-item label="法规名称">
          <b>{{ detailInfo.title }}</b>
        </el-form-item>
        <el-form-item label="文件名称">
          <b>{{ detailInfo.name }} </b>
        </el-form-item>
        <el-form-item label="法规分类">
          <b>{{ detailInfo.categoryName }}</b>
        </el-form-item>
        <el-form-item label="法规内容">
          <b>{{ detailInfo.content }}</b>
        </el-form-item>
        <el-form-item label="落实截止时间">
          <b>{{ detailInfo.finishTime }}</b>
        </el-form-item>
        <!-- <el-form-item label="法规级别">
          <b>{{detailInfo.levelStr}}</b>
        </el-form-item> -->
        <el-form-item label="法规下发时间">
          <b>{{ detailInfo.createTime }}</b>
        </el-form-item>
        <el-form-item label="法规发布者">
          <b>{{ detailInfo.userName }}</b>
        </el-form-item>
        <el-form-item label="已查看：">
          <span v-for="(user, index) in users" class="user-list" :key="index">
            <el-tag v-if="user.isRead" type="success"
              >{{ user.deptName }}-{{ user.userName }}</el-tag
            >
          </span>
        </el-form-item>
        <el-form-item label="未查看：">
          <span v-for="(user, index) in users" class="user-list" :key="index">
            <el-tag v-if="!user.isRead" type="info"
              >{{ user.deptName }}-{{ user.userName }}</el-tag
            >
          </span>
        </el-form-item>
        <el-form-item label="已落实：">
          <span v-for="(user, index) in users" class="user-list" :key="index">
            <el-tag v-if="user.isDone" type="success"
              >{{ user.deptName }}-{{ user.userName }}</el-tag
            >
          </span>
        </el-form-item>
        <el-form-item label="未落实：">
          <span v-for="(user, index) in users" class="user-list" :key="index">
            <el-tag v-if="!user.isDone" type="info"
              >{{ user.deptName }}-{{ user.userName }}</el-tag
            >
          </span>
        </el-form-item>
        <el-form-item label="操作">
          <el-button
            @click="openTabWin(detailInfo.readUrl, 'view')"
            v-if="detailInfo.readUrl"
            icon="el-icon-view"
            size="small"
            type="primary"
            >预览文件</el-button
          >
          <el-button
            @click="openTabWin(detailInfo.url, 'download')"
            icon="el-icon-download"
            size="small"
            type="info"
            >下载文件</el-button
          >
          <!-- <el-button @click="doneFile" v-if="!detailInfo.isDone" icon="el-icon-s-claim" size="small" type="warning">落实</el-button> -->
        </el-form-item>
        <el-form-item label="提示" v-if="!detailInfo.readUrl">
          <el-alert
            style="padding: 0; width: auto"
            title="当前文件格式暂不支持预览"
            type="info"
            :closable="false"
          ></el-alert>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
import { getFileById, readFile, downLoadFile, finishFile, getResources, getCateById } from "@/api/file";
import { dateFormat } from "@/utils/format";
export default {
  data() {
    return {
      loading: false,
      detailInfo: {},
      cateData: [],
      // levels: ["紧急事件", "重点关注事件", "一般事件"],
      users: [],//记录用户查看 落实状态
      id: null
    };
  },
  methods: {
    // 落实操作
    // async doneFile() {
    //   this.loading = true;
    //   await finishFile({ id: this.detailInfo.id })
    //   this.loading = false;
    //   this.$router.push("/file/filelist");
    // },
    // 下载或预览操作
    async openTabWin(url, type) {
      if (type === "view") {
        await readFile({ id: this.detailInfo.id })
      } else if (type === "download") {
        await downLoadFile({ id: this.detailInfo.id })
      }
      window.open(url, "_blank");
    },
    // 初始化数据
    // async initData() {
    //   this.loading = true;
    //   await this.getFileById(this.id);
    //   this.loading = false;
    // },
    // // 获取文件详情
    // async getFileById(id) {
    //   const res = await getFileById({ id })
    //   this.detailInfo = res.data;
    //   const { data: { name } } = await getCateById(res.data.cateId)
    //   this.detailInfo.cateName = name
    //   // this.detailInfo.levelStr = this.levels[res.data.level - 1];
    // },
    // 获取阅读详情
    async getReadDetail() {
      const res = await getResources({ id: this.id })
      // console.log(res);
      this.detailInfo = res.data
      this.users = res.data.users;
    }
  },
  //生命周期 - 创建完成（访问当前this实例）
  mounted() {
    this.id = this.$route.params.id
    // this.initData();
    this.getReadDetail();
  }
};
</script>
<style scoped>
.container {
  overflow: hidden;
  min-height: calc(100vh - 84px);
  background-color: #f3f4fa;
}
.content {
  padding: 20px;
  border-radius: 10px;
  margin: 20px auto;
  width: 80%;
  background-color: #fff;
  box-shadow: 0 0 5px rgba(0, 0, 0, 0.2);
}
.user-list {
  margin-right: 3px;
}
</style>
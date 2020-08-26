<!-- 文件详情 -->
<template>
  <div class="container">
    <div class="content" v-loading="loading">
      <el-form label-width="180px">
        <el-form-item label="法规文件名称">
          <b>{{detailInfo.title}}</b>
        </el-form-item>
        <el-form-item label="资料模块">
          <b>{{detailInfo.cateStr}}</b>
        </el-form-item>
        <el-form-item label="资料级别">
          <b>{{detailInfo.levelStr}}</b>
        </el-form-item>
        <el-form-item label="文件下发时间">
          <b>{{detailInfo.timeStr}}</b>
        </el-form-item>
        <el-form-item label="文件发布者">
          <b>{{detailInfo.cateStr}}</b>
        </el-form-item>
        <el-form-item label="操作">
          <el-button @click="openTabWin(detailInfo.readUrl)" v-if="detailInfo.readUrl"  icon="el-icon-view" size="small" type="primary">预览文件</el-button>
          <el-button @click="openTabWin(detailInfo.url)" icon="el-icon-download" size="small" type="info">下载文件</el-button>
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
import { getFileById } from "@/api/file";
import { dateFormat } from "@/utils/format";
export default {
  data() {
    return {
      loading:false,
      detailInfo: {},
      cateData: [],
      levels: ["紧急事件", "重点关注事件", "一般事件"]
    };
  },
  methods: {
    // 下载或预览操作
    openTabWin(url){
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
          this.detailInfo.levelStr = this.levels[res.data.level + 1];
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
    }
  },
  //生命周期 - 创建完成（访问当前this实例）
  created() {
    this.initData(this.$route.params.id);
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
  margin: 50px auto;
  width: 50%;
  background-color: #fff;
  box-shadow: 0 0 5px rgba(0, 0, 0, 0.2);
}
</style>
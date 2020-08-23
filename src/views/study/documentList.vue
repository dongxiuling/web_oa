<!-- 学习园地文档列表 -->
<template>
  <div class="container">
    <div class="control-content">
      <div class="search-form">
        <el-form :inline="true">
          <el-form-item label>
            <el-input
              style="width:300px"
              class="search-inp"
              v-model="searchText"
              placeholder="请输入搜索内容"
            ></el-input>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" icon="el-icon-search" @click="searchHandle"></el-button>
          </el-form-item>
          <el-form-item>
            <el-button type="text" icon="el-icon-refresh" @click="searchHandle">重置</el-button>
          </el-form-item>
        </el-form>
        <span style="color:gray;font-size:14px">请输入您要搜索的文件名称，名称搜索支持模糊查询。</span>
      </div>
    </div>
    <div class="app-container">
      <div class="tab-content">
        <el-tabs v-model="activeName" @tab-click="changeType">
          <el-tab-pane label="类型一" name="first"></el-tab-pane>
          <el-tab-pane label="类型二" name="second"></el-tab-pane>
          <el-tab-pane label="类型三" name="third"></el-tab-pane>
          <el-tab-pane label="类型四" name="fourth"></el-tab-pane>
        </el-tabs>
      </div>
      <div class="table-content">
        <el-table :data="tableData" style="width: 100%">
          <el-table-column prop="name" label="文件名称"></el-table-column>
          <el-table-column prop="type" label="文件类型" width="180"></el-table-column>
          <el-table-column prop="createTime" label="上传时间" width="180"></el-table-column>
          <el-table-column prop="view" label="浏览次数" width="180"></el-table-column>
          <el-table-column prop="download" label="下载次数" width="180"></el-table-column>
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
export default {
  data() {
    return {
      activeName: "first",
      searchText: "",
      tableData: [
        {
          name:"测试文件名称",
          type:"日报",
          createTime:"2020-08-01",
          view:200,
          download:100
        }
      ]
    };
  },
  methods: {
    searchHandle() {},
    changeType() {}
  },
  created() {},
  mounted() {}
};
</script>
<style scoped>
.control-content {
  position: relative;
  background-color: #fff;
  padding: 50px 0 30px;
  text-align: center;
}
.container {
  min-height: calc(100vh - 84px);
  background-color: #f3f4fa;
}
.search-inp {
  position: relative;
  right: -20px;
}
.table-content {
  background-color: #fff;
  box-shadow: 0 0 3px rgba(0, 0, 0, 0.3);
}
</style>
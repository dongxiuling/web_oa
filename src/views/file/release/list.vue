<template>
  <div class="app-container">
    <div class="main-tabs">
      <ul class="main-tabs-right">
        <li class="search-box">
          <el-input
            v-model="searchText"
            size="medium"
            clearable
            @clear="clearInp"
            placeholder="请输入搜索内容"
          >
            <i slot="prefix" class="el-input__icon el-icon-search"></i>
          </el-input>
        </li>
        <li class="export-btn" @click="searchTitle">搜索</li>
      </ul>
    </div>
    <div class="content">
      <el-table
        @row-click="checkLine"
        :data="dataList"
        style="width: 100%"
        v-loading="loading"
      >
        <el-table-column
          type="index"
          width="150"
          label="序号"
        ></el-table-column>
        <el-table-column prop="name" label="法规名称"></el-table-column>
        <el-table-column prop="createTime" label="添加时间"></el-table-column>
        <el-table-column prop="remark" label="法规简介"></el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <el-button
              size="mini"
              type="text"
              icon="el-icon-view"
              @click.stop="showDetail(scope.row)"
              >详情</el-button
            >
            <el-button
              size="mini"
              type="text"
              icon="el-icon-delete"
              @click.stop="delHandle(scope.row)"
              >删除</el-button
            >
            <!-- <el-button
            size="mini"
            type="text"
            icon="el-icon-edit"
            @click.stop="editHandle(scope.row)"
            >修改</el-button> -->
          </template>
        </el-table-column>
      </el-table>
    </div>
  </div>
</template>
<script>
import { getRawList, delLaw,getByTitle } from "@/api/file";
export default {
  data() {
    return {
      searchText: "",
      dataList: [],
      loading: false,
    };
  },
  methods: {
    // 清空搜索框
    clearInp() {
      this.searchText = '';
      this.getList();
    },
    //按标题搜索
    searchTitle() {
      this.loading = true;
      getByTitle(this.searchText).then((res)=>{
        let thisData = [];
        this.loading = false;
        thisData = res.data.map((item) => {
          item.createTime = item.createTime.split(" ")[0];
          return item;
        });
        this.dataList = thisData;
      })

    },
    //单行选中
    checkLine(row) {
      this.$router.push({
        path: "/lawdetail/" + row.id,
      });
    },
    // 获取法规列表数据
    getList() {
      this.loading = true;
      getRawList().then((res) => {
        let thisData = [];
        this.loading = false;
        thisData = res.data.map((item) => {
          item.createTime = item.createTime.split(" ")[0];
          return item;
        });
        this.dataList = thisData;
      });
    },
    /** 删除按钮操作 */
    delHandle(_data) {
      this.$confirm("此操作将永久删除且无法恢复, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          delLaw({
            id: _data.id,
          }).then((res) => {
            this.$message({
              message: "删除成功",
              type: "success",
            });
            this.getList();
          });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除",
          });
        });
    },
    // 查看详情
    showDetail(_data) {
      this.$router.push({
        path: "/lawdetail/" + _data.id,
      });
    },
  },
  created() {
    this.getList();
  },
};
</script>
<style scoped>
.main-tabs {
  height: 50px;
  position: relative;
}
.main-tabs-right {
  position: absolute;
  right: 0;
  z-index: 3;
}
.main-tabs-right li.export-btn {
  width: 85px;
  background: #fcc349;
  cursor: pointer;
  color: #001d6f;
  text-align: center;
  line-height: 35px;
  height: 35px;
  border-radius: 5px;
  font-size: 16px;
}
.main-tabs-right li {
  width: 150px;
  float: left;
  margin-right: 10px;
}
.main-tabs-right li.search-box {
  width: 280px;
}
.search-box .el-input__suffix {
  right: 10px;
}
li,
ul {
  list-style: none;
  padding: 0;
  margin: 0;
}
</style>
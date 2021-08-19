<template>
  <div class="app-container">
    

    <div class="content">
      <el-table
        :data="dataList"
        style="width: 100%"
        v-loading="loading"
      >
        <el-table-column type="index" width="150" label="序号">
        </el-table-column>
        <el-table-column prop="title" label="申述文章"></el-table-column>
        <el-table-column prop="username" label="申述人"></el-table-column>
        <el-table-column prop="complaint" label="申述人内容"></el-table-column>
        <el-table-column prop="createTime" label="创建时间"></el-table-column>
        <el-table-column label="操作" width="200">
          <template slot-scope="scope">
            <el-button
              size="mini"
              type="text"
              icon="el-icon-view"
              @click.stop="showDetail(scope.row)"
              >查看曝光问题</el-button
            >
            <el-button
              size="mini"
              type="text"
              icon="el-icon-delete"
              @click.stop="delItem(scope.row)"
              >删除</el-button
            >
          </template>
        </el-table-column>
      </el-table>
      <div class="page-box">
        <el-pagination
          layout="total, prev, pager, next, jumper"
          :total="total"
          :current-page.sync="currentPage"
          :page-size="pageSize"
          @current-change="handleCurrentChange"
        ></el-pagination>
      </div>
    </div>
  </div>
</template>
<script>
import { appealList,appealDel } from "@/api/appeal"
export default {
  data() {
    return {
      searchText: "",
      dataList: [],
      loading: false,
      currentPage: 1, //分页当前页
      pageSize: 10,
      total: 0, //总页数
    };
  },
  methods: {
    // 删除记录
    delItem(item) {
      this.$confirm("此操作将永久删除且无法恢复, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          appealDel(item.id).then((res) => {
            this.$message({
              message: "删除成功",
              type: "success",
            });
            this.initData();
          });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除",
          });
        });
      
    },

    // 修改记录
    editItem(item) {
      this.$router.push({
        path: "/exposure/add",
        query:{
          id:item.id
        }
      });
    },
    // 清空搜索框
    clearInp() {
      this.searchText = "";
      this.getList();
    },
    // 按标题搜索内容
    searchTitle() {
      // this.loading = true;
      // getByTitle(this.searchText).then((res) => {
      //   let thisData = [];
      //   this.loading = false;
      //   thisData = res.data.map((item) => {
      //     item.createTime = item.createTime.split(" ")[0];
      //     return item;
      //   });
      //   this.dataList = thisData;
      // })

      this.$router.push({
        path: "/release/lawdetail/0",
        query: {
          search: this.searchText,
        },
      });
    },
    //单行选中
    checkLine(row) {
      this.$router.push({
        path: "/release/lawdetail/" + row.hid,
      });
    },
    // 获取法规列表数据
    getList() {
      this.loading = true;
      appealList({
        current: this.currentPage,
        size: this.pageSize,
        hId: 0
      }).then((res) => {
        console.log(res);
        this.dataList = res.data.records;
        this.loading = false;
      });
    },
    // 初始化数据
    initData() {
      this.currentPage = 1;
      this.getList();
    },

    // 查看详情
    showDetail(_data) {
      this.$router.push({
        path: "/exposure_/detail/" + _data.hid,
      });
    },
    handleCurrentChange(value) {
      this.currentPage = value;
      this.getData();
    },
  },
  created() {
    this.getList();
  },
};
</script>
<style scoped>
li {
  list-style: none;
}
.content {
  padding: 20px;
  background-color: #fff;
  min-height: 500px;
  border-radius: 5px;
}
.main-tabs {
  height: 50px;
  position: relative;
}
.main-tabs-right {
  position: absolute;
  right: -10px;
  z-index: 3;
}
.main-tabs-right li.export-btn {
  width: 85px;
  background: #fcc349;
  cursor: pointer;
  color: #001d6f;
  text-align: center;
  line-height: 40px;
  height: 40px;
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
</style>
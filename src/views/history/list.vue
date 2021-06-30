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
        <el-table-column prop="title" label="名称"></el-table-column>
        <el-table-column prop="time" label="历史时间"></el-table-column>
        <el-table-column label="操作" width="200">
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
              @click.stop="delItem(scope.row)"
              >删除</el-button
            >
            <el-button
              size="mini"
              type="text"
              icon="el-icon-edit"
              @click.stop="editItem(scope.row)"
              >修改</el-button
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
import {dateFormat} from "../../utils/format";
import { exposureList, exposureDel } from "@/api/exposure";
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
          console.log(item)
          exposureDel(item.id).then((res) => {
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
        path: "/history/add",
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
    
    
    // 获取法规列表数据
    getList() {
      this.loading = true;
      exposureList({
        current: this.currentPage,
        size: this.pageSize,
        type: 1,
        time:dateFormat("YYYY-mm-dd HH:MM:SS", new Date())
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
        path: "/history_/detail/" + _data.id,
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
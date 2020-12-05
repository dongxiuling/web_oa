<template>
  <div class="app-container">
    <el-table :data="dataList" style="width: 100%" v-loading="loading">
      <el-table-column type="index" width="150" label="序号"></el-table-column>
      <el-table-column
        prop="name"
        label="法规名称"
        
      ></el-table-column>
      <!-- <el-table-column
        prop="createTime"
        label="添加时间"
        width="200"
      ></el-table-column>
      <el-table-column prop="content" label="法规简介"></el-table-column> -->
      <el-table-column label="操作" width="350">
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
</template>
<script>
import { getRawList, delLaw } from "@/api/file";
export default {
  data() {
    return {
      dataList: [],
      loading: false,
    };
  },
  methods: {
    // 获取法规列表数据
    getList() {
      this.loading = true;
      getRawList().then((res) => {
        this.loading = false;
        console.log(res);
        this.dataList = res.data;
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
        path: "/lawdetail/"+_data.id,
      });
    },
  },
  created() {
    this.getList();
  },
};
</script>
<style scoped>
</style>
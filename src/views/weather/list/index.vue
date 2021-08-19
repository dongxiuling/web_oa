<template>
  <div class="app-container">
    <!-- <el-form ref="queryForm" :inline="true">
      <el-form-item label="会议名称">
        <el-input
          placeholder="请输入会议名称"
          v-model="search.title"
          clearable
          size="small"
        />
      </el-form-item>
      <el-form-item>
        <el-button
          type="primary"
          icon="el-icon-search"
          size="mini"
          @click="searchHandle()"
          >搜索</el-button
        >
        <el-button icon="el-icon-refresh" size="mini" @click="reSetHandle()"
          >重置</el-button
        >
      </el-form-item>
    </el-form> -->

    <el-row :gutter="10" class="mb8">
      <el-col :span="1.5">
        <el-button
          type="primary"
          icon="el-icon-plus"
          size="mini"
          @click="$router.push('/weather/addweather')"
          >创建天气</el-button
        >
      </el-col>
    </el-row>

    <el-table :data="list" style="width: 100%" v-loading="loading">
      <!-- <el-table-column label="序号">
        <template slot-scope="scope">{{ scope.row.id }}</template>
      </el-table-column> -->
      <el-table-column
        prop="time"
        label="时间"
        width="180"
        fixed
      ></el-table-column>
      <el-table-column prop="visibility" label="能见度"></el-table-column>
      <el-table-column prop="conditions" label="天气情况"></el-table-column>
      <el-table-column prop="temp" label="温度"></el-table-column>
      <el-table-column prop="windPower" label="风力"></el-table-column>
      <el-table-column prop="windDectition" label="风向"></el-table-column>
      <el-table-column prop="important" label="重要天气提醒"></el-table-column>
      <el-table-column prop="remark" label="备注"></el-table-column>

      <el-table-column label="操作" width="200" fixed="right">
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="text"
            icon="el-icon-edit"
            @click="updateHandle(scope.row)"
            >复制</el-button
          >
          <!-- <el-button
            size="mini"
            type="text"
            icon="el-icon-search"
            @click="detailHandle(scope.row)"
            >查看</el-button
          > -->
          <el-button
            size="mini"
            type="text"
            icon="el-icon-delete"
            @click="delHandle(scope.row)"
            >删除</el-button
          >
        </template>
      </el-table-column>
    </el-table>
    <!-- 删除提示 -->
    <el-dialog
      title="提示"
      :visible.sync="dialogVisible"
      width="30%"
      :before-close="
        () => {
          dialogVisible = false;
        }
      "
    >
      <span>确认删除吗?</span>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="doDelHandle">确 定</el-button>
      </span>
    </el-dialog>
    <div class="page-box">
      <el-pagination
        style="width: 100%"
        background
        layout="total, prev, pager, next"
        :total="total"
        :current-page.sync="currentPage"
        :page-size="pageSize"
        @current-change="handleCurrentChange"
      ></el-pagination>
    </div>
  </div>
</template>

<script>

import { selectWeather, delWeatherById } from "@/api/weather.js";

export default {
  data() {
    return {
      search: {
        title: "",
      },
      currentPage: 1,
      pageSize: 10,
      list: [],
      loading: true,
      total: 0,
      dialogVisible: false,
    };
  },
  methods: {
    async getData() {
      const res = await selectWeather({
        current: this.currentPage,
        size: this.pageSize,
        // title: this.search.title,
      })
      // console.log(res);

      if (res.code === '200') {
        this.list = res.data.records;
        this.total = res.data.total;
        this.loading = false;
      }

    },
    handleCurrentChange(value) {
      this.currentPage = value;
      this.getData();
    },
    delHandle({ id }) {
      this.dialogVisible = true
      this.id = id
    },
    async doDelHandle() {
      this.dialogVisible = false
      const res = await delWeatherById(this.id)
      this.$message({
        message: '删除成功',
        type: 'success'
      })
      this.getData()
    },
    updateHandle(_data) {
      this.$router.push({
        path: "/weather/addweather",
        query: { id: _data.id }
      });
    },
    // detailHandle(_data) {
    //   this.$router.push({
    //     path: "/meetings/detail",
    //     query: { id: _data.id, type: 1 }
    //   });
    // },
    // searchHandle() {
    //   this.getData();
    // },
    // reSetHandle() {
    //   this.search.title = "";
    //   this.getData();
    // },

  },
  mounted() {
    this.getData();
  }
};
</script>
<style lang="scss" scoped>
.page-box {
  text-align: right;
  margin-top: 20px;
}
</style>
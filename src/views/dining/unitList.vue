<template>
  <div class="app-container">
    <el-form ref="queryForm" :inline="true">
      <el-form-item label="就餐单位名称">
        <el-input
          placeholder="请输入单位名称"
          v-model="search.name"
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
        <el-button icon="el-icon-refresh" size="mini" @click="onReset()"
          >重置</el-button
        >
      </el-form-item>
    </el-form>

    <el-row :gutter="10" class="mb8">
      <el-col :span="1.5">
        <el-button
          type="primary"
          icon="el-icon-plus"
          size="mini"
          @click="$router.push('/dinings/unitAdd')"
          >添加就餐单位</el-button>
      </el-col>
    </el-row>

    <el-table :data="list" style="width: 100%" v-loading="loading">
      <el-table-column
        type="index"
        width="50"
        label="序号"
        align="center"
      ></el-table-column>
      <el-table-column align="center" prop="name" label="就餐单位名称"></el-table-column>

      <el-table-column label="操作" width="260" align="center">
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="text"
            icon="el-icon-edit"
            @click="editHandle(scope.row)"
            >修改</el-button
          >
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

    <!-- <div class="page-box">
      <el-pagination
        style="width: 100%"
        background
        layout="total, prev, pager, next"
        :total="total"
        :current-page.sync="currentPage"
        :page-size="pageSize"
        @current-change="handleCurrentChange"
      ></el-pagination>
    </div> -->
  </div>
</template>

<script>
import { getUnitList, delUnitById } from "@/api/dining.js";

export default {
  data() {
    return {
      list: [],
      currentPage: 1,
      pageSize: 10,
      search: {
        name: ''
      },
      total: 0, //分页总页数
      loading: true,
      dialogVisible: false,
      id: null
    };
  },
  methods: {
    handleUpdate() { },
    getData() {
      getUnitList({
        ...this.search,
        current: this.currentPage,
        size: this.pageSize,
      }).then(res => {
        // console.log(res);
        this.list = res.data.records;
        this.total = res.data.total;
        this.loading = false;
      });
    },
    searchHandle() {
      this.getData();
    },
    handleCurrentChange(value) {
      this.currentPage = value;
      this.getData();
    },
    editHandle({ id }) {
      this.$router.push(`/dinings/unitAdd/${id}`)
    },
    delHandle({ id }) {
      this.dialogVisible = true
      this.id = id
    },
    async doDelHandle() {
      this.dialogVisible = false
      const res = await delUnitById(this.id)
      this.getData()
    },
    onReset() {
      this.search = {
        name: ''
      }
      this.getData()
    },
  },
  created() {
    this.getData();
  }
};
</script>
<style lang="scss" scoped>
.page-box {
  text-align: right;
  margin-top: 20px;
}
.el-tag {
  cursor: pointer;
}
</style>
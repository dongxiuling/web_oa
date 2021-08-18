<template>
  <div class="app-container">
    <el-row :gutter="10" class="mb8">
      <el-col :span="1.5">
        <el-button
          type="primary"
          icon="el-icon-plus"
          size="mini"
          @click="$router.push('/evaluations/addSeason')"
          >创建季度信息</el-button
        >
      </el-col>
    </el-row>
    <el-table :data="list" style="width: 100%" v-loading="loading">
      <el-table-column
        align="center"
        type="index"
        label="序号"
        :index="(currentPage - 1) * pageSize + 1"
      ></el-table-column>
      <el-table-column
        align="center"
        prop="name"
        label="季度名称"
      ></el-table-column>
      <el-table-column align="center" label="操作">
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="text"
            icon="el-icon-tickets"
            @click="lookHandle(scope.row)"
            >查看统计</el-button
          >
          <el-button
            size="mini"
            type="text"
            icon="el-icon-edit"
            @click="editHandle(scope.row)"
            >评比详情</el-button
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
      <span>确认删除吗</span>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="doDelHandle">确 定</el-button>
      </span>
    </el-dialog>
    <div class="page-box">
      <el-pagination
        style="width: 100%"
        background
        layout="prev, pager, next"
        :total="total"
        :current-page.sync="currentPage"
        :page-size="pageSize"
        @current-change="handleCurrentChange"
      ></el-pagination>
    </div>
  </div>
</template>

<script>
import { seasonList, seasonDel } from "@/api/evaluation"

export default {
  data() {
    return {
      list: [],
      currentPage: 1,
      pageSize: 10,
      total: 0, //分页总页数
      loading: true,
      dialogVisible: false,
      id: null,
    };
  },
  methods: {
    async getData() {
      const res = await seasonList({
        current: this.currentPage,
        size: this.pageSize,
      })
      // console.log(res);
      if (res.code === '200' && res.data) {
        this.list = res.data.records;
        this.total = res.data.total;
        this.loading = false;
      }
    },
    handleCurrentChange(value) {
      this.currentPage = value;
      this.getData();
    },
    lookHandle({ id, name }) {
      this.$router.push(`/evaluations/selectTotal/${id}/${name}`)
    },
    editHandle({ id, name }) {
      this.$router.push(`/evaluations/seasonDetail/${id}/${name}`)
    },
    delHandle({ id }) {
      this.dialogVisible = true
      this.id = id
    },
    async doDelHandle() {
      this.dialogVisible = false
      const res = await seasonDel(this.id)
      if (res && res.code === '200') {
        this.$message({
          message: '删除成功',
          type: 'success'
        })
        this.getData()
      }
    },
  },
  mounted() {
    this.getData();
  },

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

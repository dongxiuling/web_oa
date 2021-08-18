<template>
  <div class="app-container">
    <el-row :gutter="10" class="mb8">
      <el-col :span="6">
        <el-button
          type="primary"
          icon="el-icon-plus"
          size="mini"
          @click="$router.push(`/evaluations/addSub/${quanId}`)"
          >添加加减分项</el-button
        >
        <el-button
          type="primary"
          icon="el-icon-back"
          size="mini"
          @click="$router.go(-1)"
          >返回</el-button
        >
      </el-col>
      <el-col :span="12" class="title-col">
        <span class="title">{{$route.params.name}}量化评比加减分情况</span>
      </el-col>
    </el-row>
    <el-form ref="所属连队" :inline="true">
      <el-form-item label="所属连队">
        <el-select v-model="search.deptId" placeholder="请选择所属连队">
          <el-option
            v-for="item in deptList"
            :key="item.deptId"
            :label="item.deptName"
            :value="item.deptId"
          ></el-option>
        </el-select>
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
    </el-form>
    <el-table :data="list" style="width: 100%" v-loading="loading">
      <el-table-column
        align="center"
        type="index"
        label="序号"
        :index="(currentPage - 1) * pageSize + 1"
      ></el-table-column>
      <el-table-column
        align="center"
        prop="deptName"
        label="单位"
      ></el-table-column>
      <el-table-column
        align="center"
        prop="week"
        label="日期"
      ></el-table-column>
      <el-table-column
        align="center"
        prop="itemName"
        label="特殊项名称"
      ></el-table-column>
      <el-table-column
        align="center"
        prop="content"
        label="内容"
      ></el-table-column>
      <el-table-column
        align="center"
        prop="fraction"
        label="加减分"
      ></el-table-column>
      <el-table-column
        align="center"
        prop="remark"
        label="备注"
      ></el-table-column>
      <el-table-column align="center" label="操作">
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="text"
            icon="el-icon-tickets"
            @click="lookHandle(scope.row)"
            >详情</el-button
          >
          <!-- <el-button
            size="mini"
            type="text"
            icon="el-icon-edit"
            @click="editHandle(scope.row)"
            >修改</el-button
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
import { lastDept } from "@/api/system/dept";
import { itemList, itemDel } from "@/api/evaluation"

export default {
  data() {
    return {
      list: [],
      currentPage: 1,
      pageSize: 10,
      total: 0, //分页总页数
      loading: true,
      dialogVisible: false,
      id: this.$route.params.id,
      quanId: this.$route.params.quanId,
      deptList: [],
      search: {
        deptId: 0
      },
    };
  },
  methods: {
    async getData() {
      const res = await itemList({
        current: this.currentPage,
        size: this.pageSize,
        deptId: this.search.deptId,
        quanId: this.quanId
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
    lookHandle({ id }) {
      this.$router.push(`/evaluations/itemDetail/${id}`)
    },
    editHandle({ id }) {
      this.$router.push(`/evaluations/seasonDetail/${id}`)
    },
    delHandle({ id }) {
      this.dialogVisible = true
      this.id = id
    },
    async doDelHandle() {
      this.dialogVisible = false
      const res = await itemDel(this.id)
      if (res && res.code === '200') {
        this.$message({
          message: '删除成功',
          type: 'success'
        })
        this.getData()
      }
    },
    async getDeptList() {
      const res = await lastDept()
      if (res && res.code == 200 && res.data) {
        this.deptList = res.data
        this.deptList.unshift({ deptId: 0, deptName: "全部连队" });
      }
    },
    searchHandle() {
      this.getData();
    },
    reSetHandle() {
      this.search.deptId = 0
      this.getData();
    },
  },
  mounted() {
    this.getDeptList()
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
.title-col {
  text-align: center;
}
.title {
  font-size: 24px;
  font-weight: bolder;
}
</style>

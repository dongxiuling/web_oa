<template>
  <el-main>
    <div class="main-content">
      <div class="app-container">
        <el-form ref="queryForm" :inline="true">
          <el-form-item label="活动名称">
            <el-input
              placeholder="请输入活动名称"
              v-model="search.title"
              clearable
              size="small"
            />
          </el-form-item>
          <!-- <el-form-item label="活动分类">
            <el-select v-model="search.cateId" placeholder="请选择活动分类">
              <el-option
                v-for="item in cateData"
                :key="item.id"
                :label="item.cateName"
                :value="item.id"
              ></el-option>
            </el-select>
          </el-form-item> -->
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
        <el-row :gutter="10" class="mb8">
          <el-col :span="1.5">
            <el-button
              type="primary"
              icon="el-icon-plus"
              size="mini"
              @click="$router.push('/dragontiger/dragontigerAdd')"
              >创建活动</el-button
            >
          </el-col>
        </el-row>
        <el-table :data="list" style="width: 100%" v-loading="loading">
          <el-table-column
            align="center"
            type="index"
            label="序号"
          ></el-table-column>
          <el-table-column
            align="center"
            prop="title"
            label="活动名称"
          ></el-table-column>
          <!-- <el-table-column
            align="center"
            prop="cateName"
            label="活动分类"
          ></el-table-column> -->
          <el-table-column
            align="center"
            prop="time"
            label="活动时间"
            width="250"
          ></el-table-column>
          <el-table-column
            align="center"
            prop="content"
            label="活动内容"
          ></el-table-column>
          <el-table-column
            align="center"
            prop="remark"
            label="备注"
          ></el-table-column>
          <el-table-column align="center" label="操作" width="220">
            <template slot-scope="scope">
              <!-- <el-button
                size="mini"
                type="text"
                icon="el-icon-edit-outline"
                @click="scoreHandle(scope.row)"
                >成绩录入</el-button
              >
              <el-button
                size="mini"
                type="text"
                icon="el-icon-tickets"
                @click="deptScore(scope.row)"
                >连队排名</el-button
              > -->
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
            layout="total, prev, pager, next"
            :total="total"
            :current-page.sync="currentPage"
            :page-size="pageSize"
            @current-change="handleCurrentChange"
          ></el-pagination>
        </div>
      </div>
    </div>
  </el-main>
</template>

<script>
import { selectCate, selectActivity, getActivityById, delActivity } from "@/api/activity.js";

export default {
  data() {
    return {
      list: [],
      currentPage: 1,
      pageSize: 10,
      // cateData: [],
      search: {
        title: "",
        // cateId: 0,
      },
      total: 0, //分页总页数
      loading: true,
      dialogVisible: false,
      id: null,
    };
  },
  methods: {
    async getData() {
      const res = await selectActivity({
        current: this.currentPage,
        size: this.pageSize,
        title: this.search.title,
        // cateId: this.search.cateId,
      })
      // console.log(res);
      if (res.code === '200' && res.data) {
        res.data.records.map(elem => {
          elem.time = elem.startTime.substr(5, 11) + ' 至 ' + elem.endTime.substr(5, 11)
        })
        this.list = res.data.records;
        this.total = res.data.total;
        this.loading = false;
      }
    },
    // 获取分类列表
    async getCateList() {
      const { code, data } = await selectCate({
        size: 1000,
      })
      if (code === '200' && data.records) {
        this.cateData = data.records;
        this.cateData.unshift({ id: 0, cateName: "全部分类" });
      }
    },
    searchHandle() {
      this.getData();
    },
    reSetHandle() {
      this.search.title = "";
      this.search.cateId = 0;
      this.getData();
    },
    handleCurrentChange(value) {
      this.currentPage = value;
      this.getData();
    },
    scoreHandle({ id }) {
      this.$router.push(`/dragontigers/saveScore/${id}`)
    },
    deptScore({ id }) {
      this.$router.push(`/dragontigers/deptScore/${id}`)
    },
    editHandle({ id }) {
      this.$router.push(`/dragontigers/addDragontiger/${id}`)
    },
    delHandle({ id }) {
      this.dialogVisible = true
      this.id = id
    },
    async doDelHandle() {
      this.dialogVisible = false
      const res = await delActivity(this.id)
      this.$message({
        message: '删除成功',
        type: 'success'
      })
      this.getData()
    },
  },
  created() {
    this.getData();
    // this.getCateList();
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

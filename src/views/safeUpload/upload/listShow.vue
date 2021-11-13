<template>
  <div class="app-container">
    <!-- <el-row :gutter="10" class="mb8">
      <el-col :span="1.5">
        <el-button
          type="primary"
          icon="el-icon-plus"
          size="mini"
          @click="$router.push('/safeUploads/addSafeUpload')"
          >创建责任图</el-button
        >
      </el-col>
    </el-row> -->
    <el-table :data="fileList" style="width: 100%" v-loading="loading">
      <el-table-column
        align="center"
        type="index"
        width="50"
        label="序号"
      ></el-table-column>
      <el-table-column
        align="center"
        prop="title"
        label="标题"
      ></el-table-column>
      <el-table-column
        align="center"
        prop="typeStr"
        label="类型"
      ></el-table-column>
      <el-table-column align="center" label="操作" width="240">
        <template slot-scope="scope">
          <!-- v-if="scope.row.isRead"  -->
          <el-button
            size="mini"
            type="text"
            icon="el-icon-tickets"
            @click.stop="lookHandle(scope.row)"
            >查看</el-button
          >
          <!-- <el-button
            size="mini"
            type="text"
            icon="el-icon-edit"
            @click.stop="configHandle(scope.row)"
            >配置</el-button
          >
          <el-button
            size="mini"
            type="text"
            icon="el-icon-delete"
            @click.stop="delHandle(scope.row)"
            >删除</el-button
          > -->
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
import { selectSafety, delSafety } from "@/api/safety.js";

export default {
  data() {
    return {
      fileList: [],
      currentPage: 1,
      pageSize: 9999,
      cateData: [],
      total: 0, //分页总页数
      loading: true,
      dialogVisible: false,
    };
  },
  methods: {
    handleUpdate() { },
    async getData() {
      const res = await selectSafety({
        current: this.currentPage,
        size: this.pageSize,
      })
      if (res.code === '200') {
        res.data.records.map(elem => {
          elem.typeStr = elem.type == 1 ? '总场站图' : '连队图'
        })
        this.fileList = res.data.records;
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
      const res = await delSafety(this.id)
      this.$message({
        message: "删除成功",
        type: "success"
      });
      this.getData()
    },
    configHandle(obj) {
      this.$router.push(`/safeUploads/configSafeUpload/${obj.id}`)
    },
    lookHandle(obj) {
      this.$router.push(`/safeUploads/showSafeUpload/${obj.id}`)
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
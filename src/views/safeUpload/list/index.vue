<template>
  <div class="app-container">
    <el-table :data="fileList" style="width: 100%" v-loading="loading">
      <el-table-column
        type="index"
        width="50"
        label="序号"
        :index="(currentPage - 1) * pageSize + 1"
      ></el-table-column>
      <el-table-column label="图片">
        <template slot-scope="scope">
          <el-image
            style="width: 100px; height: 100px"
            :src="scope.row.url"
            :preview-src-list="[scope.row.url]"
          >
          </el-image>
        </template>
      </el-table-column>
      <el-table-column prop="createTime" label="上传时间"></el-table-column>
      <el-table-column label="操作" width="240">
        <template slot-scope="scope">
          <!-- v-if="scope.row.isRead"  -->
          <el-button
            type="primary"
            plain
            size="mini"
            @click.stop="downHandle(scope.row)"
            >下载</el-button
          >
          <el-button
            type="success"
            plain
            size="mini"
            @click.stop="delHandle(scope.row)"
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
import { selectSafety, delSafety } from "@/api/safety.js";
import { getFileList, downLoadFile, readFile, finishFile } from "@/api/file.js";

export default {
  data() {
    return {
      fileList: [],
      currentPage: 1,
      pageSize: 10,
      cateData: [],
      search: {
        title: "",
        categoryId: 0,
        level: 0
      },
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
        // title: this.search.title,
        // cateId: this.search.categoryId,
        // level: this.search.level
      })
      console.log(res);
      if (res.code === '200') {
        this.fileList = res.data.records;
        this.total = res.data.total;
        this.loading = false;
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
    //下载
    downHandle(obj) {
      // 修改下载状态
      window.open(obj.url);
    },
    // 点击 查看详情
    // openDetails(row) {
    //   this.$router.push("/files/detail/" + row.id);
    // }
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
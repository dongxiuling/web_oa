<template>
  <div class="app-container">
    <el-row :gutter="10" class="mb8">
      <el-col :span="1.5">
        <el-button
          type="primary"
          icon="el-icon-plus"
          size="mini"
          @click="$router.push('/files/addMain')"
          >添加外出类型</el-button
        >
      </el-col>
    </el-row>

    <el-table :data="list" v-loading="loading">
      <el-table-column type="index" label="序号">
        <template slot-scope="scope">
          {{ scope.$index + 1 }}
        </template>
      </el-table-column>
      <el-table-column prop="name" label="类型名称"></el-table-column>

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
  </div>
</template>

<script>
import { getMainCate, delCate } from "@/api/file";

export default {
  data() {
    return {
      list: [],
      loading: true,
      dialogVisible: false,
      id: null
    };
  },
  methods: {
    handleUpdate() { },
    getData() {
      getMainCate({
        ...this.search,
        size: 100
      }).then(res => {
        // console.log(res);
        this.list = res.data;
        // this.total = res.data;
        this.loading = false;
      });
    },
    searchHandle() {
      this.getData();
    },
    editHandle({ id }) {
      this.$router.push(`/files/addMain/${id}`)
    },
    delHandle({ id }) {
      this.dialogVisible = true
      this.id = id
    },
    async doDelHandle() {
      this.dialogVisible = false
      const res = await delCate(this.id)
      this.$message({
        message: '删除成功',
        type: 'success'
      })
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
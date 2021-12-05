<template>
  <div class="app-container">
    <div class="content">
      <el-table :data="dataList" style="width: 100%" v-loading="loading" :row-class-name="tableRowClassName">
        <el-table-column align="center" type="index" width="150" label="序号">
        </el-table-column>
        <el-table-column
          align="center"
          prop="title"
          label="名称"
        ></el-table-column>
        <el-table-column
          align="center"
          prop="cateName"
          label="类型"
        ></el-table-column>
        <el-table-column
          align="center"
          prop="deptName"
          label="部门"
        ></el-table-column>
        <el-table-column
          align="center"
          prop="contact"
          label="联系人"
        ></el-table-column>
        <el-table-column
          align="center"
          prop="createTime"
          label="创建时间"
        ></el-table-column>
        <el-table-column align="center" label="是否反馈">
          <template slot-scope="scope">
            <el-tag v-if="scope.row.count == 0">待解决</el-tag>
            <el-tag v-else type="success">已解决</el-tag>
          </template>
        </el-table-column>
        <el-table-column align="center" label="反馈">
          <template slot-scope="scope">
            <el-button
              size="mini"
              type="primary"
              icon="el-icon-s-flag"
              @click.stop="appealBtn(scope.row)"
              v-if="scope.row.count == 0"
              >填写反馈</el-button
            >
            <el-button
              type="success"
              size="mini"
              icon="el-icon-search"
              @click.stop="lookBtn(scope.row)"
              v-else
              >查看反馈</el-button
            >
          </template>
        </el-table-column>
        <el-table-column align="center" label="操作" width="200">
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
          style="width: 100%"
          background
          layout="total, prev, pager, next"
          :total="total"
          :current-page.sync="currentPage"
          :page-size="pageSize"
          @current-change="handleCurrentChange"
        ></el-pagination>
      </div>
      <!-- 弹框 -->
      <el-dialog
        v-loading="diaLoading"
        @closed="closeDialog"
        title="问题反馈"
        :visible.sync="dialogFormVisible"
      >
        <el-form ref="form" :model="appealForm" :rules="rules">
          <el-form-item label="反馈人" label-width="120px" prop="title">
            <el-input v-model="appealForm.title" autocomplete="off"></el-input>
          </el-form-item>
          <el-form-item label="反馈内容" label-width="120px" prop="content">
            <el-input
              type="textarea"
              v-model="appealForm.content"
              autocomplete="off"
            ></el-input>
          </el-form-item>
          <el-form-item v-if="appealForm.createTime" label="反馈时间" label-width="120px" prop="content">
            <el-input v-model="appealForm.createTime" autocomplete="off"></el-input>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="dialogFormVisible = false">取 消</el-button>
          <el-button type="primary" v-if="btnShow" @click="appealHandle"
            >确 定</el-button
          >
        </div>
      </el-dialog>
    </div>
  </div>
</template>
<script>
import { exposureList, exposureDel } from "@/api/exposure";
import { addAppeal, appealList } from "@/api/appeal";
import loginVue from '../login.vue';

export default {
  data() {
    return {
      searchText: "",
      dataList: [],
      loading: false,
      currentPage: 1, //分页当前页
      pageSize: 10,
      total: 0, //总页数
      diaLoading: false,
      appealForm: {},
      dialogFormVisible: false,
      rules: {
        title: [{ required: true, message: "请输入反馈人", trigger: "blur" }],
        content: [{ required: true, message: "请输入反馈内容", trigger: "blur" }],
      },
      btnShow: true
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
          // console.log(item)
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
        path: "/exposure/add",
        query: {
          id: item.id
        }
      });
    },
    // 清空搜索框
    clearInp() {
      this.searchText = "";
      this.getList();
    },
    // 按标题搜索内容
    searchTitle() {
      // this.loading = true;
      // getByTitle(this.searchText).then((res) => {
      //   let thisData = [];
      //   this.loading = false;
      //   thisData = res.data.map((item) => {
      //     item.createTime = item.createTime.split(" ")[0];
      //     return item;
      //   });
      //   this.dataList = thisData;
      // })

      this.$router.push({
        path: "/release/lawdetail/0",
        query: {
          search: this.searchText,
        },
      });
    },
    //单行选中
    checkLine(row) {
      this.$router.push({
        path: "/release/lawdetail/" + row.id,
      });
    },
    // 获取法规列表数据
    getList() {
      this.loading = true;
      exposureList({
        current: this.currentPage,
        size: this.pageSize,
        type: 2,
      }).then((res) => {
        // console.log(res);
        this.dataList = res.data.records;
        this.loading = false;
        this.total = res.data.total
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
        path: "/exposure_/detail/" + _data.id,
      });
    },
    handleCurrentChange(value) {
      this.currentPage = value;
      this.getData();
    },
    // 反馈按钮
    appealBtn(row) {
      this.appealForm = {}
      this.appealId = row.id;
      this.btnShow = true
      this.dialogFormVisible = true;
    },
    async lookBtn(row) {
      const res = await appealList({
        current: this.currentPage,
        size: this.pageSize,
        hId: row.id
      })
      if (res && res.code == 200 && res.data.records && res.data.records[0]) {
        this.btnShow = false
        this.dialogFormVisible = true
        this.appealForm = {
          title: res.data.records[0].username,
          content: res.data.records[0].complaint,
          createTime: res.data.records[0].createTime,
        }
      }
    },
    // 反馈
    appealHandle() {
      this.diaLoading = true;
      this.$refs.form.validate((valid) => {
        if (valid) {
          addAppeal({
            username: this.appealForm.title,
            hid: this.appealId,
            complaint: this.appealForm.content,
          }).then((res) => {
            this.$message({
              message: "反馈已发出",
              type: "success",
            });
            this.$refs.form.resetFields();
            this.dialogFormVisible = false;
            this.diaLoading = false;
            this.getList();
          });
        } else {
          console.log(valid, "error submit!!");
          return false;
        }
      });
    },
    // 关闭弹框
    closeDialog() {
      this.$refs.form.resetFields();
    },
    tableRowClassName({ row, rowIndex }) {
      if (row.count == 0) {
        return 'warning-row'
      }
      return ''
    }
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
.page-box {
  text-align: right;
  margin-top: 20px;
}
</style>
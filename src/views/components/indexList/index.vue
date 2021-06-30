<template>
  <!-- 首页文章列表 -->
  <!-- type 值1:历史今天，2：曝光问题，3：部门要事，4：事故通报，5：司机专栏，6：学习园地 -->
  <div class="container">
    <div></div>
    <div class="content">
      <el-card class="box-card">
        <div slot="header" class="clearfix">
          <span>{{ title }}</span>
        </div>

        <el-table :data="dataList" style="width: 100%" v-loading="loading">
          <el-table-column type="index" width="150" label="序号">
          </el-table-column>
          <el-table-column prop="title" label="名称"></el-table-column>
          <el-table-column v-if="type == 1" prop="time" label="历史时间"></el-table-column>
          <el-table-column v-else prop="createTime" label="添加时间"></el-table-column>
          <el-table-column label="操作" width="200">
            <template slot-scope="scope">
              <el-button
                size="mini"
                type="text"
                icon="el-icon-view"
                @click.stop="showDetail(scope.row)"
                >详情</el-button
              >
              <el-button
                v-if="type == 2"
                size="mini"
                type="text"
                icon="el-icon-s-flag"
                @click.stop="appealBtn(scope.row)"
                >申诉</el-button
              >
            </template>
          </el-table-column>
        </el-table>
        <div class="page-box">
          <el-pagination
            layout="total, prev, pager, next, jumper"
            :total="total"
            :current-page.sync="currentPage"
            :page-size="pageSize"
            @current-change="handleCurrentChange"
          ></el-pagination>
        </div>
      </el-card>
    </div>
    <!-- 弹框 -->
    <el-dialog
      v-loading="diaLoading"
      @closed="closeDialog"
      title="问题申诉"
      :visible.sync="dialogFormVisible"
    >
      <el-form ref="form" :model="appealForm" :rules="rules">
        <el-form-item label="申诉人" label-width="120px" prop="title">
          <el-input v-model="appealForm.title" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="申诉内容" label-width="120px" prop="content">
          <el-input
            type="textarea"
            v-model="appealForm.content"
            autocomplete="off"
          ></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="appealHandle">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import {dateFormat} from "../../../utils/format";
import { exposureList } from "@/api/exposure";
import { addAppeal } from "@/api/appeal";
export default {
  props: ["type"],
  data() {
    return {
      rules: {
        title: [{ required: true, message: "请输入标题", trigger: "blur" }],
        content: [{ required: true, message: "请输入内容", trigger: "blur" }],
      },
      diaLoading: false,
      appealForm: {},
      dialogFormVisible: false,
      searchText: "",
      dataList: [],
      loading: false,
      currentPage: 1, //分页当前页
      pageSize: 10,
      total: 0, //总页数
    };
  },
  methods: {
    // 关闭弹框
    closeDialog() {
      this.$refs.form.resetFields();
    },
    // 申诉按钮
    appealBtn(row) {
      this.appealId = row.id;
      this.dialogFormVisible = true;
    },
    // 申诉
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
              message: "申诉已发出",
              type: "success",
            });
            this.$refs.form.resetFields();
            this.dialogFormVisible = false;
            this.diaLoading = false;
          });
        } else {
          console.log(valid, "error submit!!");
        }
      });
    },
    // 获取法规列表数据
    getList() {
      let _data={
        current: this.currentPage,
        size: this.pageSize,
        type: this.type,
      }
      if(this.type == 1){
        _data.time = dateFormat("YYYY-mm-dd HH:MM:SS", new Date())
      }
      this.loading = true;
      exposureList(_data).then((res) => {
        console.log(res);
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
      this.getList();
    },
  },
  mounted() {
    this.getList();
  },
  computed: {
    title() {
      let _title = ""
      let _type = this.type * 1;
      switch (_type) {
        case 1: _title = "历史今天"; break;
        case 2: _title = "曝光问题"; break;
        case 3: _title = "部门要事"; break;
        case 4: _title = "事故通报"; break;
        case 5: _title = "司机专栏"; break;
        case 6: _title = "学习园地"; break;
        default: _title = "无";
      }
      return _title
    }
  }
};
</script>
<style scoped>
li {
  list-style: none;
}
.container {
  margin-bottom: 20px;
  background-color: #fff;
  border-radius: 5px;
  box-shadow: 0 2px 12px 0 rgb(0 0 0 / 10%);
}
.content::after {
  content: "";
  display: block;
  clear: both;
}

.page-box {
  padding: 20px 0;
  float: right;
}
</style>
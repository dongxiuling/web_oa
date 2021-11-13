<template>
  <div class="app-container">
    <el-form :inline="true">
      <el-form-item>
        <el-button
          class="filter-item"
          type="primary"
          icon="el-icon-plus"
          size="mini"
          @click="handleAdd()"
          >新增节点</el-button
        >
        <el-button
          class="filter-item"
          type="primary"
          icon="el-icon-plus"
          size="mini"
          @click="handleDel()"
          >删除责任图</el-button
        >
        <el-button
          class="filter-item"
          type="primary"
          icon="el-icon-back"
          size="mini"
          @click="$router.go(-1)"
          >返回</el-button
        >
      </el-form-item>
    </el-form>

    <el-table
      :data="list"
      row-key="id"
      default-expand-all
      :tree-props="{ children: 'children', hasChildren: 'hasChildren' }"
    >
      <el-table-column prop="name" label="姓名" width="260"></el-table-column>
      <el-table-column
        label="操作"
        align="center"
        class-name="small-padding fixed-width"
      >
        <template slot-scope="scope">
          <!-- <el-button
            size="mini"
            type="text"
            icon="el-icon-edit"
            @click="handleUpdate(scope.row)"
            >修改</el-button
          > -->
          <el-button
            size="mini"
            type="text"
            icon="el-icon-plus"
            @click="handleAdd(scope.row)"
            >新增</el-button
          >
          <!-- <el-button
            v-if="scope.row.parentId != 0"
            size="mini"
            type="text"
            icon="el-icon-delete"
            @click="handleDelete(scope.row)"
            >删除</el-button
          > -->
        </template>
      </el-table-column>
    </el-table>

    <!-- 添加或修改部门对话框 -->
    <el-dialog title="新增节点" :visible.sync="open" width="500px">
      <el-form
        :model="loginForm"
        :rules="rules"
        class="login-form"
        label-width="100px"
        ref="question"
      >
        <el-form-item label="节点名称" prop="nodeName">
          <el-input v-model="loginForm.nodeName"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitForm">确 定</el-button>
        <el-button @click="cancel">取 消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { saveSafety, getSafetyById } from "@/api/safety.js";
import Treeselect from "@riophae/vue-treeselect";
import "@riophae/vue-treeselect/dist/vue-treeselect.css";

export default {
  name: "Dept",
  components: { Treeselect },
  data() {
    return {
      loading: true,
      list: [],
      open: false,
      form: {},
      obj: { name: "安全责任图", children: [] },
      loginForm: {
        nodeName: ''
      },
      dept: null,
      user: null,
      deptList: [],
      personList: [],
      rules: {
        // deptId: [{ required: true, message: "请选择部门", trigger: "blur" }],
        // userId: [{ required: true, message: "请选择姓名", trigger: "blur" }],
        nodeName: [{ required: true, message: "请填写节点名称", trigger: "blur" }],
      },
      id: this.$route.params.id,
      type: 0,
    };
  },
  methods: {
    getList() {
      this.loading = true;
      getSafetyById(this.id).then((res) => {
        if (res.code == 200 && res.data) {
          this.type = res.data.type
          if (res.data.url) {
            this.list = JSON.parse(res.data.url);
          } else {
            this.list = []
          }
          // this.list = JSON.parse(res.data.url);
        }
      });
    },

    // 取消按钮
    cancel() {
      this.open = false;
      this.reset();
    },
    // 表单重置
    reset() {
      this.loginForm = {
        dept: '',
        user: '',
      };
    },

    /** 新增按钮操作 */
    handleAdd(row) {
      // this.reset();
      if (row != undefined) {
        this.obj = row;
      } else {
        this.obj = {};
      }

      this.open = true;
    },
    /** 提交按钮 */
    submitForm: function () {
      //验证
      this.$refs["question"].validate((valid) => {
        if (valid) {
          if (JSON.stringify(this.obj) == "{}") {
            this.list.push({
              name: this.loginForm.nodeName,
              id: Math.random()
            });
          }
          if (!this.obj.hasOwnProperty("children")) {
            this.obj.children = [];
          }
          console.log(this.obj.children);
          this.obj.children.push({
            name: this.loginForm.nodeName,
            id: Math.random()
          });

          // this.list已更新 提交到数据库 ->更新页面
          var data = this.id
            ? { url: JSON.stringify(this.list), id: this.id, type: this.type }
            : { url: JSON.stringify(this.list) };

          saveSafety(data).then(() => {
            this.open = false;
            this.getList();
            this.reset();
          });
        }
      });
    },
    handleDel() {
      this.$confirm("是否确认删除安全管理责任图?", "警告", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          var data = this.id
            ? { url: JSON.stringify([]), id: this.id }
            : { url: JSON.stringify([]) };
          console.log('data', data);
          saveSafety(data).then(() => {
            this.open = false;
            this.getList();
            this.msgSuccess("删除成功");
          });
        })
        .catch(function () { });
    },
  },
  mounted() {
    this.id = this.$route.params.id
    // this.type = this.$route.params.type

    console.log('245', this.id);
    this.getList()
  }
};
</script>
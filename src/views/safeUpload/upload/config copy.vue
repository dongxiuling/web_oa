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
    <el-dialog :title="title" :visible.sync="open" width="600px">
      <el-form
        :model="loginForm"
        :rules="rules"
        class="login-form"
        label-width="60px"
        ref="question"
      >
        <el-form-item label="部门" prop="deptId">
          <el-select
            v-model="loginForm.deptId"
            placeholder="请选择部门"
            style="width: 260px"
          >
            <el-option
              v-for="item in deptList"
              :key="item.deptId"
              :label="item.deptName"
              :value="item.deptId"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="姓名" prop="userId">
          <el-select
            v-model="loginForm.userId"
            placeholder="请选择姓名"
            style="width: 260px"
          >
            <el-option
              v-for="item in personList"
              :key="item.id"
              :label="item.name"
              :value="item.id"
            ></el-option>
          </el-select>
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
import { lastDept } from "@/api/system/dept";
import { selectPerson } from "@/api/insider";
import {
  getDept,
} from "@/api/system/dept";
import { saveSafety, selectSafety } from "@/api/safety.js";
import Treeselect from "@riophae/vue-treeselect";
import "@riophae/vue-treeselect/dist/vue-treeselect.css";

export default {
  name: "Dept",
  components: { Treeselect },
  data() {
    return {
      // 遮罩层
      loading: true,
      list: [],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      // 表单参数
      form: {},
      obj: { name: "安全责任图", children: [] },
      loginForm: {
        deptId: '',
        userId: '',
      },
      dept: null,
      user: null,
      deptList: [],
      personList: [],
      rules: {
        deptId: [{ required: true, message: "请选择部门", trigger: "blur" }],
        userId: [{ required: true, message: "请选择姓名", trigger: "blur" }],
      },
      id: this.$route.params.id
    };
  },
  created() {
    this.getDeptList();
    this.getList();
  },
  computed: {
    changeDeptId() { return this.loginForm.deptId },
    changeUserId() { return this.loginForm.userId },
  },
  watch: {
    changeDeptId(val) {
      if (val) {
        this.personList = []
        // this.loginForm.userId = ''
        for (let i in this.deptList) {
          if (val == this.deptList[i].deptId) {
            this.dept = this.deptList[i]
            break
          }
        }
        this.getPersonInfoByDeptId(val)
      }
    },
    changeUserId(val) {
      if (val) {
        for (let i in this.personList) {
          if (val == this.personList[i].id) {
            this.user = this.personList[i]
            break
          }
        }
      }
    }
  },
  methods: {
    getList() {
      this.loading = true;
      selectSafety({
        size: 100,
        current: 1,
      }).then((res) => {
        if (res.data.records.length > 0) {
          this.id = res.data.records[0].id;
          this.list = JSON.parse(res.data.records[0].url);
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
      this.title = "添加人员";
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset();
      this.getTreeselect();
      getDept(row.deptId).then((response) => {
        this.form = response.data;
        this.open = true;
        this.title = "修改人员";
      });
    },
    /** 提交按钮 */
    submitForm: function () {
      //验证
      this.$refs["question"].validate((valid) => {
        if (valid) {
          if (JSON.stringify(this.obj) == "{}") {
            this.list.push({
              name: this.dept.deptName + "：" + this.user.name,
              id: this.user.id,
            });
          }
          if (!this.obj.hasOwnProperty("children")) {
            this.obj.children = [];
          }
          this.obj.children.push({
            name: this.dept.deptName + "：" + this.user.name,
            id: this.user.id,
          });

          // this.list已更新 提交到数据库 ->更新页面
          var data = this.id
            ? { url: JSON.stringify(this.list), id: this.id }
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
          saveSafety(data).then(() => {
            this.open = false;
            this.getList();
            this.msgSuccess("删除成功");
          });
        })
        .catch(function () { });
    },
    async getDeptList() {
      const res = await lastDept();
      if (res && res.code == 200 && res.data) {
        this.deptList = res.data;
      }
    },
    async getPersonInfoByDeptId(deptId) {
      const res = await selectPerson({
        deptId,
        current: 0,
        size: 999,
      });
      if (res.code === "200" && res.data) {
        this.personList = res.data.records;
      }
    },
  },
  mounted() {
    this.id = this.$route.params.id
    console.log(id)
  }
};
</script>
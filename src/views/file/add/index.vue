<template>
  <div class="app-container">
    <el-form ref="file" :model="file" :rules="rules" label-width="80px">
      <el-form-item label="资料名称" prop="title">
        <el-input v-model="file.title" style="width:300px"></el-input>
      </el-form-item>
      <el-form-item label="资料模块" prop="cateId">
        <el-select v-model="file.cateId" placeholder="请选择资料模块">
          <el-option
            v-for="item in cateData"
            :key="item.dictCode"
            :label="item.dictLabel"
            :value="item.dictCode"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="资料级别" prop="level">
        <el-select v-model="file.level" placeholder="请选择资料级别">
          <el-option v-for="(item,index) in levels" :key="index" :label="item" :value="index+1"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="上传资料">
        <Uploader v-on:getFile="getFileUrl(arguments)"></Uploader>
      </el-form-item>
      <el-form-item label="发送人员">
        <el-tree
          :data="deptTree"
          show-checkbox
          node-key="id"
          ref="tree"
          :props="defaultProps"
          @check="getCheckedNodes()"
          :default-checked-keys="file.userIds"
        ></el-tree>
      </el-form-item>
      <el-form-item>
        <el-button v-if="$route.query.id" type="primary" @click="updateHandle('file')">确定修改</el-button>
        <el-button v-else type="primary" @click="submitForm('file')">立即创建</el-button>
        <el-button @click="resetForm('file')">取消</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import { getCategory } from "@/api/tool/category.js";
import { fileSave, getFileById, updateFile } from "@/api/file";
import { listUser, getTreeUser } from "@/api/system/user";
import Uploader from "@/components/Uploader";

export default {
  data() {
    return {
      cateData: [],
      deptTree: [],
      file: {
        title: "",
        cateId: "",
        url: "http://www.rr.cc",
        readUrl: "http://www.rr.cc",
        userIds: []
      },
      id: this.$route.query.id,
      rules: {
        title: [{ required: true, message: "请输入资料名称", trigger: "blur" }],

        cateId: [
          { required: true, message: "请选择资料模块", trigger: "change" }
        ],
        level: [
          { required: true, message: "请选择资料级别", trigger: "change" }
        ]
      },
      time: [],
      props: {
        label: "name",
        children: "zones"
      },
      defaultProps: {
        children: "children",
        label: "label",
        isLeaf: "leaf"
      },
      levels: ["紧急事件", "重点关注事件", "一般事件"]
    };
  },
  components:{
    Uploader
  },
  methods: {
    //获取选中状态下的人员数据
    getCheckedNodes() {
      this.file.userIds = this.$refs.tree.getCheckedNodes(true).map(item => {
        return item.id;
      });
    },
    /** 查询部门树结构 */
    getDeptTreeselect() {
      getTreeUser().then(response => {
        this.deptTree = response.data;
      });
    },
    // 获取分类列表ç
    getCateList() {
      getCategory({
        pageNum: 1,
        pageSize: 1000,
        dictType: "file_module_status"
      }).then(res => {
        this.cateData = res.rows;
      });
    },
    submitForm(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          this.addHandle();
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
    resetForm(formName) {
      this.$refs[formName].resetFields();
    },
    // 添加考试
    addHandle() {
      fileSave(this.file).then(res => {
        this.$message({
          message: "添加成功",
          type: "success"
        });
        this.$router.push("/file/myfile");
      });
    },
    // 修改考试
    updateHandle() {
      updateFile(this.file).then(res => {
        this.$message({
          message: "修改成功",
          type: "success"
        });
        this.$router.push("/file/myfile");
      });
    },
    // 修改考试获取信息
    getFileById(id) {
      getFileById({ id }).then(res => {
        this.file = res.data;
      });
    },
    // 获取wFid和nFid
    getFileUrl(args){
      this.file.url = args[0];
      this.file.readUrl = args[1];
    }
  },
  created() {
    // 获取分类列表
    this.getCateList();
    // 获取部门树形结构
    this.getDeptTreeselect();
    if (this.id) {
      // console.log(this.id)
      this.getFileById(this.id);
    }
  }
};
</script>
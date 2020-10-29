<template>
  <div class="app-container">
    <el-form ref="file" :model="file" :rules="rules" label-width="80px">
      <el-form-item label="上传安全图">
        <Uploader v-on:getFile="getFileUrl(arguments)" :change="isChange" :name="file.name"></Uploader>
        <!-- <el-button @click="openTabWin(file.readUrl,'view')" v-if="file.readUrl"  icon="el-icon-view" size="small" type="primary">预览文件</el-button> -->
        <el-button v-if="id" @click="openTabWin(file.url,'download')" icon="el-icon-download" size="small" type="success">下载文件</el-button>
      </el-form-item>
      <el-form-item>
        <el-button  type="primary" @click="submitForm('file')">立即创建</el-button>
        <el-button @click="resetForm('file')">取消</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import { saveSafety } from "@/api/safety.js";
import { fileSave ,downLoadFile,readFile} from "@/api/file";
import { listUser, getTreeUser } from "@/api/system/user";
import Uploader from "@/components/Uploader";

export default {
  data() {
    return {
      cateData: [],
      deptTree: [],
      defaultProps: {
        children: "children",
        label: "label",
        isLeaf: "leaf"
      },
      filterText: "",
      file: {
        title: "",
        cateId: "",
        url: "http://www.rr.cc",
        readUrl: "http://www.rr.cc",
        userIds: [],
        type: "regulatory_documents",
        name: ""
      },
      isChange: false, //false添加 true修改
      id: this.$route.query.id,
      rules: {
        title: [{ required: true, message: "请输入法规名称", trigger: "blur" }],

        cateId: [
          { required: true, message: "请选择法规分类", trigger: "change" }
        ],
        level: [
          { required: true, message: "请选择法规级别", trigger: "change" }
        ]
      },
      time: [],
      props: {
        label: "name",
        children: "zones"
      },
      levels: ["紧急事件", "重点关注事件", "一般事件"]
    };
  },
  components: {
    Uploader
  },
  watch: {
    filterText(val) {
      this.$refs.tree.filter(val);
    }
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
    filterNode(value, data) {
      if (!value) return true;
      return data.label.indexOf(value) !== -1;
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
    // 添加
    addHandle() {
      // 验证 是否上传文件
      if (this.file.name) {
        saveSafety(this.file).then(res => {
          this.$message({
            message: "添加成功",
            type: "success"
          });
          this.$router.push("/safeUpload/safeUploadlist");
        });
      }else{
        this.$message.error('请选择上传文件');
      }
    },
    // 获取wFid和nFid
    getFileUrl(args) {
      this.file.url = args[1];
      this.file.readUrl = args[2];
      this.file.name = args[0];
      this.isChange = true;
    },
    // 下载或预览操作
    async openTabWin(url,type){
      if(type=="view"){
        await readFile({id:this.file.id})
      }else if(type="download"){
        await downLoadFile({id:this.file.id})
      }
      window.open(url,"_blank");
    },
  },
  created() {
    if (this.id) {
      // 修改upload 状态 false添加 true修改
      this.isChange = true;
    }
  }
};
</script>
<template>
  <div class="app-container">
    <el-form ref="file" :model="file" :rules="rules" label-width="160px">
      <el-form-item label="工作阶段" prop="title">
          <el-button
          type="primary"
          icon="el-icon-plus"
          size="mini"
          @click="stepDialogVisible = true"
        >添加步骤</el-button>
        <el-steps style="width: 600px" id="step-container">
            <el-step v-for="(item, index) in file.steps" :title="item" :key="index" status="finish"></el-step>
        </el-steps>
      </el-form-item>
      
      <el-form-item label="工作名称" prop="title">
        <el-input
          v-model="file.title"
          style="width: 600px"
          placeholder="请输入工作名称"
        ></el-input>
      </el-form-item>
      <el-form-item label="工作说明" prop="content">
        <el-input
          type="textarea"
          :autosize="{ minRows: 2, maxRows: 8 }"
          placeholder="请输入工作说明"
          v-model="file.content"
          style="width: 600px"
        ></el-input>
      </el-form-item>

      <el-form-item label="工作检查项" prop="content">
        <el-tabs type="border-card" style="width: 600px">
          <el-tab-pane label="普通检查项">
              <Uploader
                v-on:getFile="getFileUrl(arguments)"
                :change="isChange"
                :name="file.name"
              ></Uploader>
              <el-button
                v-if="id"
                @click="openTabWin(file.url, 'download')"
                icon="el-icon-download"
                size="small"
                type="success"
                >下载文件</el-button>
              <el-tree
                :data="deptTree"
                show-checkbox
                node-key="id"
                ref="tree"
                :props="defaultProps"
                @check="getCheckedNodes()"
                :default-checked-keys="file.userIds"
                :filter-node-method="filterNode"
              ></el-tree>
          </el-tab-pane>
          <el-tab-pane label="特殊检查项">
              <Uploader
                v-on:getFile="getFileUrl(arguments)"
                :change="isChange"
                :name="file.name"
              ></Uploader>
              <!-- <el-button @click="openTabWin(file.readUrl,'view')" v-if="file.readUrl"  icon="el-icon-view" size="small" type="primary">预览文件</el-button> -->
              <el-button
                v-if="id"
                @click="openTabWin(file.url, 'download')"
                icon="el-icon-download"
                size="small"
                type="success"
                >下载文件</el-button>
              <el-tree
                :data="deptTree"
                show-checkbox
                node-key="id"
                ref="tree"
                :props="defaultProps"
                @check="getCheckedNodes()"
                :default-checked-keys="file.userIds"
                :filter-node-method="filterNode"
              ></el-tree>
          </el-tab-pane>
          </el-tab-pane>
        </el-tabs>
      </el-form-item>

      <el-form-item>
        <el-button
          v-if="$route.query.id"
          type="primary"
          @click="updateHandle('file')"
          >确定修改</el-button
        >
        <el-button v-else type="primary" @click="submitForm('file')"
          >立即创建</el-button
        >
        <el-button @click="resetForm('file')">取消</el-button>
      </el-form-item>
    </el-form>


    <el-dialog
    title="添加步骤"
    :visible.sync="stepDialogVisible"
    width="30%"
    :before-close="handleClose">
    <div>
    <el-input
          v-model="file.step"
          placeholder="请输入步骤名称"
        ></el-input>
        </div>
    <span slot="footer" class="dialog-footer">
        <el-button @click="stepDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addStep">确 定</el-button>
    </span>
    </el-dialog>
  </div>
</template>

<script>
import { getMainCate, getSubCate } from "@/api/file";
import { fileSave, getFileById, updateFile, downLoadFile, readFile } from "@/api/file";
import { listUser, getTreeUser } from "@/api/system/user";
import Uploader from "@/components/Uploader";
import { dateFormat } from "@/utils/format";

export default {
  data() {
    return {
      cateData: [],
      subCateData: [],
      deptTree: [],
      defaultProps: {
        children: "children",
        label: "label",
        isLeaf: "leaf"
      },
      //   filterText: "",
      file: {
        title: "",
        firstCateId: '',
        cateId: "",
        url: "http://www.rr.cc",
        readUrl: "http://www.rr.cc",
        userIds: [],
        type: "regulatory_documents",
        name: "",
        step: '',
        steps: []
      },
      isChange: false, //false添加 true修改
      id: this.$route.query.id,
      rules: {
        title: [{ required: true, message: "请输入工作名称", trigger: "blur" }],
        content: [{ required: true, message: "请输入工作说明", trigger: "blur" }],
      },
      time: [],
      props: {
        label: "name",
        children: "zones"
      },
      isFirstUpdate: false,
      stepDialogVisible: false // 添加步骤dialog
    };
  },
  components: {
    Uploader
  },
  watch: {
    // filterText(val) {
    //   this.$refs.tree.filter(val);
    // }
  },
  methods: {
    //获取选中状态下的人员数据
    getCheckedNodes() {
      const userIds = []
      this.$refs.tree.getCheckedNodes(true).forEach(item => {
        if (item.id.toString().length > 4) {
          userIds.push(item.id)
        }
      });
      this.file.userIds = userIds
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
    // 获取分类列表
    // async getCateList() {
    //   const res = await getMainCate();
    //   // console.log(res);
    //   if (res && res.code === '200') {
    //     this.cateData = res.data;
    //   }
    // },
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
    // 添加法规
    addHandle() {
      // 验证 是否上传文件
      if (this.file.name) {
        this.file.finishTime = dateFormat("YYYY-mm-dd HH:MM:SS", new Date(this.file.finishTime))
        this.file.endTime = dateFormat("YYYY-mm-dd HH:MM:SS", new Date(this.file.endTime))
        fileSave(this.file).then(res => {
          this.$message({
            message: "添加成功",
            type: "success"
          });
          this.$router.push("/file/myfile");
        });
      } else {
        this.$message.error('请选择上传文件');
      }
    },
    // 修改法规
    updateHandle() {
      updateFile({ ...this.file, type: "regulatory_documents" }).then(res => {
        this.$message({
          message: "修改成功",
          type: "success"
        });
        this.$router.push("/file/myfile");
      });
    },
    // 修改法规获取信息
    async getFileById(id) {
      const res = await getFileById({ id })
      this.file = res.data;
      await this.selectChanged()
    },
    // 获取wFid和nFid
    getFileUrl(args) {
      this.file.url = args[1];
      this.file.readUrl = args[2];
      this.file.name = args[0];
      this.isChange = true;
    },
    // 下载或预览操作
    async openTabWin(url, type) {
      if (type == "view") {
        await readFile({ id: this.file.id })
      } else if (type = "download") {
        await downLoadFile({ id: this.file.id })
      }
      window.open(url, "_blank");
    },
    async selectChanged() {
      this.subCateData = []
      // console.log(this.isFirstUpdate);
      if (!this.isFirstUpdate) {
        this.file.cateId = ''
      } else {
        this.isFirstUpdate = false
      }
      const res = await getSubCate({ mainId: this.file.firstCateId })
      // console.log(res)
      if (res && res.code === '200') {
        this.subCateData = res.data
      }
    },

    addStep() {
      this.file.steps.push(this.file.step)
      this.file.step = ''
    },
    handleClose() {
      this.stepDialogVisible = false
      this.file.step = ''
    }


  },
  created() {
    // 获取分类列表
    // this.getCateList();
    // 获取部门树形结构
    this.getDeptTreeselect();
    if (this.id) {
      this.getFileById(this.id);
      // 修改upload 状态 false添加 true修改
      this.isChange = true;
      this.isFirstUpdate = true
    }
  }
};
</script>
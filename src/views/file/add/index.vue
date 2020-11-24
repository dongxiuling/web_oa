<template>
  <div class="app-container">
    <el-form ref="file" :model="file" :rules="rules" label-width="160px">
      <el-form-item label="法规名称" prop="title">
        <el-input v-model="file.title" style="width: 300px"></el-input>
      </el-form-item>
      <el-form-item label="法规主分类" prop="firstCateId">
        <el-select
          v-model="file.firstCateId"
          placeholder="请选择法规主分类"
          style="width: 300px"
          @change="selectChanged"
        >
          <el-option
            v-for="item in cateData"
            :key="item.id"
            :label="item.name"
            :value="item.id"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="法规子分类" prop="cateId">
        <el-select
          v-model="file.cateId"
          placeholder="请选择法规子分类"
          style="width: 300px"
        >
          <el-option
            v-for="item in subCateData"
            :key="item.id"
            :label="item.name"
            :value="item.id"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="法规内容" prop="content">
        <el-input
          type="textarea"
          :autosize="{ minRows: 2, maxRows: 8 }"
          placeholder="请输入法规内容"
          v-model="file.content"
          style="width: 300px"
        ></el-input>
      </el-form-item>
      <!-- 1:一次性 2:周 3:月 4:季度 -->
      <el-form-item label="周期类型" prop="cycle">
        <el-select v-model="file.cycle" placeholder="请选择周期类型">
          <el-option :value="1" label="仅提醒一次"></el-option>
          <el-option :value="2" label="每周提醒"></el-option>
          <el-option :value="3" label="每月提醒"></el-option>
          <el-option :value="4" label="每季度提醒"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item v-if="file.cycle!=1" label="周期性提醒截止时间">
        <el-date-picker
          v-model="file.endTime"
          type="datetime"
          placeholder="请选择周期性提醒截止时间"
          style="width: 300px"
        ></el-date-picker>
      </el-form-item>
      <el-form-item  label="落实截止时间" prop="finishTime">
        <el-date-picker
          v-model="file.finishTime"
          type="datetime"
          placeholder="请选择落实截止时间"
          style="width: 300px"
        ></el-date-picker>
      </el-form-item>
      
      <!-- <el-form-item label="法规级别" prop="level">
        <el-select v-model="file.level" placeholder="请选择法规级别">
          <el-option v-for="(item,index) in levels" :key="index" :label="item" :value="index+1"></el-option>
        </el-select>
      </el-form-item> -->
      <el-form-item label="上传法规">
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
          >下载文件</el-button
        >
      </el-form-item>
      <el-form-item label="发送人员">
        <el-input
          placeholder="输入关键字进行过滤"
          v-model="filterText"
        ></el-input>
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
      filterText: "",
      file: {
        title: "",
        firstCateId: '',
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
        firstCateId: [
          { required: true, message: "请选择法规主分类", trigger: "change" }
        ],
        cateId: [
          { required: true, message: "请选择法规子分类", trigger: "change" }
        ],
        content: [{ required: true, message: "请输入法规内容", trigger: "blur" }],
        finishTime: [
          { required: true, message: '请选择日期', trigger: ['blur', 'change'] }
        ],
        cycle: [
          { required: true, message: '请选周期类型', trigger: ['blur', 'change'] }
        ]
        // level: [
        //   { required: true, message: "请选择法规级别", trigger: "change" }
        // ]
      },
      time: [],
      props: {
        label: "name",
        children: "zones"
      },
      isFirstUpdate: false
      // levels: ["紧急事件", "重点关注事件", "一般事件"]
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
    // 获取分类列表ç
    async getCateList() {
      const res = await getMainCate();
      // console.log(res);
      if (res && res.code === '200') {
        this.cateData = res.data;
      }
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
    }
  },
  created() {
    // 获取分类列表
    this.getCateList();
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
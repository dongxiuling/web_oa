<template>
  <div class="app-container">
    <el-form ref="queryForm" :inline="true">
      <el-form-item label="姓名">
        <el-input
          placeholder="请输入搜索姓名"
          v-model="search.name"
          clearable
          size="small"
        />
      </el-form-item>
      <el-form-item>
        <el-button
          type="primary"
          icon="el-icon-search"
          size="mini"
          @click="searchHandle()"
          >搜索</el-button
        >
        <el-button icon="el-icon-refresh" size="mini" @click="reSetHandle()"
          >重置</el-button
        >
      </el-form-item>
    </el-form>
    <el-row :gutter="10" class="mb8">
      <el-col :span="1.5">
        <el-button
          type="primary"
          icon="el-icon-download"
          size="mini"
          @click="exportInfo"
          >人员信息导出</el-button
        >
        <el-tooltip placement="right" effect="light">
          <div slot="content">
            上传人员信息表格注意事项： <br />
            （1）上传表格必须是系统导出的人员信息表格文件<br />
            （2）删除标志：只有需要删除的人员需要选‘是’，其他都选‘否’<br />
            （3）人员编码：新增加人员的编码为空<br />
            （4）部门名称：部门名称必须与导出人员表格中sheet2中部门信息名称一致<br />
          </div>
          <el-button
            type="primary"
            icon="el-icon-upload2"
            size="mini"
            @click="dialogVisible = true"
            >人员信息导入</el-button
          >
        </el-tooltip>
      </el-col>
    </el-row>
    <el-table :data="list" style="width: 100%" v-loading="loading">
      <el-table-column
        type="index"
        label="序号"
        :index="(currentPage - 1) * pageSize + 1"
      ></el-table-column>
      <el-table-column prop="title" label="来访事由"></el-table-column>
      <el-table-column prop="name" label="来访人"></el-table-column>
      <el-table-column prop="contacts" label="对接人"></el-table-column>
      <el-table-column
        prop="time"
        width="180"
        label="来访时段"
      ></el-table-column>
      <!-- <el-table-column
        prop="createTime"
        width="180"
        label="创建时间"
      ></el-table-column> -->
      <el-table-column label="操作" width="220">
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="text"
            icon="el-icon-tickets"
            @click="lookHandle(scope.row)"
            >来访详情</el-button
          >
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
      :visible.sync="delDialogVisible"
      width="30%"
      :before-close="
        () => {
          delDialogVisible = false;
        }
      "
    >
      <span>确认删除吗</span>
      <span slot="footer" class="dialog-footer">
        <el-button @click="delDialogVisible = false">取 消</el-button>
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

    <el-dialog
      title="上传人员信息表格"
      :visible.sync="dialogVisible"
      width="500px"
      :before-close="handleClose"
      :destroy-on-close="true"
    >
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
      <span slot="footer" class="dialog-footer">
        <el-button @click="handleClose">取 消</el-button>
        <el-button type="primary" @click="importInfo">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { selectOutsider, getOutsiderById, delOutsiderById } from "@/api/outsider.js";
import { exportPersonInfo, importPersonInfo } from "@/api/insider.js";
import Uploader from "@/components/Uploader";

export default {
  data() {
    return {
      list: [],
      currentPage: 1,
      pageSize: 10,
      search: {
        name: ""
      },
      total: 0, //分页总页数
      loading: true,
      id: null,
      dialogVisible: false,
      file: {
        title: "",
        url: "",
        readUrl: "",
        type: "regulatory_documents",
        name: ""
      },
      isChange: false, //false添加 true修改
      id: this.$route.query.id,
      delDialogVisible: false
    };
  },
  components: {
    Uploader
  },
  methods: {
    async getData() {
      const res = await selectOutsider({
        current: this.currentPage,
        size: this.pageSize,
        name: this.search.name
      })
      // console.log(res);
      if (res.code === '200' && res.data) {
        this.list = res.data.records;
        res.data.records && res.data.records.map((item, index) => {
          this.list[index].time = item.startTime + ' 至 ' + item.endTime
        })

        this.total = res.data.total;
        this.loading = false;
      }
    },
    searchHandle() {
      this.getData();
    },
    reSetHandle() {
      this.search.name = "";
      this.getData();
    },
    handleCurrentChange(value) {
      this.currentPage = value;
      this.getData();
    },
    lookHandle({ id }) {
      this.$router.push(`/outsiders/getOutsiderDetail/${id}`)
    },
    editHandle({ id }) {
      this.$router.push(`/outsiders/addOutsider/${id}`)
    },
    delHandle({ id }) {
      this.dialogVisible = true
      this.id = id
    },
    async doDelHandle() {
      this.dialogVisible = false
      const res = await delOutsiderById(this.id)
      console.log(res);
      if (res.code == 200) {
        this.$message({
          message: '删除成功',
          type: 'success'
        })
        this.getData()
      } else {
        this.$message({
          message: '删除失败',
          type: 'error'
        })
      }

    },
    async exportInfo() {
      try {
        const res = await exportPersonInfo();
        const blob = res.data;
        const reader = new FileReader();
        reader.readAsDataURL(blob);
        reader.onload = e => {
          const a = document.createElement("a");
          a.download = `人员信息表.xlsx`;
          // 后端设置的文件名称在res.headers的 "content-disposition": "form-data; name=\"attachment\"; filename=\"20181211191944.zip\"",
          a.href = e.target.result;
          document.body.appendChild(a);
          a.click();
          document.body.removeChild(a);
        };
      } catch (e) {
        console.error(e);
      }
    },
    async importInfo() {
      if (!this.file.url) {
        this.$message({
          message: "请选择要上传文件",
          type: "error"
        })
        return false
      }
      if (this.file.name) {
        const name = this.file.name.split('.')[1]
        if (name != 'xlsx') {
          this.$message({
            message: "上传失败,请下载人员信息表格编辑后上传",
            type: "error"
          })
          return false
        }

      }
      const urlArr = this.file.url.split('/')
      const ip = urlArr[2].split(':')[0]
      const port = urlArr[2].split(':')[1]
      const fid = urlArr[3]

      //   console.log(ip, port, fid);
      const res = await importPersonInfo({ ip, port, fid })
      console.log(res)
      if (res && res.code === '200') {
        this.dialogVisible = false
        this.file = {
          title: "",
          url: "",
          readUrl: "",
          type: "regulatory_documents",
          name: ""
        }
        this.isChange = false
        this.$message({
          message: "上传成功",
          type: "success"
        });
      } else {
        this.$message({
          message: "上传失败,请下载人员信息表格编辑后上传",
          type: "error"
        });
      }
    },
    handleClose() {
      this.dialogVisible = false
      this.file = {
        title: "",
        url: "",
        readUrl: "",
        type: "regulatory_documents",
        name: ""
      }
      this.isChange = false
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
      //   if (type == "view") {
      //     await readFile({ id: this.file.id })
      //   } else if (type = "download") {
      //     await downLoadFile({ id: this.file.id })
      //   }
      window.open(url, "_blank");
    },
  },
  mounted() {
    this.getData();
  },

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

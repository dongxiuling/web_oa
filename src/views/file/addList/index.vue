<template>
  <div class="app-container">
    <el-form ref="queryForm" :inline="true">
      <el-form-item label="法规名称">
        <el-input
          placeholder="请输入法规名称"
          v-model="search.title"
          clearable
          size="small"
        />
      </el-form-item>
      <!-- <el-form-item label="法规分类">
        <el-select v-model="search.categoryId" placeholder="请选择法规分类">
          <el-option
            v-for="item in cateData"
            :key="item.dictCode"
            :label="item.dictLabel"
            :value="item.dictCode"
          ></el-option>
        </el-select>
      </el-form-item> -->
      <!-- <el-form-item label="法规级别" prop="level">
        <el-select v-model="search.level" placeholder="请选择法规级别">
          <el-option v-for="item in levels" :key="item.id" :label="item.name" :value="item.id"></el-option>
        </el-select>
      </el-form-item> -->
      <el-form-item>
        <el-button type="primary" icon="el-icon-search" size="mini" @click="searchHandle()">搜索</el-button>
        <el-button icon="el-icon-refresh" size="mini" @click="reSetHandle()">重置</el-button>
      </el-form-item>
    </el-form>

    <!-- <el-row :gutter="10" class="mb8">
      <el-col :span="1.5">
        <el-button
          type="primary"
          icon="el-icon-plus"
          size="mini"
          @click="$router.push('/file/add')"
        >发布文件</el-button>
      </el-col>
    </el-row>-->

    <el-table :data="fileList" style="width: 100%" v-loading="loading" @row-click="openDetails">
      <!-- <el-table-column type="index" width="50" label="序号"></el-table-column> -->

      <el-table-column type="index" width="50" label="序号" :index="(currentPage-1)*pageSize+1"></el-table-column>

      <el-table-column prop="title" label="法规名称" width="240"></el-table-column>
      <el-table-column prop="createTime" label="更新时间" width="200"></el-table-column>
      <el-table-column prop="categoryName" label="法规分类"></el-table-column>
      <el-table-column prop="content" label="法规内容"></el-table-column>
      <el-table-column label="操作" width="350">
        <template slot-scope="scope">
          <el-button size="mini" type="text" icon="el-icon-view" @click.stop="detailHandle(scope.row)" >详情</el-button>
          <el-button size="mini" type="text" icon="el-icon-delete" @click.stop="delHandle(scope.row)">删除</el-button>
          <el-button size="mini" type="text" icon="el-icon-edit" @click.stop="editHandle(scope.row)">修改</el-button>
          <!-- <el-button
            size="mini"
            type="text"
            icon="el-icon-edit"
            @click.stop="afreshHandle(scope.row)"
          >再次提醒</el-button> -->
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
    <el-dialog title="重新指派" :visible.sync="outerVisible">
      <el-form label-width="100px">
        <el-form-item label="法规名称：">
          {{this.file.title}}
        </el-form-item>
        <el-form-item label="重新指派：">
          <el-input placeholder="输入关键字进行过滤" v-model="filterText" size="mini"></el-input>
          <el-tree
            :data="deptTree"
            show-checkbox
            node-key="id"
            ref="tree"
            :props="defaultProps"
            :filter-node-method="filterNode"
            @check="getCheckedNodes()"
            :default-checked-keys="file.userIds"
          ></el-tree>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="outerVisible = false">取 消</el-button>
        <el-button type="primary" @click="updateHandle()">确定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { getCategory } from "@/api/tool/category.js";
import {
  getAddList,
  deleteFile,
  getFileById,
  remindFile,
  // getResources
} from "@/api/file.js";
import { listUser, getTreeUser } from "@/api/system/user";
// import { fileSave, getFileById, updateFile } from "@/api/file";

export default {
  data() {
    return {
      search: {
        title: "",
        categoryId: 0,
        level: 0
      },
      cateData: [],
      currentPage: 1,
      pageSize: 10,
      fileList: [],
      loading: true,
      total: 0,
      // levels: [
      //   { id: 0, name: "全部事件" },
      //   { id: 1, name: "紧急事件" },
      //   { id: 2, name: "重点关注事件" },
      //   { id: 3, name: "一般事件" }
      // ],
      outerVisible: false,
      // 重新派发数据
      file: {
        title: "",
        userIds: [],
        type:128,
        id:0
      },
      defaultProps: {
        children: "children",
        label: "label",
        isLeaf: "leaf"
      },
      deptTree: [],
      filterText: '',//tree过滤
      users: [], //存放已读和未读的用户 isRead 0|1,
      // afreshData:{} //重新指派数据
    };
  },
  watch: {
      filterText(val) {
        this.$refs.tree.filter(val);
      }
    },
  methods: {
    getData() {
      getAddList({
        current: this.currentPage,
        size: this.pageSize,
        title: this.search.title,
        cateId: this.search.categoryId,
        level: this.search.level
      }).then(res => {
        this.fileList = res.data.records;
        this.total = res.data.total;
        this.loading = false;
      });
    },
    handleCurrentChange(value) {
      this.currentPage = value;
      this.getData();
    },
    detailHandle(_data){
      this.$router.push("/files/mydetail/"+_data.id);
    },
    /** 删除按钮操作 */
    delHandle(_data) {
      this.$confirm("此操作将永久删除且无法恢复, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          deleteFile({
            id: _data.id
          }).then(res => {
            this.$message({
              message: "删除成功",
              type: "success"
            });
            this.getData();
          });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除"
          });
        });
    },
    // 修改操作
    editHandle(_data) {
      this.$router.push({
        path: "/file/add",
        query: { id: _data.id }
      });
    },
    // 重新指派
    afreshHandle(_data) {
      this.outerVisible = true;
      // 查询部门树结构
      this.getDeptTreeselect();
      // 获取阅读人详情
      // this.getReadDetail(_data.id);
      // 获取法规详情
      this.getFileById(_data.id);
    },
    searchHandle() {
      this.getData();
    },
    reSetHandle() {
      this.search.title = "";
      this.search.cateId = 0;
      this.getData();
    },
    // 获取分类列表
    getCateList() {
      getCategory({
        pageNum: 1,
        pageSize: 1000,
        dictType: "file_module_status"
      }).then(res => {
        this.cateData = res.rows;
        this.cateData.unshift({ dictCode: 0, dictLabel: "全部分类" });
      });
    },
    // filter-node-method，值为过滤函数。
    filterNode(value, data) {
        if (!value) return true;
        return data.label.indexOf(value) !== -1;
    },
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
    // 获取详情
    getFileById(id) {
      getFileById({ id }).then(res => {
        // console.log(res,"获取法规详情")
        this.file.id = res.data.id;
        this.file.title = res.data.title;
        this.file.type = "regulatory_documents"; //res.data.type;
        this.file.userIds =  res.data.userIds;
      });
    },
    // 重新指派
    updateHandle() {
      console.log(this.file);
      remindFile(this.file).then(res => {
        this.$message({
          message: "修改成功",
          type: "success"
        });
        this.outerVisible = false;
        this.$router.push("/file/myfile");
      });
    },
    // 点击 查看详情
    openDetails(row) {
      this.$router.push("/files/mydetail/"+row.id);
    }
  },
  created() {
    this.getData();
    this.getCateList(); //获取分类
    this.getDeptTreeselect();
    // this.getFileById(this.id);
  }
};
</script>
<style lang="scss" scoped>
.page-box {
  text-align: right;
  margin-top: 20px;
}
</style>
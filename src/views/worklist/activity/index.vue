<template>
  <div class="app-container">
    <el-form ref="queryForm" :inline="true">
      <el-form-item label="工作名称" prop="name">
        <el-input
          v-model="search.name"
          placeholder="请输入工作名称"
          clearable
          size="small"
          style="width: 240px"
        />
      </el-form-item>
      <el-form-item>
        <el-button
          type="primary"
          icon="el-icon-search"
          size="mini"
          @click="onSearch"
          >搜索</el-button
        >
        <el-button icon="el-icon-refresh" size="mini" @click="onReset"
          >重置</el-button
        >
      </el-form-item>
    </el-form>

    <el-row :gutter="10" class="mb8">
      <el-col :span="1.5">
        <el-button
          type="primary"
          icon="el-icon-plus"
          size="mini"
          @click="$router.push('/worklists/addActivity')"
          >添加活动类工作</el-button
        >
      </el-col>
    </el-row>

    <el-table
      v-loading="loading"
      ref="multipleTable"
      :data="workList"
      tooltip-effect="dark"
      style="width: 100%"
    >
      <!-- <el-table-column type="selection" width="55"></el-table-column> -->
      <el-table-column align="center" label="序号" width="50px" type="index">
        <!-- <template slot-scope="scope">{{ scope.row.id }}</template> -->
      </el-table-column>
      <el-table-column
        align="center"
        prop="name"
        label="工作名称"
      ></el-table-column>
      <el-table-column
        align="center"
        prop="createTime"
        label="创建时间"
      ></el-table-column>
      <el-table-column
        align="center"
        prop="remark"
        label="工作内容"
      ></el-table-column>
      <el-table-column label="操作" align="center">
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="text"
            icon="el-icon-tickets"
            @click="detailHandle(scope.row)"
            >查看详情</el-button
          >
          <el-button
            size="mini"
            type="text"
            icon="el-icon-edit"
            @click="editStepHandle(scope.row)"
            >修改工作步骤</el-button
          >
          <!-- <el-button
            size="mini"
            type="text"
            icon="el-icon-edit"
            @click="editHandle(scope.row)"
            >修改</el-button
          >-->
          <el-button
            size="mini"
            type="text"
            icon="el-icon-delete"
            @click="delHandle(scope.row)"
            >删除工作</el-button
          > 
        </template>
      </el-table-column>
    </el-table>

    <!-- 删除提示 -->
    <el-dialog
      title="提示"
      :visible.sync="dialogVisible"
      width="30%"
      :before-close="
        () => {
          dialogVisible = false;
        }
      "
    >
      <span>确认删除该项工作吗？删除后无法恢复。</span>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="doDelHandle">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import {
  selectAcitvity,
  delAcitvityById
} from '@/api/worklist'

export default {
  data() {
    return {
      workList: [],
      search: {
        name: '',
      },
      dialogVisible: false,
      id: null,
      loading: false
    };
  },
  methods: {
    async selectAcitvity(data = { status: 0 }) {
      this.loading = true
      const res = await selectAcitvity(data)
      // console.log(res)
      if (res && res.code === '200') {
        const { data } = res
        this.workList = data
      }
      this.loading = false
    },
    delHandle({ id }) {
      this.dialogVisible = true
      this.id = id
    },
    async doDelHandle() {
      console.log('doDelHandle');
      // this.dialogVisible = false
      // const res = await delAcitvityById(this.id)
      // this.$message({
      //   message: '删除成功',
      //   type: 'success'
      // })
      // this.selectAcitvity()
    },
    onReset() {
      this.search = {
        name: '',
      }
      this.selectAcitvity()
    },
    onSearch() {
      this.selectAcitvity(this.search)
    },
    detailHandle({ id }) {
      this.$router.push(`/meetings/detailRoom/${id}`)
    },
    editHandle({ id }) {
      this.$router.push(`/meetings/addRoom/${id}`)
    },
    editStepHandle({ id }) {

    }
  },
  created() {
    this.selectAcitvity()
  },
};
</script>

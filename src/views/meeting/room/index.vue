<template>
  <div class="app-container">
    <el-form ref="queryForm" :inline="true">
      <el-form-item label="会场号" prop="no">
        <el-input
          v-model="search.no"
          placeholder="请输入会场号"
          clearable
          size="small"
          style="width: 240px"
        />
      </el-form-item>
      <el-form-item label="会场名称" prop="name">
        <el-input
          v-model="search.name"
          placeholder="请输入会场名称"
          clearable
          size="small"
          style="width: 240px"
        />
      </el-form-item>
      <el-form-item label="可用状态">
        <el-select v-model="search.status">
          <el-option v-for="item in statusList" :key="item.id" :label="item.name" :value="item.id"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" icon="el-icon-search" size="mini" @click="onSearch">搜索</el-button>
        <el-button icon="el-icon-refresh" size="mini" @click="onReset">重置</el-button>
      </el-form-item>
    </el-form>

    <el-row :gutter="10" class="mb8">
      <el-col :span="1.5">
        <el-button
          type="primary"
          icon="el-icon-plus"
          size="mini"
          @click="$router.push('/meetings/addRoom')"
        >添加会场</el-button>
      </el-col>
    </el-row>

    <el-table
      v-loading="loading"
      ref="multipleTable"
      :data="roomList"
      tooltip-effect="dark"
      style="width: 100%"
    >
      <!-- <el-table-column type="selection" width="55"></el-table-column> -->
      <el-table-column align="center" label="序号" width="50px" type="index">
        <!-- <template slot-scope="scope">{{ scope.row.id }}</template> -->
      </el-table-column>
      <el-table-column align="center" prop="no" label="会场号"></el-table-column>
      <el-table-column align="center" prop="name" label="会场名称"></el-table-column>
      <el-table-column align="center" prop="num" label="可容纳人数"></el-table-column>
      <el-table-column align="center" prop="status" label="可用状态">
        <template slot-scope="scope">
          <el-tag type="success" v-if="scope.row.status === 1">可用</el-tag>
          <el-tag type="danger" v-if="scope.row.status === 2">停用</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="操作" width="260" align="center">
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="text"
            icon="el-icon-tickets"
            @click="detailHandle(scope.row)"
          >查看详情</el-button>
          <el-button size="mini" type="text" icon="el-icon-edit" @click="editHandle(scope.row)">修改</el-button>
          <el-button size="mini" type="text" icon="el-icon-delete" @click="delHandle(scope.row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <!-- 删除提示 -->
    <el-dialog
      title="提示"
      :visible.sync="dialogVisible"
      width="30%"
      :before-close="() => {dialogVisible = false}"
    >
      <span>确认删除该会场吗</span>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="doDelHandle">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import {
  getRoomList,
  delRoom
} from '@/api/meeting'
export default {
  data() {
    return {
      roomList: [],
      search: {
        no: '',
        name: '',
        status: 0
      },
      statusList: [
        { id: 0, name: "全部" },
        { id: 1, name: "可用" },
        { id: 2, name: "停用" },
      ],
      dialogVisible: false,
      id: null,
      loading: false
    };
  },
  methods: {
    async getRoomList(data = { status: 0 }) {
      this.loading = true
      const res = await getRoomList(data)
      // console.log(res)
      if (res && res.code === '200') {
        const { data: { records } } = res
        this.roomList = records
      }
      this.loading = false
    },
    delHandle({ id }) {
      this.dialogVisible = true
      this.id = id
    },
    async doDelHandle() {
      this.dialogVisible = false
      const res = await delRoom(this.id)
      this.$message({
          message: '删除成功',
          type: 'success'
        })
      this.getRoomList()
    },
    onReset() {
      this.search = {
        no: '',
        name: '',
        status: 0
      }
      this.getRoomList()
    },
    onSearch() {
      // console.log(this.search);
      this.getRoomList(this.search)
    },
    detailHandle({ id }) {
      this.$router.push(`/meetings/detailRoom/${id}`)
    },
    editHandle({ id }) {
      this.$router.push(`/meetings/addRoom/${id}`)
    }
  },
  created() {
    // 类型默认选中全部
    this.search.status = this.statusList[0].id
    this.getRoomList()
  },
};
</script>

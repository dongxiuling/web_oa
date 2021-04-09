<template>
  <div class="app-container">
    <el-form ref="所属连队" :inline="true">
      <el-form-item label="所属连队">
        <el-select v-model="search.deptId" placeholder="请选择所属连队">
          <el-option
            v-for="item in deptList"
            :key="item.deptId"
            :label="item.deptName"
            :value="item.deptId"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="审批状态">
        <el-select v-model="search.status" placeholder="请选择审批状态">
          <el-option
            v-for="item in statusList"
            :key="item.id"
            :label="item.name"
            :value="item.id"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="姓名">
        <el-input
          placeholder="请输入搜索姓名"
          v-model="search.userName"
          clearable
        />
      </el-form-item>
      <el-form-item>
        <el-button
          type="primary"
          icon="el-icon-search"
          size="mini"
          @click="selectPerson()"
          >搜索</el-button
        >
        <el-button icon="el-icon-refresh" size="mini" @click="resetHandle()"
          >重置</el-button
        >
      </el-form-item>
    </el-form>
    <el-table
      ref="multipleTable"
      :data="personData"
      tooltip-effect="dark"
      style="width: 100%"
    >
      <!-- <el-table-column type="selection" width="55"></el-table-column> -->
      <el-table-column label="序号" type="index"></el-table-column>
      <el-table-column
        align="center"
        prop="userName"
        label="姓名"
      ></el-table-column>
      <el-table-column
        align="center"
        prop="deptName"
        label="所属连队"
      ></el-table-column>
      <el-table-column
        align="center"
        prop="title"
        label="请假事由"
      ></el-table-column>
      <el-table-column
        align="center"
        prop="startTime"
        label="计划离队时间"
      ></el-table-column>
      <el-table-column
        align="center"
        prop="endTime"
        label="计划离队时间"
      ></el-table-column>
      <el-table-column
        align="center"
        prop="statusStr"
        label="审批状态"
      ></el-table-column>
      <el-table-column label="操作" width="220" align="center">
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="text"
            icon="el-icon-edit"
            @click="update(scope.row)"
            v-if="scope.row.status == 1"
            >审批</el-button
          >
        </template>
      </el-table-column>
    </el-table>
    <el-dialog
      title="外出审批"
      :visible.sync="dialogVisible"
      width="40%"
      :before-close="
        () => {
          dialogVisible = false;
        }
      "
    >
      <!-- 审批 -->
      <el-form ref="approve" :model="approve" label-width="110px">
        <el-form-item label="是否通过：" prop="status">
          <el-radio v-model="approve.status" :label="2">通过</el-radio>
          <el-radio v-model="approve.status" :label="3">未通过</el-radio>
        </el-form-item>
        <el-form-item label="备注：" prop="remark">
          <el-input type="textarea" v-model="approve.remark"></el-input>
        </el-form-item>
      </el-form>

      <span slot="footer" class="dialog-footer">
        <el-button @click="cancel">取 消</el-button>
        <el-button type="primary" @click="doHandle">确 定</el-button>
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
  </div>
</template>

<script>
import { lastDept } from "@/api/system/dept";
import { selectPersonOut, updateStatus } from "@/api/insider.js";

export default {
  data() {
    return {
      personData: [],
      loading: false,
      currentPage: 0, //分页当前页
      pageSize: 10,
      total: 0, //总页数
      search: {
        userName: '',
        deptId: 0,
        status: 0
      },
      deptList: [],
      statusList: [{
        id: 0,
        name: '全部'
      }, {
        id: 1,
        name: '待审批'
      }, {
        id: 2,
        name: '已通过'
      }, {
        id: 3,
        name: '未通过'
      }, {
        id: 4,
        name: '已销假'
      }],
      dialogVisible: false,
      approve: {
        id: null,
        status: 1,
        remark: ''
      }
    };
  },
  methods: {
    async selectPerson() {
      this.loading = true;
      const res = await selectPersonOut({
        ...this.search,
        current: this.currentPage,
        size: this.pageSize,
        typeId: 0 // 全部类型
      })
      console.log(res);
      if (res && res.data && res.data.records) {
        res.data.records.map(item => {
          switch (item.status) {
            case 1:
              item.statusStr = '待审批'
              break
            case 2:
              item.statusStr = '通过'
              break
            case 3:
              item.statusStr = '未通过'
              break
            case 4:
              item.statusStr = '已销假'
              break
            default:
              item.statusStr = '待审批'
          }
        })
        this.personData = res.data.records
        this.total = res.data.total
      }
      this.loading = false;
    },
    update({ id }) {
      this.approve = {
        id: null,
        status: 1,
        remark: ''
      }
      this.dialogVisible = true
      this.approve.id = id
    },
    async getDeptList() {
      const res = await lastDept()
      if (res && res.code == 200 && res.data) {
        this.deptList = res.data
        this.deptList.unshift({ deptId: 0, deptName: "全部连队" });
      }
    },
    handleCurrentChange(value) {
      this.currentPage = value;
      this.selectPerson();
    },
    async doHandle() {
      const res = await updateStatus(this.approve)
      console.log(res);
      if (res && res.code === '200') {
        this.$message({
          message: '审批成功',
          type: 'success'
        })
        this.dialogVisible = false
        this.selectPerson()
      }
    },
    cancel() {
      this.dialogVisible = false
      this.approve = {
        id: null,
        status: 1,
        remark: ''
      }
    },
    searchHandle() {

    },
    resetHandle() {
      this.search = {
        userName: '',
        deptId: 0,
        status: 0
      }
      this.selectPerson()
    },
  },
  mounted() {
    this.getDeptList()
    this.selectPerson()
  },
};
</script>

<style lang="scss" scoped>
.page-box {
  text-align: right;
  margin-top: 20px;
}
</style>

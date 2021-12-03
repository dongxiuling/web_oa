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
      <el-form-item label="销假状态">
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
      @selection-change="handleSelectionChange"
    >
      <el-table-column type="selection" width="55"></el-table-column>
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
        label="计划归队时间"
      ></el-table-column>
      <el-table-column
        align="center"
        prop="backTime"
        label="实际归队时间"
      ></el-table-column>
      <!-- <el-table-column
        align="center"
        prop="statusStr"
        label="审批状态"
      ></el-table-column> -->
      <el-table-column label="操作" width="220" align="center">
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="text"
            icon="el-icon-edit"
            @click="update(scope.row)"
            v-if="scope.row.status == 2"
            >销假</el-button
          >
        </template>
      </el-table-column>
    </el-table>
    <div style="margin-top: 20px">
      <el-button @click="toggleSelection()" type="primary" size="mini"
        >批量销假</el-button
      >
    </div>
    <el-dialog
      title="销假记录"
      :visible.sync="dialogVisible"
      width="40%"
      :before-close="
        () => {
          dialogVisible = false;
        }
      "
    >
      <!-- 销假 -->
      <el-form ref="approve" :model="approve" label-width="150px">
        <el-form-item label="实际归队时间：" prop="backTime">
          <el-date-picker
            v-model="approve.backTime"
            value-format="yyyy-MM-dd HH:mm:ss"
            required
            type="datetime"
            placeholder="请选择实际归队时间"
          ></el-date-picker>
        </el-form-item>
      </el-form>

      <span slot="footer" class="dialog-footer">
        <el-button @click="cancel">取 消</el-button>
        <el-button type="primary" @click="doHandle">确 定</el-button>
      </span>
    </el-dialog>

    <el-dialog
      title="销假记录"
      :visible.sync="dialogVisibleAll"
      width="40%"
      :before-close="
        () => {
          dialogVisibleAll = false;
        }
      "
    >
      <el-form ref="approveAll" :model="approveAll" label-width="150px">
        <el-form-item label="实际归队时间：" prop="backTime">
          <el-date-picker
            v-model="approveAll.backTime"
            value-format="yyyy-MM-dd HH:mm:ss"
            required
            type="datetime"
            placeholder="请选择实际归队时间"
          ></el-date-picker>
        </el-form-item>
      </el-form>

      <span slot="footer" class="dialog-footer">
        <el-button @click="cancelAll">取 消</el-button>
        <el-button type="primary" @click="doHandleAll">确 定</el-button>
      </span>
    </el-dialog>
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
  </div>
</template>

<script>
import { lastDept } from "@/api/system/dept";
import { selectPersonOut, updateStatus } from "@/api/insider.js";
import { dateFormat } from "@/utils/format";

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
        status: 2, // 已通过、待销假
      },
      deptList: [],
      statusList: [{
        id: 2,
        name: '待销假'
      }, {
        id: 4,
        name: '已销假'
      }],
      dialogVisible: false,
      approve: {
        id: null,
        status: 4,
        backTime: dateFormat("YYYY-mm-dd HH:MM:SS", new Date())
      },
      rules: {
        backTime: [{ required: true, message: "请输入实际归队时间", trigger: "blur" }],
      },
      multipleSelection: [],
      dialogVisibleAll: false,
      approveAll: {
        id: null,
        status: 4,
        backTime: dateFormat("YYYY-mm-dd HH:MM:SS", new Date())
      },
    };
  },
  methods: {
    async selectPerson(status = 2) {
      this.loading = true;
      const res = await selectPersonOut({
        ...this.search,
        current: this.currentPage,
        size: this.pageSize,
        typeId: 0, // 全部类型
        // status
      })
      // console.log(res);
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
              item.statusStr = ''
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
        status: 4,
        backTime: dateFormat("YYYY-mm-dd HH:MM:SS", new Date())
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
      // console.log(res);
      if (res && res.code === '200') {
        this.$message({
          message: '销假成功',
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
        backTime: dateFormat("YYYY-mm-dd HH:MM:SS", new Date())
      }
    },
    searchHandle() {

    },
    resetHandle() {
      this.search = {
        userName: '',
        deptId: 0,
        status: 2
      }
      this.selectPerson()
    },
    toggleSelection(rows) {
      if (this.multipleSelection.length > 0) {
        this.dialogVisibleAll = true
      } else {
        this.$message({
          message: '请选择要销假的数据',
          type: 'error'
        })
      }
    },
    handleSelectionChange(val) {
      this.multipleSelection = val
    },
    cancelAll() {
      this.dialogVisibleAll = false
      this.approveAll = {
        id: null,
        status: 1,
        backTime: dateFormat("YYYY-mm-dd HH:MM:SS", new Date())
      }
    },
    doHandleAll() {
      let promiseArr = []
      this.multipleSelection.map(elem => {
        let p = new Promise((resolve, reject) => {
          updateStatus({
            id: elem.id,
            status: 4,
            backTime: this.approveAll.backTime
          }).then(res => {
            resolve(res)
          }).catch(err => {
            reject(err)
          })
        })
        promiseArr.push(p)
      })

      Promise.all(promiseArr).then(res => {
        this.$message({
          message: '批量销假成功',
          type: 'success'
        })
        this.dialogVisibleAll = false
        this.multipleSelection = []
        this.selectPerson()
      }).catch(err => {
        this.$message({
          message: '批量销假失败',
          type: 'error'
        })
      })
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

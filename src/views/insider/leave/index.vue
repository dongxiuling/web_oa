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
          v-model="search.name"
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
        <el-button icon="el-icon-refresh" size="mini" @click="reSetHandle()"
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
        prop="status"
        label="审批状态"
      ></el-table-column>
      <el-table-column label="操作" width="220" align="center">
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="text"
            icon="el-icon-edit"
            @click="update(scope.row)"
            >审批</el-button
          >
        </template>
      </el-table-column>
    </el-table>
    <!-- <div class="page-box">
        <el-pagination
          layout="total, prev, pager, next, jumper"
          :total="total"
          :current-page.sync="currentPage"
          :page-size="pageSize"
          @current-change="handleCurrentChange"
        ></el-pagination>
      </div> -->
  </div>
</template>

<script>
import { lastDept } from "@/api/system/dept";
import { selectPersonOut } from "@/api/insider.js";

export default {
  data() {
    return {
      personData: [],
      loading: false,
      currentPage: 0, //分页当前页
      pageSize: 10,
      total: 0, //总页数
      search: {
        name: '',
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
      }]
    };
  },
  methods: {
    async selectPerson() {
      this.loading = true;
      const res = await selectPersonOut({
        ...this.search,
        current: this.currentPage,
        size: this.pageSize,
      })
      console.log(res);
      if (res && res.data && res.data.records) {
        // res.data.map(item => {
        //   switch (item.jobType) {
        //     case '1':
        //       item.jobTypeName = '主官'
        //       break
        //     case '2':
        //       item.jobTypeName = '干部'
        //       break
        //     case '3':
        //       item.jobTypeName = '义务兵'
        //       break
        //     default:
        //       item.jobTypeName = '义务兵'
        //   }
        // })
        this.personData = res.data.records
      }
      this.loading = false;
    },
    update(person) {
      this.$router.push(`/out/stationApply/${person.id}`)
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
    searchHandle() {

    },
    onReset() {

    },
  },
  mounted() {
    this.getDeptList()
    this.selectPerson()
  },
};
</script>

<style lang="scss" scoped>
</style>

<template>
  <div class="app-container">
    <el-form ref="queryForm" :inline="true">
      <el-form-item label="选择周">
        <!--  <el-date-picker
          style="width: 360px"
          v-model="search.time"
          type="daterange"
          range-separator="至"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
          :picker-options="{
            firstDayOfWeek: 1,
          }"
        ></el-date-picker> -->
        <!-- format="yyyy-MM-dd年 第 WW 周" -->

        <el-date-picker
          v-model="search.time"
          type="week"
          placeholder="选择周"
          style="width: 300px"
          id="week"
          :picker-options="{
            firstDayOfWeek: 1,
          }"
          :format="startTime + ' 至 ' + endTime"
          @change="changeWeek"
        >
        </el-date-picker>
      </el-form-item>
      <el-form-item label="值班部门" prop="deptId">
        <el-select
          v-model="search.deptId"
          placeholder="请选择值班部门"
          style="width: 160px"
        >
          <el-option
            v-for="item in deptList"
            :key="item.deptId"
            :label="item.deptName"
            :value="item.deptId"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button
          type="primary"
          icon="el-icon-search"
          size="mini"
          @click="searchHandle()"
          >搜索</el-button
        >
        <!-- <el-button icon="el-icon-refresh" size="mini" @click="reSetHandle()"
          >重置</el-button
        > -->
      </el-form-item>
    </el-form>
    <el-table :data="list" style="width: 100%" v-loading="loading" border>
      <el-table-column
        v-for="(column, index) in tableColumn"
        align="center"
        :key="index.key"
        :prop="column.key"
        :label="column.val"
      ></el-table-column>

      <!-- <el-table-column
        align="center"
        type="index"
        label="序号"
        :index="(currentPage - 1) * pageSize + 1"
      ></el-table-column>
      <el-table-column
        align="center"
        prop="deptName"
        label="单位"
      ></el-table-column>
      <el-table-column
        align="center"
        prop="phone"
        label="电话"
      ></el-table-column>
      <el-table-column
        align="center"
        prop="startTime"
        label="值班时间"
      ></el-table-column>

      <el-table-column
        align="center"
        prop="username"
        label="值班人员"
      ></el-table-column>

      <el-table-column
        align="center"
        prop="remark"
        label="备注"
      ></el-table-column> -->
    </el-table>
  </div>
</template>

<script>
import { dutyStatistics, delDuty } from "@/api/duty"
import { lastDept } from "@/api/system/dept"
import { dateFormat } from "@/utils/format"

export default {
  data() {
    return {
      list: [],
      currentPage: 1,
      pageSize: 10,
      cateData: [],
      search: {
        deptId: 0,
        time: ''
      },
      loading: true,
      dialogVisible: false,
      id: null,
      deptList: [],
      personList: [],
      startTime: null,
      endTime: null,
      startTime: "",
      endTime: "",
      tableColumn: []
    };
  },
  methods: {
    async getDeptList() {
      const res = await lastDept()
      if (res && res.code == 200 && res.data) {
        this.deptList = res.data
        this.deptList.unshift({ deptId: 0, deptName: "全部部门" });
      }
    },
    getDate(datestr) {
      var temp = datestr.split("-");

      if (temp[1] === '01') {

        temp[0] = parseInt(temp[0], 10) - 1;

        temp[1] = '12';

      } else {

        temp[1] = parseInt(temp[1], 10) - 1;

      }

      //new Date()的月份入参实际都是当前值-1

      var date = new Date(temp[0], temp[1], temp[2]);

      return date;

    },
    getTableColumn() {
      var startTime = this.getDate(this.startTime);

      var endTime = this.getDate(this.endTime);

      var dateArr = [];

      while ((endTime.getTime() - startTime.getTime()) >= 0) {

        // var year = startTime.getFullYear();

        // var month = startTime.getMonth().toString().length === 1 ? "0" + (parseInt(startTime.getMonth().toString(), 10) + 1) : (startTime.getMonth() + 1);
        let week = ''

        switch (startTime.getDay()) {
          case 1:
            week = '周一'
            break;
          case 2:
            week = '周二'
            break;
          case 3:
            week = '周三'
            break;
          case 4:
            week = '周四'
            break;
          case 5:
            week = '周五'
            break;
          case 6:
            week = '周六'
            break;
          case 0:
            week = '周日'
            break;
        }

        var day = startTime.getDate().toString().length === 1 ? "0" + startTime.getDate() : startTime.getDate();


        dateArr.push({
          key: week,
          val: `${week}(${day})`
        });

        startTime.setDate(startTime.getDate() + 1);
      }
      this.tableColumn = []
      this.tableColumn.push({
        key: 'deptName',
        val: '单位'
      })
      this.tableColumn.push({
        key: 'phone',
        val: '电话号'
      })
      this.tableColumn = [...this.tableColumn, ...dateArr]
    },
    async getData() {
      const res = await dutyStatistics({
        // current: this.currentPage,
        // size: this.pageSize,
        deptId: this.search.deptId,
        startTime: this.startTime,
        endTime: this.endTime,
      })
      if (res.code === '200' && res.data) {
        const dataObj = res.data;
        let arr = []
        for (let key in dataObj) {
          let valArr = dataObj[key]

          let obj = {
            deptName: key,
            phone: dataObj[key][0].phone
          }

          valArr.map(item => {
            Object.assign(obj, {
              [item.week]: item.username
            })
          })
          arr.push(obj)
        }
        this.list = arr
        this.loading = false;
      }
    },
    searchHandle() {
      // this.endTime = dateFormat("YYYY-mm-dd HH:MM:SS", this.search.time[1])
      // this.startTime = dateFormat("YYYY-mm-dd HH:MM:SS", this.search.time[0])
      this.getTableColumn()

      this.getData();
    },
    reSetHandle() {
      const now = new Date()
      this.endTime = dateFormat("YYYY-mm-dd HH:MM:SS", now)
      this.startTime = dateFormat("YYYY-mm-dd HH:MM:SS", new Date(now - 7 * 24 * 3600 * 1000))
      this.search.time = [this.startTime, this.endTime]
      this.search.deptId = 0;
      this.getData();
    },
    handleCurrentChange(value) {
      this.currentPage = value;
      this.getData();
    },
    fun(unixtimestamp) {
      var unixtimestamp = new Date(unixtimestamp);
      var year = 1900 + unixtimestamp.getYear();
      var month = "0" + (unixtimestamp.getMonth() + 1);
      var date = "0" + unixtimestamp.getDate();
      return year + "-" + month.substring(month.length - 2, month.length) + "-" + date.substring(date.length - 2, date
        .length)
    },
    changeWeek(val) {
      let timeStamp = val.getTime(); //标准时间转为时间戳，毫秒级别
      this.startTime = this.fun(timeStamp - 24 * 60 * 60 * 1000); //开始时间
      this.endTime = this.fun(timeStamp + (24 * 60 * 60 * 1000) * 5); //结束时间
      // console.log(this.startTime, this.endTime);
    },
    getFirstDayOfWeek(date) {
      return date.getTime() - (date.getDay() || 7 - 1) * 24 * 60 * 60 * 1000
    },
    getLastDayOfWeek(date) {
      return date.getTime() + (7 - (date.getDay() || 7)) * 24 * 60 * 60 * 1000
    },
  },
  created() {
    const now = new Date()
    this.startTime = dateFormat("YYYY-mm-dd", this.getFirstDayOfWeek(now))
    this.endTime = dateFormat("YYYY-mm-dd", this.getLastDayOfWeek(now))
    this.search.time = new Date(this.startTime)

    /* this.tableColumn.push({
      key: 'deptName',
      val: '单位'
    })
    this.tableColumn.push({
      key: 'startTime',
      val: '日期'
    })
    this.tableColumn.push({
      key: 'phone',
      val: '电话号'
    })
    const dateCol = this.getTableColumn()
    this.tableColumn = [...this.tableColumn, ...dateCol] */

    this.getTableColumn()

    this.getDeptList();
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

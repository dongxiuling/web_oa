<template>
  <div>
    <el-main>
      <div class="main-content">
        <el-form
          ref="search"
          :model="search"
          label-width="120px"
          :inline="true"
        >
          <el-form-item label="时间筛选">
            <el-date-picker
              style="width: 400px"
              v-model="search.time"
              type="datetimerange"
              range-separator="至"
              start-placeholder="开始时间"
              end-placeholder="结束时间"
            ></el-date-picker>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" icon="el-icon-search" @click="handleQuery"
              >搜索</el-button
            >
            <el-button icon="el-icon-refresh" @click="resetQuery"
              >重置</el-button
            >
          </el-form-item>
        </el-form>
        <div class="main-chart">
          <div id="chart" class="chart"></div>
        </div>
      </div>
      <el-table :data="dataList" style="width: 100%" v-loading="loading">
        <el-table-column align="center" type="index" width="150" label="序号">
        </el-table-column>
        <el-table-column
          align="center"
          prop="title"
          label="名称"
        ></el-table-column>
        <el-table-column
          align="center"
          prop="cateName"
          label="类型"
        ></el-table-column>
        <el-table-column
          align="center"
          prop="createTime"
          label="创建时间"
        ></el-table-column>
        <el-table-column align="center" label="操作" width="200">
          <template slot-scope="scope">
            <el-button
              size="mini"
              type="text"
              icon="el-icon-view"
              @click.stop="showDetail(scope.row)"
              >详情</el-button
            >
          </template>
        </el-table-column>
      </el-table>
      <div class="page-box">
        <el-pagination
          layout="total, prev, pager, next, jumper"
          :total="total"
          :current-page.sync="currentPage"
          :page-size="pageSize"
          @current-change="handleCurrentChange"
        ></el-pagination>
      </div>
    </el-main>
  </div>
</template>

<script>
import echarts from "echarts"
import { dateFormat } from "@/utils/format";
import { exposureList, cateStatistics } from "@/api/exposure";

export default {
  data() {
    return {
      search: {
        time: ''
      },
      dataList: [],
      loading: false,
      currentPage: 0, //分页当前页
      pageSize: 10,
      total: 0, //总页数
      chartData: [],
      startTime: null,
      endTime: null,
    }
  },
  methods: {
    initChart() {
      const myChart = echarts.init(document.getElementById('chart'));

      const option = {
        title: {
          text: '事故通报统计',
          // subtext: '纯属虚构',
          left: 'center'
        },
        tooltip: {
          trigger: 'item'
        },
        legend: {
          orient: 'vertical',
          left: 'left',
        },
        series: [
          {
            // name: '访问来源',
            type: 'pie',
            radius: '50%',
            selectedMode: 'single',
            data: this.chartData,
            emphasis: {
              itemStyle: {
                shadowBlur: 10,
                shadowOffsetX: 0,
                shadowColor: 'rgba(0, 0, 0, 0.5)'
              }
            }
          }
        ]
      };
      myChart.setOption(option)

      myChart.on('click', async (param) => { //添加点击事件
        const res = await exposureList({
          current: this.currentPage,
          size: this.pageSize,
          type: 4,
          cateId: param.data.cateId,
          startTime: this.startTime,
          endTime: this.endTime
        })
        if (res && res.code === '200') {
          this.dataList = res.data.records
          this.total = res.data.total
        }
      });
    },
    async selectInfo() {
      this.chartData = []
      this.dataList = []
      const res = await exposureList({
        current: this.currentPage,
        size: this.pageSize,
        type: 4,
        startTime: this.startTime,
        endTime: this.endTime
      })
      if (res && res.code === '200') {
        this.dataList = res.data.records
        this.total = res.data.total
      }

      const res2 = await cateStatistics({
        startTime: dateFormat("YYYY-mm-dd HH:MM:SS", this.search.time[0]),
        endTime: dateFormat("YYYY-mm-dd HH:MM:SS", this.search.time[1]),
        type: 4,
      })
      if (res2 && res.code == 200) {
        let tempArr = []
        res2.data.map(item => {
          tempArr.push({
            name: item.cateName,
            value: item.count,
            cateId: item.cateId
          })
        })
        this.chartData = tempArr
      }
    },
    handleCurrentChange(value) {
      this.currentPage = value;
      this.selectInfo();
    },
    async handleQuery() {
      this.endTime = dateFormat("YYYY-mm-dd HH:MM:SS", this.search.time[1])
      this.startTime = dateFormat("YYYY-mm-dd HH:MM:SS", this.search.time[0])
      await this.selectInfo()
      this.initChart()
    },
    async resetQuery() {
      const now = new Date()
      this.endTime = dateFormat("YYYY-mm-dd HH:MM:SS", now)
      this.startTime = dateFormat("YYYY-mm-dd HH:MM:SS", now.setMonth((new Date().getMonth() - 1)))
      this.search.time = [this.startTime, this.endTime]
      await this.selectInfo()
      this.initChart()
    },
    showDetail(_data) {
      this.$router.push({
        path: "/accident_/detail/" + _data.id,
      });
    },
  },
  async mounted() {
    const now = new Date()
    this.endTime = dateFormat("YYYY-mm-dd HH:MM:SS", now)
    this.startTime = dateFormat("YYYY-mm-dd HH:MM:SS", now.setMonth((new Date().getMonth() - 1)))
    this.search.time = [this.startTime, this.endTime]

    await this.selectInfo()
    this.initChart()

  }
}
</script>

<style lang="scss" scoped>
.main-content {
  background: #fff;
  // padding: 20px;
  box-sizing: border-box;
  border-radius: 10px;
}

.main-chart {
  display: flex;
}

.main-chart .chart {
  flex: 1;
  height: 400px;
}

.main-list {
  margin-top: 30px;
}
</style>
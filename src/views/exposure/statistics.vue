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
          <div id="chart2" class="chart"></div>
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
        <el-table-column align="center" label="是否反馈">
          <template slot-scope="scope">
            <el-tag v-if="scope.row.count == 0">未反馈</el-tag>
            <el-tag v-else type="success">已反馈</el-tag>
          </template>
        </el-table-column>
        <el-table-column align="center" label="反馈">
          <template slot-scope="scope">
            <!-- <el-button
              size="mini"
              type="primary"
              icon="el-icon-s-flag"
              @click.stop="appealBtn(scope.row)"
              v-if="scope.row.count == 0"
              >填写反馈</el-button
            > -->
            <el-button
              type="success"
              size="mini"
              icon="el-icon-search"
              @click.stop="lookBtn(scope.row)"
              v-if="scope.row.count > 0"
              >查看反馈</el-button
            >
          </template>
        </el-table-column>
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

      <!-- 弹框 -->
      <el-dialog
        @closed="closeDialog"
        title="问题反馈"
        :visible.sync="dialogFormVisible"
      >
        <el-form ref="form" :model="appealForm">
          <el-form-item label="反馈人" label-width="120px" prop="title">
            <el-input v-model="appealForm.title" autocomplete="off"></el-input>
          </el-form-item>
          <el-form-item label="反馈内容" label-width="120px" prop="content">
            <el-input
              type="textarea"
              v-model="appealForm.content"
              autocomplete="off"
            ></el-input>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="dialogFormVisible = false">取 消</el-button>
        </div>
      </el-dialog>
    </el-main>
  </div>
</template>

<script>
import echarts from "echarts"
import { dateFormat } from "@/utils/format";
import { exposureList, cateStatistics, selectFeedBack, feedbackStatistics } from "@/api/exposure";
import { appealList } from "@/api/appeal";


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
      chartData2: [],
      startTime: null,
      endTime: null,
      cateId: 0,
      dialogFormVisible: false,
      appealForm: {},
    }
  },
  methods: {
    initChart() {
      const myChart = echarts.init(document.getElementById('chart'));

      const option = {
        title: {
          text: '分类统计',
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
        this.cateId = param.data.cateId
        await this.selectInfo()
        await this.rightChartInfo()
        this.initChart2()

        /* const res = await exposureList({
          current: this.currentPage,
          size: this.pageSize,
          type: 2,
          cateId: param.data.cateId,
          startTime: this.startTime,
          endTime: this.endTime
        })
        if (res && res.code === '200') {
          this.dataList = res.data.records
          this.total = res.data.total
        } */
      });
    },
    initChart2() {
      const myChart = echarts.init(document.getElementById('chart2'));

      const option = {
        title: {
          text: '反馈数量统计',
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
            data: this.chartData2,
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
        // console.log(param.data);
        const res = await selectFeedBack({
          isBack: param.data.isBack,
          startTime: this.startTime,
          endTime: this.endTime,
          type: 2,
          cateId: this.cateId,
          current: this.currentPage,
          size: this.pageSize,
        })
        if (res && res.code === '200') {
          this.dataList = res.data.records
          this.total = res.data.total
        }

      });
    },
    async selectInfo() {
      this.dataList = []
      const res = await exposureList({
        current: this.currentPage,
        size: this.pageSize,
        type: 2,
        startTime: this.startTime,
        endTime: this.endTime,
        cateId: this.cateId
      })
      if (res && res.code === '200') {
        this.dataList = res.data.records
        this.total = res.data.total
      }
    },
    async leftChartInfo() {
      this.chartData = []
      const res2 = await cateStatistics({
        startTime: dateFormat("YYYY-mm-dd HH:MM:SS", this.search.time[0]),
        endTime: dateFormat("YYYY-mm-dd HH:MM:SS", this.search.time[1]),
        type: 2,
      })
      //   console.log(res2);
      if (res2 && res2.code == 200) {
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
    async rightChartInfo() {
      this.chartData2 = []
      const res3 = await feedbackStatistics({
        startTime: dateFormat("YYYY-mm-dd HH:MM:SS", this.search.time[0]),
        endTime: dateFormat("YYYY-mm-dd HH:MM:SS", this.search.time[1]),
        type: 2,
        cateId: this.cateId
      })
      //   console.log(res3);
      if (res3 && res3.code == 200) {
        const d = res3.data[0]
        this.chartData2[0] = {
          name: '未反馈',
          value: d.totalCount - d.feedBackCount,
          isBack: 0
        }
        this.chartData2[1] = {
          name: '已反馈',
          value: d.feedBackCount,
          isBack: 1
        }
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
      await this.leftChartInfo()
      await this.rightChartInfo()
      this.initChart()
      this.initChart2()
    },
    async resetQuery() {
      this.cateId = 0
      const now = new Date()
      this.endTime = dateFormat("YYYY-mm-dd HH:MM:SS", now)
      this.startTime = dateFormat("YYYY-mm-dd HH:MM:SS", now.setMonth((new Date().getMonth() - 1)))
      this.search.time = [this.startTime, this.endTime]
      await this.selectInfo()
      await this.leftChartInfo()
      await this.rightChartInfo()
      this.initChart()
      this.initChart2()
    },
    showDetail(_data) {
      this.$router.push({
        path: "/accident_/detail/" + _data.id,
      });
    },
    async lookBtn(row) {
      const res = await appealList({
        current: this.currentPage,
        size: this.pageSize,
        hId: row.id
      })
      if (res && res.code == 200 && res.data.records && res.data.records[0]) {
        this.btnShow = false
        this.dialogFormVisible = true
        this.appealForm = {
          title: res.data.records[0].username,
          content: res.data.records[0].complaint,
        }
      }
    },
    closeDialog() {
      this.$refs.form.resetFields();
    },
  },
  async mounted() {
    const now = new Date()
    this.endTime = dateFormat("YYYY-mm-dd HH:MM:SS", now)
    this.startTime = dateFormat("YYYY-mm-dd HH:MM:SS", now.setMonth((new Date().getMonth() - 1)))
    this.search.time = [this.startTime, this.endTime]

    await this.selectInfo()
    await this.leftChartInfo()
    await this.rightChartInfo()
    this.initChart()
    this.initChart2()
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
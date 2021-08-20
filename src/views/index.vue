<template>
  <div class="dashboard-editor-container">
    <!-- <panel-group @handleSetLineChartData="handleSetLineChartData" /> -->
    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <span>本周工作学习计划</span>
      </div>
      <el-table :data="workplanList" style="width: 100%" v-loading="loading">
        <el-table-column align="center" label="序号" type="index">
        </el-table-column>
        <el-table-column
          align="center"
          prop="title"
          label="工作名称"
        ></el-table-column>
        <el-table-column
          align="center"
          prop="startTime"
          label="开始时间"
        ></el-table-column>
        <el-table-column
          align="center"
          prop="endTime"
          label="结束时间"
        ></el-table-column>
        <el-table-column align="center" label="操作" width="220">
          <template slot-scope="scope">
            <el-button
              size="mini"
              type="text"
              icon="el-icon-view"
              @click="workplanDetail(scope.row)"
              >详情</el-button
            >
          </template>
        </el-table-column>
      </el-table>
    </el-card>

    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <span>今日值班</span>
      </div>
      <el-table :data="dutyList" style="width: 100%" v-loading="loading">
        <el-table-column
          align="center"
          label="序号"
          type="index"
        ></el-table-column>
        <el-table-column
          align="center"
          prop="deptName"
          label="值班部门"
        ></el-table-column>
        <el-table-column
          align="center"
          prop="username"
          label="值班人员"
        ></el-table-column>
        <el-table-column
          align="center"
          prop="startTime"
          label="值班时间"
        ></el-table-column>
        <!-- <el-table-column
          align="center"
          prop="endTime"
          label="结束时间"
        ></el-table-column> -->
        <el-table-column
          align="center"
          prop="pos"
          label="值班地点"
        ></el-table-column>
        <!-- <el-table-column align="center" label="操作" width="220">
          <template slot-scope="scope">
            <el-button
              size="mini"
              type="text"
              icon="el-icon-tickets"
              @click="workplanDetail(scope.row)"
              >查看详情</el-button
            >
          </template>
        </el-table-column> -->
      </el-table>
    </el-card>

    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <span>今日来访</span>
      </div>
      <el-table :data="outsiderList" style="width: 100%" v-loading="loading">
        <el-table-column
          align="center"
          label="序号"
          type="index"
        ></el-table-column>
        <el-table-column
          align="center"
          prop="title"
          label="来访事由"
        ></el-table-column>
        <el-table-column
          align="center"
          prop="name"
          label="来访人"
        ></el-table-column>
        <el-table-column
          align="center"
          prop="company"
          label="联系人单位"
        ></el-table-column>
        <el-table-column
          align="center"
          prop="contacts"
          label="联系人"
        ></el-table-column>
        <el-table-column
          align="center"
          prop="time"
          width="180"
          label="来访时段"
        ></el-table-column>
        <!-- <el-table-column
        prop="createTime"
        width="180"
        label="创建时间"
      ></el-table-column> -->
        <el-table-column align="center" label="操作" width="220">
          <template slot-scope="scope">
            <el-button
              size="mini"
              type="text"
              icon="el-icon-view"
              @click="outSiderDetail(scope.row)"
              >详情</el-button
            >
          </template>
        </el-table-column>
      </el-table>
    </el-card>
    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <span>安全管理责任图</span>
      </div>
      <div id="safeBox"></div>
    </el-card>

    <!-- <el-row style="background: #fff; padding: 16px 16px 0; margin-bottom: 32px">
      <line-chart :chart-data="lineChartData" />
    </el-row>

    <el-row :gutter="32">
      <el-col :xs="24" :sm="24" :lg="8">
        <div class="chart-wrapper">
          <raddar-chart />
        </div>
      </el-col>
      <el-col :xs="24" :sm="24" :lg="8">
        <div class="chart-wrapper">
          <pie-chart />
        </div>
      </el-col>
      <el-col :xs="24" :sm="24" :lg="8">
        <div class="chart-wrapper">
          <bar-chart />
        </div>
      </el-col>
    </el-row> -->
    <div v-for="(item,index) in 7" :key="index">
      <indexList :type="item" />
    </div>
  </div>
</template>

<script>
import PanelGroup from './dashboard/PanelGroup'
import LineChart from './dashboard/LineChart'
import RaddarChart from './dashboard/RaddarChart'
import PieChart from './dashboard/PieChart'
import BarChart from './dashboard/BarChart'
import indexList from '@/views/components/indexList/index'
import { selectWorkplan } from "@/api/workplan"
import { getDutyList } from "@/api/duty"
import { selectOutsider } from "@/api/outsider.js";
import { dateFormat } from "@/utils/format"
import echarts from "echarts";
import { selectSafety } from "@/api/safety.js";

const lineChartData = {
  newVisitis: {
    expectedData: [100, 120, 161, 134, 105, 160, 165],
    actualData: [120, 82, 91, 154, 162, 140, 145]
  },
  messages: {
    expectedData: [200, 192, 120, 144, 160, 130, 140],
    actualData: [180, 160, 151, 106, 145, 150, 130]
  },
  purchases: {
    expectedData: [80, 100, 121, 104, 105, 90, 100],
    actualData: [120, 90, 100, 138, 142, 130, 130]
  },
  shoppings: {
    expectedData: [130, 140, 141, 142, 145, 150, 160],
    actualData: [120, 82, 91, 154, 162, 140, 130]
  }
}

export default {
  name: 'Index',
  components: {
    indexList,
    PanelGroup,
    LineChart,
    RaddarChart,
    PieChart,
    BarChart
  },
  data() {
    return {
      lineChartData: lineChartData.newVisitis,
      loading: false,
      workplanList: [],
      dutyList: [],
      outsiderList: []
    }
  },
  methods: {
    handleSetLineChartData(type) {
      this.lineChartData = lineChartData[type]
    },
    async getWorkplan() {
      const res = await selectWorkplan({
        current: 0,
        size: 999,
        startTime: dateFormat("YYYY-mm-dd HH:MM:SS", new Date()),
      })
      if (res.code === '200' && res.data) {
        this.workplanList = res.data.records;
      }
    },
    async getDutyList() {
      const res = await getDutyList({
        current: 0,
        size: 999,
        deptId: 0,
        startTime: dateFormat("YYYY-mm-dd 00:00:00", new Date()),
        endTime: dateFormat("YYYY-mm-dd 23:59:59", new Date()),
      })
      // console.log(res);
      if (res.code === '200' && res.data) {
        this.dutyList = res.data.records;
      }
    },
    async getOutsider() {
      const res = await selectOutsider({
        current: 0,
        size: 999,
        // name: this.search.name
        startTime: dateFormat("YYYY-mm-dd HH:MM:SS", new Date()),
      })
      // console.log(res);
      if (res.code === '200' && res.data) {
        this.outsiderList = res.data.records;
        res.data.records && res.data.records.map((item, index) => {
          this.outsiderList[index].time = item.startTime + ' 至 ' + item.endTime
        })
      }
    },
    workplanDetail({ id }) {
      this.$router.push(`/plans/getDetail/${id}`)
    },
    outSiderDetail({ id }) {
      this.$router.push(`/outsiders/getOutsiderDetail/${id}`)
    },
    drawSafe() {
      const myChart = echarts.init(document.getElementById("safeBox"));
      selectSafety({
        size: 100,
        current: 1,
      }).then((res) => {
        if (res.data.records.length > 0) {
          const userData = JSON.parse(res.data.records[0].url);
          const iteration = function (arr) {
            let newArr = [];
            if (arr != undefined && arr.length > 0) {
              newArr = arr.map(item => {
                item.symbolSize = [100, 30]
                item.symbol = 'rectangle'
                if (item.children != undefined && item.children.length > 0) {
                  iteration(item.children);
                }
                return item;
              });
            }
            return newArr;
          };
          const newObj = iteration(userData)
          const data = {
            name: '安全责任图',
            value: 0,
            symbolSize: [100, 30],
            symbol: 'rectangle',
            itemStyle: {
              normal: {
                borderWidth: 2,
                borderColor: '#395EFB'
              }
            },
            children: newObj
          }
          const option = {
            // title: {
            //   text: '安全责任图'
            // },
            // tooltip: {
            //   show: false,
            //   trigger: 'item',
            //   formatter: "{b}: {c}"
            // },
            toolbox: {
              show: false,
              feature: {
                mark: {
                  show: true
                },
                dataView: {
                  show: false,
                  readOnly: false
                },
                restore: {
                  show: false
                },
                saveAsImage: {
                  show: true
                }
              }
            },
            calculable: true,
            series: [{
              name: '安全责任图',
              type: 'tree',
              orient: 'vertical', // vertical horizontal
              rootLocation: {
                x: '50%',
                y: '15%'
              }, // 根节点位置  {x: 'center',y: 10}
              // nodePadding: 30,
              // layerPadding: 40,
              // symbol: 'rectangle',
              // borderColor: '#395EFB',

              itemStyle: {
                normal: {
                  color: '#395EFB', //节点背景色
                  borderWidth: 2,
                  borderColor: '#395EFB',
                  label: {
                    show: true,
                    position: 'inside',
                    textStyle: {
                      color: '#fff',
                      fontSize: 16,
                      fontWeight: 'bolder'
                    }
                  },
                  lineStyle: {
                    color: '#000',
                    width: 2,
                    type: 'solid' // 'curve'|'broken'|'solid'|'dotted'|'dashed'
                  }
                },
                emphasis: {
                  label: {
                    show: false
                  }
                }
              },
              data: [data]
            }]
          };
          myChart.setOption(option);
        }
      });
    },
  },
  async mounted() {
    this.loading = true
    this.getWorkplan()
    this.getDutyList()
    this.getOutsider()
    this.drawSafe()
    this.loading = false

  }
}
</script>

<style lang="scss" scoped>
.dashboard-editor-container {
  padding: 32px;
  background-color: rgb(240, 242, 245);
  position: relative;

  .chart-wrapper {
    background: #fff;
    padding: 16px 16px 0;
    margin-bottom: 32px;
  }
}

.box-card {
  margin-bottom: 20px;
}

@media (max-width: 1024px) {
  .chart-wrapper {
    padding: 8px;
  }
}
#safeBox {
  min-height: 300px;
}
</style>

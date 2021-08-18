<template>
  <div>
    <el-main>
      <div class="main-content">
        <div>
          <!-- <el-form
          ref="search"
          :model="search"
          label-width="120px"
          :inline="true"
        >
          <el-form-item label="连队筛选" prop="deptId">
            <el-select
              v-model="search.deptId"
              placeholder="请选择所属连队"
              style="width: 300px"
            >
              <el-option
                v-for="item in deptList"
                :key="item.deptId"
                :label="item.deptName"
                :value="item.deptId"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="时间筛选">
            <el-date-picker
              v-model="search.startTime"
              type="datetime"
              placeholder="选择日期时间"
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
        </el-form> -->
          <el-button type="primary" @click="$router.go(-1)">返回</el-button>
          <div id="main"></div>
        </div>
        <div class="main-list">
          <!-- <h4 style="margin-bottom: 5px">不在岗人员列表</h4> -->
          <el-table
            ref="multipleTable"
            :data="tableData"
            tooltip-effect="dark"
            style="width: 100%"
          >
            <el-table-column
              align="center"
              label="排名"
              type="index"
            ></el-table-column>
            <el-table-column
              align="center"
              prop="deptName"
              label="单位"
            ></el-table-column>
            <el-table-column
              align="center"
              prop="total"
              label="分数"
            ></el-table-column>

            <el-table-column label="操作" width="220" align="center">
              <template slot-scope="scope">
                <el-button
                  size="mini"
                  type="text"
                  icon="el-icon-edit"
                  @click="goDetail(scope.row)"
                  >分数详情</el-button
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
      </div>
    </el-main>
  </div>
</template>

<script>
import { selectTotal } from "@/api/evaluation"
import echarts from "echarts";


export default {
  data() {
    return {
      id: this.$route.params.id,
      title: this.$route.params.name,
      tableData: [],
      xData: [],
      yData: [],
    };
  },
  methods: {
    async getData() {
      const res = await selectTotal({
        id: this.id
      })
      if (res && res.code == 200 && res.data) {
        this.tableData = res.data
        res.data.map(item => {
          this.xData.push(item.deptName)
          this.yData.push(item.total)
        })
      }
    },
    initCharts() {
      var myChart = echarts.init(document.getElementById("main"));

      var option = {
        title: {
          text: this.title + '量化评比综合情况',
          x: 'center',
          y: 'top',
          textStyle: {
            color: '#333333',
            fontWeight: 'bolder',
            fontSize: 24
          }
        },
        color: ["#3398DB"],
        tooltip: {
          trigger: "axis",
          axisPointer: {
            // 坐标轴指示器，坐标轴触发有效
            type: "none" // 默认为直线，可选为：'line' | 'shadow'
          }
        },
        grid: {
          left: "3%",
          right: "4%",
          bottom: "3%",
          containLabel: true
        },
        xAxis: [
          {
            type: "category",
            // deptsData
            data: this.xData,
            axisTick: {
              alignWithLabel: true
            }
          }
        ],
        yAxis: [
          {
            type: "value",
            nameGap: 15, // 坐标轴名称与轴线之间的距离
            nameTextStyle: {
              // 坐标轴名称样式
              color: "#fff",
              padding: [5, 0, 0, 5] // 坐标轴名称相对位置
            }
          }
        ],
        series: [
          {
            name: "分数",
            type: "bar",
            legendHoverLink: true, // 是否启用图列 hover 时的联动高亮
            barWidth: "60%",
            // numData
            data: this.yData,
            barWidth: 25, // 柱形的宽度
            barCategoryGap: "5%", // 柱形的间距
            itemStyle: {
              normal: {
                color: "#f00"
              },
              emphasis: {
                color: "#eee114"
              }
            }
          }
        ]
      };
      myChart.setOption(option);
    },
    goDetail(row) {
      console.log(this.id, row.deptId);
      this.$router.push(`/evaluations/selectTotalDetail/${this.id}/${row.deptId}`)
    }
  },
  async mounted() {
    await this.getData()
    this.initCharts();
  }
}
</script>

<style lang="scss" scoped>
#main {
  width: 1000px;
  height: 280px;
  margin: 30px auto;
}
.main-content {
  background: #fff;
  min-height: calc(100vh - 210px);
  padding: 20px;
  box-sizing: border-box;
}
</style>
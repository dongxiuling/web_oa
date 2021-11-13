<template>
  <div class="app-container">
    <el-button
      class="filter-item"
      type="primary"
      icon="el-icon-back"
      size="mini"
      @click="$router.go(-1)"
      >返回</el-button
    >
    <div id="safeBox"></div>
  </div>
</template>

<script>
import echarts from "echarts";
import { getSafetyById } from "@/api/safety.js";

export default {
  data() {
    return {
      id: this.$route.params.id
    };
  },
  methods: {
    drawSafe() {
      const myChart = echarts.init(document.getElementById("safeBox"));
      getSafetyById(this.id).then((res) => {
        if (res.code == 200 && res.data) {
          const userData = JSON.parse(res.data.url);
          const iteration = function (arr) {
            let newArr = [];
            if (arr != undefined && arr.length > 0) {
              newArr = arr.map(item => {
                item.symbolSize = [60, 30]
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
            symbolSize: [90, 30],
            symbol: 'rectangle',
            itemStyle: {
              normal: {
                borderWidth: 2,
                borderColor: '#1890ff'
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
              edgeShape: 'polyline',
              rootLocation: {
                x: '50%',
                y: '15%'
              },
              itemStyle: {
                normal: {
                  color: '#1890ff', //节点背景色
                  borderWidth: 2,
                  borderColor: '#1890ff',
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
              initialTreeDepth: 10,
              data: [data]
            }]
          };
          myChart.setOption(option);
        }
      });
    },
  },
  mounted() {
    this.id = this.$route.params.id

    this.drawSafe();
  }
};
</script>
<style lang="scss" scoped>
.page-box {
  text-align: right;
  margin-top: 20px;
}
#safeBox {
  min-height: 500px;
}
</style>
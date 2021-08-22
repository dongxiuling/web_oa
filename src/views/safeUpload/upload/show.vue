<template>
  <div class="app-container">
    <div id="safeBox"></div>
  </div>
</template>

<script>
import echarts from "echarts";
import { selectSafety } from "@/api/safety.js";

export default {
  data() {
    return {

    };
  },
  methods: {
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
                item.symbolSize = [200, 50]
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
            symbolSize: [200, 50],
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
              rootLocation: {
                x: '50%',
                y: '15%'
              }, // 根节点位置  {x: 'center',y: 10}
              // nodePadding: 30,
              // layerPadding: 40,
              // symbol: 'rectangle',
              // borderColor: '#1890ff',

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
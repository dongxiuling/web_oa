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
      var myChart = echarts.init(document.getElementById("safeBox"));
      selectSafety({
        size: 100,
        current: 1,
      }).then((res) => {
        if (res.data.records.length > 0) {
         var userData = JSON.parse(res.data.records[0].url);
          var data = {
            name:'安全责任图',
            id:0,
            children:userData
          }
          var option = {
            series: [
              {
                type: "tree",
                id: 0,
                name: "tree1",
                data: [data],

                top: "10%",
                left: "8%",
                bottom: "22%",
                right: "20%",

                // symbolSize: 7,
                // symbol: 'none',

                orient: 'vertical',

                // edgeShape: "polyline",
                // edgeForkPosition: "63%",
                // initialTreeDepth: 3,

                // lineStyle: {
                //   width: 2,
                // },

                label: {
                  // backgroundColor: "#fff",
                  // position: "left",
                  // verticalAlign: "middle",
                  // align: "right",
                  position: 'top',
                  verticalAlign: 'middle',
                  align: 'center',
                  fontSize: 16
                },

                leaves: {
                  label: {
                    // position: "right",
                    // verticalAlign: "middle",
                    // align: "left",
                    position: 'bottom',
                    verticalAlign: 'middle',
                    align: 'center'
                  },
                },

                emphasis: {
                  focus: "descendant",
                },

                expandAndCollapse: true,
                animationDuration: 550,
                animationDurationUpdate: 750,
              },
            ],
          };
          // console.log(111);

          myChart.setOption(option);
          // console.log(222);
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
  height: 300px;
}
</style>
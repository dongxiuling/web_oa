<template>
  <div class="app-container">
    <el-tabs type="border-card" style="width: 1080px">
      <el-tab-pane
        :label="item.deptName"
        v-for="(item, index) in this.detail"
        :key="index"
      >
        <div style="margin-bottom: 10px">普通检查项</div>
        <el-table
          v-if="common && common[index]"
          :data="common[index].values"
          fit
          stripe
          style="width: 100%"
          v-loading="loading"
        >
          >
          <el-table-column
            v-for="(item, columnsIndex) in common[index].columns"
            :key="columnsIndex"
            :prop="item.enName"
            :label="item.cnName"
            align="center"
          >
          </el-table-column>
          <el-table-column
            label="状态"
            width="180"
            align="center"
            fixed="right"
          >
            <template slot-scope="scope">
              <!-- v-model="commonScore[(index* common[index].values.length + scope.$index)].status" -->
              <!-- :active-text="
                  '合格' + common[index].commonScore[scope.$index].status
                " -->
              <el-switch
                v-model="common[index].commonScore[scope.$index].status"
                active-text="合格"
                inactive-text="不合格"
              >
              </el-switch>
            </template>
          </el-table-column>
          <el-table-column
            label="备注"
            width="220"
            align="center"
            fixed="right"
          >
            <template slot-scope="scope">
              <!-- v-model="commonScore[(index* common[index].values.length + scope.$index)].remark" -->
              <el-input
                v-model="common[index].commonScore[scope.$index].remark"
              ></el-input>
            </template>
          </el-table-column>
        </el-table>

        <div style="margin: 10px 0">特殊检查项</div>

        <div v-if="special && special[index] && special[index].length > 0">
          <el-table
            v-for="(spec, specIndex) in special[index]"
            :key="specIndex"
            :data="spec.values"
            fit
            stripe
            style="width: 100%; margin-bottom: 10px"
            v-loading="loading"
          >
            <el-table-column
              v-for="(item, columnsIndex) in spec.columns"
              :key="columnsIndex"
              :prop="item.enName"
              :label="item.cnName"
              align="center"
            >
            </el-table-column>
            <el-table-column label="状态" width="180" align="center">
              <template slot-scope="scope">
                <!-- :active-text="'合格'+ spec.specialScore[scope.$index].status" -->
                <el-switch
                  v-model="spec.specialScore[scope.$index].status"
                  active-text="合格"
                  inactive-text="不合格"
                >
                </el-switch>
              </template>
            </el-table-column>
            <el-table-column label="备注" width="220" align="center">
              <template slot-scope="scope">
                <el-input
                  v-model="spec.specialScore[scope.$index].remark"
                ></el-input>
              </template>
            </el-table-column>
          </el-table>
        </div>
        <div v-else style="margin: 10px 0">无</div>
        <el-button
          type="primary"
          @click="submitResult(item, common[index], special[index])"
          >提交该连队结果</el-button
        >
        <el-button @click="$router.go(-1)">返回上个页面</el-button>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
import {
  queryScore,
  makeScore
} from '@/api/worklist'
export default {
  data() {
    return {
      id: '',
      loading: false,
      detail: [],
      common: [],
      special: []
    }
  },
  methods: {
    async queryScoreHandler() {
      this.loading = true
      this.common = []
      this.special = []
      const res = await queryScore({ specialWorkId: this.id })
      if (res && res.code === '200') {
        this.detail = res.data
        res.data.forEach((item, index) => {
          const { columns: commonColumns, values: commonValues } = JSON.parse(item.commonJson)
          const commonScore = []
          commonValues.forEach((cv, index) => {
            // 如果已经打过分，直接读取
            if (item.commonScores && item.commonScores.length > 0) {
              commonScore.push({
                status: item.commonScores[index].colStatusValue == '合格' ? true : false,
                remark: item.commonScores[index].colRemarkValue
              })
            } else {
              commonScore.push({
                status: true,
                remark: ''
              })
            }
          })
          this.common.push({
            columns: commonColumns,
            values: commonValues,
            commonScore
          })
          // console.log(163);
          // console.log(this.common);

          const { specialFiles } = item
          const s = []
          specialFiles.forEach(sf => {
            const { columns: specialColumns, values: specialValues } = JSON.parse(sf.specialJson)
            const specialScore = []
            // console.log(167);
            // console.log(sf);
            specialValues.forEach((sv, index) => {
              if (sf.scores && sf.scores.length > 0) {
                // console.log(170);
                // console.log(sf.scores[index]);
                specialScore.push({
                  status: sf.scores[index].colStatusValue == '合格' ? true : false,
                  remark: sf.scores[index].colRemarkValue
                })
              } else {
                specialScore.push({
                  status: true,
                  remark: ''
                })
              }
            })
            s.push({
              columns: specialColumns,
              values: specialValues,
              specialScore
            })
          })
          this.special.push(s)
        })
        console.log(this.detail);
        // console.log(this.special);
      }
      this.loading = false
    },
    async submitResult(item, common, special) {
      // console.log(item);
      // console.log(common);
      // console.log(special);
      // console.log(196);
      // console.log(common.commonScore);
      item.commonScores = []
      common.commonScore.forEach((cs, index) => {
        item.commonScores.push({
          colRemarkValue: cs.remark,
          colStatusValue: cs.status ? '合格' : '不合格',
          rowNo: index
        })
      })

      special.forEach((spec, index) => { // 0 1
        // console.log(190);
        // console.log(spec, index);

        if (item.specialFiles[index].scores === null) {
          item.specialFiles[index].scores = new Array()
        }

        item.specialFiles[index].scores = []

        spec.specialScore.forEach((s, sIndex) => { // 0 1 2 3
          // console.log(213);
          // console.log(item.specialFiles[index], sIndex);
          item.specialFiles[index].scores.push({
            colRemarkValue: s.remark,
            colStatusValue: s.status ? '合格' : '不合格',
            rowNo: sIndex
          })
        })

      })
      // console.log(192);
      // console.log(item);

      const res = await makeScore(item)
      // console.log(204);
      // console.log(res);
      if (res && res.code === '200') {
        this.$message({
          message: "该连队提交成功",
          type: "success"
        });
      }

    }
  },
  async mounted() {
    this.id = this.$route.params.id
    this.queryScoreHandler()
  }
}
</script>

<style>
</style>
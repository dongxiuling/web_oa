<template>
  <div class="app-container" v-if="worklist">
    <el-form ref="worklist" :model="worklist" label-width="120px">
      <el-form-item label="工作步骤" prop="steps">
        <el-steps style="width: 600px" id="step-container">
          <el-step
            v-for="(item, index) in worklist.steps"
            :title="item.stepName"
            :key="index"
            status="finish"
            :description="item.finishTime"
          ></el-step>
        </el-steps>
      </el-form-item>
      <el-form-item label="创建时间" prop="createTime">
        <el-input
          v-model="worklist.createTime"
          style="width: 600px"
          :disabled="true"
        ></el-input>
      </el-form-item>
      <el-form-item label="工作名称" prop="name">
        <el-input
          v-model="worklist.name"
          style="width: 600px"
          :disabled="true"
        ></el-input>
      </el-form-item>
      <el-form-item label="工作说明" prop="remark">
        <el-input
          type="textarea"
          :autosize="{ minRows: 2, maxRows: 8 }"
          :disabled="true"
          v-model="worklist.remark"
          style="width: 600px"
        ></el-input>
      </el-form-item>

      <el-form-item label="工作检查项" prop="content">
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
                    disabled
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
                    disabled
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
                      disabled
                    >
                    </el-switch>
                  </template>
                </el-table-column>
                <el-table-column label="备注" width="220" align="center">
                  <template slot-scope="scope">
                    <el-input
                      v-model="spec.specialScore[scope.$index].remark"
                      disabled
                    ></el-input>
                  </template>
                </el-table-column>
              </el-table>
            </div>
            <div v-else style="margin: 10px 0">无</div>
          </el-tab-pane>
        </el-tabs>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="$router.go(-1)">返回</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import {
  getInspectById,
  queryScore
} from '@/api/worklist'
export default {
  data() {
    return {
      id: null,
      worklist: {},
      commonTableData: [],
      commonColumns: [],
      loading: false,
      detail: [],
      common: [],
      special: []
    }
  },
  methods: {
    async queryScoreHandler() {
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

          const { specialFiles } = item
          const s = []
          specialFiles.forEach(sf => {
            const { columns: specialColumns, values: specialValues } = JSON.parse(sf.specialJson)
            const specialScore = []
            specialValues.forEach((sv, index) => {
              if (sf.scores && sf.scores.length > 0) {
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
        // console.log(this.detail);
      }
    },
  },
  async mounted() {
    this.loading = true
    this.id = this.$route.params.id
    if (this.id) {
      const res = await getInspectById(this.id)
      if (res && res.code === '200') {
        this.worklist = res.data
      }
      await this.queryScoreHandler()
    } else {
      this.$message({
        message: "读取失败",
        type: "error"
      });
    }

    this.loading = false
  }
}
</script>

<style>
</style>
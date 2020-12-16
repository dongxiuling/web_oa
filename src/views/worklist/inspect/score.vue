<template>
  <div class="app-container">
    <el-tabs type="border-card" style="width: 920px">
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
          <el-table-column
            v-for="(item, columnsIndex) in common[index].columns"
            :key="columnsIndex"
            :prop="item.enName"
            :label="item.cnName"
          >
          </el-table-column>
          <el-table-column label="状态" width="180" align="center">
            <template slot-scope="scope">
              <el-switch
                v-model="status"
                active-text="合格"
                inactive-text="不合格"
              >
              </el-switch>
            </template>
          </el-table-column>
          <el-table-column label="备注" width="180" align="center">
            <template slot-scope="scope">
              <el-input></el-input>
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
            >
            </el-table-column>
            <el-table-column label="状态" width="180" align="center">
              <template slot-scope="scope">
                <el-switch
                  v-model="status"
                  active-text="合格"
                  inactive-text="不合格"
                >
                </el-switch>
              </template>
            </el-table-column>
            <el-table-column label="备注" width="180" align="center">
              <template slot-scope="scope">
                <el-input></el-input>
              </template>
            </el-table-column>
          </el-table>
        </div>
        <div v-else style="margin: 10px 0;">无</div>

        <el-button type="primary" @click="submitResult()"
          >提交该连队结果</el-button
        >
        <el-button @click="$router.go(-1)">返回上个页面</el-button>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
import {
  queryScore
} from '@/api/worklist'
export default {
  data() {
    return {
      id: '',
      loading: false,
      detail: [],
      common: [],
      special: [],
      status: true
    }
  },
  methods: {
    async queryScoreHandler() {
      this.loading = true
      const res = await queryScore({ specialWorkId: this.id })
      console.log(res);
      if (res && res.code === '200') {
        this.detail = res.data
        res.data.forEach(item => {
          const { columns: commonColumns, values: commonValues } = JSON.parse(item.commonJson)
          this.common.push({
            columns: commonColumns,
            values: commonValues
          })
          const { specialFiles } = item
          const s = []
          specialFiles.forEach(item => {
            const { columns: specialColumns, values: specialValues } = JSON.parse(item.specialJson)
            s.push({
              columns: specialColumns,
              values: specialValues
            })
          })
          this.special.push(s)
        })
        console.log(this.special);
      }
      this.loading = false
    },
    submitResult() {

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
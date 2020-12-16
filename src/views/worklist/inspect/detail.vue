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
        <el-tabs type="border-card" style="width: 920px">
          <el-tab-pane label="普通检查项">
            <!-- 文件预览 -->
            <el-table
              :data="commonTableData"
              fit
              stripe
              style="width: 100%"
              v-loading="loading"
            >
              <el-table-column
                v-for="(item, index) in commonColumns"
                :key="index"
                :prop="item.enName"
                :label="item.cnName"
              >
              </el-table-column>
            </el-table>
          </el-tab-pane>
          <!-- <el-tab-pane label="特殊检查项">
            <el-card
              v-for="(item, index) in specialArr"
              :key="index"
              class="special-card"
            >
              <el-table
                :data="specialTable[index].specialTableData"
                fit
                stripe
                style="width: 100%"
              >
                <el-table-column
                  v-for="(sItem, sIndex) in specialTable[index].specialColumns"
                  :key="sIndex"
                  :prop="sItem.enName"
                  :label="sItem.cnName"
                >
                </el-table-column>
              </el-table>
              <el-tree
                :data="deptTree"
                show-checkbox
                node-key="id"
                :ref="'tree' + index"
                :props="defaultProps"
                @check="getCheckedNodes(index)"
                :default-checked-keys="specialUserIdsArr[index]"
                :filter-node-method="filterNode"
              ></el-tree>
            </el-card>
          </el-tab-pane> -->
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
  getInspectById
} from '@/api/worklist'
export default {
  data() {
    return {
      worklist: {},
      commonTableData: [],
      commonColumns: [],
      loading: false
    }
  },
  async mounted() {
    this.loading = true
    const id = this.$route.params.id
    const res = await getInspectById(id)
    if (res && res.code === '200') {
      this.worklist = res.data
      // 普通检查项
      if (res.data && res.data.commonJson) {
        const { values, columns } = JSON.parse(res.data.commonJson)
        this.commonTableData = values
        this.commonColumns = columns
      }


      // 特殊检查项
      if (res.data && res.data.specialFiles && res.data.specialFiles.length) {

      }


      this.loading = false
    }
    console.log(res);
  }
}
</script>

<style>
</style>
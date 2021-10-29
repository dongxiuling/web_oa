<template>
  <div class="app-container">
    <el-form
      ref="activity"
      :model="activity"
      :rules="rules"
      label-width="120px"
    >
      <el-form-item label="活动名称:" prop="title">
        <div>{{ activity.title }}</div>
      </el-form-item>
      <el-form-item label="活动分类:" prop="cateId">
        <div>{{ activity.type }}</div>
      </el-form-item>
      <el-form-item label="活动时间:" prop="time">
        <div>{{ activity.time }}</div>
      </el-form-item>

      <el-form-item label="活动内容:" prop="content">
        <div>{{ activity.content }}</div>
      </el-form-item>
      <el-form-item label="备注:" prop="remark">
        <div>{{ activity.remark }}</div>
      </el-form-item>

      <el-table :data="personList" style="width: 100%">
        <el-table-column
          align="center"
          type="index"
          label="序号"
        ></el-table-column>
        <el-table-column
          align="center"
          prop="name"
          label="姓名"
        ></el-table-column>
        <el-table-column
          align="center"
          prop="deptName"
          label="所属连队"
        ></el-table-column>
        <!-- <el-table-column
          align="center"
          prop="idCard"
          width="180"
          label="身份证号码"
        ></el-table-column>
        <el-table-column
          align="center"
          prop="jobName"
          label="部职别"
        ></el-table-column>
        <el-table-column
          align="center"
          prop="jobTypeName"
          label="身份"
        ></el-table-column>
        <el-table-column
          align="center"
          prop="remark1"
          label="军衔"
        ></el-table-column> -->
        <el-table-column align="center" label="成绩录入" width="300">
          <template slot-scope="scope">
            <!-- <el-button
            size="mini"
            type="text"
            icon="el-icon-tickets"
            @click="lookHandle(scope.row)"
            >详情</el-button
          > -->
            <div v-if="activity.typeId == 1">
              <el-form :inline="true">
                <el-row type="flex" class="row" justify="space-between">
                  <el-col :span="12">
                    <el-form-item>
                      <el-input
                        placeholder="分钟数"
                        v-model="personList[scope.$index].minute"
                        type="number"
                      >
                        <template slot="append">分</template>
                      </el-input>
                    </el-form-item>
                  </el-col>
                  <el-col :span="12">
                    <el-form-item>
                      <el-input
                        placeholder="秒数"
                        v-model="personList[scope.$index].second"
                        type="number"
                      >
                        <template slot="append">秒</template>
                      </el-input>
                    </el-form-item>
                  </el-col>
                </el-row>
              </el-form>
            </div>
            <div v-else-if="activity.typeId == 2">
              <el-input
                placeholder="请输入个数"
                v-model="personList[scope.$index].count"
                type="number"
              >
                <template slot="append">个</template>
              </el-input>
            </div>
          </template>
        </el-table-column>
      </el-table>

      <el-form-item class="toolbar">
        <el-button type="primary" @click="updateHandle('activity')"
          >保存成绩</el-button
        >
        <el-button @click="resetForm('activity')">取消</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import { selectCate, saveActivity, getActivityById, selectDeptScore, selectPersonByDept, saveScore } from "@/api/activity.js";
import { selectPerson } from "@/api/insider.js";
import { lastDept } from "@/api/system/dept";
import { dateFormat } from "@/utils/format"

export default {
  data() {
    return {
      cateData: [],
      id: this.$route.params.id,
      activity: {
        cateId: '',
        title: '',
        content: '',
        time: ''
      },
      personList: [],
      rules: {
        title: [{ required: true, message: "请输入活动名称", trigger: "blur" }],
        cateId: [
          { required: true, message: "请选择活动分类", trigger: "change" }
        ],
        content: [{ required: true, message: "请输入活动内容", trigger: "blur" }],
        time: [{ required: true, message: "请输入活动时间", trigger: "blur" }],
      },
      activityArr: [],
      isUpdate: false
    };
  },
  methods: {
    submitForm(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          this.addHandle();
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
    resetForm(formName) {
      this.$router.go(-1)
    },
    async addHandle() {
      let startTime = null
      let endTime = null
      if (this.activity.time) {
        startTime = dateFormat("YYYY-mm-dd HH:MM:SS", this.activity.time[0])
        endTime = dateFormat("YYYY-mm-dd HH:MM:SS", this.activity.time[1])
      }
      this.activity.startTime = startTime
      this.activity.endTime = endTime
      delete this.activity.time

      const res = await saveActivity(this.activity);
      if (res.code === '200') {
        this.$message({
          message: "添加成功",
          type: "success"
        });
        this.$router.push("/dragontiger/dragontigerList");
      }
    },
    async updateHandle() {
      const res = await saveScore(this.personList)
      if (res && res.code === '200') {
        this.$message({
          message: '保存成功',
          type: 'success'
        })
        this.$router.go(-1)
      } else {
        this.$message({
          message: '保存失败',
          type: 'error'
        })
        console.error(res)
      }
    },
    getFileById(id) {
      getFileById({ id }).then(res => {
        this.file = res.data;
      });
    },
    async selectCate() {
      const res = await selectCate()
      // console.log(res);
      if (res.code == 200) {
        this.cateData = res.data.records
      }
    },
    async getPersonList() {
      const res = await selectPersonByDept()
      const deptRes = await lastDept()
      console.log(res);
      if (res.code === '200' && res.data) {
        res.data.map(item => {
          switch (item.jobType) {
            case '1':
              item.jobTypeName = '主官'
              break
            case '2':
              item.jobTypeName = '干部'
              break
            case '3':
              item.jobTypeName = '义务兵'
              break
            default:
              item.jobTypeName = '义务兵'
          }
          deptRes.data.map(dept => {
            if (dept.deptId == item.deptId) {
              item.deptName = dept.deptName
            }
          })
          item.activityId = this.$route.params.id
          item.personId = item.id
          item.minute = 0
          item.second = 0
          item.count = 0
          item.url = ''
          if (!this.isUpdate) {
            delete item.id
          }
        })
        this.personList = res.data
        console.log(250);
        console.log(this.personList);
      }
    },
  },
  async mounted() {
    await this.selectCate()

    const { id, typeId } = this.$route.params
    if (id) { // 修改
      const res = await getActivityById(id)
      if (res && res.code === '200') {
        this.cateData.map(item => {
          if (res.data.cateId == item.id) {
            res.data.type = item.cateName
          }
        })
        res.data.time = res.data.startTime + ' 至 ' + res.data.endTime
        this.activity = res.data
      }

      const deptScore = await selectDeptScore({
        activityId: id,
        typeId: typeId
      })
      console.log(272);
      console.log(deptScore);
      if (deptScore.code === '200' && deptScore.data && deptScore.data.records && deptScore.data.records.length > 0) {
        this.isUpdate = true
        deptScore.data.records.map(elem => {
          if (elem.count) {
            elem.result = elem.count
          } else {
            elem.result = elem.minute + '分' + elem.second + '秒'
          }
        })
        this.personList = deptScore.data.records;
        this.total = deptScore.data.total;
        this.loading = false;
      } else {
        this.isUpdate = false
        this.getPersonList()
      }
    }
  }
};
</script>
<style scoped>
.row {
  align-items: center;
}
.toolbar {
  padding: 10px 10px 0 0;
  text-align: right;
}
</style>
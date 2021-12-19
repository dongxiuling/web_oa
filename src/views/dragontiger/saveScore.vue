<template>
  <el-main>
    <div class="main-content">
      <div class="app-container">
        <el-form
          ref="activity"
          :model="activity"
          :rules="rules"
          label-width="120px"
        >
          <el-card class="box-card">
            <el-form-item label="活动名称:" prop="title">
              <div>{{ activity.title }}</div>
            </el-form-item>
            <!-- <el-form-item label="活动分类:" prop="cateId">
              <div>{{ activity.type }}</div>
            </el-form-item> -->
            <el-form-item label="活动时间:" prop="time">
              <div>{{ activity.time }}</div>
            </el-form-item>

            <el-form-item label="活动内容:" prop="content">
              <div>{{ activity.content }}</div>
            </el-form-item>
            <el-form-item label="备注:" prop="remark">
              <div>{{ activity.remark }}</div>
            </el-form-item>
          </el-card>
        </el-form>

        <el-table
          :data="personList"
          style="width: 100%"
          :row-style="{ height: '60px' }"
          border
        >
          <el-table-column
            align="center"
            type="index"
            label="序号"
          ></el-table-column>
          <el-table-column
            align="center"
            prop="name"
            label="姓名"
            width="80"
          ></el-table-column>
          <el-table-column
            align="center"
            prop="age"
            label="年龄"
            width="60"
          ></el-table-column>
           <el-table-column
            align="center"
            prop="height"
            label="身高(m)"
            width="70"
          ></el-table-column>
           <el-table-column
            align="center"
            prop="weight"
            label="体重(kg)"
            width="76"
          ></el-table-column>
          <el-table-column
            align="center"
            prop="bmi"
            label="BMI"
            width="60"
          ></el-table-column>
          <el-table-column
            align="center"
            prop="deptName"
            label="所属连队"
          ></el-table-column>

          <el-table-column align="center" label="是否参加" width="160">
            <template slot-scope="scope">
              <el-switch
                v-model="personList[scope.$index].type"
                active-text="参加"
                inactive-text="不参加"
                :active-value="0"
                :inactive-value="1"
                @change="
                  handleSwitchChange(
                    personList[scope.$index],
                    personList[scope.$index].type
                  )
                "
              >
              </el-switch>
            </template>
          </el-table-column>

          <el-table-column
            align="center"
            label="引体向上（女单杠曲臂悬垂）/ 俯卧撑"
            width="160"
          >
            <template slot-scope="scope">
              <div
                v-if="
                  personList[scope.$index] &&
                  personList[scope.$index].resultShow
                "
              >
                <el-input
                  size="small"
                  v-model="personList[scope.$index].item1"
                  type="number"
                >
                  <template slot="append">个</template>
                </el-input>
              </div>
            </template>
          </el-table-column>
          <el-table-column align="center" label="仰卧起坐" width="160">
            <template slot-scope="scope">
              <div
                v-if="
                  personList[scope.$index] &&
                  personList[scope.$index].resultShow
                "
              >
                <el-input
                  size="small"
                  v-model="personList[scope.$index].item2"
                  type="number"
                >
                  <template slot="append">个</template>
                </el-input>
              </div>
            </template>
          </el-table-column>
          <el-table-column align="center" label="30米×2蛇形跑" width="300">
            <template slot-scope="scope">
              <div
                v-if="
                  personList[scope.$index] &&
                  personList[scope.$index].resultShow
                "
              >
                <el-form :inline="true">
                  <el-row>
                    <el-col :span="12">
                      <el-form-item class="form-item">
                        <el-input
                          size="small"
                          v-model="personList[scope.$index].minute1"
                          type="number"
                        >
                          <template slot="append">秒″</template>
                        </el-input>
                      </el-form-item>
                    </el-col>
                    <el-col :span="12">
                      <el-form-item class="form-item">
                        <el-input
                          size="small"
                          v-model="personList[scope.$index].second1"
                          type="number"
                        >
                          <template slot="append">厘秒</template>
                        </el-input>
                      </el-form-item>
                    </el-col>
                  </el-row>
                </el-form>
              </div>
            </template>
          </el-table-column>
          <el-table-column align="center" label="3000米跑" width="300">
            <template slot-scope="scope">
              <div
                v-if="
                  personList[scope.$index] &&
                  personList[scope.$index].resultShow
                "
              >
                <el-form :inline="true">
                  <el-row>
                    <el-col :span="12">
                      <el-form-item class="form-item">
                        <el-input
                          size="small"
                          v-model="personList[scope.$index].minute2"
                          type="number"
                        >
                          <template slot="append">分′</template>
                        </el-input>
                      </el-form-item>
                    </el-col>
                    <el-col :span="12">
                      <el-form-item class="form-item">
                        <el-input
                          size="small"
                          v-model="personList[scope.$index].second2"
                          type="number"
                        >
                          <template slot="append">秒″</template>
                        </el-input>
                      </el-form-item>
                    </el-col>
                  </el-row>
                </el-form>
              </div>
            </template>
          </el-table-column>
        </el-table>

        <div class="toolbar">
          <el-button type="primary" @click="updateHandle('activity')"
            >保存成绩</el-button
          >
          <el-button @click="resetForm('activity')">取消</el-button>
        </div>
      </div>
    </div>
  </el-main>
</template>

<script>
import { saveActivity, getActivityById, selectDeptScore, selectPersonByDept, saveScore } from "@/api/activity.js";
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
      // isUpdate: false
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
      this.personList.map(elem => {
        if (elem.minute1 && elem.second1) {
          elem.item3 = elem.minute1 + '-' + elem.second1
        }
        if (elem.minute2 && elem.second2) {
          elem.item4 = elem.minute2 + '-' + elem.second2
        }
      })
      // console.log(this.personList)

      const res = await saveScore(this.personList)
      console.log(res)
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
    /* async selectCate() {
      const res = await selectCate()
      if (res.code == 200) {
        this.cateData = res.data.records
      }
    }, */
    async getPersonList() {
      const res = await selectPersonByDept()
      const deptRes = await lastDept()
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
              item.jobTypeName = '战士'
              break
            default:
              item.jobTypeName = '战士'
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
          item.type = 0
          item.resultShow = true
          // if (!this.isUpdate) {
          //   delete item.id
          // }
        })
        this.personList = res.data
      }
    },
    handleSwitchChange(a, b) {
      this.$set(a, 'resultShow', b == 1 ? false : true)
    }
  },
  async mounted() {
    // await this.selectCate()

    const { id } = this.$route.params
    if (id) { // 修改
      const res = await getActivityById(id)
      if (res && res.code === '200') {
        /* this.cateData.map(item => {
          if (res.data.cateId == item.id) {
            res.data.type = item.cateName
          }
        }) */
        res.data.time = res.data.startTime + ' 至 ' + res.data.endTime
        this.activity = res.data
      }

      const deptScore = await selectDeptScore({
        activityId: id,
      })
      if (deptScore.code === '200' && deptScore.data && deptScore.data.records && deptScore.data.records.length > 0) {
        // this.isUpdate = true
        deptScore.data.records.map(elem => {
          if (elem.item3) {
            elem.minute1 = elem.item3.split('-')[0]
            elem.second1 = elem.item3.split('-')[1]
          }
          if (elem.item4) {
            elem.minute2 = elem.item4.split('-')[0]
            elem.second2 = elem.item4.split('-')[1]
          }

          if (elem.type == 0) {
            elem.resultShow = true
          } else {
            elem.resultShow = false
          }
        })
        this.personList = deptScore.data.records;
        this.total = deptScore.data.total;
        this.loading = false;
      }
      // else {
      //   this.isUpdate = false
      //   this.getPersonList()
      // }
    }
  }
};
</script>
<style scoped>
.toolbar {
  padding: 10px 10px 0 0;
  text-align: right;
}
.box-card {
  margin-bottom: 20px;
}
.form-item {
 margin-bottom: 0;
 height: 32px;
}
</style>
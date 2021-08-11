<template>
  <div class="test-container">
    <div class="main-content">
      <h1 class="main-title">{{ title }}</h1>
      <el-form ref="form" :model="form">
        <template v-if="form.single && form.single.length > 0">
          <!-- 单选题 -->
          <h2 class="label">单选题</h2>
          <el-card
            class="card"
            v-for="(choice, choiceIndex) in form.single"
            :key="choiceIndex"
          >
            <h4 class="sub-title">
              第{{ choiceIndex + 1 }}题 {{ choice.title }}
            </h4>
            <el-radio-group v-model="form.single[choiceIndex].answer">
              <el-radio class="radio" :label="'A'"
                >A.{{ choice.choiceA }}</el-radio
              ><br />
              <el-radio class="radio" :label="'B'"
                >B.{{ choice.choiceB }}</el-radio
              ><br />
              <el-radio class="radio" :label="'C'" v-if="choice.choiceC"
                >C.{{ choice.choiceC }}</el-radio
              ><br />
              <el-radio class="radio" :label="'D'" v-if="choice.choiceD"
                >D.{{ choice.choiceD }}</el-radio
              ><br />
            </el-radio-group>
          </el-card>
        </template>

        <template v-if="form.single && form.multiple.length > 0">
          <!-- 多选题 -->
          <h2 class="label">多选题</h2>
          <el-card
            class="card"
            v-for="(choice, choiceIndex) in form.multiple"
            :key="choiceIndex"
          >
            <h4 class="sub-title">
              第{{ choiceIndex + 1 }}题 {{ choice.title }}
            </h4>
            <el-checkbox-group v-model="form.multiple[choiceIndex].answer.split(',')">
              <el-checkbox class="radio" :label="'A'"
                >A.{{ choice.choiceA }}</el-checkbox
              ><br />
              <el-checkbox class="radio" :label="'B'"
                >B.{{ choice.choiceB }}</el-checkbox
              ><br />
              <el-checkbox class="radio" :label="'C'" v-if="choice.choiceC"
                >C.{{ choice.choiceC }}</el-checkbox
              ><br />
              <el-checkbox class="radio" :label="'D'" v-if="choice.choiceD"
                >D.{{ choice.choiceD }}</el-checkbox
              ><br />
            </el-checkbox-group>
          </el-card>
        </template>

        <template v-if="form.judgment && form.judgment.length > 0">
          <!-- 判断题 -->
          <h2 class="label">判断题</h2>
          <el-card
            class="card"
            v-for="(choice, choiceIndex) in form.judgment"
            :key="choiceIndex"
          >
            <h4 class="sub-title">
              第{{ choiceIndex + 1 }}题 {{ choice.title }}
            </h4>
            <el-radio-group v-model="form.judgment[choiceIndex].answer">
              <el-radio class="radio" :label="'A'"
                >{{ choice.choiceA }}</el-radio
              ><br />
              <el-radio class="radio" :label="'B'"
                >{{ choice.choiceB }}</el-radio
              ><br />
            </el-radio-group>
          </el-card>
        </template>

        <template v-if="form.essay && form.essay.length > 0">
          <!-- 简答题 -->
          <h2 class="label">简答题</h2>
          <el-card
            class="card"
            v-for="(essay, essayIndex) in form.essay"
            :key="essayIndex"
          >
            <h4 class="sub-title">
              第{{ essayIndex + 1 }}题 {{ essay.title }}
            </h4>
            <el-input
              type="textarea"
              :autosize="{ minRows: 2, maxRows: 4 }"
              placeholder="请输入答案"
              v-model="form.essay[essayIndex].userAnswer"
            ></el-input>
          </el-card>
        </template>

        <el-form-item class="commit-btn">
          <el-button type="primary" @click="$router.go(-1)">返回</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
import { getQueList, answer, geTNaireContent } from "@/api/question";
import { getExamAnswerInfo } from "@/api/exam";


export default {
  data() {
    return {
      title: '',
      form: {
        // choice: [],
        // essay: [],
        // singleNum: 0,
        // singleScore: 0,
        // multipleNum: 0,
        // multipleScore: 0,
        // judgmentNum: 0,
        // judgmentScore: 0,
        // essayNum: 0,

        single: [],
        multiple: [],
        judgment: [],
        essay: [],
      }
    }
  },
  methods: {
    async getData() {
      const { examId, userId, title } = this.$route.query
      this.title = title
      const res = await getExamAnswerInfo({
        examId,
        userId
      })
      if (res && res.code === '200' && res.data) {
        res.data.forEach((data, index) => {
          if (data.type === 1) {
            this.form.single.push(data)
            // this.$set(this.form.single, index, data)
            // this.$set(this.form.single[index], 'answer', '')
          } else if (data.type === 2) {
            this.form.multiple.push(data)

            // this.$set(this.form.multiple, index, data)
            // this.$set(this.form.multiple[index], 'answer', '')
          } else if (data.type === 3) {
            this.form.judgment.push(data)

            // this.$set(this.form.judgment, index, data)
            // this.$set(this.form.judgment[index], 'answer', '')
          } else if (data.type === 4) {
            this.form.essay.push(data)

            // this.$set(this.form.essay, index, data)
            // this.$set(this.form.essay[index], 'answer', '')
          }
        })
        console.log(105);
        console.log(this.form);

        /* res.data.choiceQuestion.forEach((data, index) => {
          this.$set(this.form.choice, index, data)
          this.$set(this.form.choice[index], 'answer', '')
        })

        res.data.essayQuestion.forEach((data, index) => {
          this.$set(this.form.essay, index, data)
          this.$set(this.form.essay[index], 'answer', '')
        }) */
      }
    },
  },
  async mounted() {
    const { examId, userId } = this.$route.query
    await this.getData()
    // const {data} = await getExamAnswerInfo({
    //   examId,
    //   userId
    // })
    // console.log(126);
    // console.log(data);
    // console.log(this.form);
    // this.form.choice.forEach((c, cIndex) => {
    //   data.forEach(d => {
    //     if(c.id === d.id){
    //       this.$set(this.form.choice[cIndex], 'answer', d.userAnswer)
    //     }
    //   })
    // })

    // this.form.essay.forEach((e, cIndex) => {
    //   data.forEach(d => {
    //     if(e.id === d.id){
    //       this.$set(this.form.essay[cIndex], 'answer', d.userAnswer)
    //     }
    //   })
    // })

  }
}
</script>

<style lang="scss" scoped>
.test-container {
  // background: #eaeff3 url(../../../assets/image/bg.jpg) 0 0 no-repeat;
  background-size: cover;
  display: flex;
  justify-content: center;
}
.main-content {
  background: #fff;
  min-height: calc(100vh - 210px);
  padding: 20px;
  box-sizing: border-box;
  width: 80%;
}
.main-title {
  text-align: center;
}
.label {
  margin: 20px 0;
}
.radio {
  margin: 5px 0;
  font-size: 24px;
}

.sub-title,
.card {
  margin-bottom: 10px;
}

.commit-btn {
  text-align: center;
  margin-top: 30px;
}
.warning {
  color: #ffba00;
  font-size: 18px;
}
</style>
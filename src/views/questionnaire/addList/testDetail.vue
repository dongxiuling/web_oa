<template>
  <div class="test-container">
    <div class="main-content">
      <h1 class="main-title">{{ title }}</h1>
      <el-form ref="form" :model="form">
        <h2 class="label">选择题</h2>
        <el-card
          class="card"
          v-for="(choice, choiceIndex) in form.choice"
          :key="choice.id"
        >
          <h4 class="sub-title">
            第{{ choiceIndex + 1 }}题 {{ choice.title }}
          </h4>
          <el-radio-group v-model="form.choice[choiceIndex].answer">
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
        <!-- 简答题 -->
        <h2 class="label">简答题</h2>
        <el-card
          class="card"
          v-for="(essay, essayIndex) in form.essay"
          :key="essay.id"
        >
          <h4 class="sub-title">第{{ essayIndex + 1 }}题 {{ essay.title }}</h4>
          <el-input
            type="textarea"
            :autosize="{ minRows: 2, maxRows: 4 }"
            placeholder="请输入答案"
            v-model="form.essay[essayIndex].answer"
          ></el-input>
        </el-card>

        <el-form-item class="commit-btn">
          <el-button type="primary" @click="$router.go(-1)">返回</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
import { getQueList, answer, geTNaireContent } from "@/api/question";

export default {
  data() {
    return {
      title: '',
      form: {
        choice: [],
        essay: []
      }
    }
  },
  methods: {
    async getData() {
      const res = await getQueList({
        naireId: this.$route.query.naireId
      })
      console.log(res);
      if (res && res.code === '200' && res.data) {
        this.title = res.data.title

        res.data.choiceQuestion.forEach((data, index) => {
          this.$set(this.form.choice, index, data)
          this.$set(this.form.choice[index], 'answer', '')
        })

        res.data.essayQuestion.forEach((data, index) => {
          this.$set(this.form.essay, index, data)
          this.$set(this.form.essay[index], 'answer', '')
        })
      }
    },
    async commitHandler() {
      const result = []
      this.form.choice.forEach(data => {
        result.push({
          questionId: data.id,
          naireId: this.$route.query.naireId,
          userAnswer: data.answer,
          userId: this.$route.query.userId
        })
      })
      this.form.essay.forEach(data => {
        result.push({
          questionId: data.id,
          naireId: this.$route.query.naireId,
          userAnswer: data.answer,
          userId: this.$route.query.userId
        })
      })
      // console.log(result);
      const res = await answer(result)
      // console.log(res);
      if (res && res.code === '200') {
        this.$message({
          message: "提交成功",
          type: "success"
        });
        this.$router.push('/login')
      }
    }
  },
  async mounted() {
    const { naireId, userId } = this.$route.query
    await this.getData()
    const {data} = await geTNaireContent({
      naireId,
      userId
    })
    console.log(data);
    console.log(this.form);
    this.form.choice.forEach((c, cIndex) => {
      data.forEach(d => {
        if(c.id === d.id){
          this.$set(this.form.choice[cIndex], 'answer', d.userAnswer)
        }
      })
    })

    this.form.essay.forEach((e, cIndex) => {
      data.forEach(d => {
        if(e.id === d.id){
          this.$set(this.form.essay[cIndex], 'answer', d.userAnswer)
        }
      })
    })

  }
}
</script>

<style lang="scss" scoped>
.test-container {
  background: #eaeff3 url(../../../assets/image/bg.jpg) 0 0 no-repeat;
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
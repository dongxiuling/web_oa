<template>
  <div class="test-container">
    <div class="main-content">
      <el-button
        icon="el-icon-back"
        size="mini"
        type="primary"
        style="marginbottom: 20px"
        @click="$router.go(-1)"
        >返回</el-button
      >
      <el-button
        icon="el-icon-download"
        size="mini"
        type="primary"
        style="marginbottom: 20px"
        @click="exportExl"
        >意见导出</el-button
      >
      <h1 class="main-title">{{ title }}</h1>

      <el-form ref="form">
        <!-- <h2 class="label">评分题</h2> -->
        <el-card class="card" v-for="(card, index) in list" :key="index">
          <div class="username">调查人：{{ card[0].userName }}</div>
          <div v-for="(item, i) in card" :key="i">
            <div class="num">第{{ i + 1 }}题</div>
            <div v-if="item.type == 1" class="type1">
              <span class="title">{{ item.title }}</span
              >{{ item.userAnswer }}分
            </div>
            <div v-if="item.type == 2" class="type2">
              <div class="type2-title">{{ item.title }}</div>
              <div>{{ item.userAnswer }}</div>
            </div>
          </div>
        </el-card>

        <el-table :data="exportData" style="width: 100%" class="table">
          <el-table-column
            type="index"
            width="150"
            label="序号"
            align="center"
          ></el-table-column>
          <el-table-column
            align="center"
            prop="userName"
            label="调查人"
          ></el-table-column>
          <el-table-column
            align="center"
            prop="userAnswer"
            label="建议意见"
          ></el-table-column>
        </el-table>
      </el-form>
    </div>
  </div>
</template>

<script>
import { getDiningNaireContent } from "@/api/dining";
import FileSaver from "file-saver";
import XLSX from "xlsx";

export default {
  data() {
    return {
      title: '',
      list: [],
      exportData: []
    }
  },
  methods: {
    async getData() {
      const res = await getDiningNaireContent({
        naireId: this.$route.query.naireId,
        diningId: this.$route.query.id,
      })
      if (res && res.code === '200' && res.data) {
        this.title = this.$route.query.title
        for (let key in res.data) {
          this.list.push(res.data[key])
          res.data[key].map(item => {
            if (item.type == 2) {
              this.exportData.push(item)
            }
          })
        }
      }
    },
    async exportExl(data) {
      let time = new Date();
      let year = time.getFullYear();
      let month = time.getMonth() + 1;
      let day = time.getDate();
      let name = year + "" + month + "" + day;
      let wb = XLSX.utils.table_to_book(document.querySelector(".table"));
      let wbout = XLSX.write(wb, {
        bookType: "xlsx",
        bookSST: true,
        type: "array"
      });
      try {
        FileSaver.saveAs(
          new Blob([wbout], { type: "application/octet-stream" }),
          this.title + name + ".xlsx"
        );
      } catch (e) {
        if (typeof console !== "undefined") console.log(e, wbout);
      }
      return wbout;
    }
  },
  mounted() {
    this.getData()
  }
}
</script>

<style lang="scss" scoped>
.test-container {
  background: #eaeff3 url(../../assets/image/bg.jpg) 0 0 no-repeat;
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

.username {
  margin-bottom: 20px;
}

.num {
  font-weight: bolder;
  margin-bottom: 10px;
}
.title {
  font-size: 18px;
  margin-right: 20px;
}
.type1 {
  margin-bottom: 20px;
}
.type2-title {
  margin-bottom: 10px;
}
.table {
  display: none;
}
</style>
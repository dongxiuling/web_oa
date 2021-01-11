<template>
  <div class="container law-detail-xf" v-loading="loading">
    <div class="control-content">
      <div class="search-form">
        <h3>{{ title }}</h3>
        <span style="color: gray; font-size: 14px">{{ remark }}</span>
      </div>
      <div class="control-bar">
        <el-button
          @click="printTest"
          size="small"
          type="text"
          icon="el-icon-printer"
          >打印</el-button
        >
      </div>
    </div>
    <div class="app-container">
      <div ref="textContent" class="textContent" v-html="htmlContent"></div>
      <div class="href-link">
        <div class="search-content">
          <el-form @submit.native.prevent :inline="true">
            <el-form-item>
              <el-input
                size="small"
                v-model="searchText"
                clearable
                @clear="clearInp"
                @change="enterInp"
                placeholder="请输入搜索内容"
              ></el-input>
            </el-form-item>
            <el-form-item>
              <el-button size="small" type="primary" @click="searchHandle"
                >查询</el-button
              >
            </el-form-item>
          </el-form>
          <span v-if="hrefList.length > 0" class="search-res-info"
            >共有{{ hrefList.length }}条结果</span
          >
        </div>
        <div class="list-content" v-if="hrefList.length > 0">
          <ul @click="testScroll">
            <li v-for="(item, index) in hrefList" :key="index">
              <span>第{{ index + 1 }}条</span>
              <div v-html="item"></div>
            </li>
          </ul>
        </div>
        <div v-else class="empty-list">暂无搜索内容</div>
      </div>
    </div>
  </div>
</template>
<script>
import { getRawList, getLawDetail } from "@/api/file";
import { encode, decode } from "js-base64";
import Tinymce from "@/components/Tinymce/index";
export default {
  data() {
    return {
      loading: false,
      content: "",
      title: "",
      remark: "",
      hrefList: [],
      htmlContent: "",
      searchText: "",
    };
  },
  methods: {
    //打印功能
    printTest() {
      var newWindow = window.open("", "_blank");
      var docStr = this.htmlContent;
      newWindow.document.write(docStr);
      newWindow.document.close();
      newWindow.print();
      newWindow.close();
    },
    // 回车搜索
    enterInp(val) {
      this.heightLight(val);
    },
    // 清空搜索框
    clearInp() {
      this.htmlContent = this.content;
      this.hrefList = [];
      this.$refs.textContent.scrollTo(0, 0);
    },
    // 搜索事件
    searchHandle() {
      this.heightLight(this.searchText);
    },
    // 格式化搜索内容
    selectDiv(regExp, str) {
      let matchStr = "";
      let arr = this.htmlContent.split("");
      let indexArr = [];
      matchStr = str.replace(regExp, (all, first) => {
        indexArr.push(first);
        return `<span style="background-color:yellow" id="a${first}">${all}</span>`;
      });
      this.htmlContent = matchStr;
      let non_html = this.htmlContent
        .replace(/<[^<>]+>/g, "")
        .replace(/&nbsp;/gi, "");
      let nh_arr = [];
      let i = 0;
      let res = "";
      non_html.replace(regExp, (all, first) => {
        let start = 0;
        let end = 0;
        start = first - 20 > 0 ? first - 20 : first;
        end = first + 20 < non_html.length ? first + 20 : first + all.length;
        res = `<span style="display:block" data-ref="a${
          indexArr[i++]
        }">${non_html.substring(start, end)}</span>`;
        let reg2 = new RegExp(all, "g");
        res = res.replace(
          reg2,
          `<span style="background-color:yellow">${all}</span>`
        );
        nh_arr.push(res);
      });
      this.hrefList = nh_arr;
    },
    // 根据内容高亮
    heightLight(val) {
      this.htmlContent = this.content;
      var str = this.htmlContent;
      var queryTitle = val;
      var reg = new RegExp(queryTitle, "g");
      this.selectDiv(reg, str);
    },
    // 测试滚动
    testScroll(event) {
      if (event.target.dataset.ref) {
        let thisRef = event.target.dataset.ref;
        let thisTop = document.getElementById(thisRef).offsetTop;
        this.$refs.textContent.scrollTo(0, thisTop - 230);
      }
    },
    // 获取法规列表数据
    getList() {
      getRawList().then((res) => {
        this.getDetail(res.data[0].id);
      });
    },
    // 获取法规详情
    getDetail(id) {
      this.loading = true;
      getLawDetail({
        id,
      }).then((res) => {
        let thisContent = "";
        this.title = res.data[0].name;
        this.remark = res.data[0].remark;
        res.data.map((item) => {
          thisContent += item.content;
        });
        this.content = decode(thisContent);
        this.htmlContent = this.content;
        this.loading = false;
      });
    },
  },
  mounted() {
    if (this.$route.params.id == ":id") {
      this.getList();
    } else {
      this.getDetail(this.$route.params.id);
    }
  },
  components: { Tinymce },
};
</script>
<style lang="scss">
.law-detail-xf{
.textContent > div{
  width: unset !important;
  margin-bottom: 0 !important;
  margin-top: 0 !important;
  margin-left: 0 !important;
  margin-right: 0 !important;
}
h3 {
  font-size: 30px;
  margin: 20px 0;
}
.control-content {
  position: relative;
  background-color: #fff;
  text-align: center;
}
.container {
  min-height: calc(100vh - 84px);
  background-color: #f3f4fa;
}
.search-inp {
  position: relative;
  right: -20px;
}
.table-content {
  background-color: #fff;
  box-shadow: 0 0 3px rgba(0, 0, 0, 0.3);
}
.textContent {
  background-color: #f0f2f5;
  width: calc(100% - 320px);
  /* height: 500px; */
  position: absolute;
  bottom: 20px;
  top: 160px;
  overflow: scroll;
  padding:20px;
  box-sizing: border-box;
}
.href-link {
  width: 280px;
  padding: 30px;
  position: fixed;
  right: 0;
  top: 220px;
  bottom: 0px;
  overflow-y: scroll;
  background-color: #fff;
  box-shadow: -3px 0 3 rgba(0, 0, 0, 0.3);
}
.href-link ul {
  padding: 0;
}
.href-link li {
  list-style: none;
  padding: 20px 0;
  border-bottom: 1px solid #f3f4fa;
  cursor: pointer;
}
.search-content {
  height: 60px;
  padding-top: 20px;
  background-color: #fff;
  position: fixed;
  z-index: 1000;
  top: 210px;
  right: 0;
  height: 80px;
}
.control-content {
  height: 140px;
  overflow: hidden;
}
.empty-list {
  position: absolute;
  top: 50%;
  left: 0;
  transform: translateY(-50%);
  width: 100%;
  text-align: center;
}
.search-res-info {
  position: relative;
  top: -20px;
  left: 16px;
  color: #999;
  font-size: 14px;
}
.list-content {
  margin-top: 20px;
  overflow: hidden;
}
.list-content span {
  font-size: 13px;
  color: #999;
  display: inline-block;
  margin-bottom: 5px;
}
.control-bar {
  position: absolute;
  top: 10px;
  right: 20px;
  color: #999;
}
.control-bar span {
  cursor: pointer;
}
}
</style>
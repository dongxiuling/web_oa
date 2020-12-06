<template>
  <div class="container" v-loading="loading">
    <div class="control-content">
      <div class="search-form">
        <h3>{{title}}</h3>
        <span style="color: gray; font-size: 14px"
          >搜索法规内容点击内容区域上方放大镜<i class="el-icon-search"></i>进行查找。</span
        >
      </div>
    </div>
    <div class="app-container">
        <tinymce v-if="content" v-model="content" :menubar="false" :toolbar="['searchreplace']" tinyType="contentType" :height="500" />
    </div>
  </div>
</template>
<script>
import { getRawList, getLawDetail } from "@/api/file";
import { encode, decode } from 'js-base64';
import Tinymce from "@/components/Tinymce/index";
export default {
  data() {
    return {
      loading: false,
      content:"",
      title:""
    };
  },
  methods: {
    // 获取法规列表数据
    getList() {
      getRawList().then((res) => {
        this.getDetail(res.data[0].id)
      });
    },
    // 获取法规详情
    getDetail(id) {
      this.loading = true
      getLawDetail({
        id,
      }).then((res) => {
        let thisContent = ""
        this.title = res.data[0].name
        res.data.map((item)=>{
            thisContent += item.content
        })
        this.content = decode(thisContent);
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
<style scoped>
h3{
    font-size: 30px;
}
.control-content {
  position: relative;
  background-color: #fff;
  padding: 50px 0 30px;
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
</style>
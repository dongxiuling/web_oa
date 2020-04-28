<template>
  <div>
    <uploader
      :options="options"
      class="uploader-example"
      @complete="complete"
      @file-success="fileComplete"
    >
      <uploader-unsupport></uploader-unsupport>
      <uploader-drop>
        <uploader-btn :attrs="attrs">上传文件</uploader-btn>
      </uploader-drop>
      <uploader-list></uploader-list>
    </uploader>
  </div>
</template>
<script>
import { getToken } from "@/utils/auth";
//let token = Cookies.get("Admin-token");
export default {
  data() {
    return {
      options: {
        target: "http://47.105.221.73:8808/upload/chunk", //上传地址
        fileParameterName: "file",
        testChunks: false,
        chunkSize: "2048000",
        headers: {
          //设置header
          Authorization: getToken()
        }
      },
      attrs: {
        accept: "*" //接受文件类型
      }
    };
  },
  methods: {
    fileComplete(rootFile, file, response, chunk) {
      // console.log(response);
      let result = JSON.parse(response);
      let obj = {
        wFid:result.data.wFid,
        nFid:result.data.nFid
      }
      console.log('uplodaer',obj);
      this.$emit('getFile', result.data.wFid,result.data.nFid);
      // alert(result.data.wFid);
    },
    complete(rootFile, file, response, chunk) {
      // console.log("complete", arguments);
    }
  }
};
</script>

<style lang="scss" scoped>
.uploader-drop{
    width:300px;
    height:160px;
    border: 1px dashed #d9d9d9;
    background: url(../../assets/image/uploader.jpg) center center no-repeat;
    background-size:270px;
    border-radius: 5px;
}
.uploader-drop:hover {
    border-color: #409eff;
}
.uploader-btn{
  border:none;
  padding: 0;
  width:100%;
  height:100%;
  text-indent: -999px;
}
.uploader-btn:hover {
    background-color: transparent;
}

</style>
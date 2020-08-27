<template>
  <div>
    <uploader
      :options="options"
      class="uploader-example"
      @complete="complete"
      @file-success="onFileSuccess"
      :files="file1"
      :list="true"
    >
      <uploader-unsupport></uploader-unsupport>
      <uploader-drop>
        <!-- <span>将文件拖拽到此或点击选择文件按钮上传文件</span> -->
        <!-- <br /> -->
        <uploader-btn :attrs="attrs" single>上传文件</uploader-btn>
        <!-- <br /> -->
        <!-- <span style="color:#f00;">* 注：一次只能上传一个文件</span> -->
      </uploader-drop>
      <uploader-list>
            <uploader-file :class="'file_' + file1.id" v-if="file1" :file="file1" :list="true"></uploader-file>
        <!-- <template slot-scope="props">
        <ul class="file-list">
          <li v-for="(file,index) in props.fileList" :key="file.id">
            <uploader-file :class="'file_' + file.id" :file="file" v-if="index===props.fileList.length-1" :list="true"></uploader-file>
          </li>
          <div class="no-file" v-if="!props.fileList.length">
            <i class="nucfont inuc-empty-file"></i> 暂无待上传文件
          </div>
        </ul>
        </template> -->
      </uploader-list>
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
      },
      file:null
    };
  },
  props:["myFile"],
  computed:{
    file1(){
      if(this.file){
        return this.file;
      }else{
        console.log(this.myFile)
        return this.myFile;
      }
    }
  },
  methods: {
    onFileSuccess(rootFile, file, response, chunk) {
      console.log("file-success", response, file);
      let result = JSON.parse(response);
      let obj = {
        wFid: result.data.wFid,
        nFid: result.data.nFid
      };
      this.file = file;
      // this.fileList = [result.data];
      // console.log(this.fileList);
      this.$emit(
        "getFile",
        result.data.fileName,
        result.data.wFid,
        result.data.nFid
      );
      // alert(result.data.wFid);
    },
    complete(rootFile, file, response, chunk) {
      console.log("complete");
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
.uploader-file[status="success"] .uploader-file-remove {
  display: block;
}
</style>
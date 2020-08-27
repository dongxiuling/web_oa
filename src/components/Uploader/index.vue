<template>
  <div>
    <uploader
      :options="options"
      class="uploader-example"
      @complete="complete"
      @file-success="onFileSuccess"
      :file="file"
      :list="true"
    >
      <uploader-unsupport></uploader-unsupport>
      <uploader-drop>
        <!-- <span>将文件拖拽到此或点击选择文件按钮上传文件</span> -->
        <uploader-btn :attrs="attrs" single v-if="!change">上传文件</uploader-btn>
        <uploader-btn :attrs="attrs" single v-else>修改文件</uploader-btn>
        <br />
        <span class="file-tip">* 注：一次只能上传一个文件</span>
      </uploader-drop>
      <uploader-list>
        <uploader-file :class="'file_' + file.id" v-if="file" :file="file" :list="true"></uploader-file>
        <div class="file-list no-file" v-if="!change">
          <i class="nucfont inuc-empty-file"></i> 暂无待上传文件
        </div>
        <div class="file-list" v-else>
          <div v-if="!file">已上传文件: {{name}}</div>
        </div>
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
      file: null
    };
  },
  props: ["change", "name"], //change true 代表修改|false代表添加
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
// .uploader-drop{
//     width:300px;
//     height:160px;
//     border: 1px dashed #d9d9d9;
//     background: url(../../assets/image/uploader.jpg) center center no-repeat;
//     background-size:270px;
//     border-radius: 5px;
// }
// .uploader-drop:hover {
//     border-color: #409eff;
// }
.uploader-btn {
  padding: 9px 15px;
  font-size: 12px;
  border-radius: 3px;
  color: #fff;
  background-color: #409eff;
  border-color: #409eff;
  display: inline-block;
  line-height: 1;
  white-space: nowrap;
  cursor: pointer;
}
.uploader-btn:hover {
  background: #66b1ff;
  border-color: #66b1ff;
  color: #fff;
}
.uploader-drop {
  border: 1px solid #ebebeb;
  border-radius: 3px;
  background: #fff;
}
.file-tip {
  font-size: 12px;
  color: #606266;
  margin-top: 7px;
}
.file-list {
  color: #606266;
  display: block;
  overflow: hidden;
  padding-left: 4px;
  text-overflow: ellipsis;
  transition: color 0.3s;
  white-space: nowrap;
}
// .uploader-file[status="success"] .uploader-file-remove {
//   display: block;
// }
</style>
<template>
  <div>
    <uploader :options="options"
              class="uploader-example" @complete="complete"  @file-success="fileComplete">
      <uploader-unsupport></uploader-unsupport>
      <uploader-drop>
        <uploader-btn :attrs="attrs">上传文件</uploader-btn>
      </uploader-drop>
      <uploader-list></uploader-list>
    </uploader>
  </div>
</template>
<script>
  import { getToken } from '@/utils/auth'
  //let token = Cookies.get("Admin-token");
  export default {
    data(){
      return {
        options: {
          target: 'http://47.105.221.73:8808/upload/chunk',//上传地址
          fileParameterName: 'file',
          testChunks:false,
          chunkSize: '2048000',
          headers: {//设置header
            Authorization:  getToken()
          }
        },
        attrs: {
          accept: '*'//接受文件类型
        }
      };
    },
    methods:{
      fileComplete(rootFile, file, response, chunk) {
        console.log(response)
        let result = JSON.parse(response);
        alert(result.data.wFid);
      },
      complete (rootFile, file, response, chunk)  {
        console.log('complete', arguments)
      }
    }
  }
</script>

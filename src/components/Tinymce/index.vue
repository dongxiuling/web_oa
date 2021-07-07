<template>
  <div class="tinymce-editor">
    <editor
      v-model="myValue"
      :init="init"
      :disabled="disabled"
      @onClick="onClick"
    >
    </editor>
  </div>
</template>
<script>
import tinymce from "tinymce/tinymce";
import Editor from "@tinymce/tinymce-vue";

import "tinymce/themes/silver";

import "tinymce/plugins/image"; // 插入上传图片插件
// import 'tinymce/plugins/media'// 插入视频插件
import "tinymce/plugins/table"; // 插入表格插件
import "tinymce/plugins/lists"; // 列表插件
import "tinymce/plugins/wordcount"; // 字数统计插件
import "tinymce/plugins/searchreplace";
import { getToken } from "@/utils/auth";
import axios from 'axios'
export default {
  components: {
    Editor,
  },
  props: {
    value: {
      type: String,
      default: "",
    },
    // 基本路径，默认为空根目录，如果你的项目发布后的地址为目录形式，
    // 即abc.com/tinymce，baseUrl需要配置成tinymce，不然发布后资源会找不到
    baseUrl: {
      type: String,
      default: () => {
        return window.location.origin;
      },
    },
    disabled: {
      type: Boolean,
      default: false,
    },
    menubar: {
      type: Boolean,
      default: true,
    },
    plugins: {
      type: [String, Array],
      default: "searchreplace lists image media table wordcount",
    },
    toolbar: {
      type: [String, Array],
      default:
        "searchreplace undo redo |  formatselect | bold italic forecolor backcolor | alignleft aligncenter alignright alignjustify | bullist numlist outdent indent | lists image media table | removeformat",
    },
  },
  data() {
    return {
      init: {
        language_url: `/tinymce/langs/zh_CN.js`,
        language: "zh_CN",
        skin_url: `/tinymce/skins/ui/oxide`,
        content_css: `/tinymce/skins/content/default/content.css`,
        // skin_url: `${this.baseUrl}/tinymce/skins/ui/oxide-dark`, // 暗色系
        // content_css: `${this.baseUrl}/tinymce/skins/content/dark/content.css`, // 暗色系
        height: 300,
        menubar: this.menubar,
        plugins: this.plugins,
        toolbar: this.toolbar,
        branding: false,
        // 此处为图片上传处理函数，这个直接用了base64的图片形式上传图片，
        // 如需ajax上传可参考https://www.tiny.cloud/docs/configure/file-image-upload/#images_upload_handler
        images_upload_handler: (blobInfo, success, failure) => {
          const img = "data:image/jpeg;base64," + blobInfo.base64();

          // var xhr, formData;

          // xhr = new XMLHttpRequest();
          // xhr.withCredentials = false;
          // xhr.open("POST", process.env.VUE_APP_BASE_API + "/common/upload");
          // xhr.setRequestHeader("Authorization",'Bearer ' + getToken());
          // xhr.upload.onprogress = function (e) {
          //   progress((e.loaded / e.total) * 100);
          // };

          // xhr.onload = function () {
          //   var json;

          //   if (xhr.status === 403) {
          //     failure("HTTP Error: " + xhr.status, { remove: true });
          //     return;
          //   }

          //   if (xhr.status < 200 || xhr.status >= 300) {
          //     failure("HTTP Error: " + xhr.status);
          //     return;
          //   }

          //   json = JSON.parse(xhr.responseText);

          //   if (!json || typeof json.location != "string") {
          //     failure("Invalid JSON: " + xhr.responseText);
          //     return;
          //   }

          //   success(json.location);
          // };

          // xhr.onerror = function () {
          //   failure(
          //     "Image upload failed due to a XHR Transport error. Code: " +
          //       xhr.status
          //   );
          // };

          var formData = new FormData();
          formData.append("file", blobInfo.blob(), blobInfo.filename());
          // xhr.send(formData);
          var configs = {
            headers:{"Authorization":'Bearer ' + getToken()}
          };
          axios.post(process.env.VUE_APP_BASE_API + "/common/upload",formData ,configs).then(res=>{
            console.log(res)
            success(res.data.msg);
          })
          
        },
      },
      myValue: this.value,
    };
  },
  mounted() {
    tinymce.init({});
  },
  methods: {
    // 添加相关的事件，可用的事件参照文档=> https://github.com/tinymce/tinymce-vue => All available events
    // 需要什么事件可以自己增加
    onClick(e) {
      this.$emit("onClick", e, tinymce);
    },
    // 可以添加一些自己的自定义事件，如清空内容
    clear() {
      this.myValue = "";
    },
  },
  watch: {
    value(newValue) {
      this.myValue = newValue;
    },
    myValue(newValue) {
      this.$emit("input", newValue);
    },
  },
};
</script>
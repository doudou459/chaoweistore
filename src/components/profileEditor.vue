<template>
  <div>
    <div class="editorDiv" :style="{'height':height+'px'}">
      <div ref="editorTool" class="editorTool">
        <el-button
          size="mini"
          plain
          type="success"
          v-on:click="$emit('editor-sure',editorContent)"
        >保存</el-button>
      </div>
      <div ref="editor" class="editor" :style="{'height':(height-60)+'px'}"></div>
    </div>
  </div>
</template>

<script>
const Editor = require("wangeditor");
export default {
  props: {
    height: {
      type: Number,
      required: true,
      default: 200
    },
    newContent: {
      type: String,
      required: true,
      default: ""
    },
    uploadUrl: {
      type: String,
      required: true,
      default: ""
    }
  },
  data: function() {
    return {
      editorContent: this.newContent,
    };
  },
  computed: {},
  mounted() {
    let editor = new Editor(this.$refs.editorTool, this.$refs.editor);
    let me = this;
    editor.customConfig.menus = [
      "head", // 标题
      "bold", // 粗体
      "fontSize", // 字号
      "foreColor", // 文字颜色
      "justify", // 对齐方式
      "image", // 插入图片
      "table", // 表格
      "undo", // 撤销
      "redo" // 重复
    ];
    editor.customConfig.showLinkImg = false;
    editor.customConfig.onchangeTimeout = 100;
    editor.customConfig.onchange = html => {
      this.editorContent = html;
    };
    editor.customConfig.uploadImgMaxSize = 5 * 1024 * 1024;
    editor.customConfig.uploadImgMaxLength = 1;
    editor.customConfig.customUploadImg = function(files, insert) {
      let formData = new FormData();
      let picurl = me.$store.state.downloadImg;
      formData.append("pictureImg", files[0]);
      me.$ajax
        .post(me.uploadUrl, formData, {
          headers: {
            "Content-Type": "multipart/form-data",
            chaoweiStoreToken: me.$store.state.loginToken
          }
        })
        .then(function(res) {
          if (res.data) {
            picurl = picurl + res.data;
                  insert(picurl);
          }
        })
        .catch(function(error) {
          me.$message({
            showClose: true,
            message: error,
            type: "error"
          });
        });
    };
    editor.create();
    editor.txt.html(this.editorContent);
    editor.change();
  }
};
</script>

<style scoped>
.editorTool {
  padding-top: 5px;
  padding-bottom: 5px;
  border-bottom-style: inset;
  border-bottom-width: 1px;
  border-bottom-color: azure;
}
.editor {
  text-align: left;
}
.editorDiv {
  width: 600px;
  margin-left: auto;
  margin-right: auto;
  border-style: solid;
  border-width: 1px;
  border-color: black;
  overflow: auto;
}
</style>
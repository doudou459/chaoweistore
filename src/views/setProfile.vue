<template>
    <div class="editorContent">
        <editor v-if="showEditor"
        :height="this.$store.state.clientHeight-100"
        :newContent="editContent"
        :uploadUrl="this.$store.state.uploadImg"
        v-on:editor-sure="editorSure($event)"
        >            
        </editor>
    </div>
</template>
<script>
import editor from "../components/profileEditor"
export default {
    data:function(){
        return{
          editContent:"",
          showEditor:false
        }
    },
    components:{
        editor
    },
    methods:{
    editorSure: function(res) {
      this.editContent=res;
     let me = this;
    this.$ajax({
      url: "/service/admin/setProfile",
      method: "post",
      headers: {
        chaoweiStoreToken: me.$store.state.loginToken
      },
      data:{
          profile:this.editContent
      }
    })
      .then(function(res) {
        if (res.data.errno == "200") {
            if(res.data.data=="success"){
           me.$message({
            showClose: true,
            message: "保存成功",
            type: "success"
          });                
            }else{
            me.$message({
            showClose: true,
            message: "保存失败",
            type: "error"
          });    
            }
        
        } else if (res.data.errno == "501") {
          me.$message({
            showClose: true,
            message: res.data.errmsg,
            type: "error"
          });
        } else if (res.data.errno == "502") {
          me.$message({
            showClose: true,
            message: res.data.errmsg,
            type: "error"
          });
        } else {
          console.log(res.data.errmsg);
        }
      })
      .catch(function(error) {
        me.$message({
          showClose: true,
          message: error,
          type: "error"
        });
      });      
    },
    },
    created(){
    let me = this;
    this.$ajax({
      url: "/service/admin/getProfile",
      method: "post",
      headers: {
        chaoweiStoreToken: me.$store.state.loginToken
      }
    })
      .then(function(res) {
        if (res.data.errno == "200") {
          me.editContent=res.data.data;
          me.showEditor = true;
        } else if (res.data.errno == "501") {
          me.$message({
            showClose: true,
            message: res.data.errmsg,
            type: "error"
          });
        } else if (res.data.errno == "502") {
          me.$message({
            showClose: true,
            message: res.data.errmsg,
            type: "error"
          });
        } else {
          console.log(res.data.errmsg);
        }
      })
      .catch(function(error) {
        me.$message({
          showClose: true,
          message: error,
          type: "error"
        });
      });        
    }

}
</script>
<style>
.editorContent{
    margin-left: auto;
    margin-right: auto;
    padding-top:15px;

}
</style>
<template>
      <div>
        <div class="contentDiv">
          <el-row type="flex">
            <el-col :span="4">
              <el-button @click="addData" type="primary">新增</el-button>
              <el-button @click="deleteState=deleteState?false:true" type="warning">删除</el-button>
              <el-button @click="saveData" type="info">保存</el-button>
            </el-col>
          </el-row>
          <el-drawer size="40%" :show-close="false" :visible.sync="drawer" :with-header="false">
            <editor
              v-if="drawer"
              :height="this.$store.state.clientHeight-100"
              :newContent="editContent"
              :uploadUrl="this.$store.state.uploadImg"
              v-on:editor-sure="editorSure($event)"
              v-on:editor-cancel="editorCancel"
            ></editor>
          </el-drawer>
          <div class="carouselDiv">
          <el-row :gutter="20" class="itemRow">
            <el-col v-for="item in carouselData.datas" v-bind:key="item.id" :span="12">
                <div class="itemBtnRow" >
                <el-button @click="openEditor(item.id)" type="info" round size="mini">详细内容</el-button>            
               <el-button
                v-if="deleteState"
                icon="el-icon-close"
                size="mini"
                circle
                class="deleteBtn"
                @click="deleteData(item.id)"
              ></el-button>
                                
                </div>
                  <el-upload
                    action="/service/admin/uploadImg"
                    :headers="headers"
                    :show-file-list="false"
                    :on-success="handleAvatarSuccess"
                    :before-upload="beforeAvatarUpload"
                    name="pictureImg"
                  >
                    <el-image
                      class="c_img"
                      :src="getImgUrl(item.img_name)"
                      @click="getOwnerID(item.id)"
                      fit="fill"
                      :style="{'height':'240px'}"
                    ></el-image>
                  </el-upload>
            </el-col>
          </el-row>
          </div>
        </div>
      </div>
</template>
<script>
import editor from "../components/wangeditor";
export default {
      components: {
    editor
  },
    data:function(){
      return{
      deleteState:false,
      drawer:false,
      carouselData:new this.$dataModel(["id", "img_name", "detail"],"id"),
      opreateID: "",
      noPic: require("@/assets/nopic.png"),
      editContent: "",
      editID: ""  ,
      headers:{
          chaoweiStoreToken: this.$store.state.loginToken
      }      
      }

    },
    methods:{
        addData:function(){
        this.carouselData.newData({"id":new Date().getTime(),"img_name":"none"});
        },
        saveData:function(){
      if(!this.carouselData.getChangedData()){
         return;
      }
      var carouselData = this.carouselData.getChangedData();
      var me =this;
    this.$ajax({
      url: "/service/admin/saveCarousel",
      method: "post",
      headers: {
        chaoweiStoreToken: me.$store.state.loginToken
      },
      data:{
        carouselData:carouselData
      }
    })
      .then(function(res) {
        if (res.data.errno == "200") {
          me.$message({
             showClose: true,
            message: "保存成功",
            type: "success"           
          })
          me.carouselData.acceptChanges();
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
            me.$message({
            showClose: true,
            message: "保存失败",
            type: "error"
          });
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
    deleteData: function(id) {
      this.carouselData.deleteByID(id);
    },
    getOwnerID: function(id) {
      this.opreateID = id;
    },
    getImgUrl: function(fileName) {
      if (fileName && fileName != "none") {
        return this.$store.state.downloadImg + fileName;
      } else {
        return this.noPic;
      }
    },
    beforeAvatarUpload: function(file) {
      const isJPG = file.type === "image/jpeg" || file.type === "image/png";
      const isLt5M = file.size / 1024 / 1024 < 5;

      if (!isJPG) {
        this.$message.error("上传头像图片只能是 JPG或 png 格式!");
      }
      if (!isLt5M) {
        this.$message.error("上传头像图片大小不能超过 5MB!");
      }
      return isJPG && isLt5M;
    },
    handleAvatarSuccess: function(res) {
      this.carouselData.setValueByID("img_name", res, this.opreateID);
    },
    openEditor: function(id) {
      this.editContent = this.carouselData.getValueByID("detail", id);
      this.editID = id;
      this.drawer = true;
    },
    editorSure: function(res) {
      this.carouselData.setValueByID("detail", res, this.editID);
      this.drawer = false;
    },
    editorCancel: function() {
      this.drawer = false;
    }        
    },
    created(){
    let me = this;
    this.$ajax({
      url: "/service/admin/getCarousel",
      method: "post",
      headers: {
        chaoweiStoreToken: me.$store.state.loginToken
      }
    })
      .then(function(res) {
        if (res.data.errno == "200") {
           if(res.data.data.length>0){
               me.carouselData.loadData(res.data.data);
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
    }
}
</script>
<style>
.deleteBtn {
  margin-left: 10px;
  color: red !important;
  background-color: #e9eef3;
  border: #e9eef3;
  font-weight: bold;
}
.deleteBtn:active,
.deleteBtn:hover {
  background-color: red!important;
  color: #ffffff!important;
}

.c_img {
  cursor: pointer;
  width: 100%;
  display: block;
  margin-top: 5px;
  margin-bottom: 10px;
  border-radius: 20px;
}
.itemRow {
  margin-top: 10px;
}
.contentDiv{
    padding:15px;
}
.carouselDiv{
    box-shadow: 0px 0px 5px 5px rgb(20, 20, 20, 0.5);
    margin-left: auto;
    margin-right: auto;
    width: 1000px;
    padding:15px;
    min-height:600px;
}
.itemBtnRow{
    text-align: left;
}


</style>
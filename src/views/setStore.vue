<template>
  <div>
    <div class="btnDiv">
      <el-button type="success" @click="saveStoreConfig">保 存</el-button>
    </div>

    <div class="titleDiv">
      <h3>微信设置</h3>
    </div>
    <div class="formDiv">
      <el-form label-position="left" label-width="100px" :model="wechatConfig">
        <el-form-item label="公众号APPID">
          <el-input v-model="wechatConfig.wxAppidMp"></el-input>
        </el-form-item>
        <el-form-item label="公众号密钥">
          <el-input v-model="wechatConfig.wxAppsecret"></el-input>
        </el-form-item>
        <el-form-item label="小程序APPID">
          <el-input v-model="wechatConfig.wxAppidMin"></el-input>
        </el-form-item>
        <el-form-item label="小程序密钥">
          <el-input v-model="wechatConfig.wxAppsecreyMin"></el-input>
        </el-form-item>
      </el-form>
    </div>
    <div class="titleDiv">
      <h3>定位和联系电话</h3>
    </div>
    <div  v-if="showMap" class="mapContent">
      <el-form label-position="right" label-width="80px" >
        <el-col :span="12">
          <el-form-item label="联系电话">
            <el-input v-model="phoneNum"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="定位坐标">
            <el-col :span="12">
              <el-input v-model="markerPoint.lng"></el-input>
            </el-col>
            <el-col :span="12">
              <el-input v-model="markerPoint.lat"></el-input>
            </el-col>
          </el-form-item>
        </el-col>
      </el-form>
      <baidu-map class="mapDiv" :center="markerPoint" :zoom="19">
        <bm-marker
          :position="markerPoint"
          :dragging="true"
          @dragend="getPosition"
          animation="BMAP_ANIMATION_BOUNCE"
        ></bm-marker>
      </baidu-map>
    </div>
  </div>
</template>
<script>
export default {
  data: function() {
    return {
      wechatConfig: {
        wxAppidMp: "",
        wxAppsecret: "",
        wxAppidMin: "",
        wxAppsecreyMin: ""
      },
      markerPoint: {
        lng: 104.283814,
        lat: 30.972046
      },
      phoneNum: null,
      showMap:false,
    };
  },
  methods: {
    getPosition: function(event) {
      this.markerPoint = event.point;
    },
    saveStoreConfig: function() {
      let me = this;
      this.$ajax({
        url: "/service/admin/setStoreConfig",
        method: "post",
        headers: {
          chaoweiStoreToken: me.$store.state.loginToken
        },
        data: {
          phone: this.phoneNum,
          maker: this.markerPoint.lng + "," + this.markerPoint.lat,
          wxAppidMp: this.wechatConfig.wxAppidMp,
          wxAppsecret: this.wechatConfig.wxAppsecret,
          wxAppidMin: this.wechatConfig.wxAppidMin,
          wxAppsecreyMin: this.wechatConfig.wxAppsecreyMin
        }
      })
        .then(function(res) {
          if (res.data.errno == "200") {
            if (res.data.data.result == "success") {
              me.$message({
                showClose: true,
                message: "保存成功",
                type: "success"
              });
            } else {
              me.$message({
                showClose: true,
                message: "保存失败",
                type: "error"
              });
            }
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
  },
  created() {
    let me = this;
    this.$ajax({
      url: "/service/admin/getStoreConfig",
      method: "get",
      headers: {
        chaoweiStoreToken: me.$store.state.loginToken
      }
    })
      .then(function(res) {
        if (res.data.errno == "200") {
          me.phoneNum = res.data.data.phone;
          let maker = res.data.data.maker.split(",");
          me.markerPoint.lng = maker[0].trim();
          me.markerPoint.lat = maker[1].trim();
          me.wechatConfig.wxAppidMp = res.data.data.wxAppidMp;
          me.wechatConfig.wxAppsecret = res.data.data.wxAppsecret;
          me.wechatConfig.wxAppidMin = res.data.data.wxAppidMin;
          me.wechatConfig.wxAppsecreyMin = res.data.data.wxAppsecreyMin;
          me.showMap=true;
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
};
</script>
<style  scoped>
.titleDiv {
  text-align: left;
  padding-bottom: 10px;
  padding-left: 15px;
}

.formDiv {
  padding-left: 15%;
  padding-right: 15%;
  border-bottom-color: cadetblue;
  border-bottom-style: inset;
  border-bottom-width: 3px;
}
.mapContent {
  padding-left: 15%;
  padding-right: 15%;
}
.mapDiv {
  height: 400px;
}
.btnDiv {
  text-align: left;
  padding-left: 15px;
  padding-top: 15px;
}
</style>
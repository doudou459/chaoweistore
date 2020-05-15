<template>
  <div>
    <div class="contentDiv">
      <div class="topDiv">
        <el-row type="flex">
          <el-col :span="4">
            <el-date-picker
              v-model="dayTime"
              type="date"
              placeholder="选择日期"
              format="yyyy 年 MM 月 dd 日"
              value-format="timestamp"
            @change="dayTimeChange"></el-date-picker>
          </el-col>
        </el-row>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data: function() {
    return {
      dayTime: new Date(new Date().toLocaleDateString()).getTime(),
      appointmentOrderData:new this.$dataModel(["id","customerId","customerName","phone","itemName","appointmentTime","openid_min","state"],"id")
    };
  },
  methods:{
      dayTimeChange:function(){
          console.log(this.dayTime)
      }
  },
  created(){
    let me = this;
    this.$ajax({
      url: "/service/admin/getAppointmentOrder",
      method: "post",
      data:{
        beginTime:this.dayTime,
        endTime:this.dayTime+24*3600*1000-1
      },
      headers: {
        chaoweiStoreToken: me.$store.state.loginToken
      }
    })
      .then(function(res) {
        if (res.data.errno == "200") {
           if(res.data.data.length>0){
               me.appointmentOrderData.loadData(res.data.data);
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
};
</script>
<style scoped>
.contentDiv {
  padding: 15px 0px;
}
.topDiv {
  padding-bottom: 15px;
  border-bottom-color: cadetblue;
  border-bottom-style: inset;
  border-bottom-width: 3px;
}
</style>
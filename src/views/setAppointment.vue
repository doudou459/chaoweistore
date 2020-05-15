<template>
  <div>
    <div class="contentDiv">
      <div class="btnDiv">
        <el-row type="flex">
          <el-col :span="4">
            <el-button @click="addData" type="primary">新增</el-button>
            <el-button @click="deleteState=deleteState?false:true" type="warning">删除</el-button>
            <el-button @click="saveData" type="info">保存</el-button>
          </el-col>
        </el-row>
      </div>
      <div class="itemFormDiv">
        <div v-for="item in storeAppointmentItem.datas" v-bind:key="item.id">
          <el-row :gutter="20" class="itemRow">
            <el-col :span="2">
              <el-popover placement="right" width="500" trigger="click">
                <el-form label-width="200px">
                  <el-row :gutter="20">
                    <el-col :span="24">
                      <el-form-item label="每个预约周期持续时间">
                          <el-input-number v-model="item.taktTime" :step="15" :min="15">                         
                          </el-input-number>
                          <span class="unitSpan">分钟</span>
                      </el-form-item>
                    </el-col>
                    <el-col :span="24">
                      <el-form-item label="单个周期最大预约人数">
                          <el-input-number v-model="item.max_people" :step="1" :min="1">                         
                          </el-input-number>
                          <span class="unitSpan">人</span>
                      </el-form-item>
                    </el-col>
                    <el-col :span="24">
                      <el-form-item label="可提前多少天预约">
                          <el-input-number v-model="item.advanceDay" :step="1" :min="1">                         
                          </el-input-number>
                          <span class="unitSpan">天</span>
                      </el-form-item>
                    </el-col>

                    <el-col :span="24">
                      <el-form-item label-width="200px" label="预约开始时间">
                        <el-time-select
                          placeholder="开始时间"
                          v-model="item.startTime"
                          style="width: 100%;"
                          :picker-options="{
                            start: '06:00',
                            step: '00:15',
                            end: '22:00',
                          }"                          
                        ></el-time-select>
                      </el-form-item>
                    </el-col>
                    <el-col :span="24">
                      <el-form-item label-width="200px" label="预约结束时间">
                        <el-time-select
                          placeholder="结束时间"
                          v-model="item.closeTime"
                          style="width: 100%;"
                          :picker-options="{
                            start: '06:00',
                            step: '00:15',
                            end: '22:00',
                            minTime: item.startTime
                          }"
                        ></el-time-select>
                      </el-form-item>
                    </el-col>
                  </el-row>
                </el-form>

                <el-button slot="reference" plain type="primary">编辑</el-button>
              </el-popover>
            </el-col>
            <el-form label-width="75px" label-position="right">
              <el-col :span="14">
                <el-form-item label="项目名称">
                  <el-input placeholder="请输入预约项目的名称" v-model="item.itemName"></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="6">
                <el-form-item label="开启预约">
                  <el-radio-group v-model="item.openAppointment">
                    <el-radio :label="1">开启</el-radio>
                    <el-radio :label="0">关闭</el-radio>
                  </el-radio-group>
                </el-form-item>
              </el-col>
            </el-form>
            <el-col v-show="deleteState" :span="2">
              <el-form>
                <el-form-item>
                  <i class="el-icon-close redIco" @click="deleteRow(item.id)"></i>
                </el-form-item>
              </el-form>
            </el-col>
          </el-row>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  data: function() {
    return {
      deleteState: false,
      storeAppointmentItem: new this.$dataModel(
        [
          "id",
          "itemName",
          "startTime",
          "closeTime",
          "taktTime",
          "advanceDay",
          "max_people",
          "openAppointment"
        ],
        "id"
      )
    };
  },
  methods: {
    addData: function() {
      this.storeAppointmentItem.newData({
        id: new Date().getTime(),
        itemName: "",
        startTime:"09:00",
        closeTime:"18:00",
        taktTime: "30",
        max_people: "10",
        advanceDay: "30",
        openAppointment: 1
      });
    },
    saveData: function() {
      if(!this.storeAppointmentItem.getChangedData()){
         return;
      }
      var appointmentData = this.storeAppointmentItem.getChangedData();
      var me =this;
    this.$ajax({
      url: "/service/admin/saveAppointmentItemList",
      method: "post",
      headers: {
        chaoweiStoreToken: me.$store.state.loginToken
      },
      data:{
        appointmentData:appointmentData
      }
    })
      .then(function(res) {
        if (res.data.errno == "200") {
          me.$message({
             showClose: true,
            message: "保存成功",
            type: "success"           
          })
          me.storeAppointmentItem.acceptChanges();
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
    deleteRow: function(id) {
      this.storeAppointmentItem.deleteByID(id);
    }
  },
  created(){
    let me = this;
    this.$ajax({
      url: "/service/admin/getAppointmentItemList",
      method: "post",
      headers: {
        chaoweiStoreToken: me.$store.state.loginToken
      }
    })
      .then(function(res) {
        if (res.data.errno == "200") {
           if(res.data.data.length>0){
               me.storeAppointmentItem.loadData(res.data.data);
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
.btnDiv {
  padding-bottom: 15px;
  border-bottom-color: cadetblue;
  border-bottom-style: inset;
  border-bottom-width: 3px;
}
.itemFormDiv {
  padding: 15px;
  width: 960px;
  margin-left: auto;
  margin-right: auto;
}
.redIco {
  font-weight: bold;
  color: red;
  line-height: 30px;
}
.redIco:hover {
  width: 32px;
  height: 32px;
  font-weight: bold;
  border-radius: 16px;
  color: #ffffff;
  background-color: red;
}
.redIco:active {
  width: 32px;
  height: 32px;
  border-radius: 16px;
  color: #ffffff;
  background-color: red;
}
.itemRow {
  background-color: #ffffff;
  padding-top: 20px;
  border-bottom-style: inset;
  border-bottom-width: thin;
}

.unitSpan{
    margin-left:10px;
    background-color: #F5F7FA;
    color: #909399;
    vertical-align: middle;
    position: relative;
    border: 1px solid #DCDFE6;
    border-radius: 4px;
    padding: 10px 20px;
    width: 1px;
    white-space: nowrap;
}
</style>
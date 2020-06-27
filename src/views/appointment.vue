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
              @change="dayTimeChange"
            ></el-date-picker>
          </el-col>
          <el-col :span="4" v-if="dayTime>=new Date(new Date().toLocaleDateString()).getTime()">
            <el-popover placement="bottom" title="新增预约" width="400" v-model="visible">
              <el-form label-width="90px">
                <el-form-item label="客户姓名">
                  <el-input placeholder="请输入客户姓名" v-model="newAppointmentOrderData.customerName"></el-input>
                </el-form-item>
                <el-form-item label="联系电话">
                  <el-input placeholder="请输入联系电话" v-model="newAppointmentOrderData.phone"></el-input>
                </el-form-item>
                <el-form-item label="预约项目">
                  <el-select v-model="newAppointmentOrderData.itemId">
                    <el-option
                      v-for="item in items"
                      :key="item.id"
                      :label="item.itemName"
                      :value="item.id"
                    ></el-option>
                  </el-select>
                </el-form-item>
                <el-form-item label="预约时间" v-if="newAppointmentOrderData.itemId">
                  <el-time-select
                    v-model="newAppointmentOrderData.time"
                    :picker-options="getTimePickeOption"
                  ></el-time-select>
                </el-form-item>
                <el-form-item>
                  <el-button type="success" @click="addNewAppointmentOrder">确定预约</el-button>
                </el-form-item>
              </el-form>
              <el-button slot="reference">新增预约</el-button>
            </el-popover>
          </el-col>
        </el-row>
      </div>
      <div class="orderDiv">
        <el-row v-for="item in hours" v-bind:key="item" class="hourRow">
          <el-col :span="2">
            <label>{{item+":00"}}</label>
          </el-col>
          <el-col :span="22">
            <el-row>
              <el-col
                class="cardCol"
                :span="6"
                v-for="m in appointmentOrderData.datas.filter(function(a){return new Date(a.appointmentTime).getHours()==item})"
                v-bind:key="m.id"
              >
                <el-card
                  :class="[{'w-BackImg':m.state==3||m.state=='3','g-BackImg':isOverTime(m.appointmentTime)&&m.state!=3&&m.state!='3'},'box-card']"
                >
                  <el-row>
                    <el-col :span="8">
                      <span class="labelSpan">预约项目:</span>
                    </el-col>
                    <el-col :span="16" class="cardItemText text-color-blue">
                      <span>{{m.itemName}}</span>
                    </el-col>
                  </el-row>
                  <el-row>
                    <el-col :span="8">
                      <span class="labelSpan">客户姓名:</span>
                    </el-col>
                    <el-col :span="16" class="cardItemText">
                      <span>{{m.customerName}}</span>
                    </el-col>
                  </el-row>
                  <el-row>
                    <el-col :span="8">
                      <span class="labelSpan">联系电话:</span>
                    </el-col>
                    <el-col :span="16" class="cardItemText text-color-green">
                      <span>{{m.phone}}</span>
                    </el-col>
                  </el-row>
                  <el-row>
                    <el-col :span="8">
                      <span class="labelSpan">预约时间:</span>
                    </el-col>
                    <el-col :span="16" class="cardItemText text-color-red">
                      <span>{{formTime(m.appointmentTime)}}</span>
                    </el-col>
                  </el-row>
                  <div class="cardBottom">
                    <el-button v-if="m.state!=3&&m.state!='3'" size="mini" type="primary">完成</el-button>
                    <el-button
                      v-if="(m.openid_min==''||m.openid_min==null||m.openid_min==undefined)&&m.state!=3&&m.state!='3'&&isOverTimeOneDay(m.appointmentTime)"
                      size="mini"
                      type="info"
                    >删除</el-button>
                    <el-button
                      v-if="m.openid_min!=''&&m.openid_min!=null&&m.openid_min!=undefined&&m.state!=3&&m.state!='3'&&isOverTimeOneDay(m.appointmentTime)"
                      size="mini"
                      type="warning"
                    >改期</el-button>
                    <el-button
                      v-if="m.openid_min!=''&&m.openid_min!=null&&m.openid_min!=undefined&&m.state!=3&&m.state!='3'&&isOverTimeOneDay(m.appointmentTime)"
                      size="mini"
                      type="info"
                    >取消</el-button>
                  </div>
                </el-card>
              </el-col>
            </el-row>
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
      appointmentOrderData: new this.$dataModel(
        [
          "id",
          "customerId",
          "customerName",
          "phone",
          "itemId",
          "itemName",
          "appointmentTime",
          "openid_min",
          "state"
        ],
        "id"
      ),
      hours: [],
      appointmentItem: new this.$dataModel(
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
      ),
      items: [],
      newAppointmentOrderData: {
        id: "",
        customerName: "",
        phone: "",
        itemId: "",
        itemName: "",
        time: ""
      },
      visible: false
    };
  },
  methods: {
    dayTimeChange: function() {
      if (!this.dayTime) {
        return;
      }
      let me = this;
      me.getItems();
      this.newAppointmentOrderData = {
        customerName: "",
        phone: "",
        itemId: "",
        itemName: "",
        time: ""
      };
      this.$ajax({
        url: "/service/admin/getAppointmentOrder",
        method: "post",
        data: {
          beginTime: this.dayTime,
          endTime: this.dayTime + 24 * 3600 * 1000 - 1
        },
        headers: {
          chaoweiStoreToken: me.$store.state.loginToken
        }
      })
        .then(function(res) {
          if (res.data.errno == "200") {
            if (res.data.data.length > 0) {
              me.appointmentOrderData.loadData(res.data.data);
              me.hours = [];
              var h = new Date(res.data.data[0].appointmentTime).getHours();
              for (var i = h; i < 24; i++) {
                me.hours.push(i);
              }
            } else {
              me.appointmentOrderData.clear();
              me.hours = [];
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
    },
    formTime: function(time) {
      var dateTime = new Date(time);
      return (
        dateTime.getHours() +
        ":" +
        (dateTime.getMinutes() > 10
          ? dateTime.getMinutes()
          : "0" + dateTime.getMinutes())
      );
    },
    isOverTime: function(time) {
      return time - new Date().getTime() < 0;
    },
    isOverTimeOneDay: function(time) {
      return new Date().getTime() - time < 86400000;
    },
    getItems: function() {
      this.items = [];
      var today = new Date(new Date().toLocaleDateString()).getTime();
      var disDay = parseInt((this.dayTime - today) / 86400000);
      this.items = this.appointmentItem.datas.filter(function(item) {
        return item.advanceDay > disDay;
      });
    },
    addNewAppointmentOrder: function() {
      if (!this.newAppointmentOrderData.customerName) {
        this.$message({
          showClose: true,
          message: "请输入客户姓名",
          type: "error"
        });
        return;
      }
      if (!this.newAppointmentOrderData.phone) {
        this.$message({
          showClose: true,
          message: "请输入客户联系电话",
          type: "error"
        });
        return;
      }
      if (!this.newAppointmentOrderData.itemId) {
        this.$message({
          showClose: true,
          message: "请选择预约项目",
          type: "error"
        });
        return;
      }
      if (!this.newAppointmentOrderData.time) {
        this.$message({
          showClose: true,
          message: "请选择预约时间",
          type: "error"
        });
        return;
      }
      let me = this;
      var selectDate = new Date(this.dayTime);
      var YY = selectDate.getFullYear() + "-";
      var MM =
        (selectDate.getMonth() + 1 < 10
          ? "0" + (selectDate.getMonth() + 1)
          : selectDate.getMonth() + 1) + "-";
      var DD =
        selectDate.getDate() < 10
          ? "0" + selectDate.getDate()
          : selectDate.getDate();
      var appointmentTime = new Date(
        YY + MM + DD + " " + this.newAppointmentOrderData.time + ":00"
      ).getTime();
      var newOrder = {
        customerName: this.newAppointmentOrderData.customerName,
        phone: this.newAppointmentOrderData.phone,
        itemId: this.newAppointmentOrderData.itemId,
        itemName: this.appointmentItem.getValueByID(
          "itemName",
          this.newAppointmentOrderData.itemId
        ),
        appointmentTime: appointmentTime
      };
      this.$ajax({
        url: "/service/admin/addNewAppointmenOrder",
        method: "post",
        data: newOrder,
        headers: {
          chaoweiStoreToken: me.$store.state.loginToken
        }
      })
        .then(function(res) {
          if (res.data.errno == "200") {
            me.dayTimeChange();
            me.visible = false;
          } else {
            me.$message({
              showClose: true,
              message: res.data.errmsg,
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
    }
  },
  computed: {
    getTimePickeOption: function() {
      var itemId = this.newAppointmentOrderData.itemId;
      if (itemId) {
        var itemStarTime =
          this.appointmentItem.getValueByID("startTime", itemId) + "";
        var itemEndTime =
          this.appointmentItem.getValueByID("closeTime", itemId) + "";
        var itemStep =
          this.appointmentItem.getValueByID("taktTime", itemId) + "";
        return {
          start: itemStarTime.substring(0, itemStarTime.length - 3),
          step: "00:" + itemStep,
          end: itemEndTime.substring(0, itemEndTime.length - 3)
        };
      } else {
        return {
          start: "00:00",
          step: "00:01",
          end: "00:30"
        };
      }
    }
  },
  created() {
    let me = this;
    this.$ajax({
      url: "/service/admin/getAppointmentOrder",
      method: "post",
      data: {
        beginTime: this.dayTime,
        endTime: this.dayTime + 24 * 3600 * 1000 - 1
      },
      headers: {
        chaoweiStoreToken: me.$store.state.loginToken
      }
    })
      .then(function(res) {
        if (res.data.errno == "200") {
          if (res.data.data.length > 0) {
            me.appointmentOrderData.loadData(res.data.data);
            me.hours = [];
            var h = new Date(res.data.data[0].appointmentTime).getHours();
            for (var i = h; i < 24; i++) {
              me.hours.push(i);
            }
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

    this.$ajax({
      url: "/service/getAppointmentList",
      method: "post",
      headers: {
        chaoweiStoreToken: me.$store.state.loginToken
      }
    })
      .then(function(res) {
        if (res.data.errno == "200") {
          if (res.data.data.length > 0) {
            me.appointmentItem.loadData(res.data.data);
            me.getItems();
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
.hourRow {
  padding-top: 25px;
  padding-bottom: 25px;
  border-bottom-style: inset;
  border-color: #e6e6e6;
  border-width: thin;
}
.cardCol {
  margin-top: 10px;
}
.box-card {
  width: 100%;
  max-width: 300px;
}
.cardBottom {
  margin-top: 10px;
  text-align: right;
  padding: 5px;
  border-top-style: outset;
  border-top-width: thin;
}
.cardItemText {
  text-align: left;
}
.labelSpan {
  font-size: 14px;
  color: #000000;
  font-weight: bold;
}
.text-color-green {
  color: rgb(14, 110, 18);
}
.text-color-blue {
  color: rgb(15, 153, 238);
  font-weight: bold;
}
.text-color-red {
  color: red;
}

.w-BackImg {
  background-color: #e6e6e6ab;
  background-image: url(../img/wancheng.png);
  background-repeat: no-repeat;
  background-size: 240px;
  background-position: 90px -40px;
}
.g-BackImg {
  background-color: #e6e6e6ab;
  background-image: url(../img/guoqi.png);
  background-repeat: no-repeat;
  background-size: 240px;
  background-position: 90px -40px;
}
</style>
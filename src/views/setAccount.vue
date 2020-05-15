<template>
  <div>
    <div class="btnDiv">
      <el-row type="flex">
        <el-col :span="4">
          <el-button type="primary" @click="addAdmin">新增</el-button>
          <el-button type="warning" @click="showDetele?showDetele=false:showDetele=true">删除</el-button>
          <el-button type="success" @click="saveAdmins">保存</el-button>
        </el-col>
      </el-row>
    </div>
    <div class="contentDiv">
      <el-form v-for="item in admins.datas" v-bind:key="item.id" label-width="80px">
        <el-row v-if="item.id!=1">
          <el-col :span="4">
            <el-popover placement="right" width="500" trigger="click">
              <el-table
                :data="roles.datas"
                :rowKey="roles.datas.id"
                @select-all="roleSelectAll"
                @select="roleSelect"
                :ref="roleTable(item.id)"
              >
                <el-table-column width="50" type="selection"></el-table-column>
                <el-table-column width="150" property="roleName" label="角色"></el-table-column>
                <el-table-column width="300" property="desc" label="说明"></el-table-column>
              </el-table>
              <el-button slot="reference" type="info" round @click="setRoleBtnClick(item.id)">设置角色</el-button>
            </el-popover>
          </el-col>
          <el-col :span="8">
            <el-form-item label="账号">
              <el-input
                v-model="item.loginID"
                placeholder="请输入账号"
                :disabled="item.userOperateState!='new'"
              ></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="密码">
              <el-input
                v-model="item.loginKey"
                placeholder="请输入密码"
                :disabled="item.userOperateState!='new'"
                :show-password="item.userOperateState!='new'"
              ></el-input>
            </el-form-item>
          </el-col>
          <el-col v-show="showDetele" :span="4">
            <i class="el-icon-close redIco" @click="deleteRow(item.id)"></i>
          </el-col>
        </el-row>
      </el-form>
    </div>
  </div>
</template>
<script>
export default {
  data: function() {
    return {
      admins: new this.$dataModel(["id", "loginID", "loginKey", "roles"], "id"),
      roles: new this.$dataModel(["id", "roleName", "desc"], "id"),
      showDetele: false,
      currentRowId: ""
    };
  },
  created() {
    let me = this;
    this.$ajax({
      url: "/service/admin/getRoleList",
      method: "post",
      headers: {
        chaoweiStoreToken: me.$store.state.loginToken
      }
    })
      .then(function(res) {
        if (res.data.errno == "200") {
          if(res.data.data.length>0){
          me.roles.loadData(res.data.data);
          me.roles.deleteByID("1");
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
      url: "/service/admin/getAdminList",
      method: "post",
      headers: {
        chaoweiStoreToken: me.$store.state.loginToken
      }
    })
      .then(function(res) {
        if (res.data.errno == "200") {
          if(res.data.data.length>0){
            me.admins.loadData(res.data.data);
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
  methods: {
    addAdmin: function() {
      this.admins.newData({ id: new Date().getTime(), showLoginKey: "y" });
    },
    deleteRow: function(id) {
      this.admins.deleteByID(id);
    },
    roleTable: function(id) {
      return "roleTable" + id;
    },
    setRoleBtnClick: function(id) {
      this.currentRowId = id;
      var roles = this.admins.getValueByID("roles", id);
      var r = roles.split(",");
      var roleTabelName = "roleTable" + id;
      this.roles.datas.forEach(item => {
        if (r.includes(item.id + "")) {
          this.$refs[roleTabelName][0].toggleRowSelection(item, true);
        }
      });
    },
    roleSelect: function(selection) {
      var r = [];
      selection.forEach(item => {
        r.push(item.id);
      });
      this.admins.setValueByID("roles", r.join(","), this.currentRowId);
    },
    roleSelectAll: function(selection) {
      var r = [];
      selection.forEach(item => {
        r.push(item.id);
      });
      this.admins.setValueByID("roles", r.join(","), this.currentRowId);
    },
    saveAdmins: function() {
      var hasEmpty = false;
      var loginIDs = [];
      var isRepeat = false;
      this.admins.datas.forEach(item=>{
        if(item.userOperateState=="new"){
          if(!(item.loginID&&item.loginID.trim())){
          this.$message({
             showClose: true,
            message: "请输入账号",
            type: "error"           
          })
          hasEmpty = true;
           return;
          }
          if(!(item.loginKey&&item.loginKey.trim())){
          this.$message({
             showClose: true,
            message: "请为新账号输入密码",
            type: "error"           
          })
          hasEmpty = true;
            return; 
          }         
        }else{
         loginIDs.push(item.loginID);
        }
      })
      if(hasEmpty){
        return;
      }
      if(!this.admins.getChangedData()){
         return;
      }
      var json = JSON.parse(this.admins.getChangedData());
      json.forEach(item => {
        if (item.state == "new") {
          if(loginIDs.includes(item.jsonData.loginID)){
            isRepeat = true;
          this.$message({
             showClose: true,
            message: "账号重复",
            type: "error"           
          })            
            return; 
          }
          item.jsonData.loginKey = this.$md5(item.jsonData.loginKey);
        }
      });
      if(isRepeat){
        return;
      }
      var admins = JSON.stringify(json);
      var me =this;
    this.$ajax({
      url: "/service/admin/saveAdmin",
      method: "post",
      headers: {
        chaoweiStoreToken: me.$store.state.loginToken
      },
      data:{
        adminData:admins
      }
    })
      .then(function(res) {
        if (res.data.errno == "200") {
          me.$message({
             showClose: true,
            message: "保存成功",
            type: "success"           
          })
          me.admins.acceptChanges();
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
    }
  }
};
</script>
<style  scoped>
.btnDiv {
  padding-top: 15px;
  padding-bottom: 15px;
  border-bottom-color: cadetblue;
  border-bottom-style: inset;
  border-bottom-width: 3px;
}
.contentDiv {
  padding-top: 15px;
  padding-left: 15%;
  padding-right: 15%;
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
</style>
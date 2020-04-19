<template>
<div class="contentDiv" :style='{"height":this.$store.state.clientHeight-20+"px"}'>

  <div class="loginWeb">
    <el-form :model="user" label-width="50px" class="demo-ruleForm">
      <el-form-item  label="账号" prop="loginID">
        <el-input v-model="user.loginID" autocomplete="off"></el-input>
      </el-form-item>
      <el-form-item  label="密码" prop="loginKey">
        <el-input type="password" v-model="user.loginKey" autocomplete="off"></el-input>
      </el-form-item>
       <el-button type="success" @click="submitForm">登 录</el-button>
    </el-form>
  </div>

  </div>
</template>

<script>
export default {
  name: "login",
  data: function() {
    return {
      user: {
        loginID: "",
        loginKey: ""
      },
        backgroundDiv: 'url(' + require('@/img/city.jpg') + ')'
    }
  },
  methods:{
    submitForm:function(){
      let me = this;
     this.$ajax.post(this.$store.state.loginUrl,{
       loginID:this.user.loginID,
       loginKey:this.$md5(this.user.loginKey)  
     }).then(function(res){
       if(res.data.errno==200){
        if(res.data.data.result=="success"){
           localStorage.setItem("permissions",res.data.data.permissions);
           localStorage.setItem("loginID",me.user.loginID);
           localStorage.setItem("loginToken",res.data.data.chaoweiStoreToken);
           localStorage.setItem("loginTime",new Date().getTime())
          me.$store.commit('setLoginID',me.user.loginID);
          me.$store.commit('setToken',res.data.data.chaoweiStoreToken);
          me.$store.commit('setPromission',res.data.data.permissions);
          me.$message({
          showClose: true,
          message: '登录成功',
          type: 'success'
        });
         me.$router.push("/container");
        }else if(res.data.data.result=="error"){
          me.$message({
          showClose: true,
          message: res.data.data.msg,
          type: 'warning'
        });
        }else if(res.data.data.result=="fail"){
          me.$message({
          showClose: true,
          message:res.data.data.msg,
          type: 'warning'
        });
        }else {
          me.$message({
          showClose: true,
          message: '账号或密码错误',
          type: 'warning'
        });
        } 
       }       
     }).catch(function(error){
          me.$message({
          showClose: true,
          message: error,
          type: 'error'
        });
     })
    }
  }
}
</script>
<style scoped>
.contentDiv{
  display: flex;
  align-items: center; /*定义元素垂直居中*/
  justify-content: center; /*定义元素水平居中*/
  background-color:dimgray;
}

.loginWeb{
  width: 100%;
  max-width: 360px;
  text-align: center;
  padding:75px 30px 30px 30px;
  border-radius: 15px;
  background-color:cadetblue;
 box-shadow: 0px 0px 5px 5px rgba(10, 10, 10, 0.3);
}




</style>

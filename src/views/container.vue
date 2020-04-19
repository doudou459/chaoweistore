<template>
<el-container>
  <el-aside width="200px"  :style='{"height":this.$store.state.clientHeight+"px"}'>
<el-menu
  :default-active="router"
  class="el-menu-demo"
  mode="vertical"
  background-color="#545c64"
  text-color="#fff"
  active-text-color="#ffd04b"
  router
  :style='{"height":this.$store.state.clientHeight+"px"}'>
  <el-menu-item  v-for="item in navigation" v-bind:key="item.name" v-on:click="setTitle(item.name,item.router)"  v-bind:index="item.router">{{item.name}}</el-menu-item>
</el-menu>

  </el-aside>
  <el-main :style='{"height":this.$store.state.clientHeight+"px"}'>
    <el-header>{{titleName}}</el-header>
    <router-view></router-view>
  </el-main>
</el-container>
</template>
<script>
export default {
  name: "contents",
  data: function() {
    return {
      navigation:this.$store.state.menus,
      titleName:this.getTitleName(this.$route.path),
      router:this.$route.path
    }
  },
  methods:{
    setTitle:function(titleName,router){
     this.titleName=titleName;
     this.router=router;
     if(router=='/'){
        localStorage.removeItem("loginToken");
        localStorage.removeItem("permissions");
        localStorage.removeItem("loginID");
        localStorage.removeItem("loginTime");
        this.$store.commit('setLoginID','');
        this.$store.commit('setToken','');
        this.$router.push("/")
     }
    },
    getTitleName:function(router){
      let item = this.$store.state.menus.find(item=>{
        return item.router==router
      })
      if(item){
      return item.name;     
      }else{
         return "管理后台";  
      }

    }
  },
  created(){

     
  }
}
</script>

<style scoped>
  .el-aside {
    background-color: #D3DCE6;
    color: #333;
    text-align: center;
    height: 100%;
  }
  
  .el-main {
    background-color: #E9EEF3;
    color: #333;
    text-align: center;
    height: 100%;
    padding:0px;
  }

    .el-header{
    background-color: #545c64;
    color: #ffffff;
    text-align: center;
    line-height: 60px;
  }
</style>
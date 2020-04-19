<template>
  <div id="app">
   <router-view></router-view>
  </div>
</template>
<script>
export default {
  created(){
    this.$store.commit('setLoginID',localStorage.getItem("loginID"));
    this.$store.commit('setToken',localStorage.getItem("loginToken"));
    this.$store.commit('setPromission',localStorage.getItem("permissions"));
  }
  
}
</script>
<style>

</style>

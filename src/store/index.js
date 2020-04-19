import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
        //记录屏幕的宽度和高度，用于页面布局和组件大小设置 
        clientWidth:document.documentElement.clientWidth,
        clientHeight:document.documentElement.clientHeight-20,
        //已在config中将service路径代理为后端的请求地址，即/service表示后端请求地址
        loginUrl:"/service/admin/login",//管理员登录请求地址
        downloadImg:"/service/downloadFile?fileName=",//下载图片的请求地址
        uploadImg:"/service/admin/uploadImg",
        loginID:localStorage.getItem("loginID"),
        loginToken:localStorage.getItem("loginToken"),
        permissions:localStorage.getItem("permissions"),
        menus:localStorage.getItem("menus"),
        navigation:[
          {
            promission:["root"],
            name:"店铺设置",
            router:"/container/setStore"
          },
          {
            promission:["root"],
            name:"账号管理",
            router:"/container/setAccount"
          },          
          {
            promission:["root","admin","profile"],
            name:"店铺简介",
            router:"/container/setProfile"  
          },
          {
            promission:["root","admin","carousel"],
            name:"轮播图片",
            router:"/container/setCarousel"  
          },
          {
            promission:["root","admin","setAppointment"],
            name:"预约项目",
            router:"/container/setAppointment"
          },
          {
            promission:["root","admin","scanAppointment"],
            name:"预约订单",
            router:"/container/appointment"  
          },
          {
            promission:["anon"],
            name:"密码修改",
            router:"/container/changeKey"  
          }, {
            promission:["anon"],
            name:"安全退出",
            router:"/" 
          }
        ],
  },
  mutations: {
        setLoginID(state,loginID){
          state.loginID=loginID;
        },
        setToken(state,token){
          state.loginToken=token;
        },
        setPromission(state,permissions){
          state.menus=[];
          let str =permissions.substring(1,permissions.length-1);
          state.permissions=str.split(", ");
          for(let i=0;i<state.navigation.length;i++){
            let item = state.navigation[i].promission;
            for(let j=0;j<item.length;j++){
               if(item[j]=="anon"||state.permissions.includes(item[j])){
                 if(!state.menus.includes(state.navigation[i])){
                      state.menus.push(state.navigation[i]);
                 }           
               }
            }
          }
        },

  },
  actions: {
  },
  modules: {
  }
})

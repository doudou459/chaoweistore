import Vue from 'vue'
import VueRouter from 'vue-router'
import login from '../views/login.vue'
import container from '../views/container.vue'
import setStore from '../views/setStore.vue'
import setProfile from '../views/setProfile.vue'
import setCarousel from '../views/setCaroesel.vue'
import setAppointment from '../views/setAppointment.vue'
import appointment from '../views/appointment.vue' 
import changeKey from '../views/changeKey.vue'
import setAccount from '../views/setAccount.vue'
Vue.use(VueRouter)
let permissions = localStorage.getItem("permissions");
if(permissions){
let str =permissions.substring(1,permissions.length-1);
 permissions=str.split(", ");
}
const routes = [
  {
    path: '/',
    name: 'login',
    component: login,
    beforeEnter: (to, from, next) => {
      let token = localStorage.getItem("loginToken");
      let loginTime = parseInt(localStorage.getItem("loginTime"));
      let nowTime = new Date().getTime();
      if(token&&nowTime-loginTime<1800000){
        next('/container')
      }else{
        next()
      }
    },    
  },
  {
    path:"/container",
    name:"container",
    component:container,
    beforeEnter: (to, from, next) => {
      let token = localStorage.getItem("loginToken");
      if(token){
        next()
      }else{
        next('/')
      }
    },
    children:[
      {
        path:'setStore',
        name:'setStore',
        component:setStore,
        beforeEnter: (to, from, next) => {       
          if(permissions.includes("root")){
            next()
          }else{
            next('/')
          }
        }
      },
      {
        path:'setAccount',
        name:'setAccount',
        component:setAccount,
        beforeEnter: (to, from, next) => {       
          if(permissions.includes("root")){
            next()
          }else{
            next('/')
          }
        }
      },
      {
        path:'setProfile',
        name:'setProfile',
        component:setProfile,
        beforeEnter: (to, from, next) => {       
          if(permissions.includes("root")||permissions.includes("admin")||permissions.includes("profile")){
            next()
          }else{
            next('/')
          }
        }
      },
      {
        path:'setCarousel',
        name:'setCarousel',
        component:setCarousel,
        beforeEnter: (to, from, next) => {       
          if(permissions.includes("root")||permissions.includes("admin")||permissions.includes("carousel")){
            next()
          }else{
            next('/')
          }
        }
      },      
      {
        path:'setAppointment',
        name:'setAppointment',
        component:setAppointment,
        beforeEnter: (to, from, next) => {       
          if(permissions.includes("root")||permissions.includes("admin")||permissions.includes("setAppointment")){
            next()
          }else{
            next('/')
          }
        }
      },
      {
        path:'appointment',
        name:'appointment',
        component:appointment,
        beforeEnter: (to, from, next) => {       
          if(permissions.includes("root")||permissions.includes("admin")||permissions.includes("scanAppointment")){
            next()
          }else{
            next('/')
          }
        }
      },
      {
        path:'changeKey',
        name:'changeKey',
        component:changeKey
      }

    ]
  }
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

export default router

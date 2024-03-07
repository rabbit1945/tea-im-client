//引入vue-router路由插件
import VueRouter from "vue-router";
//引入Vue
import Vue from "vue";
import routes from "./routes";
//使用插件
Vue.use(VueRouter);

import VueSocketIO from 'vue-socket.io' ;
import Manager from "socket.io-client";
import { setCache, getCache,removeCache} from "@/utils/cache";
import { setToken, getToken,removeToken} from "@/utils/token";
//引入store
import store from "@/store";
//需要重写VueRouter.prototype原型对象身上的push|replace方法
//先把VueRouter.prototype身上的push|replace方法进行保存一份
let originPush = VueRouter.prototype.push;
let originReplace = VueRouter.prototype.replace;
//重写VueRouter.prototype身上的push方法了
VueRouter.prototype.push = function(location, resolve, reject) {
  //第一个形参：路由跳转的配置对象（query|params）
  //第二个参数：undefined|箭头函数（成功的回调）
  //第三个参数:undefined|箭头函数（失败的回调）
  if (resolve && reject) {
    //push方法传递第二个参数|第三个参数（箭头函数）
    //originPush：利用call修改上下文，变为(路由组件.$router)这个对象，第二参数：配置对象、第三、第四个参数：成功和失败回调函数
    originPush.call(this, location, resolve, reject);
  } else {
    //push方法没有产地第二个参数|第三个参数
    originPush.call(
      this,
      location,
      () => {},
      () => {}
    );
  }
};
//重写VueRouter.prototype身上的replace方法了
VueRouter.prototype.replace = function(location, resolve, reject) {
  if (resolve && reject) {
    originReplace.call(this, location, resolve, reject);
  } else {
    originReplace.call(
      this,
      location,
      () => {},
      () => {}
    );
  }
};
//对外暴露VueRouter类的实例
let router = new VueRouter({
  mode : 'history',
  //配置路由
  //第一:路径的前面需要有/(不是二级路由)
  //路径中单词都是小写的
  //component右侧V别给我加单引号【字符串：组件是对象（VueComponent类的实例）】
  routes,
  //滚动行为
  scrollBehavior(to, from, savedPosition) {
    //返回的这个y=0，代表的滚动条在最上方
    return { y: 0 };
  },
});

//全局守卫：前置守卫（在路由跳转之间进行判断）
router.beforeEach(async (to, from, next) => {
   //to:获取到要跳转到的路由信息
   //from：获取到从哪个路由跳转过来来的信息
   //next: next() 放行  next(path) 放行  
   //方便测试 统一放行
  //  next();
  //获取仓库中的token-----可以确定用户是登录了
   let token  = store.state.user.token;
 
   //用户登录了
   if(token != null && to.meta.requiresAuth ){
     //已经登录而且还想去登录------不行
        try {
          // 获取房间信息
          Vue.use(new VueSocketIO({
            debug: true,
            // 正式 https://teaim.cn
            // 测试 http://127.0.0.1:9502
            connection: Manager.connect("http://127.0.0.1:9502", {
              connectionStateRecovery: {
                // the backup duration of the sessions and the packets
                maxDisconnectionDuration: 2 * 60 * 1000,
                // whether to skip middlewares upon successful recovery
                skipMiddlewares: true,
              },
                reconnectionDelayMax: 100,
                transports: ["websocket"],//默认使用的请求方式
              
                query: {
                  "token":store.state.user.token,
                    
               },
                autoConnect: false,//是否自动连接 
              })
            
          }));
          
          let room_id = store.state.user.roomInfo.room_id ? store.state.user.roomInfo.room_id:1
          console.log("room_id::",room_id)
          await store.dispatch('getRoomInfo',room_id);
          next();
       
        } catch (error) {        
          //token失效从新登录
          await store.dispatch('userLogout');
          next({ name: 'Login' })
        }
       
  } else {
    let toPath = to.path; //把未登录的时候向去而没有去成的信息，存储于地址栏中【路由】
    // 删除 token
    removeToken();
    // 删除授权
    removeCache('isAuthLogin')
    if(!to.meta.requiresGuest){
     
      next({ name: 'Login' })
    } else if(to.name == 'Login' || to.name == 'Register') {
      next();
    }
       
    
  }
});

export default router;

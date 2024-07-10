import Vue from 'vue';

import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
// import VueAudio from 'vue-audio-better'
import MetaInfo from 'vue-meta-info';
import VueCookies from 'vue-cookies'
import AudioVisual from 'vue-audio-visual'
import uploader from 'vue-simple-uploader'
import App from './App.vue';

//引入路由相关文件
import router from "@/router";
//引入仓库进行注册
import store from "@/store";

import { Button,MessageBox} from 'element-ui';
//引入表单校验插件
// import "@/plugins/validate";
	
//注册全局组件
Vue.component(Button.name,Button);

//ElementUI注册组件的时候，还有一种写法，挂在原型上
Vue.prototype.$msgbox = MessageBox;
Vue.prototype.$alert = MessageBox.alert;
//统一引入
import * as API from '@/api';
//引入表单校验插件
Vue.config.productionTip = false
Vue.use(ElementUI);
// Vue.use(VueAudio);
Vue.use(MetaInfo);
Vue.use(VueCookies)
Vue.use(AudioVisual)
Vue.use(uploader)
// 屏幕自适应穿透px为rem模板
/* 调整缩放比例 start */
import { monitorZoom } from "@/utils/monitorZoom.js";
const m = monitorZoom();
console.log(window.screen.width * window.devicePixelRatio);
if (window.screen.width * window.devicePixelRatio >= 3840) {
  document.body.style.zoom = 100 / (Number(m) / 2); // 屏幕为 4k 时
} else if (window.screen.width * window.devicePixelRatio >= 2560) {
  document.body.style.zoom = 0.75; // 屏幕为 2k 时
} else if (window.screen.width * window.devicePixelRatio >= 1920) {
  document.body.style.zoom = 100 / (Number(m) / 1.5); // 屏幕为 2k 时
} else if (window.screen.width * window.devicePixelRatio >= 1440) {
  document.body.style.zoom = 100 / (Number(m) / 1.1); // 屏幕为 2k 时
} else {
  document.body.style.zoom = 100 / Number(m);

}

 
/* 调整缩放比例 end */
new Vue({
  
  //全局事件总线$bus配置
  beforeCreate() {
    Vue.prototype.$bus = this;
    Vue.prototype.$API = API;
  },
  //router进行注册
  router,
  //注册store
  store,
  render: h => h(App),
}).$mount('#app')

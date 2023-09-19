import Vue from 'vue';
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
import VueAudio from 'vue-audio-better'
import MetaInfo from 'vue-meta-info';

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
Vue.use(VueAudio);
Vue.use(MetaInfo)
new Vue({
  render: h => h(App),
  //全局事件总线$bus配置
  beforeCreate() {
    Vue.prototype.$bus = this;
    Vue.prototype.$API = API;
  },
  //router进行注册
  router,
  //注册store
  store
}).$mount('#app')

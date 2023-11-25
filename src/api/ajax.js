//对于axios进行二次封装
import axios from "axios";
import nprogress, { done } from "nprogress";
//在当前模块中引入store
import store from '@/store';
//如果出现进度条没有显示：一定是你忘记了引入样式了
import "nprogress/nprogress.css";
import { setToken, getToken,removeToken} from "@/utils/token";

//底下的代码也是创建axios实例
let requests = axios.create({
  //基础路径
  baseURL: "/api",
  //请求不能超过10s
  timeout: 120000, 
});

//请求拦截器----在项目中发请求（请求没有发出去）可以做一些事情
requests.interceptors.request.use(
  (config) => {
    //需要携带token带给服务器
    let token = store.state.user.token
    if(token){
      config.headers.Authorization = 'Bearer'+' '+ token;
    }
    nprogress.start();
    return config;
  },(err) => {
    console.log("服务器请求数据失败",err)
    return Promise.reject(err);
  }
);

//响应拦截器----当服务器手动请求之后，做出响应（相应成功）会执行的
requests.interceptors.response.use(
  (res) => {
    let data = res.data;
    
    //进度条结束
    nprogress.done();
    if (data.code === 10000){   
        //相应成功做的事情
        return data;
    } else {
      // // token 校验失效
      // if (data.code === 500) {
      //   removeToken();
      //   this.$router.push({path:'/login'})
      //   // return alert(data.msg)
      // }
      return data;
    }
     
   
  },
  (err) => {
    // removeToken();
    console.log("服务器响应数据失败",err)
    this.$alert("网站异常，请重新登录");
    this.$router.push({path:'/login'})
   
    return false
  }
);
//最终需要对外暴露（不对外暴露外面模块没办法使用）
//这里的代码是暴露一个axios实例
export default requests;

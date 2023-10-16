import requests from "./ajax";
import mockRequests  from "./mockAjax";
//登录
//URL:/api/v1/login  method:post phone password
export const reqUserLogin = (data)=>requests({url:'/v1/login',data,method:'post'});
// 授权
export const reqAuth = (type)=>requests({url:`/v1/get/auth/${type}`,type,method:'get'});
// 第三方登录
export const reqAuthLogin = (data)=>requests({url:'/v1/auth/login',data,method:'post'});

//聊天室的基本信息
//URL:/api/v1/room/info  method:post phone password
export const reqRoomInfo = ()=>requests({url:'/v1/room/info',method:'post'});

// 聊天室的用户列表
//URL:/api/v1/login  method:post phone password
export const reqRoomUserList = (data)=>requests({url:'/v1/room/user/list',data,method:'post'});


//添加登录日志
// export const reqUerLoginLogs = ()=>requests({url:'/v1/add/login/logs',method:'post'});
//reqLogout 登出
export const reqLogout = ()=>requests({url:'/v1/log/out',method:'post'});
// 所有消息
export const reqGetMsg = (data)=>requests({url:'/v1/user/msg',data,method:'post'});
// 上传音频 /upload/audio
export const reqUploadAudio =  (data)=>requests({url:'/v1/upload/audio',data,method:'post'});
// 上传文件
export const reqUploadFiles =  (data)=>requests({url:'/v1/upload/files',data,method:'post',headers: {
    "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8"
  }});
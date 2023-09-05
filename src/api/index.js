import requests from "./ajax";
import mockRequests  from "./mockAjax";
//登录
//URL:/api/v1/login  method:post phone password
export const reqUserLogin = (data)=>requests({url:'/v1/login',data,method:'post'});

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
// 离线消息
export const reqOfflineMsg = (data)=>requests({url:'/v1/user/offline/msg',data,method:'post'});
// 历史消息
export const reqhistoryMsg = (data)=>requests({url:'/v1/user/history/msg',data,method:'post'});
// 上传音频 /upload/audio
export const reqUploadAudio =  (data)=>requests({url:'/v1/upload/audio',data,method:'post'});

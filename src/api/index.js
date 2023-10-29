import requests from "./ajax";
import mockRequests  from "./mockAjax";
//登录
//URL:/api/v1/login  method:post phone password
export const reqUserLogin = (data)=>requests({url:'user/v1/login',data,method:'post'});
// 授权
export const reqAuth = (type)=>requests({url:`user/v1/get/auth/${type}`,type,method:'get'});
// 第三方登录
export const reqAuthLogin = (data)=>requests({url:'user/v1/auth/login',data,method:'post'});

//聊天室的基本信息
//URL:/api/v1/room/info
export const reqRoomInfo = (id)=>requests({url:`room/v1/room/info/${id}`,method:'get'});

// 聊天室的用户列表
//URL:/api/v1/login  method:post phone password
export const reqRoomUserList = (data)=>requests({url:`room/v1/room/user/list/${data}`,method:'get'});


//添加登录日志
// export const reqUerLoginLogs = ()=>requests({url:'/v1/add/login/logs',method:'post'});
//reqLogout 登出out
export const reqLogout = ()=>requests({url:'user/v1/out',method:'post'});
// 所有消息
export const reqGetMsg = (data)=>requests({url:`message/v1/user/msg/${data}`,data,method:'get'});
// 上传音频 /upload/audio
export const reqUploadAudio =  (data)=>requests({url:'upload/v1/audio',data,method:'post'});
// 上传文件
export const reqUploadFiles =  (data)=>requests({url:'upload/v1/files',data,method:'post'});
// 上传base64 
export const reqUploadBase64 =  (data)=>requests({url:'upload/v1/base64',data,method:'post'});

// 上传二進制
export const reqUploadPut =  (data)=>requests({url:'upload/v1/put',data,method:'post'});
// 检测文件状态
export const reqcheckChunkExis =  (data)=>requests({url:'upload/v1/checkChunkExist',data,method:'post'});

// 上传分片
export const reqUploadChunk =  (data)=>requests({url:'upload/v1/chunk',data,method:'post'});

// 合并分片
export const reqUploadMerge =  (data)=>requests({url:'upload/v1/merge',data,method:'post'});



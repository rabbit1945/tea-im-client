
// 导入api
import {
    reqGetMsg,
    reqUploadAudio,
    reqUploadFiles,
    reqUploadBase64
} from "@/api";
import { setCache, getCache,removeCache} from "@/utils/cache";
import store from "@/store";

const state = {
    title: "闪电",
    messageList:null,
    historyMessageList:null,
    offTotal:0
};
// 
const mutations = {
    GETOFFMSGTOTAL(state, data) {
        state.offTotal = data
    },
   
    GETMESSAGELIST(state, data) {      
        state.messageList = data
    },
    GETHISTORYMESSAGELIST(state,data) {   
        // console.log(getCache('historyMessageList'));
        if(Object.keys(data).length > 0){
            
            state.historyMessageList = data
        }
        
    },
    GETTITLE(state,data) {
        state.title = data
    }

};

const actions = {
    /**
     * 获取title 状态
     */
    async getTitle({commit}, data){
        let contactList = data.contactList.split(',')     
        let title = "闪电"
        let context = "新消息"    
        let user_id = store.state.user.userInfo.user_id;
        if (contactList.length > 0 && contactList.includes(user_id.toString()) === true) {
            context = "有人@我"
        }
        if (user_id == data.user_id) {
            commit("GETTITLE",title);
            return title;
        }
        if (Object.keys(data).length > 0) {
            title = '【'+ context + '】' + '闪电'
        }
        
        commit("GETTITLE",title);
        return title;
        

    },
   
    /**
     * 获取所有消息
     * @param {*} param0 
     * @param {*} data 
     * @returns 
     */

    async getGetMsg({commit}, data) {

        let parms = `${data.room_id}/${data.page}/${data.limit}`
        // 请求参数
        let result = await reqGetMsg(parms);
        if (result.code === 10000) {
            
            let list = result.data.list;

            const user_id = store.state.user.userInfo.user_id;
            let oldMsg = state.historyMessageList || []; 
            
            var tag = 0; // 0 自己发的  1 被人发的
            for (var i = 0; i < list.length; i++) {
                
                if (list[i].msg_form) {
                    if (user_id != list[i].msg_form) {
                        tag = 1;
                    } else {
                        tag = 0;
                    }
                    // url的处理
                    let msg = list[i].msg_content;
                    let pattern = /\b(https?:\/\/[^\s]+)/g;
                    let matches = msg.match(pattern); 
                    if (matches !== null) {   
                       
                        for (var urlKey=0;urlKey < matches.length;urlKey++) {
                        
                            msg = msg.replace(matches[urlKey], `<a href=${matches[urlKey]}>${matches[urlKey]}</a>`);
                            
                        }
                    }
                    let totalSize = list[i].file_size
                    let file_size =  totalSize/1024
                    
                    let messageList = {
                        "user_id": list[i].msg_form,
                        "tag":tag,
                        "nick_name":list[i].nick_name,
                        "msg":msg,
                        "room_id":list[i].room_id,
                        "seq":list[i].seq,
                        "send_time":list[i].send_time,
                        "userLogo":list[i].photo,
                        "content_type":list[i].content_type,
                        "file_name":list[i].file_name,
                        "original_file_name":list[i].original_file_name,
                        "fileSize":file_size.toFixed(2),
                        "totalSize":totalSize,
                        "md5":list[i].md5,
                        "total_chunks":list[i].total_chunks,
                        "upload_status":list[i].upload_status,
                        "location":list[i].seq,
                    }
                    
                    oldMsg.unshift(messageList)  
                                 
                }

            }

            let total = result.data.offTotal
            // if (total >= 0) {
            //     commit("GETOFFMSGTOTAL",total);
            // }
           

            commit("GETHISTORYMESSAGELIST",oldMsg);

            //用户已经登录成功且获取到token 
            return {msg:oldMsg,offTotal:total};
        } 

    },
    /**
     * 上传音频
     * @param {*} param0 
     * @param {*} data 
     * @returns 
     */
    async uploadAudio({commit}, data) {
        let result = await reqUploadAudio(data);
        if (result.code === 10000) {
            return result.data;
        } 
    },

    
    /**
     * 上传base64图片
     * @param {*} param0 
     * @param {*} data 
     * @returns 
     */
    async uploadBase64({commit}, data) {
        let result = await reqUploadBase64(data);
        if (result.code === 10000) {
            return result.data;
        } 
    },



    async uploadFiles({commit}, data) {
        let result = await reqUploadFiles(data);
        if (result.code === 10000) {
            return result.data;
        } 
    },

    async getMessage({commit}, data){
       
        if ( Object.keys(data).length > 0) {
            if (data.code == 20014 ) {
                next('/login');

            }
           
            const user_id = store.state.user.userInfo.user_id;
            
            var tag = 0; // 0 自己发的  1 被人发的
            if (user_id !== data.user_id ) {
              tag = 1;
            }
            let msg = data.sensitiveMsg;
            let pattern = /\b(https?:\/\/[^\s]+)/g;
            let matches = msg.match(pattern); 
            if (matches !== null) {   
                       
                for (var urlKey=0;urlKey < matches.length;urlKey++) {
             
                    msg = msg.replace(matches[urlKey], `<a href=${matches[urlKey]}>${matches[urlKey]}</a>`);
                    
                }
            }
            let totalSize  =  data.file_size
            let file_size = totalSize/1024
           
            let messageList = {
                "user_id": data.user_id,
                "tag":tag,
                "nick_name":data.nick_name,
                "msg":msg,
                "room_id":data.room_id,
                "seq":data.seq,
                "send_time":data.send_time,
                "userLogo":data.userLogo,
                "content_type":data.content_type,
                "file_name":data.file_name,
                "totalSize":totalSize,
                "original_file_name":data.original_file_name,
                "fileSize":file_size.toFixed(2),
                "md5":data.md5,
                "total_chunks":data.total_chunks,
                "upload_status":0,
                "location":data.location

            }

            console.log("getMessage服务端发过来了一个数据:",data);
            // 聊天记录
            commit("GETMESSAGELIST", messageList)

            return true;
        } 
    
    },
 

}

const getters = {

};
export default {
  state,
  mutations,
  actions,
  getters,
};



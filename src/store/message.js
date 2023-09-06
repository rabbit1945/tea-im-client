
// 导入api
import {
    reqOfflineMsg,
    reqhistoryMsg,
    reqUploadAudio
} from "@/api";
import { setCache, getCache,removeCache} from "@/utils/cache";
import store from "@/store";

const state = {
    messageList:[],
    offLineMessageList:[],
    historyMessageList:[],
   
  
};
// 
const mutations = {
   
    GETMESSAGELIST(state, data) {
        
        state.messageList = data

    },
    GETOFFLINEMESSAGELIST(state,data) {
        state.offLineMessageList = data

    },
    GETHISTORYMESSAGELIST(state,data) {
        // console.log(getCache('historyMessageList'));
        if(data.length > 0){
            state.offLineMessageList = []
        }
        state.historyMessageList = data


    },

};

const actions = {
    /**
     * 获取离线消息
     * @param {*} param0 
     * @param {*} data 
     * @returns 
     */
    async getOfflineMsg({commit}, data) {
        // 请求参数
        let result = await reqOfflineMsg(data);
        if (result.code == "10000") {
            
            let list = result.data;

            const user_id = store.state.user.userInfo.user_id;
            var receiveData = [];
            var tag = 0; // 0 自己发的  1 被人发的
            for (var i = 0; i < list.length; i++) {
               
                if (user_id != list[i].msg_form ) {
                    tag = 1;
                } else {
                    tag = 0;
                }

                let messageList = {
                    "user_id": list[i].msg_form,
                    "tag":tag,
                    "nick_name":list[i].nick_name,
                    "msg":list[i].msg_content,
                    "room_id":list[i].room_id,
                    "seq":list[i].seq,
                    "send_time":list[i].send_time,
                    "userLogo":list[i].photo,
                    "content_type":list[i].content_type,
                }
                
                receiveData.push(messageList)


            }

            commit("GETOFFLINEMESSAGELIST",receiveData);

            //用户已经登录成功且获取到token 
            return true;
        }

    },
    /**
     * 
     * @param {*} param0 
     * @param {*} data 
     * @returns 
     */
    async getHistoryMsg({commit}, data) {
        // 请求参数
        let result = await reqhistoryMsg(data);
        if (result.code == "10000") {
            
            let list = result.data.list;

            const user_id = store.state.user.userInfo.user_id;
            const oldMsg = state.historyMessageList;

            var receiveData = [];
            var tag = 0; // 0 自己发的  1 被人发的
            for (var i = 0; i < list.length; i++) {
                
               
                if (user_id != list[i].msg_form) {
                    tag = 1;
                } else {
                    tag = 0;
                }

                let messageList = {
                    "user_id": list[i].msg_form,
                    "tag":tag,
                    "nick_name":list[i].nick_name,
                    "msg":list[i].msg_content,
                    "room_id":list[i].room_id,
                    "seq":list[i].seq,
                    "send_time":list[i].send_time,
                    "userLogo":list[i].photo,
                    "content_type":list[i].content_type,
                }
            
                
                oldMsg.unshift(messageList)
            
            }
            
            console.log("receiveData:",oldMsg)
            commit("GETHISTORYMESSAGELIST",oldMsg);

            //用户已经登录成功且获取到token 
            return oldMsg;
        } 

    },
    async uploadAudio({commit}, data) {
        let result = await reqUploadAudio(data);
        console.log(result);
        if (result.code == "10000") {
            return result.data;
        } 
    },

    async getMessage({commit}, data){
        console.log("服务端发过来了一个数据:",data);
        if ( Object.keys(data).length > 0) {
            if (data.code == 20014 ) {
                next('/login');

            }
           
            const user_id = store.state.user.userInfo.user_id;
            
            var tag = 0; // 0 自己发的  1 被人发的
            if (user_id !== data.user_id ) {
              tag = 1;
            }

            let messageList = {
                "user_id": data.user_id,
                "tag":tag,
                "nick_name":data.nick_name,
                "msg":data.msg,
                "room_id":data.room_id,
                "seq":data.seq,
                "send_time":data.send_time,
                "userLogo":data.userLogo,
                "content_type":data.content_type,
            }
           
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



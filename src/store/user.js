

// 导入api
import {
    reqUserLogin,
    reqRoomInfo,
    reqRoomUserList,
    reqLogout

} from "@/api";
import { setCache, getCache,removeCache} from "@/utils/cache";

import { setToken, getToken,removeToken} from "@/utils/token";
//登录与注册的模块
const state = {
  code: "",
  userIsOnLine:"offline",
  token: getToken(),
  userInfo: {},
  roomInfo:{},
  roomUserList:[],
//   messageList:[],

};
// 
const mutations = {
    USERLOGIN(state, token) {
        state.token = token;
    },
    GETUSERINFO(state, userInfo) {
        state.userInfo = userInfo
        console.log(userInfo.is_online);
        state.userIsOnLine = userInfo.is_online
    },  
   
    GETROOMINFO(state, roomInfo) {
        state.roomInfo = roomInfo;
    },  
    ROOMUSERLIST(state, data) {
        state.roomUserList = data
    }

};

const actions = {

    // 登录业务
    async userLogin({ commit }, data) {
        // 请求参数
        let result = await reqUserLogin(data);
        if (result.code == 10000) {
            // 添加登录日志

            //用户已经登录成功且获取到token
            commit("USERLOGIN", result.data.token);
            //持久化存储token
            setToken(result.data.token);

            return true;

        } else {
            return Promise.reject(new Error("faile"));
        }
    },
    

    // 获取聊天室中用户列表
    async getRoomUserList({commit}, data) {
        // 请求参数
        let result = await reqRoomUserList(data);
        if (result.code == 10000) {
            commit("ROOMUSERLIST",result.data);
            return true;

        } else {
            return Promise.reject(new Error("faile"));

        }

    },
    //获取聊天室信息
    async getRoomInfo({ commit }) {
        let result = await reqRoomInfo();
        
        let code = result?.code;
        if (code == '10000') {
            
            let list = result?.data;
        
            //  //提交用户信息
            commit("GETUSERINFO", list?.userInfo);
            // 提交 聊天室的基本信息
            commit("GETROOMINFO", list?.roomInfo);
            
            return true;
        }else{
            
            return Promise.reject(new Error('faile'));
        }
    },
    // async getMessage({commit}, data){
    //     console.log("服务端发过来了一个数据:",data);
    //     if ( Object.keys(data).length > 0) {
    //         if (data.code == 20014 ) {
    //             next('/login');

    //         }
    //         const user_id = state.userInfo.user_id;
    //         var tag = 0; // 0 自己发的  1 被人发的
    //         if (user_id !== data.user_id ) {
    //           tag = 1;
    //         }

    //         let messageList = {
    //             "user_id": data.user_id,
    //             "tag":tag,
    //             "nick_name":data.nick_name,
    //             "msg":data.msg,
    //             "room_id":1,
    //             "send_time":data.send_time,
    //             "sender":data.sender,
    //             "userLogo":data.userLogo,
    //         }
               
    //          // 聊天记录
    //          commit("GETMESSAGELIST", messageList)

    //         return true;
    //     } else {
    //         console.log("聊天数据为空",data);
    //         return false;
    //     }
    
    // },
 
    //退出登录
    async userLogout({commit}) {
        //只是向服务器发起一次请求，通知服务器清除token
        let result = await reqLogout();
        
        //action里面不能操作state，提交mutation修改state
        if(result.code== '10000'){
            removeToken();
            commit("USERLOGIN",false);
            return true;
        }else{
            return Promise.reject(new Error('faile'));
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



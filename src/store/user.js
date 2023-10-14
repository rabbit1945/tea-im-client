

// 导入api
import {
    reqUserLogin,
    reqRoomInfo,
    reqRoomUserList,
    reqLogout,
    reqAuth,
    reqAuthLogin

} from "@/api";

import { setToken, getToken,removeToken} from "@/utils/token";
import { setCache, getCache,removeCache} from "@/utils/cookie";
//登录与注册的模块
const state = {
  code: "",
  userIsOnLine:"offline",
  token: getToken(),
  userInfo: {},
  roomInfo:{},
  roomUserList:[],
  isAuthLogin:false
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
    },
    ISAUTHLOGIN(state, data) {
        state.isAuthLogin = data
    }

};

const actions = {

    // 登录业务
    async userLogin({ commit }, data) {
        // 请求参数
        let result = await reqUserLogin(data);
        if (result.code === 10000) {
            // 添加登录日志
             
            //用户已经登录成功且获取到token
            commit("USERLOGIN", result.data.token);
            //持久化存储token
            setToken(result.data.token);
        } 
        return result;
    },

    /**
     * gitee 登录
     * @param {*} param0 
     * @param {*} data 
     * @returns 
     */
    async authLogin({ commit }, data) {
        let result = await reqAuthLogin(data);
        if (result.code == 10000) {
            console.log(result);
            //用户已经登录成功且获取到token
            commit("USERLOGIN", result.data.token);
            //持久化存储token
            setToken(result.data.token);
            //删除auth
            removeCache("isAuthLogin");
           
        } 
        return result;

    },

    /**
     * 授权
     * @param {*} param0 
     * @param {*} data 
     * @returns 
     */
    async getAuthLogin({ commit }, data) {
        let result = await reqAuth(data);
        if (result.code == 10000) {
            // 设置 Auth 标识
            setCache("isAuthLogin",true)
            return result.data;
        } else {
            return false;
        }

    },
    

    // 获取聊天室中用户列表
    async getRoomUserList({commit}, data) {
        // 请求参数
        let result = await reqRoomUserList(data);
        if (result.code == 10000) {
            commit("ROOMUSERLIST",result.data);
            return result.data;

        } 

    },
    //获取聊天室信息
    async getRoomInfo({ commit }) {
        let result = await reqRoomInfo();
        
        let code = result?.code;
        if (code === 10000) {       
            let list = result?.data;
            //  //提交用户信息
            commit("GETUSERINFO", list?.userInfo);
            // 提交 聊天室的基本信息
            commit("GETROOMINFO", list?.roomInfo);
            
            return true;
        }
    },
    //退出登录
    async userLogout({commit}) {
        //只是向服务器发起一次请求，通知服务器清除token
        let result = await reqLogout();
        //action里面不能操作state，提交mutation修改state
        if(result.code === 10000){
            // 删除 token
            removeToken();
            // 删除授权
            removeCache('isAuthLogin')
            commit("USERLOGIN",false);
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



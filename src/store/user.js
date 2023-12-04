

// 导入api
import {
    reqUserRegister,
    reqUserLogin,
    reqRoomInfo,
    reqRoomUserList,
    reqLogout,
    reqAuth,
    reqAuthLogin,
    reqRoomList

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
  isAuthLogin:false,
  roomList:{}
};
// 
const mutations = {
    USERLOGIN(state, token) {
        state.token = token;
    },
    GETUSERINFO(state, userInfo) {
        state.userInfo = userInfo
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
    },
    GETROOMList(state, data) {
        state.roomList = data
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

     // 注册
     async userRegister({ commit }, data) {
        // 请求参数
        let result = await reqUserRegister(data);
         
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
        let where = `${state.roomInfo.room_id}/${data.pages}/${data.size}`
        
        let result = await reqRoomUserList(where);
        if (result.code == 10000) {
            commit("ROOMUSERLIST",result.data);

            return result.data;
        } 
        return false;
    },

    //获取聊天室信息
    async getRoomInfo({ commit },id) {
        let result = await reqRoomInfo(id);
                let code = result?.code;
        if (code === 10000) {       
            let list = result?.data;
            //提交用户信息
            commit("GETUSERINFO", list?.userInfo);
            // 提交 聊天室的基本信息
            commit("GETROOMINFO", list?.roomInfo);
            
            return true;
        }
    return false;
    },

    async getRoomList({ commit }){
        let result = await reqRoomList();
        let code = result?.code;
        if (code === 10000) {  
            let list = result?.data;  
            commit("GETROOMList", list?.list);
            return list?.list;
        }
        return false;    
    },

    //退出登录
    async userLogout({commit}) {
        //只是向服务器发起一次请求，通知服务器清除token
        let result = await reqLogout();
        //action里面不能操作state，提交mutation修改state
        if(result.code === 10000){
            commit("USERLOGIN",false);
            // 删除 token
            removeToken();
            // 删除授权
            removeCache('isAuthLogin')
            return true;
        }
        return result;    
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



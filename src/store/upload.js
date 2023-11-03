
// 导入api
import {
    reqUploadMerge,
    reqcheckChunkExis,
    reqUploadChunk,
    reqUploadFiles,
    reqUploadPut
} from "@/api";
import { setCache, getCache,removeCache} from "@/utils/cache";
import store from "@/store";

const state = {
   
};
// 
const mutations = {
   
};

const actions = {


    
    /**
     * 检测文件状态
     * @param {*} param0 
     * @param {*} data 
     * @returns 
     */
    async checkChunkExis({commit}, data) {
        let result = await reqcheckChunkExis(data);
        if (result.code === 10000) {          
            return result.data;
        } else {
            return result;
        }     
    },



    /**
     * 上传分片
     * @param {*} param0 
     * @param {*} data 
     * @returns 
     */
    async uploadChunk({commit}, data) {
        let result = await reqUploadChunk(data);
        if (result.code === 10000) {
            return result.data;
        } 
        return false;
    },

    /**
     * 合并文件
     * @param {*} param0 
     * @param {*} data 
     * @returns 
     */
    async uploadMerge({commit}, data) {
        let result = await reqUploadMerge(data);
        if (result.code === 10000) {
            return result.data;
        } 

        return false;
    },

    
    async uploadFiles({commit}, data) {
        let result = await reqUploadFiles(data);
        if (result.code === 10000) {
            return result.data;
        } 
    },
    async uploadPut({commit}, data) {
        let result = await reqUploadPut(data);
        if (result.code === 10000) {
            return result.data;
        } 

        return false;
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



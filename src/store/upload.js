
// 导入api
import {
    reqUploadMerge,
    reqcheckChunkExis,
    reqUploadChunk,
    reqUploadFiles,
    reqUploadPut,
    reqCreateThumb,
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
        return result 
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
    /**
     * 生成縮略圖
     * @param {*} param0 
     * @param {*} data 
     * @returns 
     */
    async createThumb({commit}, data) {
        let result = await reqCreateThumb(data);
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



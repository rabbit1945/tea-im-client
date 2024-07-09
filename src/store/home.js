
// 导入api
import {
    reqEmojiList
} from "@/api";
import { setCache, getCache,removeCache} from "@/utils/cache";

const state = {
  "emojiList":JSON.parse(getCache('emoji'))
  
};
// 
const mutations = {
    EMOJILIST(state, data) {
        state.emojiList = data;
    }
};

const actions = {

   

}

const getters = {

};
export default {
  state,
  mutations,
  actions,
  getters,
};



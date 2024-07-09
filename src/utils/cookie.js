import Cookies from 'js-cookie'
//存储Cache
export const setCache = (name,data) => {
  Cookies.set(name,data)
};
//获取Cache
export const getCache = (name) => {
  return Cookies.get(name);
};

//清除本地存储的Cache
export const removeCache=(name)=>{
  Cookies.remove(name);
}

//存储Cache
export const setCache = (name,data) => {
  localStorage.setItem(name, data);
};
//获取Cache
export const getCache = (name) => {
  return localStorage.getItem(name);
};

//清除本地存储的Cache
export const removeCache=(name)=>{
   localStorage.removeItem(name);
}

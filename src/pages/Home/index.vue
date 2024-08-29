<template>
  <el-container style="display: flex; align-items: center; justify-content: center;">
    <div class="wrap">
      <!-- 路由组件出口的地方 -->
      
        <!--头部 -->
        <MsgTop :room = "roomInfo" />
        <!--用户基本信息 -->
        <MsgBase :userStatus="userStatus"/>
        
        <!-- 聊天记录 -->
        <Messages  :key="timer"/>
       
        <!-- 用户信息 -->
        <UserList :showUser="true" :key="timer+ '-userList'"  />
        <!-- 房间管理 -->
        <Room @roomUserList="roomUserList"></Room>
       
        <router-view></router-view>
    </div>
  </el-container>
</template>

<script>
//引入依赖
import MsgTop from './MsgTop';
import MsgBase from './MsgBase';
import Messages from './Messages';
import UserList from './UserList';
import Room from './Room';

export default {
  name: "Home",
  components: {
    MsgTop,
    MsgBase,
    Messages,
    UserList,
    Room,  
},
  data() {
    return {
      "user_id":this.$store.state.user.userInfo.user_id,
      "room_id":this.$store.state.user.roomInfo.room_id,
      "userList":this.$store.state.user.roomUserList,
      "roomInfo":this.$store.state.user.roomInfo,
      "msgList":this.$store.state.message.historyMessageList,
      "userStatus":"offline",
      "timer":""
    }
  },
  mounted() {
    this.$socket.open() 
    window.addEventListener("blur", this.onblur,true);
    window.addEventListener("focus", this.onfocus,true);
  },

  beforeDestroy () {
    this.$socket.close()
     //token失效从新登录
    
    window.removeEventListener("focus", this.onfocus,true);   
    window.removeEventListener("blur", this.onblur,true);


  },
  sockets: {
    async connecting () {
      console.log("Socket 正在连接");
    },
    async disconnect (reason) {
      console.log("Socket 断开",reason);
      if (this.$socket.connected === false) {
          this.userStatus = "offline"  
        
      }
          
    },
    async connect_error (error) {
      console.log("Socket 连接失败",error);
      if (this.$socket.connected === false) {
          this.userStatus = "offline"
         

      }

    },
    async connect () {
      console.log("Socket 连接成功");
      if (this.$socket.connected === true) {
          this.userStatus = "online"
          
      }

    },

    async error (error) {
        console.log("Socket错误:",error);
        console.log(this.$socket.connected);
        this.handleClose("服务器出错，请联系管理员！！！");
    },
 
       
},
methods: {
  roomUserList(val) {
    // 聊天室详情
    this.roomInfo = this.$store.state.user.roomInfo
    this.timer = this.roomInfo.room_id
    console.log(" this.timer", this.timer);
  },
  handleClose(error){
      this.$confirm(error,'错误',{
        confirmButtonText: '确定',
          type: 'error'
      })
        .then(_ => {
          this.$message({
            type: 'success',
            message: error
          });
        })
        .catch(_ => {});
  },
  onfocus(e){
      console.log('得到焦点');
      
      // this.$store.dispatch("getTitle", {
      //     "user_id":this.$store.state.user.userInfo.user_id,
      //     "contactList":""
      //   })
    },
    visibilitychange(e){
        console.log(document.visibilityState);
        let state = document.visibilityState
        if(state == 'hidden'){
            console.log(document.visibilityState,'用户离开了');
        }
        if(state == 'visible'){
            console.log(document.visibilityState,'回来了');       
        }
    },
    beforeunloadHandler(e) {
      e = e || window.event
      if (e) {
        e.returnValue = '关闭提示'
      }
      return '关闭提示'
    },
    
    onblur(e) {
      console.log('失去焦点');
    }
}

 
}


</script>


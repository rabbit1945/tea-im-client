<template>
    <div class="wrap">
      <!-- 路由组件出口的地方 -->
    
      <!--头部 -->
       <MsgTop/>
      
          <!--用户基本信息 -->
          <MsgBase :userStatus="userStatus"/>
          <!-- 聊天记录 -->
          <Messages/>
          <!-- 用户信息 -->
          <UserList :showUser="true" />
            
    
        <router-view></router-view>
    </div>
    

</template>

<script>
//引入依赖
import MsgTop from './MsgTop';
import MsgBase from './MsgBase';
import Messages from './Messages';
import UserList from './UserList';



export default {
  name: "",
  components: {
    MsgTop,
    MsgBase, 
    Messages,  
    UserList,
  },
  data() {
    return {
      "user_id":this.$store.state.user.userInfo.user_id,
      "room_id":this.$store.state.user.roomInfo.room_id,
      "userStatus":"offline"

    }
  },
  mounted() {
    this.$socket.open() 
    // window.addEventListener('visibilitychange',this.visibilitychange,true);
    // window.addEventListener('beforeunload', e => this.beforeunloadHandler(e))  
    window.addEventListener("blur", this.onblur,true);
    window.addEventListener("focus", this.onfocus,true);   

    
  },
  beforeDestroy () {
    this.$socket.close()
    // window.removeEventListener('visibilitychange', this.visibilitychange,true)
    // window.removeEventListener('beforeunload', e => this.beforeunloadHandler(e))
    window.removeEventListener("focus", this.onfocus,true);   
    window.removeEventListener("blur", this.onblur,true);

  },
  sockets: {
    async connecting () {
      console.log("Socket 正在连接");
    },
    async disconnect (reason) {
      console.log("Socket 断开",reason);
      console.log("disconnect是否连接服务端：",this.$socket.connected); // false
      if (this.$socket.connected === false) {
          this.userStatus = "offline"  
      }         
    },
    async connect_error (error) {
      console.log("Socket 连接失败",error);
      // alert("通信连接失败，请尝试刷新页面！！！")
      
      // this.handleClose("服务器连接失败！！！");
      // this.$socket.close()
      console.log("connect_error是否连接服务端：",this.$socket.connected); // false
      if (this.$socket.connected === false) {
          this.userStatus = "offline"

      }

    },
    async connect () {
      console.log("Socket 连接成功");
      console.log("connect是否连接服务端：",this.$socket.connected); // false
      if (this.$socket.connected === true) {
          this.userStatus = "online"

      }

    },
    async error (error) {
        console.log("Socket错误:",error);
        this.handleClose("服务器出错，请联系管理员！！！");
    }
       
},
methods: {
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
      
      this.$store.dispatch("getTitle", {
          "user_id":this.$store.state.user.userInfo.user_id,
          "contactList":""
        })
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


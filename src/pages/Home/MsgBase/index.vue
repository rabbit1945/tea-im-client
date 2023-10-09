 <template>
     <!-- 基础信息 -->
     <div class="base">
          <!-- 用户头像 -->
          <img class="userLogo" :src= "userLogo" alt="">
          <span class="userStatus" v-if = "userStatus == 'online'" style="background-color: blue;"></span>
          <span class="name">{{ nickName }}</span> 
          <img class="logout" @click = 'logout' src = "./images/logout.png" alt="">
    </div>
 </template>
  
  <script>
  //引入router
  import router from "@/router";
  export default {
    name: "MsgBase",
    data() {
      return {
        "nickName":this.$store.state.user.userInfo.nick_name,
        "userLogo": this.$store.state.user.userInfo.photo,
        "user_id":this.$store.state.user.userInfo.user_id,
        "room_id":this.$store.state.user.roomInfo.room_id
      }
    },
    props:['userStatus'],
   
    methods:{
    
      logout(){
        
        
        this.$confirm("请问是否退出账号？")
        .then(_ => {
        
          this.$store.dispatch('userLogout').then(res => {
            if (res === true) {
             
              this.$socket.close()
              this.$message({
                type: 'success',
                message: "账号登出成功！！！"
              });
              this.$router.push({name:'Login'});
            }
          })          
          
          
          
        })
        .catch(_ => {});
      }
    }
  }
  </script>
  
  <!-- Add "scoped" attribute to limit CSS to this component only -->
  <style scoped>
  .base {
    position: relative;
    width: 100px;
    height: 800px;
    min-height: 800px;
    float: left;
    border-right: 1px solid #fff;
    border-bottom-left-radius: 20px;
    background-color: cadetblue;

}

.userLogo {
    width: 40px;
    height: 40px;
    border-radius: 20px;
    margin: 40px 30px;


}


.logout {
    position: absolute;
    bottom: 10px;
    left: 20px;
    width: 40px;
    height: 40px;
    cursor: pointer;
   
}
.userStatus{
  position: absolute; 
  top: 65px;
  left: 60px;
  width: 6px;
  height: 6px;
  border-radius: 3px;
  background-color: grey;

}

.name {
    width: 70px;
    display: block;
    font-size: 15px;
    color: azure;
    margin: -35px 23px;
}
  </style>
  
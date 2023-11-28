 <template>
<el-aside class="base right_box" width="260px">
     <!-- 基础信息 -->
     <div >
          <!-- 用户头像 -->
          <img class="userLogo" :src= "userLogo" alt="">
          <span class="userStatus" v-if = "userStatus == 'online'" style="background-color: blue;"></span>
          <span class="name">{{ nickName }}</span> 
          <div class="bottom">
            <div  @click = "onClick('service')">
              <el-avatar :size="40"  src="/assets/images/gitee.png"></el-avatar>
            </div>
            <span  style="writing-mode: horizontal-tb;padding-right: 61px;  color: azure;">后端</span>

            <div  @click = "onClick('client')">
              <el-avatar :size="40" src="/assets/images/gitee.png"></el-avatar>
            </div>
            <span  style="writing-mode: horizontal-tb;padding-right: 61px;  color: azure;">前端</span>

            <div  @click = "onClick('yuque')">
              <el-avatar :size="40" src="/assets/images/yuque.png"></el-avatar>
            </div>
            <span  style="writing-mode: horizontal-tb;padding-right: 61px;  color: azure;">文档</span>

            <div  @click = 'logout'>
              <el-avatar :size="40" src="/assets/images/logout.png"></el-avatar>
            </div>
        
          </div>
         

        
    </div>
<!-- el-aside -->
  </el-aside>
  
  
 </template>
  
  <script>
  

  export default {
    name: "MsgBase",
    data() {
      return {
        "nickName":this.$store.state.user.userInfo.nick_name,
        "userLogo": this.$store.state.user.userInfo.photo,
        "user_id":this.$store.state.user.userInfo.user_id,
        "room_id":this.$store.state.user.roomInfo.room_id,
  
      }
    },
    props:['userStatus'],
    components: {
      

    },
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
      },
      onClick(type) {
        if (type == 'client') {
          window.location.href = 'https://gitee.com/gzy1991/tea-im-client'
        }

        if (type == 'service') {
          window.location.href = 'https://gitee.com/gzy1991/tea-im-service'
        }

        if (type == 'yuque') {
          window.location.href = 'https://www.yuque.com/yiyan-2j8fb/iugs0e'
        }
        
      }
    }
  }
  </script>
  
  <!-- Add "scoped" attribute to limit CSS to this component only -->
  <style scoped>



  .base {
    position: relative;
    height: 800px;
    min-height: 800px;
    float: left;
    border-right: 1px solid #fff;
    border-bottom-left-radius: 20px;
    background-color: cadetblue;
    z-index: 1;
   overflow: hidden;

}

.right_box {
  flex: 1;
}
.userLogo {
    width: 40px;
    height: 40px;
    border-radius: 20px;
    margin: 40px 30px;


}

.bottom {
    position: absolute;
    bottom: 0px;
    left: 20px;
    cursor: pointer;
  
}

.bottom span {
  margin-top: 10px;
}


.logout {
   
    width: 40px;
    height: 40px;
   
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
  
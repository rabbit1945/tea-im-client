 <template>
     <el-header  class="top" style="height: 60px;width:1221px;">
      
            <span class="chatRoomName">{{ room.roomName }}</span>
            <span class="peopleNumber">
               在线 {{ room.countOnline }} 人
            </span>
</el-header>
 </template>
  
  <script>
  //引入store
  // import store from "@/store";
  export default {
    name: "MsgTop",
    data() {
      return {
        
       }
    },
props: ['room']
  
  }
  </script>
  
  <!-- Add "scoped" attribute to limit CSS to this component only -->
  <style scoped>
  /* 头部 */
  .top {
    line-height: 50px;
    border-top-left-radius: 20px;
    border-top-right-radius: 20px;
    background-color: cadetblue;

  }
  </style>
  
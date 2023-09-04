 <template>
     <div class="top">
            <span class="chatRoomName">{{ roomName }}</span>
            <span class="peopleNumber">
               在线 {{ isOnlineNum }} 人
            </span>

        </div>
 </template>
  
  <script>
  //引入store
  // import store from "@/store";
  export default {
    name: "MsgTop",
    data() {
      return {
        "roomName":this.$store.state.user.roomInfo.roomName,
        "isOnlineNum":this.$store.state.user.roomInfo.countOnline
       }
    }
  }
  </script>
  
  <!-- Add "scoped" attribute to limit CSS to this component only -->
  <style scoped>
  
  </style>
  
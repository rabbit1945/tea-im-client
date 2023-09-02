 <template>
     <div class="top">
            <span class="chatRoomName">{{ roomName }}</span>
            <span class="peopleNumber">
               在线 {{ userList.isOnlineNum }} 人
            </span>

        </div>
 </template>
  
  <script>
  //引入store
  import store from "@/store";
  export default {
    name: "MsgTop",
    data() {
      return {
        "roomName":store.state.user.roomInfo.roomName,
        "userList":store.state.user.roomUserList

      }
    }
  }
  </script>
  
  <!-- Add "scoped" attribute to limit CSS to this component only -->
  <style scoped>
  
  </style>
  
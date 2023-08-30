 <template>
     <div class="top">
            <span class="chatRoomName">{{ RoomName }}</span>
            <span class="peopleNumber">
                1/1
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
        "RoomName":store.state.user.roomInfo.roomName
      }
    }
  }
  </script>
  
  <!-- Add "scoped" attribute to limit CSS to this component only -->
  <style scoped>
  
  </style>
  
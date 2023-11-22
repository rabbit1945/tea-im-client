 <template>
  <el-footer class="footer" direction = "vertical" width="100px" height="800px"  >
  
    <ul  class="list" v-bind="message">
 
      <li v-for="val in list" class="list-line"  @click="selectRoom(val.room_id)"  >
       
        <div>
          <el-badge  :max=max class="item" v-if="selectRoomId === val.room_id" >
            <el-button size="small" style = "color: cadetblue;">
              {{ val.name }}            
            </el-button>           
          </el-badge>
        </div>

        <div v-if="selectRoomId != val.room_id">
          <el-badge :value="val.off_delivered_count+msgNumList[val.room_id]" :max=max  class="item">
            <el-button size="small"> {{ val.name }}</el-button>
          </el-badge>
        </div>
      </li>
    
    </ul>
   
  </el-footer>
 
 </template>
  <script> 
  import { setCache, getCache,removeCache} from "@/utils/cookie";

  const synth = window.speechSynthesis;
  const speech = new SpeechSynthesisUtterance();
  const voices = speechSynthesis.getVoices();
     export default {
      name:"Room",
      data () {
        return {
          list:[],  
          selectRoomId: 1,
          wsmessageList:[],
          room_id:this.$store.state.user.roomInfo.room_id, // 房间ID
          max:140,
          msgNum:0,
          msgNumList:getCache('roomNum')?JSON.parse(getCache('roomNum')):[]

        }
      },

      props:[],
    
      mounted(){    
        this.$store.dispatch('getRoomList').then(res => {
          if (res) {
              this.list = res
          } else {
            this.$alert('没有获取到房间列表')
          }

        });
         
      },
      methods: {
        async selectRoom(room_id){
          this.$store.dispatch('getRoomInfo',room_id).then(res => {          
            if (res) {       
                this.$store.dispatch('getRoomUserList',{'pages':1,'size':100}).then(res => {
                  if (res === false) {
                    this.$alert("用户列表请求失败")
                  }
                  console.log("room_id",room_id)
                 
                  this.$emit('roomUserList',res);  
                })   
                this.selectRoomId = room_id
               
            } else {
              this.$alert("聊天室信息请求失败")
            }
          })
          
        }

      },
      computed:{
        message:{
          get() {
            let offMessageList = this.$store.state.message.offMessageList;
            let roomList = this.$store.state.user.roomList ;
            
            if (offMessageList) {
              let room_id = offMessageList.room_id
              
              if (typeof(this.msgNumList[room_id]) === "undefined") {
                
                this.msgNum = 0
               
              }

              for (let index = 0; index < roomList.length; index++) {
              
                if (roomList[index].room_id != this.selectRoomId) {
                 
                  if (roomList[index].room_id == room_id) {
                    
                    this.msgNum ++
                    this.msgNumList[room_id] =  this.msgNum

                  }
                 
                }
              }

              setCache('roomNum',JSON.stringify(this.msgNumList))
             
              console.log("wsoffmessageList1::", this.msgNumList )
                         
            }
            
          
          }
        }
      }

    }
  </script>
  
  <!-- Add "scoped" attribute to limit CSS to this component only -->
  <style scoped>
.footer{
    width: 170px;
    background: aliceblue;
    position: absolute;
    left: 89px;
    box-sizing: border-box;
    flex-shrink: 0;
    top: 60px;
    z-index: 1;
  }


  
  .list {
    position:relative;
    cursor: pointer;
    margin: 10px;
  }
  .list-line {
    margin: 15px 0px;
    list-style-type:none;
  }
  .list-line:hover {
    color: #409eff;
  }
    
  </style>
  
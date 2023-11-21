 <template>
  <el-footer class="footer" direction = "vertical" width="100px" height="800px">
  
    <ul  class="list">
      <li v-for="val in list" class="list-line"  @click="selectRoom(val.room_id)"  >
       
        <div v-if="selectRoomId === val.room_id" style = "color: cadetblue;">
          {{ val.name }}
        </div>
        <div v-if="selectRoomId != val.room_id">
          {{ val.name }}
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
          selectRoomId: 1

        }
      },

      props:[],
      computed: {
       
        
      },
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
    margin: 15px;
    list-style-type:none;
  }
  .list-line:hover {
    color: #409eff;
  }
    
  </style>
  
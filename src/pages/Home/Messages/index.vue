 <template>
    <!-- 聊天区域 -->
    
   
      <div class="message"  v-bind="message" >
        <!-- 接收到的消息 -->
        <!-- <span v-if = "isLoading === true" class='time-line'>正在加载 </span> -->
        <div  class = "msg-list" ref="returnTop" @mousewheel="handleScroll($event)">
          <div  v-for="val in historyMessageList" >
            <span class='time-line'>{{ val.send_time }} </span>
            <div :class= "val.tag == 1 ? 'userInfo' : 'my-userInfo' "> 
              
                <h4>{{ val.nick_name}}</h4>
                <a  href='#' :class = "val.tag == 1 ? 'userInfo-logo' : 'my-userInfo-logo'" >
                  <img :src=val.userLogo>
                </a>
                <div class="msg-frame">{{ val.msg }}</div>
                
            </div>

          </div>

          <!-- 离线消息 -->
          <span v-if = "offLineMessageList != false" class='time-line'>以下为新消息 </span>

          <div  v-for="val in offLineMessageList">
            <span class='time-line'>{{ val.send_time }} </span>
            <div :class= "val.tag == 1 ? 'userInfo' : 'my-userInfo' "> 
              
                <h4>{{ val.nick_name}}</h4>
                <a  href='#' :class = "val.tag == 1 ? 'userInfo-logo' : 'my-userInfo-logo'" >
                  <img :src=val.userLogo>
                </a>
                <div class="msg-frame">{{ val.msg }}</div>
                
            </div>

          </div>
          <!-- ws交互的消息 -->
          <div v-for="val in wsmessageList" >
            <span class='time-line'>{{ val.send_time }} </span>
            <div :class= "val.tag == 1 ? 'userInfo' : 'my-userInfo' "> 
              
                <h4>{{ val.nick_name}}</h4>
                <a  href='#' :class = "val.tag == 1 ? 'userInfo-logo' : 'my-userInfo-logo'" >
                  <img :src=val.userLogo>
                </a>
                <div class="msg-frame">{{ val.msg }}</div>
                
            </div>

        </div>
      </div>   

          <MsgSend v-on:enter="enter"/>
      
      </div>
     

 </template>

  
  <script>
  import MsgSend from '../MsgSend';
  

    export default {
      name: "Message",
      data() {
        return {  
          wsmessageList: [], // ws 消息
          historyMessageList:false,//获取在线消息
          offLineMessageList:false,  // 获取离线    
          tabshow: false,//是否进行某种操作
          room_id:this.$store.state.user.roomInfo.room_id,
          isLoading :false,
          isEnd :false,
          oldScrollTop:0,
        }
      },
      props: {
      
      },
      mounted(){
        window.addEventListener("scroll", this.handleScroll, true);
      },
      destroyed() { //离开这个界面之后，删除滚动事件，不然容易除bug
        window.removeEventListener('scroll', this.handleScroll)
      },
    
      methods:{

        enter(val){
          if (val) {
            const scrollHeight=this.$refs.returnTop.scrollHeight;
            const deviceHeight = this.$refs.returnTop.clientHeight;
            
            this.$nextTick(() => {
              this.$refs.returnTop.scrollTop = scrollHeight 
            })
          }
          
        },
        handleScroll(e) {
         
          let direction = e.deltaY > 0 ? 'down':'up';  //deltaY为正则滚轮向下，为负滚轮向上
          
          if (direction == 'up' && e.deltaY >= -1 && !this.isLoading && !this.isEnd) {
            
            this.isLoading = true;
            this.$store.dispatch('getHistoryMsg',{
              room_id:this.room_id,
              seq:this.minSeq
            }).then(res => {
              this.isLoading = false;
              if(res.length <= 0) {
                this.isEnd = true;
              }
            });
          } 
        }
      },

      computed: {
       
        message: {
          get() {
            let offLineMessageList = this.$store.state.message.offLineMessageList;
            let historyMessageList = this.$store.state.message.historyMessageList;
            let wsmessageList = this.$store.state.message.messageList; 
            let minSeq = this.$store.state.message.minSeq
            this.wsmessageList = wsmessageList;   
            this.offLineMessageList = offLineMessageList;     
            this.historyMessageList = historyMessageList;
            this.minSeq = minSeq; 
          }
        }
      },
      components: {
        MsgSend,
      }
    }
  </script>
  
  <!-- Add "scoped" attribute to limit CSS to this component only -->
  <style scoped>

 
  
    .message {
      position: relative;
      width: 700px; 
      height: 600px;
      background-color: floralwhite;
      border: 1px solid rgba(245,245,245,.7);
      float: left;
     
      
    }
    
    .msg-list {
      overflow: scroll;  
      height: 440px;

    }

    /* .msg {
      position:relative;
    } */

    
    .msg-frame {
      margin-left: 40px;
      min-width: 30px;
      max-width: 500px;
      min-height: 30px;
      border: 1px;
      border-radius: 10px;
      background-color: white;
      word-break: break-all;
      word-wrap: break-word;
      /*但在有些场景中，还需要加上下面这行代码*/
      white-space: normal;
      overflow: scroll
    }

    .my-userInfo  .msg-frame {
      margin-left: 140px;
      text-align: right;
      background-color: cornflowerblue;
      
    }

  .userInfo-logo img {
      height:40px;
      width: 40px;
      border-radius:20px;

  }
  .userInfo-msg textarea {
    
      width: 400px;
      max-height: 50px;
      padding: 10px ;
      border-radius: 10px;
      background-color: aquamarine;

  }

  .userInfo {
      position: relative;
      margin-left: 20px;
  }

  .userInfo-msg {
      position: absolute;
      top:-52px;
      left: -13px;
  }


  .userInfo-logo img {
      height:40px;
      width: 40px;
      border-radius:20px;
      margin-top: 10px;

  }
  .userInfo-msg textarea {
    
      width: 400px;
      max-height: 50px;
      padding: 10px ;
      border-radius: 10px;
      background-color: aquamarine;

  }



  .my-userInfo {
      position: relative;
      margin-right: 20px;
  }
  .my-userInfo-msg {
      position: absolute;
      top: -12px;
      right: 52px;
  }

  .my-userInfo h4 {
      text-align: right;

  }


  .my-userInfo-logo img {
      float: right;
      height:40px;
      width: 40px;
      border-radius:20px;

  }
  .my-userInfo-msg textarea {
    
      width: 400px;
      max-height: 50px;
      padding: 10px ;
      border-radius: 10px;
      background-color: aquamarine;

  }


  .time-line {
     
      display: inline-block;
      width: 700px;
      text-align: center;
      vertical-align: middle;
  }
</style>
    
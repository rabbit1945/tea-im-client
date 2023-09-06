 <template>
    <!-- 聊天区域 -->   
      <div class="message" v-bind="message"  >
         <!-- 接收到的消息 -->
         <span v-if = "isLoading === true" class='time-line'>正在加载 </span>
         
          <virtual-list
          ref = "returnTop"
            class="msg-list"
            :data-key="'seq'"
            :data-sources="historyMessageList"
            :data-component="itemComponent"
            :keeps =20
            :estimate-size= 50
            @totop = "totop"
            :start = 100
           
          />  

          <MsgSend/>
      
      </div>
     

 </template>

  
  <script>
  import virtualList from 'vue-virtual-scroll-list'

  import MsgSend from '../MsgSend';
  import Item from '../Item';


    export default {
      name: "Message",
      data() {
        return {  
          // wsmessageList: [], // ws 消息
          historyMessageList:{},//获取在线消息
          offLineMessageList:false,  // 获取离线    
          tabshow: false,//是否进行某种操作
          room_id:this.$store.state.user.roomInfo.room_id,
          isLoading :false,
          isEnd :false,
          page:0,
          limit:20,
          timer: 0,
          itemComponent: Item,
          
        }
      },
      props: {
      
      },
      mounted(){
       
        // window.addEventListener("scroll", this.handleScroll, true);
        this.initLoadMsg()
      },
      destroyed() { //离开这个界面之后，删除滚动事件，不然容易除bug
        // window.removeEventListener('scroll', this.handleScroll,true)
      },
    
      methods:{
        totop(){
          this.getdata(); 
        },
        

        getdata() {
          if (!this.isEnd  && !this.isLoading ) {
           this.initLoadMsg();
          }  
        },

        initLoadMsg() {
            this.page++;
            this.isLoading = true;
            this.$store.dispatch('getHistoryMsg',{
                  room_id:this.room_id,
                  page:this.page,
                  limit:this.limit
                }).then(res => {
                  console.log(res)
                  this.$nextTick(()=>{
                    this.isLoading = false;
                    if(!res) {
                      this.isEnd = true;
                    }
            
                  })
                  
                });
        }
      },
     
      computed: {
       
        message: {
          
          get() {
            let offLineMessageList = this.$store.state.message.offLineMessageList;
            let historyMessageList = this.$store.state.message.historyMessageList;
            let wsmessageList = this.$store.state.message.messageList; 
            this.offLineMessageList = offLineMessageList;     
            this.historyMessageList = historyMessageList;
            this.historyMessageList.push(wsmessageList);
            
           
          }
        }
      },
      components: {
        MsgSend,
        virtualList

      }
    }
  </script>
  
  <!-- Add "scoped" attribute to limit CSS to this component only -->
  <style scoped>
  
  .msg-info {
    height: 85px;
  }
 
  
    .message {
      position: relative;
      width: 700px; 
      height: 600px;
      background-color: white;
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
    
 <template>
    <!-- 聊天区域 -->   
      <div class="message" v-bind="message"  >
         <!-- 接收到的消息 -->
         <span v-if = "isLoading === true" class='time-line'>历史消息</span>       
          <virtual-list
            ref = "returnBottom"
            class="msg-list"
            :data-key="'seq'"
            :data-sources="historyMessageList"
            :data-component="itemComponent"
            :keeps =this.keeps
            :estimate-size= this.estimateSize
            @totop = "totop"
            @tobottom = "bottom"
            @scroll = "onScroll"
            :start = 100  
          />  
          <el-badge v-if = "msgNum > 0 && isBottom === false" :value=msgNum  class="item msg-badge">
            <el-button @click = "getLocation" size="small" icon = "el-icon-arrow-down">最新消息</el-button>
          </el-badge>
          <el-badge  v-if = "msgNum > 0 && isBottom === true" :value=msgNum 
           
            class="item msg-badge" 
            style="margin-top:-430px;">
            <el-button  @click = "getLocation" size="small" icon = "el-icon-arrow-up">最新消息</el-button>
          </el-badge>
          <MsgSend :proTitle = "title" @findNewMsg = "findNewMsg"/>     
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
          historyMessageList:[],//获取在线消息
          tabshow: false,//是否进行某种操作
          room_id:this.$store.state.user.roomInfo.room_id,
          isLoading :false,
          isEnd :false,
          page:0,
          limit:20,
          timer: 0,
          itemComponent: Item,
          estimateSize:50,
          keeps:30,
          msgNum:0,
          isBottom:false
        }
      },
      props:['title'],
    
      mounted(){

        this.$store.state.message.historyMessageList= null
        // window.addEventListener("scroll", this.onScroll, true);
        // 初始化条数
        this.initLoadMsg()
       
      },
      destroyed() { //离开这个界面之后，删除滚动事件，不然容易除bug
        // window.removeEventListener('scroll', this.onScroll,true)
      },
    
      methods:{
        getLocation(e){
          let div=this.$refs.returnBottom;
          console.log("getLocation",this.page*this.limit-this.msgNum);
          let location = this.page*this.limit-this.msgNum
          if (this.isBottom === true) {
            location =  location -10
          } 
          div.scrollToIndex(location);
          this.msgNum = 0
          this.isBottom = false
        },
        onScroll(e){
          let div=this.$refs.returnBottom;
          let getOffset = div.getOffset();
          
          if (this.page >1 ) {
            this.msgNum = 0;
          }
        },
        findNewMsg(val) {
            if (Object.keys(val).length > 0) {
              this.$nextTick(() => {
              if (val.sendUserId == val.userId ) {
                let div=this.$refs.returnBottom;
                div.reset()
                div.scrollToBottom();
                this.isBottom = true;
                this.msgNum = 0;
              } else {
                // 记录其他用户发送的消息数量
                this.isBottom = false
                this.msgNum ++
                console.log(this.msgNum, this.isBottom);

              }
              
            })
          }
          
      },
      
      totop(){
        console.log("到顶了");
        this.getdata()

      },
      bottom(){
        this.isBottom = true
        let offTotal =  this.msgNum
        if (offTotal >= 10) {
          this.msgNum = offTotal
        }
        console.log("到底了");
      },
      
      getdata() {
        if (!this.isEnd  && !this.isLoading ) {
          this.initLoadMsg();
        }  
      },

        initLoadMsg() {
            this.page++;
            this.isLoading = true;
            let div = this.$refs.returnBottom;
            
            this.$store.dispatch('getGetMsg',{
                  room_id:this.room_id,
                  page:this.page,
                  limit:this.limit
                }).then(res => {
                  this.$nextTick(()=>{
                    this.isLoading = false;
                    if(!res.msg) {
                      this.isEnd = true;
                    }
                    if (this.page == 1) {
                      //刷新滚动条到最近一页
                      div.reset()
                      div.scrollToBottom();
                      this.isBottom = true
                      this.msgNum = res.offTotal
                    } 
                   

                  })
                  
                });
        }
      },
     
      computed: {
       
        message: {
          
          get() {
        
            let historyMessageList = this.$store.state.message.historyMessageList || [];
            let wsmessageList = this.$store.state.message.messageList; 
            this.historyMessageList = historyMessageList;
            if (wsmessageList) {
              this.historyMessageList.push(wsmessageList);
            }  
            console.log(this.historyMessageList);  
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
  .msg-badge {
    float: right;
    margin-right: 10px;
    margin-top:-40px;
   
  }
</style>
    
 <template>
    <div>
  <el-main class="message el-main " v-bind="message" >

         <!-- 接收到的消息 -->
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
            v-on:composeFile = 'composeFile' 
          />  
  </el-main>
  <el-footer style="margin-top:2px;">
          <el-badge v-if = "msgNum > 0 && isBottom === false" :value=msgNum  class="item msg-badge-down">
            <el-button @click = "getLocation" size="small" icon = "el-icon-arrow-down">最新消息</el-button>
          </el-badge>
          <el-badge  v-if = "msgNum > 0 && isBottom === true" :value=msgNum 
            class="item msg-badge-up">
            <el-button  @click = "getLocation" size="small" icon = "el-icon-arrow-up">最新消息</el-button>
          </el-badge>
          <MsgSend :proTitle = "title" @findNewMsg = "findNewMsg" />     
          <div id="myAlertBox"  class= "alertBox" style="display:none"></div>
</el-footer>

    
      </div>
 </template>
  <script>
  import virtualList from 'vue-virtual-scroll-list'
  import { setCache, getCache,removeCache} from "@/utils/cookie";
  let roomNum = getCache('roomNum')?JSON.parse(getCache('roomNum')):[]
  import MsgSend from '../MsgSend';
  import Item from '../Item';
    export default {
      name: "Message",
      data() {
        return {  
          historyMessageList:[],//获取消息
          wsmessageList: [],
          tabshow: false,//是否进行某种操作
          user_id:this.$store.state.user.userInfo.user_id, // 用户ID
          room_id:this.$store.state.user.roomInfo.room_id,
          isLoading :false,
          isEnd :false,
          page:0,
          limit:20,
          timer: 0,
          itemComponent: Item,
          estimateSize:50,
          keeps:20,
          msgNum:0, 
          isBottom:false,
          totalNum:0,
        }
      },
      props:['title'],
      sockets: {
          // 分块回调
          async chunkFileCallback (res) {
            if (res.code == 10000) {
              let data = res.data
              data.isChunk = true
              if (data.uploadStatus == 1) {
                this.updateStatus(data);
              } 
                 } else {
              return this.$alert(res.msg)
            }
                     },
          // 更新状态
          async updateMsgStatusCallback(val) {      
            let list = val.data     
            if (val.code !== 10000 ) {
              this.updateStatus(val.data);
            } else {
              let wsmessageList = this.wsmessageList  
              if (list.uploadStatus == 1){
                  // 返回变成上传成功状态
                  wsmessageList.upload_status = 1       
                  console.log("updateMsgStatusCallback::",val);   
                  this.composeFile(list);   
              } else {
                wsmessageList.upload_status = list.uploadStatus
              }

            }
            return true;
          },
          /**
           * 合并
           */
          async mergeFileCallback (res)  {
              let data = res.data
              let list =  {
                    "room_id":this.room_id,
                    "identifier":data.identifier,
                    "newFileName":data.newFileName,
                    "totalChunks":data.totalChunks,
                    'mergeNumber':data.mergeNumber,
                    "totalSize":data.totalSize,    
                    "uploadStatus":data.uploadStatus,
                    "seq":data.seq
              } 
             
              if (res.code !== 10000 ) {
                
                list.uploadStatus = 4
                
              } 

              console.log("mergeFileCallback:::",list);

              this.updateStatus(list);   
              return true

          },
          /**
           * 撤回消息
           * @param {*} val 
           */
          async revokeMsgCallback(val) {     
              let list = val.data  
              if (val.code === 10000 ) {
                
                console.log("source::", list)
                let data = this.historyMessageList[list.index]
                data.is_revoke = 1
                this.historyMessageList[list.index] = data
                console.log("historyMessageList:",data);  
                
              } else {
                this.$alert("请稍后重试")
              }
          }


      },
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

        /**
         * 请求后端合并文件
         * @param fileMd5 文件md5
         * @param fileName 文件名称
         * @param count 文件分片总数
         */
       async composeFile(data) {                
          let list = {
              "seq":data.seq,
              "room_id":this.room_id,
              "user_id":this.user_id,
              "identifier":data.identifier,
              "newFileName":data.newFileName,
              "totalChunks":data.totalChunks,
              'mergeNumber':0,
              "totalSize":data.totalSize,
              "chunkSize":Math.ceil(data.totalSize / data.totalChunks) 
          }
          list.uploadStatus = 2
          await  this.$socket.emit('mergeFile',list);   
        },
        /**
         * 更新状态
         * @param {*} data 
         */

        updateStatus(data)
        {
            this.$socket.emit('updateMsgStatus',{
                "room_id":this.room_id,
                "user_id":this.user_id,
                "identifier":data.identifier,
                "newFileName":data.newFileName,
                "uploadStatus":data.uploadStatus,
                "totalChunks":data.totalChunks,
                "chunkNumber":data.chunkNumber,
                "totalSize":data.totalSize,
                "seq":data.seq,
                "isChunk":data.isChunk                                  
            }); 

           
        },
        /**
         * 未读消息定位
         * @param {*} e 
         */
        getLocation(e){
          let returnBottom =this.$refs.returnBottom;
          let location = this.keeps
          if (this.totalNum > this.msgNum) {
            location = this.totalNum-this.msgNum
          }
        
          if (this.isBottom === true) {
            location =  location -10
          } 
          returnBottom.scrollToIndex(location);
          this.msgNum = 0
          this.isBottom = false
          // 删除未读消息参数
          roomNum[this.room_id] = 0
          setCache('roomNum',JSON.stringify(roomNum))
        },

        onScroll(e){
          if (this.page >1 ) {
            this.msgNum = 0;
          }
        },
        findNewMsg(val) {
           
            if (val.room_id === this.room_id) {
              if (Object.keys(val).length > 0) {
                this.$nextTick(() => {
                    if (val.sendUserId == val.userId ) {
                      let div=this.$refs.returnBottom;
                      div.reset()
                      div.scrollToBottom();
                      this.msgNum = 0;
                      this.isBottom = true;
                    } else {
                      // 记录其他用户发送的消息数量
                      this.isBottom = false
                      this.msgNum ++
                   
                    }
                
                 })

                 return this.msgNum;

              }
           
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
                if(!res) {
                    this.isEnd = true;
                } else {

                  this.$nextTick(()=>{
                      this.isLoading = false;
                     if (this.page == 1) {
                        //刷新滚动条到最近一页
                        div.reset()
                        div.scrollToBottom();
                        this.isBottom = true
                        this.msgNum = res.offTotal + roomNum[this.room_id]
                        console.log("this.msgNum::",this.msgNum)
                      } 
                
                  })
                }
                
                
          });
        }
      },
     
      computed: {    
        message: {      
          get() {
            let historyMessageList = this.$store.state.message.historyMessageList || [];
            let wsmessageList = this.$store.state.message.messageList;
            this.historyMessageList = historyMessageList;
            console.log("historyMessageList::",historyMessageList)
            if (wsmessageList) {
              this.wsmessageList = wsmessageList
              this.totalNum = this.historyMessageList.length
            }  
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
      background-color: white;
      height: 800px;
      overflow: hidden;
    }
    
    .msg-list {
    position: relative;
    height: 800px;
    width: 800px;
        overflow: auto;  
    
    }

    .el-main {
      padding: 2px;
    }

    
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
      overflow: auto
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

  .msg-badge-down {
    position: absolute;
    right: 190px;
    bottom: 65px;
      
  }

  .msg-badge-up {
    position: absolute;
    top: 70px;
    right: 190px;
    
  }

</style>
    
<template>
    <div :index = index  >
        <span class='time-line'>{{ this.source.send_time }} </span>
        <div  :class = "this.source.tag == 1 ? 'stream-item' : 'stream-item creator'" v-if = "this.source.is_revoke == 0">
            <div :class = "this.source.tag == 1 ? 'item' : 'item creator'">
                <div class="avatar">
                    <img :src=this.source.userLogo>
                </div>
                <div class = "body" >
                    <div :class = "this.source.tag == 1 ? 'name' :'name transform' ">{{ this.source.nick_name }}</div>
                    <div class = "content" ref = "content" :data-isRevokeHidden=isRevokeHidden>
                                        
                        <div contenteditable = "false" class="text"  v-if = "this.source.content_type === 0"  >
                        
                            <div  @contextmenu.prevent="onContextmenu"  >
                                <div ref="textMsg" v-html="this.source.msg" class="msg-html" ></div>
                            </div>    
                        </div>
                        <!-- 音频 -->
                        <div contenteditable = "false" class="text" v-if = "this.source.content_type === 1">
                            <div  @contextmenu.prevent="onContextmenu"   >
                                <av-bars
                            
                                :canv-height ="30"
                                :audio-src=this.source.msg>
                                </av-bars>
                            </div>
                        </div>
                        <!-- 图片 -->
                        <div contenteditable = "false" class="text" v-if = "this.source.content_type === 2">
                            <div  @contextmenu.prevent="onContextmenu"   >
                                <el-popover
                            
                                placement="left"  
                                class="vedio"
                                trigger="click">
                                <img  :src=this.source.msg>
                                <img  slot="reference" style="max-width: 800px;max-height: 800px;" :src=this.source.msg>
                                </el-popover>
                            </div>                
                        </div>
                        <!-- 文件 -->
                        <div @click="down()"   contenteditable = "false" class="text file" v-if = "this.source.content_type === 3">
                            <div  @contextmenu.prevent="onContextmenu">
                                <div>
                                    {{ this.source.original_file_name }}
                                    <a :href=this.source.msg ref = "downFile" style="display: none;"></a>
                                </div>
                                <div class="fileSize" contenteditable="false"> {{ this.source.fileSize }}KB</div>
                                <div class="upload_status">
                                    <span v-if=" this.source.upload_status === 0">上传中</span>
                                    <span v-if=" this.source.upload_status === 1">上传成功</span>
                                    <span v-if=" this.source.upload_status === 2">发送中</span>
                                    <span v-if=" this.source.upload_status === 3">发送成功</span>  
                                    <span v-if=" this.source.upload_status === 4">发送失败</span>                               
                                </div>
                                <div class="fileImg"> <img src="/assets/images/文件.png"/></div>
                            </div>   
                        </div>

                         <!-- 视频 -->
                         <div contenteditable = "false"  class="text" v-if = "this.source.content_type === 4">
                            <div  @contextmenu.prevent="onContextmenu"  >
                                <el-popover
                                placement="left"   
                                class="vedio"
                                trigger="click">
                                <video controls class="popover-vedio">
                                    <source :src="this.source.msg" />
                                </video>
                                <img src="/assets/images/vedio.png" style="max-width: 400px;max-height: 400px;" slot="reference"/>
                                <!-- <el-button slot="reference">{{ this.source.original_file_name }}</el-button> -->
                                </el-popover>
                            </div> 
                              
                         </div>    

                    </div>

                </div>
            </div>

        </div>
        <div class='time-line' style="margin: 20px 10px;" v-if = "this.source.is_revoke === 1" >
            <span >你撤回了一条消息</span>
        </div>
    </div>


   
  </template>
  
  <script>
    import Vue from 'vue'
    import Contextmenu from "vue-contextmenujs"
    Vue.use(Contextmenu);
    import Clipboard from 'clipboard';


    import { setCache, getCache,removeCache} from "@/utils/cache";
    const chunkSize =  3 * 1024 * 1024;//定义分片的大小 暂定为3M，方便测试
    const synth = window.speechSynthesis;
    const speech = new SpeechSynthesisUtterance();
    const voices = speechSynthesis.getVoices()
    export default {
        name: 'Item',
        data(){
            
            return {
                progress: 0,
                is_stop: true,
                duration: 0,
                curr: 0,
                volume:50,
                balance: 50,  
                style: "max-height: 100vh;max-width: 60vw; display:none;",
                user_id:this.$store.state.user.userInfo.user_id, // 用户ID
                room_id:this.$store.state.user.roomInfo.room_id, // 房间ID
                token:this.$store.state.user.token,
                isloading:false,
                list:[],
             
        
            }
        },
        props: {
        // index of current item
            index: { 
                type: Number
            },
            source: { 
                type: Object,
                default () {
                    return {}
                }
            },
         
        },
        computed:{
            isRevokeHidden (){
                
                let time =  Date.parse(this.source.send_time) + 1000*60*5
                let nowTime = new Date().getTime();   
                let status = true;   
                if (this.source.tag == 0 && time >= nowTime) {
                    status = false
                    
                }
               
                return status;
                
            }
        },
        methods: {

            copyOrderId2() {
                var input = document.createElement("input"); // 创建input对象
                input.value = this.source.msg; // 设置复制内容
                document.body.appendChild(input); // 添加临时实例
                input.select(); // 选择实例内容
                document.execCommand("Copy"); // 执行复制
                document.body.removeChild(input); // 删除临时实例
                this.$message.success('复制成功！');
            },
          
            onContextmenu(event) {
                            
                this.$contextmenu({
                    items: [
                    {
                        label: "复制",
                        onClick: () => {
                            this.copyOrderId2()
                        }
                    },
                    {
                        label: "语音",
                        hidden: this.source.content_type != 0,
                        onClick: () => {
                            this.handleSpeak()
                        }
                    },
                    {
                        label: "撤回",
                        hidden:this.$refs.content.getAttribute('data-isRevokeHidden'),
                        onClick: () => {        
                           this.$socket.emit('revokeMsg',{
                                "token":this.token,
                                "room_id":this.room_id,
                                "seq": this.source.seq,
                                "index":this.index
                            });  
                            
                        }
                    },
                    
                    ],
                    event, // 鼠标事件信息
                    customClass: "custom-class tag-read", // 自定义菜单 class
                    zIndex: 1, // 菜单样式 z-index
                    minWidth: 230 // 主菜单最小宽度
                });
                return false;
            },

            handleSpeak(){

                let textMsg = this.$refs.textMsg.textContent;
               
                speech.text = textMsg; // 文字内容: 如果能播放出声音 那可真是泰裤辣！
                speech.lang = "zh-CN"; // 使用的语言:中文
                speech.voice = voices[20]
                speech.volume = 1; // 声音音量：1
                speech.rate = 1; // 语速：1
                speech.pitch = 1; // 音高：1
                synth.speak(speech); // 播放

            },
           
            openImagesClick()
            {
               this.display = "max-height: 100vh;max-width: 60vw; display:block;"
                 
            },

            closeImagesClick()
            {
                this.display ="max-height: 100vh;max-width: 60vw; display:none;"
            },

            down(){

               
                if (this.isloading == true) {
                   return this.$alert("正在上传！！！");

                }        
                let msgList= this.source; 
                let mergeNumber   = msgList.merge_number;
                this.list =   msgList;   
                let md5 = msgList.md5
                let seq = msgList.seq
                let totalChunks = msgList.total_chunks
                let totalSize = msgList.totalSize
                let newFileName = msgList.file_name
                let chunkNumber = msgList.chunk_number
                let uploadStatus =  msgList.upload_status
                
                let composeData = {
                    "identifier":md5,
                    "newFileName":newFileName,
                    "totalChunks":totalChunks,
                    'mergeNumber':mergeNumber,
                    "chunkNumber":chunkNumber,
                    "totalSize":totalSize,
                    "seq":seq,
                   
                }
                
                if (uploadStatus == 0){ // 上传中
                    this.isloading == false
                    // this.source.upload_status = 4

                } else if (uploadStatus == 1) { // 上传成功
                    this.isloading == false
                  
                    // 上传成功
                    this.composeFile(composeData)
 
                } else if (uploadStatus == 2) { // 运行中
                    this.isloading == false
                    this.composeFile(composeData)
                    

                }else if (uploadStatus == 3) { // 运行成功

                    // 发送成功
                    this.$refs.downFile.click()    

                }       
        
            },
           
            /**
             * 请求后端合并文件
             * @param fileMd5 文件md5
             * @param fileName 文件名称
             * @param count 文件分片总数
             */
            composeFile(data) {              
                this.isloading = true
                let list = {
                    "seq":data.seq,
                    "room_id":this.room_id,
                    "user_id":this.user_id,
                    "identifier":data.identifier,
                    "newFileName":data.newFileName,
                    "totalChunks":data.totalChunks,
                    "mergeNumber":data.mergeNumber,
                    "totalSize":data.totalSize,
                    "chunkSize":Math.ceil(data.totalSize / data.totalChunks)       
                }
    
                list.uploadStatus = 2
              
                this.$socket.emit('mergeFile',list); 
                
              
            }
                 
        },
        sockets: {

            async updateMsgStatusCallback(val) {
            
                let list = val.data  
               
                if (val.code === 10000 ) {
                    // 返回变成上传成功状态
                    this.list.upload_status = list.uploadStatus
                }

            }
           
           
          
           
        },
        components: {
            Clipboard
            
        }

}   
  </script>
  <style scoped>
  img {
    cursor: pointer;
  }
  .popover-vedio {
    width: 600px;
  }
  .file {
    cursor: pointer;
  }
  .fileImg {
    position: absolute;
    bottom:-15px;
    right: 0px;
  }
  .file img  {
   
    width: 100px;
    height: 100px;
  }


   .fileSize{
   margin-top: 50px;
  }
  .empty .stream-item.creator, .stream .stream-item.creator {
    flex-direction: row-reverse;
    }
    .empty .stream-item, .stream .stream-item{
    display: flex;
    align-items: center;
    padding: 1em;
  }
 
  .msg-info {
    height: 85px;
  }

  .item {
    display: flex;
    }

    .item.creator {
    transform: rotateX(180deg);
    direction: rtl;
    align-items: flex-end;
    }

    .item .avatar img{
    display: block;
    width: 40px;
    height: 40px;   
    border-radius: 50%;
    caret-color: transparent;
    }
    .item.creator .body {
    transform: rotate(180deg)
    }

    .item .body .content {
        position: relative;
        color: #000;
        background-color: #f0f8ff;
        border-radius: 15px;
        padding: .5em 1em
    }
    @media (max-width: 640px) {
        .item .body .content {
            padding:.5em
        }
    }

    .item .body .content:after {
        content: "";
        position: absolute;
        right: 100%;
        top: 10px;
        width: 14px;
        height: 14px;
        border-width: 0;
        border-style: solid;
        border-color: transparent;
        border-bottom-width: 10px;
        border-bottom-color: currentColor;
        border-radius: 0 0 0 32px;
        color: #f0f8ff
    }

    .item.creator .text {
        transform: rotateY(180deg);
        direction: ltr;
    }

    .item .body .name {
        
        padding-bottom: .2em;
        font-size: 12px;
    
    }

.transform {
    transform: rotateY(180deg)
}
.empty .stream-item,.stream .stream-item {
    display: flex;
    align-items: center;
    padding: 1em;
}
 
.time-line {    
    display: inline-block;
    width: 100%;
    height: 20px;
    text-align: center;
    vertical-align: middle;
  }
</style>
  
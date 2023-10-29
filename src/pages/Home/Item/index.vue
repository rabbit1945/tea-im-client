<template>
    <div :index = index >
        <span class='time-line'>{{ this.source.send_time }} </span>
        <div  :class = "this.source.tag == 1 ? 'stream-item' : 'stream-item creator' ">
            <div :class = "this.source.tag == 1 ? 'item' : 'item creator'">
                <div class="avatar">
                    <img :src=this.source.userLogo>
                </div>
                <div class = "body">
                    <div :class = "this.source.tag == 1 ? 'name' :'name transform' ">{{ this.source.nick_name }}</div>
                    <div class = "content">
                        <!-- 文本 -->
                        <div contenteditable = "false" class="text"  v-if = "this.source.content_type === 0"  >
                            <div v-html="this.source.msg" class="msg-html"  ></div>
                            <!-- {{ this.source.msg }} -->
                        </div>
                        <!-- 音频 -->
                        <div contenteditable = "false" ref="msgLocation" class="text" v-if = "this.source.content_type === 1">

                            <av-bars
                            :canv-height ="30"
                            :audio-src=this.source.msg>
                            </av-bars>

                        </div>
                        <!-- 图片 -->
                        <div contenteditable = "false" ref="msgLocation" class="text" v-if = "this.source.content_type === 2">
                            <img  style="max-width: 800px;max-height: 800px;" :src=this.source.msg>
                            <!-- <img  @click="closeImagesClick()" :style=style :src=this.source.msg> -->
                        </div>
                        <!-- 文件 -->

                        <div @click="down()"   contenteditable = "false" class="text file" v-if = "this.source.content_type === 3">
                            <div ref="idDown" style="display: none;">{{ this.source }}</div>

                           <div>
                            {{ this.source.original_file_name }}
                            <a :href=this.source.msg ref = "downFile" style="display: none;"></a>
                           </div>
                           <div class="fileSize" contenteditable="false"> {{ this.source.fileSize }}KB</div>
                           <div class="upload_status" ref="msgLocation" :data-loction="this.source.location">
                            <span v-if=" this.source.upload_status === 0">上传中</span>
                            <span v-if=" this.source.upload_status === 1">上传成功</span>
                            <span v-if=" this.source.upload_status === 2">发送中</span>
                            <span v-if=" this.source.upload_status === 3">发送成功</span>
                            
                           </div>
                           <div class="fileImg"> <img src="/assets/images/文件.png"/></div>
                           
                          

                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
   
  </template>
  
  <script>
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
        methods: {
            openImagesClick()
            {
               this.display = "max-height: 100vh;max-width: 60vw; display:block;"
                 
            },

            closeImagesClick()
            {
                this.display ="max-height: 100vh;max-width: 60vw; display:none;"
            },

            down(){
               
                let idDown= JSON.parse (this.$refs.idDown.innerHTML);
                
                this.composeFile(idDown)
            //    let downFile =this.$refs.downFile;
            //    downFile.click()    
            },
             /**
             * 请求后端合并文件
             * @param fileMd5 文件md5
             * @param fileName 文件名称
             * @param count 文件分片总数
             */
            composeFile(data) {
                       
                console.log("composeFile:::",data);
                this.$socket.emit('mergeFile',{
                    "room_id":this.room_id,
                    "user_id":this.user_id,
                    "identifier":data.md5,
                    "newFileName":data.file_name,
                    "totalChunks":data.total_chunks,
                    "totalSize":data.totalSize,
                    "chunksSize":Math.ceil(data.totalSize / data.total_chunks)       
                }); 
            
            },

            sleep(time) {
                return new Promise((resolve) => {
                setTimeout(() => {
                    resolve();
                }, time);
                });
            },

            updateStatus(data)
            {
                this.$socket.emit('updateMsgStatus',{
                    "room_id":this.room_id,
                    "user_id":this.user_id,
                    "identifier":data.identifier,
                    "newFileName":data.newFileName,
                    "uploadStatus":data.uploadStatus,
                    "totalChunks":data.totalChunks,
                    "chunkNumber":data.chunkNumber
                                         
                }); 
            },

            updateHtml(data)
            {
                console.log("updateStatus",data)
               
                let  loction  = data.location
                let vals =  this.$refs.msgLocation 
                if (vals){
                    let dataLoction = vals.getAttribute('data-loction');
                
                    if (loction == dataLoction) {
                        let html = `<span>上传中</span>`
                        if (data.uploadStatus == 1) {
                            html = `<span>上传成功</span>` 
                           
                        } else if (data.uploadStatus == 2) {
                            html = `<span>发送中</span>`
                        } else if (data.uploadStatus == 3) {
                            html = `<span>发送成功</span>`
                        } 

                        vals.innerHTML = html
                    
                        console.log("innerHTML", vals);

                    }

                }

            }

        },
        sockets: {

            // 分块回调
            async chunkFileCallback (data) {

               
                this.updateStatus(data) 
                
            },

          
            async mergeFileCallback (data)  {
              
                this.updateStatus(data) 

            },

            async updateMsgStatusCallback(val) {

               
                if (val.data.totalChunks === val.data.chunkNumber) {
                   
                   
                    console.log("updateMsgStatusCallback::",val);
                    if (val.code === 20018 || val.code === 20017) {
                        await this.sleep(3000);    // 睡眠 1 秒
                        this.updateStatus(val.data);

                    } else if (val.code === 10000) {
                            // this.down()
                            return;
                    }


                }
               
            }
        }

}   
  </script>
  <style scoped>
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
  
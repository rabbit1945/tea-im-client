 <template>
     <div class="world">
      <VEmojiPicker class = "msg-emoji" v-show = "showDialog" @select="selectMsg"/>     
      <div class="msg-button">       
        <el-button style="margin-left: 10px" @click="toogleDialogEmoji" type="primary" class = "msg-el-button">
          <img class = "msg-img" src="/assets/images/emoji.png">
        </el-button>
        <div @click="audioPermission">
          <img  class = "msg-img" src="/assets/images/mic.png">
        </div>
        <div class="audio"><Audio v-on:audioData = 'audioData' v-on:statusClass = 'statusClass' ref = 'permission'/> </div>
        <button @click="btnClick()" style="margin-left: 60px">  <img class = "msg-img" src="/assets/images/jietu.png"></button>
        <button  @click="upload()" style="margin-left: 25px;margin-top: 6px;"><img class = "msg-img" src="/assets/images/file.png"></button>
      </div>
      
      <uploadPut ref="uploadFile" v-on:fileSuccess="fileSuccess"/> 
      <!-- <input type='file' ref='file' />  -->
      <el-upload
       
        style="display: none;"
        class="upload-demo"
        action="/api/upload/v1/files"
        show-file-list:false
        :headers=headers
        multiple
        :limit="3"
        :file-list="fileList"
        :on-success="handleSuccess"
        :on-error="handleError"
        :before-upload="handleBeforeupload"
        >
        <el-button  ref='file'  size="small" type="primary">点击上传</el-button>
      </el-upload>

      <at
       :style= stateStatus
       :members="members" 
       :filter-match="filterMatch"
       :delete-match="deleteMatch"
       @insert="getValue"
       v-bind="userList" 
       name-key="nick_name">
        <template slot="item" slot-scope="s">
          <!-- <img :src="s.item.avatar"> -->
          <span v-text="s.item.nick_name"></span>
        </template>
    
        <div
          ref="input"
          class="msg-content" 
          placeholder="ctrl + enter 发送消息"
        
          contenteditable>
             
        </div>
        <!-- <el-button class= "sendButton" type="success">发送</el-button> -->
       
      </at>

      </div>
 </template>
  
  <script>  
  import uploadPut from '../uploadPut';
  import ScreenShort from 'js-web-screen-shot'
  import {VEmojiPicker} from 'v-emoji-picker';
  import Audio from '../Audio'
  import At from 'vue-at'
  export default {
    name: "MsgSend",
    components: {
      VEmojiPicker,
      Audio,
      At,
      uploadPut
    
    },
    data(){
      return {
        title:"闪电",
        text:"", // 消息
        showDialog:false,
        drawer: false,
        direction: 'btt',
        user_id:this.$store.state.user.userInfo.user_id, // 用户ID
        nick_name:this.$store.state.user.userInfo.nick_name, // 昵称
        userLogo:this.$store.state.user.userInfo.photo, // 头像
        room_id:this.$store.state.user.roomInfo.room_id, // 房间ID
        audio:{}, // 音频数据
        showUser:false,    // 是否显示@他人的用户表单
        sumNoticeOtherUser:0,
        countStr:0, // 统计字符的数量
        members: [], // @ 用户列表
        contactList:[], // 需要通知的列表
        fileList:[],
        headers:{
          "Authorization":'Bearer'+' '+ this.$store.state.user.token
        },
        imagesExt:[
        'png', 'jpg', 'jpeg', 'bmp', 'gif', 'webp', 'psd', 'svg', 'tiff'
        ],
        audioExt: [
          'mp3','wav','wma','flac','midi','ra','aac','cda','mov','wavpack','ape'
        ],
        videoExt:[
          'avi','wmv','mpg','mov','rm','ram','swf','flv','mp4'

        ],
        fileName:"",
        fileSize:0,
        stateStatus:"display: block;"



      }
    },
    metaInfo() {
        return {
          title: this.$store.state.message.title, // set a title 
          
        }
    },
      
    sockets: {
      async roomCallback (data) {
      
        this.$refs.uploadFile.getMsg(data);
        // 获取服务端发来的数据
        await this.$store.dispatch("getMessage", data);
         // 定位最新数据的位置
        this.$emit('findNewMsg',{"sendUserId":data.user_id,"userId":this.user_id});
        this.contactList = []
        // 默认音频的大小
        this.audio.fileSize = 0
        // 动态设置title
        this.$store.dispatch("getTitle", {
          "user_id":data.user_id,
          "contactList":data.contactList
        }).then(res =>{
          this.title = this.$store.state.message.title;
        })

      }
    },
    mounted(){ 
      window.addEventListener("keydown",this.send,true);
    },
    destroyed() {
      // window.removeEventListener("keydown", function (event) {

      // if (event.ctrlKey&& event.code=='Enter')
      // {
      //   this.msgSend();
      // }       
      // });
      
    },
    computed:{
      userList:{
        get() {
          this.members = this.$store.state.user.roomUserList.userList
        }
      }
    },
  
methods: {


  
  send() {
    console.log(window.event)

    if (window.event.ctrlKey&& window.event.code=='Enter')
        {
          this.msgSend();
        }   

  },

  audioPermission() {
    this.$refs.permission.getPermission();

  },
  handleBeforeupload(file){
    console.log("file",file)
    this.fileName = file.name
    this.fileSize = file.size
  },
  
  /**
   * 上传成功
   * @param {*} err 
   * @param {*} file 
   * @param {*} fileLis 
   */
  handleError(err, file, fileLis){
    this.$alert("文件上传失败，请重新上传！！！")
  },

  /**
   * 上传成功
   * @param {*} response 
   * @param {*} file 
   * @param {*} fileList 
   */
  handleSuccess(response) {
      console.log(response)
      if (response.code === 10000 ) {
        let data = response.data
        if (Object.keys(data).length > 0) {
          let file = data.file
          //获取最后一个.的位置
          let index= file.lastIndexOf(".");
          //获取后缀
          let ext = file.substr(index+1);
          // 获取文件类型 
          let content_type = this.fileExt(ext)
         
          this.sendAudio({
            "file_name":data.fileName,
            "file_size":data.fileSize,
            "path":file,
            "content_type":content_type
          })
        }

      } else {
        this.$alert("文件上传失败，请重新上传！！！")
      }
      

  },

  fileExt(ext){
    let content_type = 0
    if (this.imagesExt.indexOf(ext.toLowerCase()) !== -1)
    {
      content_type = 2
    } else if(this.audioExt.indexOf(ext.toLowerCase()) !== -1) {
      content_type = 1
    } else if(this.videoExt.indexOf(ext.toLowerCase()) !== -1) {
      content_type = 4
    } else {
      content_type = 3
    }
    return content_type;

  },
  
 
  upload() {

    let filebutton = this.$refs.uploadFile.$refs.uploadfileBut;
    console.log("filebutton",filebutton)
    filebutton.$el.click() 
  },
 
  btnClick() {
  // 更多参数 和使用可以看它包里面的README.md文件
        const screenShotHandler = new ScreenShort({
          // 是否启用webrtc，值为boolean类型，值为false则使用html2canvas来截图
          enableWebRtc: false,
          // 层级级别，这个要比你页面上其他元素的z-index的值大，不然截不了
          level: 2001,
          // saveCallback:(code, msg) => {
          //   // 在此处根据实际业务需要通过参数做判断即可
          //   console.log(code,msg);
          // },
          completeCallback: this.callback, // 截图成功完成的回调
          closeCallback: this.closeFn, // 截图取消的回调
          canvasWidth:  window.innerWidth,
          canvasHeight:  window.innerHeight,
        })
  },
  
   callback(base64data,cutInfo) {
    console.log(base64data)
    this.$store.dispatch("uploadBase64", base64data).then(res => {
      console.log("uploadFiles",res);
      let path = res.file
      let input = this.$refs.input
      let innerHTML = input.innerHTML  
      let data = JSON.stringify(base64data)
      let val = innerHTML + "<img id = 'image' onclick= 'myBtn(" + JSON.stringify(path) + ")' src=" + path + ">"
      input.innerHTML = val
    })
   

  },

convertImageToCanvas(image) {
      var canvas = document.createElement('canvas')
      canvas.width = image.width
      canvas.height = image.height
      canvas.getContext('2d').drawImage(image, 0, 0)
      return canvas
    },
    closeFn() {
      // 取消截图的回调
    },

   
     // 过滤联系人
      filterMatch(name, chunk) {
        return name.toLowerCase().indexOf(chunk.toLowerCase()) === 0;
      },
      // 删除联系人
      deleteMatch(name, chunk, suffix) {
          this.contactList = this.contactList.filter(
                  item => item.nick_name!= chunk.trim()
          );
          console.log("deleteMatch:",this.contactList);
        return chunk === name + suffix;
      },
      // 获取联系人
      getValue(val) {
         return this.contactList.push(val);
         
      },
     
      audioData(val) {   
        if (val) {
           this.$store.dispatch("uploadAudio", val.formData).then(res => {
                  let path = res.file    
                  //获取最后一个.的位置
                  let index= path.lastIndexOf(".");
                  //获取后缀
                  let ext = path.substr(index+1);
                  // 获取文件类型 
                  let content_type = this.fileExt(ext)
                  this.audio = {
                    'path':path,
                    'file_name':val.fileName,
                    'file_size':val.fileSize,
                    "content_type":content_type
                  }
                  this.sendAudio(this.audio)           
          })
        } else {
           tihs.alert("语音出现问题，请重试！！！");
           return false;
        }
        
      },

      fileSuccess(val) {
        if (val) {
             let path = val.mergePath    
            //获取最后一个.的位置
            let index= path.lastIndexOf(".");
            //获取后缀
            let ext = path.substr(index+1);
            // 获取文件类型 
            val.content_type =  this.fileExt(ext)
            val.file_name =  val.newFileName
            val.original_file_name = val.filename
            val.file_size = val.totalSize
            val.md5 = val.identifier
            val.path = path

            this.sendAudio(val)

        }

      },

      statusClass(val) {
        console.log(val)
        let style = "display: block;"
        if (val.status === true) {
          style = "display: none;"
        }
        this.stateStatus = style

      },
      selectMsg(val) {// 选择emoji后调用的函数
         // 定义最后光标对象
        var lastEditRange;
        let input = this.$refs.input
        let selection = getSelection()
         
        // 编辑框获得焦点
        input.focus() 
        
        // 获取选定对象
        let range = []
        if (selection.rangeCount > 0) {
            // 获取选定对象
            range = selection.getRangeAt(0);       
          // 判断是否有最后光标对象存在
          if (lastEditRange) {
              // 存在最后光标对象，选定对象清除所有光标并添加最后光标还原之前的状态
              selection.removeAllRanges()
              selection.addRange(lastEditRange)
          } 
          // 获取光标对象的范围界定对象，一般就是textNode对象
          let textNode = range.startContainer;
          let rangeStartOffset = range.startOffset
          if (rangeStartOffset > 0) {
            // 文本节点在光标位置处插入新的表情内容
            textNode.insertData(rangeStartOffset, val.data)
            // 光标移动到到原来的位置加上新内容的长度
            range.setStart(textNode, rangeStartOffset + val.data.length)
            // 光标开始和光标结束重叠
            range.collapse(true)
            // 清除选定对象的所有光标对象
            selection.removeAllRanges()
            // 插入新的光标对象
            selection.addRange(range)
            // 无论如何都要记录最后光标对象
            lastEditRange = selection.getRangeAt(0)
          }
        }
      },
      //打开表情弹窗
      toogleDialogEmoji () {
        this.showDialog = !this.showDialog
      },

      // 发送
      msgSend(){
        this.$socket.open();
        let text = this.$refs.input.textContent.trim()
        if (text.length === 0 ) {  
          this.$alert("你好，客官你还没有添写消息呢！！！");
          return false;
        }
        let innerHTML = this.$refs.input.innerHTML
        let messgae = innerHTML.trim();
        let contactList =  this.contactList
        let content_type = 0; // 文本
        if (this.audio.fileSize > 0) {
           messgae = this.audio.file;
           content_type = 1; // 音频
        } 
      

        let msgData = this.msgInfo()
        msgData.msg = messgae
        msgData.content_type = content_type
        msgData.contactList = contactList
       
        this.$socket.volatile.emit('room',msgData);     
        this.$refs.input.innerHTML = "&nbsp;"
      },

      /**
       * 发送音频图片文本
       */
      sendAudio(data)
      {
        
        if (data.length <=0) {
          this.$alert("参数为空，请重新参数")
        }
        let msgData = this.msgInfo()
        let content_type =  data.content_type
        msgData.msg = data.path
        msgData.file_name = data.file_name
        msgData.file_size = data.file_size
        msgData.content_type = content_type
        msgData.md5 = data.md5
        msgData.file_path = data.path
        msgData.total_chunks =data.totalChunks
        msgData.original_file_name = data.original_file_name
        this.$socket.volatile.emit('room',msgData);  
      
      },

     

      msgInfo(){

        const user_id = this.user_id;
        const nick_name = this.nick_name;
        const userLogo = this.userLogo;
        const room_id   = this.room_id;
        let msgData  = {
            "room_id": room_id,
            "user_id": user_id,
            "nick_name": nick_name,     
            "userLogo":userLogo,           
        };

        return msgData;
        

      }
  
    }

  }

  </script>
  
  <!-- Add "scoped" attribute to limit CSS to this component only -->
  <style scoped>
   .sendButton {
    position: absolute;
    bottom: 0px;
    right: 0px;
   }
  .audio {
    position: relative;
    top: 0px;
    text-align: center;
  }
  .world {
    position: absolute;
    /* left: 99px; */
    bottom: -220px;
    padding-top: 10px;
    width: 100%;
    min-width: 50%;
    height: 107px;
    border-top: 1px solid #fff;
    background-color: white;
    margin-bottom: 100px;
    border-radius:20px 20px
  }
  .msg-button {
    position: relative;
    height: 38px;
    margin-top: -9px;
  }
  .msg-el-button {
    margin-right: 10px;
    border: none;  
    background:white;
  }
  .msg-img {
    position:absolute;
    top:1px;
    width: 25px;
    height: 25px; 
    border: none;
    background-color: white;

  }
  .msg-emoji {
    position: absolute;
     left: 110px;
    bottom: 161px;


  }

  .send {
    margin-left: 40px;
    width: 60%;
    /* height: 140px; */
    border: 1px;
    border-radius: 10px;
    background-color: white;
    overflow: scroll;

  }


  

  .userList {
    min-width: 100px;
    height: 200px;
    border: 1px;
    position: absolute;
    bottom: 110px;
    left: 70px;
    overflow:auto;
    border-color:  #ff0 transparent transparent;
  }

  [contenteditable] {
    -webkit-user-select: text;
    user-select: text;
}

  
  
  </style>
  
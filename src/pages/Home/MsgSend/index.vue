 <template>
     <div class="world">
      <VEmojiPicker class = "msg-emoji" v-show = "showDialog" @select="selectMsg"/>     
      <div class="msg-button">       
        <el-button @click="toogleDialogEmoji" type="primary" class = "msg-el-button">
          <img class = "msg-img" src="/emoji/QQ/png/0fix@2x.png">
        </el-button>
        <div class="audio"><Audio v-on:audioData = 'audioData'/> </div>
      </div>
     
      <at
       :members="members" 
       :filter-match="filterMatch"
       :delete-match="deleteMatch"
       @insert="getValue"
       name-key="nick_name">
        <template slot="item" slot-scope="s">
          <!-- <img :src="s.item.avatar"> -->
          <span v-text="s.item.nick_name"></span>
        </template>
        <div
          ref="input"
          class="msg-content" 
          placeholder="说点什么…"
          @keyup.enter="msgSend"
          
          contenteditable>

        </div>

      </at>

      </div>
 </template>
  
  <script>  
  import {VEmojiPicker} from 'v-emoji-picker';
  import Audio from '../Audio'
  import At from 'vue-at'
  export default {
    name: "MsgSend",
    components: {
      VEmojiPicker,
      Audio,
      At
    
    },
    data(){
      return {
        text:"",
        showDialog:false,
        drawer: false,
        direction: 'btt',
        user_id:this.$store.state.user.userInfo.user_id,
        nick_name:this.$store.state.user.userInfo.nick_name,
        userLogo:this.$store.state.user.userInfo.photo,
        room_id:this.$store.state.user.roomInfo.room_id,
        audio:{},
        showUser:false,    // 是否显示@他人的用户表单
        sumNoticeOtherUser:0,
        countStr:0, // 统计字符的数量
        members: this.$store.state.user.roomUserList.userList,
        contactList:[]
      }
    },
      
    
   
    sockets: {
      async roomCallback (data) {
        // console.log("客户端发过来了一个请求",data);
        // 获取服务端发来的数据
        await this.$store.dispatch("getMessage", data);
         // 定位最新数据的位置
        this.$emit('findNewMsg',true);
        this.audio.fileSize = 0
      }
    },
    mounted(){
     
      
    },
    destroyed() {
      


    },
  
    methods: {
     // 过滤联系人
      filterMatch(name, chunk) {
        return name.toLowerCase().indexOf(chunk.toLowerCase()) === 0;
      },
      // 删除联系人
      deleteMatch(name, chunk, suffix) {
          this.contactList = this.contactList.filter(
                  item => item.nick_name!= chunk.trim()
          );
        return chunk === name + suffix;
      },
      // 获取联系人
      getValue(val) {
         
          this.contactList.push({"nick_name":val.nick_name});
          console.log(this.contactList)
         
      },
     
      audioData(val) {
        console.log("val",val);        
        if (val) {
           this.$store.dispatch("uploadAudio", val.formData).then(res => {
                   let path = res.file
                   this.audio = {
                    'file':path,
                    'toltime':val.toltime,
                    'fileSize':val.fileSize
                   }
                   this.msgSend()
          })
        } else {
           tihs.alert("语音出现问题，请重试！！！");
           return false;
        }
        
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
      },
      //打开表情弹窗
      toogleDialogEmoji () {
        this.showDialog = !this.showDialog
      },
      msgSend(){
        if (this.showUser) return true; 
        this.$socket.open();
        let input = this.$refs.input.innerText
        let messgae = input.trim();
        let content_type = 0; // 音频
        if (this.audio.fileSize > 0) {
           messgae = this.audio.file;
           content_type = 1; // 音频
        } 
       
        if (messgae === ''|| messgae === null || messgae === undefined ) {
          
          this.$alert("你好，客官你还没有添写消息呢！！！");
          return false;
        }    
        const user_id = this.user_id;
        const nick_name = this.nick_name;
        const userLogo = this.userLogo;
        const room_id   = this.room_id;
        this.$socket.volatile.emit('room',{
            "room_id": room_id,
            "user_id": user_id,
            "nick_name": nick_name,
            "msg": messgae,
            "userLogo":userLogo,
            "content_type": content_type 
            
        }); 
       
        
      },
  
    }

  }
  </script>
  
  <!-- Add "scoped" attribute to limit CSS to this component only -->
  <style scoped>
  .audio {
    float: left;
    width: 25px;
    height: 25px; 

  }
  .world {
    position: absolute;
    bottom: 0;
    padding-top: 10px;
    width: 700px;
    height: 150px;
    border-top: 1px  solid #fff;
    
  }
  .msg-button {
    height: 38px;
    margin-top: -9px;
  }
  .msg-el-button {
    margin-right: 10px;
    border: none;  
    background:white;
  }
  .msg-img {
    width: 25px;
    height: 25px; 

  }
  .msg-emoji {
    position:absolute;
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
  .msg-content {
    margin-top: 13px;
    height:107px;
    padding: 1px;
    overflow:scroll;
  }

  .msg-content:empty::before {
      content: attr(placeholder);
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
  
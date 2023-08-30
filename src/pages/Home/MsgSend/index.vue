 <template>
     <div class="world">
     
      <!-- <div  @keydown="offMsessageWrap($event)" class="send" ref="getValue" contenteditable="true" placeholder="一起来聊天吧">

      </div> -->
      
      <VEmojiPicker class = "msg-emoji" v-show = "showDialog" @select="selectEmoji"/>
      
      <div class="msg-button">
        
        <el-button @click="toogleDialogEmoji" type="primary" class = "msg-el-button">
          <img class = "msg-img" src="/emoji/QQ/png/0fix@2x.png">
        </el-button>
       
      </div>
      <el-input
          id="input"
          v-model="text"
          type="textarea"
          resize="none"
          @keyup.enter.native="msgSend"
          :rows="5"
          placeholder="请输入内容">
        </el-input>
    
        
    </div>
 </template>
  
  <script>  
  import {VEmojiPicker} from 'v-emoji-picker'

  export default {
    name: "MsgSend",
    components: {
      VEmojiPicker
    },
    data(){
      return {
        text:"",
        showDialog:false,
        drawer: false,
        direction: 'btt',
        "user_id":this.$store.state.user.userInfo.user_id,
        "nick_name":this.$store.state.user.userInfo.nick_name,
        "userLogo":this.$store.state.user.userInfo.photo,
        "room_id":this.$store.state.user.roomInfo.room_id,
        
      }
    },
    
   
    sockets: {
      async roomCallback (data) {
        // console.log("客户端发过来了一个请求",data);
        // 获取服务端发来的数据
        await this.$store.dispatch("getMessage", data);


      }
    },
  
    methods: {
      selectEmoji(emoji) {// 选择emoji后调用的函数
        let input = document.getElementById("input")
        let startPos = input.selectionStart
        let endPos = input.selectionEnd
        let resultText = input.value.substring(0, startPos) + emoji.data + input.value.substring(endPos)
        input.value = resultText
        input.focus()
        input.selectionStart = startPos + emoji.data.length
        input.selectionEnd = startPos + emoji.data.length
        this.text = resultText
      },
      //打开表情弹窗
      toogleDialogEmoji () {
        this.showDialog = !this.showDialog
      },
      msgSend(){
        this.$socket.open();
        const messgae = this.text;
        if (!messgae) {
          alert("你好，客官你还没有添写消息呢！！！");
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
            
        }); 
        this.$emit('enter',true);
        
      },
  
    }

  }
  </script>
  
  <!-- Add "scoped" attribute to limit CSS to this component only -->
  <style scoped>
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
    background:#fffbf0;
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
  
  
  </style>
  
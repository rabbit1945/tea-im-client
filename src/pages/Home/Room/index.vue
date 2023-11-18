 <template>
  <div>nihao  <button  @click="playVoice()">点击进行播报</button></div>
 
 </template>
  <script> 
  const synth = window.speechSynthesis;
  const speech = new SpeechSynthesisUtterance();
  const voices = speechSynthesis.getVoices();
 
 // 打印voices可以看到有很多数组     但是只有值localService 的值为 true的才能使用，我的浏览器只有前三个位true
      console.log(voices);

    export default {
      name:"Room",
      data () {
        return {
         

        }
      },
      props:[],
      computed: {
       
        
      },
      mounted(){
         
      },
      methods: {
        playVoice() {
          this.handleSpeak("如果能播放出声音 那可真是泰裤辣！hello"); // 传入需要播放的文字
        },
        handleSpeak(text){
          speech.text = text; // 文字内容: 如果能播放出声音 那可真是泰裤辣！
          speech.lang = "zh-CN"; // 使用的语言:中文
          speech.voice = voices[20]
          speech.volume = 1; // 声音音量：1
          speech.rate = 1; // 语速：1
          speech.pitch = 1; // 音高：1
          synth.speak(speech); // 播放

        },
        handleStop(e) {
          speech.text = e;
          speech.lang = "zh-CN";
          synth.cancel(speech);
      }
    

      }
    }
  </script>
  
  <!-- Add "scoped" attribute to limit CSS to this component only -->
  <style scoped>

    
  </style>
  
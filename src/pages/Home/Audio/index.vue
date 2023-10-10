<template>
  <div class="home">
    <div @click="getPermission()">
          <img class = "msg-img" src="./images/mic.png">
    </div>
    <!-- <Button type="info" @click="startRecorder()">开始录音</Button>  -->
    <div tabindex="1" ref = 'keypressSpace'  v-show="isShowPermission" @keypress.space = "startRecorder()" class = " audio-tips"> 
        <img class = "msg-img" src="./images/mic.png">
        <span>按下空格开始录音，在按下空格录音结束。</span>
        <el-button round size="mini" type="success" @click="outPlay()">退出</el-button>
    </div>
    <div v-show="startEnd && countdownimes === 0" class = "times">{{satrtTime}}</div>
    <div v-show="startEnd && countdownimes > 0" class = "times">{{countdownimes}} 10秒之后自动发送</div>
    <canvas v-show="startEnd" id="canvas"  class = "canvas" >
    </canvas>
    <!-- <canvas id="playChart" class = "canvas"></canvas> -->
    
  </div>
</template>
 
<script>
  import Recorder from 'js-audio-recorder'
  const lamejs = require('lamejstmp')
  const recorder = new Recorder({
    sampleBits: 16,                 // 采样位数，支持 8 或 16，默认是16
    sampleRate: 11025,              // 采样率，支持 11025、16000、22050、24000、44100、48000，根据浏览器默认值，我的chrome是48000
    numChannels: 1,                 // 声道，支持 1 或 2， 默认是1
    compiling: true, // 是否边录边转换，默认是false
  })
 
  // 绑定事件-打印的是当前录音数据
  // recorder.onprogress = function(params) {
  //   console.log('--------------START---------------')
  //   // console.log('录音时长(秒)', params.duration);
  //   console.log('录音大小(字节)', params.fileSize);
  //   console.log('录音音量百分比(%)', params.vol);
  //   console.log('当前录音的当前部分', params.getNextData);

  //   console.log('当前录音的总数据([DataView, DataView...])', params.getWholeData);
  //   console.log('--------------END---------------')
  // }
  
  export default {
    name: 'Audio',
    data () {
      return {
        //波浪图-录音
        drawRecordId:null,
        oCanvas : null,
        ctx : null,
        //波浪图-播放
        drawPlayId:null,
        pCanvas : null,
        pCtx : null,
        startEnd: false,
        isShowPermission:false,
        satrtTime:0, //开始计时时间
        endTime:60,//结束计时时间
        countdownimes: 0, // 倒计时

      }
    },
    mounted(){     
      this.startCanvas();     
    },
  
    methods: {
      /**
       * 波浪图配置
       * */
      startCanvas(){
        //录音波浪
        this.oCanvas = document.getElementById('canvas');
        this.ctx = this.oCanvas.getContext("2d");
        //播放波浪
        // this.pCanvas = document.getElementById('playChart');
        // this.pCtx = this.pCanvas.getContext("2d");
      },

      outPlay() {
        
        this.stopRecorder();
        this.startEnd = false;
        this.isShowPermission = false;
       
      },
 
      /**
       *  录音的具体操作功能
       * */
      // 开始录音/结束录音
      startRecorder () {
        
        if ( this.startEnd === false) {
           recorder.start().then(() => {
            this.startEnd = true;
            this.drawRecord();//开始绘制图片
            }, (error) => {
              this.stopRecorder();
                this.getRecorder();
              this.startEnd = true;
             
              // 出错了
              console.log("error:",error);
            });
           
        } else {
          this.stopRecorder();
          this.getRecorder();
         
         
          this.startEnd = false;

        }
        
      },
      // 继续录音
      resumeRecorder () {
        recorder.resume()
      },
      // 暂停录音
      pauseRecorder () {
        recorder.pause();
        this.drawRecordId && cancelAnimationFrame(this.drawRecordId);
        this.drawRecordId = null;
      },
      // 结束录音
      stopRecorder () {
        recorder.stop()
        this.drawRecordId && cancelAnimationFrame(this.drawRecordId);
        
        this.drawRecordId = null;
      },
      // 录音播放
      playRecorder () {
        recorder.play();
        this.drawPlay();//绘制波浪图
      },
      // 暂停录音播放
      pausePlayRecorder () {
        recorder.pausePlay()
      },
      // 恢复录音播放
      resumePlayRecorder () {
        recorder.resumePlay();
        this.drawPlay();//绘制波浪图
      },
      // 停止录音播放
      stopPlayRecorder () {
        recorder.stopPlay();
      },
      // 销毁录音
      destroyRecorder () {
        recorder.destroy().then(function() {
          recorder = null;
          this.drawRecordId && cancelAnimationFrame(this.drawRecordId);
          this.drawRecordId = null;
        });
      },
      /**
       *  获取录音文件
       * */
      getRecorder(){
        let toltime = parseInt(recorder.duration) ;//录音总时长
        let fileSize = recorder.fileSize;//录音总大小
        console.log(recorder.getWAV());
        //录音结束，获取取录音数据
        // let PCMBlob = recorder.getPCMBlob();//获取 PCM 数据
        // let wavBlob = recorder.getWAVBlob();//获取 WAV 数据
          
        // let channel = recorder.getChannelData();//获取左声道和右声道音频数据
        const mp3Blob = this.convertToMp3(recorder.getWAV());
        
        this.uploadWAVData(mp3Blob,toltime,fileSize)
      },
      /**
       *  下载录音文件
       * */
      //下载pcm
      downPCM(){
        //这里传参进去的时文件名
        recorder.downloadPCM('新文件');
      },
      //下载wav
      downWAV(){
        //这里传参进去的时文件名
        recorder.downloadWAV('新文件');
      },

          //上传wav录音数据
    uploadWAVData(wavBlob,toltime,fileSize) {
      
      var formData = new FormData()
      // // 此处获取到blob对象后需要设置fileName满足当前项目上传需求，其它项目可直接传把blob作为file塞入formData
      // const newbolb = new Blob([wavBlob], { type: 'audio/wav' })
      // // 获取当时时间戳作为文件名
      const fileOfBlob = new File([wavBlob], new Date().getTime() + '.mp3')
      formData.append("file",fileOfBlob)
      this.$emit('audioData',{
        "formData":formData,
        "toltime":toltime,
        "fileSize":fileSize
      });

    },
      /**
       *  获取麦克风权限
       * */
      getPermission(){
        if (!this.isShowPermission) {
          Recorder.getPermission().then(() => {
            console.log("获取权限成功")
            this.isShowPermission = true
          }, (error) => {
            console.log(`${error.name} : ${error.message}`);
            this.$alert("请开启麦克风权限")
            
          });
        } else {
          this.isShowPermission = false
        }
       
      },
      /**
       * 文件格式转换 wav-map3
       * */
      getMp3Data(){
        const mp3Blob = this.convertToMp3(recorder.getWAV());
        recorder.download(mp3Blob, 'recorder', 'mp3');
      },
      convertToMp3(wavDataView) {
        // 获取wav头信息
        const wav = lamejs.WavHeader.readHeader(wavDataView); // 此处其实可以不用去读wav头信息，毕竟有对应的config配置
        const { channels, sampleRate } = wav;
        const mp3enc = new lamejs.Mp3Encoder(channels, sampleRate, 128);
        // 获取左右通道数据
        const result = recorder.getChannelData()
        const buffer = [];
 
        const leftData = result.left && new Int16Array(result.left.buffer, 0, result.left.byteLength / 2);
        const rightData = result.right && new Int16Array(result.right.buffer, 0, result.right.byteLength / 2);
        const remaining = leftData.length + (rightData ? rightData.length : 0);
 
        const maxSamples = 1152;
        for (let i = 0; i < remaining; i += maxSamples) {
          const left = leftData.subarray(i, i + maxSamples);
          let right = null;
          let mp3buf = null;
 
          if (channels === 2) {
            right = rightData.subarray(i, i + maxSamples);
            mp3buf = mp3enc.encodeBuffer(left, right);
          } else {
            mp3buf = mp3enc.encodeBuffer(left);
          }
 
          if (mp3buf.length > 0) {
            buffer.push(mp3buf);
          }
        }
 
        const enc = mp3enc.flush();
 
        if (enc.length > 0) {
          buffer.push(enc);
        }
       
        return new Blob(buffer, { type: "audio/mp3" });
      },
 
      /**
       * 绘制波浪图-录音
       * */
      drawRecord () {
       
        this.satrtTime = Math.ceil(recorder.duration);//开始计时
        //  剩余10秒倒计时
        let countdownime = this.endTime - this.satrtTime;
        if (countdownime <=10 && countdownime > 0 ) {        
            this.countdownimes = this.endTime - this.satrtTime-1;
            
            if (this.countdownimes == 0 && this.startEnd) {
              this.stopRecorder();
              this.getRecorder();
              this.startEnd = false;
              this.satrtTime = 0;
              this.countdownimes = 0;
              return true;

            } 
          
        }
        // 用requestAnimationFrame稳定60fps绘制
        this.drawRecordId = requestAnimationFrame(this.drawRecord);
 
        // 实时获取音频大小数据
        let dataArray = recorder.getRecordAnalyseData(),
            bufferLength = dataArray.length;
 
        // 填充背景色
        this.ctx.fillStyle = 'rgb(200, 200, 200)';
        this.ctx.fillRect(0, 0, this.oCanvas.width, this.oCanvas.height);
 
        // 设定波形绘制颜色
        this.ctx.lineWidth = 2;
        this.ctx.strokeStyle = 'rgb(0, 0, 0)';
 
        this.ctx.beginPath();
        
        var sliceWidth = this.oCanvas.width * 1.0 / bufferLength, // 一个点占多少位置，共有bufferLength个点要绘制
                x = 0;          // 绘制点的x轴位置
 
        for (var i = 0; i < bufferLength; i++) {
          var v = dataArray[i] / 128.0;
          var y = v * this.oCanvas.height / 2;
 
          if (i === 0) {
            // 第一个点
            this.ctx.moveTo(x, y);
          } else {
            // 剩余的点
            this.ctx.lineTo(x, y);
          }
          // 依次平移，绘制所有点
          x += sliceWidth;
        }
 
        this.ctx.lineTo(this.oCanvas.width, this.oCanvas.height / 2);
        this.ctx.stroke();
      },
      /**
       * 绘制波浪图-播放
       * */
      drawPlay () {
        // 用requestAnimationFrame稳定60fps绘制
        this.drawPlayId = requestAnimationFrame(this.drawPlay);
        // 实时获取音频大小数据
        let dataArray = recorder.getPlayAnalyseData(),
                bufferLength = dataArray.length;
        // 填充背景色
        this.pCtx.fillStyle = 'rgb(200, 200, 200)';
        this.pCtx.fillRect(0, 0, this.pCanvas.width, this.pCanvas.height);
 
        // 设定波形绘制颜色
        this.pCtx.lineWidth = 2;
        this.pCtx.strokeStyle = 'rgb(0, 0, 0)';
 
        this.pCtx.beginPath();

        var sliceWidth = this.pCanvas.width * 1.0 / bufferLength, // 一个点占多少位置，共有bufferLength个点要绘制
                x = 0;          // 绘制点的x轴位置
 
        for (var i = 0; i < bufferLength; i++) {
          var v = dataArray[i] / 128.0;
          var y = v * this.pCanvas.height / 2;
 
          if (i === 0) {
            // 第一个点
            this.pCtx.moveTo(x, y);
          } else {
            // 剩余的点
            this.pCtx.lineTo(x, y);
          }
          // 依次平移，绘制所有点
          x += sliceWidth;
        }
 
        this.pCtx.lineTo(this.pCanvas.width, this.pCanvas.height / 2);
        this.pCtx.stroke();
      }
 
    },
 
  }
</script>
 
<style  scoped>
   
.times {
  width: 150px;
  height: 30px; 
  position:relative;
  top: -73px;
  left:270px;
  text-align: center;
  border-radius: 30px;
  z-index: 1;
}
.canvas {
  width: 150px;
  height: 30px; 
  position:relative;
  top: -70px;
  left:270px;
  border-radius: 30px;
  z-index: 1;

}
.audio-tips {
  width: 89vw;
    position: relative;
    top: 0vh;
    /* left: 30vw; */
    text-align: center;
    z-index: 1;
    background-color: rgba(245,245,245,1.7);
    height: 10vh;
}
 .msg-img {
    width: 25px;
    height: 25px; 
    padding-top: 10px;

  }
</style>
<template>
  <div class="myDiv" style="display: none;">
      <el-upload class="upload-demo" action="#" :on-change="uploadFile" :show-file-list="true"  :auto-upload="false" >
          {{ fileList }}
          <el-button size="small" ref = "uploadfileBut" type="primary" >上传文件</el-button>
      </el-upload>
  </div>
</template>

<script>
import SparkMD5 from "spark-md5";
const chunkSize =  3 * 1024 * 1024;//定义分片的大小 暂定为10M，方便测试
export default {
  name: 'uploadPut',
  components: {},
  props: {},
  data() {
      return {
          fileList: [],
          loadingFile: false,
          user_id:this.$store.state.user.userInfo.user_id, // 用户ID
          room_id:this.$store.state.user.roomInfo.room_id, // 房间ID
          msgInfo:""
        
        

      }
  },
  watch: {},
  computed: {},
  methods: {
      /**
       * 上传文件
       */
      async uploadFile(File) {
          // this.loadingFile = true
          var self = this
          //获取用户选择的文件
          const file = File.raw
          this.currentFile = file
          //文件大小(大于100m再分片哦，否则直接走普通文件上传的逻辑就可以了，这里只实现分片上传逻辑)
          const fileSize = File.size
          // 放入文件列表
          this.fileList = [{ "name": File.name }]
          // 可以设置大于多少兆可以分片上传，否则走普通上传
          if (fileSize <= chunkSize) {
              console.log("上传的文件大于2m才能分片上传")
          }
          //计算当前选择文件需要的分片数量
          const chunkCount = Math.ceil(fileSize / chunkSize)
          console.log("文件大小：", (File.size / 1024 / 1024) + "Mb", "分片数：", chunkCount)
          //获取文件md5
          const fileMd5 = await this.getFileMd5(file, chunkCount);
          console.log("文件md5：", fileMd5)

          console.log("向后端请求本次分片上传初始化")

          const initUploadParams = {
              "identifier": fileMd5, //文件的md5
              "filename": File.name, //文件名
              "totalChunks": chunkCount, //分片的总数量
          }

         
          // 调用后端检查文件上传情况接口
          this.$store.dispatch("checkChunkExis", initUploadParams).then (res => {
              console.log("checkChunkExis",res)
              
              // if (res.allUploadSuccess == 1) {
              //   upload_status = 1
              // }

              this.$emit('fileSuccess',{
                    "room_id":this.room_id,
                    "identifier":fileMd5,
                    "filename":File.name,
                    "newFileName":res.newFileName,
                    "totalChunks":chunkCount,
                    "totalSize":fileSize,
                    "mergePath":res.mergePath,
                    "location":res.location,
                    "upload_status":0
              });
            
            
              // 定义分片开始上传的序号
              // 由于是顺序上传，可以判断后端返回的分片数组的长度，为0则说明文件是第一次上传，分片开始序号从0开始
              // 如果分片数组的长度不为0，我们取最后一个序号作为开始序号
        
              // 当前为顺序上传方式，若要测试并发上传，请将103 行 await 修饰符删除即可
              // 循环调用上传
              let num = 0
              for (var i = num; i < chunkCount; i++) {
                  //分片开始位置
                  let start = i * chunkSize
                  //分片结束位置
                  let end = Math.min(fileSize, start + chunkSize)
                  //取文件指定范围内的byte，从而得到分片数据
                  let chunkNumber = i
                  let _chunkFile = File.raw.slice(start, end)
                  console.log("开始上传第" + i + "个分片")
              
                  var reader=new FileReader();
                  reader.readAsDataURL(_chunkFile)
                  let uploadProgress = (chunkNumber * chunkSize)/chunkCount*100
                  reader.onload = e => {
                    // console.log('e----', e)             
                    let data = {
                      "user_id":this.user_id,
                      "room_id":this.room_id,
                      "identifier":fileMd5,
                      "filename":File.name,
                      "totalChunks":chunkCount,
                      "chunkNumber":chunkNumber,
                      "totalSize":fileSize,
                      "newFileName":res.newFileName,
                      "file":e.target.result,
                      "seq":this.msgInfo.seq,
                      "chunkSize":chunkSize,
                      "location":res.location,
                      "uploadProgress":uploadProgress.toFixed(2) + '%'
                    }
                    
                    console.log(' this.$socket',  data)
                    this.$socket.emit('chunkFile',data);  
                   
                  }

                
               

              }
              
            
             
          })
      },

   
      /**
    * 获取文件MD5
    * @param file
    * @returns {Promise<unknown>}
    */
      getFileMd5(file, chunkCount) {
          return new Promise((resolve, reject) => {
              let blobSlice = File.prototype.slice || File.prototype.mozSlice || File.prototype.webkitSlice;
              let chunks = chunkCount;
              let currentChunk = 0;
              let spark = new SparkMD5.ArrayBuffer();
              let fileReader = new FileReader();

              fileReader.onload = function (e) {
                  spark.append(e.target.result);
                  currentChunk++;
                  if (currentChunk < chunks) {
                      loadNext();
                  } else {
                      let md5 = spark.end();
                      resolve(md5);
                  }
              };
              fileReader.onerror = function (e) {
                  reject(e);
              };
              function loadNext() {
                  let start = currentChunk * chunkSize;
                  let end = start + chunkSize;
                  if (end > file.size) {
                      end = file.size;
                  }
                  fileReader.readAsArrayBuffer(blobSlice.call(file, start, end));
              }
              loadNext();
          });
      },

      getMsg(data) {
      
        if (data.content_type != 0) {
          console.log("获取消息",data);
          this.msgInfo = data

        }

      }
     
  },
  sockets: {
   

  },
  created() { },
  mounted() { }
}
</script>
<style lang="less" scoped>
</style>
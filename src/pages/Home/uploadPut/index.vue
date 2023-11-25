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
import { setCache, getCache,removeCache} from "@/utils/cache";
const chunkSize =  3 * 1024 * 1024;//定义分片的大小 暂定为3M，方便测试
const  maxSize  = 100 *1024 * 1024; // 最大
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
          msgInfo:[],
          type:false,
          file:[]
        
        

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
          if (fileSize > maxSize) {
              this.$alert("上传文件小于"+maxSize/1024/1024+"M");
              return;
          }
          // 放入文件列表
          this.fileList = [{ "name": File.name }]
          // 可以设置大于多少兆可以分片上传，否则走普通上传
          if (fileSize <= chunkSize) {
              console.log("普通：：",fileSize,chunkSize)
              const fileMd5 = await this.getFileMd5(file, 1);
              var reader=new FileReader();
              reader.readAsDataURL(file)
              reader.onload = e => {
                // 普通上传 
                this.$store.dispatch("uploadPut", {
                    "file":e.target.result,
                    "fileName":File.name

                }).then(res => {
                     if (res) {
                      this.sendMsg(fileMd5,File.name,res.newFileName,1,fileSize,res.path,3)
                     } else{
                        this.$alert("上传失败");
                     }
                     
                })

              }

          } else {

            //计算当前选择文件需要的分片数量
            const chunkCount = Math.ceil(fileSize / chunkSize)
            console.log("文件大小：", (fileSize / 1024 / 1024) + "Mb", "分片数：", chunkCount)
            //获取文件md5
            const fileMd5 = await this.getFileMd5(file, chunkCount);
            setCache(fileMd5,JSON.stringify(file))
            console.log("向后端请求本次分片上传初始化")

            const initUploadParams = {
                "identifier": fileMd5, //文件的md5
                "filename": File.name, //文件名
                "totalChunks": chunkCount, //分片的总数量
                "totalChunks":fileSize,
                "file":File
            }
    
            // 上传大文件
            this.checkChunkExis(initUploadParams,fileMd5,File,chunkCount,fileSize);

          }
             
         
      },

    sendMsg(fileMd5,filename,newFileName,totalChunks,totalSize,mergePath,uploadStatus) {
      
      this.$emit('fileSuccess',{
          "room_id":this.room_id,
          "identifier":fileMd5,
          "filename":filename,
          "newFileName":newFileName,
          "totalChunks":totalChunks,
          "totalSize":totalSize,
          "mergePath":mergePath,
          "uploadStatus":uploadStatus
      });

    },          

    /**
     * 上传大文件
     * @param {*} initUploadParams 
     * @param {*} fileMd5 
     * @param {*} File 
     * @param {*} chunkCount 
     * @param {*} fileSize 
     */
    async checkChunkExis(initUploadParams,fileMd5,File,chunkCount,fileSize) {
         // 调用后端检查文件上传情况接口
         await this.$store.dispatch("checkChunkExis", initUploadParams).then (res => {
          
              if (res.code !== 10000) {
                 this.$alert(res.msg);
                 return;
              }
              let uploadStatus = 0
              if (res.data.type === 1) {         
                uploadStatus = 3;   
              } 
              this.sendMsg(fileMd5,File.name,res.data.newFileName,chunkCount,fileSize,res.data.mergePath,uploadStatus)
              this.type = res.data.type
              this.file = File

                    
             
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

     async getMsg(data) {
      
        if (data.content_type != 0) {
          this.msgInfo = data
          let chunkCount = data.total_chunks
          let fileSize   = data.file_size
          let fileMd5    = data.md5
          let newFileName = data.file_name
          let seq = data.seq
          if (this.type === 0) {
            await  this.chunk(chunkCount,fileSize,fileMd5,newFileName,seq);
          }
         
          
        }

      },
       chunk(chunkCount,fileSize,fileMd5,newFileName,seq) {
        let File = this.file
        let num = 0
        
        for (var i = num; i < chunkCount; i++) {
            //分片开始位置
            let start = i * chunkSize
            //分片结束位置
            let end = Math.min(fileSize, start + chunkSize)
            //取文件指定范围内的byte，从而得到分片数据
            let chunkNumber = i
            
            let _chunkFile = File.raw.slice(start, end)
            var reader=new FileReader();
            reader.readAsDataURL(_chunkFile)

            let uploadProgress = (chunkNumber+1)/chunkCount*100
            reader.onload = e => {        
              let data = {
                "seq":seq,
                "user_id":this.user_id,
                "room_id":this.room_id,
                "identifier":fileMd5,
                "filename":File.name,
                "totalChunks":chunkCount,
                "chunkNumber":chunkNumber,
                "totalSize":fileSize,
                "newFileName":newFileName,
                "file":e.target.result,
                "chunkSize":chunkSize,
                "uploadProgress":uploadProgress.toFixed(2) + '%'
              }
              console.log("开始上传第" +chunkNumber + "个分片")
              this.$socket.emit('chunkFile',data);  
              
            }         

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
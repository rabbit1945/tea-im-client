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
                        <div contenteditable = "false" class="text" v-if = "this.source.content_type === 1">

                            <av-bars
                            :canv-height ="30"
                            :audio-src=this.source.msg>
                            </av-bars>

                        </div>
                        <!-- 图片 -->
                        <div contenteditable = "false" class="text" v-if = "this.source.content_type === 2">
                            <img  style="max-width: 800px;max-height: 800px;" :src=this.source.msg>
                            <!-- <img  @click="closeImagesClick()" :style=style :src=this.source.msg> -->
                        </div>
                        <!-- 文件 -->

                        <div @click="down()" contenteditable = "false" class="text file" v-if = "this.source.content_type === 3">
                          
                           <div>
                            {{ this.source.file_name }}
                            <a :href=this.source.msg ref = "downFile" style="display: none;"></a>
                           </div>
                           <div class="fileSize" contenteditable="false"> {{ this.source.file_size }}KB</div>

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
                style: "max-height: 100vh;max-width: 60vw; display:none;"
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
      
               let downFile =this.$refs.downFile;
               downFile.click()    
            },

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
  
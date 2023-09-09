<template>
    <div>
        <span class='time-line'>{{ this.source.send_time }} </span>
        <div :class = "this.source.tag == 1 ? 'stream-item' : 'stream-item creator' ">
            <div :class = "this.source.tag == 1 ? 'item' : 'item creator'">
                <div class="avatar">
                    <img :src=this.source.userLogo>
                </div>
                <div class = "body">
                    <div :class = "this.source.tag == 1 ? 'name' :'name transform' ">{{ this.source.nick_name }}</div>
                    <div class = "content">
                        <div  class="text"  v-if = "this.source.content_type === 0"  >
                            <div v-html="this.source.msg"></div>
                            <!-- {{ this.source.msg }} -->
                        </div>

                        <div class="text" v-if = "this.source.content_type === 1">
                            <mini-audio
                                :audio-source= this.source.msg
                                @canplay="showLong"
                                :volume="[leftVolume, rightVolume]"
                            ></mini-audio>
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
                volume:0,
                balance: 50,       
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
        mounted(){
            
        },
        computed: {
            leftVolume() {
                return this.balance < 50 ? 1 : 1 - ((this.balance - 50) / 50);
            },
            rightVolume() {
                return this.balance > 50 ? 1 : this.balance / 50;
            }
        },
        methods:{
            showLong() {//音频加载成功后获取时长
                this.duration = parseInt(this.$refs.audio.duration)

            } 

           
        }
}   
  </script>
  <style scoped>
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
    border-radius: 50%
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
    width: 700px;
    text-align: center;
    vertical-align: middle;
}
</style>
  
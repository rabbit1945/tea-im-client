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
                <div class="text">
                    {{ this.source.msg }}
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
           
            
        mounted(){}
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
 
  
    .message {
      position: relative;
      width: 700px; 
      height: 600px;
      background-color: floralwhite;
      border: 1px solid rgba(245,245,245,.7);
      float: left;
     
      
    }
    
    .msg-list {
      overflow: scroll;  
      height: 440px;

    }

    /* .msg {
      position:relative;
    } */

    
    .msg-frame {
      margin-left: 40px;
      min-width: 30px;
      max-width: 500px;
      min-height: 30px;
      border: 1px;
      border-radius: 10px;
      background-color: white;
      word-break: break-all;
      word-wrap: break-word;
      /*但在有些场景中，还需要加上下面这行代码*/
      white-space: normal;
      overflow: scroll
    }

    .my-userInfo  .msg-frame {
      margin-left: 140px;
      text-align: right;
      background-color: #f0f8ff;
      
    }

  .userInfo-logo img {
      height:40px;
      width: 40px;
      border-radius:20px;

  }
  .userInfo-msg textarea {
    
      width: 400px;
      max-height: 50px;
      padding: 10px ;
      border-radius: 10px;
      background-color: aquamarine;

  }

  .userInfo {
      position: relative;
      margin-left: 20px;
  }

  .userInfo-msg {
      position: absolute;
      top:-52px;
      left: -13px;
  }


  .userInfo-logo img {
      height:40px;
      width: 40px;
      border-radius:20px;
      margin-top: 10px;

  }
  .userInfo-msg textarea {
    
      width: 400px;
      max-height: 50px;
      padding: 10px ;
      border-radius: 10px;
      background-color: aquamarine;

  }



  .my-userInfo {
      position: relative;
      margin-right: 20px;
  }
  .my-userInfo-msg {
      position: absolute;
      top: -12px;
      right: 52px;
  }

  .my-userInfo h4 {
      text-align: right;

  }


  .my-userInfo-logo img {
      float: right;
      height:40px;
      width: 40px;
      border-radius:20px;

  }
  .my-userInfo-msg textarea {
    
      width: 400px;
      max-height: 50px;
      padding: 10px ;
      border-radius: 10px;
      background-color: aquamarine;

  }


  .time-line {
     
      display: inline-block;
      width: 700px;
      text-align: center;
      vertical-align: middle;
  }
</style>
  
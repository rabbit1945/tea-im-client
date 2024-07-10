<template>
  <div id="about">
    
      <router-view></router-view>

    
  </div>
  
</template>

<script>

export default {
  name: "App",
  metaInfo() {
    return {
      title: this.$store.state.message.title, // set a title
      meta: [{                 // set meta
        name: 'keyWords',
        content: 'lightning'
      }],
      link: [{                 // set link
        rel: 'asstes',
        href: 'https://assets-cdn.github.com/'
      }]

    }
   
  },
  data () {
    return {
      title: "闪电"

    }
  },
  mounted () {
    document.oncontextmenu = function (e) {
            return false;
    }
    var browerWidth = window.innerWidth; //浏览器可视宽度
    console.log('browerWidth::',browerWidth);
    var baseWidth = 1440; //设计稿宽度
    var zoomValue = browerWidth / baseWidth; //缩放比例计算
    document.getElementById("about").style.transform = "scale(" + zoomValue + "," + zoomValue + ")"; //mainContainer为主容器id
    window.onresize = function () { //窗口尺寸变化时，重新计算和缩放
      browerWidth = window.innerWidth;
      zoomValue = browerWidth / baseWidth;
      document.getElementById("about").style.transform = "scale(" + zoomValue + "," + zoomValue + ")";
    }
   },

  destroyed() { //离开这个界面之后，删除滚动事件，不然容易除bug
  },

  methods:{
   
    
  }
  
}
</script>

<style>
#about {
  
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  /* text-align: center; */
  color: #2c3e50;
  /* 假设1rem等于100px */
  margin: 0 auto;
}
</style>

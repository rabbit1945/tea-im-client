<template>
  <div class="about">
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
   },

  destroyed() { //离开这个界面之后，删除滚动事件，不然容易除bug
  },

  methods:{
   
    
  }
  
}
</script>

<style>
.about {
  
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  /* text-align: center; */
  color: #2c3e50;
  /* 假设1rem等于100px */
  width: 70rem; /* 相当于750px */
  margin: 0 auto;
  
  
}
</style>

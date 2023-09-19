<template>
   <router-view></router-view>
</template>

<script>

export default {
  name: "App",
  components: {
   
  },
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
   },

  destroyed() { //离开这个界面之后，删除滚动事件，不然容易除bug
  },

  methods:{
   
    
  }
  
}
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>

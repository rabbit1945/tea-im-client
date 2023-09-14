 <template>

  <div class="userList" v-show = "showUser">
    <div class="infinite-list-wrapper"  style="overflow:auto">

        <ul
          class="list"
          v-infinite-scroll="load"
          infinite-scroll-disabled="disabled">
          <li v-for="val in data" @click.left="lineInfo(val)" class="list list-line" id = "userLine" >
            <img class="logo" id = "userLine" :src="val.photo" alt="">
            <template v-if="val.is_online == 'online'">
              <span class="userStatus" style = "background-color: cadetblue;"></span>
            </template>

            <template v-if="val.is_online == 'offline'">
              <span class="userStatus" ></span>
            </template>

           
            {{ val.nick_name }}
          </li>
        </ul>
    </div>
  </div>
 </template>
  <script> 
    export default {
      data () {
        return {
          data :[],
          count: 1,
          noMore:false, //控制滚动禁用 
          loading: false, //控制滚动条禁用
          pages:0 , // 页码
          size: 20, // 条数

        }
      },
      props:['showUser'],
      computed: {
       
        disabled () {
          return this.loading || this.noMore
        }
      },
      mounted(){
          this.load();
      },
      methods: {
        lineInfo(val) {
          console.log(val )
          this.$emit('lineInfo',val)
        },
        load () {
          this.loading = true;
          this.pages += 1 // 每次滚动加1
          this.getUserList();
        },
        // 获取数据
        getUserList() {
          //派发一个action||获取聊天室的用户列表
          this.$store.dispatch("getRoomUserList",{'pages':this.pages,'size':this.size}).then (res => {
            let list = this.$store.state.user.roomUserList.userList;
              console.log(list)
            for (let i = 0; i < list.length; i++) {
              this.data.push(list[i]);
            }
            // 如果请求回来的数据小于Size，则说明数据到底了。
            if (list.length < this.size) {
              this.noMore = true;
            }

            // 避免数据总条数是pageSize的倍数时，数据到底还会请求一次。
            if (this.data.length === this.$store.state.user.roomUserList.total) {
              this.noMore = true;
            }

            this.loading = false;

          }).catch(res=>{
            
          })

          }

      }
    }
  </script>
  
  <!-- Add "scoped" attribute to limit CSS to this component only -->
  <style scoped>
  .logo {
    width: 30px;
    height: 30px;
    border-radius: 15px;
    vertical-align: middle;
  }

  .list {
    position:relative;
    cursor: pointer;
  }
  .list-line:hover {background-color: lightblue;}

.userStatus{
  position: absolute;
  z-index: 1;
  top: 14px;
  left: 18px;
  width: 10px;
  height: 10px;
  border-radius: 5px;
  background-color: grey;
}

    
  </style>
  
<template>
  <div style="width:100vw;height:10vh" @contextmenu.prevent="onContextmenu">
    ssss
  </div>
</template>

<script>
import Vue from 'vue'
import Contextmenu from "vue-contextmenujs"
Vue.use(Contextmenu);
export default {
  name:"RightMenu",
  methods: {
    onContextmenu(event) {
      this.$contextmenu({
        items: [
          {
            label: "复制",
            onClick: () => {
              this.message = "复制";
              console.log("复制");
            }
          },
          {
            label: "撤回",
            onClick: () => {
              this.message = "撤回";
              console.log("复制");
            }
          },
        
        ],
        event, // 鼠标事件信息
        customClass: "custom-class", // 自定义菜单 class
        zIndex: 1, // 菜单样式 z-index
        minWidth: 230 // 主菜单最小宽度
      });
      return false;
    }
  }
};
</script>
<style scoped>
.custom-class .menu_item__available:hover,
.custom-class .menu_item_expand {
  background: #ffecf2 !important;
  color: #ff4050 !important;
}

</style>
<template>
  <div class="home">
    <header class="header">
      <img src="@public/image/logo.png" class="logo">
      <div class="phone">
        <img src="@public/image/phone.png" class="icon-phone">
        <span class="phone-text">400-800-1220</span>
      </div>
    </header>
    <page :currentPage="currentPage" v-for="(banner,index) in bannerList" :key="index" :style="{top:topHeight}">
       <img :src="banner" class="banner">
    </page>
    <page-controller :pageNum="pageNum" :currentPage="currentPage" @changePage="changePage" @switchHeader="switchHeader" :option="controllerOption"></page-controller>
   <!--  <my-map></my-map> -->
    <!-- <window></window> -->
    <chat-robot></chat-robot>
  </div>
</template>

<script>
// @ is an alias to /src
import ChatRobot from "@/components/ChatRobot.vue";
import MyMap from "@/components/MyMap.vue";
import Page from "@/components/Page.vue";
import PageController from "@/components/PageController.vue";
export default {
  name: "home",
  data() {
    return {
      bannerList: [
        require("@/../public/image/banner-1.png"),
        require("@/../public/image/banner-2.png"),
        require("@/../public/image/banner-3.png"),
        require("@/../public/image/banner-4.png")
      ],
      currentIndex: 0,
      currentPage: 1,
      topHeight: 0,
      controllerOption: {
        arrowsType: true,
        navbar: true,
        highlight: true,
        loop: false
      }
    };
  },
  components: {
    ChatRobot,
    Window,
    MyMap,
    Page,
    PageController
  },
  computed: {
    // 总page数
    pageNum() {
      return this.bannerList.length;
    }
  },
  mounted() {
    this.$children.forEach((child, index) => {
      // 动态设置各个page内的options
      if (child.option === null) {
        child.option = { index: index + 1 };
      }
    });
  },
  methods: {
    switchHeader(direction) {
      if (direction === "up") {
        this.topHeight = "140px";
      } else if (direction === "down") {
        this.topHeight = "0px";
      } else if (direction === "clear") {
        this.topHeight = "0px";
      }
    },
    changePage(index) {
      this.currentPage = index;
    }
  }
};
</script>
<style lang="less" scoped>
.home {
  height: 100%;
  width: 100%;
  position: relative;
  z-index: 10;
  overflow: hidden;
}
.header {
  height: 140px;
  display: flex;
  width: 1200px;
  margin: 0 auto;
  justify-content: space-between;
  align-items: center;
  .logo {
    width: 280px;
    height: 90px;
  }
  .phone {
    .icon-phone {
      height: 50px;
      width: 50px;
      vertical-align: middle;
    }
    .phone-text {
      color: #48a39a;
      font-size: 36px;
      margin-left: 18px;
      position: relative;
      top: 8px;
    }
  }
}
.banner {
  width: 100%;
  display: block;
}
</style>


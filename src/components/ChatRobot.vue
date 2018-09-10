<!--  -->
<template>
  <div class="robot-box">
    <div v-show="!isChat" class="robot-stand">
      <vue-drag-resize class="drag-box" :x="100" :y="135" :isActive="true" :w="dragW" :h="dragH" :isResizable="false" :isDraggable="canDrag" :parentLimitation="false" v-on:dragging="resize">
          <img src="@public/image/chat_robot_1.gif" class="set-img" ref="robotStand"   @mousedown="mousedown">
      </vue-drag-resize>  
    </div>   
    <div v-show="isChat" class="robot-chat-box">
        <img src="@public/image/chat_robot_2.gif" class="robot-chat">
        <window class="robot-window" @close="closeWindow" @minimize="minimizeWindow" ref="chatWindow"></window>  
    </div>
  </div> 
</template>

<script>
import Window from "@/components/Window.vue";
import VueDragResize from "vue-drag-resize";
export default {
  name: "chat-robot",
  data() {
    return {
      isChat: false,
      holdChat: false,
      timer: null,
      num: 0,
      canDrag: true, //是否可拖拽,
      dragW: 320,
      dragH: 303
    };
  },

  components: { Window, VueDragResize },

  computed: {
    winWidth() {
      return window.innerWidth;
    },
    winHeight() {
      return window.innerHeight;
    },
    dragSize: {
      get() {
        return {
          width: this.dragW,
          height: this.dragH
        };
      },
      set(w, h) {
        this.dragW = w;
        this.dragH = h;
      }
    }
  },
  mounted() {
    this.dragW = this.$refs.robotStand.clientWidth;
    this.dragH = this.$refs.robotStand.clientHeight;
  },

  methods: {
    //打开聊天窗口
    mousedown() {
      let _this = this;
      this.timer = setInterval(() => {
        _this.num++;
      }, 100);
      document.addEventListener('mouseup',this.mouseup);
    },
    mouseup() {
      clearInterval(this.timer);
      this.timer = null;
      if (this.num < 3) {
        this.openWindow();
      }
      this.num = 0;
      document.removeEventListener('mouseup',this.mouseup);
    },
    openWindow() {
      if (this.holdChat === false) {
        this.$refs.chatWindow.initConversation();
      }
      this.isChat = true;
    },
    minimizeWindow() {
      this.isChat = false;
      this.holdChat = true;
    },
    closeWindow() {
      this.isChat = false;
      this.holdChat = false;
    },
    resize(newRect) {
      this.top = newRect.top;
      this.left = newRect.left;
    }
  }
};
</script>
<style lang='less' scoped>
.robot-box {
  color: #fff;
  font-size: 16px;
  text-align: center;
  position: relative;
  z-index: 100;
  .robot-stand {
    cursor: pointer;
    .set-img {
      width: 400px;
      height: 379px;
    }
  }
  .robot-chat-box {
    position: fixed;
    top: 20%;
    left: 5%;
    .robot-chat {
      width: 400px;
      height: 423px;
    }
    .robot-window {
      position: absolute;
      top: -30%;
      left: 256px;
    }
  }
}
.drag-box {
  &:before {
    content: none !important;
  }
}
</style>
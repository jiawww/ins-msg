<!--  -->
<template>
  <div class="chat-robot" @mousedown="start" @touchstart="start" @mousemove="move" @touchmove="move"
       @mouseup="end" @touchend="end">
    <div class="robot aikf-cartoon-red-showBtn" :style="{backgroundPosition:backgroundPosition}" @mouseover="over" @mouseout="clear"></div>
  </div>
</template>

<script>
export default {
  name: "chat-robot",
  data() {
    return {
      backgroundPosition: "0px",
      timer: null,
      flag: false,
      position: {
        //触摸点坐标
        x: 0,
        y: 0
      },
      range: {
        //移动范围
        minX: "",
        maxX: "",
        minY: "",
        maxY: ""
      },
      nx: "", //触摸点水平移动距离
      ny: "", //触摸点垂直移动距离
      dx: "", //元素初始水平坐标
      dy: "", //元素初始垂直坐标
      xPum: "", //元素新水平坐标
      yPum: "" //元素新垂直坐标
    };
  },

  components: {},

  computed: {
    winWidth() {
      return window.innerWidth;
    },
    winHeight() {
      return window.innerHeight;
    }
  },

  mounted() {},

  methods: {
    // 鼠标悬浮在机器人上
    over() {
      let cartoonIndex = 0;
      let _this = this;
      this.timer = setInterval(function() {
        cartoonIndex++;
        if (cartoonIndex >= 18) {
          cartoonIndex = 0;
        }
        _this.backgroundPosition = -cartoonIndex * 100 + "px";
      }, 80);
    },
    // 清除定时器
    clear() {
      clearInterval(this.timer);
      this.timer = null;
    },
    //拖拽开始
    start() {
      this.flag = true;
      var touch;
      if (event.touches) {
        touch = event.touches[0]; //touches 屏幕上所有触摸点列表
      } else {
        touch = event;
      }
      let moveDiv = this.$el;
      this.position.x = touch.clientX; //触摸点0 距页面左侧距离
      this.position.y = touch.clientY; //触摸点0 距页面上侧距离
      this.dx = moveDiv.offsetLeft; //元素中心点距页面左侧距离
      this.dy = moveDiv.offsetTop; //元素中心点距页面上侧距离
      this.range.minX = moveDiv.offsetWidth / 2;
      this.range.minY = moveDiv.offsetHeight / 2;
      this.range.maxX = this.winWidth - moveDiv.offsetWidth / 2;
      this.range.maxY = this.winHeight - moveDiv.offsetHeight / 2;
    },
    // 拖拽中
    move() {
      if (!this.flag) {
        return;
      }
      var touch;
      if (event.touches) {
        touch = event.touches[0];
      } else {
        touch = event;
      }
      let moveDiv = this.$el;
      this.nx = touch.clientX - this.position.x; //触摸点0  水平移动距离
      this.ny = touch.clientY - this.position.y; //触摸点0  垂直移动距离
      console.log(this.nx,this.ny);
      this.xPum = this.dx + this.nx; //元素水平 原位置+移动距离
      this.yPum = this.dy + this.ny; //元素垂直  原位置+移动距离
      if (this.xPum < this.range.minX) {
        moveDiv.style.left = this.range.minX + "px";
      } else if (this.xPum > this.range.maxX) {
        moveDiv.style.left = this.range.maxX + "px";
      } else {
        moveDiv.style.left = this.xPum + "px";
      }
      if (this.yPum < this.range.minY) {
        moveDiv.style.top = this.range.minY + "px";
      } else if (this.yPum > this.range.maxY) {
        moveDiv.style.top = this.range.maxY + "px";
      } else {
        moveDiv.style.top = this.yPum + "px";
      }
    },
    // 拖拽结束
    end() {
      this.flag = false;
    }
  }
};
</script>
<style lang='less' scoped>
.chat-robot {
  position: fixed;
  left: 50%;
  top: 50%;
  color: #fff;
  font-size: 16px;
  text-align: center;
  cursor: pointer;
  z-index: 100;
  width: 100px;
  height: 270px;
  transform: translate(-50%,-50%);
  .robot {
    text-align: center;
  }
  .aikf-cartoon-red-showBtn {
    width: 100px;
    height: 270px;
    background: url(../../public/image/cartoon-red.png) left top no-repeat;
  }
}
</style>
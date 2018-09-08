<template>
    <nav class="controller">
        <span v-if="option.arrowsType && currentPage>1" class="prev-btn" :class="{moving:option.arrowsType === 'animate'}" @click="changePage(prevIndex)"></span>
        <ul v-if="option.navbar">
            <li v-for="index in pageNum" @click="changePage(index)" :class="{current:option.highlight && (index === currentPage || (index===1 && currentPage===0))}" :key="'controller-'+index" :data-index="index" class="controller-item"></li>
        </ul>
        <span v-if="option.arrowsType && pageNum!==currentPage" class="next-btn" :class="{moving:option.arrowsType === 'animate'}" @click="changePage(nextIndex)"></span>
    </nav>
</template>

<script>
export default {
  name: "page-controller",
  data() {
    return {
      timer: null
    };
  },
  props: {
    pageNum: Number,
    currentPage: Number,
    option: {
      type: Object,
      default() {
        return {
          arrowsType: "animate",
          navbar: true,
          highlight: true,
          loop: true //是否开启滚动循环
        };
      }
    }
  },
  computed: {
    nextIndex() {
      if (this.currentPage === this.pageNum) {
        if (this.option.loop) {
          return 1;
        } else {
          return this.pageNum;
        }
      } else {
        return this.currentPage + 1;
      }
    },
    prevIndex() {
      if (this.currentPage === 0) {
        if (this.option.loop) {
          return this.pageNum;
        } else {
          return 0;
        }
      } else {
        return this.currentPage - 1;
      }
    }
  },
  created() {
    if (this.option.navbar === undefined) {
      this.option.navbar = true;
    }
  },
  mounted() {
    let _this = this;
    let start = 0;
    if (Object.hasOwnProperty.call(window, "onmousewheel")) {
      // 监听滚轮事件
      window.addEventListener(
        "mousewheel",
        function(event) {
          // IE/Opera/Chrome
          let direction = event.wheelDelta > 0 ? "up" : "down";
          _this.scrollHandler(direction);
        },
        false
      );
    } else {
      window.addEventListener(
        "DOMMouseScroll",
        function(event) {
          // Firefox
          let direction = event.detail > 0 ? "up" : "down";
          _this.scrollHandler(direction);
        },
        false
      );
    }
    // 移动端触摸事件处理
    window.addEventListener("touchstart", function(event) {
      start = event.touches[0].clientY;
    });
    window.addEventListener("touchmove", function(event) {
      event.preventDefault();
    });
    window.addEventListener("touchend", function(event) {
      let spacing = event.changedTouches[0].clientY - start;
      let direction;
      if (spacing > 50) {
        direction = "up";
        _this.scrollHandler(direction);
      } else if (spacing < -50) {
        direction = "down";
        _this.scrollHandler(direction);
      }
    });
  },
  methods: {
    changePage(index) {
      this.$emit("changePage", index);
      if (this.currentPage === 0 && this.prevIndex!==0) {
        this.$emit("switchHeader", "clear");
      }
    },
    // 滚轮处理
    scrollHandler(direction) {
      // 防止重复触发滚动事件
      if (this.timer != null) {
        return;
      }
      if (direction === "down") {
        if (this.currentPage === 0) {
          this.$emit("switchHeader", "down");
        }
        this.changePage(this.nextIndex);
      } else {
        if (this.currentPage === 1) {
          this.$emit("switchHeader", "up");
        }
        this.changePage(this.prevIndex);
      }
      let _this = this;
      this.timer = setTimeout(function() {
        clearTimeout(_this.timer);
        _this.timer = null;
      }, 300);
    }
  }
};
</script>

<style scoped lang="less">
.controller {
  position: fixed;
  right: 20px;
  top: 50%;
  z-index: 99;
}
.controller ul {
  transform: translate3d(0, -50%, 0);
  list-style: none;
  margin: 0;
  padding: 0;
}
.controller-item {
  cursor: pointer;
  width: 30px;
  height: 30px;
  border: 2px solid #fff;
  border-radius: 50%;
  box-sizing: border-box;
  &:not(:nth-child(1)) {
    margin-top: 30px;
  }
  border: 2px solid #fff;
  transition: background-color 0.3s ease 0s;
}
.controller-item:hover {
  border: none;
  background: #60d18c;
}
.controller-item.current {
  border: none;
  background: #60d18c;
}
.prev-btn,
.next-btn {
  cursor: pointer;
  display: block;
  text-align: center;
  width: 60px;
  height: 60px;
  position: fixed;
  left: 50%;
  margin-left: -10px;
  background-size: 60px 60px;
}
.prev-btn {
  top: 60px;
  background-image: url("../../public/image/arrow_up.png");

  &:hover {
    animation: prev-up-down 0.7s linear 0s infinite;
  }
}
.next-btn {
  bottom: 60px;
  background-image: url("../../public/image/arrow_down.png");
  &:hover {
    animation: next-up-down 0.7s linear 0s infinite;
  }
}
.prev-btn.moving {
  animation: prev-up-down 0.7s linear 0s infinite;
}
.next-btn.moving {
  animation: next-up-down 0.7s linear 0s infinite;
}
@keyframes next-up-down {
  0% {
    transform: translate3d(0, 0, 0);
  }
  25% {
    transform: translate3d(0, 10px, 0);
  }
  50% {
    transform: translate3d(0, 0, 0);
  }
  75% {
    transform: translate3d(0, -10px, 0);
  }
  100% {
    transform: translate3d(0, 0, 0);
  }
}
@keyframes prev-up-down {
  0% {
    transform: translate3d(0, 0, 0);
  }
  25% {
    transform: translate3d(0, -10px, 0);
  }
  50% {
    transform: translate3d(0, 0, 0);
  }
  75% {
    transform: translate3d(0, 10px, 0);
  }
  100% {
    transform: translate3d(0, 0, 0);
  }
}
</style>

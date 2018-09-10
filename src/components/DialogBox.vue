<!-- 对话框 -->
<template>
  <div class="dialog-box">
    <p class="show-time">{{currentTime}}</p>
    <div v-if="msg.id===1" class="robot-msg">
      <img src="@public/image/robot.png" class="avatar">
      <div class="msg-box">
        <img src="@public/image/chat_1.png" class="msg-triangle">
        <p class="msg-text" v-if="msg.showMap">
          <span>{{msg.msg}}</span>
          <my-map :point="msg.showMap"></my-map>
        </p>
        <p class="msg-text" v-else>{{msg.msg}}</p>
      </div>
    </div>
    <div v-else class="user-msg">
      <div class="msg-box">
        <p class="msg-text">{{msg.msg}}</p>
        <img src="@public/image/chat_2.png" class="msg-triangle">
      </div>
      <img src="@public/image/user.png" class="avatar">
    </div>
  </div>
</template>

<script>
import MyMap from "@/components/MyMap"
export default {
  name: "dialog-box",
  props: {
    msg: {
      type: Object,
      // required: true,
      default() {
        return {
          id: 1,
          msg: "666",
          showMap:null
        };
      }
    }
  },
  data() {
    return {};
  },

  components: {MyMap},

  computed: {
    currentTime() {
      let time = new Date(),
        h = time.getHours(),
        min = time.getMinutes(),
        s = time.getSeconds();
      function handleNum(num) {
        return num > 9 ? num : "0" + num;
      }
      return ""+handleNum(h)+":"+handleNum(min)+":"+handleNum(s);
    }
  },

  mounted() {},

  methods: { }
};
</script>
<style lang='less' scoped>
.dialog-box {
  .show-time {
    text-align: center;
    margin-bottom: 8px;
    color: #c4c4c4;
    font-size: 18px;
  }
  .avatar {
    width: 72px;
    height: 72px;
  }
  .msg-box {
    position: relative;
    // flex:1;
    max-width: 670px;
    .msg-triangle {
      width: 16px;
      height: 24px;
      position: absolute;
      top: 30px;
    }
    .msg-text {
      font-size: 22px;
      padding: 20px;
      border-radius: 10px;
      margin: 10px 0;
      text-align:left;
    }
  }
  .robot-msg {
    display: flex;
    justify-content: flex-start;
    align-content: flex-start;
    .msg-box {
      padding-left: 16px;
      .msg-triangle {
        left: 0;
      }
      .msg-text {
        background: #f5f5f5;
        color: #333;
      }
    }
  }
  .user-msg {
    display: flex;
    justify-content: flex-end;
    align-content: flex-start;
    .msg-box {
      padding-right: 16px;
      .msg-triangle {
        right: 0;
      }
      .msg-text {
        background: #44cabc;
        color: #fff;
      }
    }
  }
}
</style>
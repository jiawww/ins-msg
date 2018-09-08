<!-- 对话框 -->
<template>
  <div class="dialog-box">
    <div v-if="msg.id===1" class="robot-msg">
      <img src="@public/image/robot.png" class="avatar">
      <div class="msg-box">
        <img src="@public/image/chat_1.png" class="msg-triangle">
        <p class="msg-text">{{msg.text}}</p>
      </div>
    </div>
    <div v-else class="user-msg">
      <div class="msg-box">
        <p class="msg-text">{{msg.text}}</p>
        <img src="@public/image/chat_2.png" class="msg-triangle">
      </div>
      <img src="@public/image/user.png" class="avatar">
    </div>
  </div>
</template>

<script>
export default {
  name: "dialog-box",
  props: {
    msg: {
      type: Object,
      required: true,
      default() {
        return {
          id: 1,
          text: "666"
        };
      }
    }
  },
  data() {
    return {};
  },

  components: {},

  computed: {},

  mounted() {},

  methods: {}
};
</script>
<style lang='less' scoped>
.dialog-box {
  .avatar {
    width: 72px;
    height: 72px;
  }
  .msg-box {
    position: relative;
    flex:1;
    max-width:670px;
    .msg-triangle{
      width:16px;
      height:24px;
    }
    .msg-text {
      font-size: 22px;
      padding: 20px;
      border-radius: 10px;
    }
  }
  .robot-msg {
    display: flex;
    justify-content: flex-start;
    align-content: flex-start;
    .msg-box {
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
      .msg-text {
        background: #44cabc;
        color:#fff;
      }
    }
  }
}
</style>
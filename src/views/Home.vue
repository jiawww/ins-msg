<template>
  <div class="home">
    <header class="title">对话AI</header>
    <img alt="Vue logo" src="../assets/logo.png">
    <chat-robot></chat-robot>
  </div>
</template>

<script>
// @ is an alias to /src
import ChatRobot from '@/components/ChatRobot.vue'

export default {
  name: 'home',
  components: {
    ChatRobot
  }
}
</script>
<style lang="less" scoped>
.home{
  height:100%;
  width:100%;
  position:relative;
  z-index:10;
}
.title{
  height:50px;
  line-height:50px;
  font-weight: bold;
  font-size:22px;
}
</style>


<template>
  <div class="home">
    <h1>对话AI</h1>
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

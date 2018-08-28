<!--  -->
<template>
  <div class="chat-robot">
    <div class="robot aikf-cartoon-red-showBtn" :style="{backgroundPosition:backgroundPosition}" @mouseover="over" @mouseout="clear"></div>
  </div>
</template>

<script>
export default {
  name:'chat-robot',
  data () {
    return {
      backgroundPosition:"0px",
      timer:null
    };
  },

  components: {},

  computed: {},

  mounted(){},

  methods: {
    over(){ 
     let cartoonIndex = 0;
     let _this=this;
     this.timer = setInterval(function () {
        cartoonIndex++;
        if (cartoonIndex >= 18) {
          cartoonIndex = 0;
        }
          _this.backgroundPosition = -cartoonIndex * 100 + 'px';
        }, 80)
    },
    clear(){
      clearInterval(this.timer);
      this.timer=null;

    }
  }
}

</script>
<style lang='less' scoped>
  .chat-robot{
    .robot{
      position: absolute;
      left:0px;
      bottom:0px;
      color:#fff;
      font-size:16px;
      text-align: center;
      cursor:pointer;
    }
    .aikf-cartoon-red-showBtn{
      width:100px;
      height:270px;
      background: url(../../public/image/cartoon-red.png) left top no-repeat;
    }

  }
</style>
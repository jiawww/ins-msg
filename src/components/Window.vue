<!--  -->
<template>
  <div class="window">
    <div class="window-header">
      <div class="title">
        <img src="@public/image/robot.png" class="title-icon">
        <img src="@public/image/text.png" class="title-text">
      </div>
      <div>
        <img src="@public/image/icon_close.png" class="icon-right" @click="close">
        <img src="@public/image/icon_small.png" class="icon-right" @click="minimize">
      </div>
    </div>
    <div class="window-content" @wheel="scrollBarWheel($event)" ref="chatContent">
      <p class="tip">可爱的小电，为您服务</p>
      <dialog-box v-for="(msg,index) in msgList" :key="index" :msg="msg"></dialog-box>
    </div>
    <div class="window-textarea">
      <div class="textarea-box">
        <textarea v-model="msg" @keydown="show($event)" class="set-textarea" placeholder="请在此输入您要咨询的问题..." @wheel="scrollBarWheel($event)"></textarea>
      </div>
      <div class="enter">
        <span class="enter-text">快捷键&nbsp;&nbsp;Enter</span>
        <button class="btn-send" @click="send(msg)" :disabled="!canSend">发送</button>
      </div>
    </div>
    <!-- <button @click="send(msg)">发送</button> -->
    <!-- <button @click="sendNum">发送编码</button> -->
    <!-- <button @click="websocketsend">websocket发请求</button> -->
    <!-- <button @click="getPosition">百度地图定位</button> -->
    <!-- <button @click="showPosition">百度地图逆地址解析</button> -->
  </div>
</template>

<script>
import httpConfig from "@/../public/httpConfig";
import DialogBox from "@/components/DialogBox";
export default {
  name: "window",
  data() {
    return {
      msg: "",
      msgList: [],
      getConfig: {
        interface: "conversation",
        method: "sentence"
      },
      point: {},
      websock: null,
      myPosition: {}
    };
  },

  components: { DialogBox},

  computed: {
    canSend() {
      let msg = this.msg.trim();
      return msg !== "";
    }
  },
  watch: {
    msgList() {
      this.$nextTick(() => {
        let el = this.$refs.chatContent;
        el.scrollTop = el.scrollHeight;
      });
    }
  },
  mounted() {},
  directives: {
    focus: {
      // 指令的定义
      inserted: function(el) {
        el.focus();
      }
    }
  },
  methods: {
    // 指定区域鼠标滚动触发事件
    scrollBarWheel(e) {
      this.handleEventDelta(e, e.deltaY);
    },
    //处理滚动事件
    handleEventDelta(e, delta) {
      const isDeltaPositive = delta > 0;
      const el = e.target.tagName === "TEXTAREA" ? e.target : this.$el;
      const { scrollTop, scrollHeight, clientHeight } = el;
      let shouldCancelScroll = false;
      if (isDeltaPositive && delta > scrollHeight - clientHeight - scrollTop) {
        // bottom limit
        el.scrollTop = scrollHeight;
        shouldCancelScroll = true;
      } else if (!isDeltaPositive && -delta > scrollTop) {
        // top limit
        el.scrollTop = 0;
        shouldCancelScroll = true;
      }
      if (shouldCancelScroll) {
        this.cancelScrollEvent(e);
      }
    },
    // 阻止滚动冒泡事件
    cancelScrollEvent(e) {
      e.stopImmediatePropagation();
      return false;
    },
    show(e) {
      this.msg = this.msg.trim();
      if (e.key == "Enter") {
        e.preventDefault();
        if (this.msg !== "") {
          this.send(this.msg);
        } else {
          alert("输入内容不能为空");
        }
      } else {
        return;
      }
    },
    // 发送
    send(val) {
      if (val !== "start" && !/[^{][}$]/.test(val)) {
        this.msgList.push({ id: 2, msg: val });
        this.msg = this.msg.trim();
        if (this.msg === "") {
          alert("输入内容不能为空");
          return;
        }
      }
      let url = httpConfig.url;
      let method = this.getConfig.method;
      let data = {};
      data[method] = val;
      let _this = this;
      this.$axios
        .get(url + this.getConfig.interface, { params: data })
        .then(res => {
          // console.log(res);
          _this.msg = "";
          let obj = res.data;
          if (obj.sentence.length !== 0) {
            if (method === "get_position") {
              // console.log(JSON.parse(val));
              _this.msgList.push({
                id: 1,
                msg: obj.sentence,
                showMap: JSON.parse(val)
              });
            }
            if (
              obj.sentence.indexOf("[") !== -1 &&
              obj.sentence.indexOf("]") === obj.sentence.length - 1
            ) {
              let str = obj.sentence,
                idx,
                tip,
                jsonArr;
              idx = str.indexOf("[");
              tip = str.slice(0, idx);
              jsonArr =JSON.parse(str.slice(idx,));              
              _this.msgList.push({ id: 1, msg: tip,tableData: jsonArr});
            } else {
              _this.msgList.push({ id: 1, msg: obj.sentence });
            }

            // console.log(data);
          } else {
            _this.msgList.push({ id: 1, msg: "请稍后" });
          }

          if (obj.method) {
            if (obj.method == "done") {
              _this.getConfig = {
                interface: obj.interface,
                method: "sentence"
              };
              _this.send("start");
              return;
            }

            _this.getConfig = {
              interface: obj.interface,
              method: obj.method
            };
            if (
              obj.interface === "service_hall" &&
              obj.method === "get_position"
            ) {
              _this.getPosition();
            }
          } else {
            _this.getConfig.interface = obj.interface;
          }
        });
    },
    getPosition() {
      var geolocation = new BMap.Geolocation();
      let _this = this;
      let position = {};
      geolocation.getCurrentPosition(
        function(r) {
          if (this.getStatus() == BMAP_STATUS_SUCCESS) {
            // alert("您的位置：" + r.point.lng + "," + r.point.lat);
            _this.point = r.point;
            position = {
              longitude: r.point.lng,
              latitude: r.point.lat
            };
            _this.send(JSON.stringify(position));
          } else {
            alert("failed" + this.getStatus());
          }
        },
        { enableHighAccuracy: true }
      );
    },
    initConversation() {
      this.getConfig = {
        interface: "conversation",
        method: "sentence"
      };
      this.send("start");
    },
    close() {
      this.$emit("close");
      this.msgList = [];
    },
    minimize() {
      this.$emit("minimize");
    }
  }
};
</script>
<style lang='less' scoped>
.window {
  // width:1200px;
  // height:760px;
  width: 1200px;
  height: 760px;
  background: #fff;
  border-radius: 10px;
}
.window-header {
  height: 100px;
  background: linear-gradient(to bottom, #34bdc4, #65e3ac);
  border-radius: 10px 10px 0 0;
  display: flex;
  justify-content: space-between;
  align-content: center;
  .title {
    line-height: 100px;
    .title-icon {
      height: 72px;
      vertical-align: middle;
      margin-left: 20px;
    }
    .title-text {
      height: 40px;
      vertical-align: middle;
    }
  }
  .icon-right {
    float: right;
    margin-top: 18px;
    width: 30px;
    height: 30px;
    cursor: pointer;
    &:nth-child(1) {
      margin-right: 26px;
    }
    &:nth-child(2) {
      margin-right: 30px;
    }
  }
}
.window-content {
  height: 440px;
  width: 100%;
  padding: 36px 30px 0;
  box-sizing: border-box;
  overflow-y: auto;
  border-bottom: 1px solid #e0e0e0;
  .scrollbar;
  .tip {
    font-size: 18px;
    color: #c4c4c4;
    margin: 0;
  }
}
.window-textarea {
  height: 220px;
  .textarea-box {
    height: 130px;
    width: 100%;
    .set-textarea {
      width: 100%;
      height: 100%;
      border: none;
      outline: none;
      resize: none;
      box-sizing: border-box;
      padding: 28px 30px 0;
      font-size: 20px;
      color: #000;
      overflow-y: auto;
      .placeholder-class {
        font-size: 22px;
        font-weight: normal;
        color: #c4c4c4;
      }
      .scrollbar;
      &::-webkit-input-placeholder {
        .placeholder-class;
      }
      &::-moz-input-placeholder {
        .placeholder-class;
      }
      &:-moz-input-placeholder {
        .placeholder-class;
      }
      &::-ms-input-placeholder {
        .placeholder-class;
      }
    }
  }
  .enter {
    height: 90px;
    line-height: 90px;
    text-align: right;
    padding-right: 30px;
    .enter-text {
      font-size: 20px;
      color: #c4c4c4;
      margin-right: 20px;
    }
  }
}
.btn-send {
  width: 120px;
  height: 56px;
  line-height: 56px;
  text-align: center;
  border-radius: 10px;
  border: none;
  outline: none;
  background: #44cabc;
  color: #fff;
  font-size: 22px;
  cursor: pointer;
  .disabled-class {
    opacity: 0.6;
  }
  &:active {
    .disabled-class;
  }
  &:hover {
    .disabled-class;
  }
  &:disabled {
    .disabled-class;
  }
}
.scrollbar {
  /*滚动条样式*/
  &::-webkit-scrollbar {
    /*滚动条整体样式*/
    width: 10px; /*高宽分别对应横竖滚动条的尺寸*/
    height: 95px;
  }
  &::-webkit-scrollbar-thumb {
    border-radius: 5px;
    background: #b9b9b9;
  }
}
</style>
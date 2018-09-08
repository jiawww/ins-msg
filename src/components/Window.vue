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
        <img src="@public/image/icon_small.png" class="icon-right">
      </div>    
    </div>
    <div class="window-content">
      <p v-for="(item,index) in msgList" :key="index" v-show="item.msg!=='start'">
        <span>{{item.id}}：</span>
        <span>{{item.msg}}</span>
      </p>
      <dialog-box></dialog-box>
      <dialog-box :msg="{id:2,text:'查电费'}"></dialog-box>
    </div>
    <div class="window-textarea">
      <div class="textarea-box">
        <textarea v-model="msg" @keydown="show($event)" class="set-textarea" placeholder="请在此输入您要咨询的问题..."></textarea>
      </div>
      <div class="enter">
        <span class="enter-text">快捷键&nbsp;&nbsp;Enter</span>
        <button class="btn-send">发送</button>
      </div>
    </div>
    <button @click="send(msg)">发送</button>
    <!-- <button @click="sendNum">发送编码</button> -->
    <!-- <button @click="websocketsend">websocket发请求</button> -->
    <button @click="getPosition">百度地图定位</button>
    <button @click="showPosition">百度地图逆地址解析</button>
  </div>
</template>

<script>
import httpConfig from "@/../public/httpConfig";
import DialogBox from "@/components/DialogBox"
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

  components: {DialogBox},

  computed: {},

  mounted() {
    this.send("start");
  },

  methods: {
    show(ev) {
      if (ev.key == "Enter") {
        this.send(this.msg);
      } else {
        return;
      }
    },
    send(val) {
      if (val !== "start" && !/[^{][}$]/.test(val)) {
        this.msgList.push({ id: "2", msg: val });
      }
      let url = httpConfig.url;
      let method = this.getConfig.method;
      let data = {};
      data[method] = val;
      console.log(data);
      let _this = this;
      this.$axios
        .get(url + this.getConfig.interface, { params: data })
        .then(res => {
          _this.msg = "";
          console.log(res);
          let obj = res.data;
          if (obj.sentence.length !== 0) {
            _this.msgList.push({ id: "1", msg: obj.sentence });
          } else {
            _this.msgList.push({ id: "1", msg: "请稍后" });
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
    showPosition() {
      var geoc = new BMap.Geocoder();
      geoc.getLocation(this.point, function(rs) {
        var addComp = rs.addressComponents;
        console.log(addComp);
        alert(
          addComp.province +
            ", " +
            addComp.city +
            ", " +
            addComp.district +
            ", " +
            addComp.street +
            ", " +
            addComp.streetNumber
        );
      });
    },
    close() {
      this.$emit("close");
    }
    /*  nativePosition() {
       if (navigator.geolocation) {
        alert("你的浏览器支持Geolocation API");
        debugger
        navigator.geolocation.getCurrentPosition(
          function(p) {
            console.log(p);
            debugger
            var latitude = p.coords.latitude;
            var longitude = p.coords.longitude;
            alert("纬度"+latitude+"经度"+longitude);
            // createMap(latitude,longitude);
            // alert(1);
          },
          function(e) {
            console.log(e);
          }
        );
      } else {
        alert("你的浏览器不支持Geolocation API");
      }
    } */
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
  padding:36px 30px 0;
  box-sizing: border-box;
  overflow-y: auto;
  border-bottom: 1px solid #e0e0e0;
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
      .placeholder-class {
        font-size: 22px;
        font-weight: normal;
        color: #c4c4c4;
      }
      &::-webkit-input-placeholder{.placeholder-class}
      &::-moz-input-placeholder{.placeholder-class}
      &:-moz-input-placeholder{.placeholder-class}
      &::-ms-input-placeholder{.placeholder-class}
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
  .disabled-class{
    opacity: 0.6;
  }
  &:active{.disabled-class}
  &:hover{.disabled-class}
  &:disabled{.disabled-class}
}
</style>
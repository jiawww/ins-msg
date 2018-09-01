<!--  -->
<template>
  <div class="window">
    <div class="chat-history">
      <p v-for="(item,index) in msgList" :key="index" v-show="item.msg!=='start'">
        <span>{{item.id}}：</span>
        <span>{{item.msg}}</span>
      </p>
    </div>
    <div>
      <textarea name="" id="" cols="30" rows="10" v-model="msg" @keydown="show($event)"></textarea>
    </div>
    <button @click="send(msg)">发送</button>
    <!-- <button @click="sendNum">发送编码</button> -->
    <!-- <button @click="websocketsend">websocket发请求</button> -->
    <button @click="getPosition">百度地图定位</button>
    <button @click="showPosition">百度地图逆地址解析</button>
  </div>
</template>

<script>
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

  components: {},

  computed: {},

  mounted() {
    this.send("start");
    // this.initWebSocket();
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
      let url = "/api";
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
.chat-history {
  border: 1px solid blue;
  width: 80%;
  height: 200px;
  overflow-y: auto;
  margin: 0 auto;
}
</style>
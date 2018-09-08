<!--  -->
<template>
  <div>
    <div class="map-box" ref="myMap"></div>
  </div>
</template>

<script>
export default {
  name: "my-map",
  props: {
    point: {
      type: Object,
      default() {
        return {
          longitude: 116.40387397,
          latitude: 39.91488908
        };
      }
    }
  },
  data() {
    return {};
  },

  components: {},

  computed: {},

  mounted() {
    this.initMap();
  },

  methods: {
    initMap() {
      let el = this.$refs.myMap;
      let _this = this;
      var map = new BMap.Map(el); //初始化地图
      map.addControl(new BMap.NavigationControl()); //初始化地图控件
      map.addControl(new BMap.ScaleControl());
      map.addControl(new BMap.OverviewMapControl());
      var point = new BMap.Point(this.point.longitude, this.point.latitude);
      map.centerAndZoom(point, 15); //初始化地图中心点
      var marker = new BMap.Marker(point); //初始化地图标记
      marker.enableDragging(); //标记开启拖拽

      var gc = new BMap.Geocoder(); //地址解析类
      //添加标记拖拽监听
      marker.addEventListener("dragend", function(e) {
        //获取地址信息
        gc.getLocation(e.point, function(rs) {
          _this.showLocationInfo(e.point, rs);
        });
      });

      //添加标记点击监听
      marker.addEventListener("click", function(e) {
        gc.getLocation(e.point, function(rs) {
          _this.showLocationInfo(e.point, rs);
        });
      });

      map.centerAndZoom(point, 15); //设置中心点坐标和地图级别
      map.addOverlay(marker); //将标记添加到地图中
    },
    showLocationInfo(pt, rs) {
      var opts = {
        width: 250, //信息窗口宽度
        height: 100, //信息窗口高度
        title: "" //信息窗口标题
      };

      var addComp = rs.addressComponents;
      var addr =
        "当前位置：" +
        addComp.province +
        ", " +
        addComp.city +
        ", " +
        addComp.district +
        ", " +
        addComp.street +
        ", " +
        addComp.streetNumber +
        "<br/>";
      addr += "纬度: " + pt.lat + ", " + "经度：" + pt.lng;

      alert(addr);
    }
  }
};
</script>
<style lang='less' scoped>
.map-box {
  width: 600px;
  height: 300px;
  margin: 10px auto 0;
}
</style>
<!--  -->
<template>
  <div class="table-box">
    <table class="set-table">
      <thead class="table-head">
        <tr>
          <th v-for="(item,key,index) in tableData[0]" :key="index">{{key}}</th>
        </tr>
      </thead>
      <tbody class="table-body">
        <tr v-for="(item,index) in tableData" :key="index">
          <td v-for="(val,idx) in item" :key="idx">{{val}}</td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script>
export default {
  name: "my-table",
  data() {
    return {};
  },
  props: {
    tableData: {
      type: Array,
      default() {
        return [
          {
            营业厅名称: "客服中心营业厅",
            营业厅地址: "常青路6号院",
            营业时间: "工作日：8:30-17:30周休日：8:30-17:30法定节假日：休息",
            营业厅电话: "63232574（前台）63232547（收费）",
            所属区域: "海淀区"
          },
          {
            营业厅名称: "双榆树供电营业所",
            营业厅地址: "双榆树南里二区8号",
            营业时间: "工作日：8:30-17:30周休日和法定节假日：休息",
            营业厅电话: "63129796",
            所属区域: "海淀区"
          }
        ];
      }
    }
  },
  components: {},

  computed: {},

  mounted() {},

  methods: {}
};
</script>
<style lang='less' scoped>
.set-table {
  border-collapse: collapse;
  .table-head {
    background: #CBEDE0;
    font-size: 18px;
    tr {
      line-height: 50px;
    }
    th {
      width: 20%;
      padding-left:10px;
    }
  }
  .table-body {
    font-size: 16px;
    tr {
      line-height:24px;
      &:nth-child(n) {
        background: #F5FAFA;
      }
      &:nth-child(2n) {
        background: #E3EDEA;
      }
    }
    td{
       padding-left:10px;
    }
  }
}
</style>
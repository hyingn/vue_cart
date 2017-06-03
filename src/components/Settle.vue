<!-- DetailHeader.vue -->
<template>
  <div>
    <div class="header">
      <div class="header_inner flexWrap">
        <div
          id="header_btn_nav"
          class="header_btn header_btn_back"
          @click="goBack"
        >返回</div>
        <div class="header_cont flex">结算</div>
        <div class="header_btn header_btn_cart"></div>
      </div>
    </div>
    <p>您需要支付的金额为<span class="price">￥{{ $route.query.price }}</span></p>
  </div>


</template>

<style>
  .flexWrap {
    display: -webkit-flex;
    display: flex;
  }
  .flex {
    flex: 1;
  }
  .header {
    height: 40px;
  }
  .header_inner {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    z-index: 99;
    max-width: 640px;
    height: 50px;
    box-sizing: border-box;
    margin: 0 auto;
    border-bottom: 2px solid #80ccd6;
    background-color: #fff;
  }
  .header_btn {
    width: 50px;
    height: 100%;
    background-repeat: no-repeat;
  }
  .header_btn_back {
    line-height: 50px;
  }
  .header_cont {
    text-align: center;
    line-height: 50px;
    font-size: 15px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
  .header_btn:active {
    opacity: 0.7;
  }
  .price {
    color: red;
    font-size: 30px;
  }
</style>
<script>
  export default {
    name: 'Settle',
    methods: {
      goBack(){
        window.history.back();
      }
    }
  }
</script>

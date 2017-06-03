<template>
  <div id="shoppingCar">
    <form>
      <table class="detial-wrap">
        <tr>
          <th>商品信息</th>
          <th>商品金额</th>
          <th>商品数量</th>
          <th>总金额</th>
          <th>编辑</th>
        </tr>
        <tr v-for="(item,index) in filterItem">
          <td class="goods-detial-wrap">
            <div class="checkbox-wrap left">
              <span class="checkbox" :class="{ checked: item.checked }" @click="selItem(item)"></span>
            </div>
            <div class="goods-detial right">
              <div class="good-img left"><img :src="item.imgPic" /></div>
              <div class="good-text left">
                <div class="name">{{index+1}} {{item.name}}</div>
                <dl class="gifts">
                  <dt>赠送：</dt>
                  <dd v-for="gift in item.gifts">{{gift}}</dd>
                </dl>
              </div>
            </div>
          </td>
          <td class="unitprice">{{item.price|Money}}</td>
          <td class="buy-num">
            <div class="choosenum-handler">
              <i class="icon-minus" @click="changeCount(item,-1)"></i>
              <input class="countbox" v-model="item.count">
              <i class="icon-plus" @click="changeCount(item,1)"></i></div>
            <div class="stock onsell"></div>
          </td>
          <td class="amount">{{item.price*item.count|Money}}</td>
          <td class="icon icon-delete" @click="delConfirm(item)">删除</td>
        </tr>
      </table>
      <p class="show-more" @click="showAll" :class="{hide: isMore}">显示更多</p>
      <footer class="checkout-wrap">
        <div class="total-check-wrap left">
          <div class="checkbox-wrap left">
            <span class="checkbox" @click="selAll" :class="{'checked': selAllFlag}"></span>
          </div>
          <div class="check-text"><span class="checked-all" >全选</span>
          </div>
        </div>
        <div class="checkout right">
          <div class="total-money"><span class="name">总金额 :</span><span class="amount">{{totalMoney|Money}}</span></div>
          <!--<router-link :to="{ path: 'settle', query: { price: totalMoney}}" class="jiesuan">结算</router-link>-->
          <div  class="jiesuan" @click="jsFun">结算</div>

       </div>
     </footer>
   </form>
   <div class="other-box">
   </div>
   <div class="push-over"  v-bind:class="{ 'push-show': pushflag }" >
     <div class="push-box">
       <p>确认删除？</p>
       <button class="danger ok" @click="delItem" >yes</button>
       <button class="cancel" @click="pushflag=0">no</button>
     </div>
   </div>
    <div class="push-over"  v-bind:class="{ 'push-show': jsFlag }" >
      <div class="push-box">
        <p>请选择商品</p>
        <button class="danger ok" @click="jsFlag=!jsFlag" >yes</button>
      </div>
    </div>
 </div>
</template>
<script>
 export default {
   data () {
     return {
       items: [],
       pushflag: 0,
       totalMoney: 0,
       selAllFlag: 0,
       showNum: 3,
       isMore: 0,
       jsFlag: 0
     }
   },
   created () {
     this.$http.get('/api/pic').then((res) => {
       console.log(res.data.data);
       this.items = res.data.data
     })
   },
   computed: {
     filterItem () {
       return this.items.slice(0,this.showNum);
     }
   },
   methods: {
     changeCount (item, type) {
       if(type>0) {
         item.count ++;
         if(item.count>item.allCount){
           item.count = item.allCount
         }
       }else {
           item.count --;
           if(item.count<1){
               item.count = 1
           }
       }
       this.totalFun();
     },
     delConfirm (item) {
         this.pushflag = 1;
         this.current = item
     },
     delItem () {
        let currIndex = this.filterItem.indexOf(this.current);
        console.log(currIndex);
        this.items.splice(currIndex,1);
        this.pushflag = 0
     },
     totalFun () {
         let that = this;
         that.totalMoney = 0;
         this.filterItem.forEach(function (item,index) {
           if(item.checked){
               that.totalMoney += item.price * item.count
           }
         })
     },
     selItem(item) {
         if(typeof item.checked == 'undefined'){
           this.$set(item,'checked',true);
         } else {
           item.checked =!item.checked ;
         }
         this.totalFun();
         let selAll = this.items.every(function (item) {
           return item.checked == true;
         });
         if(selAll){
             this.selAllFlag = 1;
         } else {
             this.selAllFlag = 0;
         }
     },
     selAll () {
         let that = this;
         that.selAllFlag=!that.selAllFlag;
         that.filterItem.forEach(function (item,index) {
             if(that.selAllFlag){
               if(typeof item.checked == 'undefined'){
                 that.$set(item,'checked',true);
               } else {
                 item.checked = true;
               }
             } else {
                 item.checked = false
             }
         that.totalFun();
         })
     },
     showAll () {
         this.showNum = this.showNum + 2;
         if(this.showNum >= this.items.length){
             this.showNum = this.items.length;
             this.isMore = 1;
         }
     },
     jsFun () {
         let jsItem = this.filterItem.filter(function (item) {
             return item.checked == true;
         });
       if(jsItem.length == 0) {
          this.jsFlag = 1;
          return false;
       }
       this.$router.push({ path: 'settle', query: { price: this.totalMoney}})
     }
   }
 }
</script>
<style scoped>
 #shoppingCar .title-wrap {
   margin-top: 50px;
   font: 20px/1.5 a;
   font-weight: 400;
   text-align: center;
 }
 #shoppingCar .title-wrap .title {
   width: 15.000000000000002%;
   text-align: center;
 }
 #shoppingCar .title-wrap .line-v {
   width: 41.66666666666667%;
   height: 1px;
   background-color: #ccc;
   margin-top: -4px;
   vertical-align: middle;
 }
 #shoppingCar .detial-wrap {
   margin-top: 30px;
   text-align: center;
   width: 100%;
   border-collapse: collapse;
   border-bottom: 1px solid #ccc;
   line-height: 50px;
 }
 #shoppingCar .detial-wrap tr th {
   color: #f9f9f9;
   background: #585858;
 }
 #shoppingCar .detial-wrap tr th:first-child {
   border-radius: 8px 0 0 8px;
 }
 #shoppingCar .detial-wrap tr th:last-child {
   border-radius: 0 8px 8px 0;
 }
 #shoppingCar .detial-wrap tr td {
   height: 150px;
   width: 10%;
 }
 #shoppingCar .detial-wrap tr td.goods-detial-wrap {
   width: 60.00000000000001%;
   vertical-align: top;
 }
 #shoppingCar .detial-wrap tr td.goods-detial-wrap .goods-detial {
   position: relative;
   top: 50%;
   transform: translateY(-50%);
   width: 87.5%;
   height: 60%;
 }
 #shoppingCar .detial-wrap tr td.goods-detial-wrap .goods-detial .good-img {
   margin: 0 5px;
   height: 90px;
   width: 125.99999999999999px;
 }
 #shoppingCar .detial-wrap tr td.goods-detial-wrap .goods-detial .good-img img {
   height: 100%;
   width: 100%;
 }
 #shoppingCar .detial-wrap tr td.goods-detial-wrap .goods-detial .good-text {
   line-height: 2.2;
   text-align: left;
   height: 100%;
   margin-left: 25px;
   font-weight: bold;
   width: 58.333333333333336%;
 }
 #shoppingCar .detial-wrap tr td.goods-detial-wrap .goods-detial .good-text .gifts {
   width: 100%;
 }
 #shoppingCar .detial-wrap tr td.goods-detial-wrap .goods-detial .good-text .gifts dt {
   display: inline-block;
   margin-right: 10px;
 }
 #shoppingCar .detial-wrap tr td.goods-detial-wrap .goods-detial .good-text .gifts dd {
   display: inline-block;
   color: #ababab;
   margin-right: 15px;
 }
 #shoppingCar .detial-wrap tr td.buy-num .choosenum-handler i {
   display: inline-block;
   height: 8px;
   width: 8px;
   position: relative;
 }
 #shoppingCar .detial-wrap tr td.buy-num .choosenum-handler i.icon-minus:before {
   content: '';
   display: inline-block;
   position: absolute;
   top: 50%;
   transform: translateY(-50%);
   width: 8px;
   height: 2px;
   background-color: #2f3130;
 }
 #shoppingCar .detial-wrap tr td.buy-num .choosenum-handler i.icon-plus:before,
 #shoppingCar .detial-wrap tr td.buy-num .choosenum-handler i.icon-plus:after {
   content: '';
   display: inline-block;
   position: absolute;
   background-color: #2f3130;
 }
 #shoppingCar .detial-wrap tr td.buy-num .choosenum-handler i.icon-plus:before {
   width: 8px;
   height: 2px;
   top: 50%;
   left: 0;
   transform: translateY(-50%);
 }
 #shoppingCar .detial-wrap tr td.buy-num .choosenum-handler i.icon-plus:after {
   top: 0;
   left: 50%;
   transform: translateX(-50%);
   width: 2px;
   height: 8px;
 }
 #shoppingCar .detial-wrap tr td.buy-num .choosenum-handler .countbox {
   vertical-align: middle;
   text-align: center;
   height: 20px;
   line-height: 20px;
   width: 30px;
   margin: 0 10px 0 13px;
   border: 1px solid #6190ef;
   border-radius: 2px;
 }
 #shoppingCar .detial-wrap tr td.icon {
   color: #1e1c1c;
 }
 #shoppingCar .checkbox-wrap {
   height: 100%;
   width: 12.5%;
 }
 #shoppingCar .checkout-wrap {
   height: 80px;
   line-height: 80px;
 }
 #shoppingCar .checkout-wrap .total-check-wrap {
   text-align: center;
   width: 60.00000000000001%;
 }
 #shoppingCar .checkout-wrap .total-check-wrap .check-text {
   padding-top: 1px;
   text-align: left;
   font-weight: 600;
 }
 #shoppingCar .checkout-wrap .total-check-wrap .check-text .checked-all {
   padding-left: 0.5em;
   color: #ff302e;
 }
 #shoppingCar .checkout-wrap .total-check-wrap .check-text .unchecked-all {
   padding-left: 1.5em;
 }
 #shoppingCar .checkout-wrap .checkout .total-money {
   display: inline-block;
   font-size: 20px;
   margin-right: 1.5em;
 }
 #shoppingCar .checkout-wrap .checkout .total-money span {
   margin-right: 0.8em;
 }
 #shoppingCar .checkout-wrap .checkout .total-money span.amount {
   color: #ff302e;
 }
 #shoppingCar .checkout-wrap .checkout input {
   color: #fff;
   font-size: 20px;
   width: 7em;
   line-height: 1.5;
   border-radius: 5px;
 }
 body{
   position: relative;
 }
 .push-over {
   display: none;
   position: fixed;
   top:0;
   left: 0;
   width: 100%;
   height: 100%;
   background-color: rgba(111,111,111,.5);
 }
 .push-box {
   position: absolute;
   top:50%;
   left:50%;
   transform: translate(-50%,-50%);
   width: 310px;
   height:300px;
   border: 1px solid #ff302e;
   background-color: #fff;
 }
 .push-box p {
   margin-top: 100px;
   text-align: center;
 }
 .push-box button {
   margin-top: 50px;
   margin-left: 10px;
   color: #fff;
   font-size: 20px;
   width: 7em;
   line-height: 1.5;
   border-radius: 5px;
   border: 0;
 }
 .push-show {
   display: block;
 }
 .show-more {
   text-align: center;
   color: #d1273b;
 }
 .hide {
   display: none;
 }
 .other {
   float: left;
   width: 100px;
   height: 100px;
   border-radius: 50%;
   border: 1px solid #9d9d9d;
   text-align: center;
   line-height: 100px;
   font-size: 24px;
   color:#9d9d9d;
 }
 .active{
   border: 1px solid #d1273b;
   color: #d1273b;
 }
 .align-left {
   text-align: left;
 }
 .align-right {
   text-align: right;
 }
 .left {
   float: left;
 }
 .right {
   float: right;
 }
 .checkbox {
   position: relative;
   height: 20px;
   width: 20px;
   margin-top: 50px;
   border-radius: 50%;
   border: 1px solid #9d9d9d;
 }
 .checkbox.checked:after {
   position: absolute;
   top: 45%;
   left: 30%;
   display: inline-block;
   content: '';
   height: 10px;
   width: 5.600000000000001px;
   border: 2px solid #ff302e;
   border-left: none;
   border-top: none;
   transform: translateY(-50%) rotateZ(45deg) translate(-15%, -5%);
 }
 .total-check-wrap .checkbox {
   margin-top: 30px;
 }
 .danger {
   background-color: #d1273b !important;
 }
.jiesuan {
 font-size: 20px;
 color: red;
 text-decoration: none;
}
</style>

<template lang="html">
  <transition name="scroll-select">
    <aside class="scroll-select-container" v-show=isShow @click="fade">
      <div class="select-area" @click.stop="clear" ref="target">
        <div class="select-buttons">
          <span class="cancel-btn" @click="fade">取消</span>
          <span class="sure-btn" @click="sureSelect">确定</span>
        </div>

        <div class="select-data-area">
          <!-- 不传参时，响应函数的一个参数默认为event;传参数时，需加入$event传递event -->
          <div class="select-data province-data"
               v-on:touchstart="scrollStart"
               v-on:touchmove="scrollMove('province',$event)"
               v-on:touchend="scrollEnd">
            <div class="data-item" v-for="(province,index) in provinceData" :class="{'selected-data' : index === currentItem.province}">{{province.fullname}}</div>
          </div>
          <div class="select-data city-data"
              v-on:touchstart="scrollStart"
              v-on:touchmove="scrollMove('city',$event)"
              v-on:touchend="scrollEnd">
            <div class="data-item" v-for="(city,index) in cityData" :class="{'selected-data' : index === currentItem.city}">{{city.fullname}}</div>
          </div>
          <div class="select-data district-data"
              v-on:touchstart="scrollStart"
              v-on:touchmove="scrollMove('district',$event)"
              v-on:touchend="scrollEnd"
              v-show="districtData.length > 0">
            <div class="data-item" v-for="(district,index) in districtData" :class="{'selected-data' : index === currentItem.district}">{{district.fullname}}</div>
          </div>
        </div>
      </div>
    </aside>
  </transition>
</template>

<script>
const areaData = require('./location.json')
export default {
  name: 'vue-area-select',
  data () {
    return {
      provinceData: areaData.result[0],
      scrollTarget: null,
      tempX: 0,
      tempY: 0,
      currentItem: {
        province: 0,
        city: 0,
        district: 0
      },
      scrollScale: 1
    }
  },
  props: {
    isShow: {
      type: Boolean,
      required: true
    },
    fontsize:{
      type: Number,
      required:false
    },
    activeColor: {
      type: String,
      required:false
    },
    lineHeight:{
      type:Number,
      required:false
    }
  },
  mounted () {
    this.$nextTick(() => {
      //根据配置修改样式
      if(this.lineHeight !== undefined){ //初始化偏移量
        let target =  this.$refs.target
        this.setStyles(target,'.province-data','transform',`translateY(${2 * this.lineHeight}px)`)
        this.setStyles(target,'.city-data','transform',`translateY(${2 * this.lineHeight}px)`)
        this.setStyles(target,'.district-data','transform',`translateY(${2 * this.lineHeight}px)`)
      }

      this.changeStyle()
    })
  },
  watch: { // 监听省、市变化 重置市，区
    'currentItem.province': {  // 监听对象的属性
      handler: function (value, oldValue) {
        this.$set(this.currentItem, 'city', 0)
        document.querySelector('.city-data').style.setProperty('transform', `translateY(${2 * this.itemHeight}px)`)
        this.$set(this.currentItem, 'district', 0)
        document.querySelector('.district-data').style.setProperty('transform', `translateY(${2 * this.itemHeight}px)`)
        this.changeStyle()
      },
      deep: true
    },
    'currentItem.city': {
      handler: function (value, oldValue) {
        this.$set(this.currentItem, 'district', 0)
        document.querySelector('.district-data').style.setProperty('transform', `translateY(${2 * this.itemHeight}px)`)
        this.changeStyle()
      },
      deep: true
    }
  },
  computed: {
    cityRange () {
      return this.provinceData[this.currentItem.province]['cidx'] || []
    },
    districtRange () {
      return this.cityData[this.currentItem.city]['cidx'] || []
    },
    cityData () {
      if (this.cityRange.length > 0) {
        return areaData.result[1].slice(this.cityRange[0], this.cityRange[1])
      } else {
        return []
      }
    },
    districtData () {
      if (this.districtRange.length > 0) {
        return areaData.result[2].slice(this.districtRange[0], this.districtRange[1])
      } else {
        return []
      }
    },
    itemHeight () {
      return window.parseFloat(window.getComputedStyle(this.scrollTarget.getElementsByClassName('data-item')[0], null).getPropertyValue('height'))
    },
    targetHeight () {
      return window.parseFloat(window.getComputedStyle(this.scrollTarget, null).getPropertyValue('height'))
    }
  },
  methods: {
    fade () {
      this.$emit('fade')
    },
    clear (e) {
      e.stopPropagation()
    },
    scrollStart (e) {
      if (e.target.classList.contains('data-item')) {
        this.scrollTarget = e.target.parentElement
        this.tempX = e.changedTouches[0].clientX
        this.tempY = e.changedTouches[0].clientY
      }
    },
    scrollMove (who, e) {
      // 获取所需要的属性值
      let currentTranslateY = this.getTranslateValue('y', window.getComputedStyle(this.scrollTarget, null).getPropertyValue('transform'))

      // touchmove的位置
      let currentY = e.changedTouches[0].clientY

      let scrollY = (currentTranslateY - (this.tempY - currentY)) * this.scrollScale  // 计算应设的的y轴滚动值

      if ((scrollY < 2.5 * this.itemHeight) && (scrollY > -(this.targetHeight - 2.5 * this.itemHeight))) {
        this.scrollTarget.style.setProperty('transform', `translateY(${scrollY}px)`)
        this.currentItem[who] = Math.round((2 * this.itemHeight - scrollY) / this.itemHeight)
        this.changeStyle()
      }
      this.tempY = currentY // 重置参照坐标
    },
    scrollEnd (e) {
      let currentTranslateY = this.getTranslateValue('y', window.getComputedStyle(this.scrollTarget, null).getPropertyValue('transform'))
      let offset = currentTranslateY % this.itemHeight
      let scrollY = 0
      if (offset > 0) {
        scrollY = (offset >= this.itemHeight * 0.5) ? (currentTranslateY + this.itemHeight - offset) : (currentTranslateY - offset)  // 处理偏移量
      } else {
        scrollY = (-offset >= this.itemHeight * 0.5) ? (currentTranslateY - this.itemHeight - offset) : (currentTranslateY - offset)
      }
      this.scrollTarget.style.setProperty('transform', `translateY(${scrollY}px)`)
      this.changeStyle()
    },
    sureSelect () {
      this.$emit('selectdone', { // 传递地址信息及坐标
        province: this.provinceData[this.currentItem.province].fullname,
        city: this.cityData[this.currentItem.city].fullname,
        district: this.districtData.length > 0 ? this.districtData[this.currentItem.district].fullname : '',  // 注意直辖市没有district这一级
        location: this.districtData.length > 0 ? this.districtData[this.currentItem.district].location : this.cityData[this.currentItem.city].location
      })
      console.log('scrollselect.vue return location data')
      this.fade()
    },
    changeStyle () {
      let target =  this.$refs.target
      if(this.fontsize !== undefined){
        this.setStyles(target,'.data-item','font-size',`${this.fontsize}px`)
        this.setStyles(target,'.data-item.selected-data','font-size',`${this.fontsize + 2}px`)
      }

      if(this.activeColor !== undefined){
        this.setStyles(target,'.data-item','color',`#000000`)
        this.setStyles(target,'.data-item.selected-data','color',this.activeColor)
      }

      if(this.lineHeight !== undefined){
        target.style.setProperty('height',`${this.lineHeight * 6}px`)
        this.setStyles(target,'.select-buttons','height',`${this.lineHeight}px`)
        this.setStyles(target,'.select-buttons','line-height',`${this.lineHeight}px`)
        this.setStyles(target,'.select-data-area','height',`${this.lineHeight * 5}px`)
        this.setStyles(target,'.data-item','height',`${this.lineHeight}px`)
        this.setStyles(target,'.data-item','line-height',`${this.lineHeight}px`)
      }
    },
    getTranslateValue (which, transform) { // z:matrix3d(1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 1.2, 1)   x y :matrix(1, 0, 0, 1, 1.2, 0)
      let temp = which === 'z' ? transform.slice(9, -1).split(',') : transform.slice(7, -1).split(',')
      let index = 0
      switch (which) {
        case 'x':
          index = 4
          break
        case 'y':
          index = 5
          break
        case 'z':
          index = 14
          break
        default:
      }
      return window.parseFloat(temp[index])
    },
    setStyles (target,className,property,value) {
      [...target.querySelectorAll(className)].forEach(function(element,index){
        element.style.setProperty(property,value)
      })
    }
  }
}
</script>

<style lang="scss">
//定义常量
$itemHeight : 30px;
$maskColor : #666666;
$contentSize : 14px;
$margin : 14px;

//点击时动态效果样式
@mixin dynamic($direction,$distance) {
  position: relative;
  &:link,&:visited{
    #{$direction}: 0;
  }
  &:active{
    #{$direction}: $distance;
  }
}
.scroll-select-container{
  position: fixed;
  flex-direction: column;
  top: 0;
  left: 0;
  bottom: 0;
  right: 0;
  background-color: rgba($maskColor,0.5);

  .select-area{
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
    height: 6 * $itemHeight;
    background-color: #ffffff;


    .select-buttons{
      height: $itemHeight;
      line-height: $itemHeight;
      text-align: center;
      color: rgb(94, 182, 116);
      border-bottom: 1px solid rgb(223, 214, 214);

      span{
        @include dynamic(top,-1px);
      }
      .cancel-btn{
        float: left;
        margin-left: $margin;
      }

      .sure-btn{
        float: right;
        margin-right: $margin;
      }
    }
    .select-data-area{
      height: 5 * $itemHeight;
      position: relative;
      overflow: hidden;
      -webkit-mask: -webkit-linear-gradient(top, rgba(#eeeeee, 0) 0%,#ffffff 50%, rgba(#eeeeee, 0) 100%);


      &::before,&::after{
        content: '';
        position: absolute;
        left: 0;
        width: 100%;
        height: 1px;
        background-color: #cccccc;
        transform: scaleY(0.5);
      }

      &::before{
        top: 40%;
      }

      &::after{
        bottom: 40%;
      }
      .select-data{
        width: 33.3%;
        float: left;
        display: inline-block;
        box-sizing: border-box;
        .data-item{
          height: $itemHeight;
          line-height: $itemHeight;
          font-size: $contentSize;
          text-align: center;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;

          &.selected-data{
            color: rgb(84, 193, 153);
            font-size: $contentSize + 2px;
          }
        }
      }

      .province-data{
        transform: translateY(2 * $itemHeight);
      }
      .city-data{
        transform: translateY(2 * $itemHeight);
      }
      .district-data{
        transform: translateY(2 * $itemHeight);
      }
    }
  }
}

.scroll-select-enter,.scroll-select-leave-to{
  transition: all 0.5s ease;
  opacity: 0;

  .select-area{
    transition: all 0.5s ease;
    transform: translateY( 6 * $itemHeight);
  }
}

.scroll-select-enter-to,.scroll-select-leave{
  transition: all 0.5s ease;

  .select-area{
    transition: all 0.5s ease;
    transform: translateY(0);
  }
}
</style>

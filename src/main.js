import Vue from 'vue'
import App from './App.vue'
// import areaSelect from './index.js' //使用本地的
import areaSelect from 'vue-area-select-lei' //插件的方式引入

Vue.use(areaSelect)

new Vue({
  el: '#app',
  render: h => h(App)
})

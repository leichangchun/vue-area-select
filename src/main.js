import Vue from 'vue'
import App from './App.vue'
import areaSelect from './index.js'

Vue.use(areaSelect)

new Vue({
  el: '#app',
  render: h => h(App)
})

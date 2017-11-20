import vueAreaSelect from './components/vue-area-select'
const areaSelect = {
  install (Vue, options) {
    Vue.component(vueAreaSelect.name, vueAreaSelect)
  }
}
if (typeof window !== 'undefined' && window.Vue) {
  window.Vue.use(areaSelect)
}

export default areaSelect

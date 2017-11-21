<template>
  <div id="app">
    <button @click="showAreaSelect">点我</button>
    <vue-area-select :isShow="isShow"
                     :font-size="size"
                     active-color="green"
                     :line-height="height"
                     @fade="toggle"
                     @selectdone="alertData"></vue-area-select>
  </div>
</template>

<script>
export default {
  name: 'app',
  data () {
    return {
      isShow : false,
      size:18,
      height:36
    }
  },
  methods: {
    showAreaSelect () {
      this.toggle()
    },
    toggle () {
      this.isShow = !this.isShow
    },
    alertData (data) {
      alert(JSON.stringify(data))
    }
  }
}
</script>

<style lang="scss">

</style>

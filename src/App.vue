<template>
  <div id="app">
    <app-header></app-header>
      <router-view></router-view>
  </div>
</template>

<script>
import header from './components/header.vue';


export default {
  
  components: {
    'app-header': header
  },
};
</script>

<style>
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}
</style>

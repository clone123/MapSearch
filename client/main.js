import './stylesheets/style.css'
import './style.css'
import 'bootstrap/dist/css/bootstrap.min.css'
import 'bootstrap/dist/js/bootstrap.min.js'
import Vue from 'vue'
import App from './app.vue'
import  store from  './vuex/store'

new Vue({
  el: 'body',
  replace: false,
  components: {
    App
  },
  store
})

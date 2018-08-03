/**
 * THIS FILE IS GENERATED AUTOMATICALLY.
 * DO NOT EDIT.
 *
 * You are probably looking on adding initialization code.
 * Use "quasar new plugin <name>" and add it there.
 * One plugin per concern. Then reference the file(s) in quasar.conf.js > plugins:
 * plugins: ['file', ...] // do not add ".js" extension to it.
 **/
import './quasar'

import Vue from 'vue'
Vue.config.productionTip = false


import 'quasar-extras/roboto-font'

import 'quasar-extras/material-icons'




import 'quasar-app-styl'


import 'src/css/app.styl'

import 'src/css/w3.css'


import App from 'src/App'

import router from 'src/router'


const app = {
  el: '#q-app',
  router,

  ...App
}


const plugins = []

plugins.forEach(plugin => plugin({ app, router, Vue }))



import electron from 'electron'
Vue.prototype.$q.electron = electron







new Vue(app)




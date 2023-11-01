import Vue from 'vue'
import Vuex from 'vuex'
import App from './App.vue'
import vuetify from './plugins/vuetify'
import router from "./router/router";
import Vuelidate from 'vuelidate'
import { BootstrapVue ,IconsPlugin } from 'bootstrap-vue'
import axios from 'axios';
import './plugins';
import store from './store';
import GlobalMixin from './mixins';
import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap-vue/dist/bootstrap-vue.css'
import './assets/fontawesome/css/all.css';
import './assets/css/main.css';
import './assets/css/dashbord.css';
import './assets/css/bootstrap.css';
import './assets/css/style.css'; 
import VGoogleTranslate from "v-google-translate";
import InputFacade from 'vue-input-facade'

import VueQRCodeComponent from 'vue-qrcode-component'
Vue.component('qr-code', VueQRCodeComponent) 
import VueBlobJsonCsv from 'vue-blob-json-csv';

Vue.use(VueBlobJsonCsv)
Vue.use(VGoogleTranslate);
Vue.use(InputFacade)

Vue.mixin(GlobalMixin)

// userManagmentDropDown


Vue.config.productionTip = false
Vue.use(IconsPlugin);
Vue.use(BootstrapVue)
new Vue({
  vuetify,
  Vuex,
  router,
  Vuelidate,
  axios,
  store,
  render: h => h(App)
}).$mount('#app')

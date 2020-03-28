import Vue from 'vue';
import App from './App.vue';
import './registerServiceWorker';
import { store } from './store.js'
import router from "./router/index";
import vuetify from './plugins/vuetify';

Vue.config.productionTip = false;


new Vue({
  router,
  store,
  vuetify,
  render: (h) => h(App)
}).$mount('#app');

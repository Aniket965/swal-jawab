import Vue from 'vue';
import App from './App.vue';
import './registerServiceWorker';
import { store } from './store.js'
import router from "./router/index";
import vuetify from './plugins/vuetify';

import VueAnalytics from 'vue-analytics'

Vue.use(VueAnalytics, {
  id: 'UA-99011528-9',
  router  
})
Vue.config.productionTip = false;


new Vue({
  router,
  store,
  vuetify,
  render: (h) => h(App)
}).$mount('#app');

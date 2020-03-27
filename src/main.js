import Vue from 'vue';
import App from './App.vue';
import './registerServiceWorker';
import { store } from './store.js'
import router from "./router/index";
 
const firebase = require('./firebaseConfig.js')
Vue.config.productionTip = false;

firebase.auth.onAuthStateChanged(user => {
  store.dispatch("fetchUser", user);

    if (user) {
      // User is signed in.
      router.replace('home');
    } else {
      // No user is signed in.
      router.replace('login');
    }
});
new Vue({
  router,
  store,
  render: (h) => h(App),
}).$mount('#app');

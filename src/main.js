import Vue from 'vue';
import App from './App.vue';
import './registerServiceWorker';
import { store } from './store.js'
import router from "./router/index";
 
const firebase = require('./firebaseConfig.js')
Vue.config.productionTip = false;

firebase.auth.onAuthStateChanged(async user => {
  store.dispatch("fetchUser", user);
  let details = await (await firebase.usersCollection.doc(user.uid).get()).data();
  store.dispatch('fetchCurrentGameDetails', details)
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

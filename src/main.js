import Vue from 'vue';
import App from './App.vue';
import './registerServiceWorker';
import { store } from './store.js'
const firebase = require('./firebaseConfig.js')
Vue.config.productionTip = false;

let app
firebase.auth.onAuthStateChanged(user => {
    if (!app) {
        app = new Vue({
          store,
          render: (h) => h(App),
        }).$mount('#app');
    }
})
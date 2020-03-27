import Vue from 'vue';
import Router from 'vue-router';
import Login from '../pages/Login.vue';
import Home from '../pages/Home.vue';
import Start from '../pages/Start.vue';
import Join from  '../pages/Join.vue';
import Play from '../pages/Play.vue';
Vue.use(Router)

const router = new Router({
    mode: 'history',
    base: process.env.BASE_URL,
    routes: [
        {
        path: '/login',
        name: 'login',
        component: Login
    },
    {
        path: '/home',
        name: 'home',
        component: Home
    },
    {
        path: '/start',
        name: 'start',
        component: Start
    },
    {
        path: '/join',
        name: 'join',
        component: Join
    },
    {
        path: '/play',
        name: 'play',
        component: Play
    }

]
});

export default router
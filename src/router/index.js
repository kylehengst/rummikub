import Vue from 'vue';
import VueRouter from 'vue-router';
import Home from '../views/Home.vue';
import Lobby from '../views/Lobby.vue';
import Game from '../views/Game.vue';
import Logout from '../views/Logout.vue';

Vue.use(VueRouter);

const routes = [
  { path: '/index.html', component: Home },
  {
    path: '/',
    name: 'Home',
    component: Home,
  },
  {
    path: '/lobby/:id',
    name: 'Lobby',
    component: Lobby,
  },
  {
    path: '/game/:id',
    name: 'Game',
    component: Game,
  },
  {
    path: '/logout',
    name: 'Logout',
    component: Logout,
  },
];

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes,
});

export default router;

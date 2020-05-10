import Vue from 'vue';
import App from './App.vue';
import router from './router';
import store from './store';
import wb from "./registerServiceWorker";
import './assets/bootstrap.min.css';
import './sass/main.css';

import PortalVue from 'portal-vue'
Vue.use(PortalVue)

Vue.config.productionTip = false;

Vue.prototype.$workbox = wb;

new Vue({
  router,
  store,
  render: (h) => h(App),
}).$mount('#app');

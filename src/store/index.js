import Vue from 'vue';
import Vuex from 'vuex';

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    touch: false,
    eventTypes: {
      down: 'mousedown',
      move: 'mousemove',
      up: 'mouseup',
    },
    userName: '',
    userId: '',
  },
  mutations: {
    setEventTypes(state, value) {
      state.eventTypes = value;
    },
    setTouch(state, value) {
      state.touch = value;
    },
    setUserName(state, value) {
      state.userName = value;
    },
    setUserId(state, value) {
      state.userId = value;
    },
  },
  actions: {},
  modules: {},
});

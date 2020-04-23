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
  },
  mutations: {
    setEventTypes(state, value) {
      state.eventTypes = value;
    },
    setTouch(state, value) {
      state.touch = value;
    }
  },
  actions: {},
  modules: {},
});

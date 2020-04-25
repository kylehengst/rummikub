<template>
  <div id="app" :class="{ desktop: !touch }">
    <router-view v-if="connected" />
    <div v-else>Error</div>
  </div>
</template>
<script>
import Socket from './services/socket';
export default {
  data() {
    return {
      connected: false,
      touch: false,
      registered: false,
    };
  },
  beforeMount() {
    console.log(Socket);
    this.touch = 'ontouchstart' in document.documentElement;
    if (this.touch) {
      this.$store.commit('setEventTypes', {
        down: 'touchstart',
        move: 'touchmove',
        up: 'touchend',
      });
    }
    this.$store.commit('setTouch', this.touch);
    Socket.on('connected', () => {
      this.connected = true; 
    });
    Socket.on('close', () => {
      this.connected = false;
    });
  },
};
</script>
<style>
body {
  /* color: white; */
}
</style>

<template>
  <div id="app" :class="{ desktop: !touch }">
    <router-view />
  </div>
</template>
<script>
export default {
  data() {
    return {
      touch: false,
    };
  },
  beforeMount() {
    this.touch = 'ontouchstart' in document.documentElement;
    if (this.touch) {
      this.$store.commit('setEventTypes', {
        down: 'touchstart',
        move: 'touchmove',
        up: 'touchend',
      });
    }
    this.$store.commit('setTouch', this.touch);
  },
};
</script>

<template>
  <div id="app" :class="{ desktop: !touch }">
    <router-view v-if="connected" />
    <div v-else class="connecting">
      <div class="card">
        <div class="card-body">
          Connecting...
        </div>
      </div>
    </div>
    <div id="version">
      <div>
        Version 0.2
      </div>
      <div class="flex-fill"></div>
      <div v-if="prompt">
        <a @click="upgrade">Update available</a>
      </div>
    </div>
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
      prompt: true,
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
    Socket.on('open', () => {
      this.connected = true;
    });
    Socket.on('close', () => {
      console.log('close');
      this.connected = false;
    });
  },
  created() {
    if (this.$workbox) {
      this.$workbox.addEventListener('waiting', () => {
        this.prompt = true;
      });
    }
  },
  methods: {
    async upgrade() {
      this.prompt = false;
      await this.$workbox.messageSW({ type: 'SKIP_WAITING' });
    },
  },
};
</script>
<style>
body {
  /* color: white; */
  user-select: none;
}
.connecting {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
}
</style>

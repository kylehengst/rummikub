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
        Version 0.6
      </div>
      <div class="flex-fill"></div>
      <div v-if="prompt">
        <button class="btn btn-sm btn-secondary" @click="upgrade">Click here to update</button>
      </div>
    </div>
    <div id="modals">
      <!-- Modal -->
      <div
        class="modal fade"
        :class="{ show: $store.state.modal, 'd-block': $store.state.modal }"
        id="exampleModal"
        tabindex="-1"
        role="dialog"
        aria-labelledby="exampleModalLabel"
        aria-hidden="true"
      >
        <div class="modal-dialog" role="document">
          <div class="modal-content">
            <div class="modal-header" v-if="$store.state.modalTitle">
              <h5 class="modal-title" id="exampleModalLabel">{{ $store.state.modalTitle }}</h5>
              <button
                type="button"
                class="close"
                data-dismiss="modal"
                aria-label="Close"
                @click="$store.commit('closeModal')"
              >
                <span aria-hidden="true">&times;</span>
              </button>
            </div>
            <div class="modal-body" v-if=" $store.state.modalBody">
              {{ $store.state.modalBody }}
            </div>
            <div class="modal-footer">
              <button
                @click="$store.commit('closeModal')"
                type="button"
                class="btn btn-secondary"
                data-dismiss="modal"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      </div>
      <div class="modal-backdrop fade show" v-if="$store.state.modal" @click="$store.commit('closeModal')"></div>
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
      prompt: false,
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

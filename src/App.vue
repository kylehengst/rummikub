<template>
  <div id="app" :class="{ desktop: !touch }">

    <router-view v-if="connected" />

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
              <h5 class="modal-title" id="exampleModalLabel">
                {{ $store.state.modalTitle }}
              </h5>
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
            <div class="modal-body" v-if="$store.state.modalBody">
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
      <div
        class="modal-backdrop fade show"
        v-if="$store.state.modal"
        @click="$store.commit('closeModal')"
      ></div>
    </div>
    <audio src="/sound/cardPlace.mp3" id="cardPlace"></audio>
    <audio src="/sound/bell.mp3" id="bell"></audio>
    <audio src="/sound/alert.mp3" id="alert"></audio>
  </div>
</template>
<script>
import Socket from './services/socket';
// import Tile from '@/components/Tile.vue';
export default {
  components: {
    // Tile
  },
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
    Socket.on('open', () => {
      this.connected = true;
    });
    Socket.on('close', () => {
      console.log('close');
      this.connected = false;
    });
  },

  methods: {},
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

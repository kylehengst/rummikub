<template>
  <div id="home" class="container py-5">
    <div class="mb-5">
      <div class="d-flex">
        <Tile :disabled="true" :config="{ color: 'red', score: 'R' }" :row="0" :col="0"></Tile>
        <Tile :disabled="true" :config="{ color: 'red', score: 'u' }" :row="0" :col="0"></Tile>
        <Tile :disabled="true" :config="{ color: 'red', score: 'm' }" :row="0" :col="0"></Tile>
        <Tile :disabled="true" :config="{ color: 'red', score: 'm' }" :row="0" :col="0"></Tile>
        <Tile :disabled="true" :config="{ color: 'red', score: 'i' }" :row="0" :col="0"></Tile>
        <Tile :disabled="true" :config="{ color: 'red', score: 'k' }" :row="0" :col="0"></Tile>
        <Tile :disabled="true" :config="{ color: 'red', score: 'u' }" :row="0" :col="0"></Tile>
        <Tile :disabled="true" :config="{ color: 'red', score: 'b' }" :row="0" :col="0"></Tile>
        <Tile :disabled="true" :config="{ color: 'black', score: 'i', isJoker: true }" :row="0" :col="0"></Tile>
      </div>
    </div>
    <div class="row">
      <div class="col">
        <div class="card">
          <div class="card-body">
            <form @submit.prevent="updateUser" v-if="!registered">
              <div class="form-group">
                <label>What is your name?</label>
                <input class="form-control" type="text" v-model="user" />
              </div>
              <button class="btn btn-primary">Submit</button>
            </form>
            <div v-else>
              <form @submit.prevent="startNewGame">
                <h3>Game</h3>
                <p>Create or join a game</p>
                <div class="form-group">
                  <!-- <label>Create a game</label> -->
                  <input
                    class="form-control"
                    placeholder="Game Name"
                    type="text"
                    v-model="newGame"
                  />
                </div>
                <button class="btn btn-primary">Go</button>
              </form>
            </div>
          </div>
        </div>
        <div class="card mt-3">
          <div class="card-body">
            <div>Version 0.7</div>

            <div class="mt-3" v-if="prompt">
              <button class="btn btn-sm btn-secondary" @click="upgrade">
                Click here to update
              </button>
            </div>
          </div>
        </div>
      </div>
      <div class="col">
        <div class="card ml-3" v-if="yourGames.length">
          <div class="card-body">
            <h3>Your Games</h3>
            <div class="list-group">
              <a
                href="#"
                @click="startGame(g)"
                class="list-group-item list-group-item-action -active"
                v-for="(g, i) in yourGames"
                :key="i"
              >
                <div class="d-flex w-100 justify-content-between">
                  <h5 class="-mb-1">{{ g.id }}</h5>
                  <!-- <small>Players: {{ g.users.length }}</small> -->
                </div>
                <div class="d-flex">
                  <div>
                    <span
                      class="badge badge-dark mr-1"
                      v-for="(u, ui) in g.users"
                      :key="ui"
                    >
                      {{ u.name }}
                    </span>
                  </div>
                  <div class="flex-fill"></div>
                  <div v-if="g.state.end" class="text-primary">
                    <strong>
                      {{ g.state.users[g.state.winningUser].name }}
                      wins!
                    </strong>
                  </div>
                </div>
                <!-- <small></small> -->
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Socket from '../services/socket';
import Tile from '@/components/Tile.vue';
export default {
  name: 'Home',
  components: {
    Tile,
  },
  data() {
    return {
      newGame: '',
      game: '',
      registered: false,
      user: '',
      prompt: false,
    };
  },
  created() {
    if (this.$workbox) {
      this.$workbox.addEventListener('waiting', () => {
        this.prompt = true;
      });
    }
  },
  mounted() {
    Socket.on('game', this.onGame);
    Socket.on('user', this.onUser);
    const userId = localStorage.getItem('user_id');
    Socket.initUser(userId);
  },
  destroyed() {
    Socket.off('game', this.onGame);
    Socket.off('user', this.onUser);
  },
  computed: {
    yourGames() {
      return this.$store.state.savedGames.concat().sort((a, b) => {
        let cA = a.state.created || 0;
        let cB = b.state.created || 0;
        if (cB > cA) return 1;
        if (cB < cA) return -1;
        return 0;
      });
    },
  },
  methods: {
    async upgrade() {
      this.prompt = false;
      await this.$workbox.messageSW({ type: 'SKIP_WAITING' });
    },
    startNewGame() {
      if (!this.newGame) return;
      this.game = this.newGame;
      Socket.initGame(this.game);
    },
    startGame(g) {
      // send message to socket
      this.game = g.id;
      Socket.initGame(this.game);
    },
    updateUser() {
      if (!this.user) return;
      Socket.updateUser({ name: this.user });
      this.$store.commit('setUserName', this.user);
      this.registered = true;
    },
    getWiner(game) {
      let winner = game.state.winningUser;
      let user = game.users.find((u) => {
        if (u.id == winner) return true;
      });
      return user ? user.name : '';
    },
    onUser(data) {
      console.log('onUser', data);
      localStorage.setItem('user_id', data.id);
      if (data.name) this.registered = true;
      this.$store.commit('setUserId', data.id);
      this.$store.commit('setUserName', data.name);
      this.$store.commit('setGames', data.games);
    },
    onGame(data) {
      console.log(data);
      if (data.game.started) {
        this.$router.push({
          name: 'Game',
          params: {
            id: this.game,
          },
        });
      } else {
        this.$router.push({
          name: 'Lobby',
          params: {
            id: this.game,
          },
        });
      }
    },
  },
};
</script>

<style scoped>
#home {
  /* flex: 1;
  display: flex;
  align-items: center;
  justify-content: center; */
}
</style>

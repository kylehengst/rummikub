<template>
  <div id="home" class="container py-5">
    <div class="mb-5 d-flex justify-content-md-center">
      <div class="d-flex">
        <Tile
          :disabled="true"
          :config="{ color: 'red', score: 'R' }"
          :row="0"
          :col="0"
        ></Tile>
        <Tile
          :disabled="true"
          :config="{ color: 'red', score: 'u' }"
          :row="0"
          :col="0"
        ></Tile>
        <Tile
          :disabled="true"
          :config="{ color: 'red', score: 'm' }"
          :row="0"
          :col="0"
        ></Tile>
        <Tile
          :disabled="true"
          :config="{ color: 'red', score: 'm' }"
          :row="0"
          :col="0"
        ></Tile>
        <Tile
          :disabled="true"
          :config="{ color: 'red', score: 'i' }"
          :row="0"
          :col="0"
        ></Tile>
        <Tile
          :disabled="true"
          :config="{ color: 'red', score: 'k' }"
          :row="0"
          :col="0"
        ></Tile>
        <Tile
          :disabled="true"
          :config="{ color: 'red', score: 'u' }"
          :row="0"
          :col="0"
        ></Tile>
        <Tile
          :disabled="true"
          :config="{ color: 'red', score: 'b' }"
          :row="0"
          :col="0"
        ></Tile>
        <Tile
          :disabled="true"
          :config="{ color: 'black', score: 'i', isJoker: true }"
          :row="0"
          :col="0"
        ></Tile>
      </div>
    </div>

    <div class="row justify-content-md-center">
      <div class="col-sm-6">
        <div class="mb-5" v-if="prompt">
          <button class="btn btn-lg btn-block btn-info" @click="upgrade">
            Click here to update
          </button>
        </div>

        <div v-if="!registered">
          <h3 class="mb-3">Login</h3>
          <form class="mb-5" @submit.prevent="login">
            <div class="input-group-lg mb-3">
              <label>Username</label>
              <input
                class="form-control input-lg"
                type="text"
                v-model="username"
                autocapitalize="none"
              />
            </div>
            <div class="input-group-lg mb-3">
              <label>Password</label>
              <input
                class="form-control input-lg"
                type="text"
                v-model="password"
              />
            </div>
            <button class="btn btn-success btn-lg">Submit</button>
          </form>
          <h3 class="mb-3">Sign Up</h3>
          <form class="mb-5" @submit.prevent="signup">
            <div class="input-group-lg mb-3">
              <label>Username</label>
              <input
                class="form-control input-lg"
                type="text"
                v-model="newUser.username"
                autocapitalize="none"
                required
              />
            </div>
            <div class="input-group-lg mb-3">
              <label>Password</label>
              <input
                class="form-control input-lg"
                type="text"
                v-model="newUser.password"
                required
              />
            </div>
            <div class="input-group-lg mb-3">
              <label>Gamer Name</label>
              <input
                class="form-control input-lg"
                type="text"
                v-model="newUser.gamer_tag"
                required
              />
            </div>
            <div class="input-group-lg mb-3">
              <label>Email</label>
              <input
                class="form-control input-lg"
                type="email"
                v-model="newUser.email"
              />
            </div>
            <button class="btn btn-success btn-lg">Submit</button>
          </form>
        </div>
        <div v-else>
          <div class="mb-5">
            <button
              class="btn btn-lg btn-block btn-success"
              @click="startNewGame()"
            >
              Create a new game
            </button>
          </div>
          <div v-if="sharedGame" class="mb-5">
            <h3 class="mb-3">Invitation</h3>
            <div class="list-group">
              <a
                href="#"
                @click="joinGame(sharedGame)"
                class="list-group-item list-group-item-action bg-success"
              >
                <div class="d-flex w-100 justify-content-between">
                  <h4 class="text-dark mb-3">
                    <strong>
                      <span v-for="(u, ui) in sharedGame.users" :key="ui">
                        <span v-if="ui" class="px-2">vs</span>
                        <span>{{ u.gamer_tag }}</span>
                        <span v-if="u.id == sharedGame.current_user">👈</span>
                      </span>
                    </strong>
                  </h4>
                  <!-- <small>Players: {{ sharedGame.users.length }}</small> -->
                </div>
                <div class="d-flex">
                  <div>
                    <strong>Click to join</strong>
                  </div>

                  <div class="flex-fill"></div>
                  <div v-if="sharedGame.complete" class="text-white mb-0">
                    <strong>
                      {{ sharedGame.winning_gamer_tag }}
                      wins!
                    </strong>
                  </div>
                </div>
                <!-- <small></small> -->
              </a>
            </div>
          </div>
          <div v-if="yourGames.length">
            <h3 class="mb-3">Your Games</h3>
            <div class="list-group">
              <a
                href="#"
                @click="startGame(g)"
                class="list-group-item list-group-item-action bg-success"
                v-for="(g, i) in yourGames"
                :key="i"
              >
                <div class="d-flex w-100 justify-content-between">
                  <h4 class="text-dark mb-3">
                    <strong>
                      <span v-for="(u, ui) in g.users" :key="ui">
                        <span v-if="ui" class="px-2">vs</span>
                        <span v-if="u.id == g.current_user && !g.complete">👉</span>
                        <span v-if="u.id == g.winning_user && g.complete">🥳</span>
                        <span v-if="u.id != g.winning_user && g.complete">😢</span>
                        <span>{{ u.gamer_tag }}</span>
                      </span>
                    </strong>
                  </h4>
                  <!-- <small>Players: {{ g.users.length }}</small> -->
                </div>
                <div class="d-flex">
                  <div>
                    <strong v-if="g.complete">Game has ended</strong>
                    <strong v-else-if="g.started">Game has started</strong>
                    <strong v-else>Waiting for players</strong>
                  </div>
                  <!-- <div>
                    <span
                      class="bg-dark rounded px-2 py-1 mr-1"
                      v-for="(u, ui) in g.users"
                      :key="ui"
                    >
                      {{ u.gamer_tag }}<span v-if="u.id == g.current_user">👈</span>
                    </span>
                  </div> -->
                  <div class="flex-fill"></div>
                  <div v-if="g.complete" class="text-white mb-0">
                    <strong>
                      {{ g.winning_gamer_tag }}
                      wins!
                    </strong>
                  </div>
                </div>
                <!-- <small></small> -->
              </a>
            </div>
          </div>
        </div>

        <hr />
        <div>Version 0.10</div>
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
      sharedGameName: '',
      sharedGame: null,
      game: '',
      registered: false,
      user: '',
      prompt: false,
      shareGame: '',
      username: '',
      password: '',
      newUser: {
        username: '',
        password: '',
        gamer_tag: '',
        email: '',
      }
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
    Socket.on('game_details', this.onGameDetails);
    const userId = localStorage.getItem('token');
    Socket.initUser(userId);
    this.sharedGameName = this.$route.query.share || '';
    if (this.sharedGameName)
    Socket.getGameDetails(this.sharedGameName);
  },
  destroyed() {
    Socket.off('game', this.onGame);
    Socket.off('user', this.onUser);
    Socket.off('game_details', this.onGameDetails);
  },
  computed: {
    yourGames() {
      return this.$store.state.savedGames.concat().sort((a, b) => {
        let cA = a.date_created || 0;
        let cB = b.date_created || 0;
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
      Socket.createGame(this.game);
    },
    joinGame(game) {
      Socket.initGame(game.name);
    },

    startGame(g) {
      // send message to socket
      this.game = g.name;
      Socket.initGame(this.game);
    },
    updateUser() {
      if (!this.user) return;
      Socket.updateUser({ name: this.user });
      this.$store.commit('setUserName', this.user);
      this.registered = true;
    },
    signup() {
      let data = {
        method: 'POST',
        // mode: 'no-cors',
        headers: {
          // 'Accept': 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(this.newUser),
      };
      console.log(data);

      let status = 200;

      window
        .fetch(Socket.api + '/signup', data)
        .then((res) => {
          console.log(res);
          status = res.status;
          return res.json();
        })
        .then((res) => {
          console.log(res);
          if (status >= 300) {
            throw res;
          }
          localStorage.setItem('token', res.token);
          Socket.initUser(res.token);
        })
        .catch((err) => {
          console.log(err.message);
          alert(err.message);
        });      
    },
    login() {
      let data = {
        method: 'POST',
        // mode: 'no-cors',
        headers: {
          // 'Accept': 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username: this.username,
          password: this.password,
        }),
      };
      console.log(data);

      let status = 200;

      window
        .fetch(Socket.api + '/login', data)
        .then((res) => {
          status = res.status;
          return res.json();
        })
        .then((res) => {
          console.log(res);
          if (status >= 300) {
            throw res;
          }          
          localStorage.setItem('token', res.token);
          Socket.initUser(res.token);
        })
        .catch((err) => {
          console.log(err.message);
          alert(err.message);
        });
    },

    onUser(data) {
      console.log('onUser', data);
      this.registered = true;
      this.$store.commit('setUserId', data.user.id);
      this.$store.commit('setUserUuid', data.user.uuid);
      this.$store.commit('setUserName', data.user.username);
      this.$store.commit('setGames', data.games);
    },
    onGame(data) {
      console.log('onGame', data);
      if (data.game.started) {
        this.$router.push({
          name: 'Game',
          params: {
            id: data.game.name,
          },
        });
      } else {
        this.$router.push({
          name: 'Lobby',
          params: {
            id: data.game.name,
          },
        });
      }
    },
    onGameDetails(data) {
      console.log('onGameDetails', data);
      this.sharedGame = data.game;
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

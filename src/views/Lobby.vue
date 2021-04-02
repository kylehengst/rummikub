<template>
  <div id="lobby" class="container py-5">
    <!-- <h3 class="mb-3">{{ gameId }}</h3> -->
    <div v-if="game">
      <h3 class="mb-3">Waiting for players</h3>
      <ul class="list-group">
        <li class="list-group-item bg-success">
          <h4 class="text-dark mb-0">
            <strong>
              <span v-for="(u, ui) in users" :key="ui">
                <span v-if="ui" class="px-2">vs</span>
                <span>{{ u.gamer_tag }}</span>
              </span>
            </strong>
          </h4>
        </li>
      </ul>
      <div class="pb-3"></div>
      <div class="d-flex">
        <button
          class="btn btn-lg"
          :class="{
            'btn-info': users.length < 2,
            'btn-dark': users.length > 1,
          }"
          @click="shareGame()"
        >
          Share game
        </button>
        <button class="btn btn-lg btn-dark ml-3" @click="remove()">
          Remove game
        </button>
        <div class="flex-fill"></div>
        <button
          v-if="users.length > 1"
          class="btn btn-info btn-lg"
          @click="start()"
        >
          Play
        </button>
      </div>
    </div>
    <hr />
    <div class="text-right">
      <button class="btn btn-dark" @click="$router.push({ name: 'Home' })">
        Return to Home
      </button>
    </div>
  </div>
</template>

<script>
import Socket from "../services/socket";
export default {
  name: "Lobby",
  data() {
    return {
      gameId: "",
      started: false,
      users: [],
      game: null,
    };
  },
  mounted() {
    if (!this.$store.state.userId) {
      this.$router.push({
        name: "Home",
      });
      return;
    }
    this.gameId = this.$route.params.id;
    Socket.on("game", this.onGame);
    Socket.on("game_details", this.onGameDetails);
    Socket.on("game_started", this.onGameStarted);
    Socket.on("new_user", this.onNewUser);
    Socket.on("removed", this.onRemoved);
    Socket.getGame(this.$route.params.id);
    // Socket.on('user', this.onUser);
    // const userId = localStorage.getItem('user_id');
    // Socket.initUser(userId);
  },
  destroyed() {
    Socket.off("game", this.onGame);
    Socket.off("game_started", this.onGameStarted);
    Socket.off("new_user", this.onNewUser);
    Socket.off("removed", this.onRemoved);
  },
  methods: {
    onGameStarted() {
      this.gotoGame();
    },
    onNewUser(data) {
      this.users = data.users;
    },
    onGame(data) {
      console.log("onGameUsers", data);
      if (!data.game || !data.users.length) {
        this.$router.push({
          name: "Home",
        });
        return;
      }
      if (data.game.started) {
        this.gotoGame();
        return;
      }
      this.game = data.game;
      this.users = data.users;
    },
    onGameDetails(data) {
      this.game = data.game;
    },
    onRemoved() {
      this.$router.push({
        name: "Home",
      });
    },
    remove() {
      let confirm = window.confirm("Are you sure?");
      if (!confirm) return;
      Socket.remove();
    },
    start() {
      Socket.startGame(this.$route.params.id);
    },
    gotoGame() {
      this.$router.push({
        name: "Game",
        params: { id: this.$route.params.id },
      });
    },
    shareGame() {
      location.href = `mailto:?subject=Lets play Rummikub&body=${location.origin}/?share=${this.gameId}`;
    },
  },
};
</script>

<style scoped>
#lobby {
  /* flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column; */
}
</style>

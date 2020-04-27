<template>
  <div id="lobby">
    <div class="card">
      <div class="card-body">
        <p>Waiting for players</p>
        <ul class="list-group">
          <li
            class="list-group-item"
            v-for="(user, userIndex) in users"
            :key="userIndex"
          >
            {{ user.name }}
          </li>
        </ul>
        <div class="pb-3"></div>
        <button
          v-if="users.length > 1"
          class="btn btn-primary"
          @click="start()"
        >
          Play
        </button>
      </div>
    </div>
  </div>
</template>

<script>
import Socket from '../services/socket';
export default {
  name: 'Lobby',
  data() {
    return {
      started: false,
      users: [],
    };
  },
  mounted() {
    if (!this.$store.state.userId) {
      this.$router.push({
        name: 'Home',
      });
      return;
    }
    Socket.on('game', this.onGame);
    Socket.on('game_started', this.onGameStarted);
    Socket.on('new_user', this.onNewUser);
    Socket.getGame(this.$route.params.id);
    // Socket.on('user', this.onUser);
    // const userId = localStorage.getItem('user_id');
    // Socket.initUser(userId);
  },
  destroyed() {
    Socket.off('game', this.onGame);
    Socket.off('game_started', this.onGameStarted);
    Socket.off('new_user', this.onNewUser);
  },
  methods: {
    onGameStarted() {
      this.gotoGame();
    },
    onNewUser(data) {
      this.users = data.users;
    },
    onGame(data) {
      console.log('onGameUsers', data);
      if (!data.game || !data.users.length) {
        this.$router.push({
          name: 'Home',
        });
        return;
      }
      if (data.game.started) {
        this.gotoGame();
        return;
      }
      this.users = data.users;
    },
    start() {
      Socket.startGame(this.$route.params.id);
    },
    gotoGame() {
      this.$router.push({
        name: 'Game',
        params: { id: this.$route.params.id },
      });
    },
  },
};
</script>

<style scoped>
#lobby {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
}
</style>

<template>
  <div id="home">
    <div class="card">
      <div class="card-body">
        <form @submit.prevent="updateUser" v-if="!registered">
          <div class="form-group">
            <label>What is your name?</label>
            <input class="form-control" type="text" v-model="user" />
          </div>
          <button class="btn btn-primary">Submit</button>
        </form>
        <form @submit.prevent="startGame" v-else>
          <div class="form-group">
            <label>Open/Create a game</label>
            <input class="form-control" type="text" v-model="game" />
          </div>
          <button class="btn btn-primary">Go</button>
        </form>
      </div>
    </div>
  </div>
</template>

<script>
import Socket from '../services/socket';
export default {
  name: 'Home',
  data() {
    return {
      game: '',
      registered: false,
      user: '',
    };
  },
  mounted() {
    Socket.on('game', this.onGame);
    Socket.on('user', this.onUser);
    const userId = localStorage.getItem('user_id');
    Socket.initUser(userId);
  },
  destroyed() {
    Socket.off('game', this.onGame);
  },
  methods: {
    startGame() {
      if (!this.game) return;
      // send message to socket
      Socket.initGame(this.game);
    },
    updateUser() {
      if (!this.user) return;
      Socket.updateUser({ name: this.user });
      this.$store.commit('setUserName', this.user);
      this.registered = true;
    },
    onUser(data) {
      console.log('onUser', data);
      localStorage.setItem('user_id', data.id);
      if (data.name) this.registered = true;
      this.$store.commit('setUserId', data.id);
      this.$store.commit('setUserName', data.name);
    },
    onGame(data) {
      console.log(data);
      if (data.game.started)
        this.$router.push({
          name: 'Game',
          params: {
            id: this.game,
          },
        });
      else
        this.$router.push({
          name: 'Lobby',
          params: {
            id: this.game,
          },
        });
    },
  },
};
</script>

<style scoped>
#home {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
}
</style>

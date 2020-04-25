<template>
  <div id="user">
    <form @submit.prevent="updateUser">
      <div class="form-group">
        <label>What is your name?</label>
        <input class="form-control" type="text" v-model="user" />
      </div>
      <button class="btn btn-primary">Submit</button>
    </form>
  </div>
</template>

<script>
import Socket from './services/socket';
export default {
  beforeMount() {
    Socket.on('user', this.onUser);
    const userId = localStorage.getItem('user_id');
    Socket.initUser(userId);
  },
  methods: {
    onUser(data) {
      console.log('onUser', data);
      localStorage.setItem('user_id', data.id);
      if (data.name) this.registered = true;
      this.$store.commit('setUserId', data.id);
      this.$store.commit('setUserName', data.name);
    },
    updateUser() {
      Socket.updateUser({ name: this.user });
      this.$store.commit('setUserName', this.user);
      this.registered = true;
    },    
  }  
};
</script>

<style>
#user {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
}
</style>

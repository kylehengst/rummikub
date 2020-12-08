<template>
  <div>
  </div>
</template>

<script>
export default {
    mounted() {
        localStorage.removeItem('token');
        this.$store.commit('setUserId', '');
        this.$store.commit('setUserUuid', '');
        this.$store.commit('setUserName', '');
        this.$store.commit('setGames', '');        
        this.$router.push('/');
    }
}
</script>

<style>

</style>

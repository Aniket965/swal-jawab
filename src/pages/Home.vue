<template>
  <div id="home-page">
    <button @click="signOut()" >logout</button>
    <h1>Swal Jawab 📝</h1>
    <h2>🙏🏻 Welcome, {{user.data.displayName}}</h2>
    <button>join game</button>
      <button>create game</button>
  </div>
</template>

<script>

import { mapGetters } from "vuex";
import firebase from 'firebase';
export default {
  name: 'Home',
  methods: {
    signOut() {
         firebase
        .auth()
        .signOut()
        .then(() => {
          this.$router.replace({
            name: "login"
          });
        });
    }
  },
   computed: {
    ...mapGetters({
      user: "user"
    })
  }
};
</script>

<style lang="scss">

</style>

<template>
  <div id="start-page">
    <button @click="signOut()">logout</button>
    <h1>Swal Jawab 📝</h1>
    <p>⏲ Waiting for players to join...</p>
    <ol>
      <li v-for="item in currentGame.players" :key="item.uid">{{ item.displayName }}</li>
    </ol>

  </div>
</template>

<script>
import { mapGetters, mapActions } from "vuex";
import firebase from "firebase";
import { gameSessionRef, usersCollection } from "../firebaseConfig";
export default {
  name: "Join",
    beforeMount() {
    if (this.currentGame.isStarted) {
      this.$router.push({
        name: "play"
      });
    }
  },
  updated() {
     if (this.currentGame.isStarted) {
      this.$router.push({
        name: "play"
      });
    }
  },
  methods: {
    signOut() {
      firebase
        .auth()
        .signOut()
        .then(() => {
          this.$router.push({
            name: "login"
          });
        });
    }
  },
  computed: {
    ...mapGetters({
      user: "user",
      currentGame: "currentGame"
    })
  }
};
</script>

<style lang="scss">
</style>

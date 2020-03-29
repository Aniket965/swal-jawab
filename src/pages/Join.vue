<template>
  <div id="start-page">
    <button @click="signOut()">logout</button>
     <Logo/>
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
import Logo from '../components/logo.vue';
export default {
  name: "Join",
    components: {
    Logo:Logo,
  },
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

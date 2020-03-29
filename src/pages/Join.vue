<template>
  <div id="start-page">
    <button @click="signOut()">logout</button>
     <Logo/>
    <p class="mt-3">🕐 Wait for players to join...<br/> <span style="font-weight:900;color:var(--primaryColor);">OR</span></p>
     <p>Ask Admin to start the game</p>
  <ol class="center-child mt-1" style="flex-direction : column;">
      <li class="custom-list" v-for="item in currentGame.players" :key="item.uid">
        <div>
                        <v-list-item-avatar>
          <v-img :src="item.photoURL"></v-img>
        </v-list-item-avatar>
        </div>
      <div style="justify-self:left;">
        {{ item.displayName }} </div>
        </li>
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

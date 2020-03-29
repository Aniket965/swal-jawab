<template>
  <div id="page">
    <button @click="signOut()">logout</button>
    <Logo/>
    <h2>code: {{currentGame.code}}</h2>
    <p>⏲ Waiting for players to join...</p>
    <ol>
      <li v-for="item in currentGame.players" :key="item.uid">{{ item.displayName }}</li>
    </ol>
    <v-btn
      style="border-radius:10px;"
      outlined
      class="mt-1"
      rounded
      color="var(--primaryColor)"
      dark
      @click="startGame()"
    >start game</v-btn>

    <v-btn
      style="border-radius:10px;"
      outlined
      class="mt-1"
      rounded
      color="var(--primaryColor)"
      dark
    >end game</v-btn>
  </div>
</template>

<script>
import { mapGetters, mapActions } from "vuex";
import firebase from "firebase";
import { gameSessionRef, usersCollection } from "../firebaseConfig";
import { questionGenerator } from "../questionGenerator";
import Logo from '../components/logo.vue';
export default {
  name: "Start",
    components: {
    Logo:Logo,
  },
  mounted() {
    if (this.currentGame.isStarted === true) {
      this.$router.push({
        name: "play"
      });
    }
  },
  methods: {
    ...mapActions({
      fetchGame: "fetchGame",
      setGameListner: "setGameListner"
    }),
    async startGame() {
      await gameSessionRef.child(`/${this.user.gameDetails.gameId}`).set({
        ...this.currentGame,
        gameid: this.user.gameDetails.gameId,
        isStarted: true,
        gameStats: {
          totalScore: Object.fromEntries(
            new Map(
              Object.values(this.currentGame.players).map(ele => {
                return [ele.uid, { ...ele, score: 0 }];
              })
            )
          )
        },
        currentRound: {
          num: 1,
          question: questionGenerator(
            Object.values(this.currentGame.players).map(ele => ele.displayName)
          ),
          isAllAnwsered: false,
          isAllLikedAnwsered: false,
          playersAnwsered: Object.fromEntries(
            new Map(
              Object.values(this.currentGame.players).map(ele => {
                return [
                  ele.uid,
                  { ...ele, isAnwsered: false, isDoneLiking: false }
                ];
              })
            )
          )
        }
      });

      this.$router.push({
        name: "play"
      });
    },
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

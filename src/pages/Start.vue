<template>
  <div id="page">
    <button @click="signOut()">logout</button>
    <h1>Swal Jawab 📝</h1>
    <h2>code: {{currentGame.code}}</h2>
    <p>⏲ Waiting for players to join...</p>
    <ol>
      <li v-for="item in currentGame.players" :key="item.uid">{{ item.displayName }}</li>
    </ol>
    <button @click="startGame()">start game</button>
    <button>end game</button>
  </div>
</template>

<script>
import { mapGetters, mapActions } from "vuex";
import firebase from "firebase";
import { gameSessionRef, usersCollection } from "../firebaseConfig";
export default {
  name: "Start",
  mounted() {
    if (this.currentGame.isStarted) {
      this.$router.replace({
        name: "play"
      });
    }
  },
  methods: {
    async startGame() {
      await gameSessionRef.child(this.user.gameDetails.gameId).set({
        ...this.currentGame,
        gameid:this.user.gameDetails.gameId,
        isStarted: true,
        gameStats:{
          totalScore:Object.fromEntries(new Map(Object.values(this.currentGame.players).map(ele => {
              return [
                ele.uid,
                { ...ele, score:0 }
              ];
            })))
        },
        currentRound: {
          num: 1,
          question: "what is home name of anirodh",
          isAllAnwsered: false,
          isAllLikedAnwsered: false,
          playersAnwsered: Object.fromEntries(new Map(Object.values(this.currentGame.players).map(ele => {
              return [
                ele.uid,
                { ...ele, isAnwsered: false, isDoneLiking: false }
              ];
            })))
          
        }
      });

      this.$router.replace({
        name: "play"
      });
      
    },
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
      user: "user",
      currentGame: "currentGame"
    })
  }
};
</script>

<style lang="scss">
</style>

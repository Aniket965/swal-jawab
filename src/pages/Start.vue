<template>
  <div id="page">
    <button @click="signOut()">logout</button>
    <Logo class="mt-2"/>
    <h4 class="mt-2">Joining code</h4>
    <h2 style="font-size:3rem;color:var(--primaryColor);margin:0;">{{currentGame.code}}</h2>
    <p>🕐 Waiting for players to join...</p>
    <ol class="center-child" style="flex-direction : column;">
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
    <h1>
    <v-btn
      style="border-radius:18px;"
      x-large
      class="custom mt-1"
      rounded
      color="var(--primaryColor)"
      dark
      filled
      @click="startGame()"
    >Start Game</v-btn>
    </h1>
  <h1>
    <v-btn
      style="border-radius:18px;"
      outlined
      x-large
      class="custom mt-1"
      rounded
      color="var(--primaryColor)"
      dark
    >End Game</v-btn>
  </h1>


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

<style  lang="scss">
.custom-list {
  font-size: 1.2rem;
  font-weight: 700;
  display: grid;
  grid-template-columns: 1fr 4fr;
  
  background: #ececec94;
  border-radius: 10px;
  padding: 0.1rem 2rem;
  width: fit-content;
  max-width: 500px;
  list-style: none;
  margin-top: .5rem;
  gap: 1rem;
}
.custom-list div {
  // background: pink;
  justify-self: center;
  align-self: center;
  
}
</style>

<template>
  <div id="home-page">
    <button @click="signOut()" >logout</button>
    <h1>Swal Jawab 📝</h1>
    <h2>🙏🏻 Welcome, {{user.data.displayName}}</h2>
    <button>join game</button>
    <button @click="user.gameDetails.isGameStarted ? continueGame() : createGameSession()">{{user.gameDetails.isGameStarted ? 'continue' : 'create'}} game</button>
  </div>
</template>

<script>

import { mapGetters,mapActions } from "vuex";
import firebase from 'firebase';
import { gameSessionRef,usersCollection } from "../firebaseConfig";
export default {
  name: 'Home',
  methods: {
    ...mapActions({
      fetchGame:'fetchGame'
    }),
    async continueGame()  {
      const gameId = this.user.gameDetails.gameId;
      let gameData = await (await gameSessionRef.child(gameId).once('value')).val();
      this.fetchGame(gameData);
      this.$router.replace({
            name: "start"
      });
    },
    async createGameSession() {
        const uid = this.user.data.uid;
        let res =  await gameSessionRef.push({
            code:'' + Math.random().toString(36).substr(2, 6),
            createdOn: new Date(),
            isFinished: false,
            isStarted:false,
            players: [ 
                {
                  uid:uid,
                  displayName:this.user.data.displayName
                },
            ],
            createdBy: uid,
            gamelength: 20,
            gameRounds:[],
            gameStats: {
                totalScore: {
                    uid:0,
                }
            },
        });
    
        await usersCollection.doc(uid).set({
            currentGameId: res.key,
        });
      let gameData = await (await res.once('value')).val();
      this.fetchGame(gameData);
      this.$router.replace({
            name: "start"
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
      currentGame:"currentGame"
    })
  }
};
</script>

<style lang="scss">

</style>

<template>
  <div id="home-page">
    <button @click="signOut()" >logout</button>
    <h1>Swal Jawab 📝</h1>
    <h2>🙏🏻 Welcome, {{user.data.displayName}}</h2>
    <input type="text" v-model="code" name="code" id="code">
    <button @click="join()">join game</button>
    <button @click="user.gameDetails.isGameStarted ? continueGame() : createGameSession()">{{user.gameDetails.isGameStarted ? 'continue' : 'create'}} game</button>
  </div>
</template>

<script>

import { mapGetters,mapActions } from "vuex";
import firebase from 'firebase';
import { gameSessionRef,usersCollection } from "../firebaseConfig";
export default {
  name: 'Home',
  data: function () {
    return {
      code: ''
    }
  },
  methods: {
    ...mapActions({
      fetchGame:'fetchGame'
    }),

    async join() {
      let code = this.code;
      let gameObject = (await gameSessionRef.orderByChild('code').equalTo(code).once('value')).val();
      const gameId = Object.keys(gameObject)[0];
      this.fetchGame({gameData:gameObject[gameId],gameId});
      // only push if player is not already present
      await gameSessionRef.child(gameId+"/players").push({
        displayName:this.user.data.displayName,
        uid:this.user.data.uid
      })
        this.$router.replace({
            name: "join"
      });

    },
    async continueGame()  {
      const gameId = this.user.gameDetails.gameId;
      let gameData = await (await gameSessionRef.child(gameId).once('value')).val();
      this.fetchGame({gameData,gameId});
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
      this.fetchGame({gameData,gameId:res.key});
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

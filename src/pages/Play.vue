<template>
  <div id="play-page">
    <button @click="signOut()">logout</button>
    <h1>Swal Jawab 📝</h1>
    <!-- <h2>Round number {{currentGame.currentRound}}</h2> -->
    <div v-if="!Object.values(currentGame.currentRound.playersAnwsered)[0].isAnwsered">
      <h1>Question: {{currentGame.currentRound.question}}</h1>
      <input type="text" name="anwser" id="anwser" v-model="anwser" />
      <button @click="submitAnwser()">Submit</button>
    </div>

    <div
      v-if="currentGame.currentRound.playersAnwsered[user.data.uid].isAnwsered && !currentGame.currentRound.isAllAnwsered"
    >
      <h1>Waiting for everyone to anwser</h1>
      <ol>
        <li v-for="item in Object.values(currentGame.currentRound.playersAnwsered)" :key="item.uid">
          <span v-if="item.isAnwsered">✅</span>
          <span v-if="!item.isAnwsered">🕐</span>
          {{ item.displayName }}
        </li>
      </ol>
    </div>

    <div
      v-if="currentGame.currentRound.isAllAnwsered && !(currentGame.currentRound.isAllLikedAnwsered)"
    >
      <ul>
        <li v-for="item in Object.values(currentGame.currentRound.anwsers)" :key="item.uid">
          <input type="radio" :id="item.writtenBy" v-model="likedId" name="like" :value="item.id" />
          <label for="contactChoice3">{{ item.text._value }}</label>
        </li>
        <button @click="submitLike()">submit</button>
      </ul>
    </div>
    <div
      v-if="currentGame.currentRound.isAllAnwsered && (currentGame.currentRound.isAllLikedAnwsered)"
    >
      <h1>Score Card</h1>
      <table>
        <th>Name</th>
        <th>Score</th>
         <th>This round</th>
        <tr v-for="item in Object.values(currentGame.gameStats.totalScore)" :key="item.uid">
          <td>{{item.displayName}}</td>
          <td>{{item.score}}</td>
          <td>{{Object.keys(currentGame.currentRound.playersAnwsered[item.uid].likedby).length}}</td>
        </tr>
      </table>
       <button v-if="currentGame.createdBy === user.data.uid" @click="submitLike()">Play Next Round</button>
    </div>
  </div>
</template>

<script>
import { mapGetters, mapActions } from "vuex";
import firebase from "firebase";
import { gameSessionRef, usersCollection } from "../firebaseConfig";
export default {
  name: "Play",
  data: function() {
    return {
      anwser: "",
      likedId: ""
    };
  },
  methods: {
    async submitLike() {
      await gameSessionRef
        .child(
          "-M3RkqkXc0_AjNSTwIgE/currentRound/playersAnwsered/" +
            this.user.data.uid +
            "/isDoneLiking"
        )
        .set(true);
      let likedUid = (await gameSessionRef.child("-M3RkqkXc0_AjNSTwIgE/currentRound/anwsers/" +
            this.likedId +'/writtenBy').once('value')).val();
      await gameSessionRef
        .child(
          "-M3RkqkXc0_AjNSTwIgE/currentRound/playersAnwsered/" +
           likedUid +
            "/likedby"
        )
        .push({
          uid: this.user.data.uid,
          displayName: this.user.data.displayName
        });
    },
    async submitAnwser() {
      await gameSessionRef
        .child(
          "-M3RkqkXc0_AjNSTwIgE/currentRound/playersAnwsered/" +
            this.user.data.uid +
            "/isAnwsered"
        )
        .set(true);
      await gameSessionRef
        .child("-M3RkqkXc0_AjNSTwIgE/currentRound/anwsers")
        .push({
          text: anwser,
          writtenBy: this.user.data.uid
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

<template>
  <div id="play-page">
    <button @click="signOut()">logout</button>
    <h1>Swal Jawab 📝</h1>
    <h2>Round #{{currentGame.currentRound.num}}</h2>
    <div v-if="currentGame.currentRound.playersAnwsered[user.data.uid].isAnwsered == false">
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
          <label for="contactChoice3">{{ item.text }}</label>
        </li>
        <button v-if="currentGame.currentRound.playersAnwsered[user.data.uid].isDoneLiking === false" @click="submitLike()">submit</button>
        <p v-if="this.currentGame.currentRound.likes">Number of frients Left liking: {{  Object.keys(this.currentGame.currentRound.playersAnwsered).length - Object.keys(this.currentGame.currentRound.likes).length }}</p>
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
          this.currentGame.gameid +
            "/currentRound/playersAnwsered/" +
            this.user.data.uid +
            "/isDoneLiking"
        )
        .set(true);
      let likedUid = (
        await gameSessionRef
          .child(
            this.currentGame.gameid +
              "/currentRound/anwsers/" +
              this.likedId +
              "/writtenBy"
          )
          .once("value")
      ).val();
           let d = await gameSessionRef
        .child(this.currentGame.gameid + "/currentRound/likes")
        .push({
          uid: this.user.data.uid
        });
      await gameSessionRef
        .child(
          this.currentGame.gameid +
            "/currentRound/playersAnwsered/" +
            likedUid +
            "/likedby"
        )
        .push({
          uid: this.user.data.uid,
          displayName: this.user.data.displayName
        });

             if (
        Object.keys(this.currentGame.currentRound.likes).length ===
        Object.keys(this.currentGame.currentRound.playersAnwsered).length
      ) {
        await gameSessionRef
          .child(this.currentGame.gameid + "/currentRound/isAllLikedAnwsered/")
          .set(true);
      }
    },
    async submitAnwser() {
      await gameSessionRef
        .child(
          this.currentGame.gameid +
            "/currentRound/playersAnwsered/" +
            this.user.data.uid +
            "/isAnwsered"
        )
        .set(true);
      let d = await gameSessionRef
        .child(this.currentGame.gameid + "/currentRound/anwsers")
        .push({
          text: this.anwser,
          writtenBy: this.user.data.uid
        });
      await gameSessionRef
        .child(this.currentGame.gameid + "/currentRound/anwsers/"+d.key+"/id")
        .set(d.key);

      if (
        Object.keys(this.currentGame.currentRound.anwsers).length ===
        Object.keys(this.currentGame.currentRound.playersAnwsered).length
      ) {
        await gameSessionRef
          .child(this.currentGame.gameid + "/currentRound/isAllAnwsered/")
          .set(true);
      }
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

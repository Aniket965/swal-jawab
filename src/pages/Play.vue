<template>
  <div id="play-page">
    <button @click="signOut()">logout</button>
    <h1>Swal Jawab 📝</h1>
    <div v-if="currentGame !== null && currentGame !== undefined">
      <h2>Round #{{currentGame.currentRound.num}} / {{currentGame.gamelength}}</h2>
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
          <li
            v-for="item in Object.values(currentGame.currentRound.playersAnwsered)"
            :key="item.uid"
          >
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
            <input v-if="item.writtenBy !== user.data.uid"  type="radio" :id="item.writtenBy" v-model="likedId" name="like" :value="item.id"  />
            <label for="contactChoice3">{{ item.text }}</label>
          </li>
          <button
            v-if="currentGame.currentRound.playersAnwsered[user.data.uid].isDoneLiking === false"
            @click="submitLike()"
          >submit</button>
          <p
            v-if="this.currentGame.currentRound.likes"
          >Number of friends Left liking: {{ Object.keys(this.currentGame.currentRound.playersAnwsered).length - Object.keys(this.currentGame.currentRound.likes).length }}</p>
        </ul>
      </div>
      <div
        v-if="currentGame.currentRound.isAllAnwsered && (currentGame.currentRound.isAllLikedAnwsered)"
      >
        <h1>Score Card</h1>
        <table>
          <th>Name</th>
          <th>Total Score</th>
          <th>This round</th>
          <tr v-for="item in Object.values(currentGame.gameStats.totalScore)" :key="item.uid">
            <td>{{item.displayName}}</td>
            <td>{{item.score}}</td>
            <td>+{{(currentGame.currentRound.playersAnwsered[item.uid].likedby ? Object.keys(currentGame.currentRound.playersAnwsered[item.uid].likedby).length : 0)}}</td>
          </tr>
        </table>
        <button
          v-if="currentGame.createdBy === user.data.uid"
          @click="playNextRound()"
        >Play Next Round</button>
        <button
          v-if="currentGame.createdBy !== user.data.uid && currentGame.isFinished"
          @click="goToHome()"
        >Go to Home</button>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters, mapActions } from "vuex";
import firebase from "firebase";
import { gameSessionRef, usersCollection } from "../firebaseConfig";
import { questionGenerator } from "../questionGenerator";
export default {
  name: "Play",
  data: function() {
    return {
      anwser: "",
      likedId: ""
    };
  },
  methods: {
    ...mapActions({
      fetchGame: "fetchGame",
      resetGameListner: "resetGameListner",
      fetchCurrentGameDetails: "fetchCurrentGameDetails"
    }),
    goToHome() {
      this.fetchCurrentGameDetails({
        gameId: null,
        isGameStarted: false
      });
      this.resetGameListner(this.currentGame.gameid);
      this.fetchGame(null);
      this.$router.push({
        name: "home"
      });
    },
    async playNextRound() {
      let totalScore = this.currentGame.gameStats.totalScore;
      this.likedId = '';
      this.anwser = '';
      const newScore = Object.fromEntries(
        new Map(
          Object.keys(totalScore).map(ele => {
            return [
              ele,
              {
                ...totalScore[ele],
                score:
                  totalScore[ele].score +
                  (this.currentGame.currentRound.playersAnwsered[
                    totalScore[ele].uid
                  ].likedby
                    ? Object.keys(
                        this.currentGame.currentRound.playersAnwsered[
                          totalScore[ele].uid
                        ].likedby
                      ).length
                    : 0)
              }
            ];
          })
        )
      );

      await gameSessionRef
        .child(this.currentGame.gameid + "/gameStats/totalScore")
        .set(newScore);
      // if its last round
      if (this.currentGame.currentRound.num !== this.currentGame.gamelength) {
        // FIXME: add new round duplicate from start.vue make it one place only
        let newRound = {
          num: this.currentGame.currentRound.num + 1,
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
        };
        await gameSessionRef
          .child(this.currentGame.gameid + "/currentRound")
          .set(newRound);
      } else {
        alert("game ended");
        // reset user current game
        await usersCollection.doc(this.user.data.uid).set({
          currentGameId: null
        });
        // update game state
        await gameSessionRef
          .child(this.currentGame.gameid + "/isFinished")
          .set(true);

        // reset local store
        this.fetchCurrentGameDetails({
          gameId: null,
          isGameStarted: false
        });
        this.resetGameListner(this.currentGame.gameid);

        this.fetchGame(null);

        this.$router.push({
          name: "home"
        });
      }
    },
    async submitLike() {
      if (this.likedId !== '')
   {   await gameSessionRef
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
      }} else {
        alert('select an option');
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
        .child(
          this.currentGame.gameid + "/currentRound/anwsers/" + d.key + "/id"
        )
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

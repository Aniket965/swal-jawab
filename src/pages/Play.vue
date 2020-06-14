
<template>
  <div id="play-page" >
    <button @click="signOut()">logout</button>
    <Logo />
    <div class="mt-3" v-if="currentGame.currentRound !== undefined">
      <h2>
        Round
        <span style="color:var(--primaryColor)">#{{currentGame.currentRound.num}}</span>
        / {{currentGame.gamelength}}
      </h2>
      <div v-if="currentGame.currentRound.playersAnwsered[user.data.uid].isAnwsered == false">
        <h1>
          <span style="color:var(--primaryColor)">Question:</span>
          {{currentGame.currentRound.question}}
        </h1>
        <div class="center-child">
          <div style="max-width:700px;padding:1rem;">
            <v-textarea
              filled
              required
              multiline
              dense
              rounded
              label="Your Answer"
              type="text"
              name="anwser"
              id="anwser"
              @keydown.enter="submitAnwser()"
              v-model="anwser"
            />
          </div>
        </div>

        <v-btn
          style="border-radius:18px;"
          x-large
          class="custom mt-1"
          rounded
          color="var(--primaryColor)"
          dark
          @click="submitAnwser()"
        >Submit</v-btn>
      </div>

      <div
        v-if="currentGame.currentRound.playersAnwsered[user.data.uid].isAnwsered && !currentGame.currentRound.isAllAnwsered"
      >
        <p>🕐 Waiting for everyone to answer</p>
        <ol class="center-child" style="flex-direction : column;">
          <li
            class="custom-list"
            v-for="item in Object.values(currentGame.currentRound.playersAnwsered)"
            :key="item.uid"
          >
            <div>
              <v-list-item-avatar>
                <v-img :src="item.photoURL"></v-img>
              </v-list-item-avatar>
            </div>
            <div style="justify-self:left;">{{ item.displayName }} {{item.isAnwsered? ' ✅':' 🕐'}}</div>
          </li>
        </ol>
      </div>

      <div
        v-if="currentGame.currentRound.isAllAnwsered && !(currentGame.currentRound.isAllLikedAnwsered)"
      >
        <ol class="center-child" style="flex-direction : column;">
          <v-radio-group v-model="likedId" :mandatory="true">
            <li
              class="custom-list"
              style="width:fit-content;"
              v-for="item in Object.values(currentGame.currentRound.anwsers)"
              :key="item.uid"
            >
              <v-radio
                color="var(--primaryColor)"
                :disabled="item.writtenBy === user.data.uid"
                :id="item.writtenBy"
                name="like"
                :value="item.id"
              ></v-radio>
              <p style="word-wrap:break-word;max-width:200px">{{item.text}}</p>
            </li>
          </v-radio-group>
          <v-btn
            style="border-radius:18px;"
            x-large
            class="custom mt-1"
            rounded
            color="var(--primaryColor)"
            dark
            v-if="currentGame.currentRound.playersAnwsered[user.data.uid].isDoneLiking === false"
            @click="submitLike()"
          >Submit</v-btn>
          <p
            v-if="this.currentGame.currentRound.likes"
          >Number of friends Left liking: {{ Object.keys(this.currentGame.currentRound.playersAnwsered).length - Object.keys(this.currentGame.currentRound.likes).length }}</p>
        </ol>
      </div>
      <div
        v-if="currentGame.currentRound.isAllAnwsered && (currentGame.currentRound.isAllLikedAnwsered)"
      >
        <h1>Score Card</h1>
        <v-simple-table>
          <template v-slot:default>
            <thead>
              <tr>
                <th class="text-left">Player</th>
                <th class="text-left">Total Score</th>
                <th class="text-left">This Round</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="item in Object.values(currentGame.gameStats.totalScore)" :key="item.uid">
                <td>
                  <v-avatar style="margin-right:12px" size="36px">
                    <img :src="item.photoURL" :alt="item.displayName" />
                  </v-avatar>
                  {{ item.displayName}}
                </td>
                <td>{{ item.score + (currentGame.currentRound.playersAnwsered[item.uid].likedby ? Object.keys(currentGame.currentRound.playersAnwsered[item.uid].likedby).length : 0)}}</td>
                <td>+{{(currentGame.currentRound.playersAnwsered[item.uid].likedby ? Object.keys(currentGame.currentRound.playersAnwsered[item.uid].likedby).length : 0)}}</td>
              </tr>
            </tbody>
          </template>
        </v-simple-table>

        <v-btn
          style="border-radius:18px;"
          x-large
          class="custom mt-1"
          rounded
          color="var(--primaryColor)"
          dark
          v-if="currentGame.createdBy === user.data.uid"
          @click="playNextRound()"
        >Play Next Round</v-btn>
        <v-btn
          style="border-radius:10px;"
          outlined
          class="mt-1"
          rounded
          color="var(--primaryColor)"
          dark
          v-if="currentGame.createdBy !== user.data.uid && currentGame.isFinished"
          @click="goToHome()"
        >Go to Home</v-btn>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters, mapActions } from "vuex";
import firebase from "firebase";
import { gameSessionRef, usersCollection } from "../firebaseConfig";
import { questionGenerator } from "../questionGenerator";
import Logo from "../components/logo.vue";
export default {
  name: "Play",
  components: {
    Logo: Logo
  },
  data: function() {
    return {
      anwser: "",
      likedId: ""
    };
  },
  beforeMount() {
    let that = this;
    firebase.auth().onAuthStateChanged(async user => {
      that.fetchUser(user);
      if (user) {
        // User is signed in.
        let details = await (await usersCollection.doc(user.uid).get()).data();
        that.getGame(this.$route.params.id);
         that.fetchCurrentGameDetails({currentGameId:this.$route.params.id});
      } else {
        // No user is signed in.
        this.$router.replace({
          name: "login"
        });
      }
    });
    console.log("hello",typeof(this.currentGame))
   
  },
  methods: {
    ...mapActions({
      fetchGame: "fetchGame",
      fetchUser: "fetchUser",
      getGame:"getGame",
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
      this.likedId = "";
      this.anwser = "";
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
      if (this.likedId !== "") {
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
            .child(
              this.currentGame.gameid + "/currentRound/isAllLikedAnwsered/"
            )
            .set(true);
        }
      } else {
        alert("select an option");
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

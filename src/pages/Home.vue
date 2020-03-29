<template>
  <div class="home-page">
    <!-- <div style="position:relative;">
      <div class="box-1"></div>
      <div class="box-2"></div>
    </div> -->
    <Logo class="mt-5" />

    <div class="header">
      <h4>🙏🏻Welcome Back,</h4>
      <div class="name-heading">{{user.data ? user.data.displayName : ''}}</div>
    </div>
    <div class="center-child mt-5">
      <div class="button-grid">
        <v-text-field
          style="border-radius:18px;"
          color="var(--primaryColor)"
          v-model="code"
          name="code"
          id="code"
          class="code"
          label="Enter Code"
          placeholder="Eg ABC 211"
          filled
          rounded
          @keydown.enter="join()"
        ></v-text-field>
        <v-btn
          x-large
          style="border-radius:18px;"
          block
          class="custom"
          rounded
          color="var(--primaryColor)"
          @click="join()"
          dark
        >Join</v-btn>
        <v-btn
          style="border-radius:18px;"
          x-large
          outlined
          block
          class="mt-1 custom"
          rounded
          color="var(--primaryColor)"
          dark
          @click="user.gameDetails.isGameStarted ? continueGame() : createGameSession()"
        >{{user.gameDetails.isGameStarted ? 'continue' : 'New'}} Game</v-btn>
        <v-btn
          style="border-radius:18px;"
          x-large
          outlined
          block
          class="mt-1 custom"
          rounded
          color="var(--primaryColor)"
          dark
          @click="signOut()"
        >Logout</v-btn>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters, mapActions } from "vuex";
import firebase from "firebase";
import { gameSessionRef, usersCollection } from "../firebaseConfig";
import { store } from "../store.js";
import Logo from '../components/logo.vue';
export default {
  name: "Home",
  components: {
    Logo:Logo,
  },
  data: function() {
    return {
      code: ""
    };
  },
  beforeMount() {
    firebase.auth().onAuthStateChanged(async user => {
      store.dispatch("fetchUser", user);
      if (user) {
        // User is signed in.
        let details = await (await usersCollection.doc(user.uid).get()).data();
        store.dispatch("fetchCurrentGameDetails", details);
      } else {
        // No user is signed in.
        this.$router.replace({
          name: "login"
        });
      }
    });
  },
  methods: {
    ...mapActions({
      fetchGame: "fetchGame",
      setGameListner: "setGameListner"
    }),

    async join() {
      let code = this.code;
      let gameObject = (
        await gameSessionRef
          .orderByChild("code")
          .equalTo(code)
          .once("value")
      ).val();
      const gameId = Object.keys(gameObject)[0];
      this.fetchGame({ gameData: gameObject[gameId], gameId });
      //only push if player is not already present
      if (this.currentGame.isStarted === false) {
        if (
          Object.values(this.currentGame.players)
            .map(ele => ele.uid)
            .includes(this.user.data.uid) === false
        ) {
          await gameSessionRef.child(gameId + "/players").push({
            displayName: this.user.data.displayName,
            uid: this.user.data.uid,
            photoURL:this.user.data.photoURL,
          });
        }

        this.$router.push({
          name: "join"
        });
      } else {
        if (
          Object.values(this.currentGame.players)
            .map(ele => ele.uid)
            .includes(this.user.data.uid) === true
        ) {
          this.$router.push({
            name: "join"
          });
        } else {
          alert("Can not join game already started");
        }
      }
    },
    async continueGame() {
      const gameId = this.user.gameDetails.gameId;
      let gameData = await (
        await gameSessionRef.child(gameId).once("value")
      ).val();
      this.fetchGame({ gameData, gameId });
      this.$router.push({
        name: "start"
      });
    },
    async createGameSession() {
      const uid = this.user.data.uid;
      let res = await gameSessionRef.push({
        code:
          "" +
          Math.random()
            .toString(36)
            .substr(2, 6),
        createdOn: new Date(),
        isFinished: false,
        isStarted: false,
        players: [
          {
            uid: uid,
            displayName: this.user.data.displayName,
            photoURL:this.user.data.photoURL,
          }
        ],
        createdBy: uid,
        gamelength: 10,
        gameRounds: [],
        gameStats: {
          totalScore: {
            uid: 0
          }
        }
      });

      await usersCollection.doc(uid).set({
        currentGameId: res.key
      });
      let gameData = await (await res.once("value")).val();
      this.fetchGame({ gameData, gameId: res.key });
      this.$router.push({
        name: "start"
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
.custom .v-btn__content {
  font-family: "Poppins", sans-serif !important;
  font-weight: 700 !important;
  text-transform: none !important;
  font-size: 1.5rem !important;
  border-width: 2px !important;
}
.code .v-text-field__slot input {
  font-family: "Poppins", sans-serif !important;
  font-weight: 700;
  text-transform: uppercase;
  color: var(--primaryColor) !important;
}
#home-page {
  // overflow: hidden!important;
  // background: pink!important;
  width: 100vw;
  height: 100vh;
}
</style>
<style scoped lang="scss">
.box-1 ,.box-2{
  height: 3rem;
  width: 1000px;
  left: 3rem;
  top: 5rem;
  position: absolute;
  top: 0;
  left: 0;
  z-index: -100;
}
.box-1 {
    background: var(--primaryColor);
    transform: rotate(15deg);
    z-index: 0;
}
.box-2 {
    background: var(--secondaryColor);
    transform: rotate(45deg);
    top: 10rem;
      left: 1rem;
    z-index: 0;
}
.button-grid {
  width: 300px;
  max-width: 500px;
}
.header {
  margin-top: 4rem;
  z-index: 2;
}
.logo {
  font-size: 2.3rem;
  font-weight: 900;
  color: var(--darkColor);
}
h4 {
  margin: 0;
  z-index: 2;
}
.name-heading {
  font-size: 2.3rem;
  z-index: 2;
  font-weight: 700;
  color: var(--primaryColor);
  margin: 0;
}

</style>


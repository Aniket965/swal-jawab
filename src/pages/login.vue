<template>
  <div id="login-page">
     <Logo/>
    <h2>Login</h2>
       <v-btn
          style="border-radius:18px;"
          x-large
          outlined
          class="mt-1 custom"
          rounded
          color="var(--primaryColor)"
          dark
          @click="googleLogin()"
        >Continue with Google</v-btn>
  </div>
</template>

<script>
import firebase from 'firebase';
import Logo from '../components/logo.vue';
export default {
  name: 'Login',
    components: {
    Logo:Logo,
  },
  methods : {
    googleLogin() {
      const provider = new firebase.auth.GoogleAuthProvider();
      firebase.auth().signInWithPopup(provider).then(result => {
          this.$router.push({
            name:'home',
          });
      }).catch(err => {
        alert('Opps.  ' + err.message)
      })
    }
  }
};
</script>

<style lang="scss">

</style>

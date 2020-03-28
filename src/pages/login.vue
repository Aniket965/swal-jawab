<template>
  <div id="login-page">
    <h1>Swal Jawab 📝</h1>
    <h2>Login</h2>
    <button @click="googleLogin()">Continue with Google</button>
  </div>
</template>

<script>
import firebase from 'firebase';

export default {
  name: 'Login',
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

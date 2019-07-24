<template>
  <div>
    <div>
      <input placeholder="email" type="text" v-model="email"><br>
      <input placeholder="password" type="password" v-model="password"><br>
      <button @click="login">Login</button>
      <button @click="$router.push('/private')">Go to Private</button>
      <button @click="logout">Logout</button>
    </div>
  </div>
</template>

<script>
import firebase from '~/plugins/firebase';
export default {
  data() {
    return {
      email: '',
      password: ''
    }
  },
  methods : {
    login() {
      firebase.auth().signInWithEmailAndPassword(this.email, this.password)
      .then(async loggedInUser => {
        await this.$store.dispatch('login', loggedInUser.user.uid); // TODO: errorHandling
        this.$store.commit('setUser', loggedInUser.user.email);
        this.$router.push("/private");
      })
      .catch((error) => {
        alert(error)
      });
    },
    logout() {
      firebase.auth().signOut()
      .then(async() => {
        await this.$store.dispatch('logout'); // TODO: errorHandling
        this.$router.push('/');
      })
      .catch((error) => {
        alert(error)
      })
    }
  }
}
</script>
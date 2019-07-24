<template>
  <div>
    <h1>
      Private Page
    </h1>
    <h3>Your UID : {{ user }}</h3>
    <button @click="$router.push('/')">Back to TOP</button>
  </div>
</template>

<script>
import { mapState } from 'vuex';
export default {
  middleware: ['auth'],
  computed: {
    ...mapState(['user'])
  }
}
</script>

<style>

</style>

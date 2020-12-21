<template>
  <div class="container">
    <div>
      <h1 class="title">
        kontroliuo
      </h1>
    </div>
  </div>
</template>

<script>
import {
  getModerators as U_getModerators,
  getSubscribers as U_getSubscribers
} from '@/utils/twitch.js';

export default {
  data() {
    return {
      client_id: process.env.NUXT_ENV_API_CLIENT_ID || null,
      channel_id: process.env.NUXT_ENV_BROADCASTER_ID || null,
      auth_token: localStorage.getItem('tw_accessToken') || null
    }
  },
  computed: {
    user() {
      return this.$store.getters['user/user'];
    }
  },
  mounted() {
    console.log(this.user);
    U_getModerators({
      channelId: this.channel_id, 
      authToken: this.auth_token, 
      clientId: this.client_id, 
      $axios: this.$axios
    }).then((response) => console.log(response));

    getSubscribers({
      channelId: this.channel_id, 
      authToken: this.auth_token, 
      clientId: this.client_id, 
      $axios: this.$axios
    }).then((response) => console.log(response));
  }
}
</script>

<style>
/* Sample `apply` at-rules with Tailwind CSS
.container {
@apply min-h-screen flex justify-center items-center text-center mx-auto;
}
*/
.container {
  margin: 0 auto;
  min-height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  text-align: center;
}

.title {
  font-family:
    'Quicksand',
    'Source Sans Pro',
    -apple-system,
    BlinkMacSystemFont,
    'Segoe UI',
    Roboto,
    'Helvetica Neue',
    Arial,
    sans-serif;
  display: block;
  font-weight: 300;
  font-size: 100px;
  color: #35495e;
  letter-spacing: 1px;
}

.subtitle {
  font-weight: 300;
  font-size: 42px;
  color: #526488;
  word-spacing: 5px;
  padding-bottom: 15px;
}

.links {
  padding-top: 15px;
}
</style>

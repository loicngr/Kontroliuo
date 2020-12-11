<template>
  <div
    class="md:container md:mx-auto min-h-screen flex flex-col justify-center items-center"
  >
    <div>
      <a
        class="bg-purple-600 rounded-lg px-4 py-2 text-white text-base md:text-5xl xs:text-xs"
        :href="getAuthUrl"
        >Twitch Authentication</a
      >
    </div>
  </div>
</template>

<script>
export default {
  middleware: null,
  data() {
    return {
      base_url: process.env.NUXT_ENV_API_BASE_URL || null,
      client_id: process.env.NUXT_ENV_API_CLIENT_ID || null,
      redirect_url: process.env.NUXT_ENV_API_REDIRECT_URL || null,
      scopes: '',
    }
  },
  computed: {
    getAccessToken: function() {
      return localStorage.getItem('tw_accessToken') || null;
    },
    getAuthUrl: function() {
      console.log(this.client_id, this.redirect_url, this.base_url);
      if (!(this.client_id || this.redirect_url || this.base_url)) {
        throw new Error("Environement variables empty");
      }

      const params = new URLSearchParams();
      params.append('client_id', this.client_id);
      params.append('redirect_uri', this.redirect_url);
      params.append('response_type', 'token');
      params.append('scope', this.scopes);
      return this.base_url.concat(params);
    },
  },
  methods: {
    getUser(access_token) {
      return new Promise((res, rej) => {
        this.$axios.$get('https://api.twitch.tv/helix/users', { 
          progress: true,
          headers: {
            Authorization: 'Bearer ' + access_token,
            'Client-Id': this.client_id,
          }
        }).then((response) => res(response))
        .catch((err) => rej(err));
      })
    },
    authUser(access_token) {
      /**
       * Get twitch user information with Access Token in URL
       */
      this.getUser(access_token)
        .then((response) => {
          if (!response?.data) return;
          const userData = response.data[0];
          if (!userData?.login) return;

          /**
           * User successful loggedIn
           */
          this.$store.commit('auth/isAuthenticated', true);
          localStorage.setItem('tw_accessToken', access_token);
          this.$store.commit('user/setUser', userData);
          
          this.$router.push({name: 'index'});
        })
        .catch((err) => {
          /**
           * Error when get user informations
           * 
           * Delete all data about user login
           */
          console.log(err);
          this.$store.commit('auth/isAuthenticated', false);
          localStorage.removeItem('tw_accessToken');
          this.$store.commit('user/setUser', {});
        })
    }
  },
  mounted() {
    /**
     * Get Twitch access token on LocalStorage
     */
    const localAccessToken = this.getAccessToken;
    if (!window.location.hash && localAccessToken) {
      this.authUser(localAccessToken);
    } else {
      let url = window.location.href.replace('/login#', '?');
      url = new URL(url);

      /**
       * Get Access token in URL
       */
      const urlParams = new URLSearchParams(url.search);
      const access_token = urlParams.get('access_token');
      if (!access_token) return;
      this.authUser(access_token);
    }
  },
}
</script>

<style></style>

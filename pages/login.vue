<template>
  <div
    class="md:container md:mx-auto min-h-screen flex flex-col justify-center items-center"
  >
    <div>
      <a
        v-show="!asLoadAuth"
        class="bg-purple-600 rounded-lg px-4 py-2 text-white text-base md:text-5xl xs:text-xs"
        :href="getAuthUrl"
        >Twitch Authentication</a
      >
    </div>
  </div>
</template>

<script>
import { getUser as U_getUser } from '@/utils/twitch.js'

export default {
  middleware: null,
  data() {
    return {
      base_url: process.env.NUXT_ENV_API_BASE_URL || null,
      client_id: process.env.NUXT_ENV_API_CLIENT_ID || null,
      redirect_url: process.env.NUXT_ENV_API_REDIRECT_URL || null,
      scopes: process.env.NUXT_ENV_API_SCOPES || '',
      asLoadAuth: true,
    }
  },
  computed: {
    getAccessToken: function () {
      return localStorage.getItem('tw_accessToken') || null
    },
    getAuthUrl: function () {
      if (!(this.client_id || this.redirect_url || this.base_url)) {
        throw new Error('Environement variables empty')
      }

      const params = new URLSearchParams()
      params.append('client_id', this.client_id)
      params.append('redirect_uri', this.redirect_url)
      params.append('response_type', 'token')
      params.append('scope', this.scopes)
      return this.base_url.concat(params)
    },
  },
  methods: {
    authUser(access_token) {
      /**
       * Get twitch user information with Access Token in URL
       */
      U_getUser({
        authToken: access_token,
        clientId: this.client_id,
        $axios: this.$axios,
      })
        .then((response) => {
          if (!response?.data) return
          const userData = response.data[0]
          if (!userData?.login) return

          /**
           * User successful loggedIn
           */
          this.$store.commit('auth/isAuthenticated', true)
          localStorage.setItem('tw_accessToken', access_token)
          this.$store.commit('user/setUser', userData)

          this.$router.push({ name: 'index' })

          this.asLoadAuth = false
        })
        .catch((err) => {
          /**
           * Error when get user informations
           *
           * Delete all data about user login
           */
          console.log(err)
          this.$store.commit('auth/isAuthenticated', false)
          localStorage.removeItem('tw_accessToken')
          this.$store.commit('user/setUser', {})

          this.asLoadAuth = false
        })
    },
  },
  mounted() {
    /**
     * Get Twitch access token on LocalStorage
     */
    const localAccessToken = this.getAccessToken

    /**
     * If - we have a hash in web browers url AND if we have access token
     * Else ...
     */
    if (!window.location.hash && localAccessToken) {
      this.authUser(localAccessToken)
    } else {
      let url = window.location.href.replace('/login#', '?')
      url = new URL(url)

      /**
       * Get Access token in URL
       */
      const urlParams = new URLSearchParams(url.search)
      const access_token = urlParams.get('access_token')
      if (!access_token) {
        this.asLoadAuth = false;
        return;
      }

      this.authUser(access_token)
    }
  },
}
</script>

<style></style>

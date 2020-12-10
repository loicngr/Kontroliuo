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
  data() {
    return {
      base_url: process.env.NUXT_ENV_API_BASE_URL || null,
      client_id: process.env.NUXT_ENV_API_CLIENT_ID || null,
      redirect_url: process.env.NUXT_ENV_API_REDIRECT_URL || null,
      scopes: '',
    }
  },
  computed: {
    getAuthUrl() {
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
        fetch('https://api.twitch.tv/helix/users', {
          headers: {
            Authorization: 'Bearer ' + access_token,
            'Client-Id': this.client_id,
          },
        })
          .then((response) => response.json())
          .then((data) => res(data))
          .catch((err) => rej(err))
      })
    },
  },
  mounted() {
    /**
     * Check URL
     */
    if (!window.location.hash) return;
    let url = window.location.href.replace('/login#', '?');
    url = new URL(url);

    /**
     * Get Access token in URL
     */
    const urlParams = new URLSearchParams(url.search);
    const access_token = urlParams.get('access_token');
    if (!access_token) return;

    /**
     * Get twitch user information with Access Token in URL
     */
    this.getUser(access_token)
      .then((response) => {
        if (!response?.data) return;
        const data = response.data[0];
        const userLogin = data?.login;
        if (!userLogin) return;
        this.$emit('twitchAuthSuccess', userLogin);
        // TODO: Redirect to index page with user information on params
      })
      .catch((err) => console.log(err))
  },
}
</script>

<style></style>

/**
 * Returns all moderators in a channel.
 * @param {{channelId: string, authToken: string, clientId: string, $axios: axios}} param0
 * @returns {Promise} return promise
 */
function getModeratorsByChannelId({ channelId, authToken, clientId, $axios }) {
  return new Promise((res, rej) => {
    $axios
      .$get(
        'https://api.twitch.tv/helix/moderation/moderators?broadcaster_id=' +
          channelId,
        {
          progress: true,
          headers: {
            Authorization: 'Bearer ' + authToken,
            'Client-Id': clientId,
          },
        }
      )
      .then((response) => res(response))
      .catch((err) => rej(err))
  })
}

/**
 * Returns user information
 * @param {{authToken: string, clientId: string, $axios: axios}} param0
 * @returns {Promise} return promise
 */
function getUser({ authToken, clientId, $axios }) {
  return new Promise((res, rej) => {
    $axios
      .$get('https://api.twitch.tv/helix/users', {
        progress: true, // Print nuxt web loader
        headers: {
          Authorization: 'Bearer ' + authToken,
          'Client-Id': clientId,
        },
      })
      .then((response) => res(response))
      .catch((err) => rej(err))
  })
}

export { getModeratorsByChannelId, getUser }

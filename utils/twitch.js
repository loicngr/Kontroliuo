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

/**
 * Returns all user follows
 * @param {{channelId: string, authToken: string, clientId: string, $axios: axios, cursor: null|string}} param0 
 * @returns {Promise} return promise
 */
function getUserFollows({ channelId, authToken, clientId, $axios, cursor, cb }) {
  let url = 'https://api.twitch.tv/helix/users/follows?first=100&from_id=' + channelId;
  url += (cursor)? '&after=' + cursor : '';

  cb = (!cb)? [] : cb;

  return new Promise((res, rej) => {
    $axios
      .$get(url, {
        progress: true,
        headers: {
          Authorization: 'Bearer ' + authToken,
          'Client-Id': clientId,
        },
      })
      .then(async (responseA) => {
        const totalFollows = responseA.data.total;
        let followers = cb.concat(responseA.data.data);
        let afterCursor = responseA.data.pagination.cursor;

        if (followers.length >= totalFollows) return res(followers);
        /**
         * Loop in to twitch api pagination
         */
        const subFollow = await getUserFollows({
          channelId: channelId, 
          authToken: authToken, 
          clientId: clientId, 
          $axios: $axios,
          cursor: afterCursor,
          cb: followers
        });
        return res(subFollow);
      })
      .catch((err) => rej(err));
  });
}

export { getModeratorsByChannelId, getUser, getUserFollows }

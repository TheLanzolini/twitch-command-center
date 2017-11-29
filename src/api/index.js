import { getCurrentState } from '../state'

export const fetchTwitchUser = (token) => {
  const headers = {
    method: 'GET',
    headers: {
      Accept: 'application/vnd.twitchtv.v3+json',
      Authorization: `OAuth ${token}`,
    },
  }
  return fetch('https://api.twitch.tv/kraken/user', headers)
    .then(function(response) {
      return response.json()
    }).catch(function(err) {
      console.log('parsing failed', err)
    })
}
export const fetchStreamsFollowed = (token, page = 0) => {
  const { limit } = getCurrentState()
  const headers = {
    method: 'GET',
    headers: {
      Accept: 'application/vnd.twitchtv.v3+json',
      Authorization: `OAuth ${token}`,
    },
  }
  return fetch(`https://api.twitch.tv/kraken/streams/followed?stream_type=live&limit=${limit}&offset=${page * limit}`, headers)
    .then(function(response) {
      return response.json()
    }).catch(function(err) {
      console.log('parsing failed', err)
    })
}
export const fetchFeaturedStreams = (token, page = 0) => {
  const headers = {
    method: 'GET',
    headers: {
      Accept: 'application/vnd.twitchtv.v3+json',
      Authorization: `OAuth ${token}`,
    },
  }
  const { limit } = getCurrentState()
  return fetch(`https://api.twitch.tv/kraken/streams/featured?limit=${limit}&lang=en&offset=${page * limit}`, headers)
    .then(function(response) {
      return response.json()
    }).catch(function(err) {
      console.log('parsing failed', err)
    })
}

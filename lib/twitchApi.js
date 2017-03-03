const fetchTwitchUser = (token) => {
  return fetch('https://api.twitch.tv/kraken/user', {method: 'GET', headers: { 'Accept': 'application/vnd.twitchtv.v3+json', 'Authorization': 'OAuth '+token }})
    .then(function(response){
      return response.json();
    }).catch(function(err){
      console.log('parsing failed', err);
    });
};
const fetchStreamsFollowed = (token, page = 0, limit = 9) => {
  return fetch(`https://api.twitch.tv/kraken/streams/followed?stream_type=live&limit=${limit}&offset=${page * limit}`, {method: 'GET', headers: { 'Accept': 'application/vnd.twitchtv.v3+json', 'Authorization': 'OAuth '+token }})
    .then(function(response){
      return response.json();
    }).catch(function(err){
      console.log('parsing failed', err);
    });
}
const fetchFeaturedStreams = (token, page = 0, limit = 9) => {
  return fetch(`https://api.twitch.tv/kraken/streams/featured?limit=${limit}&lang=en&offset=${page * limit}`, {method: 'GET', headers: { 'Accept': 'application/vnd.twitchtv.v3+json', 'Authorization': 'OAuth '+token }})
    .then(function(response){
      return response.json();
    }).catch(function(err){
      console.log('parsing failed', err);
    })
}

module.exports = {
  fetchTwitchUser: fetchTwitchUser,
  fetchStreamsFollowed: fetchStreamsFollowed,
  fetchFeaturedStreams: fetchFeaturedStreams
}

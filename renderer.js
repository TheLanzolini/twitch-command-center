const webview = document.getElementById('webview');
const indicator = document.getElementById('indicator');
const twitchApi = require('./lib/twitchApi');
const renderers = require('./lib/renderers');

const onRedirect = (e) => {
  if(e.newURL.includes('http://localhost/#access_token=')){
    token = e.newURL.replace('http://localhost/#access_token=', '').replace('&scope=chat_login+user_read','');
    twitchApi.fetchTwitchUser(token).then(renderers.renderUserBar);
    twitchApi.fetchStreamsFollowed(token).then(renderers.renderFollowedStreams);
    webview.classList.add('hidden');
  }
};


const loadstart = () => {
  indicator.innerText = 'Loading...';
  // SHOW loading icon
};

const loadstop = () => {
  indicator.innerText = '';
  // Hide loading icon
};

webview.addEventListener('did-start-loading', loadstart);
webview.addEventListener('did-stop-loading', loadstop);
webview.addEventListener('did-get-redirect-request', onRedirect);

console.log(Twitch);
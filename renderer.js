const {ipcRenderer} = require('electron');
const webview = document.getElementById('webview');
const indicator = document.getElementById('indicator');
const twitchApi = require('./lib/twitchApi');
const renderers = require('./lib/renderers');

const onRedirect = (e) => {
  if(e.newURL.includes('http://localhost/#access_token=')){
    token = e.newURL.replace('http://localhost/#access_token=', '').replace('&scope=chat_login+user_read','');

    twitchApi.fetchTwitchUser(token).then(renderers.renderUserBar).then(() => {

      let navEnabled = false;
      const navBar = document.querySelector('.user-bar .nav');
      const featured = navBar.querySelector('.featured');
      const following = navBar.querySelector('.following');

      let currentTab = 'following';

      function enableNav(){
        navEnabled = true;
        return Promise.resolve();
      }
      function disableNav(){
        navEnabled = false;
        return Promise.resolve();
      }
      function switchTab(tab){
        currentTab = tab;
        navBar.querySelectorAll('span').forEach(span => span.classList.remove('active'));
        navBar.querySelector(`.${tab}`).classList.add('active');
      }

      // initial grab followed streams
      disableNav().then(() => {
        twitchApi.fetchStreamsFollowed(token).then(renderers.renderStreams).then(enableNav);
      });

      switchTab('following');

      featured.addEventListener('click', function(){
        if(!navEnabled || currentTab == 'featured') return;
        switchTab('featured');
        disableNav().then(renderers.clearContainer).then(() => {
          twitchApi.fetchFeaturedStreams(token).then(renderers.renderStreams).then(enableNav);
        });
      });

      following.addEventListener('click', function(){
        if(!navEnabled || currentTab == 'following') return;
        switchTab('following');
        disableNav().then(renderers.clearContainer).then(() => {
          twitchApi.fetchStreamsFollowed(token).then(renderers.renderStreams).then(enableNav);
        });
      });

      // twitchApi.fetchFeaturedStreams(token).then(renderers.renderStreams);
    });
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

ipcRenderer.on('logout-success', function(){
  window.location.reload();
});

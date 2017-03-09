const {ipcRenderer} = require('electron');
let playerOptions = { width: 600, height: 400 };
let expanded = false;
let players = {
  getPlayer: function(channel){
    return players[channel] ? players[channel] : null;
  }
};
window.players = players;
const container = document.getElementById('container');
const followedContainer = document.createElement('div');
function clearContainer(){
  while (followedContainer.firstChild) {
    followedContainer.removeChild(followedContainer.firstChild);
  }
  let Q = new Promise((resolve, reject) => {
    resolve();
  });
  return Q;
}

function renderLoadingScreen(data){
  const loadingDiv = document.createElement('div');
  loadingDiv.classList.add('overlay-loading');
  const loadingMsg = document.createElement('div');
  loadingMsg.innerHTML = 'Loading all the strems.';
  loadingDiv.appendChild(loadingMsg);
  container.appendChild(loadingDiv);
  return Promise.resolve(data);
}

function removeLoadingScreen(data){
  container.removeChild(container.querySelector('.overlay-loading'));
  return Promise.resolve();
}

function renderUserBar(userData){
  let
    userDiv = document.createElement('div'),
    userBar = document.createElement('div'),
    userAvatar = document.createElement('div'),
    userName = document.createElement('span'),
    navDiv = document.createElement('div'),
    featured = document.createElement('span'),
    following = document.createElement('span'),
    logout = document.createElement('span');
  userBar.classList.add('user-bar');
  userDiv.classList.add('user-wrap');

  navDiv.classList.add('nav');
  featured.innerHTML = 'Featured';
  featured.classList.add('featured');
  following.innerHTML = 'Following';
  following.classList.add('following');
  navDiv.appendChild(following);
  navDiv.appendChild(featured);
  userBar.appendChild(navDiv);

  logout.innerHTML = 'Logout';
  logout.classList.add('logout');
  logout.addEventListener('click', e => {
    ipcRenderer.send('logout')
  });
  userAvatar.classList.add('user-avatar');
  userAvatar.style.backgroundImage = `url('${userData.logo}')`;
  userName.innerHTML = userData.display_name;
  userName.classList.add('user-name');
  userDiv.appendChild(userAvatar);
  userDiv.appendChild(userName);
  userDiv.appendChild(logout);
  userBar.appendChild(userDiv);
  container.appendChild(userBar);
  let Q = new Promise((resolve, reject) => {
    resolve();
  });
  return Q;
}

function renderPageNav(streamData){
  if(container.querySelector('.page-container')){
    container.removeChild(container.querySelector('.page-container'));
  }
  const pageContainer = document.createElement('div');
  pageContainer.classList.add('page-container');

  if(!!streamData._links && !!streamData._links.prev){
    let prev = document.createElement('div');
    prev.classList.add('prev');
    prev.innerHTML = 'Prev';
    prev.addEventListener('click', e => {
      let event = new Event('pagePrev');
      document.dispatchEvent(event);
    });
    pageContainer.appendChild(prev);
  }

  if(!(streamData._total < window.limit)){
    let pageNum = document.createElement('div');
    pageNum.classList.add('page-num');
    pageNum.innerHTML = window.currentPage + 1;
    pageContainer.appendChild(pageNum);
  }


  if(!!streamData._links && !!streamData._links.next && !(streamData._total < window.limit) && (((window.currentPage + 1) * window.limit) < streamData._total)){
    let next = document.createElement('div');
    next.classList.add('next');
    next.innerHTML = 'Next';
    next.addEventListener('click', e => {
      let event = new Event('pageNext');
      document.dispatchEvent(event);
    });
    pageContainer.appendChild(next);
  }

  container.appendChild(pageContainer);
  return Promise.resolve(streamData);
}

function renderStreams(streamData){
  console.log(streamData);
  let
    followedTitle = document.createElement('h1'),
    followedWrapper = document.createElement('div'),
    onFollowed = streamData._links.self.includes('followed');
  followedWrapper.classList.add('player-wrapper');
  followedTitle.classList.add('title');
  followedTitle.innerHTML = onFollowed ? 'FOLLOWED STREAMS' : 'FEATURED STREAMS';
  followedContainer.appendChild(followedTitle);
  followedContainer.appendChild(followedWrapper);
  followedContainer.classList.add('followed-container');
  container.appendChild(followedContainer);
  if((streamData.streams || streamData.featured).length == 0){
    followedWrapper.innerHTML = 'No Followed Streams Online';
    return Promise.resolve([]);
  }else{
    let promises = [];
    (streamData.streams || streamData.featured).forEach(stream => {
      let playerElem = document.createElement('div'),
      buttonBar = document.createElement('div'),
      expandButton = document.createElement('button'),
      streamNameSpan = document.createElement('span'),
      viewerCount,
      iframePlayer;

      // hidding shit
      streamNameSpan.classList.add('channel-name');
      streamNameSpan.classList.add('hidden');
      expandButton.classList.add('hidden');

      playerElem.classList.add('player');
      followedWrapper.appendChild(playerElem);
      playerOptions.channel = stream.channel ? stream.channel.name : stream.stream.channel.name;
      let player = new Twitch.Player(playerElem, playerOptions);
      players[stream.channel ? stream.channel.name : stream.stream.channel.name] = {
        player: player,
        elem: playerElem
      };
      const setHalfVolume = function(){
        player.setVolume('0.5');
      }
      const setNoVolume = function(){
        player.setVolume('0.0');
      }
      const toggleExpand = function(e){
        console.log(e);
        let inBounds = (e.clientY > 100 && e.clientY < 300) || e.target.classList.contains('expand-button');
        if(!inBounds) return;
        if(!expanded){
          renderSpecificStream(stream.channel ? stream.channel.name : stream.stream.channel.name);
          expandButton.innerHTML = 'Collapse';
          expanded = !expanded;
        }else{
          resetSpecificStream(stream.channel ? stream.channel.name : stream.stream.channel.name);
          expandButton.innerHTML = 'Expand';
          expanded = !expanded;
        }
      }
      playerElem.attachMouseListeners = function(){
        playerElem.addEventListener('mouseenter', setHalfVolume);
        playerElem.addEventListener('mouseleave', setNoVolume);
        iframePlayer.addEventListener('click', toggleExpand);
        iframePlayer.style.cursor = 'pointer';
      }
      playerElem.removeMouseListeners = function(){
        playerElem.removeEventListener('mouseenter', setHalfVolume);
        playerElem.removeEventListener('mouseleave', setNoVolume);
        iframePlayer.removeEventListener('click', toggleExpand);
        iframePlayer.style.cursor = 'default';
      }
      let Q = new Promise((resolve, reject) => {
        player.addEventListener('ready', e => {
          iframePlayer = player._bridge._iframe.contentWindow.document.querySelector('.player');
          let qualities = player.getQualities();
          function checkLength(){
            if(qualities.length == 0){
              qualities = player.getQualities();
              setTimeout(checkLength, 5);
            }else{
              player.setQuality(qualities[qualities.length - 2].group);
              playerElem.attachMouseListeners();
              player.setVolume('0.0');
              resolve();
            }
          }
          setTimeout(checkLength, 500);
        });
      });
      promises.push(Q);
      player.addEventListener('ended', e => {
        console.log('STREAM ENDED', players[stream.channel ? stream.channel.name : stream.stream.channel.name]);
        followedWrapper.removeChild(playerElem);
      });
      setInterval(() => {
        if(viewerCount != player._bridge._playerState.viewers){
          viewerCount = player._bridge._playerState.viewers;
          streamNameSpan.innerHTML = `${stream.channel ? stream.channel.name: stream.stream.channel.name} | ${player._bridge._playerState.viewers} Viewers | ${stream.channel ? stream.channel.status : stream.stream.channel.status}`;
        }
      }, 1000);
      expandButton.innerHTML = 'Expand';
      expandButton.classList.add('expand-button');
      expandButton.addEventListener('click', toggleExpand);
      buttonBar.appendChild(streamNameSpan);
      buttonBar.appendChild(expandButton);
      buttonBar.classList.add('button-bar');
      playerElem.appendChild(buttonBar);
    });
    console.log(promises);
    return Promise.all(promises);
  }
}

function renderSpecificStream( channelName ){
  let {elem, player} = players.getPlayer(channelName);
  let chatFrame = document.createElement('iframe');
  let qualities = player.getQualities();
  chatFrame.src = `http://www.twitch.tv/${channelName}/chat`
  chatFrame.id = `chat-${channelName}`;
  elem.querySelector('.channel-name').classList.toggle('hidden');
  elem.querySelector('.expand-button').classList.toggle('hidden');
  elem.appendChild(chatFrame);
  elem.classList.add('specific-view');
  elem.removeMouseListeners();
  player.setVolume('0.5');
  console.log(player);
  // player.setQuality('chunked');
  player.setQuality(qualities[0].group);
  container.classList.toggle('hide-overflow');
}

function resetSpecificStream( channelName ){
  let {elem, player} = players.getPlayer(channelName);
  let chatFrame = document.getElementById(`chat-${channelName}`);
  let qualities = player.getQualities();
  elem.querySelector('.channel-name').classList.toggle('hidden');
  elem.querySelector('.expand-button').classList.toggle('hidden');
  elem.removeChild(chatFrame);
  elem.classList.remove('specific-view');
  elem.attachMouseListeners();
  player.setVolume('0.0');
  // player.setQuality('low');
  player.setQuality(qualities[qualities.length - 2].group);
  container.classList.toggle('hide-overflow');
}


module.exports = {
  renderUserBar: renderUserBar,
  renderStreams: renderStreams,
  clearContainer: clearContainer,
  renderPageNav: renderPageNav,
  renderLoadingScreen: renderLoadingScreen,
  removeLoadingScreen: removeLoadingScreen
}

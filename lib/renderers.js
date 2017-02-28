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
function renderUserBar(userData){
  let
    userDiv = document.createElement('div'),
    userBar = document.createElement('div'),
    userAvatar = document.createElement('div'),
    userName = document.createElement('span'),
    navDiv = document.createElement('div'),
    featured = document.createElement('span'),
    popular = document.createElement('span'),
    logout = document.createElement('span');
  userBar.classList.add('user-bar');
  userDiv.classList.add('user-wrap');

  navDiv.classList.add('nav');
  featured.innerHTML = 'Featured';
  popular.innerHTML = 'Popular';
  navDiv.appendChild(featured);
  navDiv.appendChild(popular);
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

function renderFollowedStreams(streamData){
  let
    followedContainer = document.createElement('div'),
    followedTitle = document.createElement('h1'),
    followedWrapper = document.createElement('div');
  followedWrapper.classList.add('player-wrapper');
  followedTitle.classList.add('title');
  followedTitle.innerHTML = 'FOLLOWED STREAMS';
  followedContainer.appendChild(followedTitle);
  followedContainer.appendChild(followedWrapper);
  container.appendChild(followedContainer);
  if((streamData.streams || streamData.featured).length == 0){
    followedWrapper.innerHTML = 'No Followed Streams Online';
  }else{
    (streamData.streams || streamData.featured).forEach(stream => {
      let playerElem = document.createElement('div'),
      buttonBar = document.createElement('div'),
      expandButton = document.createElement('button'),
      streamNameSpan = document.createElement('span'),
      viewerCount;
      streamNameSpan.classList.add('channel-name');
      playerElem.classList.add('player');
      followedWrapper.appendChild(playerElem);
      playerOptions.channel = stream.channel ? stream.channel.name : stream.title;
      let player = new Twitch.Player(playerElem, playerOptions);
      players[stream.channel ? stream.channel.name : stream.title] = {
        player: player,
        elem: playerElem
      };
      const setHalfVolume = function(){
        player.setVolume('0.5');
      }
      const setNoVolume = function(){
        player.setVolume('0.0');
      }
      playerElem.attachMouseListeners = function(){
        playerElem.addEventListener('mouseenter', setHalfVolume);
        playerElem.addEventListener('mouseleave', setNoVolume);
      }
      playerElem.removeMouseListeners = function(){
        playerElem.removeEventListener('mouseenter', setHalfVolume);
        playerElem.removeEventListener('mouseleave', setNoVolume);
      }
      player.addEventListener('ready', e => {
        player.setQuality('low');
        playerElem.attachMouseListeners();
        player.setVolume('0.0');
      });
      player.addEventListener('ended', e => {
        console.log('STREAM ENDED', players[stream.channel.name]);
        followedWrapper.removeChild(playerElem);
      });
      setInterval(() => {
        if(viewerCount != player._bridge._playerState.viewers){
          viewerCount = player._bridge._playerState.viewers;
          streamNameSpan.innerHTML = `${stream.channel ? stream.channel.name: stream.title} | ${player._bridge._playerState.viewers} Viewers`;
        }
      }, 1000);
      expandButton.innerHTML = 'Expand';
      expandButton.classList.add('expand-button');
      expandButton.addEventListener('click', function(e){
        if(!expanded){
          renderSpecificStream(stream.channel.name);
          expandButton.innerHTML = 'Collapse';
          expanded = !expanded;
        }else{
          resetSpecificStream(stream.channel.name);
          expandButton.innerHTML = 'Expand';
          expanded = !expanded;
        }
      });
      buttonBar.appendChild(streamNameSpan);
      buttonBar.appendChild(expandButton);
      buttonBar.classList.add('button-bar');
      playerElem.appendChild(buttonBar);
    });
  }
}

function renderSpecificStream( channelName ){
  let {elem, player} = players.getPlayer(channelName);
  let chatFrame = document.createElement('iframe');
  let qualities = player.getQualities();
  chatFrame.src = `http://www.twitch.tv/${channelName}/chat`
  chatFrame.id = `chat-${channelName}`;
  elem.appendChild(chatFrame);
  elem.classList.add('specific-view');
  elem.removeMouseListeners();
  player.setVolume('0.5');
  console.log(player);
  player.setQuality('chunked');
  container.classList.toggle('hide-overflow');
}

function resetSpecificStream( channelName ){
  let {elem, player} = players.getPlayer(channelName);
  let chatFrame = document.getElementById(`chat-${channelName}`);
  let qualities = player.getQualities();
  elem.removeChild(chatFrame);
  elem.classList.remove('specific-view');
  elem.attachMouseListeners();
  player.setVolume('0.0');
  if(qualities.includes('low')){
    player.setQuality('low');
  }
  container.classList.toggle('hide-overflow');
}


module.exports = {
  renderUserBar: renderUserBar,
  renderFollowedStreams: renderFollowedStreams
}

const {ipcRenderer} = require('electron');
let playerOptions = { width: 600, height: 400 };
let expanded = false;
let players = {
  getPlayer: function(channel){
    return players[channel] ? players[channel] : null;
  }
};
const container = document.getElementById('container');
function renderUserBar(userData){
  let 
    userBar = document.createElement('div'),
    userAvatar = document.createElement('div'),
    userName = document.createElement('span'),
    logout = document.createElement('button');
  userBar.classList.add('user-bar');
  
  logout.innerHTML = 'Logout';
  logout.classList.add('logout');
  logout.addEventListener('click', e => {
    ipcRenderer.send('logout')
  });
  userAvatar.classList.add('user-avatar');
  userAvatar.style.backgroundImage = `url('${userData.logo}')`;
  userName.innerHTML = userData.display_name;
  userName.classList.add('user-name');
  userBar.appendChild(userAvatar);
  userBar.appendChild(userName);
  userBar.appendChild(logout);
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
  followedTitle.innerHTML = 'Followed Streams';
  followedContainer.appendChild(followedTitle);
  followedContainer.appendChild(followedWrapper);
  container.appendChild(followedContainer);
  if(streamData.streams.length == 0){
    followedWrapper.innerHTML = 'No Followed Streams Online';
  }else{
    streamData.streams.forEach(stream => {
      let playerElem = document.createElement('div'),
      buttonBar = document.createElement('div'),
      expandButton = document.createElement('button');
      playerElem.classList.add('player');
      followedWrapper.appendChild(playerElem);
      playerOptions.channel = stream.channel.name;
      let player = new Twitch.Player(playerElem, playerOptions);
      players[stream.channel.name] = {
        player: player, 
        elem: playerElem
      };
      const setHalfVolume = function(){
        player.setVolume('0.5');
      }
      const setNoVolume = function(){
        player.setVolume('0.0');
      }
      // player.setQuality('low');
      playerElem.attachMouseListeners = function(){
        playerElem.addEventListener('mouseenter', setHalfVolume);
        playerElem.addEventListener('mouseleave', setNoVolume);
      }
      playerElem.removeMouseListeners = function(){
        playerElem.removeEventListener('mouseenter', setHalfVolume);
        playerElem.removeEventListener('mouseleave', setNoVolume);
      }
      playerElem.attachMouseListeners();
      player.setVolume('0.0');
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
      buttonBar.appendChild(expandButton);
      buttonBar.classList.add('button-bar');
      playerElem.appendChild(buttonBar);
    });
  }
}

function renderSpecificStream( channelName ){
  let {elem, player} = players.getPlayer(channelName);
  let chatFrame = document.createElement('iframe');
  chatFrame.src = `http://www.twitch.tv/${channelName}/chat`
  chatFrame.id = `chat-${channelName}`;
  elem.appendChild(chatFrame);
  elem.classList.add('specific-view');
  elem.removeMouseListeners();
  player.setVolume('0.5');
  // player.setQuality('high');
}

function resetSpecificStream( channelName ){
  let {elem, player} = players.getPlayer(channelName);
  let chatFrame = document.getElementById(`chat-${channelName}`);
  elem.removeChild(chatFrame);
  elem.classList.remove('specific-view');
  elem.attachMouseListeners();
  player.setVolume('0.0');
  // player.setQuality('low');
}


module.exports = {
  renderUserBar: renderUserBar,
  renderFollowedStreams: renderFollowedStreams
}
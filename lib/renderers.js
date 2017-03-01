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
  console.log(streamData);
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
      const toggleExpand = function(){
        // console.log('eh?');
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
      player.addEventListener('ready', e => {
        iframePlayer = player._bridge._iframe.contentWindow.document.querySelector('.player');
        let qualities = player.getQualities();
        function checkLength(){
          if(qualities.length == 0){
            qualities = player.getQualities();
            setTimeout(checkLength, 5);
          }else{
            player.setQuality(qualities[qualities.length - 1].group);
            playerElem.attachMouseListeners();
            player.setVolume('0.0');
          }
        }
        setTimeout(checkLength, 500);
      });
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
  console.log(qualities[qualities.length - 1]);
  player.setQuality(qualities[qualities.length - 1].group);
  container.classList.toggle('hide-overflow');
}


module.exports = {
  renderUserBar: renderUserBar,
  renderFollowedStreams: renderFollowedStreams
}

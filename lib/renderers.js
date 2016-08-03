const {ipcRenderer} = require('electron');
let playerOptions = { width: 600, height: 400 };
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
}

function renderFollowedStreams(streamData){
  let 
    followedContainer = document.createElement('div'),
    followedTitle = document.createElement('h1'),
    followedWrapper = document.createElement('div');
  console.log(streamData);
  followedTitle.classList.add('title');
  followedTitle.innerHTML = 'Followed Streams';
  followedContainer.appendChild(followedTitle);
  followedContainer.appendChild(followedWrapper);
  container.appendChild(followedContainer);
  if(streamData.streams.length == 0){
    followedWrapper.innerHTML = 'No Followed Streams Online';
  }else{
    streamData.streams.forEach(stream => {
      var playerElem = document.createElement('div');
      playerElem.classList.add('player');
      playerOptions.channel = stream.channel.name;
      console.log(playerOptions);
      let player = new Twitch.Player(playerElem, playerOptions);
      player.setQuality('low');
      playerElem.addEventListener('mouseenter', e => {
        player.setVolume('0.5');
      });
      playerElem.addEventListener('mouseleave', e => {
        player.setVolume('0.0');
      });
      followedWrapper.appendChild(playerElem);
    });
  }
  
}

module.exports = {
  renderUserBar: renderUserBar,
  renderFollowedStreams: renderFollowedStreams
}
import createEl from '../../utils/createEl'
import * as api from '../../api'
import { getCurrentState } from '../../state'
import { hideLoading, showLoading } from '../../utils/loading'

import './streams.css'


export default (mode = 'followed') => {
  const { token, width, height } = getCurrentState()
  const $streams = createEl('streams')

  showLoading()

  api[mode == 'followed' ? 'fetchStreamsFollowed' : 'fetchFeaturedStreams'](token).then(data => {
    console.log(data)
    const { streams, featured } = data
    const iterableStreams = (streams || featured)
    let sequence = Promise.resolve()
    iterableStreams.forEach(function(stream) {
      sequence = sequence.then(function() {
        const p = new Promise((resolve, reject) => {
          const streamName = stream.channel ? stream.channel.name : stream.stream.channel.name
          const playerEl = createEl('player-element')
          playerEl.id = streamName
          $streams.appendChild(playerEl)
          const newOptions = Object.assign({}, { width, height }, {channel: streamName})
          const player = new Twitch.Player(streamName, newOptions)
          player.addEventListener('ready', e => {
            const iframePlayer = player._bridge._iframe.contentWindow.document.querySelector('.player');
            iframePlayer.style.cursor = 'pointer';
            setTimeout(() => {
              player.setMuted(false)
            }, 1250)
            playerEl.addEventListener('mouseenter', e => {
              player.setVolume(0.5)
            })
            playerEl.addEventListener('mouseleave', e => {
              player.setVolume(0.0)
            })
            iframePlayer.addEventListener('click', e => {
              console.log('click')
            })
            return resolve()
          })
        })
        return p
      })
    })
    sequence.then(function(){
      hideLoading()
    })
  })

  return $streams

}

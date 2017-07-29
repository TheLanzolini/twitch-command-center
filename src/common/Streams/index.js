import createEl from '../../utils/createEl'
import * as api from '../../api'
import { getCurrentState } from '../../state'
import { playerOptions } from '../../constants'
import { hideLoading, showLoading } from '../../utils/loading'

import './streams.css'


export default (mode = 'followed') => {
  const { token } = getCurrentState()
  const $streams = createEl('streams')

  showLoading()

  api[mode == 'followed' ? 'fetchStreamsFollowed' : 'fetchFeaturedStreams'](token).then(data => {
    console.log(data)
    const { streams } = data
    let sequence = Promise.resolve()
    streams.forEach(function(stream) {
      sequence = sequence.then(function() {
        const p = new Promise((resolve, reject) => {
          const playerEl = createEl('player-element')
          playerEl.id = stream.channel.name
          $streams.appendChild(playerEl)
          const newOptions = Object.assign({}, playerOptions, {channel: stream.channel.name})
          const player = new Twitch.Player(stream.channel.name, newOptions)
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

import createEl from '../../utils/createEl'
import getMain from '../../utils/getMain'
import { showLoading, hideLoading } from '../../utils/loading'
import { go, updateToken, getCurrentState } from '../../state'

import './login.css'

export default () => {
  const $main = getMain()
  const $webview = createEl('webview', 'webview')
  const onRedirect = (e) => {
    // console.log(e)
    if (e.newURL.includes('http://localhost/#access_token=')) {
      const token = e.newURL.replace('http://localhost/#access_token=', '').replace('&scope=chat_login+user_read','')
      updateToken(token)
      hideLoading()
      go('Settings')
    }
  }

  if (window.process.env.CLIENT_ID === undefined) {
    throw new Error('No process.env.CLIENT_ID found, set CLIENT_ID in your process.')
  }

  $webview.src = `https://api.twitch.tv/kraken/oauth2/authorize?response_type=token&client_id=${window.process.env.CLIENT_ID}&redirect_uri=http%3A%2F%2Flocalhost&scope=chat_login+user_read`
  $main.appendChild($webview)

  $webview.addEventListener('did-start-loading', showLoading)
  $webview.addEventListener('did-stop-loading', hideLoading)
  $webview.addEventListener('did-get-redirect-request', onRedirect)

}

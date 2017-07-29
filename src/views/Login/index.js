import createEl from '../../utils/createEl'
import getMain from '../../utils/getMain'
import { showLoading, hideLoading } from '../../utils/loading'

import './login.css'

export default () => {
  const $main = getMain()
  const $webview = createEl('webview', 'webview');
  $webview.src = `https://api.twitch.tv/kraken/oauth2/authorize?response_type=token&client_id=ssjvsik4e2jvz2qvhvyu2tcp4suc0v&redirect_uri=http%3A%2F%2Flocalhost&scope=chat_login+user_read`
  $main.appendChild($webview);

  // $webview.addEventListener('did-start-loading', showLoading);
  // $webview.addEventListener('did-stop-loading', hideLoading);
  // $webview.addEventListener('did-get-redirect-request', onRedirect);

}

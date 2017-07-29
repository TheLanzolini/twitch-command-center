import createEl from '../../utils/createEl'
import { fetchTwitchUser } from '../../api'
import { getCurrentState } from '../../state'

import './userbar.css'

export default () => {
  const { token } = getCurrentState()
  const $userBar = createEl('user-bar')
  const $userProfile = createEl('user-profile')
  const $userAvatar = createEl('user-avatar', 'img')
  const $userName = createEl('user-name')
  const $logout = createEl('logout', 'div', 'Logout')
  $logout.addEventListener('click', e => {
    console.log('clicked logout')
  })

  $userProfile.append($userAvatar, $userName, $logout)
  $userBar.appendChild($userProfile)


  fetchTwitchUser(token).then(data => {
    console.log(data)
    const { logo, display_name } = data
    $userAvatar.src = logo
    $userName.innerHTML = display_name
  })

  return $userBar
}

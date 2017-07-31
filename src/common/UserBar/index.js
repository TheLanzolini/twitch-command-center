import createEl from '../../utils/createEl'
import { fetchTwitchUser } from '../../api'
import { getCurrentState, go } from '../../state'

import './userbar.css'

export default () => {
  const { token } = getCurrentState()
  const $userBar = createEl('user-bar')

  const $followedTab = createEl('followed-tab tab', 'div', 'Followed')
  $followedTab.addEventListener('click', e => {
    go('Followed')
  })
  const $featuredTab = createEl('featured-tab tab', 'div', 'Featured')
  $featuredTab.addEventListener('click', e => {
    go('Featured')
  })
  const $settingsTab = createEl('settings-tab tab', 'div', 'Settings')
  $settingsTab.addEventListener('click', e => {
    go('Settings')
  })
  const $tabsWrapper = createEl('tabs-wrapper')
  $tabsWrapper.append($followedTab, $featuredTab, $settingsTab)

  const $userProfile = createEl('user-profile')
  const $userAvatar = createEl('user-avatar', 'img')
  const $userName = createEl('user-name')
  const $logout = createEl('logout', 'div', 'Logout')

  $logout.addEventListener('click', e => {
    console.log('clicked logout')
  })

  $userProfile.append($userAvatar, $userName, $logout)
  $userBar.append($tabsWrapper, $userProfile)


  fetchTwitchUser(token).then(data => {
    const { logo, display_name } = data
    $userAvatar.src = logo
    $userName.innerHTML = display_name
  })

  return $userBar
}

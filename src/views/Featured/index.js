import { getCurrentState } from '../../state'
import getMain from '../../utils/getMain'
import $userBar from '../../common/UserBar'
import $streams from '../../common/Streams'

export default () => {
  const { token } = getCurrentState()
  const $main = getMain()
  $main.appendChild($userBar())
  $main.appendChild($streams('featured'))
}

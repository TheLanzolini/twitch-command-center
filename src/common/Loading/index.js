import createEl from '../../utils/createEl'

import './Loading.css'

const $loadingIndicator = createEl('loading-indicator')
$loadingIndicator.innerHTML = 'Loading...'

export default $loadingIndicator

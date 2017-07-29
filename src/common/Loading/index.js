import createEl from '../../utils/createEl'

import './Loading.css'

const $loadingIndicator = createEl('loading-indicator')
$loadingIndicator.classList.add('hidden')
const $loadingText = createEl('loading-text')
const $spans = ('Loading...').split('').map(char => createEl('loading-char', 'span', char)).forEach((span, index) => {
  span.style.animationDelay = `${index * 0.1}s`
  $loadingText.appendChild(span)
})

$loadingIndicator.appendChild($loadingText)

export default $loadingIndicator

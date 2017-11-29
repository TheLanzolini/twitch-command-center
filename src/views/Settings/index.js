import { getCurrentState, updateLimit, updateWidth, updateHeight } from '../../state'
import getMain from '../../utils/getMain'
import $userBar from '../../common/UserBar'
import createEl from '../../utils/createEl'

import './settings.css'

const limitMax = 20
const limitMin = 1
const widthMax = 1000
const widthMin = 150
const heightMax = 1000
const heightMin = 150

export default () => {
  const { token, limit, width, height } = getCurrentState()
  const $main = getMain()
  $main.appendChild($userBar())

  const $settingsWrapper = createEl('settings-wrapper')
  const $title = createEl('settings-title', 'h1', 'Settings')
  const $settings = createEl('settings')

  const $limitWrapper = createEl('limit-wrapper')
  const $limitLabel = createEl('limit-label', 'label', 'Limit')
  $limitLabel.setAttribute('for', 'limit-input')
  const $limitInput = createEl('limit-input', 'input')
  $limitInput.id = 'limit-input'
  $limitInput.setAttribute('type', 'number')
  $limitInput.setAttribute('min', '1')
  $limitInput.setAttribute('max', '12')
  $limitInput.value = limit
  $limitInput.addEventListener('change', e => {
    if (e.target.value > limitMax) {
      $limitInput.value = limitMax
    }
    if (e.target.value < limitMin) {
      $limitInput.value = limitMin
    }
    updateLimit(e.target.value > limitMax ? limitMax : e.target.value < limitMin ? limitMin : e.target.value)
  })
  $limitWrapper.append($limitLabel, $limitInput)

  const $widthWrapper = createEl('width-wrapper')
  const $widthLabel = createEl('width-label', 'label', 'Width')
  $widthLabel.setAttribute('for', 'width-input')
  const $widthInput = createEl('width-input', 'input')
  $widthInput.id = 'width-input'
  $widthInput.setAttribute('step', '50')
  $widthInput.setAttribute('type', 'number')
  $widthInput.setAttribute('min', '150')
  $widthInput.setAttribute('max', '1000')
  $widthInput.value = width
  $widthInput.addEventListener('change', e => {
    if (e.target.value > widthMax) {
      $widthInput.value = widthMax
    }
    if (e.target.value < widthMin) {
      $widthInput.value = widthMin
    }
    updateWidth(e.target.value > widthMax ? widthMax : e.target.value < widthMin ? widthMin : e.target.value)
  })
  $widthWrapper.append($widthLabel, $widthInput)

  const $heightWrapper = createEl('height-wrapper')
  const $heightLabel = createEl('height-label', 'label', 'Height')
  $heightLabel.setAttribute('for', 'height-input')
  const $heightInput = createEl('height-input', 'input')
  $heightInput.id = 'height-input'
  $heightInput.setAttribute('step', '50')
  $heightInput.setAttribute('type', 'number')
  $heightInput.setAttribute('min', '150')
  $heightInput.setAttribute('max', '1000')
  $heightInput.value = height
  $heightInput.addEventListener('change', e => {
    if (e.target.value > heightMax) {
      $heightInput.value = heightMax
    }
    if (e.target.value < heightMin) {
      $heightInput.value = heightMin
    }
    updateHeight(e.target.value > heightMax ? heightMax : e.target.value < heightMin ? heightMin : e.target.value)
  })
  $heightWrapper.append($heightLabel, $heightInput)

  $settings.append($title, $limitWrapper, $widthWrapper, $heightWrapper)
  $settingsWrapper.append($settings)
  $main.append($settingsWrapper)
}

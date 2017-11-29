// polyfills
import append from './utils/append'

// imports
import createEl from './utils/createEl'
import { init } from './state'
import $loadingIndicator from './common/Loading'

import './App.css'

document.body.appendChild(createEl('main'))
document.body.appendChild($loadingIndicator)

init()

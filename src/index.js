import React from 'react'
import { render } from 'react-dom'
import { AppContainer } from 'react-hot-loader'

import App from './components/App'
import './styles/screen.sass'

const root = document.getElementById('root')

render(
  <AppContainer>
    <App />
  </AppContainer>,
  root
)

if (module.hot) {
  module.hot.accept('./components/App', () => {
    const NextApp = require('./components/App').default

    render(
      <AppContainer>
        <NextApp />
      </AppContainer>,
      root
    )
  })
}

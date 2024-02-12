import React from 'react'
import { AppLayout } from './containers/Layout'
import { AppNavigator } from './containers/Navigator/AppNavigator'
import { ThemeProvider } from 'styled-components'
import { theme } from './ui-kit/theme'
import { BrowserRouter } from 'react-router-dom'

function App(): JSX.Element {
  return (
    <BrowserRouter>
      <ThemeProvider theme={theme}>
        <AppLayout>
          <AppNavigator />
        </AppLayout>
      </ThemeProvider>
    </BrowserRouter>
  )
}

export default App

import React from 'react'
import { AppLayout } from './containers/Layout'
import { AppNavigator } from './containers/Navigator/AppNavigator'
import { ThemeProvider } from 'styled-components'
import { theme } from './ui-kit/theme'

function App(): JSX.Element {
  return (
    <ThemeProvider theme={theme}>
      <AppLayout>
        <AppNavigator />
      </AppLayout>
    </ThemeProvider>
  )
}

export default App

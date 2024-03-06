import { AppLayout } from './containers/Layout'
import { AppNavigator } from './containers/Navigator/AppNavigator'
import { ThemeProvider } from 'styled-components'
import { theme } from './ui-kit/theme'
import { BrowserRouter } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'

const queryClient = new QueryClient()
function App(): JSX.Element {
  return (
    <BrowserRouter>
      <ThemeProvider theme={theme}>
        <QueryClientProvider client={queryClient}>
          <AppLayout>
            <AppNavigator />
          </AppLayout>
        </QueryClientProvider>
      </ThemeProvider>
    </BrowserRouter>
  )
}

export default App

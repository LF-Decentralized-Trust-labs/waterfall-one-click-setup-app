import { AppLayout } from './containers/Layout'
import { AppNavigator } from './containers/Navigator/AppNavigator'
import { ThemeProvider } from 'styled-components'
import { theme } from './ui-kit/theme'
import { HashRouter } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false
    }
  }
})
function App(): JSX.Element {
  return (
    <HashRouter>
      <ThemeProvider theme={theme}>
        <QueryClientProvider client={queryClient}>
          <AppLayout>
            <AppNavigator />
          </AppLayout>
        </QueryClientProvider>
      </ThemeProvider>
    </HashRouter>
  )
}

export default App

import './styles/globals.css'
import Home from './pages/Home'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'

const queryClient = new QueryClient()

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <div className="dark">
        <Home />
      </div>
    </QueryClientProvider>
  )
}

export default App
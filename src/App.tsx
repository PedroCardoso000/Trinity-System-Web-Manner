import './App.css'
import AppRouter from './routes/AppRouter'
import { AuthProvider } from './contexts/AuthProvider'

function App() {
  return (
    <AuthProvider>
      <AppRouter />
    </AuthProvider>
  )
}

export default App

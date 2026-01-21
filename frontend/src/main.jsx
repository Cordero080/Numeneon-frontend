import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './styles/main.scss'
import App from './App.jsx'
// Context Providers
import { AuthProvider } from './contexts/AuthContext'
import { PostsProvider } from './contexts/PostsContext'
import { FriendsProvider } from './contexts/FriendsContext'
import { SearchProvider } from './contexts/SearchContext'

createRoot(document.getElementById('root')).render(
   <StrictMode>
    <AuthProvider>        {/* Must be first - other contexts may need auth */}
      <PostsProvider>
        <FriendsProvider>
          <SearchProvider>
            <App />       {/* App and all children can now access all contexts */}
          </SearchProvider>
        </FriendsProvider>
      </PostsProvider>
    </AuthProvider>
  </StrictMode>,
)

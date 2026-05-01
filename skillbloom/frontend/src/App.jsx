import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { AuthProvider } from './contexts/AuthContext'
import ProtectedRoute from './components/ProtectedRoute'
import Home from './pages/Home'
import Register from './pages/Register'
import Login from './pages/Login'
import Feed from './pages/Feed'
import Dashboard from './pages/Dashboard'
import CreatePost from './pages/CreatePost'
import Profile from './pages/Profile'
import Search from './pages/Search'
import toast, { Toaster } from 'react-hot-toast'

function App() {
  return (
    <Router>
      <AuthProvider>
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-purple-50 to-indigo-100">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/register" element={<Register />} />
            <Route path="/login" element={<Login />} />
            <Route path="/feed" element={<ProtectedRoute><Feed /></ProtectedRoute>} />
            <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
            <Route path="/create-post" element={<ProtectedRoute><CreatePost /></ProtectedRoute>} />
            <Route path="/profile/:id?" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
            <Route path="/search" element={<Search />} />
            <Route path="*" element={<Home />} />
          </Routes>
          <Toaster />
        </div>
      </AuthProvider>
    </Router>
  )
}

export default App


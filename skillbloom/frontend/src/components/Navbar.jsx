import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { BellIcon, MagnifyingGlassIcon, PlusIcon } from '@heroicons/react/24/outline'

const Navbar = () => {
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  return (
    <nav className="glass shadow-xl sticky top-0 z-50 px-6 py-4">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <Link to="/" className="text-2xl font-bold bg-gradient-to-r from-primary-600 to-primary-700 bg-clip-text text-transparent">
          SkillBloom
        </Link>
        
        <div className="flex items-center space-x-4">
          {!user ? (
            <>
              <Link to="/login" className="btn-primary text-sm px-4 py-2">
                Login
              </Link>
              <Link to="/register" className="bg-white text-primary-600 font-semibold px-6 py-2 rounded-xl shadow-lg hover:shadow-xl transition-all">
                Get Started
              </Link>
            </>
          ) : (
            <>
              <button className="p-2 hover:bg-white/20 rounded-xl transition">
                <MagnifyingGlassIcon className="w-6 h-6" />
              </button>
              <Link to="/feed" className="px-4 py-2 font-medium text-primary-700 hover:bg-white/20 rounded-xl">
                Feed
              </Link>
              <Link to="/dashboard" className="px-4 py-2 font-medium text-primary-700 hover:bg-white/20 rounded-xl">
                Dashboard
              </Link>
              <Link to="/create-post" className="flex items-center space-x-2 bg-gradient-to-r from-primary-500 to-primary-600 text-white px-4 py-2 rounded-xl shadow-lg hover:shadow-xl">
                <PlusIcon className="w-5 h-5" />
                <span>Post</span>
              </Link>
              <button 
                onClick={logout}
                className="px-4 py-2 font-medium text-gray-600 hover:text-primary-600 hover:bg-white/20 rounded-xl transition"
              >
                Logout
              </button>
            </>
          )}
        </div>
      </div>
    </nav>
  )
}

export default Navbar


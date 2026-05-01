import { useState, useEffect, useCallback } from 'react'
import { Link } from 'react-router-dom'
import axios from 'axios'
import ProtectedRoute from '../components/ProtectedRoute'
import Navbar from '../components/Navbar'

const Search = () => {
  const [query, setQuery] = useState('')
  const [profiles, setProfiles] = useState([])
  const [filters, setFilters] = useState({ role: '', city: '' })
  const [loading, setLoading] = useState(false)
  const [activeTab, setActiveTab] = useState('profiles')

  const searchProfiles = useCallback(async (searchQuery = query, currentFilters = filters) => {
    if (!searchQuery && !currentFilters.role && !currentFilters.city) return
    
    setLoading(true)
    try {
      const params = new URLSearchParams()
      if (searchQuery) params.append('name', searchQuery)
      if (currentFilters.role) params.append('role', currentFilters.role)
      if (currentFilters.city) params.append('city', currentFilters.city)

      const res = await axios.get(`/profiles?${params}`)
      setProfiles(res.data)
    } catch (error) {
      console.error('Search failed', error)
    } finally {
      setLoading(false)
    }
  }, [query, filters])

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      searchProfiles()
    }, 300)
    return () => clearTimeout(timeoutId)
  }, [query, filters, searchProfiles])

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-purple-50/50 to-indigo-100">
      <Navbar />
      
      <div className="max-w-6xl mx-auto px-6 py-12">
        {/* Search Header */}
        <div className="text-center mb-16">
          <h1 className="text-5xl font-bold bg-gradient-to-r from-gray-900 via-primary-600 to-primary-700 bg-clip-text text-transparent mb-6">
            Find Talent
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto mb-12">
            Search students and businesses near your campus
          </p>
          
          {/* Main Search */}
          <div className="max-w-2xl mx-auto">
            <div className="glass shadow-2xl p-1 rounded-2xl mb-8">
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search by name, skills..."
                className="w-full bg-white px-6 py-4 rounded-xl text-lg outline-none focus:ring-2 ring-primary-500"
              />
            </div>

            {/* Filters */}
            <div className="glass p-4 rounded-2xl flex flex-wrap gap-3 justify-center">
              <select
                value={filters.role}
                onChange={(e) => setFilters({...filters, role: e.target.value})}
                className="px-4 py-2 bg-white rounded-xl border border-gray-200 focus:ring-2 ring-primary-500 focus:border-transparent"
              >
                <option value="">All Roles</option>
                <option value="student">Students</option>
                <option value="business">Businesses</option>
              </select>
              
              <input
                value={filters.city}
                onChange={(e) => setFilters({...filters, city: e.target.value})}
                placeholder="City..."
                className="px-4 py-2 bg-white rounded-xl border border-gray-200 focus:ring-2 ring-primary-500 min-w-[140px]"
              />
            </div>
          </div>
        </div>

        {/* Results */}
        <div className="space-y-8">
          {loading && (
            <div className="text-center py-16">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4"></div>
              <p className="text-lg text-gray-600">Searching...</p>
            </div>
          )}

          {profiles.length === 0 && !loading && query && (
            <div className="text-center py-24 glass p-12 rounded-3xl">
              <div className="text-6xl mb-6 opacity-40">🔍</div>
              <h3 className="text-2xl font-bold mb-4 text-gray-700">
                No results found
              </h3>
              <p className="text-gray-600 mb-8 max-w-md mx-auto">
                Try different keywords or filters
              </p>
            </div>
          )}

          <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {profiles.map((profile) => (
              <Link 
                key={profile._id} 
                to={`/profile/${profile._id}`}
                className="card group hover:shadow-xl transition-all overflow-hidden h-80"
              >
                <div className="h-48 overflow-hidden bg-gradient-to-br from-gray-100 to-gray-200 group-hover:scale-105 transition-transform duration-300">
                  <img 
                    src={profile.profileImage} 
                    alt={profile.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="p-6">
                  <div className="flex items-center mb-3">
                    <div className={`px-3 py-1 rounded-full text-xs font-bold ${
                      profile.role === 'student' 
                        ? 'bg-gradient-to-r from-emerald-500 to-emerald-600 text-white' 
                        : 'bg-gradient-to-r from-primary-500 to-primary-600 text-white'
                    }`}>
                      {profile.role.toUpperCase()}
                    </div>
                    {profile.city && (
                      <span className="ml-auto text-sm text-gray-500">{profile.city}</span>
                    )}
                  </div>
                  
                  <h3 className="font-bold text-lg mb-2 line-clamp-1 group-hover:text-primary-600 transition">
                    {profile.name}
                  </h3>
                  
                  <p className="text-sm text-gray-600 line-clamp-2 mb-4">
                    {profile.bio?.substring(0, 100)}...
                  </p>

                  {profile.skills && profile.skills.length > 0 && (
                    <div className="flex flex-wrap gap-2 mb-4">
                      {profile.skills.slice(0, 3).map(skill => (
                        <span key={skill} className="px-2 py-1 bg-gray-100 text-xs rounded-md font-medium text-gray-800">
                          {skill}
                        </span>
                      ))}
                      {profile.skills.length > 3 && (
                        <span className="px-2 py-1 text-xs text-gray-500">+{profile.skills.length - 3}</span>
                      )}
                    </div>
                  )}
                  
                  <div className="flex items-center justify-between pt-2 border-t border-gray-100 mt-4 opacity-0 group-hover:opacity-100 transition-all duration-200">
                    <span className="text-xs text-gray-500">★ 4.9</span>
                    <Link 
                      to={`/profile/${profile._id}`}
                      className="text-primary-600 text-sm font-semibold hover:text-primary-700"
                    >
                      View Profile →
                    </Link>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

export default Search


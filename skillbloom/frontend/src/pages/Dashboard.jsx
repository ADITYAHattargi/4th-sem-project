import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import axios from 'axios'
import ProtectedRoute from '../components/ProtectedRoute'
import { toast } from 'react-hot-toast'

const Dashboard = () => {
  const { user } = useAuth()
  const navigate = useNavigate()
  const [myPosts, setMyPosts] = useState([])
  const [applications, setApplications] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadDashboardData()
  }, [])

  const loadDashboardData = async () => {
    try {
      const [postsRes, appsRes] = await Promise.all([
        axios.get('/posts?userId=' + user._id),
        axios.get('/apply/my-applications')
      ])
      setMyPosts(postsRes.data)
      setApplications(appsRes.data)
    } catch (error) {
      toast.error('Failed to load dashboard')
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <ProtectedRoute>
        <div className="min-h-screen flex items-center justify-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-primary-600"></div>
        </div>
      </ProtectedRoute>
    )
  }

  return (
    <ProtectedRoute>
      <div className="max-w-6xl mx-auto px-6 py-8">
        <div className="flex flex-col lg:flex-row gap-8 mb-12">
          {/* Profile Card */}
          <div className="card p-8 flex-shrink-0 w-full lg:w-80">
            <div className="text-center mb-8">
              <img 
                src={user.profileImage} 
                alt={user.name}
                className="w-28 h-28 rounded-full mx-auto ring-4 ring-primary-500/20 object-cover mb-4 shadow-lg"
              />
              <h2 className="text-2xl font-bold text-gray-900 mb-2">{user.name}</h2>
              <div className="inline-flex bg-gradient-to-r from-primary-500 to-primary-600 text-white px-4 py-1 rounded-full text-sm font-semibold mb-4">
                {user.role.toUpperCase()}
              </div>
              {user.city && <p className="text-gray-600">{user.city}</p>}
            </div>

            <div className="space-y-4">
              <Link to="/profile" className="w-full btn-primary py-3 flex items-center justify-center">
                Edit Profile
              </Link>
              {user.role === 'student' && (
                <Link to="/search" className="w-full glass py-3 flex items-center justify-center hover:bg-white/20">
                  🔍 Find Gigs
                </Link>
              )}
              {user.role === 'business' && (
                <Link to="/create-post" className="w-full glass py-3 flex items-center justify-center hover:bg-white/20">
                  🆕 New Job Post
                </Link>
              )}
            </div>
          </div>

          {/* Main Content */}
          <div className="flex-1 space-y-8">
            {/* Quick Stats */}
            <div className="grid md:grid-cols-3 gap-6">
              <div className="card p-6 text-center">
                <div className="text-3xl font-bold text-primary-600 mb-2">{myPosts.length}</div>
                <div className="text-gray-600">Posts</div>
              </div>
              <div className="card p-6 text-center">
                <div className="text-3xl font-bold text-emerald-600 mb-2">{applications.length}</div>
                <div className="text-gray-600">
                  {user.role === 'student' ? 'Applications' : 'Applicants'}
                </div>
              </div>
              <div className="card p-6 text-center">
                <div className="text-3xl font-bold text-blue-600 mb-2">Pro</div>
                <div className="text-gray-600">Member</div>
              </div>
            </div>

            {/* Recent Activity */}
            <div className="grid md:grid-cols-2 gap-6">
              {/* Recent Posts */}
              <div>
                <h3 className="text-xl font-bold mb-6 flex items-center">
                  Recent Posts
                  <Link to="/create-post" className="ml-auto text-sm text-primary-600 hover:text-primary-700 font-semibold">
                    + New
                  </Link>
                </h3>
                <div className="space-y-4">
                  {myPosts.slice(0, 3).map(post => (
                    <div key={post._id} className="glass p-4 rounded-xl border hover:bg-white/20">
                      <div className="flex items-start space-x-3">
                        {post.media && (
                          <img src={post.media} alt="" className="w-16 h-16 rounded-lg object-cover flex-shrink-0" />
                        )}
                        <div className="flex-1 min-w-0">
                          <p className="font-medium truncate">{post.caption || 'Media post'}</p>
                          <p className="text-sm text-gray-500">{new Date(post.createdAt).toLocaleDateString()}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                  {myPosts.length === 0 && (
                    <div className="text-center py-12 text-gray-500">
                      No posts yet. <Link to="/create-post" className="text-primary-600 hover:underline font-semibold">Create one</Link>
                    </div>
                  )}
                </div>
              </div>

              {/* Recent Applications */}
              <div>
                <h3 className="text-xl font-bold mb-6">
                  Recent {user.role === 'student' ? 'Applications' : 'Applicants'}
                </h3>
                <div className="space-y-4">
                  {applications.slice(0, 3).map(app => (
                    <div key={app._id} className="glass p-4 rounded-xl border hover:bg-white/20">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <img src={app.student?.profileImage || 'https://via.placeholder.com/40'} alt="" className="w-10 h-10 rounded-full" />
                          <div className="min-w-0 flex-1">
                            <p className="font-medium truncate">{app.student?.name || app.businessName}</p>
                            <p className="text-sm text-gray-500 truncate">{app.coverLetter || app.status}</p>
                          </div>
                        </div>
                        <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                          app.status === 'accepted' ? 'bg-emerald-100 text-emerald-800' :
                          app.status === 'rejected' ? 'bg-red-100 text-red-800' :
                          'bg-yellow-100 text-yellow-800'
                        }`}>
                          {app.status}
                        </span>
                      </div>
                    </div>
                  ))}
                  {applications.length === 0 && (
                    <div className="text-center py-12 text-gray-500">
                      {user.role === 'student' ? 'No applications yet' : 'No applicants yet'}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  )
}

export default Dashboard


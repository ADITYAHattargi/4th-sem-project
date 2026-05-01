import { useState, useEffect } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import axios from 'axios'
import ProtectedRoute from '../components/ProtectedRoute'
import { toast } from 'react-hot-toast'

const Profile = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const { user: currentUser } = useAuth()
  const [profile, setProfile] = useState(null)
  const [posts, setPosts] = useState([])
  const [loading, setLoading] = useState(true)
  const [editing, setEditing] = useState(false)
  const [updateData, setUpdateData] = useState({})

  const isOwnProfile = currentUser && (!id || id === currentUser._id)

  useEffect(() => {
    loadProfile()
  }, [id])

  const loadProfile = async () => {
    try {
      const [profileRes, postsRes] = await Promise.all([
        axios.get(`/profiles/${id || currentUser._id}`),
        axios.get('/posts')
      ])
      setProfile(profileRes.data)
      setPosts(postsRes.data.filter(p => p.user._id === (id || currentUser._id)))
    } catch (error) {
      toast.error('Failed to load profile')
    } finally {
      setLoading(false)
    }
  }

  const handleUpdate = async (e) => {
    e.preventDefault()
    try {
      await axios.put('/profiles', updateData)
      toast.success('Profile updated')
      setEditing(false)
      loadProfile()
    } catch (error) {
      toast.error('Update failed')
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
      <div className="max-w-4xl mx-auto px-6 py-8">
        {/* Profile Header */}
        <div className="text-center mb-16">
          <div className="relative mb-8">
            <img 
              src={profile.profileImage} 
              alt={profile.name}
              className="w-32 h-32 rounded-full mx-auto ring-8 ring-white shadow-2xl object-cover border-4 border-white"
            />
          </div>
          
          <div className="space-y-2 mb-8">
            <h1 className="text-4xl font-bold text-gray-900">{profile.name}</h1>
            <div className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-primary-500 to-primary-600 text-white rounded-full text-lg font-semibold">
              <span>{profile.role.toUpperCase()}</span>
              {profile.city && (
                <>
                  <span className="w-4 h-4 bg-white rounded-full mx-2 opacity-60"></span>
                  <span>{profile.city}</span>
                </>
              )}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            {isOwnProfile && (
              <button 
                onClick={() => setEditing(!editing)}
                className="glass px-8 py-3 font-semibold rounded-xl hover:bg-white/30 transition"
              >
                {editing ? 'Cancel' : 'Edit Profile'}
              </button>
            )}
            {profile.role === 'business' && (
              <Link 
                to={`/profile/${profile._id}`}
                className="btn-primary px-8 py-3 font-semibold"
              >
                View Applications
              </Link>
            )}
          </div>
        </div>

        {/* Edit Form */}
        {editing && isOwnProfile && (
          <form onSubmit={handleUpdate} className="card p-8 mb-12 max-w-2xl mx-auto">
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label className="block font-semibold mb-2">Bio</label>
                <textarea
                  value={updateData.bio || profile.bio || ''}
                  onChange={(e) => setUpdateData({ ...updateData, bio: e.target.value })}
                  className="w-full p-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary-500"
                  rows="3"
                  placeholder="Tell us about yourself..."
                />
              </div>
              <div>
                <label className="block font-semibold mb-2">Skills</label>
                <input
                  value={updateData.skills || profile.skills?.join(', ') || ''}
                  onChange={(e) => setUpdateData({ ...updateData, skills: e.target.value.split(',').map(s => s.trim()) })}
                  className="w-full p-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary-500"
                  placeholder="JavaScript, React, Design"
                />
              </div>
              {profile.role === 'business' && (
                <>
                  <div>
                    <label className="block font-semibold mb-2">Shop Type</label>
                    <input className="w-full p-4 border rounded-xl focus:ring-2 focus:ring-primary-500" />
                  </div>
                  <div>
                    <label className="block font-semibold mb-2">Location</label>
                    <input className="w-full p-4 border rounded-xl focus:ring-2 focus:ring-primary-500" />
                  </div>
                </>
              )}
            </div>
            <button type="submit" className="mt-8 btn-primary px-12 py-4 text-lg w-full">
              Save Changes
            </button>
          </form>
        )}

        {/* Bio & Skills */}
        <div className="grid md:grid-cols-2 gap-12 mb-16">
          <div className="space-y-6">
            <div>
              <h3 className="text-xl font-bold mb-4 flex items-center">
                About
                <span className="ml-2 px-2 py-1 bg-primary-100 text-primary-800 text-xs rounded-full font-semibold">
                  {profile.role}
                </span>
              </h3>
              <p className="text-lg leading-relaxed text-gray-700">
                {profile.bio || 'No bio yet. Add one to stand out!'}
              </p>
            </div>
            
            {profile.skills && profile.skills.length > 0 && (
              <div>
                <h3 className="text-xl font-bold mb-4">Skills</h3>
                <div className="flex flex-wrap gap-2">
                  {profile.skills.map((skill, index) => (
                    <span key={index} className="px-4 py-2 bg-gradient-to-r from-primary-500 to-primary-600 text-white text-sm rounded-full font-medium shadow">
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 gap-4">
            <div className="card p-6 text-center">
              <div className="text-3xl font-bold text-primary-600 mb-1">{posts.length}</div>
              <div className="text-gray-600 font-medium">Posts</div>
            </div>
            <div className="card p-6 text-center">
              <div className="text-3xl font-bold text-emerald-600 mb-1">47</div>
              <div className="text-gray-600 font-medium">Followers</div>
            </div>
            <div className="card p-6 text-center">
              <div className="text-3xl font-bold text-blue-600 mb-1">12</div>
              <div className="text-gray-600 font-medium">Applications</div>
            </div>
            <div className="card p-6 text-center">
              <div className="text-3xl font-bold text-purple-600 mb-1">★4.9</div>
              <div className="text-gray-600 font-medium">Rating</div>
            </div>
          </div>
        </div>

        {/* Posts Grid */}
        <div>
          <h3 className="text-2xl font-bold mb-8">
            Posts ({posts.length})
          </h3>
          <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-6">
            {posts.length === 0 ? (
              <div className="col-span-full text-center py-24 glass p-12 rounded-3xl">
                <div className="text-6xl mb-6 opacity-50">📷</div>
                <h3 className="text-2xl font-bold mb-4 text-gray-700">
                  No posts yet
                </h3>
                <Link to="/create-post" className="btn-primary px-8 py-3 inline-flex items-center">
                  Create your first post
                </Link>
              </div>
            ) : (
              posts.slice(0, 9).map(post => (
                <div key={post._id} className="group cursor-pointer overflow-hidden rounded-2xl shadow-lg hover:shadow-2xl hover:-translate-y-2 transition-all duration-300">
                  <div className="aspect-video overflow-hidden">
                    {post.mediaType === 'video' ? (
                      <video src={post.media} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                    ) : (
                      <img src={post.media} alt="" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                    )}
                  </div>
                  <div className="p-6 bg-gradient-to-t from-black/20 to-transparent">
                    <p className="font-semibold text-white text-lg mb-2 line-clamp-2">
                      {post.caption}
                    </p>
                    <div className="flex items-center text-xs text-white/80">
                      <span>{new Date(post.createdAt).toLocaleDateString()}</span>
                      <span className="w-1 h-1 mx-2 bg-white/50 rounded-full"></span>
                      <span>12 likes</span>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </ProtectedRoute>
  )
}

export default Profile


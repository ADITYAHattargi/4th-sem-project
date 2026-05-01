import { useState, useEffect, useCallback } from 'react'
import { Link } from 'react-router-dom'
import axios from 'axios'
import { toast } from 'react-hot-toast'
import ProtectedRoute from '../components/ProtectedRoute'

const Feed = () => {
  const [posts, setPosts] = useState([])
  const [loading, setLoading] = useState(true)
  const [page, setPage] = useState(1)
  const [hasMore, setHasMore] = useState(true)

  const fetchPosts = useCallback(async (pageNum = 1) => {
    try {
      const res = await axios.get(`/posts?page=${pageNum}&limit=10`)
      if (pageNum === 1) {
        setPosts(res.data)
      } else {
        setPosts(prev => [...prev, ...res.data])
      }
      setHasMore(res.data.length === 10)
    } catch (error) {
      toast.error('Failed to load posts')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchPosts(1)
  }, [fetchPosts])

  const handleScroll = () => {
    if (window.innerHeight + document.documentElement.scrollTop !== document.documentElement.offsetHeight || loading || !hasMore) return
    
    setPage(prev => {
      fetchPosts(prev + 1)
      return prev + 1
    })
  }

  useEffect(() => {
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [loading, hasMore])

  if (loading && posts.length === 0) {
    return (
      <ProtectedRoute>
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-primary-600 mx-auto mb-4"></div>
            <p className="text-xl text-gray-600">Loading your feed...</p>
          </div>
        </div>
      </ProtectedRoute>
    )
  }

  return (
    <ProtectedRoute>
      <div className="max-w-2xl mx-auto px-4 py-8 space-y-6">
        <h1 className="text-3xl font-bold text-gray-900">Feed</h1>
        
        {posts.length === 0 ? (
          <div className="text-center py-24 glass p-12 rounded-3xl">
            <div className="text-6xl mb-6">📱</div>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              No posts yet
            </h2>
            <Link to="/create-post" className="btn-primary px-8 py-4 text-lg">
              Create your first post
            </Link>
          </div>
        ) : (
          posts.map(post => (
            <div key={post._id} className="card p-6 hover:shadow-2xl transition-all group">
              <div className="flex items-center space-x-4 mb-4">
                <Link to={`/profile/${post.user._id}`}>
                  <img 
                    src={post.user.profileImage} 
                    alt={post.user.name}
                    className="w-12 h-12 rounded-full ring-2 ring-primary-500/20 object-cover"
                  />
                </Link>
                <div>
                  <Link to={`/profile/${post.user._id}`} className="font-semibold text-gray-900 hover:text-primary-600">
                    {post.user.name}
                  </Link>
                  <p className="text-sm text-gray-500">{post.user.role} • {post.user.city}</p>
                </div>
              </div>

              {post.media && (
                <div className="mb-4 rounded-2xl overflow-hidden shadow-lg group-hover:scale-[1.02] transition-transform duration-300">
                  {post.mediaType === 'video' ? (
                    <video src={post.media} controls className="w-full aspect-video">
                      Your browser does not support video.
                    </video>
                  ) : (
                    <img src={post.media} alt="Post" className="w-full aspect-video object-cover" />
                  )}
                </div>
              )}

              <div className="space-y-2 mb-6">
                <p className="text-lg leading-relaxed">{post.caption}</p>
                {post.jobTitle && (
                  <div className="bg-gradient-to-r from-emerald-50 to-blue-50 p-4 rounded-xl border">
                    <h4 className="font-semibold text-lg mb-2">{post.jobTitle}</h4>
                    {post.requirements && (
                      <ul className="space-y-1">
                        {post.requirements.map((req, i) => (
                          <li key={i} className="text-sm text-emerald-800">• {req}</li>
                        ))}
                      </ul>
                    )}
                    {post.payRange && <p className="mt-2 font-semibold text-emerald-700">💰 {post.payRange}</p>}
                  </div>
                )}
              </div>

              <div className="flex items-center justify-between pt-4 border-t">
                <div className="flex space-x-6 text-gray-500">
                  <button className="flex items-center space-x-1 hover:text-red-500 p-2 -m-2 rounded-xl hover:bg-red-50">
                    <span>❤️</span><span>12</span>
                  </button>
                  <button className="flex items-center space-x-1 hover:text-blue-500 p-2 -m-2 rounded-xl hover:bg-blue-50">
                    <span>💬</span><span>3</span>
                  </button>
                  {post.jobTitle && (
                    <Link 
                      to={`/profile/${post.user._id}`}
                      className="btn-primary px-6 py-2 text-sm font-semibold"
                    >
                      Apply Now
                    </Link>
                  )}
                </div>
                <p className="text-sm text-gray-500">{new Date(post.createdAt).toLocaleString()}</p>
              </div>
            </div>
          ))
        )}

        {loading && (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading more posts...</p>
          </div>
        )}
      </div>
    </ProtectedRoute>
  )
}

export default Feed


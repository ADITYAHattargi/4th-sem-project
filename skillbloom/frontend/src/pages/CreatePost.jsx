import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import axios from 'axios'
import ProtectedRoute from '../components/ProtectedRoute'
import { toast } from 'react-hot-toast'
import { PlusIcon, VideoCameraIcon, PhotoIcon } from '@heroicons/react/24/outline'

const CreatePost = () => {
  const navigate = useNavigate()
  const { user } = useAuth()
  const [loading, setLoading] = useState(false)
  const [preview, setPreview] = useState(null)
  const [file, setFile] = useState(null)

  const [formData, setFormData] = useState({
    caption: '',
    jobTitle: '',
    requirements: '',
    payRange: '',
    highlight: ''
  })

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0]
    if (selectedFile) {
      setFile(selectedFile)
      const url = URL.createObjectURL(selectedFile)
      setPreview(url)

      if (selectedFile.size > 10 * 1024 * 1024) {
        toast.error('File too large (max 10MB)')
        return
      }
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!file) {
      toast.error('Please select media')
      return
    }

    setLoading(true)
    const data = new FormData()
    data.append('media', file)
    Object.keys(formData).forEach(key => {
      if (formData[key]) data.append(key, formData[key])
    })

    try {
      await axios.post('/posts', data, {
        headers: { 'Content-Type': 'multipart/form-data' }
      })
      toast.success('Post created!')
      navigate('/feed')
    } catch (error) {
      toast.error(error.response?.data?.error || 'Failed to create post')
    } finally {
      setLoading(false)
    }
  }

  return (
    <ProtectedRoute>
      <div className="max-w-2xl mx-auto px-4 py-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-gray-900 to-primary-700 bg-clip-text text-transparent mb-4">
            Create Post
          </h1>
          <p className="text-xl text-gray-600 max-w-md mx-auto">
            Share opportunities or showcase your work
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Media Upload */}
          <div className="card p-8 text-center">
            <div className="mb-8">
              <label className="flex items-center justify-center w-24 h-24 bg-gradient-to-br from-gray-100 to-gray-200 rounded-2xl border-2 border-dashed border-gray-300 cursor-pointer hover:border-primary-400 mx-auto mb-4 hover:shadow-lg transition-all group">
                {preview ? (
                  <img src={preview} alt="Preview" className="w-full h-full rounded-xl object-cover" />
                ) : (
                  <>
                    <div className="text-2xl group-hover:text-primary-600 transition">
                      <PlusIcon className="w-12 h-12" />
                    </div>
                    <p className="text-xs font-medium text-gray-600 group-hover:text-primary-600">Media</p>
                  </>
                )}
                <input 
                  type="file" 
                  accept="image/*,video/*" 
                  onChange={handleFileChange}
                  className="hidden"
                />
              </label>
            </div>
            <p className="text-sm text-gray-500">PNG, JPG, MP4 up to 10MB</p>
          </div>

          {/* Caption */}
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-3">
              What's happening?
            </label>
            <textarea
              value={formData.caption}
              onChange={(e) => setFormData({...formData, caption: e.target.value})}
              rows="3"
              className="w-full px-4 py-3 border border-gray-300 rounded-xl resize-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition shadow-sm"
              placeholder="Write a caption..."
              maxLength="1000"
            />
            <p className="text-xs text-gray-500 mt-1">{formData.caption.length}/1000</p>
          </div>

          {/* Business Job Details */}
          {user.role === 'business' && (
            <div className="space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">
                    Job Title
                  </label>
                  <input
                    value={formData.jobTitle}
                    onChange={(e) => setFormData({...formData, jobTitle: e.target.value})}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary-500"
                    placeholder="e.g. Social Media Manager"
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">
                    Pay Range
                  </label>
                  <input
                    value={formData.payRange}
                    onChange={(e) => setFormData({...formData, payRange: e.target.value})}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary-500"
                    placeholder="₹500 - ₹2000/day"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">
                  Requirements (comma separated)
                </label>
                <input
                  value={formData.requirements}
                  onChange={(e) => setFormData({...formData, requirements: e.target.value})}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary-500"
                  placeholder="Canva, Instagram, Communication"
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">
                  Hiring Highlight
                </label>
                <input
                  value={formData.highlight}
                  onChange={(e) => setFormData({...formData, highlight: e.target.value})}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary-500"
                  placeholder="e.g. 'Urgent - Start Tomorrow!'"
                  maxLength="100"
                />
              </div>
            </div>
          )}

          <button 
            type="submit"
            disabled={loading || !file}
            className={`w-full py-4 text-lg font-bold rounded-xl shadow-xl transition-all duration-200 transform ${
              loading || !file 
                ? 'bg-gray-400 cursor-not-allowed' 
                : 'btn-primary hover:shadow-2xl hover:-translate-y-1'
            }`}
          >
            {loading ? (
              <>
                <svg className="animate-spin -ml-1 mr-3 h-6 w-6 inline" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Creating Post...
              </>
            ) : 'Create Post'}
          </button>
        </form>

        <div className="text-center">
          <Link to="/feed" className="text-primary-600 hover:text-primary-700 font-semibold">
            ← Back to Feed
          </Link>
        </div>
      </div>
    </ProtectedRoute>
  )
}

export default CreatePost


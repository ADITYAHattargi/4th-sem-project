import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import Navbar from '../components/Navbar'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'

const schema = z.object({
  name: z.string().min(2, 'Name too short'),
  email: z.string().email('Invalid email'),
  password: z.string().min(6, 'Password min 6 chars'),
  role: z.enum(['student', 'business']),
  city: z.string().optional(),
  skills: z.array(z.string()).optional(),
}).refine(data => data.role === 'student' || (data.role === 'business' && data.city), {
  message: 'Business needs city',
  path: ['city']
})

const Register = () => {
  const navigate = useNavigate()
  const { register: authRegister } = useAuth()
  const [loading, setLoading] = useState(false)
  const [role, setRole] = useState('student')

  const { register, handleSubmit, formState: { errors }, watch } = useForm({
    resolver: zodResolver(schema)
  })

  const watchedRole = watch('role')

  const onSubmit = async (data) => {
    setLoading(true)
    try {
      await authRegister({
        ...data,
        skills: data.skills || []
      })
      navigate('/dashboard')
    } catch (error) {
      // Error handled in context
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center py-12 px-4">
      <Navbar />
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-bold text-gray-900">
            Create Account
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Join SkillBloom today
          </p>
        </div>
        <form className="card p-8 space-y-6" onSubmit={handleSubmit(onSubmit)}>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Role *
            </label>
            <select 
              {...register('role')}
              onChange={(e) => setRole(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            >
              <option value="student">🎓 Student</option>
              <option value="business">🏢 Business</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Full Name *
            </label>
            <input 
              {...register('name')}
              type="text" 
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent transition"
              placeholder="John Doe"
            />
            {errors.name && <p className="mt-1 text-sm text-red-600">{errors.name.message}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Email *
            </label>
            <input 
              {...register('email')}
              type="email" 
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              placeholder="john@example.com"
            />
            {errors.email && <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Password *
            </label>
            <input 
              {...register('password')}
              type="password" 
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              placeholder="••••••••"
            />
            {errors.password && <p className="mt-1 text-sm text-red-600">{errors.password.message}</p>}
          </div>

          {role === 'student' && (
            <>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  City
                </label>
                <input 
                  {...register('city')}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary-500"
                  placeholder="Your city"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Skills (comma separated)
                </label>
                <input 
                  {...register('skills')}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary-500"
                  placeholder="JavaScript, React, Design"
                />
              </div>
            </>
          )}

          <button 
            type="submit" 
            disabled={loading}
            className="w-full btn-primary py-3 text-lg font-semibold"
          >
            {loading ? 'Creating...' : 'Create Account'}
          </button>
          
          <div className="text-center">
            <p className="text-sm text-gray-600">
              Already have an account?{' '}
              <button 
                onClick={() => navigate('/login')}
                className="font-semibold text-primary-600 hover:text-primary-700"
              >
                Sign in
              </button>
            </p>
          </div>
        </form>
      </div>
    </div>
  )
}

export default Register


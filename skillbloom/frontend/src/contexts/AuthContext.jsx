import React, { createContext, useContext, useReducer, useEffect } from 'react'
import axios from 'axios'
import { toast } from 'react-hot-toast'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api'

const AuthContext = createContext()

const authReducer = (state, action) => {
  switch (action.type) {
    case 'LOGIN':
      return { ...state, user: action.payload, token: action.payload.token }
    case 'LOGOUT':
      return { user: null, token: null }
    case 'LOAD_USER':
      return { ...state, user: action.payload }
    default:
      return state
  }
}

export const AuthProvider = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, { user: null, token: null })

  // Axios defaults
  axios.defaults.baseURL = API_URL
  axios.defaults.headers.common['Authorization'] = state.token ? `Bearer ${state.token}` : ''

  // Load user on mount
  useEffect(() => {
    const token = localStorage.getItem('token')
    if (token) {
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`
      loadUser(token)
    }
  }, [])

  const loadUser = async (token) => {
    try {
      const res = await axios.get('/auth/me')
      dispatch({ type: 'LOAD_USER', payload: res.data })
      localStorage.setItem('token', token)
    } catch (error) {
      localStorage.removeItem('token')
      dispatch({ type: 'LOGOUT' })
    }
  }

  const login = async (email, password) => {
    try {
      const res = await axios.post('/auth/login', { email, password })
      dispatch({ type: 'LOGIN', payload: res.data })
      localStorage.setItem('token', res.data.token)
      toast.success('Welcome back!')
      return res.data
    } catch (error) {
      toast.error(error.response?.data?.error || 'Login failed')
      throw error
    }
  }

  const register = async (userData) => {
    try {
      const res = await axios.post('/auth/register', userData)
      dispatch({ type: 'LOGIN', payload: res.data })
      localStorage.setItem('token', res.data.token)
      toast.success('Account created!')
      return res.data
    } catch (error) {
      toast.error(error.response?.data?.error || 'Registration failed')
      throw error
    }
  }

  const logout = () => {
    dispatch({ type: 'LOGOUT' })
    localStorage.removeItem('token')
    delete axios.defaults.headers.common['Authorization']
    toast.success('Logged out')
  }

  return (
    <AuthContext.Provider value={{
      user: state.user,
      token: state.token,
      login,
      register,
      logout,
      loading: !state.user && state.token
    }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) throw new Error('useAuth must be used within AuthProvider')
  return context
}


import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { useEffect } from 'react'

export default function Landing() {
  const navigate = useNavigate()
  const { isAuthenticated } = useAuth()

  // If already logged in, skip landing and go straight to dashboard
  useEffect(() => {
    if (isAuthenticated) {
      navigate('/dashboard')
    }
  }, [])

  return (
    <div className="min-h-screen bg-gray-950 flex flex-col items-center justify-center px-4 text-center">

      {/* Badge */}
      <div className="mb-6 px-3 py-1 bg-blue-500/10 border border-blue-500/30 rounded-full text-blue-400 text-xs font-medium">
        Free to get started · No credit card required
      </div>

      {/* Headline */}
      <h1 className="text-5xl font-bold text-white mb-4 leading-tight max-w-2xl">
        Track every internship application in one place
      </h1>

      {/* Subheadline */}
      <p className="text-gray-400 text-lg mb-10 max-w-xl">
        Log applications, track interviews, and stay organized throughout
        your internship search — built by a student, for students.
      </p>

      {/* CTA Buttons */}
      <div className="flex items-center gap-4">
        <button
          onClick={() => navigate('/register')}
          className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition text-sm"
        >
          Get started for free
        </button>
        <button
          onClick={() => navigate('/login')}
          className="px-6 py-3 bg-gray-800 hover:bg-gray-700 text-white font-semibold rounded-lg transition text-sm border border-gray-700"
        >
          Sign in
        </button>
      </div>

      {/* Social proof */}
      <p className="text-gray-600 text-xs mt-10">
        Free up to 30 applications · Upgrade for unlimited
      </p>

    </div>
  )
}

import { useState } from 'react'
import api from '../api/axios'

export default function FeedbackModal({ onClose }) {
  const [type, setType] = useState('BUG_REPORT')
  const [message, setMessage] = useState('')
  const [loading, setLoading] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [error, setError] = useState(null)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    try {
      await api.post('/feedback', { type, message })
      setSubmitted(true)
    } catch (err) {
      setError('Failed to submit feedback. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 px-4">
      <div className="bg-gray-900 border border-gray-800 rounded-2xl p-8 max-w-md w-full shadow-2xl">

        {submitted ? (
          <div className="text-center">
            <div className="text-4xl mb-4">🙏</div>
            <h2 className="text-xl font-bold text-white mb-2">Thanks for your feedback!</h2>
            <p className="text-gray-400 mb-6">We read every submission and use it to improve the app.</p>
            <button
              onClick={onClose}
              className="w-full py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition"
            >
              Close
            </button>
          </div>
        ) : (
          <>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-white">Share Feedback</h2>
              <button
                onClick={onClose}
                className="text-gray-500 hover:text-white transition text-xl leading-none"
              >
                ×
              </button>
            </div>

            {error && (
              <div className="mb-4 p-3 bg-red-500/10 border border-red-500/30 rounded-lg text-red-400 text-sm">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs text-gray-400 mb-1">Type</label>
                <select
                  value={type}
                  onChange={e => setType(e.target.value)}
                  className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white text-sm focus:outline-none focus:border-blue-500 transition appearance-none cursor-pointer"
                >
                  <option value="BUG_REPORT" className="bg-gray-800">🐛 Bug Report</option>
                  <option value="FEATURE_REQUEST" className="bg-gray-800">💡 Feature Request</option>
                </select>
              </div>

              <div>
                <label className="block text-xs text-gray-400 mb-1">Message</label>
                <textarea
                  required
                  value={message}
                  onChange={e => setMessage(e.target.value)}
                  placeholder={
                    type === 'BUG_REPORT'
                      ? 'Describe what happened and how to reproduce it...'
                      : 'Describe the feature you\'d like to see...'
                  }
                  rows={5}
                  className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white text-sm placeholder-gray-500 focus:outline-none focus:border-blue-500 transition resize-none"
                />
              </div>

              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={onClose}
                  className="flex-1 py-2.5 text-gray-400 hover:text-white border border-gray-700 rounded-lg text-sm transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading || !message.trim()}
                  className="flex-1 py-2.5 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-800 disabled:cursor-not-allowed text-white font-semibold rounded-lg text-sm transition"
                >
                  {loading ? 'Submitting...' : 'Submit'}
                </button>
              </div>
            </form>
          </>
        )}
      </div>
    </div>
  )
}
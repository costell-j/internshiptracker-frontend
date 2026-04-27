import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import api from '../api/axios'
import FeedbackModal from '../components/FeedbackModal'

const INTERACTION_TYPES = ['NOTE', 'EMAIL', 'PHONE_SCREEN', 'INTERVIEW', 'OFFER', 'REJECTION']

const TYPE_COLORS = {
  NOTE: 'bg-gray-500/10 text-gray-400 border-gray-500/30',
  EMAIL: 'bg-blue-500/10 text-blue-400 border-blue-500/30',
  PHONE_SCREEN: 'bg-purple-500/10 text-purple-400 border-purple-500/30',
  INTERVIEW: 'bg-yellow-500/10 text-yellow-400 border-yellow-500/30',
  OFFER: 'bg-green-500/10 text-green-400 border-green-500/30',
  REJECTION: 'bg-red-500/10 text-red-400 border-red-500/30'
}

const TYPE_ICONS = {
  NOTE: '📝',
  EMAIL: '📧',
  PHONE_SCREEN: '📞',
  INTERVIEW: '🎯',
  OFFER: '🎉',
  REJECTION: '❌'
}

export default function ApplicationDetail() {
  const { id } = useParams()
  const navigate = useNavigate()

  const [application, setApplication] = useState(null)
  const [interactions, setInteractions] = useState([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [showFeedback, setShowFeedback] = useState(false)
  const [error, setError] = useState(null)

  const [form, setForm] = useState({
    type: 'NOTE',
    notes: '',
    occurredAt: new Date().toISOString().slice(0, 16)
  })

  useEffect(() => {
    fetchAll()
  }, [id])

  const fetchAll = async () => {
    try {
      const [appRes, interactionRes] = await Promise.all([
        api.get(`/applications/${id}`),
        api.get(`/applications/${id}/interactions`)
      ])
      setApplication(appRes.data)
      setInteractions(interactionRes.data)
    } catch (err) {
      setError('Failed to load application')
    } finally {
      setLoading(false)
    }
  }

  const handleCreate = async (e) => {
    e.preventDefault()
    try {
      await api.post(`/applications/${id}/interactions`, {
        ...form,
        occurredAt: form.occurredAt + ':00'
      })
      setForm({
        type: 'NOTE',
        notes: '',
        occurredAt: new Date().toISOString().slice(0, 16)
      })
      setShowForm(false)
      fetchAll()
    } catch (err) {
      setError('Failed to save interaction')
    }
  }

  const handleDelete = async (interactionId) => {
    if (!confirm('Delete this interaction?')) return
    try {
      await api.delete(`/applications/${id}/interactions/${interactionId}`)
      fetchAll()
    } catch (err) {
      setError('Failed to delete interaction')
    }
  }

  const formatDate = (dateStr) => {
    return new Date(dateStr).toLocaleDateString('en-US', {
      month: 'short', day: 'numeric', year: 'numeric',
      hour: '2-digit', minute: '2-digit'
    })
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-950 flex items-center justify-center">
        <div className="text-gray-500">Loading...</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-950 text-white">

      {showFeedback && <FeedbackModal onClose={() => setShowFeedback(false)} />}

      {/* Navbar */}
      <nav className="border-b border-gray-800 bg-gray-900 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate('/dashboard')}
            className="text-gray-400 hover:text-white transition text-sm flex items-center gap-1"
          >
            ← Back
          </button>
          <h1 className="text-xl font-bold text-white">Internship Tracker</h1>
        </div>
        <button
          onClick={() => setShowFeedback(true)}
          className="text-sm text-gray-400 hover:text-white transition"
        >
          Feedback
        </button>
      </nav>

      <div className="max-w-3xl mx-auto px-6 py-8">

        {/* Application header */}
        {application && (
          <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6 mb-8">
            <div className="flex items-start justify-between">
              <div>
                <h2 className="text-2xl font-bold text-white">
                  {application.company?.name}
                </h2>
                <p className="text-gray-400 mt-1">{application.role}</p>
                {application.company?.location && (
                  <p className="text-gray-500 text-sm mt-0.5">
                    {application.company.location}
                  </p>
                )}
              </div>
              <span className="text-xs px-3 py-1 rounded-full border font-medium bg-blue-500/10 text-blue-400 border-blue-500/30">
                {application.status}
              </span>
            </div>
            {application.notes && (
              <p className="text-gray-400 text-sm mt-4 pt-4 border-t border-gray-800">
                {application.notes}
              </p>
            )}
          </div>
        )}

        {/* Error */}
        {error && (
          <div className="mb-4 p-3 bg-red-500/10 border border-red-500/30 rounded-lg text-red-400 text-sm">
            {error}
          </div>
        )}

        {/* Timeline header */}
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-white font-semibold">
            Timeline{' '}
            <span className="text-gray-500 font-normal text-sm">
              ({interactions.length})
            </span>
          </h3>
          <button
            onClick={() => setShowForm(!showForm)}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold rounded-lg transition"
          >
            {showForm ? 'Cancel' : '+ Log Interaction'}
          </button>
        </div>

        {/* Interaction form */}
        {showForm && (
          <form onSubmit={handleCreate} className="bg-gray-900 border border-gray-800 rounded-2xl p-6 mb-6 space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs text-gray-400 mb-1">Type</label>
                <select
                  value={form.type}
                  onChange={e => setForm({ ...form, type: e.target.value })}
                  className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white text-sm focus:outline-none focus:border-blue-500 transition appearance-none cursor-pointer"
                >
                  {INTERACTION_TYPES.map(t => (
                    <option key={t} value={t} className="bg-gray-800">
                      {t.charAt(0) + t.slice(1).toLowerCase().replace('_', ' ')}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-xs text-gray-400 mb-1">Date & Time</label>
                <input
                  type="datetime-local"
                  value={form.occurredAt}
                  onChange={e => setForm({ ...form, occurredAt: e.target.value })}
                  className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white text-sm focus:outline-none focus:border-blue-500 transition"
                />
              </div>
            </div>
            <div>
              <label className="block text-xs text-gray-400 mb-1">Notes</label>
              <textarea
                value={form.notes}
                onChange={e => setForm({ ...form, notes: e.target.value })}
                placeholder="What happened? Any details to remember..."
                rows={3}
                className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white text-sm placeholder-gray-500 focus:outline-none focus:border-blue-500 transition resize-none"
              />
            </div>
            <button
              type="submit"
              className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold rounded-lg transition"
            >
              Save Interaction
            </button>
          </form>
        )}

        {/* Timeline */}
        {interactions.length === 0 ? (
          <div className="text-center text-gray-500 py-16 bg-gray-900 border border-gray-800 rounded-2xl">
            No interactions yet. Log your first one above.
          </div>
        ) : (
          <div className="space-y-3">
            {interactions.map((interaction, index) => (
              <div key={interaction.id} className="flex gap-4">
                <div className="flex flex-col items-center">
                  <div className="w-8 h-8 rounded-full bg-gray-800 border border-gray-700 flex items-center justify-center text-sm flex-shrink-0">
                    {TYPE_ICONS[interaction.type]}
                  </div>
                  {index < interactions.length - 1 && (
                    <div className="w-px flex-1 bg-gray-800 mt-2" />
                  )}
                </div>
                <div className="flex-1 pb-6">
                  <div className="bg-gray-900 border border-gray-800 rounded-xl p-4 hover:border-gray-700 transition">
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className={`text-xs px-2 py-0.5 rounded-full border font-medium ${TYPE_COLORS[interaction.type]}`}>
                            {interaction.type.replace('_', ' ')}
                          </span>
                          <span className="text-xs text-gray-500">
                            {formatDate(interaction.occurredAt)}
                          </span>
                        </div>
                        {interaction.notes && (
                          <p className="text-gray-300 text-sm mt-2">
                            {interaction.notes}
                          </p>
                        )}
                      </div>
                      <button
                        onClick={() => handleDelete(interaction.id)}
                        className="text-gray-600 hover:text-red-400 transition text-lg leading-none flex-shrink-0"
                      >
                        ×
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
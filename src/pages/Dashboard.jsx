import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import api from '../api/axios'

const STATUS_COLORS = {
  APPLIED: 'bg-blue-500/10 text-blue-400 border-blue-500/30',
  INTERVIEWING: 'bg-yellow-500/10 text-yellow-400 border-yellow-500/30',
  OFFER: 'bg-green-500/10 text-green-400 border-green-500/30',
  REJECTED: 'bg-red-500/10 text-red-400 border-red-500/30',
  ACCEPTED: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
}

const STATUSES = ['APPLIED', 'INTERVIEWING', 'OFFER', 'REJECTED', 'ACCEPTED']

export default function Dashboard() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const [applications, setApplications] = useState([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [error, setError] = useState(null)

  const [form, setForm] = useState({
    company: { name: '', website: '', industry: '', location: '' },
    role: '',
    status: 'APPLIED',
    location: '',
    appliedDate: '',
    notes: ''
  })

  useEffect(() => {
    fetchApplications()
  }, [])

  const fetchApplications = async () => {
    try {
      const res = await api.get('/applications?sortBy=appliedDate')
      setApplications(res.data.content)
    } catch (err) {
      setError('Failed to load applications')
    } finally {
      setLoading(false)
    }
  }

  const handleCreate = async (e) => {
    e.preventDefault()
    try {
      await api.post('/applications', form)
      setShowForm(false)
      setForm({
        company: { name: '', website: '', industry: '', location: '' },
        role: '',
        status: 'APPLIED',
        location: '',
        appliedDate: '',
        notes: ''
      })
      fetchApplications()
    } catch (err) {
      setError('Failed to create application')
    }
  }

  const handleStatusChange = async (e, id, status) => {
    e.stopPropagation()
    try {
      await api.put(`/applications/${id}/status?status=${status}`)
      fetchApplications()
    } catch (err) {
      setError('Failed to update status')
    }
  }

  const handleDelete = async (e, id) => {
    e.stopPropagation()
    if (!confirm('Delete this application?')) return
    try {
      await api.delete(`/applications/${id}`)
      fetchApplications()
    } catch (err) {
      setError('Failed to delete application')
    }
  }

  return (
    <div className="min-h-screen bg-gray-950 text-white">

      {/* Navbar */}
      <nav className="border-b border-gray-800 bg-gray-900 px-6 py-4 flex items-center justify-between">
        <h1 className="text-xl font-bold text-white">Internship Tracker</h1>
        <div className="flex items-center gap-4">
          <span className="text-gray-400 text-sm">{user?.email}</span>
          <button
            onClick={logout}
            className="text-sm text-gray-400 hover:text-white transition"
          >
            Sign out
          </button>
        </div>
      </nav>

      <div className="max-w-5xl mx-auto px-6 py-8">

        {/* Stats bar */}
        <div className="grid grid-cols-5 gap-3 mb-8">
          {STATUSES.map(status => (
            <div key={status} className="bg-gray-900 border border-gray-800 rounded-xl p-4 text-center">
              <div className="text-2xl font-bold text-white">
                {applications.filter(a => a.status === status).length}
              </div>
              <div className="text-xs text-gray-400 mt-1 capitalize">
                {status.toLowerCase()}
              </div>
            </div>
          ))}
        </div>

        {/* Header row */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-semibold text-white">
            Applications{' '}
            <span className="text-gray-500 font-normal text-base">
              ({applications.length})
            </span>
          </h2>
          <button
            onClick={() => setShowForm(!showForm)}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold rounded-lg transition"
          >
            {showForm ? 'Cancel' : '+ Add Application'}
          </button>
        </div>

        {/* Error */}
        {error && (
          <div className="mb-4 p-3 bg-red-500/10 border border-red-500/30 rounded-lg text-red-400 text-sm">
            {error}
          </div>
        )}

        {/* Create form */}
        {showForm && (
          <form onSubmit={handleCreate} className="bg-gray-900 border border-gray-800 rounded-2xl p-6 mb-6 space-y-4">
            <h3 className="text-white font-semibold text-base mb-2">New Application</h3>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs text-gray-400 mb-1">Company Name *</label>
                <input
                  required
                  value={form.company.name}
                  onChange={e => setForm({ ...form, company: { ...form.company, name: e.target.value } })}
                  placeholder="Google"
                  className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white text-sm placeholder-gray-500 focus:outline-none focus:border-blue-500 transition"
                />
              </div>
              <div>
                <label className="block text-xs text-gray-400 mb-1">Role *</label>
                <input
                  required
                  value={form.role}
                  onChange={e => setForm({ ...form, role: e.target.value })}
                  placeholder="Software Engineer Intern"
                  className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white text-sm placeholder-gray-500 focus:outline-none focus:border-blue-500 transition"
                />
              </div>
              <div>
                <label className="block text-xs text-gray-400 mb-1">Industry</label>
                <input
                  value={form.company.industry}
                  onChange={e => setForm({ ...form, company: { ...form.company, industry: e.target.value } })}
                  placeholder="Technology"
                  className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white text-sm placeholder-gray-500 focus:outline-none focus:border-blue-500 transition"
                />
              </div>
              <div>
                <label className="block text-xs text-gray-400 mb-1">Company Location</label>
                <input
                  value={form.company.location}
                  onChange={e => setForm({ ...form, company: { ...form.company, location: e.target.value } })}
                  placeholder="Mountain View, CA"
                  className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white text-sm placeholder-gray-500 focus:outline-none focus:border-blue-500 transition"
                />
              </div>
              <div>
                <label className="block text-xs text-gray-400 mb-1">Status</label>
                <select
                  value={form.status}
                  onChange={e => setForm({ ...form, status: e.target.value })}
                  className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white text-sm focus:outline-none focus:border-blue-500 transition appearance-none cursor-pointer"
                >
                  {STATUSES.map(s => (
                    <option key={s} value={s} className="bg-gray-800 text-white">
                      {s.charAt(0) + s.slice(1).toLowerCase()}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-xs text-gray-400 mb-1">Applied Date</label>
                <input
                  type="date"
                  value={form.appliedDate}
                  onChange={e => setForm({ ...form, appliedDate: e.target.value })}
                  className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white text-sm focus:outline-none focus:border-blue-500 transition"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs text-gray-400 mb-1">Notes</label>
              <textarea
                value={form.notes}
                onChange={e => setForm({ ...form, notes: e.target.value })}
                placeholder="Any notes about this application..."
                rows={2}
                className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white text-sm placeholder-gray-500 focus:outline-none focus:border-blue-500 transition resize-none"
              />
            </div>

            <button
              type="submit"
              className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold rounded-lg transition"
            >
              Save Application
            </button>
          </form>
        )}

        {/* Applications list */}
        {loading ? (
          <div className="text-center text-gray-500 py-16">Loading...</div>
        ) : applications.length === 0 ? (
          <div className="text-center text-gray-500 py-16">
            No applications yet. Add your first one above.
          </div>
        ) : (
          <div className="space-y-3">
            {applications.map(app => (
              <div
                key={app.id}
                onClick={() => navigate(`/applications/${app.id}`)}
                className="bg-gray-900 border border-gray-800 rounded-xl px-5 py-4 flex items-center justify-between hover:border-gray-700 transition cursor-pointer"
              >
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-3">
                    <span className="font-semibold text-white truncate">
                      {app.company?.name}
                    </span>
                    <span className={`text-xs px-2 py-0.5 rounded-full border font-medium ${STATUS_COLORS[app.status]}`}>
                      {app.status}
                    </span>
                  </div>
                  <div className="text-sm text-gray-400 mt-0.5">
                    {app.role}
                    {app.appliedDate && (
                      <span className="text-gray-600 ml-2">· {app.appliedDate}</span>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-3 ml-4">
                  <select
                    value={app.status}
                    onChange={e => handleStatusChange(e, app.id, e.target.value)}
                    onClick={e => e.stopPropagation()}
                    className="text-xs px-2 py-1.5 bg-gray-800 border border-gray-700 rounded-lg text-gray-300 focus:outline-none focus:border-blue-500 transition appearance-none cursor-pointer"
                  >
                    {STATUSES.map(s => (
                      <option key={s} value={s} className="bg-gray-800 text-white">
                        {s.charAt(0) + s.slice(1).toLowerCase()}
                      </option>
                    ))}
                  </select>
                  <button
                    onClick={e => handleDelete(e, app.id)}
                    className="text-gray-600 hover:text-red-400 transition text-lg leading-none"
                  >
                    ×
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
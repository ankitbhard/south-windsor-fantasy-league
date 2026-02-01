import { useEffect, useState } from "react"
import { Link, useNavigate } from "react-router-dom"

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000/api"

export default function ViewDraft() {
  const navigate = useNavigate()
  const token = localStorage.getItem('token')
  const userEmail = localStorage.getItem('userEmail')

  const [draft, setDraft] = useState(null)
  const [canEdit, setCanEdit] = useState(false)
  const [loading, setLoading] = useState(true)
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')

  // Load user's draft
  useEffect(() => {
    loadDraft()
    // Check edit window every minute
    const interval = setInterval(checkEditWindow, 60000)
    return () => clearInterval(interval)
  }, [])

  const loadDraft = async () => {
    try {
      const response = await fetch(`${API_URL}/drafts/my-draft`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })

      const data = await response.json()

      if (!response.ok) {
        setError(data.error || 'Failed to load draft')
        return
      }

      setDraft(data.draft)
      setCanEdit(data.canEdit)
      checkEditWindow()
    } catch (error) {
      setError('Error loading draft: ' + error.message)
    } finally {
      setLoading(false)
    }
  }

  const checkEditWindow = () => {
    const now = new Date()
    const hour = now.getHours()
    // Edit allowed 18:00 (6pm) to 23:59
    const isOpen = hour >= 18 || hour < 0
    setCanEdit(isOpen)
  }

  const getTimeStatus = () => {
    const now = new Date()
    const hour = now.getHours()
    const minute = now.getMinutes()
    const currentTime = `${String(hour).padStart(2, '0')}:${String(minute).padStart(2, '0')}`

    if (hour >= 18 || hour < 0) {
      return {
        status: '✓ Edit Window Open',
        color: 'green',
        message: 'You can edit your draft now!'
      }
    } else {
      const nextOpen = 18 - hour
      return {
        status: '✗ Edit Window Closed',
        color: 'red',
        message: `Opens at 6:00 PM (in ${nextOpen} hours)`
      }
    }
  }

  const timeStatus = getTimeStatus()

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="text-center">
          <p className="text-xl font-bold mb-4">Loading...</p>
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
        </div>
      </div>
    )
  }

  if (!draft) {
    return (
      <div className="min-h-screen bg-gray-100">
        <nav className="bg-blue-600 text-white p-4">
          <div className="max-w-7xl mx-auto flex justify-between items-center">
            <Link to="/dashboard" className="text-white hover:text-gray-200">← Back</Link>
            <h1 className="text-2xl font-bold">My Draft</h1>
            <div></div>
          </div>
        </nav>

        <div className="max-w-4xl mx-auto p-6">
          <div className="bg-white p-6 rounded-lg shadow-md text-center">
            <p className="text-gray-600 mb-4">You haven't created a draft yet.</p>
            <Link to="/draft" className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700">
              Create Draft
            </Link>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Navigation */}
      <nav className="bg-blue-600 text-white p-4">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <Link to="/dashboard" className="text-white hover:text-gray-200">← Back to Dashboard</Link>
          <h1 className="text-2xl font-bold">My Draft</h1>
          <div className="text-sm">{userEmail}</div>
        </div>
      </nav>

      <div className="max-w-4xl mx-auto p-6">
        {message && (
          <div className="mb-4 p-4 bg-green-100 border border-green-400 text-green-700 rounded">
            {message}
          </div>
        )}

        {error && (
          <div className="mb-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded">
            {error}
          </div>
        )}

        {/* Edit Window Status */}
        <div className={`mb-6 p-4 rounded-lg border-l-4 ${
          timeStatus.color === 'green'
            ? 'bg-green-50 border-green-600'
            : 'bg-red-50 border-red-600'
        }`}>
          <p className={`font-bold ${
            timeStatus.color === 'green' ? 'text-green-700' : 'text-red-700'
          }`}>
            {timeStatus.status}
          </p>
          <p className={`text-sm ${
            timeStatus.color === 'green' ? 'text-green-600' : 'text-red-600'
          }`}>
            {timeStatus.message}
          </p>
          <p className="text-xs text-gray-600 mt-2">
            Edit window: 6:00 PM - 12:00 AM (Midnight)
          </p>
        </div>

        {/* Draft Summary */}
        <div className="bg-white p-6 rounded-lg shadow-md mb-6">
          <h2 className="text-2xl font-bold mb-4">Your Selections</h2>

          {/* Players Selected */}
          <div className="mb-6">
            <h3 className="text-lg font-bold mb-3">Players Selected:</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {Object.entries(draft.players || {}).map(([key, player]) => {
                const [matchId, role] = key.split('-')
                return (
                  <div key={key} className="p-3 bg-gray-50 rounded border border-gray-200">
                    <p className="text-sm text-gray-600">Match {matchId}</p>
                    <p className="font-bold capitalize">{role}: {player.name}</p>
                    <p className="text-xs text-gray-500">{player.team}</p>
                  </div>
                )
              })}
            </div>
          </div>

          {/* Winners Predicted */}
          <div>
            <h3 className="text-lg font-bold mb-3">Winners Predicted:</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {Object.entries(draft.winners || {}).map(([matchId, winner]) => (
                <div key={matchId} className="p-3 bg-blue-50 rounded border border-blue-200">
                  <p className="text-sm text-gray-600">Match {matchId}</p>
                  <p className="font-bold">🏆 {winner}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="space-y-3">
          {canEdit ? (
            <button
              onClick={() => navigate('/draft')}
              className="w-full bg-blue-600 text-white py-3 rounded hover:bg-blue-700 font-bold text-lg"
            >
              ✏️ Edit Draft
            </button>
          ) : (
            <button
              disabled
              className="w-full bg-gray-400 text-white py-3 rounded font-bold text-lg cursor-not-allowed"
            >
              Edit Closed (Available 6PM-12AM)
            </button>
          )}

          <Link
            to="/dashboard"
            className="block w-full bg-gray-600 text-white py-3 rounded hover:bg-gray-700 font-bold text-lg text-center"
          >
            Back to Dashboard
          </Link>
        </div>

        {/* Draft Info */}
        <div className="mt-6 p-4 bg-blue-50 rounded text-sm text-gray-700">
          <p><strong>Created:</strong> {new Date(draft.createdAt).toLocaleString()}</p>
          <p><strong>Last Updated:</strong> {new Date(draft.updatedAt).toLocaleString()}</p>
          <p className="mt-2 text-xs">You can only edit your draft between 6:00 PM and 12:00 AM</p>
        </div>
      </div>
    </div>
  )
}

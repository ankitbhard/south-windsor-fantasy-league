import { useEffect, useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import { isEditWindowOpen, getEditWindowText, DRAFT_CONFIG } from "../config/draftConfig"

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
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)

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
      checkEditWindow()
    } catch (error) {
      setError('Error loading draft: ' + error.message)
    } finally {
      setLoading(false)
    }
  }

  const checkEditWindow = () => {
    setCanEdit(isEditWindowOpen())
  }

  const getTimeStatus = () => {
    if (DRAFT_CONFIG.ALLOW_24_HOUR_EDITING) {
      return {
        status: '✓ Always Open',
        color: 'green',
        message: 'You can edit your draft anytime!'
      }
    }

    const now = new Date()
    const hour = now.getHours()

    if (isEditWindowOpen()) {
      return {
        status: '✓ Edit Window Open',
        color: 'green',
        message: 'You can edit your draft now!'
      }
    } else {
      const startHour = DRAFT_CONFIG.EDIT_WINDOW_START_HOUR
      const nextOpen = startHour - hour
      return {
        status: '✗ Edit Window Closed',
        color: 'red',
        message: `Opens at ${String(startHour).padStart(2, '0')}:00 (in ${nextOpen} hours)`
      }
    }
  }

  const handleClearDraft = async () => {
    if (!showDeleteConfirm) {
      setShowDeleteConfirm(true)
      return
    }

    setError('')
    setMessage('')
    setLoading(true)

    try {
      const response = await fetch(`${API_URL}/drafts/clear`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })

      const data = await response.json()

      if (!response.ok) {
        setError(data.error || 'Failed to clear draft')
        setShowDeleteConfirm(false)
        setLoading(false)
        return
      }

      setMessage('✓ Draft cleared successfully!')
      setShowDeleteConfirm(false)
      
      setTimeout(() => {
        setDraft(null)
        navigate('/draft')
      }, 2000)
    } catch (error) {
      setError('Error clearing draft: ' + error.message)
      setShowDeleteConfirm(false)
    } finally {
      setLoading(false)
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
            Edit window: {getEditWindowText()}
          </p>
        </div>

        {/* Draft Summary */}
        <div className="bg-white p-6 rounded-lg shadow-md mb-6">
          <h2 className="text-2xl font-bold mb-4">Your Selections</h2>

          {/* Players Selected */}
          {Object.keys(draft.players || {}).length > 0 ? (
            <div className="mb-6">
              <h3 className="text-lg font-bold mb-3">Players Selected ({Object.keys(draft.players || {}).length}):</h3>
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
          ) : (
            <div className="mb-6 p-4 bg-yellow-50 rounded border border-yellow-200">
              <p className="text-yellow-700">No players selected yet</p>
            </div>
          )}

          {/* Winners Predicted */}
          {Object.keys(draft.winners || {}).length > 0 ? (
            <div>
              <h3 className="text-lg font-bold mb-3">Winners Predicted ({Object.keys(draft.winners || {}).length}):</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {Object.entries(draft.winners || {}).map(([matchId, winner]) => (
                  <div key={matchId} className="p-3 bg-blue-50 rounded border border-blue-200">
                    <p className="text-sm text-gray-600">Match {matchId}</p>
                    <p className="font-bold">🏆 {winner}</p>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="p-4 bg-yellow-50 rounded border border-yellow-200">
              <p className="text-yellow-700">No winners predicted yet</p>
            </div>
          )}
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
              Edit Closed (Available {getEditWindowText()})
            </button>
          )}

          {/* Delete Draft Button */}
          {!showDeleteConfirm ? (
            <button
              onClick={handleClearDraft}
              className="w-full bg-red-600 text-white py-3 rounded hover:bg-red-700 font-bold text-lg"
            >
              🗑️ Clear Draft
            </button>
          ) : (
            <div className="bg-red-50 border-2 border-red-400 p-4 rounded-lg">
              <p className="text-red-700 font-bold mb-3">
                ⚠️ Are you sure you want to clear your draft? This cannot be undone.
              </p>
              <div className="grid grid-cols-2 gap-3">
                <button
                  onClick={handleClearDraft}
                  disabled={loading}
                  className="bg-red-600 text-white py-2 rounded hover:bg-red-700 font-bold disabled:opacity-50"
                >
                  {loading ? 'Clearing...' : 'Yes, Clear'}
                </button>
                <button
                  onClick={() => setShowDeleteConfirm(false)}
                  disabled={loading}
                  className="bg-gray-600 text-white py-2 rounded hover:bg-gray-700 font-bold disabled:opacity-50"
                >
                  Cancel
                </button>
              </div>
            </div>
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
          <p className="mt-2 text-xs">You can edit your draft anytime from the "Create Draft" page</p>
        </div>
      </div>
    </div>
  )
}

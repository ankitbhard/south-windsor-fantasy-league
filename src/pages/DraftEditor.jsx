import { useEffect, useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import { isEditWindowOpen } from "../config/draftConfig"
import { allPlayers } from "../../allPlayers_Official"

const API_URL = "https://fantasy-cricket-api-4a1225a6b78d.herokuapp.com/api"

export default function DraftEditor() {
  const navigate = useNavigate()
  const userEmail = localStorage.getItem('userEmail')
  const token = localStorage.getItem('token')

  const [matches, setMatches] = useState([])
  const [currentMatchIdx, setCurrentMatchIdx] = useState(0)
  const [draft, setDraft] = useState({ players: {}, winners: {} })
  const [loading, setLoading] = useState(true)
  const [timeLeft, setTimeLeft] = useState(null)

  const loadData = async () => {
    try {
      const matchesRes = await fetch(`${API_URL}/matches/all`).then(r => r.json())
      setMatches(matchesRes.sort((a, b) => a.matchId - b.matchId))

      const draftRes = await fetch(`${API_URL}/drafts/my-draft`, {
        headers: { 'Authorization': `Bearer ${token}` }
      })
      if (draftRes.ok) {
        const data = await draftRes.json()
        if (data.draft) {
          setDraft(data.draft)
        }
      }

      setLoading(false)
    } catch (err) {
      console.error('Error:', err)
      setLoading(false)
    }
  }

  useEffect(() => {
    if (!token) {
      navigate('/login')
      return
    }
    loadData()
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (matches.length === 0) return

    const match = matches[currentMatchIdx]
    const deadline = new Date(match.editDeadline)
    const now = new Date()
    const diff = deadline - now

    if (!match.editDeadline) {
      setTimeLeft({ open: true })
      return
    }

    if (diff > 0) {
      const mins = Math.floor(diff / 60000)
      const secs = Math.floor((diff % 60000) / 1000)
      setTimeLeft({ mins, secs })

      const timer = setInterval(() => {
        const newDiff = new Date(match.editDeadline) - new Date()
        if (newDiff <= 0) {
          setTimeLeft(null)
          clearInterval(timer)
        } else {
          const m = Math.floor(newDiff / 60000)
          const s = Math.floor((newDiff % 60000) / 1000)
          setTimeLeft({ mins: m, secs: s })
        }
      }, 1000)

      return () => clearInterval(timer)
    } else {
      setTimeLeft(null)
    }
  }, [matches, currentMatchIdx])

  const currentMatch = matches[currentMatchIdx]
  const canEdit = isEditWindowOpen()

  const matchPlayers = currentMatch
    ? [
        ...(allPlayers[currentMatch.team1] || []).map(p => ({ ...p, team: currentMatch.team1 })),
        ...(allPlayers[currentMatch.team2] || []).map(p => ({ ...p, team: currentMatch.team2 }))
      ]
    : []
  const batsmanList = matchPlayers
  const bowlerList = matchPlayers

  const selectedBatsman = draft.players[`${currentMatch?.matchId}-batsman`]
  const selectedBowler = draft.players[`${currentMatch?.matchId}-bowler`]
  const selectedWinner = draft.winners?.[currentMatch?.matchId]

  const handleSelectBatsman = (player) => {
    setDraft(prev => ({
      ...prev,
      players: {
        ...prev.players,
        [`${currentMatch.matchId}-batsman`]: player
      }
    }))
  }

  const handleSelectBowler = (player) => {
    setDraft(prev => ({
      ...prev,
      players: {
        ...prev.players,
        [`${currentMatch.matchId}-bowler`]: player
      }
    }))
  }

  const handleSelectWinner = (team) => {
    setDraft(prev => ({
      ...prev,
      winners: {
        ...prev.winners,
        [currentMatch.matchId]: team
      }
    }))
  }

  const handleSave = async () => {
    try {
      const response = await fetch(`${API_URL}/drafts/save`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          players: draft.players,
          winners: draft.winners
        })
      })

      if (response.ok) {
        alert('Draft saved!')
      } else {
        const data = await response.json()
        alert('Error: ' + (data.error || 'Failed to save'))
      }
    } catch (err) {
      console.error('Error saving:', err)
      alert('Error saving draft')
    }
  }

  if (loading) {
    return <div className="p-8 text-center">Loading...</div>
  }

  if (!currentMatch) {
    return <div className="p-8 text-center">No matches found</div>
  }

  const progress = ((currentMatchIdx + 1) / matches.length) * 100

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <nav className="bg-gradient-to-r from-purple-600 to-pink-600 text-white p-4">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <Link to="/dashboard">← Back to Dashboard</Link>
          <h1 className="text-2xl font-bold">📝 Draft by Match</h1>
          <span className="text-sm">{userEmail}</span>
        </div>
      </nav>

      <div className="max-w-4xl mx-auto p-6">
        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex justify-between mb-2">
            <span className="font-bold">Match {currentMatchIdx + 1} of {matches.length}</span>
            <span className="text-sm">{Math.round(progress)}% Complete</span>
          </div>
          <div className="w-full bg-gray-300 rounded-full h-2">
            <div className="bg-purple-600 h-2 rounded-full" style={{ width: `${progress}%` }}></div>
          </div>
        </div>

        {/* Match Info */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-bold">{currentMatch.team1} vs {currentMatch.team2}</h2>
            {!canEdit ? (
              <div className="bg-red-100 text-red-700 px-4 py-2 rounded font-bold">
                ⏱️ Edit Window Closed
              </div>
            ) : (
              <div className="bg-green-100 text-green-700 px-4 py-2 rounded font-bold">
                {timeLeft?.open ? '✅ Open' : `⏱️ ${timeLeft?.mins}m ${timeLeft?.secs}s Left`}
              </div>
            )}
          </div>
          <p className="text-gray-600">
            {currentMatch.date} at {currentMatch.time} {currentMatch.timezone}
          </p>
        </div>

        {!canEdit ? (
          <div className="bg-red-100 border border-red-300 text-red-700 p-4 rounded mb-6">
            ⚠️ Edit window closed! Selections are locked.
          </div>
        ) : null}

        {/* Selections */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {/* Best Batsman */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="font-bold text-lg mb-4">🏏 Best Batsman</h3>
            {selectedBatsman ? (
              <div className="bg-blue-100 p-3 rounded mb-4">
                <p className="font-bold">{selectedBatsman.name}</p>
                <p className="text-sm text-gray-600">{selectedBatsman.team}</p>
              </div>
            ) : (
              <p className="text-gray-500 mb-4">Not selected</p>
            )}
            
            <div className="max-h-48 overflow-y-auto">
              {batsmanList.map(p => (
                <button
                  key={p.id}
                  onClick={() => handleSelectBatsman(p)}
                  disabled={!canEdit}
                  className={`w-full text-left p-2 rounded mb-2 ${
                    selectedBatsman?.id === p.id
                      ? 'bg-blue-500 text-white'
                      : 'bg-gray-100 hover:bg-gray-200'
                  } ${!canEdit ? 'opacity-50 cursor-not-allowed' : ''}`}
                >
                  <p className="font-bold text-sm">{p.name}</p>
                  <p className="text-xs text-gray-600">{p.team}</p>
                </button>
              ))}
            </div>
          </div>

          {/* Best Bowler */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="font-bold text-lg mb-4">🎱 Best Bowler</h3>
            {selectedBowler ? (
              <div className="bg-orange-100 p-3 rounded mb-4">
                <p className="font-bold">{selectedBowler.name}</p>
                <p className="text-sm text-gray-600">{selectedBowler.team}</p>
              </div>
            ) : (
              <p className="text-gray-500 mb-4">Not selected</p>
            )}
            
            <div className="max-h-48 overflow-y-auto">
              {bowlerList.map(p => (
                <button
                  key={p.id}
                  onClick={() => handleSelectBowler(p)}
                  disabled={!canEdit}
                  className={`w-full text-left p-2 rounded mb-2 ${
                    selectedBowler?.id === p.id
                      ? 'bg-orange-500 text-white'
                      : 'bg-gray-100 hover:bg-gray-200'
                  } ${!canEdit ? 'opacity-50 cursor-not-allowed' : ''}`}
                >
                  <p className="font-bold text-sm">{p.name}</p>
                  <p className="text-xs text-gray-600">{p.team}</p>
                </button>
              ))}
            </div>
          </div>

          {/* Match Winner */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="font-bold text-lg mb-4">🏆 Match Winner</h3>
            {selectedWinner ? (
              <div className="bg-green-100 p-3 rounded mb-4">
                <p className="font-bold">{selectedWinner}</p>
              </div>
            ) : (
              <p className="text-gray-500 mb-4">Not selected</p>
            )}
            
            <div className="space-y-2">
              <button
                onClick={() => handleSelectWinner(currentMatch.team1)}
                disabled={!canEdit}
                className={`w-full p-3 rounded font-bold ${
                  selectedWinner === currentMatch.team1
                    ? 'bg-green-500 text-white'
                    : 'bg-gray-100 hover:bg-gray-200'
                } ${!canEdit ? 'opacity-50 cursor-not-allowed' : ''}`}
              >
                {currentMatch.team1}
              </button>
              <button
                onClick={() => handleSelectWinner(currentMatch.team2)}
                disabled={!canEdit}
                className={`w-full p-3 rounded font-bold ${
                  selectedWinner === currentMatch.team2
                    ? 'bg-green-500 text-white'
                    : 'bg-gray-100 hover:bg-gray-200'
                } ${!canEdit ? 'opacity-50 cursor-not-allowed' : ''}`}
              >
                {currentMatch.team2}
              </button>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <div className="flex justify-between items-center gap-4">
          <button
            onClick={() => setCurrentMatchIdx(Math.max(0, currentMatchIdx - 1))}
            disabled={currentMatchIdx === 0}
            className="bg-gray-500 hover:bg-gray-600 disabled:opacity-50 text-white px-6 py-2 rounded font-bold"
          >
            ← Previous
          </button>

          <button
            onClick={handleSave}
            className="bg-blue-500 hover:bg-blue-600 text-white px-8 py-2 rounded font-bold"
          >
            💾 Save Draft
          </button>

          <button
            onClick={() => setCurrentMatchIdx(Math.min(matches.length - 1, currentMatchIdx + 1))}
            disabled={currentMatchIdx === matches.length - 1}
            className="bg-gray-500 hover:bg-gray-600 disabled:opacity-50 text-white px-6 py-2 rounded font-bold"
          >
            Next →
          </button>
        </div>

        {/* Match List */}
        <div className="mt-8 bg-white rounded-lg shadow-md p-6">
          <h3 className="font-bold text-lg mb-4">All Matches</h3>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-2">
            {matches.map((m, idx) => (
              <button
                key={m.matchId}
                onClick={() => setCurrentMatchIdx(idx)}
                className={`p-2 rounded text-sm font-bold ${
                  idx === currentMatchIdx
                    ? 'bg-purple-600 text-white'
                    : 'bg-gray-200 hover:bg-gray-300'
                }`}
              >
                M{m.matchId}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

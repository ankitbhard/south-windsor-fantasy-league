import { useState, useEffect } from "react"
import { Link, useNavigate } from "react-router-dom"

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000/api"

export default function Admin() {
  const navigate = useNavigate()
  const token = localStorage.getItem('token')
  const userEmail = localStorage.getItem('userEmail')

  const [matches, setMatches] = useState([])
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(true)
  const [formData, setFormData] = useState({})

  // All players
  const allPlayers = [
    { id: 1, name: "Virat Kohli", team: "India", role: "batsman" },
    { id: 2, name: "Rohit Sharma", team: "India", role: "batsman" },
    { id: 3, name: "Suryakumar Yadav", team: "India", role: "batsman" },
    { id: 4, name: "Hardik Pandya", team: "India", role: "batsman" },
    { id: 5, name: "Axar Patel", team: "India", role: "batsman" },
    { id: 6, name: "Jasprit Bumrah", team: "India", role: "bowler" },
    { id: 7, name: "Yuzvendra Chahal", team: "India", role: "bowler" },
    { id: 8, name: "Mohammed Siraj", team: "India", role: "bowler" },
    { id: 9, name: "Babar Azam", team: "Pakistan", role: "batsman" },
    { id: 10, name: "Fakhar Zaman", team: "Pakistan", role: "batsman" },
    { id: 11, name: "Shaheen Afridi", team: "Pakistan", role: "bowler" },
    { id: 12, name: "Hasan Ali", team: "Pakistan", role: "bowler" },
    { id: 13, name: "Steve Smith", team: "Australia", role: "batsman" },
    { id: 14, name: "David Warner", team: "Australia", role: "batsman" },
    { id: 15, name: "Pat Cummins", team: "Australia", role: "bowler" },
    { id: 16, name: "Josh Hazlewood", team: "Australia", role: "bowler" },
    { id: 17, name: "Aiden Markram", team: "South Africa", role: "batsman" },
    { id: 18, name: "Reeza Hendricks", team: "South Africa", role: "batsman" },
    { id: 19, name: "Anrich Nortje", team: "South Africa", role: "bowler" },
    { id: 20, name: "Kagiso Rabada", team: "South Africa", role: "bowler" },
    { id: 21, name: "Jos Buttler", team: "England", role: "batsman" },
    { id: 22, name: "Liam Livingstone", team: "England", role: "batsman" },
    { id: 23, name: "Jofra Archer", team: "England", role: "bowler" },
    { id: 24, name: "Adil Rashid", team: "England", role: "bowler" },
    { id: 25, name: "Nicholas Pooran", team: "West Indies", role: "batsman" },
    { id: 26, name: "Roston Chase", team: "West Indies", role: "batsman" },
    { id: 27, name: "Romesh Shepherd", team: "West Indies", role: "bowler" },
    { id: 28, name: "Akeal Hosein", team: "West Indies", role: "bowler" },
    { id: 29, name: "Angelo Mathews", team: "Sri Lanka", role: "batsman" },
    { id: 30, name: "Pathum Nissanka", team: "Sri Lanka", role: "batsman" },
    { id: 31, name: "Wanindu Hasaranga", team: "Sri Lanka", role: "bowler" },
    { id: 32, name: "Lahiru Kumara", team: "Sri Lanka", role: "bowler" },
  ]

  useEffect(() => {
    loadMatches()
  }, [])

  const loadMatches = async () => {
    try {
      const response = await fetch(`${API_URL}/matches`)
      if (!response.ok) throw new Error('Failed to load matches')
      const data = await response.json()
      setMatches(data)
      setLoading(false)
    } catch (err) {
      setError('Error loading matches: ' + err.message)
      setLoading(false)
    }
  }

  const handleInputChange = (matchId, field, value) => {
    setFormData(prev => ({
      ...prev,
      [matchId]: {
        ...prev[matchId],
        [field]: value
      }
    }))
  }

  const handleSaveResult = async (matchId) => {
    const data = formData[matchId]

    if (!data || !data.batsman || !data.bowler || !data.winner) {
      setError(`Match ${matchId}: Please fill all fields`)
      setTimeout(() => setError(''), 3000)
      return
    }

    setLoading(true)
    setError('')
    setMessage('')

    try {
      const response = await fetch(`${API_URL}/matches/result/${matchId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          batsman: parseInt(data.batsman),
          bowler: parseInt(data.bowler),
          winner: data.winner
        })
      })

      const result = await response.json()

      if (!response.ok) {
        throw new Error(result.error || 'Failed to save result')
      }

      setMessage(`✓ Match ${matchId} result saved!`)
      
      // Clear form for this match
      setFormData(prev => {
        const updated = { ...prev }
        delete updated[matchId]
        return updated
      })

      // Reload after 1.5 seconds
      setTimeout(() => {
        loadMatches()
      }, 1500)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const getBatsmen = () => allPlayers.filter(p => p.role === 'batsman')
  const getBowlers = () => allPlayers.filter(p => p.role === 'bowler')

  const handleLogout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('userId')
    localStorage.removeItem('userEmail')
    navigate("/")
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="text-center">
          <p className="text-xl font-bold">Loading...</p>
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mt-4"></div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <nav className="bg-red-600 text-white p-4">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <Link to="/dashboard" className="text-white hover:text-gray-200">← Back</Link>
          <h1 className="text-2xl font-bold">Admin - Match Results</h1>
          <div className="flex gap-2">
            <span className="text-sm">{userEmail}</span>
            <button onClick={handleLogout} className="bg-red-700 px-3 py-1 rounded text-sm">
              Logout
            </button>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto p-6">
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

        <h2 className="text-3xl font-bold mb-6">Set Match Results</h2>

        {matches.length === 0 ? (
          <div className="bg-white p-8 rounded-lg shadow-md text-center">
            <p className="text-gray-600 mb-4">No matches yet</p>
            <Link to="/admin-panel" className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700">
              Add Matches
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {matches.map(match => (
              <div key={match.matchId} className="bg-white p-6 rounded-lg shadow-md">
                <h3 className="text-xl font-bold mb-6 pb-4 border-b">
                  Match {match.matchId}
                </h3>

                <div className="space-y-4">
                  {/* Team Names */}
                  <div className="grid grid-cols-2 gap-4 mb-6 p-4 bg-blue-50 rounded">
                    <div className="text-center">
                      <p className="font-bold text-lg">{match.team1}</p>
                    </div>
                    <div className="text-center">
                      <p className="font-bold text-lg">{match.team2}</p>
                    </div>
                  </div>

                  {/* Batsman */}
                  <div>
                    <label className="block text-sm font-bold mb-2">🏏 Best Batsman (+100 pts)</label>
                    <select
                      value={formData[match.matchId]?.batsman || ''}
                      onChange={(e) => handleInputChange(match.matchId, 'batsman', e.target.value)}
                      className="w-full border-2 border-gray-300 px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-green-400"
                    >
                      <option value="">Select...</option>
                      {getBatsmen().map(p => (
                        <option key={p.id} value={p.id}>
                          {p.name} ({p.team})
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Bowler */}
                  <div>
                    <label className="block text-sm font-bold mb-2">🎯 Best Bowler (+50 pts)</label>
                    <select
                      value={formData[match.matchId]?.bowler || ''}
                      onChange={(e) => handleInputChange(match.matchId, 'bowler', e.target.value)}
                      className="w-full border-2 border-gray-300 px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-green-400"
                    >
                      <option value="">Select...</option>
                      {getBowlers().map(p => (
                        <option key={p.id} value={p.id}>
                          {p.name} ({p.team})
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Winner */}
                  <div>
                    <label className="block text-sm font-bold mb-2">🏆 Match Winner (+200 pts)</label>
                    <div className="grid grid-cols-2 gap-2">
                      <button
                        onClick={() => handleInputChange(match.matchId, 'winner', match.team1)}
                        className={`py-2 px-4 rounded font-bold transition ${
                          formData[match.matchId]?.winner === match.team1
                            ? 'bg-green-600 text-white'
                            : 'bg-gray-200 hover:bg-gray-300'
                        }`}
                      >
                        {match.team1}
                      </button>
                      <button
                        onClick={() => handleInputChange(match.matchId, 'winner', match.team2)}
                        className={`py-2 px-4 rounded font-bold transition ${
                          formData[match.matchId]?.winner === match.team2
                            ? 'bg-green-600 text-white'
                            : 'bg-gray-200 hover:bg-gray-300'
                        }`}
                      >
                        {match.team2}
                      </button>
                    </div>
                  </div>

                  {/* Save Button */}
                  <button
                    onClick={() => handleSaveResult(match.matchId)}
                    disabled={loading || !formData[match.matchId]?.batsman || !formData[match.matchId]?.bowler || !formData[match.matchId]?.winner}
                    className="w-full mt-4 bg-green-600 text-white py-3 rounded font-bold hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {loading ? 'Saving...' : '✓ Save Result (350 pts)'}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Info Box */}
        <div className="mt-8 bg-blue-50 p-6 rounded-lg">
          <h3 className="text-lg font-bold mb-4">Points</h3>
          <div className="grid grid-cols-3 gap-4">
            <div>
              <p className="text-sm text-gray-600">Batsman</p>
              <p className="text-2xl font-bold text-green-600">100</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Bowler</p>
              <p className="text-2xl font-bold text-blue-600">50</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Winner</p>
              <p className="text-2xl font-bold text-purple-600">200</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

import { useState, useEffect } from "react"
import { Link, useNavigate } from "react-router-dom"

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000/api"

export default function Admin() {
  const navigate = useNavigate()
  const token = localStorage.getItem('token')
  const userEmail = localStorage.getItem('userEmail')

  const [matches, setMatches] = useState([])
  const [players, setPlayers] = useState([])
  const [matchResults, setMatchResults] = useState({})
  const [results, setResults] = useState({})
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  // Hardcoded players list
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
    { id: 33, name: "Mohammad Nabi", team: "Afghanistan", role: "batsman" },
    { id: 34, name: "Rahmanullah Gurbaz", team: "Afghanistan", role: "batsman" },
    { id: 35, name: "Rashid Khan", team: "Afghanistan", role: "bowler" },
    { id: 36, name: "Naveen-ul-Haq", team: "Afghanistan", role: "bowler" },
    { id: 37, name: "Ishan Malhotra", team: "USA", role: "batsman" },
    { id: 38, name: "Aaron Jones", team: "USA", role: "batsman" },
    { id: 39, name: "Ali Khan", team: "USA", role: "bowler" },
    { id: 40, name: "Harmeet Singh", team: "USA", role: "bowler" },
    { id: 41, name: "Kyle Coetzer", team: "Scotland", role: "batsman" },
    { id: 42, name: "Richie Berrington", team: "Scotland", role: "batsman" },
    { id: 43, name: "Mark Watt", team: "Scotland", role: "bowler" },
    { id: 44, name: "Chris Sole", team: "Scotland", role: "bowler" },
  ]

  // Load matches and results on mount
  useEffect(() => {
    loadMatches()
    loadMatchResults()
  }, [])

  const loadMatches = async () => {
    try {
      const response = await fetch(`${API_URL}/matches`)
      const data = await response.json()
      setMatches(data)
    } catch (error) {
      console.error('Error loading matches:', error)
    }
  }

  const loadMatchResults = async () => {
    try {
      const response = await fetch(`${API_URL}/matches/results/all`)
      const data = await response.json()
      const resultsMap = {}
      data.forEach(result => {
        resultsMap[result.matchId] = result
      })
      setMatchResults(resultsMap)
    } catch (error) {
      console.error('Error loading results:', error)
    }
  }

  const handleResultSubmit = async (matchId) => {
    const matchResult = results[matchId]
    
    if (!matchResult || !matchResult.batsman || !matchResult.bowler || !matchResult.winner) {
      setError(`Match ${matchId}: Please select batsman, bowler, and winner`)
      return
    }

    setError('')
    setMessage('')
    setLoading(true)

    try {
      const response = await fetch(`${API_URL}/matches/result/${matchId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          batsman: parseInt(matchResult.batsman),
          bowler: parseInt(matchResult.bowler),
          winner: matchResult.winner
        })
      })

      const data = await response.json()

      if (!response.ok) {
        setError(data.error || 'Failed to save match result')
        return
      }

      setMessage(`✓ Match ${matchId} result saved!`)
      
      // Update local state
      setMatchResults(prev => ({
        ...prev,
        [matchId]: {
          matchId,
          batsman: parseInt(matchResult.batsman),
          bowler: parseInt(matchResult.bowler),
          winner: matchResult.winner
        }
      }))

      // Clear form for this match
      setResults(prev => {
        const updated = { ...prev }
        delete updated[matchId]
        return updated
      })
    } catch (error) {
      setError('Error saving match result: ' + error.message)
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

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Navigation */}
      <nav className="bg-red-600 text-white p-4">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <Link to="/dashboard" className="text-white hover:text-gray-200">← Back to Dashboard</Link>
          <h1 className="text-2xl font-bold">Admin - Update Match Results</h1>
          <div className="flex gap-2 items-center">
            <span className="text-sm">{userEmail}</span>
            <button
              onClick={handleLogout}
              className="bg-red-700 hover:bg-red-800 px-3 py-1 rounded text-sm"
            >
              Logout
            </button>
          </div>
        </div>
      </nav>

      {/* Main Content */}
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
          <div className="bg-white p-6 rounded-lg shadow-md">
            <p className="text-gray-600">No matches added yet. Go to Admin Panel to add matches.</p>
            <Link to="/admin-panel" className="text-blue-600 hover:text-blue-800 font-bold mt-4 inline-block">
              Go to Admin Panel →
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {matches.map(match => {
              const existingResult = matchResults[match.matchId]
              const currentResult = results[match.matchId] || existingResult || {}

              return (
                <div key={match.matchId} className="bg-white p-6 rounded-lg shadow-md">
                  <h3 className="text-lg font-bold mb-4">
                    Match {match.matchId}: {match.team1} vs {match.team2}
                  </h3>

                  {existingResult && (
                    <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded">
                      <p className="text-sm text-green-700">✓ Result Already Set</p>
                      <p className="text-xs text-green-600 mt-1">
                        Batsman: {allPlayers.find(p => p.id === existingResult.batsman)?.name}
                      </p>
                      <p className="text-xs text-green-600">
                        Bowler: {allPlayers.find(p => p.id === existingResult.bowler)?.name}
                      </p>
                      <p className="text-xs text-green-600">
                        Winner: {existingResult.winner}
                      </p>
                    </div>
                  )}

                  <div className="space-y-4">
                    {/* Best Batsman */}
                    <div>
                      <label className="block text-sm font-medium mb-2">Man of the Match (Batsman) - +100 pts</label>
                      <select
                        value={currentResult.batsman || ''}
                        onChange={(e) => {
                          setResults(prev => ({
                            ...prev,
                            [match.matchId]: { ...prev[match.matchId], batsman: e.target.value }
                          }))
                        }}
                        className="w-full border border-gray-300 px-3 py-2 rounded focus:outline-none focus:ring focus:ring-blue-300"
                      >
                        <option value="">Select Batsman...</option>
                        {getBatsmen().map(player => (
                          <option key={player.id} value={player.id}>
                            {player.name} ({player.team})
                          </option>
                        ))}
                      </select>
                    </div>

                    {/* Best Bowler */}
                    <div>
                      <label className="block text-sm font-medium mb-2">Best Bowler - +50 pts</label>
                      <select
                        value={currentResult.bowler || ''}
                        onChange={(e) => {
                          setResults(prev => ({
                            ...prev,
                            [match.matchId]: { ...prev[match.matchId], bowler: e.target.value }
                          }))
                        }}
                        className="w-full border border-gray-300 px-3 py-2 rounded focus:outline-none focus:ring focus:ring-blue-300"
                      >
                        <option value="">Select Bowler...</option>
                        {getBowlers().map(player => (
                          <option key={player.id} value={player.id}>
                            {player.name} ({player.team})
                          </option>
                        ))}
                      </select>
                    </div>

                    {/* Match Winner */}
                    <div>
                      <label className="block text-sm font-medium mb-2">🏆 Match Winner - +200 pts</label>
                      <div className="grid grid-cols-2 gap-2">
                        <button
                          onClick={() => {
                            setResults(prev => ({
                              ...prev,
                              [match.matchId]: { ...prev[match.matchId], winner: match.team1 }
                            }))
                          }}
                          className={`py-2 px-3 rounded font-medium transition ${
                            currentResult.winner === match.team1
                              ? "bg-green-600 text-white"
                              : "bg-white border border-gray-300 hover:bg-gray-50"
                          }`}
                        >
                          {match.team1}
                        </button>
                        <button
                          onClick={() => {
                            setResults(prev => ({
                              ...prev,
                              [match.matchId]: { ...prev[match.matchId], winner: match.team2 }
                            }))
                          }}
                          className={`py-2 px-3 rounded font-medium transition ${
                            currentResult.winner === match.team2
                              ? "bg-green-600 text-white"
                              : "bg-white border border-gray-300 hover:bg-gray-50"
                          }`}
                        >
                          {match.team2}
                        </button>
                      </div>
                    </div>

                    {/* Submit Button */}
                    {!existingResult && (
                      <button
                        onClick={() => handleResultSubmit(match.matchId)}
                        disabled={loading || !currentResult.batsman || !currentResult.bowler || !currentResult.winner}
                        className="w-full bg-green-600 text-white py-2 rounded hover:bg-green-700 font-bold disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {loading ? 'Saving...' : '✓ Save Result (350 pts total)'}
                      </button>
                    )}
                  </div>
                </div>
              )
            })}
          </div>
        )}

        {/* Info */}
        <div className="bg-blue-50 p-6 rounded-lg shadow-md mt-8">
          <h3 className="text-xl font-bold mb-4">ℹ️ Points Breakdown</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-white p-4 rounded">
              <p className="text-sm text-gray-600">Correct Batsman</p>
              <p className="text-2xl font-bold text-green-600">+100 pts</p>
            </div>
            <div className="bg-white p-4 rounded">
              <p className="text-sm text-gray-600">Correct Bowler</p>
              <p className="text-2xl font-bold text-blue-600">+50 pts</p>
            </div>
            <div className="bg-white p-4 rounded">
              <p className="text-sm text-gray-600">Correct Winner</p>
              <p className="text-2xl font-bold text-purple-600">+200 pts</p>
            </div>
          </div>
          <p className="text-gray-600 text-sm mt-4">Total per match: <strong>350 points</strong></p>
        </div>
      </div>
    </div>
  )
}

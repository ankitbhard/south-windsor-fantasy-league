import { useEffect, useState } from "react"
import { Link } from "react-router-dom"

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000/api"

export default function Leaderboard() {
  const [leaderboard, setLeaderboard] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const userEmail = localStorage.getItem('userEmail')

  useEffect(() => {
    loadLeaderboard()
    const interval = setInterval(loadLeaderboard, 10000)
    return () => clearInterval(interval)
  }, [])

  const loadLeaderboard = async () => {
    try {
      setLoading(true)
      
      // Fetch all drafts
      const draftsResponse = await fetch(`${API_URL}/drafts/all`)
      if (!draftsResponse.ok) throw new Error('Failed to load drafts')
      const drafts = await draftsResponse.json()

      // Fetch all player performances
      const performanceResponse = await fetch(`${API_URL}/playerPerformance/all`)
      if (!performanceResponse.ok) throw new Error('Failed to load performances')
      const performances = await performanceResponse.json()

      // Fetch all match winners
      const winnersResponse = await fetch(`${API_URL}/matches/winners`)
      if (!winnersResponse.ok) throw new Error('Failed to load winners')
      const winners = await winnersResponse.json()

      // Create maps for quick lookup
      const performanceMap = {}
      performances.forEach(perf => {
        if (!performanceMap[perf.matchId]) {
          performanceMap[perf.matchId] = {}
        }
        performanceMap[perf.matchId][perf.playerId] = perf
      })

      const winnersMap = {}
      winners.forEach(w => {
        winnersMap[w.matchId] = w.winner
      })

      // Calculate scores for each draft
      const leaderboardData = drafts.map(draft => {
        let totalScore = 0
        let breakdown = {
          batsman: 0,
          bowler: 0,
          winner: 0
        }

        // Check batsman predictions
        const players = draft.players || {}
        for (const key in players) {
          const [matchId, role] = key.split('-')
          const player = players[key]
          const matchPerformances = performanceMap[parseInt(matchId)] || {}
          const playerPerf = matchPerformances[player.id]

          if (playerPerf && role === 'batsman' && playerPerf.role === 'batsman') {
            // User predicted correct batsman, award runs scored
            const runsPoints = playerPerf.runs || 0
            totalScore += runsPoints
            breakdown.batsman += runsPoints
          }
        }

        // Check bowler predictions
        for (const key in players) {
          const [matchId, role] = key.split('-')
          const player = players[key]
          const matchPerformances = performanceMap[parseInt(matchId)] || {}
          const playerPerf = matchPerformances[player.id]

          if (playerPerf && role === 'bowler' && playerPerf.role === 'bowler') {
            // User predicted correct bowler, award wickets * 25
            const wicketsPoints = (playerPerf.wickets || 0) * 25
            totalScore += wicketsPoints
            breakdown.bowler += wicketsPoints
          }
        }

        // Check match winner predictions - 200 points
        const winnerPredictions = draft.winners || {}
        for (const matchId in winnerPredictions) {
          const predictedWinner = winnerPredictions[matchId]
          const actualWinner = winnersMap[parseInt(matchId)]

          if (actualWinner && predictedWinner === actualWinner) {
            totalScore += 200
            breakdown.winner += 200
          }
        }

        return {
          ...draft,
          totalScore,
          breakdown,
          playersSelected: Object.keys(players).length,
          winnersSelected: Object.keys(winnerPredictions).length
        }
      })

      leaderboardData.sort((a, b) => b.totalScore - a.totalScore)
      setLeaderboard(leaderboardData)
      setLoading(false)
    } catch (err) {
      setError('Error loading leaderboard: ' + err.message)
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="text-center">
          <p className="text-xl font-bold">Loading leaderboard...</p>
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mt-4"></div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <nav className="bg-gradient-to-r from-purple-600 to-pink-600 text-white p-4">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <Link to="/dashboard" className="text-white hover:text-gray-200">← Back to Dashboard</Link>
          <h1 className="text-3xl font-bold">🏆 Leaderboard</h1>
          <button
            onClick={loadLeaderboard}
            className="bg-white bg-opacity-20 hover:bg-opacity-30 px-4 py-2 rounded text-sm font-bold"
          >
            🔄 Refresh
          </button>
        </div>
      </nav>

      <div className="max-w-4xl mx-auto p-6">
        {error && (
          <div className="mb-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded">
            {error}
          </div>
        )}

        {leaderboard.length === 0 ? (
          <div className="bg-white p-8 rounded-lg shadow-md text-center">
            <p className="text-gray-600">No drafts yet. Create one to join the competition!</p>
            <Link to="/draft" className="mt-4 inline-block bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700">
              Create Draft
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {/* Top 3 Podium */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
              {leaderboard.slice(0, 3).map((draft, index) => (
                <div
                  key={draft._id}
                  className={`p-6 rounded-lg text-center text-white ${
                    index === 0
                      ? 'bg-yellow-500 shadow-lg md:col-span-1 md:order-2 md:scale-110'
                      : index === 1
                      ? 'bg-gray-400 md:order-1'
                      : 'bg-orange-600 md:order-3'
                  }`}
                >
                  <p className="text-4xl font-bold mb-2">
                    {index === 0 ? '🥇' : index === 1 ? '🥈' : '🥉'}
                  </p>
                  <p className="font-bold text-lg truncate">{draft.email}</p>
                  <p className="text-sm opacity-90 mb-2">
                    {draft.playersSelected + draft.winnersSelected} selections
                  </p>
                  <p className="text-3xl font-bold">{draft.totalScore}</p>
                  <p className="text-xs opacity-75">points</p>
                </div>
              ))}
            </div>

            {/* Full Leaderboard Table */}
            <div className="bg-white rounded-lg shadow-md overflow-hidden">
              <table className="w-full">
                <thead className="bg-blue-600 text-white">
                  <tr>
                    <th className="px-6 py-3 text-left font-bold">Rank</th>
                    <th className="px-6 py-3 text-left font-bold">Player</th>
                    <th className="px-6 py-3 text-center font-bold">Selections</th>
                    <th className="px-6 py-3 text-right font-bold">Score</th>
                  </tr>
                </thead>
                <tbody>
                  {leaderboard.map((draft, index) => {
                    const isCurrentUser = draft.email === userEmail
                    return (
                      <tr
                        key={draft._id}
                        className={`border-t ${
                          isCurrentUser
                            ? 'bg-blue-50 font-bold'
                            : index % 2 === 0
                            ? 'bg-white'
                            : 'bg-gray-50'
                        } hover:bg-gray-100 transition`}
                      >
                        <td className="px-6 py-4">
                          <span className="text-xl font-bold text-purple-600">
                            {index === 0 ? '🥇' : index === 1 ? '🥈' : index === 2 ? '🥉' : `#${index + 1}`}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <div>
                            <p className="font-bold">{draft.email}</p>
                            <p className="text-xs text-gray-500">
                              Last updated: {new Date(draft.updatedAt).toLocaleDateString()}
                            </p>
                            {/* Score breakdown */}
                            <p className="text-xs text-gray-500 mt-1">
                              Runs: {draft.breakdown.batsman} | Wickets: {draft.breakdown.bowler} | Winner: {draft.breakdown.winner}
                            </p>
                          </div>
                        </td>
                        <td className="px-6 py-4 text-center">
                          <span className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm font-bold">
                            {draft.playersSelected + draft.winnersSelected}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-right">
                          <span className="text-2xl font-bold text-purple-600">
                            {draft.totalScore}
                          </span>
                          <p className="text-xs text-gray-500">points</p>
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>

            {/* Legend */}
            <div className="bg-blue-50 p-4 rounded-lg text-sm text-gray-700">
              <p className="font-bold mb-3">💡 Scoring System</p>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <p className="font-bold text-green-600">Best Batsman</p>
                  <p>= Runs Scored</p>
                  <p className="text-xs text-gray-500">e.g., 84 runs = 84 pts</p>
                </div>
                <div>
                  <p className="font-bold text-orange-600">Best Bowler</p>
                  <p>= Wickets × 25</p>
                  <p className="text-xs text-gray-500">e.g., 3 wickets = 75 pts</p>
                </div>
                <div>
                  <p className="font-bold text-purple-600">Match Winner</p>
                  <p>= Fixed 200</p>
                  <p className="text-xs text-gray-500">+200 for correct winner</p>
                </div>
              </div>
            </div>

            {/* Auto-refresh info */}
            <div className="bg-purple-50 p-4 rounded-lg text-sm text-purple-700 text-center">
              🔄 Leaderboard auto-refreshes every 10 seconds
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
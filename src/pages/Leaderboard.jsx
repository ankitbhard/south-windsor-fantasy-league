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
      setError('')
      
      const draftsResponse = await fetch(`${API_URL}/drafts/all`)
      if (!draftsResponse.ok) throw new Error('Failed to load drafts')
      const drafts = await draftsResponse.json()

      const performanceResponse = await fetch(`${API_URL}/playerPerformance/all`)
      if (!performanceResponse.ok) throw new Error('Failed to load performances')
      const performances = await performanceResponse.json()

      const winnersResponse = await fetch(`${API_URL}/matches/winners`)
      if (!winnersResponse.ok) throw new Error('Failed to load winners')
      const winners = await winnersResponse.json()

      console.log('Drafts:', drafts)
      console.log('Performances:', performances)
      console.log('Winners:', winners)

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

      const leaderboardData = drafts.map(draft => {
        let totalScore = 0
        let breakdown = { batsman: 0, bowler: 0, winner: 0 }

        const players = draft.players || {}
        for (const key in players) {
          const parts = key.split('-')
          if (parts.length !== 2) continue
          
          const matchId = parseInt(parts[0])
          const role = parts[1]
          const player = players[key]
          
          if (isNaN(matchId) || !player) continue
          
          const matchPerformances = performanceMap[matchId] || {}
          const playerPerf = matchPerformances[player.id]

          if (playerPerf && role === 'batsman' && playerPerf.role === 'batsman') {
            const runsPoints = playerPerf.runs || 0
            totalScore += runsPoints
            breakdown.batsman += runsPoints
          }
        }

        for (const key in players) {
          const parts = key.split('-')
          if (parts.length !== 2) continue
          
          const matchId = parseInt(parts[0])
          const role = parts[1]
          const player = players[key]
          
          if (isNaN(matchId) || !player) continue
          
          const matchPerformances = performanceMap[matchId] || {}
          const playerPerf = matchPerformances[player.id]

          if (playerPerf && role === 'bowler' && playerPerf.role === 'bowler') {
            const wicketsPoints = (playerPerf.wickets || 0) * 25
            totalScore += wicketsPoints
            breakdown.bowler += wicketsPoints
          }
        }

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
      console.error('Leaderboard error:', err)
      setError('Error: ' + err.message)
      setLoading(false)
    }
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
      <nav className="bg-gradient-to-r from-purple-600 to-pink-600 text-white p-4">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <Link to="/dashboard" className="text-white hover:text-gray-200">← Back</Link>
          <h1 className="text-3xl font-bold">🏆 Leaderboard</h1>
          <button onClick={loadLeaderboard} className="bg-white bg-opacity-20 hover:bg-opacity-30 px-4 py-2 rounded text-sm font-bold">
            🔄 Refresh
          </button>
        </div>
      </nav>

      <div className="max-w-4xl mx-auto p-6">
        {error && <div className="mb-4 p-4 bg-red-100 text-red-700 rounded">{error}</div>}

        {leaderboard.length === 0 ? (
          <div className="bg-white p-8 rounded-lg shadow-md text-center">
            <p className="text-gray-600">No drafts yet</p>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
              {leaderboard.slice(0, 3).map((draft, index) => (
                <div key={draft._id} className={`p-6 rounded-lg text-center text-white ${index === 0 ? 'bg-yellow-500 shadow-lg md:scale-110' : index === 1 ? 'bg-gray-400' : 'bg-orange-600'}`}>
                  <p className="text-4xl font-bold mb-2">{index === 0 ? '🥇' : index === 1 ? '🥈' : '🥉'}</p>
                  <p className="font-bold text-lg">{draft.email}</p>
                  <p className="text-3xl font-bold mt-2">{draft.totalScore}</p>
                </div>
              ))}
            </div>

            <div className="bg-white rounded-lg shadow-md overflow-hidden">
              <table className="w-full">
                <thead className="bg-blue-600 text-white">
                  <tr>
                    <th className="px-6 py-3 text-left">Rank</th>
                    <th className="px-6 py-3 text-left">Player</th>
                    <th className="px-6 py-3 text-right">Score</th>
                  </tr>
                </thead>
                <tbody>
                  {leaderboard.map((draft, index) => (
                    <tr key={draft._id} className={`border-t ${index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}`}>
                      <td className="px-6 py-4 text-xl font-bold text-purple-600">{index === 0 ? '🥇' : index === 1 ? '🥈' : index === 2 ? '🥉' : `#${index + 1}`}</td>
                      <td className="px-6 py-4"><p className="font-bold">{draft.email}</p><p className="text-xs text-gray-500">Runs: {draft.breakdown.batsman} | Wickets: {draft.breakdown.bowler} | Winner: {draft.breakdown.winner}</p></td>
                      <td className="px-6 py-4 text-right"><span className="text-2xl font-bold text-purple-600">{draft.totalScore}</span></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

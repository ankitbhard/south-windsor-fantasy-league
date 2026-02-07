import { useEffect, useState } from "react"
import { Link } from "react-router-dom"

const API_URL = "https://fantasy-cricket-api-4a1225a6b78d.herokuapp.com/api"

export default function Leaderboard() {
  const [leaderboard, setLeaderboard] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadData()
  }, [])

  const loadData = async () => {
    try {
      const drafts = await fetch(`${API_URL}/drafts/all`).then(r => r.json())
      const perfs = await fetch(`${API_URL}/playerPerformance/all`).then(r => r.json())
      const winners = await fetch(`${API_URL}/matches/winners/all`).then(r => r.json())

      const perfMap = {}
      perfs.forEach(p => {
        if (!perfMap[p.matchId]) perfMap[p.matchId] = {}
        perfMap[p.matchId][p.playerId] = p
      })

      const winMap = {}
      winners.forEach(w => { winMap[w.matchId] = w.winner })

      const scores = drafts.map(d => {
        let score = 0
        const players = d.players || {}
        const wins = d.winners || {}

        for (const key in players) {
          const [mid, role] = key.split('-')
          const p = players[key]
          const perf = perfMap[parseInt(mid)]?.[p.id]
          if (perf && perf.role === role) {
            if (role === 'batsman') score += perf.runs || 0
            if (role === 'bowler') score += (perf.wickets || 0) * 25
          }
        }

        for (const mid in wins) {
          if (winMap[parseInt(mid)] === wins[mid]) score += 200
        }

        return { ...d, score }
      })

      scores.sort((a, b) => b.score - a.score)
      setLeaderboard(scores)
      setLoading(false)
    } catch (e) {
      console.error('Error:', e)
      setLoading(false)
    }
  }

  if (loading) return <div className="p-8 text-center">Loading...</div>

  return (
    <div className="min-h-screen bg-gray-100">
      <nav className="bg-gradient-to-r from-purple-600 to-pink-600 text-white p-4">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <Link to="/dashboard">← Back</Link>
          <h1 className="text-3xl font-bold">🏆 Leaderboard</h1>
        </div>
      </nav>

      <div className="max-w-4xl mx-auto p-6">
        {leaderboard.length === 0 ? (
          <div className="bg-white p-8 rounded text-center">No scores yet</div>
        ) : (
          <div className="bg-white rounded shadow-md overflow-hidden">
            <table className="w-full">
              <thead className="bg-blue-600 text-white">
                <tr>
                  <th className="px-6 py-3 text-left">Rank</th>
                  <th className="px-6 py-3 text-left">Email</th>
                  <th className="px-6 py-3 text-right">Score</th>
                </tr>
              </thead>
              <tbody>
                {leaderboard.map((d, i) => (
                  <tr key={d._id} className="border-t hover:bg-gray-50">
                    <td className="px-6 py-4 font-bold">{i === 0 ? '🥇' : i === 1 ? '🥈' : i === 2 ? '🥉' : `#${i+1}`}</td>
                    <td className="px-6 py-4">{d.email}</td>
                    <td className="px-6 py-4 text-right font-bold text-xl text-purple-600">{d.score}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}

import { useEffect, useState } from "react"
import { Link, useNavigate } from "react-router-dom"

const API_URL = "https://fantasy-cricket-api-4a1225a6b78d.herokuapp.com/api"

const AVATAR_COLORS = [
  'bg-purple-500', 'bg-blue-500', 'bg-green-500', 'bg-red-500',
  'bg-yellow-500', 'bg-pink-500', 'bg-indigo-500', 'bg-teal-500',
  'bg-orange-500', 'bg-cyan-500'
]

function Avatar({ email, size = 'md' }) {
  const initials = (email || '?').charAt(0).toUpperCase()
  const colorIdx = (email || '').split('').reduce((sum, c) => sum + c.charCodeAt(0), 0) % AVATAR_COLORS.length
  const color = AVATAR_COLORS[colorIdx]
  const sizeClass = size === 'sm' ? 'w-7 h-7 text-xs' : 'w-10 h-10 text-sm'
  return (
    <div className={`${sizeClass} ${color} rounded-full flex items-center justify-center text-white font-bold flex-shrink-0`}>
      {initials}
    </div>
  )
}

export default function Dashboard() {
  const navigate = useNavigate()
  const [stats, setStats] = useState({ drafts: 0, score: 0 })
  const [leaderboard, setLeaderboard] = useState([])
  const [loading, setLoading] = useState(true)
  const [isAdmin, setIsAdmin] = useState(false)

  const userEmail = localStorage.getItem('userEmail')
  const token = localStorage.getItem('token')

  useEffect(() => {
    if (!token) {
      navigate('/login')
      return
    }
    loadData()
  }, [token, navigate])

  const loadData = async () => {
    try {
      const adminCheck = await fetch(`${API_URL}/admin/check`, {
        headers: { 'Authorization': `Bearer ${token}` }
      }).then(r => r.json())
      setIsAdmin(adminCheck.isAdmin === true)

      const drafts = await fetch(`${API_URL}/drafts/all`).then(r => r.json())
      const perfs = await fetch(`${API_URL}/playerPerformance/all`).then(r => r.json())
      const winners = await fetch(`${API_URL}/matches/winners/all`).then(r => r.json())

      // Build performance map
      const perfMap = {}
      perfs.forEach(p => {
        if (!perfMap[p.matchId]) perfMap[p.matchId] = {}
        perfMap[p.matchId][p.playerId] = p
      })

      // Build winners map
      const winMap = {}
      winners.forEach(w => { winMap[w.matchId] = w.winner })

      // Calculate scores for all drafts
      const scores = drafts.map(d => {
        let score = 0
        const players = d.players || {}
        const wins = d.winners || {}

        // Score batsmen
        for (const key in players) {
          const [mid, role] = key.split('-')
          const p = players[key]
          const perf = perfMap[parseInt(mid)]?.[p.id]
          if (perf && perf.role === 'batsman' && role === 'batsman') {
            score += perf.runs || 0
          }
        }

        // Score bowlers
        for (const key in players) {
          const [mid, role] = key.split('-')
          const p = players[key]
          const perf = perfMap[parseInt(mid)]?.[p.id]
          if (perf && perf.role === 'bowler' && role === 'bowler') {
            score += (perf.wickets || 0) * 25
          }
        }

        // Score winners
        for (const mid in wins) {
          if (winMap[parseInt(mid)] === wins[mid]) {
            score += 200
          }
        }

        return { ...d, totalScore: score }
      })

      // Sort by score
      scores.sort((a, b) => b.totalScore - a.totalScore)

      // Get user's stats
      const userDrafts = scores.filter(d => d.email === userEmail)
      setStats({
        drafts: userDrafts.length,
        score: userDrafts.reduce((sum, d) => sum + d.totalScore, 0)
      })

      setLeaderboard(scores)
      setLoading(false)
    } catch (err) {
      console.error('Error:', err)
      setLoading(false)
    }
  }

  const handleLogout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('userId')
    localStorage.removeItem('userEmail')
    navigate('/')
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <p className="text-xl font-bold">Loading...</p>
      </div>
    )
  }

  const userRank = leaderboard.findIndex(d => d.email === userEmail) + 1

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <nav className="bg-gradient-to-r from-purple-600 to-pink-600 text-white p-4 shadow-lg">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <h1 className="text-2xl font-bold">🏏 Fantasy Cricket</h1>
          <div className="flex gap-3 items-center">
            <Avatar email={userEmail} />
            <span className="text-sm">{userEmail}</span>
            <button
              onClick={handleLogout}
              className="bg-red-500 hover:bg-red-600 px-4 py-2 rounded text-sm font-bold"
            >
              Logout
            </button>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto p-6">
        <h2 className="text-3xl font-bold mb-8">Welcome! 👋</h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white p-6 rounded-lg shadow-md">
            <p className="text-gray-600 text-sm">Your Drafts</p>
            <p className="text-4xl font-bold text-purple-600">{stats.drafts}</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-md">
            <p className="text-gray-600 text-sm">Total Score</p>
            <p className="text-4xl font-bold text-blue-600">{stats.score}</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-md">
            <p className="text-gray-600 text-sm">Your Rank</p>
            <p className="text-4xl font-bold text-green-600">#{userRank}</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
          <Link to="/draft" className="bg-blue-500 hover:bg-blue-600 text-white p-6 rounded-lg shadow-md text-center font-bold">
            📝 Create Draft
          </Link>
          <Link to="/drafts/editor" className="bg-green-500 hover:bg-green-600 text-white p-6 rounded-lg shadow-md text-center font-bold">
            📝 Edit Draft by Match
          </Link>
          {isAdmin && (
            <Link to="/admin" className="bg-red-500 hover:bg-red-600 text-white p-6 rounded-lg shadow-md text-center font-bold">
              ⚙️ Admin
            </Link>
          )}
        </div>

        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="bg-blue-600 text-white p-4">
            <h3 className="text-2xl font-bold">🏆 Leaderboard</h3>
          </div>
          <table className="w-full">
            <thead className="bg-gray-100 border-b">
              <tr>
                <th className="px-6 py-3 text-left">Rank</th>
                <th className="px-6 py-3 text-left">Player</th>
                <th className="px-6 py-3 text-right">Score</th>
              </tr>
            </thead>
            <tbody>
              {leaderboard.map((d, i) => (
                <tr key={d._id} className={`border-t ${d.email === userEmail ? 'bg-yellow-100 font-bold' : ''}`}>
                  <td className="px-6 py-4 font-bold">{i === 0 ? '🥇' : i === 1 ? '🥈' : i === 2 ? '🥉' : `#${i+1}`}</td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <Avatar email={d.email} size="sm" />
                      <span>{d.email}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-right font-bold text-lg text-purple-600">{d.totalScore}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

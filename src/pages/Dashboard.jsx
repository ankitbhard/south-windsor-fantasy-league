import { useNavigate, Link } from "react-router-dom"
import { useEffect, useState } from "react"

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000/api"

export default function Dashboard() {
  const navigate = useNavigate()

  const userEmail = localStorage.getItem('userEmail') || 'Guest'
  const userId = localStorage.getItem('userId')
  const token = localStorage.getItem('token')

  const [isAdmin, setIsAdmin] = useState(false)
  const [loading, setLoading] = useState(true)
  const [leaderboard, setLeaderboard] = useState([])
  const [userScore, setUserScore] = useState(0)
  const [userRank, setUserRank] = useState('-')

  // Check if user is admin and load leaderboard
  useEffect(() => {
    checkAdminStatus()
    loadLeaderboard()
    
    // Refresh leaderboard every 10 seconds
    const interval = setInterval(loadLeaderboard, 10000)
    return () => clearInterval(interval)
  }, [])

  const checkAdminStatus = async () => {
    try {
      const response = await fetch(`${API_URL}/admin/list`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })
      
      if (response.ok) {
        setIsAdmin(true)
      } else {
        setIsAdmin(false)
      }
    } catch (error) {
      console.error('Error checking admin status:', error)
      setIsAdmin(false)
    }
  }

  const loadLeaderboard = async () => {
    try {
      // Fetch all drafts
      const draftsResponse = await fetch(`${API_URL}/drafts/all`)
      if (!draftsResponse.ok) throw new Error('Failed to load drafts')
      const drafts = await draftsResponse.json()

      // Fetch all match results
      const resultsResponse = await fetch(`${API_URL}/matches/results/all`)
      if (!resultsResponse.ok) throw new Error('Failed to load results')
      const results = await resultsResponse.json()

      // Create map of match results for quick lookup
      const resultsMap = {}
      results.forEach(result => {
        resultsMap[result.matchId] = result
      })

      // Calculate scores for each draft
      const leaderboardData = drafts.map(draft => {
        let totalScore = 0

        // Check player predictions
        const players = draft.players || {}
        for (const key in players) {
          const [matchId, role] = key.split('-')
          const player = players[key]
          const result = resultsMap[parseInt(matchId)]

          if (result) {
            if (role === 'batsman' && result.batsman === player.id) {
              totalScore += 100
            } else if (role === 'bowler' && result.bowler === player.id) {
              totalScore += 50
            }
          }
        }

        // Check match winner predictions
        const winners = draft.winners || {}
        for (const matchId in winners) {
          const predictedWinner = winners[matchId]
          const result = resultsMap[parseInt(matchId)]

          if (result && result.winner === predictedWinner) {
            totalScore += 200
          }
        }

        return {
          ...draft,
          totalScore,
          playersSelected: Object.keys(players).length,
          winnersSelected: Object.keys(winners).length
        }
      })

      // Sort by score descending
      leaderboardData.sort((a, b) => b.totalScore - a.totalScore)

      // Add rank
      const rankedLeaderboard = leaderboardData.map((item, index) => ({
        ...item,
        rank: index + 1
      }))

      setLeaderboard(rankedLeaderboard)

      // Find current user's score and rank
      const currentUser = rankedLeaderboard.find(item => item.email === userEmail)
      if (currentUser) {
        setUserScore(currentUser.totalScore)
        setUserRank(currentUser.rank)
      }

      setLoading(false)
    } catch (error) {
      console.error('Error loading leaderboard:', error)
      setLoading(false)
    }
  }

  const handleLogout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('userId')
    localStorage.removeItem('userEmail')
    navigate("/")
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <nav className="bg-blue-600 text-white p-4">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <h1 className="text-2xl font-bold">Fantasy Cricket</h1>
          <div className="flex gap-4 items-center">
            <span className="text-sm">Welcome, <strong>{userEmail}</strong></span>
            {isAdmin && (
              <Link to="/admin" className="bg-red-600 hover:bg-red-700 px-3 py-1 rounded text-sm font-bold">
                ⚙️ Admin
              </Link>
            )}
            <button
              onClick={handleLogout}
              className="bg-red-500 hover:bg-red-600 px-4 py-2 rounded text-sm"
            >
              Logout
            </button>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto p-6">
        <h2 className="text-3xl font-bold mb-6">Dashboard</h2>
        
        {/* Quick Links */}
        <div className={`grid ${isAdmin ? 'grid-cols-1 md:grid-cols-5' : 'grid-cols-1 md:grid-cols-4'} gap-4 mb-8`}>
          <Link to="/draft" className="bg-white p-6 rounded-lg shadow-md cursor-pointer hover:shadow-lg transition">
            <h3 className="text-xl font-bold mb-2">📝 Create Draft</h3>
            <p className="text-gray-600">Pick players and predict match winners</p>
          </Link>
          
          <Link to="/view-draft" className="bg-white p-6 rounded-lg shadow-md cursor-pointer hover:shadow-lg transition">
            <h3 className="text-xl font-bold mb-2">📋 My Draft</h3>
            <p className="text-gray-600">View and edit your draft</p>
          </Link>

          {isAdmin && (
            <Link to="/admin-panel" className="bg-white p-6 rounded-lg shadow-md cursor-pointer hover:shadow-lg transition border-2 border-orange-400">
              <h3 className="text-xl font-bold mb-2">⚙️ Admin Panel</h3>
              <p className="text-gray-600">Add matches, manage admins</p>
            </Link>
          )}
          
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-xl font-bold mb-2">📊 Your Score</h3>
            <p className="text-3xl font-bold text-blue-600">{userScore}</p>
            <p className="text-gray-600 text-sm">Rank: #{userRank}</p>
          </div>

          {isAdmin && (
            <div className="bg-red-50 p-6 rounded-lg shadow-md border-2 border-red-200">
              <h3 className="text-xl font-bold mb-2">👤 Admin Status</h3>
              <p className="text-red-600 font-bold">✓ Admin</p>
              <p className="text-gray-600 text-sm">Full access</p>
            </div>
          )}
        </div>

        {/* Admin Notice */}
        {isAdmin && (
          <div className="bg-orange-100 border-l-4 border-orange-600 p-4 rounded-lg mb-8">
            <p className="text-orange-700 font-bold">
              👋 Welcome, Admin! You have access to the Admin Panel to add matches and update results.
            </p>
          </div>
        )}

        {/* Leaderboard */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-2xl font-bold">🏆 Leaderboard</h3>
            <button
              onClick={loadLeaderboard}
              className="bg-blue-600 text-white px-3 py-1 rounded text-sm hover:bg-blue-700"
            >
              🔄 Refresh
            </button>
          </div>
          
          {loading ? (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
              <p className="text-gray-600 mt-2">Loading leaderboard...</p>
            </div>
          ) : leaderboard.length === 0 ? (
            <p className="text-gray-600">No drafts yet. Be the first to play!</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-200">
                  <tr>
                    <th className="px-4 py-3 text-left font-bold">Rank</th>
                    <th className="px-4 py-3 text-left font-bold">Player</th>
                    <th className="px-4 py-3 text-center font-bold">Selections</th>
                    <th className="px-4 py-3 text-right font-bold">Score</th>
                  </tr>
                </thead>
                <tbody>
                  {leaderboard.slice(0, 10).map((draft) => (
                    <tr 
                      key={draft._id} 
                      className={`
                        ${draft.rank === 1 ? "bg-yellow-100" : draft.rank === 2 ? "bg-gray-100" : draft.rank === 3 ? "bg-orange-100" : "hover:bg-gray-50"}
                        ${draft.email === userEmail ? "border-l-4 border-blue-600" : ""}
                      `}
                    >
                      <td className="px-4 py-3 font-bold">
                        {draft.rank === 1 && "🥇"}
                        {draft.rank === 2 && "🥈"}
                        {draft.rank === 3 && "🥉"}
                        {draft.rank > 3 && `#${draft.rank}`}
                      </td>
                      <td className="px-4 py-3">
                        <span className="font-medium">{draft.email}</span>
                        {draft.email === userEmail && <span className="ml-2 text-xs bg-blue-500 text-white px-2 py-1 rounded">YOU</span>}
                      </td>
                      <td className="px-4 py-3 text-center">
                        <span className="bg-blue-100 text-blue-700 px-2 py-1 rounded text-sm font-bold">
                          {draft.playersSelected + draft.winnersSelected}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-right font-bold text-lg">{draft.totalScore}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {leaderboard.length > 10 && (
            <div className="text-center mt-4">
              <Link to="/leaderboard" className="text-blue-600 hover:text-blue-800 font-bold">
                View Full Leaderboard →
              </Link>
            </div>
          )}
        </div>

        {/* Scoring Information */}
        <div className="bg-blue-50 p-6 rounded-lg shadow-md mt-8">
          <h3 className="text-xl font-bold mb-4">📋 Scoring Rules</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-white p-4 rounded">
              <p className="text-gray-600 text-sm">Correct Batsman Selection</p>
              <p className="text-2xl font-bold text-green-600">+100 pts</p>
            </div>
            <div className="bg-white p-4 rounded">
              <p className="text-gray-600 text-sm">Correct Bowler Selection</p>
              <p className="text-2xl font-bold text-blue-600">+50 pts</p>
            </div>
            <div className="bg-white p-4 rounded">
              <p className="text-gray-600 text-sm">Correct Match Winner</p>
              <p className="text-2xl font-bold text-purple-600">+200 pts</p>
            </div>
          </div>
          <p className="text-gray-600 text-sm mt-4">Maximum possible: <strong>14,000 points</strong> (40 matches × 350 pts each)</p>
        </div>

        {/* Edit Window Information */}
        <div className="bg-purple-50 p-6 rounded-lg shadow-md mt-8">
          <h3 className="text-xl font-bold mb-4">⏰ Edit Window</h3>
          <div className="bg-white p-4 rounded">
            <p className="text-gray-700 mb-2">
              <strong>When can you edit your draft?</strong>
            </p>
            <p className="text-lg font-bold text-purple-600">24/7 - Available Anytime</p>
            <p className="text-gray-600 text-sm mt-2">
              You can create and edit your draft anytime. Add predictions daily and build your score incrementally!
            </p>
          </div>
        </div>

        {/* Auto-refresh info */}
        <div className="bg-purple-100 border border-purple-400 p-4 rounded-lg mt-8 text-center">
          <p className="text-purple-700 text-sm">
            🔄 Leaderboard auto-refreshes every 10 seconds
          </p>
        </div>
      </div>
    </div>
  )
}

import { useNavigate, Link } from "react-router-dom"
import { useContext } from "react"
import { DraftContext } from "../context/DraftContext"

export default function Dashboard() {
  const navigate = useNavigate()
  const { calculateScores, draftTeams } = useContext(DraftContext)

  const userEmail = localStorage.getItem('userEmail') || 'Guest'
  const userId = localStorage.getItem('userId')

  const handleLogout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('userId')
    localStorage.removeItem('userEmail')
    navigate("/")
  }

  const scores = calculateScores()
  const rankings = Object.values(scores)
    .sort((a, b) => b.totalScore - a.totalScore)
    .map((score, index) => ({ ...score, rank: index + 1 }))

  const currentUserScore = scores[userId] || { totalScore: 0, rank: '-', email: userEmail }

  return (
    <div className="min-h-screen bg-gray-100">
      <nav className="bg-blue-600 text-white p-4">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <h1 className="text-2xl font-bold">Fantasy Cricket</h1>
          <div className="flex gap-4 items-center">
            <span className="text-sm">Welcome, <strong>{userEmail}</strong></span>
            <Link to="/admin" className="bg-red-600 hover:bg-red-700 px-3 py-1 rounded text-sm">Admin</Link>
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
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <Link to="/draft" className="bg-white p-6 rounded-lg shadow-md cursor-pointer hover:shadow-lg transition">
            <h3 className="text-xl font-bold mb-2">📝 Create Draft</h3>
            <p className="text-gray-600">Pick players and predict match winners</p>
          </Link>
          
          <Link to="/view-draft" className="bg-white p-6 rounded-lg shadow-md cursor-pointer hover:shadow-lg transition">
            <h3 className="text-xl font-bold mb-2">📋 My Draft</h3>
            <p className="text-gray-600">View and edit your draft</p>
          </Link>

          <Link to="/admin-panel" className="bg-white p-6 rounded-lg shadow-md cursor-pointer hover:shadow-lg transition">
            <h3 className="text-xl font-bold mb-2">⚙️ Admin Panel</h3>
            <p className="text-gray-600">Add matches, manage admins</p>
          </Link>
          
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-xl font-bold mb-2">📊 Your Score</h3>
            <p className="text-3xl font-bold text-blue-600">{currentUserScore.totalScore}</p>
            <p className="text-gray-600 text-sm">points</p>
          </div>
        </div>

        {/* Current User Draft Status */}
        {draftTeams.find(d => d.userId === userId) ? (
          <div className="bg-green-100 border border-green-400 p-4 rounded-lg mb-8">
            <p className="text-green-700">
              ✓ <strong>You have a draft saved!</strong> You can edit it during the edit window (6PM-12AM).
            </p>
          </div>
        ) : (
          <div className="bg-yellow-100 border border-yellow-400 p-4 rounded-lg mb-8">
            <p className="text-yellow-700">
              ⚠ You haven't created a draft yet. <Link to="/draft" className="font-bold underline">Click here to start</Link>
            </p>
          </div>
        )}

        {/* Leaderboard */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-2xl font-bold mb-4">🏆 Leaderboard</h3>
          
          {rankings.length === 0 ? (
            <p className="text-gray-600">No drafts yet. Be the first to play!</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-200">
                  <tr>
                    <th className="px-4 py-3 text-left">Rank</th>
                    <th className="px-4 py-3 text-left">Email</th>
                    <th className="px-4 py-3 text-right">Score</th>
                    <th className="px-4 py-3 text-right">Joined</th>
                  </tr>
                </thead>
                <tbody>
                  {rankings.map((score) => (
                    <tr 
                      key={score.userId} 
                      className={`
                        ${score.rank === 1 ? "bg-yellow-100" : score.rank === 2 ? "bg-gray-100" : score.rank === 3 ? "bg-orange-100" : "hover:bg-gray-50"}
                        ${score.userId === userId ? "border-l-4 border-blue-600" : ""}
                      `}
                    >
                      <td className="px-4 py-3 font-bold">
                        {score.rank === 1 && "🥇"}
                        {score.rank === 2 && "🥈"}
                        {score.rank === 3 && "🥉"}
                        {score.rank > 3 && `#${score.rank}`}
                      </td>
                      <td className="px-4 py-3">
                        <span className="font-medium">{score.email}</span>
                        {score.userId === userId && <span className="ml-2 text-xs bg-blue-500 text-white px-2 py-1 rounded">YOU</span>}
                      </td>
                      <td className="px-4 py-3 text-right font-bold text-lg">{score.totalScore}</td>
                      <td className="px-4 py-3 text-right text-sm text-gray-600">
                        {new Date(score.createdAt).toLocaleDateString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
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
          <p className="text-gray-600 text-sm mt-4">Maximum possible: <strong>3,500 points</strong> (10 matches × 350 pts each)</p>
        </div>

        {/* Edit Window Information */}
        <div className="bg-purple-50 p-6 rounded-lg shadow-md mt-8">
          <h3 className="text-xl font-bold mb-4">⏰ Edit Window</h3>
          <div className="bg-white p-4 rounded">
            <p className="text-gray-700 mb-2">
              <strong>When can you edit your draft?</strong>
            </p>
            <p className="text-lg font-bold text-purple-600">6:00 PM - 12:00 AM (Midnight)</p>
            <p className="text-gray-600 text-sm mt-2">
              You can create a draft anytime, but editing is only allowed during the edit window. Outside this time, your draft is locked.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

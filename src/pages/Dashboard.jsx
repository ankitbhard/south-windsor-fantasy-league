import { useNavigate, Link } from "react-router-dom"
import { useContext } from "react"
import { DraftContext } from "../context/DraftContext"

export default function Dashboard() {
  const navigate = useNavigate()
  const { calculateScores, draftTeams } = useContext(DraftContext)

  const handleLogout = () => {
    navigate("/")
  }

  const scores = calculateScores()
  const rankings = Object.values(scores)
    .sort((a, b) => b.totalScore - a.totalScore)
    .map((score, index) => ({ ...score, rank: index + 1 }))

  return (
    <div className="min-h-screen bg-gray-100">
      <nav className="bg-blue-600 text-white p-4">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <h1 className="text-2xl font-bold">Fantasy Cricket</h1>
          <div className="flex gap-4">
            <Link to="/admin" className="bg-red-600 hover:bg-red-700 px-4 py-2 rounded">Admin</Link>
            <button
              onClick={handleLogout}
              className="bg-red-500 hover:bg-red-600 px-4 py-2 rounded"
            >
              Logout
            </button>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto p-6">
        <h2 className="text-3xl font-bold mb-6">Dashboard</h2>
        
        {/* Quick Links */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <Link to="/draft" className="bg-white p-6 rounded-lg shadow-md cursor-pointer hover:shadow-lg">
            <h3 className="text-xl font-bold mb-2">Draft</h3>
            <p className="text-gray-600">Create and manage your fantasy team</p>
          </Link>
          
          <Link to="/team" className="bg-white p-6 rounded-lg shadow-md cursor-pointer hover:shadow-lg">
            <h3 className="text-xl font-bold mb-2">Team</h3>
            <p className="text-gray-600">View your teams and squads</p>
          </Link>
          
          <div className="bg-white p-6 rounded-lg shadow-md cursor-pointer hover:shadow-lg">
            <h3 className="text-xl font-bold mb-2">Matches</h3>
            <p className="text-gray-600">View upcoming matches</p>
          </div>
        </div>

        {/* Rankings */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-2xl font-bold mb-4">🏆 Leaderboard</h3>
          
          {rankings.length === 0 ? (
            <p className="text-gray-600">No drafts yet. Start playing!</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-200">
                  <tr>
                    <th className="px-4 py-2 text-left">Rank</th>
                    <th className="px-4 py-2 text-left">Player ID</th>
                    <th className="px-4 py-2 text-right">Score</th>
                  </tr>
                </thead>
                <tbody>
                  {rankings.map((score) => (
                    <tr key={score.userId} className={score.rank === 1 ? "bg-yellow-100" : "hover:bg-gray-50"}>
                      <td className="px-4 py-3 font-bold">
                        {score.rank === 1 && "🥇"}
                        {score.rank === 2 && "🥈"}
                        {score.rank === 3 && "🥉"}
                        {score.rank > 3 && `#${score.rank}`}
                      </td>
                      <td className="px-4 py-3">{score.userId}</td>
                      <td className="px-4 py-3 text-right font-bold text-lg">{score.totalScore}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
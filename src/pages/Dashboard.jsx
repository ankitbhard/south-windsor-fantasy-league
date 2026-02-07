import { useEffect, useState } from "react"
import { Link, useNavigate } from "react-router-dom"

const API_URL = "https://fantasy-cricket-api-4a1225a6b78d.herokuapp.com/api"

export default function Dashboard() {
  const navigate = useNavigate()
  const [user, setUser] = useState(null)
  const [stats, setStats] = useState({ drafts: 0, score: 0 })
  const [loading, setLoading] = useState(true)

  const userEmail = localStorage.getItem('userEmail')
  const token = localStorage.getItem('token')

  useEffect(() => {
    if (!token) {
      navigate('/login')
      return
    }
    loadStats()
  }, [token, navigate])

  const loadStats = async () => {
    try {
      const draftsResponse = await fetch(`${API_URL}/drafts/all`)
      if (!draftsResponse.ok) throw new Error('Failed to load drafts')
      const drafts = await draftsResponse.json()

      const userDrafts = drafts.filter(d => d.email === userEmail)
      
      setStats({
        drafts: userDrafts.length,
        score: userDrafts.reduce((sum, d) => sum + (d.totalScore || 0), 0)
      })
      setLoading(false)
    } catch (err) {
      console.error('Error loading stats:', err)
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <nav className="bg-gradient-to-r from-purple-600 to-pink-600 text-white p-4 shadow-lg">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <h1 className="text-2xl font-bold">🏏 Fantasy Cricket</h1>
          <div className="flex gap-4 items-center">
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
            <p className="text-gray-600 text-sm">Rank</p>
            <p className="text-4xl font-bold text-green-600">#1</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Link to="/draft" className="bg-blue-500 hover:bg-blue-600 text-white p-6 rounded-lg shadow-md text-center font-bold">
            📝 Create Draft
          </Link>
          <Link to="/leaderboard" className="bg-purple-500 hover:bg-purple-600 text-white p-6 rounded-lg shadow-md text-center font-bold">
            🏆 Leaderboard
          </Link>
          <Link to="/admin" className="bg-red-500 hover:bg-red-600 text-white p-6 rounded-lg shadow-md text-center font-bold">
            ⚙️ Admin
          </Link>
          <button onClick={handleLogout} className="bg-gray-500 hover:bg-gray-600 text-white p-6 rounded-lg shadow-md text-center font-bold">
            🚪 Logout
          </button>
        </div>
      </div>
    </div>
  )
}

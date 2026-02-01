import { useState, useContext } from "react"
import { Link } from "react-router-dom"
import { DraftContext } from "../context/DraftContext"

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000/api"

export default function AdminPanel() {
  const token = localStorage.getItem('token')
  const userEmail = localStorage.getItem('userEmail')
  
  const [activeTab, setActiveTab] = useState('matches')
  const [team1, setTeam1] = useState('')
  const [team2, setTeam2] = useState('')
  const [newAdminEmail, setNewAdminEmail] = useState('')
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')
  const [admins, setAdmins] = useState([])
  const [loading, setLoading] = useState(false)

  // Load admins on mount
  const loadAdmins = async () => {
    try {
      const response = await fetch(`${API_URL}/admin/list`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })
      const data = await response.json()
      if (response.ok) {
        setAdmins(data)
      }
    } catch (error) {
      console.error('Error loading admins:', error)
    }
  }

  // Add new match
  const handleAddMatch = async (e) => {
    e.preventDefault()
    setError('')
    setMessage('')
    setLoading(true)

    try {
      const response = await fetch(`${API_URL}/matches/add`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          team1,
          team2,
          matchDate: new Date()
        })
      })

      const data = await response.json()

      if (!response.ok) {
        setError(data.error || 'Failed to add match')
        return
      }

      setMessage(`✓ Match ${data.match.matchId} added: ${team1} vs ${team2}`)
      setTeam1('')
      setTeam2('')
    } catch (error) {
      setError('Error adding match: ' + error.message)
    } finally {
      setLoading(false)
    }
  }

  // Add new admin
  const handleAddAdmin = async (e) => {
    e.preventDefault()
    setError('')
    setMessage('')
    setLoading(true)

    try {
      const response = await fetch(`${API_URL}/admin/add`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          email: newAdminEmail,
          role: 'admin'
        })
      })

      const data = await response.json()

      if (!response.ok) {
        setError(data.error || 'Failed to add admin')
        return
      }

      setMessage(`✓ Admin ${newAdminEmail} added successfully`)
      setNewAdminEmail('')
      loadAdmins()
    } catch (error) {
      setError('Error adding admin: ' + error.message)
    } finally {
      setLoading(false)
    }
  }

  // Remove admin
  const handleRemoveAdmin = async (email) => {
    if (!window.confirm(`Remove ${email} as admin?`)) return

    try {
      const response = await fetch(`${API_URL}/admin/remove/${email}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })

      const data = await response.json()

      if (!response.ok) {
        setError(data.error)
        return
      }

      setMessage(`✓ Admin ${email} removed`)
      loadAdmins()
    } catch (error) {
      setError('Error removing admin: ' + error.message)
    }
  }

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Navigation */}
      <nav className="bg-red-600 text-white p-4">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <Link to="/dashboard" className="text-white hover:text-gray-200">← Back to Dashboard</Link>
          <h1 className="text-2xl font-bold">Admin Panel</h1>
          <div className="text-sm">{userEmail}</div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="max-w-6xl mx-auto p-6">
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

        {/* Tabs */}
        <div className="flex gap-4 mb-6">
          <button
            onClick={() => { setActiveTab('matches'); setMessage(''); setError('') }}
            className={`px-6 py-2 rounded font-bold ${
              activeTab === 'matches'
                ? 'bg-blue-600 text-white'
                : 'bg-white text-gray-700 border border-gray-300'
            }`}
          >
            Add Matches
          </button>
          <button
            onClick={() => { setActiveTab('admins'); setMessage(''); setError(''); loadAdmins() }}
            className={`px-6 py-2 rounded font-bold ${
              activeTab === 'admins'
                ? 'bg-blue-600 text-white'
                : 'bg-white text-gray-700 border border-gray-300'
            }`}
          >
            Manage Admins
          </button>
        </div>

        {/* Add Matches Tab */}
        {activeTab === 'matches' && (
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-2xl font-bold mb-6">Add New Match</h2>
            
            <form onSubmit={handleAddMatch} className="space-y-4 max-w-md">
              <div>
                <label className="block text-sm font-medium mb-2">Team 1</label>
                <input
                  type="text"
                  value={team1}
                  onChange={(e) => setTeam1(e.target.value)}
                  placeholder="e.g., India"
                  className="w-full border border-gray-300 px-3 py-2 rounded focus:outline-none focus:ring focus:ring-blue-300"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Team 2</label>
                <input
                  type="text"
                  value={team2}
                  onChange={(e) => setTeam2(e.target.value)}
                  placeholder="e.g., Pakistan"
                  className="w-full border border-gray-300 px-3 py-2 rounded focus:outline-none focus:ring focus:ring-blue-300"
                  required
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-green-600 text-white py-2 rounded hover:bg-green-700 font-bold disabled:opacity-50"
              >
                {loading ? 'Adding...' : 'Add Match'}
              </button>
            </form>

            <div className="mt-6 p-4 bg-blue-50 rounded">
              <p className="text-sm text-gray-700">
                <strong>Tip:</strong> Matches are automatically assigned IDs (11, 12, 13, etc.)
              </p>
            </div>
          </div>
        )}

        {/* Manage Admins Tab */}
        {activeTab === 'admins' && (
          <div className="space-y-6">
            {/* Add Admin Form */}
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h2 className="text-2xl font-bold mb-6">Add New Admin</h2>
              
              <form onSubmit={handleAddAdmin} className="space-y-4 max-w-md">
                <div>
                  <label className="block text-sm font-medium mb-2">Email</label>
                  <input
                    type="email"
                    value={newAdminEmail}
                    onChange={(e) => setNewAdminEmail(e.target.value)}
                    placeholder="admin@example.com"
                    className="w-full border border-gray-300 px-3 py-2 rounded focus:outline-none focus:ring focus:ring-blue-300"
                    required
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-green-600 text-white py-2 rounded hover:bg-green-700 font-bold disabled:opacity-50"
                >
                  {loading ? 'Adding...' : 'Add Admin'}
                </button>
              </form>
            </div>

            {/* Admins List */}
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h2 className="text-2xl font-bold mb-6">Current Admins</h2>
              
              {admins.length === 0 ? (
                <p className="text-gray-600">No admins found</p>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gray-200">
                      <tr>
                        <th className="px-4 py-2 text-left">Email</th>
                        <th className="px-4 py-2 text-left">Role</th>
                        <th className="px-4 py-2 text-left">Created</th>
                        <th className="px-4 py-2 text-left">Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {admins.map((admin) => (
                        <tr key={admin._id} className="border-b hover:bg-gray-50">
                          <td className="px-4 py-3">{admin.email}</td>
                          <td className="px-4 py-3">
                            <span className={`px-3 py-1 rounded text-sm ${
                              admin.role === 'super_admin'
                                ? 'bg-purple-100 text-purple-800'
                                : 'bg-blue-100 text-blue-800'
                            }`}>
                              {admin.role}
                            </span>
                          </td>
                          <td className="px-4 py-3 text-sm">
                            {new Date(admin.createdAt).toLocaleDateString()}
                          </td>
                          <td className="px-4 py-3">
                            {admin.role !== 'super_admin' && (
                              <button
                                onClick={() => handleRemoveAdmin(admin.email)}
                                className="text-red-600 hover:text-red-800 text-sm font-bold"
                              >
                                Remove
                              </button>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

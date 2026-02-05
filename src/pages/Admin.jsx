import { useState, useEffect } from "react"
import { Link, useNavigate } from "react-router-dom"

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000/api"

export default function Admin() {
  const navigate = useNavigate()
  const token = localStorage.getItem('token')
  const userEmail = localStorage.getItem('userEmail')

  const [matches, setMatches] = useState([])
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(true)
  const [formData, setFormData] = useState({})

  // Complete player list - SAME AS DRAFT.JSX
  const allPlayers = {
    India: [
      { id: 1, name: "Virat Kohli", role: "batsman" },
      { id: 2, name: "Rohit Sharma", role: "batsman" },
      { id: 3, name: "Suryakumar Yadav", role: "batsman" },
      { id: 4, name: "Hardik Pandya", role: "batsman" },
      { id: 5, name: "Axar Patel", role: "batsman" },
      { id: 6, name: "Jasprit Bumrah", role: "bowler" },
      { id: 7, name: "Yuzvendra Chahal", role: "bowler" },
      { id: 8, name: "Mohammed Siraj", role: "bowler" }
    ],
    Pakistan: [
      { id: 9, name: "Babar Azam", role: "batsman" },
      { id: 10, name: "Fakhar Zaman", role: "batsman" },
      { id: 11, name: "Shan Masood", role: "batsman" },
      { id: 12, name: "Mohammad Rizwan", role: "batsman" },
      { id: 13, name: "Shaheen Afridi", role: "bowler" },
      { id: 14, name: "Hasan Ali", role: "bowler" },
      { id: 15, name: "Naseem Shah", role: "bowler" }
    ],
    Australia: [
      { id: 16, name: "Steve Smith", role: "batsman" },
      { id: 17, name: "David Warner", role: "batsman" },
      { id: 18, name: "Aaron Finch", role: "batsman" },
      { id: 19, name: "Glenn Maxwell", role: "batsman" },
      { id: 20, name: "Pat Cummins", role: "bowler" },
      { id: 21, name: "Josh Hazlewood", role: "bowler" },
      { id: 22, name: "Mitchell Starc", role: "bowler" }
    ],
    "South Africa": [
      { id: 23, name: "Aiden Markram", role: "batsman" },
      { id: 24, name: "Reeza Hendricks", role: "batsman" },
      { id: 25, name: "Heinrich Klaasen", role: "batsman" },
      { id: 26, name: "David Miller", role: "batsman" },
      { id: 27, name: "Anrich Nortje", role: "bowler" },
      { id: 28, name: "Kagiso Rabada", role: "bowler" },
      { id: 29, name: "Gerald Coetzee", role: "bowler" }
    ],
    England: [
      { id: 30, name: "Jos Buttler", role: "batsman" },
      { id: 31, name: "Liam Livingstone", role: "batsman" },
      { id: 32, name: "Dawid Malan", role: "batsman" },
      { id: 33, name: "Harry Brook", role: "batsman" },
      { id: 34, name: "Jofra Archer", role: "bowler" },
      { id: 35, name: "Adil Rashid", role: "bowler" },
      { id: 36, name: "Reece Topley", role: "bowler" }
    ],
    "West Indies": [
      { id: 37, name: "Nicholas Pooran", role: "batsman" },
      { id: 38, name: "Roston Chase", role: "batsman" },
      { id: 39, name: "Shai Hope", role: "batsman" },
      { id: 40, name: "Shimron Hetmyer", role: "batsman" },
      { id: 41, name: "Romesh Shepherd", role: "bowler" },
      { id: 42, name: "Akeal Hosein", role: "bowler" },
      { id: 43, name: "Alzarri Joseph", role: "bowler" }
    ],
    "Sri Lanka": [
      { id: 44, name: "Angelo Mathews", role: "batsman" },
      { id: 45, name: "Pathum Nissanka", role: "batsman" },
      { id: 46, name: "Kusal Mendis", role: "batsman" },
      { id: 47, name: "Dhananjaya de Silva", role: "batsman" },
      { id: 48, name: "Wanindu Hasaranga", role: "bowler" },
      { id: 49, name: "Lahiru Kumara", role: "bowler" },
      { id: 50, name: "Maheesh Theekshana", role: "bowler" }
    ],
    Afghanistan: [
      { id: 51, name: "Mohammad Nabi", role: "batsman" },
      { id: 52, name: "Rahmanullah Gurbaz", role: "batsman" },
      { id: 53, name: "Asghar Afghan", role: "batsman" },
      { id: 54, name: "Ibrahim Zadran", role: "batsman" },
      { id: 55, name: "Rashid Khan", role: "bowler" },
      { id: 56, name: "Naveen-ul-Haq", role: "bowler" },
      { id: 57, name: "Mujeeb Ur Rahman", role: "bowler" }
    ],
    "New Zealand": [
      { id: 58, name: "Kane Williamson", role: "batsman" },
      { id: 59, name: "Devon Conway", role: "batsman" },
      { id: 60, name: "Mark Chapman", role: "batsman" },
      { id: 61, name: "Daryl Mitchell", role: "batsman" },
      { id: 62, name: "Tim Southee", role: "bowler" },
      { id: 63, name: "Trent Boult", role: "bowler" },
      { id: 64, name: "Ish Sodhi", role: "bowler" }
    ],
    "United States": [
      { id: 65, name: "Aaron Jones", role: "batsman" },
      { id: 66, name: "Ishan Malhotra", role: "batsman" },
      { id: 67, name: "Steven Taylor", role: "batsman" },
      { id: 68, name: "Corey Anderson", role: "batsman" },
      { id: 69, name: "Ali Khan", role: "bowler" },
      { id: 70, name: "Harmeet Singh", role: "bowler" },
      { id: 71, name: "Saurabh Netravalkar", role: "bowler" }
    ],
    Scotland: [
      { id: 72, name: "Kyle Coetzer", role: "batsman" },
      { id: 73, name: "Richie Berrington", role: "batsman" },
      { id: 74, name: "Calum MacLeod", role: "batsman" },
      { id: 75, name: "George Munsey", role: "batsman" },
      { id: 76, name: "Mark Watt", role: "bowler" },
      { id: 77, name: "Chris Sole", role: "bowler" },
      { id: 78, name: "Safyaan Sharif", role: "bowler" }
    ],
    Ireland: [
      { id: 79, name: "Andrew Balbirnie", role: "batsman" },
      { id: 80, name: "Paul Stirling", role: "batsman" },
      { id: 81, name: "Lorcan Tucker", role: "batsman" },
      { id: 82, name: "Harry Tector", role: "batsman" },
      { id: 83, name: "Josh Little", role: "bowler" },
      { id: 84, name: "Mark Adair", role: "bowler" },
      { id: 85, name: "Barry McCarthy", role: "bowler" }
    ],
    Namibia: [
      { id: 86, name: "Stephen Baard", role: "batsman" },
      { id: 87, name: "Craig Williams", role: "batsman" },
      { id: 88, name: "Zane Green", role: "batsman" },
      { id: 89, name: "Jan Frylinck", role: "batsman" },
      { id: 90, name: "Bernard Scholtz", role: "bowler" },
      { id: 91, name: "Ruben van Heerden", role: "bowler" },
      { id: 92, name: "Tangeni Lungameni", role: "bowler" }
    ],
    Netherlands: [
      { id: 93, name: "Max O'Dowd", role: "batsman" },
      { id: 94, name: "Vikram Singh", role: "batsman" },
      { id: 95, name: "Bas de Leede", role: "batsman" },
      { id: 96, name: "Tom Cooper", role: "batsman" },
      { id: 97, name: "Paul van Meekeren", role: "bowler" },
      { id: 98, name: "Roelof van der Merwe", role: "bowler" },
      { id: 99, name: "Fred Klaassen", role: "bowler" }
    ],
    Zimbabwe: [
      { id: 100, name: "Craig Ervine", role: "batsman" },
      { id: 101, name: "Regis Chakabva", role: "batsman" },
      { id: 102, name: "Sean Williams", role: "batsman" },
      { id: 103, name: "Sikandar Raza", role: "batsman" },
      { id: 104, name: "Blessing Muzarabani", role: "bowler" },
      { id: 105, name: "Luke Jongwe", role: "bowler" },
      { id: 106, name: "Donald Tiripano", role: "bowler" }
    ],
    Oman: [
      { id: 107, name: "Jatinder Singh", role: "batsman" },
      { id: 108, name: "Aqib Ilyas", role: "batsman" },
      { id: 109, name: "Kashyap Prajapati", role: "batsman" },
      { id: 110, name: "Sameet Patel", role: "batsman" },
      { id: 111, name: "Bilal Khan", role: "bowler" },
      { id: 112, name: "Kaleemullah Khan", role: "bowler" },
      { id: 113, name: "Fayyaz Butt", role: "bowler" }
    ],
    Canada: [
      { id: 114, name: "Aaron Johnson", role: "batsman" },
      { id: 115, name: "Saad Bin Zafar", role: "batsman" },
      { id: 116, name: "Rizwan Cheema", role: "batsman" },
      { id: 117, name: "Nikhil Dutta", role: "batsman" },
      { id: 118, name: "Khalid Ahmadullah", role: "bowler" },
      { id: 119, name: "Jeremy Gordon", role: "bowler" },
      { id: 120, name: "Junaid Siddiqui", role: "bowler" }
    ],
    Nepal: [
      { id: 121, name: "Rohit Paudel", role: "batsman" },
      { id: 122, name: "Gyanendra Malla", role: "batsman" },
      { id: 123, name: "Anil Sah", role: "batsman" },
      { id: 124, name: "Dipendra Singh Airee", role: "batsman" },
      { id: 125, name: "Sompal Kami", role: "bowler" },
      { id: 126, name: "Sandeep Lamichhane", role: "bowler" },
      { id: 127, name: "Abinash Bohara", role: "bowler" }
    ],
    Italy: [
      { id: 128, name: "Alessandro Campagna", role: "batsman" },
      { id: 129, name: "Gianluca Navarrete", role: "batsman" },
      { id: 130, name: "Paul Stirling", role: "batsman" },
      { id: 131, name: "Varun Chopra", role: "batsman" },
      { id: 132, name: "Jaspreet Singh", role: "bowler" },
      { id: 133, name: "Aftab Alam", role: "bowler" },
      { id: 134, name: "George Garrett", role: "bowler" }
    ],
    "United Arab Emirates": [
      { id: 135, name: "Muhammad Waseem", role: "batsman" },
      { id: 136, name: "Aryan Lakra", role: "batsman" },
      { id: 137, name: "Babar Hayat", role: "batsman" },
      { id: 138, name: "Vriitya Aravind", role: "batsman" },
      { id: 139, name: "Zahoor Khan", role: "bowler" },
      { id: 140, name: "Karthik Meiyappan", role: "bowler" },
      { id: 141, name: "Ahmed Raza", role: "bowler" }
    ]
  }

  useEffect(() => {
    loadMatches()
  }, [])

  const loadMatches = async () => {
    try {
      const response = await fetch(`${API_URL}/matches`)
      if (!response.ok) throw new Error('Failed to load matches')
      const data = await response.json()
      setMatches(data)
      setLoading(false)
    } catch (err) {
      setError('Error loading matches: ' + err.message)
      setLoading(false)
    }
  }

  const handleInputChange = (matchId, field, value) => {
    setFormData(prev => ({
      ...prev,
      [matchId]: {
        ...prev[matchId],
        [field]: value
      }
    }))
  }

const handleSaveResult = async (matchId) => {
  const data = formData[matchId]

  if (!data || !data.batsman || !data.bowler || !data.winner) {
    setError(`Match ${matchId}: Please fill all fields`)
    setTimeout(() => setError(''), 3000)
    return
  }

  setLoading(true)
  setError('')
  setMessage('')

  try {
    const url = `${API_URL}/matches/result/${matchId}`
    console.log('Making request to:', url)
    console.log('Body:', {
      batsman: parseInt(data.batsman),
      bowler: parseInt(data.bowler),
      winner: data.winner
    })

    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({
        batsman: parseInt(data.batsman),
        bowler: parseInt(data.bowler),
        winner: data.winner
      })
    })

    const result = await response.json()
    console.log('Response:', result, 'Status:', response.status)

    if (!response.ok) {
      throw new Error(result.error || 'Failed to save result')
    }

    setMessage(`✓ Match ${matchId} result saved!`)
    
    // Clear form for this match
    setFormData(prev => {
      const updated = { ...prev }
      delete updated[matchId]
      return updated
    })

    // Reload after 1.5 seconds
    setTimeout(() => {
      loadMatches()
    }, 1500)
  } catch (err) {
    console.error('Error saving result:', err)
    setError(err.message)
  } finally {
    setLoading(false)
  }
}

  const getBatsmen = () => {
    const allBatsmen = []
    Object.values(allPlayers).forEach(team => {
      team.forEach(player => {
        if (player.role === 'batsman') allBatsmen.push(player)
      })
    })
    return allBatsmen
  }

  const getBowlers = () => {
    const allBowlers = []
    Object.values(allPlayers).forEach(team => {
      team.forEach(player => {
        if (player.role === 'bowler') allBowlers.push(player)
      })
    })
    return allBowlers
  }

  const getPlayerName = (id) => {
    for (const team of Object.values(allPlayers)) {
      const player = team.find(p => p.id === id)
      if (player) return player.name
    }
    return 'Unknown'
  }

  const handleLogout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('userId')
    localStorage.removeItem('userEmail')
    navigate("/")
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
      <nav className="bg-red-600 text-white p-4">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <Link to="/dashboard" className="text-white hover:text-gray-200">← Back</Link>
          <h1 className="text-2xl font-bold">Admin - Match Results</h1>
          <div className="flex gap-2">
            <span className="text-sm">{userEmail}</span>
            <button onClick={handleLogout} className="bg-red-700 px-3 py-1 rounded text-sm">
              Logout
            </button>
          </div>
        </div>
      </nav>

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
          <div className="bg-white p-8 rounded-lg shadow-md text-center">
            <p className="text-gray-600 mb-4">No matches yet</p>
            <Link to="/admin-panel" className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700">
              Add Matches
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {matches.map(match => (
              <div key={match.matchId} className="bg-white p-6 rounded-lg shadow-md">
                <h3 className="text-xl font-bold mb-6 pb-4 border-b">
                  Match {match.matchId}
                </h3>

                <div className="space-y-4">
                  {/* Team Names */}
                  <div className="grid grid-cols-2 gap-4 mb-6 p-4 bg-blue-50 rounded">
                    <div className="text-center">
                      <p className="font-bold text-lg">{match.team1}</p>
                    </div>
                    <div className="text-center">
                      <p className="font-bold text-lg">{match.team2}</p>
                    </div>
                  </div>

                  {/* Batsman */}
                  <div>
                    <label className="block text-sm font-bold mb-2">🏏 Best Batsman (+100 pts)</label>
                    <select
                      value={formData[match.matchId]?.batsman || ''}
                      onChange={(e) => handleInputChange(match.matchId, 'batsman', e.target.value)}
                      className="w-full border-2 border-gray-300 px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-green-400"
                    >
                      <option value="">Select...</option>
                      {getBatsmen().map(p => (
                        <option key={p.id} value={p.id}>
                          {p.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Bowler */}
                  <div>
                    <label className="block text-sm font-bold mb-2">🎯 Best Bowler (+50 pts)</label>
                    <select
                      value={formData[match.matchId]?.bowler || ''}
                      onChange={(e) => handleInputChange(match.matchId, 'bowler', e.target.value)}
                      className="w-full border-2 border-gray-300 px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-green-400"
                    >
                      <option value="">Select...</option>
                      {getBowlers().map(p => (
                        <option key={p.id} value={p.id}>
                          {p.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Winner */}
                  <div>
                    <label className="block text-sm font-bold mb-2">🏆 Match Winner (+200 pts)</label>
                    <div className="grid grid-cols-2 gap-2">
                      <button
                        onClick={() => handleInputChange(match.matchId, 'winner', match.team1)}
                        className={`py-2 px-4 rounded font-bold transition ${
                          formData[match.matchId]?.winner === match.team1
                            ? 'bg-green-600 text-white'
                            : 'bg-gray-200 hover:bg-gray-300'
                        }`}
                      >
                        {match.team1}
                      </button>
                      <button
                        onClick={() => handleInputChange(match.matchId, 'winner', match.team2)}
                        className={`py-2 px-4 rounded font-bold transition ${
                          formData[match.matchId]?.winner === match.team2
                            ? 'bg-green-600 text-white'
                            : 'bg-gray-200 hover:bg-gray-300'
                        }`}
                      >
                        {match.team2}
                      </button>
                    </div>
                  </div>

                  {/* Save Button */}
                  <button
                    onClick={() => handleSaveResult(match.matchId)}
                    disabled={loading || !formData[match.matchId]?.batsman || !formData[match.matchId]?.bowler || !formData[match.matchId]?.winner}
                    className="w-full mt-4 bg-green-600 text-white py-3 rounded font-bold hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {loading ? 'Saving...' : '✓ Save Result (350 pts)'}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Info Box */}
        <div className="mt-8 bg-blue-50 p-6 rounded-lg">
          <h3 className="text-lg font-bold mb-4">Points</h3>
          <div className="grid grid-cols-3 gap-4">
            <div>
              <p className="text-sm text-gray-600">Batsman</p>
              <p className="text-2xl font-bold text-green-600">100</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Bowler</p>
              <p className="text-2xl font-bold text-blue-600">50</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Winner</p>
              <p className="text-2xl font-bold text-purple-600">200</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

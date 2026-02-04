import { useContext, useEffect, useState } from "react"
import { useNavigate, Link } from "react-router-dom"
import { DraftContext } from "../context/DraftContext"

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000/api"

export default function Draft() {
  const navigate = useNavigate()
  const { saveDraft, getUserDraft } = useContext(DraftContext)

  const userId = localStorage.getItem('userId')
  const userEmail = localStorage.getItem('userEmail')
  const token = localStorage.getItem('token')

  const [matches, setMatches] = useState([])
  const [selections, setSelections] = useState({})
  const [winners, setWinners] = useState({})
  const [loading, setLoading] = useState(true)
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')
  const [canEdit, setCanEdit] = useState(true)

  // T20 World Cup 2025-26 Teams and Players
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

  // Load matches and existing draft
  useEffect(() => {
    loadMatches()
    checkEditWindow()
  }, [])

  const checkEditWindow = () => {
    const now = new Date()
    const hour = now.getHours()
    const isOpen = hour >= 18 || hour < 0
    setCanEdit(isOpen)
  }

  const loadMatches = async () => {
    try {
      const response = await fetch(`${API_URL}/matches`)
      const data = await response.json()
      setMatches(data)

      // Load existing draft if available
      const existingDraft = getUserDraft(userId)
      if (existingDraft) {
        setSelections(existingDraft.players || {})
        setWinners(existingDraft.winners || {})
      }

      setLoading(false)
    } catch (error) {
      setError('Error loading matches: ' + error.message)
      setLoading(false)
    }
  }

  // Get players from both teams in a match
  const getPlayersForMatch = (team1, team2, role) => {
    const team1Players = allPlayers[team1]?.filter(p => p.role === role) || []
    const team2Players = allPlayers[team2]?.filter(p => p.role === role) || []
    return [...team1Players, ...team2Players]
  }

  // Check if player is already selected
  const isPlayerSelected = (playerId) => {
    return Object.values(selections).some(selection => selection && selection.id === playerId)
  }

  const handlePlayerSelect = (matchId, role, playerId, playerName, team) => {
    setSelections(prev => ({
      ...prev,
      [`${matchId}-${role}`]: { id: playerId, name: playerName, team }
    }))
  }

  const handleWinnerSelect = (matchId, winner) => {
    setWinners(prev => ({
      ...prev,
      [matchId]: winner
    }))
  }

  const handleSaveDraft = async () => {
    if (!canEdit) {
      setError('Edit window closed. You can only edit between 6PM-12AM')
      return
    }

    // Validation
    const selectedPlayerCount = Object.keys(selections).length
    const selectedWinnersCount = Object.keys(winners).length

    if (selectedPlayerCount < matches.length * 2) {
      setError(`Please select all players. Selected: ${selectedPlayerCount}/${matches.length * 2}`)
      return
    }

    if (selectedWinnersCount < matches.length) {
      setError(`Please predict all winners. Predicted: ${selectedWinnersCount}/${matches.length}`)
      return
    }

    setLoading(true)
    try {
      await saveDraft(userId, { players: selections, winners })
      setMessage('✓ Draft saved successfully!')
      setTimeout(() => navigate('/view-draft'), 2000)
    } catch (error) {
      setError('Error saving draft: ' + error.message)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="text-center">
          <p className="text-xl font-bold mb-4">Loading matches...</p>
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
        </div>
      </div>
    )
  }

  const selectedPlayerCount = Object.keys(selections).length
  const selectedWinnersCount = Object.keys(winners).length
  const totalRequired = matches.length * 2 + matches.length

  return (
    <div className="min-h-screen bg-gray-100">
      <nav className="bg-blue-600 text-white p-4">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <Link to="/dashboard" className="text-white hover:text-gray-200">← Back to Dashboard</Link>
          <h1 className="text-2xl font-bold">Create Your Draft</h1>
          <div className="text-sm">{userEmail}</div>
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

        {!canEdit && (
          <div className="mb-4 p-4 bg-yellow-100 border border-yellow-400 text-yellow-700 rounded">
            ⚠️ Edit window closed! You can only edit between 6PM-12AM. Current draft is saved but locked.
          </div>
        )}

        {/* Progress Bar */}
        <div className="bg-white p-6 rounded-lg shadow-md mb-6">
          <h3 className="text-lg font-bold mb-4">Progress</h3>
          <div className="space-y-3">
            <div>
              <p className="text-sm font-medium mb-1">Players Selected: {selectedPlayerCount}/{matches.length * 2}</p>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-blue-600 h-2 rounded-full transition-all"
                  style={{ width: `${(selectedPlayerCount / (matches.length * 2)) * 100}%` }}
                ></div>
              </div>
            </div>
            <div>
              <p className="text-sm font-medium mb-1">Winners Predicted: {selectedWinnersCount}/{matches.length}</p>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-green-600 h-2 rounded-full transition-all"
                  style={{ width: `${(selectedWinnersCount / matches.length) * 100}%` }}
                ></div>
              </div>
            </div>
          </div>
          <p className="text-sm text-gray-600 mt-4">
            Total Progress: {selectedPlayerCount + selectedWinnersCount}/{totalRequired}
          </p>
        </div>

        {/* Matches */}
        <div className="space-y-6">
          {matches.map(match => (
            <div key={match.matchId} className="bg-white p-6 rounded-lg shadow-md">
              <h3 className="text-2xl font-bold mb-6">
                Match {match.matchId}: {match.team1} 🏏 vs 🏏 {match.team2}
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Batsman Selection */}
                <div>
                  <label className="block text-lg font-bold mb-3">🏏 Best Batsman (+100 pts)</label>
                  <select
                    value={selections[`${match.matchId}-batsman`]?.id || ''}
                    onChange={(e) => {
                      const playerId = parseInt(e.target.value)
                      const player = getPlayersForMatch(match.team1, match.team2, 'batsman').find(p => p.id === playerId)
                      if (player) {
                        handlePlayerSelect(match.matchId, 'batsman', player.id, player.name, player.team)
                      }
                    }}
                    className="w-full border-2 border-gray-300 px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-400 text-lg"
                  >
                    <option value="">Select Batsman...</option>
                    {getPlayersForMatch(match.team1, match.team2, 'batsman').map(player => (
                      <option 
                        key={player.id} 
                        value={player.id}
                        disabled={isPlayerSelected(player.id) && selections[`${match.matchId}-batsman`]?.id !== player.id}
                      >
                        {player.name} ({player.team}) {isPlayerSelected(player.id) && selections[`${match.matchId}-batsman`]?.id === player.id ? '✓' : ''}
                      </option>
                    ))}
                  </select>
                  {selections[`${match.matchId}-batsman`] && (
                    <p className="text-sm text-green-600 mt-2">✓ {selections[`${match.matchId}-batsman`].name} ({selections[`${match.matchId}-batsman`].team})</p>
                  )}
                </div>

                {/* Bowler Selection */}
                <div>
                  <label className="block text-lg font-bold mb-3">🎯 Best Bowler (+50 pts)</label>
                  <select
                    value={selections[`${match.matchId}-bowler`]?.id || ''}
                    onChange={(e) => {
                      const playerId = parseInt(e.target.value)
                      const player = getPlayersForMatch(match.team1, match.team2, 'bowler').find(p => p.id === playerId)
                      if (player) {
                        handlePlayerSelect(match.matchId, 'bowler', player.id, player.name, player.team)
                      }
                    }}
                    className="w-full border-2 border-gray-300 px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-400 text-lg"
                  >
                    <option value="">Select Bowler...</option>
                    {getPlayersForMatch(match.team1, match.team2, 'bowler').map(player => (
                      <option 
                        key={player.id} 
                        value={player.id}
                        disabled={isPlayerSelected(player.id) && selections[`${match.matchId}-bowler`]?.id !== player.id}
                      >
                        {player.name} ({player.team}) {isPlayerSelected(player.id) && selections[`${match.matchId}-bowler`]?.id === player.id ? '✓' : ''}
                      </option>
                    ))}
                  </select>
                  {selections[`${match.matchId}-bowler`] && (
                    <p className="text-sm text-green-600 mt-2">✓ {selections[`${match.matchId}-bowler`].name} ({selections[`${match.matchId}-bowler`].team})</p>
                  )}
                </div>
              </div>

              {/* Match Winner */}
              <div className="mt-6">
                <label className="block text-lg font-bold mb-3">🏆 Match Winner (+200 pts)</label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    onClick={() => handleWinnerSelect(match.matchId, match.team1)}
                    className={`py-3 px-4 rounded-lg font-bold text-lg transition ${
                      winners[match.matchId] === match.team1
                        ? "bg-green-600 text-white shadow-lg"
                        : "bg-white border-2 border-gray-300 hover:border-green-600"
                    }`}
                  >
                    {match.team1} {winners[match.matchId] === match.team1 && '✓'}
                  </button>
                  <button
                    onClick={() => handleWinnerSelect(match.matchId, match.team2)}
                    className={`py-3 px-4 rounded-lg font-bold text-lg transition ${
                      winners[match.matchId] === match.team2
                        ? "bg-green-600 text-white shadow-lg"
                        : "bg-white border-2 border-gray-300 hover:border-green-600"
                    }`}
                  >
                    {match.team2} {winners[match.matchId] === match.team2 && '✓'}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Save Button */}
        <div className="mt-8 bg-white p-6 rounded-lg shadow-md sticky bottom-0">
          <button
            onClick={handleSaveDraft}
            disabled={selectedPlayerCount < matches.length * 2 || selectedWinnersCount < matches.length || loading || !canEdit}
            className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 font-bold text-lg disabled:opacity-50 disabled:cursor-not-allowed transition"
          >
            {loading ? 'Saving...' : `✓ Save Draft (${selectedPlayerCount + selectedWinnersCount}/${totalRequired} Complete)`}
          </button>
          {(selectedPlayerCount < matches.length * 2 || selectedWinnersCount < matches.length) && (
            <p className="text-sm text-red-600 mt-3 text-center">
              Complete all selections to save your draft
            </p>
          )}
        </div>
      </div>
    </div>
  )
}

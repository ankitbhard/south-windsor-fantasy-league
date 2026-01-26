import { useState, useContext } from "react"
import { Link } from "react-router-dom"
import { DraftContext } from "../context/DraftContext"

export default function Draft() {
  const { saveDraft } = useContext(DraftContext)
  
  const [matches] = useState([
    { id: 1, team1: "India", team2: "Pakistan" },
    { id: 2, team1: "Australia", team2: "South Africa" },
    { id: 3, team1: "England", team2: "West Indies" },
    { id: 4, team1: "Sri Lanka", team2: "Afghanistan" },
    { id: 5, team1: "USA", team2: "Scotland" },
    { id: 6, team1: "India", team2: "Australia" },
    { id: 7, team1: "Pakistan", team2: "South Africa" },
    { id: 8, team1: "England", team2: "Afghanistan" },
    { id: 9, team1: "West Indies", team2: "Sri Lanka" },
    { id: 10, team1: "USA", team2: "Scotland" },
  ])

  const [players] = useState([
    // India Batsmen
    { id: 1, name: "Virat Kohli", team: "India", role: "batsman" },
    { id: 2, name: "Rohit Sharma", team: "India", role: "batsman" },
    { id: 3, name: "Suryakumar Yadav", team: "India", role: "batsman" },
    { id: 4, name: "Hardik Pandya", team: "India", role: "batsman" },
    { id: 5, name: "Axar Patel", team: "India", role: "batsman" },

    // India Bowlers
    { id: 6, name: "Jasprit Bumrah", team: "India", role: "bowler" },
    { id: 7, name: "Yuzvendra Chahal", team: "India", role: "bowler" },
    { id: 8, name: "Mohammed Siraj", team: "India", role: "bowler" },

    // Pakistan Batsmen
    { id: 9, name: "Babar Azam", team: "Pakistan", role: "batsman" },
    { id: 10, name: "Fakhar Zaman", team: "Pakistan", role: "batsman" },

    // Pakistan Bowlers
    { id: 11, name: "Shaheen Afridi", team: "Pakistan", role: "bowler" },
    { id: 12, name: "Hasan Ali", team: "Pakistan", role: "bowler" },

    // Australia Batsmen
    { id: 13, name: "Steve Smith", team: "Australia", role: "batsman" },
    { id: 14, name: "David Warner", team: "Australia", role: "batsman" },

    // Australia Bowlers
    { id: 15, name: "Pat Cummins", team: "Australia", role: "bowler" },
    { id: 16, name: "Josh Hazlewood", team: "Australia", role: "bowler" },

    // South Africa Batsmen
    { id: 17, name: "Aiden Markram", team: "South Africa", role: "batsman" },
    { id: 18, name: "Reeza Hendricks", team: "South Africa", role: "batsman" },

    // South Africa Bowlers
    { id: 19, name: "Anrich Nortje", team: "South Africa", role: "bowler" },
    { id: 20, name: "Kagiso Rabada", team: "South Africa", role: "bowler" },

    // England Batsmen
    { id: 21, name: "Jos Buttler", team: "England", role: "batsman" },
    { id: 22, name: "Liam Livingstone", team: "England", role: "batsman" },

    // England Bowlers
    { id: 23, name: "Jofra Archer", team: "England", role: "bowler" },
    { id: 24, name: "Adil Rashid", team: "England", role: "bowler" },

    // West Indies Batsmen
    { id: 25, name: "Nicholas Pooran", team: "West Indies", role: "batsman" },
    { id: 26, name: "Roston Chase", team: "West Indies", role: "batsman" },

    // West Indies Bowlers
    { id: 27, name: "Romesh Shepherd", team: "West Indies", role: "bowler" },
    { id: 28, name: "Akeal Hosein", team: "West Indies", role: "bowler" },

    // Sri Lanka Batsmen
    { id: 29, name: "Angelo Mathews", team: "Sri Lanka", role: "batsman" },
    { id: 30, name: "Pathum Nissanka", team: "Sri Lanka", role: "batsman" },

    // Sri Lanka Bowlers
    { id: 31, name: "Wanindu Hasaranga", team: "Sri Lanka", role: "bowler" },
    { id: 32, name: "Lahiru Kumara", team: "Sri Lanka", role: "bowler" },

    // Afghanistan Batsmen
    { id: 33, name: "Mohammad Nabi", team: "Afghanistan", role: "batsman" },
    { id: 34, name: "Rahmanullah Gurbaz", team: "Afghanistan", role: "batsman" },

    // Afghanistan Bowlers
    { id: 35, name: "Rashid Khan", team: "Afghanistan", role: "bowler" },
    { id: 36, name: "Naveen-ul-Haq", team: "Afghanistan", role: "bowler" },

    // USA Batsmen
    { id: 37, name: "Ishan Malhotra", team: "USA", role: "batsman" },
    { id: 38, name: "Aaron Jones", team: "USA", role: "batsman" },

    // USA Bowlers
    { id: 39, name: "Ali Khan", team: "USA", role: "bowler" },
    { id: 40, name: "Harmeet Singh", team: "USA", role: "bowler" },

    // Scotland Batsmen
    { id: 41, name: "Kyle Coetzer", team: "Scotland", role: "batsman" },
    { id: 42, name: "Richie Berrington", team: "Scotland", role: "batsman" },

    // Scotland Bowlers
    { id: 43, name: "Mark Watt", team: "Scotland", role: "bowler" },
    { id: 44, name: "Chris Sole", team: "Scotland", role: "bowler" },
  ])

  const [draftSelections, setDraftSelections] = useState({})
  const [selectedPlayers, setSelectedPlayers] = useState([])
  const [winnerPredictions, setWinnerPredictions] = useState({})

  const handlePlayerSelect = (matchId, role, player) => {
    // Check if player already selected
    if (selectedPlayers.some(p => p.id === player.id)) {
      alert("Player already selected!")
      return
    }

    const key = `${matchId}-${role}`
    setDraftSelections(prev => ({
      ...prev,
      [key]: player
    }))

    setSelectedPlayers(prev => [...prev, player])
  }

  const handleRemovePlayer = (matchId, role, playerId) => {
    const key = `${matchId}-${role}`
    setDraftSelections(prev => {
      const updated = { ...prev }
      delete updated[key]
      return updated
    })
    
    setSelectedPlayers(prev => prev.filter(p => p.id !== playerId))
  }

  const handleWinnerPrediction = (matchId, winner) => {
    setWinnerPredictions(prev => ({
      ...prev,
      [matchId]: winner
    }))
  }

  const getBatsmen = () => players.filter(p => p.role === "batsman")
  const getBowlers = () => players.filter(p => p.role === "bowler")

  const getAvailableBatsmen = () => getBatsmen().filter(p => !selectedPlayers.some(sp => sp.id === p.id))
  const getAvailableBowlers = () => getBowlers().filter(p => !selectedPlayers.some(sp => sp.id === p.id))

  const handleSaveDraft = () => {
    if (selectedPlayers.length !== 20) {
      alert("Please select all 20 players (10 batsmen and 10 bowlers)")
      return
    }

    const allPredictions = Object.keys(winnerPredictions).length
    if (allPredictions !== 10) {
      alert("Please predict winner for all 10 matches")
      return
    }

    const userId = localStorage.getItem('userId') || 'user-' + Date.now()
    localStorage.setItem('userId', userId)
    
    saveDraft(userId, {
      players: draftSelections,
      winners: winnerPredictions
    })
    
    console.log("Draft saved:", { draftSelections, winnerPredictions })
    alert("Draft saved successfully!")
  }

  const totalPredictions = Object.keys(winnerPredictions).length

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Navigation */}
      <nav className="bg-blue-600 text-white p-4">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <Link to="/dashboard" className="text-white hover:text-gray-200">← Back to Dashboard</Link>
          <h1 className="text-2xl font-bold">T20 World Cup 2026 Draft</h1>
          <div></div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto p-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Draft Section */}
          <div className="lg:col-span-2">
            <h2 className="text-3xl font-bold mb-6">Pick Players & Predict Winners</h2>
            
            {matches.map(match => (
              <div key={match.id} className="bg-white p-4 rounded-lg shadow-md mb-4">
                <h3 className="text-lg font-bold mb-4">{`Match ${match.id}: ${match.team1} vs ${match.team2}`}</h3>
                
                {/* Players Selection */}
                <div className="grid grid-cols-2 gap-4 mb-4 pb-4 border-b">
                  {/* Batsman Selection */}
                  <div>
                    <label className="block text-sm font-medium mb-2">Select Batsman</label>
                    <select
                      onChange={(e) => {
                        if (e.target.value) {
                          const player = players.find(p => p.id === parseInt(e.target.value))
                          if (player) handlePlayerSelect(match.id, "batsman", player)
                          e.target.value = ""
                        }
                      }}
                      className="w-full border border-gray-300 px-3 py-2 rounded focus:outline-none focus:ring focus:ring-blue-300"
                    >
                      <option value="">Choose a batsman...</option>
                      {getAvailableBatsmen().map(player => (
                        <option key={player.id} value={player.id}>
                          {player.name} ({player.team})
                        </option>
                      ))}
                    </select>
                    {draftSelections[`${match.id}-batsman`] && (
                      <div className="mt-2 p-2 bg-green-100 rounded border-l-4 border-green-500">
                        <p className="text-sm font-medium">{draftSelections[`${match.id}-batsman`].name}</p>
                        <p className="text-xs text-gray-600">+100 points</p>
                        <button
                          onClick={() => handleRemovePlayer(match.id, "batsman", draftSelections[`${match.id}-batsman`].id)}
                          className="text-xs text-red-600 hover:text-red-800 mt-1"
                        >
                          Remove
                        </button>
                      </div>
                    )}
                  </div>

                  {/* Bowler Selection */}
                  <div>
                    <label className="block text-sm font-medium mb-2">Select Bowler</label>
                    <select
                      onChange={(e) => {
                        if (e.target.value) {
                          const player = players.find(p => p.id === parseInt(e.target.value))
                          if (player) handlePlayerSelect(match.id, "bowler", player)
                          e.target.value = ""
                        }
                      }}
                      className="w-full border border-gray-300 px-3 py-2 rounded focus:outline-none focus:ring focus:ring-blue-300"
                    >
                      <option value="">Choose a bowler...</option>
                      {getAvailableBowlers().map(player => (
                        <option key={player.id} value={player.id}>
                          {player.name} ({player.team})
                        </option>
                      ))}
                    </select>
                    {draftSelections[`${match.id}-bowler`] && (
                      <div className="mt-2 p-2 bg-green-100 rounded border-l-4 border-green-500">
                        <p className="text-sm font-medium">{draftSelections[`${match.id}-bowler`].name}</p>
                        <p className="text-xs text-gray-600">+50 points</p>
                        <button
                          onClick={() => handleRemovePlayer(match.id, "bowler", draftSelections[`${match.id}-bowler`].id)}
                          className="text-xs text-red-600 hover:text-red-800 mt-1"
                        >
                          Remove
                        </button>
                      </div>
                    )}
                  </div>
                </div>

                {/* Winner Prediction */}
                <div className="bg-blue-50 p-3 rounded">
                  <label className="block text-sm font-bold mb-2">🏆 Predict Winner</label>
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      onClick={() => handleWinnerPrediction(match.id, match.team1)}
                      className={`py-2 px-3 rounded font-medium transition ${
                        winnerPredictions[match.id] === match.team1
                          ? "bg-green-600 text-white"
                          : "bg-white border border-gray-300 hover:bg-gray-50"
                      }`}
                    >
                      {match.team1}
                    </button>
                    <button
                      onClick={() => handleWinnerPrediction(match.id, match.team2)}
                      className={`py-2 px-3 rounded font-medium transition ${
                        winnerPredictions[match.id] === match.team2
                          ? "bg-green-600 text-white"
                          : "bg-white border border-gray-300 hover:bg-gray-50"
                      }`}
                    >
                      {match.team2}
                    </button>
                  </div>
                  {winnerPredictions[match.id] && (
                    <p className="text-xs text-green-600 font-medium mt-2">
                      ✓ {winnerPredictions[match.id]} selected (+200 points)
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* Summary Section */}
          <div>
            <div className="bg-white p-6 rounded-lg shadow-md sticky top-6">
              <h3 className="text-xl font-bold mb-4">Draft Summary</h3>
              
              {/* Players Counter */}
              <div className="mb-4 p-3 bg-blue-100 rounded text-center">
                <p className="text-xs text-gray-600">Players Selected</p>
                <p className="text-2xl font-bold text-blue-600">{selectedPlayers.length}/20</p>
              </div>

              {/* Winners Counter */}
              <div className="mb-4 p-3 bg-green-100 rounded text-center">
                <p className="text-xs text-gray-600">Predictions Made</p>
                <p className="text-2xl font-bold text-green-600">{totalPredictions}/10</p>
              </div>

              {/* Potential Points */}
              <div className="mb-6 p-3 bg-purple-100 rounded text-center">
                <p className="text-xs text-gray-600">Max Possible Points</p>
                <p className="text-2xl font-bold text-purple-600">
                  {selectedPlayers.length === 20 && totalPredictions === 10 ? 3000 : (selectedPlayers.length * 10) + (totalPredictions * 20)}
                </p>
              </div>

              {/* Selected Players List */}
              <div className="border-t pt-4">
                <p className="text-sm font-bold mb-3">Selected Players:</p>
                <div className="space-y-2 max-h-96 overflow-y-auto">
                  {selectedPlayers.length === 0 ? (
                    <p className="text-gray-600 text-sm">No players selected yet</p>
                  ) : (
                    selectedPlayers.map((player, index) => (
                      <div key={player.id} className="text-sm p-2 bg-gray-100 rounded hover:bg-gray-200">
                        <p className="font-medium">{index + 1}. {player.name}</p>
                        <p className="text-gray-600 text-xs">{player.team} - <span className="capitalize">{player.role}</span></p>
                      </div>
                    ))
                  )}
                </div>
              </div>

              {/* Save Button */}
              {selectedPlayers.length === 20 && totalPredictions === 10 ? (
                <button 
                  onClick={handleSaveDraft}
                  className="w-full mt-4 bg-green-600 text-white py-3 rounded hover:bg-green-700 font-bold text-lg"
                >
                  ✓ Save Draft (3000 pts)
                </button>
              ) : (
                <div className="w-full mt-4 bg-gray-300 text-gray-600 py-3 rounded text-center font-bold">
                  {20 - selectedPlayers.length > 0 && `Select ${20 - selectedPlayers.length} more players`}
                  {20 - selectedPlayers.length === 0 && `Predict ${10 - totalPredictions} more winners`}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

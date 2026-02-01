import { useState, useContext } from "react"
import { Link } from "react-router-dom"
import { DraftContext } from "../context/DraftContext"

export default function Admin() {
  const { updateMatchResult } = useContext(DraftContext)
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
    { id: 1, name: "Virat Kohli", team: "India", role: "batsman" },
    { id: 2, name: "Rohit Sharma", team: "India", role: "batsman" },
    { id: 3, name: "Suryakumar Yadav", team: "India", role: "batsman" },
    { id: 4, name: "Hardik Pandya", team: "India", role: "batsman" },
    { id: 5, name: "Axar Patel", team: "India", role: "batsman" },
    { id: 6, name: "Jasprit Bumrah", team: "India", role: "bowler" },
    { id: 7, name: "Yuzvendra Chahal", team: "India", role: "bowler" },
    { id: 8, name: "Mohammed Siraj", team: "India", role: "bowler" },
    { id: 9, name: "Babar Azam", team: "Pakistan", role: "batsman" },
    { id: 10, name: "Fakhar Zaman", team: "Pakistan", role: "batsman" },
    { id: 11, name: "Shaheen Afridi", team: "Pakistan", role: "bowler" },
    { id: 12, name: "Hasan Ali", team: "Pakistan", role: "bowler" },
    { id: 13, name: "Steve Smith", team: "Australia", role: "batsman" },
    { id: 14, name: "David Warner", team: "Australia", role: "batsman" },
    { id: 15, name: "Pat Cummins", team: "Australia", role: "bowler" },
    { id: 16, name: "Josh Hazlewood", team: "Australia", role: "bowler" },
    { id: 17, name: "Aiden Markram", team: "South Africa", role: "batsman" },
    { id: 18, name: "Reeza Hendricks", team: "South Africa", role: "batsman" },
    { id: 19, name: "Anrich Nortje", team: "South Africa", role: "bowler" },
    { id: 20, name: "Kagiso Rabada", team: "South Africa", role: "bowler" },
    { id: 21, name: "Jos Buttler", team: "England", role: "batsman" },
    { id: 22, name: "Liam Livingstone", team: "England", role: "batsman" },
    { id: 23, name: "Jofra Archer", team: "England", role: "bowler" },
    { id: 24, name: "Adil Rashid", team: "England", role: "bowler" },
    { id: 25, name: "Nicholas Pooran", team: "West Indies", role: "batsman" },
    { id: 26, name: "Roston Chase", team: "West Indies", role: "batsman" },
    { id: 27, name: "Romesh Shepherd", team: "West Indies", role: "bowler" },
    { id: 28, name: "Akeal Hosein", team: "West Indies", role: "bowler" },
    { id: 29, name: "Angelo Mathews", team: "Sri Lanka", role: "batsman" },
    { id: 30, name: "Pathum Nissanka", team: "Sri Lanka", role: "batsman" },
    { id: 31, name: "Wanindu Hasaranga", team: "Sri Lanka", role: "bowler" },
    { id: 32, name: "Lahiru Kumara", team: "Sri Lanka", role: "bowler" },
    { id: 33, name: "Mohammad Nabi", team: "Afghanistan", role: "batsman" },
    { id: 34, name: "Rahmanullah Gurbaz", team: "Afghanistan", role: "batsman" },
    { id: 35, name: "Rashid Khan", team: "Afghanistan", role: "bowler" },
    { id: 36, name: "Naveen-ul-Haq", team: "Afghanistan", role: "bowler" },
    { id: 37, name: "Ishan Malhotra", team: "USA", role: "batsman" },
    { id: 38, name: "Aaron Jones", team: "USA", role: "batsman" },
    { id: 39, name: "Ali Khan", team: "USA", role: "bowler" },
    { id: 40, name: "Harmeet Singh", team: "USA", role: "bowler" },
    { id: 41, name: "Kyle Coetzer", team: "Scotland", role: "batsman" },
    { id: 42, name: "Richie Berrington", team: "Scotland", role: "batsman" },
    { id: 43, name: "Mark Watt", team: "Scotland", role: "bowler" },
    { id: 44, name: "Chris Sole", team: "Scotland", role: "bowler" },
  ])

  const [results, setResults] = useState({})

  const handleResultSubmit = (matchId) => {
    const batsmanId = results[matchId]?.batsman
    const bowlerId = results[matchId]?.bowler
    const winner = results[matchId]?.winner

    if (!batsmanId || !bowlerId || !winner) {
      alert("Please select Batsman, Bowler, and Winner")
      return
    }

    updateMatchResult(matchId, parseInt(batsmanId), parseInt(bowlerId), winner)
    alert(`Match ${matchId} result saved!`)
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <nav className="bg-red-600 text-white p-4">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <Link to="/dashboard" className="text-white hover:text-gray-200">← Back to Dashboard</Link>
          <h1 className="text-2xl font-bold">Admin - Update Match Results</h1>
          <div></div>
        </div>
      </nav>

      <div className="max-w-6xl mx-auto p-6">
        <h2 className="text-3xl font-bold mb-6">Set Match Winners & Performance</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {matches.map(match => (
            <div key={match.id} className="bg-white p-6 rounded-lg shadow-md">
              <h3 className="text-lg font-bold mb-4">{`Match ${match.id}: ${match.team1} vs ${match.team2}`}</h3>
              
              <div className="space-y-4">
                {/* Best Batsman */}
                <div>
                  <label className="block text-sm font-medium mb-2">Man of the Match (Batsman) - +100 pts</label>
                  <select
                    onChange={(e) => {
                      setResults(prev => ({
                        ...prev,
                        [match.id]: { ...prev[match.id], batsman: e.target.value }
                      }))
                    }}
                    className="w-full border border-gray-300 px-3 py-2 rounded focus:outline-none focus:ring focus:ring-blue-300"
                  >
                    <option value="">Select Batsman...</option>
                    {players.filter(p => p.role === 'batsman').map(player => (
                      <option key={player.id} value={player.id}>
                        {player.name} ({player.team})
                      </option>
                    ))}
                  </select>
                </div>

                {/* Best Bowler */}
                <div>
                  <label className="block text-sm font-medium mb-2">Best Bowler - +50 pts</label>
                  <select
                    onChange={(e) => {
                      setResults(prev => ({
                        ...prev,
                        [match.id]: { ...prev[match.id], bowler: e.target.value }
                      }))
                    }}
                    className="w-full border border-gray-300 px-3 py-2 rounded focus:outline-none focus:ring focus:ring-blue-300"
                  >
                    <option value="">Select Bowler...</option>
                    {players.filter(p => p.role === 'bowler').map(player => (
                      <option key={player.id} value={player.id}>
                        {player.name} ({player.team})
                      </option>
                    ))}
                  </select>
                </div>

                {/* Match Winner */}
                <div>
                  <label className="block text-sm font-medium mb-2">🏆 Match Winner - +200 pts</label>
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      onClick={() => {
                        setResults(prev => ({
                          ...prev,
                          [match.id]: { ...prev[match.id], winner: match.team1 }
                        }))
                      }}
                      className={`py-2 px-3 rounded font-medium transition ${
                        results[match.id]?.winner === match.team1
                          ? "bg-green-600 text-white"
                          : "bg-white border border-gray-300 hover:bg-gray-50"
                      }`}
                    >
                      {match.team1}
                    </button>
                    <button
                      onClick={() => {
                        setResults(prev => ({
                          ...prev,
                          [match.id]: { ...prev[match.id], winner: match.team2 }
                        }))
                      }}
                      className={`py-2 px-3 rounded font-medium transition ${
                        results[match.id]?.winner === match.team2
                          ? "bg-green-600 text-white"
                          : "bg-white border border-gray-300 hover:bg-gray-50"
                      }`}
                    >
                      {match.team2}
                    </button>
                  </div>
                </div>

                {/* Submit Button */}
                {results[match.id]?.batsman && results[match.id]?.bowler && results[match.id]?.winner && (
                  <button
                    onClick={() => handleResultSubmit(match.id)}
                    className="w-full bg-green-600 text-white py-2 rounded hover:bg-green-700 font-bold"
                  >
                    ✓ Save Result (350 pts total)
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

import { createContext, useState, useEffect } from 'react'

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000/api"

export const DraftContext = createContext()

export function DraftProvider({ children }) {
  const [draftTeams, setDraftTeams] = useState([])
  const [matchResults, setMatchResults] = useState({})
  const [loading, setLoading] = useState(true)

  // Get auth token
  const getToken = () => localStorage.getItem('token')

  // Load data from backend on mount
  useEffect(() => {
    loadDataFromBackend()
  }, [])

  const loadDataFromBackend = async () => {
    try {
      // Load all drafts
      const draftsResponse = await fetch(`${API_URL}/drafts/all`)
      const drafts = await draftsResponse.json()
      setDraftTeams(drafts)

      // Load match results
      const matchesResponse = await fetch(`${API_URL}/matches`)
      const matches = await matchesResponse.json()
      const results = {}
      matches.forEach(match => {
        results[match.matchId] = {
          batsman: match.batsman,
          bowler: match.bowler,
          winner: match.winner
        }
      })
      setMatchResults(results)

      console.log('Loaded from backend:', drafts.length, 'drafts')
    } catch (error) {
      console.error('Error loading from backend:', error)
    } finally {
      setLoading(false)
    }
  }

  // Save draft to backend
  const saveDraft = async (userId, draftSelections) => {
    try {
      const token = getToken()
      
      const response = await fetch(`${API_URL}/drafts/save`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          players: draftSelections.players,
          winners: draftSelections.winners
        })
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to save draft')
      }

      // Update local state
      setDraftTeams(prev => {
        const updated = prev.filter(draft => draft.userId !== userId)
        return [...updated, data.draft]
      })

      console.log('Draft saved to backend:', userId)
      return data
    } catch (error) {
      console.error('Error saving draft:', error)
      alert('Error saving draft: ' + error.message)
      throw error
    }
  }

  // Update match result in backend
  const updateMatchResult = async (matchId, batsman, bowler, winner) => {
    try {
      const token = getToken()
      
      const response = await fetch(`${API_URL}/matches/update/${matchId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ batsman, bowler, winner })
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to save match result')
      }

      // Update local state
      setMatchResults(prev => ({
        ...prev,
        [matchId]: { batsman, bowler, winner }
      }))

      console.log('Match result saved to backend:', matchId)
    } catch (error) {
      console.error('Error saving match result:', error)
      alert('Error saving match result: ' + error.message)
    }
  }

  // Calculate scores
  const calculateScores = () => {
    const scores = {}

    draftTeams.forEach(team => {
      const userId = team.userId
      scores[userId] = { 
        totalScore: 0, 
        userId, 
        email: team.email,
        details: [],
        createdAt: team.createdAt
      }

      // Check player predictions
      const players = team.players || {}
      Object.keys(players).forEach(key => {
        const [matchId, role] = key.split('-')
        const player = players[key]
        const result = matchResults[matchId]

        if (result) {
          if (role === 'batsman' && result.batsman === player.id) {
            scores[userId].totalScore += 100
            scores[userId].details.push({
              matchId,
              playerName: player.name,
              role: 'batsman',
              points: 100
            })
          } else if (role === 'bowler' && result.bowler === player.id) {
            scores[userId].totalScore += 50
            scores[userId].details.push({
              matchId,
              playerName: player.name,
              role: 'bowler',
              points: 50
            })
          }
        }
      })

      // Check match winner predictions
      const winners = team.winners || {}
      Object.keys(winners).forEach(matchId => {
        const predictedWinner = winners[matchId]
        const result = matchResults[matchId]

        if (result && result.winner === predictedWinner) {
          scores[userId].totalScore += 200
          scores[userId].details.push({
            matchId,
            prediction: predictedWinner,
            type: 'winner',
            points: 200
          })
        }
      })
    })

    return scores
  }

  // Get current user's draft
  const getUserDraft = (userId) => {
    return draftTeams.find(team => team.userId === userId)
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="text-center">
          <p className="text-xl font-bold mb-4">Loading...</p>
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
        </div>
      </div>
    )
  }

  return (
    <DraftContext.Provider value={{
      draftTeams,
      matchResults,
      saveDraft,
      updateMatchResult,
      calculateScores,
      getUserDraft
    }}>
      {children}
    </DraftContext.Provider>
  )
}
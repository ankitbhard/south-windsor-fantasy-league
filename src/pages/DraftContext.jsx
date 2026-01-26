import { createContext, useState, useEffect } from 'react'

export const DraftContext = createContext()

export function DraftProvider({ children }) {
  const [draftTeams, setDraftTeams] = useState([])
  const [matchResults, setMatchResults] = useState({})

  // Load data from localStorage on mount
  useEffect(() => {
    const savedDrafts = localStorage.getItem('draftTeams')
    const savedResults = localStorage.getItem('matchResults')
    
    if (savedDrafts) {
      setDraftTeams(JSON.parse(savedDrafts))
    }
    if (savedResults) {
      setMatchResults(JSON.parse(savedResults))
    }
  }, [])

  // Save drafts to localStorage whenever they change
  const saveDraft = (userId, draftSelections) => {
    const newDraft = {
      userId,
      draftSelections,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }

    setDraftTeams(prev => {
      const updated = prev.filter(draft => draft.userId !== userId)
      const allDrafts = [...updated, newDraft]
      localStorage.setItem('draftTeams', JSON.stringify(allDrafts))
      return allDrafts
    })
  }

  // Update match results and save to localStorage
  const updateMatchResult = (matchId, batsman, bowler, winner) => {
    setMatchResults(prev => {
      const updated = {
        ...prev,
        [matchId]: { batsman, bowler, winner }
      }
      localStorage.setItem('matchResults', JSON.stringify(updated))
      return updated
    })
  }

  // Calculate scores for all users
  const calculateScores = () => {
    const scores = {}

    draftTeams.forEach(team => {
      const userId = team.userId
      scores[userId] = { 
        totalScore: 0, 
        userId, 
        email: team.draftSelections.email || userId,
        details: [],
        createdAt: team.createdAt
      }

      // Check player predictions
      const players = team.draftSelections.players || {}
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
      const winners = team.draftSelections.winners || {}
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

import { createContext, useState } from 'react'

export const DraftContext = createContext()

export function DraftProvider({ children }) {
  const [draftTeams, setDraftTeams] = useState([])
  const [matchResults, setMatchResults] = useState({})

  const saveDraft = (userId, draftSelections) => {
    setDraftTeams(prev => [...prev, {
      userId,
      draftSelections,
      createdAt: new Date().toISOString()
    }])
  }

  const updateMatchResult = (matchId, batsman, bowler) => {
    setMatchResults(prev => ({
      ...prev,
      [matchId]: { batsman, bowler }
    }))
  }

  const calculateScores = () => {
    const scores = {}

    draftTeams.forEach(team => {
      const userId = team.userId
      scores[userId] = { totalScore: 0, userId, details: [] }

      // For each match in their draft
      Object.keys(team.draftSelections).forEach(key => {
        const [matchId, role] = key.split('-')
        const player = team.draftSelections[key]
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
    })

    return scores
  }

  return (
    <DraftContext.Provider value={{
      draftTeams,
      matchResults,
      saveDraft,
      updateMatchResult,
      calculateScores
    }}>
      {children}
    </DraftContext.Provider>
  )
}
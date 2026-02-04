const express = require('express');
const Draft = require('../models/Draft');
const MatchResult = require('../models/MatchResult');
const auth = require('../middleware/auth');

const router = express.Router();

// Check if edit window is open (6pm - 12am)
const isEditWindowOpen = () => {
  const now = new Date();
  const hour = now.getHours();
  
  // 6pm = 18, 12am = 0 (next day)
  // So 18, 19, 20, 21, 22, 23 are allowed
  return hour >= 18 || hour < 0;
};

// Get current user's draft
router.get('/my-draft', auth, async (req, res) => {
  try {
    const draft = await Draft.findOne({ userId: req.userId });
    
    if (!draft) {
      return res.status(404).json({ error: 'No draft found' });
    }

    // Check if edit window is open
    const canEdit = isEditWindowOpen();

    res.json({
      draft,
      canEdit,
      editWindowTime: '6:00 PM - 12:00 AM'
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Save or update draft (only during edit window)
router.post('/save', auth, async (req, res) => {
  try {
    // Check if edit window is open
    if (!isEditWindowOpen()) {
      const now = new Date();
      const hour = now.getHours();
      return res.status(403).json({ 
        error: 'Edit window closed. You can edit from 6:00 PM to 12:00 AM',
        currentTime: `${hour}:${String(now.getMinutes()).padStart(2, '0')}`
      });
    }

    const { players, winners } = req.body;

    if (!players || !winners) {
      return res.status(400).json({ error: 'Players and winners required' });
    }

    // Find existing draft or create new one
    let draft = await Draft.findOne({ userId: req.userId });

    if (draft) {
      // Update existing draft
      draft.players = players;
      draft.winners = winners;
      draft.updatedAt = new Date();
    } else {
      // Create new draft
      draft = new Draft({
        userId: req.userId,
        email: req.email,
        players,
        winners
      });
    }

    // Save without middleware issues
    const result = await Draft.updateOne(
      { userId: req.userId },
      {
        $set: {
          userId: req.userId,
          email: req.email,
          players,
          winners,
          updatedAt: new Date()
        }
      },
      { upsert: true }
    );

    console.log('Draft saved successfully');

    res.json({
      message: 'Draft saved successfully',
      draft: {
        userId: req.userId,
        email: req.email,
        players,
        winners
      }
    });
  } catch (error) {
    console.error('Draft save error:', error);
    res.status(500).json({ error: error.message });
  }
});

// Clear/Delete user's draft
router.delete('/clear', auth, async (req, res) => {
  try {
    const result = await Draft.deleteOne({ userId: req.userId });

    if (result.deletedCount === 0) {
      return res.status(404).json({ error: 'No draft found to delete' });
    }

    console.log('Draft cleared for user:', req.userId);

    res.json({
      message: 'Draft cleared successfully',
      deleted: true
    });
  } catch (error) {
    console.error('Draft clear error:', error);
    res.status(500).json({ error: error.message });
  }
});

// Get all drafts (for leaderboard)
router.get('/all', async (req, res) => {
  try {
    const drafts = await Draft.find().sort({ updatedAt: -1 });
    
    // Calculate scores for each draft
    const draftsWithScores = await Promise.all(
      drafts.map(async (draft) => {
        let totalScore = 0;
        
        // Check player predictions
        const players = draft.players || {};
        for (const key in players) {
          const [matchId, role] = key.split('-');
          const player = players[key];
          const result = await MatchResult.findOne({ matchId: parseInt(matchId) });

          if (result) {
            if (role === 'batsman' && result.batsman === player.id) {
              totalScore += 100;
            } else if (role === 'bowler' && result.bowler === player.id) {
              totalScore += 50;
            }
          }
        }

        // Check match winner predictions
        const winners = draft.winners || {};
        for (const matchId in winners) {
          const predictedWinner = winners[matchId];
          const result = await MatchResult.findOne({ matchId: parseInt(matchId) });

          if (result && result.winner === predictedWinner) {
            totalScore += 200;
          }
        }

        return {
          ...draft.toObject(),
          totalScore
        };
      })
    );

    res.json(draftsWithScores);
  } catch (error) {
    console.error('Error fetching drafts:', error);
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;

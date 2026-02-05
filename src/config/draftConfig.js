// src/config/draftConfig.js
// Configure draft settings here

export const DRAFT_CONFIG = {
  // Edit window settings
  // Set to true to enable 24-hour editing, false to restrict to specific times
  ALLOW_24_HOUR_EDITING: true,
  
  // If ALLOW_24_HOUR_EDITING is false, use these times:
  // Format: 0-23 (24-hour format)
  EDIT_WINDOW_START_HOUR: 18,  // 6 PM
  EDIT_WINDOW_END_HOUR: 0,     // 12 AM (midnight)
  
  // Other settings
  POINTS_FOR_BATSMAN: 100,
  POINTS_FOR_BOWLER: 50,
  POINTS_FOR_WINNER: 200,
  MAX_POINTS_PER_MATCH: 350,
};

// Helper function to check if edit window is open
export const isEditWindowOpen = () => {
  if (DRAFT_CONFIG.ALLOW_24_HOUR_EDITING) {
    return true; // Always allow editing
  }
  
  const now = new Date();
  const hour = now.getHours();
  
  // Check if current hour is within edit window
  if (DRAFT_CONFIG.EDIT_WINDOW_START_HOUR < DRAFT_CONFIG.EDIT_WINDOW_END_HOUR) {
    // Normal range (e.g., 9 AM to 5 PM)
    return hour >= DRAFT_CONFIG.EDIT_WINDOW_START_HOUR && 
           hour < DRAFT_CONFIG.EDIT_WINDOW_END_HOUR;
  } else {
    // Overnight range (e.g., 6 PM to 12 AM)
    return hour >= DRAFT_CONFIG.EDIT_WINDOW_START_HOUR || 
           hour < DRAFT_CONFIG.EDIT_WINDOW_END_HOUR;
  }
};

// Get edit window display text
export const getEditWindowText = () => {
  if (DRAFT_CONFIG.ALLOW_24_HOUR_EDITING) {
    return 'Available 24/7';
  }
  
  const startTime = String(DRAFT_CONFIG.EDIT_WINDOW_START_HOUR).padStart(2, '0') + ':00';
  const endTime = String(DRAFT_CONFIG.EDIT_WINDOW_END_HOUR).padStart(2, '0') + ':00';
  
  return `${startTime} - ${endTime}`;
};

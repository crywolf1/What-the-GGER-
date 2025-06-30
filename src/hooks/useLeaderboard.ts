import { useState, useEffect, useCallback } from 'react';
import type { LeaderboardEntry } from '../types/game';

export const useLeaderboard = () => {
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  // Load leaderboard from localStorage
  useEffect(() => {
    const saved = localStorage.getItem('whatTheGgerLeaderboard');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        setLeaderboard(parsed);
      } catch (error) {
        console.error('Error loading leaderboard:', error);
      }
    }
  }, []);

  // Save leaderboard to localStorage
  const saveLeaderboard = useCallback((newLeaderboard: LeaderboardEntry[]) => {
    localStorage.setItem('whatTheGgerLeaderboard', JSON.stringify(newLeaderboard));
    setLeaderboard(newLeaderboard);
  }, []);

  // Add or update a score
  const addScore = useCallback((entry: Omit<LeaderboardEntry, 'percentage' | 'timestamp'>) => {
    console.log('Adding score to leaderboard:', entry);
    setIsLoading(true);
    
    const percentage = Math.round((entry.score / entry.totalWords) * 100);
    const newEntry: LeaderboardEntry = {
      ...entry,
      percentage,
      timestamp: Date.now(),
    };

    setLeaderboard(currentLeaderboard => {
      // Find existing entry for this user
      const existingIndex = currentLeaderboard.findIndex(item => item.fid === entry.fid);
      
      let updatedLeaderboard: LeaderboardEntry[];
      
      if (existingIndex >= 0) {
        // Update existing entry if new score is better
        const existing = currentLeaderboard[existingIndex];
        if (newEntry.percentage > existing.percentage || 
           (newEntry.percentage === existing.percentage && newEntry.score > existing.score)) {
          updatedLeaderboard = [...currentLeaderboard];
          updatedLeaderboard[existingIndex] = newEntry;
        } else {
          // Keep existing better score
          setIsLoading(false);
          return currentLeaderboard;
        }
      } else {
        // Add new entry
        updatedLeaderboard = [...currentLeaderboard, newEntry];
      }

      // Sort by percentage desc, then by score desc, then by timestamp asc (earlier = better)
      updatedLeaderboard.sort((a, b) => {
        if (b.percentage !== a.percentage) return b.percentage - a.percentage;
        if (b.score !== a.score) return b.score - a.score;
        return a.timestamp - b.timestamp;
      });

      // Keep only top 50 entries
      updatedLeaderboard = updatedLeaderboard.slice(0, 50);

      saveLeaderboard(updatedLeaderboard);
      setIsLoading(false);
      return updatedLeaderboard;
    });
  }, [saveLeaderboard]);

  // Get user's rank
  const getUserRank = useCallback((fid: number): number => {
    const index = leaderboard.findIndex(entry => entry.fid === fid);
    return index >= 0 ? index + 1 : -1;
  }, [leaderboard]);

  // Get user's best score
  const getUserScore = useCallback((fid: number): LeaderboardEntry | null => {
    return leaderboard.find(entry => entry.fid === fid) || null;
  }, [leaderboard]);

  // Clear all leaderboard data
  const clearLeaderboard = useCallback(() => {
    localStorage.removeItem('whatTheGgerLeaderboard');
    setLeaderboard([]);
  }, []);

  return {
    leaderboard,
    isLoading,
    addScore,
    getUserRank,
    getUserScore,
    clearLeaderboard,
  };
};

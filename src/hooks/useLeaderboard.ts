import { useState, useEffect, useCallback } from 'react';
import type { LeaderboardEntry } from '../types/game';

const API_BASE_URL = process.env.NODE_ENV === 'production' 
  ? '' // Use relative URLs in production (same domain)
  : 'http://localhost:3001';

export const useLeaderboard = () => {
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Load leaderboard from API
  const loadLeaderboard = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await fetch(`${API_BASE_URL}/api/leaderboard`);
      if (!response.ok) {
        throw new Error('Failed to fetch leaderboard');
      }
      
      const data = await response.json();
      setLeaderboard(data);
    } catch (err) {
      console.error('Error loading leaderboard:', err);
      setError('Failed to load leaderboard');
      // Fallback to localStorage for offline mode
      const saved = localStorage.getItem('whatTheGgerLeaderboard');
      if (saved) {
        try {
          const parsed = JSON.parse(saved);
          setLeaderboard(parsed);
        } catch (parseError) {
          console.error('Error parsing local leaderboard:', parseError);
        }
      }
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Load leaderboard on mount
  useEffect(() => {
    loadLeaderboard();
  }, [loadLeaderboard]);

  // Add or update a score
  const addScore = useCallback(async (entry: Omit<LeaderboardEntry, 'percentage' | 'timestamp'>) => {
    console.log('Submitting score to API:', entry);
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await fetch(`${API_BASE_URL}/api/submit`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(entry),
      });
      
      if (!response.ok) {
        throw new Error('Failed to submit score');
      }
      
      const result = await response.json();
      console.log('Score submission result:', result);
      
      // Refresh leaderboard after submission
      await loadLeaderboard();
      
      return result;
    } catch (err) {
      console.error('Error submitting score:', err);
      setError('Failed to submit score');
      
      // Fallback to localStorage
      const percentage = Math.round((entry.score / entry.totalWords) * 100);
      const newEntry: LeaderboardEntry = {
        ...entry,
        percentage,
        timestamp: Date.now(),
      };
      
      setLeaderboard(currentLeaderboard => {
        const existingIndex = currentLeaderboard.findIndex(item => item.fid === entry.fid);
        let updatedLeaderboard: LeaderboardEntry[];
        
        if (existingIndex >= 0) {
          const existing = currentLeaderboard[existingIndex];
          if (newEntry.percentage > existing.percentage || 
             (newEntry.percentage === existing.percentage && newEntry.score > existing.score)) {
            updatedLeaderboard = [...currentLeaderboard];
            updatedLeaderboard[existingIndex] = newEntry;
          } else {
            return currentLeaderboard;
          }
        } else {
          updatedLeaderboard = [...currentLeaderboard, newEntry];
        }
        
        updatedLeaderboard.sort((a, b) => {
          if (b.percentage !== a.percentage) return b.percentage - a.percentage;
          if (b.score !== a.score) return b.score - a.score;
          return a.timestamp - b.timestamp;
        });
        
        updatedLeaderboard = updatedLeaderboard.slice(0, 50);
        localStorage.setItem('whatTheGgerLeaderboard', JSON.stringify(updatedLeaderboard));
        return updatedLeaderboard;
      });
    } finally {
      setIsLoading(false);
    }
  }, [loadLeaderboard]);

  // Get user's rank
  const getUserRank = useCallback(async (fid: number): Promise<number> => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/user/${fid}`);
      if (response.ok) {
        const data = await response.json();
        return data.rank;
      }
    } catch (err) {
      console.error('Error fetching user rank:', err);
    }
    
    // Fallback to local calculation
    const index = leaderboard.findIndex(entry => entry.fid === fid);
    return index >= 0 ? index + 1 : -1;
  }, [leaderboard]);

  // Get user's best score
  const getUserScore = useCallback((fid: number): LeaderboardEntry | null => {
    return leaderboard.find(entry => entry.fid === fid) || null;
  }, [leaderboard]);

  // Clear all leaderboard data (for testing)
  const clearLeaderboard = useCallback(() => {
    localStorage.removeItem('whatTheGgerLeaderboard');
    setLeaderboard([]);
  }, []);

  // Refresh leaderboard manually
  const refreshLeaderboard = useCallback(() => {
    loadLeaderboard();
  }, [loadLeaderboard]);

  return {
    leaderboard,
    isLoading,
    error,
    addScore,
    getUserRank,
    getUserScore,
    clearLeaderboard,
    refreshLeaderboard,
  };
};

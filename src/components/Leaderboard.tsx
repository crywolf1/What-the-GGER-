import React from 'react';
import { Trophy, Medal, Award, User } from 'lucide-react';
import type { LeaderboardEntry } from '../types/game';
import './Leaderboard.css';

interface LeaderboardProps {
  leaderboard: LeaderboardEntry[];
  currentUserFid?: number;
  onClose: () => void;
}

const Leaderboard: React.FC<LeaderboardProps> = ({ leaderboard, currentUserFid, onClose }) => {
  const getRankIcon = (rank: number) => {
    switch (rank) {
      case 1:
        return <Trophy className="rank-icon gold" />;
      case 2:
        return <Medal className="rank-icon silver" />;
      case 3:
        return <Award className="rank-icon bronze" />;
      default:
        return <span className="rank-number">#{rank}</span>;
    }
  };

  const formatTimestamp = (timestamp: number) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));
    
    if (diffInHours < 1) return 'Just now';
    if (diffInHours < 24) return `${diffInHours}h ago`;
    if (diffInHours < 168) return `${Math.floor(diffInHours / 24)}d ago`;
    return date.toLocaleDateString();
  };

  return (
    <div className="leaderboard-overlay">
      <div className="leaderboard-modal">
        <div className="leaderboard-header">
          <h2>🏆 what the gger Leaderboard</h2>
          <button onClick={onClose} className="close-button">×</button>
        </div>
        
        <div className="leaderboard-content">
          {leaderboard.length === 0 ? (
            <div className="empty-leaderboard">
              <Trophy size={48} className="empty-icon" />
              <p>No scores yet!</p>
              <p>Be the first to complete the game and claim the top spot!</p>
            </div>
          ) : (
            <div className="leaderboard-list">
              {leaderboard.map((entry, index) => (
                <div 
                  key={entry.fid} 
                  className={`leaderboard-entry ${entry.fid === currentUserFid ? 'current-user' : ''}`}
                >
                  <div className="rank">
                    {getRankIcon(index + 1)}
                  </div>
                  
                  <div className="player-info">
                    <div className="player-avatar">
                      {entry.pfpUrl ? (
                        <img src={entry.pfpUrl} alt={entry.displayName || entry.username} />
                      ) : (
                        <User size={24} />
                      )}
                    </div>
                    <div className="player-details">
                      <div className="player-name">
                        {entry.displayName || entry.username || `User ${entry.fid}`}
                      </div>
                      <div className="player-meta">
                        {formatTimestamp(entry.timestamp)}
                      </div>
                    </div>
                  </div>
                  
                  <div className="score-info">
                    <div className="score">{entry.score}/{entry.totalWords}</div>
                    <div className="percentage">{entry.percentage}%</div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
        
        <div className="leaderboard-footer">
          <p>Scores are ranked by percentage, then by total correct answers.</p>
          <p>Only your best score is shown. Keep playing to improve!</p>
        </div>
      </div>
    </div>
  );
};

export default Leaderboard;

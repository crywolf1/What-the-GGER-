export interface LeaderboardEntry {
  fid: number;
  username: string;
  displayName: string;
  pfpUrl?: string;
  score: number;
  gamesPlayed: number;
  bestScore: number;
  timestamp: number;
}

export interface LeaderboardState {
  entries: LeaderboardEntry[];
  isLoading: boolean;
  error?: string;
}

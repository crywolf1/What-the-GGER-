# Global Leaderboard API Setup

## Quick Setup Instructions

### 1. Install API Dependencies
```bash
cd api
npm install
```

### 2. Setup MongoDB Connection
Edit `api/.env` file and add your MongoDB connection string:
```
MONGODB_URI=mongodb+srv://your-username:your-password@your-cluster.mongodb.net/whatthegger?retryWrites=true&w=majority
PORT=3001
```

### 3. Start the API Server
```bash
# In the api directory
npm run dev
```

### 4. Update Frontend API URL (for production)
Edit `src/hooks/useLeaderboard.ts` line 5:
```typescript
const API_BASE_URL = process.env.NODE_ENV === 'production' 
  ? 'https://your-deployed-api-url.com' // Update this with your deployed API URL
  : 'http://localhost:3001';
```

## API Endpoints

- `GET /api/leaderboard` - Get top 50 scores
- `POST /api/leaderboard/submit` - Submit a new score
- `GET /api/leaderboard/user/:fid` - Get user's rank and score
- `GET /api/health` - Health check

## MongoDB Collection Structure

The API creates a `scores` collection with documents like:
```json
{
  "_id": "ObjectId",
  "fid": 12345,
  "username": "username", 
  "displayName": "Display Name",
  "pfpUrl": "https://example.com/avatar.jpg",
  "score": 10,
  "totalWords": 13,
  "percentage": 77,
  "timestamp": 1640995200000
}
```

## Features

✅ **Global Leaderboard** - All Farcaster users see the same leaderboard
✅ **Real-time Updates** - Leaderboard refreshes after score submission
✅ **Offline Fallback** - Falls back to localStorage if API is unavailable
✅ **Best Score Tracking** - Only keeps each user's best score
✅ **Refresh Button** - Manual refresh option in the leaderboard modal
✅ **Loading States** - Shows loading indicators during API calls

## Deployment Options

### Vercel (Recommended)
1. Deploy API to Vercel
2. Update `API_BASE_URL` in frontend
3. Deploy frontend to Vercel

### Other Options
- Railway
- Render
- Heroku
- DigitalOcean App Platform

## Testing

1. Start the API server locally
2. Play through a game as a Farcaster user
3. Check the leaderboard - your score should appear
4. Try with multiple users to see global leaderboard working

const express = require('express');
const { MongoClient } = require('mongodb');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3001;

// Debug environment variables
console.log('Environment variables loaded:');
console.log('MONGODB_URI:', process.env.MONGODB_URI);
console.log('PORT:', process.env.PORT);

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB connection
let db;
// Temporarily hardcode the connection string to test
const MONGODB_URI = 'mongodb+srv://Dani:Dani1246@cluster0.lvnzddp.mongodb.net/whatthegger?retryWrites=true&w=majority';

console.log('Using MongoDB URI:', MONGODB_URI);

async function connectToDatabase() {
  try {
    const client = new MongoClient(MONGODB_URI);
    await client.connect();
    db = client.db('whatthegger');
    console.log('Connected to MongoDB');
  } catch (error) {
    console.error('Failed to connect to MongoDB:', error);
    process.exit(1);
  }
}

// Routes

// Get leaderboard (top 50 scores)
app.get('/api/leaderboard', async (req, res) => {
  try {
    const leaderboard = await db.collection('scores')
      .find({})
      .sort({ percentage: -1, score: -1, timestamp: 1 })
      .limit(50)
      .toArray();
    
    res.json(leaderboard);
  } catch (error) {
    console.error('Error fetching leaderboard:', error);
    res.status(500).json({ error: 'Failed to fetch leaderboard' });
  }
});

// Submit or update a score
app.post('/api/leaderboard/submit', async (req, res) => {
  try {
    const { fid, username, displayName, pfpUrl, score, totalWords } = req.body;
    
    if (!fid || score === undefined || !totalWords) {
      return res.status(400).json({ error: 'Missing required fields' });
    }
    
    const percentage = Math.round((score / totalWords) * 100);
    const timestamp = Date.now();
    
    const newEntry = {
      fid,
      username: username || null,
      displayName: displayName || null,
      pfpUrl: pfpUrl || null,
      score,
      totalWords,
      percentage,
      timestamp
    };
    
    // Check if user already has a score
    const existingEntry = await db.collection('scores').findOne({ fid });
    
    if (existingEntry) {
      // Update only if new score is better
      if (percentage > existingEntry.percentage || 
         (percentage === existingEntry.percentage && score > existingEntry.score)) {
        await db.collection('scores').replaceOne({ fid }, newEntry);
        res.json({ message: 'Score updated', entry: newEntry, updated: true });
      } else {
        res.json({ message: 'Existing score is better', entry: existingEntry, updated: false });
      }
    } else {
      // Insert new entry
      await db.collection('scores').insertOne(newEntry);
      res.json({ message: 'Score submitted', entry: newEntry, updated: true });
    }
  } catch (error) {
    console.error('Error submitting score:', error);
    res.status(500).json({ error: 'Failed to submit score' });
  }
});

// Get user's rank and score
app.get('/api/leaderboard/user/:fid', async (req, res) => {
  try {
    const fid = parseInt(req.params.fid);
    
    // Get user's score
    const userScore = await db.collection('scores').findOne({ fid });
    
    if (!userScore) {
      return res.json({ rank: -1, score: null });
    }
    
    // Calculate rank
    const betterScores = await db.collection('scores')
      .countDocuments({
        $or: [
          { percentage: { $gt: userScore.percentage } },
          { 
            percentage: userScore.percentage, 
            score: { $gt: userScore.score }
          },
          { 
            percentage: userScore.percentage, 
            score: userScore.score,
            timestamp: { $lt: userScore.timestamp }
          }
        ]
      });
    
    const rank = betterScores + 1;
    
    res.json({ rank, score: userScore });
  } catch (error) {
    console.error('Error fetching user rank:', error);
    res.status(500).json({ error: 'Failed to fetch user rank' });
  }
});

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

// Start server
connectToDatabase().then(() => {
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
});

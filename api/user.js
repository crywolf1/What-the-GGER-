const { MongoClient } = require('mongodb');

let cachedDb = null;

async function connectToDatabase() {
  if (cachedDb) {
    return cachedDb;
  }

  const MONGODB_URI = process.env.MONGODB_URI;
  if (!MONGODB_URI) {
    throw new Error('MONGODB_URI environment variable is not set');
  }

  const client = new MongoClient(MONGODB_URI);
  await client.connect();
  cachedDb = client.db('whatthegger');
  return cachedDb;
}

module.exports = async (req, res) => {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { fid } = req.query;
    
    if (!fid) {
      return res.status(400).json({ error: 'FID parameter is required' });
    }
    
    const fidNumber = parseInt(fid);
    const db = await connectToDatabase();
    
    // Get user's score
    const userScore = await db.collection('scores').findOne({ fid: fidNumber });
    
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
};

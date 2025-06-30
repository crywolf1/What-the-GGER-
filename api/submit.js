import { MongoClient } from 'mongodb';

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

export default async function handler(req, res) {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

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
    
    const db = await connectToDatabase();
    
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
}

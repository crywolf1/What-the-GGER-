# Vercel Deployment Guide

## 🚀 Deploy to Vercel

### 1. **Prepare for Deployment**

Make sure these files are committed to your repository:
- `vercel.json` - Vercel configuration
- `api/leaderboard.js` - Leaderboard API endpoint  
- `api/submit.js` - Score submission API endpoint
- `api/user.js` - User rank API endpoint
- `api/health.js` - Health check endpoint

### 2. **Deploy to Vercel**

#### Option A: Using Vercel CLI
```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel

# Follow the prompts:
# - Link to existing project? No
# - Project name: what-the-gger
# - Directory: ./
# - Override settings? No
```

#### Option B: Using Vercel Dashboard
1. Go to [vercel.com](https://vercel.com)
2. Connect your GitHub repository
3. Import the project
4. Vercel will automatically detect it's a Vite project

### 3. **Set Environment Variables in Vercel**

In your Vercel dashboard:
1. Go to your project → Settings → Environment Variables
2. Add these variables:

```
Name: MONGODB_URI
Value: mongodb+srv://Dani:Dani1246@cluster0.lvnzddp.mongodb.net/whatthegger?retryWrites=true&w=majority
```

### 4. **Update Farcaster Frame URLs**

After deployment, update these files with your new Vercel URL:

#### `index.html`
```html
<meta property="fc:frame:image" content="https://your-app.vercel.app/api/frame.json" />
<meta property="fc:frame:post_url" content="https://your-app.vercel.app/api/frame" />
```

#### `public/.well-known/farcaster.json`
```json
{
  "name": "what the gger",
  "icon": "https://your-app.vercel.app/vite.svg",
  "homeUrl": "https://your-app.vercel.app",
  "imageUrl": "https://your-app.vercel.app/vite.svg"
}
```

#### `src/components/WordGame.tsx` (Share URL)
```typescript
embeds: ["https://your-app.vercel.app/"],
```

### 5. **API Endpoints After Deployment**

Your API will be available at:
- `https://your-app.vercel.app/api/leaderboard` - Get leaderboard
- `https://your-app.vercel.app/api/submit` - Submit score
- `https://your-app.vercel.app/api/user/[fid]` - Get user rank
- `https://your-app.vercel.app/api/health` - Health check

### 6. **Testing Deployment**

1. **Test the app**: Visit `https://your-app.vercel.app`
2. **Test API**: Visit `https://your-app.vercel.app/api/health`
3. **Test in Farcaster**: Share the URL in Warpcast
4. **Test leaderboard**: Play the game and check if scores save

### 7. **Common Issues & Solutions**

#### FUNCTION_INVOCATION_FAILED / Runtime Error
If you see runtime errors during deployment:

1. **Check vercel.json configuration**:
```json
{
  "version": 2,
  "builds": [
    {
      "src": "api/*.js",
      "use": "@vercel/node"
    }
  ],
  "functions": {
    "api/*.js": {
      "runtime": "nodejs18.x"
    }
  }
}
```

2. **Ensure API package.json has correct type**:
```json
{
  "type": "module",
  "dependencies": {
    "mongodb": "^6.3.0"
  }
}
```

3. **Check function format** - Each API function should:
```javascript
export default async function handler(req, res) {
  // Your function code
}
```

#### API Not Working
- Check Environment Variables in Vercel dashboard
- Check function logs in Vercel dashboard
- Make sure `vercel.json` is properly configured

#### Farcaster Frame Not Loading
- Check that all URLs are absolute (not relative)
- Verify `farcaster.json` is accessible
- Test frame metadata with frame validators

#### MongoDB Connection Issues
- Verify connection string in environment variables
- Check MongoDB Atlas IP whitelist (allow all: 0.0.0.0/0)
- Ensure database user has proper permissions

### 8. **Production Checklist**

- [ ] Environment variables set in Vercel
- [ ] All URLs updated to production domain
- [ ] Farcaster frame metadata working
- [ ] API endpoints responding
- [ ] MongoDB connection working
- [ ] Leaderboard saving scores
- [ ] Share functionality working
- [ ] App working in Warpcast

## 🎉 Ready for Launch!

Once deployed, your global leaderboard will work across all users!

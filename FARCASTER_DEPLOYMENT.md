# Farcaster Mini App Deployment Guide

## 📋 Before Deployment

After you deploy your app to Vercel, Netlify, or any hosting platform, you'll need to update the URLs in these files:

### 1. Update `index.html`
Replace `https://your-domain.vercel.app/` with your actual deployment URL in these lines:
- Line 20: `"url": "https://your-actual-domain.vercel.app/"`
- Line 30: `<meta property="fc:frame:post_url" content="https://your-actual-domain.vercel.app/" />`

### 2. Update Image URLs (if using absolute URLs)
If you want to use absolute URLs for images, replace:
- `"/images/burger.jpg"` with `"https://your-actual-domain.vercel.app/images/burger.jpg"`

## 🚀 Deployment Steps

1. **Deploy to Vercel/Netlify**
   ```bash
   # Build the app
   npm run build
   
   # Deploy (if using Vercel CLI)
   vercel --prod
   ```

2. **Update URLs in code**
   - Replace `your-domain.vercel.app` with your actual domain
   - Commit and redeploy

3. **Test Farcaster Integration**
   - Share your URL in Farcaster
   - Verify the frame preview appears
   - Test the "Play Game" button

## 🔧 Farcaster Frame Features

Your app includes:
- ✅ Proper Open Graph metadata
- ✅ Farcaster Frame v2 support
- ✅ Mini-app launch configuration
- ✅ Splash screen setup
- ✅ Responsive design for mobile
- ✅ Game preview image

## 📱 Testing

1. **Local Testing**: Your app works locally
2. **Frame Testing**: Use Farcaster Frame validator
3. **Mobile Testing**: Test on actual mobile devices
4. **Mini-app Testing**: Share in Farcaster to test integration

## 🎯 URL Structure

When deployed, your app will be accessible as:
- **Direct URL**: `https://your-domain.vercel.app/`
- **Farcaster Frame**: Shows preview + "Play Game" button
- **Mini-app**: Opens in Farcaster's mini-app viewer

## 🔄 Quick Update Script

After deployment, run this find-and-replace:
- Find: `your-domain.vercel.app`
- Replace: `your-actual-domain.vercel.app`
- Files: `index.html`, `src/components/FarcasterMeta.tsx`

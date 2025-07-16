import WordGame from './components/WordGame'
import FarcasterMeta from './components/FarcasterMeta'
import { useFarcasterFrame } from './hooks/useFarcasterFrame'
import './App.css'

function App() {
  const { isReady, isFrameContext, user, error } = useFarcasterFrame();

  // Show loading state until Farcaster Frame is ready
  if (!isReady) {
    return (
      <div className="app">
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>Loading Word Game...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="app">
      <FarcasterMeta 
        title="Word Guessing Game"
        description="Guess the 6-letter word from the image clues! 13 challenging words to solve."
        imageUrl="https://what-the-gger.vercel.app/images/ggger.png"
        appUrl="https://what-the-gger.vercel.app"
        splashBackgroundColor="#F2B149"
      />
      
      {/* Optional: Show user info if running in Farcaster */}
      {isFrameContext && user && (
        <div className="farcaster-user-info">
          {user.pfpUrl && (
            <img 
              src={user.pfpUrl} 
              alt={`${user.displayName || user.username}'s profile`}
              className="user-avatar"
              onError={(e) => {
                // Hide image if it fails to load
                e.currentTarget.style.display = 'none';
              }}
            />
          )}
          <div className="user-details">
            <p>Welcome, {user.displayName || user.username}!</p>
            <span className="user-fid">FID: {user.fid}</span>
          </div>
        </div>
      )}
      
      {error && (
        <div className="error-message">
          <p>⚠️ {error}</p>
        </div>
      )}
      
      <WordGame />
    </div>
  )
}

export default App

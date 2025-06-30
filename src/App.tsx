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
        imageUrl="https://what-the-gger.vercel.app/images/burger.jpg"
        appUrl="https://what-the-gger.vercel.app"
      />
      
      {/* Optional: Show user info if running in Farcaster */}
      {isFrameContext && user && (
        <div className="farcaster-user-info">
          <p>Welcome, {user.displayName || user.username}!</p>
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

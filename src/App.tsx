import WordGame from './components/WordGame'
import FarcasterMeta from './components/FarcasterMeta'
import './App.css'

function App() {
  return (
    <div className="app">
      <FarcasterMeta 
        title="Word Guessing Game"
        description="Guess the 6-letter word from the image clues! 13 challenging words to solve."
        imageUrl="/images/burger.jpg"
      />
      <WordGame />
    </div>
  )
}

export default App

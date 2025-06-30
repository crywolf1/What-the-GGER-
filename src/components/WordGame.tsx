import React from 'react';
import { RotateCcw } from 'lucide-react';
import { useWordGame } from '../hooks/useWordGame';
import './WordGame.css';

const WordGame: React.FC = () => {
  const {
    currentWord,
    currentWordIndex,
    userGuess,
    isAnswered,
    isCorrect,
    isGameComplete,
    results,
    setGuess,
    submitGuess,
    resetGame,
  } = useWordGame();

  const renderWordDisplay = () => {
    if (!currentWord) return null;
    
    return currentWord.word.split('').map((letter, index) => {
      const isRevealed = currentWord.revealedPositions.includes(index);
      const userLetter = userGuess[index] || '';
      
      // Show revealed letters, or user's typed letters, or underscores
      let displayLetter = '';
      if (isRevealed) {
        displayLetter = letter;
      } else if (userLetter) {
        displayLetter = userLetter;
      } else {
        displayLetter = '_';
      }
      
      return (
        <div key={index} className={`letter-box ${isRevealed ? 'revealed' : 'user-input'}`}>
          {displayLetter}
        </div>
      );
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (userGuess.length === 6) {
      submitGuess();
    }
  };

  const canSubmit = userGuess.length === 6 && !isAnswered;
  const correctCount = results.filter(r => r.isCorrect).length;

  if (isGameComplete) {
    return (
      <div className="word-game">
        <div className="game-header">
          <h1>� Game Complete!</h1>
          <p>Final Score: {correctCount}/{results.length}</p>
        </div>

        <div className="game-content">
          <div className="final-results">
            {results.map((result, index) => (
              <div key={index} className={`result-summary ${result.isCorrect ? 'correct' : 'incorrect'}`}>
                <span className="word-number">#{index + 1}</span>
                <span className="word-result">{result.word}</span>
                <span className="guess-result">Your guess: {result.guess || 'No guess'}</span>
                <span className={`status ${result.isCorrect ? 'correct' : 'incorrect'}`}>
                  {result.isCorrect ? '✓' : '✗'}
                </span>
              </div>
            ))}
          </div>

          <div className="action-buttons">
            <button onClick={resetGame} className="play-again-button">
              <RotateCcw size={20} />
              Play Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="word-game">
      <div className="game-header">
        <h1>🎯 Word Guessing Game</h1>
        <p>Word {currentWordIndex + 1} of 13</p>
      </div>

      <div className="game-content">
        {currentWord && (
          <>
            {/* Progress indicator */}
            <div className="progress-bar">
              <div 
                className="progress-fill" 
                style={{ width: `${((currentWordIndex + 1) / 13) * 100}%` }}
              ></div>
            </div>

            {/* Image Display */}
            <div className="image-container">
              <img 
                src={currentWord.imageUrl} 
                alt={`Guess word ${currentWordIndex + 1}`}
                className="game-image"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = 'https://via.placeholder.com/400x300?text=Image+Not+Found';
                }}
              />
            </div>

            {/* Word Display with live typing */}
            <div className="word-display">
              {renderWordDisplay()}
            </div>

            {/* Answer feedback */}
            {isAnswered && (
              <div className="answer-feedback">
                {isCorrect ? (
                  <div className="correct-feedback">
                    <h3>🎉 Correct!</h3>
                    <p>The word was: <strong>{currentWord.word}</strong></p>
                    <p className="auto-next">Moving to next word...</p>
                  </div>
                ) : (
                  <div className="incorrect-feedback">
                    <h3>❌ Incorrect!</h3>
                    <p>Your guess: <strong>{userGuess}</strong></p>
                    <p>The correct word was: <strong>{currentWord.word}</strong></p>
                    <p className="auto-next">Moving to next word...</p>
                  </div>
                )}
              </div>
            )}

            {/* Input Form */}
            {!isAnswered && (
              <form onSubmit={handleSubmit} className="guess-form">
                <input
                  type="text"
                  value={userGuess}
                  onChange={(e) => setGuess(e.target.value)}
                  placeholder="Type your 6-letter guess..."
                  className="guess-input"
                  maxLength={6}
                  autoComplete="off"
                  autoFocus
                />
                <button 
                  type="submit" 
                  disabled={!canSubmit}
                  className="submit-button"
                >
                  Submit Guess
                </button>
              </form>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default WordGame;

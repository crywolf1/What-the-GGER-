import { useReducer, useCallback } from 'react';
import type { GameState, GameAction } from '../types/game';
import { getAllWords } from '../data/words';

function gameReducer(state: GameState, action: GameAction): GameState {
  switch (action.type) {
    case 'SET_GUESS':
      return {
        ...state,
        userGuess: action.payload.toUpperCase().slice(0, 6),
      };
    
    case 'SUBMIT_GUESS': {
      const currentWord = state.words[state.currentWordIndex];
      const isCorrect = state.userGuess === currentWord.word;
      
      const newResult = {
        word: currentWord.word,
        guess: state.userGuess,
        isCorrect,
      };
      
      return {
        ...state,
        isAnswered: true,
        isCorrect,
        results: [...state.results, newResult],
      };
    }
    
    case 'NEXT_WORD': {
      const nextIndex = state.currentWordIndex + 1;
      const isComplete = nextIndex >= state.words.length;
      
      return {
        ...state,
        currentWordIndex: nextIndex,
        userGuess: '',
        isAnswered: false,
        isCorrect: false,
        isGameComplete: isComplete,
      };
    }
    
    case 'RESET_GAME':
      return {
        words: getAllWords(),
        currentWordIndex: 0,
        userGuess: '',
        isAnswered: false,
        isCorrect: false,
        isGameComplete: false,
        results: [],
      };
    
    default:
      return state;
  }
}

export function useWordGame() {
  const initializeState = (): GameState => ({
    words: getAllWords(),
    currentWordIndex: 0,
    userGuess: '',
    isAnswered: false,
    isCorrect: false,
    isGameComplete: false,
    results: [],
  });

  const [state, dispatch] = useReducer(gameReducer, null, initializeState);
  
  const setGuess = useCallback((guess: string) => {
    dispatch({ type: 'SET_GUESS', payload: guess });
  }, []);
  
  const submitGuess = useCallback(() => {
    dispatch({ type: 'SUBMIT_GUESS' });
    // Automatically go to next word after 2 seconds
    setTimeout(() => {
      dispatch({ type: 'NEXT_WORD' });
    }, 2000);
  }, []);
  
  const nextWord = useCallback(() => {
    dispatch({ type: 'NEXT_WORD' });
  }, []);
  
  const resetGame = useCallback(() => {
    dispatch({ type: 'RESET_GAME' });
  }, []);
  
  return {
    ...state,
    currentWord: state.words[state.currentWordIndex],
    setGuess,
    submitGuess,
    nextWord,
    resetGame,
  };
}

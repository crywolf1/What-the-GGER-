# Farcaster Mini App - Word Guessing Game 🎯

A fun and engaging word guessing game designed as a Farcaster mini app. Players are shown pictures as clues and must guess 6-character words with some letters revealed.

## 🎮 Game Features

- **Picture Clues**: Visual hints to help guess the word
- **Partial Reveals**: Some characters are shown, others must be guessed
- **6-Character Words**: All words are exactly 6 letters long
- **Hint System**: Players can reveal hints if they get stuck
- **Multiple Attempts**: 3 attempts to guess each word
- **Mobile-First Design**: Optimized for mobile and web interaction

## 🛠️ Tech Stack

- **React 18** with TypeScript
- **Vite** for fast development and building
- **Lucide React** for beautiful icons
- **CSS3** with modern styling and animations
- **Farcaster Core** for frame integration

## 🚀 Getting Started

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Start the development server:**
   ```bash
   npm run dev
   ```

3. **Build for production:**
   ```bash
   npm run build
   ```

## 🎯 How to Play

1. Look at the picture clue
2. Some letters of the 6-character word are revealed
3. Type your guess in the input field
4. You have 3 attempts to guess correctly
5. Use the hint button if you need extra help
6. Start a new game anytime with the "New Game" button

## 📱 Deployment

This app is designed to work as a Farcaster Frame. To deploy:

1. Build the project: `npm run build`
2. Deploy to your preferred hosting service (Vercel, Netlify, etc.)
3. Configure the frame metadata for Farcaster integration

## 🎨 Customization

- **Add more words**: Edit `src/data/words.ts` to add new word/image combinations
- **Modify difficulty**: Change revealed positions or add more attempts
- **Update styling**: Customize `src/components/WordGame.css` for different themes
- **Frame integration**: Modify `src/components/FarcasterFrame.tsx` for frame behavior

## 📝 License

MIT License - feel free to use and modify as needed!

---

Built with ❤️ for the Farcaster community

/**********************************************
 * STARTER CODE
 **********************************************/

/**
 * shuffle()
 * Shuffle the contents of an array
 *   depending the datatype of the source
 * Makes a copy. Does NOT shuffle the original.
 * Based on Steve Griffith's array shuffle prototype
 * @Parameters: Array or string
 * @Return: Scrambled Array or string, based on the provided parameter
 */
function shuffle (src) {
  const copy = [...src]

  const length = copy.length
  for (let i = 0; i < length; i++) {
    const x = copy[i]
    const y = Math.floor(Math.random() * length)
    const z = copy[y]
    copy[i] = z
    copy[y] = x
  }

  if (typeof src === 'string') {
    return copy.join('')
  }

  return copy
}

/**********************************************
 * YOUR CODE BELOW
 **********************************************/

const WORDS = shuffle([
  'video',
  'media',
  'photography',
  'design',
  'digital',
  'pixel',
  'anthony',
  'motion',
  'adobe',
  'coding',
]);

function App() {
const savedGame = loadGame();

  const [words, setWords] = React.useState(WORDS);
  const [wordIndex, setWordIndex] = React.useState(0);
  const [scrambled, setScrambled] = React.useState(shuffle(words[0]));
  const [guess, setGuess] = React.useState('');
  const [points, setPoints] = React.useState(0);
  const [strikes, setStrikes] = React.useState(0);
  const [message, setMessage] = React.useState('');
  const [passes, setPasses] = React.useState(3);

  const maxStrikes = 3;

  function handleGuess() {
    const correctWord = words[wordIndex];
    const playerGuess = guess.trim();

    if (playerGuess === correctWord) {
      setPoints(points + 1);
      setMessage('Correct!');

      const nextIndex = wordIndex + 1;
      if (nextIndex < words.length) {
        setWordIndex(nextIndex);
        setScrambled(shuffle(words[nextIndex]));
      } else {
        setMessage('You finished the game!');
      }
    } else {
      setStrikes(strikes + 1);
      setMessage('Incorrect.');
    }

    setGuess('');
  }

  function handlePass() {
    if (passes > 0 && wordIndex < words.length -1){
      const nextIndex = wordIndex + 1;
      setWordIndex(nextIndex);
      setScrambled(shuffle(words[nextIndex]));
      setPasses(passes - 1);
      setMessage('Word passed!');
      setGuess('');
    } else if (passes ===0) {
      setMessage('No passes left!');
    }
  }

  function resetGame() {
    setWordIndex(0);
    setPoints(0);
    setStrikes(0);
    setPasses(3);
    setMessage('');
    setScrambled(shuffle(words[0]));
    setGuess('');
  }

  React.useEffect(() => {
    const state = {
      wordIndex,
      points,
      strikes,
      passes,
      scrambled,
      message
    };
    localStorage.setItem('scrambleGame', JSON.stringify(state));
  }, [wordIndex, points, strikes, passes, scrambled, message])

  function loadGame() {
    const saved = localStorage.getItem('scrambleGame');
    return saved ? JSON.parse(saved) : null;
  }

  return (
    <div>
      <h1>Scramble</h1>

      {strikes < maxStrikes && wordIndex < words.length ? (
        <div className="game">
          <p className='board'>Points: {points} | Strikes: {strikes} / {maxStrikes}</p>
          <h2>{scrambled}</h2>
           <p className='message'>{message}</p>

          <input
            type="text"
            value={guess}
            onChange={(e) => setGuess(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') handleGuess();
            }}
          />

          <button onClick={handlePass} disabled={passes === 0}>Pass ({passes} left)</button>
        </div>
      ) : (
        <div>
          <h2>Game Over</h2>
          <p>{message}</p>
          <button onClick={resetGame}>Play Again</button>
        </div>
      )}
    </div>
  );
}

ReactDOM.render(<App />, document.body);

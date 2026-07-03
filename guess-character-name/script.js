class HangmanGame {
  static API_URL = 'https://hp-api.onrender.com/api/characters';
  static MAX_LIVES = 10;

  static normalizeLetter(char) {
    const map = {
      'á': 'a', 'č': 'c', 'ď': 'd', 'é': 'e', 'ě': 'e',
      'í': 'i', 'ň': 'n', 'ó': 'o', 'ř': 'r', 'š': 's',
      'ť': 't', 'ú': 'u', 'ů': 'u', 'ý': 'y', 'ž': 'z'
    };
    const lower = char.toLowerCase();
    return map[lower] || lower;
  }

  static getWordLetters(word) {
    return word.split('').filter(ch => ch !== ' ');
  }

  constructor() {
    this.characters = [];
    this.isReady = false;
    this.currentWord = '';
    this.guessedLetters = new Set();
    this.wrongLetters = new Set();
    this.lives = HangmanGame.MAX_LIVES;
    this.gameOver = false;

    this.heartsEl = document.getElementById('hearts');
    this.wordDisplayEl = document.getElementById('wordDisplay');
    this.wrongLettersEl = document.getElementById('wrongLetters');
    this.messageEl = document.getElementById('message');
    this.letterInput = document.getElementById('letterInput');
    this.guessBtn = document.getElementById('guessBtn');
    this.newGameBtn = document.getElementById('newGameBtn');
    this.overlay = document.getElementById('overlay');
    this.modalIcon = document.getElementById('modalIcon');
    this.modalTitle = document.getElementById('modalTitle');
    this.modalText = document.getElementById('modalText');
    this.modalBtn = document.getElementById('modalBtn');

    this.bindEvents();
    this.init();
  }

  bindEvents() {
    this.guessBtn.addEventListener('click', () => {
      this.guessLetter(this.letterInput.value);
    });

    this.letterInput.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') {
        this.guessLetter(this.letterInput.value);
      }
    });

    this.letterInput.addEventListener('input', () => {
      this.letterInput.value = this.letterInput.value.slice(-1);
    });

    this.newGameBtn.addEventListener('click', () => this.startNewGame());
    this.modalBtn.addEventListener('click', () => this.startNewGame());
  }

  async init() {
    this.setControlsEnabled(false);
    this.setMessage('Načítám postavy z API…', 'info');
    this.wordDisplayEl.innerHTML = '';

    const loaded = await this.loadCharacters();

    if (loaded) {
      this.startNewGame();
    } else {
      this.setMessage('Nepodařilo se načíst postavy. Zkus to znovu tlačítkem Nová hra.', 'error');
      this.newGameBtn.disabled = false;
    }
  }

  async loadCharacters() {
    try {
      const response = await fetch(HangmanGame.API_URL);

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }

      const data = await response.json();
      this.characters = data
        .map(character => character.name?.trim())
        .filter(name => name);

      if (this.characters.length === 0) {
        throw new Error('Prázdný seznam postav');
      }

      this.isReady = true;
      return true;
    } catch (error) {
      console.error('Chyba při načítání postav:', error);
      this.isReady = false;
      this.characters = [];
      return false;
    }
  }

  setControlsEnabled(enabled) {
    this.guessBtn.disabled = !enabled;
    this.letterInput.disabled = !enabled;
    this.newGameBtn.disabled = !enabled;
  }

  isLetterInWord(letter) {
    return HangmanGame.getWordLetters(this.currentWord).some(
      ch => HangmanGame.normalizeLetter(ch) === letter
    );
  }

  isWordComplete() {
    return HangmanGame.getWordLetters(this.currentWord).every(
      ch => this.guessedLetters.has(HangmanGame.normalizeLetter(ch))
    );
  }

  pickRandomCharacter() {
    return this.characters[Math.floor(Math.random() * this.characters.length)];
  }

  renderHearts() {
    this.heartsEl.innerHTML = '';
    for (let i = 0; i < HangmanGame.MAX_LIVES; i++) {
      const heart = document.createElement('div');
      heart.className = 'heart' + (i >= this.lives ? ' lost' : '');
      heart.innerHTML = `<svg viewBox="0 0 24 24"><path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41 0.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/></svg>`;
      this.heartsEl.appendChild(heart);
    }
  }

  renderWord() {
    this.wordDisplayEl.innerHTML = '';
    for (const ch of this.currentWord) {
      const slot = document.createElement('div');
      if (ch === ' ') {
        slot.className = 'letter-slot space';
      } else {
        const normalized = HangmanGame.normalizeLetter(ch);
        const isRevealed = this.guessedLetters.has(normalized);
        slot.className = 'letter-slot' + (isRevealed ? ' revealed' : '');
        slot.textContent = isRevealed ? ch.toUpperCase() : '';
      }
      this.wordDisplayEl.appendChild(slot);
    }
  }

  renderWrongLetters() {
    if (this.wrongLetters.size === 0) {
      this.wrongLettersEl.textContent = '—';
    } else {
      this.wrongLettersEl.textContent = [...this.wrongLetters].join(' ').toUpperCase();
    }
  }

  setMessage(text, type) {
    this.messageEl.textContent = text;
    this.messageEl.className = 'message ' + type;
  }

  showModal(won) {
    if (won) {
      this.modalIcon.textContent = '🎉';
      this.modalTitle.textContent = 'Gratulujeme!';
      this.modalText.innerHTML = `Uhodl/a jsi postavu:<br><span class="highlight">${this.currentWord}</span>`;
    } else {
      this.modalIcon.textContent = '💀';
      this.modalTitle.textContent = 'Došly životy!';
      this.modalText.innerHTML = `Správná postava byla:<br><span class="highlight">${this.currentWord}</span>`;
    }
    this.overlay.classList.add('visible');
  }

  endGame(won) {
    this.gameOver = true;
    this.guessedLetters = new Set(
      HangmanGame.getWordLetters(this.currentWord).map(
        ch => HangmanGame.normalizeLetter(ch)
      )
    );
    this.renderWord();
    this.guessBtn.disabled = true;
    this.letterInput.disabled = true;
    this.showModal(won);
  }

  async startNewGame() {
    if (!this.isReady) {
      this.setControlsEnabled(false);
      this.setMessage('Načítám postavy z API…', 'info');
      this.wordDisplayEl.innerHTML = '';

      const loaded = await this.loadCharacters();
      if (!loaded) {
        this.setMessage('Nepodařilo se načíst postavy. Zkus to znovu tlačítkem Nová hra.', 'error');
        this.newGameBtn.disabled = false;
        return;
      }
    }

    this.currentWord = this.pickRandomCharacter();
    this.guessedLetters = new Set();
    this.wrongLetters = new Set();
    this.lives = HangmanGame.MAX_LIVES;
    this.gameOver = false;

    this.renderHearts();
    this.renderWord();
    this.renderWrongLetters();
    this.setMessage('Hádej písmeno ve jménu postavy…', 'info');

    this.setControlsEnabled(true);
    this.letterInput.value = '';
    this.letterInput.focus();
    this.overlay.classList.remove('visible');
  }

  guessLetter(rawLetter) {
    if (this.gameOver || !this.isReady) return;

    const letter = HangmanGame.normalizeLetter(rawLetter);
    if (!letter || !/^[a-z]$/.test(letter)) {
      this.setMessage('Zadej prosím platné písmeno (A–Z).', 'error');
      return;
    }

    if (this.guessedLetters.has(letter) || this.wrongLetters.has(letter)) {
      this.setMessage(`Písmeno „${letter.toUpperCase()}" už jsi hádal/a.`, 'error');
      this.letterInput.value = '';
      return;
    }

    this.letterInput.value = '';

    if (this.isLetterInWord(letter)) {
      this.guessedLetters.add(letter);
      this.renderWord();
      this.setMessage(`Správně! Písmeno „${letter.toUpperCase()}" je ve jménu.`, 'success');

      if (this.isWordComplete()) {
        this.endGame(true);
      }
    } else {
      this.wrongLetters.add(letter);
      this.lives--;
      this.renderHearts();
      this.renderWrongLetters();
      this.setMessage(`Špatně! Písmeno „${letter.toUpperCase()}" ve jménu není.`, 'error');

      if (this.lives <= 0) {
        this.endGame(false);
      }
    }
  }
}

new HangmanGame();

class HangmanGame extends BaseGame {
  constructor() {
    super();
    this.characters = [];
    this.currentWord = '';
    this.guessedLetters = new Set();
    this.wrongLetters = new Set();

    this.wordDisplayEl = document.getElementById('wordDisplay');
    this.wrongLettersEl = document.getElementById('wrongLetters');
    this.letterInput = document.getElementById('letterInput');
    this.guessBtn = document.getElementById('guessBtn');

    this.bindEvents();
    this.init();
  }

  bindEvents() {
    this.bindCommonEvents(() => this.startNewGame());

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
  }

  async init() {
    this.setControlsEnabled(false);
    this.showLoading(true, 'Načítám postavy…');
    this.wordDisplayEl.replaceChildren();

    const loaded = await this.loadCharacters();
    this.showLoading(false);

    if (loaded) {
      this.startNewGame();
    } else {
      this.setMessage('Nepodařilo se načíst postavy. Zkus to znovu tlačítkem Nová hra.', 'error');
      this.newGameBtn.disabled = false;
    }
  }

  async loadCharacters() {
    try {
      const data = await getCharacters();
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
    return getWordLetters(this.currentWord).some(
      ch => normalizeLetter(ch) === letter
    );
  }

  isWordComplete() {
    return getWordLetters(this.currentWord).every(
      ch => this.guessedLetters.has(normalizeLetter(ch))
    );
  }

  pickRandomCharacter() {
    return this.characters[Math.floor(Math.random() * this.characters.length)];
  }

  renderWord() {
    this.wordDisplayEl.replaceChildren();
    for (const ch of this.currentWord) {
      const slot = document.createElement('div');
      if (ch === ' ') {
        slot.className = 'letter-slot space';
      } else {
        const normalized = normalizeLetter(ch);
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

  showModal(won) {
    if (won) {
      this.modalIcon.textContent = '🎉';
      this.modalTitle.textContent = 'Gratulujeme!';
      this.fillModalLines([
        { label: 'Uhodl/a jsi postavu:', value: this.currentWord }
      ]);
    } else {
      this.modalIcon.textContent = '💀';
      this.modalTitle.textContent = 'Došly životy!';
      this.fillModalLines([
        { label: 'Správná postava byla:', value: this.currentWord }
      ]);
    }
    this.openModal();
  }

  endGame(won) {
    this.gameOver = true;
    this.guessedLetters = new Set(
      getWordLetters(this.currentWord).map(ch => normalizeLetter(ch))
    );
    this.renderWord();
    this.guessBtn.disabled = true;
    this.letterInput.disabled = true;
    this.showModal(won);
  }

  async startNewGame() {
    if (!this.isReady) {
      this.setControlsEnabled(false);
      this.showLoading(true, 'Načítám postavy…');
      this.wordDisplayEl.replaceChildren();

      const loaded = await this.loadCharacters();
      this.showLoading(false);

      if (!loaded) {
        this.setMessage('Nepodařilo se načíst postavy. Zkus to znovu tlačítkem Nová hra.', 'error');
        this.newGameBtn.disabled = false;
        return;
      }
    }

    this.currentWord = this.pickRandomCharacter();
    this.guessedLetters = new Set();
    this.wrongLetters = new Set();
    this.lives = GAME_CONFIG.MAX_LIVES;
    this.gameOver = false;

    this.renderHearts();
    this.renderWord();
    this.renderWrongLetters();
    this.setMessage('Hádej písmeno ve jménu postavy…', 'info');

    this.setControlsEnabled(true);
    this.letterInput.value = '';
    this.letterInput.focus();
    this.closeModal();
  }

  guessLetter(rawLetter) {
    if (this.gameOver || !this.isReady) return;

    const letter = normalizeLetter(rawLetter);
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

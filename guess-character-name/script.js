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
    this.showLoading(true, STRINGS.loading.characters);
    this.wordDisplayEl.replaceChildren();

    const loaded = await this.loadCharacters();
    this.showLoading(false);

    if (loaded) {
      this.resetDeck(this.characters);
      this.startNewGame();
    } else {
      this.setMessage(STRINGS.errors.loadCharacters, 'error');
      this.newGameBtn.disabled = false;
    }
  }

  loadCharacters() {
    return this.loadGameData({
      fetchFn: getCharacters,
      transform: data => data
        .map(character => character.name?.trim())
        .filter(name => name),
      minCount: 1,
      emptyError: STRINGS.errors.emptyCharacters,
      logLabel: 'postav',
      assign: items => { this.characters = items; },
      onError: () => { this.characters = []; },
    });
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

  renderWord() {
    this.wordDisplayEl.replaceChildren();
    let group = null;

    for (const ch of this.currentWord) {
      if (ch === ' ') {
        if (group) {
          const space = document.createElement('div');
          space.className = 'letter-slot space';
          space.setAttribute('aria-hidden', 'true');
          group.appendChild(space);
        }
        group = null;
        continue;
      }

      if (!group) {
        group = document.createElement('div');
        group.className = 'word-group';
        this.wordDisplayEl.appendChild(group);
      }

      const normalized = normalizeLetter(ch);
      const isRevealed = this.guessedLetters.has(normalized);
      const slot = document.createElement('div');
      slot.className = 'letter-slot' + (isRevealed ? ' revealed' : '');
      slot.textContent = isRevealed ? ch.toUpperCase() : '';
      group.appendChild(slot);
    }
  }

  renderWrongLetters() {
    if (this.wrongLetters.size === 0) {
      this.wrongLettersEl.textContent = STRINGS.hangman.noWrongLetters;
    } else {
      this.wrongLettersEl.textContent = [...this.wrongLetters].join(' ').toUpperCase();
    }
  }

  showModal(won) {
    if (won) {
      this.modalIcon.textContent = '🎉';
      this.modalTitle.textContent = STRINGS.hangman.winTitle;
      this.fillModalLines([
        { label: STRINGS.hangman.winCharacter, value: this.currentWord }
      ]);
    } else {
      this.modalIcon.textContent = '💀';
      this.modalTitle.textContent = STRINGS.hangman.loseTitle;
      this.fillModalLines([
        { label: STRINGS.hangman.loseCharacter, value: this.currentWord }
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
      this.showLoading(true, STRINGS.loading.characters);
      this.wordDisplayEl.replaceChildren();

      const loaded = await this.loadCharacters();
      this.showLoading(false);

      if (!loaded) {
        this.setMessage(STRINGS.errors.loadCharacters, 'error');
        this.newGameBtn.disabled = false;
        return;
      }

      this.resetDeck(this.characters);
    }

    this.currentWord = this.pickFromDeck();
    this.guessedLetters = new Set();
    this.wrongLetters = new Set();
    this.lives = GAME_CONFIG.MAX_LIVES;
    this.gameOver = false;

    this.renderHearts();
    this.renderWord();
    this.renderWrongLetters();
    this.setMessage(STRINGS.hangman.guessCharacter, 'info');

    this.setControlsEnabled(true);
    this.letterInput.value = '';
    this.letterInput.focus();
    this.closeModal();
  }

  guessLetter(rawLetter) {
    if (this.gameOver || !this.isReady) return;

    const letter = normalizeLetter(rawLetter);
    if (!letter || !/^[a-z]$/.test(letter)) {
      this.setMessage(STRINGS.hangman.invalidLetter, 'error');
      return;
    }

    if (this.guessedLetters.has(letter) || this.wrongLetters.has(letter)) {
      this.setMessage(STRINGS.hangman.letterAlreadyGuessed(letter), 'error');
      this.letterInput.value = '';
      return;
    }

    this.letterInput.value = '';

    if (this.isLetterInWord(letter)) {
      this.guessedLetters.add(letter);
      this.renderWord();
      this.setMessage(STRINGS.hangman.correctInName(letter), 'success');

      if (this.isWordComplete()) {
        this.endGame(true);
      }
    } else {
      this.wrongLetters.add(letter);
      this.lives--;
      this.renderHearts();
      this.renderWrongLetters();
      this.setMessage(STRINGS.hangman.wrongInName(letter), 'error');

      if (this.lives <= 0) {
        this.endGame(false);
      }
    }
  }
}

new HangmanGame();

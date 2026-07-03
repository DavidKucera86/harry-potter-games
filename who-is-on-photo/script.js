class WhoIsOnPhotoGame extends BaseGame {
  constructor() {
    super();
    this.characters = [];
    this.currentCharacter = null;
    this.lastAnswer = null;

    this.photoEl = document.getElementById('characterPhoto');
    this.choicesEl = document.getElementById('choices');

    this.bindEvents();
    this.init();
  }

  bindEvents() {
    this.bindCommonEvents(() => this.startNewGame());
    this.photoEl.addEventListener('error', () => this.handleImageError());
  }

  async init() {
    this.setControlsEnabled(false);
    this.showLoading(true, STRINGS.loading.characters);

    const loaded = await this.loadCharacters();
    this.showLoading(false);

    if (loaded) {
      this.startNewGame();
    } else {
      this.setMessage(STRINGS.errors.loadCharacters, 'error');
      this.newGameBtn.disabled = false;
    }
  }

  loadCharacters() {
    return this.loadGameData({
      fetchFn: getCharacters,
      transform: data => data.filter(c => c.name && c.image),
      minCount: 4,
      emptyError: STRINGS.errors.notEnoughPhotoCharacters,
      logLabel: 'postav',
      assign: items => { this.characters = items; },
      onError: () => { this.characters = []; },
    });
  }

  setControlsEnabled(enabled) {
    this.newGameBtn.disabled = !enabled;
    this.choicesEl.querySelectorAll('button').forEach(btn => {
      btn.disabled = !enabled;
    });
  }

  renderRound() {
    this.currentCharacter = this.pickFromDeck();
    this.photoEl.src = this.currentCharacter.image;
    this.photoEl.alt = '';

    const others = this.shuffle(
      this.characters.filter(c => c.id !== this.currentCharacter.id)
    ).slice(0, 3);

    const options = this.shuffle([this.currentCharacter, ...others]);

    this.choicesEl.replaceChildren();
    for (const character of options) {
      const btn = document.createElement('button');
      btn.className = 'choice-btn';
      btn.textContent = character.name;
      btn.addEventListener('click', () => this.guessName(character.name, btn));
      this.choicesEl.appendChild(btn);
    }
  }

  handleImageError() {
    if (this.gameOver || !this.isReady) return;

    if (this.currentCharacter) {
      this.returnToDeck(this.currentCharacter);
    }

    this.renderRound();
    this.setMessage(STRINGS.quiz.photoPrompt, 'info');
  }

  guessName(name, btn) {
    if (this.gameOver || !this.isReady) return;

    this.setControlsEnabled(false);
    const correct = name === this.currentCharacter.name;
    this.lastAnswer = {
      name: this.currentCharacter.name
    };

    if (correct) {
      btn.classList.add('correct');
      this.score++;
      this.renderScore();
      this.setMessage(STRINGS.quiz.photoCorrect(this.currentCharacter.name), 'success');
      setTimeout(() => this.nextRound(), 1200);
    } else {
      btn.classList.add('wrong');
      this.lives--;
      this.renderHearts();
      this.setMessage(STRINGS.quiz.photoWrong(this.currentCharacter.name), 'error');

      if (this.lives <= 0) {
        setTimeout(() => this.endGame(), 1200);
      } else {
        setTimeout(() => this.nextRound(), 1200);
      }
    }
  }

  nextRound() {
    if (this.gameOver) return;
    this.renderRound();
    this.setControlsEnabled(true);
    this.setMessage(STRINGS.quiz.photoPrompt, 'info');
  }

  showModal() {
    this.modalIcon.textContent = '💀';
    this.modalTitle.textContent = STRINGS.quiz.loseTitle;
    this.fillModalLines([
      { label: STRINGS.quiz.scoreLabel, value: this.score },
      { label: STRINGS.quiz.lastCharacterLabel, value: this.lastAnswer.name, gap: true }
    ]);
    this.openModal();
  }

  endGame() {
    this.gameOver = true;
    this.setControlsEnabled(false);
    this.showModal();
  }

  async startNewGame() {
    if (!this.isReady) {
      this.setControlsEnabled(false);
      this.showLoading(true, STRINGS.loading.characters);

      const loaded = await this.loadCharacters();
      this.showLoading(false);

      if (!loaded) {
        this.setMessage(STRINGS.errors.loadCharacters, 'error');
        this.newGameBtn.disabled = false;
        return;
      }
    }

    this.lives = GAME_CONFIG.MAX_LIVES;
    this.score = 0;
    this.gameOver = false;
    this.resetDeck(this.characters);
    this.renderHearts();
    this.renderScore();
    this.renderRound();
    this.setControlsEnabled(true);
    this.setMessage(STRINGS.quiz.photoPrompt, 'info');
    this.closeModal();
  }
}

new WhoIsOnPhotoGame();

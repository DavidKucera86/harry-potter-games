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
    this.showLoading(true, 'Načítám postavy…');

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
      this.characters = data.filter(c => c.name && c.image);

      if (this.characters.length < 4) {
        throw new Error('Nedostatek postav s fotkou');
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
    this.setMessage('Kdo je na fotce?', 'info');
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
      this.setMessage(`Správně! Je to ${this.currentCharacter.name}.`, 'success');
      setTimeout(() => this.nextRound(), 1200);
    } else {
      btn.classList.add('wrong');
      this.lives--;
      this.renderHearts();
      this.setMessage(
        `Špatně! Na fotce je ${this.currentCharacter.name}.`,
        'error'
      );

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
    this.setMessage('Kdo je na fotce?', 'info');
  }

  showModal() {
    this.modalIcon.textContent = '💀';
    this.modalTitle.textContent = 'Došly životy!';
    this.fillModalLines([
      { label: 'Tvé skóre:', value: this.score },
      { label: 'Poslední postava:', value: this.lastAnswer.name, gap: true }
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
      this.showLoading(true, 'Načítám postavy…');

      const loaded = await this.loadCharacters();
      this.showLoading(false);

      if (!loaded) {
        this.setMessage('Nepodařilo se načíst postavy. Zkus to znovu tlačítkem Nová hra.', 'error');
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
    this.setMessage('Kdo je na fotce?', 'info');
    this.closeModal();
  }
}

new WhoIsOnPhotoGame();

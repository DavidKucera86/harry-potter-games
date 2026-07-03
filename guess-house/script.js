class GuessHouseGame extends BaseGame {
  static HOUSES = ['Gryffindor', 'Slytherin', 'Ravenclaw', 'Hufflepuff'];
  static HOUSE_CLASSES = {
    Gryffindor: 'house-gryffindor',
    Slytherin: 'house-slytherin',
    Ravenclaw: 'house-ravenclaw',
    Hufflepuff: 'house-hufflepuff'
  };

  constructor() {
    super();
    this.characters = [];
    this.currentCharacter = null;
    this.lastAnswer = null;

    this.characterNameEl = document.getElementById('characterName');
    this.choicesEl = document.getElementById('choices');

    this.bindEvents();
    this.init();
  }

  bindEvents() {
    this.bindCommonEvents(() => this.startNewGame());
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
      this.characters = data.filter(
        c => c.name && GuessHouseGame.HOUSES.includes(c.house)
      );

      if (this.characters.length < 4) {
        throw new Error('Nedostatek postav');
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
    this.characterNameEl.textContent = this.currentCharacter.name;

    const wrongHouses = GuessHouseGame.HOUSES.filter(
      house => house !== this.currentCharacter.house
    );
    const options = this.shuffle([
      this.currentCharacter.house,
      ...this.shuffle(wrongHouses).slice(0, 3)
    ]);

    this.choicesEl.replaceChildren();
    for (const house of options) {
      const btn = document.createElement('button');
      btn.className = `choice-btn ${GuessHouseGame.HOUSE_CLASSES[house]}`;
      btn.textContent = house;
      btn.addEventListener('click', () => this.guessHouse(house, btn));
      this.choicesEl.appendChild(btn);
    }
  }

  guessHouse(house, btn) {
    if (this.gameOver || !this.isReady) return;

    this.setControlsEnabled(false);
    const correct = house === this.currentCharacter.house;
    this.lastAnswer = {
      name: this.currentCharacter.name,
      house: this.currentCharacter.house
    };

    if (correct) {
      btn.classList.add('correct');
      this.score++;
      this.renderScore();
      this.setMessage(`Správně! ${this.currentCharacter.name} patří do ${house}.`, 'success');
      setTimeout(() => this.nextRound(), 1200);
    } else {
      btn.classList.add('wrong');
      this.lives--;
      this.renderHearts();
      this.setMessage(
        `Špatně! ${this.currentCharacter.name} patří do ${this.currentCharacter.house}.`,
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
    this.setMessage('Vyber kolej, do které postava patří…', 'info');
  }

  showModal() {
    this.modalIcon.textContent = '💀';
    this.modalTitle.textContent = 'Došly životy!';
    this.fillModalLines([
      { label: 'Tvé skóre:', value: this.score },
      { label: 'Poslední postava:', value: this.lastAnswer.name, gap: true },
      { label: 'Správná kolej:', value: this.lastAnswer.house }
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
    this.setMessage('Vyber kolej, do které postava patří…', 'info');
    this.closeModal();
  }
}

new GuessHouseGame();

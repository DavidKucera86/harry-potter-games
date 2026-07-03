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
      transform: data => data.filter(
        c => c.name && GuessHouseGame.HOUSES.includes(c.house)
      ),
      minCount: 4,
      emptyError: STRINGS.errors.notEnoughCharacters,
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
      this.setMessage(
        STRINGS.quiz.houseCorrect(this.currentCharacter.name, house),
        'success'
      );
      setTimeout(() => this.nextRound(), 1200);
    } else {
      btn.classList.add('wrong');
      this.lives--;
      this.renderHearts();
      this.setMessage(
        STRINGS.quiz.houseWrong(this.currentCharacter.name, this.currentCharacter.house),
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
    this.setMessage(STRINGS.quiz.housePrompt, 'info');
  }

  showModal() {
    this.modalIcon.textContent = '💀';
    this.modalTitle.textContent = STRINGS.quiz.loseTitle;
    this.fillModalLines([
      { label: STRINGS.quiz.scoreLabel, value: this.score },
      { label: STRINGS.quiz.lastCharacterLabel, value: this.lastAnswer.name, gap: true },
      { label: STRINGS.quiz.correctHouseLabel, value: this.lastAnswer.house }
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
    this.setMessage(STRINGS.quiz.housePrompt, 'info');
    this.closeModal();
  }
}

new GuessHouseGame();

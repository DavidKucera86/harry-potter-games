class GuessHouseGame {
  static API_URL = 'https://hp-api.onrender.com/api/characters';
  static MAX_LIVES = 10;
  static HOUSES = ['Gryffindor', 'Slytherin', 'Ravenclaw', 'Hufflepuff'];
  static HOUSE_CLASSES = {
    Gryffindor: 'house-gryffindor',
    Slytherin: 'house-slytherin',
    Ravenclaw: 'house-ravenclaw',
    Hufflepuff: 'house-hufflepuff'
  };

  constructor() {
    this.characters = [];
    this.isReady = false;
    this.currentCharacter = null;
    this.lives = GuessHouseGame.MAX_LIVES;
    this.score = 0;
    this.gameOver = false;
    this.lastAnswer = null;
    this.remainingCharacters = [];

    this.heartsEl = document.getElementById('hearts');
    this.scoreEl = document.getElementById('score');
    this.characterNameEl = document.getElementById('characterName');
    this.choicesEl = document.getElementById('choices');
    this.messageEl = document.getElementById('message');
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
    this.newGameBtn.addEventListener('click', () => this.startNewGame());
    this.modalBtn.addEventListener('click', () => this.startNewGame());
  }

  async init() {
    this.setControlsEnabled(false);
    this.setMessage('Načítám postavy z API…', 'info');

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
      const response = await fetch(GuessHouseGame.API_URL);
      if (!response.ok) throw new Error(`HTTP ${response.status}`);

      const data = await response.json();
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

  renderHearts() {
    this.heartsEl.innerHTML = '';
    for (let i = 0; i < GuessHouseGame.MAX_LIVES; i++) {
      const heart = document.createElement('div');
      heart.className = 'heart' + (i >= this.lives ? ' lost' : '');
      heart.innerHTML = `<svg viewBox="0 0 24 24"><path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41 0.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/></svg>`;
      this.heartsEl.appendChild(heart);
    }
  }

  renderScore() {
    this.scoreEl.textContent = String(this.score);
  }

  setMessage(text, type) {
    this.messageEl.textContent = text;
    this.messageEl.className = 'message ' + type;
  }

  shuffle(array) {
    const copy = [...array];
    for (let i = copy.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [copy[i], copy[j]] = [copy[j], copy[i]];
    }
    return copy;
  }

  resetCharacterDeck() {
    this.remainingCharacters = this.shuffle([...this.characters]);
  }

  pickNextCharacter() {
    if (this.remainingCharacters.length === 0) {
      this.resetCharacterDeck();
    }

    const index = Math.floor(Math.random() * this.remainingCharacters.length);
    return this.remainingCharacters.splice(index, 1)[0];
  }

  renderRound() {
    this.currentCharacter = this.pickNextCharacter();
    this.characterNameEl.textContent = this.currentCharacter.name;

    const wrongHouses = GuessHouseGame.HOUSES.filter(h => h !== this.currentCharacter.house);
    const options = this.shuffle([
      this.currentCharacter.house,
      ...this.shuffle(wrongHouses).slice(0, 3)
    ]);

    this.choicesEl.innerHTML = '';
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
    this.setMessage('Vyber dům, do kterého postava patří…', 'info');
  }

  showModal() {
    this.modalIcon.textContent = '💀';
    this.modalTitle.textContent = 'Došly životy!';
    this.modalText.innerHTML =
      `Tvé skóre: <span class="highlight">${this.score}</span><br><br>` +
      `Poslední postava: <span class="highlight">${this.lastAnswer.name}</span><br>` +
      `Správný dům: <span class="highlight">${this.lastAnswer.house}</span>`;
    this.overlay.classList.add('visible');
  }

  endGame() {
    this.gameOver = true;
    this.setControlsEnabled(false);
    this.showModal();
  }

  async startNewGame() {
    if (!this.isReady) {
      this.setControlsEnabled(false);
      this.setMessage('Načítám postavy z API…', 'info');
      const loaded = await this.loadCharacters();
      if (!loaded) {
        this.setMessage('Nepodařilo se načíst postavy. Zkus to znovu tlačítkem Nová hra.', 'error');
        this.newGameBtn.disabled = false;
        return;
      }
    }

    this.lives = GuessHouseGame.MAX_LIVES;
    this.score = 0;
    this.gameOver = false;
    this.resetCharacterDeck();
    this.renderHearts();
    this.renderScore();
    this.renderRound();
    this.setControlsEnabled(true);
    this.setMessage('Vyber dům, do kterého postava patří…', 'info');
    this.overlay.classList.remove('visible');
  }
}

new GuessHouseGame();

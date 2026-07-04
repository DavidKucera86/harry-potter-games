import { GAME_CONFIG } from "./config.js";
import { BaseGame } from "./BaseGame.js";
import { getAutoRevealedLetters, getWordLetters, normalizeLetter } from "./hangmanUtils.js";
class HangmanGame extends BaseGame {
  config;
  words = [];
  currentWord = "";
  guessedLetters = /* @__PURE__ */ new Set();
  wrongLetters = /* @__PURE__ */ new Set();
  _lastModalWon = null;
  _lastFeedback = null;
  wordDisplayEl = null;
  wrongLettersEl = null;
  letterInput = null;
  guessBtn = null;
  constructor(config) {
    super();
    this.config = config;
    this.wordDisplayEl = document.getElementById("wordDisplay");
    this.wrongLettersEl = document.getElementById("wrongLetters");
    this.letterInput = document.getElementById("letterInput");
    this.guessBtn = document.getElementById("guessBtn");
    this.bindEvents();
    this.init();
  }
  get strings() {
    return this.config.resolveStrings();
  }
  bindEvents() {
    this.bindCommonEvents(() => this.startNewGame());
    if (this.guessBtn) {
      this.guessBtn.addEventListener("click", () => {
        this.guessLetter(this.letterInput?.value ?? "");
      });
    }
    if (this.letterInput) {
      this.letterInput.addEventListener("keydown", (e) => {
        if (e.key === "Enter") {
          e.preventDefault();
          this.guessLetter(this.letterInput.value);
        }
      });
      this.letterInput.addEventListener("input", () => {
        this.letterInput.value = this.letterInput.value.slice(-1);
      });
      this.letterInput.addEventListener("focus", () => {
        if (!window.matchMedia("(hover: hover) and (pointer: fine)").matches) {
          this.letterInput.scrollIntoView({ block: "nearest", behavior: "smooth" });
        }
      });
    }
  }
  async init() {
    this.setControlsEnabled(false);
    this.showLoading(true, this.config.resolveLoadingText());
    this.wordDisplayEl?.replaceChildren();
    const loaded = await this.loadWords();
    this.showLoading(false);
    if (loaded) {
      this.resetDeck(this.words);
      this.startNewGame();
    } else {
      this.setMessage(this._loadError ?? this.config.resolveLoadError(), "error");
      if (this.newGameBtn) {
        this.newGameBtn.disabled = false;
      }
    }
  }
  resolveLoadError(error) {
    return error instanceof Error && error.name === "FetchTimeoutError" ? this.config.resolveFetchTimeoutError?.() ?? this.config.resolveLoadError() : this.config.resolveLoadError();
  }
  loadWords() {
    return this.loadGameData({
      fetchFn: this.config.fetchFn,
      transform: this.config.transform,
      minCount: 1,
      emptyError: this.config.resolveEmptyError(),
      logLabel: this.config.logLabel,
      assign: (items) => {
        this.words = items;
      },
      onError: (error) => {
        this.words = [];
        this._loadError = this.resolveLoadError(error);
      }
    });
  }
  setControlsEnabled(enabled) {
    if (this.guessBtn) this.guessBtn.disabled = !enabled;
    if (this.letterInput) this.letterInput.disabled = !enabled;
    if (this.newGameBtn) this.newGameBtn.disabled = !enabled;
  }
  isLetterInWord(letter) {
    return getWordLetters(this.currentWord).some(
      (ch) => normalizeLetter(ch) === letter
    );
  }
  isWordComplete() {
    return getWordLetters(this.currentWord).every(
      (ch) => this.guessedLetters.has(normalizeLetter(ch))
    );
  }
  applyAutoRevealedLetters() {
    for (const letter of getAutoRevealedLetters(this.currentWord)) {
      this.guessedLetters.add(letter);
    }
  }
  renderWord() {
    if (!this.wordDisplayEl) return;
    this.wordDisplayEl.replaceChildren();
    let group = null;
    let letterCount = 0;
    let maxLetterCount = 0;
    const finalizeGroup = () => {
      if (letterCount > 0) {
        maxLetterCount = Math.max(maxLetterCount, letterCount);
      }
      letterCount = 0;
    };
    for (const ch of this.currentWord) {
      if (ch === " ") {
        if (group) {
          const space = document.createElement("div");
          space.className = "letter-slot space";
          space.setAttribute("aria-hidden", "true");
          group.appendChild(space);
        }
        finalizeGroup();
        group = null;
        continue;
      }
      if (!group) {
        group = document.createElement("div");
        group.className = "word-group";
        this.wordDisplayEl.appendChild(group);
      }
      const normalized = normalizeLetter(ch);
      const isRevealed = this.guessedLetters.has(normalized);
      const slot = document.createElement("div");
      slot.className = "letter-slot" + (isRevealed ? " revealed" : "");
      slot.textContent = isRevealed ? ch.toUpperCase() : "";
      group.appendChild(slot);
      letterCount++;
    }
    finalizeGroup();
    if (maxLetterCount > 0) {
      this.wordDisplayEl.style.setProperty("--slot-count", String(maxLetterCount));
    }
  }
  formatWrongLetters() {
    if (this.wrongLetters.size === 0) {
      return this.strings.noWrongLetters;
    }
    return [...this.wrongLetters].join(" ").toUpperCase();
  }
  renderWrongLetters() {
    if (!this.wrongLettersEl) return;
    this.wrongLettersEl.textContent = this.formatWrongLetters();
  }
  showModal(won) {
    if (!this.modalIcon || !this.modalTitle) return;
    if (won) {
      this.modalIcon.textContent = "\u{1F389}";
      this.modalTitle.textContent = this.strings.winTitle;
      this.fillModalLines([
        { label: this.strings.winLabel, value: this.currentWord },
        { label: this.strings.scoreLabel, value: this.score, gap: true }
      ]);
    } else {
      this.modalIcon.textContent = "\u{1F480}";
      this.modalTitle.textContent = this.strings.loseTitle;
      this.fillModalLines([
        { label: this.strings.loseLabel, value: this.currentWord },
        { label: this.strings.scoreLabel, value: this.score, gap: true },
        { label: this.strings.wrongLettersLabel, value: this.formatWrongLetters(), gap: true }
      ]);
    }
    this._lastModalWon = won;
    this.openModal();
  }
  endGame(won) {
    this.gameOver = true;
    if (won) {
      this.score++;
      this.renderScore();
    }
    this.guessedLetters = new Set(
      getWordLetters(this.currentWord).map((ch) => normalizeLetter(ch))
    );
    this.renderWord();
    if (this.guessBtn) this.guessBtn.disabled = true;
    if (this.letterInput) this.letterInput.disabled = true;
    this.showModal(won);
  }
  async startNewGame() {
    this.clearRoundTimeout();
    if (!this.isReady) {
      this.setControlsEnabled(false);
      this.showLoading(true, this.config.resolveLoadingText());
      this.wordDisplayEl?.replaceChildren();
      const loaded = await this.loadWords();
      this.showLoading(false);
      if (!loaded) {
        this.setMessage(this._loadError ?? this.config.resolveLoadError(), "error");
        if (this.newGameBtn) {
          this.newGameBtn.disabled = false;
        }
        return;
      }
      this.resetDeck(this.words);
    }
    this.currentWord = this.pickFromDeck() ?? "";
    if (!this.currentWord) {
      this.setMessage(this.config.resolveEmptyError(), "error");
      this.setControlsEnabled(false);
      if (this.newGameBtn) {
        this.newGameBtn.disabled = false;
      }
      return;
    }
    this.guessedLetters = /* @__PURE__ */ new Set();
    this.wrongLetters = /* @__PURE__ */ new Set();
    this.applyAutoRevealedLetters();
    this.lives = GAME_CONFIG.MAX_LIVES;
    this.gameOver = false;
    this._lastModalWon = null;
    this._lastFeedback = null;
    this.renderHearts();
    this.renderWord();
    this.renderWrongLetters();
    this.setMessage(this.strings.guessPrompt, "info");
    this.setControlsEnabled(true);
    if (this.letterInput) {
      this.letterInput.value = "";
      if (window.matchMedia("(hover: hover) and (pointer: fine)").matches) {
        this.letterInput.focus({ preventScroll: true });
      }
    }
    this.closeModal();
  }
  guessLetter(rawLetter) {
    if (this.gameOver || !this.isReady) return;
    const letter = normalizeLetter(rawLetter);
    if (!letter || !/^[a-z]$/.test(letter)) {
      this._lastFeedback = { letter: rawLetter, kind: "invalid" };
      this.setMessage(this.strings.invalidLetter, "error");
      return;
    }
    if (this.guessedLetters.has(letter) || this.wrongLetters.has(letter)) {
      this._lastFeedback = { letter, kind: "duplicate" };
      this.setMessage(this.strings.letterAlreadyGuessed(letter), "error");
      if (this.letterInput) {
        this.letterInput.value = "";
      }
      return;
    }
    if (this.letterInput) {
      this.letterInput.value = "";
    }
    if (this.isLetterInWord(letter)) {
      this.guessedLetters.add(letter);
      this.renderWord();
      this._lastFeedback = { letter, kind: "correct" };
      this.setMessage(this.strings.correct(letter), "success");
      if (this.isWordComplete()) {
        this.endGame(true);
      }
    } else {
      this.wrongLetters.add(letter);
      this.lives--;
      this.renderHearts();
      this.renderWrongLetters();
      this._lastFeedback = { letter, kind: "wrong" };
      this.setMessage(this.strings.wrong(letter), "error");
      if (this.lives <= 0) {
        this.endGame(false);
      }
    }
  }
  onLocaleChange() {
    this.renderWrongLetters();
    if (this.isModalOpen() && this._lastModalWon !== null) {
      this.showModal(this._lastModalWon);
      return;
    }
    if (!this.gameOver && this.getMessageType() === "info") {
      this.setMessage(this.strings.guessPrompt, "info");
      return;
    }
    if (!this.gameOver && this._lastFeedback) {
      const { letter, kind } = this._lastFeedback;
      if (kind === "correct") {
        this.setMessage(this.strings.correct(letter), "success");
      } else if (kind === "wrong") {
        this.setMessage(this.strings.wrong(letter), "error");
      } else if (kind === "duplicate") {
        this.setMessage(this.strings.letterAlreadyGuessed(letter), "error");
      } else {
        this.setMessage(this.strings.invalidLetter, "error");
      }
    }
  }
}
export {
  HangmanGame
};

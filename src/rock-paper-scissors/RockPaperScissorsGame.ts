import { GAME_CONFIG } from '../shared/config.js';
import { getCharacters } from '../shared/dataProvider.js';
import { getStrings } from '../shared/i18n/index.js';
import { BaseGame } from '../shared/BaseGame.js';
import { randomMove, resolveRps, type RpsMove, type RpsOutcome } from '../shared/rpsUtils.js';
import type { Character } from '../shared/types.js';

const MOVE_EMOJI: Record<RpsMove, string> = {
  rock: '🪨',
  paper: '📄',
  scissors: '✂️',
};

const HOUSE_CLASSES: Record<string, string> = {
  Gryffindor: 'house-gryffindor',
  Slytherin: 'house-slytherin',
  Ravenclaw: 'house-ravenclaw',
  Hufflepuff: 'house-hufflepuff',
};

type LastRound = {
  outcome: RpsOutcome;
  playerMove: RpsMove;
  opponentMove: RpsMove;
};

export class RockPaperScissorsGame extends BaseGame<Character> {
  characters: Character[] = [];
  currentOpponent: Character | null = null;
  playerWins = 0;
  opponentWins = 0;
  _lastRound: LastRound | null = null;
  _lastModalWon: boolean | null = null;
  _photoToken = 0;

  playerScoreEl: HTMLElement | null = null;
  opponentScoreEl: HTMLElement | null = null;
  photoFrameEl: HTMLElement | null = null;
  photoEl: HTMLImageElement | null = null;
  revealEl: HTMLElement | null = null;
  playerMoveEl: HTMLElement | null = null;
  opponentMoveEl: HTMLElement | null = null;
  opponentNameEl: HTMLElement | null = null;
  opponentHouseEl: HTMLElement | null = null;
  movesEl: HTMLElement | null = null;
  photoLoadTimeoutId: ReturnType<typeof setTimeout> | null = null;

  constructor() {
    super();

    this.playerScoreEl = document.getElementById('playerScore');
    this.opponentScoreEl = document.getElementById('opponentScore');
    this.photoFrameEl = document.querySelector('.photo-frame');
    this.photoEl = document.getElementById('opponentPhoto') as HTMLImageElement | null;
    this.revealEl = document.getElementById('duelReveal');
    this.playerMoveEl = document.getElementById('playerMove');
    this.opponentMoveEl = document.getElementById('opponentMove');
    this.opponentNameEl = document.getElementById('opponentName');
    this.opponentHouseEl = document.getElementById('opponentHouse');
    this.movesEl = document.getElementById('moves');

    if (this.photoEl) {
      this.photoEl.addEventListener('error', () => this.markPhotoBroken());
      this.photoEl.addEventListener('load', () => this.clearPhotoLoadTimeout());
    }

    // Anchor the end-of-match modal over the lower half of the photo instead of
    // the screen centre, so the opponent's face stays visible behind it.
    this.overlay?.classList.add('duel-overlay');
    window.addEventListener('resize', () => {
      if (this.isModalOpen()) {
        this.positionModalOverPhoto();
      }
    });

    this.bindCommonEvents(() => this.startNewGame());
    this.init();
  }

  /** Positions the modal so its top edge sits at the photo's vertical midpoint. */
  positionModalOverPhoto() {
    if (!this.modalDialog || !this.photoFrameEl) return;
    const rect = this.photoFrameEl.getBoundingClientRect();
    this.modalDialog.style.marginTop = `${rect.top + rect.height / 2}px`;
  }

  async init() {
    const strings = getStrings();
    this.setControlsEnabled(false);
    this.showLoading(true, strings.loading.characters);

    const loaded = await this.loadCharacters();
    this.showLoading(false);

    if (loaded) {
      this.startNewGame();
    } else {
      this.setMessage(this._loadError ?? strings.errors.loadCharacters, 'error');
      if (this.newGameBtn) {
        this.newGameBtn.disabled = false;
      }
    }
  }

  loadCharacters() {
    const strings = getStrings();
    return this.loadGameData({
      fetchFn: getCharacters,
      transform: (data: Character[]) => data.filter(c => c.name && c.image),
      minCount: 1,
      emptyError: strings.errors.notEnoughPhotoCharacters,
      logLabel: 'postav',
      assign: items => { this.characters = items; },
      onError: (error) => {
        this.characters = [];
        this._loadError = error instanceof Error && error.name === 'FetchTimeoutError'
          ? strings.errors.fetchTimeoutCharacters
          : strings.errors.loadCharacters;
      },
    });
  }

  setControlsEnabled(enabled: boolean) {
    if (this.newGameBtn) {
      this.newGameBtn.disabled = !enabled;
    }
    this.movesEl?.querySelectorAll('button').forEach(btn => {
      (btn as HTMLButtonElement).disabled = !enabled;
    });
  }

  buildMoveButtons() {
    if (!this.movesEl) return;

    const moves = getStrings().rps.moves;
    this.movesEl.replaceChildren();

    for (const move of Object.keys(MOVE_EMOJI) as RpsMove[]) {
      const btn = document.createElement('button');
      btn.className = 'choice-btn move-btn';
      btn.dataset.move = move;
      btn.textContent = moves[move];
      btn.addEventListener('click', () => this.handleMove(move));
      this.movesEl.appendChild(btn);
    }
  }

  renderScoreboard() {
    if (this.playerScoreEl) {
      this.playerScoreEl.textContent = String(this.playerWins);
    }
    if (this.opponentScoreEl) {
      this.opponentScoreEl.textContent = String(this.opponentWins);
    }
  }

  hideReveal() {
    this.revealEl?.setAttribute('hidden', '');
  }

  clearPhotoLoadTimeout() {
    if (this.photoLoadTimeoutId !== null) {
      clearTimeout(this.photoLoadTimeoutId);
      this.photoLoadTimeoutId = null;
    }
  }

  markPhotoBroken() {
    this.clearPhotoLoadTimeout();
    this.photoFrameEl?.classList.add('photo-broken');
  }

  showOpponentPhoto(opponent: Character) {
    if (!this.photoEl || !this.photoFrameEl) return;

    const token = ++this._photoToken;
    this.clearPhotoLoadTimeout();
    this.photoFrameEl.classList.remove('photo-broken');
    this.photoEl.src = opponent.image;
    this.photoEl.alt = getStrings().rps.opponentAlt;

    this.photoLoadTimeoutId = setTimeout(() => {
      if (token !== this._photoToken) return;
      if (this.photoEl!.complete && this.photoEl!.naturalWidth > 0) return;
      this.markPhotoBroken();
    }, GAME_CONFIG.PHOTO_LOAD_TIMEOUT_MS);
  }

  /** Draws a fresh opponent for a new match. The same opponent stays until the match is decided. */
  startMatch(): boolean {
    const strings = getStrings();
    this.currentOpponent = this.pickFromDeck();

    if (!this.currentOpponent) {
      this.movesEl?.replaceChildren();
      this.setMessage(strings.errors.notEnoughPhotoCharacters, 'error');
      this.setControlsEnabled(false);
      if (this.newGameBtn) {
        this.newGameBtn.disabled = false;
      }
      return false;
    }

    this.showOpponentPhoto(this.currentOpponent);
    this.beginRound();
    return true;
  }

  /** Resets the board for the next round against the current opponent. */
  beginRound() {
    this.hideReveal();
    this.setMessage(getStrings().rps.prompt, 'info');
    this.setControlsEnabled(true);
  }

  renderHouseBadge(opponent: Character) {
    if (!this.opponentHouseEl) return;

    const houseClass = HOUSE_CLASSES[opponent.house];
    this.opponentHouseEl.className = 'house-badge' + (houseClass ? ' ' + houseClass : '');
    this.opponentHouseEl.textContent = houseClass ? opponent.house : getStrings().rps.noHouse;
  }

  showReveal(round: LastRound, opponent: Character) {
    if (this.playerMoveEl) {
      this.playerMoveEl.textContent = MOVE_EMOJI[round.playerMove];
    }
    if (this.opponentMoveEl) {
      this.opponentMoveEl.textContent = MOVE_EMOJI[round.opponentMove];
    }
    if (this.opponentNameEl) {
      this.opponentNameEl.textContent = opponent.name;
    }
    this.renderHouseBadge(opponent);
    this.revealEl?.removeAttribute('hidden');
  }

  resolveRoundMessage(round: LastRound): string {
    const strings = getStrings();
    const playerLabel = strings.rps.moves[round.playerMove];
    const opponentLabel = strings.rps.moves[round.opponentMove];

    if (round.outcome === 'win') {
      return strings.rps.roundWin(playerLabel, opponentLabel);
    }
    if (round.outcome === 'lose') {
      return strings.rps.roundLose(playerLabel, opponentLabel);
    }
    return strings.rps.roundTie(playerLabel);
  }

  handleMove(playerMove: RpsMove) {
    if (this.gameOver || !this.isReady || !this.currentOpponent) return;

    this.setControlsEnabled(false);

    const opponentMove = randomMove();
    const outcome = resolveRps(playerMove, opponentMove);
    const round: LastRound = { outcome, playerMove, opponentMove };
    this._lastRound = round;
    const opponent = this.currentOpponent;

    this.showReveal(round, opponent);

    if (outcome === 'win') {
      this.playerWins++;
    } else if (outcome === 'lose') {
      this.opponentWins++;
    }
    this.renderScoreboard();

    const messageType = outcome === 'win' ? 'success' : outcome === 'lose' ? 'error' : 'info';
    this.setMessage(this.resolveRoundMessage(round), messageType);

    if (this.playerWins >= GAME_CONFIG.WINS_TO_MATCH) {
      this.scheduleRoundTimeout(() => this.endMatch(true), GAME_CONFIG.RPS_ROUND_DELAY_MS);
    } else if (this.opponentWins >= GAME_CONFIG.WINS_TO_MATCH) {
      this.scheduleRoundTimeout(() => this.endMatch(false), GAME_CONFIG.RPS_ROUND_DELAY_MS);
    } else {
      this.scheduleRoundTimeout(() => this.nextRound(), GAME_CONFIG.RPS_ROUND_DELAY_MS);
    }
  }

  nextRound() {
    if (this.gameOver) return;
    this.beginRound();
  }

  showModal(won: boolean) {
    if (!this.modalIcon || !this.modalTitle) return;

    const strings = getStrings();
    this.modalIcon.textContent = won ? '🏆' : '💀';
    this.modalTitle.textContent = won ? strings.rps.matchWinTitle : strings.rps.matchLoseTitle;
    this.fillModalLines([
      { label: strings.rps.yourWinsLabel, value: this.playerWins },
      { label: strings.rps.opponentWinsLabel, value: this.opponentWins },
      { label: strings.rps.lastOpponentLabel, value: this.currentOpponent?.name ?? '—', gap: true },
    ]);
    this._lastModalWon = won;
    this.openModal();
    this.positionModalOverPhoto();
  }

  endMatch(won: boolean) {
    this.gameOver = true;
    this.clearRoundTimeout();
    this.setControlsEnabled(false);
    this.showModal(won);
  }

  async startNewGame() {
    const strings = getStrings();
    this.clearRoundTimeout();

    if (!this.isReady) {
      this.setControlsEnabled(false);
      this.showLoading(true, strings.loading.characters);

      const loaded = await this.loadCharacters();
      this.showLoading(false);

      if (!loaded) {
        this.setMessage(this._loadError ?? strings.errors.loadCharacters, 'error');
        if (this.newGameBtn) {
          this.newGameBtn.disabled = false;
        }
        return;
      }
    }

    this.playerWins = 0;
    this.opponentWins = 0;
    this.gameOver = false;
    this._lastRound = null;
    this._lastModalWon = null;
    this.resetDeck(this.characters);

    this.buildMoveButtons();
    this.renderScoreboard();
    this.closeModal();
    this.startMatch();
  }

  onLocaleChange() {
    this.buildMoveButtons();

    if (this.isModalOpen() && this._lastModalWon !== null) {
      this.showModal(this._lastModalWon);
      return;
    }

    if (this.gameOver) {
      return;
    }

    if (this._lastRound && this.currentOpponent) {
      this.renderHouseBadge(this.currentOpponent);
      const messageType = this._lastRound.outcome === 'win'
        ? 'success'
        : this._lastRound.outcome === 'lose' ? 'error' : 'info';
      this.setMessage(this.resolveRoundMessage(this._lastRound), messageType);
    } else if (this.getMessageType() === 'info') {
      this.setMessage(getStrings().rps.prompt, 'info');
    }
  }
}

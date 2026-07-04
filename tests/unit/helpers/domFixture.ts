export function setupHangmanDom(): void {
  document.body.innerHTML = `
    <div class="game-container">
      <div id="loadingOverlay" hidden><p>Loading</p></div>
      <div class="status-bar">
        <div class="hearts" id="hearts"></div>
        <span class="score" id="score">0</span>
        <span id="wrongLetters"></span>
      </div>
      <div id="wordDisplay"></div>
      <div class="message info" id="message"></div>
      <input id="letterInput" type="text" />
      <button id="guessBtn">Guess</button>
      <button id="newGameBtn">New</button>
    </div>
    <div class="overlay" id="overlay" aria-hidden="true" inert>
      <div class="modal" id="modal" role="dialog" aria-modal="true" aria-labelledby="modalTitle" aria-hidden="true">
        <div id="modalIcon"></div>
        <h2 id="modalTitle"></h2>
        <p id="modalText"></p>
        <button id="modalBtn">Again</button>
      </div>
    </div>
  `;
}

export function setupQuizDom(withPhoto = false): void {
  document.body.innerHTML = `
    <div class="game-container">
      <div id="loadingOverlay" hidden><p>Loading</p></div>
      <div class="hearts" id="hearts"></div>
      <span class="score" id="score">0</span>
      <div id="characterName"></div>
      ${withPhoto ? '<img id="characterPhoto" />' : ''}
      <div class="message info" id="message"></div>
      <div class="choices-grid" id="choices"></div>
      <button id="newGameBtn">New</button>
    </div>
    <div class="overlay" id="overlay" aria-hidden="true" inert>
      <div class="modal" id="modal" role="dialog" aria-modal="true" aria-labelledby="modalTitle" aria-hidden="true">
        <div id="modalIcon"></div>
        <h2 id="modalTitle"></h2>
        <p id="modalText"></p>
        <button id="modalBtn">Again</button>
      </div>
    </div>
  `;
}

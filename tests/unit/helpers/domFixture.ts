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

export function setupChatDom(): void {
  document.body.innerHTML = `
    <div class="game-container" aria-busy="false">
      <div id="loadingOverlay" hidden><p>Loading</p></div>
      <section class="chat-setup" id="chatSetup">
        <h2 id="chatSetupHeading">Before we begin</h2>
        <form id="setupForm" novalidate>
          <label for="nickname">Nickname</label>
          <input type="text" id="nickname" name="nickname" maxlength="32" />
          <label for="characterSelect">Character</label>
          <select id="characterSelect" name="character"></select>
          <p class="message error" id="setupError" role="alert" hidden></p>
          <button type="submit" id="startChatBtn">Start</button>
        </form>
      </section>
      <section class="chat-room" id="chatRoom" hidden>
        <div class="chat-partner">
          <span class="chat-avatar">🧙</span>
          <span class="chat-partner-name" id="partnerName"></span>
          <span class="chat-partner-title" id="partnerTitle"></span>
        </div>
        <div class="chat-log" id="chatLog" role="log"></div>
        <form class="chat-input" id="chatForm">
          <input type="text" id="messageInput" name="message" maxlength="500" />
          <button type="submit" id="sendBtn">Send</button>
        </form>
        <button type="button" id="backToSetupBtn">Back</button>
      </section>
    </div>
  `;
}

export function setupRpsDom(): void {
  document.body.innerHTML = `
    <div class="game-container">
      <div id="loadingOverlay" hidden><p>Loading</p></div>
      <div class="status-bar duel-scoreboard">
        <span class="duel-side-score" id="playerScore">0</span>
        <span class="duel-side-score" id="opponentScore">0</span>
      </div>
      <div class="photo-frame duel-photo">
        <img id="opponentPhoto" src="" />
        <span class="photo-fallback">🧙</span>
      </div>
      <div class="duel-reveal" id="duelReveal" hidden>
        <span id="playerMove"></span>
        <span id="opponentMove"></span>
        <span id="opponentName"></span>
        <span class="house-badge" id="opponentHouse"></span>
      </div>
      <div class="message info" id="message"></div>
      <div class="choices-grid move-grid" id="moves"></div>
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

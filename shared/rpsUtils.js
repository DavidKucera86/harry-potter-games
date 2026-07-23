const RPS_MOVES = ["rock", "paper", "scissors"];
const BEATS = {
  rock: "scissors",
  paper: "rock",
  scissors: "paper"
};
function resolveRps(player, opponent) {
  if (player === opponent) {
    return "tie";
  }
  return BEATS[player] === opponent ? "win" : "lose";
}
function randomMove(random = Math.random) {
  const index = Math.floor(random() * RPS_MOVES.length);
  return RPS_MOVES[Math.min(Math.max(index, 0), RPS_MOVES.length - 1)];
}
export {
  RPS_MOVES,
  randomMove,
  resolveRps
};

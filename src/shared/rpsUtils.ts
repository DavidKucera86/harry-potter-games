export type RpsMove = 'rock' | 'paper' | 'scissors';
export type RpsOutcome = 'win' | 'lose' | 'tie';

export const RPS_MOVES: readonly RpsMove[] = ['rock', 'paper', 'scissors'] as const;

/** For each move, the move it beats. */
const BEATS: Record<RpsMove, RpsMove> = {
  rock: 'scissors',
  paper: 'rock',
  scissors: 'paper',
};

export function resolveRps(player: RpsMove, opponent: RpsMove): RpsOutcome {
  if (player === opponent) {
    return 'tie';
  }
  return BEATS[player] === opponent ? 'win' : 'lose';
}

export function randomMove(random: () => number = Math.random): RpsMove {
  const index = Math.floor(random() * RPS_MOVES.length);
  return RPS_MOVES[Math.min(Math.max(index, 0), RPS_MOVES.length - 1)];
}

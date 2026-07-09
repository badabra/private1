import { writeFileSync } from 'node:fs';
import { ingestDirectory } from './ingest.js';
import { extractPuzzlesFromGame } from './extractPuzzles.js';

function parseArgs(argv) {
  const args = { sizes: null, maxMateIn: 2, out: 'puzzles.jsonl', input: null, bots: null };
  for (let i = 0; i < argv.length; i++) {
    const arg = argv[i];
    if (arg === '--input') args.input = argv[++i];
    else if (arg === '--out') args.out = argv[++i];
    else if (arg === '--max-mate-in') args.maxMateIn = Number(argv[++i]);
    else if (arg === '--sizes') args.sizes = argv[++i].split(',').map(Number);
    else if (arg === '--bots') args.bots = argv[++i].split(',');
    else throw new Error(`Argument inconnu : "${arg}"`);
  }
  if (!args.input) throw new Error('--input <répertoire> est requis.');
  return args;
}

function matchesBotFilter(headers, bots) {
  if (!bots) return true;
  const players = [headers.Player1, headers.Player2, headers.White, headers.Black].filter(Boolean);
  return players.some((name) => bots.includes(name));
}

function main() {
  const args = parseArgs(process.argv.slice(2));
  const games = ingestDirectory(args.input);

  const filtered = games.filter(({ headers, game }) => {
    if (args.sizes && !args.sizes.includes(game.getState().size)) return false;
    if (!matchesBotFilter(headers, args.bots)) return false;
    return true;
  });

  const puzzles = filtered.flatMap((g) =>
    extractPuzzlesFromGame(g, { maxMateIn: args.maxMateIn })
  );

  const lines = puzzles.map((p) => JSON.stringify(p)).join('\n') + (puzzles.length ? '\n' : '');
  writeFileSync(args.out, lines, 'utf-8');

  console.log(`${filtered.length}/${games.length} partie(s) traitée(s) -> ${puzzles.length} puzzle(s) écrit(s) dans ${args.out}`);
}

main();

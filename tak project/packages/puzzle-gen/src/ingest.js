import { readdirSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import { gameFromPTN } from '@takhub/tak-engine';

/**
 * Lit un répertoire de fichiers `.ptn` (une partie standard par fichier) et
 * reconstruit chaque partie via `gameFromPTN`. Les fichiers illisibles ou
 * contenant un coup illégal sont ignorés (avec un avertissement), plutôt que
 * de faire échouer tout le traitement d'un lot.
 *
 * Volontairement limité aux fichiers PTN standard pour ce premier passage :
 * le format brut de l'export quotidien de playtak.com ("le format du
 * serveur") n'est pas documenté publiquement et reste à vérifier sur un
 * échantillon réel avant d'écrire un adaptateur dédié (voir le plan).
 */
export function ingestDirectory(dirPath) {
  const files = readdirSync(dirPath).filter((f) => f.endsWith('.ptn'));
  const games = [];

  for (const file of files) {
    const filePath = join(dirPath, file);
    const ptnText = readFileSync(filePath, 'utf-8');
    try {
      const { game, headers } = gameFromPTN(ptnText);
      games.push({ file, headers, game });
    } catch (err) {
      console.warn(`Ignoré (${file}) : ${err.message}`);
    }
  }

  return games;
}

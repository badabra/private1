import { useRef, useState } from 'react';
import { TakGame } from '@takhub/tak-engine';
import Board from '../components/board/Board3D.jsx';
import Controls from '../components/board/Controls.jsx';
import { useTakMove } from '../hooks/useTakMove.js';

const DEFAULT_SIZE = 5;

export default function PlayPage() {
  const [size, setSize] = useState(DEFAULT_SIZE);
  const gameRef = useRef(new TakGame(DEFAULT_SIZE));
  const [state, setState] = useState(gameRef.current.getState());

  const [ptnInput, setPtnInput] = useState('');
  const [ptnError, setPtnError] = useState('');

  function refresh() {
    setState(gameRef.current.getState());
  }

  // Applique un coup au moteur local (hot-seat) puis rafraîchit l'affichage.
  // Retourne true si le coup a été accepté, false sinon.
  function commitMove(moveStr) {
    setPtnError('');
    try {
      gameRef.current.play(moveStr);
      refresh();
      return true;
    } catch (err) {
      setPtnError(err.message);
      return false;
    }
  }

  const move = useTakMove({
    state,
    canAct: state.result === 'ONGOING',
    commitMove,
  });

  function startNewGame(newSize = size) {
    gameRef.current = new TakGame(newSize);
    setState(gameRef.current.getState());
    setPtnInput('');
    setPtnError('');
    move.clearSelection();
  }

  function handleSizeChange(newSize) {
    setSize(newSize);
    startNewGame(newSize);
  }

  function handlePlayPtn() {
    if (!ptnInput.trim()) return;
    if (commitMove(ptnInput.trim())) {
      setPtnInput('');
      move.clearSelection();
    }
  }

  return (
    <div className="flex flex-col lg:flex-row gap-6 items-start">
      <div className="flex-1 flex justify-center">
        <Board
          state={state}
          selected={move.selected}
          legalTargets={move.legalTargets}
          onSquareClick={move.handleSquareClick}
          pending={move.pending}
          onPickCount={move.handlePickCount}
          onCancelDrop={move.handleCancelPicker}
        />
      </div>
      <Controls
        state={state}
        size={size}
        onSizeChange={handleSizeChange}
        onNewGame={() => startNewGame(size)}
        placeType={move.placeType}
        setPlaceType={move.setPlaceType}
        selected={move.selected}
        hand={move.hand}
        spread={move.spread}
        pending={move.pending}
        onCancelSelection={move.clearSelection}
        ptnInput={ptnInput}
        setPtnInput={setPtnInput}
        onPlayPtn={handlePlayPtn}
        ptnError={ptnError}
        history={state.history}
      />
    </div>
  );
}

import { Canvas } from '@react-three/fiber';
import { OrbitControls, Html } from '@react-three/drei';
import { FLAT, WALL, CAP, PLAYER_WHITE, squareToCoords } from '@takhub/tak-engine';

const FILES = 'abcdefgh';

function squareName(col, row) {
  return `${FILES[col]}${row + 1}`;
}

function toWorld(col, row, size) {
  return [col - (size - 1) / 2, 0, (size - 1) / 2 - row];
}

function BoardBase({ size }) {
  return (
    <mesh position={[0, -0.12, 0]} receiveShadow>
      <boxGeometry args={[size + 0.7, 0.2, size + 0.7]} />
      <meshStandardMaterial color="#5c3d1e" roughness={0.95} metalness={0.05} />
    </mesh>
  );
}

function Tile({ isSelected, isHighlighted, isDark, onClick }) {
  let color;
  if (isSelected) color = '#f59e0b';
  else if (isHighlighted) color = '#34d399';
  else color = isDark ? '#c4a882' : '#d4bfa0';

  return (
    <mesh receiveShadow onClick={onClick}>
      <boxGeometry args={[0.97, 0.08, 0.97]} />
      <meshStandardMaterial color={color} roughness={0.85} metalness={0.05} />
    </mesh>
  );
}

// White glowing square border — each face has onClick so clicks on the ring also register
function PieceRing({ size, onClick }) {
  return (
    <mesh position={[0, 0.005, 0]} onClick={onClick}>
      <boxGeometry args={[size + 0.1, 0.02, size + 0.1]} />
      <meshStandardMaterial color="white" emissive="white" emissiveIntensity={0.9} transparent opacity={0.92} />
    </mesh>
  );
}

function Piece({ piece, index, onClick }) {
  const isWhite = piece.color === PLAYER_WHITE;
  const matColor = isWhite ? '#ede8da' : '#1c1c1c';
  const roughness = isWhite ? 0.45 : 0.65;
  const yBase = 0.08 + index * 0.17;

  if (piece.type === CAP) {
    return (
      <group position={[0, yBase, 0]}>
        <PieceRing size={0.32} onClick={onClick} />
        <mesh castShadow position={[0, 0.04, 0]} onClick={onClick}>
          <boxGeometry args={[0.38, 0.4, 0.38]} />
          <meshStandardMaterial color={matColor} roughness={0.3} metalness={0.35} />
        </mesh>
      </group>
    );
  }

  if (piece.type === WALL) {
    return (
      <group position={[0, yBase, 0]}>
        <PieceRing size={0.2} onClick={onClick} />
        <mesh castShadow position={[0, 0.04, 0]} onClick={onClick}>
          <boxGeometry args={[0.2, 0.48, 0.44]} />
          <meshStandardMaterial color={matColor} roughness={roughness} />
        </mesh>
      </group>
    );
  }

  // FLAT stone — thin square disc
  return (
    <group position={[0, yBase, 0]}>
      <PieceRing size={0.6} onClick={onClick} />
      <mesh castShadow position={[0, 0.03, 0]} onClick={onClick}>
        <boxGeometry args={[0.62, 0.09, 0.62]} />
        <meshStandardMaterial color={matColor} roughness={roughness} />
      </mesh>
    </group>
  );
}

// Small on-board "how many pieces?" picker, pinned above the target square
// (chess.com/lichess promotion-popup style). Renders as an HTML overlay via drei.
function MoveCountPicker({ label, max, position, onPick, onCancel }) {
  return (
    <Html position={position} center zIndexRange={[300, 0]} style={{ pointerEvents: 'none' }}>
      <div
        onPointerDown={(e) => e.stopPropagation()}
        style={{ pointerEvents: 'auto' }}
        className="flex flex-col items-center gap-1 rounded-lg border border-gray-300 bg-white/95 px-2 py-1.5 shadow-xl select-none"
      >
        <span className="text-[10px] font-semibold text-gray-500 whitespace-nowrap leading-none">
          {label}
        </span>
        <div className="flex gap-1">
          {Array.from({ length: max }, (_, i) => i + 1).map((n) => (
            <button
              key={n}
              onClick={(e) => { e.stopPropagation(); onPick(n); }}
              className="w-6 h-6 rounded bg-tak-board text-white text-xs font-bold hover:opacity-80 active:scale-95 transition"
            >
              {n}
            </button>
          ))}
        </div>
        <button
          onClick={(e) => { e.stopPropagation(); onCancel(); }}
          className="text-[10px] text-gray-400 hover:text-gray-700 leading-none"
        >
          annuler
        </button>
      </div>
    </Html>
  );
}

function Cell({ col, row, stack, size, isSelected, isHighlighted, onSquareClick }) {
  const square = squareName(col, row);
  const [x, y, z] = toWorld(col, row, size);
  const isDark = (col + row) % 2 === 0;

  const handleClick = (e) => { e.stopPropagation(); onSquareClick(square); };

  return (
    <group position={[x, y, z]}>
      <Tile
        isSelected={isSelected}
        isHighlighted={isHighlighted}
        isDark={isDark}
        onClick={handleClick}
      />
      {stack.map((piece, i) => (
        <Piece key={i} piece={piece} index={i} onClick={handleClick} />
      ))}
    </group>
  );
}

function Scene({ state, selected, legalTargets, onSquareClick, pending, onPickCount, onCancelDrop }) {
  const { size, board } = state;

  // World position for the pending picker: above the target square's stack.
  let pickerPos = null;
  if (pending) {
    const { col, row } = squareToCoords(pending.cell);
    const [x, , z] = toWorld(col, row, size);
    const height = board[row][col].length;
    pickerPos = [x, 0.6 + height * 0.18, z];
  }

  return (
    <>
      <ambientLight intensity={0.55} />
      <directionalLight
        position={[4, 10, 6]}
        intensity={0.9}
        castShadow
        shadow-mapSize={[1024, 1024]}
        shadow-camera-near={0.5}
        shadow-camera-far={30}
        shadow-camera-left={-8}
        shadow-camera-right={8}
        shadow-camera-top={8}
        shadow-camera-bottom={-8}
      />
      <directionalLight position={[-4, 5, -3]} intensity={0.25} />

      <BoardBase size={size} />

      {board.map((rowCells, row) =>
        rowCells.map((stack, col) => (
          <Cell
            key={squareName(col, row)}
            col={col}
            row={row}
            stack={stack}
            size={size}
            isSelected={selected === squareName(col, row)}
            isHighlighted={legalTargets?.includes(squareName(col, row))}
            onSquareClick={onSquareClick}
          />
        ))
      )}

      {pending && pickerPos && (
        <MoveCountPicker
          label={pending.type === 'pickup' ? `Prendre de ${pending.cell}` : `Poser sur ${pending.cell}`}
          max={pending.max}
          position={pickerPos}
          onPick={onPickCount}
          onCancel={onCancelDrop}
        />
      )}
    </>
  );
}

export default function Board3D({
  state,
  selected,
  legalTargets,
  onSquareClick,
  pending,
  onPickCount,
  onCancelDrop,
}) {
  return (
    <div style={{ width: '100%', height: '480px' }}>
      <Canvas
        shadows
        camera={{ position: [0, 7, 7], fov: 38 }}
        gl={{ antialias: true }}
      >
        <Scene
          state={state}
          selected={selected}
          legalTargets={legalTargets}
          onSquareClick={onSquareClick}
          pending={pending}
          onPickCount={onPickCount}
          onCancelDrop={onCancelDrop}
        />
        <OrbitControls
          enablePan={false}
          maxPolarAngle={Math.PI / 2.1}
          minPolarAngle={Math.PI / 7}
          minDistance={4}
          maxDistance={16}
        />
      </Canvas>
    </div>
  );
}

const E=require('./engine.js');
let pass=0,fail=0;
const t=(name,fn)=>{ try{ fn(); console.log('PASS '+name); pass++; }catch(e){ console.log('FAIL '+name+' — '+e.message); fail++; } };
const assert=(c,msg)=>{ if(!c) throw new Error(msg||'assert'); };

// ── built-in library lines (must all parse) ──
const BUILTINS={
 'Ruy Exchange':'1.e4 e5 2.Nf3 Nc6 3.Bb5 a6 4.Bxc6 dxc6 5.O-O f6 6.d4 exd4 7.Nxd4 c5 8.Nb3 Qxd1 9.Rxd1 Bg4 10.f3 Be6',
 'Ruy Closed tabiya':'1.e4 e5 2.Nf3 Nc6 3.Bb5 a6 4.Ba4 Nf6 5.O-O Be7 6.Re1 b5 7.Bb3 d6 8.c3 O-O 9.h3',
 'Berlin endgame':'1.e4 e5 2.Nf3 Nc6 3.Bb5 Nf6 4.O-O Nxe4 5.d4 Nd6 6.Bxc6 dxc6 7.dxe5 Nf5 8.Qxd8+ Kxd8',
 'French Advance':'1.e4 e6 2.d4 d5 3.e5 c5 4.c3 Nc6 5.Nf3 Qb6 6.a3 Bd7 7.b4 cxd4 8.cxd4 Rc8',
 'French Winawer':'1.e4 e6 2.d4 d5 3.Nc3 Bb4 4.e5 c5 5.a3 Bxc3+ 6.bxc3 Ne7 7.Qg4 Qc7 8.Qxg7 Rg8 9.Qxh7 cxd4',
 'Nimzo Classical':'1.d4 Nf6 2.c4 e6 3.Nc3 Bb4 4.Qc2 O-O 5.a3 Bxc3+ 6.Qxc3 b6 7.Bg5 Bb7 8.f3 h6 9.Bh4 d5',
};
for(const name in BUILTINS){
  t('builtin: '+name,()=>{
    const g=E.parseGame(BUILTINS[name]);
    assert(g.steps.length>0,'no steps');
  });
}

// ── specific mechanics ──
t('Berlin: queens really traded, black king on d8',()=>{
  const g=E.parseGame(BUILTINS['Berlin endgame']);
  const b=g.finalPos.board;
  assert(!Object.keys(b).some(sq=>b[sq].t==='q'),'a queen survived');
  assert(b['d8']&&b['d8'].t==='k'&&b['d8'].c==='b','black king not on d8');
});
t('Ruy Closed: both castled (Kg1 + Re1 after 6.Re1, Kg8/Rf8)',()=>{
  const b=E.parseGame(BUILTINS['Ruy Closed tabiya']).finalPos.board;
  assert(b['g1'].t==='k'&&b['e1'].t==='r','white side wrong (rook went f1→e1)');
  assert(b['g8'].t==='k'&&b['f8'].t==='r','black castle wrong');
});
t('Winawer: doubled c-pawns (c2+c3), queen grabbed g7/h7 pawns',()=>{
  const b=E.parseGame(BUILTINS['French Winawer']).finalPos.board;
  assert(b['c2']&&b['c2'].t==='p'&&b['c2'].c==='w','no pawn c2');
  assert(b['c3']&&b['c3'].t==='p'&&b['c3'].c==='w','no pawn c3');
  assert(b['h7']&&b['h7'].t==='q'&&b['h7'].c==='w','white Q not on h7');
});
t('en passant: 1.e4 c5 2.e5 d5 3.exd6 removes d5 pawn',()=>{
  const g=E.parseGame('1.e4 c5 2.e5 d5 3.exd6');
  const b=g.finalPos.board;
  assert(b['d6']&&b['d6'].t==='p'&&b['d6'].c==='w','white pawn not on d6');
  assert(!b['d5'],'captured pawn still on d5');
});
t('promotion: g8=Q creates a white queen',()=>{
  const g=E.parseGame('1.h4 g5 2.hxg5 Nf6 3.g6 Ne4 4.g7 Nc3 5.g8=Q');
  const b=g.finalPos.board;
  assert(b['g8']&&b['g8'].t==='q'&&b['g8'].c==='w','no white queen g8');
});
t('disambiguation: Nbd2 resolves to b1-knight; bare Nd2 is ambiguous',()=>{
  // after 2.d4 the d2 square is free, and both Nb1 and Nf3 can reach d2
  const g=E.parseGame('1.Nf3 d5 2.d4 c5 3.Nbd2');
  const last=g.steps[g.steps.length-1];
  assert(last.from==='b1'&&last.to==='d2','wrong knight moved: '+last.from);
  let threw=false;
  try{ E.parseGame('1.Nf3 d5 2.d4 c5 3.Nd2'); }catch(e){ threw=/ambiguous/.test(e.message); }
  assert(threw,'bare Nd2 did not throw ambiguous');
});
t('long castle O-O-O works',()=>{
  const g=E.parseGame('1.d4 d5 2.Nc3 Nc6 3.Bf4 Bf5 4.Qd2 Qd7 5.O-O-O O-O-O');
  const b=g.finalPos.board;
  assert(b['c1'].t==='k'&&b['d1'].t==='r','white O-O-O wrong');
  assert(b['c8'].t==='k'&&b['d8'].t==='r','black O-O-O wrong');
});
t('illegal move rejected',()=>{
  let threw=false;
  try{ E.parseGame('1.e4 e5 2.Ke2 Ke7 3.Ke1 Ke8 4.O-O'); }catch(e){ threw=true; }
  assert(threw,'castle after king moved was accepted');
});
t('FEN start: Lucena parses, W king b8 / W pawn b7',()=>{
  const g=E.parseGame('[FEN "1K1k4/1P6/8/8/8/8/r7/2R5 w - - 0 1"]');
  const b=g.finalPos.board;
  assert(g.steps.length===0,'expected position-only');
  assert(b['b8'].t==='k'&&b['b8'].c==='w','no white K b8');
  assert(b['b7'].t==='p'&&b['b7'].c==='w','no white P b7');
  assert(b['d8'].t==='k'&&b['d8'].c==='b','no black K d8');
});
t('real chess.com-style PGN with headers/comments/clock parses',()=>{
  const pgn=[
    '[Event "Live Chess"]','[Site "Chess.com"]','[White "playerA"]','[Black "playerB"]','[Result "1-0"]','',
    '1. e4 {[%clk 0:09:58]} e5 {[%clk 0:09:57]} 2. Nf3 (2. Bc4 Nf6) 2... Nc6 3. Bb5 a6 $1 4. Ba4 Nf6 5. O-O Be7 1-0'
  ].join('\n');
  const g=E.parseGame(pgn);
  assert(g.steps.length===10,'expected 10 plies, got '+g.steps.length);
  assert(g.finalPos.board['g1'].t==='k','white did not castle');
});
t('multi-game PGN splits into 2',()=>{
  const two='[Event "A"]\n[Result "1-0"]\n\n1.e4 e5 1-0\n\n[Event "B"]\n[Result "0-1"]\n\n1.d4 d5 0-1';
  const games=E.splitPGNGames(two);
  assert(games.length===2,'got '+games.length);
  assert(E.parseGame(games[0]).steps.length===2,'game A plies');
  assert(E.parseGame(games[1]).steps.length===2,'game B plies');
});
t('positions[] snapshots: after 1.e4 pawn on e4, after 1...e5 both center pawns',()=>{
  const g=E.parseGame('1.e4 e5');
  assert(g.positions[0].board['e4']&&!g.positions[0].board['e5'],'ply1 snapshot wrong');
  assert(g.positions[1].board['e4']&&g.positions[1].board['e5'],'ply2 snapshot wrong');
});

console.log('\n'+pass+' passed, '+fail+' failed');
process.exit(fail?1:0);

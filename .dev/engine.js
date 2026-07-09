// ── PGN/SAN ENGINE (embedded into chess-vision-trainer.html; node-testable copy) ──
const FILES='abcdefgh';
const START_FEN='rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1';
const SLIDE_R=[[1,0],[-1,0],[0,1],[0,-1]], SLIDE_B=[[1,1],[1,-1],[-1,1],[-1,-1]];
const KN_D=[[-2,-1],[-2,1],[-1,-2],[-1,2],[1,-2],[1,2],[2,-1],[2,1]];

function fenToPos(fen){
  const parts=fen.trim().split(/\s+/);
  const rows=parts[0].split('/');
  const board={};
  for(let ri=0;ri<8;ri++){
    const rank=8-ri; let file=0;
    for(const ch of rows[ri]){
      if(/\d/.test(ch)){ file+=+ch; continue; }
      board[FILES[file]+rank]={t:ch.toLowerCase(), c:ch===ch.toUpperCase()?'w':'b'};
      file++;
    }
  }
  return { board, turn:parts[1]||'w',
           castle:(parts[2]&&parts[2]!=='-')?parts[2]:'',
           ep:(parts[3]&&parts[3]!=='-')?parts[3]:null };
}
function clonePos(p){ return {board:Object.assign({},p.board),turn:p.turn,castle:p.castle,ep:p.ep}; }
function sqFR(sq){ return [FILES.indexOf(sq[0]), +sq[1]-1]; }
function frSq(f,r){ return FILES[f]+(r+1); }
function onB(f,r){ return f>=0&&f<8&&r>=0&&r<8; }

function attacked(pos,sq,by){
  const fr=sqFR(sq), f=fr[0], r=fr[1];
  for(const d of KN_D){
    if(!onB(f+d[0],r+d[1])) continue;
    const p=pos.board[frSq(f+d[0],r+d[1])];
    if(p&&p.c===by&&p.t==='n') return true;
  }
  for(let df=-1;df<=1;df++)for(let dr=-1;dr<=1;dr++){
    if(!df&&!dr) continue;
    if(!onB(f+df,r+dr)) continue;
    const p=pos.board[frSq(f+df,r+dr)];
    if(p&&p.c===by&&p.t==='k') return true;
  }
  const pd=by==='w'?1:-1;
  for(const df of [-1,1]){
    if(!onB(f+df,r-pd)) continue;
    const p=pos.board[frSq(f+df,r-pd)];
    if(p&&p.c===by&&p.t==='p') return true;
  }
  for(const grp of [[SLIDE_R,'rq'],[SLIDE_B,'bq']]){
    for(const d of grp[0]){
      let nf=f+d[0],nr=r+d[1];
      while(onB(nf,nr)){
        const p=pos.board[frSq(nf,nr)];
        if(p){ if(p.c===by&&grp[1].includes(p.t)) return true; break; }
        nf+=d[0]; nr+=d[1];
      }
    }
  }
  return false;
}
function kingSq(pos,c){ for(const sq in pos.board){ const p=pos.board[sq]; if(p.t==='k'&&p.c===c) return sq; } return null; }

function pieceDests(pos,from){
  const p=pos.board[from]; if(!p) return [];
  const fr=sqFR(from), f=fr[0], r=fr[1]; const out=[];
  const tryAdd=(nf,nr)=>{ if(!onB(nf,nr)) return false;
    const q=pos.board[frSq(nf,nr)];
    if(!q){ out.push(frSq(nf,nr)); return true; }
    if(q.c!==p.c) out.push(frSq(nf,nr));
    return false; };
  if(p.t==='n'){ for(const d of KN_D) tryAdd(f+d[0],r+d[1]); }
  else if(p.t==='k'){ for(let df=-1;df<=1;df++)for(let dr=-1;dr<=1;dr++){ if(df||dr) tryAdd(f+df,r+dr); } }
  else if(p.t==='p'){
    const d=p.c==='w'?1:-1, startR=p.c==='w'?1:6;
    if(onB(f,r+d)&&!pos.board[frSq(f,r+d)]){
      out.push(frSq(f,r+d));
      if(r===startR&&!pos.board[frSq(f,r+2*d)]) out.push(frSq(f,r+2*d));
    }
    for(const df of [-1,1]){
      if(!onB(f+df,r+d)) continue;
      const t=frSq(f+df,r+d), q=pos.board[t];
      if((q&&q.c!==p.c)||t===pos.ep) out.push(t);
    }
  }
  else {
    const dirs=p.t==='r'?SLIDE_R:p.t==='b'?SLIDE_B:SLIDE_R.concat(SLIDE_B);
    for(const d of dirs){
      let nf=f+d[0],nr=r+d[1];
      while(tryAdd(nf,nr)){ nf+=d[0]; nr+=d[1]; }
    }
  }
  return out;
}

function makeMove(pos,from,to,promo){
  const np=clonePos(pos); const p=np.board[from];
  delete np.board[from];
  if(p.t==='p'&&to===pos.ep&&!pos.board[to]){
    const tfr=sqFR(to);
    delete np.board[frSq(tfr[0], p.c==='w'?tfr[1]-1:tfr[1]+1)];
  }
  np.board[to]=promo?{t:promo,c:p.c}:p;
  if(p.t==='k'){
    const ff=sqFR(from)[0], tf=sqFR(to)[0];
    if(Math.abs(tf-ff)===2){
      const rank=from[1];
      if(tf>ff){ np.board['f'+rank]=np.board['h'+rank]; delete np.board['h'+rank]; }
      else     { np.board['d'+rank]=np.board['a'+rank]; delete np.board['a'+rank]; }
    }
    np.castle=np.castle.replace(p.c==='w'?/[KQ]/g:/[kq]/g,'');
  }
  for(const pair of [['a1','Q'],['h1','K'],['a8','q'],['h8','k']]){
    if(from===pair[0]||to===pair[0]) np.castle=np.castle.replace(pair[1],'');
  }
  np.ep=null;
  if(p.t==='p'){
    const ffr=sqFR(from), tfr=sqFR(to);
    if(Math.abs(tfr[1]-ffr[1])===2) np.ep=frSq(ffr[0],(ffr[1]+tfr[1])/2);
  }
  np.turn=pos.turn==='w'?'b':'w';
  return np;
}
function legalAfter(pos,from,to,promo){
  const np=makeMove(pos,from,to,promo);
  const k=kingSq(np,pos.turn);
  return !!k&&!attacked(np,k,np.turn);
}

function parseSAN(pos,sanRaw){
  let san=sanRaw.replace(/[+#!?]+$/,'');
  if(/^(O-O-O|0-0-0)$/.test(san)||/^(O-O|0-0)$/.test(san)){
    const long=/^(O-O-O|0-0-0)$/.test(san);
    const rank=pos.turn==='w'?'1':'8';
    const from='e'+rank, to=(long?'c':'g')+rank;
    const p=pos.board[from];
    if(!p||p.t!=='k'||p.c!==pos.turn) throw new Error('castle: no king on '+from);
    const need=pos.turn==='w'?(long?'Q':'K'):(long?'q':'k');
    if(!pos.castle.includes(need)) throw new Error('castle: no rights');
    const between=long?['d'+rank,'c'+rank,'b'+rank]:['f'+rank,'g'+rank];
    for(const s of between) if(pos.board[s]) throw new Error('castle: blocked');
    const opp=pos.turn==='w'?'b':'w';
    const walk=long?['e'+rank,'d'+rank,'c'+rank]:['e'+rank,'f'+rank,'g'+rank];
    for(const s of walk) if(attacked(pos,s,opp)) throw new Error('castle: through check');
    return {from,to,promo:null};
  }
  let promo=null;
  const pm=san.match(/=([QRBN])$/i);
  if(pm){ promo=pm[1].toLowerCase(); san=san.slice(0,pm.index); }
  const m=san.match(/^([KQRBN]?)([a-h]?)([1-8]?)x?([a-h][1-8])$/);
  if(!m) throw new Error('unreadable move: '+sanRaw);
  const pt=m[1]?m[1].toLowerCase():'p', df=m[2], dr=m[3], to=m[4];
  const cands=[];
  for(const sq in pos.board){
    const p=pos.board[sq];
    if(p.c!==pos.turn||p.t!==pt) continue;
    if(df&&sq[0]!==df) continue;
    if(dr&&sq[1]!==dr) continue;
    if(pieceDests(pos,sq).indexOf(to)===-1) continue;
    if(!legalAfter(pos,sq,to,promo)) continue;
    cands.push(sq);
  }
  if(cands.length===0) throw new Error('illegal move: '+sanRaw);
  if(cands.length>1)  throw new Error('ambiguous move: '+sanRaw);
  return {from:cands[0],to,promo};
}

function pgnToSANs(text){
  let fen=null;
  const fm=text.match(/\[FEN\s+"([^"]+)"/);
  if(fm) fen=fm[1];
  const noHdr=text.replace(/\[[^\]]*\]/g,' ').replace(/\{[^}]*\}/g,' ');
  let depth=0,out='';
  for(const ch of noHdr){
    if(ch==='(') depth++;
    else if(ch===')') depth=Math.max(0,depth-1);
    else if(depth===0) out+=ch;
  }
  const sans=out.replace(/\$\d+/g,' ')
    .replace(/\d+\.{1,3}/g,' ')
    .split(/\s+/)
    .filter(s=>s&&!/^(1-0|0-1|1\/2-1\/2|\*)$/.test(s));
  return {fen,sans};
}

// returns {startFen, steps[], positions[] (position AFTER each ply), finalPos}
function parseGame(text){
  const parsed=pgnToSANs(text);
  let pos=fenToPos(parsed.fen||START_FEN);
  const steps=[], positions=[];
  for(const san of parsed.sans){
    const mv=parseSAN(pos,san);
    steps.push({san,from:mv.from,to:mv.to,promo:mv.promo,
                piece:pos.board[mv.from].t,color:pos.turn,
                captured:!!(pos.board[mv.to]||(pos.board[mv.from].t==='p'&&mv.to===pos.ep))});
    pos=makeMove(pos,mv.from,mv.to,mv.promo);
    positions.push(pos);
  }
  return {startFen:parsed.fen||START_FEN,steps,positions,finalPos:pos};
}

function splitPGNGames(text){
  const games=[];
  let cur='';
  for(const line of text.split(/\r?\n/)){
    if(/^\[Event\b/i.test(line)&&cur.trim()&&/[a-h1-8]/.test(cur.replace(/\[[^\]]*\]/g,''))){
      games.push(cur.trim()); cur=line;
    } else cur+='\n'+line;
  }
  if(cur.trim()) games.push(cur.trim());
  return games.length?games:[text.trim()];
}

if(typeof module!=='undefined') module.exports={fenToPos,parseSAN,parseGame,splitPGNGames,makeMove,START_FEN,pgnToSANs};

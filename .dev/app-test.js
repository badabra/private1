const fs=require('fs');
const path=require('path');
const { JSDOM, VirtualConsole } = require(require('path').join(process.env.TEMP||'/tmp','node_modules','jsdom'));
const html=fs.readFileSync(path.join(__dirname,'..','chess-vision-trainer.html'),'utf8');

let pass=0,fail=0;
const t=(n,c,extra)=>{ if(c){console.log('PASS '+n);pass++;} else {console.log('FAIL '+n+(extra?' — '+extra:''));fail++;} };

function boot(breakStorage){
  const vc=new VirtualConsole();
  const errs=[];
  vc.on('jsdomError',e=>errs.push((e.detail&&e.detail.message)||e.message));
  const dom=new JSDOM(html,{runScripts:'dangerously',virtualConsole:vc,pretendToBeVisual:true,
    url:'http://localhost/',   // real origin so localStorage works in the NORMAL run
    beforeParse(w){
      w.speechSynthesis={cancel(){},speak(){}};
      w.SpeechSynthesisUtterance=function(){return{}};
      if(breakStorage) Object.defineProperty(w,'localStorage',{get(){throw new Error('SecurityError');}});
    }});
  return {dom,errs,doc:dom.window.document,win:dom.window};
}
const clickBtn=(doc,root,textPart)=>{
  const b=[...root.querySelectorAll('button')].find(x=>x.textContent.includes(textPart));
  if(!b) throw new Error('button not found: '+textPart);
  b.click(); return b;
};
const tab=(doc,textPart)=>{
  const b=[...doc.querySelectorAll('#mode-tabs .mtab')].find(x=>x.textContent.includes(textPart));
  if(!b) throw new Error('tab not found: '+textPart);
  b.click(); return b;
};
const typeEnter=(doc,win,val)=>{
  const inp=doc.getElementById('sq-input');
  inp.value=val;
  inp.dispatchEvent(new win.KeyboardEvent('keydown',{key:'Enter',bubbles:true}));
};

// ══════ boot both environments ══════
for(const sandbox of [false,true]){
  const {errs,doc}=boot(sandbox);
  const label=sandbox?'SANDBOX':'NORMAL';
  t(label+': no load errors', errs.length===0, errs[0]);
  t(label+': 64 squares', doc.querySelectorAll('#board .sq').length===64);
  t(label+': 31 mode tabs', doc.querySelectorAll('#mode-tabs .mtab').length===31,
    'got '+doc.querySelectorAll('#mode-tabs .mtab').length);
}

// ══════ drive the new modes (normal env) ══════
const {doc,win}=boot(false);

// — Library —
tab(doc,'📚 Library');
const libHtml=doc.getElementById('ans-area').innerHTML;
t('Library: built-ins listed', libHtml.includes('Ruy Lopez Exchange')&&libHtml.includes('Opera Game')&&libHtml.includes('Lucena'));
t('Library: 10 built-in sprint buttons', [...doc.querySelectorAll('[data-sprint]')].length===10,
  'got '+[...doc.querySelectorAll('[data-sprint]')].length);
// add a user game from chess.com-style PGN
doc.getElementById('lib-pgn').value='[Event "Live Chess"]\n[White "me"]\n[Black "them"]\n\n1. e4 {[%clk 0:09:58]} e5 2. Nf3 Nc6 3. Bc4 Bc5 1-0';
clickBtn(doc,doc.getElementById('ans-area'),'Add from text');
t('Library: user PGN added', doc.getElementById('ans-area').textContent.includes('me vs them'));
// bad PGN rejected with error
doc.getElementById('lib-pgn').value='1.e4 e5 2.Ke3';
clickBtn(doc,doc.getElementById('ans-area'),'Add from text');
t('Library: illegal move reported', doc.getElementById('ans-area').innerHTML.includes('illegal move'));

// — Sprints from library —
clickBtn(doc,doc.getElementById('ans-area'),'🏃');   // first sprint button (Ruy Exchange)
t('Sprint: board covered', !doc.getElementById('blind-cover').classList.contains('off'));
t('Sprint: SAN list shown', doc.getElementById('seq-display').textContent.includes('e4'));
clickBtn(doc,doc.getElementById('ans-area'),'Ready');
const q1=doc.getElementById('ex-title').textContent+doc.getElementById('ex-prompt').textContent;
t('Sprint: question 1 asked', q1.includes('question 1'));
// answer whatever form appeared
const ansButtons=[...doc.querySelectorAll('#ans-area .abtn')];
if(ansButtons.length){ ansButtons[0].click(); }
else typeEnter(doc,win,'a1');
t('Sprint: answer processed (score total=1)', doc.getElementById('s-total').textContent==='1');

// — Knight Tour —
tab(doc,'♞ Knight Tour');
const prompt=doc.getElementById('ex-prompt').textContent;
const m=prompt.match(/♞ (\w\d) → reach (\w\d)/i)||prompt.toUpperCase().match(/([A-H][1-8]).*?([A-H][1-8])/);
t('Knight Tour: prompt shows start → goal', !!m, prompt);
if(m){
  const FILES='abcdefgh';
  const start=m[1].toLowerCase(), goal=m[2].toLowerCase();
  const f=FILES.indexOf(start[0]), r=+start[1]-1;
  const hops=[[-2,-1],[-2,1],[-1,-2],[-1,2],[1,-2],[1,2],[2,-1],[2,1]]
    .map(d=>[f+d[0],r+d[1]]).filter(([a,b])=>a>=0&&a<8&&b>=0&&b<8)
    .filter(([a,b])=>FILES[a]+(b+1)!==goal);      // never accidentally finish
  const [hf,hr]=hops[0];
  const sq=FILES[hf]+(hr+1);
  const color=(hf+hr)%2===0?'d':'l';
  typeEnter(doc,win,sq+color);
  t('Knight Tour: legal hop+color accepted', doc.getElementById('ex-prompt').textContent.includes('hop 1'),
    doc.getElementById('ex-prompt').textContent);
  // wrong color must END the run with a persistent reveal (regression: Enter must not
  // bubble to the document handler and dismiss its own feedback)
  const hops2=[[-2,-1],[-2,1],[-1,-2],[-1,2],[1,-2],[1,2],[2,-1],[2,1]]
    .map(d=>[hf+d[0],hr+d[1]]).filter(([a,b])=>a>=0&&a<8&&b>=0&&b<8);
  const [wf,wr]=hops2[0];
  const wsq=FILES[wf]+(wr+1);
  const wrongColor=(wf+wr)%2===0?'l':'d';       // deliberately inverted
  typeEnter(doc,win,wsq+wrongColor);
  t('Knight Tour: wrong color fails with reveal', doc.getElementById('feedback').textContent.includes('Optimal'),
    'feedback: "'+doc.getElementById('feedback').textContent.slice(0,60)+'"');
  t('Regression: feedback survives the submitting Enter (no self-dismiss)',
    doc.getElementById('feedback').textContent.length>0);
}

// — Diagonal Quiz —
tab(doc,'⤢ Diagonal Quiz');
const dp=doc.getElementById('ex-prompt').textContent;
const dm=dp.match(/([A-H][1-8]) → ([A-H][1-8])/);
t('Diagonals: prompt shows ends', !!dm, dp);
if(dm){
  const FILES='abcdefgh';
  const a=dm[1].toLowerCase(), b=dm[2].toLowerCase();
  const df=Math.sign(FILES.indexOf(b[0])-FILES.indexOf(a[0]));
  const dr=Math.sign((+b[1])-(+a[1]));
  let cf=FILES.indexOf(a[0])+df, cr=(+a[1]-1)+dr;
  const second=FILES[cf]+(cr+1);
  typeEnter(doc,win,second);
  t('Diagonals: correct 2nd square accepted', doc.getElementById('ex-prompt').textContent.includes('✓ '+second.toUpperCase()),
    doc.getElementById('ex-prompt').textContent);
}

// — Sprints endgame (Lucena position-only) —
tab(doc,'📚 Library');
const lucenaBtn=[...doc.querySelectorAll('[data-sprint]')].find(x=>x.dataset.sprint==='bi-lucena');
lucenaBtn.click();
t('Lucena study: pieces rendered on board', doc.querySelectorAll('#board .piece').length>=4,
  'pieces: '+doc.querySelectorAll('#board .piece').length);
t('Lucena study: countdown running', doc.getElementById('ex-hint').textContent.includes('Covering'));

console.log('\n'+pass+' passed, '+fail+' failed');
process.exit(fail?1:0);

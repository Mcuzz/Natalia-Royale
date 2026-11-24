// Edita las afirmaciones aquí. Cada ronda tiene exactamente una verdad.
const rounds = [
  {
    "topic": "Fundamentos de RAID",
    "items": [
      [
        "RAID requiere que todas las unidades funcionen como sistemas de almacenamiento lógico separados.",
        false
      ],
      [
        "RAID combina varios discos duros o SSD en un solo sistema de almacenamiento lógico.",
        true
      ],
      [
        "RAID únicamente puede implementarse mediante controladores físicos.",
        false
      ]
    ],
    "why": "RAID integra múltiples unidades y puede implementarse mediante hardware o software."
  },
  {
    "topic": "Distribución de información",
    "items": [
      [
        "El striping distribuye los datos en bloques entre varios discos para mejorar la velocidad de acceso.",
        true
      ],
      [
        "El mirroring divide la información en fragmentos diferentes sin duplicarla.",
        false
      ],
      [
        "La paridad almacena exclusivamente copias idénticas de todos los archivos.",
        false
      ]
    ],
    "why": "Striping divide, mirroring duplica y parity almacena información adicional para reconstruir datos."
  },
  {
    "topic": "RAID 0 y RAID 1",
    "items": [
      [
        "RAID 0 permite recuperar la información cuando falla uno de sus discos.",
        false
      ],
      [
        "RAID 1 aprovecha la capacidad total de sus dos discos para almacenar información diferente.",
        false
      ],
      [
        "RAID 1 duplica la información y protege los datos ante el fallo de una de sus dos unidades.",
        true
      ]
    ],
    "why": "RAID 0 prioriza el rendimiento sin redundancia; RAID 1 utiliza el espejado."
  },
  {
    "topic": "RAID 5",
    "items": [
      [
        "RAID 5 necesita únicamente dos discos para distribuir datos y paridad.",
        false
      ],
      [
        "RAID 5 utiliza al menos tres discos y permite recuperar la información ante el fallo de una unidad.",
        true
      ],
      [
        "RAID 5 proporciona redundancia mediante copias idénticas de toda la información en cada disco.",
        false
      ]
    ],
    "why": "RAID 5 distribuye datos y paridad entre un mínimo de tres discos."
  },
  {
    "topic": "Respaldos y restauración",
    "items": [
      [
        "Los respaldos deben mantenerse en ubicaciones independientes y verificarse periódicamente.",
        true
      ],
      [
        "Implementar RAID elimina la necesidad de realizar copias de seguridad.",
        false
      ],
      [
        "Los procedimientos de restauración únicamente deben probarse después de perder información.",
        false
      ]
    ],
    "why": "RAID no sustituye los respaldos. La restauración debe probarse preventivamente."
  }
];
// Agrega tus imágenes a la carpeta images y escribe sus rutas aquí.
const images = {correct:'',wrong:'',timeout:''}; // Ejemplo: timeout:'images/tiempo.jpg'
const messages = ['¿Estabas esperando que se reconstruyera el RAID?','Hasta un disco de 5400 RPM reaccionó más rápido.','Error 408: neuronas fuera de tiempo.'];
const $=id=>document.getElementById(id);let round=0,score=0,phase='ready',timer,advance,items=[];
const wait=ms=>new Promise(resolve=>setTimeout(resolve,ms));
function shuffle(a){for(let i=a.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[a[i],a[j]]=[a[j],a[i]]}return a}
function render(){clearInterval(timer);clearTimeout(advance);phase='ready';$('openDice').disabled=false;$('round').textContent=`RONDA ${String(round+1).padStart(2,'0')} / 05`;$('score').textContent=`ACIERTOS ${String(score).padStart(2,'0')} / 05`;$('topic').textContent=rounds[round].topic;$('feedback').hidden=true;$('time').textContent='20';$('bar').style.width='100%';$('play').disabled=false;$('play').textContent='▶  PLAY';$('instruction').textContent='Encuentra la única afirmación verdadera.';items=rounds[round].items.slice();$('cards').replaceChildren();items.forEach((item,i)=>{const b=document.createElement('button');b.className='card';b.disabled=true;b.setAttribute('aria-label',`Carta ${i+1}, oculta`);const suit=["♠","♥","♣","♦"][(i+round)%4];b.dataset.suit=suit;b.classList.toggle("red",suit==="♥"||suit==="♦");b.innerHTML=`<div class="inner"><div class="face back"><div class="ornament"><span>♠　♥</span><b>N</b><small>NATALIA ROYALE</small><span>♦　♣</span></div></div><div class="face front"><div class="corner top">${i+1}<br>${suit}</div><small>AFIRMACIÓN</small><div class="pip">${suit}</div><p></p><span class="choice">ELEGIR CARTA</span><div class="corner bottom">${i+1}<br>${suit}</div></div></div>`;b.querySelector('.front p').textContent=item[0];b.onclick=()=>finish(b,item);b.item=item;$('cards').append(b)})}
async function start(){if(phase!=='ready')return;phase='mixing';$('openDice').disabled=true;$('play').disabled=true;$('instruction').textContent='Mezclando cartas…';const deck=$('cards');for(let n=0;n<4;n++){const old=[...deck.children],rects=new Map(old.map(c=>[c,c.getBoundingClientRect()]));let order=shuffle(old.slice());if(order.every((c,i)=>c===old[i]))order.push(order.shift());order.forEach(c=>deck.append(c));await Promise.all(order.map(c=>{const a=rects.get(c),b=c.getBoundingClientRect();return c.animate([{transform:`translate(${a.left-b.left}px,${a.top-b.top}px) scale(.94)`},{transform:'translate(0,0) scale(1)'}],{duration:390,easing:'ease-in-out'}).finished}));} [...deck.children].forEach((c,i)=>{c.classList.add('revealed');c.querySelector('.front small').textContent=`AFIRMACIÓN ${String(i+1).padStart(2,'0')}`;c.querySelectorAll('.corner').forEach(el=>el.innerHTML=`${i+1}<br>${c.dataset.suit}`);c.setAttribute('aria-label',c.item[0])});await wait(680);phase='answer';[...deck.children].forEach(c=>c.disabled=false);$('instruction').textContent='Selecciona la afirmación verdadera.';const deadline=performance.now()+20000;timer=setInterval(()=>{const left=Math.max(0,deadline-performance.now());$('time').textContent=Math.ceil(left/1000);$('bar').style.width=`${left/200}%`;if(left<=0)finish(null,null)},50)}
function finish(card,item){if(phase!=='answer')return;phase='feedback';clearInterval(timer);const type=!item?'timeout':item[1]?'correct':'wrong';if(type==='correct')score++;$('score').textContent=`ACIERTOS ${String(score).padStart(2,'0')} / 05`;[...$('cards').children].forEach(c=>{c.disabled=true;if(c.item[1]){c.classList.add('correct');c.querySelector('.choice').textContent='✓ VERDAD'}else{c.querySelector('.choice').textContent='× MENTIRA';if(c===card)c.classList.add('wrong')}});$('feedback').hidden=false;$('result').textContent=type==='correct'?'¡Respuesta correcta!':type==='wrong'?'Respuesta incorrecta.':messages[Math.floor(Math.random()*messages.length)];$('explanation').textContent=rounds[round].why;$('symbol').textContent=type==='correct'?'✓':type==='wrong'?'×':'⌛';$('meme').hidden=true;$('symbol').hidden=false;if(images[type]){$('meme').onload=()=>{$('meme').hidden=false;$('symbol').hidden=true};$('meme').onerror=()=>{$('meme').hidden=true;$('symbol').hidden=false};$('meme').src=images[type]}$('instruction').textContent='La carta marcada VERDAD es la correcta.';let seconds=7;$('next').textContent=`Continuando en ${seconds} s…`;function tick(){seconds--;if(seconds<=0){round++;if(round===rounds.length)end();else render();return}$('next').textContent=`Continuando en ${seconds} s…`;advance=setTimeout(tick,1000)}advance=setTimeout(tick,1000)}
function end(){phase='end';$('openDice').disabled=false;$('round').textContent='MISIÓN COMPLETADA';$('topic').textContent='Resultado final';$('cards').replaceChildren();$('feedback').hidden=false;$('result').textContent=`${score} / 5 respuestas correctas`;$('explanation').textContent=score===5?'Dominio del sistema: impecable.':score>=3?'Buen resultado. Revisa los conceptos que fallaste.':'Tu conocimiento necesita una restauración desde el respaldo.';$('next').textContent='';$('meme').hidden=true;$('symbol').hidden=false;$('symbol').textContent='★';$('play').disabled=false;$('play').textContent='↻ REINICIAR';$('instruction').textContent='¿Otra partida?';$('time').textContent='—';$('bar').style.width='0%'}
$('play').onclick=()=>{if(phase==='end'){round=0;score=0;render()}else start()};
// Selector independiente de la partida.
const modal=$('selector');
const patterns={1:[4],2:[0,8],3:[0,4,8],4:[0,2,6,8],5:[0,2,4,6,8],6:[0,2,3,5,6,8]};
const faces=['front','right','top','bottom','left','back'];
const angles=[[0,0],[0,-90],[90,0],[-90,0],[0,90],[0,180]];
let rolling=false;
for(const id of ['dieRow','dieCol']){
 const cube=$(id);
 faces.forEach((face,i)=>{const el=document.createElement('div');el.className='die-face face-'+face;for(let j=0;j<9;j++){const dot=document.createElement('i');if(patterns[i+1].includes(j))dot.className='pip-dot';el.append(dot)}cube.append(el)});
 cube.style.transform='rotateX(-18deg) rotateY(25deg)';
}
$('openDice').onclick=()=>{if(['ready','end'].includes(phase))modal.showModal()};
$('closeDice').onclick=()=>{if(!rolling)modal.close()};
modal.addEventListener('cancel',e=>{if(rolling)e.preventDefault()});
function animateDie(id,value){
 const cube=$(id), face=value<=6?value:1;
 cube.querySelector('.face-front').classList.toggle('numeric',value>6);
 cube.querySelector('.face-front').dataset.number=value>6?String(value):'';
 const [x,y]=angles[face-1];
 const final=`rotateX(${x}deg) rotateY(${y}deg) rotateZ(0deg)`;
 const initial=cube.style.transform;
 const reduced=matchMedia('(prefers-reduced-motion: reduce)').matches;
 const anim=cube.animate([{transform:initial},{transform:'translateY(-35px) rotateX(220deg) rotateY(160deg) rotateZ(85deg)',offset:.28},{transform:'translateY(-10px) rotateX(510deg) rotateY(420deg) rotateZ(220deg)',offset:.65},{transform:`translateY(-7px) rotateX(${720+x+12}deg) rotateY(${720+y}deg) rotateZ(360deg)`,offset:.88},{transform:`rotateX(${720+x}deg) rotateY(${720+y}deg) rotateZ(360deg)`}],{duration:reduced?1:1650,easing:'linear'});
 cube.style.transform=final;return anim.finished;
}
$('roll').onclick=async()=>{
 if(rolling)return;
 const r=Number($('rows').value),c=Number($('cols').value);
 if(!Number.isInteger(r)||!Number.isInteger(c)||r<1||c<1||r>30||c>30){$('seatResult').textContent='Introduce cantidades enteras entre 1 y 30.';return}
 rolling=true;for(const id of ['roll','closeDice','rows','cols'])$(id).disabled=true;
 $('seatResult').textContent='Rodando los dados…';$('rowValue').textContent='—';$('colValue').textContent='—';
 const a=1+Math.floor(Math.random()*r),b=1+Math.floor(Math.random()*c);
 try{await Promise.all([animateDie('dieRow',a),animateDie('dieCol',b)]);$('rowValue').textContent=a;$('colValue').textContent=b;$('seatResult').textContent=`¡Fila ${a}, columna ${b}!`;$('roll').textContent='↻ REPETIR LANZAMIENTO';}finally{rolling=false;for(const id of ['roll','closeDice','rows','cols'])$(id).disabled=false;}
};
render();

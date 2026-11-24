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
const images = { correct: '', wrong: '', timeout: '' }; // Ejemplo: timeout:'images/tiempo.jpg'
const messages = ['¿Estabas esperando que se reconstruyera el RAID?', 'Hasta un disco de 5400 RPM reaccionó más rápido.', 'Error 408: neuronas fuera de tiempo.'];
const $ = id => document.getElementById(id); let round = 0, score = 0, phase = 'ready', timer, advance, items = [];
const wait = ms => new Promise(resolve => setTimeout(resolve, ms));
function shuffle(a) { for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1));[a[i], a[j]] = [a[j], a[i]] } return a }
function render() { clearInterval(timer); clearTimeout(advance); phase = 'select'; $('selector').hidden = false; $('roll').disabled = false; $('roll').textContent = '⚄ LANZAR DADOS'; $('seatResult').textContent = 'Lanza los dados para elegir.'; $('dieRow').textContent = '?'; $('dieCol').textContent = '?'; $('round').textContent = `RONDA ${String(round + 1).padStart(2, '0')} / 05`; $('score').textContent = `ACIERTOS ${String(score).padStart(2, '0')} / 05`; $('topic').textContent = rounds[round].topic; $('feedback').hidden = true; $('time').textContent = '20'; $('bar').style.width = '100%'; $('play').disabled = true; $('play').textContent = '▶  PLAY'; $('instruction').textContent = 'Encuentra la única afirmación verdadera.'; items = rounds[round].items.slice(); $('cards').replaceChildren(); items.forEach((item, i) => { const b = document.createElement('button'); b.className = 'card'; b.disabled = true; b.setAttribute('aria-label', `Carta ${i + 1}, oculta`); const suit = ["♠", "♥", "♣", "♦"][(i + round) % 4]; b.dataset.suit = suit; b.classList.toggle("red", suit === "♥" || suit === "♦"); b.innerHTML = `<div class="inner"><div class="face back"><div class="ornament"><span>♠　♥</span><b>N</b><small>NATALIA ROYALE</small><span>♦　♣</span></div></div><div class="face front"><div class="corner top">${i + 1}<br>${suit}</div><small>AFIRMACIÓN</small><div class="pip">${suit}</div><p></p><span class="choice">ELEGIR CARTA</span><div class="corner bottom">${i + 1}<br>${suit}</div></div></div>`; b.querySelector('.front p').textContent = item[0]; b.onclick = () => finish(b, item); b.item = item; $('cards').append(b) }) }
async function start() { if (phase !== 'ready') return; phase = 'mixing'; used.add(currentSeat); $('selector').hidden = true; $('play').disabled = true; $('instruction').textContent = 'Mezclando cartas…'; const deck = $('cards'); for (let n = 0; n < 4; n++) { const old = [...deck.children], rects = new Map(old.map(c => [c, c.getBoundingClientRect()])); let order = shuffle(old.slice()); if (order.every((c, i) => c === old[i])) order.push(order.shift()); order.forEach(c => deck.append(c)); await Promise.all(order.map(c => { const a = rects.get(c), b = c.getBoundingClientRect(); return c.animate([{ transform: `translate(${a.left - b.left}px,${a.top - b.top}px) scale(.94)` }, { transform: 'translate(0,0) scale(1)' }], { duration: 390, easing: 'ease-in-out' }).finished })); } [...deck.children].forEach((c, i) => { c.classList.add('revealed'); c.querySelector('.front small').textContent = `AFIRMACIÓN ${String(i + 1).padStart(2, '0')}`; c.querySelectorAll('.corner').forEach(el => el.innerHTML = `${i + 1}<br>${c.dataset.suit}`); c.setAttribute('aria-label', c.item[0]) }); await wait(680); phase = 'answer';[...deck.children].forEach(c => c.disabled = false); $('instruction').textContent = 'Selecciona la afirmación verdadera.'; const deadline = performance.now() + 20000; timer = setInterval(() => { const left = Math.max(0, deadline - performance.now()); $('time').textContent = Math.ceil(left / 1000); $('bar').style.width = `${left / 200}%`; if (left <= 0) finish(null, null) }, 50) }
function finish(card, item) { if (phase !== 'answer') return; phase = 'feedback'; clearInterval(timer); const type = !item ? 'timeout' : item[1] ? 'correct' : 'wrong'; if (type === 'correct') score++; $('score').textContent = `ACIERTOS ${String(score).padStart(2, '0')} / 05`;[...$('cards').children].forEach(c => { c.disabled = true; if (c.item[1]) { c.classList.add('correct'); c.querySelector('.choice').textContent = '✓ VERDAD' } else { c.querySelector('.choice').textContent = '× MENTIRA'; if (c === card) c.classList.add('wrong') } }); $('feedback').hidden = false; $('result').textContent = type === 'correct' ? '¡Respuesta correcta!' : type === 'wrong' ? 'Respuesta incorrecta.' : messages[Math.floor(Math.random() * messages.length)]; $('explanation').textContent = rounds[round].why; $('symbol').textContent = type === 'correct' ? '✓' : type === 'wrong' ? '×' : '⌛'; $('meme').hidden = true; $('symbol').hidden = false; if (images[type]) { $('meme').onload = () => { $('meme').hidden = false; $('symbol').hidden = true }; $('meme').onerror = () => { $('meme').hidden = true; $('symbol').hidden = false }; $('meme').src = images[type] } $('instruction').textContent = 'La carta marcada VERDAD es la correcta.'; let seconds = 7; $('next').textContent = `Continuando en ${seconds} s…`; function tick() { seconds--; if (seconds <= 0) { round++; if (round === rounds.length) end(); else render(); return } $('next').textContent = `Continuando en ${seconds} s…`; advance = setTimeout(tick, 1000) } advance = setTimeout(tick, 1000) }
function end() { phase = 'end'; $('selector').hidden = true; $('round').textContent = 'MISIÓN COMPLETADA'; $('topic').textContent = 'Resultado final'; $('cards').replaceChildren(); $('feedback').hidden = false; $('result').textContent = `${score} / 5 respuestas correctas`; $('explanation').textContent = score === 5 ? 'Dominio del sistema: impecable.' : score >= 3 ? 'Buen resultado. Revisa los conceptos que fallaste.' : 'Tu conocimiento necesita una restauración desde el respaldo.'; $('next').textContent = ''; $('meme').hidden = true; $('symbol').hidden = false; $('symbol').textContent = '★'; $('play').disabled = false; $('play').textContent = '↻ REINICIAR'; $('instruction').textContent = '¿Otra partida?'; $('time').textContent = '—'; $('bar').style.width = '0%' }
$('play').onclick = () => { if (phase === 'end') { round = 0; score = 0; used.clear(); render() } else start() };
const used = new Set(); let currentSeat = null;
function drawDie(id, n) { const el = $(id); el.replaceChildren(); const patterns = { 1: [4], 2: [0, 8], 3: [0, 4, 8], 4: [0, 2, 6, 8], 5: [0, 2, 4, 6, 8], 6: [0, 2, 3, 5, 6, 8] }; if (n > 6) { el.textContent = n; return } for (let i = 0; i < 9; i++) { const dot = document.createElement('i'); if (patterns[n].includes(i)) dot.className = 'pip-dot'; el.append(dot) } }
$('roll').onclick = async () => { if (!['select', 'ready'].includes(phase)) return; const r = Number($('rows').value), c = Number($('cols').value); if (!Number.isInteger(r) || !Number.isInteger(c) || r < 1 || c < 1 || r > 30 || c > 30) { $('seatResult').textContent = 'Introduce cantidades enteras entre 1 y 30.'; return } const excluded = new Set($('excluded').value.split(';').map(x => x.replace(/\s/g, ''))); const pool = []; for (let i = 1; i <= r; i++)for (let j = 1; j <= c; j++) { const key = `${i},${j}`; if (!used.has(key) && !excluded.has(key)) pool.push(key) } if (!pool.length) { $('seatResult').textContent = 'No quedan asientos disponibles. Ajusta la configuración.'; return } phase = 'rolling'; $('roll').disabled = true; $('play').disabled = true; for (const id of ['rows', 'cols', 'excluded']) $(id).disabled = true; for (const id of ['dieRow', 'dieCol']) $(id).classList.add('rolling'); for (let i = 0; i < 14; i++) { drawDie('dieRow', 1 + Math.floor(Math.random() * r)); drawDie('dieCol', 1 + Math.floor(Math.random() * c)); await wait(95 + i * 5) } currentSeat = pool[Math.floor(Math.random() * pool.length)]; const [a, b] = currentSeat.split(',').map(Number); drawDie('dieRow', a); drawDie('dieCol', b); for (const id of ['dieRow', 'dieCol']) $(id).classList.remove('rolling'); $('seatResult').textContent = `¡Fila ${a}, columna ${b}!`; $('roll').textContent = '↻ REPETIR LANZAMIENTO'; $('roll').disabled = false; $('play').disabled = false; for (const id of ['rows', 'cols', 'excluded']) $(id).disabled = false; phase = 'ready'; $('instruction').textContent = `Participante: fila ${a}, columna ${b}. Presiona PLAY.` };
for (const id of ['rows', 'cols', 'excluded']) $(id).addEventListener('input', () => { if (phase === 'ready') { phase = 'select'; $('play').disabled = true; $('seatResult').textContent = 'Configuración modificada. Lanza los dados nuevamente.' } });
render();

const confirmSeat = document.getElementById('confirmSeat');

const modalObserver = new MutationObserver(() => {
    confirmSeat.disabled =
        phase !== 'ready' || $('play').disabled;
});

modalObserver.observe($('play'), {
    attributes: true,
    attributeFilter: ['disabled']
});

confirmSeat.onclick = () => {
    if (phase !== 'ready') return;

    $('selector').hidden = true;
    confirmSeat.disabled = true;
};

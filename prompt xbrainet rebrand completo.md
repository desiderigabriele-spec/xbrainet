# PROMPT INTEGRAZIONE ORB — talkwithalien.com
# Da incollare in Claude Design nella sessione esistente
# NON ricostruire da zero — sostituire solo l'elemento visivo centrale

---

Apply the following targeted change to the existing talkwithalien.com project.
Preserve everything: boot sequence, clickwrap, onboarding questions, 
chat interface, matrix rain, scanlines, vignette, HUD panels, footer disclaimer.
Change ONLY the central visual element (the alien figure).

---

## CHANGE — SOSTITUISCI L'ALIENO SVG CON L'ORB 3D

Remove the existing alien SVG hologram entirely.
Replace it with a Canvas-based 3D orb made of connected points (neural sphere).

### COLORE ORB
The orb uses TEAL/CYAN-GREEN instead of pure green to differentiate 
the orb visually from the matrix rain background.
Primary orb color: #00FFB4 (teal-green)
Glow color: rgba(0,255,180,...)
Keep matrix rain at #00FF41 (pure green) — the contrast makes the orb pop.

### STRUTTURA HTML
Replace the alien SVG container with this structure:

```html
<div id="orb-container">
  <div id="orb-glow"></div>
  <div class="orbit-ring" id="ring1"></div>
  <div class="orbit-ring" id="ring2"></div>
  <div class="orbit-ring" id="ring3"></div>
  <div class="pulse-ring" id="pulse1"></div>
  <div class="pulse-ring" id="pulse2"></div>
  <canvas id="orb-canvas" width="340" height="340"></canvas>
  <div id="speaking-dot"></div>
</div>
```

### CSS DA AGGIUNGERE

```css
#orb-container {
  position: relative;
  width: 340px; height: 340px;
  display: flex; align-items: center; justify-content: center;
}

#orb-glow {
  position: absolute;
  width: 340px; height: 340px;
  border-radius: 50%;
  background: radial-gradient(circle,
    rgba(0,255,180,0.18) 0%,
    rgba(0,200,150,0.08) 40%,
    transparent 70%);
  animation: glow-breathe 3s ease-in-out infinite;
  pointer-events: none;
}
@keyframes glow-breathe {
  0%,100% { transform: scale(1);    opacity: 0.7; }
  50%      { transform: scale(1.08); opacity: 1; }
}

#orb-canvas {
  position: absolute; inset: 0;
  width: 100%; height: 100%;
}

.orbit-ring {
  position: absolute;
  border-radius: 50%;
  border: 1px solid rgba(0,255,180,0.15);
  pointer-events: none;
}
#ring1 { width: 380px; height: 380px; animation: spin1 12s linear infinite; }
#ring2 { width: 420px; height: 140px; animation: spin2 18s linear infinite; }
#ring3 { width: 460px; height: 100px; animation: spin3 25s linear infinite reverse; }

@keyframes spin1 { from{transform:rotate(0deg);} to{transform:rotate(360deg);} }
@keyframes spin2 { from{transform:rotateX(75deg) rotate(0deg);} to{transform:rotateX(75deg) rotate(360deg);} }
@keyframes spin3 { from{transform:rotateX(65deg) rotateY(20deg) rotate(0deg);} to{transform:rotateX(65deg) rotateY(20deg) rotate(360deg);} }

.pulse-ring {
  position: absolute;
  border-radius: 50%;
  border: 1px solid rgba(0,255,180,0.4);
  width: 300px; height: 300px;
  opacity: 0;
  pointer-events: none;
}
.pulse-ring.active {
  animation: pulse-expand 1.2s ease-out forwards;
}
@keyframes pulse-expand {
  0%   { transform: scale(1); opacity: 0.6; }
  100% { transform: scale(2); opacity: 0; }
}

#speaking-dot {
  position: absolute; top: 8px; right: 8px;
  width: 6px; height: 6px; border-radius: 50%;
  background: #00FFB4;
  opacity: 0;
  box-shadow: 0 0 8px #00FFB4;
  transition: opacity 0.3s;
}
#speaking-dot.active {
  opacity: 1;
  animation: dot-pulse 0.6s ease-in-out infinite alternate;
}
@keyframes dot-pulse {
  from { transform: scale(1); }
  to   { transform: scale(1.8); }
}
```

### JAVASCRIPT DA AGGIUNGERE
Add this JS block. It handles the 3D orb rendering and the speaking state.
Place it BEFORE the existing chat/interaction JS so the orb is ready 
before any messages fire.

```javascript
// ── ORB 3D — Neural Sphere ─────────────────────────────────
const orbCanvas = document.getElementById('orb-canvas');
const orbCtx    = orbCanvas.getContext('2d');
const W = 340, H = 340, CX = W/2, CY = H/2, R = 130;

// 180 punti distribuiti uniformemente sulla sfera (Fibonacci lattice)
const N_POINTS = 180;
const points   = [];
for (let i = 0; i < N_POINTS; i++) {
  const phi   = Math.acos(1 - 2*(i+0.5)/N_POINTS);
  const theta = Math.PI*(1+Math.sqrt(5))*i;
  points.push({
    ox: Math.sin(phi)*Math.cos(theta),
    oy: Math.sin(phi)*Math.sin(theta),
    oz: Math.cos(phi),
    size: 0.8 + Math.random()*1.2,
  });
}

let orbRotX = 0, orbRotY = 0, orbRotZ = 0;
let orbSpeaking   = false;
let orbPulseScale = 1, orbPulseTarget = 1;
let orbPulseInterval = null;

function orbRotatePoint(p, rX, rY) {
  const cosY = Math.cos(rY), sinY = Math.sin(rY);
  const x1   = p.ox*cosY - p.oz*sinY;
  const z1   = p.ox*sinY + p.oz*cosY;
  const cosX = Math.cos(rX), sinX = Math.sin(rX);
  const y2   = p.oy*cosX - z1*sinX;
  const z2   = p.oy*sinX + z1*cosX;
  return { x: x1, y: y2, z: z2 };
}

function orbProject(x, y, z) {
  const fov  = 400;
  const dist = fov/(fov + z*R);
  return { px: CX+x*R*dist, py: CY+y*R*dist, scale: dist, z };
}

const CONN_DIST = 0.42;

function drawOrbFrame() {
  orbCtx.clearRect(0, 0, W, H);
  orbPulseScale += (orbPulseTarget - orbPulseScale)*0.08;
  orbRotY += orbSpeaking ? 0.012 : 0.004;
  orbRotX += orbSpeaking ? 0.005 : 0.0015;
  orbRotZ += 0.001;

  const projected = points.map(p => {
    const r    = orbRotatePoint(p, orbRotX + orbRotZ*0.3, orbRotY);
    const proj = orbProject(r.x*orbPulseScale, r.y*orbPulseScale, r.z);
    return { ...proj, size: p.size, ox: r.x, oy: r.y, oz: r.z };
  });
  projected.sort((a, b) => a.z - b.z);

  // Connessioni
  for (let i = 0; i < projected.length; i++) {
    for (let j = i+1; j < projected.length; j++) {
      const a = projected[i], b = projected[j];
      const dx = a.ox-b.ox, dy = a.oy-b.oy, dz = a.oz-b.oz;
      const d  = Math.sqrt(dx*dx+dy*dy+dz*dz);
      if (d < CONN_DIST) {
        const front   = ((a.z+b.z)/2+1)/2;
        const opacity = front*(1-d/CONN_DIST)*(orbSpeaking ? 0.55 : 0.28);
        orbCtx.beginPath();
        orbCtx.moveTo(a.px, a.py);
        orbCtx.lineTo(b.px, b.py);
        orbCtx.strokeStyle = `rgba(0,255,180,${opacity})`;
        orbCtx.lineWidth   = front*0.7*(orbSpeaking ? 1.4 : 1);
        orbCtx.stroke();
      }
    }
  }

  // Punti
  projected.forEach(p => {
    const front   = (p.z+1)/2;
    const opacity = 0.3+front*0.7;
    const size    = p.size*p.scale*(orbSpeaking ? 1.3 : 1);
    const grad    = orbCtx.createRadialGradient(p.px,p.py,0,p.px,p.py,size*3.5);
    grad.addColorStop(0, `rgba(0,255,180,${opacity*0.9})`);
    grad.addColorStop(0.4,`rgba(0,255,180,${opacity*0.3})`);
    grad.addColorStop(1,  'rgba(0,255,180,0)');
    orbCtx.beginPath();
    orbCtx.arc(p.px,p.py,size*3.5,0,Math.PI*2);
    orbCtx.fillStyle = grad;
    orbCtx.fill();
    orbCtx.beginPath();
    orbCtx.arc(p.px,p.py,size*p.scale,0,Math.PI*2);
    orbCtx.fillStyle = `rgba(180,255,240,${opacity})`;
    orbCtx.fill();
  });

  // Glow centrale
  const cGrad = orbCtx.createRadialGradient(CX,CY,0,CX,CY,R*orbPulseScale);
  const gi    = orbSpeaking ? 0.22 : 0.12;
  cGrad.addColorStop(0,   `rgba(0,255,180,${gi})`);
  cGrad.addColorStop(0.4, `rgba(0,200,150,${gi*0.4})`);
  cGrad.addColorStop(1,   'rgba(0,0,0,0)');
  orbCtx.beginPath();
  orbCtx.arc(CX,CY,R*orbPulseScale,0,Math.PI*2);
  orbCtx.fillStyle = cGrad;
  orbCtx.fill();

  requestAnimationFrame(drawOrbFrame);
}
drawOrbFrame();

// Speaking state — chiama queste funzioni quando l'alieno inizia/finisce di rispondere
function orbStartSpeaking() {
  orbSpeaking    = true;
  orbPulseTarget = 1.1;
  document.getElementById('speaking-dot').classList.add('active');
  let p = 0;
  orbPulseInterval = setInterval(() => {
    const ring = document.getElementById(`pulse${(p%2)+1}`);
    ring.classList.remove('active');
    void ring.offsetWidth;
    ring.classList.add('active');
    p++;
  }, 600);
}

function orbStopSpeaking() {
  orbSpeaking    = false;
  orbPulseTarget = 1;
  document.getElementById('speaking-dot').classList.remove('active');
  clearInterval(orbPulseInterval);
}
// ── FINE ORB ────────────────────────────────────────────────
```

### INTEGRAZIONE CON IL SISTEMA DI RISPOSTA ESISTENTE

In the existing alien response function (wherever the AI message is generated
and displayed with typewriter effect), add these two calls:

```javascript
// All'inizio della risposta aliena (prima del typewriter):
orbStartSpeaking();

// Alla fine del typewriter effect (nel callback onComplete):
orbStopSpeaking();
```

### AGGIORNAMENTO LABEL SOTTO L'ORB

Replace the alien name/label below the visual with:

```html
<div id="orb-label">
  <div class="entity-name">OSSERVATORE-7</div>
  <div class="entity-sub">Intelligenza Cosmica — Leggi Universali</div>
  <div class="freq-line">▮ FREQUENZA 44.7 THz — ORB ATTIVO ▮</div>
</div>
```

CSS for label (same as before, updated color to teal):
```css
.entity-name {
  font-size: 20px; font-weight: 700; letter-spacing: 0.3em;
  color: #00FFB4;
  text-shadow: 0 0 20px #00FFB4, 0 0 40px rgba(0,255,180,0.4);
}
.entity-sub {
  font-size: 9px; letter-spacing: 0.4em;
  color: rgba(0,255,180,0.45); margin-top: 6px;
  text-transform: uppercase;
}
.freq-line {
  font-size: 9px; color: #FFB800;
  letter-spacing: 0.25em; margin-top: 4px;
  animation: blink 2s step-end infinite;
}
```

---

## SUMMARY

1. ✅ Alieno SVG rimosso
2. ✅ Orb 3D canvas inserito (180 punti, connessioni dinamiche, proiezione prospettica)
3. ✅ Stato SPEAKING: orb accelera, pulsa, rings si espandono
4. ✅ Colore orb: #00FFB4 (teal) — differenziato dal matrix rain (#00FF41)
5. ✅ Anelli orbitali su 3 assi diversi
6. ✅ Speaking dot indicator
7. ✅ Label aggiornata
8. ✅ Tutto il resto del sito invariato

Do NOT change: boot sequence, clickwrap, onboarding questions,
chat interface, matrix rain, scanlines, HUD panels, footer disclaimer,
color palette of the rest of the UI.

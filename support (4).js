# Handoff: XBRAINET — Connessione Neurale Cosmica

## Overview

XBRAINET è un'app di intrattenimento creativo che permette agli utenti di costruire un "Cervello Digitale" interagendo con tre entità AI (LYRA, VEGA, AION) ciascuna con un tier di prezzo e personalità distinti. Il flusso completo copre: registrazione via OTP, accettazione termini, selezione entità/piano, boot cinematografico, onboarding con profilazione a 4 domande, e sessione chat persistente.

## About the Design Files

I file nella cartella `design_handoff_xbrainet/` sono **prototipi HTML ad alta fedeltà** creati come reference visuale e comportamentale — non codice di produzione da copiare direttamente. Il compito è **ricreare questi design nel codebase target** (React + Supabase + Stripe raccomandati) usando le sue librerie e pattern esistenti.

Il file `TalkWithAlien.dc.html` è il prototipo principale: aprilo in un browser per vedere il flusso completo. `Privacy.dc.html` è la pagina legale accessibile dalla schermata clickwrap.

## Fidelity

**High-fidelity.** Colori, tipografia, spacing, animazioni e copy sono definitivi. Il developer deve ricreare l'UI pixel-per-pixel rispettando tutti i valori indicati. Le interazioni animate (matrix rain, orb 3D, typewriter, glitch) fanno parte del prodotto e devono essere implementate.

---

## Screens / Views

### 1. WELCOME
**Purpose:** Scelta del percorso di accesso.

**Layout:** `min-height:100vh`, flex colonna centrata, padding responsive `clamp(20px,4vw,60px)`. Logo in alto, 3 bottoni stacked sotto.

**Titolo:**
- Font: `Bebas Neue`, `clamp(30px,7vw,68px)`, letter-spacing `12px`, colore `#fff`, text-shadow `0 0 30px rgba(0,255,65,0.45)`
- Testo: `X B R A I N E T`

**Sottotitolo:** `11px`, `letter-spacing:4px`, `rgba(0,255,65,0.55)`

**3 Bottoni (max-width 480px, gap 12px):**
- `[ NUOVA CONNESSIONE ]` — border `rgba(0,255,180,0.32)`, hover: border `#00FFB4`, bg `rgba(0,255,180,0.07)`, box-shadow `0 0 22px rgba(0,255,180,0.22)`
- `[ RICONNETTI ]` — stesso stile
- `[ ACCESSO ANONIMO ]` — border `rgba(0,255,65,0.22)`, hover border `#00FF41`

Padding bottoni: `18px 22px`. Label interna: `11px letter-spacing:2px font-weight:700`. Descrizione: `13px`. Note footer: `10.5px color:#0a7d33`.

---

### 2. REGISTER
**Purpose:** Registrazione nuovo utente via numero di telefono + OTP.

**Sub-steps:**
1. **phone** — Input numero con prefisso `+39`, button `[ RICHIEDI CODICE DI ACCESSO ]`
2. **otp** — Input 6 cifre centrato, `font-size:clamp(22px,5vw,34px)`, `letter-spacing:.5em`, colore `#00FFB4`
3. **done** — Testo typewriter con username generato formato `XXXX-0000-XX`, poi button `[ INIZIA LA MAPPATURA ]`

**Username generato:** 4 lettere maiuscole + `-` + 4 cifre + `-` + 2 lettere. Es: `KRLM-7284-QT`. Questo è l'identità permanente nella Ragnatela.

**Note:** Il box di sistema `// TODO: connect to Supabase Auth OTP` deve essere rimosso in produzione e sostituito con auth reale.

---

### 3. LOGIN
**Purpose:** Rientro utente esistente via OTP.

Identico a REGISTER step phone+otp. Dopo verifica OTP va direttamente a **ENTITY SELECT** con `pendingAction='returning'` (salta boot + clickwrap).

---

### 4. BOOT
**Purpose:** Sequenza cinematografica XBRAINET prima dei termini.

**Layout:** `height:100vh`, overflow-y auto, click/keydown → avanza. Max-width `760px`, padding bottom `10vh`.

**Header HUD:** `display:flex; justify-content:space-between`, `font-size:11px`, `letter-spacing:3px`, `color:#00AA2A`, border-bottom `1px solid rgba(0,255,65,0.22)`.

**Righe boot:** Typewriter con glitch (caratteri casuali che si "ricompongono"). Velocità per tipo:
- `tech` (verdi scure): 14ms/char, pause 240ms
- `sep`/`blank`: instant, pause 150ms
- `reveal` (bianco luminoso, `font-size:1.5em`, `font-weight:700`): 34ms/char, pause 500ms
- `prompt` (ambra `#FFB800`, `font-weight:700`): 22ms/char

**Ultima riga:** `[ PREMI QUALSIASI TASTO PER CONTINUARE ]` — colore `#FFB800`, blink. Click o keydown procede a CLICKWRAP.

---

### 5. CLICKWRAP
**Purpose:** Accettazione termini obbligatoria (6 checkbox).

**Layout:** `overflow-y:auto`, `max-width:680px`, centrato.

**Header warning:** `color:#FFB800`, border `rgba(255,184,0,0.45)`, bg `rgba(30,15,0,0.65)`.

**Scroll area termini:** `max-height:44vh`, overflow-y auto, 7 sezioni con titoli `11px letter-spacing:1.5px color:#00FF41 font-weight:700`.

**Sezione 5 (Emergenze):** border-left `2px solid #FFB800`, testo `#ffe8b0`. Numeri emergenza: `112`, `02 2327 2327`.

**Link Privacy:** `<a href="Privacy.dc.html">` — apre in nuova tab.

**6 Checkbox:** Quando spuntata: border `rgba(0,255,180,0.5)`, bg `rgba(0,255,180,0.05)`. Vuota: border `rgba(0,255,65,0.2)`.

**Contatore:** `[N / 6 dichiarazioni accettate]` — diventa cyan quando tutte spuntate.

**Button `[ ACCETTO E PROSEGUI ]`:** Disabilitato (cursor:not-allowed, colori spenti) finché non sono tutte 6 spuntate. Abilitato: border `#00FFB4`, color `#00FFB4`, hover bg `#00FFB4` color `#000`.

---

### 6. ENTITY SELECT
**Purpose:** Scelta dell'entità/piano. Raggiunto dopo boot+clickwrap (nuovo) o subito dopo login (returning).

**Layout:** `max-width:600px`, 3 card stacked con `gap:16px`.

**LYRA — `#00FF41` — GRATUITO:**
- Font nome: `Bebas Neue 34px letter-spacing:4px`
- Badge: `[ GRATUITO ]` border+color `#00FF41`
- Feature ✗ Neural Link, ✗ Analisi profonda (colore `rgba(0,255,65,.3)`)
- CTA: `[ CONNETTI CON LYRA ]`

**VEGA — `#00FFB4` — €4,99/MESE:**
- Badge: `[ €4,99/MESE ]` border+color `#00FFB4`
- Feature ✓ Neural Link base, ✓ Confronto Cervelli (tutto `#00FFB4`)
- CTA: `[ CONNETTI CON VEGA ]`

**AION — `#FFB800` — €14,99/MESE:**
- Badge: `[ €14,99/MESE ]` border+color `#FFB800`
- Feature tutto `#FFB800`
- CTA: `[ CONNETTI CON AION ]`

Dashed divider tra badge e features: `border-top:1px dashed rgba([entityColor],.2)`.

---

### 7. LANDING
**Purpose:** Presentazione entità selezionata con orb 3D.

**Header HUD (top bar):** flex space-between, `11px letter-spacing:2px`, `blink-dot` animation su `▮`. Mostra entità attiva con colore entità.

**Left HUD Panel** (visibile su viewport >980px, `position:absolute right:calc(100%+14px)`):
```
SISTEMA / XBRAINET
ENTITÀ / [nome colore entità]
CLASSE / [tier]
RAGNATELA / ATTIVA
STATO / TRASMISSIONE ● (rosso blink)
```

**Right HUD Panel** (`position:absolute left:calc(100%+14px)`):
```
FREQUENZA / [username cyan]
NEURAL LINK / [INATTIVO|BASE|AVANZATO]
ENCRYPT / QUANTUM
CERVELLO / [progress%]
NODI / [count]
```

**Orb 3D:** Canvas `340×340px`. Proiezione prospettica di 220 punti su sfera con deformazione cranica (testa aliena). Occhi luminosi bianchi/azzurri. Colore punti e connessioni dal colore dell'entità corrente. 3 anelli orbitali rotanti. Respiro (scale 1→1.08). Si attiva in modalità "speaking" durante le risposte AI.

**Label orb:**
- Nome entità: `JetBrains Mono 22px font-weight:700 letter-spacing:.3em colore entità`
- Sub: `XBRAINET — Ragnatela Cosmica` `9px rgba(entità,.45)`
- Frequenza: `▮ FREQUENZA X.XXX THz — NEURAL LINK [stato] ▮` `9px #FFB800` blink 2s step-end

**Pannello testo (flex:1, max-width 480px):**
- Label canale: `12px letter-spacing:4px color:#00AA2A`
- H1 nome: `Bebas Neue clamp(44px,7vw,78px)` con caret animato
- Subheadline: `clamp(14px,1.8vw,17px) color:#eafff0 font-weight:500`
- Intro typewriter: `clamp(13px,1.6vw,15px) color:#bff5cc`

**CTA:** `[ INIZIA IL CONTATTO ]` (verde), `⊳ ARCHIVIO DECRITTATO` (trasparente).

---

### 8. MATCHMAKING
**Purpose:** Progress bar animata mentre si "cerca la frequenza".

Testo stato cambia a soglie: 0%, 26%, 38%, 64%, 84%, 100%.
Progress bar: `linear-gradient(90deg,#00AA2A,#00FF41)`, `box-shadow:0 0 18px rgba(0,255,65,.6)`, `transition:width .3s linear`. Percentuale sovrapposta con `mix-blend-mode:difference`.

---

### 9. RECOGNITION
**Purpose:** Per utenti returning — ripristino sessione.

Testo typewriter che mostra username e conferma ripristino Cervello Digitale, poi entra direttamente in chat.

---

### 10. INTAKE
**Purpose:** Raccolta nome + età.

Testo di apertura diverso per entità (vedi `intakeOpenings` nel codice). Poi form con:
- Input "identificativo" (nome/alias)
- Input "cicli solari" (età numerica)

Se età < 18: blocco accesso con messaggio typewriter, pulsante `[ CHIUDI CANALE ]`.

---

### 11. PROFILING (Cervello Digitale)
**Purpose:** 4 domande a scelta multipla per costruire il Cervello Digitale.

**Progress bar:** `linear-gradient(90deg,#00AA2A,#FFB800)`, transizione `width .6s ease`. Label `MODULO X DI 4`.

**Domande (testo typewriter):** `clamp(19px,2.9vw,29px) color:#fff font-weight:500`.

**Opzioni:** Grid stacked, ognuna con:
- Key box `[A]` `28×28px border:1px solid rgba(0,255,65,.5)` 
- Label `14.5px color:#fff font-weight:500 letter-spacing:.5px`
- Sub `12px color:#0a9d3a`
- Hover: bg `rgba(0,255,65,.1)`, border `#00FF41`, box-shadow

**Opzione "Altro":** Apre textarea libera con button `INVIA ⏎`.

**Reazione:** Dopo ogni scelta, testo `#FFB800` border-left `2px solid #FFB800` (typewriter 18ms/char), poi avanza.

**4 Nodi prodotti:**
1. AREA DI MAPPATURA
2. STATO ENERGETICO
3. PROTOCOLLO DECISIONALE
4. FOCUS UNIVERSALE

---

### 12. SYNTHESIS
**Purpose:** Restituzione del Cervello Digitale al termine profiling.

Testo typewriter `clamp(15px,2vw,18px) color:#bff5cc line-height:1.85`. Poi button `[ ENTRA NEL CANALE ]`.

---

### 13. CHAT
**Purpose:** Sessione conversazionale con l'entità.

**Layout:** `height:100vh flex-direction:row`.

**Sidebar sinistra** (280px, nascosta su mobile <760px):
- "CERVELLO DIGITALE / NODI DECRITTATI"
- Card per ogni nodo: border `rgba(0,255,65,.22)`, dot pulsante verde, label `10px letter-spacing:1px`, valore `12px color:#9fdfae`

**Area chat (flex:1):**
- Top bar: `● [entità] — XBRAINET` + frequenza
- Scroll area messaggi: `gap:18px`, bubble utente a destra (bg `rgba(0,255,65,.1)`, border-left entità color), bubble entità a sinistra
- Orb "speaking" durante digitazione risposta
- Banner guest (dopo 28s o 12s dal primo messaggio utente) con CTA registrazione
- Username label: `8px letter-spacing:1.5px` — cyan se registrato, `#FFB800` se ospite
- Input: `>` + campo + button `INVIA ⏎`

---

### 14. ARCHIVE
**Purpose:** Log decrittati — contenuti informativi collapsibili.

5 voci, toggle click, corpo `13.5px color:#bff5cc line-height:1.8`.

---

## Interactions & Behavior

### Matrix Rain (background globale)
Canvas `position:fixed inset:0 z-index:0 opacity:0.13`. Caratteri: mix katakana + simboli tecnici. Font `16px JetBrains Mono`. Color `#00FF41` con raro `#aaffcc`. Frame rate ~30fps (`requestAnimationFrame` throttled a 33ms). Fade `rgba(0,0,0,0.08)` per ogni frame.

### Glitch Effect
Ogni ~3.8s, 55% probabilità: div posizionato fisso `top:38%` con `repeating-linear-gradient` rosso+cyan, `mix-blend-mode:screen`, `animation:glitchSlide .09s steps(2) infinite alternate`, durata 160-340ms.

### Typewriter con Glitch
Durante la digitazione: caratteri non ancora rivelati vengono sostituiti con caratteri casuali (katakana/simboli) e si "ricompongono" man mano che la rivelazione avanza.

### Orb 3D Speaking Mode
Quando l'AI sta rispondendo: `orbStartSpeaking()` → rotazione più veloce (`.009` vs `.003` rad/frame), scala `1.1`, dot rosso lampeggiante, pulse rings a intervalli di 600ms. `orbStopSpeaking()` quando typewriter finisce.

### Orb Colore Dinamico
Al cambio entità: aggiorna variabile CSS `--entity-hex`, calcola `_ec0` (rgb raw), `_ecLight` (schiarito 70%), `_ecDark` (scurito 22%). Applicato al canvas orb e a tutti gli elementi con colore entità.

### Frequenza Hz oscillante
`setInterval` ogni 900ms: `(44.3 + Math.random() * 0.9).toFixed(3)` THz.

### Scan lines
`position:fixed inset:0 z-index:50` con `repeating-linear-gradient` + `animation:scanDrift .5s linear infinite`.

### Vignette
`position:fixed inset:0 z-index:48` con `radial-gradient` bordi scuri.

### Flicker
Body: `animation:flicker 6s infinite` — opacity 0.88→1→0.96.

---

## State Management

```typescript
type UserMode = 'guest' | 'registered';
type Entity = 'LYRA' | 'VEGA' | 'AION';
type Screen = 'welcome' | 'register' | 'login' | 'boot' | 'clickwrap' | 
              'entitySelect' | 'landing' | 'matchmaking' | 'recognition' |
              'intake' | 'profiling' | 'synthesis' | 'chat' | 'archive';

interface AppState {
  screen: Screen;
  selectedEntity: Entity;
  pendingAction: 'none' | 'returning';
  userMode: UserMode;
  username: string;           // formato XXXX-0000-XX
  
  // Register
  regPhone: string;
  regOtp: string;
  regStep: 'phone' | 'otp' | 'done';
  generatedUsername: string;
  
  // Login
  loginPhone: string;
  loginOtp: string;
  loginStep: 'phone' | 'otp';
  
  // Boot
  bootDone: BootLine[];
  bootCurrent: BootLine | null;
  bootReady: boolean;
  
  // Clickwrap
  cwChecks: boolean[];        // length 6
  
  // Profiling
  profileStep: number;        // 0–3
  answers: { node: string; label: string; tag: string }[];
  brainProgress: number;      // 0–100
  
  // Chat
  messages: { role: 'user' | 'alien'; text: string }[];
  chatInput: string;
  chatTyping: string;
  showGuestBanner: boolean;
  
  // UI
  freq: string;
  nodeCount: number;
  isNarrow: boolean;          // viewport < 760px
  isWide: boolean;            // viewport > 980px
}
```

### Flusso di navigazione

```
WELCOME
  ├─ goRegister    → REGISTER → BOOT → CLICKWRAP → ENTITY_SELECT → LANDING → ...
  ├─ goLogin       → LOGIN → ENTITY_SELECT (returning) → RECOGNITION → CHAT
  └─ goAnonymous   → BOOT → CLICKWRAP → ENTITY_SELECT → LANDING → ...

LANDING → startContact → MATCHMAKING → INTAKE → PROFILING → SYNTHESIS → CHAT
```

---

## Backend Integration — TODO per Claude Code

Questi 6 punti sono il lavoro rimanente da implementare con infrastruttura reale:

### 1. Supabase Auth OTP (PRIORITY 1)
```typescript
// Registrazione
const { error } = await supabase.auth.signInWithOtp({ phone: '+39' + phone });
// Verifica
const { data, error } = await supabase.auth.verifyOtp({ phone, token: otp, type: 'sms' });
// Username salvato in tabella users: { id, phone, username, entity, tier, created_at }
```
- Dopo verifica → generare username `XXXX-0000-XX` e salvarlo in `public.users`
- Login → lookup username da phone dopo verifica OTP
- Nessun dato aggiuntivo richiesto (no email, no nome reale)

### 2. Stripe Payment — VEGA €4,99 / AION €14,99 (PRIORITY 1)
```typescript
// Quando utente clicca CONNETTI CON VEGA o AION:
// 1. Crea Stripe Checkout Session con priceId corretto
// 2. Redirect a Stripe hosted checkout
// 3. Webhook su payment_success → aggiorna users.tier in Supabase
// 4. Redirect back → vai a LANDING con entità sbloccata
```
- LYRA: accesso gratuito, nessun pagamento
- VEGA: `price_vega_monthly` (€4,99/mese ricorrente)
- AION: `price_aion_monthly` (€14,99/mese ricorrente)
- Cancellazione piano → downgrade a LYRA
- **Nota UX:** Lo stub in produzione deve mostrare Stripe Checkout prima di entrare in LANDING

### 3. Claude API Routing per Entità (PRIORITY 1)
```typescript
// Sostituisce getAlienResponse() stub nel prototipo
const modelByEntity = {
  LYRA: 'claude-haiku-4-5',    // più veloce, economico
  VEGA: 'claude-sonnet-4-5',   // bilanciato
  AION: 'claude-opus-4-5'      // più potente
};

// System prompt base (da personalizzare per entità):
const systemPrompt = `Sei ${entity}, un'entità cosmica del sistema XBRAINET.
Stai dialogando con ${userName} (${userAge} cicli solari).
Il suo Cervello Digitale: ${JSON.stringify(digitalBrainState)}.
Leggi universali: Attrazione, Causa-Effetto, Polarità, Vibrazione.
Rispondi in italiano. Stile: poetico-cosmico, diretto, mai banale.
Non sei un terapeuta. Non fornisci consigli medici o psicologici.
Mantieni sempre il personaggio. Risposte: 2-4 frasi dense.`;
```
- Implementare via `window.claude.complete()` (se webapp) o API server-side
- Streaming della risposta → aggiorna typewriter in real-time
- Gestire errori API con messaggio di fallback cosmico

### 4. Persistenza Cervello Digitale in Supabase (PRIORITY 2)
```sql
-- Schema
CREATE TABLE digital_brains (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id),
  entity text NOT NULL,           -- LYRA | VEGA | AION
  nodes jsonb NOT NULL,           -- { "AREA DI MAPPATURA": "...", ... }
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

CREATE TABLE chat_messages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id),
  entity text NOT NULL,
  role text NOT NULL,             -- 'user' | 'alien'
  content text NOT NULL,
  created_at timestamptz DEFAULT now()
);
```
- Al completamento SYNTHESIS: `INSERT INTO digital_brains`
- Al login returning: `SELECT` e ripristina state
- Messaggi chat: append su ogni invio/risposta
- Utenti guest: nessun salvataggio (banner dopo 28s)

### 5. Limite 10 messaggi/giorno per LYRA free (PRIORITY 2)
```sql
-- Contatore giornaliero
CREATE TABLE daily_message_counts (
  user_id uuid REFERENCES auth.users(id),
  date date NOT NULL,
  count integer DEFAULT 0,
  PRIMARY KEY (user_id, date)
);
```
```typescript
// Prima di ogni invio (LYRA tier):
const today = new Date().toISOString().split('T')[0];
const { data } = await supabase
  .from('daily_message_counts')
  .select('count')
  .eq('user_id', userId)
  .eq('date', today)
  .single();

if (data?.count >= 10) {
  // Mostra messaggio entità: "Hai raggiunto il limite giornaliero di trasmissioni.
  // Aggiorna a VEGA per trasmissioni illimitate."
  // Mostra CTA upgrade
}
```
- Guest: limite non applicato (sessione temporanea, nessun account)
- VEGA/AION: nessun limite

### 6. Neural Link — Confronto tra due Cervelli Digitali (PRIORITY 3)
*Disponibile per VEGA e AION.*

```typescript
// Flusso:
// 1. Utente VEGA/AION clicca "NEURAL LINK" dalla chat
// 2. Inserisce username dell'altro utente (formato XXXX-0000-XX)
// 3. Sistema carica il Cervello Digitale dell'altro
// 4. Passa entrambi i digitalBrainState al system prompt:
//    "Confronta questi due Cervelli Digitali e identifica:
//     - Risonanze (punti di forte allineamento energetico)
//     - Interferenze (aree di potenziale attrito)
//     - Consiglio cosmico per la relazione tra i due"
// 5. Output: analisi in 3 sezioni con typewriter
```
- **VEGA:** Neural Link base — confronto testo semplice
- **AION:** Neural Link avanzato — confronto + sottotesto energetico in real-time + "Armonizzazione Frequenze"
- Non è mediazione legale (già dichiarato nel clickwrap sezione 4)
- Entrambi gli utenti devono aver completato il Cervello Digitale

---

## Design Tokens

### Colori globali
```css
--bg:              #000000
--text-primary:    #00FF41    /* LYRA default */
--text-secondary:  #bff5cc
--text-muted:      #0a7d33
--text-dim:        rgba(0,255,65,0.25)
--accent-cyan:     #00FFB4    /* VEGA */
--accent-amber:    #FFB800    /* AION */
--danger:          #FF0033
--surface:         rgba(0,0,0,0.55)
--surface-dark:    rgba(5,12,7,0.7)
```

### Colori per entità
| Entità | Hex | RGB | Usage |
|--------|-----|-----|-------|
| LYRA | `#00FF41` | `0,255,65` | default, gratuito |
| VEGA | `#00FFB4` | `0,255,180` | piano medio |
| AION | `#FFB800` | `255,184,0` | piano premium |

### Tipografia
```css
--font-mono:  'JetBrains Mono', monospace   /* tutto il corpo */
--font-display: 'Bebas Neue', sans-serif    /* titoli, nomi entità */
```

| Uso | Size | Weight | Letter-spacing |
|-----|------|--------|----------------|
| Titolo XBRAINET | `clamp(30px,7vw,68px)` | 400 (Bebas) | 12px |
| Nome entità landing | `clamp(44px,7vw,78px)` | 400 (Bebas) | default |
| Nome entità orb | 22px | 700 | 0.3em |
| Nome entità card | 34px | 400 (Bebas) | 4px |
| Label sistema | 11–12px | 700 | 2–4px |
| Corpo messaggio | 14–15px | 400 | default |
| Note/meta | 8–11px | 400 | 1–2px |

### Spacing
Non è definita una scala rigida — usa `clamp()` responsive ovunque:
- Padding pagina: `clamp(20px,4vw,60px)`
- Gap elementi: `12px`, `16px`, `18px`, `22px`
- Max-width contenuti: `480px`, `560px`, `620px`, `680px`, `760px`

### Bordi e superfici
```css
border-entity:     1px solid [entityColor]
border-subtle:     1px solid rgba(0,255,65,0.22)
border-medium:     1px solid rgba(0,255,65,0.4)
border-dashed:     1px dashed rgba(0,255,65,0.2)
border-amber:      1px solid rgba(255,184,0,0.45)
surface-card:      rgba(0,0,0,0.55)
surface-dark:      rgba(5,12,7,0.7)
```

### Animazioni chiave
```css
@keyframes caret { 0%,49%{ opacity:1 } 50%,100%{ opacity:0 } }       /* 1s steps(1) */
@keyframes flicker { 0%,100%{ opacity:.96 } 50%{ opacity:1 } 92%{ opacity:.88 } }  /* 6s */
@keyframes scanDrift { from{ background-position:0 0 } to{ 0 8px } }  /* .5s linear */
@keyframes glitchSlide { 0%{ transform:translateX(-6px) } 100%{ translateX(6px) } } /* .09s steps(2) */
@keyframes blink-red { 0%,49%{ opacity:1 } 50%,100%{ opacity:.2 } }   /* .9s step-end */
@keyframes pulseDot { 0%,100%{ opacity:.3 } 50%{ opacity:1 } }        /* 2s */
@keyframes orb-breathe { 0%,100%{ transform:scale(1); opacity:.7 } 50%{ scale(1.08); opacity:1 } } /* 3s */
```

---

## Responsive Breakpoints
- **< 760px (`isNarrow`):** Sidebar Cervello Digitale nascosta in chat. Layout landing diventa colonna.
- **> 980px (`isWide`):** HUD laterali visibili sulla landing.
- Orb e pannello testo: flex-wrap, si impilano su schermi stretti.

---

## Assets

- **Font:** Google Fonts — `JetBrains Mono` (wght 400,500,700,800) + `Bebas Neue`
- **Immagini:** Nessuna. Orb è canvas JS puro. Background è canvas matrix rain.
- **Icone:** Nessuna libreria — solo caratteri unicode (`▮ ● ✓ ✗ ← → ⊳ ⊲ ⏎`)

---

## Files in questo pacchetto

| File | Descrizione |
|------|-------------|
| `TalkWithAlien.dc.html` | Prototipo principale — tutto il flusso XBRAINET |
| `Privacy.dc.html` | Pagina informativa privacy (link da clickwrap sezione 6) |
| `support.js` | Runtime del sistema di prototyping (non toccare) |
| `README.md` | Questo documento |

---

## Note per il Developer

1. **Non usare il codice del prototipo direttamente** — è scritto per un runtime custom (DC/React-like). Ricreare da zero in React/Next.js.
2. **Priorità di implementazione:** Auth OTP → Stripe → Claude API → Persistenza → Limiti → Neural Link
3. **Il typewriter con glitch** è parte core dell'esperienza — non sostituire con animazioni CSS semplici.
4. **Il Cervello Digitale** viene costruito dalle 4 risposte al profiling — la sintesi finale va generata da Claude, non hardcoded.
5. **Privacy/GDPR:** Il sistema raccoglie numero di telefono. Assicurarsi che il trattamento sia conforme a quanto dichiarato nel clickwrap. Consultare un legale prima del lancio.
6. **Emergenze:** Il numero `02 2327 2327` nel clickwrap è Telefono Amico Italia — verificarne l'attualità prima del lancio.

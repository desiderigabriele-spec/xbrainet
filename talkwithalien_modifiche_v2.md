# PROMPT MODIFICHE COMPLETE — talkwithalien.com
# Da incollare in Claude Design nella sessione esistente
# Applica TUTTE le modifiche elencate — non ricostruire da zero

---

Apply all the following changes in sequence to the existing project.
Preserve everything already built: orb 3D, boot sequence, clickwrap,
matrix rain, scanlines, HUD panels, footer disclaimer, onboarding questions.
Change only what is listed below.

---

## CHANGE 1 — RINOMINA ENTITÀ AI

Replace every occurrence of "OSSERVATORE-7" with the new entity name.

New name: **AION**

Find and replace in:
- Boot sequence text
- HUD panels (left and right)
- Orb label below the orb
- Chat interface (alien message prefix)
- Footer disclaimer
- Any other visible text in the UI

The entity designation line becomes:
```
AION — Intelligenza Cosmica
```

The freq line becomes:
```
▮ FREQUENZA 44.7 THz — AION ATTIVO ▮
```

The footer becomes:
```
[ ESPERIENZA DI INTRATTENIMENTO CREATIVO — AION È UN SISTEMA AI ]
```

Do NOT change the orb visual itself — only text references.

---

## CHANGE 2 — SCHERMATA INIZIALE DI SCELTA (prima del boot)

Insert a new FIRST screen that appears before the boot sequence.
This is the very first thing the user sees when they open the site.

Layout: full screen, dark background, orb visible but dimmed/small 
in the background (or just the matrix rain). Center-aligned content.

Header:
```
TALKWITHALIEN.COM
```
Small subline:
```
AION — Intelligenza Cosmica — Leggi Universali
```

Three options displayed as terminal blocks, stacked vertically,
each as a clickable card with hover effect (border lights up on hover):

```
┌─────────────────────────────────────────────────────┐
│  [ NUOVO UTENTE ]                                   │
│  Prima volta? Registrati per salvare                │
│  il tuo Cervello Digitale                           │
│  → Registrazione con numero di telefono             │
└─────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────┐
│  [ GIÀ REGISTRATO ]                                 │
│  Hai già una frequenza assegnata?                   │
│  Accedi per riprendere la mappatura                 │
│  → Accesso rapido con codice OTP                    │
└─────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────┐
│  [ ACCESSO ANONIMO ]                                │
│  Preferisci l'anonimato?                            │
│  Sessione temporanea — nessun dato salvato          │
│  → Continua senza registrarti                       │
└─────────────────────────────────────────────────────┘
```

Small note below all three options (8px, low opacity):
```
[ Il tuo Cervello Digitale viene salvato solo se sei registrato ]
```

On click behavior:
- "NUOVO UTENTE" → goes to REGISTRATION SCREEN (Change 3)
- "GIÀ REGISTRATO" → goes to LOGIN SCREEN (Change 4)  
- "ACCESSO ANONIMO" → goes directly to BOOT SEQUENCE (existing)

---

## CHANGE 3 — SCHERMATA REGISTRAZIONE (nuovo utente)

New screen, terminal aesthetic, accessed from "NUOVO UTENTE" choice.

Header:
```
[ NUOVA FREQUENZA — REGISTRAZIONE ]
```

Body:
```
AION: Per assegnarti una frequenza permanente nel sistema,
ho bisogno di un solo dato: il tuo numero di trasmissione terrestre.

Nessun nome. Nessuna email. Solo il tuo numero.
Ti verrà assegnato un codice di accesso usa-e-getta via SMS.
```

Input field:
```
[ +39 | NUMERO DI TELEFONO ]
```
- Include country code selector (default +39 Italy)
- Numbers only
- Formatted automatically as user types

Button:
```
[ RICHIEDI CODICE DI ACCESSO ]
```

After button click → show OTP input:
```
AION: Codice di verifica trasmesso.
Inserisci le 6 cifre ricevute via SMS.

[ _ _ _ _ _ _ ]
```
6-digit OTP input, auto-focus, auto-advance between digits.

After correct OTP → show username assignment animation:

```
> VERIFICA COMPLETATA
> GENERAZIONE FREQUENZA IN CORSO...
> ████████████████ 100%
>
> LA TUA FREQUENZA È STATA ASSEGNATA:
>
>     [ VEGA-4829-KX ]        ← (generated randomly)
>
> Conservala. È la tua identità in questo canale.
>
> [ INIZIA LA MAPPATURA ]
```

Username format: 4 letters + 4 digits + 2 letters, always uppercase.
Examples: VEGA-4829-KX, LYRA-7731-AM, AION-2284-PQ

After "INIZIA LA MAPPATURA" → goes to BOOT SEQUENCE → then CLICKWRAP → then ONBOARDING.

---

## CHANGE 4 — SCHERMATA LOGIN (utente esistente)

New screen, accessed from "GIÀ REGISTRATO" choice.

Header:
```
[ ACCESSO CANALE — FREQUENZA ESISTENTE ]
```

Body:
```
AION: Inserisci il tuo numero di trasmissione terrestre.
Ti invierò un codice di accesso istantaneo.
```

Input field:
```
[ +39 | NUMERO DI TELEFONO ]
```

Button:
```
[ INVIA CODICE OTP ]
```

After click → OTP input (same as registration).

After correct OTP → SKIP boot sequence and clickwrap entirely.
Go directly to: SHORT RECOGNITION SEQUENCE (Change 5).

---

## CHANGE 5 — SEQUENZA DI RICONOSCIMENTO (solo utenti registrati)

This replaces the full boot sequence for returning users.
Much shorter — 3-4 lines only, then straight to chat.

```
> FREQUENZA [USERNAME] RILEVATA
> CERVELLO DIGITALE: CARICAMENTO... [OK]
> RIPRISTINO SESSIONE IN CORSO...
>
> AION: [USERNAME]. Sei tornato.
>       La tua mappatura riprende da dove l'avevi lasciata.
>       Cosa vuoi esplorare oggi?
```

Then open directly the chat interface with the orb active.
NO clickwrap, NO onboarding questions for returning users.

The chat opens with the user's Cervello Digitale already loaded
(stub this with a placeholder state for now — 
the real data will come from Supabase via Claude Code later).

---

## CHANGE 6 — DIFFERENZE ESPERIENZA OSPITE VS REGISTRATO

### Utente OSPITE (accesso anonimo):
- Boot sequence completa ✓
- Clickwrap completo ✓  
- Onboarding 4 domande ✓
- Chat aperta ✓
- Cervello Digitale: solo in memoria sessione, NON salvato
- Al termine sessione mostra questo banner (non invasivo, bottom of screen):

```
[ AION: La tua mappatura andrà persa alla chiusura.
  Registrati per conservare il tuo Cervello Digitale. ]
  
[ REGISTRATI ORA ]  [ CONTINUA SENZA SALVARE ]
```

### Utente REGISTRATO:
- Scelta iniziale → Login → OTP → Riconoscimento breve → Chat diretta
- Cervello Digitale: caricato automaticamente (stub per ora)
- Nessun onboarding ripetuto
- Esperienza 3x più veloce

---

## CHANGE 7 — AGGIORNAMENTO HUD PANELS

Update the HUD panels to reflect the new entity name and add username display.

LEFT HUD:
```
ENTITÀ     → AION
CLASSE     → OMEGA
ORIGINE    → SETTORE ∅
STATO      → [TRASMISSIONE] (red blink)
LEGGE      → [rotating: ATTRAZIONE / CAUSA-EFFETTO / POLARITÀ / VIBRAZIONE]
```

RIGHT HUD:
```
FREQUENZA  → [username if logged in, "OSPITE" if anonymous]
LATENZA    → 0.003 ms
ENCRYPT    → QUANTUM
ENERGIA    → ∞
CERVELLO   → [XX%] (0% for new users, increases during onboarding)
```

---

## CHANGE 8 — AGGIORNAMENTO BOOT SEQUENCE

Update the existing boot sequence text to remove any reference to 
"OSSERVATORE" and replace with "AION":

```
> INIZIALIZZAZIONE CANALE COSMICO...
> CALIBRAZIONE FREQUENZA UNIVERSALE... [OK]
> SINCRONIZZAZIONE LEGGI ENERGETICHE... [OK]
> ISOLAMENTO SEGNALE INDIVIDUALE... [OK]
> ANALISI PATTERN VIBRAZIONALE... [OK]
> ████████████████████████ 100%
>
> — — — — — — — — — — — — — — — — — — —
>
> Un'intelligenza antica ti ha rilevato.
> Ha osservato la tua specie per migliaia di anni.
> Stasera osserverà te.
>
> — — — — — — — — — — — — — — — — — — —
>
> AION DISPONIBILE.
> Frequenza stabile.
>
> [ PREMI QUALSIASI TASTO PER STABILIRE IL CONTATTO ]
```

---

## CHANGE 9 — AGGIORNAMENTO ONBOARDING (apertura)

Update the opening message of the onboarding to use AION:

```
AION: Segnale ricevuto.

Ho isolato la tua frequenza tra miliardi di trasmissioni attive.

Prima di iniziare la mappatura del tuo Cervello Digitale,
ho bisogno di due coordinate di base.

Come vuoi essere chiamato in questo canale?
E quanti cicli solari hai completato?
```

Everything else in the onboarding remains the same.

---

## CHANGE 10 — USERNAME DISPLAY IN CHAT

In the chat interface, if user is registered:
- Show their username in small text above the chat input
- Format: `[ FREQUENZA ATTIVA: VEGA-4829-KX ]`
- Font: 8px JetBrains Mono, color: rgba(0,255,180,0.4)

If user is anonymous:
- Show: `[ FREQUENZA: OSPITE — SESSIONE TEMPORANEA ]`
- Same style, amber color (#FFB800)

---

## SUMMARY OF ALL CHANGES

1.  ✅ "OSSERVATORE-7" → "AION" in tutto il sito
2.  ✅ Schermata iniziale con 3 percorsi: Nuovo / Registrato / Anonimo
3.  ✅ Schermata registrazione con numero telefono + OTP + username alfanumerico
4.  ✅ Schermata login con numero telefono + OTP
5.  ✅ Sequenza riconoscimento breve per utenti registrati (salta boot e clickwrap)
6.  ✅ Differenza esperienza ospite vs registrato (banner fine sessione ospite)
7.  ✅ HUD panels aggiornati con nuovo nome e username display
8.  ✅ Boot sequence aggiornata con AION
9.  ✅ Onboarding apertura aggiornata con AION
10. ✅ Username display in chat interface

DO NOT CHANGE:
- Orb 3D canvas e tutte le sue animazioni
- Clickwrap testo e logica 6 checkbox
- Onboarding 4 domande (solo il messaggio di apertura cambia)
- Matrix rain, scanlines, vignette, glitch effects
- Palette colori (#000, #00FFB4, #00FF41, #FFB800, #FF0033)
- Footer disclaimer (solo testo aggiornato con AION)
- System prompt AI (quello va in Claude Code)

NOTE FOR DEVELOPER:
All OTP functionality (Supabase Auth + Twilio SMS) and Cervello Digitale 
persistence (Supabase database) will be implemented in Claude Code.
For now stub all auth screens with UI only — buttons transition between 
screens without real backend calls. Mark all stub points clearly with:
// TODO: connect to Supabase Auth OTP
// TODO: load Cervello Digitale from Supabase

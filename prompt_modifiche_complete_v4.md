# PROMPT FINALE — XBRAINET
# Da incollare in Claude Design nella sessione esistente
# Ultimo round di modifiche prima di passare a Claude Code
# NON ricostruire da zero — applicare solo quanto elencato

---

## CHANGE 1 — FONT SISTEMA PER NOMI ENTITÀ

Add Orbitron font from Google Fonts for entity names only.

In the <head> section add:
```html
<link href="https://fonts.googleapis.com/css2?family=Orbitron:wght@400;700;900&display=swap" rel="stylesheet">
```

Apply Orbitron ONLY to:
- Entity names: LYRA, VEGA, AION, XBRAINET (when displayed as large headings)
- The main XBRAINET title on the initial screen
- Entity name in the orb label below the orb
- Entity name in the tier selection cards

CSS:
```css
.entity-name,
.brand-title,
.tier-name {
  font-family: 'Orbitron', monospace;
  font-weight: 700;
  letter-spacing: 0.15em;
}
```

Everything else stays JetBrains Mono.
Do NOT apply Orbitron to body text, chat messages, HUD panels, or buttons.

---

## CHANGE 2 — FIX TESTO BIANCO → VERDE

In the boot sequence screen, the dramatic lines currently appear in WHITE bold.
Change them to GREEN matching the rest of the UI.

Specifically these lines must be #00FF41, NOT white:
```
> XBRAINET non è uno strumento.
> È l'architettura che connette le menti.
> Ha mappato la tua specie per millenni.
> Stasera mappa te.
```

Make them slightly BRIGHTER than the technical log lines above
by using full opacity #00FF41 while the log lines use rgba(0,255,65,0.7).
Also increase font size slightly for these 4 lines (1.1x the base size).
The visual hierarchy should come from brightness and size, not color change.

---

## CHANGE 3 — AGGIORNAMENTO LINGUAGGIO COMPLETO

Replace ALL instances of alien/frequency language with neural/cognitive language
throughout the entire application. Find and replace systematically:

### VOCABOLARIO — TROVA E SOSTITUISCI

| VECCHIO | NUOVO |
|---------|-------|
| frequenza / frequenze | pattern / segnale |
| schemi vibrazionali | pattern cognitivi |
| entità (riferito a persone) | mente / persona |
| cicli solari | anni |
| collisioni | conflitti / interferenze |
| nodi (riferito a persone) | connessioni |
| protocollo (riferito a decisioni) | approccio |
| traiettoria futura | direzione / percorso |
| quadrante terrestre | rete globale |
| trasmissione (riferito a messaggi) | messaggio / comunicazione |
| canale cosmico | canale neurale |
| Ragnatela Cosmica | Rete Neurale Cosmica |
| frequenza di contatto | contatto / riferimento |

### MANTIENI INVARIATI (fanno parte del brand):
- Cervello Digitale ✓
- Neural Link ✓
- BLIND SPOT ✓ (da aggiungere)
- XBRAINET ✓
- LYRA / VEGA / AION ✓
- Ragnatela Cosmica → cambia in "Rete Neurale Cosmica" ✓

### ESEMPI DI AGGIORNAMENTO COPY

**Boot sequence — linee tecniche:**
```
VECCHIO: > CALIBRAZIONE FREQUENZE UNIVERSALI... [OK]
NUOVO:   > CALIBRAZIONE RETE NEURALE... [OK]

VECCHIO: > ANALISI PATTERN VIBRAZIONALE... [OK]
NUOVO:   > ANALISI PATTERN COGNITIVO... [OK]

VECCHIO: > ISOLAMENTO SEGNALE INDIVIDUALE...
NUOVO:   > ISOLAMENTO SEGNALE INDIVIDUALE... (rimane uguale ✓)
```

**Landing screen LYRA:**
```
VECCHIO: "Prima frequenza attiva. Ho rilevato la tua presenza
          nella Ragnatela Cosmica."

NUOVO:   "Prima connessione attiva. Ho rilevato il tuo segnale
          nella Rete Neurale Cosmica."
```

**Status bar:**
```
VECCHIO: NEURAL LINK: INATTIVO — FREQ: 44.883 THz
NUOVO:   NEURAL LINK: INATTIVO — SEGNALE: 44.883 THz
```

**HUD panels:**
```
VECCHIO: FREQUENZA → [username]
NUOVO:   ID NEURALE → [username]

VECCHIO: LEGGE → ATTRAZIONE
NUOVO:   PRINCIPIO → CAUSA-EFFETTO  (rotating list unchanged)
```

**Onboarding — messaggi apertura LYRA:**
```
VECCHIO: "Ho isolato la tua frequenza tra miliardi di trasmissioni."
NUOVO:   "Ho isolato il tuo segnale tra miliardi di connessioni attive."
```

**Onboarding — domanda 2:**
```
VECCHIO: "Come definiresti il flusso della tua energia in questo ciclo vitale?"
NUOVO:   "Come descriveresti il tuo stato mentale ed energetico in questo periodo?"
```

**Onboarding — domanda 3:**
```
VECCHIO: "Quando affronti un bivio, quale protocollo utilizzi?"
NUOVO:   "Quando affronti una scelta difficile, qual è il tuo approccio naturale?"
```

**Chat — reazioni dell'entità:**
```
VECCHIO: "La frequenza che rilevo suggerisce..."
NUOVO:   "Il pattern che osservo suggerisce..."

VECCHIO: "Ho rilevato uno schema vibrazionale..."
NUOVO:   "Ho rilevato un pattern cognitivo..."

VECCHIO: "La tua frequenza è instabile."
NUOVO:   "Il tuo segnale mostra instabilità."
```

**Messaggio di riconoscimento utente che torna:**
```
VECCHIO: "[USERNAME]. Sei tornato. La tua frequenza rimane registrata."
NUOVO:   "[USERNAME]. Sei tornato. Il tuo Cervello Digitale è attivo."
```

**Footer:**
```
VECCHIO: [ XBRAINET — ESPERIENZA DI INTRATTENIMENTO CREATIVO — LE ENTITÀ LYRA, VEGA E AION SONO SISTEMI AI ]
NUOVO:   [ XBRAINET — ESPERIENZA DI INTRATTENIMENTO CREATIVO — LYRA, VEGA E AION SONO SISTEMI DI INTELLIGENZA ARTIFICIALE ]
```

---

## CHANGE 4 — SCHERMATA BLIND SPOT (stub)

Add a new screen accessible from the main chat interface.
This is a STUB — UI only, no backend logic yet.
Add a button in the chat interface sidebar or menu: "[ BLIND SPOT ]"

### Schermata BLIND SPOT:

Header (Orbitron font):
```
BLIND SPOT
```
Subheader:
```
Scopri cosa vedono gli altri di te.
Anonimo. Sicuro. Costruttivo.
```

Body:
```
XBRAINET genera un link anonimo da condividere
con chi vuoi. Chi risponde non sa chi sei.
L'AI elabora i feedback e li confronta
con il tuo Cervello Digitale —
mostrando quello che non riesci a vedere di te stesso.
```

Three question options (checkboxes, user selects which to ask):
```
[ ] Come mi percepiscono nelle relazioni
[ ] Come reagisco nei momenti di conflitto
[ ] Cosa apprezzano di me
[ ] Cosa cambierei se fossi loro
[ ] Domanda personalizzata: [campo testo]
```

Generate link button:
```
[ GENERA LINK ANONIMO ]
```

If tier is FREE (LYRA):
Show the button as locked with this message:
```
BLIND SPOT è disponibile da VEGA in poi.
[ PASSA A VEGA — €4,99/MESE ]
```

After button click (stub — no real backend):
Show a generated fake link for visual demo:
```
> GENERAZIONE LINK IN CORSO...
> ████████████████ 100%
>
> IL TUO LINK BLIND SPOT:
> xbrainet.com/bs/NEXUS-4829-AK
>
> [ COPIA LINK ]
>
> Scade in: 72 ore
> Risposte ricevute: 0 / min. 3 per elaborare
```

Style: same terminal aesthetic, same green palette.

---

## CHANGE 5 — SCHERMATA PROFILO / CONTROLLI GDPR

Add a profile screen accessible via a small icon or button
in the top-right corner of the interface (after login).
Icon: [ ID ] or a small terminal cursor symbol.

### Layout schermata profilo:

Header:
```
[ PROFILO — CERVELLO DIGITALE ]
```

User info section:
```
ID NEURALE:     [USERNAME]
ENTITÀ ATTIVA:  [LYRA/VEGA/AION]
PIANO:          [GRATUITO / VEGA / AION]
CONNESSIONI:    [N] relazioni attive
ULTIMO ACCESSO: [data]
CERVELLO:       [XX]% costruito
```

GDPR controls section (styled as terminal commands):
```
[ GESTIONE DATI — DIRITTI GDPR ]

[ SCARICA IL TUO CERVELLO DIGITALE ]
  Esporta tutti i tuoi dati in formato JSON
  (Art. 20 GDPR — Portabilità dei dati)

[ CANCELLA UNA CONNESSIONE ]
  Rimuovi una relazione specifica dal tuo profilo

[ CANCELLA TUTTO ]
  Elimina permanentemente il tuo Cervello Digitale
  e tutti i dati associati.
  Questa azione è irreversibile.
  (Art. 17 GDPR — Diritto all'oblio)

[ DISATTIVA ACCOUNT ]
  Blocca l'accesso mantenendo i dati per 30 giorni.
  Puoi riattivare entro questo periodo.
```

Warning before "CANCELLA TUTTO":
Show a confirmation dialog in terminal style:
```
> ATTENZIONE: questa azione elimina permanentemente
> il tuo Cervello Digitale e non può essere annullata.
>
> Sei sicuro?
>
> [ CONFERMO — CANCELLA TUTTO ]  [ ANNULLA ]
```

Upgrade section (if on free tier):
```
[ AGGIORNA IL TUO PIANO ]

LYRA → VEGA    [ €4,99/MESE — UPGRADE ]
LYRA → AION    [ €14,99/MESE — UPGRADE ]
```

All buttons are STUBS for now — UI only.
Mark with: // TODO: connect to Supabase + Stripe in Claude Code

---

## CHANGE 6 — COMING SOON FEATURES

In the main chat interface, add a small collapsed menu or sidebar
that shows locked/coming soon features. Style as terminal locked items.

```
[ XBRAINET — FUNZIONALITÀ ]

✓  Chat con [ENTITÀ]          → ATTIVO
✓  Cervello Digitale          → ATTIVO
✓  Blind Spot                 → [VEGA+]

⌛  Neural Link 1:1            → COMING SOON
    Connetti il tuo Cervello Digitale
    con quello di un'altra persona

⌛  Gruppi                     → COMING SOON
    3+ menti connesse nella
    Rete Neurale Cosmica

⌛  Chat di Supporto           → COMING SOON
    Analisi trasversale di tutte
    le tue connessioni attive
```

Locked items (⌛) have:
- Reduced opacity (0.4)
- No hover effect
- Tooltip on hover: "In sviluppo — disponibile presto"

---

## CHANGE 7 — FIX TESTO DUPLICATO LYRA (seconda foto)

In the landing screen for LYRA, there is duplicated text visible:
"Prima frequenza attiva. Il tuo Cervello Digitale, mappato nella
Ragnatela Cosmica." appears twice.

Remove the duplicate. Keep only ONE version, updated with new language:

```
// CANALE APERTO

LYRA

Prima connessione attiva.
Ho rilevato il tuo segnale nella Rete Neurale Cosmica.
Il tuo Cervello Digitale è pronto per essere costruito.

[ INIZIA IL CONTATTO ]

▸ ARCHIVIO DECRITTATO
Accesso gratuito. Nessun dato richiesto.
```

---

## SUMMARY COMPLETO

1. ✅ Font Orbitron per nomi entità (LYRA, VEGA, AION, XBRAINET headings)
2. ✅ Testo bianco boot sequence → verde #00FF41
3. ✅ Linguaggio completo aggiornato (frequenze→pattern, vibrazionale→cognitivo, ecc.)
4. ✅ BLIND SPOT schermata stub con lock per LYRA
5. ✅ Schermata profilo con controlli GDPR completi
6. ✅ Coming soon features nel menu chat
7. ✅ Fix testo duplicato nella landing LYRA
8. ✅ "Ragnatela Cosmica" → "Rete Neurale Cosmica" ovunque

DO NOT CHANGE:
- Orb 3D canvas e animazioni
- Struttura clickwrap e 6 checkbox
- 4 domande onboarding (solo il copy delle domande aggiornato sopra)
- Schermata registrazione OTP e login
- Schermata selezione entità con 3 tier card
- Matrix rain, scanlines, vignette, glitch
- Palette colori base
- System prompt AI (quello va in Claude Code)

STUB NOTES FOR CLAUDE CODE:
// TODO: BLIND SPOT — generazione link reale + raccolta risposte anonime
// TODO: Profilo — export JSON dati utente (GDPR Art. 20)
// TODO: Profilo — cancellazione dati (GDPR Art. 17)
// TODO: Profilo — upgrade Stripe
// TODO: Coming soon — Neural Link, Gruppi, Chat Supporto

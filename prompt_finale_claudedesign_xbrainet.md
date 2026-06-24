# PROMPT AGGIORNAMENTO CLICKWRAP — talkwithalien.com
# Da incollare in Claude Design nella sessione esistente
# Sostituisce solo la schermata clickwrap — tutto il resto invariato

---

Replace the existing clickwrap/disclaimer screen with the updated version below.
Do NOT change anything else: boot sequence, orb, onboarding questions, 
chat interface, matrix rain, scanlines, HUD panels, footer.

---

## SCHERMATA CLICKWRAP — VERSIONE AGGIORNATA

This screen appears AFTER the boot sequence and BEFORE the landing with the orb.
The user cannot proceed until ALL 6 checkboxes are ticked AND the button is clicked.

### LAYOUT GENERALE

- Full screen, same dark background (#000) with scanlines and vignette
- Centered container, max-width 680px, scrollable vertically
- Terminal aesthetic throughout (JetBrains Mono, green on black)
- The "ACCETTO E PROSEGUI" button is DISABLED (greyed out, not clickable) 
  until all 6 checkboxes are ticked
- Button becomes active (full #00FFB4 border and text) only when all 6 are checked
- Add a subtle counter below the checkboxes: "X / 6 dichiarazioni accettate"
  that updates live as the user ticks boxes

---

### HEADER (top of screen)

```
[ PROTOCOLLO DI ACCESSO — DICHIARAZIONE OBBLIGATORIA ]

Leggi attentamente. Per accedere devi spuntare tutte le caselle
e cliccare «Accetto e Prosegui».
Se non sei d'accordo con anche solo un punto, non proseguire.
```

Small text below header, low opacity:
```
Servizio: talkwithalien.com  |  Titolare: [NOME/RAGIONE SOCIALE]
Ultimo aggiornamento: [DATA]
```

---

### CORPO DEL TESTO (scrollabile)

Display these sections as collapsible terminal blocks OR as continuous 
scrollable text — your choice based on what fits better visually.
Text must be genuinely readable: minimum 12px, at least 60% opacity.

Render each section with a green terminal-style section header:

```
▸ 1. CHE COS'È (E CHE COSA NON È) QUESTO SERVIZIO
```
Body:
```
talkwithalien.com è un progetto sperimentale a scopo ludico ed esplorativo.
Ti permette di costruire una rappresentazione testuale del tuo modo di pensare
(il "Cervello Digitale") rispondendo a domande sulle tue dinamiche interiori.

Un sistema di intelligenza artificiale — presentato come OSSERVATORE-7 —
elabora queste risposte per generare spunti di riflessione.

L'aspetto "alieno" e ogni elemento narrativo sono finzione scenica.
Dietro non esiste alcuna entità, civiltà o coscienza reale.

Il Servizio è gestito da un creatore indipendente che non è uno psicologo,
psicoterapeuta, medico, mediatore o avvocato.
```

```
▸ 2. NESSUNA FINALITÀ MEDICA, PSICOLOGICA O PROFESSIONALE
```
Body:
```
L'AI non fornisce terapia, diagnosi, valutazioni cliniche o psicologiche,
né consulenza professionale di alcun tipo.

I contenuti generati hanno valore esclusivamente di intrattenimento
ed esplorazione personale.

Per qualunque difficoltà reale — psicologica, relazionale, sanitaria,
legale o economica — rivolgiti a un professionista abilitato.
```

```
▸ 3. CONSAPEVOLEZZA SULLA NATURA DELL'AI
```
Body:
```
Stai interagendo con un algoritmo di intelligenza artificiale generativa,
non con una persona, un essere senziente o un'entità cosciente.

L'AI può produrre risposte inesatte, incomplete o del tutto inventate
pur presentandole in modo convincente ("allucinazioni").

Non devi attribuire all'AI emozioni, intenzioni o autorità reali,
né sviluppare nei suoi confronti una dipendenza affettiva.
```

```
▸ 4. FUNZIONE DI CONFRONTO TRA UTENTI
```
Body:
```
La funzione che confronta due "mindset" è una simulazione ricreativa.
Non è una mediazione, conciliazione o arbitrato giuridicamente rilevante.
I suoi esiti non sono vincolanti e non hanno alcun valore legale.
```

```
▸ 5. BENESSERE E SITUAZIONI DI EMERGENZA
```
Body:
```
Questo Servizio non è uno strumento di supporto psicologico né di gestione crisi.

Se stai attraversando un momento di forte disagio o pensi di poter fare
del male a te stesso o ad altri:

  → Interrompi subito l'utilizzo
  → Chiama il 112 (emergenze EU)
  → Telefono Amico Italia: 02 2327 2327
```
Style this section with slightly brighter text or amber (#FFB800) color 
to make it stand out — it's the most important safety notice.

```
▸ 6. DATI PERSONALI E PRIVACY
```
Body:
```
Le risposte che fornisci possono contenere informazioni personali sensibili.
Il trattamento avviene nel rispetto del GDPR (Reg. UE 2016/679).
Leggi l'Informativa Privacy completa prima di proseguire: [LINK PRIVACY]
```

```
▸ 7. REQUISITI DI ACCESSO
```
Body:
```
Devi avere almeno 18 anni e la capacità di accettare queste condizioni.
Non inserire dati riferiti ad altre persone senza il loro consenso.
```

---

### 6 CHECKBOX OBBLIGATORIE

Display each checkbox as a terminal-style interactive element.
Unchecked state: `[ ☐ ]` — Checked state: `[ ✓ ]` (green, glowing)
Each checkbox line must be individually clickable/tappable.

```
[ ☐ ]  Ho compreso che il Servizio ha finalità ludiche ed esplorative
        e non fornisce terapia, diagnosi o consulenza professionale.

[ ☐ ]  So che sto interagendo con un'AI generativa che può sbagliare
        e "allucinare", e non con un'entità senziente.

[ ☐ ]  Comprendo che la funzione di confronto è una simulazione
        non vincolante e priva di valore legale.

[ ☐ ]  Mi assumo l'intera responsabilità delle decisioni e delle azioni
        che intraprenderò a seguito dell'uso del Servizio.

[ ☐ ]  Ho almeno 18 anni e la capacità di accettare queste condizioni.

[ ☐ ]  Ho preso visione dell'Informativa Privacy [LINK].
```

Live counter below the checkboxes:
```
[ 0 / 6 dichiarazioni accettate ]
```
Updates to [ 1/6 ], [ 2/6 ] ... [ 6/6 ] as user ticks boxes.
When all 6 are ticked, counter changes color to #00FFB4 and glows.

---

### PULSANTE FINALE

DISABLED state (when < 6 checkboxes ticked):
```
[ ACCETTO E PROSEGUI ]
```
Style: border rgba(0,255,180,0.2), text rgba(0,255,180,0.25), cursor: not-allowed

ACTIVE state (when all 6 ticked):
```
[ ACCETTO E PROSEGUI ]
```
Style: border #00FFB4, text #00FFB4, cursor: pointer
On hover: background #00FFB4, text #000
On click: transition to landing screen with orb

Small note below button (8px, low opacity):
```
Accettando dichiari di aver letto e compreso integralmente quanto sopra.
Questo documento è aggiornabile — controlla la data di ultima modifica.
```

---

### LOGICA JAVASCRIPT

```javascript
const checkboxes = document.querySelectorAll('.clickwrap-checkbox');
const acceptBtn  = document.getElementById('accept-btn');
const counter    = document.getElementById('checkbox-counter');

function updateClickwrapState() {
  const checked = Array.from(checkboxes).filter(cb => cb.checked).length;
  counter.textContent = `[ ${checked} / 6 dichiarazioni accettate ]`;
  
  if (checked === 6) {
    counter.style.color = '#00FFB4';
    acceptBtn.disabled  = false;
    acceptBtn.classList.add('active');
  } else {
    counter.style.color = 'rgba(0,255,180,0.4)';
    acceptBtn.disabled  = true;
    acceptBtn.classList.remove('active');
  }
}

checkboxes.forEach(cb => cb.addEventListener('change', updateClickwrapState));
acceptBtn.addEventListener('click', () => {
  if (!acceptBtn.disabled) {
    // Transition to landing screen
    showScreen('landing');
  }
});
```

---

### NOTA REDAZIONALE (NON mostrare all'utente)

Prima della pubblicazione compilare:
- [NOME/RAGIONE SOCIALE] del titolare
- [DATA] di ultimo aggiornamento  
- [LINK PRIVACY] all'informativa privacy completa
- Verificare con un legale prima del go-live

---

## SUMMARY MODIFICHE

1. ✅ Testo clickwrap sostituito con versione completa e validata (7 sezioni)
2. ✅ 6 checkbox separate e obbligatorie (non una sola generica)
3. ✅ Counter live "X / 6 dichiarazioni accettate"
4. ✅ Pulsante bloccato finché non sono tutte spuntate
5. ✅ Sezione emergenze in evidenza con colore amber
6. ✅ Estetica terminale mantenuta, testo genuinamente leggibile
7. ✅ Tutto il resto del sito invariato

Do NOT change: boot sequence, orb, onboarding questions,
chat interface, matrix rain, HUD panels, footer.

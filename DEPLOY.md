# XBRAINET — Deploy Guide

Checklist completa per portare XBRAINET in produzione su **Vercel** con **Supabase**, **Anthropic**, **Twilio** e **Stripe**.

---

## 0. Prerequisiti

Account attivi su:

- [Vercel](https://vercel.com) (collegato al repo GitHub `desiderigabriele-spec/xbrainet`)
- [Supabase](https://supabase.com) (progetto PostgreSQL)
- [Anthropic Console](https://console.anthropic.com) (API key)
- [Twilio](https://www.twilio.com) (Verify service per OTP via SMS)
- [Stripe](https://dashboard.stripe.com) (2 prodotti/prezzi ricorrenti: VEGA e AION)

---

## 1. Supabase — Database

1. Apri il progetto Supabase → **SQL Editor**.
2. Incolla ed esegui l'intero contenuto di [`schema.sql`](./schema.sql). È idempotente (safe to re-run): crea tabelle, RLS policy, helper `increment()` e applica le migration.
3. Verifica che la colonna del rate limiter esista (inclusa nello schema, ma controlla se avevi già uno schema vecchio):

   ```sql
   alter table users add column if not exists last_message_at timestamptz;
   ```

4. Da **Settings → API** copia:
   - `Project URL` → `SUPABASE_URL`
   - `service_role` secret → `SUPABASE_SERVICE_KEY` (⚠️ mai esporlo al client)
   - `anon` public key → `NEXT_PUBLIC_SUPABASE_ANON_KEY`

---

## 2. Stripe — Prodotti e Webhook

1. **Products** → crea due prodotti con prezzo ricorrente mensile:
   - VEGA — €4,99/mese → copia il `price_...` in `STRIPE_PRICE_VEGA`
   - AION — €14,99/mese → copia il `price_...` in `STRIPE_PRICE_AION`
2. **Developers → API keys**: copia la Secret key → `STRIPE_SECRET_KEY`.
3. **Developers → Webhooks → Add endpoint**:
   - URL: `https://<tuo-dominio-vercel>/api/stripe/webhook`
   - Eventi: `checkout.session.completed`, `customer.subscription.deleted`
   - Dopo la creazione copia il **Signing secret** (`whsec_...`) → `STRIPE_WEBHOOK_SECRET`

> Il webhook aggiorna automaticamente `tier`/`entity` dell'utente su upgrade e li riporta a `free`/`LYRA` alla cancellazione dell'abbonamento.

---

## 3. Twilio — OTP via SMS

1. **Verify → Services → Create**: crea un Verify Service.
2. Copia:
   - Account SID → `TWILIO_ACCOUNT_SID`
   - Auth Token → `TWILIO_AUTH_TOKEN`
   - Verify Service SID (`VA...`) → `TWILIO_VERIFY_SID`

> `api/auth/send-otp.js` normalizza i numeri senza prefisso a `+39` (Italia). Adatta il default se il target non è italiano.

---

## 4. Anthropic

Da [console.anthropic.com](https://console.anthropic.com) → **API Keys** → copia in `ANTHROPIC_API_KEY`.

Modelli usati (in `lib/anthropic.js`), per tier:

| Tier | Modello |
|------|---------|
| free (LYRA) | `claude-haiku-4-5-20251001` |
| vega (VEGA) | `claude-sonnet-4-6` |
| aion (AION) | `claude-opus-4-8` |

---

## 5. Vercel — Environment Variables

Vercel → progetto → **Settings → Environment Variables**. Aggiungi tutte le variabili per gli ambienti **Production** (e Preview se vuoi testare i branch):

| Variabile | Origine | Note |
|-----------|---------|------|
| `SUPABASE_URL` | Supabase → Settings → API | |
| `SUPABASE_SERVICE_KEY` | Supabase → service_role | segreto |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase → anon | |
| `ANTHROPIC_API_KEY` | Anthropic Console | segreto |
| `JWT_SECRET` | **generalo tu** | vedi sotto |
| `PHONE_HMAC_SECRET` | **generalo tu** | vedi sotto |
| `TWILIO_ACCOUNT_SID` | Twilio | |
| `TWILIO_AUTH_TOKEN` | Twilio | segreto |
| `TWILIO_VERIFY_SID` | Twilio Verify Service | |
| `STRIPE_SECRET_KEY` | Stripe → API keys | segreto |
| `STRIPE_WEBHOOK_SECRET` | Stripe → Webhook signing secret | segreto |
| `STRIPE_PRICE_VEGA` | Stripe → Product VEGA | |
| `STRIPE_PRICE_AION` | Stripe → Product AION | |
| `NEXT_PUBLIC_URL` | dominio finale Vercel | es. `https://xbrainet.vercel.app` |

Genera i due segreti applicativi con:

```bash
# JWT_SECRET
node -e "console.log(require('crypto').randomBytes(48).toString('hex'))"
# PHONE_HMAC_SECRET
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

> ⚠️ `PHONE_HMAC_SECRET` non deve mai cambiare dopo il primo utente registrato: è la chiave con cui si calcola `phone_hash` per il lookup. Cambiarlo scollega tutti gli account esistenti dai loro numeri.

---

## 6. Deploy

- **Preview**: ogni push su un branch genera un preview deployment automatico.
- **Produzione**: effettua il **merge su `main`** (branch di produzione). Vercel builda e pubblica sul dominio principale.

Nessun `buildCommand` è richiesto: sono funzioni serverless Node in `api/**` + `index.html` statico. La config è in [`vercel.json`](./vercel.json) (runtime `nodejs18.x`, rewrite SPA, rotta `/bs/*` per i link Blind Spot).

---

## 7. Verifica post-deploy

1. Apri `NEXT_PUBLIC_URL` → deve caricare il boot di XBRAINET.
2. **Registrazione**: numero di telefono → ricevi OTP → verifica → ottieni `token` + username.
3. **Chat**: invia un messaggio a LYRA → risposta AI, rate limit attivo (1 msg/3s free).
4. **Upgrade**: da Profilo → checkout Stripe (usa carta test `4242 4242 4242 4242`) → il webhook deve promuovere l'utente a VEGA/AION.
5. **Blind Spot** (VEGA+): genera link → apri `/bs/<token>` in incognito → invia feedback.
6. **Neural Link** (VEGA+): genera chiave da un account, connettila da un secondo account, genera l'analisi comparativa.

---

## Note di sicurezza

- Tutti gli endpoint applicativi richiedono `Authorization: Bearer <token>` (JWT firmato HS256); `userId` è estratto dal token, non dal body.
- Endpoint pubblici (per design): `api/auth/*`, `api/stripe/webhook`, `api/blindspot/respond/[token]`, `api/blindspot/submit/[token]`.
- Il numero di telefono non è mai salvato in chiaro: solo il suo HMAC-SHA256 (`phone_hash`).
- `.env.example` documenta tutte le variabili; non committare mai un `.env` reale.

## TODO noti prima del lancio pubblico

- [ ] **`Privacy.dc.html`**: riscritto per XBRAINET e allineato all'architettura reale (registrazione telefonica, Cervello Digitale persistente su Supabase, Neural Link, BLIND SPOT, Stripe, Anthropic). ⚠️ Resta una **bozza tecnica da far validare da un consulente legale** prima della pubblicazione; completare eventuali placeholder `[…]`.
- [ ] Il clickwrap in `index.html` indica "bozza da validare da un legale".
- [ ] Verificare che il dominio email `privacy@xbrainet.com` sia attivo e monitorato.

# B&B DEMO — Sistema di Prenotazione Front-End

Prototipo web responsive di un sito di ospitalità e prenotazione diretta per struttura ricettiva (**B&B DEMO**, *Via Esempio 12*).  
Il progetto è realizzato con tecnologie front-end standard ed è progettato con una struttura dati pulita, pronta per essere collegata a un futuro back-end **Java** e a un database relazionale **SQL**.

---

## Funzionalità principali

* **Modulo di prenotazione interattivo**
  * Selezione della tipologia di camera, numero di ospiti, date di check-in/check-out, fascia oraria indicativa di arrivo e note/richieste speciali.
  * **Calcolo preventivo in tempo reale**: aggiornamento automatico del numero di notti e del totale stimato in base alla tariffa della camera scelta.
* **Validazione e sicurezza lato client**
  * Blocco delle prenotazioni nel passato (check-in minimo impostato dinamicamente alla data odierna e check-out strettamente successivo al check-in).
  * Validazione dei campi anagrafici e di contatto (`Nome`, `Cognome`, `Email`, `Telefono`) tramite espressioni regolari e filtro di moderazione dei contenuti.
  * Accettazione obbligatoria dell'informativa sulla privacy e dei termini di soggiorno.
* **Gestione storico e riepilogo (`localStorage`)**
  * Generazione di un codice prenotazione univoco (`BK-XXXXXX`), riepilogo immediato dell'ultima prenotazione effettuata e storico consultabile/cancellabile salvato nel browser.
* **Mappa interattiva dei collegamenti**
  * Visualizzazione dei percorsi principali verso la struttura (*Dalla Stazione*, *Dal Porto*, *Dall'Aeroporto*) con tempi stimati e indicazioni stradali.
* **Assistente virtuale dimostrativo**
  * Widget chat integrato per simulare richieste rapide sulle informazioni del soggiorno.

---

## Tecnologie utilizzate

* **HTML5** (struttura semantica e attributi di accessibilità)
* **CSS3** (layout responsive a griglia/flexbox e tema scuro)
* **JavaScript Vanilla (ES6+)** (gestione DOM, validazione form, calcolo tariffe, mappa interattiva e `localStorage`)

---

## Struttura del progetto

```text
bb_DEMO/
├── index.html       # Struttura principale della pagina e del form di prenotazione
├── stile.css        # Stili, layout responsive e tema grafico
├── script.js        # Validazione form, calcolo preventivo e gestione localStorage
├── mappa.js         # Logica interattiva della mappa e dei tragitti
├── demo-chat.js     # Simulazione assistente virtuale
├── img/             # Risorse grafiche e fotografie delle camere
└── README.md        # Documentazione del progetto
```

---

## Avvio in locale

Non sono richieste dipendenze esterne o build tool:

1. Clona o scarica la repository:
   ```bash
   git clone https://github.com/Naranciata/bb_DEMO.git
   ```
2. Apri la cartella del progetto e avvia `index.html` nel browser (oppure utilizza l'estensione **Live Server** su Visual Studio Code).

---

## Roadmap (Evoluzione Back-End)

* Integrazione API REST in **Java** (es. Spring Boot) per la gestione reale delle disponibilità.
* Persistenza delle prenotazioni e anagrafiche clienti su database **SQL** (es. PostgreSQL / MySQL).
* Integrazione di un gateway di pagamento certificato (es. Stripe) tramite tokenizzazione, evitando la gestione diretta dei dati carta sul server applicativo.

---

## Nota dimostrativa

Tutti i nomi, gli indirizzi (*Via Esempio 12*), i recapiti (`+39 000 0000000`, `info@bnbdemo.example`) e i flussi di prenotazione presenti in questo progetto hanno **scopo esclusivamente dimostrativo**. Nessun pagamento reale o dato di carta di credito viene richiesto né salvato.

document.addEventListener('DOMContentLoaded', () => {
    const bookingForm = document.getElementById('booking-form');
    const roomSelect = document.getElementById('stanza');
    const checkinInput = document.getElementById('checkin');
    const checkoutInput = document.getElementById('checkout');
    const guestsSelect = document.getElementById('ospiti');
    const nameInput = document.getElementById('nome');
    const surnameInput = document.getElementById('cognome');
    const emailInput = document.getElementById('email');
    const phoneInput = document.getElementById('telefono');
    const orarioArrivalSelect = document.getElementById('orario-arrivo');
    const noteInput = document.getElementById('note');
    const privacyCheckbox = document.getElementById('privacy');

    const priceCalcBox = document.getElementById('price-calculation-box');
    const calcNights = document.getElementById('calc-nights');
    const calcNightlyPrice = document.getElementById('calc-nightly-price');
    const calcTotal = document.getElementById('calc-total');

    const bookingSummaryBox = document.getElementById('booking-summary-box');
    const summaryContent = document.getElementById('summary-content');
    const formErrorBox = document.getElementById('form-error-box');
    
    const nameErrorDiv = document.getElementById('nome-error');
    const surnameErrorDiv = document.getElementById('cognome-error');
    const phoneErrorDiv = document.getElementById('telefono-error');
    const noteErrorDiv = document.getElementById('note-error');

    function showError(message) {
        formErrorBox.textContent = message;
        formErrorBox.style.display = 'block';
        formErrorBox.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }

    function hideFieldErrors() {
        if (nameErrorDiv) {
            nameErrorDiv.textContent = '';
            nameErrorDiv.style.display = 'none';
        }
        if (surnameErrorDiv) {
            surnameErrorDiv.textContent = '';
            surnameErrorDiv.style.display = 'none';
        }
        if (phoneErrorDiv) {
            phoneErrorDiv.textContent = '';
            phoneErrorDiv.style.display = 'none';
        }
        if (noteErrorDiv) {
            noteErrorDiv.textContent = '';
            noteErrorDiv.style.display = 'none';
        }
        if (nameInput) nameInput.removeAttribute('aria-invalid');
        if (surnameInput) surnameInput.removeAttribute('aria-invalid');
        if (phoneInput) phoneInput.removeAttribute('aria-invalid');
        if (noteInput) noteInput.removeAttribute('aria-invalid');
    }

    function hideError() {
        formErrorBox.textContent = '';
        formErrorBox.style.display = 'none';
        hideFieldErrors();
    }

    // Nascondi l'errore quando l'utente modifica qualsiasi campo del form
    bookingForm.addEventListener('input', hideError);
    bookingForm.addEventListener('change', hideError);

    const bookRoomButtons = document.querySelectorAll('.book-room-btn');
    const clearStorageBtn = document.getElementById('clear-storage-btn');
    const savedBookingsContainer = document.getElementById('saved-bookings-container');

    // Struttura dati delle camere (preparata per futura integrazione API/Database SQL)
    const roomsData = [
        { id: 'deluxe', name: 'Camera Deluxe', category: 'coppia', basePrice: 95, maxGuests: 2 },
        { id: 'romantica', name: 'Suite Romantica', category: 'coppia', basePrice: 130, maxGuests: 2 },
        { id: 'panoramica', name: 'Camera Vista Panoramica', category: 'vista', basePrice: 110, maxGuests: 2 },
        { id: 'superior', name: 'Camera Superior', category: 'coppia', basePrice: 85, maxGuests: 2 },
        { id: 'familiare', name: 'Suite Familiare', category: 'famiglia', basePrice: 150, maxGuests: 4 }
    ];

    // Filtri Stanze
    const filterButtons = document.querySelectorAll('.filter-btn');
    const roomCards = document.querySelectorAll('.room-card');

    filterButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            filterButtons.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

            const filterValue = btn.getAttribute('data-filter');

            roomCards.forEach(card => {
                const category = card.getAttribute('data-category');
                if (filterValue === 'all' || category === filterValue) {
                    card.style.display = 'flex';
                } else {
                    card.style.display = 'none';
                }
            });
        });
    });

    // Funzione per ottenere la data locale in formato YYYY-MM-DD
    function getLocalDateString(date = new Date()) {
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
    }

    // Imposta la data minima di check-in a oggi
    const today = getLocalDateString();
    checkinInput.min = today;

    // Imposta la data minima iniziale di check-out (domani)
    const initialCheckin = new Date();
    const initialCheckout = new Date(initialCheckin);
    initialCheckout.setDate(initialCheckout.getDate() + 1);
    checkoutInput.min = getLocalDateString(initialCheckout);

    // Funzione per aggiornare e disabilitare gli orari di arrivo passati se il check-in è oggi
    function updateArrivalTimeOptions() {
        const checkinVal = checkinInput.value;
        const isToday = (checkinVal === today);

        const options = orarioArrivalSelect.querySelectorAll('option');
        options.forEach(opt => {
            if (!opt.value) return; // Salta il placeholder
            const parts = opt.value.split('-');
            if (parts.length >= 2) {
                const endTimeStr = parts[1].trim();
                const [endHour, endMin] = endTimeStr.split(':').map(Number);
                const now = new Date();
                const currentTotalMin = now.getHours() * 60 + now.getMinutes();
                const endTotalMin = endHour * 60 + (isNaN(endMin) ? 0 : endMin);

                if (isToday && currentTotalMin > endTotalMin) {
                    opt.disabled = true;
                    if (!opt.textContent.includes(' (Passato)')) {
                        opt.textContent += ' (Passato)';
                    }
                } else {
                    opt.disabled = false;
                    opt.textContent = opt.textContent.replace(' (Passato)', '');
                }
            }
        });

        const selectedOpt = orarioArrivalSelect.options[orarioArrivalSelect.selectedIndex];
        if (selectedOpt && selectedOpt.disabled) {
            orarioArrivalSelect.value = "";
        }
    }

    // Chiama subito per aggiornare gli orari all'avvio
    updateArrivalTimeOptions();

    // Funzione di validazione delle date
    function validateDates() {
        const checkinVal = checkinInput.value;
        const checkoutVal = checkoutInput.value;

        if (checkinVal && checkinVal < today) {
            showError("Errore: La data di check-in non può essere nel passato.");
            return false;
        }

        if (checkinVal && checkoutVal && checkoutVal <= checkinVal) {
            showError("Errore: La data di check-out deve essere successiva alla data di check-in.");
            return false;
        }

        return true;
    }

    // Funzione per visualizzare lo storico delle prenotazioni salvate nel localStorage
    function renderSavedBookings() {
        const bookings = JSON.parse(localStorage.getItem('bb_bookings')) || [];
        if (bookings.length === 0) {
            savedBookingsContainer.innerHTML = '<p style="color: #777; font-style: italic; text-align: center;">Nessuna prenotazione salvata in localStorage.</p>';
            return;
        }

        let html = '<h4 style="margin-bottom: 10px; color: #4a3b32;">Storico Prenotazioni Salvate (' + bookings.length + '):</h4>';
        bookings.forEach((b, index) => {
            let guestFullName = '';
            if (b.guestNome && b.guestCognome) {
                guestFullName = `${b.guestNome} ${b.guestCognome}`;
            } else if (b.guestName) {
                guestFullName = b.guestName;
            } else {
                guestFullName = 'Ospite';
            }
            let guestPhone = b.guestTelefono || 'Non specificato';
            let arrivalTime = b.orarioArrivo || 'Non specificato';
            let noteItemHtml = b.note ? `<p><strong>Note:</strong> ${b.note}</p>` : '';

            html += `
                <div class="saved-booking-item">
                    <p><strong>#${index + 1} - Codice:</strong> ${b.id}</p>
                    <p><strong>Ospite:</strong> ${guestFullName} | <strong>Tel:</strong> ${guestPhone} (${b.guestEmail || 'N/D'})</p>
                    <p><strong>Camera:</strong> ${b.roomName} | <strong>Arrivo:</strong> ${arrivalTime}</p>
                    ${noteItemHtml}
                    <p><strong>Periodo:</strong> ${b.checkin} ➔ ${b.checkout} (${b.nights} notti) | <strong>Totale:</strong> €${b.totalPrice}</p>
                </div>
            `;
        });
        savedBookingsContainer.innerHTML = html;
    }

    // Carica lo storico all'avvio
    renderSavedBookings();

    // Quando si clicca su "Prenota questa stanza" su una card stanza
    bookRoomButtons.forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            const roomType = btn.getAttribute('data-room');
            roomSelect.value = roomType;
            
            if (!checkinInput.value || checkinInput.value < today) {
                checkinInput.value = today;
                const nextDay = new Date();
                nextDay.setDate(nextDay.getDate() + 1);
                const nextDayStr = getLocalDateString(nextDay);
                checkoutInput.min = nextDayStr;
                if (!checkoutInput.value || checkoutInput.value <= today) {
                    checkoutInput.value = nextDayStr;
                }
            }
            updateArrivalTimeOptions();

            // Scorri dolcemente alla sezione prenotazione
            document.getElementById('prenota').scrollIntoView({ behavior: 'smooth' });
            calculatePrice();
        });
    });

    // Funzione per calcolare le notti e il totale
    function calculatePrice() {
        const selectedOption = roomSelect.options[roomSelect.selectedIndex];
        const checkinVal = checkinInput.value;
        const checkoutVal = checkoutInput.value;

        if (roomSelect.value && checkinVal && checkoutVal) {
            const checkinDate = new Date(checkinVal);
            const checkoutDate = new Date(checkoutVal);
            const timeDiff = checkoutDate.getTime() - checkinDate.getTime();
            const nights = Math.ceil(timeDiff / (1000 * 3600 * 24));

            if (nights > 0) {
                const pricePerNight = parseFloat(selectedOption.getAttribute('data-price'));
                const total = nights * pricePerNight;

                calcNights.textContent = nights;
                calcNightlyPrice.textContent = `€${pricePerNight}`;
                calcTotal.textContent = `€${total}`;
                priceCalcBox.style.display = 'flex';
                return { nights, pricePerNight, total };
            } else {
                priceCalcBox.style.display = 'none';
                return null;
            }
        } else {
            priceCalcBox.style.display = 'none';
            return null;
        }
    }

    // Event listeners per ricalcolare in tempo reale
    roomSelect.addEventListener('change', () => {
        if (checkinInput.value) {
            const nextDay = new Date(checkinInput.value);
            nextDay.setDate(nextDay.getDate() + 1);
            checkoutInput.min = getLocalDateString(nextDay);
        }
        calculatePrice();
    });

    checkinInput.addEventListener('change', () => {
        const checkinVal = checkinInput.value;
        if (checkinVal < today) {
            showError("Errore: La data di check-in non può essere nel passato.");
            checkinInput.value = today;
        } else {
            hideError();
        }

        const checkinDate = new Date(checkinInput.value);
        const nextDay = new Date(checkinDate);
        nextDay.setDate(nextDay.getDate() + 1);
        const nextDayStr = getLocalDateString(nextDay);
        
        checkoutInput.min = nextDayStr;
        if (checkoutInput.value && checkoutInput.value < nextDayStr) {
            checkoutInput.value = nextDayStr;
        }
        updateArrivalTimeOptions();
        validateDates();
        calculatePrice();
    });

    checkoutInput.addEventListener('change', () => {
        const checkinVal = checkinInput.value;
        const checkoutVal = checkoutInput.value;
        if (checkinVal && checkoutVal && checkoutVal <= checkinVal) {
            showError("Errore: La data di check-out deve essere successiva alla data di check-in.");
            const nextDay = new Date(checkinVal);
            nextDay.setDate(nextDay.getDate() + 1);
            checkoutInput.value = getLocalDateString(nextDay);
        } else {
            hideError();
        }
        validateDates();
        calculatePrice();
    });

    // Invio del form
    bookingForm.addEventListener('submit', (e) => {
        e.preventDefault();

        const nameVal = nameInput.value.trim();
        const surnameVal = surnameInput.value.trim();
        const emailVal = emailInput.value.trim();
        const phoneVal = phoneInput.value.trim();
        const orarioVal = orarioArrivalSelect.value;
        const noteVal = noteInput.value.trim();
        const roomVal = roomSelect.value;
        const checkinVal = checkinInput.value;
        const checkoutVal = checkoutInput.value;

        // Validazione date (Check-in nel passato o check-out non successivo)
        if (!checkinVal || checkinVal < today) {
            const errorMsg = 'Errore: La data di check-in è obbligatoria e non può essere nel passato.';
            showError(errorMsg);
            checkinInput.focus();
            return;
        }

        if (!checkoutVal || checkoutVal <= checkinVal) {
            const errorMsg = 'Errore: La data di check-out è obbligatoria e deve essere successiva alla data di check-in.';
            showError(errorMsg);
            checkoutInput.focus();
            return;
        }

        // Controllo orario di arrivo se check-in è oggi
        if (checkinVal === today) {
            updateArrivalTimeOptions();
            if (!orarioVal) {
                const errorMsg = 'Errore: Seleziona un orario indicativo di arrivo.';
                showError(errorMsg);
                orarioArrivalSelect.focus();
                return;
            }
            const selectedOpt = orarioArrivalSelect.options[orarioArrivalSelect.selectedIndex];
            if (selectedOpt && selectedOpt.disabled) {
                const errorMsg = "Errore: L'orario di arrivo selezionato è già passato per la giornata odierna. Seleziona un orario futuro.";
                showError(errorMsg);
                orarioArrivalSelect.focus();
                return;
            }
        }

        // Lista parole proibite (anti-parolacce)
        const forbiddenWords = ['cazzo', 'merda', 'stronzo', 'stronza', 'vaffanculo', 'idiota', 'cretino', 'imbecille', 'puttana', 'troia', 'bastardo', 'bastarda', 'coglione', 'pirla', 'minchia'];

        // Validazione Nome: obbligatorio, solo lettere (incluse accentate), spazi e apostrofi
        const nameRegex = /^[A-Za-zÀ-ÿ']+$/;
        const nameWords = nameVal.split(/\s+/);
        const hasOnlyAllowedCharsName = /^[A-Za-zÀ-ÿ' ]+$/.test(nameVal);

        if (nameVal === '' || !hasOnlyAllowedCharsName || !nameWords.every(word => nameRegex.test(word))) {
            const errorMsg = 'Errore: Il campo Nome è obbligatorio e deve contenere solo lettere (incluse accentate), spazi e apostrofi (senza numeri, punti o altri simboli).';
            if (nameErrorDiv) {
                nameErrorDiv.textContent = errorMsg;
                nameErrorDiv.style.display = 'block';
            }
            nameInput.setAttribute('aria-invalid', 'true');
            showError(errorMsg);
            nameInput.focus();
            return;
        }

        if (nameWords.some(word => forbiddenWords.includes(word.toLowerCase()))) {
            const errorMsg = 'Errore: Il campo Nome non è valido.';
            if (nameErrorDiv) {
                nameErrorDiv.textContent = errorMsg;
                nameErrorDiv.style.display = 'block';
            }
            nameInput.setAttribute('aria-invalid', 'true');
            showError(errorMsg);
            nameInput.focus();
            return;
        }

        // Validazione Cognome: obbligatorio, solo lettere (incluse accentate), spazi e apostrofi
        const surnameWords = surnameVal.split(/\s+/);
        const hasOnlyAllowedCharsSurname = /^[A-Za-zÀ-ÿ' ]+$/.test(surnameVal);

        if (surnameVal === '' || !hasOnlyAllowedCharsSurname || !surnameWords.every(word => nameRegex.test(word))) {
            const errorMsg = 'Errore: Il campo Cognome è obbligatorio e deve contenere solo lettere (incluse accentate), spazi e apostrofi (senza numeri, punti o altri simboli).';
            if (surnameErrorDiv) {
                surnameErrorDiv.textContent = errorMsg;
                surnameErrorDiv.style.display = 'block';
            }
            surnameInput.setAttribute('aria-invalid', 'true');
            showError(errorMsg);
            surnameInput.focus();
            return;
        }

        if (surnameWords.some(word => forbiddenWords.includes(word.toLowerCase()))) {
            const errorMsg = 'Errore: Il campo Cognome non è valido.';
            if (surnameErrorDiv) {
                surnameErrorDiv.textContent = errorMsg;
                surnameErrorDiv.style.display = 'block';
            }
            surnameInput.setAttribute('aria-invalid', 'true');
            showError(errorMsg);
            surnameInput.focus();
            return;
        }

        // Validazione Telefono: obbligatorio, cifre, spazi e prefisso + opzionale, minimo 8 cifre
        const digitCount = phoneVal.replace(/\D/g, '').length;
        const phoneRegex = /^\+?[\d\s]{8,25}$/;
        if (phoneVal === '' || !phoneRegex.test(phoneVal) || digitCount < 8) {
            const errorMsg = 'Errore: Il campo Telefono è obbligatorio e deve contenere un numero valido (cifre, spazi e prefisso + opzionale, minimo 8 cifre).';
            if (phoneErrorDiv) {
                phoneErrorDiv.textContent = errorMsg;
                phoneErrorDiv.style.display = 'block';
            }
            phoneInput.setAttribute('aria-invalid', 'true');
            showError(errorMsg);
            phoneInput.focus();
            return;
        }

        // Validazione email: formato valido (con @ e un dominio con punto)
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(emailVal)) {
            showError("Errore: Inserisci un indirizzo email valido (es. utente@esempio.it).");
            emailInput.focus();
            return;
        }

        // Validazione Orario di arrivo
        if (!orarioVal) {
            showError("Errore: Seleziona un orario indicativo di arrivo.");
            orarioArrivalSelect.focus();
            return;
        }

        // Validazione Note (facoltativo, ma se inserito filtra parolacce)
        if (noteVal !== '') {
            const noteWords = noteVal.split(/\s+/);
            if (noteWords.some(word => forbiddenWords.includes(word.toLowerCase()))) {
                const errorMsg = 'Errore: Il campo Note contiene termini non consentiti.';
                if (noteErrorDiv) {
                    noteErrorDiv.textContent = errorMsg;
                    noteErrorDiv.style.display = 'block';
                }
                noteInput.setAttribute('aria-invalid', 'true');
                showError(errorMsg);
                noteInput.focus();
                return;
            }
        }

        // Validazione Privacy
        if (!privacyCheckbox.checked) {
            showError("Errore: È necessario accettare l'informativa sulla Privacy e i Termini di Soggiorno per procedere.");
            privacyCheckbox.focus();
            return;
        }

        const calcResult = calculatePrice();
        if (!calcResult || calcResult.nights <= 0) {
            showError('Errore: La data di check-out deve essere successiva alla data di check-in.');
            return;
        }

        // Controllo sovrapposizione date per la stessa camera
        const existingBookings = JSON.parse(localStorage.getItem('bb_bookings')) || [];
        const hasOverlap = existingBookings.some(b => {
            if (b.roomValue !== roomVal) return false;
            // Sovrapposizione se checkin esistente < checkout nuovo AND checkout esistente > checkin nuovo
            return b.checkin < checkoutVal && b.checkout > checkinVal;
        });

        if (hasOverlap) {
            showError('Errore: La camera selezionata risulta già prenotata nel periodo scelto. Scegli altre date o un\'altra camera.');
            return;
        }

        // Nascondi eventuali errori precedenti in caso di successo
        hideError();

        const bookingData = {
            id: 'BK-' + Math.floor(100000 + Math.random() * 900000),
            roomName: roomSelect.options[roomSelect.selectedIndex].text,
            roomValue: roomVal,
            guests: guestsSelect.value,
            checkin: checkinVal,
            checkout: checkoutVal,
            nights: calcResult.nights,
            pricePerNight: calcResult.pricePerNight,
            totalPrice: calcResult.total,
            guestNome: nameVal,
            guestCognome: surnameVal,
            guestTelefono: phoneVal,
            guestName: `${nameVal} ${surnameVal}`,
            guestEmail: emailVal,
            orarioArrivo: orarioVal,
            note: noteVal,
            createdAt: new Date().toLocaleString()
        };

        // Salva nel localStorage
        let bookings = JSON.parse(localStorage.getItem('bb_bookings')) || [];
        bookings.push(bookingData);
        localStorage.setItem('bb_bookings', JSON.stringify(bookings));

        // Mostra il riepilogo a schermo
        let noteSummaryHtml = bookingData.note ? `<p><strong>Note o richieste:</strong> ${bookingData.note}</p>` : '';
        summaryContent.innerHTML = `
            <p><strong>Codice Prenotazione:</strong> ${bookingData.id}</p>
            <p><strong>Nome:</strong> ${bookingData.guestNome}</p>
            <p><strong>Cognome:</strong> ${bookingData.guestCognome}</p>
            <p><strong>Telefono:</strong> ${bookingData.guestTelefono}</p>
            <p><strong>Email:</strong> ${bookingData.guestEmail}</p>
            <p><strong>Camera:</strong> ${bookingData.roomName}</p>
            <p><strong>Ospiti:</strong> ${bookingData.guests}</p>
            <p><strong>Orario Arrivo:</strong> ${bookingData.orarioArrivo}</p>
            ${noteSummaryHtml}
            <p><strong>Periodo:</strong> Dal ${bookingData.checkin} al ${bookingData.checkout} (${bookingData.nights} notti)</p>
            <p><strong>Totale Pagato / Dovuto:</strong> <span style="color: #27ae60; font-weight: bold; font-size: 1.1rem;">€${bookingData.totalPrice}</span></p>
            <p style="margin-top: 10px; font-style: italic; color: #555;">Una email di conferma è stata inviata a ${bookingData.guestEmail}.</p>
        `;
        bookingSummaryBox.style.display = 'block';

        // Aggiorna la lista dello storico salvato
        renderSavedBookings();

        // Scroll al riepilogo
        bookingSummaryBox.scrollIntoView({ behavior: 'smooth' });

        // Reset del form e del box calcolo
        bookingForm.reset();
        priceCalcBox.style.display = 'none';
    });

    // Bottone per cancellare le prenotazioni dal localStorage
    clearStorageBtn.addEventListener('click', () => {
        if (confirm('Sei sicuro di voler cancellare tutte le prenotazioni salvate in localStorage?')) {
            localStorage.removeItem('bb_bookings');
            renderSavedBookings();
            bookingSummaryBox.style.display = 'none';
            alert('Storico prenotazioni cancellato con successo.');
        }
    });
});

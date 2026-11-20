document.addEventListener('DOMContentLoaded', () => {
    const bookingForm = document.getElementById('booking-form');
    const roomSelect = document.getElementById('stanza');
    const checkinInput = document.getElementById('checkin');
    const checkoutInput = document.getElementById('checkout');
    const guestsSelect = document.getElementById('ospiti');
    const nameInput = document.getElementById('nome');
    const emailInput = document.getElementById('email');

    const priceCalcBox = document.getElementById('price-calculation-box');
    const calcNights = document.getElementById('calc-nights');
    const calcNightlyPrice = document.getElementById('calc-nightly-price');
    const calcTotal = document.getElementById('calc-total');

    const bookingSummaryBox = document.getElementById('booking-summary-box');
    const summaryContent = document.getElementById('summary-content');
    const formErrorBox = document.getElementById('form-error-box');
    const nameErrorDiv = document.getElementById('nome-error');

    function showError(message) {
        formErrorBox.textContent = message;
        formErrorBox.style.display = 'block';
        formErrorBox.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }

    function hideNameError() {
        if (nameErrorDiv) {
            nameErrorDiv.textContent = '';
            nameErrorDiv.style.display = 'none';
        }
        nameInput.removeAttribute('aria-invalid');
    }

    function hideError() {
        formErrorBox.textContent = '';
        formErrorBox.style.display = 'none';
        hideNameError();
    }

    // Nascondi l'errore quando l'utente modifica qualsiasi campo del form
    bookingForm.addEventListener('input', hideError);
    bookingForm.addEventListener('change', hideError);

    const bookRoomButtons = document.querySelectorAll('.book-room-btn');
    const clearStorageBtn = document.getElementById('clear-storage-btn');
    const savedBookingsContainer = document.getElementById('saved-bookings-container');

    // Filtri Stanze
    const filterButtons = document.querySelectorAll('.filter-btn');
    const roomCards = document.querySelectorAll('.room-card');

    filterButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            filterButtons.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

            const filterValue = btn.getAttribute('data-filter');

            roomCards.forEach(card => {
                if (filterValue === 'all') {
                    card.style.display = 'flex';
                } else {
                    const category = card.getAttribute('data-category');
                    const priceRange = card.getAttribute('data-price-range');
                    if (category === filterValue || priceRange === filterValue) {
                        card.style.display = 'flex';
                    } else {
                        card.style.display = 'none';
                    }
                }
            });
        });
    });

    // Imposta la data minima di check-in a oggi
    const today = new Date().toISOString().split('T')[0];
    checkinInput.min = today;

    // Funzione per visualizzare lo storico delle prenotazioni salvate nel localStorage
    function renderSavedBookings() {
        const bookings = JSON.parse(localStorage.getItem('bb_bookings')) || [];
        if (bookings.length === 0) {
            savedBookingsContainer.innerHTML = '<p style="color: #777; font-style: italic; text-align: center;">Nessuna prenotazione salvata in localStorage.</p>';
            return;
        }

        let html = '<h4 style="margin-bottom: 10px; color: #4a3b32;">Storico Prenotazioni Salvate (' + bookings.length + '):</h4>';
        bookings.forEach((b, index) => {
            html += `
                <div class="saved-booking-item">
                    <p><strong>#${index + 1} - Codice:</strong> ${b.id}</p>
                    <p><strong>Ospite:</strong> ${b.guestName} (${b.guestEmail})</p>
                    <p><strong>Camera:</strong> ${b.roomName}</p>
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
            checkoutInput.min = nextDay.toISOString().split('T')[0];
        }
        calculatePrice();
    });

    checkinInput.addEventListener('change', () => {
        const checkinVal = new Date(checkinInput.value);
        const nextDay = new Date(checkinVal);
        nextDay.setDate(nextDay.getDate() + 1);
        const nextDayStr = nextDay.toISOString().split('T')[0];
        
        checkoutInput.min = nextDayStr;
        if (checkoutInput.value && checkoutInput.value < nextDayStr) {
            checkoutInput.value = nextDayStr;
        }
        calculatePrice();
    });

    checkoutInput.addEventListener('change', calculatePrice);

    // Invio del form
    bookingForm.addEventListener('submit', (e) => {
        e.preventDefault();

        const nameVal = nameInput.value.trim();
        const emailVal = emailInput.value.trim();
        const roomVal = roomSelect.value;
        const checkinVal = checkinInput.value;
        const checkoutVal = checkoutInput.value;

        // Validazione Nome e Cognome: obbligatorio, solo lettere (incluse accentate), spazi e apostrofi (niente numeri, punti, trattini o altri simboli)
        const nameRegex = /^[A-Za-zÀ-ÿ']+$/;
        const nameWords = nameVal.split(/\s+/);
        const hasOnlyAllowedChars = /^[A-Za-zÀ-ÿ' ]+$/.test(nameVal);

        if (nameVal === '' || !hasOnlyAllowedChars || nameWords.length < 2 || !nameWords.every(word => nameRegex.test(word))) {
            const errorMsg = 'Errore: Il campo Nome e Cognome è obbligatorio e deve contenere solo lettere (incluse accentate), spazi e apostrofi (es. Mario Rossi, senza numeri, punti o altri simboli).';
            if (nameErrorDiv) {
                nameErrorDiv.textContent = errorMsg;
                nameErrorDiv.style.display = 'block';
            }
            nameInput.setAttribute('aria-invalid', 'true');
            showError(errorMsg);
            nameInput.focus();
            return;
        }

        // Filtro parolacce/insulti (parole intere, case-insensitive)
        const forbiddenWords = ['cazzo', 'merda', 'stronzo', 'stronza', 'vaffanculo', 'idiota', 'cretino', 'imbecille', 'puttana', 'troia', 'bastardo', 'bastarda', 'coglione', 'pirla', 'minchia'];
        if (nameWords.some(word => forbiddenWords.includes(word.toLowerCase()))) {
            const errorMsg = 'Errore: Il campo Nome e Cognome è obbligatorio e deve contenere solo lettere (incluse accentate), spazi e apostrofi (es. Mario Rossi, senza numeri, punti o altri simboli).';
            if (nameErrorDiv) {
                nameErrorDiv.textContent = errorMsg;
                nameErrorDiv.style.display = 'block';
            }
            nameInput.setAttribute('aria-invalid', 'true');
            showError(errorMsg);
            nameInput.focus();
            return;
        }

        // Validazione Capienza Massima Ospiti per la camera scelta
        const selectedOption = roomSelect.options[roomSelect.selectedIndex];
        const maxGuests = parseInt(selectedOption.getAttribute('data-max-guests'), 10) || 2;
        const selectedGuests = parseInt(guestsSelect.value, 10);

        if (selectedGuests > maxGuests) {
            showError(`Errore: La camera selezionata (${selectedOption.text}) ha una capienza massima di ${maxGuests} ospiti. Non puoi selezionare ${selectedGuests} ospiti.`);
            return;
        }

        // Validazione email: formato valido (con @ e un dominio con punto)
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(emailVal)) {
            showError("Errore: Inserisci un indirizzo email valido (es. utente@esempio.it).");
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
            guestName: nameVal,
            guestEmail: emailVal,
            createdAt: new Date().toLocaleString()
        };

        // Salva nel localStorage
        let bookings = JSON.parse(localStorage.getItem('bb_bookings')) || [];
        bookings.push(bookingData);
        localStorage.setItem('bb_bookings', JSON.stringify(bookings));

        // Mostra il riepilogo a schermo
        summaryContent.innerHTML = `
            <p><strong>Codice Prenotazione:</strong> ${bookingData.id}</p>
            <p><strong>Intestatario:</strong> ${bookingData.guestName} (${bookingData.guestEmail})</p>
            <p><strong>Camera:</strong> ${bookingData.roomName}</p>
            <p><strong>Ospiti:</strong> ${bookingData.guests}</p>
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

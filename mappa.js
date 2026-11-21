document.addEventListener('DOMContentLoaded', () => {
    const mapBtns = document.querySelectorAll('.map-btn[data-route]');
    const routePaths = document.querySelectorAll('.route-path');
    const routeInfo = document.getElementById('route-info');

    const routeData = {
        stazione: {
            title: "Percorso: Dalla Stazione Treni",
            time: "Circa 12 minuti a piedi oppure 2 fermate con la linea autobus urbana.",
            description: "Dalla Stazione Centrale, procedere dritto lungo Corso Storico fino a Via Esempio 12."
        },
        porto: {
            title: "Percorso: Dal Porto",
            time: "Circa 15 minuti in taxi dal Molo principale o collegamento diretto con navetta portuale.",
            description: "Dal Molo principale, risalire lungo la dorsale costiera e imboccare Via Esempio 12."
        },
        aeroporto: {
            title: "Percorso: Dall'Aeroporto",
            time: "Circa 25-30 minuti tramite navetta aeroportuale fino al centro e breve tratto a piedi.",
            description: "Dall'aeroporto prendere la navetta fino al terminal centrale, quindi proseguire a piedi per 5 minuti."
        }
    };

    function setActiveRoute(routeKey) {
        mapBtns.forEach(btn => {
            if (btn.getAttribute('data-route') === routeKey) {
                btn.classList.add('active-route');
                btn.setAttribute('aria-pressed', 'true');
            } else {
                btn.classList.remove('active-route');
                btn.setAttribute('aria-pressed', 'false');
            }
        });

        routePaths.forEach(path => {
            if (path.id === `route-${routeKey}`) {
                path.classList.add('active-path');
                path.style.opacity = '1';
                path.style.strokeWidth = '5';
            } else {
                path.classList.remove('active-path');
                path.style.opacity = '0.3';
                path.style.strokeWidth = '2';
            }
        });

        if (routeData[routeKey]) {
            const data = routeData[routeKey];
            routeInfo.innerHTML = `
                <h3>${data.title}</h3>
                <p><strong>Tempo stimato:</strong> ${data.time}</p>
                <p><strong>Tragitto:</strong> ${data.description}</p>
            `;
        }
    }

    function resetMap() {
        mapBtns.forEach(btn => {
            btn.classList.remove('active-route');
            btn.setAttribute('aria-pressed', 'false');
        });
        routePaths.forEach(path => {
            path.classList.remove('active-path');
            path.style.opacity = '0.8';
            path.style.strokeWidth = '3.5';
        });
        routeInfo.innerHTML = `
            <h3>Mappa Interattiva - Panoramica</h3>
            <p><strong>Stato:</strong> Seleziona uno dei pulsanti sopra ("Dalla Stazione", "Dal Porto", "Dall'Aeroporto") per evidenziare il percorso specifico verso il B&B DEMO.</p>
        `;
    }

    mapBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const route = btn.getAttribute('data-route');
            if (btn.classList.contains('active-route')) {
                resetMap();
            } else {
                setActiveRoute(route);
            }
        });
    });
});

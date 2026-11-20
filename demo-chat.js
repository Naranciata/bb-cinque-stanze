document.addEventListener('DOMContentLoaded', function () {
    const toggleBtn = document.getElementById('demo-chat-toggle');
    const panel = document.getElementById('demo-chat-panel');
    const closeBtn = document.getElementById('demo-chat-close');

    if (!toggleBtn || !panel || !closeBtn) return;

    function togglePanel(e) {
        e.stopPropagation();
        const isOpen = panel.classList.toggle('open');
        panel.setAttribute('aria-hidden', !isOpen);
        toggleBtn.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
    }

    function closePanel() {
        panel.classList.remove('open');
        panel.setAttribute('aria-hidden', 'true');
        toggleBtn.setAttribute('aria-expanded', 'false');
    }

    toggleBtn.addEventListener('click', togglePanel);
    closeBtn.addEventListener('click', closePanel);

    // Chiudi il pannello cliccando all'esterno del widget
    document.addEventListener('click', function (e) {
        const widget = document.getElementById('demo-chat-widget');
        if (widget && !widget.contains(e.target)) {
            closePanel();
        }
    });

    // Chiudi con il tasto Escape
    document.addEventListener('keydown', function (e) {
        if (e.key === 'Escape') {
            closePanel();
        }
    });
});

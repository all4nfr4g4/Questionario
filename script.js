document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('questionarioForm');
    if (!form) return;

    function validateEmail(email) {
        const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return re.test(email);
    }

    form.addEventListener('submit', function(e) {
        e.preventDefault();

        const email = form.querySelector('#email')?.value || '';
        const telefone = form.querySelector('#telefone')?.value || '';

        if (!validateEmail(email)) {
            alert('Por favor, insira um e‑mail válido.');
            return;
        }

        const btn = form.querySelector('button[type="submit"]');
        const original = btn ? btn.textContent : '';
        if (btn) { btn.disabled = true; btn.textContent = 'Enviando...'; }

        fetch('enviar.php', {
            method: 'POST',
            body: new FormData(form)
        })
        .then(r => r.json())
        .then(res => {
            alert(res.message || (res.success ? 'Enviado.' : 'Erro ao enviar.'));
            if (res.success) form.reset();
        })
        .catch(() => {
            alert('Erro ao conectar com o servidor.');
        })
        .finally(() => {
            if (btn) { btn.disabled = false; btn.textContent = original; }
        });
    });
});
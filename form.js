// form.js
// Wysyła formularz do Formspree i pokazuje status.
// Upewnij się, że endpoint jest poprawny (zamień xqebvvow na swoje ID jeśli trzeba).

const form = document.getElementById('bspForm');
const statusDiv = document.getElementById('status');

if (form) {
  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    // Prosta walidacja front-end
    const contact = document.getElementById('contact').value.trim();
    const location = document.getElementById('location').value.trim();
    const description = document.getElementById('description').value.trim();

    if (!contact || !location || !description) {
      statusDiv.textContent = 'Uzupełnij pola oznaczone gwiazdką.';
      statusDiv.style.color = '#b91c1c';
      return;
    }

    // Honeypot check
    const gotcha = form.querySelector('input[name="_gotcha"]');
    if (gotcha && gotcha.value) {
      // prawdopodobnie bot
      statusDiv.textContent = 'Wysłano.';
      return;
    }

    statusDiv.style.color = '#374151';
    statusDiv.textContent = 'Wysyłanie...';

    const formData = new FormData(form);

    try {
      const res = await fetch('https://formspree.io/f/xqebvvow', {
        method: 'POST',
        body: formData,
        headers: { 'Accept': 'application/json' }
      });

      if (res.ok) {
        statusDiv.style.color = '#065f46';
        statusDiv.textContent = 'Zgłoszenie wysłane! Dziękuję.';
        form.reset();
      } else {
        // Spróbuj odczytać odpowiedź JSON z błędem
        let msg = 'Błąd przy wysyłce zgłoszenia.';
        try {
          const data = await res.json();
          if (data && data.error) msg = data.error;
        } catch (err) { /* ignore */ }
        statusDiv.style.color = '#b91c1c';
        statusDiv.textContent = msg;
      }
    } catch (err) {
      statusDiv.style.color = '#b91c1c';
      statusDiv.textContent = 'Błąd sieci. Spróbuj ponownie.';
      console.error('Form submit error:', err);
    }
  });
}

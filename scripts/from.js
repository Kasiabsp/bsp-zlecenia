// scripts/form.js
document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('bspForm');
  const status = document.getElementById('status');
  if (!form) return;

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    status.textContent = 'Wysyłanie...';
    const data = new FormData(form);
    try {
      const res = await fetch(form.action, {
        method: 'POST',
        body: data,
        headers: { 'Accept': 'application/json' }
      });
      if (res.ok) {
        status.textContent = 'Dziękujemy — zgłoszenie wysłane.';
        form.reset();
      } else {
        const json = await res.json().catch(()=>null);
        status.textContent = json && json.error ? 'Błąd: ' + json.error : 'Wystąpił błąd przy wysyłce.';
      }
    } catch (err) {
      console.error('Form submit error:', err);
      status.textContent = 'Błąd sieci — spróbuj ponownie.';
    }
  });
});

const form = document.getElementById('bspForm');
const statusDiv = document.getElementById('status');

form.addEventListener('submit', async (e) => {
  e.preventDefault();

  // Walidacja rozmiaru plików
  const files = document.getElementById('pliki').files;
  let totalSize = 0;
  for (let i = 0; i < files.length; i++) totalSize += files[i].size;
  if (totalSize > 50 * 1024 * 1024) {
    alert("Łączny rozmiar plików nie może przekroczyć 50 MB.");
    return;
  }

  // Wysyłanie formularza do Formspree (darmowy)
  const formData = new FormData(form);

  try {
    const response = await fetch('https://formspree.io/f/<xqebvvow>', {
      method: 'POST',
      body: formData,
      headers: { 'Accept': 'application/json' }
    });

    if (response.ok) {
      statusDiv.innerHTML = "Zgłoszenie wysłane!";
      form.reset();
    } else {
      statusDiv.innerHTML = "Błąd przy wysyłce zgłoszenia.";
    }
  } catch (err) {
    statusDiv.innerHTML = "Błąd sieci. Spróbuj ponownie.";
  }
});

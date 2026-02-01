const form = document.getElementById('bspForm');
const statusDiv = document.getElementById('status');

form.addEventListener('submit', async (e) => {
  e.preventDefault();

  statusDiv.textContent = "Wysyłanie...";

  const formData = new FormData(form);

  try {
    const response = await fetch("https://formspree.io/f/xqebvvow", {
      method: "POST",
      body: formData,
      headers: { "Accept": "application/json" }
    });

    if (response.ok) {
      statusDiv.textContent = "Zgłoszenie wysłane!";
      form.reset();
    } else {
      statusDiv.textContent = "Błąd przy wysyłce zgłoszenia.";
    }
  } catch (err) {
    statusDiv.textContent = "Błąd sieci. Spróbuj ponownie.";
  }
});

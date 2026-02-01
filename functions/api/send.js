export async function onRequestPost(context) {
  const { request } = context;

  const data = await request.json();

  const emailTo = "twoj-email@example.com"; // ← TU WSTAW SWÓJ MAIL

  const message = `
Nowe zgłoszenie BSP:

Kontakt: ${data.contact}
Lokalizacja: ${data.location}
Opis: ${data.description}
Termin: ${data.date}
Budżet: ${data.budget}
  `;

  const response = await fetch("https://api.mailchannels.net/tx/v1/send", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      personalizations: [{ to: [{ email: emailTo }] }],
      from: { email: "no-reply@bsp-zlecenia.pages.dev" },
      subject: "Nowe zgłoszenie BSP",
      content: [{ type: "text/plain", value: message }]
    })
  });

  if (!response.ok) {
    return new Response("Mail error", { status: 500 });
  }

  return new Response("OK", { status: 200 });
}

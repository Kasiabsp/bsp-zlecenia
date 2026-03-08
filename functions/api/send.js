export async function onRequestPost(context) {
  const { request } = context;

  let data;
  try {
    data = await request.json();
  } catch (e) {
    return new Response("Invalid JSON", { status: 400 });
  }

  const emailTo = "jakubsoperatorbsp@gmail.com";

  const message = `
Nowe zgłoszenie BSP:

Kontakt: ${data.contact || "brak"}
Lokalizacja: ${data.location || "brak"}
Opis: ${data.description || "brak"}
Termin: ${data.date || "brak"}
Budżet: ${data.budget || "brak"}
  `;

  const payload = {
    personalizations: [
      {
        to: [{ email: emailTo }],
        reply_to: [{ email: data.contact || emailTo }]
      }
    ],
    from: {
      email: "no-reply@bsp-zlecenia.pages.dev",
      name: "Formularz BSP"
    },
    subject: "Nowe zgłoszenie BSP",
    content: [
      {
        type: "text/plain",
        value: message
      }
    ]
  };

  const response = await fetch("https://api.mailchannels.net/tx/v1/send", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload)
  });

  if (!response.ok) {
    const errorText = await response.text();
    return new Response(
      JSON.stringify({ status: "error", details: errorText }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" }
      }
    );
  }

  return new Response(JSON.stringify({ status: "ok" }), {
    status: 200,
    headers: { "Content-Type": "application/json" }
  });
}

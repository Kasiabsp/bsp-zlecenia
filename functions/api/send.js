export async function onRequestPost(context) {
  const { request } = context;

  let data;
  try { data = await request.json(); } catch {
    return new Response(JSON.stringify({ status: "error", details: "Invalid JSON" }), { status: 400, headers: { "Content-Type": "application/json" } });
  }

  const contact = (data.contact || "").trim();
  const description = (data.description || "").trim();
  if (!contact || !description) {
    return new Response(JSON.stringify({ status: "error", details: "Brak wymaganych pól" }), { status: 400, headers: { "Content-Type": "application/json" } });
  }

  const formspreeEndpoint = "https://formspree.io/f/xqebvvow"; // <-- zamień na swój endpoint

  const payload = {
    contact,
    description,
    date: data.date || "",
    budget: data.budget || ""
  };

  try {
    const res = await fetch(formspreeEndpoint, {
      method: "POST",
      headers: { "Content-Type": "application/json", "Accept": "application/json" },
      body: JSON.stringify(payload)
    });

    const json = await res.json().catch(() => null);

    if (!res.ok) {
      return new Response(JSON.stringify({ status: "error", httpStatus: res.status, details: json || await res.text() }), { status: 500, headers: { "Content-Type": "application/json" } });
    }

    return new Response(JSON.stringify({ status: "ok" }), { status: 200, headers: { "Content-Type": "application/json" } });
  } catch (err) {
    return new Response(JSON.stringify({ status: "error", details: String(err) }), { status: 502, headers: { "Content-Type": "application/json" } });
  }
}

export async function onRequestPost(context) {
  const { request } = context;

  let data;
  try {
    data = await request.json();
  } catch {
    return new Response(
      JSON.stringify({ status: "error", details: "Invalid JSON" }),
      { status: 400 }
    );
  }

  // Pobranie pól
  const contact = (data.contact || "").trim();
  const description = (data.description || "").trim();
  const location = (data.location || "").trim();

  // Walidacja podstawowa
  if (!contact || !description) {
    return new Response(
      JSON.stringify({ status: "error", details: "Brak wymaganych pól" }),
      { status: 400 }
    );
  }

  // Payload rozszerzony o wszystkie dane z formularza
  const payload = {
    contact,
    description,
    location,
    date: data.date || "",
    budget: data.budget || "",
    estimated_price: data.estimated_price || "",
    location_lat: data.location_lat || "",
    location_lng: data.location_lng || "",
    service_type: data.service_type || "",
    area_ha: data.area_ha || "",
    flights_estimated: data.flights_estimated || "",
    extras_list: data.extras_list || ""
  };

  try {
    const res = await fetch("https://formspree.io/f/xqebvvow", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Accept": "application/json"
      },
      body: JSON.stringify(payload)
    });

    if (!res.ok) {
      return new Response(
        JSON.stringify({ status: "error", details: "Formspree error" }),
        { status: 500 }
      );
    }

    return new Response(
      JSON.stringify({ status: "ok" }),
      { status: 200 }
    );

  } catch (err) {
    return new Response(
      JSON.stringify({ status: "error", details: String(err) }),
      { status: 502 }
    );
  }
}

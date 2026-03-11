export async function onRequestPost(context) {
  const { request } = context;

  let data;
  try { data = await request.json(); }
  catch { return new Response(JSON.stringify({ status:"error", details:"Invalid JSON" }), { status:400 }); }

  const contact = (data.contact || "").trim();
  const description = (data.description || "").trim();
  const location = (data.location || "").trim();

  if (!contact || !description) {
    return new Response(JSON.stringify({ status:"error", details:"Brak wymaganych pól" }), { status:400 });
  }

  const payload = {
    contact,
    description,
    location,
    date: data.date || "",
    budget: data.budget || ""
  };

  try {
    const res = await fetch("https://formspree.io/f/xqebvvow", {
      method:"POST",
      headers:{ "Content-Type":"application/json", "Accept":"application/json" },
      body: JSON.stringify(payload)
    });

    if (!res.ok) return new Response(JSON.stringify({ status:"error" }), { status:500 });

    return new Response(JSON.stringify({ status:"ok" }), { status:200 });

  } catch (err) {
    return new Response(JSON.stringify({ status:"error", details:String(err) }), { status:502 });
  }
}

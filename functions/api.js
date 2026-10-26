export async function onRequest(context) {
  try {
    // W Cloudflare Pages baza danych znajduje się w 'context.env.DB'
    const { results } = await context.env.DB.prepare("SELECT * FROM Uzytkownicy").all();

    return new Response(JSON.stringify(results), {
      headers: { 
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*" 
      },
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), { 
      status: 500,
      headers: { "Content-Type": "application/json" }
    });
  }
}

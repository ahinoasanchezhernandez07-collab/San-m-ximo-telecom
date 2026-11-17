const ALLOWED_ORIGINS = new Set([
  "https://ahinoasanchezhernandez07-collab.github.io",
  "http://localhost:8000",
  "http://127.0.0.1:8000"
]);

const SYSTEM_INSTRUCTION = `Eres Maxi, el asistente virtual de San Máximo Telecom.
Responde siempre en español, de forma clara, cercana y útil.
Ayudas con fibra, móvil, servicios para empresas, energía, lectura orientativa de facturas, comparaciones de ofertas y tiendas.
No inventes precios, promociones, cobertura, horarios, disponibilidad, condiciones, descuentos ni datos de clientes. Si no conoces un dato actualizado, dilo y explica qué dato habría que confirmar.
No afirmes que has contratado, enviado formularios, consultado sistemas internos o comprobado cobertura si no lo has hecho.
Para comparar ofertas, pide precio, duración de promoción, precio posterior, instalación y permanencia; explica los costes según los datos facilitados.
La lectura de facturas de la web se realiza en el navegador; nunca pidas al usuario que comparta datos personales, números completos de cuenta, DNI o información sensible.
No solicites contraseñas ni claves. Si una pregunta queda fuera de telecomunicaciones o energía, responde brevemente y vuelve a ofrecer ayuda relacionada.
La web incluye herramientas de comparación, cálculo de luz y analizador de facturas; guía al usuario indicando el nombre del apartado.
No digas que eres una persona. Eres una IA conversacional llamada Maxi.`;

function json(data, status, origin) {
  return new Response(JSON.stringify(data), {
    status,
    headers: {
      "Content-Type": "application/json; charset=utf-8",
      "Cache-Control": "no-store",
      "Access-Control-Allow-Origin": origin || "https://ahinoasanchezhernandez07-collab.github.io",
      "Vary": "Origin"
    }
  });
}

export default {
  async fetch(request, env) {
    const origin = request.headers.get("Origin") || "";
    if (request.method === "OPTIONS") {
      if (!ALLOWED_ORIGINS.has(origin)) return new Response(null, { status: 403 });
      return new Response(null, {
        status: 204,
        headers: {
          "Access-Control-Allow-Origin": origin,
          "Access-Control-Allow-Methods": "POST, OPTIONS",
          "Access-Control-Allow-Headers": "Content-Type",
          "Access-Control-Max-Age": "86400",
          "Vary": "Origin"
        }
      });
    }

    const url = new URL(request.url);
    if (url.pathname !== "/api/chat") return json({ error: "Ruta no encontrada." }, 404, origin);
    if (request.method !== "POST") return json({ error: "Método no permitido." }, 405, origin);
    if (!ALLOWED_ORIGINS.has(origin)) return json({ error: "Origen no autorizado." }, 403, origin);
    if (!env.GEMINI_API_KEY) return json({ error: "Falta configurar la clave privada de IA en el servidor." }, 503, origin);

    let body;
    try { body = await request.json(); }
    catch { return json({ error: "La solicitud no contiene JSON válido." }, 400, origin); }

    if (!Array.isArray(body.messages) || body.messages.length === 0 || body.messages.length > 20) {
      return json({ error: "Envía una conversación de hasta 20 mensajes." }, 400, origin);
    }

    const contents = [];
    for (const message of body.messages) {
      if (!message || !["user", "model"].includes(message.role) || typeof message.text !== "string") continue;
      const text = message.text.trim().slice(0, 3000);
      if (text) contents.push({ role: message.role, parts: [{ text }] });
    }
    if (!contents.length || contents[contents.length - 1].role !== "user") {
      return json({ error: "No se ha recibido una pregunta válida." }, 400, origin);
    }

    try {
      const upstream = await fetch("https://generativelanguage.googleapis.com/v1beta/models/gemini-3.8-flash:generateContent", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-goog-api-key": env.GEMINI_API_KEY
        },
        body: JSON.stringify({
          system_instruction: { parts: [{ text: SYSTEM_INSTRUCTION }] },
          contents,
          generationConfig: { temperature: 0.55, maxOutputTokens: 700 }
        })
      });

      const result = await upstream.json();
      if (!upstream.ok) {
        console.error("Gemini API error", upstream.status, result?.error?.status || "unknown");
        return json({ error: "El servicio de IA no ha podido responder. Inténtalo de nuevo más tarde." }, 502, origin);
      }
      const answer = (result.candidates?.[0]?.content?.parts || [])
        .map(part => part.text || "")
        .join("\n")
        .trim();
      if (!answer) return json({ error: "La IA no ha generado una respuesta. Prueba a reformular la pregunta." }, 502, origin);
      return json({ answer }, 200, origin);
    } catch (error) {
      console.error("Maxi backend error", error?.name || "Error");
      return json({ error: "No se ha podido conectar con el servicio de IA." }, 502, origin);
    }
  }
};

import type { APIRoute } from 'astro';

// Forzar que esta ruta siempre corra en el servidor, nunca prerenderizada
export const prerender = false;

export const POST: APIRoute = async ({ request }) => {
  let text: string;

  try {
    // arrayBuffer es más confiable que text() en el adaptador Node standalone
    const buffer = await request.arrayBuffer();
    text = new TextDecoder().decode(buffer);
  } catch (err) {
    console.error('[demo API] Error leyendo body:', err);
    return json({ ok: false, message: 'No se pudo leer la petición.' }, 400);
  }

  if (!text || text.trim() === '') {
    console.warn('[demo API] Body vacío recibido. Headers:', Object.fromEntries(request.headers));
    return json({ ok: false, message: 'La petición llegó vacía.' }, 400);
  }

  let data: {
    nombre?: string;
    empresa?: string;
    whatsapp?: string;
    email?: string;
    mensaje?: string;
  };

  try {
    data = JSON.parse(text);
  } catch {
    console.error('[demo API] JSON inválido:', text);
    return json({ ok: false, message: 'JSON inválido.' }, 400);
  }

  if (!data.nombre || !data.empresa || !data.whatsapp || !data.email) {
    return json({ ok: false, message: 'Faltan campos requeridos.' }, 400);
  }

  const apiKey = import.meta.env.RESEND_API_KEY;

  if (!apiKey) {
    console.log('[demo API] Mock mode — lead recibido:', data);
    return json({ ok: true, mock: true }, 200);
  }

  try {
    const { Resend } = await import('resend');
    const resend = new Resend(apiKey);

    await resend.emails.send({
      from: 'SmartOrders Landing <onboarding@resend.dev>',
      to: 'carloshumberto015@gmail.com',
      subject: `Nueva solicitud de demo — ${data.empresa}`,
      html: `
        <h2 style="color:#1e3a8a;">Nueva solicitud de demo</h2>
        <p><strong>Nombre:</strong> ${data.nombre}</p>
        <p><strong>Empresa:</strong> ${data.empresa}</p>
        <p><strong>WhatsApp:</strong> ${data.whatsapp}</p>
        <p><strong>Email:</strong> ${data.email}</p>
        <p><strong>Pedidos/día aprox:</strong> ${data.mensaje || 'No especificado'}</p>
      `,
    });

    console.log('[demo API] Email enviado para:', data.empresa);
    return json({ ok: true }, 200);
  } catch (err) {
    console.error('[demo API] Error al enviar email:', err);
    return json({ ok: false, message: 'Error al enviar el correo.' }, 500);
  }
};

// Helper para no repetir el header Content-Type en cada return
function json(data: unknown, status: number) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { 'Content-Type': 'application/json' },
  });
}

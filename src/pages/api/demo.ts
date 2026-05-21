import type { APIRoute } from 'astro';

export const POST: APIRoute = async ({ request }) => {
  try {
    const data = await request.json() as {
      nombre?: string;
      empresa?: string;
      whatsapp?: string;
      email?: string;
      mensaje?: string;
    };

    // Validate required fields
    if (!data.nombre || !data.empresa || !data.whatsapp || !data.email) {
      return new Response(
        JSON.stringify({ ok: false, message: 'Faltan campos requeridos.' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    const apiKey = import.meta.env.RESEND_API_KEY;

    // In development (no API key), return mock success
    if (!apiKey) {
      console.log('[demo API] Mock mode — would have sent:', data);
      return new Response(
        JSON.stringify({ ok: true, mock: true }),
        { status: 200, headers: { 'Content-Type': 'application/json' } }
      );
    }

    const { Resend } = await import('resend');
    const resend = new Resend(apiKey);

    await resend.emails.send({
      from: 'SmartOrders Landing <onboarding@resend.dev>',
      to: 'carloshumberto015@gmail.com',
      subject: `Nueva solicitud de demo — ${data.empresa}`,
      html: `
        <h2>Nueva solicitud de demo</h2>
        <p><strong>Nombre:</strong> ${data.nombre}</p>
        <p><strong>Empresa:</strong> ${data.empresa}</p>
        <p><strong>WhatsApp:</strong> ${data.whatsapp}</p>
        <p><strong>Email:</strong> ${data.email}</p>
        <p><strong>Pedidos/día aprox:</strong> ${data.mensaje || 'No especificado'}</p>
      `,
    });

    return new Response(
      JSON.stringify({ ok: true }),
      { status: 200, headers: { 'Content-Type': 'application/json' } }
    );
  } catch (err) {
    console.error('[demo API] Error:', err);
    return new Response(
      JSON.stringify({ ok: false, message: 'Error interno del servidor.' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
};

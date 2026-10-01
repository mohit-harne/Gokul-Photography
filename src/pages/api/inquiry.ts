import type { APIRoute } from 'astro';

export const prerender = false;

export const POST: APIRoute = async ({ request }) => {
  try {
    const data = await request.json();
    const { name, email, phone, date, location, service, details } = data;

    // Read variables safely with fallbacks
    const token = (
      import.meta.env.WHATSAPP_API_TOKEN ||
      (typeof process !== 'undefined' ? process.env?.WHATSAPP_API_TOKEN : '') ||
      ''
    ).trim();

    const phoneId = (
      import.meta.env.WHATSAPP_PHONE_NUMBER_ID ||
      (typeof process !== 'undefined' ? process.env?.WHATSAPP_PHONE_NUMBER_ID : '') ||
      '1371420829385051'
    ).trim();

    const recipient = (
      import.meta.env.RECIPIENT_PHONE_NUMBER ||
      (typeof process !== 'undefined' ? process.env?.RECIPIENT_PHONE_NUMBER : '') ||
      '918208032718'
    ).trim();

    console.log('[API inquiry] Token present:', Boolean(token), 'Length:', token.length);
    console.log('[API inquiry] Phone ID:', phoneId, 'Recipient:', recipient);

    if (!token) {
      console.error('[API inquiry] Error: WHATSAPP_API_TOKEN is missing or empty in .env');
      return new Response(
        JSON.stringify({ error: 'Missing WHATSAPP_API_TOKEN server configuration.' }),
        { status: 500, headers: { 'Content-Type': 'application/json' } }
      );
    }

    const messageText = 
`*New Booking Inquiry | Gokul Studios*
----------------------------------
*Names:* ${name || 'N/A'}
*Email:* ${email || 'N/A'}
*Phone:* ${phone || 'N/A'}
*Date:* ${date || 'N/A'}
*Location/Venue:* ${location || 'Not specified'}
*Service:* ${service || 'Not specified'}

*Event Details:*
${details || 'None provided'}
----------------------------------`;

    // Attempt 1: Send formatted direct text message
    let response = await fetch(`https://graph.facebook.com/v22.0/${phoneId}/messages`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        messaging_product: 'whatsapp',
        recipient_type: 'individual',
        to: recipient,
        type: 'text',
        text: {
          preview_url: false,
          body: messageText,
        },
      }),
    });

    let resJson = await response.json();
    console.log('[API inquiry] Direct text response:', resJson);

    // Attempt 2: If Meta blocks free-form text due to 24-hour window restriction, fallback to hello_world template
    if (!response.ok) {
      console.warn('[API inquiry] Plain text message rejected by Meta. Falling back to pre-approved template...');

      response = await fetch(`https://graph.facebook.com/v22.0/${phoneId}/messages`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          messaging_product: 'whatsapp',
          to: recipient,
          type: 'template',
          template: {
            name: 'hello_world',
            language: {
              code: 'en_US',
            },
          },
        }),
      });

      resJson = await response.json();
      console.log('[API inquiry] Fallback template response:', resJson);
    }

    if (!response.ok) {
      console.error('[API inquiry] Meta WhatsApp API final error:', resJson);
      return new Response(
        JSON.stringify({ error: resJson?.error?.message || 'Meta API rejected request' }),
        { status: 500, headers: { 'Content-Type': 'application/json' } }
      );
    }

    return new Response(
      JSON.stringify({ success: true, messageId: resJson.messages?.[0]?.id }),
      { status: 200, headers: { 'Content-Type': 'application/json' } }
    );
  } catch (err: any) {
    console.error('[API inquiry] Server Exception:', err);
    return new Response(
      JSON.stringify({ error: err.message || 'Internal server error.' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
};
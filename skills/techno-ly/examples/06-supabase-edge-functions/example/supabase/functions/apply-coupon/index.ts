// Educational quote calculator. No database and no purchase processing.
const ORIGINAL_PRICE = 100;
const COUPON = 'TAQNI20';
const DISCOUNT_RATE = 0.20;
const cors = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, apikey, content-type, x-client-info',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
};
const json = (body: unknown, status = 200) => Response.json(body, { status, headers: cors });

Deno.serve(async (req: Request) => {
  if (req.method === 'OPTIONS') return new Response(null, { status: 204, headers: cors });
  if (req.method !== 'POST') return json({ error: 'method_not_allowed' }, 405);
  let body: unknown;
  try { body = await req.json(); } catch { return json({ error: 'invalid_json' }, 400); }
  const code = typeof (body as { code?: unknown })?.code === 'string'
    ? (body as { code: string }).code.trim().toUpperCase() : '';
  // Prices and rates are read only from server-owned constants.
  if (code !== COUPON) {
    return json({ valid: false, error: 'invalid_coupon', originalPrice: ORIGINAL_PRICE,
      discount: 0, finalPrice: ORIGINAL_PRICE, currency: 'LYD' }, 400);
  }
  const discount = ORIGINAL_PRICE * DISCOUNT_RATE;
  return json({ valid: true, originalPrice: ORIGINAL_PRICE, discount,
    finalPrice: ORIGINAL_PRICE - discount, currency: 'LYD' });
});

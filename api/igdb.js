
export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  const body =
    typeof req.body === 'string'
      ? req.body
      : req.body
        ? JSON.stringify(req.body)
        : undefined;

  let igdbResponse;
  try {
    igdbResponse = await fetch('https://api.igdb.com/v4/games', {
      method: 'POST',
      headers: {
        'Client-ID': process.env.IGDB_CLIENT_ID,
        'Authorization': `Bearer ${process.env.IGDB_ACCESS_TOKEN}`,
        'Accept': 'application/json',
        'Content-Type': 'text/plain',
      },
      body,
    });
  } catch (err) {
    console.error('[IGDB Proxy] Fetch error:', err);
    return res.status(502).json({ error: 'Error al conectar con la API de IGDB' });
  }

  let data;
  try {
    data = await igdbResponse.json();
  } catch {
    return res.status(igdbResponse.status).json({ error: 'Respuesta inválida de IGDB' });
  }

  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Content-Type', 'application/json');
  return res.status(igdbResponse.status).json(data);
}

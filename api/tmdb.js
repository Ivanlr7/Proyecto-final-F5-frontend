export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  const { path, ...queryParams } = req.query;

  if (!path) {
    return res.status(400).json({ error: 'El parámetro "path" es obligatorio' });
  }

  // Construir la URL hacia TMDB inyectando la API key desde el entorno del servidor
  const tmdbUrl = new URL(`https://api.themoviedb.org/3${path}`);
  tmdbUrl.searchParams.set('api_key', process.env.TMDB_API_KEY);

  // Reenviar el resto de query params que llegaron del cliente (language, page, etc.)
  Object.entries(queryParams).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== '') {
      tmdbUrl.searchParams.set(key, value);
    }
  });

  let tmdbResponse;
  try {
    tmdbResponse = await fetch(tmdbUrl.toString());
  } catch (err) {
    console.error('[TMDB Proxy] Fetch error:', err);
    return res.status(502).json({ error: 'Error al conectar con la API de TMDB' });
  }

  let data;
  try {
    data = await tmdbResponse.json();
  } catch {
    return res.status(tmdbResponse.status).json({ error: 'Respuesta inválida de TMDB' });
  }

  res.setHeader('Content-Type', 'application/json');
  return res.status(tmdbResponse.status).json(data);
}

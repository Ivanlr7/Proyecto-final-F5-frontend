const IGDB_BASE_URL = '/api/igdb/v4'; 
const CLIENT_ID = import.meta.env.VITE_API_IGDB_CLIENT_ID;
const ACCESS_TOKEN = import.meta.env.VITE_API_IGDB_ACCESS_TOKEN; 

class VideogameRepository {
  async makeRequest(endpoint, body) {
    const response = await fetch(`${IGDB_BASE_URL}/${endpoint}`, {
      method: 'POST',
      headers: {
        'Client-ID': CLIENT_ID,
        'Authorization': `Bearer ${ACCESS_TOKEN}`,
        'Accept': 'application/json',
        'Content-Type': 'text/plain'
      },
      body
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return await response.json();
  }

  async getPopularGames(page = 1) {
    const offset = (page - 1) * 20;
    const body = `
      fields name, cover.image_id, first_release_date, rating, summary, genres.name, platforms.name;
      where rating != null & first_release_date != null;
      sort rating desc;
      limit 20;
      offset ${offset};
    `;
    
    return await this.makeRequest('games', body);
  }

  async searchGames(query, page = 1) {
    const offset = (page - 1) * 20;
    const body = `
      search "${query}";
      fields name, cover.image_id, first_release_date, rating, summary, genres.name, platforms.name;
      where version_parent = null;
      limit 20;
      offset ${offset};
    `;
    
    return await this.makeRequest('games', body);
  }

  async getGameById(id) {
    const body = `
      fields name, cover.image_id, first_release_date, rating, rating_count, 
             aggregated_rating, aggregated_rating_count, summary, storyline,
             genres.name, platforms.name, player_perspectives.name, game_modes.name,
             themes.name, involved_companies.company.name, involved_companies.developer,
             involved_companies.publisher, screenshots.image_id, videos.video_id,
             artworks.image_id, websites.url, websites.category, similar_games,
             release_dates.human, release_dates.platform.name, age_ratings.rating,
             age_ratings.category;
      where id = ${id};
    `;
    
    const games = await this.makeRequest('games', body);
    return games[0];
  }

  async getSimilarGames(gameId, page = 1) {
    const offset = (page - 1) * 10;
    

    const body = `
      fields similar_games;
      where id = ${gameId};
    `;
    
    const games = await this.makeRequest('games', body);
    
    if (!games[0] || !games[0].similar_games || games[0].similar_games.length === 0) {
      return [];
    }

    const similarIds = games[0].similar_games.slice(offset, offset + 10).join(',');
    
 
    const detailsBody = `
      fields name, cover.image_id, first_release_date, rating, summary, genres.name;
      where id = (${similarIds});
      limit 10;
    `;
    
    return await this.makeRequest('games', detailsBody);
  }

  async getGamesByGenre(genreId, page = 1) {
    const offset = (page - 1) * 20;
    const body = `
      fields name, cover.image_id, first_release_date, rating, summary, genres.name;
      where genres = (${genreId}) & rating != null;
      sort rating desc;
      limit 20;
      offset ${offset};
    `;
    
    return await this.makeRequest('games', body);
  }

  async getUpcomingGames(page = 1) {
    const offset = (page - 1) * 20;
    const now = Math.floor(Date.now() / 1000);
    
    const body = `
      fields name, cover.image_id, first_release_date, rating, summary, genres.name, platforms.name;
      where first_release_date > ${now} & hypes != null;
      sort hypes desc;
      limit 20;
      offset ${offset};
    `;
    
    return await this.makeRequest('games', body);
  }

  async getRecentGames(page = 1) {
    const offset = (page - 1) * 20;
    const now = Math.floor(Date.now() / 1000);
    const threeMonthsAgo = now - (90 * 24 * 60 * 60);
    
    const body = `
      fields name, cover.image_id, first_release_date, rating, summary, genres.name, platforms.name;
      where first_release_date < ${now} & first_release_date > ${threeMonthsAgo} & rating != null;
      sort rating desc;
      limit 20;
      offset ${offset};
    `;
    
    return await this.makeRequest('games', body);
  }
}

export default new VideogameRepository();

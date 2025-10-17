import VideogameRepository from '../repositories/VideogameRepository';

class VideogameService {
  // Helper to construct IGDB image URL
  getImageUrl(imageId, size = 'cover_big') {
    if (!imageId) return null;
    return `https://images.igdb.com/igdb/image/upload/t_${size}/${imageId}.jpg`;
  }

  // Helper to format game data
  formatGame(game) {
    const coverImageId = game.cover?.image_id;
    const screenshotImageId = game.screenshots?.[0]?.image_id || game.artworks?.[0]?.image_id;
    
    return {
      ...game,
      poster_path: coverImageId || null,
      backdrop_path: screenshotImageId || null,
      cover_url: coverImageId ? this.getImageUrl(coverImageId, 'cover_big') : null,
      screenshot_url: screenshotImageId ? this.getImageUrl(screenshotImageId, 'screenshot_huge') : null,
      poster_url: coverImageId ? this.getImageUrl(coverImageId, 'cover_big') : null,
      backdrop_url: screenshotImageId ? this.getImageUrl(screenshotImageId, 'screenshot_huge') : null,
      release_date: game.first_release_date ? new Date(game.first_release_date * 1000).toISOString().split('T')[0] : null,
      release_year: game.first_release_date ? new Date(game.first_release_date * 1000).getFullYear() : null,
      vote_average: game.rating ? game.rating / 10 : null,
      overview: game.summary || '',
      genre_ids: game.genres?.map(g => g.id) || [],
      formatted_vote_average: game.rating ? (game.rating / 10).toFixed(1) : null
    };
  }

  async getPopularGames(page = 1) {
    const games = await VideogameRepository.getPopularGames(page);
    return games.map(game => this.formatGame(game));
  }

  async searchGames(query, page = 1) {
    const games = await VideogameRepository.searchGames(query, page);
    return games.map(game => this.formatGame(game));
  }

  async getGameById(id) {
    const game = await VideogameRepository.getGameById(id);
    if (!game) return null;
    
    return {
      ...this.formatGame(game),
      developers: game.involved_companies?.filter(ic => ic.developer)
        .map(ic => ic.company?.name) || [],
      publishers: game.involved_companies?.filter(ic => ic.publisher)
        .map(ic => ic.company?.name) || [],
      screenshots: game.screenshots?.map(s => ({
        image_id: s.image_id,
        url: this.getImageUrl(s.image_id, 'screenshot_huge')
      })) || [],
      videos: game.videos || [],
      artworks: game.artworks?.map(a => ({
        image_id: a.image_id,
        url: this.getImageUrl(a.image_id, '1080p')
      })) || [],
      platforms: game.platforms || [],
      player_perspectives: game.player_perspectives || [],
      game_modes: game.game_modes || [],
      themes: game.themes || [],
      websites: game.websites || [],
      similar_games: game.similar_games || [],
      release_dates: game.release_dates || [],
      age_ratings: game.age_ratings || [],
      storyline: game.storyline || '',
      aggregated_rating: game.aggregated_rating,
      aggregated_rating_count: game.aggregated_rating_count,
      rating_count: game.rating_count
    };
  }

  async getSimilarGames(gameId, page = 1) {
    const games = await VideogameRepository.getSimilarGames(gameId, page);
    return games.map(game => this.formatGame(game));
  }

  async getGamesByGenre(genreId, page = 1) {
    const games = await VideogameRepository.getGamesByGenre(genreId, page);
    return games.map(game => this.formatGame(game));
  }

  async getUpcomingGames(page = 1) {
    const games = await VideogameRepository.getUpcomingGames(page);
    return games.map(game => this.formatGame(game));
  }

  async getRecentGames(page = 1) {
    const games = await VideogameRepository.getRecentGames(page);
    return games.map(game => this.formatGame(game));
  }
}

export default new VideogameService();

export interface TMDBContent {
  id: number;
  title?: string;
  name?: string;
  overview: string;
  poster_path: string | null;
  backdrop_path: string | null;
  vote_average: number;
  release_date?: string;
  first_air_date?: string;
  media_type: 'movie' | 'tv';
  imdb_id?: string;
  genre_ids?: number[];
  genres?: { id: number; name: string }[];
  runtime?: number;
  episode_run_time?: number[];
  number_of_seasons?: number;
  number_of_episodes?: number;
  credits?: {
    cast: {
      id: number;
      name: string;
      character: string;
      profile_path: string | null;
    }[];
  };
  similar?: {
    results: TMDBContent[];
  };
}

export interface TMDBSeason {
  id: number;
  name: string;
  season_number: number;
  overview: string;
  poster_path: string | null;
  episodes: TMDBEpisode[];
}

export interface TMDBEpisode {
  id: number;
  name: string;
  overview: string;
  episode_number: number;
  season_number: number;
  still_path: string | null;
  vote_average: number;
  air_date?: string;
}

const TMDB_API_KEY = process.env.TMDB_API_KEY || process.env.NEXT_PUBLIC_TMDB_API_KEY;
const BASE_URL = 'https://api.themoviedb.org/3';

// Check if TMDB is configured
export function isTMDBConfigured(): boolean {
  return typeof TMDB_API_KEY === 'string' && TMDB_API_KEY.trim().length > 0;
}

// Custom Fetch with ISR support
async function tmdbFetch<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const url = `${BASE_URL}${endpoint}${endpoint.includes('?') ? '&' : '?'}api_key=${TMDB_API_KEY}`;
  
  const res = await fetch(url, {
    ...options,
    next: {
      revalidate: 3600, // ISR: 1 hour cache
      ...options.next,
    },
  });

  if (!res.ok) {
    throw new Error(`TMDB fetch failed with status ${res.status}`);
  }

  return res.json() as Promise<T>;
}

// ----------------------------------------------------
// Mock Data for Fallback
// ----------------------------------------------------

const MOCK_MOVIES: TMDBContent[] = [
  {
    id: 27205,
    title: 'Inception',
    overview: 'Cobb, a skilled thief who commits corporate espionage by infiltrating the subconscious of his targets, is offered a chance to regain his old life as payment for a task considered to be impossible: "inception", the implantation of another person\'s idea into a target\'s subconscious.',
    poster_path: '/o0g7wBDn6N5ecAgCZZ1qGqH1z7P.jpg',
    backdrop_path: '/s3TBrRGB1K7GvhygRLY1WI14GsT.jpg',
    vote_average: 8.4,
    release_date: '2010-07-15',
    media_type: 'movie',
    genres: [{ id: 28, name: 'Action' }, { id: 878, name: 'Sci-Fi' }, { id: 12, name: 'Adventure' }],
    runtime: 148,
  },
  {
    id: 157336,
    title: 'Interstellar',
    overview: 'The adventures of a group of explorers who make use of a newly discovered wormhole to surpass the limitations on human space travel and conquer the vast distances involved in an interstellar voyage.',
    poster_path: '/gEU2QvHOm4azx1Q2Cg2j2hn4vhu.jpg',
    backdrop_path: '/xJHokZbljvjC1OHFBZ76X4Zrqeb.jpg',
    vote_average: 8.4,
    release_date: '2014-11-05',
    media_type: 'movie',
    genres: [{ id: 12, name: 'Adventure' }, { id: 18, name: 'Drama' }, { id: 878, name: 'Sci-Fi' }],
    runtime: 169,
  },
  {
    id: 155,
    title: 'The Dark Knight',
    overview: 'Batman raises the stakes in his war on crime. With the help of Lt. Jim Gordon and District Attorney Harvey Dent, Batman sets out to dismantle the remaining criminal organizations that plague the streets. The partnership proves to be effective, but they soon find themselves prey to a reign of chaos unleashed by a rising criminal mastermind known to the terrified citizens of Gotham as the Joker.',
    poster_path: '/qJ2tWGBYiZ1YwC932S7VJZuTY6P.jpg',
    backdrop_path: '/nMK0wTNq1T7y85lK3yL0xV62mIK.jpg',
    vote_average: 8.5,
    release_date: '2008-07-16',
    media_type: 'movie',
    genres: [{ id: 18, name: 'Drama' }, { id: 28, name: 'Action' }, { id: 35, name: 'Comedy' }],
    runtime: 152,
  },
  {
    id: 299536,
    title: 'Avengers: Infinity War',
    overview: 'As the Avengers and their allies have continued to protect the world from threats too large for any one hero to handle, a new danger has emerged from the cosmic shadows: Thanos. A despot of intergalactic infamy, his goal is to collect all six Infinity Stones, artifacts of unimaginable power, and use them to inflict his twisted will on all of reality. Everything the Avengers have fought for has led up to this moment - the fate of Earth and existence itself has never been more uncertain.',
    poster_path: '/7WsyChwLE3ZZEj9GZkB670Navyp.jpg',
    backdrop_path: '/mDF43NsGpao3P66MBZH2RL400vj.jpg',
    vote_average: 8.3,
    release_date: '2018-04-25',
    media_type: 'movie',
    genres: [{ id: 12, name: 'Adventure' }, { id: 28, name: 'Action' }, { id: 878, name: 'Sci-Fi' }],
    runtime: 149,
  },
  {
    id: 414906,
    title: 'The Batman',
    overview: 'In his second year of fighting crime, Batman uncovers corruption in Gotham City that connects to his own family while facing a serial killer known as the Riddler.',
    poster_path: '/74xTEgt7R361j2KiIq96i0w6aKQ.jpg',
    backdrop_path: '/5P8A68wVUpFSpxLxN644tnsdurm.jpg',
    vote_average: 7.7,
    release_date: '2022-03-01',
    media_type: 'movie',
    genres: [{ id: 80, name: 'Crime' }, { id: 9648, name: 'Mystery' }, { id: 53, name: 'Thriller' }],
    runtime: 176,
  }
];

const MOCK_TV_SHOWS: TMDBContent[] = [
  {
    id: 1396,
    name: 'Breaking Bad',
    overview: 'Walter White, a New Mexico chemistry teacher, is diagnosed with Stage III cancer and given a prognosis of two years to live. To secure his family\'s financial future, White chooses to enter a dangerous world of drugs and crime and ascends to power in this world.',
    poster_path: '/ztk4nFS91w9VF4n2497tEEjhhwX.jpg',
    backdrop_path: '/9fae8qvPVN31nJna87X4Nu7uOPw.jpg',
    vote_average: 8.9,
    first_air_date: '2008-01-20',
    media_type: 'tv',
    genres: [{ id: 18, name: 'Drama' }, { id: 80, name: 'Crime' }],
    number_of_seasons: 5,
    number_of_episodes: 62,
  },
  {
    id: 66732,
    name: 'Stranger Things',
    overview: 'When a young boy vanishes, a town uncovers a mystery involving secret experiments, terrifying supernatural forces and one strange little girl.',
    poster_path: '/49WJfeN0mhmRKr9nd2jU52ZJATF.jpg',
    backdrop_path: '/56v2Kj2Fa0cc426VCvKiW7N17CX.jpg',
    vote_average: 8.6,
    first_air_date: '2016-07-15',
    media_type: 'tv',
    genres: [{ id: 18, name: 'Drama' }, { id: 9648, name: 'Mystery' }, { id: 878, name: 'Sci-Fi' }],
    number_of_seasons: 4,
    number_of_episodes: 34,
  },
  {
    id: 82856,
    name: 'The Mandalorian',
    overview: 'After the fall of the Galactic Empire, lawlessness has spread throughout the galaxy. A lone gunfighter makes his way through the outer reaches of the galaxy, earning his keep as a bounty hunter.',
    poster_path: '/e3w281j6jpdffgB866iHY9190u8.jpg',
    backdrop_path: '/x4476p251rmJFSg25555c4d3w28.jpg',
    vote_average: 8.5,
    first_air_date: '2019-11-12',
    media_type: 'tv',
    genres: [{ id: 10765, name: 'Sci-Fi & Fantasy' }, { id: 10759, name: 'Action & Adventure' }],
    number_of_seasons: 3,
    number_of_episodes: 24,
  },
  {
    id: 71712,
    name: 'The Good Doctor',
    overview: 'Shaun Murphy, a young surgeon with autism and savant syndrome, relocates from a quiet country life to join a prestigious hospital surgical unit. Unable to personally connect with those around him, Shaun uses his extraordinary medical gifts to save lives and challenge the skepticism of his colleagues.',
    poster_path: '/luhKdB4goWJZgpf5QClRbbObajg.jpg',
    backdrop_path: '/i5ie315y442bFAdaqu4x45G9q5P.jpg',
    vote_average: 8.5,
    first_air_date: '2017-09-25',
    media_type: 'tv',
    genres: [{ id: 18, name: 'Drama' }],
    number_of_seasons: 7,
    number_of_episodes: 126,
  }
];

const MOCK_CAST = [
  { id: 1, name: 'Leonardo DiCaprio', character: 'Cobb', profile_path: null },
  { id: 2, name: 'Joseph Gordon-Levitt', character: 'Arthur', profile_path: null },
  { id: 3, name: 'Elliot Page', character: 'Ariadne', profile_path: null },
  { id: 4, name: 'Tom Hardy', character: 'Eames', profile_path: null },
  { id: 5, name: 'Bryan Cranston', character: 'Walter White', profile_path: null },
  { id: 6, name: 'Aaron Paul', character: 'Jesse Pinkman', profile_path: null },
  { id: 7, name: 'Millie Bobby Brown', character: 'Eleven', profile_path: null },
  { id: 8, name: 'Pedro Pascal', character: 'The Mandalorian', profile_path: null },
];

function getMockCastForId(id: number) {
  // Return subsets of mock cast
  if (id === 27205 || id === 157336 || id === 155) {
    return MOCK_CAST.slice(0, 4);
  }
  return MOCK_CAST.slice(4);
}

function getMockSimilarForId(id: number, mediaType: 'movie' | 'tv'): TMDBContent[] {
  const pool = mediaType === 'movie' ? MOCK_MOVIES : MOCK_TV_SHOWS;
  return pool.filter(item => item.id !== id);
}

// ----------------------------------------------------
// Public API Calls
// ----------------------------------------------------

export async function getTrendingMovies(): Promise<TMDBContent[]> {
  if (!isTMDBConfigured()) {
    return MOCK_MOVIES;
  }
  try {
    const data = await tmdbFetch<{ results: TMDBContent[] }>('/trending/movie/day');
    return data.results.map(m => ({ ...m, media_type: 'movie' }));
  } catch (error) {
    console.error('Error fetching trending movies, falling back to mock data', error);
    return MOCK_MOVIES;
  }
}

export async function getTrendingTVShows(): Promise<TMDBContent[]> {
  if (!isTMDBConfigured()) {
    return MOCK_TV_SHOWS;
  }
  try {
    const data = await tmdbFetch<{ results: TMDBContent[] }>('/trending/tv/day');
    return data.results.map(t => ({ ...t, media_type: 'tv' as const }));
  } catch (error) {
    console.error('Error fetching trending TV shows, falling back to mock data', error);
    return MOCK_TV_SHOWS;
  }
}

export async function getPopularMovies(): Promise<TMDBContent[]> {
  if (!isTMDBConfigured()) {
    return MOCK_MOVIES.slice(2).concat(MOCK_MOVIES.slice(0, 2));
  }
  try {
    const data = await tmdbFetch<{ results: TMDBContent[] }>('/movie/popular');
    return data.results.map(m => ({ ...m, media_type: 'movie' }));
  } catch (error) {
    console.error('Error fetching popular movies, falling back to mock data', error);
    return MOCK_MOVIES;
  }
}

export async function getTopRatedTVShows(): Promise<TMDBContent[]> {
  if (!isTMDBConfigured()) {
    return MOCK_TV_SHOWS;
  }
  try {
    const data = await tmdbFetch<{ results: TMDBContent[] }>('/tv/top_rated');
    return data.results.map(t => ({ ...t, media_type: 'tv' }));
  } catch (error) {
    console.error('Error fetching top rated TV shows, falling back to mock data', error);
    return MOCK_TV_SHOWS;
  }
}

export async function getMovieDetails(id: number): Promise<TMDBContent> {
  if (!isTMDBConfigured()) {
    const local = MOCK_MOVIES.find(m => m.id === id) || MOCK_MOVIES[0];
    return {
      ...local,
      credits: { cast: getMockCastForId(id) },
      similar: { results: getMockSimilarForId(id, 'movie') },
    };
  }
  try {
    return await tmdbFetch<TMDBContent>(`/movie/${id}?append_to_response=credits,similar`);
  } catch (error) {
    console.error(`Error fetching movie details for id: ${id}`, error);
    const local = MOCK_MOVIES.find(m => m.id === id) || MOCK_MOVIES[0];
    return {
      ...local,
      credits: { cast: getMockCastForId(id) },
      similar: { results: getMockSimilarForId(id, 'movie') },
    };
  }
}

export async function getTVShowDetails(id: number): Promise<TMDBContent> {
  if (!isTMDBConfigured()) {
    const local = MOCK_TV_SHOWS.find(t => t.id === id) || MOCK_TV_SHOWS[0];
    return {
      ...local,
      credits: { cast: getMockCastForId(id) },
      similar: { results: getMockSimilarForId(id, 'tv') },
    };
  }
  try {
    return await tmdbFetch<TMDBContent>(`/tv/${id}?append_to_response=credits,similar`);
  } catch (error) {
    console.error(`Error fetching TV show details for id: ${id}`, error);
    const local = MOCK_TV_SHOWS.find(t => t.id === id) || MOCK_TV_SHOWS[0];
    return {
      ...local,
      credits: { cast: getMockCastForId(id) },
      similar: { results: getMockSimilarForId(id, 'tv') },
    };
  }
}

export async function getTVSeasonDetails(tvId: number, seasonNumber: number): Promise<TMDBSeason> {
  if (!isTMDBConfigured()) {
    // Generate mock episodes for the season
    const episodes: TMDBEpisode[] = Array.from({ length: 10 }, (_, i) => ({
      id: tvId * 1000 + seasonNumber * 100 + i,
      name: `Episode ${i + 1}`,
      overview: `This is a mock overview for Season ${seasonNumber} Episode ${i + 1} of show #${tvId}. It provides the necessary details about characters and plots for testing player embed streams.`,
      episode_number: i + 1,
      season_number: seasonNumber,
      still_path: null,
      vote_average: 8.0 + (i % 3) * 0.3,
      air_date: '2020-01-01',
    }));

    return {
      id: tvId * 10 + seasonNumber,
      name: `Season ${seasonNumber}`,
      season_number: seasonNumber,
      overview: `Mock overview for Season ${seasonNumber}`,
      poster_path: null,
      episodes,
    };
  }
  try {
    return await tmdbFetch<TMDBSeason>(`/tv/${tvId}/season/${seasonNumber}`);
  } catch (error) {
    console.error(`Error fetching TV season details for show: ${tvId}, season: ${seasonNumber}`, error);
    // Return mock data instead of recursive call to avoid infinite loop
    const episodes: TMDBEpisode[] = Array.from({ length: 10 }, (_, i) => ({
      id: tvId * 1000 + seasonNumber * 100 + i,
      name: `Episode ${i + 1}`,
      overview: `Overview for Season ${seasonNumber} Episode ${i + 1}.`,
      episode_number: i + 1,
      season_number: seasonNumber,
      still_path: null,
      vote_average: 8.0,
      air_date: '2020-01-01',
    }));
    return {
      id: tvId * 10 + seasonNumber,
      name: `Season ${seasonNumber}`,
      season_number: seasonNumber,
      overview: `Fallback data for Season ${seasonNumber}`,
      poster_path: null,
      episodes,
    };
  }
}

export async function getNowPlayingMovies(): Promise<TMDBContent[]> {
  if (!isTMDBConfigured()) return MOCK_MOVIES;
  try {
    const data = await tmdbFetch<{ results: TMDBContent[] }>('/movie/now_playing');
    return data.results.map(m => ({ ...m, media_type: 'movie' as const }));
  } catch (error) {
    console.error('Error fetching now playing movies', error);
    return MOCK_MOVIES;
  }
}

export async function getUpcomingMovies(): Promise<TMDBContent[]> {
  if (!isTMDBConfigured()) return MOCK_MOVIES;
  try {
    const data = await tmdbFetch<{ results: TMDBContent[] }>('/movie/upcoming');
    return data.results.map(m => ({ ...m, media_type: 'movie' as const }));
  } catch (error) {
    console.error('Error fetching upcoming movies', error);
    return MOCK_MOVIES;
  }
}

export async function getPopularTVShows(): Promise<TMDBContent[]> {
  if (!isTMDBConfigured()) return MOCK_TV_SHOWS;
  try {
    const data = await tmdbFetch<{ results: TMDBContent[] }>('/tv/popular');
    return data.results.map(t => ({ ...t, media_type: 'tv' as const }));
  } catch (error) {
    console.error('Error fetching popular TV shows', error);
    return MOCK_TV_SHOWS;
  }
}

// Fetch a large collection of content from multiple categories
export async function getAllDiscoverContent(): Promise<TMDBContent[]> {
  if (!isTMDBConfigured()) {
    return [...MOCK_MOVIES, ...MOCK_TV_SHOWS];
  }
  try {
    const [trending, popular, nowPlaying, upcoming, trendingTv, topTv, popularTv] = await Promise.all([
      getTrendingMovies(),
      getPopularMovies(),
      getNowPlayingMovies(),
      getUpcomingMovies(),
      getTrendingTVShows(),
      getTopRatedTVShows(),
      getPopularTVShows(),
    ]);

    // Combine and deduplicate by id+type
    const seen = new Set<string>();
    const all: TMDBContent[] = [];
    for (const item of [...trending, ...popular, ...nowPlaying, ...upcoming, ...trendingTv, ...topTv, ...popularTv]) {
      const key = `${item.media_type}-${item.id}`;
      if (!seen.has(key)) {
        seen.add(key);
        all.push(item);
      }
    }
    return all;
  } catch (error) {
    console.error('Error fetching all discover content', error);
    return [...MOCK_MOVIES, ...MOCK_TV_SHOWS];
  }
}

export async function searchMulti(query: string): Promise<TMDBContent[]> {
  if (!isTMDBConfigured() || !query) {
    const allMock = [...MOCK_MOVIES, ...MOCK_TV_SHOWS];
    if (!query) return allMock;
    return allMock.filter(item =>
      (item.title || item.name || '').toLowerCase().includes(query.toLowerCase())
    );
  }
  try {
    // Fetch 2 pages for more results
    const [page1, page2] = await Promise.all([
      tmdbFetch<{ results: TMDBContent[] }>(`/search/multi?query=${encodeURIComponent(query)}&page=1`),
      tmdbFetch<{ results: TMDBContent[] }>(`/search/multi?query=${encodeURIComponent(query)}&page=2`),
    ]);
    const combined = [...page1.results, ...page2.results];
    return combined
      .filter(item => item.media_type === 'movie' || item.media_type === 'tv')
      .map(item => ({
        id: item.id,
        title: item.title,
        name: item.name,
        overview: item.overview,
        poster_path: item.poster_path,
        backdrop_path: item.backdrop_path,
        vote_average: item.vote_average,
        release_date: item.release_date,
        first_air_date: item.first_air_date,
        media_type: item.media_type,
      }));
  } catch (error) {
    console.error(`Error searching multi for query: ${query}`, error);
    const allMock = [...MOCK_MOVIES, ...MOCK_TV_SHOWS];
    return allMock.filter(item =>
      (item.title || item.name || '').toLowerCase().includes(query.toLowerCase())
    );
  }
}

// TMDB API client - calls edge function proxy

export interface Movie {
  id: number;
  title: string;
  overview: string;
  poster_path: string | null;
  backdrop_path: string | null;
  vote_average: number;
  release_date: string;
  genre_ids?: number[];
  genres?: { id: number; name: string }[];
  runtime?: number;
  videos?: { results: { key: string; type: string; site: string }[] };
  credits?: { cast: { id: number; name: string; character: string; profile_path: string | null }[] };
}

export interface TMDBResponse {
  results: Movie[];
  page: number;
  total_pages: number;
}

const TMDB_IMAGE_BASE = "https://image.tmdb.org/t/p";

export const getImageUrl = (path: string | null, size: string = "w500") => {
  if (!path) return null;
  return `${TMDB_IMAGE_BASE}/${size}${path}`;
};

export const getBackdropUrl = (path: string | null) => getImageUrl(path, "original");
export const getPosterUrl = (path: string | null) => getImageUrl(path, "w500");

async function fetchTMDB(params: Record<string, string>): Promise<any> {
  const searchParams = new URLSearchParams(params);
  const projectId = import.meta.env.VITE_SUPABASE_PROJECT_ID;
  const anonKey = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY;
  
  const response = await fetch(
    `https://${projectId}.supabase.co/functions/v1/tmdb-proxy?${searchParams.toString()}`,
    {
      headers: {
        Authorization: `Bearer ${anonKey}`,
        "Content-Type": "application/json",
      },
    }
  );

  if (!response.ok) throw new Error("Failed to fetch movies");
  return response.json();
}

export async function fetchMovies(category: string): Promise<Movie[]> {
  const data = await fetchTMDB({ category });
  return data.results || [];
}

export async function fetchMovieDetails(movieId: number): Promise<Movie> {
  return fetchTMDB({ movieId: String(movieId) });
}

export async function searchMovies(query: string): Promise<Movie[]> {
  const data = await fetchTMDB({ query });
  return data.results || [];
}

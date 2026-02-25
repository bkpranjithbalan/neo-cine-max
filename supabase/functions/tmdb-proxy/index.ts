const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const TMDB_API_KEY = Deno.env.get("TMDB_API_KEY");
    if (!TMDB_API_KEY) {
      return new Response(JSON.stringify({ error: "TMDB API key not configured" }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const url = new URL(req.url);
    const category = url.searchParams.get("category") || "trending";
    const movieId = url.searchParams.get("movieId");
    const query = url.searchParams.get("query");

    let tmdbUrl: string;

    if (movieId) {
      tmdbUrl = `https://api.themoviedb.org/3/movie/${movieId}?api_key=${TMDB_API_KEY}&append_to_response=videos,credits`;
    } else if (query) {
      tmdbUrl = `https://api.themoviedb.org/3/search/movie?api_key=${TMDB_API_KEY}&query=${encodeURIComponent(query)}`;
    } else {
      const endpoints: Record<string, string> = {
        trending: `https://api.themoviedb.org/3/trending/movie/week?api_key=${TMDB_API_KEY}`,
        popular: `https://api.themoviedb.org/3/movie/popular?api_key=${TMDB_API_KEY}`,
        "top-rated": `https://api.themoviedb.org/3/movie/top_rated?api_key=${TMDB_API_KEY}`,
        upcoming: `https://api.themoviedb.org/3/movie/upcoming?api_key=${TMDB_API_KEY}`,
        "now-playing": `https://api.themoviedb.org/3/movie/now_playing?api_key=${TMDB_API_KEY}`,
      };
      tmdbUrl = endpoints[category] || endpoints.trending;
    }

    const response = await fetch(tmdbUrl);
    const data = await response.json();

    return new Response(JSON.stringify(data), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("TMDB proxy error:", error);
    return new Response(JSON.stringify({ error: "Failed to fetch from TMDB" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});

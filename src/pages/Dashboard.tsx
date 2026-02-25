import { useState, useEffect } from "react";
import { Movie, fetchMovies, searchMovies } from "@/lib/tmdb";
import HeroBanner from "@/components/HeroBanner";
import MovieCarousel from "@/components/MovieCarousel";
import MovieModal from "@/components/MovieModal";
import Navbar from "@/components/Navbar";
import { toast } from "@/hooks/use-toast";

interface MovieCategory {
  key: string;
  title: string;
  movies: Movie[];
}

export default function Dashboard() {
  const [categories, setCategories] = useState<MovieCategory[]>([]);
  const [selectedMovie, setSelectedMovie] = useState<Movie | null>(null);
  const [searchResults, setSearchResults] = useState<Movie[] | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const categoryDefs = [
      { key: "trending", title: "Trending Now" },
      { key: "popular", title: "Popular" },
      { key: "top-rated", title: "Top Rated" },
      { key: "upcoming", title: "Upcoming" },
      { key: "now-playing", title: "Now Playing" },
    ];

    Promise.all(
      categoryDefs.map(async (cat) => {
        try {
          const movies = await fetchMovies(cat.key);
          return { ...cat, movies };
        } catch {
          return { ...cat, movies: [] };
        }
      })
    )
      .then(setCategories)
      .catch((err) => {
        console.error(err);
        toast({ title: "Failed to load movies", variant: "destructive" });
      })
      .finally(() => setLoading(false));
  }, []);

  const handleSearch = async (query: string) => {
    try {
      const results = await searchMovies(query);
      setSearchResults(results);
    } catch {
      toast({ title: "Search failed", variant: "destructive" });
    }
  };

  const heroMovies = categories.find((c) => c.key === "trending")?.movies || [];

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <div className="h-12 w-12 animate-spin rounded-full border-4 border-primary border-t-transparent" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar onSearch={handleSearch} />

      {/* Hero */}
      {!searchResults && heroMovies.length > 0 && (
        <HeroBanner movies={heroMovies} onMovieClick={setSelectedMovie} />
      )}

      {/* Content */}
      <div className={searchResults ? "pt-24" : "-mt-16 relative z-10"}>
        {searchResults ? (
          <div className="px-8 md:px-16">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="font-display text-3xl text-foreground">Search Results</h2>
              <button
                onClick={() => setSearchResults(null)}
                className="text-sm text-primary hover:underline"
              >
                Clear search
              </button>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
              {searchResults.map((movie) => (
                <button
                  key={movie.id}
                  onClick={() => setSelectedMovie(movie)}
                  className="overflow-hidden rounded-lg transition-transform hover:scale-105 focus:outline-none"
                >
                  {movie.poster_path ? (
                    <img
                      src={`https://image.tmdb.org/t/p/w300${movie.poster_path}`}
                      alt={movie.title}
                      className="aspect-[2/3] w-full object-cover"
                      loading="lazy"
                    />
                  ) : (
                    <div className="aspect-[2/3] w-full bg-secondary flex items-center justify-center p-2">
                      <span className="text-xs text-muted-foreground text-center">{movie.title}</span>
                    </div>
                  )}
                </button>
              ))}
            </div>
          </div>
        ) : (
          categories.map((cat) => (
            <MovieCarousel
              key={cat.key}
              title={cat.title}
              movies={cat.movies}
              onMovieClick={setSelectedMovie}
            />
          ))
        )}
      </div>

      {/* Modal */}
      {selectedMovie && (
        <MovieModal movie={selectedMovie} onClose={() => setSelectedMovie(null)} />
      )}
    </div>
  );
}

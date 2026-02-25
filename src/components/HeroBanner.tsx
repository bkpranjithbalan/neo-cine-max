import { useState, useEffect } from "react";
import { Play, Info } from "lucide-react";
import { Movie, getBackdropUrl } from "@/lib/tmdb";

interface HeroBannerProps {
  movies: Movie[];
  onMovieClick: (movie: Movie) => void;
}

export default function HeroBanner({ movies, onMovieClick }: HeroBannerProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const movie = movies[currentIndex];

  useEffect(() => {
    if (movies.length <= 1) return;
    const interval = setInterval(() => {
      setCurrentIndex((i) => (i + 1) % Math.min(movies.length, 5));
    }, 8000);
    return () => clearInterval(interval);
  }, [movies.length]);

  if (!movie) return null;

  const backdrop = getBackdropUrl(movie.backdrop_path);

  return (
    <div className="relative h-[70vh] min-h-[500px] w-full overflow-hidden">
      {/* Background image */}
      {backdrop && (
        <img
          src={backdrop}
          alt={movie.title}
          className="absolute inset-0 h-full w-full object-cover transition-opacity duration-1000"
        />
      )}

      {/* Overlay */}
      <div className="hero-overlay absolute inset-0" />

      {/* Content */}
      <div className="absolute bottom-0 left-0 right-0 p-8 md:p-16 animate-slide-up">
        <h1 className="font-display text-5xl md:text-7xl text-foreground text-shadow-lg mb-4 max-w-2xl">
          {movie.title}
        </h1>
        <p className="mb-6 max-w-xl text-sm md:text-base text-foreground/80 text-shadow line-clamp-3">
          {movie.overview}
        </p>
        <div className="flex gap-3">
          <button
            onClick={() => onMovieClick(movie)}
            className="netflix-gradient flex items-center gap-2 rounded-lg px-6 py-3 font-semibold text-primary-foreground transition-all hover:opacity-90"
          >
            <Play size={20} fill="currentColor" /> Play
          </button>
          <button
            onClick={() => onMovieClick(movie)}
            className="glass glass-hover flex items-center gap-2 rounded-lg px-6 py-3 font-semibold text-foreground"
          >
            <Info size={20} /> More Info
          </button>
        </div>

        {/* Dots */}
        {movies.length > 1 && (
          <div className="mt-6 flex gap-2">
            {movies.slice(0, 5).map((_, i) => (
              <button
                key={i}
                onClick={() => setCurrentIndex(i)}
                className={`h-1 rounded-full transition-all duration-300 ${
                  i === currentIndex ? "w-8 bg-primary" : "w-4 bg-foreground/30"
                }`}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

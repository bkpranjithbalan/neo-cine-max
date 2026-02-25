import { useEffect, useState } from "react";
import { X, Star, Clock, Calendar } from "lucide-react";
import { Movie, getBackdropUrl, fetchMovieDetails } from "@/lib/tmdb";

interface MovieModalProps {
  movie: Movie;
  onClose: () => void;
}

export default function MovieModal({ movie: initialMovie, onClose }: MovieModalProps) {
  const [movie, setMovie] = useState<Movie>(initialMovie);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchMovieDetails(initialMovie.id)
      .then(setMovie)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [initialMovie.id]);

  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", handleEsc);
    return () => window.removeEventListener("keydown", handleEsc);
  }, [onClose]);

  const backdrop = getBackdropUrl(movie.backdrop_path);
  const trailer = movie.videos?.results?.find(
    (v) => v.type === "Trailer" && v.site === "YouTube"
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" onClick={onClose}>
      <div className="fixed inset-0 bg-background/80 backdrop-blur-sm" />
      <div
        className="relative z-10 max-h-[90vh] w-full max-w-3xl overflow-y-auto rounded-2xl glass animate-scale-in"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Backdrop */}
        <div className="relative aspect-video w-full overflow-hidden rounded-t-2xl">
          {trailer ? (
            <iframe
              src={`https://www.youtube.com/embed/${trailer.key}?autoplay=1&mute=1`}
              className="h-full w-full"
              allow="autoplay"
              allowFullScreen
            />
          ) : backdrop ? (
            <img src={backdrop} alt={movie.title} className="h-full w-full object-cover" />
          ) : (
            <div className="h-full w-full bg-secondary" />
          )}
          <div className="hero-overlay absolute inset-0" />
        </div>

        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute right-4 top-4 z-20 rounded-full bg-background/60 p-2 text-foreground transition-colors hover:bg-background"
        >
          <X size={20} />
        </button>

        {/* Info */}
        <div className="p-6 md:p-8">
          <h2 className="font-display text-4xl text-foreground mb-3">{movie.title}</h2>

          <div className="mb-4 flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
            <span className="flex items-center gap-1">
              <Star size={14} className="text-yellow-500 fill-yellow-500" />
              {movie.vote_average?.toFixed(1)}
            </span>
            {movie.release_date && (
              <span className="flex items-center gap-1">
                <Calendar size={14} />
                {new Date(movie.release_date).getFullYear()}
              </span>
            )}
            {movie.runtime && (
              <span className="flex items-center gap-1">
                <Clock size={14} />
                {Math.floor(movie.runtime / 60)}h {movie.runtime % 60}m
              </span>
            )}
          </div>

          {movie.genres && (
            <div className="mb-4 flex flex-wrap gap-2">
              {movie.genres.map((g) => (
                <span key={g.id} className="rounded-full bg-secondary px-3 py-1 text-xs text-secondary-foreground">
                  {g.name}
                </span>
              ))}
            </div>
          )}

          <p className="text-foreground/80 leading-relaxed">{movie.overview}</p>

          {movie.credits?.cast && movie.credits.cast.length > 0 && (
            <div className="mt-6">
              <h3 className="mb-2 font-display text-xl text-foreground">Cast</h3>
              <p className="text-sm text-muted-foreground">
                {movie.credits.cast.slice(0, 8).map((c) => c.name).join(", ")}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

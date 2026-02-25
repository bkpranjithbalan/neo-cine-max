import { useRef } from "react";
import { ChevronLeft, ChevronRight, Star } from "lucide-react";
import { Movie, getPosterUrl } from "@/lib/tmdb";

interface MovieCarouselProps {
  title: string;
  movies: Movie[];
  onMovieClick: (movie: Movie) => void;
}

export default function MovieCarousel({ title, movies, onMovieClick }: MovieCarouselProps) {
  const scrollRef = useRef<HTMLDivElement>(null);

  const scroll = (direction: "left" | "right") => {
    if (!scrollRef.current) return;
    const amount = scrollRef.current.clientWidth * 0.8;
    scrollRef.current.scrollBy({
      left: direction === "left" ? -amount : amount,
      behavior: "smooth",
    });
  };

  if (!movies.length) return null;

  return (
    <div className="group relative py-4">
      <h2 className="mb-4 px-8 md:px-16 font-display text-2xl md:text-3xl text-foreground">
        {title}
      </h2>

      <div className="relative">
        {/* Scroll buttons */}
        <button
          onClick={() => scroll("left")}
          className="absolute left-1 top-1/2 z-20 -translate-y-1/2 rounded-full bg-background/80 p-2 text-foreground opacity-0 transition-opacity group-hover:opacity-100 hover:bg-background"
        >
          <ChevronLeft size={24} />
        </button>
        <button
          onClick={() => scroll("right")}
          className="absolute right-1 top-1/2 z-20 -translate-y-1/2 rounded-full bg-background/80 p-2 text-foreground opacity-0 transition-opacity group-hover:opacity-100 hover:bg-background"
        >
          <ChevronRight size={24} />
        </button>

        {/* Cards */}
        <div
          ref={scrollRef}
          className="scrollbar-hide flex gap-3 overflow-x-auto px-8 md:px-16"
        >
          {movies.map((movie) => {
            const poster = getPosterUrl(movie.poster_path);
            return (
              <button
                key={movie.id}
                onClick={() => onMovieClick(movie)}
                className="group/card relative flex-shrink-0 w-[140px] md:w-[180px] overflow-hidden rounded-lg transition-transform duration-300 hover:scale-105 hover:z-10 focus:outline-none"
              >
                {poster ? (
                  <img
                    src={poster}
                    alt={movie.title}
                    className="aspect-[2/3] w-full object-cover"
                    loading="lazy"
                  />
                ) : (
                  <div className="aspect-[2/3] w-full bg-secondary flex items-center justify-center">
                    <span className="text-xs text-muted-foreground">{movie.title}</span>
                  </div>
                )}

                {/* Hover overlay */}
                <div className="absolute inset-0 flex flex-col justify-end bg-gradient-to-t from-background via-transparent to-transparent opacity-0 transition-opacity group-hover/card:opacity-100 p-3">
                  <p className="text-sm font-semibold text-foreground line-clamp-2">{movie.title}</p>
                  <div className="mt-1 flex items-center gap-1 text-xs text-muted-foreground">
                    <Star size={12} className="text-yellow-500 fill-yellow-500" />
                    {movie.vote_average?.toFixed(1)}
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}

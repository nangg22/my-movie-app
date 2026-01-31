import React from 'react';

const MovieCard = ({ movie, isFavorite, onToggleFavorite }) => {
  return (
    <div className="group cursor-pointer">
      <div className="relative overflow-hidden rounded-xl shadow-lg transition-all duration-300 group-hover:scale-105">
        <img 
          src={movie.poster_path 
            ? `https://image.tmdb.org/t/p/w500${movie.poster_path}` 
            : "https://via.placeholder.com/500x750?text=No+Image"} 
          alt={movie.title}
          className="w-full h-[350px] object-cover"
        />
        
        {/* Tombol Favorit */}
        <button 
          onClick={(e) => {
            e.stopPropagation(); // Agar klik tombol tidak memicu klik kartu
            onToggleFavorite(movie);
          }}
          className="absolute top-3 right-3 p-2 bg-black/50 backdrop-blur-md rounded-full hover:bg-black/80 transition-colors"
        >
          <span className={isFavorite ? "text-red-500" : "text-white"}>
            {isFavorite ? "❤️" : "🤍"}
          </span>
        </button>

        <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-4">
           <p className="text-xs italic text-gray-300 line-clamp-3">{movie.overview}</p>
        </div>
      </div>
      <h3 className="mt-3 font-semibold text-sm truncate text-white">{movie.title}</h3>
      <p className="text-cyan-400 text-xs mt-1">⭐ {movie.vote_average ? movie.vote_average.toFixed(1) : '-'}</p>
    </div>
  );
};

export default MovieCard;
const MovieCard = ({ movie, theme, isFavorite, onToggleFavorite, onClick }) => {
  return (
    <div 
      onClick={onClick} 
      className="group relative cursor-pointer transition-all duration-300 hover:scale-105 active:scale-95"
    >
      {/* Container Gambar ala iPhone (Rounded Parah) */}
      <div className="relative aspect-[2/3] overflow-hidden rounded-[2.5rem] bg-white/5 border border-white/10 shadow-2xl transition-all group-hover:border-cyan-500/50">
        <img 
          src={movie.poster_path ? `https://image.tmdb.org/t/p/w500${movie.poster_path}` : "https://via.placeholder.com/500x750"} 
          alt={movie.title}
          className="w-full h-full object-cover"
        />
        
        {/* Tombol Favorit Melayang */}
        <button 
          onClick={(e) => {
            e.stopPropagation(); // Biar pas klik Love, gak malah buka detail
            onToggleFavorite(movie);
          }}
          className="absolute top-4 right-4 p-3 backdrop-blur-2xl bg-black/30 rounded-full border border-white/20 hover:bg-white/40 transition-all z-10"
        >
          <span className="text-lg leading-none">{isFavorite ? "❤️" : "🤍"}</span>
        </button>

        {/* Overlay saat Hover */}
        <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center p-6">
           <p className="text-[10px] text-gray-200 line-clamp-5 text-center italic">{movie.overview}</p>
        </div>
      </div>

      {/* Teks Judul */}
      <h3 className={`mt-3 px-2 font-bold text-xs truncate text-center ${theme === 'dark' ? 'text-gray-300' : 'text-gray-800'}`}>
        {movie.title}
      </h3>
    </div>
  );
};

export default MovieCard;
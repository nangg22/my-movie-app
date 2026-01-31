import { useState, useEffect } from 'react';
import MovieCard from './komponen/MovieCard';

function App() {
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedGenre, setSelectedGenre] = useState(null);
  const [selectedMovie, setSelectedMovie] = useState(null);
  const [trailerKey, setTrailerKey] = useState(null);
  const [theme, setTheme] = useState(localStorage.getItem('theme') || 'dark');
  const [favorites, setFavorites] = useState(() => JSON.parse(localStorage.getItem('movie-favorites')) || []);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  const API_KEY = import.meta.env.VITE_TMDB_KEY;
  const API_BASE_URL = "https://api.themoviedb.org/3";

  const genres = [
    { id: 28, name: 'Action' }, { id: 35, name: 'Comedy' },
    { id: 18, name: 'Drama' }, { id: 27, name: 'Horror' },
    { id: 10749, name: 'Romance' }, { id: 878, name: 'Sci-Fi' }
  ];

  useEffect(() => {
    localStorage.setItem('movie-favorites', JSON.stringify(favorites));
    theme === 'light' ? document.documentElement.classList.remove('dark') : document.documentElement.classList.add('dark');
  }, [favorites, theme]);

  const fetchMovies = async (query = '', genreId = null) => {
    try {
      setLoading(true);
      let endpoint = `${API_BASE_URL}/movie/popular?api_key=${API_KEY}`;
      if (query) endpoint = `${API_BASE_URL}/search/movie?api_key=${API_KEY}&query=${encodeURIComponent(query)}`;
      else if (genreId) endpoint = `${API_BASE_URL}/discover/movie?api_key=${API_KEY}&with_genres=${genreId}`;
      const response = await fetch(endpoint);
      const data = await response.json();
      setMovies(data.results || []);
    } catch (error) { console.error(error); }
    finally { setTimeout(() => setLoading(false), 500); }
  };

  const handleMovieDetail = async (movie) => {
    setSelectedMovie(movie);
    setTrailerKey(null);
    try {
      const res = await fetch(`${API_BASE_URL}/movie/${movie.id}/videos?api_key=${API_KEY}`);
      const data = await res.json();
      const trailer = data.results.find(v => v.type === 'Trailer' && v.site === 'YouTube');
      if (trailer) setTrailerKey(trailer.key);
    } catch (e) { console.error(e); }
  };

  useEffect(() => { fetchMovies(); }, []);

  const toggleFavorite = (movie) => {
    const isFav = favorites.some(f => f.id === movie.id);
    setFavorites(isFav ? favorites.filter(f => f.id !== movie.id) : [...favorites, movie]);
  };

  return (
    <div className={`min-h-screen transition-all duration-700 flex ${theme === 'dark' ? 'bg-[#050505] text-white' : 'bg-[#f2f2f7] text-black'}`}>
      
      {/* SIDEBAR DENGAN TOMBOL TUTUP DI DALAMNYA */}
      <aside className={`fixed lg:sticky top-0 left-0 z-50 h-screen transition-all duration-500 ease-in-out border-r backdrop-blur-3xl overflow-hidden
        ${isSidebarOpen ? 'w-72 p-8 opacity-100' : 'w-0 p-0 opacity-0'} 
        ${theme === 'dark' ? 'border-white/5 bg-black/60' : 'border-black/5 bg-white/60'}`}>
        
        <div className="min-w-[220px]">
          <div className="flex justify-between items-center mb-12">
            <h1 className="text-2xl font-black tracking-tighter bg-gradient-to-br from-cyan-400 to-purple-600 bg-clip-text text-transparent">MovieDruuu</h1>
            {/* Tombol Close di dalam Sidebar */}
            <button onClick={() => setIsSidebarOpen(false)} className="lg:hidden p-2 hover:bg-white/10 rounded-full transition-all">✕</button>
          </div>

          <nav className="space-y-2">
            <p className="text-[10px] uppercase tracking-[0.2em] text-gray-500 mb-6 font-bold">Discovery</p>
            <button onClick={() => { setSelectedGenre(null); fetchMovies(); }} 
              className={`w-full text-left px-5 py-3 rounded-2xl transition-all duration-300 transform active:scale-95 flex items-center gap-3 ${!selectedGenre ? 'bg-cyan-500 text-white shadow-lg shadow-cyan-500/40 font-bold' : 'hover:bg-white/10 opacity-60'}`}>
              <span>🔥</span> Trending
            </button>
            {genres.map(g => (
              <button key={g.id} onClick={() => { setSelectedGenre(g.id); fetchMovies('', g.id); }}
                className={`w-full text-left px-5 py-3 rounded-2xl transition-all duration-300 transform active:scale-95 flex items-center gap-3 ${selectedGenre === g.id ? 'bg-cyan-500 text-white shadow-lg shadow-cyan-500/40 font-bold' : 'hover:bg-white/10 opacity-60'}`}>
                <span className="opacity-50 text-[10px]">●</span> {g.name}
              </button>
            ))}
          </nav>
        </div>
      </aside>

      <main className="flex-1 flex flex-col min-w-0">
        <header className="sticky top-0 z-40 backdrop-blur-2xl bg-opacity-80 p-6 flex justify-between items-center px-6 lg:px-10">
          <div className="flex items-center gap-4 lg:gap-6 w-full">
            {/* Tombol Buka Sidebar (Hanya muncul jika sidebar tertutup) */}
            {!isSidebarOpen && (
              <button 
                onClick={() => setIsSidebarOpen(true)}
                className="p-3.5 rounded-2xl bg-cyan-500 text-white shadow-lg shadow-cyan-500/30 hover:scale-110 transition-all active:scale-90 animate-in slide-in-from-left duration-300"
              >
                <div className="w-5 h-4 flex flex-col justify-between">
                  <span className="h-0.5 bg-white rounded-full w-full"></span>
                  <span className="h-0.5 bg-white rounded-full w-2/3"></span>
                  <span className="h-0.5 bg-white rounded-full w-full"></span>
                </div>
              </button>
            )}
            
            <form onSubmit={(e) => { e.preventDefault(); fetchMovies(searchTerm); }} className="relative flex-1 max-w-md group">
              <input type="text" placeholder="Explore movies..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-6 py-3 rounded-2xl bg-white/5 border border-white/10 focus:bg-white/10 focus:border-cyan-500/50 focus:outline-none transition-all placeholder:text-gray-600 text-sm shadow-inner" />
              <button className="absolute right-3 top-2 px-3 py-1 bg-white/5 rounded-lg text-xs opacity-0 group-hover:opacity-100 transition-opacity">Enter</button>
            </form>
          </div>

          <button onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')} 
            className="ml-4 p-3.5 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/10 hover:rotate-12 transition-all active:scale-90 shadow-xl flex items-center justify-center">
            <span className="text-xl leading-none">{theme === 'dark' ? '☀️' : '🌙'}</span>
          </button>
        </header>

        <div className="px-6 lg:px-10 pb-20 mt-4">
          {/* Watchlist Section */}
          {favorites.length > 0 && !selectedGenre && !searchTerm && (
            <div className="mb-14 animate-in fade-in slide-in-from-bottom-4 duration-700">
              <h2 className="text-sm font-black uppercase tracking-[0.3em] text-gray-500 mb-6 flex items-center gap-3">
                <span className="w-2 h-2 bg-red-500 rounded-full animate-ping"></span> Your Watchlist
              </h2>
              <div className="flex gap-6 overflow-x-auto pb-6 scrollbar-hide">
                {favorites.map(m => <div key={m.id} className="min-w-[160px] md:min-w-[200px]"><MovieCard movie={m} theme={theme} isFavorite={true} onToggleFavorite={toggleFavorite} onClick={() => handleMovieDetail(m)} /></div>)}
              </div>
            </div>
          )}

          <h2 className="text-sm font-black uppercase tracking-[0.3em] text-gray-500 mb-8">
            {selectedGenre ? 'Filtered Catalog' : 'Popular Choice'}
          </h2>
          
          <div className={`grid gap-6 md:gap-8 transition-all duration-500 ease-in-out ${isSidebarOpen ? 'grid-cols-2 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5' : 'grid-cols-2 md:grid-cols-3 lg:grid-cols-5 xl:grid-cols-6'}`}>
            {movies.map(m => (
              <MovieCard key={m.id} movie={m} theme={theme} isFavorite={favorites.some(f => f.id === m.id)} onToggleFavorite={toggleFavorite} onClick={() => handleMovieDetail(m)} />
            ))}
          </div>
        </div>

        <footer className="mt-auto p-12 text-center border-t border-white/5 opacity-40 text-[10px] tracking-[0.4em] uppercase">
          Crafted by <span className="text-cyan-400 font-bold">Danang Prajadinata</span> • 2026 MovieDruuu Project
        </footer>
      </main>

      {/* MODAL DETAIL (DENGAN TOMBOL INTERAKTIF) */}
      {selectedMovie && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-8 bg-black/95 backdrop-blur-2xl animate-in zoom-in-95 duration-300">
          <div className={`relative max-w-6xl w-full rounded-[3.5rem] overflow-hidden shadow-[0_0_100px_rgba(0,0,0,0.5)] border border-white/10 ${theme === 'dark' ? 'bg-[#0a0a0a]' : 'bg-white'}`}>
            <button onClick={() => setSelectedMovie(null)} className="absolute top-8 right-8 z-[110] w-12 h-12 flex items-center justify-center bg-white/5 hover:bg-red-500 rounded-full text-white transition-all active:scale-75 shadow-2xl backdrop-blur-md border border-white/10">✕</button>
            <div className="flex flex-col lg:flex-row">
              <div className="w-full lg:w-[65%] bg-black h-[250px] md:h-[400px] lg:h-[600px] relative">
                {trailerKey ? (
                  <iframe className="w-full h-full" src={`https://www.youtube.com/embed/${trailerKey}?autoplay=1`} title="Trailer" frameBorder="0" allow="autoplay; encrypted-media" allowFullScreen></iframe>
                ) : (
                  <img className="w-full h-full object-cover opacity-50" src={`https://image.tmdb.org/t/p/original${selectedMovie.backdrop_path}`} alt="Backdrop" />
                )}
              </div>
              <div className="p-8 md:p-12 lg:w-[35%] flex flex-col justify-center bg-gradient-to-br from-transparent to-white/5">
                <h2 className="text-3xl md:text-4xl font-black mb-6 leading-[1.1] tracking-tighter">{selectedMovie.title}</h2>
                <div className="flex items-center gap-4 mb-8">
                  <div className="px-4 py-2 bg-cyan-500 text-white rounded-2xl text-[10px] font-black italic shadow-lg shadow-cyan-500/30 flex items-center gap-2"><span>⭐</span> {selectedMovie.vote_average.toFixed(1)}</div>
                  <span className="text-gray-500 text-[10px] font-bold tracking-widest">{selectedMovie.release_date?.split('-')[0]}</span>
                </div>
                <p className={`text-sm leading-relaxed mb-12 line-clamp-6 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-700'}`}>{selectedMovie.overview}</p>
                <button onClick={() => toggleFavorite(selectedMovie)} 
                  className={`group w-full py-5 rounded-[2rem] font-black text-xs uppercase tracking-[0.2em] transition-all duration-300 active:scale-95 shadow-2xl ${favorites.some(f => f.id === selectedMovie.id) ? 'bg-red-500 text-white shadow-red-500/20' : 'bg-white text-black hover:bg-cyan-500 hover:text-white'}`}>
                  {favorites.some(f => f.id === selectedMovie.id) ? '❤️ Remove From Watchlist' : '🤍 Add to Watchlist'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
import { useState, useEffect } from 'react';
import MovieCard from './komponen/MovieCard';

function App() {
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [theme, setTheme] = useState(localStorage.getItem('theme') || 'dark');
  
  // KEMBALIKAN STATE FAVORIT
  const [favorites, setFavorites] = useState(() => {
    const saved = localStorage.getItem('movie-favorites');
    return saved ? JSON.parse(saved) : [];
  });

  const API_KEY = "be963e3309400bc78a2073f8cd369708"; 
  const API_BASE_URL = "https://api.themoviedb.org/3";

  useEffect(() => {
    localStorage.setItem('movie-favorites', JSON.stringify(favorites));
  }, [favorites]);

  useEffect(() => {
    theme === 'light' ? document.documentElement.classList.remove('dark') : document.documentElement.classList.add('dark');
    localStorage.setItem('theme', theme);
  }, [theme]);

  const fetchMovies = async (query = '') => {
    try {
      setLoading(true);
      const endpoint = query 
        ? `${API_BASE_URL}/search/movie?api_key=${API_KEY}&query=${encodeURIComponent(query)}`
        : `${API_BASE_URL}/movie/popular?api_key=${API_KEY}`;
      const response = await fetch(endpoint);
      const data = await response.json();
      setMovies(data.results || []);
    } catch (error) { console.error(error); }
    finally { setTimeout(() => setLoading(false), 500); }
  };

  useEffect(() => { fetchMovies(); }, []);

  const toggleFavorite = (movie) => {
    const isFav = favorites.some(fav => fav.id === movie.id);
    isFav ? setFavorites(favorites.filter(f => f.id !== movie.id)) : setFavorites([...favorites, movie]);
  };

  // FUNGSI SAAT FILM DIKLIK
  const handleMovieClick = (movie) => {
    alert(`🎬 ${movie.title}\n\nRating: ⭐ ${movie.vote_average}\nRelease: ${movie.release_date}\n\nSinopsis: ${movie.overview}`);
  };

  return (
    <div className={`min-h-screen transition-all duration-700 ${theme === 'dark' ? 'bg-[#000000] text-white' : 'bg-[#f2f2f7] text-black'}`}>
      
      {/* Header Ala iOS Glassmorphism */}
      <header className="sticky top-0 z-50 backdrop-blur-2xl bg-opacity-70 border-b border-white/10 p-6 mb-8">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
          <h1 className="text-3xl font-bold tracking-tight bg-gradient-to-b from-white to-gray-400 bg-clip-text text-transparent">
            MovieDruuu
          </h1>
          
          <div className="flex items-center gap-3 w-full md:w-auto">
            <button onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
              className="p-3 rounded-full bg-white/10 border border-white/20 hover:bg-white/20 transition-all">
              {theme === 'dark' ? '☀️' : '🌙'}
            </button>

            <form onSubmit={(e) => { e.preventDefault(); fetchMovies(searchTerm); }} className="relative w-full md:w-72">
              <input 
                type="text" 
                className="w-full px-5 py-2.5 rounded-full bg-white/10 border border-white/20 focus:bg-white/20 focus:outline-none transition-all placeholder:text-gray-500"
                placeholder="Search..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </form>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6">
        {/* SECTION FAVORIT (WATCHLIST) */}
        {favorites.length > 0 && (
          <section className="mb-12">
            <h2 className="text-xl font-semibold mb-6 flex items-center gap-2">❤️ Watchlist</h2>
            <div className="flex gap-5 overflow-x-auto pb-6 scrollbar-hide">
              {favorites.map(movie => (
                <div key={movie.id} className="min-w-[160px] md:min-w-[200px]">
                  <MovieCard 
                    movie={movie} 
                    theme={theme} 
                    isFavorite={true} 
                    onToggleFavorite={toggleFavorite}
                    onClick={() => handleMovieClick(movie)}
                  />
                </div>
              ))}
            </div>
            <div className="h-[1px] bg-white/10 w-full my-8"></div>
          </section>
        )}

        <h2 className="text-xl font-semibold mb-6">Trending Now</h2>
        {loading ? (
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-5">
            {[...Array(12)].map((_, i) => <div key={i} className="h-64 bg-white/5 rounded-3xl animate-pulse"></div>)}
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-5">
            {movies.map((movie) => (
              <MovieCard 
                key={movie.id} 
                movie={movie} 
                theme={theme}
                isFavorite={favorites.some(f => f.id === movie.id)}
                onToggleFavorite={toggleFavorite}
                onClick={() => handleMovieClick(movie)}
              />
            ))}
          </div>
        )}
      </main>
    </div>
  );
}

export default App;
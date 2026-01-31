import { useState, useEffect } from 'react';
import MovieCard from './komponen/MovieCard'; // Import komponen yang tadi dibuat

function App() {
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState(''); // State untuk menyimpan text pencarian

  const API_KEY = "80f1367d337f748f21977755f11075a3"; 
  const API_BASE_URL = "https://api.themoviedb.org/3";

  // Fungsi untuk mengambil data (bisa Popular atau Search)
const fetchMovies = async (query = '') => {
  try {
    setLoading(true);
    const endpoint = query 
      ? `${API_BASE_URL}/search/movie?api_key=${API_KEY}&query=${encodeURIComponent(query)}`
      : `${API_BASE_URL}/movie/popular?api_key=${API_KEY}`;

    const response = await fetch(endpoint);
    
    if (!response.ok) {
      throw new Error("Gagal mengambil data dari server");
    }

    const data = await response.json();
    
    // Pastikan data.results ada sebelum di-set ke state
    if (data.results) {
      setMovies(data.results);
    } else {
      setMovies([]);
    }
  } catch (error) {
    console.error("Terjadi Eror:", error);
    alert("Koneksi bermasalah atau API Key salah!");
  } finally {
    // Beri jeda sedikit agar transisi loading lebih halus
    setTimeout(() => {
      setLoading(false);
    }, 300);
  }
};

  // Jalankan saat pertama kali website dibuka
  useEffect(() => {
    fetchMovies();
  }, []);

  // Jalankan saat tombol Search diklik atau Enter ditekan
  const handleSearch = (e) => {
    e.preventDefault(); // Mencegah reload halaman
    fetchMovies(searchTerm);
  };

  return (
    <div className="min-h-screen bg-slate-900 text-white p-6 font-sans">
      
      {/* Header & Search Bar */}
      <header className="flex flex-col md:flex-row justify-between items-center mb-10 gap-4">
        <h1 className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-600">
          MovieDruuu
        </h1>
        
        {/* Form Search */}
        <form onSubmit={handleSearch} className="flex gap-2 w-full md:w-auto">
        <input 
          id="search-input"
          name="search"
          type="text" 
          placeholder="Cari film Marvel..." 
          className="px-4 py-2 rounded-lg bg-slate-800 border border-slate-700 focus:outline-none focus:border-cyan-400 w-full"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
          <button 
            type="submit"
            className="bg-cyan-600 hover:bg-cyan-700 px-6 py-2 rounded-lg font-bold transition-colors"
          >
            Cari
          </button>
        </form>
      </header>

      {/* Content Area */}
      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-cyan-400"></div>
        </div>
      ) : (
        <>
          {movies.length > 0 ? (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
              {/* Di sini kita panggil Component MovieCard berulang-ulang */}
              {movies.map((movie) => (
                <MovieCard key={movie.id} movie={movie} />
              ))}
            </div>
          ) : (
            <div className="text-center text-gray-500 mt-10">
              <p>Film tidak ditemukan 😔</p>
            </div>
          )}
        </>
      )}
    </div>
  );
}

export default App;
import MovieCard from "./components/MovieCard";
import Search from "./components/Search";
import { useState, useEffect } from "react";

const API_BASE_URL = "https://api.themoviedb.org/3";
const API_KEY = import.meta.env.VITE_TMDB_API_KEY;

const API_OPTIONS = {
  method: "GET",
  headers: {
    accept: "application/json",
    Authorization: `Bearer ${API_KEY}`,
  },
};

const App = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [movieList, setMovieList] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchMovies = async (query = "") => {
    setLoading(true);
    setErrorMessage("");

    // Check if API key is available
    if (!API_KEY) {
      setErrorMessage(
        "API key is not configured. Please check your environment variables."
      );
      setLoading(false);
      return;
    }

    try {
      // Use only the base endpoint - no query parameters with Bearer token
      let endpoint;

      // Step 1: Check if we're searching or showing popular movies
      if (query.trim()) {
        // We're searching - use search endpoint
        endpoint = `${API_BASE_URL}/search/movie?query=${encodeURIComponent(
          query
        )}`;
      } else {
        // We're showing popular movies - use popular endpoint
        endpoint = `${API_BASE_URL}/movie/popular`;
      }

      console.log("Fetching from:", endpoint);
      console.log("With headers:", API_OPTIONS.headers);

      const response = await fetch(endpoint, API_OPTIONS);

      console.log("Response status:", response.status);

      if (!response.ok) {
        throw new Error(`Failed to fetch movies. Status: ${response.status}`);
      }

      const data = await response.json();
      console.log("API Response data:", data);

      // TMDB uses 'success' property for errors, not 'response'
      if (data.success === false) {
        setErrorMessage(data.status_message || "Error fetching movies");
        setMovieList([]);
        return;
      }

      // Check if results exist
      if (!data.results || data.results.length === 0) {
        if (query.trim()) {
          setErrorMessage(`No movies found for "${query}"`);
        } else {
          ("No popular movies found");
        }
        setErrorMessage("No movies found");
        setMovieList([]);
        return;
      }

      setMovieList(data.results);
    } catch (error) {
      console.error(`Error fetching movies: ${error}`);
      setErrorMessage("Error fetching movies. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // This will now handle both initial load and search changes
    const timer = setTimeout(() => {
      fetchMovies(searchTerm);
    }, 500);

    return () => clearTimeout(timer);
  }, [searchTerm]);

  // Add this useEffect for debouncing
  useEffect(() => {
    const timer = setTimeout(() => {
      if (searchTerm) {
        fetchMovies(searchTerm);
      } else {
        fetchMovies(); // Show popular movies when search is empty
      }
    }, 500); // Wait 500ms after user stops typing

    return () => clearTimeout(timer); // Cleanup on unmount or when searchTerm changes
  }, [searchTerm]);

  return (
    <main className="bg-slate-900 min-h-screen w-screen text-white">
      <div className="pattern" />

      <div className="flex flex-col justify-center items-center">
        <header>
          <img src="hero.png" alt="Hero Banner" className="mx-auto" />
          <h1 className="text-xl sm:text-2xl md:text-3xl max-width-[500px] text-center mt-4">
            Find <span className="text-purple-400">Movies</span> You'll Enjoy
            Without the Hassle
          </h1>
          <Search searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
          <h1 className="text-white">{searchTerm}</h1>
        </header>

        <section>
          <h2 className="text-lg sm:text-xl md:text-2xl lg:text-3xl text-whit border-purple-500 border-2 m-16 rounded-lg text-center p-2 mx-auto my-8 max-w-xs sm:max-w-sm md:max-w-md lg:max-w-lg">
            ALL MOVIES AVAILABLE
          </h2>

          {loading ? (
            <p className="text-3xl text-green-400">Loading....</p>
          ) : errorMessage ? (
            <p className="text-red-500">{errorMessage}</p>
          ) : (
            <div>
              {/* Result count inside the success block */}
              <p className="text-purple-300 text-center mb-4">
                Found {movieList.length} movies
                {searchTerm ? ` for "${searchTerm}"` : ""}
              </p>
              <div className="flex flex-wrap justify-center gap-4 md:gap-6 lg:gap-8">
                {movieList.map((movie) => (
                  <MovieCard
                    key={movie.id}
                    title={movie.title}
                    vote_average={movie.vote_average}
                    poster_path={movie.poster_path}
                    release_date={movie.release_date}
                    original_language={movie.original_language}
                  />
                ))}
              </div>
            </div>
          )}
        </section>
      </div>
    </main>
  );
};

export default App;

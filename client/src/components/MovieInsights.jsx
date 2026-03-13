import { useState } from 'react';
import { Film, Loader2, AlertCircle } from 'lucide-react';
import axios from 'axios';
export default function MovieInsights() {
  const [movieTitle, setMovieTitle] = useState('');
  const [insights, setInsights] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const fetchInsights = async () => {
    if (!movieTitle.trim()) {
      setError('Please enter a movie title');
      return;
    }

    setLoading(true);
    setError('');
    setInsights('');

    try {
      const response = await axios.post('/api/show/movie/insight' , {movieTitle});

      if (!response.ok) {
        throw new Error(`Error: ${response.status} ${response.statusText}`);
      }

      const data = await response
      setInsights(data.insights || data.message || 'No insights available');
    } catch (err) {
      setError(err.message || 'Failed to fetch movie insights');
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      fetchInsights();
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 flex items-center justify-center p-4">
      <div className="w-full max-w-3xl bg-white/10 backdrop-blur-lg rounded-2xl shadow-2xl p-8">
        <div className="flex items-center gap-3 mb-6">
          <Film className="w-8 h-8 text-purple-300" />
          <h1 className="text-3xl font-bold text-white">Movie Insights</h1>
        </div>

        <div className="mb-6">
          <div className="flex gap-3">
            <input
              type="text"
              value={movieTitle}
              onChange={(e) => setMovieTitle(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Enter movie title..."
              className="flex-1 px-4 py-3 bg-white/20 border border-white/30 rounded-lg text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-purple-400"
            />
            <button
              onClick={fetchInsights}
              disabled={loading}
              className="px-6 py-3 bg-purple-600 hover:bg-purple-700 disabled:bg-purple-800 disabled:cursor-not-allowed text-white font-semibold rounded-lg transition-colors duration-200 flex items-center gap-2"
            >
              {loading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Loading...
                </>
              ) : (
                'Get Insights'
              )}
            </button>
          </div>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-500/20 border border-red-400/50 rounded-lg flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-red-300 flex-shrink-0 mt-0.5" />
            <p className="text-red-200">{error}</p>
          </div>
        )}

        {insights && (
          <div className="bg-white/20 backdrop-blur-sm rounded-lg p-6 border border-white/30">
            <h2 className="text-xl font-semibold text-purple-200 mb-4">Insights:</h2>
            <p className="text-white/90 leading-relaxed whitespace-pre-wrap">{insights}</p>
          </div>
        )}

        {!insights && !loading && !error && (
          <div className="text-center text-white/60 py-12">
            <Film className="w-16 h-16 mx-auto mb-4 opacity-50" />
            <p>Enter a movie title to get detailed insights</p>
          </div>
        )}
      </div>
    </div>
  );
}
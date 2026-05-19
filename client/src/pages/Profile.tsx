import { useEffect, useState } from "react";
import SoftBackdrop from "../components/SoftBackdrop";
import { useAuth } from "../context/AuthContext";
import { ScrollText, Image, Activity, Star, Clock, ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function Profile() {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [stats, setStats] = useState({
    scriptsGenerated: 0,
    thumbnailsGenerated: 0,
    totalUsage: 0,
    favoriteCategory: "None",
  });
  
  const [recentScripts, setRecentScripts] = useState<any[]>([]);
  const [recentThumbnails, setRecentThumbnails] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProfileData = async () => {
      try {
        const res = await fetch("http://localhost:3000/api/user/profile", {
          credentials: "include",
        });
        const data = await res.json();
        
        if (res.ok) {
          setStats(data.stats);
          setRecentScripts(data.recent.scripts);
          setRecentThumbnails(data.recent.thumbnails);
        }
      } catch (err) {
        console.error("Failed to fetch profile stats", err);
      } finally {
        setLoading(false);
      }
    };

    fetchProfileData();
  }, []);

  return (
    <div>
      <SoftBackdrop />
      <div className="pt-32 pb-24 min-h-screen px-4 md:px-16 lg:px-24 xl:px-32">
        
        {/* Profile Header */}
        <div className="mb-12 flex items-center gap-6 bg-white/5 border border-white/10 rounded-3xl p-8 shadow-2xl">
          <div className="w-20 h-20 rounded-full bg-gradient-to-tr from-pink-500 to-purple-500 flex items-center justify-center text-3xl font-bold text-white shadow-lg">
            {user?.name?.[0]?.toUpperCase() || "U"}
          </div>
          <div>
            <h1 className="text-3xl font-bold text-zinc-100">{user?.name || "User"}</h1>
            <p className="text-zinc-400 mt-1 text-sm md:text-base">
              {user?.email || "user@example.com"}
            </p>
          </div>
        </div>

        {/* Stats Grid */}
        <h2 className="text-xl font-semibold text-zinc-200 mb-6">Overview</h2>
        {loading ? (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 mb-16">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-32 bg-white/5 border border-white/10 rounded-2xl animate-pulse" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 mb-16">
            <div className="bg-white/5 border border-white/10 rounded-2xl p-6 hover:bg-white/10 transition">
              <div className="flex items-center gap-3 text-pink-400 mb-4">
                <ScrollText size={20} />
                <span className="text-sm font-medium">Scripts Generated</span>
              </div>
              <p className="text-4xl font-bold text-white">{stats.scriptsGenerated}</p>
            </div>

            <div className="bg-white/5 border border-white/10 rounded-2xl p-6 hover:bg-white/10 transition">
              <div className="flex items-center gap-3 text-blue-400 mb-4">
                <Image size={20} />
                <span className="text-sm font-medium">Thumbnail Ideas</span>
              </div>
              <p className="text-4xl font-bold text-white">{stats.thumbnailsGenerated}</p>
            </div>

            <div className="bg-white/5 border border-white/10 rounded-2xl p-6 hover:bg-white/10 transition">
              <div className="flex items-center gap-3 text-purple-400 mb-4">
                <Star size={20} />
                <span className="text-sm font-medium">Favorite Category</span>
              </div>
              <p className="text-xl font-bold text-white truncate">{stats.favoriteCategory}</p>
            </div>

            <div className="bg-white/5 border border-white/10 rounded-2xl p-6 hover:bg-white/10 transition">
              <div className="flex items-center gap-3 text-emerald-400 mb-4">
                <Activity size={20} />
                <span className="text-sm font-medium">Total AI Prompts</span>
              </div>
              <p className="text-4xl font-bold text-white">{stats.totalUsage}</p>
            </div>
          </div>
        )}

        {/* Recent Generations */}
        <div className="grid lg:grid-cols-2 gap-12">
          
          {/* Recent Scripts */}
          <div>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-zinc-200">Recent Scripts</h2>
              <button 
                onClick={() => navigate('/my-generation')}
                className="text-sm text-pink-500 hover:text-pink-400 flex items-center gap-1 transition"
              >
                View All <ArrowRight size={14} />
              </button>
            </div>
            
            <div className="space-y-4">
              {loading ? (
                 [...Array(3)].map((_, i) => (
                  <div key={i} className="h-24 bg-white/5 border border-white/10 rounded-2xl animate-pulse" />
                ))
              ) : recentScripts.length > 0 ? (
                recentScripts.map((script) => (
                  <div key={script._id} className="bg-white/5 border border-white/10 rounded-2xl p-5 hover:border-pink-500/30 transition group flex flex-col justify-center min-h-[96px]">
                    <div className="flex items-center justify-between gap-4">
                      <h3 className="text-zinc-100 font-medium truncate flex-1">{script.title}</h3>
                      <span className="text-xs text-zinc-500 flex items-center gap-1 shrink-0">
                        <Clock size={12} /> {new Date(script.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 mt-2">
                      <span className="text-[10px] px-2 py-0.5 rounded bg-pink-500/10 text-pink-400 border border-pink-500/20">{script.tone}</span>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-10 bg-white/5 border border-white/10 rounded-2xl">
                  <p className="text-zinc-400 text-sm">No scripts generated yet.</p>
                </div>
              )}
            </div>
          </div>

          {/* Recent Thumbnails */}
          <div>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-zinc-200">Recent Thumbnails</h2>
              <button 
                onClick={() => navigate('/my-generation')}
                className="text-sm text-pink-500 hover:text-pink-400 flex items-center gap-1 transition"
              >
                View All <ArrowRight size={14} />
              </button>
            </div>
            
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-2 gap-4">
              {loading ? (
                [...Array(2)].map((_, i) => (
                  <div key={i} className="aspect-video bg-white/5 border border-white/10 rounded-2xl animate-pulse" />
                ))
              ) : recentThumbnails.length > 0 ? (
                recentThumbnails.map((thumb) => (
                  <div key={thumb._id} className="group relative rounded-2xl overflow-hidden bg-black border border-white/10 aspect-video">
                    {thumb.image_url ? (
                      <img src={thumb.image_url} alt={thumb.title} className="w-full h-full object-cover group-hover:scale-105 transition duration-500" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-xs text-zinc-500 bg-white/5">Generating...</div>
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition duration-300 flex items-end p-3">
                      <p className="text-xs font-medium text-white line-clamp-1">{thumb.title}</p>
                    </div>
                  </div>
                ))
              ) : (
                <div className="col-span-full text-center py-10 bg-white/5 border border-white/10 rounded-2xl">
                  <p className="text-zinc-400 text-sm">No thumbnails generated yet.</p>
                </div>
              )}
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}

import { useEffect, useState } from "react";
import SoftBackdrop from "../components/SoftBackdrop";
import { type IThumbnail } from "../assets/assets";
import { Link, useNavigate } from "react-router-dom";
import { ArrowUpRightIcon, DownloadIcon, TrashIcon, Image, ScrollText, X, Clock } from "lucide-react";
import ScriptPanel from "../components/ScriptPanel";

type Tab = "thumbnails" | "scripts";

const MyGeneration = () => {
  const navigate = useNavigate();

  const aspectRatioClassMap: Record<string, string> = {
    "16:9": "aspect-video",
    "1:1": "aspect-square",
    "9:16": "aspect-[9/16]",
  };

  const [activeTab, setActiveTab] = useState<Tab>("thumbnails");

  const [thumbnails, setThumbnails] = useState<IThumbnail[]>([]);
  const [scripts, setScripts] = useState<any[]>([]);
  
  const [thumbLoading, setThumbLoading] = useState(false);
  const [scriptLoading, setScriptLoading] = useState(false);

  const [viewScript, setViewScript] = useState<any | null>(null);
  const [viewThumbnail, setViewThumbnail] = useState<IThumbnail | null>(null);

  // Fetch Thumbnails from API
  const fetchThumbnails = async () => {
    setThumbLoading(true);
    try {
      const res = await fetch("http://localhost:3000/api/user/thumbnails", {
        credentials: "include",
      });
      const data = await res.json();
      if (res.ok) setThumbnails(data.thumbnails);
    } catch (err) {
      console.error(err);
    } finally {
      setThumbLoading(false);
    }
  };

  // Fetch Scripts from API
  const fetchScripts = async () => {
    setScriptLoading(true);
    try {
      const res = await fetch("http://localhost:3000/api/script/user", {
        credentials: "include",
      });
      const data = await res.json();
      if (res.ok) setScripts(data.scripts);
    } catch (err) {
      console.error(err);
    } finally {
      setScriptLoading(false);
    }
  };

  const handleDownload = (image_url: string) => {
    window.open(image_url, "_blank");
  };

  const handleDeleteThumbnail = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      const res = await fetch(`http://localhost:3000/api/thumbnail/delete/${id}`, {
        method: "DELETE",
        credentials: "include",
      });
      if (res.ok) {
        setThumbnails((prev) => prev.filter((t) => t._id !== id));
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeleteScript = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      const res = await fetch(`http://localhost:3000/api/script/delete/${id}`, {
        method: "DELETE",
        credentials: "include",
      });
      if (res.ok) {
        setScripts((prev) => prev.filter((s) => s._id !== id));
      }
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    if (activeTab === "thumbnails") fetchThumbnails();
    if (activeTab === "scripts") fetchScripts();
  }, [activeTab]);

  return (
    <div>
      <SoftBackdrop />
      <div className="mt-32 min-h-screen px-6 md:px-16 lg:px-24 xl:px-32">
        
        {/* Header & Tabs */}
        <div className="mb-8 flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div>
            <h1 className="text-2xl font-bold text-zinc-200">My Generations</h1>
            <p className="text-sm text-zinc-400 mt-1">View and manage all your AI-generated content</p>
          </div>

          <div className="flex gap-2 p-1 bg-white/5 border border-white/10 rounded-xl w-fit">
            <button
              onClick={() => setActiveTab("thumbnails")}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 ${
                activeTab === "thumbnails"
                  ? "bg-pink-500 text-white shadow-lg shadow-pink-500/25"
                  : "text-zinc-400 hover:text-zinc-200"
              }`}
            >
              <Image size={16} /> Thumbnails
            </button>
            <button
              onClick={() => setActiveTab("scripts")}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 ${
                activeTab === "scripts"
                  ? "bg-pink-500 text-white shadow-lg shadow-pink-500/25"
                  : "text-zinc-400 hover:text-zinc-200"
              }`}
            >
              <ScrollText size={16} /> Scripts
            </button>
          </div>
        </div>

        {/* ─── THUMBNAILS TAB ─── */}
        {activeTab === "thumbnails" && (
          <>
            {thumbLoading && (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {Array.from({ length: 6 }).map((_, i) => (
                  <div key={i} className="rounded-2xl bg-white/6 border border-white/10 animate-pulse h-[260px]" />
                ))}
              </div>
            )}
            {!thumbLoading && thumbnails.length === 0 && (
              <div className="text-center py-24 bg-white/5 rounded-2xl border border-white/10">
                <Image size={48} className="mx-auto text-zinc-600 mb-4" />
                <h3 className="text-lg font-semibold text-zinc-200">No thumbnails yet</h3>
                <p className="text-sm text-zinc-400 mt-2">Generate your first thumbnail to see it here</p>
              </div>
            )}
            {!thumbLoading && thumbnails.length > 0 && (
              <div className="columns-1 sm:columns-2 lg:columns-3 2xl:columns-4 gap-8">
                {thumbnails.map((thumb: IThumbnail) => {
                  const aspectClasse = aspectRatioClassMap[thumb.aspect_ratio || "16:9"];
                  return (
                    <div
                      key={thumb._id}
                      onClick={() => navigate(`/generate/${thumb._id}`)}
                      className="mb-8 group relative cursor-pointer rounded-2xl bg-white/6 border-white/10 transition shadow-xl break-inside-avoid"
                    >
                      <div 
                        className={`relative overflow-hidden rounded-t-2xl ${aspectClasse} bg-black`}
                        onClick={(e) => { e.stopPropagation(); setViewThumbnail(thumb); }}
                      >
                        {thumb.image_url ? (
                          <img
                            src={thumb.image_url}
                            alt={thumb.title}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-sm text-zinc-400">
                            {thumb.isGenerating ? "Generating.." : "No image"}
                          </div>
                        )}
                        {thumb.isGenerating && (
                          <div className="absolute inset-0 bg-black/50 flex items-center justify-center text-sm font-medium text-white">
                            Generating..
                          </div>
                        )}
                      </div>
                      <div className="p-4 space-y-2">
                        <h3 className="text-sm font-semibold text-zinc-100 line-clamp-2">{thumb.title}</h3>
                        <div className="flex flex-wrap gap-2 text-xs text-zinc-400">
                          <span className="px-2 py-0.5 rounded bg-white/8">{thumb.style}</span>
                          <span className="px-2 py-0.5 rounded bg-white/8">{thumb.color_scheme}</span>
                          <span className="px-2 py-0.5 rounded bg-white/8">{thumb.aspect_ratio}</span>
                        </div>
                        <p className="text-sm text-zinc-500 flex items-center gap-1">
                          <Clock size={12} /> {thumb.createdAt ? new Date(thumb.createdAt).toDateString() : "Recently"}
                        </p>
                      </div>
                      <div
                        onClick={(e) => e.stopPropagation()}
                        className="absolute bottom-2 right-2 max-sm:flex sm:hidden group-hover:flex gap-1.5"
                      >
                        <TrashIcon
                          onClick={(e) => handleDeleteThumbnail(thumb._id, e)}
                          className="size-6 bg-black/50 p-1 rounded hover:bg-pink-600 transition-all text-white cursor-pointer"
                        />
                        <DownloadIcon
                          onClick={() => handleDownload(thumb.image_url!)}
                          className="size-6 bg-black/50 p-1 rounded hover:bg-pink-600 transition-all text-white cursor-pointer"
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </>
        )}

        {/* ─── SCRIPTS TAB ─── */}
        {activeTab === "scripts" && (
          <>
            {scriptLoading && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {Array.from({ length: 6 }).map((_, i) => (
                  <div key={i} className="rounded-2xl bg-white/6 border border-white/10 animate-pulse h-40" />
                ))}
              </div>
            )}
            {!scriptLoading && scripts.length === 0 && (
              <div className="text-center py-24 bg-white/5 rounded-2xl border border-white/10">
                <ScrollText size={48} className="mx-auto text-zinc-600 mb-4" />
                <h3 className="text-lg font-semibold text-zinc-200">No scripts yet</h3>
                <p className="text-sm text-zinc-400 mt-2">Generate your first script to see it here</p>
              </div>
            )}
            {!scriptLoading && scripts.length > 0 && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {scripts.map((script) => (
                  <div
                    key={script._id}
                    onClick={() => setViewScript(script)}
                    className="group relative cursor-pointer rounded-2xl bg-white/6 border border-white/10 hover:border-pink-500/50 hover:bg-white/10 transition-all shadow-xl p-5 flex flex-col justify-between min-h-[160px]"
                  >
                    <div>
                      <h3 className="text-base font-semibold text-zinc-100 line-clamp-2 pr-8">{script.title}</h3>
                      <div className="flex flex-wrap gap-2 text-xs text-zinc-400 mt-3">
                        <span className="px-2 py-0.5 rounded bg-pink-500/10 text-pink-400 border border-pink-500/20">{script.tone}</span>
                        <span className="px-2 py-0.5 rounded bg-blue-500/10 text-blue-400 border border-blue-500/20">{script.length}</span>
                      </div>
                    </div>
                    
                    <div className="mt-4 flex items-center justify-between text-xs text-zinc-500">
                      <div className="flex items-center gap-1.5">
                        <Clock size={13} />
                        {new Date(script.createdAt).toLocaleDateString()} at {new Date(script.createdAt).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                      </div>
                    </div>

                    <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button
                        onClick={(e) => handleDeleteScript(script._id, e)}
                        className="p-2 rounded-lg bg-black/40 hover:bg-pink-600 text-zinc-400 hover:text-white transition-all"
                        title="Delete Script"
                      >
                        <TrashIcon size={14} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </>
        )}
      </div>

      {/* Script View Modal */}
      {viewScript && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6 bg-black/80 backdrop-blur-sm">
          <div className="bg-zinc-900 border border-white/10 rounded-2xl w-full max-w-4xl max-h-[90vh] flex flex-col shadow-2xl relative">
            <div className="flex items-center justify-between p-6 border-b border-white/10">
              <div>
                <h2 className="text-xl font-bold text-zinc-100 pr-12">{viewScript.title}</h2>
                <div className="flex gap-2 text-xs mt-2">
                  <span className="text-zinc-400"><Clock size={12} className="inline mr-1"/>{new Date(viewScript.createdAt).toLocaleString()}</span>
                </div>
              </div>
              <button 
                onClick={() => setViewScript(null)}
                className="absolute top-6 right-6 p-2 rounded-full bg-white/5 hover:bg-white/10 text-zinc-400 transition-colors"
              >
                <X size={20} />
              </button>
            </div>
            <div className="p-6 overflow-y-auto custom-scrollbar flex-1 bg-black/20">
              <ScriptPanel script={viewScript} isLoading={false} />
            </div>
          </div>
        </div>
      )}

      {/* Thumbnail View Modal */}
      {viewThumbnail && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-8 bg-black/90 backdrop-blur-md" onClick={() => setViewThumbnail(null)}>
          <div 
            className="relative flex flex-col items-center justify-center max-w-5xl w-full"
            onClick={(e) => e.stopPropagation()}
          >
            <button 
              onClick={() => setViewThumbnail(null)}
              className="absolute -top-12 right-0 p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors"
            >
              <X size={24} />
            </button>
            <div className={`relative w-full ${aspectRatioClassMap[viewThumbnail.aspect_ratio || "16:9"]} bg-black rounded-xl overflow-hidden shadow-2xl border border-white/20`}>
                <img
                  src={viewThumbnail.image_url}
                  alt={viewThumbnail.title}
                  className="w-full h-full object-contain"
                />
            </div>
            <div className="mt-4 text-center">
              <h2 className="text-xl font-bold text-white">{viewThumbnail.title}</h2>
              <p className="text-zinc-400 mt-1">Generated on {viewThumbnail.createdAt ? new Date(viewThumbnail.createdAt).toLocaleDateString() : "Recently"}</p>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default MyGeneration;
import { useEffect, useState } from "react";
import { useParams, useLocation } from "react-router-dom";
import { Image, ScrollText } from "lucide-react";
import {
  colorSchemes,
  type AspectRatio,
  type IThumbnail,
  type ThumbnailStyle,
} from "../assets/assets";
import SoftBackdrop from "../components/SoftBackdrop";
import AspectRatioSelector from "../components/AspectRatioSelector";
import StyleSelector from "../components/StyleSelector";
import ColorSchemeSelector from "../components/ColorSchemeSelector";
import PreviewPanel from "../components/PreviewPanel";
import ScriptPanel from "../components/ScriptPanel";

type Tab = "thumbnail" | "script";
type Tone = "Educational" | "Casual" | "Professional" | "Entertaining";
type VideoLength = "Short" | "Medium" | "Long";

interface IScript {
  hook: string; intro: string; main_content: string;
  statistics: string; outro: string; cta: string;
}

const Generate = () => {
  const { id } = useParams();
  const location = useLocation();

  /* ── Shared ── */
  const [activeTab, setActiveTab] = useState<Tab>("thumbnail");
  const [title, setTitle] = useState("");

  /* ── Thumbnail state ── */
  const [additionalDetails, setAdditionalDetails] = useState("");
  const [thumbnail, setThumbnail] = useState<IThumbnail | null>(null);
  const [thumbLoading, setThumbLoading] = useState(false);
  const [aspectRatio, setAspectRatio] = useState<AspectRatio>("16:9");
  const [colorSchemeId, setColorSchemeId] = useState<string>(colorSchemes[0].id);
  const [style, setStyle] = useState<ThumbnailStyle>("Bold & Graphic");
  const [styleDropdownOpen, setStyleDropdownOpen] = useState(false);

  /* ── Script state ── */
  const [script, setScript] = useState<IScript | null>(null);
  const [scriptLoading, setScriptLoading] = useState(false);
  const [tone, setTone] = useState<Tone>("Educational");
  const [videoLength, setVideoLength] = useState<VideoLength>("Medium");

  /* ── Initialize from location state ── */
  useEffect(() => {
    if (location.state?.prefilledTitle) {
      setTitle(location.state.prefilledTitle);
    }
    if (location.state?.tab) {
      setActiveTab(location.state.tab as Tab);
    }
  }, [location.state]);

  /* ── Handlers ── */
  const handleGenerateThumbnail = async () => {
    if (!title.trim()) { alert("Please enter a title or topic."); return; }
    setThumbLoading(true);
    setThumbnail(null);
    try {
      const res = await fetch("http://localhost:3000/api/thumbnail/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          title, prompt: additionalDetails,
          style, aspect_ratio: aspectRatio,
          color_scheme: colorSchemeId, text_overlay: true,
        }),
      });
      const data = await res.json();
      if (!res.ok) alert(data.message || "Failed to generate thumbnail.");
      else setThumbnail(data.thumbnail);
    } catch { alert("Unable to connect to server."); }
    finally { setThumbLoading(false); }
  };

  const handleGenerateScript = async () => {
    if (!title.trim()) { alert("Please enter a title or topic for your script."); return; }
    setScriptLoading(true);
    setScript(null);
    try {
      const res = await fetch("http://localhost:3000/api/script/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ title, tone, length: videoLength }),
      });
      const data = await res.json();
      if (!res.ok) alert(data.message || "Failed to generate script.");
      else setScript(data.script);
    } catch { alert("Unable to connect to server."); }
    finally { setScriptLoading(false); }
  };

  /* ── Load existing thumbnail (edit mode) ── */
  const fetchThumbnail = async () => {
    if (id) {
      try {
        const res = await fetch(`http://localhost:3000/api/user/thumbnail/${id}`, {
          credentials: "include",
        });
        const data = await res.json();
        if (res.ok && data.thumbnail) {
          const t = data.thumbnail;
          setThumbnail(t);
          setAdditionalDetails(t.user_prompt || "");
          setTitle(t.title);
          setColorSchemeId(t.color_scheme || "vibrant");
          setAspectRatio(t.aspect_ratio || "16:9");
          setStyle(t.style || "Bold & Graphic");
        }
      } catch (err) {
        console.error(err);
      }
    }
  };
  useEffect(() => { fetchThumbnail(); }, [id]);

  /* ── Shared input section ── */
  const inputSection = (
    <div className="space-y-2">
      <label className="block text-sm font-medium text-zinc-200">Title or Topic</label>
      <input
        type="text"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        maxLength={100}
        placeholder="e.g., 10 Tips For Better Sleep"
        className="w-full px-4 py-3 rounded-lg border border-white/12 bg-black/20 text-zinc-100 placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-pink-500"
      />
      <div className="flex justify-end">
        <span className="text-xs text-zinc-400">{title.length}/100</span>
      </div>
    </div>
  );

  return (
    <>
      <SoftBackdrop />
      <div className="pt-24 min-h-screen">
        <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 pb-28 lg:pb-8">

          {/* ── Tab switcher ── */}
          <div className="flex gap-2 mb-8 p-1 bg-white/5 border border-white/10 rounded-xl w-fit">
            <button
              onClick={() => setActiveTab("thumbnail")}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 ${
                activeTab === "thumbnail"
                  ? "bg-pink-500 text-white shadow-lg shadow-pink-500/25"
                  : "text-zinc-400 hover:text-zinc-200"
              }`}
            >
              <Image size={16} />
              Thumbnail Generator
            </button>
            <button
              onClick={() => setActiveTab("script")}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 ${
                activeTab === "script"
                  ? "bg-pink-500 text-white shadow-lg shadow-pink-500/25"
                  : "text-zinc-400 hover:text-zinc-200"
              }`}
            >
              <ScrollText size={16} />
              Script Generator
            </button>
          </div>

          <div className="grid lg:grid-cols-[400px_1fr] gap-8">
            {/* ── Left Panel ── */}
            <div className={`space-y-6 ${id && activeTab === "thumbnail" ? "pointer-events-none" : ""}`}>
              <div className="p-6 rounded-2xl bg-white/8 border border-white/12 shadow-xl space-y-6">

                {/* ── THUMBNAIL TAB ── */}
                {activeTab === "thumbnail" && (
                  <>
                    <div>
                      <h2 className="text-xl font-bold text-zinc-100">Create Your Thumbnail</h2>
                      <p className="text-sm text-zinc-400">Describe your vision and let AI bring it to life</p>
                    </div>
                    <div className="space-y-5">
                      {inputSection}
                      <AspectRatioSelector value={aspectRatio} onChange={setAspectRatio} />
                      <StyleSelector value={style} onChange={setStyle} isOpen={styleDropdownOpen} setIsOpen={setStyleDropdownOpen} />
                      <ColorSchemeSelector value={colorSchemeId} onChange={setColorSchemeId} />
                      <div className="space-y-2">
                        <label className="block text-sm font-medium">
                          Additional Prompts <span className="text-zinc-400 text-xs">(optional)</span>
                        </label>
                        <textarea
                          value={additionalDetails}
                          onChange={(e) => setAdditionalDetails(e.target.value)}
                          rows={3}
                          placeholder="Add any specific elements, mood, or style preferences..."
                          className="w-full px-4 py-3 rounded-lg border border-white/10 bg-white/6 text-zinc-100 placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-pink-500 resize-none"
                        />
                      </div>
                    </div>
                    {!id && (
                      <button
                        onClick={handleGenerateThumbnail}
                        disabled={thumbLoading}
                        className="text-[15px] w-full py-3.5 rounded-xl font-medium bg-linear-to-b from-pink-500 to-pink-600 hover:from-pink-600 hover:to-pink-700 disabled:opacity-60 disabled:cursor-not-allowed transition-all"
                      >
                        {thumbLoading ? "Generating..." : "Generate Thumbnail"}
                      </button>
                    )}
                  </>
                )}

                {/* ── SCRIPT TAB ── */}
                {activeTab === "script" && (
                  <>
                    <div>
                      <h2 className="text-xl font-bold text-zinc-100">Video Script Generator</h2>
                      <p className="text-sm text-zinc-400">AI writes your full script in seconds</p>
                    </div>
                    <div className="space-y-5">
                      {inputSection}

                      {/* Tone */}
                      <div className="space-y-2">
                        <label className="block text-sm font-medium text-zinc-200">Tone</label>
                        <div className="grid grid-cols-2 gap-2">
                          {(["Educational", "Casual", "Professional", "Entertaining"] as Tone[]).map((t) => (
                            <button
                              key={t}
                              onClick={() => setTone(t)}
                              className={`py-2 px-3 rounded-lg text-sm border transition-all ${
                                tone === t
                                  ? "border-pink-500 bg-pink-500/15 text-pink-300"
                                  : "border-white/10 bg-white/5 text-zinc-400 hover:border-white/20 hover:text-zinc-200"
                              }`}
                            >
                              {t}
                            </button>
                          ))}
                        </div>
                      </div>

                      {/* Video length */}
                      <div className="space-y-2">
                        <label className="block text-sm font-medium text-zinc-200">Video Length</label>
                        <div className="grid grid-cols-3 gap-2">
                          {(["Short", "Medium", "Long"] as VideoLength[]).map((l) => (
                            <button
                              key={l}
                              onClick={() => setVideoLength(l)}
                              className={`py-2 px-3 rounded-lg text-sm border transition-all ${
                                videoLength === l
                                  ? "border-pink-500 bg-pink-500/15 text-pink-300"
                                  : "border-white/10 bg-white/5 text-zinc-400 hover:border-white/20 hover:text-zinc-200"
                              }`}
                            >
                              {l === "Short" ? "Short (~5 min)" : l === "Medium" ? "Med (~10 min)" : "Long (~15 min)"}
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>

                    <button
                      onClick={handleGenerateScript}
                      disabled={scriptLoading}
                      className="text-[15px] w-full py-3.5 rounded-xl font-medium bg-linear-to-b from-pink-500 to-pink-600 hover:from-pink-600 hover:to-pink-700 disabled:opacity-60 disabled:cursor-not-allowed transition-all"
                    >
                      {scriptLoading ? "Writing Script..." : "✨ Generate Script"}
                    </button>
                  </>
                )}
              </div>
            </div>

            {/* ── Right Panel ── */}
            <div>
              <div className="p-6 rounded-2xl bg-white/8 border border-white/10 shadow-xl">
                <h2 className="text-lg font-semibold text-zinc-100 mb-4">
                  {activeTab === "thumbnail" ? "Preview" : "Generated Script"}
                </h2>
                {activeTab === "thumbnail" ? (
                  <PreviewPanel thumbnail={thumbnail} isLoading={thumbLoading} aspectRatio={aspectRatio} />
                ) : (
                  <ScriptPanel script={script} isLoading={scriptLoading} />
                )}
              </div>
            </div>
          </div>
        </main>
      </div>
    </>
  );
};

export default Generate;
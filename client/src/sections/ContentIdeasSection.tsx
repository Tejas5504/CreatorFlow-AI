import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Zap, Gamepad2, Laptop, GraduationCap, TrendingUp, Film, ArrowRight } from "lucide-react";

type Category = "Cricket" | "Gaming" | "Tech" | "Education" | "Finance" | "Movies";

interface Idea {
  title: string;
  description: string;
}

const CATEGORIES: { name: Category; icon: any }[] = [
  { name: "Cricket", icon: Zap },
  { name: "Gaming", icon: Gamepad2 },
  { name: "Tech", icon: Laptop },
  { name: "Education", icon: GraduationCap },
  { name: "Finance", icon: TrendingUp },
  { name: "Movies", icon: Film },
];

const IDEAS_DB: Record<Category, Idea[]> = {
  Cricket: [
    { title: "Top 10 Unbreakable Records in Cricket History", description: "A deep dive into legendary records that will likely never be broken, complete with historical context." },
    { title: "How T20 Leagues Are Destroying Test Cricket", description: "An analytical essay on the financial and scheduling impact of franchise leagues on the traditional format." },
    { title: "The Greatest Final Over Finishes of All Time", description: "A high-energy countdown of the most thrilling last-over chases in international cricket." }
  ],
  Gaming: [
    { title: "Why GTA VI Will Change Open World Games Forever", description: "Analyzing the leaked mechanics and Rockstar's engine upgrades to predict the future of gaming." },
    { title: "The Rise and Fall of E-Sports Organizations", description: "A documentary-style look into why massive gaming orgs are suddenly going bankrupt." },
    { title: "10 Hidden Details You Missed in Cyberpunk 2077", description: "Showcasing Easter eggs and micro-details that players rush past in modern RPGs." }
  ],
  Tech: [
    { title: "I Replaced My PC with an iPad Pro for 30 Days", description: "A realistic review of iPadOS limitations and whether it can truly replace a developer's machine." },
    { title: "The AI Bubble: Are We Approaching the Crash?", description: "An objective look at AI startup valuations vs actual revenue and utility in 2026." },
    { title: "How to Build a Smart Home on a Budget", description: "A practical guide to automating a bedroom or apartment without spending thousands on premium hubs." }
  ],
  Education: [
    { title: "The Feynman Technique: How to Learn Anything Fast", description: "A visually engaging breakdown of Richard Feynman's legendary study method." },
    { title: "Why the Modern School System is Failing Gen Alpha", description: "A critical analysis of outdated curriculums vs the skills actually needed in the AI era." },
    { title: "10 Free Certificates That Actually Get You Hired", description: "A listicle of highly respected, free online certifications that look great on a resume." }
  ],
  Finance: [
    { title: "How to Build Wealth in Your 20s (Step-by-Step)", description: "A no-nonsense guide to compound interest, index funds, and avoiding lifestyle creep." },
    { title: "The Psychology of Money: Why You're Always Broke", description: "Exploring the cognitive biases that cause impulse spending and poor financial planning." },
    { title: "Crypto in 2026: What Actually Survived?", description: "A post-hype analysis of which blockchain projects actually developed real-world utility." }
  ],
  Movies: [
    { title: "Why Modern CGI Looks Worse Than 2000s CGI", description: "An essay on VFX studio crunches, lighting techniques, and the loss of practical effects." },
    { title: "The Hidden Meaning Behind Christopher Nolan's Films", description: "A deep dive into the recurring themes of time, grief, and identity in Nolan's filmography." },
    { title: "Top 10 Mind-Bending Thrillers You Haven't Seen", description: "Curated recommendations for obscure, high-quality psychological thrillers." }
  ],
};

export default function ContentIdeasSection() {
  const navigate = useNavigate();
  const [activeCategory, setActiveCategory] = useState<Category>("Tech");

  const handleUseIdea = (title: string) => {
    // Navigate to the generator tab with the title pre-filled in the URL state
    navigate("/generate", { state: { prefilledTitle: title, tab: "script" } });
  };

  return (
    <section className="py-24 bg-black/40 relative border-t border-white/5">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-zinc-100 mb-4">
            Trending Content <span className="text-transparent bg-clip-text bg-gradient-to-r from-pink-400 to-pink-600">Ideas</span>
          </h2>
          <p className="text-zinc-400 max-w-2xl mx-auto">
            Stuck on what to make next? Browse trending topics across top niches and instantly generate a script or thumbnail.
          </p>
        </div>

        {/* Category Tabs */}
        <div className="flex flex-wrap justify-center gap-3 mb-12">
          {CATEGORIES.map(({ name, icon: Icon }) => (
            <button
              key={name}
              onClick={() => setActiveCategory(name)}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-medium transition-all duration-300 ${
                activeCategory === name
                  ? "bg-pink-500 text-white shadow-lg shadow-pink-500/25"
                  : "bg-white/5 text-zinc-400 hover:bg-white/10 hover:text-zinc-200 border border-white/5"
              }`}
            >
              <Icon size={16} />
              {name}
            </button>
          ))}
        </div>

        {/* Ideas Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {IDEAS_DB[activeCategory].map((idea, idx) => (
            <div 
              key={idx} 
              className="group relative bg-white/5 border border-white/10 hover:border-pink-500/30 rounded-2xl p-6 transition-all duration-300 hover:bg-white/10 flex flex-col justify-between min-h-[220px]"
            >
              <div>
                <h3 className="text-lg font-bold text-zinc-100 leading-snug mb-3">
                  {idea.title}
                </h3>
                <p className="text-sm text-zinc-400 leading-relaxed">
                  {idea.description}
                </p>
              </div>
              
              <div className="mt-6">
                <button
                  onClick={() => handleUseIdea(idea.title)}
                  className="w-full flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-semibold bg-white/5 text-zinc-200 group-hover:bg-pink-500 group-hover:text-white transition-all duration-300"
                >
                  Generate Script
                  <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                </button>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}

import { useState } from "react";
import { Copy, Check, FileText, Zap, BookOpen, BarChart2, Flag, Megaphone } from "lucide-react";

interface Script {
  hook: string;
  intro: string;
  main_content: string;
  statistics: string;
  outro: string;
  cta: string;
}

interface ScriptPanelProps {
  script: Script | null;
  isLoading: boolean;
}

const sections = [
  { key: "hook",         label: "Hook",         icon: Zap,        color: "text-yellow-400",  bg: "bg-yellow-400/10  border-yellow-400/20" },
  { key: "intro",        label: "Intro",        icon: FileText,   color: "text-blue-400",    bg: "bg-blue-400/10    border-blue-400/20"   },
  { key: "main_content", label: "Main Content", icon: BookOpen,   color: "text-green-400",   bg: "bg-green-400/10   border-green-400/20"  },
  { key: "statistics",   label: "Statistics",   icon: BarChart2,  color: "text-purple-400",  bg: "bg-purple-400/10  border-purple-400/20" },
  { key: "outro",        label: "Outro",        icon: Flag,       color: "text-orange-400",  bg: "bg-orange-400/10  border-orange-400/20" },
  { key: "cta",          label: "CTA",          icon: Megaphone,  color: "text-pink-400",    bg: "bg-pink-400/10    border-pink-400/20"   },
] as const;

function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);
  const handleCopy = () => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };
  return (
    <button
      onClick={handleCopy}
      title="Copy to clipboard"
      className="p-1.5 rounded-md hover:bg-white/10 transition-colors text-zinc-400 hover:text-zinc-200"
    >
      {copied ? <Check size={14} className="text-green-400" /> : <Copy size={14} />}
    </button>
  );
}

export default function ScriptPanel({ script, isLoading }: ScriptPanelProps) {
  const [copyAll, setCopyAll] = useState(false);

  const fullScript = script
    ? sections.map(s => `=== ${s.label.toUpperCase()} ===\n${script[s.key]}`).join("\n\n")
    : "";

  const handleCopyAll = () => {
    navigator.clipboard.writeText(fullScript);
    setCopyAll(true);
    setTimeout(() => setCopyAll(false), 2000);
  };

  // Loading skeleton
  if (isLoading) {
    return (
      <div className="space-y-4 animate-pulse">
        {sections.map(s => (
          <div key={s.key} className="rounded-xl border border-white/10 bg-white/5 p-4 space-y-2">
            <div className="h-4 w-24 bg-white/10 rounded" />
            <div className="h-3 w-full bg-white/8 rounded" />
            <div className="h-3 w-5/6 bg-white/8 rounded" />
          </div>
        ))}
      </div>
    );
  }

  // Empty state
  if (!script) {
    return (
      <div className="flex flex-col items-center justify-center h-64 text-center gap-3 text-zinc-500">
        <FileText size={40} className="opacity-30" />
        <p className="text-sm">Your generated script will appear here.</p>
        <p className="text-xs">Fill in the details and click <span className="text-pink-400">Generate Script</span>.</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Copy all button */}
      <div className="flex justify-end">
        <button
          onClick={handleCopyAll}
          className="flex items-center gap-2 text-xs px-3 py-1.5 rounded-lg bg-white/8 hover:bg-white/12 border border-white/10 text-zinc-300 transition-colors"
        >
          {copyAll ? <Check size={13} className="text-green-400" /> : <Copy size={13} />}
          {copyAll ? "Copied!" : "Copy Full Script"}
        </button>
      </div>

      {/* Sections */}
      {sections.map(({ key, label, icon: Icon, color, bg }) => (
        <div key={key} className={`rounded-xl border p-4 space-y-2 ${bg}`}>
          <div className="flex items-center justify-between">
            <div className={`flex items-center gap-2 font-semibold text-sm ${color}`}>
              <Icon size={15} />
              {label}
            </div>
            <CopyButton text={script[key]} />
          </div>
          <p className="text-sm text-zinc-300 leading-relaxed whitespace-pre-line">
            {script[key]}
          </p>
        </div>
      ))}
    </div>
  );
}

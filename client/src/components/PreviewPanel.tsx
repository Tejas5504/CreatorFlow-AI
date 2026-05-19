import { useState, useEffect } from "react";
import { DownloadIcon, ImageIcon, Loader2Icon } from "lucide-react";
import type { AspectRatio, IThumbnail } from "../assets/assets";

const PreviewPanel = ({thumbnail, isLoading, aspectRatio}: 
  {thumbnail: IThumbnail | null, isLoading: boolean, aspectRatio: AspectRatio}) => {
  const [imgLoaded, setImgLoaded] = useState(false);
  const [imgError, setImgError] = useState(false);

  // Reset image state whenever a new thumbnail comes in
  useEffect(() => {
    setImgLoaded(false);
    setImgError(false);
  }, [thumbnail?.image_url]);

  const aspectClasses = {
    '16:9': 'aspect-video',
    '1:1': 'aspect-square',
    '9:16': 'aspect-[9/16]',
  } as Record<AspectRatio, string>;

  const onDownload = () => {
    if (!thumbnail?.image_url) return;
    window.open(thumbnail.image_url, '_blank');
  };

  // Show spinner while: (a) user clicked Generate (isLoading), or (b) image is being loaded by browser
  const showSpinner = isLoading || (!!thumbnail?.image_url && !imgLoaded && !imgError);

  return (
    <div className="relative mx-auto w-full max-w-2xl">
      <div className={`relative overflow-hidden rounded-lg ${aspectClasses[aspectRatio]}`}>

        {/* Loading / Generating spinner */}
        {showSpinner && (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-4 bg-black/30 z-10">
            <Loader2Icon className="size-8 animate-spin text-zinc-400" />
            <div className="text-center">
              <p className="text-sm font-medium text-zinc-200">
                {isLoading ? "Preparing your thumbnail…" : "AI is generating your image…"}
              </p>
              <p className="mt-1 text-xs text-zinc-400">
                This may take 15–40 seconds
              </p>
            </div>
          </div>
        )}

        {/* Image — loaded by browser directly from Pollinations URL */}
        {!isLoading && thumbnail?.image_url && (
          <div className="group relative h-full w-full">
            <img
              src={thumbnail.image_url}
              alt={thumbnail.title}
              referrerPolicy="no-referrer"
              className={`h-full w-full object-cover transition-opacity duration-500 ${imgLoaded ? 'opacity-100' : 'opacity-0'}`}
              onLoad={() => setImgLoaded(true)}
              onError={() => { setImgError(true); setImgLoaded(true); }}
            />

            {/* Error state */}
            {imgError && (
              <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 bg-black/40 px-4 text-center">
                <p className="text-sm text-zinc-300">Pollinations is loading your image...</p>
                <a
                  href={thumbnail.image_url}
                  target="_blank"
                  rel="noreferrer"
                  className="text-xs text-pink-400 underline hover:text-pink-300"
                >
                  Click here to open image in new tab
                </a>
                <p className="text-xs text-zinc-500">Once it loads there, refresh this page</p>
              </div>
            )}

            {/* Title text overlay — real HTML text (AI can't render text reliably) */}
            {imgLoaded && !imgError && thumbnail.title && (
              <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent px-4 pb-3 pt-8 pointer-events-none">
                <p
                  className="text-white font-bold leading-tight drop-shadow-lg"
                  style={{ fontSize: 'clamp(0.75rem, 2.5cqi, 1.25rem)', textShadow: '0 2px 8px rgba(0,0,0,0.9)' }}
                >
                  {thumbnail.title}
                </p>
              </div>
            )}

            {/* Hover download button */}
            {imgLoaded && !imgError && (
              <div className="absolute inset-0 flex items-end justify-center bg-black/10 opacity-0 transition-opacity group-hover:opacity-100">
                <button
                  onClick={onDownload}
                  type="button"
                  className="mb-6 flex items-center gap-2 rounded-md px-5 py-2.5 text-xs font-medium transition bg-white/30 ring-2 ring-white/40 backdrop-blur hover:scale-105 active:scale-95"
                >
                  <DownloadIcon className="size-4" /> Download Thumbnail
                </button>
              </div>
            )}
          </div>
        )}

        {/* Empty state */}
        {!isLoading && !thumbnail?.image_url && (
          <div className="absolute inset-0 m-2 flex flex-col items-center justify-center gap-4 rounded-lg border-2 border-dashed border-white/20 bg-black/25">
            <div className="max-sm:hidden flex size-20 items-center justify-center rounded-full bg-white/10">
              <ImageIcon className="size-10 text-white opacity-50" />
            </div>
            <div className="px-4 text-center">
              <p className="font-medium text-zinc-200">
                Generate your first thumbnail
              </p>
              <p className="mt-1 text-xs text-zinc-400">
                Fill out the form and click Generate
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default PreviewPanel;
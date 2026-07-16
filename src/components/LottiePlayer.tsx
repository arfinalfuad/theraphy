import React, { useEffect, useRef, useState } from "react";
import lottie, { AnimationItem } from "lottie-web";
import { Play, Pause, RotateCcw, Sliders, AlertCircle } from "lucide-react";

export interface LottieConfig {
  enabled?: boolean;
  jsonContent?: string; // Raw JSON string or URL
  autoplay?: boolean;
  loop?: boolean;
  speed?: number;
  trigger?: "onLoad" | "onHover" | "onClick" | "onScroll";
}

interface LottiePlayerProps {
  config?: LottieConfig;
  className?: string;
  previewMode?: boolean;
}

export function LottiePlayer({ config, className = "", previewMode = false }: LottiePlayerProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const animRef = useRef<AnimationItem | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);

  const jsonContent = config?.jsonContent || "";
  const autoplay = config?.autoplay !== false;
  const loop = config?.loop !== false;
  const speed = config?.speed || 1;
  const trigger = config?.trigger || "onLoad";

  useEffect(() => {
    if (!containerRef.current || !jsonContent) return;

    setError(null);
    if (animRef.current) {
      animRef.current.destroy();
      animRef.current = null;
    }

    try {
      let animationData: any = null;
      let path: string | undefined = undefined;

      const trimmed = jsonContent.trim();
      if (trimmed.startsWith("{") && trimmed.endsWith("}")) {
        animationData = JSON.parse(trimmed);
      } else if (trimmed.startsWith("http://") || trimmed.startsWith("https://")) {
        path = trimmed;
      } else {
        // Fallback or placeholder Lottie URL
        path = "https://assets5.lottiefiles.com/packages/lf20_96bov969.json";
      }

      const anim = lottie.loadAnimation({
        container: containerRef.current,
        renderer: "svg",
        loop: trigger === "onScroll" ? false : loop,
        autoplay: trigger === "onLoad" ? autoplay : false,
        animationData,
        path,
      });

      animRef.current = anim;

      anim.addEventListener("DOMLoaded", () => {
        anim.setSpeed(speed);
        setIsPlaying(trigger === "onLoad" ? autoplay : false);
      });

      anim.addEventListener("error", (err) => {
        console.error("Lottie render error:", err);
        setError("লটি ফাইলটি রেন্ডার করা যাচ্ছে না। দয়া করে সঠিক JSON ব্যবহার করুন।");
      });

    } catch (err: any) {
      console.error("Lottie initialization error:", err);
      setError("সঠিক লটি JSON টেক্সট বা URL প্রদান করুন।");
    }

    return () => {
      if (animRef.current) {
        animRef.current.destroy();
        animRef.current = null;
      }
    };
  }, [jsonContent, loop, autoplay, trigger, speed]);

  // Set Speed in real-time
  useEffect(() => {
    if (animRef.current) {
      animRef.current.setSpeed(speed);
    }
  }, [speed]);

  // Handle Scroll interactive trigger
  useEffect(() => {
    if (trigger !== "onScroll" || !animRef.current) return;

    const handleScroll = () => {
      if (!containerRef.current || !animRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      const windowHeight = window.innerHeight;
      
      // Calculate scroll progress percentage through viewport
      const totalDist = windowHeight + rect.height;
      const currentDist = windowHeight - rect.top;
      let progress = currentDist / totalDist;
      
      progress = Math.max(0, Math.min(1, progress));
      
      const totalFrames = animRef.current.totalFrames;
      const targetFrame = Math.floor(progress * totalFrames);
      animRef.current.goToAndStop(targetFrame, true);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    // Run once on load
    handleScroll();

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [trigger, jsonContent]);

  const handleMouseEnter = () => {
    if (trigger === "onHover" && animRef.current) {
      animRef.current.play();
      setIsPlaying(true);
    }
  };

  const handleMouseLeave = () => {
    if (trigger === "onHover" && animRef.current) {
      animRef.current.pause();
      setIsPlaying(false);
    }
  };

  const handleClick = () => {
    if (trigger === "onClick" && animRef.current) {
      if (isPlaying) {
        animRef.current.pause();
        setIsPlaying(false);
      } else {
        animRef.current.play();
        setIsPlaying(true);
      }
    }
  };

  const togglePlay = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!animRef.current) return;
    if (isPlaying) {
      animRef.current.pause();
      setIsPlaying(false);
    } else {
      animRef.current.play();
      setIsPlaying(true);
    }
  };

  const resetAnim = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!animRef.current) return;
    animRef.current.goToAndStop(0, true);
    setIsPlaying(false);
  };

  return (
    <div 
      className={`relative group/lottie flex flex-col items-center justify-center min-h-[150px] w-full rounded-2xl p-2 transition-all ${className}`}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onClick={handleClick}
    >
      {error ? (
        <div className="flex flex-col items-center justify-center text-center p-4 bg-red-50/80 border border-red-200 rounded-xl text-xs text-red-600 font-bold gap-1 max-w-xs">
          <AlertCircle className="w-5 h-5 text-red-500" />
          <span>{error}</span>
        </div>
      ) : (
        <div ref={containerRef} className="w-full max-h-[400px] flex items-center justify-center pointer-events-none" />
      )}

      {/* Embedded controls for quick play testing in editor */}
      {!previewMode && animRef.current && !error && (
        <div className="absolute bottom-2 left-1/2 -translate-x-1/2 bg-slate-900/90 text-white border border-slate-800 rounded-full py-1 px-3 flex items-center gap-2 opacity-0 group-hover/lottie:opacity-100 transition-opacity duration-300 pointer-events-auto z-10">
          <button 
            onClick={togglePlay}
            className="p-1 hover:text-indigo-400 rounded-full transition-all cursor-pointer"
            title={isPlaying ? "Pause" : "Play"}
          >
            {isPlaying ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
          </button>
          <button 
            onClick={resetAnim}
            className="p-1 hover:text-indigo-400 rounded-full transition-all cursor-pointer"
            title="Reset"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>
          <div className="h-3.5 w-px bg-slate-800" />
          <span className="text-[9px] font-mono font-bold text-slate-400">
            Speed: {speed}x | {trigger}
          </span>
        </div>
      )}

      {/* No content instruction */}
      {!jsonContent && (
        <div className="flex flex-col items-center justify-center p-6 text-center text-slate-400 bg-slate-50 border border-dashed border-slate-200 rounded-2xl w-full">
          <Sliders className="w-8 h-8 mb-2 text-slate-300 animate-pulse" />
          <span className="text-xs font-bold text-slate-500">লটি এনিমেশন কনফিগার করুন</span>
          <p className="text-[10px] text-slate-400 mt-1 max-w-[200px]">
            ডানপাশের প্রোপার্টিজ প্যানেল থেকে লটি JSON কোড বা URL আপলোড করুন।
          </p>
        </div>
      )}
    </div>
  );
}

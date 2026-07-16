import React, { useRef } from "react";
import { motion, useScroll, useTransform } from "motion/react";

export interface AnimationConfig {
  type?: "none" | "fade" | "slide" | "zoom" | "scale" | "rotate" | "flip" | "blur" | "bounce" | "reveal" | "morph" | "floating" | "pulse" | "stagger" | "parallax";
  trigger?: "onLoad" | "onScroll" | "onEnter" | "onHover" | "onClick" | "onFocus" | "loop";
  delay?: number;
  duration?: number;
  easing?: string;
  repeat?: number | "infinite";
  direction?: "up" | "down" | "left" | "right";
  disableOnDesktop?: boolean;
  disableOnTablet?: boolean;
  disableOnMobile?: boolean;
}

export interface HoverEffectConfig {
  bg?: string;
  color?: string;
  borderColor?: string;
  shadow?: string;
  opacity?: number;
  scale?: number;
  rotate?: number;
  cursor?: string;
  transitionDuration?: number;
}

export interface ScrollEffectConfig {
  parallax?: boolean;
  parallaxSpeed?: number; // -10 to 10
  sticky?: boolean;
  stickyTop?: string;
  effectType?: "none" | "fadeIn" | "slideUp" | "slideLeft" | "slideRight" | "zoomIn" | "zoomOut";
}

export interface VideoBgConfig {
  enabled?: boolean;
  videoUrl?: string;
  overlayColor?: string;
  overlayOpacity?: number;
  blur?: string;
  brightness?: string;
  contrast?: string;
}

export type InteractionPresetKind =
  | "none"
  | "button-pulse"
  | "button-shine"
  | "button-arrow"
  | "card-lift"
  | "card-glow"
  | "image-zoom"
  | "image-tilt"
  | "icon-bounce"
  | "icon-spin"
  | "section-fade"
  | "section-reveal"
  | "container-stagger"
  | "nav-hover";

interface AnimatedWrapperProps {
  animation?: AnimationConfig;
  hoverEffect?: HoverEffectConfig;
  scrollEffect?: ScrollEffectConfig;
  interactionPreset?: InteractionPresetKind;
  activeBreakpoint: string;
  previewMode: boolean;
  children: React.ReactNode;
}

/* ----------------------------------------------------------------------------
   PREMIUM ANIMATIONS ENGINES
   ---------------------------------------------------------------------------- */

export function AnimatedWrapper({
  animation,
  hoverEffect,
  scrollEffect,
  interactionPreset = "none",
  activeBreakpoint,
  previewMode,
  children,
}: AnimatedWrapperProps) {
  
  // 1. Check Responsiveness: Allow disabling animations per device size
  const isAnimationDisabled = () => {
    if (!animation || animation.type === "none" || animation.type === undefined) return true;
    
    const isMobile = activeBreakpoint === "mobilePortrait" || activeBreakpoint === "mobileLandscape";
    const isTablet = activeBreakpoint === "tablet";
    const isDesktop = activeBreakpoint === "desktop" || activeBreakpoint === "laptop";

    if (isMobile && animation.disableOnMobile) return true;
    if (isTablet && animation.disableOnTablet) return true;
    if (isDesktop && animation.disableOnDesktop) return true;

    return false;
  };

  // 2. Build Transitions Config
  const getTransition = () => {
    if (!animation) return {};
    
    let easeVal: any = "easeOut";
    if (animation.easing === "linear") easeVal = "linear";
    else if (animation.easing === "easeInOut") easeVal = "easeInOut";
    else if (animation.easing === "backOut") easeVal = [0.175, 0.885, 0.32, 1.275];
    else if (animation.easing === "anticipate") easeVal = "anticipate";
    else if (animation.easing === "easeIn") easeVal = "easeIn";

    return {
      duration: animation.duration !== undefined ? animation.duration : 0.6,
      delay: animation.delay || 0,
      ease: easeVal,
      repeat: animation.repeat === "infinite" ? Infinity : (animation.repeat || 0),
      repeatType: animation.repeat === "infinite" ? "reverse" as const : "loop" as const,
    };
  };

  // 3. Build Keyframe Variants Based on Animation type
  const getVariants = () => {
    if (!animation || isAnimationDisabled()) return {};

    const offset = 50;
    let x = 0;
    let y = 0;

    if (animation.direction === "up") y = offset;
    else if (animation.direction === "down") y = -offset;
    else if (animation.direction === "left") x = offset;
    else if (animation.direction === "right") x = -offset;

    switch (animation.type) {
      case "fade":
        return {
          hidden: { opacity: 0 },
          visible: { opacity: 1 },
        };
      case "slide":
        return {
          hidden: { opacity: 0, x, y },
          visible: { opacity: 1, x: 0, y: 0 },
        };
      case "zoom":
        return {
          hidden: { opacity: 0, scale: 0.6 },
          visible: { opacity: 1, scale: 1 },
        };
      case "scale":
        return {
          hidden: { opacity: 0, scale: 0 },
          visible: { opacity: 1, scale: 1 },
        };
      case "rotate":
        return {
          hidden: { opacity: 0, rotate: -180, scale: 0.8 },
          visible: { opacity: 1, rotate: 0, scale: 1 },
        };
      case "flip":
        return {
          hidden: { opacity: 0, rotateX: 90 },
          visible: { opacity: 1, rotateX: 0 },
        };
      case "blur":
        return {
          hidden: { opacity: 0, filter: "blur(10px)" },
          visible: { opacity: 1, filter: "blur(0px)" },
        };
      case "bounce":
        return {
          hidden: { opacity: 0, scale: 0.3 },
          visible: { 
            opacity: 1, 
            scale: 1,
            transition: { type: "spring", stiffness: 300, damping: 10 }
          },
        };
      case "reveal":
        return {
          hidden: { clipPath: "polygon(0 0, 0 0, 0 100%, 0% 100%)", opacity: 0.2 },
          visible: { clipPath: "polygon(0 0, 100% 0, 100% 100%, 0 100%)", opacity: 1 },
        };
      case "morph":
        return {
          hidden: { borderRadius: "30% 70% 70% 30% / 30% 30% 70% 70%" },
          visible: { 
            borderRadius: "50%",
            transition: { duration: 1.8, repeat: Infinity, repeatType: "reverse" as const, ease: "easeInOut" }
          },
        };
      case "floating":
        return {
          animate: {
            y: [-6, 6, -6],
            transition: { duration: 2.5, repeat: Infinity, ease: "easeInOut" }
          }
        };
      case "pulse":
        return {
          animate: {
            scale: [1, 1.04, 1],
            transition: { duration: 2, repeat: Infinity, ease: "easeInOut" }
          }
        };
      default:
        return {};
    }
  };

  // 4. Build Custom Hover variant
  const getHoverProps = () => {
    if (!hoverEffect) return {};
    
    const hoverStyle: any = {};
    if (hoverEffect.bg) hoverStyle.backgroundColor = hoverEffect.bg;
    if (hoverEffect.color) hoverStyle.color = hoverEffect.color;
    if (hoverEffect.borderColor) hoverStyle.borderColor = hoverEffect.borderColor;
    if (hoverEffect.shadow) {
      hoverStyle.boxShadow = hoverEffect.shadow === "none" ? "none" : hoverEffect.shadow;
    }
    if (hoverEffect.opacity !== undefined) hoverStyle.opacity = hoverEffect.opacity;
    if (hoverEffect.scale !== undefined) hoverStyle.scale = hoverEffect.scale;
    if (hoverEffect.rotate !== undefined) hoverStyle.rotate = hoverEffect.rotate;

    return {
      whileHover: hoverStyle,
      transition: { duration: hoverEffect.transitionDuration || 0.3 },
      style: { cursor: hoverEffect.cursor || "default" },
    };
  };

  // 5. Build Interaction Presets variants
  const getPresetProps = () => {
    if (interactionPreset === "none") return {};

    switch (interactionPreset) {
      case "button-pulse":
        return {
          whileHover: { scale: 1.04 },
          animate: {
            scale: [1, 1.03, 1],
            transition: { duration: 1.5, repeat: Infinity, ease: "easeInOut" }
          }
        };
      case "button-shine":
        return {
          whileHover: { scale: 1.02 },
          style: { position: "relative" as const, overflow: "hidden" as const }
        };
      case "button-arrow":
        return {
          whileHover: { scale: 1.02, x: 2 }
        };
      case "card-lift":
        return {
          whileHover: { y: -8, scale: 1.01, boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)" },
          transition: { type: "spring", stiffness: 300, damping: 20 }
        };
      case "card-glow":
        return {
          whileHover: { boxShadow: "0 0 25px 5px rgba(79, 70, 229, 0.5)", borderColor: "rgba(79, 70, 229, 0.8)" },
          transition: { duration: 0.3 }
        };
      case "image-zoom":
        return {
          whileHover: { scale: 1.06 },
          transition: { duration: 0.4 }
        };
      case "image-tilt":
        return {
          whileHover: { rotate: 2, scale: 1.02 },
          transition: { duration: 0.3 }
        };
      case "icon-bounce":
        return {
          whileHover: { y: [-4, 2, -4], transition: { duration: 0.8, repeat: Infinity, ease: "easeInOut" } }
        };
      case "icon-spin":
        return {
          whileHover: { rotate: 360 },
          transition: { duration: 0.6 }
        };
      case "section-fade":
        return {
          initial: { opacity: 0 },
          whileInView: { opacity: 1 },
          viewport: { once: true, amount: 0.15 },
          transition: { duration: 0.8 }
        };
      case "section-reveal":
        return {
          initial: { clipPath: "polygon(0 100%, 100% 100%, 100% 100%, 0% 100%)", opacity: 0.3 },
          whileInView: { clipPath: "polygon(0 0, 100% 0, 100% 100%, 0% 100%)", opacity: 1 },
          viewport: { once: true, amount: 0.1 },
          transition: { duration: 0.9, ease: "easeOut" }
        };
      case "container-stagger":
        return {
          initial: "hidden",
          animate: "visible",
          variants: {
            hidden: { opacity: 0 },
            visible: {
              opacity: 1,
              transition: { staggerChildren: 0.12 }
            }
          }
        };
      case "nav-hover":
        return {
          whileHover: { scale: 1.03, color: "#4f46e5" },
          transition: { duration: 0.2 }
        };
      default:
        return {};
    }
  };

  // Compose all Framer Motion Props based on triggers
  const getTriggerProps = () => {
    if (isAnimationDisabled()) return {};

    const trig = animation?.trigger || "onLoad";
    const vars = getVariants();
    const trans = getTransition();

    if (animation?.type === "floating" || animation?.type === "pulse" || animation?.type === "morph") {
      return {
        animate: vars.animate || vars.visible,
      };
    }

    switch (trig) {
      case "onLoad":
        return {
          initial: "hidden",
          animate: "visible",
          variants: vars,
          transition: trans,
        };
      case "onEnter":
        return {
          initial: "hidden",
          whileInView: "visible",
          viewport: { once: false, amount: 0.12 },
          variants: vars,
          transition: trans,
        };
      case "onHover":
        return {
          initial: "hidden",
          whileHover: "visible",
          variants: vars,
          transition: trans,
        };
      case "onClick":
        return {
          whileTap: "visible",
          variants: vars,
          transition: trans,
        };
      case "onFocus":
        return {
          whileFocus: "visible",
          variants: vars,
          transition: trans,
        };
      case "loop":
        return {
          initial: "hidden",
          animate: "visible",
          variants: vars,
          transition: { ...trans, repeat: Infinity, repeatType: "reverse" as const },
        };
      default:
        return {};
    }
  };

  const animationProps = getTriggerProps();
  const hoverProps = getHoverProps();
  const presetProps = getPresetProps();

  // Re-key animation during editing so changes preview instantly!
  const previewKey = animation 
    ? `${animation.type}-${animation.trigger}-${animation.delay}-${animation.duration}-${animation.direction}-${interactionPreset}` 
    : "static";

  // Merge everything cleanly
  const motionProps = {
    key: previewKey,
    ...animationProps,
    ...hoverProps,
    ...presetProps,
  };

  // If scroll effect is configured, we route through ScrollDrivenWrapper
  if (scrollEffect && (scrollEffect.parallax || scrollEffect.sticky || (scrollEffect.effectType && scrollEffect.effectType !== "none"))) {
    return (
      <ScrollDrivenWrapper config={scrollEffect}>
        <motion.div {...motionProps} className="w-full relative">
          {children}
          {interactionPreset === "button-shine" && <ButtonShineOverlay />}
        </motion.div>
      </ScrollDrivenWrapper>
    );
  }

  return (
    <motion.div {...motionProps} className="w-full relative">
      {children}
      {interactionPreset === "button-shine" && <ButtonShineOverlay />}
    </motion.div>
  );
}

/* ----------------------------------------------------------------------------
   SCROLL EFFECTS WRAPPER (GPU ACCELERATED SCROLL RENDERING)
   ---------------------------------------------------------------------------- */

export function ScrollDrivenWrapper({ config, children }: { config: ScrollEffectConfig; children: React.ReactNode }) {
  const containerRef = useRef<HTMLDivElement>(null);
  
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"]
  });

  const transforms: any = {};

  if (config.parallax) {
    const speed = config.parallaxSpeed !== undefined ? config.parallaxSpeed : 2;
    // Map scrollYProgress to translation
    transforms.y = useTransform(scrollYProgress, [0, 1], [-speed * 18, speed * 18]);
  }

  if (config.effectType === "fadeIn") {
    transforms.opacity = useTransform(scrollYProgress, [0, 0.22, 0.78, 1], [0, 1, 1, 0]);
  } else if (config.effectType === "slideUp") {
    transforms.y = useTransform(scrollYProgress, [0, 0.25], [70, 0]);
    transforms.opacity = useTransform(scrollYProgress, [0, 0.25], [0, 1]);
  } else if (config.effectType === "slideLeft") {
    transforms.x = useTransform(scrollYProgress, [0, 0.25], [70, 0]);
    transforms.opacity = useTransform(scrollYProgress, [0, 0.25], [0, 1]);
  } else if (config.effectType === "slideRight") {
    transforms.x = useTransform(scrollYProgress, [0, 0.25], [-70, 0]);
    transforms.opacity = useTransform(scrollYProgress, [0, 0.25], [0, 1]);
  } else if (config.effectType === "zoomIn") {
    transforms.scale = useTransform(scrollYProgress, [0, 0.25], [0.85, 1]);
    transforms.opacity = useTransform(scrollYProgress, [0, 0.25], [0, 1]);
  } else if (config.effectType === "zoomOut") {
    transforms.scale = useTransform(scrollYProgress, [0, 0.25], [1.15, 1]);
    transforms.opacity = useTransform(scrollYProgress, [0, 0.25], [0, 1]);
  }

  const stickyStyle: React.CSSProperties = config.sticky ? {
    position: "sticky",
    top: config.stickyTop || "0px",
    zIndex: 40
  } : {};

  return (
    <motion.div 
      ref={containerRef} 
      style={{ ...transforms, ...stickyStyle }}
      className="w-full"
    >
      {children}
    </motion.div>
  );
}

/* ----------------------------------------------------------------------------
   VIDEO BACKGROUND COMPONENT (HARDWARE ACCELERATED & OPTIMIZED)
   ---------------------------------------------------------------------------- */

export function VideoBackground({ config }: { config?: VideoBgConfig }) {
  if (!config || !config.enabled || !config.videoUrl) return null;

  const blurVal = config.blur || "0px";
  const brightnessVal = config.brightness !== undefined ? config.brightness : "1";
  const contrastVal = config.contrast !== undefined ? config.contrast : "1";
  const opacityVal = config.overlayOpacity !== undefined ? config.overlayOpacity : 0.4;

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none z-0 rounded-inherit">
      <video
        src={config.videoUrl}
        autoPlay
        muted
        loop
        playsInline
        className="w-full h-full object-cover"
        style={{
          filter: `blur(${blurVal}) brightness(${brightnessVal}) contrast(${contrastVal})`
        }}
      />
      {config.overlayColor && (
        <div
          className="absolute inset-0"
          style={{
            backgroundColor: config.overlayColor,
            opacity: opacityVal
          }}
        />
      )}
    </div>
  );
}

/* ----------------------------------------------------------------------------
   DECORATIVE OVERLAYS
   ---------------------------------------------------------------------------- */

function ButtonShineOverlay() {
  return (
    <motion.div
      initial={{ x: "-100%" }}
      whileHover={{ x: "200%" }}
      transition={{ duration: 0.9, ease: "easeInOut" }}
      className="absolute inset-0 bg-gradient-to-r from-transparent via-white/35 to-transparent pointer-events-none z-10"
    />
  );
}

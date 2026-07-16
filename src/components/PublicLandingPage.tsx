import React, { useState } from "react";
import { 
  Phone, 
  Activity, 
  Stethoscope, 
  Clock, 
  Sparkle, 
  Sparkles, 
  ChevronRight, 
  Play, 
  Volume2, 
  User, 
  Mail, 
  MessageSquare, 
  Send, 
  CheckCircle,
  Code,
  Edit2,
  Home,
  Music,
  Gamepad2,
  GraduationCap,
  Baby,
  FileText,
  Zap,
  Star,
  Users,
  Award,
  Calendar,
  MapPin,
  Heart,
  ArrowRight,
  ExternalLink,
  Image as ImageIcon,
  Video as VideoIcon
} from "lucide-react";

export interface LandingPageConfig {
  heroTitle: string;
  heroDesc: string;
  heroImage: string;
  themeColor: string;          // Primary Theme Color Hex (e.g. #0ea5e9)
  themeColorSecondary: string; // Secondary Theme Color Hex (e.g. #ec4899)
  themeBgColor: string;        // General Background Color Hex (e.g. #f8fafc)
  themeTextColor: string;      // General Text Color Hex (e.g. #0f172a)
  fontFamily: string;          // Selected standard font
  customFontBase64?: string;   // Base64-encoded custom Bengali font
  customFontName?: string;     // Name of custom font
  youtubeEmbed: string;        // YouTube iframe embed URL
  ctaText: string;             // Hero Call-to-Action Text
  ctaUrl: string;              // Hero Call-to-Action Hyperlink
  sectionsOrder: string[];     // Array of ordered section IDs
  sectionsVisibility: Record<string, boolean>; // Visibility mapping for sections
  customCode: string;          // Shopify custom liquid HTML/CSS/JS

  // Additional customizable texts
  servicesTitle: string;
  servicesDesc: string;
  therapistsTitle: string;
  therapistsDesc: string;
  contactTitle: string;
  contactDesc: string;
  logoText: string;
  phoneText: string;
  customPages?: Array<{ slug: string; title: string; content: string }>;
  menuLinks?: Array<{ id: string; label: string; url: string }>;
  visualSections?: any[];
}

export interface ServiceCard {
  id: string;
  titleBangla: string;
  titleEnglish: string;
  descBangla: string;
  iconName: string;
  bgColor: string;
  accentColor: string;
  tag: string;
  isPromo?: boolean;
}

export interface Therapist {
  id: string;
  name: string;
  designation: string;
  specialty: string;
  visit_fee: number;
  branch: string;
  credentials: string;
  experience: string;
  education: string;
  avatar_url?: string;
}

interface PublicLandingPageProps {
  pageConfig: LandingPageConfig;
  services: ServiceCard[];
  therapists: Therapist[];
  onNavigate: (hash: string) => void;
  onSelectTherapist?: (therapist: Therapist) => void;
  isEditable?: boolean; // True when rendered inside the Shopify visual customizer preview
  activeField?: string;  // Currently active field in sidebar editing
  onSelectField?: (fieldName: keyof LandingPageConfig) => void; // Triggered when clicked in preview
}

const AAC_ITEMS = [
  { id: "i-want", label: "আমি চাই", emoji: "🙋‍♂️", speech: "আমি চাই", color: "bg-amber-100/90 border-amber-300 text-amber-900" },
  { id: "water", label: "পানি", emoji: "💧", speech: "পানি", color: "bg-sky-100/90 border-sky-300 text-sky-900" },
  { id: "food", label: "খাবার", emoji: "🍚", speech: "খাবার", color: "bg-emerald-100/90 border-emerald-300 text-emerald-900" },
  { id: "play", label: "খেলবো", emoji: "⚽", speech: "আমি খেলবো", color: "bg-indigo-100/90 border-indigo-300 text-indigo-900" },
  { id: "sleep", label: "ঘুমাবো", emoji: "😴", speech: "আমি ঘুমাবো", color: "bg-purple-100/90 border-purple-300 text-purple-900" },
  { id: "happy", label: "খুশি", emoji: "😊", speech: "আমি অনেক খুশি", color: "bg-pink-100/90 border-pink-300 text-pink-900" },
  { id: "sad", label: "খারাপ লাগছে", emoji: "😢", speech: "আমার খারাপ লাগছে", color: "bg-blue-100/90 border-blue-300 text-blue-900" },
  { id: "thank-you", label: "ধন্যবাদ", emoji: "🙏", speech: "ধন্যবাদ", color: "bg-teal-100/90 border-teal-300 text-teal-900" },
];

const DYNAMIC_ICONS: Record<string, React.ComponentType<{ className?: string }>> = {
  ArrowRight,
  Play: VideoIcon,
  CheckCircle,
  Zap,
  Users,
  Star,
  Mail,
  Phone,
  MapPin,
  Calendar,
  Award,
  Activity,
  Heart,
  ExternalLink,
};

function getStylesFromConfig(styleConfig: any): React.CSSProperties {
  if (!styleConfig) return {};
  const s: React.CSSProperties = {};
  if (styleConfig.fontFamily) s.fontFamily = styleConfig.fontFamily;
  if (styleConfig.fontSize) s.fontSize = styleConfig.fontSize;
  if (styleConfig.fontWeight) s.fontWeight = styleConfig.fontWeight;
  if (styleConfig.lineHeight) s.lineHeight = styleConfig.lineHeight;
  if (styleConfig.letterSpacing) s.letterSpacing = styleConfig.letterSpacing;
  if (styleConfig.color) s.color = styleConfig.color;
  if (styleConfig.align) s.textAlign = styleConfig.align as any;
  if (styleConfig.textShadow) s.textShadow = styleConfig.textShadow;

  if (styleConfig.bgType === "gradient") {
    s.background = styleConfig.bgGradient || styleConfig.bg || "linear-gradient(135deg, #4f46e5 0%, #c084fc 100%)";
  } else if (styleConfig.bgType === "image" && styleConfig.bgImage) {
    s.backgroundImage = `url(${styleConfig.bgImage})`;
    s.backgroundSize = styleConfig.bgSize || "cover";
    s.backgroundPosition = styleConfig.bgPosition || "center";
    s.backgroundRepeat = styleConfig.bgRepeat || "no-repeat";
  } else if (styleConfig.bgType === "solid" && styleConfig.bg) {
    s.backgroundColor = styleConfig.bg;
  } else if (styleConfig.bg) {
    s.backgroundColor = styleConfig.bg;
  }

  if (styleConfig.borderStyle) s.borderStyle = styleConfig.borderStyle;
  if (styleConfig.borderWidth) s.borderWidth = styleConfig.borderWidth;
  if (styleConfig.borderColor) s.borderColor = styleConfig.borderColor;
  if (styleConfig.radius) s.borderRadius = styleConfig.radius;
  if (styleConfig.borderRadius) s.borderRadius = styleConfig.borderRadius;

  if (styleConfig.shadow) {
    s.boxShadow =
      styleConfig.shadow === "true" || styleConfig.shadow === true
        ? "0 4px 6px -1px rgba(0,0,0,0.1), 0 2px 4px -1px rgba(0,0,0,0.06)"
        : styleConfig.shadow === "none"
        ? "none"
        : styleConfig.shadow;
  }

  if (styleConfig.opacity !== undefined) {
    const op = parseFloat(styleConfig.opacity);
    s.opacity = isNaN(op) ? undefined : op;
  }

  if (styleConfig.paddingTop) s.paddingTop = styleConfig.paddingTop;
  if (styleConfig.paddingBottom) s.paddingBottom = styleConfig.paddingBottom;
  if (styleConfig.paddingLeft) s.paddingLeft = styleConfig.paddingLeft;
  if (styleConfig.paddingRight) s.paddingRight = styleConfig.paddingRight;
  if (styleConfig.paddingX) {
    s.paddingLeft = styleConfig.paddingX;
    s.paddingRight = styleConfig.paddingX;
  }
  if (styleConfig.paddingY) {
    s.paddingTop = styleConfig.paddingY;
    s.paddingBottom = styleConfig.paddingY;
  }

  if (styleConfig.marginTop) s.marginTop = styleConfig.marginTop;
  if (styleConfig.marginBottom) s.marginBottom = styleConfig.marginBottom;
  if (styleConfig.marginLeft) s.marginLeft = styleConfig.marginLeft;
  if (styleConfig.marginRight) s.marginRight = styleConfig.marginRight;
  if (styleConfig.marginX) {
    s.marginLeft = styleConfig.marginX;
    s.marginRight = styleConfig.marginX;
  }
  if (styleConfig.marginY) {
    s.marginTop = styleConfig.marginY;
    s.marginBottom = styleConfig.marginY;
  }

  if (styleConfig.width) s.width = styleConfig.width;
  if (styleConfig.height) s.height = styleConfig.height;
  if (styleConfig.minWidth) s.minWidth = styleConfig.minWidth;
  if (styleConfig.maxWidth) s.maxWidth = styleConfig.maxWidth;
  if (styleConfig.minHeight) s.minHeight = styleConfig.minHeight;
  if (styleConfig.maxHeight) s.maxHeight = styleConfig.maxHeight;

  if (styleConfig.display) s.display = styleConfig.display;
  if (styleConfig.flexDirection) s.flexDirection = styleConfig.flexDirection;
  if (styleConfig.flexWrap) s.flexWrap = styleConfig.flexWrap;
  if (styleConfig.justifyContent) s.justifyContent = styleConfig.justifyContent;
  if (styleConfig.alignItems) s.alignItems = styleConfig.alignItems;
  if (styleConfig.flexGrow !== undefined) s.flexGrow = Number(styleConfig.flexGrow);
  if (styleConfig.flexShrink !== undefined) s.flexShrink = Number(styleConfig.flexShrink);

  if (styleConfig.gridTemplateColumns) s.gridTemplateColumns = styleConfig.gridTemplateColumns;
  if (styleConfig.gridTemplateRows) s.gridTemplateRows = styleConfig.gridTemplateRows;

  if (styleConfig.gap) s.gap = styleConfig.gap;
  if (styleConfig.order !== undefined) s.order = Number(styleConfig.order);

  if (styleConfig.position) s.position = styleConfig.position;
  if (styleConfig.top) s.top = styleConfig.top;
  if (styleConfig.right) s.right = styleConfig.right;
  if (styleConfig.bottom) s.bottom = styleConfig.bottom;
  if (styleConfig.left) s.left = styleConfig.left;
  if (styleConfig.zIndex !== undefined) s.zIndex = Number(styleConfig.zIndex);

  if (styleConfig.overflowX) s.overflowX = styleConfig.overflowX as any;
  if (styleConfig.overflowY) s.overflowY = styleConfig.overflowY as any;
  if (styleConfig.overflow) s.overflow = styleConfig.overflow as any;

  if (styleConfig.transition) s.transition = styleConfig.transition;

  return s;
}

export function compileStylesForPage(sections: any[], theme?: any): string {
  let css = "";
  
  const serializeStyle = (styleObj: any) => {
    if (!styleObj) return "";
    let s = "";
    if (styleObj.color) s += `color: ${styleObj.color} !important;`;
    if (styleObj.fontSize) s += `font-size: ${styleObj.fontSize} !important;`;
    if (styleObj.fontWeight) s += `font-weight: ${styleObj.fontWeight} !important;`;
    if (styleObj.fontFamily) s += `font-family: ${styleObj.fontFamily} !important;`;
    if (styleObj.lineHeight) s += `line-height: ${styleObj.lineHeight} !important;`;
    if (styleObj.letterSpacing) s += `letter-spacing: ${styleObj.letterSpacing} !important;`;
    if (styleObj.align) s += `text-align: ${styleObj.align} !important;`;
    if (styleObj.textShadow) s += `text-shadow: ${styleObj.textShadow} !important;`;
    if (styleObj.bg) s += `background-color: ${styleObj.bg} !important;`;
    if (styleObj.borderColor) s += `border-color: ${styleObj.borderColor} !important;`;
    if (styleObj.borderWidth) s += `border-width: ${styleObj.borderWidth} !important;`;
    if (styleObj.radius) s += `border-radius: ${styleObj.radius} !important;`;
    if (styleObj.borderRadius) s += `border-radius: ${styleObj.borderRadius} !important;`;
    if (styleObj.paddingTop) s += `padding-top: ${styleObj.paddingTop} !important;`;
    if (styleObj.paddingBottom) s += `padding-bottom: ${styleObj.paddingBottom} !important;`;
    if (styleObj.paddingLeft) s += `padding-left: ${styleObj.paddingLeft} !important;`;
    if (styleObj.paddingRight) s += `padding-right: ${styleObj.paddingRight} !important;`;
    if (styleObj.paddingX) {
      s += `padding-left: ${styleObj.paddingX} !important;`;
      s += `padding-right: ${styleObj.paddingX} !important;`;
    }
    if (styleObj.paddingY) {
      s += `padding-top: ${styleObj.paddingY} !important;`;
      s += `padding-bottom: ${styleObj.paddingY} !important;`;
    }
    if (styleObj.marginTop) s += `margin-top: ${styleObj.marginTop} !important;`;
    if (styleObj.marginBottom) s += `margin-bottom: ${styleObj.marginBottom} !important;`;
    if (styleObj.marginLeft) s += `margin-left: ${styleObj.marginLeft} !important;`;
    if (styleObj.marginRight) s += `margin-right: ${styleObj.marginRight} !important;`;
    if (styleObj.marginX) {
      s += `margin-left: ${styleObj.marginX} !important;`;
      s += `margin-right: ${styleObj.marginX} !important;`;
    }
    if (styleObj.marginY) {
      s += `margin-top: ${styleObj.marginY} !important;`;
      s += `margin-bottom: ${styleObj.marginY} !important;`;
    }
    if (styleObj.width) s += `width: ${styleObj.width} !important;`;
    if (styleObj.height) s += `height: ${styleObj.height} !important;`;
    if (styleObj.maxWidth) s += `max-width: ${styleObj.maxWidth} !important;`;
    if (styleObj.minWidth) s += `min-width: ${styleObj.minWidth} !important;`;
    if (styleObj.maxHeight) s += `max-height: ${styleObj.maxHeight} !important;`;
    if (styleObj.minHeight) s += `min-height: ${styleObj.minHeight} !important;`;
    if (styleObj.gap) s += `gap: ${styleObj.gap} !important;`;
    if (styleObj.display) s += `display: ${styleObj.display} !important;`;
    if (styleObj.flexDirection) s += `flex-direction: ${styleObj.flexDirection} !important;`;
    if (styleObj.flexWrap) s += `flex-wrap: ${styleObj.flexWrap} !important;`;
    if (styleObj.justifyContent) s += `justify-content: ${styleObj.justifyContent} !important;`;
    if (styleObj.alignItems) s += `align-items: ${styleObj.alignItems} !important;`;
    if (styleObj.flexGrow !== undefined) s += `flex-grow: ${styleObj.flexGrow} !important;`;
    if (styleObj.flexShrink !== undefined) s += `flex-shrink: ${styleObj.flexShrink} !important;`;
    if (styleObj.gridTemplateColumns) s += `grid-template-columns: ${styleObj.gridTemplateColumns} !important;`;
    if (styleObj.gridTemplateRows) s += `grid-template-rows: ${styleObj.gridTemplateRows} !important;`;
    if (styleObj.gridColumn) s += `grid-column: ${styleObj.gridColumn} !important;`;
    if (styleObj.gridRow) s += `grid-row: ${styleObj.gridRow} !important;`;
    if (styleObj.alignSelf) s += `align-self: ${styleObj.alignSelf} !important;`;
    if (styleObj.order !== undefined) s += `order: ${styleObj.order} !important;`;
    if (styleObj.opacity !== undefined) s += `opacity: ${styleObj.opacity} !important;`;
    if (styleObj.boxShadow) s += `box-shadow: ${styleObj.boxShadow} !important;`;
    if (styleObj.shadow && styleObj.shadow !== "none") {
      s += `box-shadow: 0 4px 6px -1px rgba(0,0,0,0.1), 0 2px 4px -1px rgba(0,0,0,0.06) !important;`;
    }
    return s;
  };

  const processElement = (el: any) => {
    if (!el) return;
    if (el.style) {
      css += `.el-node-${el.id} { ${serializeStyle(el.style)} }\n`;
      if (el.style.responsive) {
        const resp = el.style.responsive;
        if (resp.laptop) {
          css += `@media (max-width: 1199px) { .el-node-${el.id} { ${serializeStyle(resp.laptop)} } }\n`;
        }
        if (resp.tablet) {
          css += `@media (max-width: 1023px) { .el-node-${el.id} { ${serializeStyle(resp.tablet)} } }\n`;
        }
        if (resp.mobileLandscape) {
          css += `@media (max-width: 767px) { .el-node-${el.id} { ${serializeStyle(resp.mobileLandscape)} } }\n`;
        }
        if (resp.mobilePortrait) {
          css += `@media (max-width: 479px) { .el-node-${el.id} { ${serializeStyle(resp.mobilePortrait)} } }\n`;
        }
      }
    }
    if (el.children && Array.isArray(el.children)) {
      el.children.forEach(processElement);
    }
  };

  sections.forEach((sec: any) => {
    if (sec.style) {
      css += `.sec-node-${sec.instanceId} { ${serializeStyle(sec.style)} }\n`;
      if (sec.style.responsive) {
        const resp = sec.style.responsive;
        if (resp.laptop) {
          css += `@media (max-width: 1199px) { .sec-node-${sec.instanceId} { ${serializeStyle(resp.laptop)} } }\n`;
        }
        if (resp.tablet) {
          css += `@media (max-width: 1023px) { .sec-node-${sec.instanceId} { ${serializeStyle(resp.tablet)} } }\n`;
        }
        if (resp.mobileLandscape) {
          css += `@media (max-width: 767px) { .sec-node-${sec.instanceId} { ${serializeStyle(resp.mobileLandscape)} } }\n`;
        }
        if (resp.mobilePortrait) {
          css += `@media (max-width: 479px) { .sec-node-${sec.instanceId} { ${serializeStyle(resp.mobilePortrait)} } }\n`;
        }
      }
    }
    if (sec.elements && Array.isArray(sec.elements)) {
      sec.elements.forEach(processElement);
    }
  });

  return css;
}

export function RecursiveElementView({ el, onNavigate }: { el: any; onNavigate: (href: string) => void; key?: any }) {
  const elStyle = getStylesFromConfig(el.style);
  const [activeTab, setActiveTab] = React.useState(0);
  const [accordionOpen, setAccordionOpen] = React.useState(false);
  const [carouselIndex, setCarouselIndex] = React.useState(0);
  const [modalOpen, setModalOpen] = React.useState(false);
  const [drawerOpen, setDrawerOpen] = React.useState(false);
  const [rating, setRating] = React.useState(5);
  const [toastMessage, setToastMessage] = React.useState<string | null>(null);

  const wrapperClass = `el-node-${el.id} relative transition-all`;

  const renderChildren = () => {
    if (!el.children || !Array.isArray(el.children)) return null;
    return el.children.map((child: any) => (
      <RecursiveElementView key={child.id} el={child} onNavigate={onNavigate} />
    ));
  };

  switch (el.kind) {
    case "container":
      return (
        <div id={`el-${el.id}`} className={wrapperClass} style={elStyle}>
          {renderChildren()}
        </div>
      );

    case "flex":
      return (
        <div
          id={`el-${el.id}`}
          className={wrapperClass}
          style={{
            display: "flex",
            flexDirection: el.style?.flexDirection || "row",
            flexWrap: el.style?.flexWrap || "nowrap",
            justifyContent: el.style?.justifyContent || "flex-start",
            alignItems: el.style?.alignItems || "stretch",
            gap: el.style?.gap || "12px",
            ...elStyle,
          }}
        >
          {renderChildren()}
        </div>
      );

    case "grid":
      return (
        <div
          id={`el-${el.id}`}
          className={wrapperClass}
          style={{
            display: "grid",
            gridTemplateColumns: el.style?.gridTemplateColumns || "repeat(3, minmax(0, 1fr))",
            gridTemplateRows: el.style?.gridTemplateRows,
            gap: el.style?.gap || "16px",
            ...elStyle,
          }}
        >
          {renderChildren()}
        </div>
      );

    case "card":
      return (
        <div id={`el-${el.id}`} className={`${wrapperClass} p-6 bg-white border border-slate-100 shadow-xs rounded-2xl`} style={elStyle}>
          {renderChildren()}
        </div>
      );

    case "eyebrow":
      return (
        <div id={`el-${el.id}`} className={wrapperClass} style={{ textAlign: el.style?.align as any }}>
          <span className="inline-block text-xs font-bold tracking-widest uppercase px-2.5 py-1 rounded-full" style={elStyle}>
            {el.text}
          </span>
        </div>
      );

    case "heading":
      return (
        <h2 id={`el-${el.id}`} className={`${wrapperClass} leading-tight tracking-tight my-4`} style={elStyle}>
          {el.text}
        </h2>
      );

    case "paragraph":
      return (
        <p id={`el-${el.id}`} className={`${wrapperClass} leading-relaxed opacity-95 my-2 whitespace-pre-wrap`} style={elStyle}>
          {el.text}
        </p>
      );

    case "button": {
      const IconComponent = el.icon && DYNAMIC_ICONS[el.icon];
      return (
        <div id={`el-${el.id}`} className={wrapperClass} style={{ textAlign: el.style?.align as any }}>
          <a
            href={el.href || "#"}
            onClick={(e) => {
              if (el.href?.startsWith("#")) {
                e.preventDefault();
                onNavigate(el.href);
              }
            }}
            target={el.target || "_self"}
            className="inline-flex items-center gap-2 transition-all hover:opacity-90 active:scale-95"
            style={elStyle}
          >
            {el.icon && el.iconPosition === "left" && IconComponent && <IconComponent className="w-4 h-4 shrink-0" />}
            {el.text}
            {el.icon && el.iconPosition === "right" && IconComponent && <IconComponent className="w-4 h-4 shrink-0" />}
          </a>
        </div>
      );
    }

    case "image":
      return (
        <div id={`el-${el.id}`} className={wrapperClass} style={{ textAlign: el.style?.align as any }}>
          {el.imageUrl ? (
            <img
              src={el.imageUrl}
              alt={el.text || "image asset"}
              referrerPolicy="no-referrer"
              className="w-full object-cover rounded-xl"
              style={elStyle}
            />
          ) : (
            <div className="w-full aspect-video bg-slate-100 flex flex-col items-center justify-center text-slate-400 text-xs rounded-xl border border-slate-200">
              <ImageIcon className="w-6 h-6 mb-2 text-slate-300" />
              <span className="font-bold">{el.text || "ছবি"}</span>
            </div>
          )}
        </div>
      );

    case "video": {
      const videoUrl = el.videoUrl || "";
      const isYouTube = videoUrl.includes("youtube.com") || videoUrl.includes("youtu.be");

      return (
        <div id={`el-${el.id}`} className={wrapperClass}>
          {videoUrl ? (
            <div className="w-full aspect-video rounded-xl overflow-hidden bg-black shadow-lg">
              {isYouTube ? (
                <iframe
                  src={
                    videoUrl.includes("embed")
                      ? videoUrl
                      : `https://www.youtube.com/embed/${videoUrl.split("v=")[1]?.split("&")[0] || videoUrl.split("/").pop()}`
                  }
                  className="w-full h-full border-none"
                  title="YouTube video player"
                  allowFullScreen
                />
              ) : (
                <video
                  src={videoUrl}
                  autoPlay={el.videoConfig?.autoplay}
                  muted={el.videoConfig?.muted}
                  loop={el.videoConfig?.loop}
                  controls={el.videoConfig?.controls}
                  className="w-full h-full object-cover"
                />
              )}
            </div>
          ) : (
            <div className="w-full aspect-video bg-slate-100 border-2 border-dashed border-slate-200 rounded-xl flex flex-col items-center justify-center p-6 text-slate-400">
              <VideoIcon className="w-8 h-8 mb-2" />
              <span className="text-xs font-bold">ভিডিও প্লেয়ার</span>
            </div>
          )}
        </div>
      );
    }

    case "stat":
      return (
        <div id={`el-${el.id}`} className={wrapperClass} style={elStyle}>
          {el.text.split("\n").map((line: string, i: number) => (
            <div
              key={i}
              style={
                i === 0
                  ? { fontSize: el.style?.fontSize || "32px", fontWeight: el.style?.fontWeight || "800", color: el.style?.color || "#4f46e5" }
                  : { fontSize: "12px", opacity: 0.7, marginTop: "4px" }
              }
            >
              {line}
            </div>
          ))}
        </div>
      );

    case "icon-text":
      return (
        <div id={`el-${el.id}`} className={`${wrapperClass} p-5 border border-slate-100 bg-white rounded-2xl shadow-xs`} style={elStyle}>
          {el.text.split("\n").map((line: string, i: number) => (
            <div
              key={i}
              style={
                i === 0
                  ? { fontWeight: 800, fontSize: "15px", marginBottom: "6px", color: el.style?.color || "#1e293b" }
                  : { opacity: 0.8, fontSize: "12.5px", lineHeight: 1.6 }
              }
            >
              {line}
            </div>
          ))}
        </div>
      );

    case "form": {
      const fc = el.formConfig || {
        label: "আপনার ইমেল",
        placeholder: "example@email.com",
        submitText: "দাখিল করুন",
        successMessage: "ধন্যবাদ! আমরা শীঘ্রই যোগাযোগ করবো।",
      };
      return (
        <div id={`el-${el.id}`} className={wrapperClass}>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              alert(fc.successMessage || "ধন্যবাদ! ফর্ম সাবমিট হয়েছে।");
            }}
            className="p-5 bg-white/60 border border-slate-200 rounded-2xl shadow-sm space-y-3.5"
          >
            <div>
              <label className="block text-[11px] font-black text-slate-700 uppercase tracking-wider mb-1">{fc.label}</label>
              <input
                type="text"
                required
                placeholder={fc.placeholder}
                className="w-full bg-white border border-slate-300 rounded-lg px-3 py-2 text-xs text-slate-700 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
              />
            </div>
            <button type="submit" className="w-full bg-indigo-600 text-white rounded-lg py-2.5 text-xs font-black hover:bg-indigo-500 transition-colors cursor-pointer">
              {fc.submitText}
            </button>
          </form>
        </div>
      );
    }

    case "tabs": {
      const tabs = el.tabsConfig || ["সেবা ১", "সেবা ২", "সেবা ৩"];
      return (
        <div id={`el-${el.id}`} className={`${wrapperClass} w-full`} style={elStyle}>
          <div className="flex border-b border-slate-200 mb-4 gap-1.5 overflow-x-auto">
            {tabs.map((tab: string, idx: number) => (
              <button
                key={idx}
                type="button"
                onClick={() => setActiveTab(idx)}
                className={`py-2 px-4 text-xs font-bold border-b-2 transition-all whitespace-nowrap cursor-pointer ${
                  activeTab === idx ? "border-indigo-600 text-indigo-600 bg-indigo-50/20" : "border-transparent text-slate-500 hover:text-slate-700"
                }`}
              >
                {tab}
              </button>
            ))}
          </div>
          <div className="p-3 bg-white rounded-xl border border-slate-100">
            {el.children && el.children[activeTab] ? (
              <RecursiveElementView el={el.children[activeTab]} onNavigate={onNavigate} />
            ) : (
              <div className="text-xs text-slate-400 py-6 text-center">ট্যাব কনটেন্ট খালি। বিল্ডার থেকে যোগ করুন।</div>
            )}
          </div>
        </div>
      );
    }

    case "accordion":
      return (
        <div id={`el-${el.id}`} className={`${wrapperClass} border border-slate-200 rounded-xl overflow-hidden bg-white`} style={elStyle}>
          <button
            type="button"
            onClick={() => setAccordionOpen(!accordionOpen)}
            className="w-full px-5 py-3.5 text-left font-bold text-xs sm:text-sm text-slate-800 flex justify-between items-center bg-slate-50 hover:bg-slate-100/60 transition-colors cursor-pointer"
          >
            <span>{el.text || "জিজ্ঞাস্য বিষয়"}</span>
            <span className={`transform transition-transform text-slate-400 duration-200 ${accordionOpen ? "rotate-180" : ""}`}>▼</span>
          </button>
          {accordionOpen && (
            <div className="p-5 border-t border-slate-100 text-xs text-slate-600 bg-white">
              {el.children && el.children.length > 0 ? renderChildren() : (el.accordionContent || "বিস্তারিত তথ্যসমূহ এখানে দেখা যাবে।")}
            </div>
          )}
        </div>
      );

    case "carousel": {
      const slidesCount = el.children?.length || 1;
      return (
        <div id={`el-${el.id}`} className={`${wrapperClass} relative overflow-hidden bg-slate-50 border border-slate-100 rounded-2xl p-6`} style={elStyle}>
          <div className="flex transition-transform duration-500 ease-out">
            {el.children && el.children[carouselIndex] ? (
              <div className="w-full shrink-0">
                <RecursiveElementView el={el.children[carouselIndex]} onNavigate={onNavigate} />
              </div>
            ) : (
              <div className="w-full text-center py-10 text-xs text-slate-400">ক্যারোসেল স্লাইড খালি।</div>
            )}
          </div>
          {slidesCount > 1 && (
            <div className="flex justify-between items-center mt-4">
              <button
                type="button"
                onClick={() => setCarouselIndex((prev) => (prev - 1 + slidesCount) % slidesCount)}
                className="p-1.5 text-xs bg-white border border-slate-200 rounded-lg hover:bg-slate-50 cursor-pointer"
              >
                ◀
              </button>
              <div className="flex gap-1">
                {Array.from({ length: slidesCount }).map((_, idx) => (
                  <div
                    key={idx}
                    className={`w-1.5 h-1.5 rounded-full ${carouselIndex === idx ? "bg-indigo-600" : "bg-slate-300"}`}
                  />
                ))}
              </div>
              <button
                type="button"
                onClick={() => setCarouselIndex((prev) => (prev + 1) % slidesCount)}
                className="p-1.5 text-xs bg-white border border-slate-200 rounded-lg hover:bg-slate-50 cursor-pointer"
              >
                ▶
              </button>
            </div>
          )}
        </div>
      );
    }

    case "progress":
      return (
        <div id={`el-${el.id}`} className={wrapperClass} style={elStyle}>
          <div className="flex justify-between text-[11px] font-bold text-slate-600 mb-1">
            <span>{el.text || "অগ্রগতি"}</span>
            <span>{el.progressValue || 75}%</span>
          </div>
          <div className="w-full bg-slate-100 rounded-full h-2">
            <div
              className="bg-indigo-600 h-2 rounded-full transition-all duration-500"
              style={{ width: `${el.progressValue || 75}%` }}
            />
          </div>
        </div>
      );

    case "badge":
      return (
        <div id={`el-${el.id}`} className={wrapperClass} style={{ textAlign: el.style?.align as any }}>
          <span className="inline-block px-2.5 py-1 text-[10px] font-black uppercase tracking-wider rounded bg-indigo-50 text-indigo-700 border border-indigo-100" style={elStyle}>
            {el.text || "নতুন"}
          </span>
        </div>
      );

    case "avatar":
      return (
        <div id={`el-${el.id}`} className={`${wrapperClass} flex justify-center`} style={elStyle}>
          {el.imageUrl ? (
            <img src={el.imageUrl} alt="Avatar" className="w-12 h-12 rounded-full object-cover border-2 border-indigo-100 shadow-xs" />
          ) : (
            <div className="w-12 h-12 rounded-full bg-indigo-100 text-indigo-700 font-bold flex items-center justify-center text-sm">
              {el.text ? el.text.substring(0, 2) : "ইউ"}
            </div>
          )}
        </div>
      );

    case "chart":
      return (
        <div id={`el-${el.id}`} className={`${wrapperClass} p-5 border border-slate-150 bg-white rounded-2xl shadow-2xs`} style={elStyle}>
          <span className="block text-xs font-bold text-slate-800 mb-3">{el.text || "সাপ্তাহিক স্পিচ ডেভেলপমেন্ট চার্ট"}</span>
          <div className="h-28 flex items-end gap-3 px-2">
            {[40, 65, 50, 85, 70, 95].map((val, idx) => (
              <div key={idx} className="flex-1 flex flex-col items-center">
                <div
                  className="w-full bg-indigo-500 hover:bg-indigo-600 rounded-t-sm transition-all duration-300"
                  style={{ height: `${val}%` }}
                />
                <span className="text-[9px] text-slate-400 mt-1 font-mono">{idx + 1}W</span>
              </div>
            ))}
          </div>
        </div>
      );

    case "toast":
      return (
        <div id={`el-${el.id}`} className={wrapperClass}>
          <button
            type="button"
            onClick={() => {
              setToastMessage(el.text || "টোটাল সাকসেসফুল মেসেজ!");
              setTimeout(() => setToastMessage(null), 3000);
            }}
            className="px-4 py-2 bg-slate-900 text-white font-bold text-xs rounded-lg hover:bg-slate-800 cursor-pointer"
          >
            ক্লিক করুন নোটিফিকেশনের জন্য
          </button>
          {toastMessage && (
            <div className="fixed bottom-6 right-6 bg-slate-900 border border-slate-800 text-white rounded-xl px-4 py-3 shadow-2xl flex items-center gap-3 z-50 animate-bounce">
              <span className="text-xs font-bold">{toastMessage}</span>
            </div>
          )}
        </div>
      );

    case "map":
      return (
        <div id={`el-${el.id}`} className={`${wrapperClass} overflow-hidden rounded-xl bg-slate-100 border border-slate-200`} style={elStyle}>
          <div className="aspect-video relative flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-slate-100 bg-[radial-gradient(#cbd5e1_1px,transparent_1px)] [background-size:16px_16px] opacity-60" />
            <div className="relative z-10 bg-white p-3 rounded-lg shadow-md border border-slate-200 text-center max-w-xs">
              <MapPin className="w-5 h-5 mx-auto text-indigo-600 mb-1" />
              <span className="block text-xs font-black text-slate-800">{el.text || "আমাদের হেড অফিস ম্যাপ"}</span>
              <span className="block text-[10px] text-slate-400 mt-1">ঢাকা, বাংলাদেশ</span>
            </div>
          </div>
        </div>
      );

    case "breadcrumb": {
      const items = el.breadcrumbItems || ["হোম", "থেরাপি সার্ভিস", "বিস্তারিত"];
      return (
        <div id={`el-${el.id}`} className={`${wrapperClass} text-xs font-bold text-slate-400 flex items-center gap-1.5`} style={elStyle}>
          {items.map((item: string, idx: number) => (
            <React.Fragment key={idx}>
              {idx > 0 && <span>/</span>}
              <span className={idx === items.length - 1 ? "text-slate-800" : "hover:text-slate-600 cursor-pointer"}>{item}</span>
            </React.Fragment>
          ))}
        </div>
      );
    }

    case "input":
      return (
        <div id={`el-${el.id}`} className={wrapperClass} style={elStyle}>
          <label className="block text-[11px] font-bold text-slate-600 mb-1">{el.text || "আপনার নাম"}</label>
          <input
            type="text"
            placeholder={el.placeholder || "নাম লিখুন..."}
            className="w-full bg-white border border-slate-200 rounded-lg px-3 py-2 text-xs focus:ring-2 focus:ring-indigo-500 focus:outline-none"
          />
        </div>
      );

    case "textarea":
      return (
        <div id={`el-${el.id}`} className={wrapperClass} style={elStyle}>
          <label className="block text-[11px] font-bold text-slate-600 mb-1">{el.text || "বার্তা"}</label>
          <textarea
            placeholder={el.placeholder || "আপনার মতামত লিখুন..."}
            className="w-full bg-white border border-slate-200 rounded-lg px-3 py-2 text-xs focus:ring-2 focus:ring-indigo-500 focus:outline-none h-20"
          />
        </div>
      );

    case "select": {
      const options = el.selectOptions || ["অপশন ১", "অপশন ২", "অপশন ৩"];
      return (
        <div id={`el-${el.id}`} className={wrapperClass} style={elStyle}>
          <label className="block text-[11px] font-bold text-slate-600 mb-1">{el.text || "অপশন নির্বাচন করুন"}</label>
          <select className="w-full bg-white border border-slate-200 rounded-lg px-3 py-2 text-xs focus:ring-2 focus:ring-indigo-500 focus:outline-none">
            {options.map((opt: string, idx: number) => (
              <option key={idx} value={opt}>{opt}</option>
            ))}
          </select>
        </div>
      );
    }

    case "checkbox":
      return (
        <div id={`el-${el.id}`} className={`${wrapperClass} flex items-center gap-2`} style={elStyle}>
          <input type="checkbox" className="w-4 h-4 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500" />
          <span className="text-xs text-slate-700">{el.text || "শর্তাবলীতে রাজি"}</span>
        </div>
      );

    case "radio":
      return (
        <div id={`el-${el.id}`} className={`${wrapperClass} flex items-center gap-2`} style={elStyle}>
          <input type="radio" className="w-4 h-4 border-slate-300 text-indigo-600 focus:ring-indigo-500" />
          <span className="text-xs text-slate-700">{el.text || "সকাল (১০টা - ১২টা)"}</span>
        </div>
      );

    case "calendar":
      return (
        <div id={`el-${el.id}`} className={`${wrapperClass} p-4 bg-white border border-slate-200 rounded-2xl shadow-xs`} style={elStyle}>
          <span className="block text-xs font-bold text-slate-800 mb-2">{el.text || "তারিখ সিলেক্ট করুন"}</span>
          <div className="grid grid-cols-7 gap-1 text-center">
            {["শ", "র", "সো", "ম", "বু", "বৃ", "শু"].map((day) => (
              <span key={day} className="text-[10px] font-bold text-slate-400 py-1">{day}</span>
            ))}
            {Array.from({ length: 31 }).map((_, idx) => (
              <button
                key={idx}
                type="button"
                className={`text-[10px] p-1.5 rounded-md hover:bg-indigo-50 hover:text-indigo-600 transition-colors cursor-pointer ${
                  rating === idx ? "bg-indigo-600 text-white font-bold" : "text-slate-600"
                }`}
                onClick={() => setRating(idx)}
              >
                {idx + 1}
              </button>
            ))}
          </div>
        </div>
      );

    case "modal":
      return (
        <div id={`el-${el.id}`} className={wrapperClass}>
          <button
            type="button"
            onClick={() => setModalOpen(true)}
            className="px-4 py-2 bg-indigo-600 text-white font-bold text-xs rounded-lg hover:bg-indigo-500 cursor-pointer"
          >
            {el.text || "পপআপ মডেল চালু করুন"}
          </button>
          {modalOpen && (
            <div className="fixed inset-0 bg-black/60 flex items-center justify-center p-4 z-50">
              <div className="bg-white rounded-2xl max-w-md w-full p-6 relative shadow-2xl">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 font-bold"
                >
                  ✕
                </button>
                <div className="mt-1">
                  {el.children && el.children.length > 0 ? renderChildren() : (
                    <div>
                      <h3 className="font-bold text-slate-900 text-sm">পপআপ মডেল</h3>
                      <p className="text-xs text-slate-500 mt-2">বিল্ডার থেকে এই মডেলে যেকোনো কাস্টম উইজেট ড্র্যাগ করে সাজাতে পারবেন।</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      );

    case "drawer":
      return (
        <div id={`el-${el.id}`} className={wrapperClass}>
          <button
            type="button"
            onClick={() => setDrawerOpen(true)}
            className="px-4 py-2 bg-slate-900 text-white font-bold text-xs rounded-lg hover:bg-slate-800 cursor-pointer"
          >
            {el.text || "সাইড ড্রয়ার ওপেন"}
          </button>
          {drawerOpen && (
            <div className="fixed inset-0 bg-black/50 z-50">
              <div className="fixed top-0 right-0 h-full w-80 bg-white shadow-2xl p-6 transition-all duration-300">
                <button
                  type="button"
                  onClick={() => setDrawerOpen(false)}
                  className="text-xs text-slate-500 hover:text-slate-800 font-bold mb-6 block"
                >
                  ◀ ব্যাক
                </button>
                <div>
                  {el.children && el.children.length > 0 ? renderChildren() : (
                    <div>
                      <h4 className="font-bold text-slate-900 text-sm">ডান সাইড ইনফো ড্রয়ার</h4>
                      <p className="text-xs text-slate-500 mt-2">আপনার প্রয়োজনীয় অতিরিক্ত ডেসক্রিপশন ড্রয়ারে যুক্ত করুন।</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      );

    default:
      return null;
  }
}

export default function PublicLandingPage({
  pageConfig,
  services,
  therapists,
  onNavigate,
  onSelectTherapist,
  isEditable = false,
  activeField,
  onSelectField
}: PublicLandingPageProps) {
  const [spokenText, setSpokenText] = useState<string | null>(null);
  const [contactForm, setContactForm] = useState({ parentName: "", childAge: "", phone: "", message: "", therapyType: "speech" });
  const [contactSuccess, setContactSuccess] = useState(false);

  // Fallback default sequence of sections in case config is partial
  const order = pageConfig.sectionsOrder || ["hero", "services", "therapists", "video", "aac", "custom_code", "contact", "footer"];
  const visibility = pageConfig.sectionsVisibility || {};

  const handleSpeak = (text: string) => {
    setSpokenText(text);
    if ("speechSynthesis" in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = "bn-BD";
      utterance.rate = 0.85;
      window.speechSynthesis.speak(utterance);
    }
    setTimeout(() => setSpokenText(null), 3000);
  };

  const handleContactSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setContactSuccess(true);
    setContactForm({ parentName: "", childAge: "", phone: "", message: "", therapyType: "speech" });
    setTimeout(() => setContactSuccess(false), 4500);
  };

  // Helper to wrap editable fields with click-to-edit borders in Admin customizer
  const renderEditableWrapper = (
    fieldName: keyof LandingPageConfig, 
    content: React.ReactNode, 
    className: string = "inline-block"
  ) => {
    if (!isEditable) {
      return <div className={className}>{content}</div>;
    }

    const isActive = activeField === fieldName;

    return (
      <div 
        onClick={(e) => {
          e.stopPropagation();
          if (onSelectField) onSelectField(fieldName);
        }}
        className={`relative cursor-pointer transition-all duration-200 group/edit ${className} ${
          isActive 
            ? "ring-2 ring-indigo-500 ring-offset-2 rounded-lg bg-indigo-50/20" 
            : "hover:outline hover:outline-2 hover:outline-dashed hover:outline-indigo-400 hover:outline-offset-2 rounded-lg hover:bg-slate-50/50"
        }`}
        title={`ক্লিক করে এটি এডিট করুন (${fieldName})`}
      >
        {content}
        <span className="absolute -top-3.5 -right-2 bg-indigo-600 text-white text-[9px] font-bold px-1.5 py-0.5 rounded shadow-sm opacity-0 group-hover/edit:opacity-100 transition-opacity z-10 flex items-center gap-1 font-mono">
          <Edit2 className="w-2.5 h-2.5" /> {fieldName}
        </span>
      </div>
    );
  };

  const renderServiceIcon = (iconName: string) => {
    switch (iconName) {
      case "Activity": return <Activity className="w-6 h-6 text-sky-600" />;
      case "Home": return <Home className="w-6 h-6 text-rose-600" />;
      case "Music": return <Music className="w-6 h-6 text-purple-600" />;
      case "Gamepad2": return <Gamepad2 className="w-6 h-6 text-amber-600" />;
      case "GraduationCap": return <GraduationCap className="w-6 h-6 text-emerald-600" />;
      case "Sparkle": return <Sparkle className="w-6 h-6 text-teal-600" />;
      case "Baby": return <Baby className="w-6 h-6 text-indigo-600" />;
      case "FileText": return <FileText className="w-6 h-6 text-rose-600" />;
      default: return <Activity className="w-6 h-6 text-sky-600" />;
    }
  };

  // 1. Dynamic Navbar (Sticky header)
  const navbarNode = (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200/80 px-6 sm:px-12 py-4 flex items-center justify-between shadow-xs theme-custom-font">
      <div className="flex items-center gap-3.5">
        <div className="w-10 h-10 bg-linear-to-tr from-sky-400 to-emerald-400 rounded-2xl flex items-center justify-center text-white font-black text-xl tracking-wider shadow-md shadow-sky-150">
          SL
        </div>
        <div>
          {renderEditableWrapper("logoText", (
            <span className="font-black text-base sm:text-lg tracking-tight text-slate-900 block">{pageConfig.logoText || "DocTime Speech Lab"}</span>
          ))}
          <span className="text-[10px] text-emerald-600 bg-emerald-50 px-2.5 py-0.5 rounded-full font-extrabold uppercase tracking-widest block w-max mt-0.5">
            বিশেষ শিশু সেবা
          </span>
        </div>
      </div>

      <nav className="hidden lg:flex items-center gap-6 text-xs font-bold text-slate-600">
        {pageConfig.menuLinks && pageConfig.menuLinks.length > 0 ? (
          pageConfig.menuLinks.map((link) => (
            <a key={link.id} href={link.url} className="hover:text-indigo-600 transition-colors">{link.label}</a>
          ))
        ) : (
          <>
            <a href="#services-section" className="hover:text-indigo-600 transition-colors">সেবাসমূহ</a>
            <a href="#therapists-section" className="hover:text-indigo-600 transition-colors">বিশেষজ্ঞ প্যানেল</a>
            <a href="#aac-section" className="hover:text-indigo-600 transition-colors">এএসি স্পিচ বোর্ড</a>
            <a href="#contact-section" className="hover:text-indigo-600 transition-colors">যোগাযোগ</a>
          </>
        )}
      </nav>

      <div className="flex items-center gap-3">
        {renderEditableWrapper("phoneText", (
          <a 
            href={`tel:${pageConfig.phoneText}`} 
            className="bg-emerald-50 text-emerald-800 hover:bg-emerald-100 border border-emerald-200/60 px-3.5 py-2 rounded-xl text-xs font-extrabold flex items-center gap-1.5 transition-colors"
          >
            <Phone className="w-3.5 h-3.5 text-emerald-600" />
            <span className="hidden sm:inline">{pageConfig.phoneText || "+৮৮০ ১৭০০-০০০০০০"}</span>
          </a>
        ))}
        <button 
          onClick={() => onNavigate("#/login")}
          className="bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs px-4 py-2 rounded-xl shadow-xs cursor-pointer transition-all theme-primary-bg"
          style={{ backgroundColor: pageConfig.themeColor }}
        >
          লগইন করুন
        </button>
      </div>
    </header>
  );

  return (
    <div className="w-full flex-1 flex flex-col theme-custom-font transition-all duration-300" style={{ backgroundColor: pageConfig.themeBgColor || "#f8fafc" }}>
      
      {/* 0. Style tag injection for custom colors & fonts */}
      <style dangerouslySetInnerHTML={{
        __html: `
          .theme-custom-font {
            font-family: ${pageConfig.customFontName ? `'${pageConfig.customFontName}', ` : ''}'${pageConfig.fontFamily}', sans-serif !important;
          }
          .theme-text-primary {
            color: ${pageConfig.themeColor || "#0ea5e9"} !important;
          }
          .theme-text-secondary {
            color: ${pageConfig.themeColorSecondary || "#ec4899"} !important;
          }
          .theme-text-body {
            color: ${pageConfig.themeTextColor || "#0f172a"} !important;
          }
          ${compileStylesForPage(pageConfig.visualSections || [])}
        `
      }} />

      {navbarNode}

      {/* Render AI Visual Page Builder sections if they exist, otherwise render classic layout */}
      {pageConfig.visualSections && pageConfig.visualSections.length > 0 ? (
        <div className="flex flex-col">
          {pageConfig.visualSections.map((sec: any) => {
            if (sec.visible === false) return null;
            
            const secStyles = getStylesFromConfig(sec.style);
            const gridCols = sec.columns ? `repeat(${Math.min(sec.columns, 4)}, minmax(0, 1fr))` : undefined;

            return (
              <section
                key={sec.instanceId}
                style={secStyles}
                className="w-full relative transition-all overflow-hidden"
              >
                {/* Background Video Support for Sections */}
                {sec.style?.bgType === "video" && sec.style?.bgVideo && (
                  <video
                    src={sec.style.bgVideo}
                    autoPlay
                    muted
                    loop
                    className="absolute inset-0 w-full h-full object-cover z-0 pointer-events-none opacity-40"
                  />
                )}

                <div 
                  id={`sec-${sec.instanceId}`}
                  className={`sec-node-${sec.instanceId} max-w-7xl mx-auto px-6 sm:px-12 relative z-10`}
                  style={{
                    display: gridCols ? "grid" : "block",
                    gridTemplateColumns: gridCols,
                    gap: gridCols ? "16px" : undefined,
                  }}
                >
                  {sec.elements && sec.elements.map((el: any) => (
                    <RecursiveElementView key={el.id} el={el} onNavigate={onNavigate} />
                  ))}
                </div>
              </section>
            );
          })}
        </div>
      ) : (
        order.map((sectionId) => {
          const isVisible = visibility[sectionId] !== false;
          if (!isVisible) return null;

        switch (sectionId) {
          // --- HERO SECTION ---
          case "hero":
            return (
              <section 
                key={sectionId} 
                id="hero-section" 
                className="py-16 sm:py-24 px-6 sm:px-12 relative overflow-hidden border-b border-slate-200/50"
                style={{ backgroundColor: (pageConfig.themeBgColor || "#f8fafc") }}
              >
                {/* Decorative backgrounds */}
                <div className="absolute top-12 right-20 text-indigo-400 opacity-25 text-3xl animate-bounce">★</div>
                <div className="absolute bottom-16 right-1/3 text-pink-400 opacity-25 text-4xl animate-pulse">❤</div>
                <div className="absolute top-24 left-1/4 text-emerald-400 opacity-25 text-3xl">✿</div>

                <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
                  <div className="lg:col-span-7 space-y-6 text-left">
                    <div className="inline-flex items-center gap-2 bg-white px-3.5 py-1.5 rounded-full border border-slate-200 text-xs font-bold shadow-2xs">
                      <Sparkles className="w-3.5 h-3.5 text-pink-500" />
                      <span style={{ color: pageConfig.themeColor }}>স্পিচ থেরাপি ও অটিজম ডেভেলপমেন্ট কেয়ার সেন্টার</span>
                    </div>
                    
                    {renderEditableWrapper("heroTitle", (
                      <h1 className="text-3xl sm:text-5xl font-black leading-tight whitespace-pre-line tracking-tight" style={{ color: pageConfig.themeTextColor }}>
                        {pageConfig.heroTitle}
                      </h1>
                    ), "block")}

                    {renderEditableWrapper("heroDesc", (
                      <p className="text-sm sm:text-base leading-relaxed whitespace-pre-line opacity-80" style={{ color: pageConfig.themeTextColor }}>
                        {pageConfig.heroDesc}
                      </p>
                    ), "block")}

                    <div className="flex flex-wrap gap-4 pt-2">
                      {renderEditableWrapper("ctaText", (
                        <button
                          onClick={() => onNavigate(pageConfig.ctaUrl || "#/patient")}
                          className="text-white font-extrabold text-xs sm:text-sm px-7 py-4 rounded-2xl flex items-center gap-2 shadow-lg transition-all transform hover:-translate-y-0.5 cursor-pointer theme-primary-bg"
                          style={{ backgroundColor: pageConfig.themeColor }}
                        >
                          <Activity className="w-4 h-4" />
                          <span>{pageConfig.ctaText}</span>
                        </button>
                      ))}
                      <button
                        onClick={() => onNavigate("#/login")}
                        className="bg-white hover:bg-slate-50 text-slate-800 border border-slate-200 font-extrabold text-xs sm:text-sm px-6 py-4 rounded-2xl flex items-center gap-2 shadow-xs transition-all transform hover:-translate-y-0.5 cursor-pointer"
                      >
                        <Stethoscope className="w-4 h-4 text-emerald-500" />
                        <span>🩺 ক্লিনিক এডমিন প্যানেল</span>
                      </button>
                    </div>
                  </div>

                  {/* Bento info card */}
                  <div className="lg:col-span-5">
                    <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 shadow-xl space-y-5 relative">
                      <div className="absolute -top-3.5 -right-3.5 text-white font-black text-[10px] px-3.5 py-1 rounded-full uppercase tracking-wider shadow-md theme-secondary-bg" style={{ backgroundColor: pageConfig.themeColorSecondary }}>
                        সর্বোচ্চ কেয়ার
                      </div>
                      <h3 className="font-extrabold text-slate-900 text-base flex items-center gap-2 border-b border-slate-100 pb-3">
                        <Clock className="w-5 h-5" style={{ color: pageConfig.themeColor }} />
                        <span>চেম্বার ও সেশন বুকিং সময়</span>
                      </h3>
                      <div className="space-y-3.5 text-xs">
                        <div className="flex items-center justify-between">
                          <span className="text-slate-500 font-medium">শনিবার - বৃহস্পতিবার:</span>
                          <span className="font-bold text-slate-800">সকাল ০৯:০০ - রাত ০৮:০০</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-slate-500 font-medium">শুক্রবার:</span>
                          <span className="font-bold text-emerald-600">শুধুমাত্র অনলাইন ভিডিও সেশন</span>
                        </div>
                        <div className="bg-slate-50 p-3 rounded-xl border border-slate-150 text-[11px] text-slate-600 leading-relaxed">
                          💬 আমাদের থেরাপিস্টদের সাথে সরাসরি সেশন বুকিং করতে রোগী ড্যাশবোর্ডে প্রবেশ করুন অথবা নিচে দেওয়া সহজ ফরম পূরণ করুন।
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </section>
            );

          // --- 8 SERVICES CARD GRID ---
          case "services":
            return (
              <section key={sectionId} id="services-section" className="py-16 px-6 sm:px-12 max-w-7xl mx-auto space-y-12 w-full">
                <div className="text-center max-w-2xl mx-auto space-y-3">
                  <span className="text-xs font-bold tracking-widest uppercase" style={{ color: pageConfig.themeColor }}>
                    Service Offerings
                  </span>
                  
                  {renderEditableWrapper("servicesTitle", (
                    <h2 className="text-2xl sm:text-3xl font-black text-slate-900">
                      {pageConfig.servicesTitle}
                    </h2>
                  ), "block")}

                  {renderEditableWrapper("servicesDesc", (
                    <p className="text-xs sm:text-sm text-slate-500 leading-relaxed">
                      {pageConfig.servicesDesc}
                    </p>
                  ), "block")}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  {services.slice(0, 8).map((service, idx) => (
                    <div
                      key={service.id}
                      className={`border border-slate-100 p-6 rounded-2xl transition-all duration-300 hover:-translate-y-1 hover:shadow-lg flex flex-col justify-between ${service.bgColor}`}
                    >
                      <div className="space-y-4">
                        <div className="flex items-center justify-between">
                          <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full uppercase ${service.accentColor}`}>
                            {service.tag}
                          </span>
                          {service.isPromo && (
                            <span className="bg-rose-500 text-white text-[9px] font-black px-2 py-0.5 rounded-full uppercase animate-pulse flex items-center gap-0.5">
                              <Sparkle className="w-2.5 h-2.5" /> অফার
                            </span>
                          )}
                        </div>

                        <div className="flex items-center gap-3">
                          <div className="p-2 bg-white rounded-lg border border-slate-200/50 shadow-2xs shrink-0">
                            {renderServiceIcon(service.iconName)}
                          </div>
                          <h3 className="font-extrabold text-sm sm:text-base text-slate-900 leading-tight">
                            {service.titleBangla.includes(".") ? service.titleBangla.split(" ").slice(1).join(" ") : service.titleBangla}
                          </h3>
                        </div>

                        <p className="text-slate-600 text-xs leading-relaxed">
                          {service.descBangla}
                        </p>
                      </div>

                      <div className="pt-4 mt-4 border-t border-slate-200/40 flex items-center justify-between text-[11px]">
                        <span className="text-slate-400 font-mono">সেবা #{idx+1}</span>
                        <button
                          onClick={() => onNavigate("#/patient")}
                          className="hover:underline font-extrabold flex items-center gap-1 cursor-pointer text-xs"
                          style={{ color: pageConfig.themeColor }}
                        >
                          <span>বিস্তারিত সেশন</span>
                          <ChevronRight className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            );

          // --- EXPERT PANEL (THERAPIST DIRECTORY) ---
          case "therapists":
            return (
              <section key={sectionId} id="therapists-section" className="py-16 px-6 sm:px-12 border-t border-slate-200 w-full" style={{ backgroundColor: (pageConfig.themeBgColor || "#f8fafc") }}>
                <div className="max-w-7xl mx-auto space-y-12">
                  <div className="text-center max-w-2xl mx-auto space-y-3">
                    <span className="text-xs font-bold tracking-widest uppercase" style={{ color: pageConfig.themeColor }}>
                      Expert Panel
                    </span>

                    {renderEditableWrapper("therapistsTitle", (
                      <h2 className="text-2xl sm:text-3xl font-black text-slate-900">
                        {pageConfig.therapistsTitle}
                      </h2>
                    ), "block")}

                    {renderEditableWrapper("therapistsDesc", (
                      <p className="text-xs sm:text-sm text-slate-500 leading-relaxed">
                        {pageConfig.therapistsDesc}
                      </p>
                    ), "block")}
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
                    {therapists.map((therapist) => (
                      <div 
                        key={therapist.id}
                        className="border border-slate-200 rounded-3xl p-6 hover:shadow-md transition-all flex flex-col justify-between bg-white"
                      >
                        <div className="space-y-4">
                          <div className="flex items-center gap-4">
                            {therapist.avatar_url ? (
                              <img 
                                src={therapist.avatar_url} 
                                alt={therapist.name} 
                                referrerPolicy="no-referrer"
                                className="w-16 h-16 rounded-2xl object-cover border border-slate-200 shrink-0" 
                              />
                            ) : (
                              <div 
                                className="w-16 h-16 rounded-2xl text-white flex items-center justify-center text-xl font-black shrink-0 font-display shadow-sm"
                                style={{ backgroundColor: pageConfig.themeColor }}
                              >
                                {therapist.name.includes("ডা.") ? "ডা" : therapist.name[0]}
                              </div>
                            )}
                            <div>
                              <span className="text-[10px] bg-slate-100 px-2.5 py-0.5 rounded-full font-bold uppercase tracking-wider text-slate-700">
                                {therapist.designation}
                              </span>
                              <h3 className="font-extrabold text-slate-900 text-base sm:text-lg mt-0.5">{therapist.name}</h3>
                              <p className="text-xs text-slate-500 font-semibold">{therapist.specialty}</p>
                            </div>
                          </div>

                          <p className="text-xs text-slate-600 leading-relaxed line-clamp-3">
                            {therapist.experience}
                          </p>

                          <div className="bg-slate-50 p-3 rounded-xl border border-slate-150 text-xs space-y-1.5">
                            <p className="text-slate-500"><strong className="text-slate-700 font-bold">যোগ্যতা:</strong> {therapist.credentials}</p>
                            <p className="text-slate-500"><strong className="text-slate-700 font-bold">লোকেশন:</strong> {therapist.branch}</p>
                          </div>
                        </div>

                        <div className="pt-4 mt-4 border-t border-slate-200/60 flex items-center justify-between text-xs">
                          <span className="font-extrabold text-sm" style={{ color: pageConfig.themeColor }}>
                            ফি: {therapist.visit_fee} টাকা
                          </span>
                          <button
                            onClick={() => onSelectTherapist && onSelectTherapist(therapist)}
                            className="text-white font-extrabold px-4 py-2 rounded-xl transition-all cursor-pointer theme-primary-bg"
                            style={{ backgroundColor: pageConfig.themeColor }}
                          >
                            বিস্তারিত প্রোফাইল
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </section>
            );

          // --- VIDEO CONSULTATION (YOUTUBE EMBED) ---
          case "video":
            return (
              <section key={sectionId} id="video-section" className="py-16 px-6 sm:px-12 max-w-4xl mx-auto space-y-8 w-full text-center">
                <div className="space-y-2">
                  <span className="text-xs font-bold tracking-widest uppercase" style={{ color: pageConfig.themeColor }}>
                    Video Consultation Widget
                  </span>
                  <h3 className="text-xl sm:text-2xl font-black text-slate-900">ভিডিও কনসালটেশন ও সেশন গাইড</h3>
                  <p className="text-xs text-slate-500 max-w-xl mx-auto">নিচের ভিডিওতে আমাদের স্পিচ প্যাথলজি ল্যাবের ওয়ান-টু-ওয়ান অনলাইন থেরাপি নেওয়ার পদ্ধতি দেখানো হয়েছে।</p>
                </div>

                <div className="aspect-video w-full rounded-3xl overflow-hidden border border-slate-200 shadow-2xl bg-slate-950">
                  {pageConfig.youtubeEmbed.includes("embed") ? (
                    <iframe
                      src={pageConfig.youtubeEmbed}
                      title="DocTime Speech Therapy Session"
                      className="w-full h-full"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                    ></iframe>
                  ) : (
                    <div className="w-full h-full flex flex-col items-center justify-center p-6 text-slate-400">
                      <Play className="w-16 h-16 text-rose-500 animate-pulse mb-4" />
                      <p className="text-xs font-mono">{pageConfig.youtubeEmbed}</p>
                      <p className="text-[10px] text-slate-500 mt-1">ইউটিউব এমবেড লিংক নয়, সরাসরি সেশন টিউটোরিয়াল প্লেয়ার প্রিভিউ সচল আছে।</p>
                    </div>
                  )}
                </div>
              </section>
            );

          // --- AAC BOARD (ASSISTIVE SPEECH GRID) ---
          case "aac":
            return (
              <section key={sectionId} id="aac-section" className="py-16 px-6 sm:px-12 max-w-5xl mx-auto space-y-8 w-full">
                <div className="text-center space-y-2">
                  <span className="text-xs font-bold tracking-widest uppercase" style={{ color: pageConfig.themeColor }}>
                    AAC Speech Assistive Tools
                  </span>
                  <h2 className="text-xl sm:text-2xl font-black text-slate-900">বাংলা ভিজ্যুয়াল এএসি (AAC) কথা বলা বোর্ড</h2>
                  <p className="text-xs text-slate-500 max-w-xl mx-auto">যেসব শিশু কথা বলতে সমস্যায় পড়ে, তারা এই বোর্ডের ছবি বা বাটনে ক্লিক করে তাদের প্রয়োজনীয় আবেগ ও চাহিদার অনুভূতি প্রকাশ করতে পারবে।</p>
                </div>

                <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 shadow-md relative">
                  {spokenText && (
                    <div className="absolute top-4 left-1/2 -translate-x-1/2 bg-slate-900 text-white border border-emerald-400 px-4 py-2 rounded-2xl flex items-center gap-2 shadow-lg animate-bounce z-20">
                      <Volume2 className="w-4 h-4 text-emerald-400 animate-pulse" />
                      <span className="text-xs font-bold">স্পিচ টকার: "{spokenText}"</span>
                    </div>
                  )}

                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                    {AAC_ITEMS.map((item) => (
                      <button
                        key={item.id}
                        onClick={() => handleSpeak(item.speech)}
                        className={`p-5 rounded-2xl border-2 hover:scale-105 hover:shadow-md transition-all duration-200 text-center flex flex-col items-center gap-2 cursor-pointer ${item.color}`}
                      >
                        <span className="text-4xl select-none">{item.emoji}</span>
                        <span className="text-xs sm:text-sm font-black tracking-tight">{item.label}</span>
                        <div className="w-5 h-5 rounded-full bg-white/70 flex items-center justify-center border border-black/5 mt-1">
                          <Volume2 className="w-3 h-3 text-slate-600" />
                        </div>
                      </button>
                    ))}
                  </div>

                  <div className="text-center text-[10px] text-slate-400 font-bold mt-4 flex items-center justify-center gap-1">
                    <span>💡 HTML5 Speech Synthesis API দ্বারা সমর্থিত স্বয়ংক্রিয় বাংলা ভয়েস টকার।</span>
                  </div>
                </div>
              </section>
            );

          // --- CUSTOM CODE / LIQUID INJECTOR ---
          case "custom_code":
            return (
              <section key={sectionId} id="custom-code-section" className="w-full max-w-7xl mx-auto px-6 sm:px-12 py-12">
                <div className="bg-slate-950 text-white rounded-3xl overflow-hidden shadow-2xl border border-slate-800">
                  <div className="bg-slate-900 px-6 py-3 border-b border-slate-800 flex items-center justify-between text-xs font-mono font-bold text-slate-400">
                    <span className="flex items-center gap-1.5"><Code className="w-4 h-4 text-indigo-400" /> Shopify Custom HTML/CSS Injector</span>
                    <span className="bg-slate-850 px-2 py-0.5 rounded text-[10px] text-indigo-400">LIQUID INTERFACES</span>
                  </div>
                  
                  {pageConfig.customCode ? (
                    <div className="w-full bg-slate-900/40 p-1">
                      <iframe
                        srcDoc={`
                          <!DOCTYPE html>
                          <html>
                            <head>
                              <meta charset="utf-8">
                              <style>
                                body { 
                                  margin: 0; 
                                  padding: 16px; 
                                  font-family: system-ui, -apple-system, sans-serif;
                                  background: transparent;
                                  color: ${pageConfig.themeTextColor || "#0f172a"};
                                }
                                iframe {
                                  max-width: 100%;
                                  border-radius: 12px;
                                }
                              </style>
                            </head>
                            <body>
                              ${pageConfig.customCode}
                            </body>
                          </html>
                        `}
                        className="w-full min-h-[160px] bg-transparent block"
                        title="Shopify Custom Liquid Content"
                        style={{ border: "0" }}
                      />
                    </div>
                  ) : (
                    <div className="p-8 text-center text-xs text-slate-500 font-mono">
                      &lt;-- কোনো কাস্টম লিকুইড কোড দেওয়া নেই, অ্যাডমিন ড্যাশবোর্ড থেকে ইনজেক্ট করুন --&gt;
                    </div>
                  )}
                </div>
              </section>
            );

          // --- CONTACT FORM ---
          case "contact":
            return (
              <section key={sectionId} id="contact-section" className="py-16 px-6 sm:px-12 max-w-4xl mx-auto w-full">
                <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-10 shadow-lg grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
                  
                  {/* Left Column texts */}
                  <div className="md:col-span-5 space-y-4">
                    <div className="w-12 h-12 rounded-2xl bg-indigo-50 flex items-center justify-center" style={{ color: pageConfig.themeColor }}>
                      <Phone className="w-6 h-6" />
                    </div>
                    
                    {renderEditableWrapper("contactTitle", (
                      <h3 className="text-xl sm:text-2xl font-black text-slate-900 leading-snug">
                        {pageConfig.contactTitle}
                      </h3>
                    ), "block")}

                    {renderEditableWrapper("contactDesc", (
                      <p className="text-xs text-slate-500 leading-relaxed">
                        {pageConfig.contactDesc}
                      </p>
                    ), "block")}

                    <div className="pt-2 text-xs space-y-2">
                      <p className="text-slate-600 font-bold flex items-center gap-2">
                        <CheckCircle className="w-4 h-4 text-emerald-500 shrink-0" /> ওয়ান-টু-ওয়ান ক্লিনিক্যাল সেশন
                      </p>
                      <p className="text-slate-600 font-bold flex items-center gap-2">
                        <CheckCircle className="w-4 h-4 text-emerald-500 shrink-0" /> অভিজ্ঞ সার্টিফাইড বিশেষজ্ঞ
                      </p>
                    </div>
                  </div>

                  {/* Right Column form */}
                  <div className="md:col-span-7 bg-slate-50 p-6 rounded-2xl border border-slate-150">
                    {contactSuccess ? (
                      <div className="text-center py-8 space-y-3">
                        <div className="w-14 h-14 bg-emerald-50 text-emerald-500 rounded-full flex items-center justify-center mx-auto border-2 border-emerald-100">
                          <CheckCircle className="w-8 h-8" />
                        </div>
                        <h4 className="text-sm font-black text-slate-800">পরামর্শের অনুরোধ সফল হয়েছে!</h4>
                        <p className="text-[11px] text-slate-500 leading-relaxed">আমাদের স্পিচ ল্যাব থেকে একজন কাস্টমার রিলেশন প্রতিনিধি ২৪ ঘণ্টার মধ্যে আপনার প্রদত্ত নম্বরে যোগাযোগ করবেন। ধন্যবাদ!</p>
                      </div>
                    ) : (
                      <form onSubmit={handleContactSubmit} className="space-y-4">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          <div className="space-y-1">
                            <label className="text-[10px] font-black text-slate-500 uppercase tracking-wider block">অভিভাবকের নাম</label>
                            <input 
                              type="text" 
                              required
                              placeholder="মোঃ আরিফুর রহমান"
                              value={contactForm.parentName}
                              onChange={(e) => setContactForm({ ...contactForm, parentName: e.target.value })}
                              className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs font-bold text-slate-800 focus:outline-none focus:border-indigo-500"
                            />
                          </div>
                          <div className="space-y-1">
                            <label className="text-[10px] font-black text-slate-500 uppercase tracking-wider block">শিশুর বয়স (বছর)</label>
                            <input 
                              type="number" 
                              required
                              placeholder="৫"
                              value={contactForm.childAge}
                              onChange={(e) => setContactForm({ ...contactForm, childAge: e.target.value })}
                              className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs font-bold text-slate-800 focus:outline-none"
                            />
                          </div>
                        </div>

                        <div className="space-y-1">
                          <label className="text-[10px] font-black text-slate-500 uppercase tracking-wider block">মোবাইল নম্বর</label>
                          <input 
                            type="tel" 
                            required
                            placeholder="০১৭xxxxxxxx"
                            value={contactForm.phone}
                            onChange={(e) => setContactForm({ ...contactForm, phone: e.target.value })}
                            className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2.5 text-xs font-bold text-slate-800 focus:outline-none"
                          />
                        </div>

                        <div className="space-y-1">
                          <label className="text-[10px] font-black text-slate-500 uppercase tracking-wider block">থেরাপির ধরন</label>
                          <select 
                            value={contactForm.therapyType}
                            onChange={(e) => setContactForm({ ...contactForm, therapyType: e.target.value })}
                            className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs font-bold text-slate-850"
                          >
                            <option value="speech">🗣️ স্পিচ অ্যান্ড ল্যাঙ্গুয়েজ থেরাপি</option>
                            <option value="occupational">🧘 অকুপেশনাল ও সেন্সরি থেরাপি</option>
                            <option value="behavioral">🧠 বিহেভিওরাল (ABA) থেরাপি</option>
                          </select>
                        </div>

                        <div className="space-y-1">
                          <label className="text-[10px] font-black text-slate-500 uppercase tracking-wider block">শিশুর সমস্যা ও আপনার জিজ্ঞাসা</label>
                          <textarea 
                            rows={2}
                            placeholder="শিশুর কথা বলতে সমস্যা হচ্ছে এবং শব্দ উচ্চারণ অস্পষ্ট..."
                            value={contactForm.message}
                            onChange={(e) => setContactForm({ ...contactForm, message: e.target.value })}
                            className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs font-medium text-slate-700 focus:outline-none"
                          />
                        </div>

                        <button 
                          type="submit" 
                          className="w-full text-white font-extrabold text-xs sm:text-sm py-3 rounded-xl flex items-center justify-center gap-1.5 cursor-pointer shadow-sm theme-primary-bg"
                          style={{ backgroundColor: pageConfig.themeColor }}
                        >
                          <Send className="w-4 h-4 text-emerald-300" />
                          <span>অনুরোধ সাবমিট করুন</span>
                        </button>
                      </form>
                    )}
                  </div>
                </div>
              </section>
            );

          // --- DYNAMIC FOOTER ---
          case "footer":
            return (
              <footer key={sectionId} className="bg-slate-950 text-slate-400 py-12 px-6 sm:px-12 border-t border-slate-900 text-center w-full mt-auto">
                <div className="max-w-5xl mx-auto space-y-4">
                  <p className="text-xs">© ২০২৬ {pageConfig.logoText || "DocTime Speech Therapy Lab"}. সর্বস্বত্ব সংরক্ষিত।</p>
                  <p className="text-[10px] text-slate-600">Row-Level Security (RLS) কমপ্লায়েন্ট ডাটাবেজ সুরক্ষায় আমাদের প্রতিটি রোগীর তথ্য এনক্রিপ্ট করে সংরক্ষণ করা হয়ে থাকে।</p>
                </div>
              </footer>
            );

          default:
            return null;
        }
      })
    )}

    </div>
  );
}

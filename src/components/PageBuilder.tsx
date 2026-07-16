import React, { useState, useEffect, useRef, useMemo } from "react";
import {
  Sparkles,
  Wand2,
  Plus,
  Trash2,
  GripVertical,
  Eye,
  EyeOff,
  Type as TypeIcon,
  Layout,
  Layers,
  Undo2,
  Redo2,
  Save,
  X,
  Copy,
  ArrowUp,
  ArrowDown,
  MousePointerClick,
  Link2,
  Palette,
  Square,
  ListChecks,
  Star,
  Grid3x3,
  Video as VideoIcon,
  Users as UsersIcon,
  Mail,
  Zap,
  Loader2,
  Monitor,
  Tablet,
  Smartphone,
  ChevronDown,
  ChevronRight,
  HelpCircle,
  Image as ImageIcon,
  AlignLeft,
  AlignCenter,
  AlignRight,
  AlignJustify,
  Sliders,
  Maximize2,
  Settings,
  Tv,
  FileText,
  MousePointer,
  RotateCcw,
  Check,
  ArrowRight,
  Phone,
  MapPin,
  Calendar,
  Award,
  Activity,
  Heart,
  ExternalLink,
  Lock,
  Unlock,
  Search,
  Grid,
  PlusCircle,
  Folder,
  FolderPlus,
  SlidersHorizontal,
  RefreshCw,
  Database,
  UploadCloud
} from "lucide-react";

import { AnimatedWrapper, VideoBackground, AnimationConfig, HoverEffectConfig, ScrollEffectConfig, VideoBgConfig, InteractionPresetKind } from "./AnimatedWrapper";
import { LottiePlayer, LottieConfig } from "./LottiePlayer";

/* ============================================================================
   TYPES & INTERFACES
   ============================================================================ */

export type ElementKind =
  | "heading"
  | "eyebrow"
  | "paragraph"
  | "button"
  | "image"
  | "video"
  | "stat"
  | "icon-text"
  | "form"
  // Layout engine
  | "container"
  | "grid"
  | "flex"
  | "card"
  // Widgets
  | "input"
  | "checkbox"
  | "radio"
  | "select"
  | "textarea"
  | "calendar"
  | "avatar"
  | "badge"
  | "tabs"
  | "accordion"
  | "carousel"
  | "chart"
  | "map"
  | "progress"
  | "breadcrumb"
  | "modal"
  | "drawer"
  | "toast"
  | "navbar"
  | "mega-menu"
  | "lottie";

export interface BuilderElement {
  id: string;
  kind: ElementKind;
  text: string;
  placeholder?: string;
  href?: string;
  target?: "_self" | "_blank";
  icon?: string;
  iconPosition?: "left" | "right";
  imageUrl?: string;
  videoUrl?: string;
  videoConfig?: {
    autoplay?: boolean;
    muted?: boolean;
    loop?: boolean;
    controls?: boolean;
  };
  formConfig?: {
    action?: string;
    submitText?: string;
    successMessage?: string;
    placeholder?: string;
    label?: string;
  };
  tabsConfig?: string[];
  selectOptions?: string[];
  breadcrumbItems?: string[];
  progressValue?: number;
  accordionContent?: string;
  style: Record<string, any>; // contains default / desktop styles and .responsive nested map
  children?: BuilderElement[]; // Supporting recursive nesting
  locked?: boolean;
  animation?: AnimationConfig;
  hoverEffect?: HoverEffectConfig;
  scrollEffect?: ScrollEffectConfig;
  videoBg?: VideoBgConfig;
  lottie?: LottieConfig;
  interactionPreset?: InteractionPresetKind;
  cmsBinding?: {
    collectionId: string;
    fieldName: string;
    index?: number;
  };
  cmsLoopCollectionId?: string;
}

export interface BuilderSection {
  instanceId: string;
  templateId: string;
  name: string;
  icon: string;
  visible: boolean;
  style: Record<string, any>;
  elements: BuilderElement[];
  animation?: AnimationConfig;
  scrollEffect?: ScrollEffectConfig;
  videoBg?: VideoBgConfig;
}

export interface SectionTemplate {
  id: string;
  name: string;
  icon: string;
  description: string;
  keywords: string[];
  build: () => Omit<BuilderSection, "instanceId">;
}

export interface GlobalTheme {
  colors: {
    primary: string;
    secondary: string;
    accent: string;
    success: string;
    warning: string;
    danger: string;
    info: string;
    neutral: string;
    dark: string;
    light: string;
  };
  typography: {
    heading: { fontFamily: string; fontSize: string; fontWeight: string; lineHeight: string };
    paragraph: { fontFamily: string; fontSize: string; fontWeight: string; lineHeight: string };
    caption: { fontFamily: string; fontSize: string; fontWeight: string; lineHeight: string };
    button: { fontFamily: string; fontSize: string; fontWeight: string; lineHeight: string };
  };
  radius: {
    none: string;
    sm: string;
    md: string;
    lg: string;
    full: string;
  };
  shadow: {
    none: string;
    sm: string;
    md: string;
    lg: string;
    xl: string;
  };
  border: {
    none: string;
    thin: string;
    medium: string;
    thick: string;
  };
  spacing: Record<string, string>;
}

export type Breakpoint = "desktop" | "laptop" | "tablet" | "mobileLandscape" | "mobilePortrait";

/* ============================================================================
   UTILITY FUNCTIONS FOR STYLING
   ============================================================================ */

const uid = (prefix: string) => `${prefix}-${Math.random().toString(36).substring(2, 9)}`;

export function getStylesFromConfig(styleConfig: any): React.CSSProperties {
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
  if (styleConfig.gridColumn) s.gridColumn = styleConfig.gridColumn;
  if (styleConfig.gridRow) s.gridRow = styleConfig.gridRow;
  if (styleConfig.alignSelf) s.alignSelf = styleConfig.alignSelf;

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

export function mapStylesToCssString(styleConfig: any): string {
  if (!styleConfig) return "";
  return Object.entries(getStylesFromConfig(styleConfig))
    .map(([k, v]) => `${k.replace(/[A-Z]/g, (match) => `-${match.toLowerCase()}`)}: ${v};`)
    .join(" ");
}

const defaultTextStyle = (overrides: Record<string, any> = {}): Record<string, any> => ({
  fontFamily: "Inter",
  fontSize: "14px",
  fontWeight: "400",
  color: "#0f172a",
  align: "left",
  responsive: {
    laptop: {},
    tablet: {},
    mobileLandscape: {},
    mobilePortrait: {},
  },
  ...overrides,
});

/* ============================================================================
   DYNAMIC ICONS COMPONENT
   ============================================================================ */

const DYNAMIC_ICONS: Record<string, React.ComponentType<{ className?: string }>> = {
  ArrowRight,
  Play: VideoIcon,
  Check,
  Zap,
  Users: UsersIcon,
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

function RenderIcon({ name, className }: { name: string; className?: string }) {
  const Comp = DYNAMIC_ICONS[name] || Sparkles;
  return <Comp className={className} />;
}

/* ============================================================================
   SECTION LIBRARY & REUSABLE BLOCKS (RECURSIVE BUILDERS)
   ============================================================================ */

export const SECTION_TEMPLATES: SectionTemplate[] = [
  {
    id: "hero",
    name: "হিরো ব্যানার",
    icon: "Layout",
    description: "পেজের প্রথম এবং আকর্ষণীয় প্রধান ব্যানার — টাইটেল ও সিটিএ বাটন সহ",
    keywords: ["hero", "banner", "intro", "হিরো", "ব্যানার", "পরিচিতি"],
    build: () => ({
      templateId: "hero",
      name: "হিরো ব্যানার",
      icon: "Layout",
      visible: true,
      style: {
        bgType: "gradient",
        bg: "#f8fafc",
        bgGradient: "linear-gradient(135deg, #e0e7ff 0%, #fef2f2 100%)",
        textColor: "#0f172a",
        paddingY: "80px",
      },
      elements: [
        {
          id: uid("el"),
          kind: "container",
          text: "হিরো কন্টেইনার",
          style: defaultTextStyle({ paddingX: "24px", align: "center" }),
          children: [
            {
              id: uid("el"),
              kind: "eyebrow",
              text: "স্বাগতম আমাদের ক্লিনিকে",
              style: defaultTextStyle({ fontSize: "12px", fontWeight: "700", color: "#4f46e5", align: "center", bg: "#e0e7ff", radius: "999px", paddingX: "12px", paddingY: "4px", display: "inline-block" }),
            },
            {
              id: uid("el"),
              kind: "heading",
              text: "বাচ্চাদের কথা বলার সমস্যা ও সঠিক সমাধান",
              style: defaultTextStyle({ fontSize: "42px", fontWeight: "900", align: "center" }),
            },
            {
              id: uid("el"),
              kind: "paragraph",
              text: "আমাদের অভিজ্ঞ থেরাপিস্টদের সাহায্যে অত্যন্ত আধুনিক ও আনন্দময় পরিবেশে আপনার সন্তানের ভাষা ও কথা বলার জড়তা দূর করুন। আজই একটি সেশন বুক করুন।",
              style: defaultTextStyle({ fontSize: "16px", color: "#475569", align: "center" }),
            },
            {
              id: uid("el"),
              kind: "button",
              text: "অ্যাপয়েন্টমেন্ট বুক করুন",
              href: "#contact",
              target: "_self",
              icon: "ArrowRight",
              iconPosition: "right",
              style: defaultTextStyle({
                color: "#ffffff",
                fontSize: "15px",
                fontWeight: "700",
                bg: "#4f46e5",
                radius: "12px",
                paddingX: "28px",
                paddingY: "14px",
                align: "center",
                shadow: "0 10px 15px -3px rgba(79, 70, 229, 0.3)",
              }),
            },
          ]
        },
      ],
    }),
  },
  {
    id: "features",
    name: "ফিচার গ্রিড",
    icon: "Grid3x3",
    description: "৩–৪ কলামে সেবা বা ফিচার কার্ড দেখানোর গ্রিড",
    keywords: ["feature", "service", "সেবা", "ফিচার", "কার্ড"],
    build: () => ({
      templateId: "features",
      name: "ফিচার গ্রিড",
      icon: "Grid3x3",
      visible: true,
      style: { bgType: "solid", bg: "#ffffff", textColor: "#0f172a", paddingY: "64px" },
      elements: [
        {
          id: uid("el"),
          kind: "heading",
          text: "আমাদের সেবাসমূহ",
          style: defaultTextStyle({ fontSize: "30px", fontWeight: "800", align: "center" }),
        },
        {
          id: uid("el"),
          kind: "grid",
          text: "ফিচার গ্রিড বক্স",
          style: defaultTextStyle({ gridTemplateColumns: "repeat(3, minmax(0, 1fr))", gap: "24px", marginTop: "32px" }),
          children: [1, 2, 3].map((n) => ({
            id: uid("el"),
            kind: "card",
            text: `কার্ড ${n}`,
            style: defaultTextStyle({ bg: "#f8fafc", radius: "16px", paddingX: "20px", paddingY: "20px", borderWidth: "1px", borderColor: "#e2e8f0" }),
            children: [
              {
                id: uid("el"),
                kind: "heading",
                text: `বিশেষজ্ঞ থেরাপি সেবা ${n}`,
                style: defaultTextStyle({ fontSize: "18px", fontWeight: "700" }),
              },
              {
                id: uid("el"),
                kind: "paragraph",
                text: "আপনার শিশুর জন্য আধুনিক থেরাপি ও নিবিড় পর্যবেক্ষণ নিশ্চিত করি। অত্যন্ত যত্ন সহকারে গাইড করা হয়।",
                style: defaultTextStyle({ fontSize: "13px", color: "#64748b" }),
              }
            ]
          }))
        }
      ],
    }),
  },
  {
    id: "team",
    name: "টিম / বিশেষজ্ঞ প্যানেল",
    icon: "UsersIcon",
    description: "ডাক্তার, থেরাপিস্ট বা টিম মেম্বারদের প্রোফাইল কার্ড গ্রিড",
    keywords: ["team", "doctor", "therapist", "staff", "টিম", "ডাক্তার", "থেরাপিস্ট", "বিশেষজ্ঞ"],
    build: () => ({
      templateId: "team",
      name: "টিম / বিশেষজ্ঞ প্যানেল",
      icon: "UsersIcon",
      visible: true,
      style: { bgType: "solid", bg: "#f8fafc", textColor: "#0f172a", paddingY: "64px" },
      elements: [
        {
          id: uid("el"),
          kind: "heading",
          text: "আমাদের বিশেষজ্ঞ প্যানেল",
          style: defaultTextStyle({ fontSize: "30px", fontWeight: "800", align: "center" }),
        },
        {
          id: uid("el"),
          kind: "grid",
          text: "টিম গ্রিড",
          style: defaultTextStyle({ gridTemplateColumns: "repeat(2, minmax(0, 1fr))", gap: "24px", marginTop: "32px" }),
          children: [1, 2].map((n) => ({
            id: uid("el"),
            kind: "card",
            text: `বিশেষজ্ঞ ${n}`,
            style: defaultTextStyle({ bg: "#ffffff", radius: "20px", paddingX: "24px", paddingY: "24px", borderWidth: "1px", borderColor: "#f1f5f9" }),
            children: [
              {
                id: uid("el"),
                kind: "avatar",
                text: n === 1 ? "সুস্মিতা সেন" : "আরিফ রহমান",
                style: defaultTextStyle({ align: "center" }),
              },
              {
                id: uid("el"),
                kind: "heading",
                text: n === 1 ? "ডা. সুস্মিতা সেন" : "ডা. আরিফ রহমান",
                style: defaultTextStyle({ fontSize: "18px", fontWeight: "750", align: "center", marginTop: "12px" }),
              },
              {
                id: uid("el"),
                kind: "paragraph",
                text: "সিনিয়র স্পিচ ও ল্যাঙ্গুয়েজ থেরাপিস্ট, ১০+ বছরের সফল অভিজ্ঞতা সম্পন্ন।",
                style: defaultTextStyle({ fontSize: "13px", color: "#64748b", align: "center" }),
              }
            ]
          }))
        }
      ],
    }),
  },
  {
    id: "stats",
    name: "স্ট্যাটস বার",
    icon: "Zap",
    description: "অর্জন বা বিশ্বাসযোগ্যতা দেখানোর হালকা বার",
    keywords: ["stat", "number", "achievement", "সংখ্যা", "অর্জন"],
    build: () => ({
      templateId: "stats",
      name: "স্ট্যাটস বার",
      icon: "Zap",
      visible: true,
      style: { bgType: "solid", bg: "#0f172a", textColor: "#ffffff", paddingY: "40px" },
      elements: [
        {
          id: uid("el"),
          kind: "grid",
          text: "স্ট্যাটস গ্রিড",
          style: defaultTextStyle({ gridTemplateColumns: "repeat(4, minmax(0, 1fr))", gap: "16px" }),
          children: [1, 2, 3, 4].map((n) => ({
            id: uid("el"),
            kind: "stat",
            text: `${n * 100}+\nলেবেল ${n}`,
            style: defaultTextStyle({ fontSize: "32px", fontWeight: "900", color: "#6366f1", align: "center" }),
          }))
        }
      ],
    }),
  },
  {
    id: "testimonial",
    name: "রিভিউ / টেস্টিমোনিয়াল",
    icon: "Star",
    description: "অভিভাবকের মতামত ও রেটিং দেখানোর কোট-স্টাইল সেকশন",
    keywords: ["review", "testimonial", "feedback", "রিভিউ", "মতামত", "প্রশংসা"],
    build: () => ({
      templateId: "testimonial",
      name: "রিভিউ / টেস্টিমোনিয়াল",
      icon: "Star",
      visible: true,
      style: { bgType: "solid", bg: "#ffffff", textColor: "#0f172a", paddingY: "56px" },
      elements: [
        {
          id: uid("el"),
          kind: "container",
          text: "রিভিউ বক্স",
          style: defaultTextStyle({ paddingX: "24px", align: "center" }),
          children: [
            {
              id: uid("el"),
              kind: "paragraph",
              text: "“আমাদের বাচ্চার কথা বলার চমৎকার ডেভেলপমেন্ট লক্ষ্য করেছি। উনাদের থেরাপিস্টরা অত্যন্ত আন্তরিক ও দক্ষ। আমরা শতভাগ সন্তুষ্ট।”",
              style: defaultTextStyle({ fontSize: "20px", fontWeight: "600", align: "center", fontFamily: "Playfair Display" }),
            },
            {
              id: uid("el"),
              kind: "eyebrow",
              text: "— তাসনিম আফরোজ, অভিভাবক",
              style: defaultTextStyle({ fontSize: "13px", color: "#64748b", align: "center" }),
            },
          ]
        }
      ],
    }),
  },
];

/* ============================================================================
   WIDGETS / COMPONENT LIBRARY DEFINITION
   ============================================================================ */

const COMPONENT_LIBRARY = [
  { kind: "heading", name: "শিরোনাম (Heading)", icon: TypeIcon, defaultText: "নতুন আকর্ষণীয় শিরোনাম" },
  { kind: "eyebrow", name: "আইব্রো ট্যাগ (Eyebrow)", icon: SlidersHorizontal, defaultText: "ক্যাটাগরি ট্যাগ" },
  { kind: "paragraph", name: "প্যারাগ্রাফ (Paragraph)", icon: FileText, defaultText: "এখানে আপনার প্যারাগ্রাফের টেক্সট লিখুন।" },
  { kind: "button", name: "বাটন (Button)", icon: MousePointerClick, defaultText: "বাটন টেক্সট" },
  { kind: "image", name: "ছবি (Image)", icon: ImageIcon, defaultText: "ইমেজ প্লেসহোল্ডার" },
  { kind: "video", name: "ভিডিও (Video)", icon: VideoIcon, defaultText: "ভিডিও প্লেয়ার" },
  { kind: "stat", name: "সংখ্যা (Stat)", icon: Zap, defaultText: "১০০+\nসফল ইউজার" },
  { kind: "icon-text", name: "আইকন-টেক্সট কার্ড", icon: Award, defaultText: "ফিচার শিরোনাম\nফিচার বিস্তারিত ডেসক্রিপশন লিখুন।" },
  { kind: "form", name: "যোগাযোগ ফর্ম (Contact Form)", icon: Mail, defaultText: "যোগাযোগ ফর্ম" },
  // Layout Widgets
  { kind: "container", name: "কন্টেইনার (Container)", icon: Layout, defaultText: "কন্টেইনার বক্স" },
  { kind: "grid", name: "গ্রিড (Grid Grid)", icon: Grid3x3, defaultText: "সিএসএস গ্রিড" },
  { kind: "flex", name: "ফ্লেক্স কন্টেইনার (Flexbox)", icon: Sliders, defaultText: "ফ্লেক্স বক্স" },
  { kind: "card", name: "কার্ড ডিজাইন (Card)", icon: Square, defaultText: "কাস্টম কার্ড" },
  // Advanced Components
  { kind: "tabs", name: "ট্যাব ভিউ (Tabs)", icon: Layers, defaultText: "ট্যাবস ভিউ" },
  { kind: "accordion", name: "অ্যাকর্ডিয়ান (Accordion)", icon: ChevronDown, defaultText: "প্রশ্ন উত্তর অ্যাকর্ডিয়ান" },
  { kind: "carousel", name: "স্লাইডার (Carousel)", icon: PlayIcon, defaultText: "ক্যারোসেল স্লাইডার" },
  { kind: "progress", name: "অগ্রগতি বার (Progress)", icon: Activity, defaultText: "ডেভেলপমেন্ট অগ্রগতি" },
  { kind: "avatar", name: "প্রোফাইল ছবি (Avatar)", icon: UsersIcon, defaultText: "ইউজার প্রোফাইল" },
  { kind: "badge", name: "ব্যাজ ট্যাগ (Badge)", icon: Star, defaultText: "নতুন" },
  { kind: "chart", name: "ডেভেলপমেন্ট চার্ট (Chart)", icon: Grid3x3, defaultText: "উন্নতি চার্ট" },
  { kind: "toast", name: "টোস্ট নোটিফিকেশন", icon: Heart, defaultText: "সফল বার্তা" },
  { kind: "map", name: "ম্যাপ লোকেশন (Map)", icon: MapPin, defaultText: "হেড অফিস ম্যাপ" },
  { kind: "input", name: "ইনপুট ফিল্ড (Input Field)", icon: Mail, defaultText: "নাম ইনপুট" },
  { kind: "textarea", name: "টেক্সট এরিয়া (Textarea)", icon: FileText, defaultText: "বিস্তারিত বার্তা" },
  { kind: "select", name: "অপশন সিলেক্টর (Select)", icon: ChevronRight, defaultText: "নির্বাচন করুন" },
  { kind: "checkbox", name: "চেকবক্স (Checkbox)", icon: ListChecks, defaultText: "শর্তাবলীতে রাজি" },
  { kind: "radio", name: "রেডিও বাটন (Radio)", icon: MousePointer, defaultText: "সকাল (১০টা - ১২টা)" },
  { kind: "calendar", name: "অ্যাপয়েন্টমেন্ট ক্যালেন্ডার", icon: Calendar, defaultText: "তারিখ নির্বাচন ক্যালেন্ডার" },
  { kind: "modal", name: "পপআপ মডেল (Modal Popup)", icon: Maximize2, defaultText: "ক্লিক করে মডেল দেখুন" },
  { kind: "drawer", name: "সাইড ড্রয়ার (Drawer)", icon: Tv, defaultText: "সাইড ড্রয়ার ইনফো" },
  { kind: "lottie", name: "লোটি অ্যানিমেশন (Lottie)", icon: Sparkles, defaultText: "লোটি অ্যানিমেশন প্লেয়ার" },
];

function PlayIcon({ className }: { className?: string }) {
  return <span className={className}>⏸</span>;
}

/* ============================================================================
   MAIN PAGE BUILDER COMPONENT
   ============================================================================ */

export interface PageBuilderProps {
  initialSections?: BuilderSection[];
  onSave?: (sections: BuilderSection[]) => Promise<void> | void;
  onPublish?: (sections: BuilderSection[]) => Promise<void> | void;
  triggerToast?: (msg: string) => void;
}

export interface CmsField {
  name: string;
  type: "text" | "richtext" | "image" | "number" | "boolean";
  label: string;
}

export interface CmsCollection {
  id: string;
  name: string;
  fields: CmsField[];
  items: Record<string, any>[];
}

export interface PageVersion {
  id: string;
  timestamp: string;
  description: string;
  sections: BuilderSection[];
}

export interface PageItem {
  id: string;
  title: string;
  slug: string;
  status: "draft" | "published" | "archived";
  sections: BuilderSection[];
  versions: PageVersion[];
}

export interface MediaAsset {
  id: string;
  name: string;
  url: string;
  folder: string;
  type: "image" | "video";
}

export default function PageBuilder({
  initialSections = [],
  onSave,
  onPublish,
  triggerToast,
}: PageBuilderProps) {
  // 1. Core State
  const [sections, setSections] = useState<BuilderSection[]>([]);
  const [activeBreakpoint, setActiveBreakpoint] = useState<Breakpoint>("desktop");
  const [selectedSectionId, setSelectedSectionId] = useState<string | null>(null);
  const [selectedElementId, setSelectedElementId] = useState<string | null>(null);

  // Undo/Redo queues (deep-cloned snapshots)
  const pastRef = useRef<BuilderSection[][]>([]);
  const futureRef = useRef<BuilderSection[][]>([]);

  // 2. Multi-Page System State
  const [pages, setPages] = useState<PageItem[]>([
    {
      id: "home",
      title: "হোম পেজ (Home)",
      slug: "home",
      status: "published",
      sections: initialSections && initialSections.length > 0 ? initialSections : [],
      versions: [
        { id: "v-initial", timestamp: new Date().toLocaleString(), description: "ইনস্টিলেশন ইনিশিয়াল লেআউট", sections: initialSections }
      ]
    },
    {
      id: "about",
      title: "আমাদের সম্পর্কে (About Us)",
      slug: "about-us",
      status: "draft",
      sections: [],
      versions: []
    },
    {
      id: "services",
      title: "সেবাসমূহ (Our Services)",
      slug: "services",
      status: "draft",
      sections: [],
      versions: []
    }
  ]);
  const [activePageId, setActivePageId] = useState<string>("home");

  // 3. CMS State
  const [cmsCollections, setCmsCollections] = useState<CmsCollection[]>([
    {
      id: "doctors",
      name: "Doctors (চিকিৎসক তালিকা)",
      fields: [
        { name: "name", type: "text", label: "ডক্টরের নাম" },
        { name: "specialty", type: "text", label: "বিশেষজ্ঞতা (Specialty)" },
        { name: "designation", type: "text", label: "পদবী (Designation)" },
        { name: "fees", type: "number", label: "ভিজিট ফি" },
        { name: "avatar", type: "image", label: "প্রোফাইল ছবি" },
        { name: "bio", type: "text", label: "সংক্ষিপ্ত পরিচিতি (Bio)" }
      ],
      items: [
        { id: "doc-1", name: "ডা. আরিয়ান রহমান", specialty: "স্পিচ থেরাপিস্ট", designation: "সিনিয়র ক্লিনিক্যাল প্যাথলজিস্ট", fees: 1200, avatar: "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&q=80&w=200", bio: "১০ বছরের অধিক অভিজ্ঞতা সম্পন্ন শিশু ও বয়স্কদের স্পিচ থেরাপি বিশেষজ্ঞ।" },
        { id: "doc-2", name: "ডা. ফাতেমা আখতার", specialty: "কগনিটিভ স্পেশালিস্ট", designation: "কনসালটেন্ট নিউরোলজিস্ট", fees: 1500, avatar: "https://images.unsplash.com/photo-1594824813573-246434de83fb?auto=format&fit=crop&q=80&w=200", bio: "অটিজম এবং বাচ্চাদের কগনিটিভ ডেভেলপমেন্ট নিয়ে গবেষণারত।" }
      ]
    },
    {
      id: "blogs",
      name: "Blogs (ব্লগ পোস্ট সমূহ)",
      fields: [
        { name: "title", type: "text", label: "ব্লগ টাইটেল" },
        { name: "author", type: "text", label: "লেখক" },
        { name: "image", type: "image", label: "ফিচারড ইমেজ" },
        { name: "excerpt", type: "text", label: "সংক্ষিপ্ত বর্ণনা" },
        { name: "date", type: "text", label: "তারিখ" }
      ],
      items: [
        { id: "blog-1", title: "শিশুদের দেরিতে কথা বলার কারণ ও সমাধান", author: "ডা. আরিয়ান রহমান", image: "https://images.unsplash.com/photo-1502082553048-f009c37129b9?auto=format&fit=crop&q=80&w=600", excerpt: "শিশুরা স্বাভাবিকভাবে কখন কথা বলা শুরু করে এবং দেরিতে কথা বললে অভিভাবকের করণীয় কী?", date: "১৬ জুলাই, ২০২৬" },
        { id: "blog-2", title: "স্পিচ থেরাপির মাধ্যমে অটিস্টিক শিশুর বিকাশ", author: "ডা. ফাতেমা আখতার", image: "https://images.unsplash.com/photo-1516627145497-ae6968895b74?auto=format&fit=crop&q=80&w=600", excerpt: "অটিস্টিক শিশুদের যোগাযোগ দক্ষতা বাড়াতে স্পিচ ও ল্যাঙ্গুয়েজ থেরাপির ভূমিকা অপরিসীম।", date: "১০ জুলাই, ২০২৬" }
      ]
    },
    {
      id: "services_list",
      name: "Services (সার্ভিসেস)",
      fields: [
        { name: "title", type: "text", label: "সার্ভিস টাইটেল" },
        { name: "desc", type: "text", label: "বিস্তারিত বিবরণ" },
        { name: "price", type: "number", label: "সার্ভিস ফি" },
        { name: "icon", type: "text", label: "আইকন নাম" }
      ],
      items: [
        { id: "ser-1", title: "ক্লিনিক্যাল স্পিচ থেরাপি", desc: "শিশুদের স্পষ্ট যোগাযোগের দক্ষতা অর্জনে ওয়ান-টু-ওয়ান ইন্টারেক্টিভ আধুনিক থেরাপি সেশন।", price: 1000, icon: "Activity" },
        { id: "ser-2", title: "আর্ট অ্যান্ড প্লে থেরাপী", desc: "মনোযোগ বৃদ্ধি ও মানসিক প্রশান্তি বাড়াতে চমৎকার আনন্দময় থেরাপিউটিক গেমস প্লে-ক্লাস।", price: 800, icon: "Heart" }
      ]
    }
  ]);
  const [selectedCollectionId, setSelectedCollectionId] = useState<string>("doctors");
  const [isCmsRecordModalOpen, setIsCmsRecordModalOpen] = useState(false);
  const [cmsActiveRecord, setCmsActiveRecord] = useState<Record<string, any> | null>(null);

  // 4. Media Library State
  const [mediaAssets, setMediaAssets] = useState<MediaAsset[]>([
    { id: "m-1", name: "Therapy Lab Child", url: "https://images.unsplash.com/photo-1516627145497-ae6968895b74?auto=format&fit=crop&q=80&w=600", folder: "Therapy", type: "image" },
    { id: "m-2", name: "Professional Female Therapist", url: "https://images.unsplash.com/photo-1594824813573-246434de83fb?auto=format&fit=crop&q=80&w=300", folder: "Avatars", type: "image" },
    { id: "m-3", name: "Senior Speech Pathologist", url: "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&q=80&w=300", folder: "Avatars", type: "image" },
    { id: "m-4", name: "Creative Art Workspace", url: "https://images.unsplash.com/photo-1513364776144-60967b0f800f?auto=format&fit=crop&q=80&w=600", folder: "Banners", type: "image" },
    { id: "m-5", name: "Sensory Play Area", url: "https://images.unsplash.com/photo-1502082553048-f009c37129b9?auto=format&fit=crop&q=80&w=600", folder: "Therapy", type: "image" },
    { id: "m-6", name: "Happy Children", url: "https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?auto=format&fit=crop&q=80&w=600", folder: "Banners", type: "image" }
  ]);
  const [selectedMediaFolder, setSelectedMediaFolder] = useState<string>("All");
  const [isMediaLibraryOpen, setIsMediaLibraryOpen] = useState(false);
  const [onMediaSelectCallback, setOnMediaSelectCallback] = useState<((url: string) => void) | null>(null);

  // Interactive Helper states for Left Sidebar Tabs (Pages, CMS, Media)
  const [isCreatingPage, setIsCreatingPage] = useState(false);
  const [newPageTitle, setNewPageTitle] = useState("");
  const [newPageSlug, setNewPageSlug] = useState("");
  const [newPageStatus, setNewPageStatus] = useState<"draft" | "published" | "archived">("draft");

  const [isCreatingCollection, setIsCreatingCollection] = useState(false);
  const [newColId, setNewColId] = useState("");
  const [newColName, setNewColName] = useState("");
  const [mediaSearchTerm, setMediaSearchTerm] = useState("");
  const [mediaUploadingProgress, setMediaUploadingProgress] = useState<number | null>(null);
  const [mediaUploadingName, setMediaUploadingName] = useState("");

  // AI Prompt Co-pilot State
  const [aiPrompt, setAiPrompt] = useState("");
  const [isAiThinking, setIsAiThinking] = useState(false);
  const [aiSuggestions, setAiSuggestions] = useState<SectionTemplate[]>([]);

  // Upgraded AI Co-pilot & Strategic Insights State
  const [aiThinkingSteps, setAiThinkingSteps] = useState<{ step: number; label: string; active: boolean; done: boolean; text?: string }[]>([]);
  const [aiThinkingResult, setAiThinkingResult] = useState<{
    businessType?: string;
    targetAudience?: string;
    toneOfVoice?: string;
    brandStrategy?: string;
    colorsSelectedExplanation?: string;
  } | null>(null);

  const [sectionAiPrompt, setSectionAiPrompt] = useState("");
  const [isEditingSectionWithAi, setIsEditingSectionWithAi] = useState(false);

  const [copilotSuggestions, setCopilotSuggestions] = useState<{ title: string; description: string; patch: Record<string, any> }[]>([]);
  const [isCopilotLoading, setIsCopilotLoading] = useState(false);

  // UI state
  const [sidebarTab, setSidebarTab] = useState<"add" | "navigator" | "theme" | "cms" | "pages" | "media">("add");
  const [rightTab, setRightTab] = useState<"style" | "ai" | "library">("style");
  const [previewMode, setPreviewMode] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [autosaveStatus, setAutosaveStatus] = useState("সেভ করা আছে");
  const [zoomLevel, setZoomLevel] = useState(100);
  const [activePropAccordion, setActivePropAccordion] = useState<string | null>(null);

  // Global Theme Design System State
  const [globalTheme, setGlobalTheme] = useState<GlobalTheme>({
    colors: {
      primary: "#4f46e5",
      secondary: "#ec4899",
      accent: "#f59e0b",
      success: "#10b981",
      warning: "#f59e0b",
      danger: "#ef4444",
      info: "#3b82f6",
      neutral: "#64748b",
      dark: "#0f172a",
      light: "#f8fafc"
    },
    typography: {
      heading: { fontFamily: "Inter", fontSize: "30px", fontWeight: "800", lineHeight: "1.2" },
      paragraph: { fontFamily: "Inter", fontSize: "14px", fontWeight: "400", lineHeight: "1.6" },
      caption: { fontFamily: "Inter", fontSize: "12px", fontWeight: "400", lineHeight: "1.4" },
      button: { fontFamily: "Inter", fontSize: "14px", fontWeight: "600", lineHeight: "1" }
    },
    radius: {
      none: "0px",
      sm: "4px",
      md: "8px",
      lg: "16px",
      full: "9999px"
    },
    shadow: {
      none: "none",
      sm: "0 1px 2px 0 rgba(0, 0, 0, 0.05)",
      md: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
      lg: "0 10px 15px -3px rgba(0, 0, 0, 0.1)",
      xl: "0 20px 25px -5px rgba(0, 0, 0, 0.1)"
    },
    border: {
      none: "none",
      thin: "1px solid #e2e8f0",
      medium: "2px solid #e2e8f0",
      thick: "4px solid #e2e8f0"
    },
    spacing: {
      xs: "4px",
      sm: "8px",
      md: "16px",
      lg: "24px",
      xl: "32px"
    }
  });

  // Drag state
  const [draggedElementId, setDraggedElementId] = useState<string | null>(null);
  const [draggedSource, setDraggedSource] = useState<{ sectionId?: string; parentId?: string; index?: number } | null>(null);
  const [activeDropTarget, setActiveDropTarget] = useState<{ id: string; position: "inside" | "above" | "below" } | null>(null);

  // 5. Intelligent Draft Recovery and Backup Synchronization
  useEffect(() => {
    // Try to load state backup from local storage
    try {
      const backup = localStorage.getItem("doctime_builder_backup_v2");
      if (backup) {
        const parsed = JSON.parse(backup);
        if (parsed.sections && parsed.sections.length > 0) {
          setSections(parsed.sections);
          setAutosaveStatus("অটোসেভ পুনরুদ্ধার করা হয়েছে");
          triggerToast?.("অপ্রকাশিত খসড়া পুনরুদ্ধার করা হয়েছে (Draft Recovered)!");
          if (parsed.pages) setPages(parsed.pages);
          if (parsed.cmsCollections) setCmsCollections(parsed.cmsCollections);
          if (parsed.globalTheme) setGlobalTheme(parsed.globalTheme);
          return;
        }
      }
    } catch (e) {
      console.warn("Could not load draft backup:", e);
    }

    if (initialSections && initialSections.length > 0) {
      setSections(JSON.parse(JSON.stringify(initialSections)));
    }
  }, [initialSections]);

  // 6. Realtime Intelligent Autosave & Sync Manager
  useEffect(() => {
    if (sections.length === 0) return;
    setAutosaveStatus("Unsaved Changes");

    const timer = setTimeout(async () => {
      setAutosaveStatus("Saving...");
      try {
        // Save to Local Cache for crash recovery
        const snapshot = {
          sections,
          pages,
          cmsCollections,
          globalTheme,
          updated_at: new Date().toISOString()
        };
        localStorage.setItem("doctime_builder_backup_v2", JSON.stringify(snapshot));

        // Call database sync
        if (onSave) {
          await onSave(sections);
        }
        setAutosaveStatus("Saved");
      } catch (err) {
        console.warn("Autosave sync failed:", err);
        setAutosaveStatus("Unsaved Changes (Failed)");
      }
    }, 1500); // 1500ms debounce

    return () => clearTimeout(timer);
  }, [sections, pages, cmsCollections, globalTheme]);

  // 7. Manual Save handler (and Ctrl+S listener)
  const triggerManualSave = async () => {
    setAutosaveStatus("Saving...");
    try {
      const snapshot = {
        sections,
        pages,
        cmsCollections,
        globalTheme,
        updated_at: new Date().toISOString()
      };
      localStorage.setItem("doctime_builder_backup_v2", JSON.stringify(snapshot));

      if (onSave) {
        await onSave(sections);
      }
      setAutosaveStatus("Saved");
      triggerToast?.("ম্যানুয়াল সেভ সম্পূর্ণ হয়েছে! (All changes synced to Cloud)");
    } catch (err) {
      console.error(err);
      setAutosaveStatus("Unsaved Changes (Failed)");
      triggerToast?.("সেভ করার সময় কোনো নেটওয়ার্ক বা কানেকশন ত্রুটি ঘটেছে!");
    }
  };

  const commit = (updater: (prev: BuilderSection[]) => BuilderSection[]) => {
    const next = updater(JSON.parse(JSON.stringify(sections)));
    pastRef.current.push(JSON.parse(JSON.stringify(sections)));
    futureRef.current = [];
    setSections(next);

    // Sync back to current page list sections state
    setPages(prev => prev.map(p => p.id === activePageId ? { ...p, sections: next } : p));
  };

  const undo = () => {
    if (pastRef.current.length === 0) return;
    const prev = pastRef.current.pop()!;
    futureRef.current.push(JSON.parse(JSON.stringify(sections)));
    setSections(prev);
    setSelectedSectionId(null);
    setSelectedElementId(null);
    setPages(prevPages => prevPages.map(p => p.id === activePageId ? { ...p, sections: prev } : p));
    triggerToast?.("পূর্বের পরিবর্তন ফিরিয়ে আনা হয়েছে (Undo)");
  };

  const redo = () => {
    if (futureRef.current.length === 0) return;
    const next = futureRef.current.pop()!;
    pastRef.current.push(JSON.parse(JSON.stringify(sections)));
    setSections(next);
    setSelectedSectionId(null);
    setSelectedElementId(null);
    setPages(prevPages => prevPages.map(p => p.id === activePageId ? { ...p, sections: next } : p));
    triggerToast?.("পরের পরিবর্তন পুনরায় প্রয়োগ করা হয়েছে (Redo)");
  };

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      // Undo
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "z") {
        e.preventDefault();
        e.shiftKey ? redo() : undo();
      }
      // Save (Ctrl+S / Cmd+S)
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "s") {
        e.preventDefault();
        triggerManualSave();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [sections, pages, cmsCollections, globalTheme]);

  // Deep recursive element finding/mutating helpers
  const findElementById = (elements: BuilderElement[], id: string): BuilderElement | null => {
    for (const el of elements) {
      if (el.id === id) return el;
      if (el.children && el.children.length > 0) {
        const found = findElementById(el.children, id);
        if (found) return found;
      }
    }
    return null;
  };

  const removeElementById = (elements: BuilderElement[], id: string): { removed: BuilderElement | null; list: BuilderElement[] } => {
    let removed: BuilderElement | null = null;
    const list = elements.filter((el) => {
      if (el.id === id) {
        removed = el;
        return false;
      }
      if (el.children && el.children.length > 0) {
        const res = removeElementById(el.children, id);
        if (res.removed) {
          removed = res.removed;
          el.children = res.list;
        }
      }
      return true;
    });
    return { removed, list };
  };

  const insertElementBefore = (elements: BuilderElement[], targetId: string, item: BuilderElement): boolean => {
    for (let i = 0; i < elements.length; i++) {
      if (elements[i].id === targetId) {
        elements.splice(i, 0, item);
        return true;
      }
      if (elements[i].children && elements[i].children!.length > 0) {
        const done = insertElementBefore(elements[i].children!, targetId, item);
        if (done) return true;
      }
    }
    return false;
  };

  const insertElementAfter = (elements: BuilderElement[], targetId: string, item: BuilderElement): boolean => {
    for (let i = 0; i < elements.length; i++) {
      if (elements[i].id === targetId) {
        elements.splice(i + 1, 0, item);
        return true;
      }
      if (elements[i].children && elements[i].children!.length > 0) {
        const done = insertElementAfter(elements[i].children!, targetId, item);
        if (done) return true;
      }
    }
    return false;
  };

  const findAndMutateElement = (elements: BuilderElement[], id: string, patch: Partial<BuilderElement>): boolean => {
    for (const el of elements) {
      if (el.id === id) {
        Object.assign(el, patch);
        return true;
      }
      if (el.children && el.children.length > 0) {
        const done = findAndMutateElement(el.children, id, patch);
        if (done) return true;
      }
    }
    return false;
  };

  const findSelectedElement = (): BuilderElement | null => {
    if (!selectedElementId) return null;
    for (const sec of sections) {
      const found = findElementById(sec.elements, selectedElementId);
      if (found) return found;
    }
    return null;
  };

  const selectedSection = sections.find((s) => s.instanceId === selectedSectionId) || null;
  const selectedElement = findSelectedElement();

  /* --------------------------- AI Generation & Co-pilot Engine --------------------------- */
  const buildElementInstance = (el: any): BuilderElement => {
    const children = el.children && Array.isArray(el.children)
      ? el.children.map((c: any) => buildElementInstance(c))
      : undefined;

    return {
      id: el.id || uid("el"),
      kind: el.kind || "paragraph",
      text: el.text || "",
      placeholder: el.placeholder || "",
      href: el.href || "",
      imageUrl: el.imageUrl || "",
      style: defaultTextStyle(el.style || {}),
      children,
      animation: el.animation || { type: "none", trigger: "onLoad", delay: 0, duration: 0.6, easing: "easeOut", repeat: 0 },
      hoverEffect: el.hoverEffect || { scale: 1, cursor: "default", transitionDuration: 0.3 },
      scrollEffect: el.scrollEffect || { parallax: false, parallaxSpeed: 2, sticky: false, stickyTop: "0px", effectType: "none" },
      videoBg: el.videoBg || { enabled: false, videoUrl: "", overlayColor: "#000000", overlayOpacity: 0.4, blur: "0px" },
      lottie: el.lottie || { enabled: true, jsonContent: "", autoplay: true, loop: true, speed: 1, trigger: "onLoad" },
      interactionPreset: el.interactionPreset || "none"
    };
  };

  const handleAiGenerate = async () => {
    if (!aiPrompt.trim()) return;
    setIsAiThinking(true);
    setAiThinkingResult(null);

    // Initialize step-by-step thinking logs
    const steps = [
      { step: 1, label: "১. বিজনেস ক্যাটাগরি ও উদ্দেশ্য বিশ্লেষণ করা হচ্ছে...", active: true, done: false },
      { step: 2, label: "২. টার্গেট অডিয়েন্স এবং ইউজার ডিমান্ড চিহ্নিত হচ্ছে...", active: false, done: false },
      { step: 3, label: "৩. অপ্টিমাল ব্র্যান্ড কালার স্কিম ও টাইপোগ্রাফি নির্বাচন...", active: false, done: false },
      { step: 4, label: "৪. ভিজ্যুয়াল পেজ গ্রিড এবং সেকশন স্ট্রাকচার লেআউট...", active: false, done: false },
      { step: 5, label: "৫. আকর্ষণীয় ও এসইও-বান্ধব কপিরাইটিং লেখা হচ্ছে...", active: false, done: false },
    ];
    setAiThinkingSteps(steps);

    // Simulate animated step progression
    let currentStep = 1;
    const interval = setInterval(() => {
      if (currentStep < 5) {
        setAiThinkingSteps((prev) =>
          prev.map((s) => {
            if (s.step === currentStep) return { ...s, active: false, done: true };
            if (s.step === currentStep + 1) return { ...s, active: true };
            return s;
          })
        );
        currentStep++;
      } else {
        clearInterval(interval);
      }
    }, 1200);

    try {
      const response = await fetch("/api/gemini/generate-page", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt: aiPrompt }),
      });

      if (!response.ok) {
        const errData = await response.json();
        throw new Error(errData.error || "Failed to generate page layout");
      }

      const data = await response.json();
      clearInterval(interval);

      // Set all steps to completed
      setAiThinkingSteps((prev) => prev.map((s) => ({ ...s, active: false, done: true })));

      // Save thinking strategic analysis
      if (data.thinking) {
        setAiThinkingResult(data.thinking);
      }

      // 1. Auto-apply generated theme to design system
      if (data.theme) {
        const genTheme = data.theme;
        setGlobalTheme((prev) => ({
          ...prev,
          colors: {
            ...prev.colors,
            primary: genTheme.colors?.primary || prev.colors.primary,
            secondary: genTheme.colors?.secondary || prev.colors.secondary,
            accent: genTheme.colors?.accent || prev.colors.accent,
            success: genTheme.colors?.success || prev.colors.success,
            neutral: genTheme.colors?.neutral || prev.colors.neutral,
            dark: genTheme.colors?.dark || prev.colors.dark,
            light: genTheme.colors?.light || prev.colors.light,
          },
          typography: {
            ...prev.typography,
            heading: { ...prev.typography.heading, fontFamily: genTheme.typography?.headingFamily || "Inter" },
            paragraph: { ...prev.typography.paragraph, fontFamily: genTheme.typography?.paragraphFamily || "Inter" },
          },
          radius: {
            ...prev.radius,
            lg: genTheme.radius || "16px",
          },
        }));
      }

      // 2. Load suggestions for individual sections
      if (data.sections && Array.isArray(data.sections)) {
        const suggestions: SectionTemplate[] = data.sections.map((sec: any, idx: number) => {
          const templateId = `ai-sec-${idx}-${Date.now().toString(36)}`;
          return {
            id: templateId,
            name: sec.name || "এআই জেনারেট সেকশন",
            icon: sec.icon || "Sparkles",
            description: `এআই দ্বারা তৈরি অনন্য লেআউট ব্লক`,
            keywords: ["ai", "generated", "nested"],
            build: () => ({
              templateId,
              name: sec.name,
              icon: sec.icon || "Sparkles",
              visible: true,
              style: {
                bgType: "solid",
                bg: sec.style?.bg || "#ffffff",
                textColor: sec.style?.textColor || "#0f172a",
                paddingY: sec.style?.paddingY || "56px",
              },
              elements: (sec.elements || []).map((el: any) => buildElementInstance(el)),
            }),
          };
        });

        setAiSuggestions(suggestions);
        triggerToast?.("অপূর্ব এআই ডিজাইন এবং স্ট্রাটেজি প্রস্তুত হয়েছে!");
      }
    } catch (error: any) {
      console.error("Gemini API error:", error);
      clearInterval(interval);
      triggerToast?.(`এআই জেনারেট ত্রুটি: ${error.message}`);
    } finally {
      setIsAiThinking(false);
    }
  };

  const applyAllAiSuggestions = () => {
    commit((prev) => {
      const next = [...prev];
      aiSuggestions.forEach((t) => {
        next.push({ ...t.build(), instanceId: uid("sec") });
      });
      return next;
    });
    triggerToast?.("সবগুলো এআই সেকশন পেজে যুক্ত করা হয়েছে!");
  };

  const handleEditSectionWithAi = async (instanceId: string) => {
    if (!sectionAiPrompt.trim()) return;
    setIsEditingSectionWithAi(true);
    const targetSection = sections.find((s) => s.instanceId === instanceId);
    if (!targetSection) {
      setIsEditingSectionWithAi(false);
      return;
    }

    try {
      const response = await fetch("/api/gemini/edit-section", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt: sectionAiPrompt, section: targetSection }),
      });

      if (!response.ok) {
        const errData = await response.json();
        throw new Error(errData.error || "Failed to edit section");
      }

      const updatedData = await response.json();
      const updatedSection: BuilderSection = {
        ...updatedData,
        instanceId, // Preserve original instanceId
        elements: (updatedData.elements || []).map((el: any) => buildElementInstance(el)),
      };

      commit((prev) => prev.map((s) => (s.instanceId === instanceId ? updatedSection : s)));
      setSectionAiPrompt("");
      triggerToast?.("এআই দ্বারা সেকশনটির কন্টেন্ট ও স্টাইল রিডিজাইন করা হয়েছে!");
    } catch (err: any) {
      console.error(err);
      triggerToast?.(`এআই এডিটিং ত্রুটি: ${err.message}`);
    } finally {
      setIsEditingSectionWithAi(false);
    }
  };

  const handleFetchCopilotSuggestions = async () => {
    const el = selectedElement || selectedSection;
    if (!el) return;
    setIsCopilotLoading(true);
    setCopilotSuggestions([]);

    try {
      const response = await fetch("/api/gemini/suggest-optimizations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ element: el }),
      });

      if (!response.ok) {
        const errData = await response.json();
        throw new Error(errData.error || "Failed to fetch recommendations");
      }

      const data = await response.json();
      if (data && Array.isArray(data.suggestions)) {
        setCopilotSuggestions(data.suggestions);
        triggerToast?.("এআই কনভার্সন অপ্টিমাইজেশন আইডিয়া প্রস্তুত!");
      }
    } catch (err: any) {
      console.error(err);
      triggerToast?.(`অপ্টিমাইজেশন লোড ত্রুটি: ${err.message}`);
    } finally {
      setIsCopilotLoading(false);
    }
  };

  const applyCopilotSuggestion = (patch: Record<string, any>) => {
    if (!selectedElementId) return;
    commit((prev) => {
      return prev.map((sec) => {
        const found = findElementById(sec.elements, selectedElementId);
        if (found) {
          // Deep patch text and style keys
          if (patch.text) found.text = patch.text;
          if (patch.placeholder) found.placeholder = patch.placeholder;
          if (patch.href) found.href = patch.href;
          if (patch.imageUrl) found.imageUrl = patch.imageUrl;
          if (patch.children) found.children = patch.children.map((c: any) => buildElementInstance(c));
          if (patch.style) {
            found.style = { ...found.style, ...patch.style };
          }
        }
        return sec;
      });
    });
    triggerToast?.("অপ্টিমাইজেশন সাজেশন সফলভাবে প্রয়োগ করা হয়েছে!");
  };

  /* -------------------------- Canvas operations ------------------------- */
  const insertSection = (templateId: string, atIndex: number) => {
    const template = [...SECTION_TEMPLATES, ...aiSuggestions].find((t) => t.id === templateId);
    if (!template) return;
    const built = template.build();
    const newSection: BuilderSection = { ...built, instanceId: uid("sec") };
    commit((prev) => {
      const next = [...prev];
      next.splice(atIndex, 0, newSection);
      return next;
    });
    setSelectedSectionId(newSection.instanceId);
    setSelectedElementId(null);
    triggerToast?.(`"${template.name}" সেকশনটি যোগ করা হয়েছে`);
  };

  const addWidgetToSelection = (kind: ElementKind, customDefaultText?: string) => {
    const newEl: BuilderElement = {
      id: uid("el"),
      kind,
      text: customDefaultText || `নতুন ${kind}`,
      style: defaultTextStyle({
        fontSize: kind.includes("heading") ? "24px" : "14px",
        fontWeight: kind.includes("heading") ? "700" : "400",
      }),
      children: ["container", "grid", "flex", "card", "tabs", "accordion", "carousel", "modal", "drawer"].includes(kind) ? [] : undefined,
    };

    if (kind === "tabs") {
      newEl.tabsConfig = ["ট্যাব ১", "ট্যাব ২", "ট্যাব ৩"];
      newEl.children = [
        { id: uid("el"), kind: "paragraph", text: "ট্যাব ১ কন্টেন্ট বিস্তারিত...", style: defaultTextStyle() },
        { id: uid("el"), kind: "paragraph", text: "ট্যাব ২ কন্টেন্ট বিস্তারিত...", style: defaultTextStyle() },
        { id: uid("el"), kind: "paragraph", text: "ট্যাব ৩ কন্টেন্ট বিস্তারিত...", style: defaultTextStyle() },
      ];
    } else if (kind === "accordion") {
      newEl.accordionContent = "অ্যাকর্ডিয়ানের বিস্তারিত তথ্য এখানে বসান।";
    } else if (kind === "carousel") {
      newEl.children = [
        { id: uid("el"), kind: "paragraph", text: "স্লাইড ১ এর চমৎকার ছবি বা টেক্সট", style: defaultTextStyle({ align: "center" }) },
        { id: uid("el"), kind: "paragraph", text: "স্লাইড ২ এর আকর্ষণীয় অফার", style: defaultTextStyle({ align: "center" }) },
      ];
    }

    commit((prev) => {
      if (selectedElementId) {
        // Nested insert into selected container
        return prev.map((sec) => {
          const found = findElementById(sec.elements, selectedElementId);
          if (found && found.children) {
            found.children.push(newEl);
          }
          return sec;
        });
      } else if (selectedSectionId) {
        // Insert into active section root
        return prev.map((sec) => {
          if (sec.instanceId === selectedSectionId) {
            return { ...sec, elements: [...sec.elements, newEl] };
          }
          return sec;
        });
      } else if (prev.length > 0) {
        // Fallback: insert into first section
        const next = [...prev];
        next[0].elements.push(newEl);
        return next;
      }
      return prev;
    });

    setSelectedElementId(newEl.id);
    triggerToast?.(`নতুন "${kind}" উইজেট যোগ করা হয়েছে!`);
  };

  const deleteSection = (instanceId: string) => {
    if (confirm("আপনি কি এই সেকশনটি মুছে ফেলতে চান?")) {
      commit((prev) => prev.filter((s) => s.instanceId !== instanceId));
      if (selectedSectionId === instanceId) {
        setSelectedSectionId(null);
        setSelectedElementId(null);
      }
      triggerToast?.("সেকশন ডিলিট করা হয়েছে");
    }
  };

  const duplicateSection = (instanceId: string) => {
    const source = sections.find((s) => s.instanceId === instanceId);
    if (!source) return;
    const duplicated: BuilderSection = JSON.parse(JSON.stringify(source));
    duplicated.instanceId = uid("sec");
    
    // Regenerate deep child IDs
    const regenIds = (els: BuilderElement[]) => {
      els.forEach((el) => {
        el.id = uid("el");
        if (el.children) regenIds(el.children);
      });
    };
    regenIds(duplicated.elements);

    const index = sections.findIndex((s) => s.instanceId === instanceId);
    commit((prev) => {
      const next = [...prev];
      next.splice(index + 1, 0, duplicated);
      return next;
    });
    triggerToast?.("সেকশন ডুপ্লিকেট করা হয়েছে");
  };

  const moveSection = (index: number, direction: "up" | "down") => {
    const targetIndex = direction === "up" ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= sections.length) return;
    commit((prev) => {
      const next = [...prev];
      const temp = next[index];
      next[index] = next[targetIndex];
      next[targetIndex] = temp;
      return next;
    });
  };

  // Mutating active selected styles per Breakpoint
  const updateActiveStyles = (patch: Record<string, any>) => {
    if (!selectedElementId) return;
    commit((prev) => {
      return prev.map((sec) => {
        const el = findElementById(sec.elements, selectedElementId);
        if (el) {
          if (activeBreakpoint === "desktop") {
            el.style = { ...el.style, ...patch };
          } else {
            const resp = el.style.responsive || {};
            resp[activeBreakpoint] = { ...(resp[activeBreakpoint] || {}), ...patch };
            el.style = { ...el.style, responsive: resp };
          }
        }
        return sec;
      });
    });
  };

  const updateElementAnimation = (patch: Partial<AnimationConfig>) => {
    if (!selectedElementId) return;
    commit((prev) => {
      return prev.map((sec) => {
        const el = findElementById(sec.elements, selectedElementId);
        if (el) {
          el.animation = { ...(el.animation || {}), ...patch };
        }
        return sec;
      });
    });
  };

  const updateElementHoverEffect = (patch: Partial<HoverEffectConfig>) => {
    if (!selectedElementId) return;
    commit((prev) => {
      return prev.map((sec) => {
        const el = findElementById(sec.elements, selectedElementId);
        if (el) {
          el.hoverEffect = { ...(el.hoverEffect || {}), ...patch };
        }
        return sec;
      });
    });
  };

  const updateElementScrollEffect = (patch: Partial<ScrollEffectConfig>) => {
    if (!selectedElementId) return;
    commit((prev) => {
      return prev.map((sec) => {
        const el = findElementById(sec.elements, selectedElementId);
        if (el) {
          el.scrollEffect = { ...(el.scrollEffect || {}), ...patch };
        }
        return sec;
      });
    });
  };

  const updateElementVideoBg = (patch: Partial<VideoBgConfig>) => {
    if (!selectedElementId) return;
    commit((prev) => {
      return prev.map((sec) => {
        const el = findElementById(sec.elements, selectedElementId);
        if (el) {
          el.videoBg = { ...(el.videoBg || {}), ...patch };
        }
        return sec;
      });
    });
  };

  const updateElementLottie = (patch: Partial<LottieConfig>) => {
    if (!selectedElementId) return;
    commit((prev) => {
      return prev.map((sec) => {
        const el = findElementById(sec.elements, selectedElementId);
        if (el) {
          el.lottie = { ...(el.lottie || {}), ...patch };
        }
        return sec;
      });
    });
  };

  const updateElementPreset = (preset: InteractionPresetKind) => {
    if (!selectedElementId) return;
    commit((prev) => {
      return prev.map((sec) => {
        const el = findElementById(sec.elements, selectedElementId);
        if (el) {
          el.interactionPreset = preset;
        }
        return sec;
      });
    });
  };

  const updateSectionAnimation = (sectionId: string, patch: Partial<AnimationConfig>) => {
    commit((prev) => {
      return prev.map((sec) => {
        if (sec.instanceId === sectionId) {
          sec.animation = { ...(sec.animation || {}), ...patch };
        }
        return sec;
      });
    });
  };

  const updateSectionScrollEffect = (sectionId: string, patch: Partial<ScrollEffectConfig>) => {
    commit((prev) => {
      return prev.map((sec) => {
        if (sec.instanceId === sectionId) {
          sec.scrollEffect = { ...(sec.scrollEffect || {}), ...patch };
        }
        return sec;
      });
    });
  };

  const updateSectionVideoBg = (sectionId: string, patch: Partial<VideoBgConfig>) => {
    commit((prev) => {
      return prev.map((sec) => {
        if (sec.instanceId === sectionId) {
          sec.videoBg = { ...(sec.videoBg || {}), ...patch };
        }
        return sec;
      });
    });
  };

  /* ------------------------- HTML5 Drag & Drop Logic ------------------------ */
  const onDragStart = (e: React.DragEvent, id: string, source: any) => {
    setDraggedElementId(id);
    setDraggedSource(source);
    e.dataTransfer.setData("text/plain", id);
    e.dataTransfer.effectAllowed = "move";
  };

  const onDragOver = (e: React.DragEvent, targetId: string, position: "inside" | "above" | "below") => {
    e.preventDefault();
    e.stopPropagation();
    if (draggedElementId === targetId) return;
    setActiveDropTarget({ id: targetId, position });
  };

  const onDragLeave = () => {
    setActiveDropTarget(null);
  };

  const onDrop = (e: React.DragEvent, targetId: string, position: "inside" | "above" | "below") => {
    e.preventDefault();
    e.stopPropagation();
    setActiveDropTarget(null);

    const elId = e.dataTransfer.getData("text/plain") || draggedElementId;
    if (!elId || elId === targetId) return;

    commit((prev) => {
      let draggedItem: BuilderElement | null = null;
      // Step 1: Remove from source
      const cleaned = prev.map((sec) => {
        const res = removeElementById(sec.elements, elId);
        if (res.removed) draggedItem = res.removed;
        return { ...sec, elements: res.list };
      });

      if (!draggedItem) return prev;

      // Step 2: Insert into target
      if (position === "inside") {
        cleaned.forEach((sec) => {
          const target = findElementById(sec.elements, targetId);
          if (target) {
            target.children = target.children || [];
            target.children.push(draggedItem!);
          }
        });
      } else if (position === "above") {
        cleaned.forEach((sec) => {
          if (sec.elements.some((item) => item.id === targetId)) {
            const idx = sec.elements.findIndex((item) => item.id === targetId);
            sec.elements.splice(idx, 0, draggedItem!);
          } else {
            insertElementBefore(sec.elements, targetId, draggedItem!);
          }
        });
      } else if (position === "below") {
        cleaned.forEach((sec) => {
          if (sec.elements.some((item) => item.id === targetId)) {
            const idx = sec.elements.findIndex((item) => item.id === targetId);
            sec.elements.splice(idx + 1, 0, draggedItem!);
          } else {
            insertElementAfter(sec.elements, targetId, draggedItem!);
          }
        });
      }

      return cleaned;
    });

    setDraggedElementId(null);
    setDraggedSource(null);
    triggerToast?.("এলিমেন্ট ড্র্যাগ এন্ড ড্রপ সফল!");
  };

  /* ---------------------- CANVAS RECURSIVE ELEMENT VIEW --------------------- */
  const CanvasRecursiveElement = ({
    el,
    parentId,
    secId,
    overrideCmsIndex,
  }: {
    el: BuilderElement;
    parentId?: string;
    secId: string;
    overrideCmsIndex?: number;
    key?: any;
  }) => {
    const isSelected = selectedElementId === el.id;
    const isOver = activeDropTarget?.id === el.id;

    // Get merged style based on active breakpoint
    const getStylesForActiveScreen = () => {
      let base = { ...el.style };
      if (activeBreakpoint !== "desktop" && el.style?.responsive?.[activeBreakpoint]) {
        base = { ...base, ...el.style.responsive[activeBreakpoint] };
      }
      return getStylesFromConfig(base);
    };

    const styles = getStylesForActiveScreen();

    // CMS Value Resolvers
    const resolvedText = (() => {
      if (el.cmsBinding) {
        const { collectionId, fieldName: boundField } = el.cmsBinding;
        const col = cmsCollections.find(c => c.id === collectionId);
        if (col) {
          const idx = overrideCmsIndex !== undefined ? overrideCmsIndex : (el.cmsBinding.index || 0);
          const item = col.items[idx];
          if (item && item[boundField] !== undefined) {
            return String(item[boundField]);
          }
        }
      }
      return el.text;
    })();

    const resolvedImageUrl = (() => {
      if (el.cmsBinding) {
        const { collectionId, fieldName: boundField } = el.cmsBinding;
        const col = cmsCollections.find(c => c.id === collectionId);
        if (col) {
          const idx = overrideCmsIndex !== undefined ? overrideCmsIndex : (el.cmsBinding.index || 0);
          const item = col.items[idx];
          if (item && item[boundField] !== undefined) {
            return String(item[boundField]);
          }
        }
      }
      return el.imageUrl;
    })();

    const renderChildren = () => {
      // Loop rendering: If the element is bound to a loop collection
      const loopCol = el.cmsLoopCollectionId ? cmsCollections.find(c => c.id === el.cmsLoopCollectionId) : null;
      
      if (loopCol && el.children && el.children.length > 0) {
        return (
          <div className="w-full relative min-h-[30px] grid grid-cols-1 md:grid-cols-2 gap-4 p-1">
            {loopCol.items.map((item, itemIdx) => (
              <div key={item.id || itemIdx} className="bg-slate-50/50 hover:bg-slate-50 border border-indigo-600/20 hover:border-indigo-600/40 p-4 rounded-xl relative group/loop-item transition-all flex flex-col gap-2">
                {!previewMode && (
                  <span className="absolute -top-2.5 -right-2 bg-indigo-600 text-white text-[8px] font-black uppercase tracking-widest px-2 py-0.5 rounded-full z-30 shadow">
                    CMS: {loopCol.name} (রোর {itemIdx + 1})
                  </span>
                )}
                {el.children!.map((child) => (
                  <CanvasRecursiveElement key={child.id} el={child} parentId={el.id} secId={secId} overrideCmsIndex={itemIdx} />
                ))}
              </div>
            ))}
          </div>
        );
      }

      if (!el.children) return null;
      return (
        <div className="w-full relative min-h-[30px] border border-dashed border-slate-200/40 rounded-xl p-1.5 flex flex-col gap-1">
          {el.children.map((child, idx) => (
            <CanvasRecursiveElement key={child.id} el={child} parentId={el.id} secId={secId} overrideCmsIndex={overrideCmsIndex} />
          ))}
          {/* Empty container target */}
          {el.children.length === 0 && (
            <div
              onDragOver={(e) => onDragOver(e, el.id, "inside")}
              onDragLeave={onDragLeave}
              onDrop={(e) => onDrop(e, el.id, "inside")}
              className="py-4 text-center text-[10px] text-slate-300 font-mono flex items-center justify-center gap-1 bg-slate-50 border border-dashed border-slate-200 rounded-lg hover:border-indigo-400 cursor-pointer"
            >
              <Plus className="w-3 h-3" /> উইজেট এখানে ফেলুন (Drop inside)
            </div>
          )}
        </div>
      );
    };

    return (
      <div
        id={el.id}
        draggable={!previewMode && !el.locked}
        onDragStart={(e) => onDragStart(e, el.id, { secId, parentId })}
        onClick={(e) => {
          e.stopPropagation();
          if (previewMode) return;
          setSelectedSectionId(secId);
          setSelectedElementId(el.id);
        }}
        className={`group/node relative rounded-xl transition-all ${
          previewMode ? "" : isSelected ? "ring-2 ring-indigo-500 bg-indigo-50/10 shadow-lg" : "hover:ring-1 hover:ring-fuchsia-400"
        } ${isOver && activeDropTarget?.position === "inside" ? "bg-indigo-100/40" : ""}`}
      >
        {/* Smart drop indicators above/below */}
        {!previewMode && (
          <div
            onDragOver={(e) => onDragOver(e, el.id, "above")}
            onDragLeave={onDragLeave}
            onDrop={(e) => onDrop(e, el.id, "above")}
            className={`h-2 transition-all ${isOver && activeDropTarget?.position === "above" ? "bg-indigo-500 scale-y-120" : "bg-transparent"}`}
          />
        )}

        {/* Selected Border tag */}
        {isSelected && !previewMode && (
          <div className="absolute -top-6 left-0 bg-indigo-600 text-white text-[9px] font-black tracking-widest px-2.5 py-0.5 rounded-t-lg z-50 flex items-center gap-1.5 uppercase">
            <span>{el.kind}</span>
            {el.locked && <Lock className="w-2.5 h-2.5" />}
            <button
              onClick={(e) => {
                e.stopPropagation();
                commit((prev) => {
                  const cleaned = prev.map((sec) => {
                    const res = removeElementById(sec.elements, el.id);
                    return { ...sec, elements: res.list };
                  });
                  return cleaned;
                });
                setSelectedElementId(null);
              }}
              className="hover:text-red-300"
            >
              <Trash2 className="w-2.5 h-2.5" />
            </button>
          </div>
        )}

        {/* Dynamic CMS Binding badge */}
        {el.cmsBinding && !previewMode && (
          <span className="absolute top-1 right-1 bg-purple-600 text-white text-[7px] font-black uppercase tracking-widest px-1.5 py-0.5 rounded z-40 shadow pointer-events-none">
            🔗 {el.cmsBinding.collectionId}.{el.cmsBinding.fieldName}
          </span>
        )}

        {/* ACTUAL COMPONENT VIEW WRAPPER */}
        <AnimatedWrapper
          animation={el.animation}
          hoverEffect={el.hoverEffect}
          scrollEffect={el.scrollEffect}
          interactionPreset={el.interactionPreset}
          activeBreakpoint={activeBreakpoint}
          previewMode={previewMode}
        >
          <div style={{ ...styles, position: "relative" }} className="w-full overflow-hidden rounded-inherit">
            {el.videoBg?.enabled && <VideoBackground config={el.videoBg} />}
            {el.kind === "container" && renderChildren()}
            {el.kind === "flex" && (
              <div
                style={{
                  display: "flex",
                  flexDirection: el.style?.flexDirection || "row",
                  flexWrap: el.style?.flexWrap || "nowrap",
                  justifyContent: el.style?.justifyContent || "flex-start",
                  alignItems: el.style?.alignItems || "stretch",
                  gap: el.style?.gap || "12px",
                }}
              >
                {renderChildren()}
              </div>
            )}
            {el.kind === "grid" && (
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: el.style?.gridTemplateColumns || "repeat(3, minmax(0, 1fr))",
                  gridTemplateRows: el.style?.gridTemplateRows,
                  gap: el.style?.gap || "16px",
                }}
              >
                {renderChildren()}
              </div>
            )}
            {el.kind === "card" && (
              <div className="p-5 bg-white border border-slate-100 shadow-2xs rounded-2xl w-full">
                {renderChildren()}
              </div>
            )}
            {el.kind === "eyebrow" && (
              <span className="inline-block text-xs font-bold tracking-widest uppercase px-2.5 py-1 rounded-full bg-indigo-50 text-indigo-700">
                {resolvedText}
              </span>
            )}
            {el.kind === "heading" && <h2 className="leading-tight font-extrabold text-slate-900">{resolvedText}</h2>}
            {el.kind === "paragraph" && <p className="leading-relaxed opacity-90 whitespace-pre-wrap">{resolvedText}</p>}
            {el.kind === "button" && (
              <div style={{ textAlign: el.style?.align }}>
                <a
                  href="#"
                  onClick={(e) => e.preventDefault()}
                  className="inline-flex items-center gap-2 px-5 py-2.5 bg-indigo-600 text-white rounded-lg text-xs font-bold"
                >
                  {el.icon && el.iconPosition === "left" && <RenderIcon name={el.icon} className="w-3.5 h-3.5" />}
                  {resolvedText}
                  {el.icon && el.iconPosition === "right" && <RenderIcon name={el.icon} className="w-3.5 h-3.5" />}
                </a>
              </div>
            )}
            {el.kind === "image" && (
              <div className="w-full">
                {resolvedImageUrl ? (
                  <img src={resolvedImageUrl} alt="asset" className="w-full object-cover rounded-xl" />
                ) : (
                  <div className="w-full py-8 bg-slate-50 border border-dashed border-slate-200 rounded-xl text-center text-xs text-slate-400">
                    <ImageIcon className="w-5 h-5 mx-auto mb-1 text-slate-300" />
                    <span>{resolvedText || "ইমেজ প্লেসহোল্ডার"}</span>
                  </div>
                )}
              </div>
            )}
            {el.kind === "video" && (
              <div className="w-full aspect-video rounded-xl bg-slate-100 border border-slate-200 flex flex-col items-center justify-center text-slate-400 text-xs">
                <VideoIcon className="w-6 h-6 mb-1 text-slate-300" />
                <span>{el.text || "ইউটিউব/ভিডিও ইউআরএল"}</span>
              </div>
            )}
            {el.kind === "stat" && (
              <div className="text-center py-4">
                <div className="text-3xl font-black text-indigo-600">{el.text.split("\n")[0]}</div>
                <div className="text-[10px] text-slate-400 uppercase tracking-wide mt-1">{el.text.split("\n")[1]}</div>
              </div>
            )}
            {el.kind === "icon-text" && (
              <div className="p-4 border border-slate-100 bg-white rounded-xl text-xs">
                <div className="font-extrabold text-slate-800 mb-1">{el.text.split("\n")[0]}</div>
                <div className="text-slate-500 leading-normal">{el.text.split("\n")[1]}</div>
              </div>
            )}
            {el.kind === "form" && (
              <div className="p-4 bg-slate-50/50 border border-slate-200 rounded-xl space-y-2 w-full">
                <div className="text-[10px] font-bold text-slate-600 uppercase">যোগাযোগ ফর্ম</div>
                <input type="text" disabled placeholder="আপনার নাম" className="w-full p-2 text-[11px] bg-white border rounded" />
                <button className="w-full bg-slate-950 text-white py-1.5 text-[10px] font-bold rounded">দাখিল করুন</button>
              </div>
            )}
            {/* Advanced Components */}
            {el.kind === "tabs" && (
              <div className="w-full border border-slate-100 p-2 rounded-xl bg-white">
                <div className="flex border-b pb-1 mb-2 gap-2 text-[10px] font-bold text-slate-400 overflow-x-auto">
                  {(el.tabsConfig || []).map((t, i) => (
                    <span key={i} className={`pb-1 px-2 ${i === 0 ? "border-b-2 border-indigo-600 text-indigo-600" : ""}`}>{t}</span>
                  ))}
                </div>
                <div className="py-2">{renderChildren()}</div>
              </div>
            )}
            {el.kind === "accordion" && (
              <div className="w-full border rounded-xl p-3 bg-white flex justify-between items-center text-xs font-bold text-slate-700">
                <span>{resolvedText}</span>
                <span>▼</span>
              </div>
            )}
            {el.kind === "carousel" && (
              <div className="w-full border bg-slate-50 p-4 rounded-xl relative text-center">
                {renderChildren()}
                <div className="absolute bottom-2 left-0 right-0 flex justify-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-indigo-600" />
                  <span className="w-1.5 h-1.5 rounded-full bg-slate-300" />
                </div>
              </div>
            )}
            {el.kind === "progress" && (
              <div className="w-full">
                <div className="flex justify-between text-[10px] font-bold text-slate-500 mb-1">
                  <span>{resolvedText}</span>
                  <span>{el.progressValue || 75}%</span>
                </div>
                <div className="w-full bg-slate-100 rounded-full h-1.5">
                  <div className="bg-indigo-600 h-1.5 rounded-full" style={{ width: `${el.progressValue || 75}%` }} />
                </div>
              </div>
            )}
            {el.kind === "avatar" && (
              <div className="w-10 h-10 rounded-full bg-indigo-100 text-indigo-700 font-extrabold flex items-center justify-center text-xs">
                {resolvedText ? resolvedText.substring(0, 2) : "ইউ"}
              </div>
            )}
            {el.kind === "badge" && (
              <span className="inline-block px-2 py-0.5 text-[9px] font-bold uppercase rounded bg-indigo-50 text-indigo-700 border border-indigo-100">
                {resolvedText || "নতুন"}
              </span>
            )}
            {el.kind === "chart" && (
              <div className="w-full border p-3 rounded-xl bg-white text-[10px]">
                <span className="font-bold text-slate-700 block mb-2">{resolvedText}</span>
                <div className="h-16 flex items-end gap-2 border-b border-slate-100 pb-1">
                  {[30, 50, 40, 75, 90].map((v, i) => (
                    <div key={i} className="flex-1 bg-indigo-400 rounded-t-sm" style={{ height: `${v}%` }} />
                  ))}
                </div>
              </div>
            )}
            {el.kind === "map" && (
              <div className="w-full aspect-video rounded-xl bg-slate-50 border border-slate-200 flex flex-col items-center justify-center text-slate-400 text-xs">
                <MapPin className="w-5 h-5 text-indigo-500 mb-1" />
                <span className="font-bold">{resolvedText || "হেড অফিস ম্যাপ"}</span>
              </div>
            )}
            {el.kind === "toast" && (
              <div className="p-3 border border-indigo-200 bg-indigo-50/50 rounded-xl text-center text-xs font-bold text-indigo-700">
                🔔 {resolvedText}
              </div>
            )}
            {el.kind === "input" && (
              <div className="w-full">
                <label className="block text-[10px] font-bold text-slate-500 mb-1">{resolvedText}</label>
                <input type="text" disabled placeholder={el.placeholder || "ইনপুট লিখুন..."} className="w-full p-2 text-xs bg-white border rounded" />
              </div>
            )}
            {el.kind === "textarea" && (
              <div className="w-full">
                <label className="block text-[10px] font-bold text-slate-500 mb-1">{resolvedText}</label>
                <textarea disabled placeholder={el.placeholder || "মেসেজ লিখুন..."} className="w-full p-2 text-xs bg-white border rounded h-12" />
              </div>
            )}
            {el.kind === "checkbox" && (
              <div className="flex items-center gap-2 text-xs text-slate-600">
                <input type="checkbox" disabled />
                <span>{el.text}</span>
              </div>
            )}
            {el.kind === "calendar" && (
              <div className="p-3 border border-slate-100 bg-white rounded-xl text-[9px] font-bold text-slate-500">
                <div className="grid grid-cols-7 gap-0.5 text-center">
                  {["শ", "র", "সো", "ম", "বু", "বৃ", "শু"].map((d) => <span key={d}>{d}</span>)}
                  {Array.from({ length: 14 }).map((_, i) => <span key={i} className="py-1 hover:bg-indigo-50 rounded-sm">{i + 1}</span>)}
                </div>
              </div>
            )}
            {el.kind === "modal" && (
              <div className="p-3.5 border bg-slate-50 text-center text-xs font-bold text-slate-700 rounded-xl">
                📦 পপআপ মডেল বাটন: {el.text}
              </div>
            )}
            {el.kind === "drawer" && (
              <div className="p-3.5 border bg-slate-50 text-center text-xs font-bold text-slate-700 rounded-xl">
                🚪 সাইড ড্রয়ার ট্রিগার বাটন
              </div>
            )}
            {el.kind === "lottie" && (
              <LottiePlayer config={el.lottie} previewMode={previewMode} className="w-full" />
            )}
          </div>
        </AnimatedWrapper>

        {/* Smart drop indicators below */}
        {!previewMode && (
          <div
            onDragOver={(e) => onDragOver(e, el.id, "below")}
            onDragLeave={onDragLeave}
            onDrop={(e) => onDrop(e, el.id, "below")}
            className={`h-2 transition-all ${isOver && activeDropTarget?.position === "below" ? "bg-indigo-500 scale-y-120" : "bg-transparent"}`}
          />
        )}
      </div>
    );
  };

  /* ------------------------ NAVIGATOR RECURSIVE TREE ------------------------ */
  const NavigatorNode = ({ el, depth = 0 }: { el: BuilderElement; depth: number; key?: any }) => {
    const [collapsed, setCollapsed] = useState(false);
    const isSelected = selectedElementId === el.id;

    return (
      <div className="flex flex-col">
        <div
          onClick={() => setSelectedElementId(el.id)}
          className={`group flex items-center justify-between py-1 px-2.5 rounded-lg cursor-pointer text-xs font-bold ${
            isSelected ? "bg-indigo-600/30 text-indigo-400" : "text-slate-400 hover:bg-slate-900 hover:text-slate-200"
          }`}
          style={{ paddingLeft: `${depth * 12 + 8}px` }}
        >
          <div className="flex items-center gap-1.5 min-w-0">
            {el.children && el.children.length > 0 ? (
              <button onClick={() => setCollapsed(!collapsed)} className="p-0.5 hover:bg-slate-800 rounded">
                {collapsed ? <ChevronRight className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
              </button>
            ) : (
              <span className="w-4 h-4" />
            )}
            <Folder className="w-3.5 h-3.5 shrink-0" />
            <span className="truncate">{el.text || el.kind}</span>
          </div>
          <div className="opacity-0 group-hover:opacity-100 flex items-center gap-1">
            <button
              onClick={(e) => {
                e.stopPropagation();
                commit((prev) => {
                  return prev.map((sec) => {
                    const found = findElementById(sec.elements, el.id);
                    if (found) {
                      found.locked = !found.locked;
                    }
                    return sec;
                  });
                });
              }}
              className="p-1 hover:text-white"
            >
              {el.locked ? <Lock className="w-3 h-3 text-amber-500" /> : <Unlock className="w-3 h-3 text-slate-500" />}
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                if (confirm("আপনি কি এটি মুছে ফেলতে চান?")) {
                  commit((prev) => {
                    const cleaned = prev.map((sec) => {
                      const res = removeElementById(sec.elements, el.id);
                      return { ...sec, elements: res.list };
                    });
                    return cleaned;
                  });
                  setSelectedElementId(null);
                }
              }}
              className="p-1 text-red-400 hover:text-red-300"
            >
              <Trash2 className="w-3 h-3" />
            </button>
          </div>
        </div>
        {!collapsed && el.children && el.children.map((child) => (
          <NavigatorNode key={child.id} el={child} depth={depth + 1} />
        ))}
      </div>
    );
  };

  /* ----------------------------- FILTER WIDGETS ----------------------------- */
  const filteredComponents = useMemo(() => {
    if (!searchTerm.trim()) return COMPONENT_LIBRARY;
    return COMPONENT_LIBRARY.filter((c) =>
      c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.kind.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [searchTerm]);

  return (
    <div className="flex flex-col h-screen bg-slate-950 text-slate-100 font-sans select-none overflow-hidden">
      
      {/* 1. TOP CONTROL BAR */}
      <header className="flex items-center justify-between px-6 py-3.5 bg-slate-950 border-b border-slate-900 z-50">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5">
            <div className="w-2.5 h-2.5 rounded-full bg-indigo-500 animate-pulse" />
            <span className="font-extrabold tracking-wider text-xs uppercase bg-slate-900 px-2 py-1 rounded border border-slate-800 text-indigo-400">
              LAYOUT ENGINE 4.0
            </span>
          </div>
          <div className="h-4 w-px bg-slate-800" />
          <div className="flex items-center gap-1">
            <button
              onClick={undo}
              className="p-2 text-slate-400 hover:text-white hover:bg-slate-900 rounded-lg transition-colors cursor-pointer"
              title="ইউ-টার্ন (Undo)"
            >
              <Undo2 className="w-4 h-4" />
            </button>
            <button
              onClick={redo}
              className="p-2 text-slate-400 hover:text-white hover:bg-slate-900 rounded-lg transition-colors cursor-pointer"
              title="রি-ডু (Redo)"
            >
              <Redo2 className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Breakpoints and Preview Selector */}
        <div className="flex items-center gap-1.5 bg-slate-900 p-1 rounded-xl border border-slate-800">
          {[
            { id: "desktop", icon: Monitor, label: "ডেস্কটপ" },
            { id: "laptop", icon: Tv, label: "ল্যাপটপ" },
            { id: "tablet", icon: Tablet, label: "ট্যাবলেট" },
            { id: "mobileLandscape", icon: Smartphone, label: "মোবাইল ল্যান্ডস্কেপ" },
            { id: "mobilePortrait", icon: Smartphone, label: "মোবাইল পোর্ট্রেট" },
          ].map((device) => {
            const Comp = device.icon;
            return (
              <button
                key={device.id}
                onClick={() => setActiveBreakpoint(device.id as Breakpoint)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-wider transition-all cursor-pointer ${
                  activeBreakpoint === device.id ? "bg-indigo-600 text-white shadow" : "text-slate-400 hover:text-slate-200"
                }`}
              >
                <Comp className="w-3.5 h-3.5" />
                <span className="hidden lg:inline">{device.label}</span>
              </button>
            );
          })}
        </div>

        {/* View mode zoom and actions */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => setPreviewMode(!previewMode)}
            className={`flex items-center gap-1.5 px-3 py-1.5 border border-slate-800 rounded-xl text-xs font-black cursor-pointer transition-all ${
              previewMode ? "bg-emerald-600 text-white border-transparent" : "text-slate-400 hover:text-white hover:bg-slate-900"
            }`}
          >
            {previewMode ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
            {previewMode ? "এডিটর মোড" : "লাইভ প্রিভিউ"}
          </button>
          <button
            onClick={async () => {
              if (onSave) {
                await onSave(sections);
                triggerToast?.("পেজের নকশা সফলভাবে ড্রাফট সেভ করা হয়েছে!");
              }
            }}
            className="flex items-center gap-1.5 px-4 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-black cursor-pointer transition-all shadow"
          >
            <Save className="w-3.5 h-3.5" /> সেভ করুন
          </button>
        </div>
      </header>

      <div className="flex-1 flex overflow-hidden">
        
        {/* 2. LEFT SIDEBAR (Navigator, Component library, Global design system) */}
        {!previewMode && (
          <aside className="w-80 border-r border-slate-900 bg-slate-950 flex flex-col shrink-0 z-40">
            <div className="grid grid-cols-3 border-b border-slate-900">
              {[
                { id: "add", icon: PlusCircle, label: "উইজেট" },
                { id: "navigator", icon: Layers, label: "ন্যাভিগেটর" },
                { id: "theme", icon: Palette, label: "থিম টোকেন" },
                { id: "pages", icon: FileText, label: "পেজেস" },
                { id: "cms", icon: Database, label: "সিএমএস" },
                { id: "media", icon: ImageIcon, label: "মিডিয়া" },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setSidebarTab(tab.id as any)}
                  className={`py-2 text-[9px] font-black uppercase tracking-wider text-center border-b border-r border-slate-900 transition-all cursor-pointer ${
                    sidebarTab === tab.id ? "text-indigo-400 border-b-2 border-indigo-600 bg-slate-900/40" : "text-slate-500 hover:text-slate-300 border-b border-transparent"
                  }`}
                >
                  <tab.icon className="w-3.5 h-3.5 mx-auto mb-0.5" />
                  {tab.label}
                </button>
              ))}
            </div>

            {/* TAB CONTENT */}
            <div className="flex-1 overflow-y-auto p-4">
              
              {/* TAB 1: ADD COMPONENTS */}
              {sidebarTab === "add" && (
                <div className="space-y-4">
                  {/* Search bar */}
                  <div className="relative">
                    <Search className="absolute left-3 top-2.5 w-3.5 h-3.5 text-slate-500" />
                    <input
                      type="text"
                      placeholder="উইজেট খুঁজুন..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="w-full bg-slate-900 border border-slate-800 rounded-xl pl-9 pr-4 py-2 text-xs text-slate-200 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                    />
                  </div>

                  {/* Components List */}
                  <div className="grid grid-cols-2 gap-2">
                    {filteredComponents.map((comp) => (
                      <button
                        key={comp.kind}
                        onClick={() => addWidgetToSelection(comp.kind as ElementKind, comp.defaultText)}
                        className="flex flex-col items-center justify-center p-3.5 bg-slate-900 border border-slate-850 hover:border-indigo-500 hover:bg-slate-900/80 rounded-xl transition-all cursor-pointer text-center group"
                      >
                        <comp.icon className="w-4 h-4 text-slate-400 group-hover:text-indigo-400 mb-1.5" />
                        <span className="text-[10px] font-bold text-slate-300 truncate w-full">{comp.name}</span>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* TAB 2: NAVIGATOR TREE */}
              {sidebarTab === "navigator" && (
                <div className="space-y-3">
                  <div className="text-[10px] font-black uppercase tracking-wider text-slate-500 mb-2">পেজ স্ট্রাকচার</div>
                  {sections.length === 0 ? (
                    <div className="text-xs text-slate-500 text-center py-10">ন্যাভিগেটরে দেখানোর মতো কোনো সেকশন নেই।</div>
                  ) : (
                    sections.map((sec, idx) => (
                      <div key={sec.instanceId} className="border border-slate-900 bg-slate-900/10 rounded-xl p-1.5 mb-2">
                        <div
                          onClick={() => {
                            setSelectedSectionId(sec.instanceId);
                            setSelectedElementId(null);
                          }}
                          className={`flex items-center justify-between py-1.5 px-2.5 rounded-lg cursor-pointer font-extrabold text-xs ${
                            selectedSectionId === sec.instanceId ? "bg-indigo-600/35 text-indigo-400" : "text-slate-300 hover:bg-slate-900"
                          }`}
                        >
                          <div className="flex items-center gap-1.5">
                            <FolderPlus className="w-3.5 h-3.5 text-indigo-400" />
                            <span>{sec.name}</span>
                          </div>
                          <div className="flex items-center gap-1 opacity-60 hover:opacity-100">
                            <button onClick={() => moveSection(idx, "up")} className="p-0.5 hover:text-white"><ArrowUp className="w-3 h-3" /></button>
                            <button onClick={() => moveSection(idx, "down")} className="p-0.5 hover:text-white"><ArrowDown className="w-3 h-3" /></button>
                          </div>
                        </div>
                        <div className="mt-1 flex flex-col gap-0.5">
                          {sec.elements.map((el) => (
                            <NavigatorNode key={el.id} el={el} depth={0} />
                          ))}
                        </div>
                      </div>
                    ))
                  )}
                </div>
              )}

              {/* TAB 3: GLOBAL DESIGN SYSTEM */}
              {sidebarTab === "theme" && (
                <div className="space-y-4">
                  <div className="text-[10px] font-black uppercase tracking-wider text-slate-500">গ্লোবাল ডিজাইন টোকেনস</div>
                  
                  {/* Global colors */}
                  <div className="space-y-2 border-b border-slate-900 pb-4">
                    <span className="block text-xs font-bold text-slate-300">থিম কালার স্কেল</span>
                    {Object.entries(globalTheme.colors).map(([key, val]) => (
                      <div key={key} className="flex items-center justify-between text-xs font-bold">
                        <span className="capitalize text-slate-400">{key}</span>
                        <div className="flex items-center gap-2">
                          <input
                            type="color"
                            value={val}
                            onChange={(e) => {
                              const updated = { ...globalTheme.colors, [key]: e.target.value };
                              setGlobalTheme({ ...globalTheme, colors: updated });
                            }}
                            className="w-5 h-5 rounded cursor-pointer border-none bg-transparent"
                          />
                          <span className="text-[10px] font-mono text-slate-500 uppercase">{val}</span>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Radius and Shadows */}
                  <div className="space-y-2.5">
                    <span className="block text-xs font-bold text-slate-300">বর্ডার রেডিয়াস টোকেন</span>
                    {Object.entries(globalTheme.radius).map(([key, val]) => (
                      <div key={key} className="flex items-center justify-between text-xs">
                        <span className="capitalize text-slate-400 font-bold">{key}</span>
                        <input
                          type="text"
                          value={val}
                          onChange={(e) => {
                            const updated = { ...globalTheme.radius, [key]: e.target.value };
                            setGlobalTheme({ ...globalTheme, radius: updated });
                          }}
                          className="w-20 bg-slate-900 border border-slate-800 text-slate-300 rounded px-2 py-0.5 text-[10px] text-right font-bold"
                        />
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* TAB 4: PAGES MANAGER */}
              {sidebarTab === "pages" && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between border-b border-slate-900 pb-2">
                    <span className="text-[11px] font-black uppercase text-indigo-400 tracking-wider flex items-center gap-1.5">
                      <FileText className="w-3.5 h-3.5" />
                      পেজ রাউটার (Page Router)
                    </span>
                    <span className="text-[10px] font-bold text-slate-500 bg-slate-900 px-1.5 py-0.5 rounded">
                      {pages.length} টি পেজ
                    </span>
                  </div>

                  {/* Page Creation Form */}
                  {isCreatingPage ? (
                    <div className="p-3 bg-slate-900/60 border border-slate-800 rounded-xl space-y-3 text-xs">
                      <span className="block font-black text-slate-300 border-b border-slate-800 pb-1.5">নতুন পেজ তৈরি করুন</span>
                      <div className="space-y-1">
                        <label className="text-[10px] text-slate-400 font-bold block">পেজের নাম</label>
                        <input
                          type="text"
                          value={newPageTitle}
                          onChange={(e) => {
                            setNewPageTitle(e.target.value);
                            setNewPageSlug(e.target.value.toLowerCase().replace(/[^a-z0-9]+/g, "-"));
                          }}
                          placeholder="যেমন: আমাদের টিম"
                          className="w-full bg-slate-950 border border-slate-800 rounded p-1.5 text-slate-200"
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="text-[10px] text-slate-400 font-bold block">ইউআরএল পাথ (Slug)</label>
                        <input
                          type="text"
                          value={newPageSlug}
                          onChange={(e) => setNewPageSlug(e.target.value.toLowerCase())}
                          placeholder="যেমন: our-team"
                          className="w-full bg-slate-950 border border-slate-800 rounded p-1.5 text-slate-200 font-mono"
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="text-[10px] text-slate-400 font-bold block">স্ট্যাটাস (Status)</label>
                        <select
                          value={newPageStatus}
                          onChange={(e) => setNewPageStatus(e.target.value as any)}
                          className="w-full bg-slate-950 border border-slate-800 text-slate-300 rounded p-1"
                        >
                          <option value="draft">Draft (খসড়া)</option>
                          <option value="published">Published (প্রকাশিত)</option>
                        </select>
                      </div>
                      <div className="flex gap-2 pt-1">
                        <button
                          onClick={() => {
                            if (!newPageTitle.trim() || !newPageSlug.trim()) {
                              alert("দয়া করে নাম ও স্ল্যাগ প্রদান করুন!");
                              return;
                            }
                            const newPage: PageItem = {
                              id: `p-${Date.now()}`,
                              title: newPageTitle,
                              slug: newPageSlug,
                              status: newPageStatus,
                              sections: [],
                              versions: [
                                { id: `v-${Date.now()}`, timestamp: new Date().toLocaleString(), description: "তৈরি করা হয়েছে", sections: [] }
                              ]
                            };
                            setPages(prev => [...prev, newPage]);
                            setIsCreatingPage(false);
                            setNewPageTitle("");
                            setNewPageSlug("");
                            setNewPageStatus("draft");
                            // Switch to this new page automatically
                            setActivePageId(newPage.id);
                            setSections([]);
                            setSelectedSectionId(null);
                            setSelectedElementId(null);
                            triggerToast?.(`"${newPage.title}" পেজটি সফলভাবে তৈরি করে স্যুইচ করা হয়েছে!`);
                          }}
                          className="flex-1 bg-indigo-600 hover:bg-indigo-500 text-white font-bold py-1.5 rounded cursor-pointer text-center"
                        >
                          সংরক্ষণ
                        </button>
                        <button
                          onClick={() => setIsCreatingPage(false)}
                          className="flex-1 bg-slate-850 hover:bg-slate-800 text-slate-300 font-bold py-1.5 rounded cursor-pointer text-center"
                        >
                          বাতিল
                        </button>
                      </div>
                    </div>
                  ) : (
                    <button
                      onClick={() => setIsCreatingPage(true)}
                      className="w-full py-2 bg-slate-900 hover:bg-slate-850 border border-dashed border-slate-800 hover:border-indigo-500 text-white text-xs font-bold rounded-xl flex items-center justify-center gap-1.5 transition-all cursor-pointer"
                    >
                      <Plus className="w-4 h-4" /> নতুন পেজ যোগ করুন
                    </button>
                  )}

                  {/* Pages list */}
                  <div className="space-y-2">
                    {pages.map((p) => {
                      const isActive = activePageId === p.id;
                      return (
                        <div
                          key={p.id}
                          onClick={() => {
                            // Sync current state
                            setPages(prev => prev.map(item => item.id === activePageId ? { ...item, sections } : item));
                            // Load target
                            setActivePageId(p.id);
                            setSections(p.sections || []);
                            setSelectedSectionId(null);
                            setSelectedElementId(null);
                            triggerToast?.(`"${p.title}" পেজ স্যুইচ সম্পূর্ণ!`);
                          }}
                          className={`p-3 rounded-xl border transition-all cursor-pointer flex flex-col gap-1.5 ${
                            isActive
                              ? "bg-indigo-950/20 border-indigo-600 shadow"
                              : "bg-slate-900/40 border-slate-900 hover:border-slate-800"
                          }`}
                        >
                          <div className="flex items-center justify-between">
                            <span className={`text-xs font-black ${isActive ? "text-indigo-400" : "text-slate-200"}`}>{p.title}</span>
                            <span className={`text-[8px] font-black uppercase tracking-widest px-2 py-0.5 rounded-full ${
                              p.status === "published"
                                ? "bg-emerald-600/10 text-emerald-400 border border-emerald-500/20"
                                : "bg-amber-600/10 text-amber-400 border border-amber-500/20"
                            }`}>
                              {p.status}
                            </span>
                          </div>
                          <div className="flex items-center justify-between text-[10px] text-slate-500 font-mono">
                            <span>/{p.slug}</span>
                            <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100" onClick={e => e.stopPropagation()}>
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  if (pages.length <= 1) {
                                    alert("সর্বনিম্ন ১ টি পেজ আবশ্যক!");
                                    return;
                                  }
                                  if (isActive) {
                                    alert("সক্রিয় পেজটি ডিলিট করতে পারবেন না। ডিলিট করার আগে অন্য পেজে স্যুইচ করুন!");
                                    return;
                                  }
                                  if (confirm(`আপনি কি "${p.title}" পেজটি ডিলিট করতে চান?`)) {
                                    setPages(prev => prev.filter(item => item.id !== p.id));
                                    triggerToast?.("পেজ সফলভাবে মুছে ফেলা হয়েছে!");
                                  }
                                }}
                                className="p-1 hover:text-red-400 text-slate-500 rounded"
                                title="পেজ মুছুন"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* TAB 5: CMS SCHEMA & CONTENT MANAGER */}
              {sidebarTab === "cms" && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between border-b border-slate-900 pb-2">
                    <span className="text-[11px] font-black uppercase text-indigo-400 tracking-wider flex items-center gap-1.5">
                      <Database className="w-3.5 h-3.5" />
                      ডায়নামিক সিএমএস ইঞ্জিন (CMS Engine)
                    </span>
                    <span className="text-[10px] font-bold text-slate-500 bg-slate-900 px-1.5 py-0.5 rounded">
                      {cmsCollections.length} কালেকশন
                    </span>
                  </div>

                  {/* Choose Collection */}
                  <div className="space-y-1.5 text-xs">
                    <label className="text-[10px] text-slate-400 font-bold block">অ্যাক্টিভ কালেকশন সিলেক্ট করুন</label>
                    <select
                      value={selectedCollectionId}
                      onChange={(e) => setSelectedCollectionId(e.target.value)}
                      className="w-full bg-slate-900 border border-slate-800 text-slate-300 rounded p-1.5 font-bold"
                    >
                      {cmsCollections.map((col) => (
                        <option key={col.id} value={col.id}>{col.name}</option>
                      ))}
                    </select>
                  </div>

                  {/* Display fields/schema of current collection */}
                  {(() => {
                    const col = cmsCollections.find(c => c.id === selectedCollectionId);
                    if (!col) return null;

                    return (
                      <div className="space-y-3.5 text-xs">
                        {/* Schema schema panel */}
                        <div className="p-3 bg-slate-900/30 border border-slate-900 rounded-xl">
                          <span className="block text-[10px] font-black text-slate-400 uppercase tracking-wide mb-1.5">কালেকশন স্কিমা (Fields)</span>
                          <div className="flex flex-wrap gap-1.5">
                            {col.fields.map((f) => (
                              <span key={f.name} className="bg-slate-900 border border-slate-800 text-[10px] font-mono px-2 py-0.5 rounded text-slate-300">
                                {f.name}: <span className="text-indigo-400 font-bold">{f.type}</span>
                              </span>
                            ))}
                          </div>
                        </div>

                        {/* List Records */}
                        <div className="space-y-2">
                          <div className="flex items-center justify-between">
                            <span className="text-[10px] font-black text-slate-400 uppercase tracking-wide">রেকর্ডসমূহ (Records)</span>
                            <button
                              onClick={() => {
                                const newRecord: Record<string, any> = { id: `item-${Date.now()}` };
                                col.fields.forEach(f => {
                                  newRecord[f.name] = f.type === "number" ? 100 : f.type === "image" ? "" : "নতুন মান";
                                });
                                setCmsCollections(prev => prev.map(c => {
                                  if (c.id === selectedCollectionId) {
                                    return { ...c, items: [...c.items, newRecord] };
                                  }
                                  return c;
                                }));
                                triggerToast?.("কালেকশনে নতুন রেকর্ড যুক্ত হয়েছে!");
                              }}
                              className="text-[10px] font-black text-indigo-400 hover:text-indigo-300 flex items-center gap-1 cursor-pointer"
                            >
                              <Plus className="w-3 h-3" /> রেকর্ড যোগ করুন
                            </button>
                          </div>

                          <div className="space-y-2 max-h-[300px] overflow-y-auto pr-1">
                            {col.items.map((item, itemIdx) => (
                              <div key={item.id || itemIdx} className="bg-slate-900/50 border border-slate-900 rounded-xl p-3.5 space-y-2">
                                <div className="flex items-center justify-between border-b border-slate-900 pb-1.5 mb-1.5">
                                  <span className="text-[10px] font-mono font-black text-indigo-400 uppercase">রেকর্ড #{itemIdx + 1}</span>
                                  <button
                                    onClick={() => {
                                      setCmsCollections(prev => prev.map(c => {
                                        if (c.id === selectedCollectionId) {
                                          return { ...c, items: c.items.filter((_, idx) => idx !== itemIdx) };
                                        }
                                        return c;
                                      }));
                                      triggerToast?.("রেকর্ড মুছে ফেলা হয়েছে!");
                                    }}
                                    className="p-1 text-slate-500 hover:text-red-400 cursor-pointer"
                                    title="মুছে ফেলুন"
                                  >
                                    <Trash2 className="w-3.5 h-3.5" />
                                  </button>
                                </div>

                                {/* Dynamic Field Input fields */}
                                <div className="space-y-2">
                                  {col.fields.map((f) => (
                                    <div key={f.name} className="flex flex-col gap-1">
                                      <span className="text-[9px] text-slate-400 font-bold block capitalize">{f.label || f.name}</span>
                                      <input
                                        type="text"
                                        value={item[f.name] ?? ""}
                                        onChange={(e) => {
                                          const val = f.type === "number" ? (parseInt(e.target.value) || 0) : e.target.value;
                                          setCmsCollections(prev => prev.map(c => {
                                            if (c.id === selectedCollectionId) {
                                              const updatedItems = [...c.items];
                                              updatedItems[itemIdx] = { ...updatedItems[itemIdx], [f.name]: val };
                                              return { ...c, items: updatedItems };
                                            }
                                            return c;
                                          }));
                                        }}
                                        className="w-full bg-slate-950 border border-slate-800 rounded p-1 text-[11px] font-bold text-slate-200"
                                      />
                                    </div>
                                  ))}
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    );
                  })()}
                </div>
              )}

              {/* TAB 6: MEDIA LIBRARY & simulated live drag-and-drop uploader */}
              {sidebarTab === "media" && (
                <div className="space-y-4 text-xs">
                  <div className="flex items-center justify-between border-b border-slate-900 pb-2">
                    <span className="text-[11px] font-black uppercase text-indigo-400 tracking-wider flex items-center gap-1.5">
                      <ImageIcon className="w-3.5 h-3.5" />
                      মিডিয়া লাইব্রেরি (Media Library)
                    </span>
                    <span className="text-[10px] font-bold text-slate-500 bg-slate-900 px-1.5 py-0.5 rounded">
                      {mediaAssets.length} টি ফাইল
                    </span>
                  </div>

                  {/* Search and folders */}
                  <div className="space-y-2">
                    <input
                      type="text"
                      placeholder="মিডিয়া খুঁজুন..."
                      value={mediaSearchTerm}
                      onChange={(e) => setMediaSearchTerm(e.target.value)}
                      className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-1.5 text-xs text-slate-200 focus:outline-none"
                    />

                    {/* Folders filters */}
                    <div className="flex gap-1 overflow-x-auto pb-1 scrollbar-none">
                      {["All", "Avatars", "Banners", "Therapy"].map((folder) => (
                        <button
                          key={folder}
                          onClick={() => setSelectedMediaFolder(folder)}
                          className={`px-2.5 py-1 text-[9px] font-bold uppercase tracking-wider rounded-lg border transition-all cursor-pointer shrink-0 ${
                            selectedMediaFolder === folder
                              ? "bg-indigo-600/30 text-indigo-400 border-indigo-500/40"
                              : "bg-slate-900 border-slate-850 text-slate-400 hover:text-slate-200"
                          }`}
                        >
                          {folder}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Upload Simulator */}
                  {mediaUploadingProgress !== null ? (
                    <div className="p-3 bg-indigo-950/25 border border-indigo-500/20 rounded-xl space-y-2">
                      <div className="flex items-center justify-between text-[10px] font-bold">
                        <span className="text-indigo-400 truncate max-w-[150px]">Uploading: {mediaUploadingName}</span>
                        <span>{mediaUploadingProgress}%</span>
                      </div>
                      <div className="w-full bg-slate-850 h-1.5 rounded-full overflow-hidden">
                        <div className="bg-indigo-500 h-1.5 transition-all duration-100" style={{ width: `${mediaUploadingProgress}%` }} />
                      </div>
                    </div>
                  ) : (
                    <div
                      onClick={() => {
                        // Simulate selecting file
                        const fNames = ["therapy_slide_illustration.png", "clinic_exterior_stock.png", "avatar_dentist.jpg", "banner_sensory.png"];
                        const chosen = fNames[Math.floor(Math.random() * fNames.length)];
                        setMediaUploadingName(chosen);
                        setMediaUploadingProgress(0);
                        
                        let prog = 0;
                        const interval = setInterval(() => {
                          prog += 20;
                          setMediaUploadingProgress(prog);
                          if (prog >= 100) {
                            clearInterval(interval);
                            setTimeout(() => {
                              const newAsset: MediaAsset = {
                                id: `m-${Date.now()}`,
                                name: chosen.replace(/\.[^/.]+$/, "").replace(/_/g, " "),
                                url: "https://images.unsplash.com/photo-1516627145497-ae6968895b74?auto=format&fit=crop&q=80&w=600", // simulated asset url
                                folder: "User Uploads",
                                type: "image"
                              };
                              setMediaAssets(prev => [newAsset, ...prev]);
                              setMediaUploadingProgress(null);
                              triggerToast?.(`"${newAsset.name}" মিডিয়া লাইব্রেরিতে সফলভাবে যুক্ত হয়েছে!`);
                            }, 300);
                          }
                        }, 150);
                      }}
                      className="p-4 border border-dashed border-slate-800 hover:border-indigo-500 bg-slate-900/30 hover:bg-slate-900/50 rounded-xl text-center cursor-pointer group transition-all"
                    >
                      <UploadCloud className="w-6 h-6 text-slate-500 group-hover:text-indigo-400 mx-auto mb-1 animate-pulse" />
                      <span className="block text-[10px] font-bold text-slate-300">নতুন ফাইল আপলোড করুন</span>
                      <span className="block text-[8px] text-slate-500 mt-0.5">ক্লিক বা ড্র্যাগ করুন (Simulated uploader)</span>
                    </div>
                  )}

                  {/* Assets Grid */}
                  <div className="grid grid-cols-2 gap-2 max-h-[250px] overflow-y-auto pr-1">
                    {mediaAssets
                      .filter(asset => selectedMediaFolder === "All" || asset.folder === selectedMediaFolder)
                      .filter(asset => !mediaSearchTerm || asset.name.toLowerCase().includes(mediaSearchTerm.toLowerCase()))
                      .map((asset) => (
                        <div
                          key={asset.id}
                          onClick={() => {
                            // Copy URL
                            navigator.clipboard.writeText(asset.url);
                            triggerToast?.(`ইউআরএল ক্লিপবোর্ডে কপি করা হয়েছে!`);

                            // Auto apply image
                            if (selectedElementId) {
                              commit((prev) => {
                                const found = findElementById(prev.flatMap(s => s.elements), selectedElementId);
                                if (found && found.kind === "image") {
                                  found.imageUrl = asset.url;
                                  triggerToast?.(`ছবি সফলভাবে উপাদানটিতে প্রয়োগ করা হয়েছে!`);
                                }
                                return prev;
                              });
                            }
                          }}
                          className={`p-1.5 bg-slate-900 border hover:border-indigo-500 rounded-xl transition-all cursor-pointer relative group flex flex-col gap-1 ${
                            selectedElementId && sections.some(s => findElementById(s.elements, selectedElementId)?.kind === "image")
                              ? "hover:ring-1 hover:ring-indigo-500"
                              : ""
                          }`}
                        >
                          <div className="aspect-video w-full rounded-lg overflow-hidden bg-slate-950 flex items-center justify-center">
                            <img src={asset.url} alt={asset.name} className="w-full h-full object-cover" />
                          </div>
                          <span className="text-[9px] font-bold text-slate-400 truncate block px-0.5" title={asset.name}>
                            {asset.name}
                          </span>
                          
                          <span className="absolute bottom-1 right-1 bg-slate-900/80 text-white text-[7px] font-bold px-1 py-0.5 rounded opacity-0 group-hover:opacity-100 transition-opacity">
                            Apply / Copy
                          </span>
                        </div>
                    ))}
                  </div>
                </div>
              )}

            </div>
          </aside>
        )}

        {/* 3. CENTER RESIZABLE CANVAS */}
        <main className="flex-1 bg-slate-900/80 flex flex-col items-center justify-start p-6 overflow-y-auto z-10">
          <div
            className="transition-all duration-300 shadow-2xl bg-white text-slate-900 rounded-2xl overflow-hidden border border-slate-850"
            style={{
              width:
                activeBreakpoint === "mobilePortrait"
                  ? "375px"
                  : activeBreakpoint === "mobileLandscape"
                  ? "568px"
                  : activeBreakpoint === "tablet"
                  ? "768px"
                  : activeBreakpoint === "laptop"
                  ? "1024px"
                  : "100%",
              transform: `scale(${zoomLevel / 100})`,
              transformOrigin: "top center",
              minHeight: "85vh",
            }}
          >
            <div className="flex flex-col bg-slate-50">
              {sections.length === 0 ? (
                <div className="py-24 text-center px-6">
                  <Wand2 className="w-12 h-12 text-indigo-400 mx-auto mb-4 animate-bounce" />
                  <h3 className="text-lg font-black text-slate-800">কোনো সেকশন যোগ করা হয়নি!</h3>
                  <p className="text-xs text-slate-500 max-w-sm mx-auto mt-2 leading-relaxed">
                    ডান পাশের লেআউট লাইব্রেরি বা এআই কো-পাইলট ব্যবহার করে চমৎকার সব সেকশন যোগ করুন।
                  </p>
                  <div className="mt-6 flex justify-center gap-3">
                    <button
                      onClick={() => setRightTab("library")}
                      className="px-4 py-2 bg-indigo-600 text-white rounded-xl text-xs font-black cursor-pointer shadow"
                    >
                      লাইব্রেরি দেখুন
                    </button>
                    <button
                      onClick={() => setRightTab("ai")}
                      className="px-4 py-2 bg-slate-900 text-white rounded-xl text-xs font-black cursor-pointer"
                    >
                      এআই জেনারেট
                    </button>
                  </div>
                </div>
              ) : (
                sections.map((sec, idx) => {
                  if (!sec.visible && !previewMode) return null;
                  const secStyles = getStylesFromConfig(sec.style);

                  return (
                    <section
                      key={sec.instanceId}
                      style={{ ...secStyles, position: "relative" }}
                      className={`relative w-full transition-all group/sec border-b border-dashed border-slate-200/50 overflow-hidden ${
                        selectedSectionId === sec.instanceId && !previewMode ? "ring-2 ring-indigo-500" : ""
                      }`}
                    >
                      {sec.videoBg?.enabled && <VideoBackground config={sec.videoBg} />}
                      {/* Floating Section Controller bar */}
                      {!previewMode && (
                        <div className="absolute top-2 right-4 bg-slate-900/90 text-white text-[10px] font-bold px-3 py-1.5 rounded-xl z-50 flex items-center gap-2 opacity-0 group-hover/sec:opacity-100 transition-opacity shadow-lg">
                          <span>{sec.name}</span>
                          <button onClick={() => moveSection(idx, "up")} className="p-0.5 hover:text-indigo-400 cursor-pointer"><ArrowUp className="w-3 h-3" /></button>
                          <button onClick={() => moveSection(idx, "down")} className="p-0.5 hover:text-indigo-400 cursor-pointer"><ArrowDown className="w-3 h-3" /></button>
                          <button onClick={() => duplicateSection(sec.instanceId)} className="p-0.5 hover:text-indigo-400 cursor-pointer"><Copy className="w-3 h-3" /></button>
                          <button onClick={() => deleteSection(sec.instanceId)} className="p-0.5 hover:text-red-400 cursor-pointer"><Trash2 className="w-3 h-3" /></button>
                        </div>
                      )}

                      {/* Drop slots above each section */}
                      {!previewMode && (
                        <div
                          onDragOver={(e) => onDragOver(e, sec.instanceId, "above")}
                          onDragLeave={onDragLeave}
                          onDrop={(e) => onDrop(e, sec.instanceId, "above")}
                          className="h-2 hover:bg-indigo-500/20 rounded transition-all"
                        />
                      )}

                      <div className="max-w-7xl mx-auto px-6 py-4 relative z-10">
                        <AnimatedWrapper
                          animation={sec.animation}
                          scrollEffect={sec.scrollEffect}
                          activeBreakpoint={activeBreakpoint}
                          previewMode={previewMode}
                        >
                          {sec.elements.map((el) => (
                            <CanvasRecursiveElement key={el.id} el={el} secId={sec.instanceId} />
                          ))}

                          {/* Button to quickly insert widget directly inside section */}
                          {!previewMode && sec.elements.length === 0 && (
                            <div
                              onDragOver={(e) => onDragOver(e, sec.instanceId, "inside")}
                              onDragLeave={onDragLeave}
                              onDrop={(e) => onDrop(e, sec.instanceId, "inside")}
                              className="py-10 text-center border-2 border-dashed border-slate-200 rounded-2xl flex flex-col items-center justify-center text-slate-400 hover:border-indigo-400"
                            >
                              <Plus className="w-8 h-8 mb-2 text-slate-300" />
                              <span className="text-xs font-bold">এখানে ড্র্যাগ করে এলিমেন্ট ফেলুন</span>
                            </div>
                          )}
                        </AnimatedWrapper>
                      </div>
                    </section>
                  );
                })
              )}
            </div>
          </div>
        </main>

        {/* 4. RIGHT SIDEBAR (Dynamic properties editor, Library & AI block templates) */}
        {!previewMode && (
          <aside className="w-80 border-l border-slate-900 bg-slate-950 flex flex-col shrink-0 z-40">
            <div className="flex border-b border-slate-900">
              {[
                { id: "style", icon: Sliders, label: "প্রোপার্টিজ" },
                { id: "library", icon: Folder, label: "লেআউটস" },
                { id: "ai", icon: Sparkles, label: "এআই" },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setRightTab(tab.id as any)}
                  className={`flex-1 py-3 text-[10px] font-black uppercase tracking-wider text-center border-b-2 transition-all cursor-pointer ${
                    rightTab === tab.id ? "text-indigo-400 border-indigo-600 bg-slate-900/40" : "text-slate-500 hover:text-slate-300 border-transparent"
                  }`}
                >
                  <tab.icon className="w-3.5 h-3.5 mx-auto mb-1" />
                  {tab.label}
                </button>
              ))}
            </div>

            <div className="flex-1 overflow-y-auto p-4">
              
              {/* STYLE PROPERTIES EDITOR */}
              {rightTab === "style" && (
                <div className="space-y-4">
                  {selectedElement ? (
                    <div>
                      <div className="flex items-center justify-between border-b border-slate-900 pb-2 mb-4">
                        <span className="text-xs font-black uppercase text-slate-300">{selectedElement.kind} স্টাইল</span>
                        <span className="text-[10px] font-mono text-slate-500 bg-slate-900 px-1.5 py-0.5 rounded uppercase">{activeBreakpoint}</span>
                      </div>

                      {/* Flexbox Properties Editor */}
                      {selectedElement.kind === "flex" && (
                        <div className="space-y-3 border-b border-slate-900 pb-4 mb-4">
                          <span className="block text-[11px] font-bold text-indigo-400 uppercase tracking-wide">ফ্লেক্সবক্স লেআউট</span>
                          
                          <div className="flex flex-col gap-1.5 text-xs">
                            <span>দিকনির্দেশ (Direction)</span>
                            <select
                              value={selectedElement.style?.flexDirection || "row"}
                              onChange={(e) => updateActiveStyles({ flexDirection: e.target.value })}
                              className="w-full bg-slate-900 border border-slate-800 text-slate-300 rounded px-2 py-1"
                            >
                              <option value="row">Horizontal (Row)</option>
                              <option value="row-reverse">Horizontal Reverse</option>
                              <option value="column">Vertical (Column)</option>
                              <option value="column-reverse">Vertical Reverse</option>
                            </select>
                          </div>

                          <div className="flex flex-col gap-1.5 text-xs">
                            <span>র‍্যাপ (Wrap)</span>
                            <select
                              value={selectedElement.style?.flexWrap || "nowrap"}
                              onChange={(e) => updateActiveStyles({ flexWrap: e.target.value })}
                              className="w-full bg-slate-900 border border-slate-800 text-slate-300 rounded px-2 py-1"
                            >
                              <option value="nowrap">No Wrap (nowrap)</option>
                              <option value="wrap">Wrap (wrap)</option>
                              <option value="wrap-reverse">Wrap Reverse</option>
                            </select>
                          </div>

                          <div className="flex flex-col gap-1.5 text-xs">
                            <span>জাস্টিফাই কনটেন্ট</span>
                            <select
                              value={selectedElement.style?.justifyContent || "flex-start"}
                              onChange={(e) => updateActiveStyles({ justifyContent: e.target.value })}
                              className="w-full bg-slate-900 border border-slate-800 text-slate-300 rounded px-2 py-1"
                            >
                              <option value="flex-start">Start</option>
                              <option value="center">Center</option>
                              <option value="flex-end">End</option>
                              <option value="space-between">Space Between</option>
                              <option value="space-around">Space Around</option>
                              <option value="space-evenly">Space Evenly</option>
                            </select>
                          </div>

                          <div className="flex flex-col gap-1.5 text-xs">
                            <span>অ্যালাইন আইটেমস</span>
                            <select
                              value={selectedElement.style?.alignItems || "stretch"}
                              onChange={(e) => updateActiveStyles({ alignItems: e.target.value })}
                              className="w-full bg-slate-900 border border-slate-800 text-slate-300 rounded px-2 py-1"
                            >
                              <option value="stretch">Stretch</option>
                              <option value="flex-start">Start</option>
                              <option value="center">Center</option>
                              <option value="flex-end">End</option>
                              <option value="baseline">Baseline</option>
                            </select>
                          </div>

                          <div className="flex flex-col gap-1.5 text-xs">
                            <span>গ্যাপ (Gap)</span>
                            <input
                              type="text"
                              value={selectedElement.style?.gap || "16px"}
                              onChange={(e) => updateActiveStyles({ gap: e.target.value })}
                              placeholder="e.g. 12px or 1rem"
                              className="w-full bg-slate-900 border border-slate-800 text-slate-300 rounded px-2 py-1 text-[11px] font-mono"
                            />
                          </div>
                        </div>
                      )}

                      {/* CSS Grid Properties Editor */}
                      {selectedElement.kind === "grid" && (
                        <div className="space-y-3 border-b border-slate-900 pb-4 mb-4">
                          <span className="block text-[11px] font-bold text-indigo-400 uppercase tracking-wide">গ্রিড বিল্ডার (CSS Grid)</span>
                          
                          <div className="flex flex-col gap-1.5 text-xs">
                            <span>কলাম টেমপ্লেট (Columns)</span>
                            <input
                              type="text"
                              value={selectedElement.style?.gridTemplateColumns || "repeat(3, minmax(0, 1fr))"}
                              onChange={(e) => updateActiveStyles({ gridTemplateColumns: e.target.value })}
                              placeholder="e.g. repeat(3, minmax(0, 1fr)) or 1fr 2fr"
                              className="w-full bg-slate-900 border border-slate-800 text-slate-300 rounded px-2 py-1 text-[11px] font-mono"
                            />
                            {/* Visual Presets for CSS Grid Builder */}
                            <div className="grid grid-cols-3 gap-1 mt-1.5 text-[9px] text-slate-400">
                              <button onClick={() => updateActiveStyles({ gridTemplateColumns: "1fr" })} className="p-1 bg-slate-900 border border-slate-800 rounded hover:bg-slate-800 text-center cursor-pointer">১ কলাম</button>
                              <button onClick={() => updateActiveStyles({ gridTemplateColumns: "repeat(2, minmax(0, 1fr))" })} className="p-1 bg-slate-900 border border-slate-800 rounded hover:bg-slate-800 text-center cursor-pointer">২ কলাম</button>
                              <button onClick={() => updateActiveStyles({ gridTemplateColumns: "repeat(3, minmax(0, 1fr))" })} className="p-1 bg-slate-900 border border-slate-800 rounded hover:bg-slate-800 text-center cursor-pointer">৩ কলাম</button>
                              <button onClick={() => updateActiveStyles({ gridTemplateColumns: "repeat(4, minmax(0, 1fr))" })} className="p-1 bg-slate-900 border border-slate-800 rounded hover:bg-slate-800 text-center cursor-pointer">৪ কলাম</button>
                              <button onClick={() => updateActiveStyles({ gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))" })} className="p-1 bg-slate-900 border border-slate-800 rounded hover:bg-slate-800 text-center cursor-pointer truncate">Auto Fit</button>
                              <button onClick={() => updateActiveStyles({ gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))" })} className="p-1 bg-slate-900 border border-slate-800 rounded hover:bg-slate-800 text-center cursor-pointer truncate">Auto Fill</button>
                            </div>
                          </div>

                          <div className="flex flex-col gap-1.5 text-xs">
                            <span>রো টেমপ্লেট (Rows)</span>
                            <input
                              type="text"
                              value={selectedElement.style?.gridTemplateRows || ""}
                              onChange={(e) => updateActiveStyles({ gridTemplateRows: e.target.value })}
                              placeholder="e.g. auto or 100px 1fr"
                              className="w-full bg-slate-900 border border-slate-800 text-slate-300 rounded px-2 py-1 text-[11px] font-mono"
                            />
                          </div>

                          <div className="flex flex-col gap-1.5 text-xs">
                            <span>গ্যাপ (Grid Gap)</span>
                            <input
                              type="text"
                              value={selectedElement.style?.gap || "16px"}
                              onChange={(e) => updateActiveStyles({ gap: e.target.value })}
                              placeholder="e.g. 16px or 1rem"
                              className="w-full bg-slate-900 border border-slate-800 text-slate-300 rounded px-2 py-1 text-[11px] font-mono"
                            />
                          </div>
                        </div>
                      )}

                      {/* Flex & Grid Item Controls (Available for all elements to control alignment inside container) */}
                      <div className="space-y-3 border-b border-slate-900 pb-4 mb-4">
                        <span className="block text-[11px] font-bold text-slate-400 uppercase tracking-wide">ফ্লেক্স ও গ্রিড আইটেম কন্ট্রোলস</span>
                        
                        <div className="grid grid-cols-2 gap-2 text-xs">
                          <div className="flex flex-col gap-1">
                            <span>অ্যালাইন সেলফ (Self)</span>
                            <select
                              value={selectedElement.style?.alignSelf || "auto"}
                              onChange={(e) => updateActiveStyles({ alignSelf: e.target.value })}
                              className="w-full bg-slate-900 border border-slate-800 text-slate-300 rounded p-1 text-xs"
                            >
                              <option value="auto">Auto</option>
                              <option value="flex-start">Start</option>
                              <option value="center">Center</option>
                              <option value="flex-end">End</option>
                              <option value="stretch">Stretch</option>
                            </select>
                          </div>

                          <div className="flex flex-col gap-1">
                            <span>অর্ডার (Order)</span>
                            <input
                              type="number"
                              value={selectedElement.style?.order ?? 0}
                              onChange={(e) => updateActiveStyles({ order: e.target.value === "" ? "" : Number(e.target.value) })}
                              className="w-full bg-slate-900 border border-slate-800 text-slate-300 rounded p-1 text-xs"
                            />
                          </div>
                        </div>

                        <div className="grid grid-cols-2 gap-2 text-xs">
                          <div className="flex flex-col gap-1">
                            <span>ফ্লেক্স গ্রো (Grow)</span>
                            <select
                              value={selectedElement.style?.flexGrow ?? 0}
                              onChange={(e) => updateActiveStyles({ flexGrow: Number(e.target.value) })}
                              className="w-full bg-slate-900 border border-slate-800 text-slate-300 rounded p-1 text-xs"
                            >
                              <option value={0}>0 (No grow)</option>
                              <option value={1}>1 (Fill space)</option>
                              <option value={2}>2 (Grow more)</option>
                            </select>
                          </div>

                          <div className="flex flex-col gap-1">
                            <span>ফ্লেক্স শ্রিঙ্ক (Shrink)</span>
                            <select
                              value={selectedElement.style?.flexShrink ?? 1}
                              onChange={(e) => updateActiveStyles({ flexShrink: Number(e.target.value) })}
                              className="w-full bg-slate-900 border border-slate-800 text-slate-300 rounded p-1 text-xs"
                            >
                              <option value={0}>0 (No shrink)</option>
                              <option value={1}>1 (Shrinkable)</option>
                            </select>
                          </div>
                        </div>

                        <div className="flex flex-col gap-1.5 text-xs">
                          <span>ফ্লেক্স বেসিস (Basis)</span>
                          <input
                            type="text"
                            value={selectedElement.style?.flexBasis || "auto"}
                            onChange={(e) => updateActiveStyles({ flexBasis: e.target.value })}
                            placeholder="e.g. auto, 250px, 50%"
                            className="w-full bg-slate-900 border border-slate-800 text-slate-300 rounded px-2 py-1 text-[11px] font-mono"
                          />
                        </div>

                        <div className="grid grid-cols-2 gap-2 text-xs">
                          <div className="flex flex-col gap-1">
                            <span>গ্রিড কলাম স্প্যান (Col)</span>
                            <input
                              type="text"
                              value={selectedElement.style?.gridColumn || ""}
                              onChange={(e) => updateActiveStyles({ gridColumn: e.target.value })}
                              placeholder="e.g. span 2, 1/3"
                              className="w-full bg-slate-900 border border-slate-800 text-slate-300 rounded p-1 text-[11px] font-mono"
                            />
                          </div>

                          <div className="flex flex-col gap-1">
                            <span>গ্রিড রো স্প্যান (Row)</span>
                            <input
                              type="text"
                              value={selectedElement.style?.gridRow || ""}
                              onChange={(e) => updateActiveStyles({ gridRow: e.target.value })}
                              placeholder="e.g. span 2"
                              className="w-full bg-slate-900 border border-slate-800 text-slate-300 rounded p-1 text-[11px] font-mono"
                            />
                          </div>
                        </div>
                      </div>

                      {/* General Design System Token variables selection */}
                      <div className="space-y-3 pb-4">
                        <span className="block text-[11px] font-bold text-slate-400 uppercase tracking-wide">কন্টেন্ট এবং টেক্সট</span>
                        <div className="flex flex-col gap-1.5 text-xs">
                          <span>প্রধান টেক্সট</span>
                          <textarea
                            value={selectedElement.text}
                            onChange={(e) => {
                              commit((prev) => {
                                findAndMutateElement(prev.flatMap(s => s.elements), selectedElementId!, { text: e.target.value });
                                return prev;
                              });
                            }}
                            className="w-full h-16 bg-slate-900 border border-slate-800 text-slate-300 rounded p-2 text-xs"
                          />
                        </div>

                        {/* Image URL Input (if type is image) */}
                        {selectedElement.kind === "image" && (
                          <div className="flex flex-col gap-1.5 text-xs">
                            <span>ছবি ইউআরএল (Image URL)</span>
                            <input
                              type="text"
                              value={selectedElement.imageUrl || ""}
                              onChange={(e) => {
                                commit((prev) => {
                                  findAndMutateElement(prev.flatMap(s => s.elements), selectedElementId!, { imageUrl: e.target.value });
                                  return prev;
                                });
                              }}
                              placeholder="e.g. https://images.unsplash.com/..."
                              className="w-full bg-slate-900 border border-slate-800 text-slate-300 rounded p-1.5 text-xs font-mono"
                            />
                          </div>
                        )}

                        {/* CMS Data Binding Panel */}
                        <div className="border border-purple-500/30 bg-purple-950/20 rounded-xl p-3 space-y-3 mt-2">
                          <div className="flex items-center gap-1.5 text-[11px] font-black uppercase text-purple-400">
                            <Database className="w-3.5 h-3.5 text-purple-400" />
                            <span>সিএমএস বাইন্ডিং (CMS Binding)</span>
                          </div>

                          {/* Loop Binding for Containers */}
                          {["container", "flex", "grid", "card"].includes(selectedElement.kind) ? (
                            <div className="space-y-2 text-xs">
                              <label className="text-[10px] text-slate-400 font-bold block">লুপ কালেকশন (Loop Collection)</label>
                              <select
                                value={selectedElement.cmsLoopCollectionId || ""}
                                onChange={(e) => {
                                  const val = e.target.value || undefined;
                                  commit((prev) => {
                                    findAndMutateElement(prev.flatMap(s => s.elements), selectedElementId!, { cmsLoopCollectionId: val });
                                    return prev;
                                  });
                                }}
                                className="w-full bg-slate-900 border border-slate-800 text-slate-300 rounded p-1 text-xs"
                              >
                                <option value="">-- কোনোটিই নয় (No Loop) --</option>
                                {cmsCollections.map((col) => (
                                  <option key={col.id} value={col.id}>{col.name} ({col.items.length} আইটেমস)</option>
                                ))}
                              </select>
                              <p className="text-[9px] text-purple-300/80 leading-normal">
                                এটি সেট করলে কন্টেইনারটির ভেতরের উপাদানগুলো কালেকশনের প্রতিটি আইটেমের জন্য স্বয়ংক্রিয়ভাবে রিপিট হবে।
                              </p>
                            </div>
                          ) : (
                            // Field binding for leaf elements
                            <div className="space-y-2.5 text-xs">
                              <div className="flex items-center justify-between">
                                <span className="text-[10px] text-slate-400 font-bold">বাইন্ডিং সক্রিয় করুন</span>
                                <input
                                  type="checkbox"
                                  checked={!!selectedElement.cmsBinding}
                                  onChange={(e) => {
                                    const active = e.target.checked;
                                    commit((prev) => {
                                      const defaultBinding = active ? { collectionId: cmsCollections[0]?.id || "", fieldName: "name", index: 0 } : undefined;
                                      findAndMutateElement(prev.flatMap(s => s.elements), selectedElementId!, { cmsBinding: defaultBinding });
                                      return prev;
                                    });
                                  }}
                                  className="rounded border-slate-800 bg-slate-900 text-indigo-600 focus:ring-0 cursor-pointer"
                                />
                              </div>

                              {selectedElement.cmsBinding && (
                                <>
                                  <div className="space-y-1">
                                    <label className="text-[9px] text-slate-500 font-bold block">কালেকশন সিলেক্ট করুন</label>
                                    <select
                                      value={selectedElement.cmsBinding.collectionId}
                                      onChange={(e) => {
                                        const colId = e.target.value;
                                        commit((prev) => {
                                          const binding = { ...(selectedElement.cmsBinding || { fieldName: "name", index: 0 }), collectionId: colId };
                                          findAndMutateElement(prev.flatMap(s => s.elements), selectedElementId!, { cmsBinding: binding });
                                          return prev;
                                        });
                                      }}
                                      className="w-full bg-slate-900 border border-slate-800 text-slate-300 rounded p-1 text-xs"
                                    >
                                      {cmsCollections.map((col) => (
                                        <option key={col.id} value={col.id}>{col.name}</option>
                                      ))}
                                    </select>
                                  </div>

                                  <div className="space-y-1">
                                    <label className="text-[9px] text-slate-500 font-bold block">ফিল্ড সিলেক্ট করুন</label>
                                    <select
                                      value={selectedElement.cmsBinding.fieldName}
                                      onChange={(e) => {
                                        const fName = e.target.value;
                                        commit((prev) => {
                                          const binding = { ...(selectedElement.cmsBinding || { collectionId: "", index: 0 }), fieldName: fName };
                                          findAndMutateElement(prev.flatMap(s => s.elements), selectedElementId!, { cmsBinding: binding });
                                          return prev;
                                        });
                                      }}
                                      className="w-full bg-slate-900 border border-slate-800 text-slate-300 rounded p-1 text-xs"
                                    >
                                      {(() => {
                                        const currentCol = cmsCollections.find(c => c.id === selectedElement.cmsBinding?.collectionId);
                                        const fields = currentCol?.fields || [
                                          { id: "name", label: "নাম/শিরোনাম", type: "text" },
                                          { id: "image", label: "ছবি", type: "image" },
                                          { id: "title", label: "পদবী", type: "text" },
                                          { id: "specialty", label: "বিশেষজ্ঞতা", type: "text" },
                                          { id: "fees", label: "ফি/মূল্য", type: "text" },
                                          { id: "details", label: "বিস্তারিত", type: "text" },
                                        ];
                                        return fields.map((f) => (
                                          <option key={f.id} value={f.id}>{f.label} ({f.id})</option>
                                        ));
                                      })()}
                                    </select>
                                  </div>

                                  <div className="space-y-1">
                                    <label className="text-[9px] text-slate-500 font-bold block">আইটেম ইনডেক্স (Row index, default 0)</label>
                                    <input
                                      type="number"
                                      min="0"
                                      value={selectedElement.cmsBinding.index ?? 0}
                                      onChange={(e) => {
                                        const idx = parseInt(e.target.value) || 0;
                                        commit((prev) => {
                                          const binding = { ...(selectedElement.cmsBinding || { collectionId: "", fieldName: "" }), index: idx };
                                          findAndMutateElement(prev.flatMap(s => s.elements), selectedElementId!, { cmsBinding: binding });
                                          return prev;
                                        });
                                      }}
                                      className="w-full bg-slate-900 border border-slate-800 text-slate-300 rounded p-1 text-xs font-mono"
                                    />
                                    <p className="text-[9px] text-slate-400 leading-normal">
                                      নোট: কন্টেইনার লুপের ভেতরে এটি স্বয়ংক্রিয়ভাবে ম্যাপ হয়ে যাবে।
                                    </p>
                                  </div>
                                </>
                              )}
                            </div>
                          )}
                        </div>

                        {/* Size overrides */}
                        <span className="block text-[11px] font-bold text-slate-400 uppercase tracking-wide mt-4">সাইজ ও রেডিয়াস</span>
                        <div className="grid grid-cols-2 gap-2 text-xs">
                          <div className="flex flex-col gap-1">
                            <span>প্রস্থ (Width)</span>
                            <input
                              type="text"
                              value={selectedElement.style?.width || ""}
                              onChange={(e) => updateActiveStyles({ width: e.target.value })}
                              className="w-full bg-slate-900 border border-slate-800 text-slate-300 rounded p-1"
                            />
                          </div>
                          <div className="flex flex-col gap-1">
                            <span>উচ্চতা (Height)</span>
                            <input
                              type="text"
                              value={selectedElement.style?.height || ""}
                              onChange={(e) => updateActiveStyles({ height: e.target.value })}
                              className="w-full bg-slate-900 border border-slate-800 text-slate-300 rounded p-1"
                            />
                          </div>
                        </div>

                        {/* Spacing Padding and Margin */}
                        <span className="block text-[11px] font-bold text-slate-400 uppercase tracking-wide mt-4">প্যাডিং ও মার্জিন</span>
                        <div className="grid grid-cols-2 gap-2 text-xs">
                          <div className="flex flex-col gap-1">
                            <span>প্যাডিং Y</span>
                            <input
                              type="text"
                              value={selectedElement.style?.paddingY || ""}
                              onChange={(e) => updateActiveStyles({ paddingY: e.target.value })}
                              className="w-full bg-slate-900 border border-slate-800 text-slate-300 rounded p-1"
                            />
                          </div>
                          <div className="flex flex-col gap-1">
                            <span>মার্জিন Y</span>
                            <input
                              type="text"
                              value={selectedElement.style?.marginY || ""}
                              onChange={(e) => updateActiveStyles({ marginY: e.target.value })}
                              className="w-full bg-slate-900 border border-slate-800 text-slate-300 rounded p-1"
                            />
                          </div>
                        </div>

                        {/* Color Selector */}
                        <span className="block text-[11px] font-bold text-slate-400 uppercase tracking-wide mt-4">কালার টোকেনস</span>
                        <div className="flex items-center gap-2 text-xs mb-4">
                          <span>ব্যাকগ্রাউন্ড</span>
                          <input
                            type="color"
                            value={selectedElement.style?.bg || "#ffffff"}
                            onChange={(e) => updateActiveStyles({ bg: e.target.value })}
                            className="w-8 h-8 rounded border-none bg-transparent cursor-pointer"
                          />
                        </div>

                        {/* Interactive Animation, Hover, Scroll, Presets & Lottie Settings Panel */}
                        <div className="border-t border-slate-900 pt-4 mt-4 space-y-2">
                          <span className="block text-[11px] font-black uppercase text-indigo-400 tracking-wider">🌟 মোশন ও ইন্টারঅ্যাকশনস</span>
                          
                          {/* 1. Quick Presets */}
                          <div className="bg-slate-950/40 border border-slate-900 rounded-xl overflow-hidden">
                            <button
                              onClick={() => setActivePropAccordion(activePropAccordion === "presets" ? null : "presets")}
                              className="w-full flex items-center justify-between p-3 text-left text-xs font-bold text-slate-300 hover:text-white transition-all cursor-pointer"
                            >
                              <div className="flex items-center gap-2">
                                <Zap className="w-3.5 h-3.5 text-amber-400" />
                                <span>কুইক প্রিসেটস (Presets)</span>
                              </div>
                              <ChevronDown className={`w-3.5 h-3.5 text-slate-500 transition-transform ${activePropAccordion === "presets" ? "rotate-180" : ""}`} />
                            </button>
                            {activePropAccordion === "presets" && (
                              <div className="p-3 border-t border-slate-900 bg-slate-950/80 space-y-2 text-xs">
                                <p className="text-[10px] text-slate-400 leading-normal">রেডিমেড মাইক্রো-ইন্টারঅ্যাকশন প্রিসেট প্রয়োগ করুন:</p>
                                <div className="grid grid-cols-2 gap-1.5">
                                  {["none", "hoverLift", "clickPress", "tiltShift", "magneticBounce", "heartbeat"].map((p) => (
                                    <button
                                      key={p}
                                      onClick={() => updateElementPreset(p as any)}
                                      className={`py-1.5 px-2 rounded-lg text-[10px] font-bold border transition-all text-center capitalize cursor-pointer ${
                                        selectedElement.interactionPreset === p
                                          ? "bg-indigo-600 text-white border-indigo-500"
                                          : "bg-slate-900 border-slate-800 text-slate-400 hover:bg-slate-800 hover:text-slate-200"
                                      }`}
                                    >
                                      {p === "none" ? "None" : p.replace(/([A-Z])/g, " $1")}
                                    </button>
                                  ))}
                                </div>
                              </div>
                            )}
                          </div>

                          {/* 2. Animations Engine */}
                          <div className="bg-slate-950/40 border border-slate-900 rounded-xl overflow-hidden">
                            <button
                              onClick={() => setActivePropAccordion(activePropAccordion === "animations" ? null : "animations")}
                              className="w-full flex items-center justify-between p-3 text-left text-xs font-bold text-slate-300 hover:text-white transition-all cursor-pointer"
                            >
                              <div className="flex items-center gap-2">
                                <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
                                <span>অ্যানিমেশন ইঞ্জিন (Animations)</span>
                              </div>
                              <ChevronDown className={`w-3.5 h-3.5 text-slate-500 transition-transform ${activePropAccordion === "animations" ? "rotate-180" : ""}`} />
                            </button>
                            {activePropAccordion === "animations" && (
                              <div className="p-3 border-t border-slate-900 bg-slate-950/80 space-y-3.5 text-xs">
                                <div className="flex flex-col gap-1">
                                  <span>অ্যানিমেশন টাইপ</span>
                                  <select
                                    value={selectedElement.animation?.type || "none"}
                                    onChange={(e) => updateElementAnimation({ type: e.target.value as any })}
                                    className="w-full bg-slate-900 border border-slate-800 text-slate-300 rounded p-1.5 font-bold"
                                  >
                                    {["none", "fade", "slide", "zoom", "scale", "rotate", "flip", "blur", "bounce", "reveal", "parallax", "stagger", "morph", "floating", "pulse"].map((t) => (
                                      <option key={t} value={t}>{t.toUpperCase()}</option>
                                    ))}
                                  </select>
                                </div>

                                <div className="flex flex-col gap-1">
                                  <span>অ্যানিমেশন ট্রিগার (Trigger)</span>
                                  <select
                                    value={selectedElement.animation?.trigger || "onLoad"}
                                    onChange={(e) => updateElementAnimation({ trigger: e.target.value as any })}
                                    className="w-full bg-slate-900 border border-slate-800 text-slate-300 rounded p-1.5"
                                  >
                                    <option value="onLoad">On Page Load (পেজ লোড)</option>
                                    <option value="onScroll">On Scroll (স্ক্রোল)</option>
                                    <option value="onViewport">On Viewport Enter (স্ক্রিন প্রবেশ)</option>
                                    <option value="onHover">On Hover (মাউস হোভার)</option>
                                    <option value="onClick">On Click (ক্লিক)</option>
                                    <option value="onFocus">On Focus (ইনপুট ফোকাস)</option>
                                    <option value="loop">Infinite Loop (চলমান লুপ)</option>
                                  </select>
                                </div>

                                <div className="grid grid-cols-2 gap-2">
                                  <div className="flex flex-col gap-1">
                                    <span>ডিউরেশন (সেকেন্ড)</span>
                                    <input
                                      type="number"
                                      step="0.1"
                                      min="0"
                                      value={selectedElement.animation?.duration ?? 0.6}
                                      onChange={(e) => updateElementAnimation({ duration: parseFloat(e.target.value) || 0 })}
                                      className="w-full bg-slate-900 border border-slate-800 text-slate-300 rounded p-1.5 font-mono text-center"
                                    />
                                  </div>
                                  <div className="flex flex-col gap-1">
                                    <span>ডিলে (সেকেন্ড)</span>
                                    <input
                                      type="number"
                                      step="0.1"
                                      min="0"
                                      value={selectedElement.animation?.delay ?? 0}
                                      onChange={(e) => updateElementAnimation({ delay: parseFloat(e.target.value) || 0 })}
                                      className="w-full bg-slate-900 border border-slate-800 text-slate-300 rounded p-1.5 font-mono text-center"
                                    />
                                  </div>
                                </div>

                                <div className="grid grid-cols-2 gap-2">
                                  <div className="flex flex-col gap-1">
                                    <span>ইজিং (Easing)</span>
                                    <select
                                      value={selectedElement.animation?.easing || "easeOut"}
                                      onChange={(e) => updateElementAnimation({ easing: e.target.value as any })}
                                      className="w-full bg-slate-900 border border-slate-800 text-slate-300 rounded p-1.5 text-[10px]"
                                    >
                                      <option value="linear">Linear</option>
                                      <option value="easeIn">Ease In</option>
                                      <option value="easeOut">Ease Out</option>
                                      <option value="easeInOut">Ease In Out</option>
                                      <option value="spring">Spring (স্মুথ বাউন্স)</option>
                                    </select>
                                  </div>
                                  <div className="flex flex-col gap-1">
                                    <span>রিপিট (বার)</span>
                                    <input
                                      type="number"
                                      min="-1"
                                      placeholder="-1 for infinite"
                                      value={selectedElement.animation?.repeat ?? 0}
                                      onChange={(e) => updateElementAnimation({ repeat: parseInt(e.target.value) || 0 })}
                                      className="w-full bg-slate-900 border border-slate-800 text-slate-300 rounded p-1.5 font-mono text-center"
                                    />
                                  </div>
                                </div>
                              </div>
                            )}
                          </div>

                          {/* 3. Hover Effects */}
                          <div className="bg-slate-950/40 border border-slate-900 rounded-xl overflow-hidden">
                            <button
                              onClick={() => setActivePropAccordion(activePropAccordion === "hover" ? null : "hover")}
                              className="w-full flex items-center justify-between p-3 text-left text-xs font-bold text-slate-300 hover:text-white transition-all cursor-pointer"
                            >
                              <div className="flex items-center gap-2">
                                <MousePointer className="w-3.5 h-3.5 text-emerald-400" />
                                <span>হোভার ইফেক্টস (Hover Effects)</span>
                              </div>
                              <ChevronDown className={`w-3.5 h-3.5 text-slate-500 transition-transform ${activePropAccordion === "hover" ? "rotate-180" : ""}`} />
                            </button>
                            {activePropAccordion === "hover" && (
                              <div className="p-3 border-t border-slate-900 bg-slate-950/80 space-y-3.5 text-xs">
                                <div className="grid grid-cols-2 gap-2">
                                  <div className="flex flex-col gap-1">
                                    <span>স্কেল (Scale multiplier)</span>
                                    <input
                                      type="number"
                                      step="0.01"
                                      min="0.5"
                                      max="2"
                                      value={selectedElement.hoverEffect?.scale ?? 1}
                                      onChange={(e) => updateElementHoverEffect({ scale: parseFloat(e.target.value) || 1 })}
                                      className="w-full bg-slate-900 border border-slate-800 text-slate-300 rounded p-1.5 font-mono text-center"
                                    />
                                  </div>
                                  <div className="flex flex-col gap-1">
                                    <span>ঘূর্ণন (Rotation Deg)</span>
                                    <input
                                      type="number"
                                      min="-360"
                                      max="360"
                                      value={selectedElement.hoverEffect?.rotate ?? 0}
                                      onChange={(e) => updateElementHoverEffect({ rotate: parseInt(e.target.value) || 0 })}
                                      className="w-full bg-slate-900 border border-slate-800 text-slate-300 rounded p-1.5 font-mono text-center"
                                    />
                                  </div>
                                </div>

                                <div className="grid grid-cols-2 gap-2">
                                  <div className="flex flex-col gap-1">
                                    <span>অপাসিটি (Opacity 0-1)</span>
                                    <input
                                      type="number"
                                      step="0.1"
                                      min="0"
                                      max="1"
                                      value={selectedElement.hoverEffect?.opacity ?? 1}
                                      onChange={(e) => updateElementHoverEffect({ opacity: parseFloat(e.target.value) || 1 })}
                                      className="w-full bg-slate-900 border border-slate-800 text-slate-300 rounded p-1.5 font-mono text-center"
                                    />
                                  </div>
                                  <div className="flex flex-col gap-1">
                                    <span>কার্সার স্টাইল (Cursor)</span>
                                    <select
                                      value={selectedElement.hoverEffect?.cursor || "default"}
                                      onChange={(e) => updateElementHoverEffect({ cursor: e.target.value as any })}
                                      className="w-full bg-slate-900 border border-slate-800 text-slate-300 rounded p-1.5 text-[10px]"
                                    >
                                      <option value="default">Default</option>
                                      <option value="pointer">Pointer (লিঙ্ক হাত)</option>
                                      <option value="grab">Grab (হাত ধরা)</option>
                                      <option value="zoom-in">Zoom In</option>
                                    </select>
                                  </div>
                                </div>

                                <div className="grid grid-cols-2 gap-2">
                                  <div className="flex flex-col gap-1">
                                    <span>হোভার ব্যাকগ্রাউন্ড</span>
                                    <input
                                      type="color"
                                      value={selectedElement.hoverEffect?.bg || "#ffffff"}
                                      onChange={(e) => updateElementHoverEffect({ bg: e.target.value })}
                                      className="w-full h-8 bg-slate-900 border border-slate-800 text-slate-300 rounded cursor-pointer"
                                    />
                                  </div>
                                  <div className="flex flex-col gap-1">
                                    <span>হোভার টেক্সট কালার</span>
                                    <input
                                      type="color"
                                      value={selectedElement.hoverEffect?.color || "#000000"}
                                      onChange={(e) => updateElementHoverEffect({ color: e.target.value })}
                                      className="w-full h-8 bg-slate-900 border border-slate-800 text-slate-300 rounded cursor-pointer"
                                    />
                                  </div>
                                </div>

                                <div className="grid grid-cols-2 gap-2">
                                  <div className="flex flex-col gap-1">
                                    <span>শ্যাডো (Shadow)</span>
                                    <select
                                      value={selectedElement.hoverEffect?.shadow || "none"}
                                      onChange={(e) => updateElementHoverEffect({ shadow: e.target.value as any })}
                                      className="w-full bg-slate-900 border border-slate-800 text-slate-300 rounded p-1.5 text-[10px]"
                                    >
                                      <option value="none">None</option>
                                      <option value="subtle">Subtle (হালকা)</option>
                                      <option value="medium">Medium</option>
                                      <option value="intense">Intense (গাঢ়)</option>
                                    </select>
                                  </div>
                                  <div className="flex flex-col gap-1">
                                    <span>ট্রানজিশন ডিউরেশন</span>
                                    <input
                                      type="number"
                                      step="0.05"
                                      min="0.05"
                                      value={selectedElement.hoverEffect?.transitionDuration ?? 0.3}
                                      onChange={(e) => updateElementHoverEffect({ transitionDuration: parseFloat(e.target.value) || 0.3 })}
                                      className="w-full bg-slate-900 border border-slate-800 text-slate-300 rounded p-1.5 font-mono text-center"
                                    />
                                  </div>
                                </div>
                              </div>
                            )}
                          </div>

                          {/* 4. Scroll & Parallax Effects */}
                          <div className="bg-slate-950/40 border border-slate-900 rounded-xl overflow-hidden">
                            <button
                              onClick={() => setActivePropAccordion(activePropAccordion === "scroll" ? null : "scroll")}
                              className="w-full flex items-center justify-between p-3 text-left text-xs font-bold text-slate-300 hover:text-white transition-all cursor-pointer"
                            >
                              <div className="flex items-center gap-2">
                                <Layers className="w-3.5 h-3.5 text-pink-400" />
                                <span>স্ক্রোল ও প্যারালাক্স (Scroll & Sticky)</span>
                              </div>
                              <ChevronDown className={`w-3.5 h-3.5 text-slate-500 transition-transform ${activePropAccordion === "scroll" ? "rotate-180" : ""}`} />
                            </button>
                            {activePropAccordion === "scroll" && (
                              <div className="p-3 border-t border-slate-900 bg-slate-950/80 space-y-3 text-xs">
                                <div className="flex items-center gap-2">
                                  <input
                                    type="checkbox"
                                    id="parallaxCheck"
                                    checked={selectedElement.scrollEffect?.parallax ?? false}
                                    onChange={(e) => updateElementScrollEffect({ parallax: e.target.checked })}
                                    className="rounded border-slate-800 bg-slate-900 text-indigo-600 focus:ring-0 cursor-pointer"
                                  />
                                  <label htmlFor="parallaxCheck" className="cursor-pointer">প্যারালাক্স মোশন চালু করুন</label>
                                </div>

                                {selectedElement.scrollEffect?.parallax && (
                                  <div className="flex flex-col gap-1">
                                    <div className="flex justify-between text-[10px] text-slate-400">
                                      <span>প্যারালাক্স স্পিড</span>
                                      <span>{selectedElement.scrollEffect?.parallaxSpeed ?? 2}px</span>
                                    </div>
                                    <input
                                      type="range"
                                      min="-10"
                                      max="10"
                                      step="1"
                                      value={selectedElement.scrollEffect?.parallaxSpeed ?? 2}
                                      onChange={(e) => updateElementScrollEffect({ parallaxSpeed: parseInt(e.target.value) })}
                                      className="w-full accent-indigo-500"
                                    />
                                  </div>
                                )}

                                <div className="border-t border-slate-900/60 pt-3 flex items-center gap-2">
                                  <input
                                    type="checkbox"
                                    id="stickyCheck"
                                    checked={selectedElement.scrollEffect?.sticky ?? false}
                                    onChange={(e) => updateElementScrollEffect({ sticky: e.target.checked })}
                                    className="rounded border-slate-800 bg-slate-900 text-indigo-600 focus:ring-0 cursor-pointer"
                                  />
                                  <label htmlFor="stickyCheck" className="cursor-pointer">স্টিকি পজিশন চালু করুন</label>
                                </div>

                                {selectedElement.scrollEffect?.sticky && (
                                  <div className="flex flex-col gap-1">
                                    <span>টপ অফসেট (Sticky Top Offset)</span>
                                    <input
                                      type="text"
                                      placeholder="e.g. 20px, 10%"
                                      value={selectedElement.scrollEffect?.stickyTop || "0px"}
                                      onChange={(e) => updateElementScrollEffect({ stickyTop: e.target.value })}
                                      className="w-full bg-slate-900 border border-slate-800 text-slate-300 rounded p-1.5 font-mono text-center"
                                    />
                                  </div>
                                )}
                              </div>
                            )}
                          </div>

                          {/* 5. Background Video Config */}
                          <div className="bg-slate-950/40 border border-slate-900 rounded-xl overflow-hidden">
                            <button
                              onClick={() => setActivePropAccordion(activePropAccordion === "videoBg" ? null : "videoBg")}
                              className="w-full flex items-center justify-between p-3 text-left text-xs font-bold text-slate-300 hover:text-white transition-all cursor-pointer"
                            >
                              <div className="flex items-center gap-2">
                                <VideoIcon className="w-3.5 h-3.5 text-red-400" />
                                <span>ব্যাকগ্রাউন্ড ভিডিও (Video Background)</span>
                              </div>
                              <ChevronDown className={`w-3.5 h-3.5 text-slate-500 transition-transform ${activePropAccordion === "videoBg" ? "rotate-180" : ""}`} />
                            </button>
                            {activePropAccordion === "videoBg" && (
                              <div className="p-3 border-t border-slate-900 bg-slate-950/80 space-y-3 text-xs">
                                <div className="flex items-center gap-2">
                                  <input
                                    type="checkbox"
                                    id="videoBgEnable"
                                    checked={selectedElement.videoBg?.enabled ?? false}
                                    onChange={(e) => updateElementVideoBg({ enabled: e.target.checked })}
                                    className="rounded border-slate-800 bg-slate-900 text-indigo-600 focus:ring-0 cursor-pointer"
                                  />
                                  <label htmlFor="videoBgEnable" className="cursor-pointer">ব্যাকগ্রাউন্ড ভিডিও সক্রিয় করুন</label>
                                </div>

                                {selectedElement.videoBg?.enabled && (
                                  <>
                                    <div className="flex flex-col gap-1">
                                      <span>ভিডিও URL (.mp4 বা ইউটিউব লিংক)</span>
                                      <input
                                        type="text"
                                        placeholder="https://example.com/video.mp4"
                                        value={selectedElement.videoBg?.videoUrl || ""}
                                        onChange={(e) => updateElementVideoBg({ videoUrl: e.target.value })}
                                        className="w-full bg-slate-900 border border-slate-800 text-slate-300 rounded p-1.5 font-mono text-xs"
                                      />
                                    </div>

                                    <div className="grid grid-cols-2 gap-2">
                                      <div className="flex flex-col gap-1">
                                        <span>ব্লার রেডিয়াস</span>
                                        <input
                                          type="text"
                                          placeholder="0px, 4px, etc."
                                          value={selectedElement.videoBg?.blur || "0px"}
                                          onChange={(e) => updateElementVideoBg({ blur: e.target.value })}
                                          className="w-full bg-slate-900 border border-slate-800 text-slate-300 rounded p-1.5 font-mono text-center text-xs"
                                        />
                                      </div>
                                      <div className="flex flex-col gap-1">
                                        <span>ভিডিও অপাসিটি</span>
                                        <input
                                          type="number"
                                          step="0.05"
                                          min="0"
                                          max="1"
                                          value={selectedElement.videoBg?.overlayOpacity ?? 0.4}
                                          onChange={(e) => updateElementVideoBg({ overlayOpacity: parseFloat(e.target.value) || 0 })}
                                          className="w-full bg-slate-900 border border-slate-800 text-slate-300 rounded p-1.5 font-mono text-center text-xs"
                                        />
                                      </div>
                                    </div>

                                    <div className="flex flex-col gap-1">
                                      <span>ওভারলে কালার ফিল্টার</span>
                                      <input
                                        type="color"
                                        value={selectedElement.videoBg?.overlayColor || "#000000"}
                                        onChange={(e) => updateElementVideoBg({ overlayColor: e.target.value })}
                                        className="w-full h-8 bg-slate-900 border border-slate-800 rounded cursor-pointer"
                                      />
                                    </div>
                                  </>
                                )}
                              </div>
                            )}
                          </div>

                          {/* 6. Lottie Settings (Only if element.kind === "lottie") */}
                          {selectedElement.kind === "lottie" && (
                            <div className="bg-indigo-950/40 border border-indigo-900 rounded-xl overflow-hidden">
                              <button
                                onClick={() => setActivePropAccordion(activePropAccordion === "lottie" ? null : "lottie")}
                                className="w-full flex items-center justify-between p-3 text-left text-xs font-bold text-indigo-300 hover:text-white transition-all cursor-pointer"
                              >
                                <div className="flex items-center gap-2">
                                  <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
                                  <span>লোটি এনিমেশন কাস্টমাইজেশন</span>
                                </div>
                                <ChevronDown className={`w-3.5 h-3.5 text-indigo-400 transition-transform ${activePropAccordion === "lottie" ? "rotate-180" : ""}`} />
                              </button>
                              {activePropAccordion === "lottie" && (
                                <div className="p-3 border-t border-indigo-900 bg-slate-950/90 space-y-3.5 text-xs">
                                  <div className="flex flex-col gap-1">
                                    <span>লোটি JSON URL (Lottie JSON)</span>
                                    <input
                                      type="text"
                                      placeholder="https://assets2.lottiefiles.com/...json"
                                      value={selectedElement.lottie?.jsonContent || ""}
                                      onChange={(e) => updateElementLottie({ jsonContent: e.target.value })}
                                      className="w-full bg-slate-900 border border-slate-800 text-slate-300 rounded p-1.5 font-mono text-[10px]"
                                    />
                                    <p className="text-[9px] text-slate-500 leading-normal mt-1">Lottiefiles ওয়েবসাইট থেকে সরাসরি JSON লিংক নিয়ে এখানে বসান।</p>
                                  </div>

                                  <div className="grid grid-cols-2 gap-2 text-[10px]">
                                    <div className="flex items-center gap-1.5">
                                      <input
                                        type="checkbox"
                                        id="lottieLoop"
                                        checked={selectedElement.lottie?.loop ?? true}
                                        onChange={(e) => updateElementLottie({ loop: e.target.checked })}
                                        className="rounded border-slate-800 bg-slate-900 text-indigo-600 focus:ring-0 cursor-pointer"
                                      />
                                      <label htmlFor="lottieLoop" className="cursor-pointer">অনন্ত লুপ (Loop)</label>
                                    </div>
                                    <div className="flex items-center gap-1.5">
                                      <input
                                        type="checkbox"
                                        id="lottieAutoplay"
                                        checked={selectedElement.lottie?.autoplay ?? true}
                                        onChange={(e) => updateElementLottie({ autoplay: e.target.checked })}
                                        className="rounded border-slate-800 bg-slate-900 text-indigo-600 focus:ring-0 cursor-pointer"
                                      />
                                      <label htmlFor="lottieAutoplay" className="cursor-pointer">স্বয়ংক্রিয় প্লে</label>
                                    </div>
                                  </div>

                                  <div className="flex flex-col gap-1">
                                    <span>লোটি প্লেব্যাক স্পিড</span>
                                    <select
                                      value={selectedElement.lottie?.speed ?? 1}
                                      onChange={(e) => updateElementLottie({ speed: parseFloat(e.target.value) || 1 })}
                                      className="w-full bg-slate-900 border border-slate-800 text-slate-300 rounded p-1.5 text-xs"
                                    >
                                      <option value="0.5">0.5x (ধীরগতির)</option>
                                      <option value="1">1.0x (স্বাভাবিক)</option>
                                      <option value="1.5">1.5x (দ্রুতগতি)</option>
                                      <option value="2">2.0x (অত্যন্ত দ্রুত)</option>
                                    </select>
                                  </div>

                                  <div className="flex flex-col gap-1">
                                    <span>ইন্টারঅ্যাকশন ট্রিগার</span>
                                    <select
                                      value={selectedElement.lottie?.trigger || "onLoad"}
                                      onChange={(e) => updateElementLottie({ trigger: e.target.value as any })}
                                      className="w-full bg-slate-900 border border-slate-800 text-slate-300 rounded p-1.5 text-xs"
                                    >
                                      <option value="onLoad">পেজ লোড এ প্লে করুন (Autoplay)</option>
                                      <option value="onHover">হোভার করলে প্লে করুন (Hover Play)</option>
                                      <option value="onClick">ক্লিক করলে প্লে করুন (Click Play)</option>
                                      <option value="onScroll">স্ক্রোল প্রগ্রেসের সাথে ফ্রেম আপডেট</option>
                                    </select>
                                  </div>
                                </div>
                              )}
                            </div>
                          )}
                        </div>

                        {/* Active Element CRO Optimization Copilot */}
                        <div className="border-t border-slate-900 pt-4 mt-6 space-y-3">
                          <div className="flex items-center gap-1.5 text-xs font-black uppercase text-indigo-400">
                            <Sparkles className="w-4 h-4 text-indigo-400 animate-pulse" />
                            <span>এআই অপ্টিমাইজেশন কো-পাইলট</span>
                          </div>
                          <p className="text-[10px] text-slate-400 leading-relaxed">
                            কনভার্সন রেট, ভিজ্যুয়াল ডিজাইন ও এসইও বৃদ্ধি করার জন্য ৩টি কাস্টম সাজেশন জেনারেট করুন।
                          </p>
                          
                          <button
                            onClick={handleFetchCopilotSuggestions}
                            disabled={isCopilotLoading}
                            className="w-full py-1.5 bg-indigo-950/60 border border-indigo-800 hover:border-indigo-500 text-indigo-300 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-1 cursor-pointer"
                          >
                            {isCopilotLoading ? (
                              <>
                                <Loader2 className="w-3.5 h-3.5 animate-spin" />
                                আইডিয়া খোঁজা হচ্ছে...
                              </>
                            ) : (
                              <>
                                <Wand2 className="w-3.5 h-3.5" />
                                অপ্টিমাইজেশন আইডিয়া খুঁজুন
                              </>
                            )}
                          </button>

                          {copilotSuggestions.length > 0 && (
                            <div className="space-y-2 mt-2 max-h-60 overflow-y-auto pr-1">
                              {copilotSuggestions.map((s, idx) => (
                                <div key={idx} className="p-2.5 bg-slate-900 border border-slate-850 rounded-lg text-xs space-y-1.5">
                                  <div className="font-extrabold text-indigo-300">{s.title}</div>
                                  <div className="text-[10px] text-slate-400 leading-normal">{s.description}</div>
                                  <button
                                    onClick={() => applyCopilotSuggestion(s.patch)}
                                    className="w-full py-1 bg-indigo-600 hover:bg-indigo-500 text-white rounded text-[10px] font-black cursor-pointer transition-all"
                                  >
                                    প্রয়োগ করুন ✨
                                  </button>
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  ) : selectedSection ? (
                    <div>
                      <div className="border-b border-slate-900 pb-2 mb-4">
                        <span className="text-xs font-black uppercase text-slate-300">সেকশন স্টাইল</span>
                      </div>
                      <div className="space-y-3.5 text-xs">
                        <div className="flex flex-col gap-1">
                          <span>সেকশন নাম</span>
                          <input
                            type="text"
                            value={selectedSection.name}
                            onChange={(e) => {
                              commit((prev) => prev.map(s => s.instanceId === selectedSectionId ? { ...s, name: e.target.value } : s));
                            }}
                            className="w-full bg-slate-900 border border-slate-800 text-slate-300 rounded p-1.5"
                          />
                        </div>
                        <div className="flex flex-col gap-1">
                          <span>প্যাডিং Y</span>
                          <input
                            type="text"
                            value={selectedSection.style?.paddingY || ""}
                            onChange={(e) => {
                              commit((prev) => prev.map(s => s.instanceId === selectedSectionId ? { ...s, style: { ...s.style, paddingY: e.target.value } } : s));
                            }}
                            className="w-full bg-slate-900 border border-slate-800 text-slate-300 rounded p-1.5"
                          />
                        </div>
                        <div className="flex items-center gap-2">
                          <span>ব্যাকগ্রাউন্ড কালার</span>
                          <input
                            type="color"
                            value={selectedSection.style?.bg || "#ffffff"}
                            onChange={(e) => {
                              commit((prev) => prev.map(s => s.instanceId === selectedSectionId ? { ...s, style: { ...s.style, bg: e.target.value } } : s));
                            }}
                            className="w-8 h-8 rounded border-none cursor-pointer"
                          />
                        </div>

                        {/* Section Motion and Video Background Controls */}
                        <div className="border-t border-slate-900 pt-4 mt-4 space-y-2">
                          <span className="block text-[11px] font-black uppercase text-indigo-400 tracking-wider">🌟 সেকশন মোশন ও ব্যাকগ্রাউন্ড</span>

                          {/* 1. Section Animations */}
                          <div className="bg-slate-950/40 border border-slate-900 rounded-xl overflow-hidden">
                            <button
                              onClick={() => setActivePropAccordion(activePropAccordion === "sec_anim" ? null : "sec_anim")}
                              className="w-full flex items-center justify-between p-3 text-left text-xs font-bold text-slate-300 hover:text-white transition-all cursor-pointer"
                            >
                              <div className="flex items-center gap-2">
                                <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
                                <span>সেকশন এন্ট্রান্স অ্যানিমেশন</span>
                              </div>
                              <ChevronDown className={`w-3.5 h-3.5 text-slate-500 transition-transform ${activePropAccordion === "sec_anim" ? "rotate-180" : ""}`} />
                            </button>
                            {activePropAccordion === "sec_anim" && (
                              <div className="p-3 border-t border-slate-900 bg-slate-950/80 space-y-3 text-xs">
                                <div className="flex flex-col gap-1">
                                  <span>অ্যানিমেশন টাইপ</span>
                                  <select
                                    value={selectedSection.animation?.type || "none"}
                                    onChange={(e) => updateSectionAnimation(selectedSectionId!, { type: e.target.value as any })}
                                    className="w-full bg-slate-900 border border-slate-800 text-slate-300 rounded p-1.5 font-bold"
                                  >
                                    {["none", "fade", "slide", "zoom", "scale", "rotate", "flip", "blur", "reveal", "parallax"].map((t) => (
                                      <option key={t} value={t}>{t.toUpperCase()}</option>
                                    ))}
                                  </select>
                                </div>

                                <div className="grid grid-cols-2 gap-2">
                                  <div className="flex flex-col gap-1">
                                    <span>ডিউরেশন (সেকেন্ড)</span>
                                    <input
                                      type="number"
                                      step="0.1"
                                      min="0.1"
                                      value={selectedSection.animation?.duration ?? 0.8}
                                      onChange={(e) => updateSectionAnimation(selectedSectionId!, { duration: parseFloat(e.target.value) || 0.8 })}
                                      className="w-full bg-slate-900 border border-slate-800 text-slate-300 rounded p-1.5 font-mono text-center text-xs"
                                    />
                                  </div>
                                  <div className="flex flex-col gap-1">
                                    <span>ডিলে (সেকেন্ড)</span>
                                    <input
                                      type="number"
                                      step="0.1"
                                      min="0"
                                      value={selectedSection.animation?.delay ?? 0}
                                      onChange={(e) => updateSectionAnimation(selectedSectionId!, { delay: parseFloat(e.target.value) || 0 })}
                                      className="w-full bg-slate-900 border border-slate-800 text-slate-300 rounded p-1.5 font-mono text-center text-xs"
                                    />
                                  </div>
                                </div>
                              </div>
                            )}
                          </div>

                          {/* 2. Section Video Background */}
                          <div className="bg-slate-950/40 border border-slate-900 rounded-xl overflow-hidden">
                            <button
                              onClick={() => setActivePropAccordion(activePropAccordion === "sec_video" ? null : "sec_video")}
                              className="w-full flex items-center justify-between p-3 text-left text-xs font-bold text-slate-300 hover:text-white transition-all cursor-pointer"
                            >
                              <div className="flex items-center gap-2">
                                <VideoIcon className="w-3.5 h-3.5 text-red-400" />
                                <span>সেকশন ভিডিও ব্যাকগ্রাউন্ড</span>
                              </div>
                              <ChevronDown className={`w-3.5 h-3.5 text-slate-500 transition-transform ${activePropAccordion === "sec_video" ? "rotate-180" : ""}`} />
                            </button>
                            {activePropAccordion === "sec_video" && (
                              <div className="p-3 border-t border-slate-900 bg-slate-950/80 space-y-3 text-xs">
                                <div className="flex items-center gap-2">
                                  <input
                                    type="checkbox"
                                    id="secVideoBgEnable"
                                    checked={selectedSection.videoBg?.enabled ?? false}
                                    onChange={(e) => updateSectionVideoBg(selectedSectionId!, { enabled: e.target.checked })}
                                    className="rounded border-slate-800 bg-slate-900 text-indigo-600 focus:ring-0 cursor-pointer"
                                  />
                                  <label htmlFor="secVideoBgEnable" className="cursor-pointer">ব্যাকগ্রাউন্ড ভিডিও সক্রিয় করুন</label>
                                </div>

                                {selectedSection.videoBg?.enabled && (
                                  <>
                                    <div className="flex flex-col gap-1">
                                      <span>ভিডিও URL (.mp4 বা ইউটিউব লিংক)</span>
                                      <input
                                        type="text"
                                        placeholder="https://example.com/video.mp4"
                                        value={selectedSection.videoBg?.videoUrl || ""}
                                        onChange={(e) => updateSectionVideoBg(selectedSectionId!, { videoUrl: e.target.value })}
                                        className="w-full bg-slate-900 border border-slate-800 text-slate-300 rounded p-1.5 font-mono text-xs"
                                      />
                                    </div>

                                    <div className="grid grid-cols-2 gap-2">
                                      <div className="flex flex-col gap-1">
                                        <span>ব্লার রেডিয়াস</span>
                                        <input
                                          type="text"
                                          placeholder="0px, 4px, etc."
                                          value={selectedSection.videoBg?.blur || "0px"}
                                          onChange={(e) => updateSectionVideoBg(selectedSectionId!, { blur: e.target.value })}
                                          className="w-full bg-slate-900 border border-slate-800 text-slate-300 rounded p-1.5 font-mono text-center text-xs"
                                        />
                                      </div>
                                      <div className="flex flex-col gap-1">
                                        <span>ভিডিও অপাসিটি</span>
                                        <input
                                          type="number"
                                          step="0.05"
                                          min="0"
                                          max="1"
                                          value={selectedSection.videoBg?.overlayOpacity ?? 0.4}
                                          onChange={(e) => updateSectionVideoBg(selectedSectionId!, { overlayOpacity: parseFloat(e.target.value) || 0 })}
                                          className="w-full bg-slate-900 border border-slate-800 text-slate-300 rounded p-1.5 font-mono text-center text-xs"
                                        />
                                      </div>
                                    </div>

                                    <div className="flex flex-col gap-1">
                                      <span>ওভারলে কালার ফিল্টার</span>
                                      <input
                                        type="color"
                                        value={selectedSection.videoBg?.overlayColor || "#000000"}
                                        onChange={(e) => updateSectionVideoBg(selectedSectionId!, { overlayColor: e.target.value })}
                                        className="w-full h-8 bg-slate-900 border border-slate-800 rounded cursor-pointer"
                                      />
                                    </div>
                                  </>
                                )}
                              </div>
                            )}
                          </div>
                        </div>

                        {/* Section Level AI Editing Prompt */}
                        <div className="border-t border-slate-900 pt-4 mt-6 space-y-3">
                          <span className="block text-[11px] font-black uppercase text-indigo-400">✨ এআই সেকশন রিডিজাইনার</span>
                          <p className="text-[10px] text-slate-400 leading-relaxed">
                            এই সেকশনটিকে এআই দিয়ে পরিবর্তন করুন। যেমন: "২টি কলাম বিশিষ্ট ডার্ক কার্ড লেআউটে সাজাও" বা "টেক্সটগুলো পরিবর্তন করে আকর্ষণীয় কপি লেখো"।
                          </p>
                          <textarea
                            value={sectionAiPrompt}
                            onChange={(e) => setSectionAiPrompt(e.target.value)}
                            placeholder="সেকশনে কী পরিবর্তন করতে চান বলুন..."
                            className="w-full h-16 bg-slate-900 border border-slate-800 text-slate-200 rounded-lg p-2 text-xs focus:outline-none focus:ring-1 focus:ring-indigo-500"
                          />
                          <button
                            onClick={() => handleEditSectionWithAi(selectedSection.instanceId)}
                            disabled={isEditingSectionWithAi || !sectionAiPrompt.trim()}
                            className="w-full py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-xs font-black transition-all flex items-center justify-center gap-1 cursor-pointer"
                          >
                            {isEditingSectionWithAi ? (
                              <>
                                <Loader2 className="w-3.5 h-3.5 animate-spin" />
                                রিডিজাইন হচ্ছে...
                              </>
                            ) : (
                              <>
                                <Sparkles className="w-3.5 h-3.5" />
                                সেকশন কাস্টমাইজ করুন
                              </>
                            )}
                          </button>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="text-xs text-slate-500 text-center py-12">
                      এডিটিং শুরু করতে ক্যানভাস বা ন্যাভিগেটর থেকে যেকোনো উপাদান সিলেক্ট করুন।
                    </div>
                  )}
                </div>
              )}

              {/* BLOCK LIBRARY */}
              {rightTab === "library" && (
                <div className="space-y-4">
                  <div className="text-[10px] font-black uppercase tracking-wider text-slate-500 mb-2">লেআউট ব্লক লাইব্রেরি</div>
                  <div className="flex flex-col gap-2">
                    {SECTION_TEMPLATES.map((t) => (
                      <div
                        key={t.id}
                        onClick={() => insertSection(t.id, sections.length)}
                        className="p-3.5 bg-slate-900 border border-slate-850 hover:border-indigo-500 rounded-xl cursor-pointer transition-all flex items-center gap-3 group"
                      >
                        <div className="w-8 h-8 rounded-lg bg-indigo-600/25 flex items-center justify-center text-indigo-400 group-hover:bg-indigo-600 group-hover:text-white transition-all">
                          <Layout className="w-4 h-4" />
                        </div>
                        <div className="min-w-0">
                          <span className="block text-xs font-bold text-slate-200 group-hover:text-white">{t.name}</span>
                          <span className="block text-[9px] text-slate-500 truncate mt-0.5">{t.description}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* AI CO-PILOT GENERATOR */}
              {rightTab === "ai" && (
                <div className="space-y-4">
                  {isAiThinking ? (
                    <div className="space-y-4 p-4 bg-slate-900/50 border border-slate-800 rounded-2xl">
                      <div className="flex items-center gap-2 border-b border-slate-800 pb-3 mb-2">
                        <Loader2 className="w-4 h-4 text-indigo-400 animate-spin" />
                        <span className="text-xs font-black uppercase text-indigo-300 tracking-wider">এআই থিংকিং প্রসেস লাইভ...</span>
                      </div>
                      
                      <div className="space-y-3">
                        {aiThinkingSteps.map((s) => (
                          <div key={s.step} className="flex items-start gap-2.5 text-xs transition-all duration-350">
                            <div className="mt-0.5">
                              {s.done ? (
                                <div className="w-4 h-4 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold text-[9px]">✓</div>
                              ) : s.active ? (
                                <div className="w-4 h-4 rounded-full border-2 border-indigo-500 border-t-transparent animate-spin" />
                              ) : (
                                <div className="w-4 h-4 rounded-full bg-slate-800 text-slate-500 flex items-center justify-center text-[9px] font-bold">{s.step}</div>
                              )}
                            </div>
                            <span className={`${s.active ? "text-indigo-300 font-extrabold" : s.done ? "text-slate-400 font-medium" : "text-slate-600"} transition-colors`}>
                              {s.label}
                            </span>
                          </div>
                        ))}
                      </div>

                      <div className="pt-2 text-[10px] text-slate-500 text-center animate-pulse leading-normal">
                        Gemini LLM আপনার ব্র্যান্ডের জন্য ইউনিক ইউজার জার্নি ও কাস্টম লেআউট আর্কিটেকচার পরিকল্পনা করছে।
                      </div>
                    </div>
                  ) : (
                    <>
                      <div className="p-3.5 bg-indigo-950/40 border border-indigo-900/50 rounded-xl flex gap-2">
                        <Sparkles className="w-4 h-4 text-indigo-400 shrink-0 mt-0.5" />
                        <div className="text-[10.5px] text-indigo-300 leading-normal">
                          আপনার কল্পনার ওয়েব পেজ বা সেকশনের বিবরণ বাংলা বা ইংরেজিতে লিখুন। এআই নিমেষেই কাস্টম লেআউট এবং উইজেটস সাজিয়ে দেবে।
                        </div>
                      </div>

                      <div className="flex flex-col gap-2">
                        <textarea
                          placeholder="যেমন: ৩ কলাম বিশিষ্ট একটি ফিচার গ্রিড যেখানে বাচ্চাদের স্পিচ থেরাপির গুরুত্ব আলোচনা করা হয়েছে..."
                          value={aiPrompt}
                          onChange={(e) => setAiPrompt(e.target.value)}
                          className="w-full h-24 bg-slate-900 border border-slate-800 text-slate-200 rounded-xl p-3 text-xs focus:outline-none focus:ring-1 focus:ring-indigo-500 leading-relaxed"
                        />
                        <button
                          onClick={handleAiGenerate}
                          disabled={isAiThinking || !aiPrompt.trim()}
                          className="w-full py-2.5 bg-gradient-to-r from-indigo-600 to-fuchsia-600 hover:from-indigo-500 hover:to-fuchsia-500 text-white rounded-xl text-xs font-extrabold cursor-pointer transition-all flex items-center justify-center gap-1.5 shadow"
                        >
                          <Wand2 className="w-3.5 h-3.5" />
                          ডিজাইন জেনারেট করুন
                        </button>
                      </div>

                      {/* AI Branding diagnostic insights */}
                      {aiThinkingResult && (
                        <div className="mt-4 p-3.5 bg-slate-900/40 border border-slate-850 rounded-2xl space-y-3">
                          <div className="flex items-center gap-1.5 text-xs font-black uppercase text-indigo-400 border-b border-slate-850 pb-2">
                            <Sparkles className="w-3.5 h-3.5" />
                            <span>এআই ব্র্যান্ড স্ট্রাটেজি ডায়াগনোসিস</span>
                          </div>

                          <div className="space-y-2.5 text-[11px] leading-relaxed">
                            {aiThinkingResult.businessType && (
                              <div>
                                <span className="block font-extrabold text-slate-300">ব্যবসায়ের ধরণ (Business Intent)</span>
                                <span className="text-slate-400">{aiThinkingResult.businessType}</span>
                              </div>
                            )}
                            {aiThinkingResult.targetAudience && (
                              <div>
                                <span className="block font-extrabold text-slate-300">টার্গেট অডিয়েন্স (Target Audience)</span>
                                <span className="text-slate-400">{aiThinkingResult.targetAudience}</span>
                              </div>
                            )}
                            {aiThinkingResult.toneOfVoice && (
                              <div>
                                <span className="block font-extrabold text-slate-300">কথাবলার ধরণ (Tone of Voice)</span>
                                <span className="text-slate-400">{aiThinkingResult.toneOfVoice}</span>
                              </div>
                            )}
                            {aiThinkingResult.brandStrategy && (
                              <div>
                                <span className="block font-extrabold text-slate-300">ব্র্যান্ডিং কৌশল (Brand Strategy)</span>
                                <span className="text-slate-400">{aiThinkingResult.brandStrategy}</span>
                              </div>
                            )}
                            {aiThinkingResult.colorsSelectedExplanation && (
                              <div>
                                <span className="block font-extrabold text-slate-300">কালার প্যালেট ডিজাইন ব্যাখ্যা</span>
                                <span className="text-slate-400">{aiThinkingResult.colorsSelectedExplanation}</span>
                              </div>
                            )}
                          </div>
                        </div>
                      )}

                      {aiSuggestions.length > 0 && (
                        <div className="mt-4 space-y-2 border-t border-slate-900 pt-4">
                          <span className="block text-[10px] font-black uppercase tracking-wider text-emerald-400 mb-1">এআই জেনারেটেড লেআউটস</span>
                          {aiSuggestions.map((t) => (
                            <div
                              key={t.id}
                              onClick={() => {
                                commit((prev) => [...prev, { ...t.build(), instanceId: uid("sec") }]);
                                triggerToast?.("এআই সেকশন পেজে যোগ করা হয়েছে!");
                              }}
                              className="p-3 bg-emerald-950/20 border border-emerald-900/40 hover:border-emerald-500 rounded-xl cursor-pointer flex justify-between items-center text-xs font-bold text-slate-300 transition-all"
                            >
                              <span>✨ {t.name}</span>
                              <span className="text-[10px] text-emerald-500 font-mono">যোগ করুন +</span>
                            </div>
                          ))}
                          <button
                            onClick={applyAllAiSuggestions}
                            className="w-full py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs rounded-lg mt-2 cursor-pointer transition-all shadow"
                          >
                            সবগুলো সেকশন যোগ করুন
                          </button>
                        </div>
                      )}
                    </>
                  )}
                </div>
              )}

            </div>
          </aside>
        )}

      </div>

      {/* 5. BOTTOM BAR / HISTORIC TIMELINE */}
      <footer className="px-6 py-2 bg-slate-950 border-t border-slate-900 flex items-center justify-between z-50 text-[10px] font-bold text-slate-500 select-none">
        <div className="flex items-center gap-2">
          <span>স্থিতি:</span>
          <span className="text-emerald-400 font-extrabold">{autosaveStatus}</span>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => setZoomLevel((z) => Math.max(z - 10, 50))}
            className="p-1 hover:text-white cursor-pointer"
          >
            ➖
          </button>
          <span>জুম: {zoomLevel}%</span>
          <button
            onClick={() => setZoomLevel((z) => Math.min(z + 10, 150))}
            className="p-1 hover:text-white cursor-pointer"
          >
            ➕
          </button>
        </div>
      </footer>

    </div>
  );
}

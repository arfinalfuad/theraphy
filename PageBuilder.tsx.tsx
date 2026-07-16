import React, { useState, useRef, useCallback, useEffect } from "react";
import {
  Sparkles,
  Wand2,
  Plus,
  Trash2,
  GripVertical,
  Eye,
  EyeOff,
  Type,
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
} from "lucide-react";

/* ============================================================================
   TYPES — self-contained data model. Doesn't depend on any other file, so it
   can be dropped straight into src/components/PageBuilder.tsx.
   ============================================================================ */

type ElementKind = "eyebrow" | "heading" | "paragraph" | "button" | "image" | "stat" | "icon-text";

interface BuilderElement {
  id: string;
  kind: ElementKind;
  text: string;
  href?: string;
  imageUrl?: string;
  style: {
    color: string;
    fontSize: string;
    fontWeight: string;
    fontFamily: string;
    align: "left" | "center" | "right";
    bg?: string;
    borderColor?: string;
    borderWidth?: string;
    radius?: string;
    shadow?: string;
    paddingX?: string;
    paddingY?: string;
  };
}

interface BuilderSection {
  instanceId: string;
  templateId: string;
  name: string;
  icon: string;
  columns?: number;
  visible: boolean;
  style: {
    bg: string;
    textColor: string;
    paddingY: string;
    borderTop: boolean;
    shadow: boolean;
  };
  elements: BuilderElement[];
}

interface SectionTemplate {
  id: string;
  name: string;
  icon: string;
  description: string;
  keywords: string[];
  build: () => Omit<BuilderSection, "instanceId">;
}

/* ============================================================================
   HELPERS
   ============================================================================ */

let idCounter = 0;
const uid = (prefix: string) => `${prefix}_${Date.now().toString(36)}_${(idCounter++).toString(36)}`;

const FONT_FAMILIES = ["Inter", "Hind Siliguri", "Poppins", "Sora", "Manrope", "Playfair Display"];
const FONT_SIZES = ["12px", "14px", "16px", "18px", "20px", "24px", "30px", "36px", "48px", "60px"];
const FONT_WEIGHTS = [
  { label: "নরমাল", value: "400" },
  { label: "মিডিয়াম", value: "500" },
  { label: "সেমি-বোল্ড", value: "600" },
  { label: "বোল্ড", value: "700" },
  { label: "এক্সট্রা-বোল্ড", value: "800" },
  { label: "ব্ল্যাক", value: "900" },
];

const defaultTextStyle = (overrides: Partial<BuilderElement["style"]> = {}): BuilderElement["style"] => ({
  color: "#0f172a",
  fontSize: "16px",
  fontWeight: "400",
  fontFamily: "Inter",
  align: "left",
  paddingX: "0px",
  paddingY: "0px",
  ...overrides,
});

const ICONS: Record<string, React.ComponentType<{ className?: string }>> = {
  Layout,
  Grid3x3,
  UsersIcon,
  Star,
  VideoIcon,
  ListChecks,
  Mail,
  Zap,
  ImageIcon,
};

const RenderIcon = ({ name, className }: { name: string; className?: string }) => {
  const Cmp = ICONS[name] || Layout;
  return <Cmp className={className} />;
};

/* ============================================================================
   SECTION TEMPLATE LIBRARY — the "brain" the AI assistant draws suggestions
   from. Each template is a factory that returns a ready-to-drop section.
   ============================================================================ */

const SECTION_TEMPLATES: SectionTemplate[] = [
  {
    id: "hero",
    name: "হিরো ব্যানার",
    icon: "Layout",
    description: "বড় হেডলাইন, সাব-টেক্সট ও একটি প্রধান বাটন সহ ওপেনিং সেকশন",
    keywords: ["hero", "banner", "intro", "প্রথম", "শুরু", "ল্যান্ডিং"],
    build: () => ({
      templateId: "hero",
      name: "হিরো ব্যানার",
      icon: "Layout",
      visible: true,
      style: { bg: "#f8fafc", textColor: "#0f172a", paddingY: "72px", borderTop: false, shadow: false },
      elements: [
        {
          id: uid("el"),
          kind: "eyebrow",
          text: "নতুন সেকশন",
          style: defaultTextStyle({ fontSize: "12px", fontWeight: "700", color: "#4f46e5", align: "left" }),
        },
        {
          id: uid("el"),
          kind: "heading",
          text: "আপনার হেডলাইন এখানে লিখুন",
          style: defaultTextStyle({ fontSize: "48px", fontWeight: "800", align: "left" }),
        },
        {
          id: uid("el"),
          kind: "paragraph",
          text: "এই সাব-টেক্সটে সংক্ষেপে বলুন আপনার সেবা বা প্রোডাক্ট সম্পর্কে — কেন ভিজিটর থামবে এবং এগিয়ে যাবে।",
          style: defaultTextStyle({ fontSize: "16px", color: "#475569", align: "left" }),
        },
        {
          id: uid("el"),
          kind: "button",
          text: "এখনই শুরু করুন",
          href: "#",
          style: defaultTextStyle({
            color: "#ffffff",
            fontSize: "14px",
            fontWeight: "700",
            bg: "#4f46e5",
            radius: "12px",
            paddingX: "24px",
            paddingY: "12px",
          }),
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
      columns: 3,
      visible: true,
      style: { bg: "#ffffff", textColor: "#0f172a", paddingY: "64px", borderTop: false, shadow: false },
      elements: [
        {
          id: uid("el"),
          kind: "heading",
          text: "আমাদের সেবাসমূহ",
          style: defaultTextStyle({ fontSize: "30px", fontWeight: "800", align: "center" }),
        },
        ...[1, 2, 3].map((n) => ({
          id: uid("el"),
          kind: "icon-text" as ElementKind,
          text: `ফিচার ${n}\nএই ফিচারটি সংক্ষেপে ব্যাখ্যা করুন — এক-দুই লাইনে যথেষ্ট।`,
          style: defaultTextStyle({ fontSize: "14px", align: "left", bg: "#f8fafc", radius: "16px", paddingX: "20px", paddingY: "20px" }),
        })),
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
      columns: 2,
      visible: true,
      style: { bg: "#f8fafc", textColor: "#0f172a", paddingY: "64px", borderTop: false, shadow: false },
      elements: [
        {
          id: uid("el"),
          kind: "heading",
          text: "আমাদের বিশেষজ্ঞ প্যানেল",
          style: defaultTextStyle({ fontSize: "30px", fontWeight: "800", align: "center" }),
        },
        ...[1, 2].map((n) => ({
          id: uid("el"),
          kind: "icon-text" as ElementKind,
          text: `সদস্যের নাম ${n}\nপদবী ও এক লাইনের সংক্ষিপ্ত পরিচিতি এখানে দিন।`,
          style: defaultTextStyle({ fontSize: "14px", align: "left", bg: "#ffffff", radius: "20px", paddingX: "20px", paddingY: "20px" }),
        })),
      ],
    }),
  },
  {
    id: "stats",
    name: "স্ট্যাটস বার",
    icon: "Zap",
    description: "সংখ্যাভিত্তিক অর্জন বা বিশ্বাসযোগ্যতা দেখানোর হালকা বার",
    keywords: ["stat", "number", "achievement", "সংখ্যা", "অর্জন"],
    build: () => ({
      templateId: "stats",
      name: "স্ট্যাটস বার",
      icon: "Zap",
      columns: 4,
      visible: true,
      style: { bg: "#0f172a", textColor: "#ffffff", paddingY: "40px", borderTop: false, shadow: false },
      elements: [1, 2, 3, 4].map((n) => ({
        id: uid("el"),
        kind: "stat" as ElementKind,
        text: `${n * 100}+\nলেবেল ${n}`,
        style: defaultTextStyle({ fontSize: "30px", fontWeight: "800", color: "#ffffff", align: "center" }),
      })),
    }),
  },
  {
    id: "testimonial",
    name: "রিভিউ / টেস্টিমোনিয়াল",
    icon: "Star",
    description: "গ্রাহকের মতামত ও রেটিং দেখানোর কোট-স্টাইল সেকশন",
    keywords: ["review", "testimonial", "feedback", "রিভিউ", "মতামত", "প্রশংসা"],
    build: () => ({
      templateId: "testimonial",
      name: "রিভিউ / টেস্টিমোনিয়াল",
      icon: "Star",
      visible: true,
      style: { bg: "#ffffff", textColor: "#0f172a", paddingY: "56px", borderTop: false, shadow: false },
      elements: [
        {
          id: uid("el"),
          kind: "paragraph",
          text: "“এখানে গ্রাহকের বাস্তব মন্তব্য বসান — সংক্ষিপ্ত ও আন্তরিক হলে সবচেয়ে ভালো কাজ করে।”",
          style: defaultTextStyle({ fontSize: "20px", fontWeight: "600", align: "center" }),
        },
        {
          id: uid("el"),
          kind: "eyebrow",
          text: "— গ্রাহকের নাম, পদবী",
          style: defaultTextStyle({ fontSize: "13px", color: "#64748b", align: "center" }),
        },
      ],
    }),
  },
  {
    id: "video",
    name: "ভিডিও / মিডিয়া",
    icon: "VideoIcon",
    description: "একটি ভিডিও বা ইমেজ ফিচার করার সেকশন",
    keywords: ["video", "media", "youtube", "ভিডিও"],
    build: () => ({
      templateId: "video",
      name: "ভিডিও / মিডিয়া",
      icon: "VideoIcon",
      visible: true,
      style: { bg: "#f8fafc", textColor: "#0f172a", paddingY: "56px", borderTop: false, shadow: false },
      elements: [
        {
          id: uid("el"),
          kind: "heading",
          text: "কীভাবে কাজ করে দেখুন",
          style: defaultTextStyle({ fontSize: "24px", fontWeight: "700", align: "center" }),
        },
        {
          id: uid("el"),
          kind: "image",
          text: "ভিডিও থাম্বনেইল",
          imageUrl: "",
          style: defaultTextStyle({ radius: "16px", align: "center" }),
        },
      ],
    }),
  },
  {
    id: "faq",
    name: "প্রশ্নোত্তর (FAQ)",
    icon: "ListChecks",
    description: "সচরাচর জিজ্ঞাসিত প্রশ্নের তালিকা",
    keywords: ["faq", "question", "প্রশ্ন", "সচরাচর"],
    build: () => ({
      templateId: "faq",
      name: "প্রশ্নোত্তর (FAQ)",
      icon: "ListChecks",
      visible: true,
      style: { bg: "#ffffff", textColor: "#0f172a", paddingY: "56px", borderTop: false, shadow: false },
      elements: [
        {
          id: uid("el"),
          kind: "heading",
          text: "সচরাচর জিজ্ঞাসিত প্রশ্ন",
          style: defaultTextStyle({ fontSize: "28px", fontWeight: "800", align: "center" }),
        },
        ...[1, 2, 3].map((n) => ({
          id: uid("el"),
          kind: "icon-text" as ElementKind,
          text: `প্রশ্ন ${n}: এখানে প্রশ্নটি লিখুন?\nউত্তরটি এখানে সংক্ষেপে লিখুন।`,
          style: defaultTextStyle({ fontSize: "14px", align: "left", bg: "#f8fafc", radius: "12px", paddingX: "18px", paddingY: "16px" }),
        })),
      ],
    }),
  },
  {
    id: "contact",
    name: "যোগাযোগ ফর্ম",
    icon: "Mail",
    description: "লিড সংগ্রহের জন্য সহজ যোগাযোগ / বুকিং ফর্ম ব্লক",
    keywords: ["contact", "form", "booking", "যোগাযোগ", "ফর্ম", "বুকিং"],
    build: () => ({
      templateId: "contact",
      name: "যোগাযোগ ফর্ম",
      icon: "Mail",
      visible: true,
      style: { bg: "#f8fafc", textColor: "#0f172a", paddingY: "64px", borderTop: false, shadow: false },
      elements: [
        {
          id: uid("el"),
          kind: "heading",
          text: "যোগাযোগ করুন",
          style: defaultTextStyle({ fontSize: "28px", fontWeight: "800", align: "center" }),
        },
        {
          id: uid("el"),
          kind: "paragraph",
          text: "নাম, ফোন নম্বর ও বার্তা দিয়ে ফর্মটি পূরণ করুন — আমরা দ্রুত যোগাযোগ করবো।",
          style: defaultTextStyle({ fontSize: "14px", color: "#475569", align: "center" }),
        },
        {
          id: uid("el"),
          kind: "button",
          text: "রিকোয়েস্ট পাঠান",
          href: "#",
          style: defaultTextStyle({
            color: "#ffffff",
            fontSize: "14px",
            fontWeight: "700",
            bg: "#4f46e5",
            radius: "12px",
            paddingX: "24px",
            paddingY: "12px",
          }),
        },
      ],
    }),
  },
  {
    id: "cta",
    name: "সিটিএ ব্যানার",
    icon: "Zap",
    description: "একটি জোরালো কল-টু-অ্যাকশন ব্যানার সেকশন",
    keywords: ["cta", "offer", "campaign", "অফার", "ক্যাম্পেইন"],
    build: () => ({
      templateId: "cta",
      name: "সিটিএ ব্যানার",
      icon: "Zap",
      visible: true,
      style: { bg: "#4f46e5", textColor: "#ffffff", paddingY: "48px", borderTop: false, shadow: false },
      elements: [
        {
          id: uid("el"),
          kind: "heading",
          text: "আজই শুরু করুন",
          style: defaultTextStyle({ fontSize: "28px", fontWeight: "800", color: "#ffffff", align: "center" }),
        },
        {
          id: uid("el"),
          kind: "button",
          text: "বুকিং করুন",
          href: "#",
          style: defaultTextStyle({
            color: "#4f46e5",
            fontSize: "14px",
            fontWeight: "700",
            bg: "#ffffff",
            radius: "999px",
            paddingX: "28px",
            paddingY: "12px",
          }),
        },
      ],
    }),
  },
  {
    id: "footer",
    name: "ফুটার",
    icon: "Layout",
    description: "পেজের নিচে ব্র্যান্ড লাইন ও কপিরাইট সেকশন",
    keywords: ["footer", "ফুটার"],
    build: () => ({
      templateId: "footer",
      name: "ফুটার",
      icon: "Layout",
      visible: true,
      style: { bg: "#0f172a", textColor: "#94a3b8", paddingY: "32px", borderTop: false, shadow: false },
      elements: [
        {
          id: uid("el"),
          kind: "paragraph",
          text: "© ২০২৬ আপনার ব্র্যান্ড নাম। সর্বস্বত্ব সংরক্ষিত।",
          style: defaultTextStyle({ fontSize: "12px", color: "#94a3b8", align: "center" }),
        },
      ],
    }),
  },
];

/* ============================================================================
   AI SUGGESTION ENGINE — heuristic client-side keyword matcher. Swap the body
   of `generateSuggestions` for a real API call later without touching the UI.
   ============================================================================ */

function generateSuggestions(prompt: string): SectionTemplate[] {
  const text = prompt.toLowerCase();
  const scored = SECTION_TEMPLATES.map((t) => {
    const hits = t.keywords.filter((k) => text.includes(k.toLowerCase())).length;
    return { t, hits };
  });
  const matched = scored.filter((s) => s.hits > 0).sort((a, b) => b.hits - a.hits).map((s) => s.t);
  const always = SECTION_TEMPLATES.filter((t) => t.id === "hero" || t.id === "cta" || t.id === "footer");
  const combined = [...matched, ...always].filter((t, i, arr) => arr.findIndex((x) => x.id === t.id) === i);
  return combined.slice(0, 7);
}

/* ============================================================================
   PROPS
   ============================================================================ */

export interface PageBuilderProps {
  initialSections?: BuilderSection[];
  onSave?: (sections: BuilderSection[]) => void | Promise<void>;
  triggerToast?: (msg: string) => void;
}

/* ============================================================================
   MAIN COMPONENT
   ============================================================================ */

export default function PageBuilder({ initialSections, onSave, triggerToast }: PageBuilderProps) {
  const seedSections = (): BuilderSection[] =>
    (initialSections && initialSections.length > 0
      ? initialSections
      : [SECTION_TEMPLATES[0].build(), SECTION_TEMPLATES[SECTION_TEMPLATES.length - 1].build()]
    ).map((s) => ("instanceId" in s ? s : { ...s, instanceId: uid("sec") })) as BuilderSection[];

  const [sections, setSections] = useState<BuilderSection[]>(seedSections);
  const [selectedSectionId, setSelectedSectionId] = useState<string | null>(null);
  const [selectedElementId, setSelectedElementId] = useState<string | null>(null);
  const [rightTab, setRightTab] = useState<"library" | "ai">("ai");
  const [aiPrompt, setAiPrompt] = useState("");
  const [aiSuggestions, setAiSuggestions] = useState<SectionTemplate[]>([]);
  const [isAiThinking, setIsAiThinking] = useState(false);
  const [draggedTemplateId, setDraggedTemplateId] = useState<string | null>(null);
  const [draggedSectionId, setDraggedSectionId] = useState<string | null>(null);
  const [dropIndex, setDropIndex] = useState<number | null>(null);
  const [viewport, setViewport] = useState<"desktop" | "tablet" | "mobile">("desktop");
  const [isSaving, setIsSaving] = useState(false);

  const past = useRef<BuilderSection[][]>([]);
  const future = useRef<BuilderSection[][]>([]);

  const commit = useCallback((updater: (prev: BuilderSection[]) => BuilderSection[]) => {
    setSections((prev) => {
      past.current = [...past.current.slice(-24), prev];
      future.current = [];
      return updater(prev);
    });
  }, []);

  const undo = useCallback(() => {
    setSections((prev) => {
      const last = past.current.pop();
      if (!last) return prev;
      future.current = [prev, ...future.current];
      return last;
    });
  }, []);

  const redo = useCallback(() => {
    setSections((prev) => {
      const next = future.current.shift();
      if (!next) return prev;
      past.current = [...past.current, prev];
      return next;
    });
  }, []);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "z") {
        e.preventDefault();
        e.shiftKey ? redo() : undo();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [undo, redo]);

  const selectedSection = sections.find((s) => s.instanceId === selectedSectionId) || null;
  const selectedElement = selectedSection?.elements.find((e) => e.id === selectedElementId) || null;

  /* --------------------------- AI suggestion flow -------------------------- */
  const handleAiGenerate = () => {
    if (!aiPrompt.trim()) return;
    setIsAiThinking(true);
    setTimeout(() => {
      setAiSuggestions(generateSuggestions(aiPrompt));
      setIsAiThinking(false);
    }, 900);
  };

  /* ------------------------------ Insert logic ----------------------------- */
  const insertSection = (templateId: string, atIndex: number) => {
    const template = SECTION_TEMPLATES.find((t) => t.id === templateId);
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
    triggerToast?.(`"${template.name}" সেকশনটি পেজে যোগ করা হয়েছে`);
  };

  /* ------------------------------ Drag handlers ---------------------------- */
  const onLibraryDragStart = (e: React.DragEvent, templateId: string) => {
    setDraggedTemplateId(templateId);
    e.dataTransfer.effectAllowed = "copy";
    e.dataTransfer.setData("text/plain", templateId);
  };

  const onCanvasDragOver = (e: React.DragEvent, index: number) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = draggedSectionId ? "move" : "copy";
    setDropIndex(index);
  };

  const onCanvasDrop = (e: React.DragEvent, index: number) => {
    e.preventDefault();
    if (draggedTemplateId) {
      insertSection(draggedTemplateId, index);
    } else if (draggedSectionId) {
      commit((prev) => {
        const next = [...prev];
        const fromIdx = next.findIndex((s) => s.instanceId === draggedSectionId);
        if (fromIdx === -1) return prev;
        const [moved] = next.splice(fromIdx, 1);
        const insertAt = fromIdx < index ? index - 1 : index;
        next.splice(insertAt, 0, moved);
        return next;
      });
    }
    setDraggedTemplateId(null);
    setDraggedSectionId(null);
    setDropIndex(null);
  };

  /* ------------------------------ Section ops ------------------------------ */
  const updateSection = (id: string, patch: Partial<BuilderSection["style"]>) => {
    commit((prev) => prev.map((s) => (s.instanceId === id ? { ...s, style: { ...s.style, ...patch } } : s)));
  };

  const updateElement = (sectionId: string, elId: string, patch: Partial<BuilderElement> | { style: Partial<BuilderElement["style"]> }) => {
    commit((prev) =>
      prev.map((s) => {
        if (s.instanceId !== sectionId) return s;
        return {
          ...s,
          elements: s.elements.map((el) => {
            if (el.id !== elId) return el;
            const patchAny = patch as any;
            return {
              ...el,
              ...patchAny,
              style: patchAny.style ? { ...el.style, ...patchAny.style } : el.style,
            };
          }),
        };
      })
    );
  };

  const deleteSection = (id: string) => {
    commit((prev) => prev.filter((s) => s.instanceId !== id));
    if (selectedSectionId === id) {
      setSelectedSectionId(null);
      setSelectedElementId(null);
    }
  };

  const duplicateSection = (id: string) => {
    commit((prev) => {
      const idx = prev.findIndex((s) => s.instanceId === id);
      if (idx === -1) return prev;
      const clone: BuilderSection = {
        ...prev[idx],
        instanceId: uid("sec"),
        elements: prev[idx].elements.map((el) => ({ ...el, id: uid("el") })),
      };
      const next = [...prev];
      next.splice(idx + 1, 0, clone);
      return next;
    });
  };

  const moveSection = (id: string, dir: -1 | 1) => {
    commit((prev) => {
      const idx = prev.findIndex((s) => s.instanceId === id);
      const target = idx + dir;
      if (idx === -1 || target < 0 || target >= prev.length) return prev;
      const next = [...prev];
      [next[idx], next[target]] = [next[target], next[idx]];
      return next;
    });
  };

  const toggleVisibility = (id: string) => {
    commit((prev) => prev.map((s) => (s.instanceId === id ? { ...s, visible: !s.visible } : s)));
  };

  const deleteElement = (sectionId: string, elId: string) => {
    commit((prev) =>
      prev.map((s) => (s.instanceId === sectionId ? { ...s, elements: s.elements.filter((e) => e.id !== elId) } : s))
    );
    if (selectedElementId === elId) setSelectedElementId(null);
  };

  /* -------------------------------- Save ----------------------------------- */
  const handleSave = async () => {
    setIsSaving(true);
    try {
      localStorage.setItem("builder_page_sections", JSON.stringify(sections));
      await onSave?.(sections);
      triggerToast?.("পেজ সফলভাবে সংরক্ষণ করা হয়েছে!");
    } finally {
      setIsSaving(false);
    }
  };

  const viewportWidth = viewport === "desktop" ? "100%" : viewport === "tablet" ? "768px" : "390px";

  return (
    <div className="h-full w-full flex flex-col bg-slate-950 text-white overflow-hidden select-none">
      {/* ---------------------------- TOP TOOLBAR ---------------------------- */}
      <div className="h-14 shrink-0 border-b border-slate-800 bg-slate-950/95 backdrop-blur flex items-center justify-between px-4 gap-3">
        <div className="flex items-center gap-2.5 min-w-0">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-500 to-fuchsia-500 flex items-center justify-center shrink-0">
            <Wand2 className="w-4 h-4 text-white" />
          </div>
          <div className="min-w-0">
            <p className="text-xs font-black leading-none truncate">AI পেজ বিল্ডার</p>
            <p className="text-[10px] text-slate-500 leading-none mt-0.5">{sections.length} টি সেকশন</p>
          </div>
        </div>

        <div className="flex items-center gap-1 bg-slate-900 border border-slate-800 rounded-xl p-1">
          <button
            onClick={() => setViewport("desktop")}
            className={`p-1.5 rounded-lg transition-colors cursor-pointer ${viewport === "desktop" ? "bg-indigo-600 text-white" : "text-slate-500 hover:text-slate-200"}`}
            title="ডেস্কটপ ভিউ"
          >
            <Monitor className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => setViewport("tablet")}
            className={`p-1.5 rounded-lg transition-colors cursor-pointer ${viewport === "tablet" ? "bg-indigo-600 text-white" : "text-slate-500 hover:text-slate-200"}`}
            title="ট্যাবলেট ভিউ"
          >
            <Tablet className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => setViewport("mobile")}
            className={`p-1.5 rounded-lg transition-colors cursor-pointer ${viewport === "mobile" ? "bg-indigo-600 text-white" : "text-slate-500 hover:text-slate-200"}`}
            title="মোবাইল ভিউ"
          >
            <Smartphone className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={undo}
            className="p-2 rounded-lg bg-slate-900 border border-slate-800 text-slate-400 hover:text-white hover:border-slate-700 transition-colors cursor-pointer disabled:opacity-30"
            title="আনডু (Ctrl+Z)"
          >
            <Undo2 className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={redo}
            className="p-2 rounded-lg bg-slate-900 border border-slate-800 text-slate-400 hover:text-white hover:border-slate-700 transition-colors cursor-pointer disabled:opacity-30"
            title="রিডু (Ctrl+Shift+Z)"
          >
            <Redo2 className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={handleSave}
            disabled={isSaving}
            className="flex items-center gap-1.5 bg-emerald-600 hover:bg-emerald-500 disabled:opacity-60 text-white text-xs font-black px-4 py-2 rounded-lg transition-colors cursor-pointer"
          >
            {isSaving ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Save className="w-3.5 h-3.5" />}
            <span>সেভ করুন</span>
          </button>
        </div>
      </div>

      {/* ------------------------------ WORKSPACE ----------------------------- */}
      <div className="flex-1 grid grid-cols-12 overflow-hidden">
        {/* ============ LEFT: CONTEXT-SENSITIVE CUSTOMIZER PANEL ============ */}
        <aside className="col-span-3 border-r border-slate-800 bg-slate-950 overflow-y-auto">
          {!selectedSection ? (
            <div className="h-full flex flex-col items-center justify-center text-center px-6 py-16 gap-3">
              <div className="w-12 h-12 rounded-2xl bg-slate-900 border border-slate-800 flex items-center justify-center">
                <MousePointerClick className="w-5 h-5 text-slate-600" />
              </div>
              <p className="text-xs font-bold text-slate-400">কাস্টমাইজার</p>
              <p className="text-[11px] text-slate-600 leading-relaxed max-w-[200px]">
                ডানপাশ থেকে একটি সেকশন ক্যানভাসে ড্রপ করুন, অথবা বিদ্যমান কোনো সেকশনে ক্লিক করুন — কাস্টমাইজেশন অপশন এখানে চলে আসবে।
              </p>
            </div>
          ) : (
            <div className="p-4 space-y-5">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 min-w-0">
                  <RenderIcon name={selectedSection.icon} className="w-4 h-4 text-indigo-400 shrink-0" />
                  <span className="text-xs font-black truncate">{selectedSection.name}</span>
                </div>
                <button
                  onClick={() => {
                    setSelectedSectionId(null);
                    setSelectedElementId(null);
                  }}
                  className="p-1 rounded hover:bg-slate-800 text-slate-500 hover:text-white transition-colors cursor-pointer"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>

              {!selectedElement ? (
                <>
                  {/* --------- SECTION-LEVEL CONTROLS --------- */}
                  <PanelGroup label="ব্যাকগ্রাউন্ড ও রঙ" icon={<Palette className="w-3.5 h-3.5" />}>
                    <ColorField
                      label="ব্যাকগ্রাউন্ড কালার"
                      value={selectedSection.style.bg}
                      onChange={(v) => updateSection(selectedSection.instanceId, { bg: v })}
                    />
                    <ColorField
                      label="টেক্সট কালার"
                      value={selectedSection.style.textColor}
                      onChange={(v) => updateSection(selectedSection.instanceId, { textColor: v })}
                    />
                  </PanelGroup>

                  <PanelGroup label="স্পেসিং" icon={<Square className="w-3.5 h-3.5" />}>
                    <SelectField
                      label="উপরে-নিচে প্যাডিং"
                      value={selectedSection.style.paddingY}
                      options={["24px", "32px", "48px", "56px", "64px", "72px", "96px"]}
                      onChange={(v) => updateSection(selectedSection.instanceId, { paddingY: v })}
                    />
                  </PanelGroup>

                  <PanelGroup label="বর্ডার ও শ্যাডো" icon={<Square className="w-3.5 h-3.5" />}>
                    <ToggleField
                      label="উপরে বর্ডার লাইন"
                      value={selectedSection.style.borderTop}
                      onChange={(v) => updateSection(selectedSection.instanceId, { borderTop: v })}
                    />
                    <ToggleField
                      label="ড্রপ শ্যাডো"
                      value={selectedSection.style.shadow}
                      onChange={(v) => updateSection(selectedSection.instanceId, { shadow: v })}
                    />
                  </PanelGroup>

                  <PanelGroup label={`এলিমেন্টসমূহ (${selectedSection.elements.length})`} icon={<Layers className="w-3.5 h-3.5" />}>
                    <div className="space-y-1.5">
                      {selectedSection.elements.map((el) => (
                        <button
                          key={el.id}
                          onClick={() => setSelectedElementId(el.id)}
                          className="w-full flex items-center justify-between gap-2 bg-slate-900 hover:bg-slate-800 border border-slate-800 rounded-lg px-3 py-2 text-left transition-colors cursor-pointer"
                        >
                          <span className="text-[11px] text-slate-300 truncate">{el.text.split("\n")[0] || el.kind}</span>
                          <ChevronRight className="w-3 h-3 text-slate-600 shrink-0" />
                        </button>
                      ))}
                    </div>
                  </PanelGroup>
                </>
              ) : (
                <>
                  {/* --------- ELEMENT-LEVEL CONTROLS --------- */}
                  <button
                    onClick={() => setSelectedElementId(null)}
                    className="flex items-center gap-1 text-[11px] text-indigo-400 hover:text-indigo-300 font-bold cursor-pointer"
                  >
                    <ChevronRight className="w-3 h-3 rotate-180" /> সেকশনে ফিরুন
                  </button>

                  <PanelGroup label="কন্টেন্ট" icon={<Type className="w-3.5 h-3.5" />}>
                    <textarea
                      value={selectedElement.text}
                      onChange={(e) => updateElement(selectedSection.instanceId, selectedElement.id, { text: e.target.value } as any)}
                      className="w-full bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 h-20 resize-none"
                    />
                    {(selectedElement.kind === "button") && (
                      <div className="mt-2">
                        <FieldLabel icon={<Link2 className="w-3 h-3" />}>বাটন লিংক (URL)</FieldLabel>
                        <input
                          value={selectedElement.href || ""}
                          onChange={(e) => updateElement(selectedSection.instanceId, selectedElement.id, { href: e.target.value } as any)}
                          className="w-full bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                          placeholder="https:// অথবা #section-id"
                        />
                      </div>
                    )}
                  </PanelGroup>

                  <PanelGroup label="টাইপোগ্রাফি" icon={<Type className="w-3.5 h-3.5" />}>
                    <SelectField
                      label="ফন্ট ফ্যামিলি"
                      value={selectedElement.style.fontFamily}
                      options={FONT_FAMILIES}
                      onChange={(v) => updateElement(selectedSection.instanceId, selectedElement.id, { style: { fontFamily: v } })}
                    />
                    <SelectField
                      label="ফন্ট সাইজ"
                      value={selectedElement.style.fontSize}
                      options={FONT_SIZES}
                      onChange={(v) => updateElement(selectedSection.instanceId, selectedElement.id, { style: { fontSize: v } })}
                    />
                    <SelectField
                      label="ফন্ট ওয়েট"
                      value={selectedElement.style.fontWeight}
                      options={FONT_WEIGHTS.map((f) => f.value)}
                      renderOption={(v) => FONT_WEIGHTS.find((f) => f.value === v)?.label || v}
                      onChange={(v) => updateElement(selectedSection.instanceId, selectedElement.id, { style: { fontWeight: v } })}
                    />
                    <div>
                      <FieldLabel icon={<AlignLeft className="w-3 h-3" />}>টেক্সট অ্যালাইনমেন্ট</FieldLabel>
                      <div className="flex items-center gap-1 bg-slate-900 border border-slate-800 rounded-lg p-1">
                        {(
                          [
                            { v: "left", Icon: AlignLeft },
                            { v: "center", Icon: AlignCenter },
                            { v: "right", Icon: AlignRight },
                          ] as const
                        ).map(({ v, Icon }) => (
                          <button
                            key={v}
                            onClick={() => updateElement(selectedSection.instanceId, selectedElement.id, { style: { align: v } })}
                            className={`flex-1 flex items-center justify-center py-1.5 rounded-md transition-colors cursor-pointer ${
                              selectedElement.style.align === v ? "bg-indigo-600 text-white" : "text-slate-500 hover:text-slate-200"
                            }`}
                          >
                            <Icon className="w-3.5 h-3.5" />
                          </button>
                        ))}
                      </div>
                    </div>
                    <ColorField
                      label="টেক্সট কালার"
                      value={selectedElement.style.color}
                      onChange={(v) => updateElement(selectedSection.instanceId, selectedElement.id, { style: { color: v } })}
                    />
                  </PanelGroup>

                  <PanelGroup label="ব্যাকগ্রাউন্ড ও বর্ডার" icon={<Square className="w-3.5 h-3.5" />}>
                    <ColorField
                      label="ব্যাকগ্রাউন্ড কালার"
                      value={selectedElement.style.bg || "#ffffff"}
                      onChange={(v) => updateElement(selectedSection.instanceId, selectedElement.id, { style: { bg: v } })}
                    />
                    <ColorField
                      label="বর্ডার কালার"
                      value={selectedElement.style.borderColor || "#e2e8f0"}
                      onChange={(v) => updateElement(selectedSection.instanceId, selectedElement.id, { style: { borderColor: v } })}
                    />
                    <SelectField
                      label="বর্ডার রেডিয়াস"
                      value={selectedElement.style.radius || "0px"}
                      options={["0px", "8px", "12px", "16px", "24px", "999px"]}
                      onChange={(v) => updateElement(selectedSection.instanceId, selectedElement.id, { style: { radius: v } })}
                    />
                    <ToggleField
                      label="শ্যাডো যোগ করুন"
                      value={!!selectedElement.style.shadow}
                      onChange={(v) =>
                        updateElement(selectedSection.instanceId, selectedElement.id, {
                          style: { shadow: v ? "0 10px 25px -5px rgba(0,0,0,0.15)" : "" },
                        })
                      }
                    />
                  </PanelGroup>

                  <button
                    onClick={() => deleteElement(selectedSection.instanceId, selectedElement.id)}
                    className="w-full flex items-center justify-center gap-1.5 bg-rose-950/60 hover:bg-rose-950 border border-rose-900 text-rose-400 text-[11px] font-bold py-2 rounded-lg transition-colors cursor-pointer"
                  >
                    <Trash2 className="w-3.5 h-3.5" /> এলিমেন্ট মুছে ফেলুন
                  </button>
                </>
              )}
            </div>
          )}
        </aside>

        {/* =============================== CANVAS =============================== */}
        <main className="col-span-6 bg-slate-900 overflow-y-auto p-6 flex flex-col items-center">
          <div
            className="bg-white rounded-2xl shadow-2xl overflow-hidden transition-all duration-300 w-full"
            style={{ maxWidth: viewportWidth }}
          >
            <DropSlot
              index={0}
              isActive={dropIndex === 0}
              onDragOver={(e) => onCanvasDragOver(e, 0)}
              onDrop={(e) => onCanvasDrop(e, 0)}
            />
            {sections.map((section, idx) => (
              <React.Fragment key={section.instanceId}>
                <CanvasSection
                  section={section}
                  isSelected={selectedSectionId === section.instanceId}
                  selectedElementId={selectedSectionId === section.instanceId ? selectedElementId : null}
                  onSelectSection={() => {
                    setSelectedSectionId(section.instanceId);
                    setSelectedElementId(null);
                  }}
                  onSelectElement={(elId) => {
                    setSelectedSectionId(section.instanceId);
                    setSelectedElementId(elId);
                  }}
                  onDelete={() => deleteSection(section.instanceId)}
                  onDuplicate={() => duplicateSection(section.instanceId)}
                  onMoveUp={() => moveSection(section.instanceId, -1)}
                  onMoveDown={() => moveSection(section.instanceId, 1)}
                  onToggleVisibility={() => toggleVisibility(section.instanceId)}
                  onDragStart={() => setDraggedSectionId(section.instanceId)}
                  onDragEnd={() => setDraggedSectionId(null)}
                />
                <DropSlot
                  index={idx + 1}
                  isActive={dropIndex === idx + 1}
                  onDragOver={(e) => onCanvasDragOver(e, idx + 1)}
                  onDrop={(e) => onCanvasDrop(e, idx + 1)}
                />
              </React.Fragment>
            ))}
            {sections.length === 0 && (
              <div className="py-24 text-center text-slate-400 text-xs">
                ডানপাশ থেকে একটি সেকশন এখানে ড্র্যাগ করে আনুন
              </div>
            )}
          </div>
        </main>

        {/* ============ RIGHT: AI SUGGESTIONS + SECTION LIBRARY ============ */}
        <aside className="col-span-3 border-l border-slate-800 bg-slate-950 overflow-y-auto flex flex-col">
          <div className="flex border-b border-slate-800 shrink-0">
            <button
              onClick={() => setRightTab("ai")}
              className={`flex-1 flex items-center justify-center gap-1.5 py-3 text-[11px] font-black transition-colors cursor-pointer ${
                rightTab === "ai" ? "text-indigo-400 border-b-2 border-indigo-500" : "text-slate-500 hover:text-slate-300"
              }`}
            >
              <Sparkles className="w-3.5 h-3.5" /> AI সাজেশন
            </button>
            <button
              onClick={() => setRightTab("library")}
              className={`flex-1 flex items-center justify-center gap-1.5 py-3 text-[11px] font-black transition-colors cursor-pointer ${
                rightTab === "library" ? "text-indigo-400 border-b-2 border-indigo-500" : "text-slate-500 hover:text-slate-300"
              }`}
            >
              <Layers className="w-3.5 h-3.5" /> সব সেকশন
            </button>
          </div>

          {rightTab === "ai" && (
            <div className="p-4 space-y-4">
              <div className="bg-gradient-to-br from-indigo-950 to-slate-950 border border-indigo-900 rounded-2xl p-3.5 space-y-2.5">
                <div className="flex items-center gap-1.5 text-[11px] font-black text-indigo-300">
                  <Wand2 className="w-3.5 h-3.5 text-fuchsia-400" /> ওয়েবসাইটের ফিচার লিখুন
                </div>
                <textarea
                  value={aiPrompt}
                  onChange={(e) => setAiPrompt(e.target.value)}
                  placeholder='যেমন: "স্পিচ থেরাপি ক্লিনিক, বিশেষজ্ঞ প্যানেল, ফি, রিভিউ ও বুকিং ফর্ম দরকার"'
                  className="w-full bg-black/30 border border-white/10 rounded-lg px-3 py-2 text-[11px] text-white placeholder:text-slate-500 h-20 resize-none focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
                <button
                  onClick={handleAiGenerate}
                  disabled={isAiThinking || !aiPrompt.trim()}
                  className="w-full flex items-center justify-center gap-1.5 bg-indigo-600 hover:bg-indigo-500 disabled:bg-slate-800 disabled:text-slate-500 text-white text-[11px] font-black py-2 rounded-lg transition-colors cursor-pointer"
                >
                  {isAiThinking ? (
                    <>
                      <Loader2 className="w-3.5 h-3.5 animate-spin" /> ব্রেইনস্টর্মিং করছি...
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-3.5 h-3.5" /> সেকশন জেনারেট করুন
                    </>
                  )}
                </button>
              </div>

              {aiSuggestions.length > 0 && (
                <div className="space-y-2">
                  <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest px-1">সাজেস্টকৃত সেকশন — ড্র্যাগ করে ক্যানভাসে ছাড়ুন</p>
                  {aiSuggestions.map((t) => (
                    <LibraryCard key={t.id} template={t} highlighted onDragStart={(e) => onLibraryDragStart(e, t.id)} onQuickAdd={() => insertSection(t.id, sections.length)} />
                  ))}
                </div>
              )}

              {aiSuggestions.length === 0 && !isAiThinking && (
                <div className="text-center py-8 px-2">
                  <HelpCircle className="w-6 h-6 text-slate-700 mx-auto mb-2" />
                  <p className="text-[10px] text-slate-600 leading-relaxed">
                    ফিচারগুলো লিখে "সেকশন জেনারেট করুন" চাপুন — AI আপনার জন্য প্রাসঙ্গিক সেকশন সাজেস্ট করবে।
                  </p>
                </div>
              )}
            </div>
          )}

          {rightTab === "library" && (
            <div className="p-4 space-y-2">
              <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest px-1 mb-1">সব সেকশন টেমপ্লেট</p>
              {SECTION_TEMPLATES.map((t) => (
                <LibraryCard key={t.id} template={t} onDragStart={(e) => onLibraryDragStart(e, t.id)} onQuickAdd={() => insertSection(t.id, sections.length)} />
              ))}
            </div>
          )}
        </aside>
      </div>
    </div>
  );
}

/* ============================================================================
   SUB-COMPONENTS
   ============================================================================ */

function LibraryCard({
  template,
  highlighted,
  onDragStart,
  onQuickAdd,
}: {
  template: SectionTemplate;
  highlighted?: boolean;
  onDragStart: (e: React.DragEvent) => void;
  onQuickAdd: () => void;
}) {
  return (
    <div
      draggable
      onDragStart={onDragStart}
      className={`group flex items-start gap-2.5 p-3 rounded-xl border cursor-grab active:cursor-grabbing transition-all ${
        highlighted ? "bg-indigo-950/40 border-indigo-800 hover:border-indigo-600" : "bg-slate-900 border-slate-800 hover:border-slate-700"
      }`}
    >
      <div className="w-8 h-8 rounded-lg bg-slate-800 flex items-center justify-center shrink-0 mt-0.5">
        <RenderIcon name={template.icon} className="w-4 h-4 text-indigo-400" />
      </div>
      <div className="min-w-0 flex-1">
        <p className="text-[11px] font-bold text-white truncate">{template.name}</p>
        <p className="text-[10px] text-slate-500 leading-snug mt-0.5 line-clamp-2">{template.description}</p>
      </div>
      <button
        onClick={onQuickAdd}
        title="ক্লিক করে পেজের শেষে যোগ করুন"
        className="opacity-0 group-hover:opacity-100 shrink-0 p-1.5 rounded-lg bg-slate-800 hover:bg-indigo-600 text-slate-400 hover:text-white transition-all cursor-pointer"
      >
        <Plus className="w-3.5 h-3.5" />
      </button>
    </div>
  );
}

function DropSlot({
  index,
  isActive,
  onDragOver,
  onDrop,
}: {
  index: number;
  isActive: boolean;
  onDragOver: (e: React.DragEvent) => void;
  onDrop: (e: React.DragEvent) => void;
}) {
  return (
    <div
      onDragOver={onDragOver}
      onDrop={onDrop}
      className={`relative transition-all ${isActive ? "h-10 bg-indigo-100" : "h-2 hover:h-6 hover:bg-indigo-50/60"}`}
    >
      {isActive && (
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-[10px] font-black text-indigo-600 bg-white px-2.5 py-1 rounded-full border border-indigo-300 shadow-sm">এখানে ছাড়ুন</span>
        </div>
      )}
    </div>
  );
}

function CanvasSection({
  section,
  isSelected,
  selectedElementId,
  onSelectSection,
  onSelectElement,
  onDelete,
  onDuplicate,
  onMoveUp,
  onMoveDown,
  onToggleVisibility,
  onDragStart,
  onDragEnd,
}: {
  section: BuilderSection;
  isSelected: boolean;
  selectedElementId: string | null;
  onSelectSection: () => void;
  onSelectElement: (id: string) => void;
  onDelete: () => void;
  onDuplicate: () => void;
  onMoveUp: () => void;
  onMoveDown: () => void;
  onToggleVisibility: () => void;
  onDragStart: () => void;
  onDragEnd: () => void;
}) {
  const gridCols = section.columns ? `repeat(${Math.min(section.columns, 4)}, minmax(0, 1fr))` : undefined;

  return (
    <div
      draggable
      onDragStart={onDragStart}
      onDragEnd={onDragEnd}
      onClick={(e) => {
        e.stopPropagation();
        onSelectSection();
      }}
      className={`relative group/section transition-all ${section.visible ? "" : "opacity-40"} ${
        isSelected ? "outline outline-2 outline-indigo-500 outline-offset-[-2px]" : "hover:outline hover:outline-2 hover:outline-indigo-300 hover:outline-offset-[-2px]"
      }`}
      style={{
        backgroundColor: section.style.bg,
        color: section.style.textColor,
        paddingTop: section.style.paddingY,
        paddingBottom: section.style.paddingY,
        borderTop: section.style.borderTop ? "1px solid rgba(148,163,184,0.3)" : undefined,
        boxShadow: section.style.shadow ? "0 10px 30px -10px rgba(0,0,0,0.15)" : undefined,
      }}
    >
      {/* floating toolbar */}
      <div className="absolute top-2 right-2 z-20 opacity-0 group-hover/section:opacity-100 flex items-center gap-1 bg-slate-950 border border-slate-800 rounded-lg p-1 shadow-lg">
        <span className="px-1.5 cursor-grab text-slate-500" title="টানুন">
          <GripVertical className="w-3.5 h-3.5" />
        </span>
        <ToolbarBtn icon={<ArrowUp className="w-3 h-3" />} onClick={onMoveUp} title="উপরে সরান" />
        <ToolbarBtn icon={<ArrowDown className="w-3 h-3" />} onClick={onMoveDown} title="নিচে সরান" />
        <ToolbarBtn icon={<Copy className="w-3 h-3" />} onClick={onDuplicate} title="কপি করুন" />
        <ToolbarBtn icon={section.visible ? <Eye className="w-3 h-3" /> : <EyeOff className="w-3 h-3" />} onClick={onToggleVisibility} title="দৃশ্যমানতা" />
        <ToolbarBtn icon={<Trash2 className="w-3 h-3" />} onClick={onDelete} title="মুছে ফেলুন" danger />
      </div>

      <div className="px-8 sm:px-14 max-w-5xl mx-auto" style={{ display: gridCols ? "grid" : "block", gridTemplateColumns: gridCols, gap: gridCols ? "16px" : undefined }}>
        {section.elements.map((el) => (
          <ElementView key={el.id} el={el} isSelected={selectedElementId === el.id} onClick={(e) => { e.stopPropagation(); onSelectElement(el.id); }} />
        ))}
      </div>
    </div>
  );
}

function ElementView({ el, isSelected, onClick }: { el: BuilderElement; isSelected: boolean; onClick: (e: React.MouseEvent) => void }) {
  const baseStyle: React.CSSProperties = {
    color: el.style.color,
    fontSize: el.style.fontSize,
    fontWeight: el.style.fontWeight as any,
    fontFamily: el.style.fontFamily,
    textAlign: el.style.align,
    backgroundColor: el.style.bg,
    borderColor: el.style.borderColor,
    borderWidth: el.style.borderWidth,
    borderRadius: el.style.radius,
    boxShadow: el.style.shadow,
    paddingLeft: el.style.paddingX,
    paddingRight: el.style.paddingX,
    paddingTop: el.style.paddingY,
    paddingBottom: el.style.paddingY,
  };

  const wrapperClass = `relative cursor-pointer my-2 rounded ${isSelected ? "outline outline-2 outline-fuchsia-500 outline-offset-2" : "hover:outline hover:outline-1 hover:outline-fuchsia-300 hover:outline-offset-2"}`;

  switch (el.kind) {
    case "heading":
      return (
        <h2 onClick={onClick} className={wrapperClass} style={{ ...baseStyle, lineHeight: 1.2 }}>
          {el.text}
        </h2>
      );
    case "eyebrow":
      return (
        <p onClick={onClick} className={`${wrapperClass} uppercase tracking-widest`} style={baseStyle}>
          {el.text}
        </p>
      );
    case "paragraph":
      return (
        <p onClick={onClick} className={wrapperClass} style={{ ...baseStyle, lineHeight: 1.7 }}>
          {el.text}
        </p>
      );
    case "button":
      return (
        <div onClick={onClick} className={wrapperClass} style={{ textAlign: el.style.align }}>
          <a href={el.href || "#"} onClick={(e) => e.preventDefault()} className="inline-block" style={baseStyle}>
            {el.text}
          </a>
        </div>
      );
    case "image":
      return (
        <div onClick={onClick} className={wrapperClass} style={{ textAlign: el.style.align }}>
          <div
            className="w-full aspect-video bg-slate-200 flex items-center justify-center text-slate-400 text-xs"
            style={{ borderRadius: el.style.radius, boxShadow: el.style.shadow }}
          >
            <ImageIcon className="w-6 h-6" />
          </div>
        </div>
      );
    case "stat":
      return (
        <div onClick={onClick} className={wrapperClass} style={baseStyle}>
          {el.text.split("\n").map((line, i) => (
            <div key={i} style={i === 0 ? { fontSize: el.style.fontSize, fontWeight: el.style.fontWeight as any } : { fontSize: "12px", opacity: 0.7, marginTop: 4 }}>
              {line}
            </div>
          ))}
        </div>
      );
    case "icon-text":
      return (
        <div onClick={onClick} className={wrapperClass} style={baseStyle}>
          {el.text.split("\n").map((line, i) => (
            <div key={i} style={i === 0 ? { fontWeight: 700, marginBottom: 4 } : { opacity: 0.75 }}>
              {line}
            </div>
          ))}
        </div>
      );
    default:
      return null;
  }
}

function ToolbarBtn({ icon, onClick, title, danger }: { icon: React.ReactNode; onClick: () => void; title: string; danger?: boolean }) {
  return (
    <button
      onClick={(e) => {
        e.stopPropagation();
        onClick();
      }}
      title={title}
      className={`p-1.5 rounded-md transition-colors cursor-pointer ${danger ? "text-rose-400 hover:bg-rose-950" : "text-slate-400 hover:bg-slate-800 hover:text-white"}`}
    >
      {icon}
    </button>
  );
}

function PanelGroup({ label, icon, children }: { label: string; icon: React.ReactNode; children: React.ReactNode }) {
  const [open, setOpen] = useState(true);
  return (
    <div className="border border-slate-800 rounded-xl overflow-hidden">
      <button
        onClick={() => setOpen((o) => !o)}
        className="w-full flex items-center justify-between px-3 py-2.5 bg-slate-900 cursor-pointer"
      >
        <span className="flex items-center gap-1.5 text-[11px] font-black text-slate-300">
          {icon} {label}
        </span>
        <ChevronDown className={`w-3.5 h-3.5 text-slate-500 transition-transform ${open ? "rotate-180" : ""}`} />
      </button>
      {open && <div className="p-3 space-y-3 bg-slate-950/40">{children}</div>}
    </div>
  );
}

function FieldLabel({ icon, children }: { icon?: React.ReactNode; children: React.ReactNode }) {
  return (
    <label className="flex items-center gap-1 text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1.5">
      {icon} {children}
    </label>
  );
}

function ColorField({ label, value, onChange }: { label: string; value: string; onChange: (v: string) => void }) {
  return (
    <div>
      <FieldLabel>{label}</FieldLabel>
      <div className="flex items-center gap-2 bg-slate-900 border border-slate-800 rounded-lg px-2.5 py-1.5">
        <input type="color" value={value} onChange={(e) => onChange(e.target.value)} className="w-6 h-6 rounded cursor-pointer border-none bg-transparent" />
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="flex-1 bg-transparent text-[11px] text-white font-mono focus:outline-none"
        />
      </div>
    </div>
  );
}

function SelectField({
  label,
  value,
  options,
  onChange,
  renderOption,
}: {
  label: string;
  value: string;
  options: string[];
  onChange: (v: string) => void;
  renderOption?: (v: string) => string;
}) {
  return (
    <div>
      <FieldLabel>{label}</FieldLabel>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full bg-slate-900 border border-slate-800 rounded-lg px-2.5 py-2 text-[11px] text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
      >
        {options.map((o) => (
          <option key={o} value={o}>
            {renderOption ? renderOption(o) : o}
          </option>
        ))}
      </select>
    </div>
  );
}

function ToggleField({ label, value, onChange }: { label: string; value: boolean; onChange: (v: boolean) => void }) {
  return (
    <div className="flex items-center justify-between">
      <span className="text-[11px] text-slate-300 font-medium">{label}</span>
      <button
        onClick={() => onChange(!value)}
        className={`w-9 h-5 rounded-full transition-colors relative cursor-pointer ${value ? "bg-indigo-600" : "bg-slate-700"}`}
      >
        <span className={`absolute top-0.5 w-4 h-4 rounded-full bg-white transition-transform ${value ? "translate-x-[18px]" : "translate-x-0.5"}`} />
      </button>
    </div>
  );
}

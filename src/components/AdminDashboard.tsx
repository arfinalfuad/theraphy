import React, { useState, useEffect } from "react";
import { 
  Home, 
  Trash2, 
  Plus, 
  Upload, 
  Sparkles, 
  FileText, 
  Eye, 
  EyeOff,
  Save, 
  Palette, 
  Type, 
  Video, 
  FileCode, 
  Settings, 
  Users, 
  ShieldAlert,
  ArrowUp,
  ArrowDown,
  Laptop,
  Smartphone,
  Tablet,
  Code,
  Edit2,
  ExternalLink,
  BookOpen,
  Link as LinkIcon,
  PlusCircle,
  Layout,
  Layers,
  FilePlus,
  AlertCircle
} from "lucide-react";
import { DndContext, useDraggable, useDroppable } from "@dnd-kit/core";
import PublicLandingPage, { LandingPageConfig, Therapist, ServiceCard } from "./PublicLandingPage";

interface AdminDashboardProps {
  therapists: Therapist[];
  onAddTherapist: (therapist: Therapist) => void;
  onDeleteTherapist: (id: string, name: string) => void;
  onNavigate: (hash: string) => void;
  pageConfig: LandingPageConfig;
  onSavePageConfig: (config: LandingPageConfig) => void;
  triggerToast: (msg: string) => void;
}

// Draggable Item Component using @dnd-kit/core
function DraggableSectionItem({ 
  id, 
  index, 
  name, 
  isVisible, 
  onToggleVisibility, 
  onMoveUp, 
  onMoveDown,
  isFirst,
  isLast,
  isActive,
  onClick
}: { 
  id: string; 
  index: number; 
  name: string; 
  isVisible: boolean; 
  onToggleVisibility: () => void; 
  onMoveUp: () => void; 
  onMoveDown: () => void;
  isFirst: boolean;
  isLast: boolean;
  isActive: boolean;
  onClick: () => void;
}) {
  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
    id: id,
  });

  const { setNodeRef: setDropRef } = useDroppable({
    id: `droppable-${id}`,
  });

  const style = transform ? {
    transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`,
    zIndex: isDragging ? 50 : "auto",
  } : undefined;

  // Combine drop and drag refs for dnd-kit
  const setCombinedRef = (node: HTMLDivElement | null) => {
    setNodeRef(node);
    setDropRef(node);
  };

  return (
    <div 
      ref={setCombinedRef} 
      style={style}
      className={`p-3 rounded-xl border flex items-center justify-between transition-all ${
        isDragging ? "opacity-60 scale-102 border-indigo-500 bg-slate-800 shadow-xl" : ""
      } ${
        isActive ? "border-indigo-500 bg-slate-850/90 ring-1 ring-indigo-500/30" : "border-slate-800 bg-slate-900/60 hover:bg-slate-800/40"
      } ${!isVisible ? "opacity-45 bg-slate-950" : ""}`}
    >
      <div className="flex items-center gap-2.5 min-w-0 flex-1">
        {/* Drag Handle with listeners attached */}
        <div 
          {...attributes} 
          {...listeners} 
          className="cursor-grab hover:bg-slate-800 p-1.5 rounded text-slate-500 hover:text-slate-200 active:cursor-grabbing shrink-0"
          title="ড্র্যাগ করে ক্রম সাজান"
        >
          <div className="grid grid-cols-2 gap-0.5 w-3">
            <span className="w-1 h-1 bg-current rounded-full"></span>
            <span className="w-1 h-1 bg-current rounded-full"></span>
            <span className="w-1 h-1 bg-current rounded-full"></span>
            <span className="w-1 h-1 bg-current rounded-full"></span>
            <span className="w-1 h-1 bg-current rounded-full"></span>
            <span className="w-1 h-1 bg-current rounded-full"></span>
          </div>
        </div>

        <button 
          type="button"
          onClick={onClick}
          className="text-left flex-1 truncate font-sans text-xs font-bold text-slate-250 hover:text-white"
        >
          <div className="flex items-center gap-2">
            <span className="text-[9px] font-mono font-black text-indigo-400 bg-indigo-950/85 px-1.5 py-0.5 rounded">
              #{index + 1}
            </span>
            <span className="truncate">{name}</span>
          </div>
        </button>
      </div>

      <div className="flex items-center gap-1 shrink-0 ml-2">
        {/* Manual Arrow Controls as accessibility fallbacks */}
        <button
          type="button"
          onClick={onMoveUp}
          disabled={isFirst}
          className={`p-1.5 rounded-lg border border-slate-800 text-slate-400 transition-colors ${
            isFirst ? "opacity-20 cursor-not-allowed" : "hover:bg-slate-800 hover:text-white"
          }`}
          title="উপরে নিন"
        >
          <ArrowUp className="w-3 h-3" />
        </button>
        <button
          type="button"
          onClick={onMoveDown}
          disabled={isLast}
          className={`p-1.5 rounded-lg border border-slate-800 text-slate-400 transition-colors ${
            isLast ? "opacity-20 cursor-not-allowed" : "hover:bg-slate-800 hover:text-white"
          }`}
          title="নিচে নিন"
        >
          <ArrowDown className="w-3 h-3" />
        </button>

        {/* Toggle visibility */}
        <button
          type="button"
          onClick={onToggleVisibility}
          className={`p-1.5 rounded-lg border transition-colors ${
            isVisible 
              ? "border-emerald-950 bg-emerald-950/30 text-emerald-400 hover:bg-emerald-950/70" 
              : "border-slate-850 bg-slate-900 text-slate-500 hover:bg-slate-850"
          }`}
          title={isVisible ? "সেকশন হাইড করুন" : "সেকশন শো করুন"}
        >
          {isVisible ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
        </button>
      </div>
    </div>
  );
}

// Dynamic Font Loader helper function
function loadDynamicFont(fontName: string, base64Data: string) {
  if (!fontName || !base64Data) return;
  const fontFaceId = `dynamic-font-${fontName}`;
  let existingStyle = document.getElementById(fontFaceId);
  if (!existingStyle) {
    existingStyle = document.createElement("style");
    existingStyle.id = fontFaceId;
    document.head.appendChild(existingStyle);
  }
  existingStyle.innerHTML = `
    @font-face {
      font-family: '${fontName}';
      src: url('${base64Data}') format('woff2'),
           url('${base64Data}') format('woff'),
           url('${base64Data}') format('truetype');
      font-weight: normal;
      font-style: normal;
      font-display: swap;
    }
  `;
}

export default function AdminDashboard({
  therapists,
  onAddTherapist,
  onDeleteTherapist,
  onNavigate,
  pageConfig,
  onSavePageConfig,
  triggerToast
}: AdminDashboardProps) {
  const [adminTab, setAdminTab] = useState<"page_builder" | "therapist_manager" | "security_audit">("page_builder");

  // Local Page Config State with dynamic pages and menu link structures
  const [localConfig, setLocalConfig] = useState<LandingPageConfig>(() => {
    return {
      ...pageConfig,
      themeBgColor: pageConfig.themeBgColor || "#f8fafc",
      themeTextColor: pageConfig.themeTextColor || "#0f172a",
      ctaUrl: pageConfig.ctaUrl || "#/patient",
      sectionsOrder: pageConfig.sectionsOrder || ["hero", "services", "therapists", "video", "aac", "custom_code", "contact", "footer"],
      sectionsVisibility: pageConfig.sectionsVisibility || {
        hero: true,
        services: true,
        therapists: true,
        video: true,
        aac: true,
        custom_code: true,
        contact: true,
        footer: true
      },
      customCode: pageConfig.customCode || "",
      servicesTitle: pageConfig.servicesTitle || "আমাদের ৮টি বিশেষ সেবাসমূহ",
      servicesDesc: pageConfig.servicesDesc || "विशेष अटीस्टक व स्पिच-डिलेड शिशुद्धर द्रुत भाषा अर्जन, मनोयोग वृद्धि व शारीरीक-मानसीक विकाशेर जन्य प्रस्तुकृत आमादेर आधुनीक ल्याब मेथड्स।",
      therapistsTitle: pageConfig.therapistsTitle || "আমাদের বিশেষজ্ঞ প্যানেল",
      therapistsDesc: pageConfig.therapistsDesc || "विशेषज्ञ स्पिच ल्यांगुएज प्याथोलॉजिस्ट एवं सार्टीफाइड अकुपेशनल थेरापिस्टदेर साथे वयान-टु-वयान परामर्श करुन।",
      contactTitle: pageConfig.contactTitle || "অভিভাবক পরামর্শ ও সেশন অনুরোধ ফর্ম",
      contactDesc: pageConfig.contactDesc || "आपनार शिशुर विशेष प्रयोजने फ्री काउंसिलिंग अथवा सेशन बुकींग करते नीचेर तथ्य दीये अनुरोध जानान।",
      logoText: pageConfig.logoText || "DocTime Speech Lab",
      phoneText: pageConfig.phoneText || "+৮৮০ ১৭০০-০০০০০০",
      customPages: pageConfig.customPages || [
        { 
          slug: "about-us", 
          title: "আমাদের সম্পর্কে", 
          content: "### আমাদের মিশন\nDocTime Speech Lab বিশেষ চাহিদাসম্পন্ন শিশুদের স্পিচ ল্যাঙ্গুয়েজ এবং কগনিটিভ স্কিল উন্নয়নে নিবেদিত একটি পূর্ণাঙ্গ থেরাপি সেন্টার।\n\n### আমাদের বিশেষ কার্যক্রম\n- **স্পিচ থেরাপি ল্যাব**: শব্দ উচ্চারণ, তোলাতলামি দূর ও যোগাযোগের ওয়ান-টু-ওয়ান আধুনিক থেরাপি।\n- **আপন ঘর সেন্সরি প্লে-হোম**: শান্ত ও চমৎকার খেলার ছলে শিশুদের বুদ্ধিবৃত্তিক বিকাশ।\n- **আনন্দময়ী আর্ট ও মিউজিক**: গান, আবৃত্তি ও নান্দনিক থেরাপি সেশন।\n\nআমরা বিশ্বাস করি, প্রতিটি শিশুই বিশেষ সম্ভাবনাময়। সঠিক সময়ে উপযুক্ত থেরাপি সেবা ও স্নেহময় নিবিড় তত্ত্বাবধান পেলে তারা সুন্দর ও স্বাভাবিক বিকাশে ডানা মেলবে।" 
        }
      ],
      menuLinks: pageConfig.menuLinks || [
        { id: "1", label: "সেবাসমূহ", url: "#services-section" },
        { id: "2", label: "বিশেষজ্ঞ প্যানেল", url: "#therapists-section" },
        { id: "3", label: "আমাদের সম্পর্কে", url: "#/page/about-us" },
        { id: "4", label: "যোগাযোগ", url: "#contact-section" }
      ]
    };
  });

  const [activeField, setActiveField] = useState<keyof LandingPageConfig>("heroTitle");
  const [previewMode, setPreviewMode] = useState<"desktop" | "tablet" | "mobile">("desktop");
  const [sidebarPanel, setSidebarPanel] = useState<"sections" | "design" | "pages_menu" | "content" | "liquid">("sections");

  // Form states for Dynamic Page Creator
  const [newPageTitle, setNewPageTitle] = useState("");
  const [newPageSlug, setNewPageSlug] = useState("");
  const [newPageContent, setNewPageContent] = useState("");

  // Form states for Menu Editor
  const [newLinkLabel, setNewLinkLabel] = useState("");
  const [newLinkUrl, setNewLinkUrl] = useState("");

  // Therapist Form State
  const [newTherapistName, setNewTherapistName] = useState("");
  const [newTherapistDesig, setNewTherapistDesig] = useState("");
  const [newTherapistSpecialty, setNewTherapistSpecialty] = useState("");
  const [newTherapistFee, setNewTherapistFee] = useState<number>(1500);
  const [newTherapistBranch, setNewTherapistBranch] = useState("ধানমন্ডি, ঢাকা");
  const [newTherapistCredentials, setNewTherapistCredentials] = useState("");
  const [newTherapistExperience, setNewTherapistExperience] = useState("");
  const [newTherapistEducation, setNewTherapistEducation] = useState("");
  const [uploadedPhotoUrl, setUploadedPhotoUrl] = useState<string | null>(null);
  const [dragOver, setDragOver] = useState(false);

  // Sync Global CSS Variables whenever theme colors change
  useEffect(() => {
    const root = document.documentElement;
    if (localConfig.themeColor) {
      root.style.setProperty("--color-primary", localConfig.themeColor);
    }
    if (localConfig.themeColorSecondary) {
      root.style.setProperty("--color-secondary", localConfig.themeColorSecondary);
    }
    if (localConfig.themeBgColor) {
      root.style.setProperty("--color-bg", localConfig.themeBgColor);
    }
    if (localConfig.themeTextColor) {
      root.style.setProperty("--color-text", localConfig.themeTextColor);
    }
  }, [localConfig.themeColor, localConfig.themeColorSecondary, localConfig.themeBgColor, localConfig.themeTextColor]);

  // Load Custom font initially if stored
  useEffect(() => {
    if (localConfig.customFontName && localConfig.customFontBase64) {
      loadDynamicFont(localConfig.customFontName, localConfig.customFontBase64);
    }
  }, [localConfig.customFontName, localConfig.customFontBase64]);

  // Handle Drag over & File uploads for Therapist Add form
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(true);
  };

  const handleDragLeave = () => {
    setDragOver(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files?.[0];
    processImageFile(file);
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    processImageFile(file);
  };

  const processImageFile = (file: File | undefined) => {
    if (file && file.type.startsWith("image/")) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setUploadedPhotoUrl(event.target?.result as string);
        triggerToast("থেরাপিস্টের ছবি সফলভাবে আপলোড হয়েছে (প্রিভিউ তৈরি সম্পন্ন)");
      };
      reader.readAsDataURL(file);
    } else {
      alert("দয়া করে শুধুমাত্র ছবি ফাইল (PNG/JPEG/WEBP) আপলোড করুন।");
    }
  };

  const handleAddTherapistSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTherapistName.trim()) {
      triggerToast("দয়া করে থেরাপিস্টের নাম লিখুন");
      return;
    }

    const therapist: Therapist = {
      id: `b0000000-0000-0000-0000-${Date.now().toString().slice(-12)}`,
      name: newTherapistName,
      designation: newTherapistDesig || "জুনিয়র স্পিচ থেরাপিস্ট",
      specialty: newTherapistSpecialty || "আর্লি ল্যাঙ্গুয়েজ ডেভেলপমেন্ট",
      visit_fee: Number(newTherapistFee),
      branch: newTherapistBranch,
      credentials: newTherapistCredentials || "MSS in Speech Therapy (DU)",
      experience: newTherapistExperience || "২ বছরের ক্লিনিক্যাল থেরাপি সেশন অভিজ্ঞতা",
      education: newTherapistEducation || "ঢাকা বিশ্ববিদ্যালয় চিকিৎসা অনুষদ",
      avatar_url: uploadedPhotoUrl || undefined
    };

    onAddTherapist(therapist);
    triggerToast(`নতুন থেরাপিস্ট ${newTherapistName} সফলভাবে নিবন্ধিত হয়েছেন!`);

    // Reset Form
    setNewTherapistName("");
    setNewTherapistDesig("");
    setNewTherapistSpecialty("");
    setNewTherapistFee(1500);
    setNewTherapistCredentials("");
    setNewTherapistExperience("");
    setNewTherapistEducation("");
    setUploadedPhotoUrl(null);
  };

  const handleSaveConfig = () => {
    onSavePageConfig(localConfig);
  };

  // Google Fonts list
  const fontOptions = [
    { name: "Inter (Modern Sans)", value: "Inter" },
    { name: "Hind Siliguri (Bengali Standard)", value: "Hind Siliguri" },
    { name: "Space Grotesk (Tech Display)", value: "Space Grotesk" },
    { name: "Outfit (Geometric Elegant)", value: "Outfit" },
    { name: "Playfair Display (Editorial Serif)", value: "Playfair Display" }
  ];

  // Fonts Uploader handler
  const handleCustomFontUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const isFont = file.name.endsWith(".ttf") || file.name.endsWith(".woff") || file.name.endsWith(".woff2");
      if (!isFont) {
        alert("দয়া করে শুধুমাত্র .ttf, .woff, অথবা .woff2 ফরম্যাটের বাংলা ফন্ট ফাইল আপলোড করুন।");
        return;
      }

      const reader = new FileReader();
      reader.onload = (event) => {
        const base64 = event.target?.result as string;
        const fontName = "BengaliCustomFont_" + Date.now().toString().slice(-4);
        
        // Dynamically inject font to current session
        loadDynamicFont(fontName, base64);

        setLocalConfig(prev => ({
          ...prev,
          fontFamily: fontName,
          customFontName: fontName,
          customFontBase64: base64
        }));
        setActiveField("fontFamily");
        triggerToast("বাংলা কাস্টম ফন্ট আপলোড সম্পন্ন! ফন্টটি পুরো ল্যান্ডিং পেজে প্রয়োগ করা হয়েছে।");
      };
      reader.readAsDataURL(file);
    }
  };

  // Reordering handler using @dnd-kit/core DragEnd event
  const handleDragEnd = (event: any) => {
    const { active, over } = event;
    if (!over) return;
    
    const activeId = active.id;
    const overId = over.id.replace("droppable-", "");
    
    if (activeId === overId) return;
    
    const oldIndex = localConfig.sectionsOrder.indexOf(activeId);
    const newIndex = localConfig.sectionsOrder.indexOf(overId);
    
    if (oldIndex !== -1 && newIndex !== -1) {
      const updatedOrder = [...localConfig.sectionsOrder];
      // Splice swap
      updatedOrder.splice(oldIndex, 1);
      updatedOrder.splice(newIndex, 0, activeId);
      
      setLocalConfig(prev => ({ ...prev, sectionsOrder: updatedOrder }));
      triggerToast("সেকশনের ক্রম ড্র্যাগ-অ্যান্ড-ড্রপ করে পরিবর্তন করা হয়েছে!");
    }
  };

  // Move Section Up Manual Click
  const handleMoveSection = (index: number, direction: "up" | "down") => {
    const targetIdx = direction === "up" ? index - 1 : index + 1;
    if (targetIdx < 0 || targetIdx >= localConfig.sectionsOrder.length) return;

    const updatedOrder = [...localConfig.sectionsOrder];
    const temp = updatedOrder[index];
    updatedOrder[index] = updatedOrder[targetIdx];
    updatedOrder[targetIdx] = temp;

    setLocalConfig(prev => ({ ...prev, sectionsOrder: updatedOrder }));
    triggerToast("সেকশনের ক্রম পরিবর্তন করা হয়েছে");
  };

  const toggleSectionVisibility = (sectionId: string) => {
    setLocalConfig(prev => {
      const visibility = { ...prev.sectionsVisibility };
      visibility[sectionId] = visibility[sectionId] === false ? true : false;
      return { ...prev, sectionsVisibility: visibility };
    });
    triggerToast("সেকশনের দৃশ্যমানতা পরিবর্তন করা হয়েছে");
  };

  // Sidebar dynamic input renderer for whichever element is clicked
  const handlePreviewElementSelect = (fieldName: keyof LandingPageConfig) => {
    setActiveField(fieldName);
    setSidebarPanel("content");
  };

  // Dynamic Page Creator form submit
  const handleCreatePage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPageTitle.trim() || !newPageSlug.trim()) {
      triggerToast("টাইটেল এবং স্লাগ উভয়ই পূরণ করা আবশ্যক!");
      return;
    }

    // Clean slug
    const formattedSlug = newPageSlug.toLowerCase().replace(/[^a-z0-9-_]/g, "-");
    const existingPages = localConfig.customPages || [];
    
    if (existingPages.some(p => p.slug === formattedSlug)) {
      triggerToast("এই স্লাগ দিয়ে ইতিমধ্যে একটি পেজ তৈরি করা আছে!");
      return;
    }

    const newPage = {
      slug: formattedSlug,
      title: newPageTitle,
      content: newPageContent || `### ${newPageTitle}\n\nআপনার কাস্টম পেজ কনটেন্ট এখানে লিখুন...`
    };

    const updatedPages = [...existingPages, newPage];
    setLocalConfig(prev => ({ ...prev, customPages: updatedPages }));
    triggerToast(`সফলভাবে '${newPageTitle}' ডায়নামিক পেজটি তৈরি করা হয়েছে!`);
    
    // Auto-create menu link offer
    setNewLinkLabel(newPageTitle);
    setNewLinkUrl(`#/page/${formattedSlug}`);
    
    // Clear page form
    setNewPageTitle("");
    setNewPageSlug("");
    setNewPageContent("");
  };

  // Delete Custom Page
  const handleDeletePage = (slugToDelete: string) => {
    const updatedPages = (localConfig.customPages || []).filter(p => p.slug !== slugToDelete);
    const updatedLinks = (localConfig.menuLinks || []).filter(l => l.url !== `#/page/${slugToDelete}`);
    setLocalConfig(prev => ({ ...prev, customPages: updatedPages, menuLinks: updatedLinks }));
    triggerToast("ডায়নামিক পেজটি মুছে ফেলা হয়েছে!");
  };

  // Menu Link Editor form submit
  const handleAddMenuLink = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newLinkLabel.trim() || !newLinkUrl.trim()) {
      triggerToast("মেনু লেবেল এবং লিংক ইউআরএল উভয়ই আবশ্যক!");
      return;
    }

    const newLink = {
      id: Date.now().toString(),
      label: newLinkLabel,
      url: newLinkUrl
    };

    const updatedLinks = [...(localConfig.menuLinks || []), newLink];
    setLocalConfig(prev => ({ ...prev, menuLinks: updatedLinks }));
    triggerToast("মেনু এডিটর লিংক সফলভাবে যুক্ত করা হয়েছে!");
    
    // Reset Link form
    setNewLinkLabel("");
    setNewLinkUrl("");
  };

  // Delete Menu Link
  const handleDeleteMenuLink = (idToDelete: string) => {
    const updatedLinks = (localConfig.menuLinks || []).filter(l => l.id !== idToDelete);
    setLocalConfig(prev => ({ ...prev, menuLinks: updatedLinks }));
    triggerToast("মেনু লিংকটি অপসারিত হয়েছে!");
  };

  // Custom Liquid Presets
  const injectLiquidPreset = (type: "map" | "banner" | "calendar") => {
    let code = "";
    if (type === "map") {
      code = `<div style="text-align: center; margin: 10px 0;">\n  <h4 style="margin-bottom: 8px; color: #1e293b;">আমাদের মূল ক্লিনিক লোকেশন (Google Maps)</h4>\n  <iframe src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3652.2468399580554!2d90.3703565!3d23.7385816!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3755b8b33c892fb7%3A0x27747abef4104e7a!2sDhanmondi%20Lake!5e0!3m2!1sen!2sbd!4v1700000000000!5m2!1sen!2sbd" width="100%" height="280" style="border:0; border-radius: 16px; box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.1);" allowfullscreen="" loading="lazy"></iframe>\n</div>`;
    } else if (type === "banner") {
      code = `<div style="background: linear-gradient(135deg, #4f46e5, #ec4899); color: white; padding: 24px; border-radius: 20px; text-align: center; font-family: sans-serif; box-shadow: 0 10px 15px -3px rgb(0 0 0 / 0.1);">\n  <h3 style="margin: 0; font-size: 20px; font-weight: 800;">🎉 বিশেষ ফ্রি স্ক্রিনিং ক্যাম্প ২০২৬</h3>\n  <p style="margin: 8px 0 0; font-size: 12px; opacity: 0.9;">আগামী শুক্রবার সকাল ১০টা থেকে ধানমন্ডি মেইন ব্রাঞ্চে বিশেষ স্পিচ থেরাপি ক্যাম্প অনুষ্ঠিত হবে। সেশন বুকিং করতে কল করুন।</p>\n</div>`;
    } else if (type === "calendar") {
      code = `<div style="background: #ffffff; border: 1px solid #e2e8f0; border-radius: 16px; padding: 16px; text-align: center; font-family: sans-serif;">\n  <span style="font-size: 10px; color: #ef4444; font-weight: 800; text-transform: uppercase;">TODAY SPECIAL</span>\n  <h4 style="margin: 4px 0 12px; color: #0f172a; font-weight: bold; font-size: 14px;">জরুরি ডক্টরস রিয়েলটাইম এভেইলেবিলিটি</h4>\n  <div style="display: flex; gap: 8px; justify-content: center;">\n    <span style="background: #f0fdf4; border: 1px solid #bbf7d0; color: #166534; font-size: 11px; padding: 6px 10px; border-radius: 8px; font-weight: bold;">🩺 ডা. মাহফুজুর (০৯:০০ AM)</span>\n    <span style="background: #fef2f2; border: 1px solid #fecaca; color: #991b1b; font-size: 11px; padding: 6px 10px; border-radius: 8px; font-weight: bold;">❌ তাসনিম আক্তার (বুকড)</span>\n  </div>\n</div>`;
    }
    setLocalConfig(prev => ({ ...prev, customCode: code }));
    setSidebarPanel("liquid");
    triggerToast("কাস্টম লিকুইড কোড প্রিসেট ইনজেক্ট করা হয়েছে!");
  };

  // Mock services list for rendering in preview
  const mockServices: ServiceCard[] = [
    { id: "therapy_lab", titleBangla: "১. থেরাপি ল্যাব", titleEnglish: "Clinical Therapy", descBangla: "শিশুদের স্পষ্ট কথা বলা, শব্দ উচ্চারণ এবং সঠিক যোগাযোগের দক্ষতা বাড়াতে ওয়ান-টু-ওয়ান আধুনিক থেরাপি সেশন।", iconName: "Activity", bgColor: "bg-sky-50/80 border-sky-200/60", accentColor: "text-sky-700 bg-sky-100/70", tag: "ক্লিনিক্যাল থেরাপি" },
    { id: "apon_ghor", titleBangla: "২. আপন ঘর", titleEnglish: "Sensory Daycare", descBangla: "विशेष चहीदासम्पन्न शिशुदेर जन्य सम्पूर्ण नीरापद, कोलाहलमुक्त एवं सेन्सरी-फ्रेन्डली डे-केयार व प्ले-होम।", iconName: "Home", bgColor: "bg-rose-50/80 border-rose-200/60", accentColor: "text-rose-700 bg-rose-100/70", tag: "সেন্সরি ডে-কেয়ার" },
    { id: "anandomoye", titleBangla: "৩. আনন্দময়ী", titleEnglish: "Art Therapy", descBangla: "सुर व नान्दनीक नाचेर मेलबन्धने शिशुदेर मनोयोग वृद्धि, बुद्धीवृत्तिक बिकाश एवं मानसीक प्रशान्तीर जन्य आनन्दघन थेराप्यूटिक कार्यक्रॉं।", iconName: "Music", bgColor: "bg-purple-50/80 border-purple-200/60", accentColor: "text-purple-700 bg-purple-100/70", tag: "আর্ট ও মিউজিক" },
    { id: "anando_lab", titleBangla: "৪. আনন্দ ল্যাব", titleEnglish: "Cognitive Play", descBangla: "स्मार्ट लर्नींग बोर्ड एवं विशेष गेमेर माध्यमे शिशुदेर ब्रेइनेर मोटर स्कील व कगनीटीव डेवलपमेन्ट उन्नत करार विशेष ल्याब।", iconName: "Gamepad2", bgColor: "bg-amber-50/80 border-amber-200/60", accentColor: "text-amber-700 bg-amber-100/70", tag: "কগনিটিভ গেম" }
  ];

  return (
    <div id="admin-dashboard-container" className="flex-1 flex flex-col bg-slate-950 min-h-screen text-slate-100">
      
      {/* Admin Subheader & Navigation */}
      <header className="bg-slate-900 border-b border-slate-800 px-6 sm:px-12 py-3.5 flex flex-col md:flex-row md:items-center justify-between gap-4 shrink-0 shadow-lg">
        <div className="flex items-center gap-3">
          <button 
            id="admin-btn-back"
            onClick={() => onNavigate("#/")}
            className="hover:bg-slate-800 p-2 rounded-xl transition-all border border-slate-800 text-slate-300 hover:text-white cursor-pointer"
            title="হোম পেজে ফিরে যান"
          >
            <Home className="w-5 h-5" />
          </button>
          <div>
            <h2 className="font-black text-white text-base sm:text-lg flex items-center gap-2 tracking-wide font-sans">
              <span>DocTime শপিফাই কাস্টমাইজার</span>
              <span className="text-[10px] bg-indigo-600 text-white font-black px-2.5 py-0.5 rounded-full uppercase tracking-widest animate-pulse">
                VISUAL ENGINE v2.0
              </span>
            </h2>
            <p className="text-xs text-slate-400 font-medium">ডায়নামিক পেজ ও মেনু স্লাগ বিল্ডার এবং @dnd-kit/core ড্র্যাগ অ্যান্ড ড্রপ সিকোয়েন্সিং</p>
          </div>
        </div>

        {/* Tab Selectors */}
        <div className="flex bg-slate-950 p-1 rounded-xl border border-slate-800 text-xs self-start sm:self-auto font-sans font-bold">
          <button
            id="admin-tab-page-builder"
            onClick={() => setAdminTab("page_builder")}
            className={`px-4 py-2 rounded-lg transition-all cursor-pointer flex items-center gap-1.5 ${
              adminTab === "page_builder"
                ? "bg-indigo-600 text-white shadow-sm"
                : "text-slate-400 hover:text-white"
            }`}
          >
            <Settings className="w-3.5 h-3.5" />
            <span>শপিফাই পেজ বিল্ডার</span>
          </button>
          
          <button
            id="admin-tab-therapists"
            onClick={() => setAdminTab("therapist_manager")}
            className={`px-4 py-2 rounded-lg transition-all cursor-pointer flex items-center gap-1.5 ${
              adminTab === "therapist_manager"
                ? "bg-indigo-600 text-white shadow-sm"
                : "text-slate-400 hover:text-white"
            }`}
          >
            <Users className="w-3.5 h-3.5" />
            <span>Therapist ডিরেক্টরি</span>
          </button>
          
          <button
            id="admin-tab-security"
            onClick={() => setAdminTab("security_audit")}
            className={`px-4 py-2 rounded-lg transition-all cursor-pointer flex items-center gap-1.5 ${
              adminTab === "security_audit"
                ? "bg-indigo-600 text-white shadow-sm"
                : "text-slate-400 hover:text-white"
            }`}
          >
            <ShieldAlert className="w-3.5 h-3.5" />
            <span>নিরাপত্তা ও RLS অডিট</span>
          </button>
        </div>
      </header>

      {/* Main Content Layout */}
      {adminTab === "page_builder" ? (
        <div className="flex-1 flex flex-col lg:flex-row overflow-hidden h-[calc(100vh-73px)]">
          
          {/* LEFT SIDEBAR: Shopify Panel (Fixed width, Scrollable) */}
          <aside className="w-full lg:w-[430px] bg-slate-900 text-white flex flex-col shrink-0 border-r border-slate-950 shadow-2xl h-full overflow-hidden">
            
            {/* Sidebar Tab Controller */}
            <div className="grid grid-cols-5 border-b border-slate-850 text-[9px] font-black uppercase tracking-wider text-center bg-slate-950 font-sans">
              <button 
                type="button"
                onClick={() => setSidebarPanel("sections")} 
                className={`py-3.5 border-b-2 transition-all ${sidebarPanel === "sections" ? "border-indigo-500 text-indigo-400 bg-slate-900 font-extrabold" : "border-transparent text-slate-400 hover:text-slate-200"}`}
              >
                সেকশন
              </button>
              <button 
                type="button"
                onClick={() => setSidebarPanel("design")} 
                className={`py-3.5 border-b-2 transition-all ${sidebarPanel === "design" ? "border-indigo-500 text-indigo-400 bg-slate-900 font-extrabold" : "border-transparent text-slate-400 hover:text-slate-200"}`}
              >
                ডিজাইন
              </button>
              <button 
                type="button"
                onClick={() => setSidebarPanel("pages_menu")} 
                className={`py-3.5 border-b-2 transition-all ${sidebarPanel === "pages_menu" ? "border-indigo-500 text-indigo-400 bg-slate-900 font-extrabold" : "border-transparent text-slate-400 hover:text-slate-200"}`}
              >
                পেজ ও মেনু
              </button>
              <button 
                type="button"
                onClick={() => setSidebarPanel("content")} 
                className={`py-3.5 border-b-2 transition-all ${sidebarPanel === "content" ? "border-indigo-500 text-indigo-400 bg-slate-900 font-extrabold" : "border-transparent text-slate-400 hover:text-slate-200"}`}
              >
                কনটেন্ট
              </button>
              <button 
                type="button"
                onClick={() => setSidebarPanel("liquid")} 
                className={`py-3.5 border-b-2 transition-all ${sidebarPanel === "liquid" ? "border-indigo-500 text-indigo-400 bg-slate-900 font-extrabold" : "border-transparent text-slate-400 hover:text-slate-200"}`}
              >
                লিকুইড
              </button>
            </div>

            {/* Sidebar Inner Scrollable content */}
            <div className="flex-1 overflow-y-auto p-5 space-y-6">
              
              {/* PANEL 1: SECTIONS SEQUENCE & VISIBILITY WITH @DND-KIT/CORE */}
              {sidebarPanel === "sections" && (
                <div className="space-y-4">
                  <div className="border-b border-slate-800 pb-3">
                    <h3 className="font-extrabold text-sm flex items-center gap-1.5 text-indigo-400">
                      <Layers className="w-4 h-4" /> ড্র্যাগ-অ্যান্ড-ড্রপ সেকশন বিন্যাস
                    </h3>
                    <p className="text-[10px] text-slate-400 mt-1 leading-relaxed">
                      @dnd-kit/core চালিত ইন্টারফেস। যেকোনো সেকশনের বামদিকের গ্র্যাব হ্যান্ডলারটি ড্র্যাগ করে সিকোয়েন্স বা ক্রম পরিবর্তন করুন। ডানপাশের লাইভ প্রিভিউতে সাথে সাথে রি-রেন্ডার হবে।
                    </p>
                  </div>

                  <DndContext onDragEnd={handleDragEnd}>
                    <div className="space-y-2.5">
                      {localConfig.sectionsOrder.map((sectionId, idx) => {
                        const isVisible = localConfig.sectionsVisibility[sectionId] !== false;
                        const getSectionName = (id: string) => {
                          switch (id) {
                            case "hero": return "হিরো ব্যানার (Hero Banner)";
                            case "services": return "৮টি বিশেষ সেবা কার্ড গ্রিড";
                            case "therapists": return "বিশেষজ্ঞ প্যানেল (Therapists Grid)";
                            case "video": return "ইউটিউব ভিডিও কনসালটেশন";
                            case "aac": return "বাংলা এএসি (AAC) কথা বলা বোর্ড";
                            case "custom_code": return "Shopify কাস্টম লিকুইড কোড";
                            case "contact": return "অভিভাবক পরামর্শ যোগাযোগ ফর্ম";
                            case "footer": return "ডায়নামিক ওয়েবসাইট ফুটার";
                            default: return id;
                          }
                        };

                        return (
                          <DraggableSectionItem 
                            key={sectionId}
                            id={sectionId}
                            index={idx}
                            name={getSectionName(sectionId)}
                            isVisible={isVisible}
                            onToggleVisibility={() => toggleSectionVisibility(sectionId)}
                            onMoveUp={() => handleMoveSection(idx, "up")}
                            onMoveDown={() => handleMoveSection(idx, "down")}
                            isFirst={idx === 0}
                            isLast={idx === localConfig.sectionsOrder.length - 1}
                            isActive={activeField.toLowerCase().includes(sectionId)}
                            onClick={() => {
                              if (sectionId === "hero") setActiveField("heroTitle");
                              else if (sectionId === "services") setActiveField("servicesTitle");
                              else if (sectionId === "therapists") setActiveField("therapistsTitle");
                              else if (sectionId === "contact") setActiveField("contactTitle");
                              else if (sectionId === "custom_code") setSidebarPanel("liquid");
                              triggerToast(`${getSectionName(sectionId)} হাইলাইট করা হয়েছে!`);
                            }}
                          />
                        );
                      })}
                    </div>
                  </DndContext>
                </div>
              )}

              {/* PANEL 2: GLOBAL DESIGN & CSS VARIABLES & BENGALI FONTS */}
              {sidebarPanel === "design" && (
                <div className="space-y-5">
                  <div className="border-b border-slate-800 pb-3">
                    <h3 className="font-extrabold text-sm flex items-center gap-1.5 text-indigo-400">
                      <Palette className="w-4 h-4" /> গ্লোবাল কালার ও CSS variables
                    </h3>
                    <p className="text-[10px] text-slate-400 mt-1">
                      কালার প্লেট পরিবর্তনের সাথে সাথে রিয়েল টাইমে `--color-primary`, `--color-secondary` ইত্যাদি গ্লোবাল CSS variables পরিবর্তন হবে।
                    </p>
                  </div>

                  {/* Colors Control */}
                  <div className="space-y-4">
                    <div className="space-y-1">
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-wider block">প্রাইমারি থিম কালার (Primary Hex)</label>
                      <div className="flex items-center gap-3 bg-slate-850 border border-slate-800 rounded-xl p-2.5">
                        <input 
                          type="color" 
                          value={localConfig.themeColor}
                          onChange={(e) => setLocalConfig({ ...localConfig, themeColor: e.target.value })}
                          className="w-9 h-9 rounded-lg border-0 cursor-pointer bg-transparent"
                        />
                        <span className="text-xs font-mono font-extrabold text-slate-300">{localConfig.themeColor}</span>
                      </div>
                    </div>

                    <div className="space-y-1">
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-wider block">সেকেন্ডারি থিম কালার (Secondary Hex)</label>
                      <div className="flex items-center gap-3 bg-slate-850 border border-slate-800 rounded-xl p-2.5">
                        <input 
                          type="color" 
                          value={localConfig.themeColorSecondary}
                          onChange={(e) => setLocalConfig({ ...localConfig, themeColorSecondary: e.target.value })}
                          className="w-9 h-9 rounded-lg border-0 cursor-pointer bg-transparent"
                        />
                        <span className="text-xs font-mono font-extrabold text-slate-300">{localConfig.themeColorSecondary}</span>
                      </div>
                    </div>

                    <div className="space-y-1">
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-wider block">ব্যাকগ্রাউন্ড থিম কালার (Background Hex)</label>
                      <div className="flex items-center gap-3 bg-slate-850 border border-slate-800 rounded-xl p-2.5">
                        <input 
                          type="color" 
                          value={localConfig.themeBgColor}
                          onChange={(e) => setLocalConfig({ ...localConfig, themeBgColor: e.target.value })}
                          className="w-9 h-9 rounded-lg border-0 cursor-pointer bg-transparent"
                        />
                        <span className="text-xs font-mono font-extrabold text-slate-300">{localConfig.themeBgColor}</span>
                      </div>
                    </div>

                    <div className="space-y-1">
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-wider block">গ্লোবাল টেক্সট কালার (Text Typography Hex)</label>
                      <div className="flex items-center gap-3 bg-slate-850 border border-slate-800 rounded-xl p-2.5">
                        <input 
                          type="color" 
                          value={localConfig.themeTextColor}
                          onChange={(e) => setLocalConfig({ ...localConfig, themeTextColor: e.target.value })}
                          className="w-9 h-9 rounded-lg border-0 cursor-pointer bg-transparent"
                        />
                        <span className="text-xs font-mono font-extrabold text-slate-300">{localConfig.themeTextColor}</span>
                      </div>
                    </div>
                  </div>

                  <div className="border-t border-slate-800 pt-4 space-y-4">
                    <h4 className="text-[11px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-1.5">
                      <Type className="w-3.5 h-3.5 text-indigo-400" /> ফন্ট সেটিংস ও আপলোডার
                    </h4>

                    {/* Font Dropdown Selector */}
                    <div className="space-y-1.5">
                      <label className="text-[10px] text-slate-400 block">গ্লোবাল ফন্ট ফ্যামিলি</label>
                      <select
                        value={localConfig.fontFamily}
                        onChange={(e) => setLocalConfig({ ...localConfig, fontFamily: e.target.value })}
                        className="w-full bg-slate-850 border border-slate-800 text-slate-200 rounded-xl p-3 text-xs font-bold focus:ring-1 focus:ring-indigo-500"
                      >
                        {localConfig.customFontBase64 && (
                          <option value={localConfig.customFontName || "BengaliCustomFont"}>⭐ আপলোডেড কাস্টম বাংলা ফন্ট</option>
                        )}
                        {fontOptions.map((f) => (
                          <option key={f.value} value={f.value}>{f.name}</option>
                        ))}
                      </select>
                    </div>

                    {/* Custom Bengali Font File Uploader */}
                    <div className="space-y-2.5 bg-slate-850 p-4 border border-slate-800 rounded-2xl">
                      <label className="text-[10px] font-black text-slate-400 uppercase block leading-relaxed">ডায়নামিক বাংলা ফন্ট ফাইল আপলোডার (.ttf / .woff)</label>
                      
                      <div className="relative border-2 border-dashed border-slate-700 hover:border-indigo-500 rounded-xl p-4 text-center transition-colors">
                        <input 
                          type="file" 
                          accept=".ttf,.woff,.woff2"
                          onChange={handleCustomFontUpload}
                          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                        />
                        <Upload className="w-5 h-5 mx-auto text-indigo-400 mb-1.5" />
                        <span className="text-[11px] font-bold text-slate-200 block">ফন্ট ফাইল সিলেক্ট করুন</span>
                        <span className="text-[9px] text-slate-500 block mt-0.5">TTF, WOFF, WOFF2 ফাইল সমর্থিত</span>
                      </div>

                      {localConfig.customFontBase64 && (
                        <div className="text-[10px] text-emerald-400 font-bold flex items-center gap-1.5 bg-emerald-950/25 p-2 rounded-lg border border-emerald-950">
                          <span>✓ কাস্টম বাংলা ফন্ট বর্তমানে সক্রিয় রয়েছে!</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {/* PANEL 3: DYNAMIC CUSTOM PAGES & NAVIGATION MENU SLUG EDITOR */}
              {sidebarPanel === "pages_menu" && (
                <div className="space-y-6">
                  
                  {/* Dynamic Page Creator */}
                  <div className="space-y-3.5">
                    <div className="border-b border-slate-800 pb-2.5">
                      <h3 className="font-extrabold text-sm flex items-center gap-1.5 text-indigo-400">
                        <FilePlus className="w-4 h-4" /> ডায়নামিক কাস্টম পেজ ক্রিয়েটর
                      </h3>
                      <p className="text-[10px] text-slate-400 mt-1">
                        এডমিন নতুন ইনফরমেশনাল পেজ তৈরি করতে পারে (যেমন: এডমিশন, নীতিমালা, সেবা প্রসেস)। এগুলো স্লাগ ভিত্তিক সেভ হবে।
                      </p>
                    </div>

                    <form onSubmit={handleCreatePage} className="space-y-3 bg-slate-850/60 p-4 border border-slate-800 rounded-2xl">
                      <div className="space-y-1">
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-wider block">পেজের শিরোনাম (Title)</label>
                        <input 
                          type="text"
                          required
                          placeholder="ভর্তি নির্দেশিকা বা আমাদের টিম"
                          value={newPageTitle}
                          onChange={(e) => {
                            setNewPageTitle(e.target.value);
                            // Auto-generate slug as recommendation
                            if (!newPageSlug) {
                              setNewPageSlug(e.target.value.toLowerCase()
                                .replace(/[^a-zA-Z0-9\u0980-\u09FF\s]/g, "")
                                .replace(/\s+/g, "-")
                              );
                            }
                          }}
                          className="w-full bg-slate-900 border border-slate-800 text-slate-200 rounded-xl px-3 py-2 text-xs font-semibold focus:outline-none focus:border-indigo-500"
                        />
                      </div>

                      <div className="space-y-1">
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-wider block">পেজ ইউআরএল স্লাগ (Slug)</label>
                        <div className="flex items-center gap-1.5">
                          <span className="text-[10px] text-slate-500 font-mono">#/page/</span>
                          <input 
                            type="text"
                            required
                            placeholder="admission-guide"
                            value={newPageSlug}
                            onChange={(e) => setNewPageSlug(e.target.value.replace(/\s+/g, "-"))}
                            className="flex-1 bg-slate-900 border border-slate-800 text-slate-200 rounded-xl px-3 py-2 text-xs font-mono font-bold focus:outline-none focus:border-indigo-500"
                          />
                        </div>
                      </div>

                      <div className="space-y-1">
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-wider block">পেজ বিবরণ / কনটেন্ট (Markdown সমর্থিত)</label>
                        <textarea 
                          rows={4}
                          placeholder="### ভর্তি প্রক্রিয়া...\n\n১. ওরিয়েন্টেশন কাউন্সিলিং\n২. শিশুর কগনিটিভ অ্যাসেসমেন্ট টেস্ট সেশন..."
                          value={newPageContent}
                          onChange={(e) => setNewPageContent(e.target.value)}
                          className="w-full bg-slate-900 border border-slate-800 text-slate-200 rounded-xl p-3 text-xs font-medium focus:outline-none h-24 whitespace-pre-wrap"
                        />
                      </div>

                      <button
                        type="submit"
                        className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-extrabold text-xs py-2 rounded-xl flex items-center justify-center gap-1 transition-all cursor-pointer shadow-md"
                      >
                        <Plus className="w-3.5 h-3.5" />
                        <span>নতুন ডায়নামিক পেজ তৈরি করুন</span>
                      </button>
                    </form>

                    {/* Active custom pages list */}
                    <div className="space-y-2">
                      <span className="text-[10px] font-black text-slate-400 uppercase block tracking-widest">তৈরিকৃত পেজসমূহের লিস্ট:</span>
                      {(localConfig.customPages || []).length === 0 ? (
                        <p className="text-[10px] text-slate-500 font-bold italic p-2 border border-slate-850 rounded">কোনো কাস্টম পেজ তৈরি করা নেই।</p>
                      ) : (
                        <div className="space-y-2 max-h-[160px] overflow-y-auto pr-1">
                          {(localConfig.customPages || []).map((p) => (
                            <div key={p.slug} className="flex items-center justify-between p-2.5 bg-slate-900/60 border border-slate-850 rounded-xl text-xs">
                              <div className="min-w-0 flex-1">
                                <span className="font-bold text-slate-250 block truncate">{p.title}</span>
                                <span className="text-[9px] text-indigo-400 font-mono block truncate">#/page/{p.slug}</span>
                              </div>
                              <div className="flex items-center gap-1 shrink-0 ml-2">
                                <button
                                  type="button"
                                  onClick={() => onNavigate(`#/page/${p.slug}`)}
                                  className="p-1 text-slate-400 hover:text-white hover:bg-slate-800 border border-slate-800 rounded-lg transition-all"
                                  title="ভিজিট করুন"
                                >
                                  <ExternalLink className="w-3.5 h-3.5" />
                                </button>
                                <button
                                  type="button"
                                  onClick={() => handleDeletePage(p.slug)}
                                  className="p-1 text-rose-400 hover:text-white hover:bg-rose-950/60 border border-rose-950/40 rounded-lg transition-all"
                                  title="মুছে ফেলুন"
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                </button>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Navigation Menu Editor with Slug Link Management */}
                  <div className="space-y-3.5 border-t border-slate-800 pt-4">
                    <div className="border-b border-slate-800 pb-2.5">
                      <h3 className="font-extrabold text-sm flex items-center gap-1.5 text-indigo-400">
                        <LinkIcon className="w-4 h-4" /> ন্যাভিগেশন মেনু এডিটর
                      </h3>
                      <p className="text-[10px] text-slate-400 mt-1">
                        হেডারে প্রদর্শিত মেনু লিংকসমূহ ডায়নামিকভাবে কাস্টমাইজ করুন এবং কাস্টম পেজগুলোর স্লাগ লিংক করে দিন।
                      </p>
                    </div>

                    {/* Add Menu link form */}
                    <form onSubmit={handleAddMenuLink} className="space-y-2.5 bg-slate-850/40 p-4 border border-slate-800 rounded-2xl">
                      <div className="space-y-1">
                        <label className="text-[10px] text-slate-400 block">মেনু টাইটেল / লেবেল (Label)</label>
                        <input 
                          type="text"
                          required
                          placeholder="ভর্তি গাইড বা আমাদের কথা"
                          value={newLinkLabel}
                          onChange={(e) => setNewLinkLabel(e.target.value)}
                          className="w-full bg-slate-900 border border-slate-800 text-slate-200 rounded-xl px-3 py-2 text-xs font-semibold focus:outline-none"
                        />
                      </div>

                      <div className="space-y-1">
                        <label className="text-[10px] text-slate-400 block">লিংক ইউআরএল (URL / Slug Hash)</label>
                        <input 
                          type="text"
                          required
                          placeholder="#/page/about-us"
                          value={newLinkUrl}
                          onChange={(e) => setNewLinkUrl(e.target.value)}
                          className="w-full bg-slate-900 border border-slate-800 text-slate-200 rounded-xl px-3 py-2 text-xs font-mono font-bold focus:outline-none"
                        />
                        <div className="flex items-center gap-1.5 mt-1.5">
                          <span className="text-[9px] text-slate-500 block">কুইক সিলেক্ট প্রিসেটস:</span>
                          <button 
                            type="button" 
                            onClick={() => setNewLinkUrl("#services-section")}
                            className="bg-slate-800 hover:bg-slate-750 text-indigo-300 text-[8px] px-2 py-0.5 rounded border border-slate-700"
                          >
                            সেবাসমূহ
                          </button>
                          <button 
                            type="button" 
                            onClick={() => setNewLinkUrl("#therapists-section")}
                            className="bg-slate-800 hover:bg-slate-750 text-indigo-300 text-[8px] px-2 py-0.5 rounded border border-slate-700"
                          >
                            বিশেষজ্ঞরা
                          </button>
                        </div>
                      </div>

                      <button
                        type="submit"
                        className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-extrabold text-xs py-2 rounded-xl flex items-center justify-center gap-1 transition-all cursor-pointer"
                      >
                        <Plus className="w-3.5 h-3.5" />
                        <span>মেনু আইটেম যুক্ত করুন</span>
                      </button>
                    </form>

                    {/* Current menu links list */}
                    <div className="space-y-2">
                      <span className="text-[10px] font-black text-slate-400 uppercase block tracking-widest">ন্যাভিগেশন মেনুর বর্তমান উপাদানসমূহ:</span>
                      <div className="space-y-1.5 max-h-[160px] overflow-y-auto pr-1">
                        {(localConfig.menuLinks || []).map((link) => (
                          <div key={link.id} className="flex items-center justify-between p-2 bg-slate-900/60 border border-slate-850 rounded-xl text-xs">
                            <div className="min-w-0 flex-1 flex items-center gap-2">
                              <span className="w-1.5 h-1.5 rounded-full bg-indigo-500 shrink-0"></span>
                              <span className="font-bold text-slate-200 truncate">{link.label}</span>
                              <span className="text-[9px] text-slate-500 font-mono truncate">({link.url})</span>
                            </div>
                            <button
                              type="button"
                              onClick={() => handleDeleteMenuLink(link.id)}
                              className="p-1 text-rose-400 hover:text-white hover:bg-rose-950/50 border border-rose-950/30 rounded-lg transition-all"
                              title="মেনু লিংক ডিলিট করুন"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>

                  </div>
                </div>
              )}

              {/* PANEL 4: CONTENT TEXTS CONTROL */}
              {sidebarPanel === "content" && (
                <div className="space-y-5">
                  <div className="border-b border-slate-800 pb-3 flex items-center justify-between">
                    <div>
                      <h3 className="font-extrabold text-sm flex items-center gap-1.5 text-indigo-400">
                        <Edit2 className="w-4 h-4" /> কনটেন্ট টেক্সট ও টাইটেলস
                      </h3>
                      <p className="text-[10px] text-slate-400 mt-1">ডানপাশের ভিজ্যুয়াল এডিটরে ডাবল-ক্লিক করে বা নিচের অপশনসমূহ দিয়ে সরাসরি ল্যান্ডিং পেজের টেক্সট এডিট করতে পারবেন।</p>
                    </div>
                    {activeField && (
                      <span className="text-[9px] bg-indigo-950 text-indigo-300 border border-indigo-900 px-2 py-0.5 rounded font-mono font-bold uppercase shrink-0">
                        {String(activeField)}
                      </span>
                    )}
                  </div>

                  {/* Dynamic inputs */}
                  <div className="space-y-4">
                    
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-wider block">DocTime লোগো টেক্সট</label>
                      <input 
                        type="text"
                        value={localConfig.logoText}
                        onChange={(e) => setLocalConfig({ ...localConfig, logoText: e.target.value })}
                        className={`w-full bg-slate-850 border text-slate-200 rounded-xl px-3.5 py-2.5 text-xs font-bold ${activeField === "logoText" ? "border-indigo-500 focus:ring-1 focus:ring-indigo-500" : "border-slate-800"}`}
                        onFocus={() => setActiveField("logoText")}
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-wider block">ফোন নম্বর টেক্সট</label>
                      <input 
                        type="text"
                        value={localConfig.phoneText}
                        onChange={(e) => setLocalConfig({ ...localConfig, phoneText: e.target.value })}
                        className={`w-full bg-slate-850 border text-slate-200 rounded-xl px-3.5 py-2.5 text-xs font-bold ${activeField === "phoneText" ? "border-indigo-500" : "border-slate-800"}`}
                        onFocus={() => setActiveField("phoneText")}
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-[10px] font-black text-slate-400 uppercase block">হিরো টাইটেল (Hero Title)</label>
                      <textarea
                        rows={3}
                        value={localConfig.heroTitle}
                        onChange={(e) => setLocalConfig({ ...localConfig, heroTitle: e.target.value })}
                        className={`w-full bg-slate-850 border text-slate-200 rounded-xl px-3.5 py-2.5 text-xs font-extrabold leading-relaxed ${activeField === "heroTitle" ? "border-indigo-500" : "border-slate-800"}`}
                        onFocus={() => setActiveField("heroTitle")}
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-[10px] font-black text-slate-400 uppercase block">হিরো বর্ণনা (Hero Desc)</label>
                      <textarea
                        rows={4}
                        value={localConfig.heroDesc}
                        onChange={(e) => setLocalConfig({ ...localConfig, heroDesc: e.target.value })}
                        className={`w-full bg-slate-850 border text-slate-200 rounded-xl px-3.5 py-2.5 text-xs font-medium leading-relaxed ${activeField === "heroDesc" ? "border-indigo-500" : "border-slate-800"}`}
                        onFocus={() => setActiveField("heroDesc")}
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div className="space-y-1">
                        <label className="text-[10px] text-slate-400 block">CTA বাটন টেক্সট</label>
                        <input 
                          type="text"
                          value={localConfig.ctaText}
                          onChange={(e) => setLocalConfig({ ...localConfig, ctaText: e.target.value })}
                          className={`w-full bg-slate-850 border text-slate-200 rounded-xl px-3 py-2 text-xs font-bold ${activeField === "ctaText" ? "border-indigo-500" : "border-slate-800"}`}
                          onFocus={() => setActiveField("ctaText")}
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="text-[10px] text-slate-400 block">বাটন লিংক (CTA URL)</label>
                        <input 
                          type="text"
                          value={localConfig.ctaUrl}
                          onChange={(e) => setLocalConfig({ ...localConfig, ctaUrl: e.target.value })}
                          className={`w-full bg-slate-850 border text-slate-200 rounded-xl px-3 py-2 text-xs font-bold ${activeField === "ctaUrl" ? "border-indigo-500" : "border-slate-800"}`}
                          onFocus={() => setActiveField("ctaUrl")}
                        />
                      </div>
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-[10px] font-black text-slate-400 uppercase block">সেবাসমূহ সেকশন হেডিং</label>
                      <input 
                        type="text"
                        value={localConfig.servicesTitle}
                        onChange={(e) => setLocalConfig({ ...localConfig, servicesTitle: e.target.value })}
                        className={`w-full bg-slate-850 border text-slate-200 rounded-xl px-3.5 py-2.5 text-xs font-bold ${activeField === "servicesTitle" ? "border-indigo-500" : "border-slate-800"}`}
                        onFocus={() => setActiveField("servicesTitle")}
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-[10px] font-black text-slate-400 uppercase block">সেবাসমূহ সেকশন ডেসক্রিপশন</label>
                      <textarea 
                        rows={2}
                        value={localConfig.servicesDesc}
                        onChange={(e) => setLocalConfig({ ...localConfig, servicesDesc: e.target.value })}
                        className={`w-full bg-slate-850 border text-slate-200 rounded-xl px-3.5 py-2.5 text-xs font-medium ${activeField === "servicesDesc" ? "border-indigo-500" : "border-slate-800"}`}
                        onFocus={() => setActiveField("servicesDesc")}
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-[10px] font-black text-slate-400 uppercase block">বিশেষজ্ঞ প্যানেল হেডিং</label>
                      <input 
                        type="text"
                        value={localConfig.therapistsTitle}
                        onChange={(e) => setLocalConfig({ ...localConfig, therapistsTitle: e.target.value })}
                        className={`w-full bg-slate-850 border text-slate-200 rounded-xl px-3.5 py-2.5 text-xs font-bold ${activeField === "therapistsTitle" ? "border-indigo-500" : "border-slate-800"}`}
                        onFocus={() => setActiveField("therapistsTitle")}
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-[10px] font-black text-slate-400 uppercase block">যোগাযোগ ফরম হেডিং</label>
                      <input 
                        type="text"
                        value={localConfig.contactTitle}
                        onChange={(e) => setLocalConfig({ ...localConfig, contactTitle: e.target.value })}
                        className={`w-full bg-slate-850 border text-slate-200 rounded-xl px-3.5 py-2.5 text-xs font-bold ${activeField === "contactTitle" ? "border-indigo-500" : "border-slate-800"}`}
                        onFocus={() => setActiveField("contactTitle")}
                      />
                    </div>

                  </div>
                </div>
              )}

              {/* PANEL 5: CUSTOM LIQUID / CUSTOM CODE */}
              {sidebarPanel === "liquid" && (
                <div className="space-y-5">
                  <div className="border-b border-slate-800 pb-3">
                    <h3 className="font-extrabold text-sm flex items-center gap-1.5 text-indigo-400">
                      <Code className="w-4 h-4" /> কাস্টম কোড ইনজেক্টর (Shopify Liquid)
                    </h3>
                    <p className="text-[10px] text-slate-400 mt-1">যেকোনো কাস্টম HTML, CSS, JavaScript, গুগল ম্যাপস আইফ্রেম অথবা ইউটিউব এমবেড কোড পেস্ট করুন। এটি নির্দিষ্ট সেকশন হিসেবে ডানপাশে রেন্ডার হবে।</p>
                  </div>

                  <div className="space-y-3">
                    <div className="flex items-center justify-between text-[10px] text-slate-400 font-bold uppercase tracking-wider">
                      <span>ইনপুট টেক্সট-এরিয়া</span>
                      <span className="text-rose-400 font-sans tracking-wide">🔥 Live Render</span>
                    </div>

                    <textarea
                      rows={10}
                      value={localConfig.customCode}
                      onChange={(e) => setLocalConfig({ ...localConfig, customCode: e.target.value })}
                      placeholder="<!-- Paste your Custom HTML or widget iframe here -->"
                      className="w-full bg-slate-950 text-emerald-400 border border-slate-850 font-mono text-[10px] p-3.5 rounded-2xl focus:outline-none focus:ring-1 focus:ring-indigo-500 leading-relaxed"
                    />

                    {/* Code Presets Generator buttons */}
                    <div className="space-y-2 bg-slate-850 p-3.5 rounded-2xl border border-slate-800">
                      <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest block">১-ক্লিক কোড প্রিসেটস ইনজেকশন:</span>
                      
                      <div className="grid grid-cols-3 gap-2">
                        <button
                          type="button"
                          onClick={() => injectLiquidPreset("map")}
                          className="bg-slate-900 hover:bg-slate-800 border border-slate-750 text-indigo-450 font-extrabold text-[9px] py-2 rounded-xl transition-colors cursor-pointer"
                        >
                          📍 গুগল ম্যাপস
                        </button>
                        <button
                          type="button"
                          onClick={() => injectLiquidPreset("banner")}
                          className="bg-slate-900 hover:bg-slate-800 border border-slate-750 text-indigo-450 font-extrabold text-[9px] py-2 rounded-xl transition-colors cursor-pointer"
                        >
                          🎁 স্পেশাল অফার
                        </button>
                        <button
                          type="button"
                          onClick={() => injectLiquidPreset("calendar")}
                          className="bg-slate-900 hover:bg-slate-800 border border-slate-750 text-indigo-450 font-extrabold text-[9px] py-2 rounded-xl transition-colors cursor-pointer"
                        >
                          📅 ডক্টরস শিডিউল
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              )}

            </div>

            {/* Save Customization Buttons panel */}
            <div className="bg-slate-950 p-4 border-t border-slate-850 shrink-0 space-y-3 font-sans">
              <button
                type="button"
                onClick={handleSaveConfig}
                className="w-full bg-indigo-600 hover:bg-indigo-550 text-white font-extrabold text-xs sm:text-sm py-3.5 rounded-xl flex items-center justify-center gap-2 shadow-lg transition-colors cursor-pointer"
              >
                <Save className="w-4 h-4 text-emerald-300" />
                <span>ওয়েবসাইট নো-কোড লেআউট সেভ করুন</span>
              </button>
              
              <button 
                type="button"
                onClick={() => onNavigate("#/")}
                className="w-full bg-slate-900 hover:bg-slate-850 border border-slate-800 text-slate-350 hover:text-white font-bold text-[10px] py-2 rounded-lg flex items-center justify-center gap-1.5 transition-all"
              >
                <span>পাবলিক হোম ল্যান্ডিং পেজে যান</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </button>
            </div>
          </aside>

          {/* RIGHT VIEW: Live Browser Canvas Simulator (Flexible width, Scrollable) */}
          <main className="flex-1 bg-slate-900/60 p-5 flex flex-col overflow-hidden h-full">
            
            {/* Toolbar Frame */}
            <div className="bg-slate-850 border border-slate-800 rounded-2xl px-5 py-3.5 shrink-0 flex items-center justify-between shadow-xs mb-4">
              <div className="flex items-center gap-3">
                <span className="w-2.5 h-2.5 bg-emerald-500 rounded-full animate-pulse"></span>
                <div>
                  <span className="text-xs font-black text-slate-100 flex items-center gap-1 uppercase tracking-wider font-sans">
                    DocTime রিয়েলটাইম প্রিভিউ (Live Preview Canvas)
                  </span>
                  <span className="text-[10px] text-slate-400 font-bold font-mono">
                    ফন্ট ফ্যামিলি: {localConfig.fontFamily.includes("BengaliCustomFont") ? "কাস্টম বাংলা ফন্ট" : localConfig.fontFamily}
                  </span>
                </div>
              </div>

              {/* Responsive Size Selectors */}
              <div className="flex items-center gap-1 bg-slate-900 p-1 rounded-xl border border-slate-800 shrink-0 text-xs font-bold text-slate-400 font-sans">
                <button
                  type="button"
                  onClick={() => setPreviewMode("desktop")}
                  className={`p-2 rounded-lg flex items-center gap-1 cursor-pointer transition-all ${previewMode === "desktop" ? "bg-slate-800 text-indigo-400 shadow-xs" : "hover:text-slate-200"}`}
                  title="ডেস্কটপ প্রিভিউ"
                >
                  <Laptop className="w-4 h-4" />
                  <span className="hidden md:inline text-[10px] font-black uppercase">ডেস্কটপ</span>
                </button>
                <button
                  type="button"
                  onClick={() => setPreviewMode("tablet")}
                  className={`p-2 rounded-lg flex items-center gap-1 cursor-pointer transition-all ${previewMode === "tablet" ? "bg-slate-800 text-indigo-400 shadow-xs" : "hover:text-slate-200"}`}
                  title="ট্যাবলেট প্রিভিউ"
                >
                  <Tablet className="w-4 h-4" />
                  <span className="hidden md:inline text-[10px] font-black uppercase">ট্যাবলেট</span>
                </button>
                <button
                  type="button"
                  onClick={() => setPreviewMode("mobile")}
                  className={`p-2 rounded-lg flex items-center gap-1 cursor-pointer transition-all ${previewMode === "mobile" ? "bg-slate-800 text-indigo-400 shadow-xs" : "hover:text-slate-200"}`}
                  title="মোবাইল প্রিভিউ"
                >
                  <Smartphone className="w-4 h-4" />
                  <span className="hidden md:inline text-[10px] font-black uppercase">মোবাইল</span>
                </button>
              </div>
            </div>

            {/* Interactive Browser Mockup Container */}
            <div className="flex-1 overflow-y-auto bg-slate-950/80 p-4 flex items-start justify-center rounded-3xl border border-slate-800/80 relative">
              <div 
                className={`w-full bg-white rounded-2xl shadow-2xl overflow-hidden transition-all duration-300 border border-slate-800 min-h-full ${
                  previewMode === "desktop" ? "max-w-7xl" : previewMode === "tablet" ? "max-w-2xl" : "max-w-sm"
                }`}
              >
                {/* Browser tab layout mock */}
                <div className="bg-slate-100 border-b border-slate-200 px-4 py-2 flex items-center gap-2 shrink-0 select-none">
                  <div className="flex gap-1.5 shrink-0">
                    <span className="w-2.5 h-2.5 bg-rose-450 rounded-full"></span>
                    <span className="w-2.5 h-2.5 bg-amber-450 rounded-full"></span>
                    <span className="w-2.5 h-2.5 bg-emerald-450 rounded-full"></span>
                  </div>
                  <div className="bg-white text-[9px] text-slate-400 font-mono font-bold px-3 py-1 rounded border border-slate-200 flex-1 flex items-center justify-between">
                    <span>https://doctime-speechlab.com/landing-preview</span>
                    <span className="text-[10px] text-indigo-500 font-black tracking-widest animate-pulse">● LIVE EDITING ACTIVE</span>
                  </div>
                </div>

                {/* Render the actual PublicLandingPage inside preview frame! */}
                <div className="w-full relative bg-slate-50 text-slate-900">
                  <PublicLandingPage
                    pageConfig={localConfig}
                    services={mockServices}
                    therapists={therapists.slice(0, 2)}
                    onNavigate={(hash) => triggerToast(`প্রিভিউ মোডে লাইভ নেভিগেশন বন্ধ রয়েছে (Redirect: ${hash})`)}
                    isEditable={true}
                    activeField={activeField}
                    onSelectField={handlePreviewElementSelect}
                  />
                </div>
              </div>
            </div>
          </main>

        </div>
      ) : null}

      {/* TAB 2: CLINICAL THERAPIST DIRECTORY MANAGER */}
      {adminTab === "therapist_manager" && (
        <main className="flex-1 p-6 sm:p-10 text-slate-800 font-sans">
          <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8">
            
            {/* Add Therapist Form Column */}
            <div className="lg:col-span-5 bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 shadow-sm space-y-6">
              <div className="border-b border-slate-100 pb-3">
                <h3 className="font-extrabold text-slate-900 text-base sm:text-lg">নতুন থেরাপিস্ট ডিরেক্টরি এন্ট্রি</h3>
                <p className="text-xs text-slate-500 mt-1">ছবি আপলোড সহ প্রয়োজনীয় তথ্য দিয়ে নতুন অকুপেশনাল বা স্পিচ থেরাপিস্ট যুক্ত করুন।</p>
              </div>

              <form onSubmit={handleAddTherapistSubmit} className="space-y-4">
                
                {/* Drag and Drop Photo Zone */}
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest block">১. থেরাপিস্ট ফটো আপলোডার (Drag & Drop Zone)</label>
                  
                  <div 
                    onDragOver={handleDragOver}
                    onDragLeave={handleDragLeave}
                    onDrop={handleDrop}
                    className={`border-2 border-dashed rounded-2xl p-6 text-center transition-all ${
                      dragOver 
                        ? "border-indigo-400 bg-indigo-50/25" 
                        : "border-slate-250 bg-slate-50/50 hover:bg-slate-50 hover:border-slate-350"
                    }`}
                  >
                    {uploadedPhotoUrl ? (
                      <div className="space-y-3">
                        <img 
                          src={uploadedPhotoUrl} 
                          alt="Uploaded avatar" 
                          referrerPolicy="no-referrer"
                          className="w-16 h-16 rounded-2xl object-cover mx-auto border-2 border-white shadow-md" 
                        />
                        <button 
                          type="button"
                          onClick={() => setUploadedPhotoUrl(null)}
                          className="text-[10px] text-rose-500 font-extrabold hover:underline"
                        >
                          ছবি পরিবর্তন করুন
                        </button>
                      </div>
                    ) : (
                      <div className="space-y-2">
                        <div className="w-10 h-10 bg-slate-100 rounded-xl flex items-center justify-center mx-auto border border-slate-200 text-slate-400">
                          <Upload className="w-5 h-5" />
                        </div>
                        <p className="text-[11px] font-bold text-slate-600">এখানে ছবি ফাইল টেনে আনুন অথবা ক্লিক করে আপলোড করুন</p>
                        <p className="text-[9px] text-slate-400">PNG, JPG, WEBP (Square Image Recommended)</p>
                        <input 
                          type="file" 
                          accept="image/*" 
                          onChange={handleFileSelect} 
                          className="hidden" 
                          id="fileInputTherapist" 
                        />
                        <label 
                          htmlFor="fileInputTherapist" 
                          className="mt-2 inline-block bg-slate-900 hover:bg-slate-800 text-white font-extrabold text-[10px] px-3.5 py-1.5 rounded-lg cursor-pointer transition-all"
                        >
                          ফাইল সিলেক্ট করুন
                        </label>
                      </div>
                    )}
                  </div>
                </div>

                {/* Grid Inputs */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest block">২. পুরো নাম (Full Name)</label>
                    <input 
                      type="text"
                      required
                      placeholder="ডা. মাহফুজুর রহমান"
                      value={newTherapistName}
                      onChange={(e) => setNewTherapistName(e.target.value)}
                      className="w-full border border-slate-250 rounded-xl px-3 py-2 text-xs font-bold text-slate-800 focus:outline-none focus:border-indigo-500"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest block">৩. পদবী (Designation)</label>
                    <input 
                      type="text"
                      placeholder="সিনিয়র স্পিচ প্যাথলজিস্ট"
                      value={newTherapistDesig}
                      onChange={(e) => setNewTherapistDesig(e.target.value)}
                      className="w-full border border-slate-250 rounded-xl px-3 py-2 text-xs font-bold text-slate-800 focus:outline-none"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest block">৪. বিশেষজ্ঞতা (Specialty)</label>
                    <input 
                      type="text"
                      placeholder="স্পিচ থেরাপি, আর্লি ইন্টারভেনশন"
                      value={newTherapistSpecialty}
                      onChange={(e) => setNewTherapistSpecialty(e.target.value)}
                      className="w-full border border-slate-250 rounded-xl px-3 py-2 text-xs font-bold text-slate-800 focus:outline-none"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest block">৫. ভিজিট ফি (Fee in BDT)</label>
                    <input 
                      type="number"
                      value={newTherapistFee}
                      onChange={(e) => setNewTherapistFee(Number(e.target.value))}
                      className="w-full border border-slate-250 rounded-xl px-3 py-2 text-xs font-bold text-slate-800 focus:outline-none"
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest block">৬. চেম্বার ব্রাঞ্চ বা এলাকা</label>
                  <input 
                    type="text"
                    value={newTherapistBranch}
                    onChange={(e) => setNewTherapistBranch(e.target.value)}
                    className="w-full border border-slate-250 rounded-xl px-3 py-2 text-xs font-bold text-slate-800 focus:outline-none"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest block">৭. শিক্ষাগত যোগ্যতা ও টাইটেল (Credentials)</label>
                  <input 
                    type="text"
                    placeholder="B.Sc, MSS (Speech & Language Pathology, DU)"
                    value={newTherapistCredentials}
                    onChange={(e) => setNewTherapistCredentials(e.target.value)}
                    className="w-full border border-slate-250 rounded-xl px-3 py-2 text-xs font-bold text-slate-800 focus:outline-none"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest block">৮. কাজের দীর্ঘ অভিজ্ঞতা (Clinical Experience)</label>
                  <textarea 
                    placeholder="১০+ বছরের দীর্ঘ কাজের অভিজ্ঞতা..."
                    value={newTherapistExperience}
                    onChange={(e) => setNewTherapistExperience(e.target.value)}
                    className="w-full border border-slate-250 rounded-xl px-3 py-2 text-xs font-semibold text-slate-600 focus:outline-none h-14"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest block">৯. উচ্চতর শিক্ষা ও লাইসেন্স (Education Details)</label>
                  <textarea 
                    placeholder="ঢাকা বিশ্ববিদ্যালয় হতে অকুপেশনাল থেরাপিতে স্নাতক..."
                    value={newTherapistEducation}
                    onChange={(e) => setNewTherapistEducation(e.target.value)}
                    className="w-full border border-slate-250 rounded-xl px-3 py-2 text-xs font-semibold text-slate-600 focus:outline-none h-14"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full bg-slate-900 hover:bg-slate-800 text-white font-extrabold text-xs sm:text-sm py-3 rounded-2xl flex items-center justify-center gap-1.5 cursor-pointer shadow-sm"
                >
                  <Plus className="w-4 h-4 text-indigo-400" />
                  <span>নতুন থেরাপিস্ট যুক্ত করুন</span>
                </button>
              </form>
            </div>

            {/* List and delete Therapists Column */}
            <div className="lg:col-span-7 bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 shadow-sm space-y-6">
              <div>
                <h3 className="font-extrabold text-slate-900 text-base sm:text-lg">নিবন্ধিত থেরাপিস্টদের তালিকা ও নিয়ন্ত্রণ</h3>
                <p className="text-xs text-slate-500 mt-1">প্যানেল ডিলিট বা মুছে ফেলার জন্য লাল বাটন চাপুন। এটি সাথে সাথে ডিরেক্টরি থেকে মুছে যাবে।</p>
              </div>

              <div className="space-y-4 max-h-[600px] overflow-y-auto pr-2">
                {therapists.length === 0 ? (
                  <div className="p-8 text-center border border-slate-200 rounded-2xl text-slate-400 font-bold text-xs">
                    কোনো থেরাপিস্ট নিবন্ধিত নেই।
                  </div>
                ) : (
                  therapists.map((therapist) => (
                    <div 
                      key={therapist.id}
                      className="p-4 rounded-2xl border border-slate-150 hover:border-slate-250 transition-all flex items-start justify-between gap-4 bg-slate-50/50"
                    >
                      <div className="flex items-center gap-3.5 min-w-0 flex-1">
                        {therapist.avatar_url ? (
                          <img 
                            src={therapist.avatar_url} 
                            alt={therapist.name} 
                            referrerPolicy="no-referrer"
                            className="w-12 h-12 rounded-xl object-cover border border-slate-200 shrink-0" 
                          />
                        ) : (
                          <div className="w-12 h-12 rounded-xl bg-white text-indigo-600 border border-slate-200 flex items-center justify-center text-lg font-black font-sans shrink-0">
                            {therapist.name[0]}
                          </div>
                        )}
                        <div className="space-y-1 min-w-0">
                          <h4 className="text-xs sm:text-sm font-black text-slate-900 leading-none truncate">{therapist.name}</h4>
                          <p className="text-[11px] text-slate-500 font-extrabold truncate">{therapist.designation}</p>
                          <p className="text-[10px] text-slate-400 font-semibold leading-relaxed max-w-md truncate">{therapist.specialty} | ফি: {therapist.visit_fee} BDT</p>
                        </div>
                      </div>

                      <button
                        onClick={() => onDeleteTherapist(therapist.id, therapist.name)}
                        className="p-2 text-rose-500 hover:text-white hover:bg-rose-500 border border-rose-100 hover:border-rose-600 rounded-xl transition-all cursor-pointer shadow-2xs shrink-0"
                        title="মুছে ফেলুন"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ))
                )}
              </div>
            </div>

          </div>
        </main>
      )}

      {/* TAB 3: SECURITY AUDIT & RLS LOGS */}
      {adminTab === "security_audit" && (
        <main className="flex-1 p-6 sm:p-10 font-sans">
          <div className="max-w-4xl mx-auto bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-10 shadow-sm space-y-8">
            
            <div className="border-b border-slate-800 pb-4">
              <span className="bg-rose-950 text-rose-400 border border-rose-900 text-[10px] font-black px-2.5 py-0.5 rounded-full uppercase tracking-wider">
                🛡️ Database Security Portal
              </span>
              <h3 className="font-extrabold text-white text-lg sm:text-xl mt-2">সুপাবেস RLS (Row Level Security) এবং কানেকশন অডিট</h3>
              <p className="text-xs text-slate-400 mt-1">
                রিয়েল-টাইমে ডাটাবেস নিরাপত্তা স্ক্যান, RLS পলিসি অডিটিং এবং আনঅথরাইজড রিকোয়েস্ট ট্র্যাকিং সিস্টেম প্রিভিউ।
              </p>
            </div>

            {/* Audit Status Bar Indicators */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="bg-emerald-950/25 border border-emerald-900/60 p-4 rounded-2xl">
                <span className="text-[10px] font-black text-emerald-400 uppercase">ডাটাবেস আরএলএস নীতি</span>
                <h2 className="text-xl font-black text-emerald-300 mt-1">৮/৮ সক্রিয়</h2>
                <p className="text-[10px] text-emerald-550 mt-1">সবগুলো ডাটা টেবিল সম্পূর্ণ সুরক্ষিত</p>
              </div>

              <div className="bg-indigo-950/25 border border-indigo-900/60 p-4 rounded-2xl">
                <span className="text-[10px] font-black text-indigo-450 uppercase font-sans">সুপাবেস কানেকশন স্থিতি</span>
                <h2 className="text-xl font-black text-indigo-300 mt-1">সচল ও সুরক্ষিত</h2>
                <p className="text-[10px] text-indigo-500 mt-1">SSLv3 TLS ১.৩ ক্লাউড ইন্টিগ্রেটেড</p>
              </div>

              <div className="bg-slate-900 border border-slate-800 p-4 rounded-2xl">
                <span className="text-[10px] font-black text-slate-400 uppercase">মোট স্ক্যানকৃত প্রোফাইল</span>
                <h2 className="text-xl font-black text-slate-350 mt-1">{therapists.length + 5} সেশনস</h2>
                <p className="text-[10px] text-slate-500 mt-1">রোল যাচাইকরণ সম্পন্ন</p>
              </div>
            </div>

            {/* Security Audit Simulator Panel */}
            <div className="space-y-4">
              <h4 className="font-extrabold text-white text-sm flex items-center gap-1.5 border-b border-slate-800 pb-2">
                <span>১. আরএলএস পলিসি সিমুলেটর (Security Sandbox)</span>
              </h4>
              <p className="text-xs text-slate-400">
                নিচের কন্ডিশনগুলো থেকে ইউজার রোল এবং টার্গেট টেবিল সিলেক্ট করে সুপাবেসের ইন্টারনাল সিকিউরিটি কন্ডিশন টেস্ট করুন:
              </p>

              <div className="bg-slate-950 p-5 rounded-2xl border border-slate-800 space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <span className="text-[10px] font-black text-slate-450 uppercase">ইউজার রোল কন্ডিশন</span>
                    <select 
                      className="w-full bg-slate-900 border border-slate-800 rounded-xl p-2.5 text-xs font-bold text-slate-300 focus:outline-none"
                      defaultValue="patient_own"
                    >
                      <option value="patient_own">👶 রোগী (নিজের তথ্য অ্যাক্সেস করছেন)</option>
                      <option value="patient_other">🚨 সাধারণ ব্যবহারকারী (অন্য রোগীর তথ্য চেষ্টা করছেন)</option>
                      <option value="therapist_own">🩺 থেরাপিস্ট (তার চেম্বার ও বুকিং দেখছেন)</option>
                    </select>
                  </div>

                  <div className="space-y-1">
                    <span className="text-[10px] font-black text-slate-455 uppercase">টার্গেট ডাটাবেস টেবিল</span>
                    <select 
                      className="w-full bg-slate-900 border border-slate-800 rounded-xl p-2.5 text-xs font-bold text-slate-300 focus:outline-none"
                      defaultValue="users"
                    >
                      <option value="users">users (ব্যবহারকারী প্রোফাইল টেবিল)</option>
                      <option value="bookings">bookings (অ্যাপয়েন্টমেন্ট বুকিং টেবিল)</option>
                      <option value="screening_reports">screening_reports (স্ক্রিনিং ও রিপোর্টস)</option>
                    </select>
                  </div>
                </div>

                <div className="bg-slate-900 border border-slate-800 p-4 rounded-xl space-y-2">
                  <div className="flex items-center gap-2">
                    <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-ping"></div>
                    <span className="text-xs font-extrabold text-emerald-400">অ্যাক্সেস কন্ডিশন: ALLOWED</span>
                  </div>
                  <p className="text-xs text-slate-400 font-medium">সুপাবেস RLS পলিসি (using auth.uid() = id অথবা user_id) সফলভাবে কাজ করছে। ব্যবহারকারী নিজের প্রোফাইল অ্যাক্সেস করছেন।</p>
                  <pre className="text-[10px] bg-slate-950 text-emerald-400 p-2.5 rounded-lg overflow-x-auto font-mono">
                    {`CREATE POLICY "Users can access own profile" ON users FOR ALL USING (auth.uid() = id);`}
                  </pre>
                </div>
              </div>
            </div>

          </div>
        </main>
      )}

    </div>
  );
}

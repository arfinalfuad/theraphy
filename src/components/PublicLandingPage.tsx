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
  FileText
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
        `
      }} />

      {navbarNode}

      {/* Render sections in the precise drag-and-drop order */}
      {order.map((sectionId) => {
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
      })}

    </div>
  );
}

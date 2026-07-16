import React, { useState, useEffect } from "react";
import { 
  Database, 
  User, 
  Users, 
  Calendar, 
  Activity, 
  FileText, 
  CheckCircle2, 
  Copy, 
  Check, 
  BookOpen, 
  ChevronRight, 
  Code2, 
  ShieldCheck, 
  Plus, 
  Play, 
  RefreshCw, 
  Sliders, 
  Info, 
  Layers, 
  Sparkles, 
  Phone, 
  Clock, 
  DollarSign, 
  Video,
  Heart,
  Home,
  Music,
  Gamepad2,
  GraduationCap,
  Sparkle,
  Baby,
  Percent,
  CheckCircle,
  ExternalLink,
  Laptop,
  Volume2,
  VolumeX,
  MessageSquare,
  Lock,
  Shield,
  X,
  Trash2,
  Edit,
  Upload,
  FileDown,
  ClipboardList,
  Stethoscope,
} from "lucide-react";
import PatientDashboard from "./components/PatientDashboard";
import TherapistDashboard from "./components/TherapistDashboard";
import AdminDashboard from "./components/AdminDashboard";
import LoginScreen from "./components/LoginScreen";
import PublicLandingPage, { LandingPageConfig } from "./components/PublicLandingPage";
import { supabase } from "./supabaseClient";

// Interfaces
interface Therapist {
  id: string;
  name: string;
  designation: string;
  specialty: string;
  visit_fee: number;
  branch: string;
  credentials: string;
  experience: string;
  education: string;
  avatar_url?: string; // Support for drag and drop custom photos
}

interface Appointment {
  id: string;
  user_id: string;
  therapist_id: string;
  date: string;
  time: string;
  payment_status: string;
  video_call_link: string;
  topic?: string;
}

interface Prescription {
  id: string;
  date: string;
  patient_name: string;
  age: string;
  diagnosis: string;
  homework: string;
  next_visit: string;
  notes: string;
  therapist_name: string;
}

interface ServiceCard {
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

// Default Data
const DEFAULT_SERVICES: ServiceCard[] = [
  {
    id: "therapy_lab",
    titleBangla: "১. থেরাপি ল্যাব (Therapy Lab)",
    titleEnglish: "Clinical Speech & Language Therapy",
    descBangla: "শিশুদের স্পষ্ট কথা বলা, শব্দ উচ্চারণ, তোলাতলামি দূর করা এবং সঠিক যোগাযোগের দক্ষতা বাড়াতে প্রফেশনাল স্পিচ প্যাথলজিস্টদের ওয়ান-টু-ওয়ান আধুনিক থেরাপি সেশন।",
    iconName: "Activity",
    bgColor: "bg-sky-50/80 border-sky-200/60",
    accentColor: "text-sky-700 bg-sky-100/70",
    tag: "ক্লিনিক্যাল থেরাপি"
  },
  {
    id: "apon_ghor",
    titleBangla: "২. আপন ঘর (Apon Ghor)",
    titleEnglish: "Sensory & Daycare Play Home",
    descBangla: "বিশেষ চাহিদাসম্পন্ন শিশুদের জন্য সম্পূর্ণ নিরাপদ, কোলাহলমুক্ত এবং সেন্সরি-ফ্রেন্ডলি ডে-কেয়ার ও প্লে-হোম। যেখানে প্রতিটি শিশু পাবে মায়ের মতো পরম যত্ন ও স্নেহময় পরিবেশ।",
    iconName: "Home",
    bgColor: "bg-rose-50/80 border-rose-200/60",
    accentColor: "text-rose-700 bg-rose-100/70",
    tag: "সেন্সরি ডে-কেয়ার"
  },
  {
    id: "anandomoye",
    titleBangla: "৩. আনন্দময়ী (Anandomoye)",
    titleEnglish: "Creative Art & Music Therapy",
    descBangla: "আর্ট, সংগীত, সুর ও নান্দনিক নাচের মেলবন্ধনে শিশুদের মনোযোগ বৃদ্ধি, বুদ্ধিবৃত্তিক বিকাশ এবং মানসিক প্রশান্তির জন্য আনন্দঘন থেরাপিউটিক কার্যক্রম।",
    iconName: "Music",
    bgColor: "bg-purple-50/80 border-purple-200/60",
    accentColor: "text-purple-700 bg-purple-100/70",
    tag: "আর্ট ও মিউজিক"
  },
  {
    id: "anando_lab",
    titleBangla: "৪. আনন্দ ল্যাব (Anando Lab)",
    titleEnglish: "Cognitive Early Intervention",
    descBangla: "স্মার্ট লার্নিং বোর্ড এবং বিশেষ গেমের মাধ্যমে শিশুদের ব্রেইনের মোটর স্কিল, আই-কন্টাক্ট, প্রব্লেম সলভিং এবিলিটি এবং কগনিটিভ ডেভেলপমেন্ট উন্নত করার বিশেষ ল্যাব।",
    iconName: "Gamepad2",
    bgColor: "bg-amber-50/80 border-amber-200/60",
    accentColor: "text-amber-700 bg-amber-100/70",
    tag: "কগনিটিভ গেম"
  },
  {
    id: "development_care_academy",
    titleBangla: "৫. ডেভেলপমেন্ট কেয়ার একাডেমি (Development Care Academy)",
    titleEnglish: "Specialized Pre-School Training",
    descBangla: "অটিজম এবং ডাউন সিন্ড্রোমে আক্রান্ত শিশুদের জন্য বিশেষ প্রাক-বিদ্যালয় শিক্ষা পদ্ধতি, সামাজিক আচরণ গ্রুপ লার্নিং এবং ইন্টারেক্টিভ বিহেভিওরাল থেরাপি (ABA)।",
    iconName: "GraduationCap",
    bgColor: "bg-emerald-50/80 border-emerald-200/60",
    accentColor: "text-emerald-700 bg-emerald-100/70",
    tag: "স্পেশাল স্কুলিং"
  },
  {
    id: "professional_home_therapy",
    titleBangla: "৬. প্রফেশনাল হোম থেরাপি কেয়ার (Home Therapy)",
    titleEnglish: "Qualified In-Home Therapists",
    descBangla: "যাতায়াতের সমস্যা দূর করতে আমাদের সার্টিফাইড অভিজ্ঞ থেরাপিস্টগণ সরাসরি আপনার বাসায় গিয়ে অত্যন্ত আন্তরিকতার সাথে স্পিচ ও অকুপেশনাল থেরাপি প্রদান করবেন।",
    iconName: "Sparkle",
    bgColor: "bg-teal-50/80 border-teal-200/60",
    accentColor: "text-teal-700 bg-teal-100/70",
    tag: "হোম সার্ভিস"
  },
  {
    id: "toy_lab",
    titleBangla: "৭. খেলনা ল্যাব (Toy-Lab)",
    titleEnglish: "Sensory Toys Library & Rent",
    descBangla: "বিশেষ শিশুদের ব্রেইনের জন্য উপযোগী উন্নতমানের সেন্সরি খেলনা, মন্টেসরি পাজল এবং মোটর-স্কিল খেলনা লাইব্রেরি। এখান থেকে খেলনা ট্রায়াল ও ভাড়ায় নেওয়া সম্ভব।",
    iconName: "Baby",
    bgColor: "bg-indigo-50/80 border-indigo-200/60",
    accentColor: "text-indigo-700 bg-indigo-100/70",
    tag: "খেলনা লাইব্রেরি"
  },
  {
    id: "screening_assessment",
    titleBangla: "৮. স্ক্রিনিং ও অ্যাসেসমেন্ট (Screening & Assessment)",
    titleEnglish: "AI-Powered Early Diagnosis & Test",
    descBangla: "শিশুর অটিজম ঝুঁকি বা স্পিচ ডিলের লক্ষণগুলো প্রাথমিকভাবে স্ক্রিন করার দ্রুত এআই টেস্ট এবং ক্লিনিকাল রিপোর্ট জেনারেটর। আজই আপনার পরীক্ষা করান!",
    iconName: "FileText",
    bgColor: "bg-rose-50/90 border-rose-200",
    accentColor: "text-rose-700 bg-rose-100/90",
    tag: "৫০% ছাড়!",
    isPromo: true
  }
];

const DEFAULT_THERAPISTS: Therapist[] = [
  {
    id: "b0000000-0000-0000-0000-000000000001",
    name: "ডা. মাহফুজুর রহমান",
    designation: "সিনিয়র স্পিচ প্যাথলজিস্ট",
    specialty: "স্পিচ থেরাপি, আর্লি ইন্টারভেনশন",
    visit_fee: 1500,
    branch: "ধানমন্ডি, ঢাকা",
    credentials: "MSS (Speech & Language Pathology, DU), BCS (Health), Training in Early Childhood Intervention (UK)",
    experience: "১২+ বছরের দীর্ঘ ক্লিনিক্যাল অভিজ্ঞতা, বিশেষ করে শিশুদের ডাউন সিন্ড্রোম, তোলাতলামি এবং অটিজম স্পেকট্রাম ডিসঅর্ডারের ভাষা ও যোগাযোগ উন্নয়ন চিকিৎসায় তিনি একজন অগ্রগামী থেরাপিস্ট।",
    education: "ঢাকা বিশ্ববিদ্যালয় থেকে স্পিচ অ্যান্ড ল্যাঙ্গুয়েজ প্যাথলজিতে মাস্টার্স এবং শিশু স্নায়ুরোগ ও আচরণ চিকিৎসায় উচ্চতর প্রশিক্ষণ।"
  },
  {
    id: "b0000000-0000-0000-0000-000000000002",
    name: "তাসনিম আক্তার",
    designation: "অটিজম ও আচরণ বিশেষজ্ঞ",
    specialty: "সেন্সরি ইন্টিগ্রেশন, ABA থেরাপি",
    visit_fee: 1200,
    branch: "জিইসি, চট্টগ্রাম",
    credentials: "B.Sc in Occupational Therapy (DU), Certified ABA Practitioner, Sensory Integration Specialist",
    experience: "৮+ বছরের শিশুদের আচরণ ও সংবেদনশীলতা উন্নয়ন সংক্রান্ত অভিজ্ঞতা। সংবেদনশীল ইন্টিগ্রেশন থেরাপি (Sensory Integration) এবং ফলপ্রসূ ফলিত আচরণ বিশ্লেষণে (ABA) দক্ষ ট্রেইনার।",
    education: "চিকিৎসা অনুষদ (ঢাকা বিশ্ববিদ্যালয়) হতে অকুপেশনাল থেরাপিতে স্নাতক এবং ভারতে সংবেদনশীল একীকরণ থেরাপির বিশেষ কোর্স।"
  }
];

const INITIAL_APPOINTMENTS: Appointment[] = [
  {
    id: "booking-101",
    user_id: "a0000000-0000-0000-0000-000000000001",
    therapist_id: "b0000000-0000-0000-0000-000000000001",
    date: "2026-07-20",
    time: "10:30",
    payment_status: "Paid",
    video_call_link: "https://meet.google.com/abc-defg-hij",
    topic: "স্পিচ ফ্লুয়েন্সি ও শব্দ গঠন সেশন"
  },
  {
    id: "booking-102",
    user_id: "a0000000-0000-0000-0000-000000000002",
    therapist_id: "b0000000-0000-0000-0000-000000000002",
    date: "2026-07-25",
    time: "14:15",
    payment_status: "Pending",
    video_call_link: "https://meet.google.com/xyz-uvwx-yz",
    topic: "সেন্সরি ইন্টিগ্রেশন ও অকুপেশনাল এক্সারসাইজ"
  }
];

export default function App() {
  // Hash Routing State
  const [currentHash, setCurrentHash] = useState<string>(window.location.hash || "#/");

  // Authentication State
  const [currentUser, setCurrentUser] = useState<{ email: string; role: "patient" | "therapist" | "admin" } | null>(() => {
    const saved = localStorage.getItem("doctime_current_user");
    return saved ? JSON.parse(saved) : null;
  });

  // Dynamic No-code Page Config with expanded Shopify attributes
  const [pageConfig, setPageConfig] = useState<LandingPageConfig>(() => {
    const saved = localStorage.getItem("doctime_page_config");
    return saved ? JSON.parse(saved) : {
      heroTitle: "স্পিচ থেরাপি ল্যাব\nশিশুর সুন্দর ভবিষ্যৎ গড়ার বিশ্বস্ত ঠিকানা",
      heroDesc: "আমাদের ওয়ান-টু-ওয়ান আধুনিক ক্লিনিক্যাল থেরাপি, চমৎকার বাংলা এএসি (AAC) কথা বলা বোর্ড এবং দেশের স্বনামধন্য অকুপেশনাল ও আচরণ থেরাপিস্টদের নিখুঁত তত্ত্বাবধানে আপনার আদরের শিশুর সুস্থ স্বাভাবিক বিকাশে আমরা সদা প্রস্তুত।",
      heroImage: "",
      themeColor: "#0ea5e9",
      themeColorSecondary: "#ec4899",
      themeBgColor: "#f8fafc",
      themeTextColor: "#0f172a",
      fontFamily: "Inter",
      youtubeEmbed: "https://www.youtube.com/embed/gAnS9xZ5W0E",
      ctaText: "অ্যাপয়েন্টমেন্ট বুকিং শুরু করুন",
      ctaUrl: "#/patient",
      sectionsOrder: ["hero", "services", "therapists", "video", "aac", "custom_code", "contact", "footer"],
      sectionsVisibility: {
        hero: true,
        services: true,
        therapists: true,
        video: true,
        aac: true,
        custom_code: true,
        contact: true,
        footer: true
      },
      customCode: "",
      servicesTitle: "আমাদের ৮টি বিশেষ সেবাসমূহ",
      servicesDesc: "বিশেষ অটিস্টিক ও স্পিচ-ডিলেড শিশুদের দ্রুত ভাষা অর্জন, মনোযোগ বৃদ্ধি ও শারীরিক-মানসিক বিকাশের জন্য প্রস্তুতকৃত আমাদের আধুনিক ল্যাব মেথডস।",
      therapistsTitle: "আমাদের বিশেষজ্ঞ প্যানেল",
      therapistsDesc: "বিশেষজ্ঞ স্পিচ ল্যাঙ্গুয়েজ প্যাথলজিস্ট এবং সার্টিফাইড অকুপেশনাল থেরাপিস্টদের সাথে ওয়ান-টু-ওয়ান পরামর্শ করুন।",
      contactTitle: "অভিভাবক পরামর্শ ও সেশন অনুরোধ ফর্ম",
      contactDesc: "আপনার শিশুর বিশেষ প্রয়োজনে ফ্রি কাউন্সিলিং অথবা সেশন বুকিং করতে নিচের তথ্য দিয়ে অনুরোধ জানান।",
      logoText: "DocTime Speech Lab",
      phoneText: "+৮৮০ ১৭০০-০০০০০০"
    };
  });

  // Fetch site configuration from Supabase site_settings table on initial mount
  useEffect(() => {
    async function loadDbConfig() {
      try {
        const { data, error } = await supabase
          .from("site_settings")
          .select("config")
          .eq("id", "landing_page")
          .single();

        if (error) {
          console.log("Supabase site_settings fetch error or table does not exist yet (using local state fallback):", error);
        } else if (data && data.config) {
          setPageConfig(prev => ({
            ...prev,
            ...data.config,
            // Deep merge safety
            sectionsOrder: data.config.sectionsOrder || prev.sectionsOrder,
            sectionsVisibility: data.config.sectionsVisibility || prev.sectionsVisibility
          }));
          console.log("Supabase site_settings successfully loaded!");
        }
      } catch (err) {
        console.warn("Error fetching Supabase site settings:", err);
      }
    }
    loadDbConfig();
  }, []);

  // Load customizable data from localStorage or fallback
  const [services, setServices] = useState<ServiceCard[]>(() => {
    const saved = localStorage.getItem("doctime_services");
    return saved ? JSON.parse(saved) : DEFAULT_SERVICES;
  });

  const [therapists, setTherapists] = useState<Therapist[]>(() => {
    const saved = localStorage.getItem("doctime_therapists");
    return saved ? JSON.parse(saved) : DEFAULT_THERAPISTS;
  });

  const [appointments, setAppointments] = useState<Appointment[]>(() => {
    const saved = localStorage.getItem("doctime_appointments");
    return saved ? JSON.parse(saved) : INITIAL_APPOINTMENTS;
  });

  const [prescriptions, setPrescriptions] = useState<Prescription[]>(() => {
    const saved = localStorage.getItem("doctime_prescriptions");
    return saved ? JSON.parse(saved) : [];
  });

  // Track Hash changes
  useEffect(() => {
    const handleHashChange = () => {
      setCurrentHash(window.location.hash || "#/");
    };
    window.addEventListener("hashchange", handleHashChange);
    // Smooth scroll to top on hash change
    window.scrollTo({ top: 0, behavior: "smooth" });
    return () => window.removeEventListener("hashchange", handleHashChange);
  }, []);

  const navigateToHash = (hash: string) => {
    window.location.hash = hash;
    setCurrentHash(hash);

    // Auto login for seamless testing via Developer switcher!
    if (hash === "#/patient") {
      setCurrentUser({ email: "arion-demo@speechlab.com", role: "patient" });
    } else if (hash === "#/therapist") {
      setCurrentUser({ email: "shaila-demo@speechlab.com", role: "therapist" });
    } else if (hash === "#/admin") {
      setCurrentUser({ email: "admin-demo@speechlab.com", role: "admin" });
    }
  };

  // Synchronize dynamic lists to localStorage
  useEffect(() => {
    localStorage.setItem("doctime_services", JSON.stringify(services));
  }, [services]);

  useEffect(() => {
    localStorage.setItem("doctime_therapists", JSON.stringify(therapists));
  }, [therapists]);

  useEffect(() => {
    localStorage.setItem("doctime_appointments", JSON.stringify(appointments));
  }, [appointments]);

  useEffect(() => {
    localStorage.setItem("doctime_prescriptions", JSON.stringify(prescriptions));
  }, [prescriptions]);

  useEffect(() => {
    localStorage.setItem("doctime_page_config", JSON.stringify(pageConfig));
  }, [pageConfig]);

  useEffect(() => {
    if (currentUser) {
      localStorage.setItem("doctime_current_user", JSON.stringify(currentUser));
    } else {
      localStorage.removeItem("doctime_current_user");
    }
  }, [currentUser]);

  // Global details / modal state
  const [selectedTherapistForModal, setSelectedTherapistForModal] = useState<Therapist | null>(null);

  // Helper function to render correct Lucide icon
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

  // Helper to fetch user profiles
  const getUserNameById = (id: string) => {
    if (id === "a0000000-0000-0000-0000-000000000001") return "আরিয়ান রহমান";
    if (id === "a0000000-0000-0000-0000-000000000002") return "নাবিলা হাসান";
    return "অজ্ঞাত ব্যবহারকারী";
  };

  // --- THERAPIST PORTAL STATES ---
  const [activeTherapistId, setActiveTherapistId] = useState<string>("b0000000-0000-0000-0000-000000000001");
  const [therapistTab, setTherapistTab] = useState<"schedule" | "prescription_builder" | "prescriptions_list">("schedule");
  
  // Prescription Form State
  const [rxPatientName, setRxPatientName] = useState<string>("আরিয়ান রহমান");
  const [rxAge, setRxAge] = useState<string>("6");
  const [rxDiagnosis, setRxDiagnosis] = useState<string>("শব্দ উচ্চারণে অস্পষ্টতা ও আর্লি অটিজম স্পেকট্রাম ডিল");
  const [rxHomework, setRxHomework] = useState<string>(
    "১. আয়নার সামনে দাঁড়িয়ে জিব বের করে বায়ু প্রবাহ ব্যায়াম (১০ বার)।\n২. 'শ' এবং 'স' বর্ণে অতিরিক্ত বায়ু নির্গমন রোধে ছড়া আবৃত্তি সেশন (দৈনিক ১৫ মিনিট)।\n৩. বেলুন ফুলানোর মাধ্যমে মুখের মোটর স্কিল শক্তিশালী করা।"
  );
  const [rxNextVisit, setRxNextVisit] = useState<string>("2026-07-28");
  const [rxNotes, setRxNotes] = useState<string>("পরবর্তী সেশনে মা অথবা অভিভাবকের উপস্থিতি আবশ্যক। চমৎকার কগনিটিভ উন্নতি দেখা যাচ্ছে।");
  const [latestIssuedRx, setLatestIssuedRx] = useState<Prescription | null>(null);
  const [successToast, setSuccessToast] = useState<string | null>(null);

  const activeTherapist = therapists.find(t => t.id === activeTherapistId) || therapists[0] || DEFAULT_THERAPISTS[0];

  const handleIssuePrescription = (e: React.FormEvent) => {
    e.preventDefault();
    const newRx: Prescription = {
      id: `RX-${Date.now().toString().slice(-5)}`,
      date: new Date().toLocaleDateString("bn-BD"),
      patient_name: rxPatientName,
      age: rxAge,
      diagnosis: rxDiagnosis,
      homework: rxHomework,
      next_visit: rxNextVisit,
      notes: rxNotes,
      therapist_name: activeTherapist.name
    };

    setPrescriptions(prev => [newRx, ...prev]);
    setLatestIssuedRx(newRx);
    triggerToast("প্রেসক্রিপশন সফলভাবে জেনারেট ও সেভ হয়েছে!");
    setTherapistTab("prescriptions_list");
  };

  const triggerToast = (msg: string) => {
    setSuccessToast(msg);
    setTimeout(() => setSuccessToast(null), 3500);
  };

  // --- ADMIN PORTAL STATES ---
  const [adminTab, setAdminTab] = useState<"services_manager" | "therapist_manager" | "security_audit">("services_manager");
  const [editingServiceId, setEditingServiceId] = useState<string | null>(null);
  const [editTitleBangla, setEditTitleBangla] = useState("");
  const [editTitleEnglish, setEditTitleEnglish] = useState("");
  const [editDescBangla, setEditDescBangla] = useState("");
  const [editTag, setEditTag] = useState("");

  // Therapist uploader state
  const [newTherapistName, setNewTherapistName] = useState("");
  const [newTherapistDesig, setNewTherapistDesig] = useState("");
  const [newTherapistSpecialty, setNewTherapistSpecialty] = useState("");
  const [newTherapistFee, setNewTherapistFee] = useState<number>(1200);
  const [newTherapistBranch, setNewTherapistBranch] = useState("ধানমন্ডি, ঢাকা");
  const [newTherapistCredentials, setNewTherapistCredentials] = useState("");
  const [newTherapistExperience, setNewTherapistExperience] = useState("");
  const [newTherapistEducation, setNewTherapistEducation] = useState("");

  // Drag and Drop files (photo uploader)
  const [dragOver, setDragOver] = useState(false);
  const [uploadedPhotoUrl, setUploadedPhotoUrl] = useState<string | null>(null);

  const startEditService = (service: ServiceCard) => {
    setEditingServiceId(service.id);
    setEditTitleBangla(service.titleBangla);
    setEditTitleEnglish(service.titleEnglish);
    setEditDescBangla(service.descBangla);
    setEditTag(service.tag);
  };

  const saveServiceEdit = (id: string) => {
    setServices(prev => prev.map(s => {
      if (s.id === id) {
        return {
          ...s,
          titleBangla: editTitleBangla,
          titleEnglish: editTitleEnglish,
          descBangla: editDescBangla,
          tag: editTag
        };
      }
      return s;
    }));
    setEditingServiceId(null);
    triggerToast("সেবা কার্ড কন্টেন্ট সফলভাবে আপডেট হয়েছে!");
  };

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
        triggerToast("ছবি সফলভাবে আপলোড হয়েছে (প্রিভিউ তৈরি)");
      };
      reader.readAsDataURL(file);
    } else {
      alert("দয়া করে শুধুমাত্র ছবি ফাইল (PNG/JPEG) আপলোড করুন।");
    }
  };

  const handleAddTherapist = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTherapistName) return;

    const newTherapist: Therapist = {
      id: `b0000000-0000-0000-0000-${Date.now().toString().slice(-12)}`,
      name: newTherapistName,
      designation: newTherapistDesig || "জুনিয়র স্পিচ অ্যান্ড ল্যাঙ্গুয়েজ থেরাপিস্ট",
      specialty: newTherapistSpecialty || "স্পিচ ডিল থেরাপি",
      visit_fee: newTherapistFee,
      branch: newTherapistBranch,
      credentials: newTherapistCredentials || "MSS (Speech & Language Pathology, DU)",
      experience: newTherapistExperience || "শিশুদের ভাষা ও সেশন কন্টাক্ট বিষয়ে ২+ বছরের অভিজ্ঞতা রয়েছে।",
      education: newTherapistEducation || "ঢাকা বিশ্ববিদ্যালয় স্পিচ থেরাপি অনুষদ থেকে স্নাতক ডিগ্রি অর্জন।",
      avatar_url: uploadedPhotoUrl || undefined
    };

    setTherapists(prev => [...prev, newTherapist]);
    triggerToast(`নতুন থেরাপিস্ট ${newTherapistName} সফলভাবে যুক্ত করা হয়েছে!`);
    
    // Reset Form
    setNewTherapistName("");
    setNewTherapistDesig("");
    setNewTherapistSpecialty("");
    setNewTherapistFee(1200);
    setNewTherapistCredentials("");
    setNewTherapistExperience("");
    setNewTherapistEducation("");
    setUploadedPhotoUrl(null);
  };

  const handleDeleteTherapist = (id: string, name: string) => {
    if (window.confirm(`আপনি কি নিশ্চিতভাবে থেরাপিস্ট "${name}" কে মুছে দিতে চান?`)) {
      setTherapists(prev => prev.filter(t => t.id !== id));
      triggerToast(`থেরাপিস্ট ${name} কে মুছে ফেলা হয়েছে।`);
    }
  };

  // --- SECURITY SIMULATOR STATES (PRESERVED) ---
  const [auditUserRole, setAuditUserRole] = useState<string>("patient_own");
  const [auditTargetTable, setAuditTargetTable] = useState<string>("users");
  const [redirSimRole, setRedirSimRole] = useState<"patient" | "therapist" | "admin" | "unauthenticated">("patient");
  const [redirSimRoute, setRedirSimRoute] = useState<string>("/dashboard/patient");
  const [redirCodeTab, setRedirCodeTab] = useState<"redirect" | "guard">("redirect");
  const [copied, setCopied] = useState<string | null>(null);

  const runRedirectSimulation = (role: string, targetPath: string) => {
    if (role === "unauthenticated") {
      return {
        status: "REDIRECTED" as const,
        finalPath: "/login",
        message: "সুপাবেস সেশন পাওয়া যায়নি (No active session)। নিরাপত্তার স্বার্থে সিস্টেম তাকে '/login' পেজে রিডাইরেক্ট করেছে।",
        colorClass: "bg-amber-50 text-amber-950 border-amber-200",
        iconColor: "text-amber-500",
        actionTaken: "Redirected to login"
      };
    }

    if (targetPath === "/admin-portal") {
      if (role === "admin") {
        return {
          status: "GRANTED" as const,
          finalPath: "/admin-portal",
          message: "অ্যাক্সেস অনুমোদিত (Authorized)! আপনার রোল 'admin' হওয়ায় আপনি সাফল্যের সাথে এডমিন পোর্টালে প্রবেশ করতে পেরেছেন।",
          colorClass: "bg-emerald-50 text-emerald-950 border-emerald-200",
          iconColor: "text-emerald-500",
          actionTaken: "Access Granted"
        };
      } else {
        return {
          status: "BLOCKED" as const,
          finalPath: role === "patient" ? "/dashboard/patient" : "/dashboard/therapist",
          message: `অ্যাক্সেস প্রত্যাখ্যাত (Unauthorized - Route Protection)! আপনার রোল '${role}' কিন্তু টার্গেট রাউট শুধুমাত্র এডমিনের জন্য সংরক্ষিত। নিরাপত্তার জন্য আপনাকে রিডাইরেক্ট করে '${role === "patient" ? "/dashboard/patient" : "/dashboard/therapist"}' পেজে ফেরত পাঠানো হয়েছে।`,
          colorClass: "bg-rose-50 text-rose-950 border-rose-200",
          iconColor: "text-rose-500",
          actionTaken: "Blocked & Fallback Redirected"
        };
      }
    }

    if (targetPath === "/dashboard/patient") {
      if (role === "patient" || role === "admin") {
        return {
          status: "GRANTED" as const,
          finalPath: "/dashboard/patient",
          message: `অ্যাক্সেস অনুমোদিত (Authorized)! আপনার রোল '${role}' হওয়ায় আপনি এই পেজে প্রবেশ করতে পেরেছেন।`,
          colorClass: "bg-emerald-50 text-emerald-950 border-emerald-200",
          iconColor: "text-emerald-500",
          actionTaken: "Access Granted"
        };
      } else {
        return {
          status: "BLOCKED" as const,
          finalPath: "/dashboard/therapist",
          message: "অ্যাক্সেস প্রত্যাখ্যাত! আপনার রোল 'therapist' হওয়ায় আপনি রোগীর ড্যাশবোর্ডে প্রবেশ করতে পারবেন না। আপনাকে '/dashboard/therapist' পেজে পাঠানো হয়েছে।",
          colorClass: "bg-rose-50 text-rose-950 border-rose-200",
          iconColor: "text-rose-500",
          actionTaken: "Redirected to therapist home"
        };
      }
    }

    if (targetPath === "/dashboard/therapist") {
      if (role === "therapist" || role === "admin") {
        return {
          status: "GRANTED" as const,
          finalPath: "/dashboard/therapist",
          message: `অ্যাক্সেস অনুমোদিত (Authorized)! আপনার রোল '${role}' হওয়ায় আপনি থেরাপিস্ট ড্যাশবোর্ডে প্রবেশ করতে পেরেছেন।`,
          colorClass: "bg-emerald-50 text-emerald-950 border-emerald-200",
          iconColor: "text-emerald-500",
          actionTaken: "Access Granted"
        };
      } else {
        return {
          status: "BLOCKED" as const,
          finalPath: "/dashboard/patient",
          message: "অ্যাক্সেস প্রত্যাখ্যাত! আপনার রোল 'patient' হওয়ায় আপনি থেরাপিস্ট ড্যাশবোর্ডে প্রবেশ করতে পারবেন না। আপনাকে '/dashboard/patient' পেজে ফেরত পাঠানো হয়েছে।",
          colorClass: "bg-rose-50 text-rose-950 border-rose-200",
          iconColor: "text-rose-500",
          actionTaken: "Redirected to patient home"
        };
      }
    }

    return {
      status: "GRANTED" as const,
      finalPath: targetPath,
      message: "অ্যাক্সেস অনুমোদিত।",
      colorClass: "bg-slate-50 text-slate-900 border-slate-200",
      iconColor: "text-slate-500",
      actionTaken: "Access Granted"
    };
  };

  const redirectSimResult = runRedirectSimulation(redirSimRole, redirSimRoute);

  const runSecurityAudit = (role: string, table: string) => {
    if (role === "patient_own") {
      return {
        status: "ALLOWED" as const,
        title: "অনুমতি দেওয়া হয়েছে (Access Granted)",
        details: `সুপাবেস RLS পলিসি (using auth.uid() = id অথবা user_id) সফলভাবে কাজ করছে। ব্যবহারকারী নিজের আইডির তথ্য অ্যাক্সেস করছেন।`,
        policyApplied: `CREATE POLICY "সবাই নিজের প্রোফাইল দেখতে পারবে" ON ${table}`
      };
    }
    if (role === "patient_other") {
      return {
        status: "BLOCKED" as const,
        title: "অ্যাক্সেস ব্লকড (Access Blocked - RLS Blocked)",
        details: `নিরাপত্তা লঙ্ঘন সনাক্ত করা হয়েছে! কোনো সাধারণ ব্যবহারকারী বা রোগী অন্য রোগীর গোপনীয় প্রোফাইল, সেশন বুকিং বা স্ক্রিনিং রিপোর্ট অ্যাক্সেস করতে পারবেন না।`,
        errorCode: "42501 (Insufficient Privilege)",
        policyApplied: "CREATE POLICY (Default Deny - No Matching ALLOW Policy)"
      };
    }
    if (role === "therapist_own") {
      if (table === "users") {
        return {
          status: "ALLOWED" as const,
          title: "অনুমতি দেওয়া হয়েছে (Access Granted)",
          details: `সুপাবেস RLS পলিসি অনুযায়ী থেরাপিস্ট নিজের ইউজার আইডি অ্যাক্সেস করছেন।`,
          policyApplied: "CREATE POLICY \"ইউজাররা নিজের প্রোফাইল দেখতে ও আপডেট করতে পারবেন\" ON users"
        };
      }
      if (table === "bookings") {
        return {
          status: "ALLOWED" as const,
          title: "অনুমতি দেওয়া হয়েছে (Access Granted)",
          details: `সুপাবেস RLS পলিসি (auth.uid() = therapist_id) অনুযায়ী থেরাপিস্ট শুধুমাত্র তাকে দেওয়া সেশন বুকিংগুলো অ্যাক্সেস করছেন।`,
          policyApplied: "CREATE POLICY \"থেরাপিস্টরা শুধুমাত্র নিজের বুকিং দেখতে পারবেন\" ON bookings"
        };
      }
      return {
        status: "BLOCKED" as const,
        title: "অ্যাক্সেস ব্লকড (Access Blocked)",
        details: `থেরাপিস্ট সরাসরি রোগীর প্রাইভেট স্ক্রিনিং রিপোর্ট রিড করতে পারবেন না, যদি না রোগী শেয়ার করেন।`,
        errorCode: "42501 (Insufficient Privilege)",
        policyApplied: "CREATE POLICY (Default Deny)"
      };
    }
    if (table === "bookings") {
      return {
        status: "BLOCKED" as const,
        title: "অ্যাক্সেস ব্লকড (Access Blocked)",
        details: `সুপাবেস RLS পলিসি লঙ্ঘন! একজন থেরাপিস্ট অন্য থেরাপিস্টের বুকিং বা রোগীবান্ধব ডাটা দেখতে পারবেন না।`,
        errorCode: "42501 (Insufficient Privilege)",
        policyApplied: "CREATE POLICY \"থেরাপিস্টরা শুধুমাত্র নিজের বুকিং দেখতে পারবেন\" ON bookings"
      };
    }
    return {
      status: "BLOCKED" as const,
      title: "অ্যাক্সেস ব্লকড (Access Blocked)",
      details: `নিরাপত্তা বিধি লঙ্ঘন। অন্য থেরাপিস্ট বা ইউজারের তথ্য অ্যাক্সেস করা সম্পূর্ণভাবে নিষিদ্ধ।`,
      errorCode: "42501 (Insufficient Privilege)",
      policyApplied: "CREATE POLICY (Default Deny)"
    };
  };

  const auditInfo = runSecurityAudit(auditUserRole, auditTargetTable);

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopied(id);
    setTimeout(() => setCopied(null), 2000);
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans relative flex flex-col">
      
      {/* SUCCESS TOAST MESSAGE */}
      {successToast && (
        <div className="fixed top-6 right-6 bg-slate-900 border border-emerald-500 text-white px-5 py-3.5 rounded-2xl shadow-2xl flex items-center gap-3 z-50 animate-bounce">
          <div className="w-5 h-5 rounded-full bg-emerald-500 flex items-center justify-center text-white text-xs font-black">
            ✓
          </div>
          <span className="text-xs font-bold font-sans">{successToast}</span>
        </div>
      )}

      {/* RENDER VIEW ACCORDING TO HASH ROUTE */}
      
      {/* 1. VISITOR / DOC-TIME STYLE LANDING PAGE ( #/ or Empty) */}
      {(currentHash === "#/" || currentHash === "") && (
        <PublicLandingPage
          pageConfig={pageConfig}
          services={services}
          therapists={therapists}
          onNavigate={navigateToHash}
          onSelectTherapist={(therapist) => setSelectedTherapistForModal(therapist)}
        />
      )}

      {/* LOGIN ROUTE */}
      {currentHash === "#/login" && (
        <LoginScreen 
          onLoginSuccess={(role, email) => {
            setCurrentUser({ role, email });
            triggerToast(`${role === "admin" ? "এডমিন" : role === "therapist" ? "থেরাপিস্ট" : "পেশেন্ট"} হিসেবে সফলভাবে লগইন হয়েছে!`);
            navigateToHash(role === "admin" ? "#/admin" : role === "therapist" ? "#/therapist" : "#/patient");
          }}
          onNavigateBack={() => navigateToHash("#/")}
        />
      )}

      {/* 2. PATIENT DASHBOARD ROUTE ( #/patient ) */}
      {currentHash === "#/patient" && (
        !currentUser ? (
          <div className="flex-1 flex flex-col items-center justify-center min-h-screen bg-slate-50 p-6">
            <div className="w-16 h-16 bg-amber-50 rounded-full flex items-center justify-center text-amber-500 text-3xl mb-4 animate-bounce">⚠️</div>
            <h3 className="text-lg font-black text-slate-800">লগইন প্রয়োজন</h3>
            <p className="text-xs text-slate-500 mt-1 max-w-xs text-center">পেশেন্ট ড্যাশবোর্ড ব্যবহারের জন্য দয়া করে আপনার অ্যাকাউন্ট দিয়ে প্রবেশ করুন।</p>
            <button 
              onClick={() => navigateToHash("#/login")}
              className="mt-4 bg-sky-500 text-white font-extrabold text-xs px-5 py-2.5 rounded-xl hover:bg-sky-600 transition-all cursor-pointer shadow-sm"
            >
              লগইন পেজে যান
            </button>
          </div>
        ) : (
          <div className="flex-1 flex flex-col">
            {/* Dashboard specific Header bar */}
            <header className="bg-white border-b border-slate-200/80 px-6 sm:px-12 py-3.5 flex items-center justify-between shadow-xs shrink-0">
              <div className="flex items-center gap-2.5">
                <button 
                  onClick={() => navigateToHash("#/")}
                  className="hover:bg-slate-100 p-1.5 rounded-lg transition-colors cursor-pointer mr-1"
                  title="হোম পেজে ফিরে যান"
                >
                  <Home className="w-5 h-5 text-slate-600" />
                </button>
                <span className="font-black text-slate-900 text-sm sm:text-base">পেশেন্ট অ্যান্ড প্যারেন্ট পোর্টাল</span>
                <span className="text-xs bg-emerald-50 text-emerald-700 font-bold px-2.5 py-0.5 rounded-full border border-emerald-100 uppercase tracking-wider">
                  আরিয়ান রহমান
                </span>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-xs text-slate-400 font-medium hidden sm:inline">ইমেইল: <strong className="text-slate-800 font-mono font-bold">{currentUser.email}</strong></span>
                <button 
                  onClick={() => {
                    setCurrentUser(null);
                    navigateToHash("#/");
                  }}
                  className="bg-rose-50 text-rose-600 hover:bg-rose-100 px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer"
                >
                  লগআউট
                </button>
              </div>
            </header>

            <div className="flex-1 overflow-y-auto">
              <PatientDashboard onNavigate={navigateToHash} prescriptions={prescriptions} />
            </div>
          </div>
        )
      )}

      {/* 3. THERAPIST PORTAL ROUTE ( #/therapist ) */}
      {currentHash === "#/therapist" && (
        !currentUser ? (
          <div className="flex-1 flex flex-col items-center justify-center min-h-screen bg-slate-50 p-6">
            <div className="w-16 h-16 bg-amber-50 rounded-full flex items-center justify-center text-amber-500 text-3xl mb-4 animate-bounce">⚠️</div>
            <h3 className="text-lg font-black text-slate-800">লগইন প্রয়োজন</h3>
            <p className="text-xs text-slate-500 mt-1 max-w-xs text-center">Therapist ড্যাশবোর্ড ব্যবহারের জন্য দয়া করে আপনার অ্যাকাউন্ট দিয়ে প্রবেশ করুন।</p>
            <button 
              onClick={() => navigateToHash("#/login")}
              className="mt-4 bg-sky-500 text-white font-extrabold text-xs px-5 py-2.5 rounded-xl hover:bg-sky-600 transition-all cursor-pointer shadow-sm"
            >
              লগইন পেজে যান
            </button>
          </div>
        ) : (
          <TherapistDashboard 
            activeTherapist={activeTherapist}
            appointments={appointments}
            prescriptions={prescriptions}
            onAddPrescription={(newRx) => setPrescriptions(prev => [newRx, ...prev])}
            onNavigate={navigateToHash}
            triggerToast={triggerToast}
          />
        )
      )}

      {/* 4. ADMIN DASHBOARD ROUTE ( #/admin ) */}
      {currentHash === "#/admin" && (
        !currentUser ? (
          <div className="flex-1 flex flex-col items-center justify-center min-h-screen bg-slate-50 p-6">
            <div className="w-16 h-16 bg-amber-50 rounded-full flex items-center justify-center text-amber-500 text-3xl mb-4 animate-bounce">⚠️</div>
            <h3 className="text-lg font-black text-slate-800">লগইন প্রয়োজন</h3>
            <p className="text-xs text-slate-500 mt-1 max-w-xs text-center">Admin কনসোল ব্যবহারের জন্য দয়া করে আপনার অ্যাকাউন্ট দিয়ে প্রবেশ করুন।</p>
            <button 
              onClick={() => navigateToHash("#/login")}
              className="mt-4 bg-sky-500 text-white font-extrabold text-xs px-5 py-2.5 rounded-xl hover:bg-sky-600 transition-all cursor-pointer shadow-sm"
            >
              লগইন পেজে যান
            </button>
          </div>
        ) : (
          <AdminDashboard 
            therapists={therapists}
            onAddTherapist={(newTherapist) => setTherapists(prev => [...prev, newTherapist])}
            onDeleteTherapist={(id, name) => {
              setTherapists(prev => prev.filter(t => t.id !== id));
              triggerToast(`থেরাপিস্ট ${name} সফলভাবে অপসারিত হয়েছেন!`);
            }}
            onNavigate={navigateToHash}
            pageConfig={pageConfig}
            onSavePageConfig={async (newConfig) => {
              setPageConfig(newConfig);
              localStorage.setItem("doctime_page_config", JSON.stringify(newConfig));
              try {
                const { error } = await supabase.from("site_settings").upsert({
                  id: "landing_page",
                  config: newConfig,
                  updated_at: new Date().toISOString()
                });
                if (error) {
                  console.warn("Supabase site_settings sync issue:", error);
                } else {
                  console.log("Supabase site_settings synchronized successfully!");
                }
              } catch (err) {
                console.warn("DB offline or connection issue:", err);
              }
              triggerToast("ল্যান্ডিং পেজ কাস্টমাইজেশন সফলভাবে সেভ করা হয়েছে!");
            }}
            triggerToast={triggerToast}
          />
        )
      )}

      {/* --- DEVELOPER QUICK-SWITCH FLOATING TOOLBAR --- */}
      <div className="fixed bottom-6 left-1/2 -translate-x-1/2 bg-slate-950/90 text-white px-5 py-3 rounded-2xl sm:rounded-full shadow-2xl border border-slate-800 backdrop-blur-md flex flex-col sm:flex-row items-center gap-4 z-50 animate-fadeIn select-none max-w-max">
        
        {/* Floating title */}
        <div className="flex items-center gap-2 border-b sm:border-b-0 sm:border-r border-slate-800 pb-2 sm:pb-0 sm:pr-4">
          <div className="w-2 h-2 rounded-full bg-sky-400 animate-pulse"></div>
          <span className="text-[10px] font-black text-slate-300 uppercase tracking-widest font-sans">🛠️ Test Switcher</span>
        </div>

        {/* Buttons Switch Grid */}
        <div className="flex flex-wrap items-center justify-center gap-2">
          
          <button
            onClick={() => navigateToHash("#/")}
            className={`px-3 py-1.5 rounded-xl text-[11px] font-black tracking-tight transition-all flex items-center gap-1 cursor-pointer ${
              currentHash === "#/" || currentHash === ""
                ? "bg-sky-500 text-white shadow-md shadow-sky-900/40"
                : "text-slate-400 hover:text-white hover:bg-white/5"
            }`}
          >
            <span>🌐</span>
            <span>Visitor Mode</span>
          </button>

          <button
            onClick={() => navigateToHash("#/patient")}
            className={`px-3 py-1.5 rounded-xl text-[11px] font-black tracking-tight transition-all flex items-center gap-1 cursor-pointer ${
              currentHash === "#/patient"
                ? "bg-emerald-500 text-white shadow-md shadow-emerald-900/40 animate-pulse"
                : "text-slate-400 hover:text-white hover:bg-white/5"
            }`}
          >
            <span>👶</span>
            <span>Patient Board</span>
          </button>

          <button
            onClick={() => navigateToHash("#/therapist")}
            className={`px-3 py-1.5 rounded-xl text-[11px] font-black tracking-tight transition-all flex items-center gap-1 cursor-pointer ${
              currentHash === "#/therapist"
                ? "bg-indigo-500 text-white shadow-md shadow-indigo-900/40"
                : "text-slate-400 hover:text-white hover:bg-white/5"
            }`}
          >
            <span>🩺</span>
            <span>Therapist Board</span>
          </button>

          <button
            onClick={() => navigateToHash("#/admin")}
            className={`px-3 py-1.5 rounded-xl text-[11px] font-black tracking-tight transition-all flex items-center gap-1 cursor-pointer ${
              currentHash === "#/admin"
                ? "bg-amber-500 text-slate-950 font-black shadow-md shadow-amber-900/40"
                : "text-slate-400 hover:text-white hover:bg-white/5"
            }`}
          >
            <span>👑</span>
            <span>Admin Panel</span>
          </button>

        </div>

      </div>

      {/* --- CLINICAL THERAPIST BIOGRAPHY DETAIL MODAL --- */}
      {selectedTherapistForModal && (
        <div className="fixed inset-0 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-fadeIn">
          <div className="bg-white rounded-3xl border border-slate-150 shadow-2xl max-w-lg w-full overflow-hidden relative animate-scaleUp">
            
            {/* Header banner/card colored */}
            <div className="bg-linear-to-r from-sky-500 to-indigo-600 p-6 text-white relative">
              <button
                type="button"
                onClick={() => setSelectedTherapistForModal(null)}
                className="absolute top-4 right-4 bg-white/15 hover:bg-white/25 text-white p-1.5 rounded-full transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="flex items-center gap-4">
                {selectedTherapistForModal.avatar_url ? (
                  <img 
                    src={selectedTherapistForModal.avatar_url} 
                    alt={selectedTherapistForModal.name} 
                    referrerPolicy="no-referrer"
                    className="w-14 h-14 rounded-2xl object-cover border-2 border-white/20 shrink-0" 
                  />
                ) : (
                  <div className="w-14 h-14 rounded-2xl bg-white text-indigo-600 flex items-center justify-center text-2xl font-black shadow-md shrink-0 font-display">
                    {selectedTherapistForModal.name.includes("ডা.") ? "ডা" : selectedTherapistForModal.name[0]}
                  </div>
                )}
                <div>
                  <span className="bg-white/20 text-white text-[9px] font-bold px-2.5 py-0.5 rounded-full uppercase tracking-wider">
                    বিশেষজ্ঞ স্পিচ প্যাথলজিস্ট
                  </span>
                  <h3 className="text-lg sm:text-xl font-extrabold font-display mt-0.5">{selectedTherapistForModal.name}</h3>
                  <p className="text-sky-100 text-xs font-semibold">{selectedTherapistForModal.designation}</p>
                </div>
              </div>
            </div>

            {/* Modal Body */}
            <div className="p-6 sm:p-8 space-y-5 max-h-[60vh] overflow-y-auto text-xs sm:text-sm">
              <div className="space-y-1">
                <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">স্পেশালটি ও ফিল্ডস (Specialty)</h4>
                <p className="text-xs font-extrabold text-indigo-950 bg-indigo-50/50 border border-indigo-100 px-3 py-1.5 rounded-xl inline-block">
                  🎯 {selectedTherapistForModal.specialty}
                </p>
              </div>

              <div className="space-y-1.5">
                <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">শিক্ষাগত যোগ্যতা ও ট্রেইনিং (Qualifications)</h4>
                <p className="text-xs text-slate-700 leading-relaxed font-semibold bg-slate-50 p-3 rounded-xl border border-slate-150">
                  {selectedTherapistForModal.credentials}
                </p>
              </div>

              <div className="space-y-1.5">
                <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">ক্লিনিক্যাল অভিজ্ঞতা (Clinical Experience)</h4>
                <p className="text-xs text-slate-600 leading-relaxed font-medium whitespace-pre-line">
                  {selectedTherapistForModal.experience}
                </p>
              </div>

              <div className="space-y-1.5">
                <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">উচ্চতর শিক্ষা ও লাইসেন্স (Education)</h4>
                <p className="text-xs text-slate-600 leading-relaxed font-medium whitespace-pre-line">
                  {selectedTherapistForModal.education}
                </p>
              </div>

              {/* Visit Fee and location badges */}
              <div className="grid grid-cols-2 gap-3.5 pt-3 border-t border-slate-100 text-xs">
                <div className="bg-slate-50 p-3 rounded-xl border border-slate-150">
                  <span className="text-[10px] text-slate-400 font-bold block uppercase tracking-wider">ভিজিট ফি (Fee)</span>
                  <span className="font-extrabold text-indigo-600 text-xs sm:text-sm">{selectedTherapistForModal.visit_fee} BDT</span>
                </div>
                <div className="bg-slate-50 p-3 rounded-xl border border-slate-150">
                  <span className="text-[10px] text-slate-400 font-bold block uppercase tracking-wider">ক্লিনিক ব্রাঞ্চ (Branch)</span>
                  <span className="font-extrabold text-slate-800 text-xs sm:text-sm">{selectedTherapistForModal.branch}</span>
                </div>
              </div>
            </div>

            {/* Footer with close button */}
            <div className="p-4 bg-slate-50 border-t border-slate-100 flex justify-end">
              <button
                type="button"
                onClick={() => setSelectedTherapistForModal(null)}
                className="bg-slate-900 hover:bg-slate-800 text-white text-xs font-extrabold px-6 py-2.5 rounded-xl transition-colors cursor-pointer shadow-2xs"
              >
                বন্ধ করুন (Close)
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}
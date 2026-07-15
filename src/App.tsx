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
  Stethoscope
} from "lucide-react";

import PatientDashboard from "./components/PatientDashboard";

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
    descBangla: "শিশুদের স্পষ্ট কথা বলা, শব্দ উচ্চারণ, তোলাতলামি দূর করা এবং সঠিক যোগাযোগের দক্ষতা বাড়াতে প্রফেশনাল স্পিচ প্যাথলজিস্টদের ওয়ান-টু-ওয়ান আধুনিক থেরাপি সেশন।",
    iconName: "Activity",
    bgColor: "bg-sky-50/80 border-sky-200/60",
    accentColor: "text-sky-700 bg-sky-100/70",
    tag: "ক্লিনিক্যাল থেরাপি"
  },
  {
    id: "apon_ghor",
    titleBangla: "২. আপন ঘর (Apon Ghor)",
    titleEnglish: "Sensory & Daycare Play Home",
    descBangla: "বিশেষ চাহিদাসম্পন্ন শিশুদের জন্য সম্পূর্ণ নিরাপদ, কোলাহলমুক্ত এবং সেন্সরি-ফ্রেন্ডলি ডে-কেয়ার ও প্লে-হোম। যেখানে প্রতিটি শিশু পাবে মায়ের মতো পরম যত্ন ও স্নেহময় পরিবেশ।",
    iconName: "Home",
    bgColor: "bg-rose-50/80 border-rose-200/60",
    accentColor: "text-rose-700 bg-rose-100/70",
    tag: "সেন্সরি ডে-কেয়ার"
  },
  {
    id: "anandomoye",
    titleBangla: "৩. আনন্দময়ী (Anandomoye)",
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
    descBangla: "স্মার্ট লার্নিং বোর্ড এবং বিশেষ গেমের মাধ্যমে শিশুদের ব্রেইনের মোটর স্কিল, আই-কন্টাক্ট, প্রব্লেম সলভিং এবিলিটি এবং কগনিティブ ডেভেলপমেন্ট উন্নত করার বিশেষ ল্যাব।",
    iconName: "Gamepad2",
    bgColor: "bg-amber-50/80 border-amber-200/60",
    accentColor: "text-amber-700 bg-amber-100/70",
    tag: "কগনিটিভ গেম"
  },
  {
    id: "development_care_academy",
    titleBangla: "৫. ডেভেলপমেন্ট কেয়ার একাডেমি (Development Care Academy)",
    titleEnglish: "Specialized Pre-School Training",
    descBangla: "অটিজম এবং ডাউন সিন্ড্রোমে আক্রান্ত শিশুদের জন্য বিশেষ প্রাক-বিদ্যালয় শিক্ষা পদ্ধতি, সামাজিক আচরণ গ্রুপ লার্নিং এবং ইন্টারেক্টিভ বিহেভিওরাল থেরাপি (ABA)।",
    iconName: "GraduationCap",
    bgColor: "bg-emerald-50/80 border-emerald-200/60",
    accentColor: "text-emerald-700 bg-emerald-100/70",
    tag: "স্পেশাল স্কুলিং"
  },
  {
    id: "professional_home_therapy",
    titleBangla: "৬. প্রফেশনাল হোম থেরাপি কেয়ার (Home Therapy)",
    titleEnglish: "Qualified In-Home Therapists",
    descBangla: "যাতায়াতের সমস্যা দূর করতে আমাদের সার্টিফাইড অভিজ্ঞ থেরাপিস্টগণ সরাসরি আপনার বাসায় গিয়ে অত্যন্ত আন্তরিকতার সাথে স্পিচ ও অকুপেশনাল থেরাপি প্রদান করবেন।",
    iconName: "Sparkle",
    bgColor: "bg-teal-50/80 border-teal-200/60",
    accentColor: "text-teal-700 bg-teal-100/70",
    tag: "হোম সার্ভিস"
  },
  {
    id: "toy_lab",
    titleBangla: "৭. খেলনা ল্যাব (Toy-Lab)",
    titleEnglish: "Sensory Toys Library & Rent",
    descBangla: "বিশেষ শিশুদের ব্রেইনের জন্য উপযোগী উন্নতমানের সেন্সরি খেলনা, মন্টেসরি পাজল এবং মোটর-স্কিল খেলনা লাইব্রেরি। এখান থেকে খেলনা ট্রায়াল ও ভাড়ায় নেওয়া সম্ভব।",
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
    tag: "৫০% ছাড়!",
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
    experience: "১২+ বছরের দীর্ঘ ক্লিনিক্যাল অভিজ্ঞতা, বিশেষ করে শিশুদের ডাউন সিন্ড্রোম, তোলাতলামি এবং অটিজম স্পেকট্রাম ডিসঅর্ডারের ভাষা ও যোগাযোগ উন্নয়ন চিকিৎসায় তিনি একজন অগ্রগামী থেরাপিস্ট।",
    education: "ঢাকা বিশ্ববিদ্যালয় থেকে স্পিচ অ্যান্ড ল্যাঙ্গুয়েজ প্যাথলজিতে মাস্টার্স এবং শিশু স্নায়ুরোগ ও আচরণ চিকিৎসায় উচ্চতর প্রশিক্ষণ।"
  },
  {
    id: "b0000000-0000-0000-0000-000000000002",
    name: "তাসনিম আক্তার",
    designation: "অটিজম ও আচরণ বিশেষজ্ঞ",
    specialty: "সেন্সরি ইন্টিগ্রেশন, ABA থেরাপি",
    visit_fee: 1200,
    branch: "জিইসি, চট্টগ্রাম",
    credentials: "B.Sc in Occupational Therapy (DU), Certified ABA Practitioner, Sensory Integration Specialist",
    experience: "৮+ বছরের শিশুদের আচরণ ও সংবেদনশীলতা উন্নয়ন সংক্রান্ত অভিজ্ঞতা। সংবেদনশীল ইন্টিগ্রেশন থেরাপি (Sensory Integration) এবং ফলপ্রসূ ফলিত আচরণ বিশ্লেষণে (ABA) দক্ষ ট্রেইনার।",
    education: "চিকিৎসা অনুষদ (ঢাকা বিশ্ববিদ্যালয়) হতে অকুপেশনাল থেরাপিতে স্নাতক এবং ভারতে সংবেদনশীল একীকরণ থেরাপির বিশেষ কোর্স।"
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
    topic: "স্পিচ ফ্লুয়েন্সি ও শব্দ গঠন সেশন"
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
    if (id === "a0000000-0000-0000-0000-000000000001") return "আরিয়ান রহমান";
    if (id === "a0000000-0000-0000-0000-000000000002") return "নাবিলা হাসান";
    return "অজ্ঞাত ব্যবহারকারী";
  };

  // --- THERAPIST PORTAL STATES ---
  const [activeTherapistId, setActiveTherapistId] = useState<string>("b0000000-0000-0000-0000-000000000001");
  const [therapistTab, setTherapistTab] = useState<"schedule" | "prescription_builder" | "prescriptions_list">("schedule");
  
  // Prescription Form State
  const [rxPatientName, setRxPatientName] = useState<string>("আরিয়ান রহমান");
  const [rxAge, setRxAge] = useState<string>("6");
  const [rxDiagnosis, setRxDiagnosis] = useState<string>("শব্দ উচ্চারণে অস্পষ্টতা ও আর্লি অটিজম স্পেকট্রাম ডিল");
  const [rxHomework, setRxHomework] = useState<string>(
    "১. আয়নার সামনে দাঁড়িয়ে জিব বের করে বায়ু প্রবাহ ব্যায়াম (১০ বার)।\n২. 'শ' এবং 'স' বর্ণে অতিরিক্ত বায়ু নির্গমন রোধে ছড়া আবৃত্তি সেশন (দৈনিক ১৫ মিনিট)।\n৩. বেলুন ফুলানোর মাধ্যমে মুখের মোটর স্কিল শক্তিশালী করা।"
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
    triggerToast("প্রেসক্রিপশন সফলভাবে জেনারেট ও সেভ হয়েছে!");
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
  
  // Drag and Drop files
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
    triggerToast("সেবা কার্ড কন্টেন্ট সফলভাবে আপডেট হয়েছে!");
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
        triggerToast("ছবি সফলভাবে আপলোড হয়েছে (প্রিভিউ তৈরি)");
      };
      reader.readAsDataURL(file);
    } else {
      alert("দয়া করে শুধুমাত্র ছবি ফাইল (PNG/JPEG) আপলোড করুন।");
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
      experience: newTherapistExperience || "শিশুদের ভাষা ও সেশন কন্টাক্ট বিষয়ে ২+ বছরের অভিজ্ঞতা রয়েছে।",
      education: newTherapistEducation || "ঢাকা বিশ্ববিদ্যালয় স্পিচ থেরাপি অনুষদ থেকে স্নাতক ডিগ্রি অর্জন।",
      avatar_url: uploadedPhotoUrl || undefined
    };

    setTherapists(prev => [...prev, newTherapist]);
    triggerToast(`নতুন থেরাপিস্ট ${newTherapistName} সফলভাবে যুক্ত করা হয়েছে!`);
    
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
      triggerToast(`থেরাপিস্ট ${name} কে মুছে ফেলা হয়েছে।`);
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
        message: "সুপাবেস সেশন পাওয়া যায়নি (No active session)। নিরাপত্তার স্বার্থে সিস্টেম তাকে '/login' পেজে রিডাইরেক্ট করেছে।",
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
          message: "অ্যাক্সেস অনুমোদিত (Authorized)! আপনার রোল 'admin' হওয়ায় আপনি সাফল্যের সাথে এডমিন পোর্টালে প্রবেশ করতে পেরেছেন।",
          colorClass: "bg-emerald-50 text-emerald-950 border-emerald-200",
          iconColor: "text-emerald-500",
          actionTaken: "Access Granted"
        };
      } else {
        return {
          status: "BLOCKED" as const,
          finalPath: role === "patient" ? "/dashboard/patient" : "/dashboard/therapist",
          message: `অ্যাক্সেস প্রত্যাখ্যাত (Unauthorized - Route Protection)! আপনার রোল '${role}' কিন্তু টার্গেট রাউট শুধুমাত্র এডমিনের জন্য সংরক্ষিত। নিরাপত্তার জন্য আপনাকে রিডাইরেক্ট করে '${role === "patient" ? "/dashboard/patient" : "/dashboard/therapist"}' পেজে ফেরত পাঠানো হয়েছে।`,
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
          message: `অ্যাক্সেস অনুমোদিত (Authorized)! আপনার রোল '${role}' হওয়ায় আপনি এই পেজে প্রবেশ করতে পেরেছেন।`,
          colorClass: "bg-emerald-50 text-emerald-950 border-emerald-200",
          iconColor: "text-emerald-500",
          actionTaken: "Access Granted"
        };
      } else {
        return {
          status: "BLOCKED" as const,
          finalPath: "/dashboard/therapist",
          message: "অ্যাক্সেস প্রত্যাখ্যাত! আপনার রোল 'therapist' হওয়ায় আপনি রোগীর ড্যাশবোর্ডে প্রবেশ করতে পারবেন না। আপনাকে '/dashboard/therapist' পেজে পাঠানো হয়েছে।",
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
          message: `অ্যাক্সেস অনুমোদিত (Authorized)! আপনার রোল '${role}' হওয়ায় আপনি থেরাপিস্ট ড্যাশবোর্ডে প্রবেশ করতে পেরেছেন।`,
          colorClass: "bg-emerald-50 text-emerald-950 border-emerald-200",
          iconColor: "text-emerald-500",
          actionTaken: "Access Granted"
        };
      } else {
        return {
          status: "BLOCKED" as const,
          finalPath: "/dashboard/patient",
          message: "অ্যাক্সেস প্রত্যাখ্যাত! আপনার রোল 'patient' হওয়ায় আপনি থেরাপিস্ট ড্যাশবোর্ডে প্রবেশ করতে পারবেন না। আপনাকে '/dashboard/patient' পেজে ফেরত পাঠানো হয়েছে।",
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
        title: "অনুমতি দেওয়া হয়েছে (Access Granted)",
        details: `সুপাবেস RLS পলিসি (using auth.uid() = id অথবা user_id) সফলভাবে কাজ করছে। ব্যবহারকারী নিজের আইডির তথ্য অ্যাক্সেস করছেন।`,
        policyApplied: `CREATE POLICY "সবাই নিজের প্রোফাইল দেখতে পারবে" ON ${table}`
      };
    }
    if (role === "patient_other") {
      return {
        status: "BLOCKED" as const,
        title: "অ্যাক্সেস ব্লকড (Access Blocked - RLS Blocked)",
        details: `নিরাপত্তা লঙ্ঘন সনাক্ত করা হয়েছে! কোনো সাধারণ ব্যবহারকারী বা রোগী অন্য রোগীর গোপনীয় প্রোফাইল, সেশন বুকিং বা স্ক্রিনিং রিপোর্ট অ্যাক্সেস করতে পারবেন না।`,
        errorCode: "42501 (Insufficient Privilege)",
        policyApplied: "CREATE POLICY (Default Deny - No Matching ALLOW Policy)"
      };
    }
    if (role === "therapist_own") {
      if (table === "users") {
        return {
          status: "ALLOWED" as const,
          title: "অনুমতি দেওয়া হয়েছে (Access Granted)",
          details: `সুপাবেস RLS পলিসি অনুযায়ী থেরাপিস্ট নিজের ইউজার আইডি অ্যাক্সেস করছেন।`,
          policyApplied: "CREATE POLICY \"ইউজাররা নিজের প্রোফাইল দেখতে ও আপডেট করতে পারবেন\" ON users"
        };
      }
      if (table === "bookings") {
        return {
          status: "ALLOWED" as const,
          title: "অনুমতি দেওয়া হয়েছে (Access Granted)",
          details: `সুপাবেস RLS পলিসি (auth.uid() = therapist_id) অনুযায়ী থেরাপিস্ট শুধুমাত্র তাকে দেওয়া সেশন বুকিংগুলো অ্যাক্সেস করছেন।`,
          policyApplied: "CREATE POLICY \"থেরাপিস্টরা শুধুমাত্র নিজের বুকিং দেখতে পারবেন\" ON bookings"
        };
      }
      return {
        status: "BLOCKED" as const,
        title: "অ্যাক্সেস ব্লকড (Access Blocked)",
        details: `থেরাপিস্ট সরাসরি রোগীর প্রাইভেট স্ক্রিনিং রিপোর্ট রিড করতে পারবেন না, যদি না রোগী শেয়ার করেন।`,
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
        <div className="flex-1 flex flex-col">
          
          {/* Public Medical Navbar Header */}
          <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200/80 px-6 sm:px-12 py-4 flex items-center justify-between shadow-xs">
            <div className="flex items-center gap-3.5">
              <div className="w-10 h-10 bg-linear-to-tr from-sky-400 to-emerald-400 rounded-2xl flex items-center justify-center text-white font-black text-xl tracking-wider shadow-md shadow-sky-150">
                SL
              </div>
              <div>
                <span className="font-black text-base sm:text-lg tracking-tight text-slate-900 block font-display">DocTime Speech Lab</span>
                <span className="text-[10px] text-emerald-600 bg-emerald-50 px-2.5 py-0.5 rounded-full font-extrabold uppercase tracking-widest block w-max">
                  বিশেষ শিশু সেবা
                </span>
              </div>
            </div>

            {/* Menu Links for realistic feel */}
            <nav className="hidden lg:flex items-center gap-6 text-xs font-bold text-slate-600">
              <a href="#services-section" className="hover:text-sky-600 transition-colors">সেবাসমূহ</a>
              <a href="#therapists-section" className="hover:text-sky-600 transition-colors">বিশেষজ্ঞ প্যানেল</a>
              <span className="w-1.5 h-1.5 rounded-full bg-slate-200"></span>
              <span className="text-slate-400 font-medium">ক্লিনিক লোকেশন: <strong className="text-slate-800 font-bold">ঢাকা ও চট্টগ্রাম</strong></span>
            </nav>

            <div className="flex items-center gap-3">
              <a 
                href="tel:+8801700000000" 
                className="bg-emerald-50 text-emerald-800 hover:bg-emerald-100 border border-emerald-200/60 px-3.5 py-2 rounded-xl text-xs font-extrabold flex items-center gap-1.5 transition-colors"
              >
                <Phone className="w-3.5 h-3.5 text-emerald-600" />
                <span className="hidden sm:inline">+৮৮০ ১৭০০-০০০০০০</span>
              </a>
              <button 
                onClick={() => navigateToHash("#/patient")}
                className="bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs px-4 py-2 rounded-xl shadow-xs cursor-pointer transition-all"
              >
                লগইন করুন
              </button>
            </div>
          </header>

          {/* Clean Exquisite Hero Section */}
          <section className="bg-linear-to-br from-sky-100/60 via-rose-50/40 to-emerald-50/50 border-b border-slate-200/80 py-16 sm:py-24 px-6 sm:px-12 relative overflow-hidden">
            {/* Visual playful elements */}
            <div className="absolute top-12 right-20 text-sky-400 opacity-20 text-3xl animate-bounce">★</div>
            <div className="absolute bottom-16 right-1/3 text-rose-400 opacity-20 text-4xl animate-pulse">❤</div>
            <div className="absolute top-24 left-1/4 text-emerald-400 opacity-20 text-3xl">✿</div>

            <div className="max-w-5xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
              
              {/* Hero left texts */}
              <div className="lg:col-span-7 space-y-6 text-left">
                <div className="inline-flex items-center gap-2 bg-white/90 backdrop-blur-xs px-3.5 py-1.5 rounded-full border border-sky-100 text-xs font-bold text-sky-800 shadow-2xs">
                  <Sparkles className="w-3.5 h-3.5 text-pink-500" />
                  <span>স্পিচ থেরাপি ও অটিজম ডেভেলপমেন্ট কেয়ার সেন্টার</span>
                </div>
                
                <h1 className="text-3xl sm:text-5xl font-black font-display text-slate-950 leading-tight">
                  স্পিচ থেরাপি ল্যাব <br />
                  <span className="text-transparent bg-clip-text bg-linear-to-r from-sky-600 via-rose-500 to-emerald-600">
                    শিশুর সুন্দর ভবিষ্যৎ গড়ার বিশ্বস্ত ঠিকানা
                  </span>
                </h1>

                <p className="text-slate-600 text-sm sm:text-base leading-relaxed max-w-xl">
                  আমাদের ওয়ান-টু-ওয়ান আধুনিক ক্লিনিক্যাল থেরাপি, চমৎকার বাংলা এএসি (AAC) কথা বলা বোর্ড এবং দেশের স্বনামধন্য অকুপেশনাল ও আচরণ থেরাপিস্টদের নিখুঁত তত্ত্বাবধানে আপনার আদরের শিশুর সুস্থ স্বাভাবিক বিকাশে আমরা সদা প্রস্তুত।
                </p>

                <div className="flex flex-wrap gap-4 pt-2">
                  <button
                    onClick={() => navigateToHash("#/patient")}
                    className="bg-sky-500 hover:bg-sky-600 text-white font-extrabold text-xs sm:text-sm px-6 py-3.5 rounded-2xl flex items-center gap-2 shadow-md shadow-sky-100 transition-all transform hover:-translate-y-0.5 cursor-pointer"
                  >
                    <Activity className="w-4 h-4" />
                    <span>👶 রোগী ও অভিভাবক ড্যাশবোর্ড</span>
                  </button>
                  <button
                    onClick={() => navigateToHash("#/therapist")}
                    className="bg-white hover:bg-slate-50 text-slate-800 border border-slate-200 font-extrabold text-xs sm:text-sm px-6 py-3.5 rounded-2xl flex items-center gap-2 shadow-xs transition-all transform hover:-translate-y-0.5 cursor-pointer"
                  >
                    <Stethoscope className="w-4 h-4 text-emerald-500" />
                    <span>🩺 থেরাপিস্ট পোর্টাল</span>
                  </button>
                </div>
              </div>

              {/* Hero right bento card info */}
              <div className="lg:col-span-5">
                <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 shadow-xl space-y-5 relative">
                  <div className="absolute -top-3.5 -right-3.5 bg-rose-500 text-white font-black text-[10px] px-3.5 py-1 rounded-full uppercase tracking-wider shadow-md shadow-rose-150">
                    Emergency Help
                  </div>
                  <h3 className="font-extrabold text-slate-900 text-base flex items-center gap-2 border-b border-slate-100 pb-3">
                    <Clock className="w-5 h-5 text-sky-500" />
                    <span>চেম্বার ও অ্যাপয়েন্টমেন্ট সময়</span>
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
                      💬 আমাদের থেরাপিস্টদের সাথে সরাসরি সেশন বুকিং করতে নিচে দেওয়া বাটনগুলো থেকে আপনার কাঙ্ক্ষিত ড্যাশবোর্ডে প্রবেশ করে বুকিং দিন।
                    </div>
                  </div>
                </div>
              </div>

            </div>
          </section>

          {/* 8 Services Grid Leaflet Cards */}
          <section id="services-section" className="py-16 px-6 sm:px-12 max-w-7xl mx-auto space-y-12 w-full">
            <div className="text-center max-w-2xl mx-auto space-y-3">
              <span className="text-xs font-bold text-sky-600 tracking-widest uppercase">Service Offerings</span>
              <h2 className="text-2xl sm:text-3xl font-black font-display text-slate-950">আমাদের ৮টি বিশেষ সেবাসমূহ</h2>
              <p className="text-xs sm:text-sm text-slate-500 leading-relaxed">
                বিশেষ অটিস্টিক ও স্পিচ-ডিলেড শিশুদের দ্রুত ভাষা অর্জন, মনোযোগ বৃদ্ধি ও শারীরিক-মানসিক বিকাশের জন্য প্রস্তুতকৃত আমাদের আধুনিক ল্যাব মেথডস।
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {services.map((service, idx) => (
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
                    <span className="text-slate-400 font-mono">Service #{idx+1}</span>
                    <button
                      onClick={() => navigateToHash("#/patient")}
                      className="text-sky-600 hover:text-sky-700 font-extrabold flex items-center gap-1 cursor-pointer text-xs"
                    >
                      <span>বিস্তারিত সেশন</span>
                      <ChevronRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Our Therapists List Section */}
          <section id="therapists-section" className="bg-white py-16 px-6 sm:px-12 border-t border-slate-200 w-full">
            <div className="max-w-7xl mx-auto space-y-12">
              <div className="text-center max-w-2xl mx-auto space-y-3">
                <span className="text-xs font-bold text-emerald-600 tracking-widest uppercase">Expert Panel</span>
                <h2 className="text-2xl sm:text-3xl font-black font-display text-slate-950">আমাদের বিশেষজ্ঞ প্যানেল</h2>
                <p className="text-xs sm:text-sm text-slate-500">
                  বিশেষজ্ঞ স্পিচ ল্যাঙ্গুয়েজ প্যাথলজিস্ট এবং সার্টিফাইড অকুপেশনাল থেরাপিস্টদের সাথে ওয়ান-টু-ওয়ান পরামর্শ করুন।
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
                {therapists.map((therapist) => (
                  <div 
                    key={therapist.id}
                    className="border border-slate-200 rounded-3xl p-6 hover:shadow-md transition-all flex flex-col justify-between bg-slate-50/50"
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
                          <div className="w-16 h-16 rounded-2xl bg-linear-to-tr from-sky-400 to-indigo-500 text-white flex items-center justify-center text-xl font-black shrink-0 font-display shadow-sm shadow-indigo-100">
                            {therapist.name.includes("ডা.") ? "ডা" : therapist.name[0]}
                          </div>
                        )}
                        <div>
                          <span className="text-[10px] text-sky-600 bg-sky-50 px-2 py-0.5 rounded-full font-bold uppercase tracking-wider">
                            {therapist.designation}
                          </span>
                          <h3 className="font-extrabold text-slate-900 text-base sm:text-lg mt-0.5">{therapist.name}</h3>
                          <p className="text-xs text-slate-500 font-semibold">{therapist.specialty}</p>
                        </div>
                      </div>

                      <p className="text-xs text-slate-600 leading-relaxed line-clamp-3">
                        {therapist.experience}
                      </p>

                      <div className="bg-white p-3 rounded-xl border border-slate-150 text-xs space-y-1.5">
                        <p className="text-slate-500"><strong className="text-slate-700 font-bold">যোগ্যতা:</strong> {therapist.credentials}</p>
                        <p className="text-slate-500"><strong className="text-slate-700 font-bold">লোকেশন:</strong> {therapist.branch}</p>
                      </div>
                    </div>

                    <div className="pt-4 mt-4 border-t border-slate-200/60 flex items-center justify-between text-xs">
                      <span className="font-extrabold text-sky-600 text-sm">ফি: {therapist.visit_fee} টাকা</span>
                      <button
                        onClick={() => setSelectedTherapistForModal(therapist)}
                        className="bg-slate-900 hover:bg-slate-800 text-white font-extrabold px-4 py-2 rounded-xl transition-all cursor-pointer"
                      >
                        বিস্তারিত প্রোফাইল
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* Public Footer */}
          <footer className="bg-slate-950 text-slate-400 py-10 px-6 sm:px-12 border-t border-slate-900 text-center w-full mt-auto">
            <div className="max-w-5xl mx-auto space-y-4">
              <p className="text-xs">© ২০২৬ DocTime Speech Therapy Lab. সর্বস্বত্ব সংরক্ষিত।</p>
              <p className="text-[10px] text-slate-600">Row-Level Security (RLS) কমপ্লায়েন্ট ডাটাবেজ সুরক্ষায় আমাদের প্রতিটি রোগীর তথ্য এনক্রিপ্ট করে সংরক্ষণ করা হয়ে থাকে।</p>
            </div>
          </footer>

        </div>
      )}

      {/* 2. PATIENT DASHBOARD ROUTE ( #/patient ) */}
      {currentHash === "#/patient" && (
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
                আরিয়ান রহমান
              </span>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-xs text-slate-400 font-medium hidden sm:inline">পেশেন্ট আইডি: <strong className="text-slate-800 font-mono font-bold">a0000000-0001</strong></span>
              <button 
                onClick={() => navigateToHash("#/")}
                className="bg-rose-50 text-rose-600 hover:bg-rose-100 px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer"
              >
                লগআউট
              </button>
            </div>
          </header>

          <div className="flex-1 overflow-y-auto">
            {/* Render the full custom PatientDashboard component */}
            <PatientDashboard />
          </div>
        </div>
      )}

      {/* 3. THERAPIST PORTAL ROUTE ( #/therapist ) */}
      {currentHash === "#/therapist" && (
        <div className="flex-1 flex flex-col bg-slate-100">
          
          {/* Therapist Header */}
          <header className="bg-white border-b border-slate-200/80 px-6 sm:px-12 py-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-2xs shrink-0">
            <div className="flex items-center gap-3">
              <button 
                onClick={() => navigateToHash("#/")}
                className="hover:bg-slate-100 p-1.5 rounded-lg transition-colors cursor-pointer"
                title="হোম পেজে ফিরে যান"
              >
                <Home className="w-5 h-5 text-slate-600" />
              </button>
              <div>
                <h2 className="font-extrabold text-slate-900 text-sm sm:text-base flex items-center gap-2">
                  <span>স্পিচ থেরাপিস্ট ওয়ার্কস্পেস (Clinical Portal)</span>
                  <span className="text-xs bg-sky-50 text-sky-700 px-2.5 py-0.5 rounded-full border border-sky-100">
                    Active Session
                  </span>
                </h2>
                <p className="text-xs text-slate-500 font-medium">নিরাপদ ডক্টর প্রেসক্রিপশন জেনারেটর এবং অ্যাপয়েন্টমেন্ট ট্র্যাকার</p>
              </div>
            </div>

            {/* Active Therapist Selector */}
            <div className="flex items-center gap-2.5">
              <span className="text-xs text-slate-500 font-bold">ডক্টর পরিবর্তন:</span>
              <select 
                value={activeTherapistId}
                onChange={(e) => setActiveTherapistId(e.target.value)}
                className="bg-white border border-slate-200 rounded-lg px-2 py-1 text-xs font-bold focus:ring-2 focus:ring-sky-500 focus:outline-hidden"
              >
                {therapists.map(t => (
                  <option key={t.id} value={t.id}>{t.name} ({t.designation.slice(0, 10)}...)</option>
                ))}
              </select>
            </div>
          </header>

          {/* Therapist Body content */}
          <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 overflow-hidden">
            
            {/* Left Sidebar Tab Selector */}
            <aside className="lg:col-span-3 bg-white border-r border-slate-200 p-4 space-y-4 flex flex-col justify-between shrink-0">
              <div className="space-y-4">
                {/* Active Therapist profile brief */}
                <div className="p-4 bg-slate-50 border border-slate-150 rounded-2xl text-center space-y-2">
                  <div className="w-12 h-12 rounded-full bg-indigo-600 text-white font-black text-lg mx-auto flex items-center justify-center">
                    🩺
                  </div>
                  <div>
                    <h4 className="font-extrabold text-slate-900 text-xs sm:text-sm">{activeTherapist.name}</h4>
                    <p className="text-[10px] text-slate-500">{activeTherapist.designation}</p>
                  </div>
                </div>

                <div className="space-y-1">
                  <p className="px-3 text-[9px] font-black text-slate-400 uppercase tracking-widest">মেনু অপশনসমূহ</p>
                  
                  <button
                    onClick={() => setTherapistTab("schedule")}
                    className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                      therapistTab === "schedule"
                        ? "bg-sky-50 text-sky-700 border-l-4 border-sky-500"
                        : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                    }`}
                  >
                    <Calendar className="w-4 h-4 text-sky-500" />
                    <span>আজকের শিডিউল ({appointments.filter(a => a.therapist_id === activeTherapistId).length})</span>
                  </button>

                  <button
                    onClick={() => setTherapistTab("prescription_builder")}
                    className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                      therapistTab === "prescription_builder"
                        ? "bg-sky-50 text-sky-700 border-l-4 border-sky-500"
                        : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                    }`}
                  >
                    <FileText className="w-4 h-4 text-emerald-500" />
                    <span>প্রেসক্রিপশন জেনারেটর (Rx)</span>
                  </button>

                  <button
                    onClick={() => setTherapistTab("prescriptions_list")}
                    className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                      therapistTab === "prescriptions_list"
                        ? "bg-sky-50 text-sky-700 border-l-4 border-sky-500"
                        : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                    }`}
                  >
                    <ClipboardList className="w-4 h-4 text-purple-500" />
                    <span>ইস্যুকৃত রেকর্ড ({prescriptions.length})</span>
                  </button>
                </div>
              </div>

              {/* Sidebar footer instructions */}
              <div className="bg-indigo-50 border border-indigo-100 p-3.5 rounded-2xl text-[10px] text-slate-600 leading-relaxed">
                <strong>💡 পরামর্শ:</strong> প্রেসক্রিপশন জেনারেট করলে সেটি সরাসরি ডাটাবেজে সেভ হয়ে থাকে, যা পরবর্তী সেশনের সময় রোগীরা তাদের ড্যাশবোর্ড থেকে দেখতে পারবে।
              </div>
            </aside>

            {/* Right Work Panel */}
            <main className="lg:col-span-9 p-6 overflow-y-auto space-y-6">
              
              {/* TAB 1: SCHEDULES AND APPOINTMENTS */}
              {therapistTab === "schedule" && (
                <div className="space-y-6">
                  <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-2xs">
                    <h3 className="font-extrabold text-slate-900 text-sm sm:text-base border-b border-slate-100 pb-3">
                      আজকের অ্যাপয়েন্টমেন্ট ও সেশন শিডিউল
                    </h3>
                    
                    {appointments.filter(a => a.therapist_id === activeTherapistId).length === 0 ? (
                      <div className="text-center py-12 text-slate-400 space-y-2">
                        <Calendar className="w-10 h-10 text-slate-300 mx-auto" />
                        <p className="text-xs font-bold">আজকে এই থেরাপিস্টের অধীনে কোনো সেশন বুকিং নেই।</p>
                        <p className="text-[11px]">অন্য থেরাপিস্টদের সিলেক্ট করে তাদের শিডিউল চেক করুন।</p>
                      </div>
                    ) : (
                      <div className="divide-y divide-slate-100 mt-2">
                        {appointments.filter(a => a.therapist_id === activeTherapistId).map((app) => {
                          const isPaid = app.payment_status === "Paid";
                          return (
                            <div key={app.id} className="py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                              <div className="space-y-1.5">
                                <div className="flex items-center gap-2">
                                  <span className="font-black text-slate-900 text-xs sm:text-sm">
                                    {getUserNameById(app.user_id)}
                                  </span>
                                  <span className={`text-[9px] font-bold px-2 py-0.5 rounded border ${
                                    isPaid ? "bg-emerald-50 text-emerald-700 border-emerald-100" : "bg-amber-50 text-amber-700 border-amber-100"
                                  }`}>
                                    {isPaid ? "Paid" : "Pending Payment"}
                                  </span>
                                </div>
                                <div className="text-[11px] text-slate-500 font-medium flex flex-wrap gap-x-4 gap-y-1">
                                  <span className="flex items-center gap-1"><Clock className="w-3.5 h-3.5 text-sky-500" /> {app.date} | {app.time}</span>
                                  <span>সেশন টপিক: <strong>{app.topic || "জেনারেল স্পিচ রিভিউ"}</strong></span>
                                </div>
                              </div>

                              <div className="flex items-center gap-2 self-start sm:self-center">
                                <button
                                  onClick={() => {
                                    setRxPatientName(getUserNameById(app.user_id));
                                    setRxAge(app.user_id === "a0000000-0000-0000-0000-000000000001" ? "6" : "8");
                                    setTherapistTab("prescription_builder");
                                  }}
                                  className="bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs px-3.5 py-2 rounded-xl transition-all flex items-center gap-1 cursor-pointer"
                                >
                                  <FileText className="w-3.5 h-3.5" />
                                  <span>Rx লিখুন</span>
                                </button>
                                <a
                                  href={app.video_call_link}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="bg-sky-500 hover:bg-sky-600 text-white font-bold text-xs px-3.5 py-2 rounded-xl transition-all flex items-center gap-1"
                                >
                                  <Video className="w-3.5 h-3.5" />
                                  <span>ভিডিও স্টার্ট</span>
                                </a>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* TAB 2: PRESCRIPTION BUILDER FORM */}
              {therapistTab === "prescription_builder" && (
                <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 shadow-sm space-y-6">
                  <div className="border-b border-slate-100 pb-4">
                    <h3 className="font-extrabold text-slate-900 text-base sm:text-lg">ডিজিটাল স্পিচ প্রেসক্রিপশন মেকার (Rx Builder)</h3>
                    <p className="text-xs text-slate-500 mt-1">রোগীর লক্ষণ ও দৈনিক বাড়ির কাজ লিখে প্রেসক্রিপশন জেনারেট করুন।</p>
                  </div>

                  <form onSubmit={handleIssuePrescription} className="space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="space-y-1">
                        <label className="text-xs font-bold text-slate-500 block">রোগীর নাম (Patient Name)</label>
                        <select
                          value={rxPatientName}
                          onChange={(e) => setRxPatientName(e.target.value)}
                          className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs focus:ring-2 focus:ring-sky-500 focus:outline-hidden font-bold"
                        >
                          <option value="আরিয়ান রহমান">আরিয়ান রহমান (বয়স: ৬)</option>
                          <option value="নাবিলা হাসান">নাবিলা হাসান (বয়স: ৮)</option>
                          <option value="নির্ধারিত অন্য রোগী">অন্যান্য নতুন রোগী</option>
                        </select>
                      </div>

                      <div className="space-y-1">
                        <label className="text-xs font-bold text-slate-500 block">রোগীর বয়স (Age)</label>
                        <input
                          type="number"
                          value={rxAge}
                          onChange={(e) => setRxAge(e.target.value)}
                          className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs focus:ring-2 focus:ring-sky-500"
                          required
                        />
                      </div>
                    </div>

                    <div className="space-y-1">
                      <label className="text-xs font-bold text-slate-500 block">নির্ণীত সমস্যা / ডায়াগনোসিস (Diagnosis)</label>
                      <input
                        type="text"
                        value={rxDiagnosis}
                        onChange={(e) => setRxDiagnosis(e.target.value)}
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-xs focus:ring-2 focus:ring-sky-500"
                        required
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-xs font-bold text-slate-500 block">স্পিচ এক্সারসাইজ ও হোম টাস্ক (Therapy Exercises & Homework)</label>
                      <textarea
                        value={rxHomework}
                        onChange={(e) => setRxHomework(e.target.value)}
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-xs focus:ring-2 focus:ring-sky-500 h-28"
                        required
                      />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="space-y-1">
                        <label className="text-xs font-bold text-slate-500 block">পরবর্তী সেশনের সম্ভাব্য তারিখ</label>
                        <input
                          type="date"
                          value={rxNextVisit}
                          onChange={(e) => setRxNextVisit(e.target.value)}
                          className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs focus:ring-2 focus:ring-sky-500"
                          required
                        />
                      </div>

                      <div className="space-y-1">
                        <label className="text-xs font-bold text-slate-500 block">বিশেষ পরামর্শ / নোট (Notes)</label>
                        <input
                          type="text"
                          value={rxNotes}
                          onChange={(e) => setRxNotes(e.target.value)}
                          className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs focus:ring-2 focus:ring-sky-500"
                        />
                      </div>
                    </div>

                    <button
                      type="submit"
                      className="w-full bg-slate-900 hover:bg-slate-800 text-white font-extrabold text-xs sm:text-sm py-3 rounded-xl transition-all shadow-xs cursor-pointer"
                    >
                      প্রেসক্রিপশন ইস্যু করুন (Issue Rx Document)
                    </button>
                  </form>
                </div>
              )}

              {/* TAB 3: LIST OF PREVIOUS RX PRESCRIPTIONS */}
              {therapistTab === "prescriptions_list" && (
                <div className="space-y-6">
                  {prescriptions.length === 0 ? (
                    <div className="bg-white border border-slate-200 rounded-2xl p-8 text-center text-slate-400 space-y-2">
                      <ClipboardList className="w-10 h-10 text-slate-300 mx-auto" />
                      <p className="text-xs font-bold">এখনো কোনো ডিজিটাল প্রেসক্রিপশন তৈরি করা হয়নি।</p>
                      <button
                        onClick={() => setTherapistTab("prescription_builder")}
                        className="text-xs text-sky-600 underline font-bold mt-2"
                      >
                        নতুন প্রেসক্রিপশন লিখুন
                      </button>
                    </div>
                  ) : (
                    <div className="space-y-6">
                      <h3 className="font-extrabold text-slate-900 text-sm sm:text-base">ইস্যুকৃত ডিজিটাল প্রেসক্রিপশন রেকর্ড</h3>
                      
                      {prescriptions.map((rx) => (
                        <div key={rx.id} className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 shadow-sm relative overflow-hidden">
                          {/* Rx Medical Branding design */}
                          <div className="border-b-2 border-indigo-600 pb-4 mb-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
                            <div>
                              <span className="font-black text-indigo-700 text-xl tracking-tight block">DocTime Speech Therapy Lab</span>
                              <span className="text-[9px] text-slate-400 uppercase font-mono tracking-widest block">১২/এ ধানমন্ডি আর/এ, ঢাকা | চেম্বার শাখা</span>
                            </div>
                            <div className="text-right sm:text-right self-stretch sm:self-auto border-t sm:border-t-0 pt-2 sm:pt-0 border-slate-100 flex sm:flex-col justify-between items-center sm:items-end">
                              <span className="bg-indigo-50 text-indigo-800 px-3 py-1 rounded-full text-[10px] font-black border border-indigo-100 font-mono uppercase tracking-wider">{rx.id}</span>
                              <span className="text-xs text-slate-400 font-bold block mt-1">তারিখ: {rx.date}</span>
                            </div>
                          </div>

                          <div className="grid grid-cols-2 gap-4 bg-slate-50 p-4 rounded-2xl border border-slate-150 text-xs">
                            <div>
                              <p className="text-slate-400 font-semibold block uppercase tracking-wider text-[10px]">রোগীর তথ্য</p>
                              <p className="font-black text-slate-800 mt-1">{rx.patient_name} (বয়স: {rx.age} বছর)</p>
                            </div>
                            <div>
                              <p className="text-slate-400 font-semibold block uppercase tracking-wider text-[10px]">চিকিৎসক / থেরাপিস্ট</p>
                              <p className="font-bold text-slate-800 mt-1">{rx.therapist_name}</p>
                            </div>
                          </div>

                          {/* Medical prescribed instructions layout */}
                          <div className="py-5 space-y-4">
                            <div className="space-y-1">
                              <span className="text-indigo-600 font-black text-lg block font-mono">Rx / ডায়াগনোসিস</span>
                              <p className="text-xs text-slate-800 font-extrabold leading-relaxed bg-indigo-50/50 px-3 py-2 rounded-xl border border-indigo-100/60">
                                {rx.diagnosis}
                              </p>
                            </div>

                            <div className="space-y-1">
                              <span className="text-slate-500 font-black text-xs block uppercase tracking-widest">থেরাপি নির্দেশনাবলি ও প্র্যাকটিস ব্যায়াম</span>
                              <div className="text-xs text-slate-700 leading-relaxed font-semibold bg-slate-50 p-4 rounded-xl border border-slate-150 whitespace-pre-line">
                                {rx.homework}
                              </div>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-3 border-t border-slate-100 text-xs">
                              <div>
                                <span className="text-[10px] text-slate-400 font-bold block uppercase tracking-wider">পরবর্তী ভিজিট</span>
                                <span className="font-extrabold text-indigo-600">{rx.next_visit}</span>
                              </div>
                              <div>
                                <span className="text-[10px] text-slate-400 font-bold block uppercase tracking-wider">বিশেষ পরামর্শ</span>
                                <span className="font-bold text-slate-700">{rx.notes || "কোনো বিশেষ পরামর্শ নেই"}</span>
                              </div>
                            </div>
                          </div>

                          {/* Stamp and Print Action */}
                          <div className="border-t border-slate-150 pt-4 flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></div>
                              <span className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider">ডিজিটাল সার্টিফাইড প্রেসক্রিপশন</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <button
                                onClick={() => triggerToast("ডকুমেন্ট প্রিন্ট রিকোয়েস্ট তৈরি করা হচ্ছে...")}
                                className="bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs px-4 py-2 rounded-xl transition-all flex items-center gap-1.5 cursor-pointer"
                              >
                                <FileDown className="w-3.5 h-3.5" />
                                <span>প্রিন্ট/ডাউনলোড</span>
                              </button>
                            </div>
                          </div>

                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

            </main>
          </div>
        </div>
      )}

      {/* 4. ADMIN DASHBOARD ROUTE ( #/admin ) */}
      {currentHash === "#/admin" && (
        <div className="flex-1 flex flex-col">
          
          {/* Admin Header */}
          <header className="bg-slate-900 text-white border-b border-slate-800 px-6 sm:px-12 py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shrink-0 shadow-md">
            <div className="flex items-center gap-3">
              <button 
                onClick={() => navigateToHash("#/")}
                className="hover:bg-slate-800 p-1.5 rounded-lg transition-colors cursor-pointer"
                title="হোম পেজে ফিরে যান"
              >
                <Home className="w-5 h-5 text-slate-300" />
              </button>
              <div>
                <h2 className="font-black text-white text-base sm:text-lg flex items-center gap-2 tracking-wide font-display">
                  <span>DocTime অ্যাডমিন কনসোল</span>
                  <span className="text-[10px] bg-amber-500 text-slate-900 font-black px-2.5 py-0.5 rounded-full uppercase tracking-wider">
                    SYSTEM CONTROL
                  </span>
                </h2>
                <p className="text-xs text-slate-400 font-medium">রিয়েল-টাইম সেবামূলক তথ্য ও থেরাপিস্ট ডিরেক্টরি কাস্টমাইজেশন</p>
              </div>
            </div>

            {/* Admin Portal Tab Selectors */}
            <div className="flex bg-slate-950 p-1 rounded-xl border border-slate-800 self-start sm:self-auto text-xs">
              <button
                onClick={() => setAdminTab("services_manager")}
                className={`px-3.5 py-2 rounded-lg font-bold transition-all cursor-pointer ${
                  adminTab === "services_manager"
                    ? "bg-amber-500 text-slate-950 shadow-xs"
                    : "text-slate-400 hover:text-slate-200"
                }`}
              >
                সেবাসমূহ এডিটর
              </button>
              <button
                onClick={() => setAdminTab("therapist_manager")}
                className={`px-3.5 py-2 rounded-lg font-bold transition-all cursor-pointer ${
                  adminTab === "therapist_manager"
                    ? "bg-amber-500 text-slate-950 shadow-xs"
                    : "text-slate-400 hover:text-slate-200"
                }`}
              >
                থেরাপিস্ট আপলোডার
              </button>
              <button
                onClick={() => setAdminTab("security_audit")}
                className={`px-3.5 py-2 rounded-lg font-bold transition-all cursor-pointer ${
                  adminTab === "security_audit"
                    ? "bg-amber-500 text-slate-950 shadow-xs"
                    : "text-slate-400 hover:text-slate-200"
                }`}
              >
                নিরাপত্তা অডিট
              </button>
            </div>
          </header>

          <div className="flex-1 overflow-y-auto p-6 sm:p-10 bg-slate-50">
            
            {/* ADMIN TAB 1: SERVICES TEXT DIRECT INLINE EDITING */}
            {adminTab === "services_manager" && (
              <div className="max-w-5xl mx-auto space-y-6">
                <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 shadow-sm">
                  <h3 className="font-extrabold text-slate-900 text-base sm:text-lg border-b border-slate-150 pb-3 mb-4">
                    ইন্টারেক্টিভ সেবাসমূহ কন্টেন্ট ম্যানেজার (Interactive Card Editor)
                  </h3>
                  <p className="text-xs text-slate-500 leading-relaxed mb-6">
                    অ্যাডমিন এখান থেকে সরাসরি যেকোনো সেবার বাংলা টাইটেল, ইংরেজি সাব-টাইটেল এবং বিস্তারিত বর্ণনা সংশোধন করতে পারবেন। সংরক্ষণের পর হোম পেজের ৮টি সেবায় এটি ইনস্ট্যান্ট পরিবর্তিত হয়ে যাবে।
                  </p>

                  <div className="space-y-4">
                    {services.map((service) => (
                      <div 
                        key={service.id}
                        className={`p-5 rounded-2xl border transition-all ${
                          editingServiceId === service.id 
                            ? "bg-amber-50/40 border-amber-300 ring-2 ring-amber-100" 
                            : "bg-slate-50/50 border-slate-200 hover:border-slate-300"
                        }`}
                      >
                        {editingServiceId === service.id ? (
                          // Active editing view
                          <div className="space-y-4">
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                              <div className="space-y-1">
                                <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest block">১. বাংলা টাইটেল</label>
                                <input
                                  type="text"
                                  value={editTitleBangla}
                                  onChange={(e) => setEditTitleBangla(e.target.value)}
                                  className="w-full bg-white border border-slate-200 rounded-lg px-3 py-2 text-xs font-bold"
                                />
                              </div>
                              <div className="space-y-1">
                                <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest block">২. ইংরেজি সাব-টাইটেল</label>
                                <input
                                  type="text"
                                  value={editTitleEnglish}
                                  onChange={(e) => setEditTitleEnglish(e.target.value)}
                                  className="w-full bg-white border border-slate-200 rounded-lg px-3 py-2 text-xs font-bold"
                                />
                              </div>
                            </div>

                            <div className="space-y-1">
                              <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest block">৩. বিস্তারিত বাংলা বর্ণনা</label>
                              <textarea
                                value={editDescBangla}
                                onChange={(e) => setEditDescBangla(e.target.value)}
                                className="w-full bg-white border border-slate-200 rounded-lg px-3 py-2 text-xs font-medium h-20"
                              />
                            </div>

                            <div className="flex justify-end gap-2.5">
                              <button
                                onClick={() => setEditingServiceId(null)}
                                className="bg-slate-200 hover:bg-slate-300 text-slate-700 font-bold text-xs px-4 py-2 rounded-xl transition-all cursor-pointer"
                              >
                                বাতিল
                              </button>
                              <button
                                onClick={() => saveServiceEdit(service.id)}
                                className="bg-slate-900 hover:bg-slate-800 text-white font-extrabold text-xs px-5 py-2 rounded-xl transition-all cursor-pointer"
                              >
                                সংরক্ষণ করুন
                              </button>
                            </div>
                          </div>
                        ) : (
                          // Normal View inside list
                          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                            <div className="flex items-start gap-3.5">
                              <div className="p-2.5 bg-white rounded-xl border border-slate-200 shadow-2xs shrink-0">
                                {renderServiceIcon(service.iconName)}
                              </div>
                              <div className="space-y-1.5">
                                <div className="flex items-center gap-2">
                                  <h4 className="font-extrabold text-slate-900 text-sm sm:text-base leading-none">
                                    {service.titleBangla}
                                  </h4>
                                  <span className="text-[9px] bg-indigo-50 text-indigo-700 px-2 py-0.5 rounded border border-indigo-100 font-mono">
                                    {service.tag}
                                  </span>
                                </div>
                                <p className="text-xs text-slate-400 font-bold">{service.titleEnglish}</p>
                                <p className="text-xs text-slate-600 leading-relaxed max-w-2xl">{service.descBangla}</p>
                              </div>
                            </div>

                            <button
                              onClick={() => startEditService(service)}
                              className="bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 font-extrabold text-xs px-4 py-2 rounded-xl transition-all flex items-center gap-1 cursor-pointer self-end sm:self-center shrink-0"
                            >
                              <Edit className="w-3.5 h-3.5 text-sky-500" />
                              <span>এডিট করুন</span>
                            </button>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>

                </div>
              </div>
            )}

            {/* ADMIN TAB 2: THERAPISTS LIST MANAGER WITH DRAG & DROP UPLOADER */}
            {adminTab === "therapist_manager" && (
              <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8">
                
                {/* Add Therapist Form Column (7 spans) */}
                <div className="lg:col-span-7 bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 shadow-sm space-y-6">
                  <div className="border-b border-slate-100 pb-3">
                    <h3 className="font-extrabold text-slate-900 text-base sm:text-lg">নতুন থেরাপিস্ট রেজিস্ট্রেশন ও প্রোফাইল আপলোডার</h3>
                    <p className="text-xs text-slate-500 mt-1">ছবি আপলোড সহ প্রয়োজনীয় তথ্য দিয়ে নতুন স্পিচ/অকুপেশনাল থেরাপিস্ট যুক্ত করুন।</p>
                  </div>

                  <form onSubmit={handleAddTherapist} className="space-y-4">
                    
                    {/* DRAG AND DROP FILE UPLOAD PREVIEW ZONE */}
                    <div className="space-y-2">
                      <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest block">১. থেরাপিস্ট ফটো আপলোডার (Drag & Drop Zone)</label>
                      
                      <div 
                        onDragOver={handleDragOver}
                        onDragLeave={handleDragLeave}
                        onDrop={handleDrop}
                        className={`border-2 border-dashed rounded-2xl p-5 text-center transition-all relative flex flex-col items-center justify-center gap-3 select-none cursor-pointer ${
                          dragOver 
                            ? "border-amber-500 bg-amber-50/50 scale-[1.01]" 
                            : "border-slate-200 hover:border-slate-300 bg-slate-50/50"
                        }`}
                        onClick={() => document.getElementById("fileInput")?.click()}
                      >
                        <input 
                          type="file" 
                          id="fileInput" 
                          accept="image/*" 
                          onChange={handleFileSelect} 
                          className="hidden" 
                        />
                        
                        {uploadedPhotoUrl ? (
                          // Real photo upload preview
                          <div className="space-y-3 relative z-10">
                            <img 
                              src={uploadedPhotoUrl} 
                              alt="Uploaded Preview" 
                              referrerPolicy="no-referrer"
                              className="w-20 h-20 rounded-2xl object-cover mx-auto border border-slate-300 shadow-md" 
                            />
                            <div>
                              <p className="text-xs font-bold text-emerald-600">ছবি সফলভাবে সিলেক্ট হয়েছে!</p>
                              <p className="text-[10px] text-slate-400 mt-0.5 font-mono">ক্লিক করে ছবি পরিবর্তন করুন</p>
                            </div>
                          </div>
                        ) : (
                          // Normal visual dropzone
                          <>
                            <Upload className="w-8 h-8 text-slate-400 animate-pulse" />
                            <div className="space-y-1">
                              <p className="text-xs font-bold text-slate-700">এখানে ছবি ড্র্যাগ অ্যান্ড ড্রপ করুন অথবা ব্রাউজ করুন</p>
                              <p className="text-[10px] text-slate-400">PNG, JPG, JPEG (Max: 2MB, বর্গাকার ছবি বাঞ্ছনীয়)</p>
                            </div>
                          </>
                        )}
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="space-y-1">
                        <label className="text-xs font-bold text-slate-500 block">২. থেরাপিস্টের নাম (Full Name)</label>
                        <input
                          type="text"
                          value={newTherapistName}
                          onChange={(e) => setNewTherapistName(e.target.value)}
                          className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs focus:ring-2 focus:ring-amber-500 font-bold"
                          placeholder="উদা: ড. শায়লা রহমান"
                          required
                        />
                      </div>

                      <div className="space-y-1">
                        <label className="text-xs font-bold text-slate-500 block">৩. পদবী / ডেজিগনেশন</label>
                        <input
                          type="text"
                          value={newTherapistDesig}
                          onChange={(e) => setNewTherapistDesig(e.target.value)}
                          className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs focus:ring-2 focus:ring-amber-500"
                          placeholder="উদা: কনসালটেন্ট স্পিচ থেরাপিস্ট"
                          required
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                      <div className="space-y-1">
                        <label className="text-xs font-bold text-slate-500 block">৪. বিশেষত্ব (Specialty)</label>
                        <input
                          type="text"
                          value={newTherapistSpecialty}
                          onChange={(e) => setNewTherapistSpecialty(e.target.value)}
                          className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs"
                          placeholder="উদা: আর্লি ইন্টারভেনশন"
                        />
                      </div>

                      <div className="space-y-1">
                        <label className="text-xs font-bold text-slate-500 block">৫. ভিজিট ফি (Visiting Fee)</label>
                        <input
                          type="number"
                          value={newTherapistFee}
                          onChange={(e) => setNewTherapistFee(parseInt(e.target.value))}
                          className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-bold"
                        />
                      </div>

                      <div className="space-y-1">
                        <label className="text-xs font-bold text-slate-500 block">৬. চেম্বার ব্রাঞ্চ (Branch)</label>
                        <select
                          value={newTherapistBranch}
                          onChange={(e) => setNewTherapistBranch(e.target.value)}
                          className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-bold"
                        >
                          <option value="ধানমন্ডি, ঢাকা">ধানমন্ডি, ঢাকা</option>
                          <option value="জিইসি, চট্টগ্রাম">জিইসি, চট্টগ্রাম</option>
                          <option value="অনলাইন ভিডিও সেশন">শুধুমাত্র অনলাইন শাখা</option>
                        </select>
                      </div>
                    </div>

                    <div className="space-y-1">
                      <label className="text-xs font-bold text-slate-500 block">৭. শিক্ষাগত যোগ্যতা ও সার্টিফিকেট কোডসমূহ</label>
                      <input
                        type="text"
                        value={newTherapistCredentials}
                        onChange={(e) => setNewTherapistCredentials(e.target.value)}
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-xs"
                        placeholder="উদা: B.Sc in Occupational Therapy (DU), Training in Early Childhood Autism Care (UK)"
                        required
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-xs font-bold text-slate-500 block">৮. কাজের দীর্ঘ অভিজ্ঞতা ও মেথডোলজি বর্ণনা</label>
                      <textarea
                        value={newTherapistExperience}
                        onChange={(e) => setNewTherapistExperience(e.target.value)}
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs h-20"
                        placeholder="উদা: অটিস্টিক ও স্পিচ ডিলে শিশুদের ফ্লুয়েন্সি রিকভার করতে সেন্সরি ও বিহেভিওরাল টেকনিক ব্যবহারের বিশেষ দীর্ঘ অভিজ্ঞতা।"
                      />
                    </div>

                    <button
                      type="submit"
                      className="w-full bg-slate-900 hover:bg-slate-800 text-white font-extrabold text-xs sm:text-sm py-3 rounded-xl transition-all shadow-xs cursor-pointer"
                    >
                      নতুন থেরাপিস্ট যুক্ত করুন (Confirm and Save)
                    </button>
                  </form>
                </div>

                {/* Therapist List & Delete Actions Column (5 spans) */}
                <div className="lg:col-span-5 space-y-6">
                  <div className="bg-white border border-slate-200 rounded-3xl p-5 shadow-sm space-y-4">
                    <h3 className="font-extrabold text-slate-900 text-sm border-b border-slate-100 pb-2.5">
                      অ্যাক্টিভ থেরাপিস্ট ডিরেক্টরি তালিকা ({therapists.length})
                    </h3>

                    <div className="space-y-3 max-h-[500px] overflow-y-auto pr-1">
                      {therapists.map((therapist) => (
                        <div 
                          key={therapist.id} 
                          className="p-4 bg-slate-50 rounded-2xl border border-slate-150 flex items-center justify-between gap-3 hover:border-slate-250 transition-all"
                        >
                          <div className="flex items-center gap-3">
                            {therapist.avatar_url ? (
                              <img 
                                src={therapist.avatar_url} 
                                alt={therapist.name} 
                                referrerPolicy="no-referrer"
                                className="w-10 h-10 rounded-xl object-cover border border-slate-200 shrink-0" 
                              />
                            ) : (
                              <div className="w-10 h-10 rounded-xl bg-slate-900 text-white flex items-center justify-center text-xs font-bold shrink-0 font-display">
                                {therapist.name.includes("ডা.") ? "ডা" : therapist.name[0]}
                              </div>
                            )}
                            <div>
                              <h4 className="font-extrabold text-slate-800 text-xs sm:text-sm leading-tight">{therapist.name}</h4>
                              <p className="text-[10px] text-slate-400 font-bold mt-0.5">{therapist.designation}</p>
                              <span className="text-[9px] bg-sky-50 text-sky-700 px-1.5 py-0.5 rounded font-mono block w-max mt-1">ফি: {therapist.visit_fee} BDT</span>
                            </div>
                          </div>

                          <button
                            onClick={() => handleDeleteTherapist(therapist.id, therapist.name)}
                            className="bg-rose-50 hover:bg-rose-100 text-rose-600 p-2 rounded-xl transition-all cursor-pointer border border-rose-100 shrink-0"
                            title="থেরাপিস্ট প্রোফাইল মুছে দিন"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

              </div>
            )}

            {/* ADMIN TAB 3: INTEGRATED SECURITY AUDIT & METADATA (PRESERVED) */}
            {adminTab === "security_audit" && (
              <div className="max-w-5xl mx-auto space-y-6">
                
                {/* Audit controls top row */}
                <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-xs grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h3 className="text-base sm:text-lg font-bold font-display text-slate-900 flex items-center gap-2">
                      <ShieldCheck className="w-5 h-5 text-indigo-600" />
                      নিরাপত্তা সিমুলেটর কনফিগারেশন
                    </h3>
                    <p className="text-xs text-slate-500 mt-1">ভূমিকা ও টার্গেট টেবিল পরিবর্তন করে সুরক্ষার কার্যকারিতা অডিট করে দেখুন।</p>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="text-[10px] font-black text-slate-500 block uppercase tracking-wider">রোল (Role)</label>
                      <select
                        value={auditUserRole}
                        onChange={(e) => setAuditUserRole(e.target.value)}
                        className="w-full bg-slate-50 border border-slate-200 rounded-lg px-2 py-1.5 text-xs font-bold"
                      >
                        <option value="patient_own">রোগী (নিজের ডাটা)</option>
                        <option value="patient_other">রোগী (অন্য রোগী)</option>
                        <option value="therapist_own">থেরাপিস্ট (নিজের সেশন)</option>
                        <option value="therapist_other">থেরাপিস্ট (অন্য সেশন)</option>
                      </select>
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] font-black text-slate-500 block uppercase tracking-wider">টেবিল (Table)</label>
                      <select
                        value={auditTargetTable}
                        onChange={(e) => setAuditTargetTable(e.target.value)}
                        className="w-full bg-slate-50 border border-slate-200 rounded-lg px-2 py-1.5 text-xs font-bold"
                      >
                        <option value="users">users</option>
                        <option value="bookings">bookings</option>
                        <option value="screenings">screenings</option>
                      </select>
                    </div>
                  </div>
                </div>

                {/* Audit result */}
                <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm">
                  {auditInfo.status === "ALLOWED" ? (
                    <div className="bg-emerald-50/70 border border-emerald-200 rounded-2xl p-5 space-y-3">
                      <div className="flex items-center gap-2 text-emerald-800">
                        <ShieldCheck className="w-5 h-5 text-emerald-600" />
                        <h4 className="font-bold text-sm">অনুমতি দেওয়া হয়েছে (Access Granted - 200 OK)</h4>
                      </div>
                      <p className="text-xs text-slate-700 leading-relaxed">
                        {auditInfo.details}
                      </p>
                      <div className="bg-white/60 p-2.5 rounded-lg border border-emerald-100">
                        <p className="text-[10px] font-mono font-bold text-emerald-800 uppercase tracking-wider mb-1">প্রয়োগকৃত সুপাবেস পলিসি:</p>
                        <code className="text-[9px] sm:text-xs font-mono text-emerald-700">{auditInfo.policyApplied}</code>
                      </div>
                    </div>
                  ) : (
                    <div className="bg-rose-50 border border-rose-200 rounded-2xl p-5 space-y-3">
                      <div className="flex items-center gap-2 text-rose-800">
                        <Lock className="w-5 h-5 text-rose-600 animate-pulse" />
                        <h4 className="font-bold text-sm">অ্যাক্সেস ব্লকড (Blocked - 42501 Insufficient Privilege)</h4>
                      </div>
                      <p className="text-xs text-slate-700 leading-relaxed">
                        {auditInfo.details}
                      </p>
                      <div className="bg-white/60 p-2.5 rounded-lg border border-rose-100 flex items-center justify-between">
                        <div>
                          <p className="text-[10px] font-mono font-bold text-rose-800 uppercase tracking-wider mb-1">ডাটাবেজ এক্সেস মেকানিজম:</p>
                          <code className="text-[9px] sm:text-xs font-mono text-rose-700">{auditInfo.policyApplied}</code>
                        </div>
                        <span className="text-[10px] font-mono font-black text-rose-600 bg-rose-100 border border-rose-200 px-2 py-1 rounded">
                          ERR: 42501
                        </span>
                      </div>
                    </div>
                  )}
                </div>

                {/* Redirect Protection Simulation Panel */}
                <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm space-y-6">
                  <div className="border-b border-slate-100 pb-3">
                    <h3 className="font-extrabold text-slate-900 text-sm sm:text-base">সুপাবেস রোল রিডাইরেকশন ও রাউট প্রোটেকশন</h3>
                    <p className="text-xs text-slate-500 mt-1">লগইন পরবর্তী রাউট নিয়ন্ত্রণ সিমুলেশন</p>
                  </div>

                  <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                    <div className="lg:col-span-5 bg-slate-50 p-5 rounded-2xl border border-slate-150 space-y-4 text-xs">
                      <div className="space-y-1">
                        <label className="font-extrabold text-[10px] text-slate-500 block uppercase tracking-wider">রোল (User Role)</label>
                        <select
                          value={redirSimRole}
                          onChange={(e) => setRedirSimRole(e.target.value as any)}
                          className="w-full bg-white border border-slate-200 rounded-lg px-2.5 py-1.5 font-bold"
                        >
                          <option value="patient">রোগী (patient)</option>
                          <option value="therapist">থেরাপিস্ট (therapist)</option>
                          <option value="admin">সিস্টেম এডমিন (admin)</option>
                          <option value="unauthenticated">লগইন করা নেই (Guest)</option>
                        </select>
                      </div>

                      <div className="space-y-1">
                        <label className="font-extrabold text-[10px] text-slate-500 block uppercase tracking-wider">প্রবেশ করতে চাওয়া রাউট</label>
                        <select
                          value={redirSimRoute}
                          onChange={(e) => setRedirSimRoute(e.target.value)}
                          className="w-full bg-white border border-slate-200 rounded-lg px-2.5 py-1.5 font-bold"
                        >
                          <option value="/dashboard/patient">/dashboard/patient</option>
                          <option value="/dashboard/therapist">/dashboard/therapist</option>
                          <option value="/admin-portal">/admin-portal</option>
                        </select>
                      </div>
                    </div>

                    <div className="lg:col-span-7">
                      <div className={`p-5 rounded-2xl border ${redirectSimResult.colorClass} space-y-3`}>
                        <h4 className="font-bold text-xs sm:text-sm">{redirectSimResult.message}</h4>
                        <div className="bg-white/55 p-3 rounded-xl text-[11px] font-mono leading-relaxed space-y-1">
                          <p><strong>ফাইনাল অ্যাকশন:</strong> {redirectSimResult.actionTaken}</p>
                          <p><strong>রিডাইরেক্ট লক্ষ্য:</strong> {redirectSimResult.finalPath}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

              </div>
            )}

          </div>
        </div>
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

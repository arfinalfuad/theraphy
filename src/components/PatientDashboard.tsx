import React, { useState, useEffect, useRef } from "react";
import { 
  Home,
  Calendar, 
  FileText, 
  TrendingUp, 
  Mic, 
  MicOff, 
  Play, 
  CheckCircle, 
  Clock, 
  User, 
  Award, 
  BookOpen, 
  Activity, 
  Sparkles, 
  ChevronRight, 
  AlertCircle,
  Plus,
  Flame,
  Check,
  X,
  Volume2,
  VolumeX,
  Video,
  VideoOff,
  PhoneOff,
  MessageSquare,
  ShieldCheck,
  Layout
} from "lucide-react";
import { supabase } from "../supabaseClient";

// Interfaces for our data
interface Session {
  id: string;
  therapist_name: string;
  date: string;
  time: string;
  status: "scheduled" | "completed" | "canceled";
  topic: string;
}

interface ScreeningReport {
  id: string;
  date: string;
  test_type: string;
  score: number;
  clarity_score: number;
  therapist_notes: string;
  recommendation: string;
}

interface ProgressSummary {
  weekly_streak: number;
  completed_exercises: number;
  daily_goal_minutes: number;
  practiced_minutes: number;
  active_milestone: string;
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

interface PatientDashboardProps {
  onNavigate?: (hash: string) => void;
  prescriptions?: Prescription[];
}

export default function PatientDashboard({ onNavigate, prescriptions = [] }: PatientDashboardProps) {
  const [sensoryFriendly, setSensoryFriendly] = useState(false);
  const [sessions, setSessions] = useState<Session[]>([
    {
      id: "1",
      therapist_name: "ড. শায়লা রহমান (Speech Pathologist)",
      date: "২০২৬-০৭-১৮",
      time: "বিকাল ০৪:৩০ মিনিট",
      status: "scheduled",
      topic: "উচ্চারণ ও স্বরযন্ত্র ব্যায়াম (Sibilant Sounds)",
    },
    {
      id: "2",
      therapist_name: "মাসুদ রানা (Child Therapist)",
      date: "২০২৬-০৭-২২",
      time: "সকাল ১০:০০ মিনিট",
      status: "scheduled",
      topic: "শব্দ সংযোগ ও বাক্য গঠন (Sentence Flow)",
    }
  ]);

  const [reports, setReports] = useState<ScreeningReport[]>([
    {
      id: "rep-101",
      date: "২০২৬-০৭-১০",
      test_type: "প্রাথমিক স্পিচ ও উচ্চারণ স্ক্যান",
      score: 84,
      clarity_score: 78,
      therapist_notes: "উচ্চারণের গতি ভালো, তবে 'শ' এবং 'স' বর্ণে অতিরিক্ত বায়ু নির্গমন হচ্ছে। নিয়মিত ডাবল-কনসোনেন্ট প্র্যাকটিস করতে হবে।",
      recommendation: "সপ্তাহে ৩ দিন ন্যূনতম ২০ মিনিট করে ফেসিয়াল মিরর এক্সারসাইজ করুন।"
    },
    {
      id: "rep-102",
      date: "২০২৬-০৬-১৫",
      test_type: "কগনিটিভ রেসপন্স ও ফ্লুয়েন্সি টেস্ট",
      score: 92,
      clarity_score: 88,
      therapist_notes: "শব্দ খোঁজার জড়তা অনেক কমে এসেছে। বাক্য সাজানোর গতি এখন অত্যন্ত সন্তোষজনক।",
      recommendation: "নতুন অনুচ্ছেদ পাঠ করার অভ্যাস চালু রাখুন।"
    }
  ]);

  const [progress, setProgress] = useState<ProgressSummary>({
    weekly_streak: 5,
    completed_exercises: 14,
    daily_goal_minutes: 30,
    practiced_minutes: 20,
    active_milestone: "বর্ণমালা ও বেসিক শব্দমালা স্পষ্ট উচ্চারণ"
  });

  const [loading, setLoading] = useState(false);
  const [dbStatus, setDbStatus] = useState<string>("");
  
  // Interactive Speech practice playground state
  const [isRecording, setIsRecording] = useState(false);
  const [recordingStatus, setRecordingStatus] = useState<"idle" | "listening" | "processing" | "success">("idle");
  const [practiceWord, setPracticeWord] = useState("বাংলাদেশ");
  const [practiceScore, setPracticeScore] = useState<number | null>(null);
  const [selectedReport, setSelectedReport] = useState<ScreeningReport | null>(null);

  // New session request state
  const [showRequestModal, setShowRequestModal] = useState(false);
  const [newTopic, setNewTopic] = useState("");
  const [newTherapist, setNewTherapist] = useState("ড. শায়লা রহমান (Speech Pathologist)");
  const [newDate, setNewDate] = useState("");
  const [newTime, setNewTime] = useState("");

  // Tabs layout
  const [activeTab, setActiveTab] = useState<"overview" | "aac" | "videocall">("overview");

  // AAC Speech State
  const [speakingCardIndex, setSpeakingCardIndex] = useState<number | null>(null);
  const [lastSpokenText, setLastSpokenText] = useState<string>("");
  const [speechRate, setSpeechRate] = useState<number>(0.85);
  const [speechPitch, setSpeechPitch] = useState<number>(1.1);

  const aacCards = [
    {
      emoji: "🍽️",
      labelBangla: "খাবার খাবো",
      speechText: "আমি খাবার খেতে চাই",
      bgColor: "bg-amber-50 hover:bg-amber-100/75 border-amber-200 text-amber-900",
      textColor: "text-amber-800",
      accentBg: "bg-amber-100/50",
      glowColor: "shadow-amber-100 ring-amber-300",
      accentText: "খাদ্য"
    },
    {
      emoji: "💧",
      labelBangla: "পানি খাবো",
      speechText: "আমি পানি খেতে চাই",
      bgColor: "bg-sky-50 hover:bg-sky-100/75 border-sky-200 text-sky-900",
      textColor: "text-sky-800",
      accentBg: "bg-sky-100/50",
      glowColor: "shadow-sky-100 ring-sky-300",
      accentText: "পানীয়"
    },
    {
      emoji: "🚽",
      labelBangla: "টয়লেটে যাবো",
      speechText: "আমি টয়লেটে যেতে চাই",
      bgColor: "bg-emerald-50 hover:bg-emerald-100/75 border-emerald-200 text-emerald-900",
      textColor: "text-emerald-800",
      accentBg: "bg-emerald-100/50",
      glowColor: "shadow-emerald-100 ring-emerald-300",
      accentText: "প্রয়োজন"
    },
    {
      emoji: "🥱",
      labelBangla: "ঘুমাবো",
      speechText: "আমার ঘুম পেয়েছে",
      bgColor: "bg-indigo-50 hover:bg-indigo-100/75 border-indigo-200 text-indigo-900",
      textColor: "text-indigo-800",
      accentBg: "bg-indigo-100/50",
      glowColor: "shadow-indigo-100 ring-indigo-300",
      accentText: "বিশ্রাম"
    },
    {
      emoji: "🧸",
      labelBangla: "খেলবো",
      speechText: "আমি খেলতে চাই",
      bgColor: "bg-purple-50 hover:bg-purple-100/75 border-purple-200 text-purple-900",
      textColor: "text-purple-800",
      accentBg: "bg-purple-100/50",
      glowColor: "shadow-purple-100 ring-purple-300",
      accentText: "আনন্দ"
    },
    {
      emoji: "😭",
      labelBangla: "ব্যথা করছে",
      speechText: "আমার ব্যথা করছে",
      bgColor: "bg-rose-50 hover:bg-rose-100/75 border-rose-200 text-rose-900",
      textColor: "text-rose-800",
      accentBg: "bg-rose-100/50",
      glowColor: "shadow-rose-100 ring-rose-300",
      accentText: "কষ্ট"
    }
  ];

  const speakBangla = (text: string, index: number) => {
    if (!("speechSynthesis" in window)) {
      alert("দুঃখিত, আপনার ব্রাউজারটি টেক্সট-টু-স্পিচ (TTS) সমর্থন করে না।");
      return;
    }

    window.speechSynthesis.cancel();

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = "bn-BD";
    utterance.rate = speechRate;
    utterance.pitch = speechPitch;

    const voices = window.speechSynthesis.getVoices();
    const banglaVoice = voices.find(
      (v) => v.lang === "bn-BD" || v.lang === "bn-IN" || v.name.includes("Bangla") || v.name.includes("Bengali")
    );
    if (banglaVoice) {
      utterance.voice = banglaVoice;
    }

    utterance.onstart = () => {
      setSpeakingCardIndex(index);
      setLastSpokenText(text);
    };

    utterance.onend = () => {
      setSpeakingCardIndex(null);
    };

    utterance.onerror = () => {
      setSpeakingCardIndex(null);
    };

    window.speechSynthesis.speak(utterance);
  };

  // Simulated Video Call State
  const [callActive, setCallActive] = useState(false);
  const [micMuted, setMicMuted] = useState(false);
  const [camOff, setCamOff] = useState(false);
  const [screenShared, setScreenShared] = useState(false);
  const [chatMessages, setChatMessages] = useState<{ sender: "therapist" | "patient"; text: string; time: string }[]>([]);
  const [newChatText, setNewChatText] = useState("");
  const [callDuration, setCallDuration] = useState(0);
  const [simulatedPartnerSpeech, setSimulatedPartnerSpeech] = useState("কানেক্টেড... সেশন শুরু হয়েছে।");

  // Call duration timer
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (callActive) {
      timer = setInterval(() => {
        setCallDuration(prev => prev + 1);
      }, 1000);
    } else {
      setCallDuration(0);
      setChatMessages([]);
    }
    return () => clearInterval(timer);
  }, [callActive]);

  // Call flow simulated therapist responses
  useEffect(() => {
    if (!callActive) return;

    const dialogue = [
      { delay: 3000, text: "শুভ সকাল! কেমন আছো আরিয়ান?", talk: "শুভ সকাল! কেমন আছো আরিয়ান?" },
      { delay: 8000, text: "আজ আমরা জিহ্বার জড়তা দূর করার চমৎকার কিছু বায়ু ব্যায়াম করব।", talk: "আজ আমরা জিহ্বার জড়তা দূর করার চমৎকার কিছু বায়ু ব্যায়াম করব।" },
      { delay: 14000, text: "আমার ঠোঁটের ভঙ্গিটি লক্ষ করো আর বলো: 'পাপা'", talk: "আমার ঠোঁটের ভঙ্গিটি লক্ষ করো আর বলো: পাপা" },
      { delay: 20000, text: "অনেক চমৎকার হয়েছে! এবার আমরা 'স' বর্ণ উচ্চারণ করার চেষ্টা করব।", talk: "অনেক চমৎকার হয়েছে! এবার আমরা স বর্ণ উচ্চারণ করার চেষ্টা করব।" },
      { delay: 27000, text: "খুব সুন্দর! এটি প্রতিদিন ১০ বার করে প্র্যাকটিস করবে কিন্তু!", talk: "খুব সুন্দর! এটি প্রতিদিন ১০ বার করে প্র্যাকটিস করবে কিন্তু!" }
    ];

    const timeouts = dialogue.map(item => {
      return setTimeout(() => {
        setChatMessages(prev => [
          ...prev,
          { sender: "therapist", text: item.text, time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) }
        ]);
        setSimulatedPartnerSpeech(item.text);
        
        if ("speechSynthesis" in window) {
          const utterance = new SpeechSynthesisUtterance(item.talk);
          utterance.lang = "bn-BD";
          utterance.rate = 0.95;
          const voices = window.speechSynthesis.getVoices();
          const banglaVoice = voices.find(v => v.lang === "bn-BD" || v.lang === "bn-IN" || v.name.includes("Bangla") || v.name.includes("Bengali"));
          if (banglaVoice) utterance.voice = banglaVoice;
          window.speechSynthesis.speak(utterance);
        }
      }, item.delay);
    });

    return () => {
      timeouts.forEach(clearTimeout);
    };
  }, [callActive]);

  // Attempt to load from Supabase if available
  useEffect(() => {
    async function fetchSupabaseData() {
      try {
        setLoading(true);
        // Check session first
        const { data: { session } } = await supabase.auth.getSession();
        if (!session) {
          setDbStatus("লোকাল ডেমো মোডে চলছে (সুপাবেস সেশন পাওয়া যায়নি)।");
          setLoading(false);
          return;
        }

        // Try to fetch sessions
        const { data: dbSessions, error: sessError } = await supabase
          .from("sessions")
          .select("*")
          .eq("patient_id", session.user.id);

        if (!sessError && dbSessions && dbSessions.length > 0) {
          setSessions(dbSessions as any);
        }

        // Try to fetch screening reports
        const { data: dbReports, error: repError } = await supabase
          .from("screening_reports")
          .select("*")
          .eq("patient_id", session.user.id);

        if (!repError && dbReports && dbReports.length > 0) {
          setReports(dbReports as any);
        }

        setDbStatus("সফলভাবে সুপাবেস ক্লাউড ডেটার সাথে সিঙ্কড হয়েছে।");
      } catch (err) {
        console.warn("Supabase fetch fallback to mock:", err);
        setDbStatus("ডাটাবেস কানেকশন ফলব্যাক: ডেমো ডাটা প্রদর্শিত হচ্ছে।");
      } finally {
        setLoading(false);
      }
    }

    fetchSupabaseData();
  }, []);

  // Practice recorder simulation
  const handleStartPractice = () => {
    setIsRecording(true);
    setRecordingStatus("listening");
    setPracticeScore(null);

    // Simulate listening for 2.5 seconds
    setTimeout(() => {
      setRecordingStatus("processing");
      
      // Simulate processing for 1.5 seconds
      setTimeout(() => {
        setIsRecording(false);
        setRecordingStatus("success");
        // Generate high score for positive reinforcement
        const randomScore = Math.floor(Math.random() * 15) + 85; 
        setPracticeScore(randomScore);
        
        // Add practice minutes to daily summary
        setProgress(prev => ({
          ...prev,
          practiced_minutes: Math.min(prev.daily_goal_minutes, prev.practiced_minutes + 5),
          completed_exercises: prev.completed_exercises + 1
        }));
      }, 1500);
    }, 2500);
  };

  // Add custom manual practice duration (Interactive state update)
  const logManualPractice = () => {
    setProgress(prev => {
      const updatedMins = prev.practiced_minutes + 10;
      const reachedGoal = updatedMins >= prev.daily_goal_minutes;
      return {
        ...prev,
        practiced_minutes: Math.min(60, updatedMins),
        weekly_streak: reachedGoal && prev.practiced_minutes < prev.daily_goal_minutes ? prev.weekly_streak + 1 : prev.weekly_streak
      };
    });
  };

  // Handle session booking request
  const handleBookSession = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newDate || !newTime || !newTopic) return;

    const newSessionItem: Session = {
      id: Math.random().toString(),
      therapist_name: newTherapist,
      date: newDate,
      time: newTime,
      status: "scheduled",
      topic: newTopic
    };

    setSessions(prev => [newSessionItem, ...prev]);
    setShowRequestModal(false);
    setNewTopic("");
    setNewDate("");
    setNewTime("");
  };

  // Calculate daily practice progress percentage
  const practicePercent = Math.min(100, Math.round((progress.practiced_minutes / progress.daily_goal_minutes) * 100));

  return (
    <div className={`bg-slate-50 min-h-screen py-8 px-4 sm:px-6 lg:px-8 font-sans transition-all duration-500 ${sensoryFriendly ? "sepia-[30%] brightness-[75%] contrast-[95%] saturate-[75%]" : ""}`}>
      <div className="max-w-7xl mx-auto space-y-8">

        {sensoryFriendly && (
          <div className="bg-amber-100 border border-amber-200 p-4 rounded-2xl text-xs text-amber-900 font-extrabold flex items-center gap-2.5 animate-pulse shadow-xs">
            <span className="text-base">🛡️</span>
            <span>সংবেদনশীলতা সুরক্ষা সক্রিয় (Sensory Overload Protection Active) - অতিরিক্ত স্ক্রিন লাইট ও ক্ষতিকর নীল আলো কমানো হয়েছে।</span>
          </div>
        )}
        
        {/* Upper Brand Info & Greeting Bar */}
        <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="flex items-start gap-4">
            {onNavigate && (
              <button
                onClick={() => onNavigate("#/")}
                className="bg-slate-100 hover:bg-slate-200 p-2.5 rounded-xl border border-slate-250 text-slate-700 transition-all cursor-pointer mt-1"
                title="হোম পেজে ফিরে যান"
              >
                <Home className="w-5 h-5" />
              </button>
            )}
            <div className="space-y-2">
              <div className="inline-flex items-center gap-1.5 bg-indigo-50 text-indigo-700 px-3 py-1 rounded-full text-xs font-bold">
                <Activity className="w-3.5 h-3.5 text-indigo-600" />
                <span>রোগীর স্বাস্থ্য ও ড্যাশবোর্ড ওভারভিউ</span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight flex items-center gap-2">
                স্বাগতম, প্রিয় ব্যবহারকারী! <Sparkles className="w-6 h-6 text-yellow-500 animate-spin" style={{ animationDuration: '3s' }} />
              </h1>
              <p className="text-sm text-slate-500">
                আপনার স্পিচ থেরাপি যাত্রা অত্যন্ত সফল হচ্ছে। এখানে আপনার আজকের প্র্যাকটিস গোল এবং পরবর্তী সেশনের শিডিউল রয়েছে।
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-4 text-right">
            {/* Sensory Friendly Button Toggle */}
            <button
              onClick={() => {
                setSensoryFriendly(!sensoryFriendly);
                if (!sensoryFriendly) {
                  setSpeechRate(0.7);
                  setSpeechPitch(0.9);
                } else {
                  setSpeechRate(0.85);
                  setSpeechPitch(1.1);
                }
              }}
              className={`px-4 py-2.5 rounded-2xl text-xs font-black transition-all flex items-center gap-2 cursor-pointer shadow-xs ${
                sensoryFriendly 
                  ? "bg-amber-400 hover:bg-amber-500 text-slate-950" 
                  : "bg-slate-900 hover:bg-slate-800 text-white"
              }`}
            >
              <span>{sensoryFriendly ? "🛡️ সংবেদনশীলতা সুরক্ষা বন্ধ করুন" : "🔔 সংবেদনশীলতা সুরক্ষা সক্রিয় করুন"}</span>
            </button>

            <div className="flex flex-col items-end gap-1">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">কানেকশন স্ট্যাটাস</span>
              <div className="flex items-center gap-2 bg-slate-100 px-3 py-1.5 rounded-xl border border-slate-200">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-ping"></span>
                <span className="text-xs font-bold text-slate-700">{dbStatus || "লোকাল ডেমো মোডে সক্রিয়"}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Playful Tabs Navigation for Patient Dashboard */}
        <div className="flex bg-slate-100 p-1.5 rounded-2xl gap-2 max-w-xl">
          <button
            onClick={() => setActiveTab("overview")}
            className={`flex-1 py-3 px-4 text-xs font-black rounded-xl transition-all flex items-center justify-center gap-2 cursor-pointer ${
              activeTab === "overview"
                ? "bg-white text-indigo-700 shadow-sm"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            <Layout className="w-4 h-4 text-indigo-500" />
            <span>ড্যাশবোর্ড ওভারভিউ</span>
          </button>
          
          <button
            onClick={() => setActiveTab("aac")}
            className={`flex-1 py-3 px-4 text-xs font-black rounded-xl transition-all flex items-center justify-center gap-2 cursor-pointer ${
              activeTab === "aac"
                ? "bg-white text-amber-700 shadow-sm"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            <Volume2 className="w-4 h-4 text-amber-500" />
            <span>এএসি (AAC) স্পিচ বোর্ড</span>
          </button>
          
          <button
            onClick={() => setActiveTab("videocall")}
            className={`flex-1 py-3 px-4 text-xs font-black rounded-xl transition-all flex items-center justify-center gap-2 cursor-pointer ${
              activeTab === "videocall"
                ? "bg-white text-rose-700 shadow-sm"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            <Video className="w-4 h-4 text-rose-500" />
            <span className="relative flex items-center gap-1">
              ক্লাসরুম সেশন
              {callActive && (
                <span className="w-2.5 h-2.5 rounded-full bg-rose-500 animate-pulse"></span>
              )}
            </span>
          </button>
        </div>

        {activeTab === "overview" && (
          <>
            {/* Dynamic Interactive Progress Summaries Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Milestone & Practice Circle */}
          <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs flex flex-col justify-between space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-black uppercase tracking-wider text-slate-400">আজকের প্র্যাকটিস প্রোগ্রেস</span>
              <Award className="w-5 h-5 text-indigo-600" />
            </div>
            
            <div className="flex items-center gap-5 my-2">
              {/* Radial Circle */}
              <div className="relative w-20 h-20 flex items-center justify-center">
                <svg className="w-full h-full transform -rotate-90">
                  <circle cx="40" cy="40" r="34" stroke="#f1f5f9" strokeWidth="6" fill="transparent" />
                  <circle 
                    cx="40" 
                    cy="40" 
                    r="34" 
                    stroke="#4f46e5" 
                    strokeWidth="6" 
                    fill="transparent" 
                    strokeDasharray={2 * Math.PI * 34}
                    strokeDashoffset={2 * Math.PI * 34 * (1 - practicePercent / 100)}
                    className="transition-all duration-700 ease-out"
                  />
                </svg>
                <span className="absolute text-sm font-black text-indigo-900">{practicePercent}%</span>
              </div>

              <div>
                <p className="text-lg font-black text-slate-800">{progress.practiced_minutes} / {progress.daily_goal_minutes} মিনিট</p>
                <p className="text-xs font-bold text-slate-400">আজকের মোট অনুশীলন সমাপ্ত</p>
              </div>
            </div>

            <div className="space-y-2">
              <p className="text-xs text-slate-500 leading-snug">
                আপনার প্রতিদিনের লক্ষ্য ৩০ মিনিট কথা বলার ব্যায়াম বা অনুশীলন সম্পন্ন করা।
              </p>
              <button 
                onClick={logManualPractice}
                className="w-full bg-indigo-50 hover:bg-indigo-100 text-indigo-700 text-xs font-black py-2 px-4 rounded-xl border border-indigo-200 transition-all flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                ১০ মিনিট ম্যানুয়াল প্র্যাকটিস যুক্ত করুন
              </button>
            </div>
          </div>

          {/* Daily Streak & Exercise count */}
          <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs flex flex-col justify-between space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-black uppercase tracking-wider text-slate-400">অনুশীলনের ধারাবাহিকতা</span>
              <Flame className="w-5 h-5 text-amber-500 fill-amber-500 animate-pulse" />
            </div>

            <div className="space-y-1">
              <div className="flex items-baseline gap-2">
                <span className="text-4xl font-black text-amber-500 tracking-tight">{progress.weekly_streak} দিন</span>
                <span className="text-xs font-bold text-slate-400">টানা প্র্যাকটিস স্ট্রেইক</span>
              </div>
              <p className="text-xs font-medium text-slate-500">
                আপনি গত ৫ দিন ধরে নিয়মিত প্রতিদিনের টাস্ক শেষ করেছেন। আপনার স্পিচ ইমপ্রুভমেন্টের জন্য ধারাবাহিকতা বজায় রাখুন!
              </p>
            </div>

            <div className="border-t border-slate-100 pt-3 flex justify-between items-center text-xs">
              <span className="font-bold text-slate-500">মোট সমাপ্ত ব্যায়াম সংখ্যা:</span>
              <span className="bg-slate-100 text-slate-800 px-2.5 py-1 rounded-md font-bold">{progress.completed_exercises}টি</span>
            </div>
          </div>

          {/* Current Milestone / Target Goal */}
          <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs flex flex-col justify-between space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-black uppercase tracking-wider text-slate-400">চলতি মাইলস্টোন ও টার্গেট</span>
              <BookOpen className="w-5 h-5 text-emerald-600" />
            </div>

            <div className="space-y-1">
              <p className="text-xs font-bold text-emerald-700 uppercase tracking-wide bg-emerald-50 px-2 py-0.5 rounded-sm inline-block">চলতি লক্ষ্য</p>
              <h4 className="text-base font-black text-slate-800 leading-snug mt-1">
                {progress.active_milestone}
              </h4>
              <p className="text-xs text-slate-400 mt-1">
                এই মাইলস্টোনটি আপনার থেরাপিস্ট দ্বারা নির্ধারিত হয়েছে। এটি সম্পন্ন করলে আপনি লেভেল ২ এ প্রবেশ করবেন।
              </p>
            </div>

            <div className="w-full bg-slate-100 rounded-full h-2">
              <div className="bg-emerald-500 h-2 rounded-full w-4/6"></div>
            </div>
          </div>
        </div>

        {/* Core Layout: Upcoming Sessions & Screening Reports */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Upcoming Sessions Section - 7 Columns */}
          <div className="lg:col-span-7 space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Calendar className="w-5 h-5 text-indigo-600" />
                <h2 className="text-lg font-black text-slate-900 tracking-tight">আসন্ন স্পিচ থেরাপি সেশনসমূহ</h2>
              </div>
              
              <button 
                onClick={() => setShowRequestModal(true)}
                className="bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-black py-1.5 px-3.5 rounded-lg shadow-xs transition-all flex items-center gap-1 cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
                নতুন সেশন বুক করুন
              </button>
            </div>

            <div className="space-y-4">
              {sessions.length === 0 ? (
                <div className="bg-white border border-slate-200 p-8 rounded-2xl text-center">
                  <AlertCircle className="w-8 h-8 text-slate-300 mx-auto mb-2" />
                  <p className="text-slate-500 text-xs font-bold">আপনার কোনো আসন্ন সেশন বুক করা নেই।</p>
                </div>
              ) : (
                sessions.map((sess) => (
                  <div key={sess.id} className="bg-white border border-slate-200 hover:border-slate-300 rounded-2xl p-5 shadow-xs transition-all flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <span className="bg-indigo-50 text-indigo-700 text-[10px] font-black uppercase px-2.5 py-0.5 rounded">
                          {sess.topic}
                        </span>
                        <span className="flex items-center gap-1 text-[10px] text-amber-600 font-bold bg-amber-50 px-2 py-0.5 rounded">
                          <Clock className="w-3 h-3" />
                          আসন্ন
                        </span>
                      </div>
                      
                      <div className="space-y-1">
                        <h4 className="text-sm font-black text-slate-800 flex items-center gap-1.5">
                          <User className="w-3.5 h-3.5 text-slate-400" />
                          {sess.therapist_name}
                        </h4>
                        <p className="text-xs text-slate-500 font-medium">
                          তারিখ: <span className="font-bold text-slate-700">{sess.date}</span> | সময়: <span className="font-bold text-indigo-600">{sess.time}</span>
                        </p>
                      </div>
                    </div>

                    <button 
                      onClick={() => {
                        setActiveTab("videocall");
                        setCallActive(true);
                      }}
                      className="bg-slate-900 hover:bg-indigo-700 text-white text-xs font-bold py-2 px-4 rounded-xl shadow-xs transition-all flex items-center gap-1 w-full sm:w-auto justify-center cursor-pointer"
                    >
                      <Play className="w-3 h-3 fill-white" />
                      সেশনে যোগ দিন
                    </button>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Screening Reports Section - 5 Columns */}
          <div className="lg:col-span-5 space-y-4">
            <div className="flex items-center gap-2">
              <FileText className="w-5 h-5 text-indigo-600" />
              <h2 className="text-lg font-black text-slate-900 tracking-tight">সাম্প্রতিক স্ক্রিনিং রিপোর্ট ও মূল্যায়ন</h2>
            </div>

            <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-xs divide-y divide-slate-100">
              {reports.map((report) => (
                <div key={report.id} className="p-4 hover:bg-slate-50/50 transition-all space-y-2.5">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-400">{report.date}</span>
                    <span className="bg-emerald-50 text-emerald-700 text-[10px] font-black px-2 py-0.5 rounded-sm">
                      স্কোর: {report.score}/১০০
                    </span>
                  </div>

                  <div className="space-y-1">
                    <h4 className="text-sm font-black text-slate-800 leading-snug">
                      {report.test_type}
                    </h4>
                    <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed">
                      {report.therapist_notes}
                    </p>
                  </div>

                  <div className="flex items-center justify-between pt-1">
                    <span className="text-[10px] font-bold text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded-md">
                      স্পিচ ক্ল্যারিটি: {report.clarity_score}%
                    </span>
                    
                    <button 
                      onClick={() => setSelectedReport(report)}
                      className="text-[11px] font-black text-indigo-600 hover:text-indigo-800 flex items-center gap-0.5 transition-all cursor-pointer"
                    >
                      সম্পূর্ণ রিপোর্ট দেখুন
                      <ChevronRight className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Certified Doctor Homework prescriptions */}
        {prescriptions && prescriptions.length > 0 && (
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <span className="text-xl">🩺</span>
              <h2 className="text-lg font-black text-slate-900 tracking-tight">আজকের থেরাপিস্ট প্রেসক্রিপশন ও হোমওয়ার্ক</h2>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {prescriptions.map((rx) => (
                <div key={rx.id} className="bg-white border-l-4 border-indigo-600 rounded-2xl p-5 shadow-xs space-y-3">
                  <div className="flex justify-between items-start">
                    <div>
                      <h4 className="text-sm font-black text-slate-900">{rx.diagnosis}</h4>
                      <p className="text-[11px] text-slate-400 font-bold">থেরাপিস্ট: {rx.therapist_name} | তারিখ: {rx.date}</p>
                    </div>
                    <span className="bg-indigo-50 text-indigo-700 text-[10px] font-black px-2.5 py-0.5 rounded font-mono">
                      {rx.id}
                    </span>
                  </div>

                  <div className="bg-slate-50 p-4 rounded-xl border border-slate-150 text-xs text-slate-700 leading-relaxed font-semibold whitespace-pre-line">
                    <strong className="text-slate-900 block mb-1">📋 প্র্যাকটিস নির্দেশনাবলি:</strong>
                    {rx.homework}
                  </div>

                  <div className="flex items-center justify-between text-[11px] font-bold border-t border-slate-100 pt-2 text-slate-500">
                    <span>পরবর্তী সেশন: <strong className="text-indigo-600">{rx.next_visit}</strong></span>
                    <span>নোট: <strong>{rx.notes}</strong></span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Interactive Audio Practice Playground Widget */}
        <div className="bg-slate-900 text-white rounded-3xl p-6 sm:p-8 border border-slate-800 shadow-xl space-y-6">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 border-b border-slate-800 pb-5">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="bg-indigo-500 text-[10px] text-white font-extrabold uppercase px-2 py-0.5 rounded tracking-widest">কিডস ফ্রেন্ডলি অ্যাক্টিভিটি</span>
                <span className="text-amber-400 text-xs font-bold flex items-center gap-1">
                  <Flame className="w-3.5 h-3.5" /> +5 Mins Practice Reward
                </span>
              </div>
              <h3 className="text-lg sm:text-xl font-black text-white tracking-tight flex items-center gap-1.5 mt-1">
                মিনি স্পিচ প্র্যাকটিস ল্যাব (Pronunciation Practice Room)
              </h3>
              <p className="text-xs text-slate-400">
                নিচের শব্দটি জোরে উচ্চারণ করে বলুন। আমাদের স্পিচ ইঞ্জিন আপনার উচ্চারণ স্পট স্ক্যান করবে!
              </p>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-slate-400">শব্দ পরিবর্তন করুন:</span>
              <select 
                value={practiceWord}
                onChange={(e) => {
                  setPracticeWord(e.target.value);
                  setPracticeScore(null);
                  setRecordingStatus("idle");
                }}
                className="bg-slate-800 border border-slate-700 text-xs font-bold rounded-lg px-2.5 py-1.5 text-slate-200 focus:outline-hidden"
              >
                <option value="বাংলাদেশ">বাংলাদেশ (Ba-ngla-desh)</option>
                <option value="স্পিচ থেরাপি">স্পিচ থেরাপি (Speech Therapy)</option>
                <option value="উচ্চারণ ব্যায়াম">উচ্চারণ ব্যায়াম (Pronunciation)</option>
                <option value="ভাষা অনুশীলন">ভাষা অনুশীলন (Language)</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
            {/* Target Word Showcase Card */}
            <div className="md:col-span-5 bg-slate-950 p-6 rounded-2xl border border-slate-800 text-center space-y-3">
              <span className="text-[10px] font-black tracking-widest uppercase text-slate-500">টার্গেট শব্দ</span>
              <h1 className="text-3xl sm:text-4xl font-black text-indigo-400 tracking-wide select-none py-2">
                "{practiceWord}"
              </h1>
              <p className="text-xs text-slate-400 font-mono italic">// জোরে ও স্পষ্ট করে উচ্চারণ করুন</p>
            </div>

            {/* Interaction Button & Wave Animation */}
            <div className="md:col-span-4 flex flex-col items-center justify-center space-y-4">
              {recordingStatus === "idle" && (
                <button
                  onClick={handleStartPractice}
                  className="w-16 h-16 sm:w-20 sm:h-20 bg-indigo-600 hover:bg-indigo-500 text-white rounded-full flex items-center justify-center shadow-lg hover:shadow-indigo-500/20 transition-all transform hover:scale-105 cursor-pointer"
                >
                  <Mic className="w-8 h-8 sm:w-10 sm:h-10 animate-pulse" />
                </button>
              )}

              {recordingStatus === "listening" && (
                <div className="flex flex-col items-center space-y-3">
                  <button
                    onClick={() => {
                      setIsRecording(false);
                      setRecordingStatus("idle");
                    }}
                    className="w-16 h-16 sm:w-20 sm:h-20 bg-rose-600 text-white rounded-full flex items-center justify-center shadow-lg transition-all animate-ping"
                  >
                    <MicOff className="w-8 h-8 sm:w-10 sm:h-10" />
                  </button>
                  
                  {/* Waveforms simulation */}
                  <div className="flex items-center gap-1 h-6">
                    <span className="w-1 bg-indigo-500 rounded-full animate-bounce h-2" style={{ animationDelay: '0.1s' }}></span>
                    <span className="w-1 bg-indigo-400 rounded-full animate-bounce h-5" style={{ animationDelay: '0.3s' }}></span>
                    <span className="w-1 bg-indigo-300 rounded-full animate-bounce h-3" style={{ animationDelay: '0.5s' }}></span>
                    <span className="w-1 bg-indigo-400 rounded-full animate-bounce h-6" style={{ animationDelay: '0.2s' }}></span>
                    <span className="w-1 bg-indigo-500 rounded-full animate-bounce h-2" style={{ animationDelay: '0.4s' }}></span>
                  </div>
                </div>
              )}

              {recordingStatus === "processing" && (
                <div className="flex flex-col items-center space-y-2">
                  <div className="w-10 h-10 border-4 border-indigo-400 border-t-transparent rounded-full animate-spin"></div>
                  <p className="text-xs font-bold text-slate-400">উচ্চারণের মান স্ক্যান হচ্ছে...</p>
                </div>
              )}

              {recordingStatus === "success" && (
                <button
                  onClick={handleStartPractice}
                  className="w-16 h-16 sm:w-20 sm:h-20 bg-emerald-600 hover:bg-emerald-500 text-white rounded-full flex items-center justify-center shadow-lg transition-all transform hover:scale-105 cursor-pointer"
                >
                  <Mic className="w-8 h-8 sm:w-10 sm:h-10" />
                </button>
              )}

              <p className="text-xs text-slate-400 font-bold text-center">
                {recordingStatus === "idle" && "রেকর্ড শুরু করতে মাইক্রোফোনে ক্লিক করুন"}
                {recordingStatus === "listening" && "কথা বলুন... আমরা শুনছি!"}
                {recordingStatus === "success" && "আবার পরীক্ষা করতে বাটনে চাপুন"}
              </p>
            </div>

            {/* AI Grading result */}
            <div className="md:col-span-3 bg-slate-950 p-5 rounded-2xl border border-slate-800 flex flex-col items-center justify-center min-h-[140px]">
              {practiceScore !== null ? (
                <div className="text-center space-y-1.5 animate-bounce">
                  <span className="text-[10px] font-black tracking-widest text-slate-500 uppercase">উচ্চারণ স্পষ্টতা</span>
                  <h1 className="text-4xl font-black text-emerald-400">{practiceScore}%</h1>
                  <span className="bg-emerald-950 text-emerald-400 border border-emerald-900 text-[10px] font-black px-2 py-0.5 rounded block">
                    {practiceScore >= 90 ? "দুর্দান্ত উচ্চারণ!" : "দারুণ চেষ্টা, চালিয়ে যান!"}
                  </span>
                </div>
              ) : (
                <div className="text-center space-y-2 text-slate-500">
                  <Award className="w-8 h-8 mx-auto opacity-40" />
                  <p className="text-xs font-bold">এখানে AI স্ক্যানিং রেজাল্ট প্রদর্শিত হবে।</p>
                </div>
              )}
            </div>
          </div>
        </div>
          </>
        )}

        {/* Playful & Slick AAC Speech Board Tab Content */}
        {activeTab === "aac" && (
          <div className="space-y-6">
            <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 shadow-xs space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="space-y-1">
                  <div className="inline-flex items-center gap-1.5 bg-amber-50 text-amber-700 px-3 py-1 rounded-full text-xs font-bold">
                    <Volume2 className="w-3.5 h-3.5 text-amber-600" />
                    <span>কিডস স্পেশাল অ্যাসিস্টিভ কমিউনিকেশন</span>
                  </div>
                  <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">বাংলা ভিজ্যুয়াল এএসি (AAC) বোর্ড</h2>
                  <p className="text-xs text-slate-500">বিশেষ চাহিদা সম্পন্ন বা বাক-প্রতিবন্ধী শিশুদের জন্য একটি ছবি-ভিত্তিক ভাষা প্রকাশ টুল। ছবিতে চাপ দিলে স্বয়ংক্রিয় বাংলা ভয়েস প্লে হবে।</p>
                </div>
                
                {/* Speech Settings controls */}
                <div className="flex flex-wrap items-center gap-4 bg-slate-50 p-3.5 rounded-2xl border border-slate-150">
                  <div className="space-y-1">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-wider block">গতির হার (Speed Rate): {speechRate}x</label>
                    <input 
                      type="range" 
                      min="0.5" 
                      max="1.5" 
                      step="0.05" 
                      value={speechRate}
                      onChange={(e) => setSpeechRate(parseFloat(e.target.value))}
                      className="w-28 accent-indigo-600 h-1.5 bg-slate-200 rounded-lg cursor-pointer"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-wider block">ভয়েস পিচ (Pitch): {speechPitch}</label>
                    <input 
                      type="range" 
                      min="0.7" 
                      max="1.5" 
                      step="0.05" 
                      value={speechPitch}
                      onChange={(e) => setSpeechPitch(parseFloat(e.target.value))}
                      className="w-28 accent-indigo-600 h-1.5 bg-slate-200 rounded-lg cursor-pointer"
                    />
                  </div>
                </div>
              </div>

              {/* Grid of AAC Cards */}
              <div className="grid grid-cols-2 md:grid-cols-3 gap-6 pt-4">
                {aacCards.map((card, index) => {
                  const isSpeaking = speakingCardIndex === index;
                  return (
                    <button
                      key={index}
                      onClick={() => speakBangla(card.speechText, index)}
                      className={`relative overflow-hidden rounded-2xl p-6 border-2 transition-all transform hover:scale-105 flex flex-col items-center justify-center text-center cursor-pointer min-h-[180px] group ${card.bgColor} ${
                        isSpeaking ? `ring-4 ${card.glowColor} scale-102 border-transparent` : 'shadow-xs hover:shadow-md'
                      }`}
                    >
                      {/* Floating tag inside card */}
                      <span className={`absolute top-3 right-3 text-[10px] font-black uppercase px-2 py-0.5 rounded-full ${card.textColor} ${card.accentBg}`}>
                        {card.accentText}
                      </span>

                      {/* Large Emojis */}
                      <span className={`text-5xl sm:text-6xl mb-3 select-none transition-transform duration-200 group-hover:scale-115 ${
                        isSpeaking ? 'animate-bounce' : ''
                      }`}>
                        {card.emoji}
                      </span>

                      {/* Bangla Label */}
                      <h4 className="text-base sm:text-lg font-black tracking-tight">{card.labelBangla}</h4>
                      
                      {/* Speech feedback subtitle */}
                      <p className="text-[10px] font-semibold text-slate-400 mt-1">
                        স্পিচ: "{card.speechText}"
                      </p>

                      {/* Speaking wave status overlay */}
                      {isSpeaking && (
                        <div className="absolute inset-x-0 bottom-0 h-1.5 bg-indigo-600 animate-pulse"></div>
                      )}
                    </button>
                  );
                })}
              </div>

              {/* Last Spoken Text Banner */}
              {lastSpokenText && (
                <div className="bg-indigo-50 border border-indigo-100 rounded-2xl p-4 flex items-center justify-between mt-4">
                  <div className="flex items-center gap-3">
                    <span className="p-2.5 bg-indigo-600 text-white rounded-xl">
                      <Volume2 className="w-5 h-5" />
                    </span>
                    <div>
                      <p className="text-[10px] font-black text-indigo-400 uppercase tracking-wider">সর্বশেষ উচ্চারিত বাক্য</p>
                      <h4 className="text-sm sm:text-base font-black text-indigo-950">"{lastSpokenText}"</h4>
                    </div>
                  </div>
                  
                  <button 
                    onClick={() => {
                      if ("speechSynthesis" in window) {
                        window.speechSynthesis.cancel();
                        setSpeakingCardIndex(null);
                      }
                    }}
                    className="bg-indigo-100 hover:bg-indigo-200 text-indigo-700 text-xs font-black px-4 py-2 rounded-xl transition-all cursor-pointer"
                  >
                    ভয়েস বন্ধ করুন
                  </button>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Playful & Slick Video Classroom Session Tab Content */}
        {activeTab === "videocall" && (
          <div className="space-y-6">
            <div className="bg-slate-900 text-white border border-slate-800 rounded-3xl p-4 sm:p-6 shadow-xl space-y-5">
              
              {/* Header inside class */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
                <div className="space-y-1">
                  <div className="inline-flex items-center gap-1.5 bg-rose-500/20 text-rose-300 px-3 py-1 rounded-full text-xs font-bold border border-rose-500/30">
                    <span className="w-2 h-2 rounded-full bg-rose-500 animate-ping"></span>
                    <span>সরাসরি ভার্চুয়াল থেরাপি ক্লাস</span>
                  </div>
                  <h2 className="text-lg sm:text-xl font-black text-white">ড. শায়লা রহমান (Senior Pathologist) এর সাথে লাইভ ক্লাস</h2>
                </div>

                <div className="flex items-center gap-3 bg-slate-800 px-4 py-2 rounded-xl border border-slate-700 shrink-0">
                  <Clock className="w-4 h-4 text-slate-400" />
                  <span className="text-xs font-mono font-bold">
                    সেশন সময়: {Math.floor(callDuration / 60).toString().padStart(2, '0')}:{(callDuration % 60).toString().padStart(2, '0')}
                  </span>
                </div>
              </div>

              {/* Class Video Feed Panel */}
              {!callActive ? (
                <div className="bg-slate-950 rounded-2xl border border-slate-800 py-16 px-6 text-center space-y-5 max-w-xl mx-auto my-8">
                  <div className="w-16 h-16 bg-rose-500/10 text-rose-500 rounded-full flex items-center justify-center mx-auto border border-rose-500/20">
                    <Video className="w-8 h-8" />
                  </div>
                  <div className="space-y-2">
                    <h3 className="text-base sm:text-lg font-black text-slate-200">ভার্চুয়াল থেরাপি রুমে যোগ দিন</h3>
                    <p className="text-xs text-slate-400 max-w-md mx-auto">
                      সরাসরি থেরাপিস্টের সাথে আপনার ভিডিও কল সেশন শুরু করতে নিচের বাটনে চাপ দিন। আপনার স্পিকার ও ভয়েস ঠিক আছে কি না নিশ্চিত করুন।
                    </p>
                  </div>
                  <button
                    onClick={() => setCallActive(true)}
                    className="bg-rose-600 hover:bg-rose-500 text-white font-black text-xs sm:text-sm py-3 px-6 rounded-xl shadow-lg transition-all transform hover:scale-105 active:scale-95 cursor-pointer"
                  >
                    ভিডিও সেশন চালু করুন (Join Call)
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                  
                  {/* Large Video Screen - Therapist Frame (8 Columns) */}
                  <div className="lg:col-span-8 bg-slate-950 rounded-2xl border border-slate-800 overflow-hidden relative min-h-[380px] sm:min-h-[440px] flex items-center justify-center">
                    
                    {/* Simulated Therapist feed */}
                    {!camOff ? (
                      <div className="absolute inset-0 flex flex-col justify-between p-4 z-10">
                        {/* Therapist badge */}
                        <div className="bg-slate-900/80 backdrop-blur-xs px-3 py-1.5 rounded-lg border border-slate-800 text-xs font-black inline-block self-start">
                          🧑‍🏫 ড. শায়লা রহমান (Therapist Feed)
                        </div>

                        {/* Speech Bubble Overlay inside Feed */}
                        <div className="bg-indigo-600 text-white p-4 rounded-2xl shadow-xl max-w-sm self-end border border-indigo-500 animate-bounce">
                          <p className="text-[10px] font-black text-indigo-200 uppercase">লাইভ কথা (TTS)</p>
                          <p className="text-sm font-bold leading-relaxed">"{simulatedPartnerSpeech}"</p>
                        </div>
                      </div>
                    ) : null}

                    {/* Therapist Camera display simulation */}
                    {!camOff ? (
                      <div className="w-full h-full relative overflow-hidden flex items-center justify-center bg-radial-gradient">
                        {/* Dynamic graphics placeholder */}
                        <div className="absolute w-48 h-48 bg-indigo-500/10 rounded-full animate-pulse"></div>
                        <div className="absolute w-64 h-64 bg-emerald-500/5 rounded-full animate-ping" style={{ animationDuration: '4s' }}></div>
                        <div className="text-center space-y-4 relative z-10">
                          <span className="text-7xl">👩‍⚕️</span>
                          <h4 className="text-lg font-black text-slate-100 tracking-tight">ড. শায়লা রহমান (লাইভ সেশন)</h4>
                          <div className="flex items-center justify-center gap-1.5">
                            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></span>
                            <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-widest">ভয়েস কানেকশন হাই-ফিডেলিটি</span>
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div className="text-center space-y-2 text-slate-500">
                        <VideoOff className="w-12 h-12 mx-auto text-slate-600" />
                        <p className="text-xs font-bold">থেরাপিস্ট ক্যামেরা বন্ধ রেখেছেন</p>
                      </div>
                    )}

                    {/* Small overlay picture-in-picture for patient webcam */}
                    <div className="absolute bottom-4 left-4 w-32 h-24 sm:w-40 sm:h-28 bg-slate-900 rounded-xl border-2 border-slate-700 overflow-hidden z-20 shadow-lg">
                      <div className="absolute inset-0 flex items-center justify-center bg-slate-950">
                        {micMuted ? (
                          <span className="absolute top-1.5 right-1.5 bg-rose-500 p-0.5 rounded-md text-white text-[9px]"><MicOff className="w-3 h-3" /></span>
                        ) : null}
                        <div className="text-center">
                          <span className="text-2xl">👶</span>
                          <p className="text-[9px] font-bold text-slate-400">আমার ক্যামেরা (Patient)</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Real-time Class Chat Overlay (4 Columns) */}
                  <div className="lg:col-span-4 bg-slate-950 rounded-2xl border border-slate-800 flex flex-col justify-between h-[380px] sm:h-[440px]">
                    <div className="p-4 border-b border-slate-800 bg-slate-900/50 flex justify-between items-center">
                      <h4 className="text-xs font-black tracking-wider uppercase text-slate-400 flex items-center gap-1.5">
                        <MessageSquare className="w-3.5 h-3.5 text-indigo-400" />
                        <span>সেশন চ্যাট রুম</span>
                      </h4>
                      <span className="text-[10px] bg-slate-800 text-slate-300 font-extrabold px-2 py-0.5 rounded">লাইভ</span>
                    </div>

                    {/* Chat Messages scroll */}
                    <div className="flex-1 p-4 space-y-3.5 overflow-y-auto scroll-smooth text-xs">
                      {chatMessages.length === 0 ? (
                        <div className="h-full flex flex-col items-center justify-center text-center text-slate-600 space-y-1">
                          <MessageSquare className="w-6 h-6 opacity-30" />
                          <p className="text-[10px] font-bold">এখানে লাইভ টেক্সট কথোপকথন প্রদর্শিত হবে।</p>
                        </div>
                      ) : (
                        chatMessages.map((msg, idx) => (
                          <div key={idx} className={`flex flex-col ${msg.sender === "patient" ? "items-end" : "items-start"}`}>
                            <span className="text-[9px] text-slate-500 font-bold mb-0.5">
                              {msg.sender === "therapist" ? "👩‍⚕️ থেরাপিস্ট" : "👶 আমি"} | {msg.time}
                            </span>
                            <div className={`p-2.5 rounded-xl max-w-[85%] leading-relaxed font-semibold ${
                              msg.sender === "patient"
                                ? "bg-indigo-600 text-white rounded-tr-none"
                                : "bg-slate-800 text-slate-200 rounded-tl-none"
                            }`}>
                              {msg.text}
                            </div>
                          </div>
                        ))
                      )}
                    </div>

                    {/* Chat Send Form */}
                    <form 
                      onSubmit={(e) => {
                        e.preventDefault();
                        if (!newChatText.trim()) return;
                        setChatMessages(prev => [
                          ...prev,
                          { sender: "patient", text: newChatText, time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) }
                        ]);
                        setNewChatText("");
                      }}
                      className="p-3 border-t border-slate-800 bg-slate-900/30 flex gap-2"
                    >
                      <input 
                        type="text"
                        placeholder="ভয়েস বা টেক্সট লিখুন..."
                        value={newChatText}
                        onChange={(e) => setNewChatText(e.target.value)}
                        className="flex-1 bg-slate-900 border border-slate-800 rounded-lg px-2.5 py-2 text-xs focus:outline-hidden text-slate-100"
                      />
                      <button 
                        type="submit"
                        className="bg-indigo-600 hover:bg-indigo-500 text-white px-3.5 py-2 rounded-lg font-black text-xs cursor-pointer"
                      >
                        পাঠান
                      </button>
                    </form>
                  </div>
                </div>
              )}

              {/* Video call controls bar */}
              {callActive && (
                <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 flex flex-wrap items-center justify-between gap-4">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></span>
                    <span className="text-xs text-slate-400 font-bold">সংযোগ স্থিতি: অত্যন্ত শক্তিশালী</span>
                  </div>

                  {/* Buttons */}
                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => setMicMuted(!micMuted)}
                      className={`p-3 rounded-full border transition-all cursor-pointer ${
                        micMuted 
                          ? "bg-rose-500 text-white border-rose-600" 
                          : "bg-slate-800 hover:bg-slate-700 text-slate-300 border-slate-700"
                      }`}
                      title={micMuted ? "মাইক্রোফোন চালু করুন" : "মাইক্রোফোন বন্ধ করুন"}
                    >
                      {micMuted ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
                    </button>

                    <button
                      onClick={() => setCamOff(!camOff)}
                      className={`p-3 rounded-full border transition-all cursor-pointer ${
                        camOff 
                          ? "bg-rose-500 text-white border-rose-600" 
                          : "bg-slate-800 hover:bg-slate-700 text-slate-300 border-slate-700"
                      }`}
                      title={camOff ? "ক্যামেরা চালু করুন" : "ক্যামেরা বন্ধ করুন"}
                    >
                      {camOff ? <VideoOff className="w-5 h-5" /> : <Video className="w-5 h-5" />}
                    </button>

                    <button
                      onClick={() => setScreenShared(!screenShared)}
                      className={`px-4 py-2.5 rounded-xl border text-xs font-black transition-all cursor-pointer ${
                        screenShared 
                          ? "bg-indigo-600 text-white border-indigo-700" 
                          : "bg-slate-800 hover:bg-slate-700 text-slate-300 border-slate-700"
                      }`}
                    >
                      {screenShared ? "শেয়ারিং বন্ধ করুন" : "স্ক্রিন শেয়ার"}
                    </button>
                  </div>

                  <button
                    onClick={() => {
                      setCallActive(false);
                    }}
                    className="bg-rose-600 hover:bg-rose-500 text-white px-5 py-2.5 rounded-xl text-xs font-black transition-all flex items-center gap-1.5 cursor-pointer shadow-lg shadow-rose-950/20"
                  >
                    <PhoneOff className="w-4 h-4" />
                    <span>কল কাটুন (End Class)</span>
                  </button>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Modal: Full Screening Report View */}
        {selectedReport && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
            <div className="bg-white rounded-3xl max-w-lg w-full overflow-hidden border border-slate-200 shadow-2xl animate-in fade-in zoom-in duration-200">
              <div className="bg-slate-900 text-white p-6 flex justify-between items-center">
                <div>
                  <span className="text-[10px] font-black uppercase text-indigo-400 tracking-wider">স্পিচ ল্যাব স্ক্রিনিং রিপোর্ট</span>
                  <h3 className="text-lg font-black tracking-tight">{selectedReport.test_type}</h3>
                </div>
                <button 
                  onClick={() => setSelectedReport(null)}
                  className="bg-slate-800 hover:bg-slate-700 text-slate-300 p-1.5 rounded-lg transition-all cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="p-6 space-y-5">
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-150">
                    <p className="text-[10px] font-bold text-slate-400 uppercase">পরীক্ষার তারিখ</p>
                    <p className="text-sm font-black text-slate-800">{selectedReport.date}</p>
                  </div>
                  <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-150">
                    <p className="text-[10px] font-bold text-slate-400 uppercase">মোট প্রাপ্ত স্কোর</p>
                    <p className="text-sm font-black text-indigo-600">{selectedReport.score} / ১০০</p>
                  </div>
                </div>

                <div className="space-y-1.5">
                  <h5 className="text-xs font-black text-slate-400 uppercase tracking-wider">থেরাপিস্টের মন্তব্য ও পর্যবেক্ষণ</h5>
                  <p className="text-xs text-slate-700 leading-relaxed bg-indigo-50/50 p-4 rounded-xl border border-indigo-100">
                    "{selectedReport.therapist_notes}"
                  </p>
                </div>

                <div className="space-y-1.5">
                  <h5 className="text-xs font-black text-slate-400 uppercase tracking-wider">পরবর্তী সুপারিশ ও নির্দেশনা</h5>
                  <div className="bg-emerald-50 text-emerald-950 p-4 rounded-xl border border-emerald-100 text-xs flex items-start gap-2">
                    <CheckCircle className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                    <p className="leading-relaxed font-semibold">
                      {selectedReport.recommendation}
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-slate-50 px-6 py-4 border-t border-slate-150 flex justify-end">
                <button 
                  onClick={() => setSelectedReport(null)}
                  className="bg-slate-900 hover:bg-slate-800 text-white text-xs font-black py-2.5 px-5 rounded-xl cursor-pointer"
                >
                  বন্ধ করুন
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Modal: New Session Request */}
        {showRequestModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
            <form onSubmit={handleBookSession} className="bg-white rounded-3xl max-w-md w-full overflow-hidden border border-slate-200 shadow-2xl animate-in fade-in zoom-in duration-200">
              <div className="bg-indigo-600 text-white p-6 flex justify-between items-center">
                <div>
                  <h3 className="text-lg font-black tracking-tight">নতুন সেশন শিডিউল করুন</h3>
                  <p className="text-xs text-indigo-200">আপনার থেরাপিস্টের সাথে সুবিধাজনক সময় বুক করুন</p>
                </div>
                <button 
                  type="button"
                  onClick={() => setShowRequestModal(false)}
                  className="bg-indigo-700 hover:bg-indigo-800 text-white p-1.5 rounded-lg transition-all cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="p-6 space-y-4">
                {/* Select Therapist */}
                <div className="space-y-1">
                  <label className="text-xs font-black text-slate-500 uppercase tracking-wider">১. থেরাপিস্ট নির্বাচন করুন</label>
                  <select 
                    value={newTherapist}
                    onChange={(e) => setNewTherapist(e.target.value)}
                    className="w-full border border-slate-200 rounded-xl p-2.5 text-xs font-bold focus:outline-hidden text-slate-800 bg-white"
                  >
                    <option value="ড. শায়লা রহমান (Speech Pathologist)">ড. শায়লা রহমান (Speech Pathologist)</option>
                    <option value="মাসুদ রানা (Child Therapist)">মাসুদ রানা (Child Therapist)</option>
                  </select>
                </div>

                {/* Session Topic */}
                <div className="space-y-1">
                  <label className="text-xs font-black text-slate-500 uppercase tracking-wider">২. আলোচনার বিষয় / টপিক</label>
                  <input 
                    type="text"
                    required
                    placeholder="যেমন: শব্দ কানেকশন বা জিহ্বার জড়তা মুক্তি"
                    value={newTopic}
                    onChange={(e) => setNewTopic(e.target.value)}
                    className="w-full border border-slate-200 rounded-xl p-2.5 text-xs font-bold focus:outline-hidden text-slate-800"
                  />
                </div>

                {/* Date & Time Grid */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-xs font-black text-slate-500 uppercase tracking-wider">৩. তারিখ</label>
                    <input 
                      type="date"
                      required
                      value={newDate}
                      onChange={(e) => setNewDate(e.target.value)}
                      className="w-full border border-slate-200 rounded-xl p-2.5 text-xs font-bold focus:outline-hidden text-slate-800"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-black text-slate-500 uppercase tracking-wider">৪. সময়</label>
                    <input 
                      type="text"
                      required
                      placeholder="যেমন: বিকাল ০৫:০০ টা"
                      value={newTime}
                      onChange={(e) => setNewTime(e.target.value)}
                      className="w-full border border-slate-200 rounded-xl p-2.5 text-xs font-bold focus:outline-hidden text-slate-800"
                    />
                  </div>
                </div>
              </div>

              <div className="bg-slate-50 px-6 py-4 border-t border-slate-150 flex justify-end gap-3">
                <button 
                  type="button"
                  onClick={() => setShowRequestModal(false)}
                  className="bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-black py-2.5 px-4 rounded-xl cursor-pointer"
                >
                  বাতিল করুন
                </button>
                <button 
                  type="submit"
                  className="bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-black py-2.5 px-5 rounded-xl cursor-pointer"
                >
                  কনফার্ম করুন
                </button>
              </div>
            </form>
          </div>
        )}

      </div>
    </div>
  );
}

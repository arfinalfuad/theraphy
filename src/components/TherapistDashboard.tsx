import React, { useState, useEffect } from "react";
import { 
  Home, 
  ClipboardList, 
  FileDown, 
  Video, 
  Clock, 
  User, 
  AlertCircle, 
  Plus, 
  Activity, 
  Search, 
  CheckCircle2, 
  FileText, 
  Phone, 
  PhoneOff, 
  Mic, 
  MicOff, 
  VideoOff, 
  MessageSquare, 
  Sparkles,
  ChevronRight
} from "lucide-react";

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

interface TherapistDashboardProps {
  activeTherapist: Therapist;
  appointments: Appointment[];
  prescriptions: Prescription[];
  onAddPrescription: (prescription: Prescription) => void;
  onNavigate: (hash: string) => void;
  triggerToast: (msg: string) => void;
}

// Child patients mock list
const PATIENTS_LIST = [
  { id: "p-101", name: "আরিয়ান রহমান", age: "৬", parent: "মো. হাসিবুর রহমান", issue: "শব্দ উচ্চারণে অস্পষ্টতা (Sibilant Sounds Delay)", sessions: 4, milestone: "৮০% স্পষ্টতা অর্জন" },
  { id: "p-102", name: "নাবিলা হাসান", age: "৫", parent: "সাদিয়া আক্তার", issue: "তোলাতলামি ও বাক্য জড়তা (Sentence Flow Stuttering)", sessions: 6, milestone: "ফ্লুয়েন্সি ট্রেইনিং সমাপ্ত" },
  { id: "p-103", name: "তানজিম আহমেদ", age: "৭", parent: "ফারজানা সুলতানা", issue: "অটিজম স্পেকট্রাম কগনিটিভ ডিলে (Social Communication)", sessions: 2, milestone: "আই কন্টাক্ট ও এএসি বোর্ড প্র্যাকটিস" }
];

// Prescriptions homework presets
const EXERCISE_PRESETS = [
  {
    title: "জিহ্বার জড়তা মুক্তি ও উচ্চারণ বায়ু ব্যায়াম",
    content: "১. আয়নার সামনে দাঁড়িয়ে জিব বের করে বাম-ডান বায়ু প্রবাহ ব্যায়াম (১০ বার)।\n২. 'শ' এবং 'স' বর্ণে অতিরিক্ত বায়ু নির্গমন রোধে ছড়া আবৃত্তি সেশন (দৈনিক ১৫ মিনিট)।\n৩. বেলুন ফুলানোর মাধ্যমে গালের ফেসিয়াল মোটর স্কিল শক্তিশালী করা।"
  },
  {
    title: "তোলাতলামি দূর করার বাক্য ফ্লো ব্যায়াম",
    content: "১. গভীর ডায়াফ্রাগমেটিক শ্বাস নিয়ে ৩ সেকেন্ড ধরে রেখে ধীরে ধীরে উচ্চারণ করে বাক্য পড়া (৫ বার)।\n২. রিদমিক বাদ্যযন্ত্রের তালের সাথে শব্দ সিলেবল ভাগ করে পড়া (যেমন: বা-ংলা-দে-শ)।\n৩. প্রতিদিন ঘুমানোর আগে ৫টি ছোট সহজ বাক্য আয়নার সামনে পুনরাবৃত্তি করা।"
  },
  {
    title: "এএসি (AAC) বোর্ড অ্যাসিস্টিভ প্র্যাকটিস",
    content: "১. শিশুর দৈনিক চাহিদার সময় (খাবার, পানি, বাথরুম) ভিজ্যুয়াল এএসি বোর্ডে স্পিচ প্লে করার অভ্যাস করানো।\n২. এএসি বোর্ডের শব্দ শুনে শিশুকে তা মুখে জোরে উচ্চারণের জন্য উৎসাহিত করা (১০ বার)।\n৩. সেন্সরি কোলাহলমুক্ত শান্ত পরিবেশে মনোযোগ বাড়ানোর মন্টেসরি পাজল সলভিং।"
  }
];

export default function TherapistDashboard({
  activeTherapist,
  appointments,
  prescriptions,
  onAddPrescription,
  onNavigate,
  triggerToast
}: TherapistDashboardProps) {
  const [therapistTab, setTherapistTab] = useState<"schedule" | "patients_directory" | "prescription_builder" | "prescriptions_list">("schedule");

  // Search Filter for patient directory
  const [patientSearch, setPatientSearch] = useState("");

  // Prescription Form State
  const [rxPatientName, setRxPatientName] = useState("আরিয়ান রহমান");
  const [rxAge, setRxAge] = useState("6");
  const [rxDiagnosis, setRxDiagnosis] = useState("শব্দ উচ্চারণে অস্পষ্টতা ও আর্লি অটিজম স্পেকট্রাম ডিল");
  const [rxHomework, setRxHomework] = useState("");
  const [rxNextVisit, setRxNextVisit] = useState("2026-07-28");
  const [rxNotes, setRxNotes] = useState("পরবর্তী সেশনে মা অথবা অভিভাবকের উপস্থিতি আবশ্যক। কগনিটিভ উন্নতি দেখা যাচ্ছে।");

  // Load custom preset into form
  const applyPreset = (presetContent: string) => {
    setRxHomework(presetContent);
    triggerToast("প্রেসক্রিপশন ব্যায়াম টেমপ্লেট সফলভাবে লোড হয়েছে!");
  };

  const handleIssueRxSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!rxHomework.trim()) {
      triggerToast("দয়া করে প্র্যাকটিস ব্যায়াম বা হোমওয়ার্ক গাইডেন্স লিখুন");
      return;
    }

    const rx: Prescription = {
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

    onAddPrescription(rx);
    triggerToast(`রোগী ${rxPatientName} এর জন্য ডিজিটাল প্রেসক্রিপশন সফলভাবে ইস্যু করা হয়েছে!`);
    setTherapistTab("prescriptions_list");
  };

  // Simulated live video classroom call state (Therapist's end)
  const [callActive, setCallActive] = useState(false);
  const [micMuted, setMicMuted] = useState(false);
  const [camOff, setCamOff] = useState(false);
  const [callDuration, setCallDuration] = useState(0);
  const [activeCallPatient, setActiveCallPatient] = useState("আরিয়ান রহমান");
  const [chatMessages, setChatMessages] = useState<{ sender: "therapist" | "patient"; text: string; time: string }[]>([]);
  const [newChatText, setNewChatText] = useState("");
  const [patientSpeechSub, setPatientSpeechSub] = useState("লিসেনিং... রোগী প্র্যাকটিস করছে।");

  // Call duration counter
  useEffect(() => {
    let timer: any;
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

  // Dialogue simulation from child patient
  useEffect(() => {
    if (!callActive) return;

    const dialogue = [
      { delay: 3000, text: "শুভ সকাল আপু! আমি ভালো আছি!", talk: "শুভ সকাল আপু! আমি ভালো আছি" },
      { delay: 10000, text: "আমি বেলুন ফুলানোর ব্যায়াম কাল করেছি ৫ বার!", talk: "আমি বেলুন ফুলানোর ব্যায়াম কাল করেছি ৫ বার" },
      { delay: 18000, text: "ঠোঁট গোল করে উচ্চারণ করছি: 'পা-পা'!", talk: "ঠোঁট গোল করে উচ্চারণ করছি পা পা" },
      { delay: 25000, text: "আজ কি আমরা এএসি বোর্ডের শব্দগুলোর প্র্যাকটিস করব?", talk: "আজ কি আমরা এএসি বোর্ডের শব্দগুলোর প্র্যাকটিস করব" }
    ];

    const timeouts = dialogue.map(item => {
      return setTimeout(() => {
        setChatMessages(prev => [
          ...prev,
          { sender: "patient", text: item.text, time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) }
        ]);
        setPatientSpeechSub(item.text);
        
        // play child voice
        if ("speechSynthesis" in window) {
          const utterance = new SpeechSynthesisUtterance(item.talk);
          utterance.lang = "bn-BD";
          utterance.rate = 1.05;
          utterance.pitch = 1.35; // high child pitch
          window.speechSynthesis.speak(utterance);
        }
      }, item.delay);
    });

    return () => timeouts.forEach(clearTimeout);
  }, [callActive]);

  const handleSendChat = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newChatText.trim()) return;

    setChatMessages(prev => [
      ...prev,
      { sender: "therapist", text: newChatText, time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) }
    ]);

    // play TTS voice for therapist
    if ("speechSynthesis" in window) {
      const utterance = new SpeechSynthesisUtterance(newChatText);
      utterance.lang = "bn-BD";
      utterance.rate = 0.9;
      window.speechSynthesis.speak(utterance);
    }

    setNewChatText("");
  };

  // Start call from appointment schedule list
  const triggerSimCall = (patientName: string) => {
    setActiveCallPatient(patientName);
    setCallActive(true);
    setTherapistTab("schedule");
    triggerToast(`লাইভ ভিডিও ক্লাস সেশন চালু হচ্ছে: রোগী ${patientName}`);
  };

  // Filter patients
  const filteredPatients = PATIENTS_LIST.filter(p => 
    p.name.toLowerCase().includes(patientSearch.toLowerCase()) || 
    p.issue.toLowerCase().includes(patientSearch.toLowerCase())
  );

  return (
    <div id="therapist-dashboard-container" className="flex-1 flex flex-col bg-slate-50 min-h-screen">
      
      {/* Therapist Header */}
      <header className="bg-white border-b border-slate-200 px-6 sm:px-12 py-4 flex flex-col md:flex-row md:items-center justify-between gap-4 shrink-0 shadow-xs">
        <div className="flex items-center gap-3.5">
          <button 
            id="therapist-btn-back"
            onClick={() => onNavigate("#/")}
            className="hover:bg-slate-100 p-2 rounded-xl transition-all border border-slate-200 text-slate-600 hover:text-slate-900 cursor-pointer"
            title="হোম পেজে ফিরে যান"
          >
            <Home className="w-5 h-5" />
          </button>
          
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-100 text-indigo-700 flex items-center justify-center font-black font-sans text-lg">
              🩺
            </div>
            <div>
              <h2 className="font-black text-slate-900 text-base sm:text-lg flex items-center gap-2 font-sans leading-none">
                <span>{activeTherapist.name}</span>
                <span className="text-[10px] bg-indigo-100 text-indigo-800 font-extrabold px-2.5 py-0.5 rounded-full uppercase tracking-wider font-sans">
                  PRO PORTAL
                </span>
              </h2>
              <p className="text-xs text-slate-500 font-medium mt-0.5">{activeTherapist.designation} | {activeTherapist.specialty}</p>
            </div>
          </div>
        </div>

        {/* Menu Buttons Tab bar */}
        <div className="flex bg-slate-100 p-1.5 rounded-2xl gap-2 text-xs font-sans font-bold border border-slate-200">
          <button
            id="therapist-tab-schedule"
            onClick={() => setTherapistTab("schedule")}
            className={`px-4 py-2 rounded-xl transition-all cursor-pointer flex items-center gap-1.5 ${
              therapistTab === "schedule"
                ? "bg-white text-indigo-700 shadow-sm"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            <Clock className="w-4 h-4 text-indigo-500" />
            <span>সেশনস শিডিউল</span>
          </button>

          <button
            id="therapist-tab-directory"
            onClick={() => setTherapistTab("patients_directory")}
            className={`px-4 py-2 rounded-xl transition-all cursor-pointer flex items-center gap-1.5 ${
              therapistTab === "patients_directory"
                ? "bg-white text-indigo-700 shadow-sm"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            <User className="w-4 h-4 text-indigo-500" />
            <span>শিশু রোগী ডিরেক্টরি</span>
          </button>

          <button
            id="therapist-tab-rx"
            onClick={() => setTherapistTab("prescription_builder")}
            className={`px-4 py-2 rounded-xl transition-all cursor-pointer flex items-center gap-1.5 ${
              therapistTab === "prescription_builder"
                ? "bg-white text-indigo-700 shadow-sm"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            <ClipboardList className="w-4 h-4 text-indigo-500" />
            <span>প্রেসক্রিপশন রাইটার</span>
          </button>

          <button
            id="therapist-tab-rx-list"
            onClick={() => setTherapistTab("prescriptions_list")}
            className={`px-4 py-2 rounded-xl transition-all cursor-pointer flex items-center gap-1.5 ${
              therapistTab === "prescriptions_list"
                ? "bg-white text-indigo-700 shadow-sm"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            <FileText className="w-4 h-4 text-indigo-500" />
            <span>ইস্যুকৃত রেকর্ড</span>
          </button>
        </div>
      </header>

      {/* Main Container */}
      <main className="flex-1 p-6 sm:p-10 max-w-7xl mx-auto w-full">
        
        {/* VIDEO CALL PANEL OVERLAY IF ACTIVE */}
        {callActive && (
          <div className="bg-slate-900 text-white border border-slate-800 rounded-3xl p-4 sm:p-6 shadow-xl space-y-5 mb-8 animate-fadeIn">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
              <div className="space-y-1">
                <div className="inline-flex items-center gap-1.5 bg-rose-500/20 text-rose-300 px-3 py-1 rounded-full text-xs font-bold border border-rose-500/30">
                  <span className="w-2 h-2 bg-rose-500 rounded-full animate-ping"></span>
                  <span>লাইভ থেরাপি প্র্যাকটিস ক্লাস (Live Class session)</span>
                </div>
                <h2 className="text-base sm:text-lg font-black text-white">রোগী: {activeCallPatient} (অফিসিয়াল সেশন)</h2>
              </div>

              <div className="flex items-center gap-3 bg-slate-800 px-4 py-2 rounded-xl border border-slate-700">
                <Clock className="w-4 h-4 text-slate-400" />
                <span className="text-xs font-mono font-bold">
                  কল সময়: {Math.floor(callDuration / 60).toString().padStart(2, '0')}:{(callDuration % 60).toString().padStart(2, '0')}
                </span>
              </div>
            </div>

            {/* Simulated Streams */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              
              {/* Patient Feed Box (8 spans) */}
              <div className="lg:col-span-8 bg-slate-950 rounded-2xl border border-slate-800 overflow-hidden relative min-h-[360px] sm:min-h-[400px] flex items-center justify-center bg-radial-gradient">
                
                {/* Simulated webcam of kid */}
                {!camOff ? (
                  <div className="absolute inset-0 flex flex-col justify-between p-4 z-10">
                    <span className="bg-slate-900/80 px-3 py-1.5 rounded-lg border border-slate-800 text-xs font-bold self-start">
                      👶 {activeCallPatient} (Patient Cam Feed)
                    </span>

                    {/* Speech subtitle of Kid speaking */}
                    <div className="bg-indigo-600 text-white p-4 rounded-2xl shadow-xl max-w-sm self-end border border-indigo-500 animate-pulse">
                      <span className="text-[9px] font-black tracking-widest text-indigo-200 uppercase block">রোগীর লাইভ উচ্চারণ (Speech to Text)</span>
                      <h4 className="text-sm font-black mt-1">"{patientSpeechSub}"</h4>
                    </div>
                  </div>
                ) : null}

                {!camOff ? (
                  <div className="text-center space-y-4">
                    <div className="w-20 h-20 bg-indigo-500/10 rounded-full flex items-center justify-center animate-ping absolute" style={{ animationDuration: "3s" }}></div>
                    <span className="text-7xl block animate-bounce">👶</span>
                    <h4 className="text-base font-extrabold text-slate-200">{activeCallPatient} প্র্যাকটিস ল্যাবে রয়েছে</h4>
                    <p className="text-xs text-slate-400 font-semibold flex items-center justify-center gap-1.5"><Mic className="w-3.5 h-3.5 text-emerald-500" /> মাইক্রোফোন ও অডিও লেভেল সচল</p>
                  </div>
                ) : (
                  <div className="text-center text-slate-500 text-xs font-bold">
                    <VideoOff className="w-10 h-10 mx-auto text-slate-600 mb-2" />
                    <span>রোগী ক্যামেরা অফ রেখেছে</span>
                  </div>
                )}

                {/* Therapist picture-in-picture small preview */}
                <div className="absolute bottom-4 left-4 w-32 h-24 bg-slate-900 rounded-xl border border-slate-700 overflow-hidden shadow-md flex items-center justify-center text-center">
                  <div className="text-slate-400 text-[10px] space-y-1">
                    <span className="text-xl">👩‍⚕️</span>
                    <p className="font-bold">আমার প্রিভিউ (Therapist)</p>
                  </div>
                </div>

              </div>

              {/* Chat Overlay (4 spans) */}
              <div className="lg:col-span-4 bg-slate-950 rounded-2xl border border-slate-800 flex flex-col justify-between h-[360px] sm:h-[400px]">
                <div className="p-3.5 border-b border-slate-800 bg-slate-900/50 flex justify-between items-center text-xs">
                  <span className="font-extrabold text-slate-300 flex items-center gap-1.5">
                    <MessageSquare className="w-4 h-4 text-indigo-400" />
                    <span>ইন্টারেক্টিভ চ্যাট রুম</span>
                  </span>
                  <span className="w-2 h-2 rounded-full bg-rose-500 animate-pulse"></span>
                </div>

                {/* Chat items */}
                <div className="flex-1 p-4 space-y-3 overflow-y-auto scroll-smooth text-xs">
                  {chatMessages.length === 0 ? (
                    <div className="h-full flex flex-col items-center justify-center text-center text-slate-600 space-y-1.5">
                      <MessageSquare className="w-6 h-6 opacity-30" />
                      <p className="text-[10px] font-bold">এখানে ক্লাসরুমের লাইভ কথন সংরক্ষিত হবে।</p>
                    </div>
                  ) : (
                    chatMessages.map((msg, idx) => (
                      <div key={idx} className={`flex flex-col ${msg.sender === "therapist" ? "items-end" : "items-start"}`}>
                        <span className="text-[9px] text-slate-500 font-bold mb-0.5">
                          {msg.sender === "therapist" ? "👩‍⚕️ আমি" : `👶 ${activeCallPatient}`} | {msg.time}
                        </span>
                        <div className={`p-2.5 rounded-xl max-w-[85%] leading-relaxed font-semibold ${
                          msg.sender === "therapist"
                            ? "bg-indigo-600 text-white rounded-tr-none"
                            : "bg-slate-800 text-slate-200 rounded-tl-none"
                        }`}>
                          {msg.text}
                        </div>
                      </div>
                    ))
                  )}
                </div>

                {/* Chat Send */}
                <form onSubmit={handleSendChat} className="p-3 border-t border-slate-800 bg-slate-900/50 flex gap-2">
                  <input 
                    type="text" 
                    placeholder="বাংলায় নির্দেশ লিখুন..."
                    value={newChatText}
                    onChange={(e) => setNewChatText(e.target.value)}
                    className="flex-1 bg-slate-900 border border-slate-800 rounded-lg px-2.5 py-2 text-xs text-white focus:outline-none"
                  />
                  <button 
                    type="submit" 
                    className="bg-indigo-600 hover:bg-indigo-500 text-white font-extrabold text-xs px-4 rounded-lg cursor-pointer transition-all"
                  >
                    পাঠান
                  </button>
                </form>
              </div>

            </div>

            {/* Video Action controls */}
            <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 flex flex-wrap items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <button 
                  onClick={() => setMicMuted(!micMuted)}
                  className={`p-3 rounded-full border transition-all cursor-pointer ${
                    micMuted ? "bg-rose-600 text-white border-rose-700" : "bg-slate-800 hover:bg-slate-700 text-slate-300 border-slate-700"
                  }`}
                  title="মাইক সুইচ"
                >
                  {micMuted ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
                </button>

                <button 
                  onClick={() => setCamOff(!camOff)}
                  className={`p-3 rounded-full border transition-all cursor-pointer ${
                    camOff ? "bg-rose-600 text-white border-rose-700" : "bg-slate-800 hover:bg-slate-700 text-slate-300 border-slate-700"
                  }`}
                  title="ক্যামেরা সুইচ"
                >
                  {camOff ? <VideoOff className="w-5 h-5" /> : <Video className="w-5 h-5" />}
                </button>
              </div>

              <button 
                onClick={() => setCallActive(false)}
                className="bg-rose-600 hover:bg-rose-500 text-white font-extrabold text-xs px-5 py-3 rounded-xl flex items-center gap-1.5 transition-all cursor-pointer shadow-md"
              >
                <PhoneOff className="w-4 h-4" />
                <span>ভিডিও সেশন শেষ করুন (End Class)</span>
              </button>
            </div>
          </div>
        )}

        {/* TAB 1: SCHEDULED APPOINTMENTS */}
        {therapistTab === "schedule" && (
          <div className="space-y-6 animate-fadeIn">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-extrabold text-slate-900 text-base sm:text-lg">আসন্ন থেরাপি সেশন ও অ্যাপয়েন্টমেন্ট শিডিউল</h3>
                <p className="text-xs text-slate-500 mt-1">আজকের এবং চলতি সপ্তাহের সকল শিশু রোগীদের সাথে নির্ধারিত সেশনের তালিকা।</p>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-4">
              {appointments.length === 0 ? (
                <div className="p-8 text-center bg-white border border-slate-200 rounded-2xl text-slate-400 font-bold text-xs">
                  আপনার কোনো বুকিং সেশন নেই।
                </div>
              ) : (
                appointments.map((booking) => {
                  const patientName = booking.user_id === "a0000000-0000-0000-0000-000000000001" ? "আরিয়ান রহমান" : "নাবিলা হাসান";
                  const patientAge = booking.user_id === "a0000000-0000-0000-0000-000000000001" ? "৬ বছর" : "৫ বছর";
                  return (
                    <div 
                      key={booking.id}
                      className="bg-white border border-slate-200 hover:border-slate-300 rounded-2xl p-5 shadow-2xs flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 transition-all"
                    >
                      <div className="space-y-2">
                        <div className="flex items-center gap-2">
                          <span className="bg-indigo-50 text-indigo-700 text-[10px] font-black px-2.5 py-0.5 rounded uppercase">
                            {booking.topic || "স্পিচ অ্যান্ড ল্যাঙ্গুয়েজ ল্যাব"}
                          </span>
                          <span className={`text-[10px] font-extrabold px-2 py-0.5 rounded-full ${
                            booking.payment_status === "Paid" 
                              ? "bg-emerald-50 text-emerald-700 border border-emerald-100" 
                              : "bg-amber-50 text-amber-700 border border-amber-100"
                          }`}>
                            {booking.payment_status === "Paid" ? "পরিশোধিত" : "পেন্ডিং ফি"}
                          </span>
                        </div>

                        <div className="space-y-1">
                          <h4 className="text-xs sm:text-sm font-black text-slate-900 flex items-center gap-1.5">
                            <User className="w-3.5 h-3.5 text-slate-400" />
                            <span>রোগী: {patientName} (বয়স: {patientAge})</span>
                          </h4>
                          <p className="text-xs text-slate-500 font-semibold">
                            নির্ধারিত তারিখ: <span className="font-extrabold text-slate-800">{booking.date}</span> | সময়: <span className="font-extrabold text-indigo-600">{booking.time}</span>
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 w-full sm:w-auto">
                        <button
                          onClick={() => triggerSimCall(patientName)}
                          className="bg-slate-900 hover:bg-indigo-700 text-white font-extrabold text-xs py-2 px-4 rounded-xl shadow-2xs transition-all flex items-center justify-center gap-1.5 flex-1 sm:flex-none cursor-pointer"
                        >
                          <Video className="w-3.5 h-3.5" />
                          <span>ভিডিও ক্লাস চালু</span>
                        </button>

                        <button
                          onClick={() => {
                            setRxPatientName(patientName);
                            setRxAge(patientAge.replace(" বছর", ""));
                            setTherapistTab("prescription_builder");
                          }}
                          className="bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 font-extrabold text-xs py-2 px-4 rounded-xl shadow-2xs transition-all flex items-center justify-center gap-1.5 flex-1 sm:flex-none cursor-pointer"
                        >
                          <ClipboardList className="w-3.5 h-3.5 text-indigo-500" />
                          <span>প্রেসক্রিপশন</span>
                        </button>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        )}

        {/* TAB 2: CHILDREN PATIENT DIRECTORY */}
        {therapistTab === "patients_directory" && (
          <div className="space-y-6 animate-fadeIn">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h3 className="font-extrabold text-slate-900 text-base sm:text-lg">নিবন্ধিত শিশু রোগী তালিকা (Therapy Directory)</h3>
                <p className="text-xs text-slate-500 mt-1">রোগীদের সমস্যা, বয়স, সেশন হিস্ট্রি এবং মাইলস্টোন প্রোগ্রেস মনিটর করুন।</p>
              </div>

              {/* Search input */}
              <div className="relative w-full sm:w-64">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                <input 
                  type="text" 
                  placeholder="রোগীর নাম বা সমস্যা দিয়ে খুঁজুন..."
                  value={patientSearch}
                  onChange={(e) => setPatientSearch(e.target.value)}
                  className="w-full bg-white border border-slate-200 rounded-xl pl-9 pr-4 py-2.5 text-xs font-bold text-slate-800 focus:outline-none"
                />
              </div>
            </div>

            {/* Patients Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {filteredPatients.map((patient) => (
                <div key={patient.id} className="bg-white border border-slate-200 rounded-2xl p-5 shadow-2xs flex flex-col justify-between space-y-4">
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] bg-indigo-50 text-indigo-700 px-2 py-0.5 rounded font-black uppercase">আইডি: {patient.id}</span>
                      <span className="text-xs font-black text-slate-400">{patient.age} বছর</span>
                    </div>

                    <div className="space-y-1">
                      <h4 className="text-sm font-black text-slate-900">{patient.name}</h4>
                      <p className="text-[11px] text-slate-400 font-bold">অভিভাবক: {patient.parent}</p>
                    </div>

                    <div className="bg-slate-50 p-3 rounded-xl border border-slate-150 text-[11px] font-semibold text-slate-600 leading-relaxed">
                      🧠 <strong className="text-slate-800">লক্ষণ:</strong> {patient.issue}
                    </div>
                  </div>

                  <div className="space-y-2 pt-2 border-t border-slate-100">
                    <div className="flex justify-between items-center text-xs font-bold">
                      <span className="text-slate-400">মাইলস্টোন প্রোগ্রেস:</span>
                      <span className="text-indigo-600">{patient.milestone}</span>
                    </div>

                    <div className="flex gap-2 text-xs font-sans">
                      <button
                        onClick={() => triggerSimCall(patient.name)}
                        className="bg-slate-900 hover:bg-slate-800 text-white font-extrabold text-[10px] py-2 px-3 rounded-xl flex-1 flex items-center justify-center gap-1 cursor-pointer"
                      >
                        <Video className="w-3 h-3" />
                        সেশন শুরু
                      </button>

                      <button
                        onClick={() => {
                          setRxPatientName(patient.name);
                          setRxAge(patient.age);
                          setRxDiagnosis(patient.issue);
                          setTherapistTab("prescription_builder");
                        }}
                        className="bg-indigo-50 hover:bg-indigo-100 text-indigo-700 font-black text-[10px] py-2 px-3 rounded-xl border border-indigo-150 flex-1 flex items-center justify-center gap-1 cursor-pointer"
                      >
                        <ClipboardList className="w-3 h-3" />
                        প্রেসক্রিপশন
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 3: DIGITAL PRESCRIPTION WRITER */}
        {therapistTab === "prescription_builder" && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 animate-fadeIn">
            
            {/* Prescriptions Templates Sidebar (5 spans) */}
            <div className="lg:col-span-5 bg-white border border-slate-200 rounded-3xl p-6 shadow-sm space-y-6">
              <div>
                <h3 className="font-extrabold text-slate-900 text-base sm:text-lg flex items-center gap-1.5">
                  <Sparkles className="w-5 h-5 text-yellow-500 animate-spin" style={{ animationDuration: '4s' }} />
                  <span>স্মার্ট থেরাপি প্রিসেট টেমপ্লেট</span>
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">সহজেই শিশুদের উপযোগী উচ্চারণ বা তোলাতলামি ব্যায়াম লোড করুন।</p>
              </div>

              <div className="space-y-4">
                {EXERCISE_PRESETS.map((preset, index) => (
                  <div 
                    key={index}
                    className="p-4 border border-slate-150 hover:border-indigo-300 rounded-2xl hover:bg-indigo-50/20 cursor-pointer transition-all space-y-2 group"
                    onClick={() => applyPreset(preset.content)}
                  >
                    <div className="flex justify-between items-center">
                      <h4 className="text-xs sm:text-sm font-black text-slate-800 group-hover:text-indigo-900">{preset.title}</h4>
                      <ChevronRight className="w-4 h-4 text-slate-450 group-hover:text-indigo-600 group-hover:translate-x-0.5 transition-all" />
                    </div>
                    <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed font-semibold">{preset.content}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Prescriptions Creator Editor (7 spans) */}
            <div className="lg:col-span-7 bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 shadow-sm space-y-6">
              <div>
                <h3 className="font-extrabold text-slate-900 text-base sm:text-lg">ডিজিটাল প্রেসক্রিপশন পোর্টাল (Certified Rx Issue)</h3>
                <p className="text-xs text-slate-500 mt-1">রোগীর স্পিচ থেরাপির অগ্রগতি এবং বাড়ির জন্য প্রয়োজনীয় ছড়া, ব্যায়াম বা কগনিটিভ নির্দেশনাবলি জেনারেট করুন।</p>
              </div>

              <form onSubmit={handleIssueRxSubmit} className="space-y-4 text-xs font-semibold">
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest block">১. রোগীর নাম (Select Patient)</span>
                    <select
                      value={rxPatientName}
                      onChange={(e) => {
                        setRxPatientName(e.target.value);
                        const match = PATIENTS_LIST.find(p => p.name === e.target.value);
                        if (match) {
                          setRxAge(match.age);
                          setRxDiagnosis(match.issue);
                        }
                      }}
                      className="w-full bg-white border border-slate-200 rounded-xl p-2.5 text-xs font-bold text-slate-800"
                    >
                      {PATIENTS_LIST.map(p => <option key={p.id} value={p.name}>{p.name}</option>)}
                    </select>
                  </div>

                  <div className="space-y-1">
                    <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest block">২. রোগীর বয়স (Age in Years)</span>
                    <input 
                      type="number"
                      value={rxAge}
                      onChange={(e) => setRxAge(e.target.value)}
                      className="w-full border border-slate-200 rounded-xl p-2.5 text-xs font-bold text-slate-850"
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest block">৩. লক্ষণ বা স্পিচ প্যাথলজি সমস্যা (Diagnosis)</span>
                  <input 
                    type="text"
                    value={rxDiagnosis}
                    onChange={(e) => setRxDiagnosis(e.target.value)}
                    className="w-full border border-slate-200 rounded-xl p-2.5 text-xs font-bold text-slate-800 focus:outline-none"
                  />
                </div>

                <div className="space-y-1">
                  <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest block">৪. থেরাপি হোমওয়ার্ক ও ব্যায়াম নির্দেশনাবলি (Practice Instructions)</span>
                  <textarea 
                    value={rxHomework}
                    onChange={(e) => setRxHomework(e.target.value)}
                    placeholder="১. আয়নার সামনে শব্দ উচ্চারণ... ইত্যাদি"
                    className="w-full border border-slate-200 rounded-xl p-3 text-xs font-semibold text-slate-700 h-28 focus:outline-none focus:border-indigo-500 leading-relaxed"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest block">৫. পরবর্তী ভিজিট বা সেশন</span>
                    <input 
                      type="date"
                      value={rxNextVisit}
                      onChange={(e) => setRxNextVisit(e.target.value)}
                      className="w-full border border-slate-200 rounded-xl p-2.5 text-xs font-bold text-slate-800 bg-white"
                    />
                  </div>

                  <div className="space-y-1">
                    <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest block">৬. বিশেষ পরামর্শ বা নোটস</span>
                    <input 
                      type="text"
                      value={rxNotes}
                      onChange={(e) => setRxNotes(e.target.value)}
                      className="w-full border border-slate-200 rounded-xl p-2.5 text-xs font-bold text-slate-800"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full bg-slate-900 hover:bg-indigo-700 text-white font-extrabold text-xs sm:text-sm py-3.5 rounded-2xl flex items-center justify-center gap-1.5 cursor-pointer shadow-sm transition-all"
                >
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  <span>প্রেসক্রিপশন ইস্যু করুন (Issue Certified Rx Document)</span>
                </button>
              </form>
            </div>

          </div>
        )}

        {/* TAB 4: ISSUED PRESCRIPTIONS LIST */}
        {therapistTab === "prescriptions_list" && (
          <div className="max-w-4xl mx-auto space-y-6 animate-fadeIn">
            {prescriptions.length === 0 ? (
              <div className="bg-white border border-slate-200 rounded-2xl p-8 text-center text-slate-400 space-y-2">
                <ClipboardList className="w-10 h-10 text-slate-300 mx-auto" />
                <p className="text-xs font-bold">এখনো কোনো ডিজিটাল প্রেসক্রিপশন তৈরি করা হয়নি।</p>
                <button
                  onClick={() => setTherapistTab("prescription_builder")}
                  className="text-xs text-indigo-600 underline font-bold mt-2 cursor-pointer"
                >
                  নতুন প্রেসক্রিপশন লিখুন
                </button>
              </div>
            ) : (
              <div className="space-y-6">
                <h3 className="font-extrabold text-slate-900 text-sm sm:text-base">ইস্যুকৃত ডিজিটাল প্রেসক্রিপশন রেকর্ডস</h3>
                
                {prescriptions.map((rx) => (
                  <div key={rx.id} className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 shadow-sm relative overflow-hidden">
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

                    <div className="py-5 space-y-4 text-xs font-semibold">
                      <div className="space-y-1">
                        <span className="text-indigo-600 font-black text-sm block font-mono">Rx / ডায়াগনোসিস</span>
                        <p className="text-xs text-slate-800 font-extrabold leading-relaxed bg-indigo-50/50 px-3 py-2 rounded-xl border border-indigo-100/60">
                          {rx.diagnosis}
                        </p>
                      </div>

                      <div className="space-y-1">
                        <span className="text-slate-500 font-black text-[10px] block uppercase tracking-widest">Therapy Instructions & Home Practice Exercises</span>
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

                    <div className="border-t border-slate-150 pt-4 flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></div>
                        <span className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider">Certified Digital Rx</span>
                      </div>
                      <button
                        onClick={() => triggerToast("ডকুমেন্ট প্রিন্ট রিকোয়েস্ট সফল!")}
                        className="bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs px-4 py-2 rounded-xl transition-all flex items-center gap-1.5 cursor-pointer"
                      >
                        <FileDown className="w-3.5 h-3.5" />
                        <span>প্রিন্ট/ডাউনলোড</span>
                      </button>
                    </div>

                  </div>
                ))}
              </div>
            )}
          </div>
        )}

      </main>

    </div>
  );
}

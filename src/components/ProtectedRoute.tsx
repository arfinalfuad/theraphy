import React, { useEffect, useState } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { supabase } from "../supabaseClient";

interface ProtectedRouteProps {
  children: React.ReactNode;
  allowedRoles?: string[]; // যেমন: ['admin', 'therapist']
}

/**
 * রাউট প্রোটেকশন কম্পোনেন্ট (Route Guard)
 * অননুমোদিত ব্যবহারকারীদের সরাসরি পেজ এক্সেস করা থেকে বিরত রাখে এবং রিডাইরেক্ট করে।
 */
export default function ProtectedRoute({ children, allowedRoles }: ProtectedRouteProps) {
  const [loading, setLoading] = useState(true);
  const [userRole, setUserRole] = useState<string | null>(null);
  const [authenticated, setAuthenticated] = useState(false);
  const location = useLocation();

  useEffect(() => {
    async function checkUserSession() {
      try {
        // ১. সুপাবেস থেকে অ্যাক্টিভ সেশন চেক করা
        const { data: { session } } = await supabase.auth.getSession();
        if (!session) {
          setAuthenticated(false);
          setLoading(false);
          return;
        }

        setAuthenticated(true);

        // ২. সেশন থাকলে ডাটাবেস (users টেবিল) থেকে ইউজারের রোল নিয়ে আসা
        const { data: profile, error } = await supabase
          .from("users")
          .select("user_type")
          .eq("id", session.user.id)
          .single();

        if (error) {
          console.error("ইউজার প্রোফাইল ডাটা লোড করতে সমস্যা হয়েছে:", error.message);
        }

        if (profile) {
          setUserRole(profile.user_type); // 'patient', 'therapist', 'admin'
        }
      } catch (err) {
        console.error("সেশন ভেরিফিকেশন ব্যর্থ হয়েছে:", err);
      } finally {
        setLoading(false);
      }
    }

    checkUserSession();
  }, []);

  // যখন লোড হচ্ছে তখন একটি সুন্দর স্পিনার দেখানো হবে
  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-slate-50 p-6">
        <div className="w-10 h-10 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
        <p className="mt-4 text-xs font-bold text-slate-500 animate-pulse font-sans">
          নিরাপত্তা যাচাই করা হচ্ছে, দয়া করে অপেক্ষা করুন...
        </p>
      </div>
    );
  }

  // ৩. যদি ব্যবহারকারী লগইন করা না থাকে, তবে লগইন পেজে রিডাইরেক্ট করা হবে
  if (!authenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // ৪. যদি লগইন করা থাকে কিন্তু ওই পেজের জন্য রোল এলাউড না হয়, তবে সঠিক পেজে পাঠানো হবে
  if (allowedRoles && userRole && !allowedRoles.includes(userRole)) {
    // রোল অনুযায়ী ফলব্যাক বা হোম পেজে পাঠিয়ে দেওয়া হবে
    const fallbackPath =
      userRole === "therapist"
        ? "/dashboard/therapist"
        : userRole === "admin"
        ? "/admin-portal"
        : "/dashboard/patient";

    return <Navigate to={fallbackPath} replace />;
  }

  // ৫. সব ভেরিফিকেশন সফল হলে আসল পেজটি দেখতে পারবে
  return <>{children}</>;
}

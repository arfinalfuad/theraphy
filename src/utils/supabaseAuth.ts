import { supabase } from "../supabaseClient";

/**
 * লগইন সফল হওয়ার পর ইউজারকে তার রোল অনুযায়ী সঠিক ড্যাশবোর্ডে রিডাইরেক্ট করার ফাংশন
 * @param user - Supabase থেকে প্রাপ্ত ইউজার অবজেক্ট (session.user)
 * @param navigate - React Router থেকে প্রাপ্ত navigate ফাংশন
 */
export async function handleUserRedirect(user: any, navigate: (path: string) => void) {
  if (!user) {
    navigate("/login");
    return;
  }

  try {
    // ১. সুপাবেস 'users' টেবিল থেকে user_type (যা ইউজারের রোল বা টাইপ) নিয়ে আসা
    const { data: profile, error } = await supabase
      .from("users")
      .select("user_type")
      .eq("id", user.id)
      .single();

    if (error || !profile) {
      console.error("প্রোফাইল তথ্য অথবা রোল খুঁজে পাওয়া যায়নি:", error);
      // কোনো সমস্যা হলে নিরাপদ ফলব্যাক হিসেবে পেশেন্ট ড্যাশবোর্ডে পাঠানো হবে
      navigate("/dashboard/patient"); 
      return;
    }

    const role = profile.user_type; // 'patient' | 'therapist' | 'admin'

    // ২. রোল অনুযায়ী সঠিক পেজে রিডাইরেক্ট করা
    switch (role) {
      case "patient":
        navigate("/dashboard/patient");
        break;
      case "therapist":
        navigate("/dashboard/therapist");
        break;
      case "admin":
        navigate("/admin-portal");
        break;
      default:
        navigate("/");
    }
  } catch (err) {
    console.error("রিডাইরেকশন করার সময় একটি সমস্যা হয়েছে:", err);
    navigate("/");
  }
}

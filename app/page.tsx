"use client";

import { supabase } from "@/lib/supabaseClient";

export default function Home() {

  const handleLogin = async () => {
  await supabase.auth.signInWithOAuth({
  provider: "google",
  options: {
    redirectTo: `${window.location.origin}/dashboard`,
  },
});
  }


  return (
    <div className="flex items-center justify-center h-screen">
      <button
        onClick={handleLogin}
        className="px-6 py-3 bg-blue-600 text-white rounded-lg"
      >
        Sign in with Google
      </button>
    </div>
  );
}

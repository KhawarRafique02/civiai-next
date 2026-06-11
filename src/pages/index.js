import { useEffect } from "react";
import { useRouter } from "next/router";
import { supabase } from "../lib/supabase";

export default function Home() {
  const router = useRouter();

  useEffect(() => {
    const checkSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        const { data: userData } = await supabase
          .from("users")
          .select("role")
          .eq("uid", session.user.id)
          .single();

        if (userData?.role === "admin") {
          router.push("/admin/dashboard");
        } else {
          router.push("/citizen/dashboard");
        }
      } else {
        router.push("/auth/login");
      }
    };
    checkSession();
  }, []);

  return (
    <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", backgroundColor: "#f0fdf4" }}>
      <div style={{ textAlign: "center" }}>
        <h1 style={{ color: "#16a34a", fontSize: "32px" }}>🏙️ CiviAI</h1>
        <p style={{ color: "#6b7280" }}>Loading...</p>
      </div>
    </div>
  );
}
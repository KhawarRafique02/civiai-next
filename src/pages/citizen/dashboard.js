import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { supabase } from "../../lib/supabase";
import toast, { Toaster } from "react-hot-toast";

const statusColor = {
  submitted:    { bg: "#f3f4f6", text: "#374151" },
  under_review: { bg: "#fefce8", text: "#ca8a04" },
  in_progress:  { bg: "#eff6ff", text: "#1d4ed8" },
  resolved:     { bg: "#f0fdf4", text: "#16a34a" },
};

export default function CitizenDashboard() {
  const router = useRouter();
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);

  useEffect(() => {
    checkUser();
  }, []);

  const checkUser = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) { router.push("/auth/login"); return; }
    setUser(session.user);
    fetchComplaints(session.user.id);
  };

  const fetchComplaints = async (userId) => {
    try {
      const { data, error } = await supabase
        .from("complaints")
        .select("*")
        .eq("user_id", userId)
        .order("created_at", { ascending: false });
      if (error) throw error;
      setComplaints(data || []);
    } catch (error) {
      toast.error("Error loading complaints");
    }
    setLoading(false);
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    toast.success("Logged out!");
    router.push("/auth/login");
  };

  const total    = complaints.length;
  const resolved = complaints.filter(c => c.status_id === "resolved").length;
  const pending  = complaints.filter(c => c.status_id !== "resolved").length;

  return (
    <div style={{ minHeight: "100vh", backgroundColor: "#f0fdf4", padding: "1rem", boxSizing: "border-box" }}>
      <Toaster position="top-right" />

      {/* Navbar */}
      <div style={{ background: "white", padding: "0.75rem 1rem", borderRadius: "12px", display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1rem", boxShadow: "0 2px 10px rgba(0,0,0,0.08)" }}>
        <h1 style={{ color: "#16a34a", margin: 0, fontSize: "20px" }}>🏙️ CiviAI</h1>
        <div style={{ display: "flex", gap: "8px" }}>
          <button onClick={() => router.push("/citizen/map")}
            style={{ backgroundColor: "#eff6ff", color: "#1d4ed8", border: "1px solid #bfdbfe", padding: "8px 12px", borderRadius: "8px", cursor: "pointer", fontWeight: "600", fontSize: "13px" }}>
            🗺️ Map
          </button>
          <button onClick={handleLogout}
            style={{ backgroundColor: "#fee2e2", color: "#dc2626", border: "none", padding: "8px 12px", borderRadius: "8px", cursor: "pointer", fontWeight: "600", fontSize: "13px" }}>
            Logout
          </button>
        </div>
      </div>

      {/* Welcome */}
      <div style={{ background: "white", padding: "1rem", borderRadius: "16px", marginBottom: "1rem", boxShadow: "0 2px 10px rgba(0,0,0,0.08)" }}>
        <h2 style={{ margin: 0, color: "#111827", fontSize: "18px" }}>Welcome! 👋</h2>
        <p style={{ color: "#6b7280", marginTop: "4px", marginBottom: 0, fontSize: "14px" }}>Track your reported civic issues</p>
      </div>

      {/* Stats */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "8px", marginBottom: "1rem" }}>
        {[
          { label: "Total",    value: total,    bg: "#eff6ff", text: "#1d4ed8" },
          { label: "Resolved", value: resolved, bg: "#f0fdf4", text: "#16a34a" },
          { label: "Pending",  value: pending,  bg: "#fefce8", text: "#ca8a04" },
        ].map(stat => (
          <div key={stat.label} style={{ background: stat.bg, padding: "1rem 0.5rem", borderRadius: "12px", textAlign: "center" }}>
            <div style={{ fontSize: "28px", fontWeight: "700", color: stat.text }}>{stat.value}</div>
            <div style={{ color: stat.text, marginTop: "2px", fontSize: "12px" }}>{stat.label}</div>
          </div>
        ))}
      </div>

      {/* Buttons */}
      <div style={{ display: "flex", gap: "8px", marginBottom: "1rem", flexWrap: "wrap" }}>
        <button onClick={() => router.push("/citizen/submit-complaint")}
          style={{ flex: 1, backgroundColor: "#16a34a", color: "white", border: "none", padding: "14px", borderRadius: "12px", fontSize: "15px", fontWeight: "600", cursor: "pointer", minWidth: "150px" }}>
          + Report New Issue
        </button>
        <button onClick={() => router.push("/citizen/map")}
          style={{ flex: 1, backgroundColor: "#eff6ff", color: "#1d4ed8", border: "1px solid #bfdbfe", padding: "14px", borderRadius: "12px", fontSize: "15px", fontWeight: "600", cursor: "pointer", minWidth: "150px" }}>
          🗺️ View Map
        </button>
      </div>

      {/* Complaints List */}
      <div style={{ background: "white", padding: "1rem", borderRadius: "16px", boxShadow: "0 2px 10px rgba(0,0,0,0.08)" }}>
        <h3 style={{ margin: "0 0 1rem", color: "#111827", fontSize: "16px" }}>My Complaints</h3>
        {loading ? (
          <p style={{ textAlign: "center", color: "#9ca3af" }}>Loading...</p>
        ) : complaints.length === 0 ? (
          <p style={{ textAlign: "center", color: "#9ca3af", padding: "1rem" }}>No complaints yet!</p>
        ) : (
          complaints.map(c => (
            <div key={c.complaint_id} style={{ border: "1px solid #e5e7eb", borderRadius: "12px", padding: "0.75rem", marginBottom: "0.75rem" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: "8px" }}>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <h4 style={{ margin: "0 0 4px", color: "#111827", fontSize: "14px", fontWeight: "600" }}>{c.title}</h4>
                  <p style={{ margin: "0 0 4px", color: "#6b7280", fontSize: "13px", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{c.description}</p>
                  <p style={{ margin: 0, color: "#9ca3af", fontSize: "12px" }}>📍 {c.location || "No location"}</p>
                </div>
                <span style={{ backgroundColor: statusColor[c.status_id]?.bg || "#f3f4f6", color: statusColor[c.status_id]?.text || "#374151", padding: "4px 8px", borderRadius: "99px", fontSize: "11px", fontWeight: "600", whiteSpace: "nowrap", flexShrink: 0 }}>
                  {c.status_id?.replace("_", " ")}
                </span>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
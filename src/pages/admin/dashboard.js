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

export default function AdminDashboard() {
  const router = useRouter();
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);
  const [checking, setChecking] = useState(true);
  const [filter, setFilter] = useState("all");

  useEffect(() => {
    checkAdmin();
  }, []);

  const checkAdmin = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) { router.push("/auth/login"); return; }

    const { data: userData } = await supabase
      .from("users")
      .select("role")
      .eq("uid", session.user.id)
      .single();

    if (!userData || userData.role !== "admin") {
      toast.error("Access denied!");
      router.push("/auth/login");
      return;
    }
    setChecking(false);
    fetchComplaints();
  };

  const fetchComplaints = async () => {
    try {
      const { data, error } = await supabase
        .from("complaints")
        .select("*")
        .order("created_at", { ascending: false });
      if (error) throw error;
      setComplaints(data || []);
    } catch (error) {
      toast.error("Error loading complaints");
    }
    setLoading(false);
  };

  const updateStatus = async (id, newStatus) => {
    try {
      await supabase
        .from("complaints")
        .update({ status_id: newStatus, updated_at: new Date().toISOString() })
        .eq("complaint_id", id);
      toast.success("Status updated!");
      fetchComplaints();
    } catch (error) {
      toast.error("Failed to update!");
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    toast.success("Logged out!");
    router.push("/auth/login");
  };

  if (checking) return (
    <div style={{ textAlign: "center", marginTop: "4rem", color: "#6b7280" }}>Checking access...</div>
  );

  const filtered = filter === "all" ? complaints : complaints.filter(c => c.status_id === filter);
  const total      = complaints.length;
  const resolved   = complaints.filter(c => c.status_id === "resolved").length;
  const inProgress = complaints.filter(c => c.status_id === "in_progress").length;
  const pending    = complaints.filter(c => c.status_id === "submitted").length;

  return (
    <div style={{ minHeight: "100vh", backgroundColor: "#f8fafc", padding: "1rem", boxSizing: "border-box" }}>
      <Toaster position="top-right" />

      {/* Navbar */}
      <div style={{ background: "white", padding: "0.75rem 1rem", borderRadius: "12px", display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1rem", boxShadow: "0 2px 10px rgba(0,0,0,0.08)" }}>
        <div>
          <h1 style={{ color: "#16a34a", margin: 0, fontSize: "18px" }}>🏙️ CiviAI</h1>
          <p style={{ margin: 0, fontSize: "12px", color: "#6b7280" }}>Admin Panel</p>
        </div>
        <div style={{ display: "flex", gap: "8px" }}>
          <button onClick={() => router.push("/admin/map")}
            style={{ backgroundColor: "#eff6ff", color: "#1d4ed8", border: "1px solid #bfdbfe", padding: "8px 12px", borderRadius: "8px", cursor: "pointer", fontWeight: "600", fontSize: "13px" }}>
            🗺️ All Map
          </button>
          <button onClick={handleLogout}
            style={{ backgroundColor: "#fee2e2", color: "#dc2626", border: "none", padding: "8px 12px", borderRadius: "8px", cursor: "pointer", fontWeight: "600", fontSize: "13px" }}>
            Logout
          </button>
        </div>
      </div>

      {/* Stats */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: "8px", marginBottom: "1rem" }}>
        {[
          { label: "Total",       value: total,      bg: "#f5f3ff", text: "#7c3aed" },
          { label: "New",         value: pending,    bg: "#f3f4f6", text: "#374151" },
          { label: "In Progress", value: inProgress, bg: "#eff6ff", text: "#1d4ed8" },
          { label: "Resolved",    value: resolved,   bg: "#f0fdf4", text: "#16a34a" },
        ].map(stat => (
          <div key={stat.label} style={{ background: stat.bg, padding: "1rem", borderRadius: "12px", textAlign: "center" }}>
            <div style={{ fontSize: "28px", fontWeight: "700", color: stat.text }}>{stat.value}</div>
            <div style={{ color: stat.text, marginTop: "2px", fontSize: "13px" }}>{stat.label}</div>
          </div>
        ))}
      </div>

      {/* Filter Tabs */}
      <div style={{ display: "flex", gap: "6px", marginBottom: "1rem", flexWrap: "wrap" }}>
        {["all", "submitted", "under_review", "in_progress", "resolved"].map(status => (
          <button key={status} onClick={() => setFilter(status)}
            style={{ padding: "6px 12px", borderRadius: "8px", border: "1px solid #e5e7eb", cursor: "pointer", fontWeight: "600", fontSize: "12px", backgroundColor: filter === status ? "#16a34a" : "white", color: filter === status ? "white" : "#374151" }}>
            {status.replace("_", " ")}
          </button>
        ))}
      </div>

      {/* Complaints Cards */}
      {loading ? (
        <p style={{ textAlign: "center", color: "#9ca3af" }}>Loading...</p>
      ) : filtered.length === 0 ? (
        <p style={{ textAlign: "center", color: "#9ca3af" }}>No complaints found!</p>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
          {filtered.map(c => (
            <div key={c.complaint_id} style={{ background: "white", borderRadius: "12px", padding: "1rem", boxShadow: "0 2px 8px rgba(0,0,0,0.06)", border: "1px solid #e5e7eb" }}>

              {/* Top row */}
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: "8px", marginBottom: "8px" }}>
                <h3 style={{ margin: 0, fontSize: "15px", color: "#111827", fontWeight: "600", flex: 1 }}>{c.title}</h3>
                <span style={{ backgroundColor: statusColor[c.status_id]?.bg, color: statusColor[c.status_id]?.text, padding: "3px 8px", borderRadius: "99px", fontSize: "11px", fontWeight: "600", whiteSpace: "nowrap", flexShrink: 0 }}>
                  {c.status_id?.replace("_", " ")}
                </span>
              </div>

              {/* Details */}
              <div style={{ fontSize: "13px", color: "#6b7280", marginBottom: "10px" }}>
                <p style={{ margin: "2px 0" }}>👤 {c.user_name || "Unknown"}</p>
                <p style={{ margin: "2px 0" }}>🏷️ {c.category_id?.replace(/_/g, " ") || "N/A"}</p>
                <p style={{ margin: "2px 0" }}>📍 {c.location || "No location"}</p>
              </div>

              {/* Buttons */}
              <div style={{ display: "flex", gap: "8px", marginBottom: "10px" }}>
                <button onClick={() => router.push(`/admin/complaint/${c.complaint_id}`)}
                  style={{ flex: 1, padding: "8px", backgroundColor: "#eff6ff", color: "#1d4ed8", border: "1px solid #bfdbfe", borderRadius: "8px", cursor: "pointer", fontWeight: "600", fontSize: "13px" }}>
                  👁️ View Details
                </button>
                {c.location && c.location.includes(",") && (
                  <button onClick={() => router.push(`/admin/complaint/${c.complaint_id}`)}
                    style={{ flex: 1, padding: "8px", backgroundColor: "#f0fdf4", color: "#16a34a", border: "1px solid #bbf7d0", borderRadius: "8px", cursor: "pointer", fontWeight: "600", fontSize: "13px" }}>
                    🗺️ View on Map
                  </button>
                )}
              </div>

              {/* Status Update */}
              <div>
                <label style={{ fontSize: "12px", color: "#6b7280", display: "block", marginBottom: "4px" }}>Update Status:</label>
                <select value={c.status_id} onChange={e => updateStatus(c.complaint_id, e.target.value)}
                  style={{ width: "100%", padding: "10px", borderRadius: "8px", border: "1px solid #d1d5db", fontSize: "14px", cursor: "pointer", backgroundColor: "white", boxSizing: "border-box" }}>
                  <option value="submitted">Submitted</option>
                  <option value="under_review">Under Review</option>
                  <option value="in_progress">In Progress</option>
                  <option value="resolved">Resolved</option>
                </select>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
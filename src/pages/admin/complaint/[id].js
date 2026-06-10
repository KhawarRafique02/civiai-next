import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { supabase } from "../../../lib/supabase";
import toast, { Toaster } from "react-hot-toast";
import dynamic from "next/dynamic";

const MapContainer = dynamic(
  () => import("react-leaflet").then((m) => m.MapContainer),
  { ssr: false }
);
const TileLayer = dynamic(
  () => import("react-leaflet").then((m) => m.TileLayer),
  { ssr: false }
);
const Marker = dynamic(
  () => import("react-leaflet").then((m) => m.Marker),
  { ssr: false }
);
const Popup = dynamic(
  () => import("react-leaflet").then((m) => m.Popup),
  { ssr: false }
);

const statusColor = {
  submitted:    { bg: "#f3f4f6", text: "#374151" },
  under_review: { bg: "#fefce8", text: "#ca8a04" },
  in_progress:  { bg: "#eff6ff", text: "#1d4ed8" },
  resolved:     { bg: "#f0fdf4", text: "#16a34a" },
};

export default function AdminComplaintDetail() {
  const router = useRouter();
  const { id } = router.query;
  const [complaint, setComplaint] = useState(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [leafletLoaded, setLeafletLoaded] = useState(false);

  useEffect(() => {
    if (id) fetchComplaint();
    import("leaflet").then((L) => {
      delete L.Icon.Default.prototype._getIconUrl;
      L.Icon.Default.mergeOptions({
        iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
        iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
        shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
      });
      setLeafletLoaded(true);
    });
  }, [id]);

  const fetchComplaint = async () => {
    try {
      const { data, error } = await supabase
        .from("complaints")
        .select("*")
        .eq("complaint_id", id)
        .single();
      if (error) throw error;
      setComplaint(data);
    } catch (error) {
      toast.error("Error loading complaint");
      router.push("/admin/dashboard");
    }
    setLoading(false);
  };

  const updateStatus = async (newStatus) => {
    setUpdating(true);
    try {
      await supabase
        .from("complaints")
        .update({ status_id: newStatus, updated_at: new Date().toISOString() })
        .eq("complaint_id", id);
      setComplaint(prev => ({ ...prev, status_id: newStatus }));
      toast.success("Status updated!");
    } catch (error) {
      toast.error("Failed to update!");
    }
    setUpdating(false);
  };

  const parseLocation = (locationStr) => {
    const parts = locationStr.split(",");
    return [parseFloat(parts[0]), parseFloat(parts[1])];
  };

  const hasLocation = complaint?.location && complaint.location.includes(",");

  if (loading) return (
    <div style={{ textAlign: "center", marginTop: "4rem", color: "#6b7280" }}>Loading...</div>
  );

  return (
    <div style={{ minHeight: "100vh", backgroundColor: "#f8fafc", padding: "1rem", boxSizing: "border-box" }}>
      <Toaster position="top-right" />
      <link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css" />

      {/* Navbar */}
      <div style={{ background: "white", padding: "0.75rem 1rem", borderRadius: "12px", display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1rem", boxShadow: "0 2px 10px rgba(0,0,0,0.08)" }}>
        <div>
          <h1 style={{ color: "#16a34a", margin: 0, fontSize: "18px" }}>🏙️ CiviAI</h1>
          <p style={{ margin: 0, fontSize: "12px", color: "#6b7280" }}>Complaint Detail</p>
        </div>
        <button onClick={() => router.push("/admin/dashboard")}
          style={{ backgroundColor: "#f3f4f6", color: "#374151", border: "none", padding: "8px 14px", borderRadius: "8px", cursor: "pointer", fontWeight: "600", fontSize: "13px" }}>
          ← Back
        </button>
      </div>

      {/* Complaint Info */}
      <div style={{ background: "white", borderRadius: "16px", padding: "1.25rem", marginBottom: "1rem", boxShadow: "0 2px 10px rgba(0,0,0,0.08)" }}>

        {/* Title + Status */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: "8px", marginBottom: "1rem" }}>
          <h2 style={{ margin: 0, fontSize: "18px", color: "#111827", flex: 1 }}>{complaint.title}</h2>
          <span style={{ backgroundColor: statusColor[complaint.status_id]?.bg, color: statusColor[complaint.status_id]?.text, padding: "4px 10px", borderRadius: "99px", fontSize: "12px", fontWeight: "600", whiteSpace: "nowrap", flexShrink: 0 }}>
            {complaint.status_id?.replace("_", " ")}
          </span>
        </div>

        {/* Details Grid */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px", marginBottom: "1rem" }}>
          {[
            { label: "Citizen",  value: complaint.user_name || "Unknown", icon: "👤" },
            { label: "Email",    value: complaint.user_email || "N/A",    icon: "📧" },
            { label: "Category", value: complaint.category_id?.replace(/_/g, " ") || "N/A", icon: "🏷️" },
            { label: "Location", value: complaint.location || "No location", icon: "📍" },
          ].map(item => (
            <div key={item.label} style={{ backgroundColor: "#f9fafb", borderRadius: "10px", padding: "10px" }}>
              <p style={{ margin: "0 0 2px", fontSize: "11px", color: "#9ca3af", fontWeight: "600", textTransform: "uppercase" }}>{item.icon} {item.label}</p>
              <p style={{ margin: 0, fontSize: "13px", color: "#111827", fontWeight: "500", wordBreak: "break-all" }}>{item.value}</p>
            </div>
          ))}
        </div>

        {/* Description */}
        {complaint.description && (
          <div style={{ backgroundColor: "#f9fafb", borderRadius: "10px", padding: "10px", marginBottom: "1rem" }}>
            <p style={{ margin: "0 0 4px", fontSize: "11px", color: "#9ca3af", fontWeight: "600", textTransform: "uppercase" }}>📝 Description</p>
            <p style={{ margin: 0, fontSize: "13px", color: "#374151", lineHeight: "1.6" }}>{complaint.description}</p>
          </div>
        )}

        {/* Status Update */}
        <div>
          <p style={{ margin: "0 0 6px", fontSize: "12px", color: "#6b7280", fontWeight: "600" }}>Update Status:</p>
          <div style={{ display: "flex", gap: "6px", flexWrap: "wrap" }}>
            {["submitted", "under_review", "in_progress", "resolved"].map(status => (
              <button key={status} onClick={() => updateStatus(status)}
                disabled={updating || complaint.status_id === status}
                style={{ padding: "8px 14px", borderRadius: "8px", border: "1px solid #e5e7eb", cursor: complaint.status_id === status ? "default" : "pointer", fontWeight: "600", fontSize: "12px", backgroundColor: complaint.status_id === status ? "#16a34a" : "white", color: complaint.status_id === status ? "white" : "#374151", opacity: updating ? 0.6 : 1 }}>
                {status.replace("_", " ")}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Map */}
      {hasLocation && leafletLoaded ? (
        <div style={{ background: "white", borderRadius: "16px", padding: "1rem", boxShadow: "0 2px 10px rgba(0,0,0,0.08)" }}>
          <h3 style={{ margin: "0 0 0.75rem", fontSize: "15px", color: "#111827" }}>🗺️ Complaint Location</h3>
          <div style={{ borderRadius: "12px", overflow: "hidden", height: "300px" }}>
            <MapContainer center={parseLocation(complaint.location)} zoom={15} style={{ height: "100%", width: "100%" }}>
              <TileLayer
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                attribution='&copy; OpenStreetMap contributors'
              />
              <Marker position={parseLocation(complaint.location)}>
                <Popup>
                  <div style={{ fontSize: "13px" }}>
                    <strong>{complaint.title}</strong><br />
                    <span style={{ textTransform: "capitalize" }}>{complaint.category_id?.replace(/_/g, " ")}</span><br />
                    <span style={{ color: statusColor[complaint.status_id]?.text, fontWeight: "600" }}>● {complaint.status_id?.replace("_", " ")}</span>
                  </div>
                </Popup>
              </Marker>
            </MapContainer>
          </div>
        </div>
      ) : (
        <div style={{ background: "white", borderRadius: "16px", padding: "1.5rem", textAlign: "center", color: "#9ca3af", boxShadow: "0 2px 10px rgba(0,0,0,0.08)" }}>
          📍 No location data available for this complaint
        </div>
      )}
    </div>
  );
}
import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { supabase } from "../../lib/supabase";
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
  submitted:    "#6b7280",
  under_review: "#ca8a04",
  in_progress:  "#1d4ed8",
  resolved:     "#16a34a",
};

export default function MapPage() {
  const router = useRouter();
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);
  const [leafletLoaded, setLeafletLoaded] = useState(false);

  useEffect(() => {
    fetchComplaints();
    import("leaflet").then((L) => {
      delete L.Icon.Default.prototype._getIconUrl;
      L.Icon.Default.mergeOptions({
        iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
        iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
        shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
      });
      setLeafletLoaded(true);
    });
  }, []);

  const fetchComplaints = async () => {
    try {
      const { data, error } = await supabase
        .from("complaints")
        .select("*");
      if (error) throw error;
      setComplaints((data || []).filter(c => c.location && c.location.includes(",")));
    } catch (error) {
      toast.error("Error loading map data");
    }
    setLoading(false);
  };

  const parseLocation = (locationStr) => {
    const parts = locationStr.split(",");
    return [parseFloat(parts[0]), parseFloat(parts[1])];
  };

  const defaultCenter = [31.5204, 74.3587];

  return (
    <div style={{ minHeight: "100vh", backgroundColor: "#f0fdf4", padding: "1rem", boxSizing: "border-box" }}>
      <Toaster position="top-right" />
      <link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css" />

      {/* Navbar */}
      <div style={{ background: "white", padding: "0.75rem 1rem", borderRadius: "12px", display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1rem", boxShadow: "0 2px 10px rgba(0,0,0,0.08)" }}>
        <h1 style={{ color: "#16a34a", margin: 0, fontSize: "20px" }}>🏙️ CiviAI</h1>
        <button onClick={() => router.push("/citizen/dashboard")}
          style={{ backgroundColor: "#f3f4f6", color: "#374151", border: "none", padding: "8px 14px", borderRadius: "8px", cursor: "pointer", fontWeight: "600", fontSize: "13px" }}>
          ← Back
        </button>
      </div>

      {/* Header */}
      <div style={{ marginBottom: "1rem" }}>
        <h2 style={{ color: "#111827", margin: "0 0 4px", fontSize: "18px" }}>🗺️ Complaints Map</h2>
        <p style={{ color: "#6b7280", margin: 0, fontSize: "14px" }}>{complaints.length} complaints with location data</p>
      </div>

      {/* Map */}
      {loading || !leafletLoaded ? (
        <p style={{ textAlign: "center", color: "#9ca3af" }}>Loading map...</p>
      ) : (
        <div style={{ borderRadius: "16px", overflow: "hidden", boxShadow: "0 4px 20px rgba(0,0,0,0.1)", height: "60vh", minHeight: "300px" }}>
          <MapContainer center={defaultCenter} zoom={12} style={{ height: "100%", width: "100%" }}>
            <TileLayer
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              attribution='&copy; OpenStreetMap contributors'
            />
            {complaints.map(complaint => {
              try {
                const position = parseLocation(complaint.location);
                return (
                  <Marker key={complaint.complaint_id} position={position}>
                    <Popup>
                      <div style={{ minWidth: "140px", fontSize: "13px" }}>
                        <strong>{complaint.title}</strong><br />
                        <span style={{ textTransform: "capitalize" }}>{complaint.category_id?.replace(/_/g, " ")}</span><br />
                        <span style={{ fontWeight: "600", color: statusColor[complaint.status_id] || "#6b7280" }}>● {complaint.status_id?.replace("_", " ")}</span><br />
                        <span style={{ color: "#9ca3af" }}>By: {complaint.user_name}</span>
                      </div>
                    </Popup>
                  </Marker>
                );
              } catch { return null; }
            })}
          </MapContainer>
        </div>
      )}

      {/* Legend */}
      <div style={{ background: "white", padding: "0.75rem 1rem", borderRadius: "12px", marginTop: "1rem", boxShadow: "0 2px 10px rgba(0,0,0,0.08)" }}>
        <p style={{ margin: "0 0 8px", fontWeight: "600", fontSize: "13px", color: "#374151" }}>Legend:</p>
        <div style={{ display: "flex", flexWrap: "wrap", gap: "12px" }}>
          {Object.entries(statusColor).map(([status, color]) => (
            <span key={status} style={{ fontSize: "13px", color }}>● {status.replace("_", " ")}</span>
          ))}
        </div>
      </div>
    </div>
  );
}
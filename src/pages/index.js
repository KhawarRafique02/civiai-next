import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { supabase } from "../lib/supabase";

export default function HomePage() {
  const router = useRouter();
  const [checking, setChecking] = useState(true);
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [visible, setVisible] = useState({});

  useEffect(() => {
    const check = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        const { data: u } = await supabase.from("users").select("role").eq("uid", session.user.id).single();
        router.push(u?.role === "admin" ? "/admin/dashboard" : "/citizen/dashboard");
        return;
      }
      setChecking(false);
    };
    check();
  }, []);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    if (checking) return;
    const io = new IntersectionObserver(
      (entries) => entries.forEach(e => e.isIntersecting && setVisible(p => ({ ...p, [e.target.id]: true }))),
      { threshold: 0.1 }
    );
    document.querySelectorAll("[data-obs]").forEach(el => io.observe(el));
    return () => io.disconnect();
  }, [checking]);

  const go = (id) => { setMenuOpen(false); document.getElementById(id)?.scrollIntoView({ behavior: "smooth" }); };

  if (checking) return (
    <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", background: "#f0fdf4" }}>
      <img src="/logo.png" alt="CiviAI" style={{ width: 160, marginBottom: 20 }} />
      <div style={{ width: 40, height: 40, border: "4px solid #bbf7d0", borderTop: "4px solid #16a34a", borderRadius: "50%", animation: "spin 0.8s linear infinite" }} />
      <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
    </div>
  );

  const anim = (id, delay = 0) => ({
    opacity: visible[id] ? 1 : 0,
    transform: visible[id] ? "translateY(0)" : "translateY(28px)",
    transition: `opacity 0.6s ease ${delay}s, transform 0.6s ease ${delay}s`,
  });

  const FEATURES = [
    { icon: "🤖", title: "AI Auto-Detection", desc: "Upload any photo — our AI instantly classifies road damage, garbage, water leakage and more." },
    { icon: "📍", title: "GPS Location", desc: "Precise GPS coordinates captured automatically so authorities know exactly where to go." },
    { icon: "📊", title: "Real-Time Tracking", desc: "Track complaint status live: Submitted → Under Review → In Progress → Resolved." },
    { icon: "🗺️", title: "Interactive Map", desc: "View all active complaints across the city on a live interactive map with filters." },
    { icon: "👨‍💼", title: "Admin Dashboard", desc: "Powerful admin panel to manage, filter, and update all complaints with map view." },
    { icon: "🔐", title: "Secure Access", desc: "Role-based authentication — separate secure portals for citizens and administrators." },
  ];

  const STEPS = [
    { n: "01", icon: "📸", title: "Capture the Issue", desc: "Take a photo or upload from gallery. AI scans and auto-detects the issue category instantly." },
    { n: "02", icon: "📝", title: "Submit Your Report", desc: "Add title, description and capture GPS location. Complete submission in under 60 seconds." },
    { n: "03", icon: "✅", title: "Track Resolution", desc: "Get real-time status updates as authorities review, action and resolve your complaint." },
  ];

  const CATS = [
    { icon: "🛣️", name: "Road Damage" }, { icon: "🗑️", name: "Garbage" },
    { icon: "💡", name: "Streetlight" }, { icon: "💧", name: "Water Leakage" },
    { icon: "🚧", name: "Sewer Block" }, { icon: "⚠️", name: "Illegal Dump" },
    { icon: "📋", name: "Other" },
  ];

  return (
    <div style={{ fontFamily: "Segoe UI,system-ui,sans-serif", color: "#111827", overflowX: "hidden" }}>
      <style>{`
        *{box-sizing:border-box;margin:0;padding:0}
        html{scroll-behavior:smooth}
        @keyframes spin{to{transform:rotate(360deg)}}
        @keyframes float{0%,100%{transform:translateY(0)}50%{transform:translateY(-8px)}}
        @keyframes blink{0%,100%{opacity:1}50%{opacity:0.4}}
        .gbtn{background:#16a34a;color:white;border:none;padding:14px 32px;border-radius:10px;font-size:15px;font-weight:700;cursor:pointer;transition:all 0.2s}
        .gbtn:hover{background:#15803d;transform:translateY(-2px);box-shadow:0 6px 20px rgba(22,163,74,0.35)}
        .obtn{background:transparent;color:white;border:2px solid rgba(255,255,255,0.45);padding:14px 32px;border-radius:10px;font-size:15px;font-weight:600;cursor:pointer;transition:all 0.2s}
        .obtn:hover{border-color:white;background:rgba(255,255,255,0.1)}
        .card{background:white;border-radius:16px;padding:26px 22px;box-shadow:0 2px 14px rgba(0,0,0,0.06);border:1px solid #e5e7eb;transition:transform 0.2s,box-shadow 0.2s}
        .card:hover{transform:translateY(-4px);box-shadow:0 8px 28px rgba(0,0,0,0.1)}
        ::-webkit-scrollbar{width:5px}
        ::-webkit-scrollbar-thumb{background:#16a34a;border-radius:99px}
        @media(max-width:900px){
          .feat-g{grid-template-columns:1fr 1fr !important}
          .steps-g{grid-template-columns:1fr !important}
          .cats-g{grid-template-columns:repeat(4,1fr) !important}
          .stat-g{grid-template-columns:1fr 1fr !important}
          .foot-g{grid-template-columns:1fr 1fr !important}
        }
        @media(max-width:600px){
          .h1{font-size:2rem !important;line-height:1.2 !important}
          .hero-p{font-size:15px !important}
          .hbtns{flex-direction:column !important}
          .feat-g{grid-template-columns:1fr !important}
          .cats-g{grid-template-columns:repeat(2,1fr) !important}
          .dnav{display:none !important}
          .hmb{display:flex !important}
          .foot-g{grid-template-columns:1fr !important}
          .sh{font-size:1.8rem !important}
        }
      `}</style>

      {/* NAVBAR */}
      <nav style={{ position: "fixed", top: 0, left: 0, right: 0, zIndex: 999, background: scrolled ? "rgba(255,255,255,0.96)" : "transparent", backdropFilter: scrolled ? "blur(12px)" : "none", boxShadow: scrolled ? "0 2px 16px rgba(0,0,0,0.07)" : "none", transition: "all 0.3s", padding: "0 6vw" }}>
        <div style={{ maxWidth: 1200, margin: "0 auto", display: "flex", alignItems: "center", justifyContent: "space-between", height: 64 }}>
          <div onClick={() => go("hero")} style={{ cursor: "pointer", display: "flex", alignItems: "center", gap: 8 }}>
            <span style={{ fontSize: 26 }}>🏙️</span>
            <span style={{ fontSize: 20, fontWeight: 800, color: scrolled ? "#16a34a" : "white", letterSpacing: "-0.5px" }}>CiviAI</span>
          </div>
          <div className="dnav" style={{ display: "flex", alignItems: "center", gap: 26 }}>
            {[["hero", "Home"], ["how", "How It Works"], ["features", "Features"], ["impact", "Impact"], ["about", "About"]].map(([id, l]) => (
              <button key={id} onClick={() => go(id)} style={{ background: "none", border: "none", cursor: "pointer", fontSize: 15, fontWeight: 500, color: scrolled ? "#374151" : "white", transition: "color 0.2s", padding: "4px 0" }}
                onMouseEnter={e => e.target.style.color = "#16a34a"} onMouseLeave={e => e.target.style.color = scrolled ? "#374151" : "white"}>
                {l}
              </button>
            ))}
            <button className="gbtn" onClick={() => router.push("/auth/login")} style={{ padding: "9px 22px", fontSize: 14, borderRadius: 99 }}>Login</button>
          </div>
          <button className="hmb" onClick={() => setMenuOpen(!menuOpen)} style={{ display: "none", background: "none", border: "none", cursor: "pointer", flexDirection: "column", gap: 5, padding: 4 }}>
            {[0, 1, 2].map(i => <span key={i} style={{ width: 24, height: 2.5, background: scrolled ? "#16a34a" : "white", borderRadius: 2, display: "block" }} />)}
          </button>
        </div>
        {menuOpen && (
          <div style={{ background: "white", padding: "14px 6vw 22px", boxShadow: "0 8px 24px rgba(0,0,0,0.1)" }}>
            {[["hero", "Home"], ["how", "How It Works"], ["features", "Features"], ["impact", "Impact"], ["about", "About"]].map(([id, l]) => (
              <button key={id} onClick={() => go(id)} style={{ display: "block", width: "100%", textAlign: "left", background: "none", border: "none", padding: "12px 0", fontSize: 16, fontWeight: 500, color: "#374151", cursor: "pointer", borderBottom: "1px solid #f3f4f6" }}>{l}</button>
            ))}
            <div style={{ display: "flex", gap: 10, marginTop: 14 }}>
              <button className="gbtn" onClick={() => router.push("/auth/login")} style={{ flex: 1 }}>Login</button>
              <button onClick={() => router.push("/auth/signup")} style={{ flex: 1, background: "#f0fdf4", color: "#16a34a", border: "2px solid #16a34a", padding: 14, borderRadius: 10, fontSize: 15, fontWeight: 700, cursor: "pointer" }}>Sign Up</button>
            </div>
          </div>
        )}
      </nav>

      {/* HERO */}
      <section id="hero" style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: "linear-gradient(140deg,#052e16 0%,#14532d 45%,#166534 75%,#16a34a 100%)", padding: "110px 6vw 70px", position: "relative", overflow: "hidden", textAlign: "center" }}>
        {[[120, 80, 320], [900, 400, 260], [200, 500, 180], [980, 80, 220]].map(([x, y, s], i) => (
          <div key={i} style={{ position: "absolute", left: x, top: y, width: s, height: s, borderRadius: "50%", background: "rgba(255,255,255,0.04)", pointerEvents: "none" }} />
        ))}
        {[{ t: "🛣️ Road Damage", s: { top: "16%", left: "3%" }, d: "4s" }, { t: "💧 Water Leakage", s: { top: "26%", right: "3%" }, d: "3.5s 0.3s" }, { t: "🗑️ Garbage", s: { bottom: "22%", left: "2%" }, d: "5s 0.8s" }, { t: "💡 Streetlight", s: { bottom: "28%", right: "2%" }, d: "4.5s 1.2s" }].map((p, i) => (
          <div key={i} style={{ position: "absolute", ...p.s, animation: `float ${p.d} ease-in-out infinite`, opacity: 0, zIndex: 1 }}>
            <span style={{ background: "rgba(255,255,255,0.12)", color: "white", padding: "7px 15px", borderRadius: 99, fontSize: 13, fontWeight: 600, backdropFilter: "blur(8px)", border: "1px solid rgba(255,255,255,0.2)", whiteSpace: "nowrap" }}>{p.t}</span>
          </div>
        ))}
        <div style={{ maxWidth: 740, position: "relative", zIndex: 2 }}>
          <div style={{ display: "inline-flex", alignItems: "center", gap: 8, background: "rgba(255,255,255,0.12)", border: "1px solid rgba(255,255,255,0.2)", borderRadius: 99, padding: "6px 18px", marginBottom: 26, backdropFilter: "blur(8px)" }}>
            <span style={{ width: 8, height: 8, background: "#4ade80", borderRadius: "50%", display: "inline-block", animation: "blink 1.5s infinite" }} />
            <span style={{ color: "rgba(255,255,255,0.9)", fontSize: 13, fontWeight: 600 }}>AI-Powered Civic Complaint System — Pakistan</span>
          </div>
          <h1 className="h1" style={{ fontSize: "3.4rem", fontWeight: 900, color: "white", lineHeight: 1.12, marginBottom: 20, letterSpacing: "-1px" }}>
            Report City Problems.<br /><span style={{ color: "#4ade80" }}>Get Real Solutions.</span>
          </h1>
          <p className="hero-p" style={{ fontSize: 17, color: "rgba(255,255,255,0.78)", lineHeight: 1.7, maxWidth: 560, margin: "0 auto 40px" }}>
            CiviAI uses artificial intelligence to detect, classify, and track civic infrastructure complaints — helping Pakistani citizens report issues and enabling authorities to resolve them faster.
          </p>
          <div className="hbtns" style={{ display: "flex", gap: 14, justifyContent: "center", flexWrap: "wrap" }}>
            <button className="gbtn" onClick={() => router.push("/auth/signup")} style={{ fontSize: 16, padding: "15px 36px", boxShadow: "0 4px 24px rgba(22,163,74,0.4)" }}>Report an Issue Free</button>
            <button className="obtn" onClick={() => go("how")}>See How It Works</button>
          </div>
        </div>
        <div style={{ position: "absolute", bottom: 26, left: "50%", transform: "translateX(-50%)", display: "flex", flexDirection: "column", alignItems: "center", gap: 5, opacity: 0.45 }}>
          <span style={{ color: "white", fontSize: 12 }}>Scroll down</span>
          <div style={{ width: 1, height: 34, background: "white", animation: "blink 2s infinite" }} />
        </div>
      </section>

      {/* STATS */}
      <section style={{ background: "#f0fdf4", padding: "50px 6vw" }}>
        <div style={{ maxWidth: 1100, margin: "0 auto" }}>
          <div className="stat-g" style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 14 }}>
            {[{ v: "7", l: "Issue Categories", s: "Road, Water, Garbage & more" }, { v: "AI", l: "Auto Detection", s: "Imagga API powered" }, { v: "100%", l: "Free to Use", s: "No registration fee" }, { v: "Live", l: "Deployed & Running", s: "civiai-next.vercel.app" }].map((s, i) => (
              <div key={i} className="card" style={{ textAlign: "center", border: "1px solid #dcfce7" }}>
                <div style={{ fontSize: 32, fontWeight: 900, color: "#16a34a" }}>{s.v}</div>
                <div style={{ fontSize: 14, fontWeight: 700, color: "#111827", marginTop: 6 }}>{s.l}</div>
                <div style={{ fontSize: 12, color: "#9ca3af", marginTop: 3 }}>{s.s}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section id="how" style={{ background: "white", padding: "76px 6vw" }}>
        <div id="how-s" data-obs style={{ maxWidth: 1100, margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: 50 }}>
            <span style={{ background: "#dcfce7", color: "#16a34a", padding: "4px 16px", borderRadius: 99, fontSize: 12, fontWeight: 700 }}>SIMPLE PROCESS</span>
            <h2 className="sh" style={{ fontSize: "2.2rem", fontWeight: 800, marginTop: 14, letterSpacing: "-0.5px" }}>How CiviAI Works</h2>
            <p style={{ color: "#6b7280", marginTop: 10, fontSize: 15, maxWidth: 440, margin: "10px auto 0" }}>Three easy steps to report and resolve your civic issue</p>
          </div>
          <div className="steps-g" style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 26 }}>
            {STEPS.map((s, i) => (
              <div key={i} className="card" style={{ textAlign: "center", position: "relative", background: "#f0fdf4", border: "1px solid #bbf7d0", ...anim("how-s", i * 0.12) }}>
                <div style={{ position: "absolute", top: -15, left: "50%", transform: "translateX(-50%)", background: "#16a34a", color: "white", fontSize: 12, fontWeight: 800, padding: "3px 14px", borderRadius: 99 }}>{s.n}</div>
                <div style={{ fontSize: 42, marginBottom: 12, marginTop: 10 }}>{s.icon}</div>
                <h3 style={{ fontSize: 18, fontWeight: 700, marginBottom: 10 }}>{s.title}</h3>
                <p style={{ color: "#6b7280", fontSize: 14, lineHeight: 1.65 }}>{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CATEGORIES */}
      <section style={{ background: "#052e16", padding: "64px 6vw" }}>
        <div style={{ maxWidth: 1100, margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: 38 }}>
            <span style={{ background: "rgba(255,255,255,0.1)", color: "#4ade80", padding: "4px 16px", borderRadius: 99, fontSize: 12, fontWeight: 700 }}>7 CATEGORIES</span>
            <h2 className="sh" style={{ fontSize: "2rem", fontWeight: 800, color: "white", marginTop: 14, letterSpacing: "-0.5px" }}>What Can You Report?</h2>
            <p style={{ color: "rgba(255,255,255,0.5)", marginTop: 8, fontSize: 14 }}>Our AI automatically detects and classifies each issue from your photo</p>
          </div>
          <div className="cats-g" style={{ display: "grid", gridTemplateColumns: "repeat(7,1fr)", gap: 10 }}>
            {CATS.map((c, i) => (
              <div key={i} style={{ background: "rgba(255,255,255,0.07)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 14, padding: "16px 8px", textAlign: "center", transition: "all 0.2s", cursor: "default" }}
                onMouseEnter={e => e.currentTarget.style.background = "rgba(255,255,255,0.14)"} onMouseLeave={e => e.currentTarget.style.background = "rgba(255,255,255,0.07)"}>
                <div style={{ fontSize: 28, marginBottom: 7 }}>{c.icon}</div>
                <div style={{ color: "white", fontSize: 12, fontWeight: 600, lineHeight: 1.3 }}>{c.name}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FEATURES */}
      <section id="features" style={{ background: "#f8fafc", padding: "76px 6vw" }}>
        <div id="feat-s" data-obs style={{ maxWidth: 1100, margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: 50 }}>
            <span style={{ background: "#dcfce7", color: "#16a34a", padding: "4px 16px", borderRadius: 99, fontSize: 12, fontWeight: 700 }}>FEATURES</span>
            <h2 className="sh" style={{ fontSize: "2.2rem", fontWeight: 800, marginTop: 14, letterSpacing: "-0.5px" }}>Everything You Need</h2>
            <p style={{ color: "#6b7280", marginTop: 10, fontSize: 15 }}>Built for Pakistani citizens and municipal authorities</p>
          </div>
          <div className="feat-g" style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 20 }}>
            {FEATURES.map((f, i) => (
              <div key={i} className="card" style={{ ...anim("feat-s", i * 0.08) }}>
                <div style={{ fontSize: 32, marginBottom: 12 }}>{f.icon}</div>
                <h3 style={{ fontSize: 16, fontWeight: 700, marginBottom: 8 }}>{f.title}</h3>
                <p style={{ color: "#6b7280", fontSize: 14, lineHeight: 1.65 }}>{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section id="impact" style={{ background: "linear-gradient(140deg,#14532d,#166534)", padding: "76px 6vw", textAlign: "center" }}>
        <div id="cta-s" data-obs style={{ maxWidth: 640, margin: "0 auto", ...anim("cta-s") }}>
          <span style={{ background: "rgba(255,255,255,0.1)", color: "#4ade80", padding: "4px 16px", borderRadius: 99, fontSize: 12, fontWeight: 700 }}>TAKE ACTION</span>
          <h2 className="sh" style={{ fontSize: "2.2rem", fontWeight: 800, color: "white", marginTop: 16, lineHeight: 1.2, letterSpacing: "-0.5px" }}>
            Your City. Your Voice.<br /><span style={{ color: "#4ade80" }}>Your Responsibility.</span>
          </h2>
          <p style={{ color: "rgba(255,255,255,0.72)", fontSize: 16, lineHeight: 1.7, marginTop: 16, marginBottom: 36 }}>
            Join CiviAI today. Report civic issues, track their resolution, and help build a smarter, cleaner Pakistan — one complaint at a time.
          </p>
          <div style={{ display: "flex", gap: 14, justifyContent: "center", flexWrap: "wrap" }}>
            <button onClick={() => router.push("/auth/signup")} style={{ background: "white", color: "#16a34a", border: "none", padding: "15px 36px", borderRadius: 10, fontSize: 16, fontWeight: 800, cursor: "pointer", transition: "all 0.2s" }}
              onMouseEnter={e => { e.target.style.transform = "translateY(-2px)"; e.target.style.boxShadow = "0 8px 24px rgba(0,0,0,0.2)"; }}
              onMouseLeave={e => { e.target.style.transform = "none"; e.target.style.boxShadow = "none"; }}>
              Register as Citizen
            </button>
            <button className="obtn" onClick={() => router.push("/auth/login")}>Admin Login</button>
          </div>
        </div>
      </section>

      {/* ABOUT */}
      <section id="about" style={{ background: "white", padding: "76px 6vw" }}>
        <div id="about-s" data-obs style={{ maxWidth: 840, margin: "0 auto", textAlign: "center", ...anim("about-s") }}>
          <span style={{ background: "#dcfce7", color: "#16a34a", padding: "4px 16px", borderRadius: 99, fontSize: 12, fontWeight: 700 }}>ABOUT THE PROJECT</span>
          <h2 className="sh" style={{ fontSize: "2rem", fontWeight: 800, marginTop: 14, letterSpacing: "-0.5px" }}>Built at The Superior University</h2>
          <p style={{ color: "#6b7280", fontSize: 15, lineHeight: 1.8, marginTop: 16, maxWidth: 620, margin: "16px auto 0" }}>
            CiviAI is a Final Year Project developed by BSSE students at The Superior University Lahore (2026–2027). The system addresses the critical gap in civic infrastructure management in Pakistani urban areas through AI-powered, transparent complaint management.
          </p>
          <div style={{ display: "flex", gap: 12, justifyContent: "center", marginTop: 34, flexWrap: "wrap" }}>
            {[{ l: "Project ID", v: "BSSE-FYP-F26-024" }, { l: "Supervisor", v: "Mr. Umer Khalil" }, { l: "University", v: "Superior University" }, { l: "Program", v: "BSSE 2026–2027" }].map((b, i) => (
              <div key={i} style={{ background: "#f0fdf4", border: "1px solid #bbf7d0", borderRadius: 12, padding: "13px 20px", minWidth: 145 }}>
                <div style={{ fontSize: 11, color: "#9ca3af", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.05em" }}>{b.l}</div>
                <div style={{ fontSize: 14, fontWeight: 700, color: "#16a34a", marginTop: 4 }}>{b.v}</div>
              </div>
            ))}
          </div>
          <div style={{ marginTop: 40 }}>
            <div style={{ fontSize: 12, color: "#9ca3af", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 12 }}>Built With</div>
            <div style={{ display: "flex", gap: 9, justifyContent: "center", flexWrap: "wrap" }}>
              {["Next.js 16", "Supabase", "PostgreSQL", "Python Flask", "Imagga AI", "Leaflet.js", "Vercel"].map((t, i) => (
                <span key={i} style={{ background: "#f3f4f6", color: "#374151", padding: "6px 14px", borderRadius: 99, fontSize: 13, fontWeight: 600 }}>{t}</span>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer style={{ background: "#052e16", padding: "46px 6vw 26px" }}>
        <div style={{ maxWidth: 1100, margin: "0 auto" }}>
          <div className="foot-g" style={{ display: "grid", gridTemplateColumns: "2fr 1fr 1fr 1fr", gap: 32, marginBottom: 36 }}>
            <div>
              <img src="/logo.png" alt="CiviAI" style={{ height: 42, marginBottom: 14, objectFit: "contain" }} />
              <p style={{ color: "rgba(255,255,255,0.5)", fontSize: 14, lineHeight: 1.7, maxWidth: 230 }}>Smart City. Smarter Citizens. AI-powered civic complaint management for Pakistan.</p>
            </div>
            <div>
              <div style={{ color: "rgba(255,255,255,0.3)", fontSize: 11, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: 13 }}>Navigate</div>
              {[["hero", "Home"], ["how", "How It Works"], ["features", "Features"], ["about", "About"]].map(([id, l]) => (
                <button key={id} onClick={() => go(id)} style={{ display: "block", background: "none", border: "none", color: "rgba(255,255,255,0.5)", fontSize: 14, cursor: "pointer", padding: "4px 0", textAlign: "left", transition: "color 0.2s" }}
                  onMouseEnter={e => e.target.style.color = "white"} onMouseLeave={e => e.target.style.color = "rgba(255,255,255,0.5)"}>{l}</button>
              ))}
            </div>
            <div>
              <div style={{ color: "rgba(255,255,255,0.3)", fontSize: 11, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: 13 }}>Access</div>
              {[["Citizen Login", "/auth/login"], ["Register", "/auth/signup"], ["Admin Portal", "/admin/dashboard"]].map(([l, p]) => (
                <button key={l} onClick={() => router.push(p)} style={{ display: "block", background: "none", border: "none", color: "rgba(255,255,255,0.5)", fontSize: 14, cursor: "pointer", padding: "4px 0", textAlign: "left", transition: "color 0.2s" }}
                  onMouseEnter={e => e.target.style.color = "white"} onMouseLeave={e => e.target.style.color = "rgba(255,255,255,0.5)"}>{l}</button>
              ))}
            </div>
            <div>
              <div style={{ color: "rgba(255,255,255,0.3)", fontSize: 11, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: 13 }}>Project</div>
              <p style={{ color: "rgba(255,255,255,0.5)", fontSize: 13, lineHeight: 1.8 }}>FYP: BSSE-FYP-F26-024<br />The Superior University<br />Lahore, Pakistan<br />Session 2026–2027</p>
            </div>
          </div>
          <div style={{ borderTop: "1px solid rgba(255,255,255,0.08)", paddingTop: 20, display: "flex", justifyContent: "space-between", flexWrap: "wrap", gap: 10 }}>
            <span style={{ color: "rgba(255,255,255,0.3)", fontSize: 13 }}>© 2026 CiviAI — The Superior University Lahore</span>
            <span style={{ color: "rgba(255,255,255,0.3)", fontSize: 13 }}>Supervised by Mr. Umer Khalil</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
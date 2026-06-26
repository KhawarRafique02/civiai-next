import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/router";
import { supabase } from "../lib/supabase";

const NAV_LINKS = [
  { label: "Home", href: "#hero" },
  { label: "How It Works", href: "#how" },
  { label: "Features", href: "#features" },
  { label: "Impact", href: "#impact" },
  { label: "About", href: "#about" },
];

const FEATURES = [
  { icon: "🤖", title: "AI-Powered Detection", desc: "Upload a photo — our AI instantly classifies the civic issue. Road damage, garbage overflow, broken streetlights — detected in seconds." },
  { icon: "📍", title: "GPS Location Capture", desc: "Precise GPS coordinates captured automatically. Authorities know exactly where to send repair teams, no guesswork needed." },
  { icon: "📊", title: "Real-Time Tracking", desc: "Track your complaint status live — from Submitted to Under Review to In Progress to Resolved. Full transparency, always." },
  { icon: "🗺️", title: "Interactive Map View", desc: "See all active complaints across your city on an interactive map. Identify problem hotspots at a glance." },
  { icon: "👨‍💼", title: "Admin Dashboard", desc: "Powerful admin panel with filters, status updates, and complaint detail views including location maps." },
  { icon: "🔐", title: "Secure Authentication", desc: "Role-based access — citizens and administrators have separate secure portals powered by Supabase Auth." },
];

const STEPS = [
  { num: "01", icon: "📸", title: "Capture the Issue", desc: "Take a photo or upload from your gallery. Our AI scans it and auto-detects the complaint category." },
  { num: "02", icon: "📝", title: "Submit Your Report", desc: "Add a title, description and let GPS capture your location. Submit in under 60 seconds." },
  { num: "03", icon: "✅", title: "Track Resolution", desc: "Receive real-time status updates as authorities acknowledge, action and resolve your complaint." },
];

const STATS = [
  { value: "7", label: "Issue Categories", sub: "Road, Water, Garbage & more" },
  { value: "AI", label: "Auto Detection", sub: "Imagga API powered" },
  { value: "100%", label: "Free to Use", sub: "No registration fee" },
  { value: "Live", label: "Deployed & Running", sub: "civiai-next.vercel.app" },
];

const CATEGORIES = [
  { icon: "🛣️", name: "Road Damage" },
  { icon: "🗑️", name: "Garbage Overflow" },
  { icon: "💡", name: "Broken Streetlight" },
  { icon: "💧", name: "Water Leakage" },
  { icon: "🚧", name: "Sewer Blockage" },
  { icon: "⚠️", name: "Illegal Dumping" },
  { icon: "📋", name: "Other Issues" },
];

export default function HomePage() {
  const router = useRouter();
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [visibleSections, setVisibleSections] = useState({});
  const [checking, setChecking] = useState(true);
  const [countUp, setCountUp] = useState(false);
  const heroRef = useRef(null);

  useEffect(() => {
    const checkSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        const { data: userData } = await supabase.from("users").select("role").eq("uid", session.user.id).single();
        if (userData?.role === "admin") { router.push("/admin/dashboard"); return; }
        router.push("/citizen/dashboard"); return;
      }
      setChecking(false);
    };
    checkSession();
  }, []);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(e => {
        if (e.isIntersecting) {
          setVisibleSections(prev => ({ ...prev, [e.target.id]: true }));
          if (e.target.id === "impact") setCountUp(true);
        }
      });
    }, { threshold: 0.15 });
    document.querySelectorAll("[data-observe]").forEach(el => observer.observe(el));
    return () => observer.disconnect();
  }, [checking]);

  const scrollTo = (href) => {
    setMenuOpen(false);
    document.querySelector(href)?.scrollIntoView({ behavior: "smooth" });
  };

  if (checking) return (
    <div style={{ minHeight:"100vh", display:"flex", alignItems:"center", justifyContent:"center", backgroundColor:"#f0fdf4" }}>
      <div style={{ textAlign:"center" }}>
        <div style={{ width:56, height:56, border:"4px solid #bbf7d0", borderTop:"4px solid #16a34a", borderRadius:"50%", animation:"spin 0.8s linear infinite", margin:"0 auto 16px" }}/>
        <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
        <p style={{ color:"#16a34a", fontWeight:700, fontSize:18 }}>🏙️ CiviAI</p>
      </div>
    </div>
  );

  const vis = (id) => visibleSections[id];

  return (
    <div style={{ fontFamily:"'Segoe UI', system-ui, sans-serif", color:"#111827", overflowX:"hidden" }}>
      <style>{`
        *{box-sizing:border-box;margin:0;padding:0}
        @keyframes spin{to{transform:rotate(360deg)}}
        @keyframes fadeUp{from{opacity:0;transform:translateY(32px)}to{opacity:1;transform:translateY(0)}}
        @keyframes fadeIn{from{opacity:0}to{opacity:1}}
        @keyframes float{0%,100%{transform:translateY(0)}50%{transform:translateY(-10px)}}
        @keyframes pulse2{0%,100%{opacity:1}50%{opacity:0.6}}
        @keyframes shimmer{0%{background-position:-200% 0}100%{background-position:200% 0}}
        .fade-up{animation:fadeUp 0.7s ease forwards}
        .fade-in{animation:fadeIn 0.7s ease forwards}
        .float-anim{animation:float 3s ease-in-out infinite}
        .hover-lift{transition:transform 0.2s,box-shadow 0.2s}
        .hover-lift:hover{transform:translateY(-4px);box-shadow:0 12px 32px rgba(22,163,74,0.18)}
        .hover-scale{transition:transform 0.2s}
        .hover-scale:hover{transform:scale(1.04)}
        html{scroll-behavior:smooth}
        ::-webkit-scrollbar{width:6px}
        ::-webkit-scrollbar-track{background:#f0fdf4}
        ::-webkit-scrollbar-thumb{background:#16a34a;border-radius:99px}
        @media(max-width:768px){
          .hero-title{font-size:2.2rem !important}
          .hero-sub{font-size:1rem !important}
          .stats-grid{grid-template-columns:1fr 1fr !important}
          .features-grid{grid-template-columns:1fr !important}
          .steps-grid{grid-template-columns:1fr !important}
          .cats-grid{grid-template-columns:repeat(2,1fr) !important}
          .nav-links{display:none !important}
          .hamburger{display:flex !important}
          .hero-btns{flex-direction:column !important; align-items:stretch !important}
        }
        @media(max-width:480px){
          .stats-grid{grid-template-columns:1fr !important}
          .cats-grid{grid-template-columns:1fr 1fr !important}
        }
      `}</style>

      {/* ── NAVBAR ── */}
      <nav style={{
        position:"fixed", top:0, left:0, right:0, zIndex:1000,
        backgroundColor: scrolled ? "rgba(255,255,255,0.97)" : "transparent",
        backdropFilter: scrolled ? "blur(12px)" : "none",
        boxShadow: scrolled ? "0 2px 20px rgba(0,0,0,0.08)" : "none",
        transition:"all 0.3s",
        padding:"0 5vw",
      }}>
        <div style={{ maxWidth:1200, margin:"0 auto", display:"flex", alignItems:"center", justifyContent:"space-between", height:68 }}>
          <div style={{ display:"flex", alignItems:"center", gap:10, cursor:"pointer" }} onClick={() => scrollTo("#hero")}>
            <span style={{ fontSize:28 }}>🏙️</span>
            <span style={{ fontSize:22, fontWeight:800, color:"#16a34a", letterSpacing:"-0.5px" }}>CiviAI</span>
          </div>

          <div className="nav-links" style={{ display:"flex", gap:32, alignItems:"center" }}>
            {NAV_LINKS.map(l => (
              <button key={l.label} onClick={() => scrollTo(l.href)} style={{ background:"none", border:"none", cursor:"pointer", fontSize:15, fontWeight:500, color: scrolled ? "#374151" : "#fff", transition:"color 0.2s" }}
                onMouseEnter={e => e.target.style.color="#16a34a"}
                onMouseLeave={e => e.target.style.color= scrolled ? "#374151" : "#fff"}>
                {l.label}
              </button>
            ))}
            <button onClick={() => router.push("/auth/login")} style={{ backgroundColor:"#16a34a", color:"white", border:"none", padding:"10px 24px", borderRadius:99, fontWeight:700, fontSize:15, cursor:"pointer", transition:"background 0.2s" }}
              onMouseEnter={e => e.target.style.backgroundColor="#15803d"}
              onMouseLeave={e => e.target.style.backgroundColor="#16a34a"}>
              Login
            </button>
          </div>

          <button className="hamburger" onClick={() => setMenuOpen(!menuOpen)} style={{ display:"none", background:"none", border:"none", cursor:"pointer", flexDirection:"column", gap:5 }}>
            {[0,1,2].map(i => <span key={i} style={{ width:26, height:3, backgroundColor: scrolled ? "#16a34a" : "#fff", borderRadius:2, display:"block", transition:"all 0.3s" }}/>)}
          </button>
        </div>

        {/* Mobile menu */}
        {menuOpen && (
          <div style={{ backgroundColor:"white", padding:"1rem 5vw 1.5rem", boxShadow:"0 8px 24px rgba(0,0,0,0.1)" }}>
            {NAV_LINKS.map(l => (
              <button key={l.label} onClick={() => scrollTo(l.href)} style={{ display:"block", width:"100%", textAlign:"left", background:"none", border:"none", padding:"12px 0", fontSize:16, fontWeight:500, color:"#374151", cursor:"pointer", borderBottom:"1px solid #f3f4f6" }}>
                {l.label}
              </button>
            ))}
            <button onClick={() => router.push("/auth/login")} style={{ marginTop:16, width:"100%", backgroundColor:"#16a34a", color:"white", border:"none", padding:"14px", borderRadius:10, fontWeight:700, fontSize:16, cursor:"pointer" }}>
              Login to CiviAI
            </button>
          </div>
        )}
      </nav>

      {/* ── HERO ── */}
      <section id="hero" style={{
        minHeight:"100vh",
        background:"linear-gradient(135deg, #052e16 0%, #14532d 40%, #166534 70%, #15803d 100%)",
        display:"flex", alignItems:"center", justifyContent:"center",
        textAlign:"center", padding:"100px 5vw 60px", position:"relative", overflow:"hidden"
      }}>
        {/* Background circles */}
        {[[300,200,400],[800,500,300],[100,600,200],[1000,100,250]].map(([x,y,s],i) => (
          <div key={i} style={{ position:"absolute", left:x, top:y, width:s, height:s, borderRadius:"50%", backgroundColor:"rgba(255,255,255,0.03)", pointerEvents:"none" }}/>
        ))}

        {/* Floating category pills */}
        <div style={{ position:"absolute", top:"18%", left:"4%", animation:"float 4s ease-in-out infinite", opacity:0.7 }}>
          <span style={{ backgroundColor:"rgba(255,255,255,0.12)", color:"white", padding:"6px 14px", borderRadius:99, fontSize:13, fontWeight:600, backdropFilter:"blur(8px)", border:"1px solid rgba(255,255,255,0.2)" }}>🛣️ Road Damage</span>
        </div>
        <div style={{ position:"absolute", top:"30%", right:"4%", animation:"float 3.5s ease-in-out infinite 0.5s", opacity:0.7 }}>
          <span style={{ backgroundColor:"rgba(255,255,255,0.12)", color:"white", padding:"6px 14px", borderRadius:99, fontSize:13, fontWeight:600, backdropFilter:"blur(8px)", border:"1px solid rgba(255,255,255,0.2)" }}>💧 Water Leakage</span>
        </div>
        <div style={{ position:"absolute", bottom:"25%", left:"3%", animation:"float 5s ease-in-out infinite 1s", opacity:0.7 }}>
          <span style={{ backgroundColor:"rgba(255,255,255,0.12)", color:"white", padding:"6px 14px", borderRadius:99, fontSize:13, fontWeight:600, backdropFilter:"blur(8px)", border:"1px solid rgba(255,255,255,0.2)" }}>🗑️ Garbage</span>
        </div>
        <div style={{ position:"absolute", bottom:"30%", right:"3%", animation:"float 4.5s ease-in-out infinite 1.5s", opacity:0.7 }}>
          <span style={{ backgroundColor:"rgba(255,255,255,0.12)", color:"white", padding:"6px 14px", borderRadius:99, fontSize:13, fontWeight:600, backdropFilter:"blur(8px)", border:"1px solid rgba(255,255,255,0.2)" }}>💡 Streetlight</span>
        </div>

        <div style={{ maxWidth:780, position:"relative", zIndex:1 }}>
          <div style={{ display:"inline-flex", alignItems:"center", gap:8, backgroundColor:"rgba(255,255,255,0.12)", border:"1px solid rgba(255,255,255,0.25)", borderRadius:99, padding:"6px 18px", marginBottom:28, backdropFilter:"blur(8px)" }}>
            <span style={{ width:8, height:8, backgroundColor:"#4ade80", borderRadius:"50%", display:"inline-block", animation:"pulse2 1.5s infinite" }}/>
            <span style={{ color:"rgba(255,255,255,0.9)", fontSize:14, fontWeight:600 }}>AI-Powered Civic Complaint System — Pakistan</span>
          </div>

          <h1 className="hero-title fade-up" style={{ fontSize:"3.6rem", fontWeight:900, color:"white", lineHeight:1.1, marginBottom:24, letterSpacing:"-1.5px" }}>
            Report City Problems.<br/>
            <span style={{ color:"#4ade80" }}>Get Real Solutions.</span>
          </h1>

          <p className="hero-sub fade-in" style={{ fontSize:"1.2rem", color:"rgba(255,255,255,0.8)", lineHeight:1.7, marginBottom:44, maxWidth:580, margin:"0 auto 44px" }}>
            CiviAI uses artificial intelligence to detect, classify, and track civic infrastructure complaints — helping Pakistani citizens report issues and enabling authorities to act faster.
          </p>

          <div className="hero-btns" style={{ display:"flex", gap:16, justifyContent:"center", flexWrap:"wrap" }}>
            <button onClick={() => router.push("/auth/signup")} style={{ backgroundColor:"#16a34a", color:"white", border:"none", padding:"16px 40px", borderRadius:12, fontSize:17, fontWeight:700, cursor:"pointer", boxShadow:"0 4px 24px rgba(22,163,74,0.4)", transition:"all 0.2s" }}
              onMouseEnter={e => { e.target.style.backgroundColor="#15803d"; e.target.style.transform="translateY(-2px)"; }}
              onMouseLeave={e => { e.target.style.backgroundColor="#16a34a"; e.target.style.transform="translateY(0)"; }}>
              Report an Issue Free →
            </button>
            <button onClick={() => scrollTo("#how")} style={{ backgroundColor:"rgba(255,255,255,0.12)", color:"white", border:"1px solid rgba(255,255,255,0.3)", padding:"16px 40px", borderRadius:12, fontSize:17, fontWeight:600, cursor:"pointer", backdropFilter:"blur(8px)", transition:"all 0.2s" }}
              onMouseEnter={e => e.target.style.backgroundColor="rgba(255,255,255,0.2)"}
              onMouseLeave={e => e.target.style.backgroundColor="rgba(255,255,255,0.12)"}>
              See How It Works
            </button>
          </div>
        </div>

        {/* Scroll hint */}
        <div style={{ position:"absolute", bottom:32, left:"50%", transform:"translateX(-50%)", display:"flex", flexDirection:"column", alignItems:"center", gap:6, opacity:0.6 }}>
          <span style={{ color:"white", fontSize:12, fontWeight:500 }}>Scroll to explore</span>
          <div style={{ width:1, height:40, backgroundColor:"white", animation:"pulse2 2s infinite" }}/>
        </div>
      </section>

      {/* ── STATS ── */}
      <section style={{ backgroundColor:"#f0fdf4", padding:"60px 5vw" }}>
        <div style={{ maxWidth:1100, margin:"0 auto" }}>
          <div className="stats-grid" style={{ display:"grid", gridTemplateColumns:"repeat(4,1fr)", gap:20 }}>
            {STATS.map((s, i) => (
              <div key={i} className="hover-lift" style={{ backgroundColor:"white", borderRadius:16, padding:"28px 20px", textAlign:"center", boxShadow:"0 2px 12px rgba(0,0,0,0.06)", border:"1px solid #dcfce7" }}>
                <div style={{ fontSize:36, fontWeight:900, color:"#16a34a", lineHeight:1 }}>{s.value}</div>
                <div style={{ fontSize:15, fontWeight:700, color:"#111827", marginTop:8 }}>{s.label}</div>
                <div style={{ fontSize:13, color:"#6b7280", marginTop:4 }}>{s.sub}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── HOW IT WORKS ── */}
      <section id="how" data-observe style={{ padding:"80px 5vw", backgroundColor:"white" }}>
        <div style={{ maxWidth:1100, margin:"0 auto" }}>
          <div style={{ textAlign:"center", marginBottom:56 }}>
            <span style={{ backgroundColor:"#dcfce7", color:"#16a34a", padding:"4px 16px", borderRadius:99, fontSize:13, fontWeight:700 }}>SIMPLE PROCESS</span>
            <h2 style={{ fontSize:"2.4rem", fontWeight:800, marginTop:16, color:"#111827", letterSpacing:"-0.5px" }}>How CiviAI Works</h2>
            <p style={{ color:"#6b7280", fontSize:16, marginTop:12, maxWidth:500, margin:"12px auto 0" }}>Three simple steps to get your civic issue reported and resolved</p>
          </div>

          <div className="steps-grid" style={{ display:"grid", gridTemplateColumns:"repeat(3,1fr)", gap:32 }}>
            {STEPS.map((s, i) => (
              <div key={i} className="hover-lift" style={{
                opacity: vis("how") ? 1 : 0,
                transform: vis("how") ? "translateY(0)" : "translateY(40px)",
                transition: `all 0.6s ease ${i*0.15}s`,
                backgroundColor:"#f0fdf4", borderRadius:20, padding:"36px 28px",
                border:"1px solid #bbf7d0", textAlign:"center", position:"relative"
              }}>
                <div style={{ position:"absolute", top:-18, left:"50%", transform:"translateX(-50%)", backgroundColor:"#16a34a", color:"white", fontSize:13, fontWeight:800, padding:"4px 14px", borderRadius:99 }}>{s.num}</div>
                <div style={{ fontSize:48, marginBottom:16 }}>{s.icon}</div>
                <h3 style={{ fontSize:20, fontWeight:700, color:"#111827", marginBottom:12 }}>{s.title}</h3>
                <p style={{ color:"#6b7280", fontSize:15, lineHeight:1.6 }}>{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CATEGORIES ── */}
      <section style={{ backgroundColor:"#052e16", padding:"70px 5vw" }}>
        <div style={{ maxWidth:1100, margin:"0 auto" }}>
          <div style={{ textAlign:"center", marginBottom:44 }}>
            <span style={{ backgroundColor:"rgba(255,255,255,0.1)", color:"#4ade80", padding:"4px 16px", borderRadius:99, fontSize:13, fontWeight:700 }}>7 CATEGORIES</span>
            <h2 style={{ fontSize:"2rem", fontWeight:800, color:"white", marginTop:14, letterSpacing:"-0.5px" }}>What Can You Report?</h2>
            <p style={{ color:"rgba(255,255,255,0.6)", marginTop:10, fontSize:15 }}>Our AI automatically detects and classifies each issue type</p>
          </div>
          <div className="cats-grid" style={{ display:"grid", gridTemplateColumns:"repeat(7,1fr)", gap:12 }}>
            {CATEGORIES.map((c, i) => (
              <div key={i} className="hover-scale" style={{ backgroundColor:"rgba(255,255,255,0.07)", border:"1px solid rgba(255,255,255,0.12)", borderRadius:14, padding:"20px 10px", textAlign:"center", cursor:"default" }}>
                <div style={{ fontSize:32, marginBottom:8 }}>{c.icon}</div>
                <div style={{ color:"white", fontSize:12, fontWeight:600, lineHeight:1.3 }}>{c.name}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FEATURES ── */}
      <section id="features" data-observe style={{ padding:"80px 5vw", backgroundColor:"#f8fafc" }}>
        <div style={{ maxWidth:1100, margin:"0 auto" }}>
          <div style={{ textAlign:"center", marginBottom:56 }}>
            <span style={{ backgroundColor:"#dcfce7", color:"#16a34a", padding:"4px 16px", borderRadius:99, fontSize:13, fontWeight:700 }}>FEATURES</span>
            <h2 style={{ fontSize:"2.4rem", fontWeight:800, marginTop:16, color:"#111827", letterSpacing:"-0.5px" }}>Everything You Need</h2>
            <p style={{ color:"#6b7280", fontSize:16, marginTop:12 }}>Built for Pakistani citizens and municipal authorities</p>
          </div>
          <div className="features-grid" style={{ display:"grid", gridTemplateColumns:"repeat(3,1fr)", gap:24 }}>
            {FEATURES.map((f, i) => (
              <div key={i} className="hover-lift" style={{
                opacity: vis("features") ? 1 : 0,
                transform: vis("features") ? "translateY(0)" : "translateY(32px)",
                transition: `all 0.5s ease ${i*0.1}s`,
                backgroundColor:"white", borderRadius:16, padding:"28px 24px",
                boxShadow:"0 2px 12px rgba(0,0,0,0.05)", border:"1px solid #e5e7eb"
              }}>
                <div style={{ fontSize:36, marginBottom:14 }}>{f.icon}</div>
                <h3 style={{ fontSize:17, fontWeight:700, color:"#111827", marginBottom:8 }}>{f.title}</h3>
                <p style={{ color:"#6b7280", fontSize:14, lineHeight:1.65 }}>{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── IMPACT / CTA ── */}
      <section id="impact" data-observe style={{
        background:"linear-gradient(135deg, #14532d, #166534)",
        padding:"80px 5vw", textAlign:"center"
      }}>
        <div style={{ maxWidth:700, margin:"0 auto" }}>
          <span style={{ backgroundColor:"rgba(255,255,255,0.1)", color:"#4ade80", padding:"4px 16px", borderRadius:99, fontSize:13, fontWeight:700 }}>TAKE ACTION</span>
          <h2 style={{ fontSize:"2.4rem", fontWeight:800, color:"white", marginTop:18, letterSpacing:"-0.5px" }}>
            Your City.<br/>Your Responsibility.<br/><span style={{ color:"#4ade80" }}>Your Voice.</span>
          </h2>
          <p style={{ color:"rgba(255,255,255,0.75)", fontSize:16, lineHeight:1.7, marginTop:20, marginBottom:40 }}>
            Join CiviAI today. Report civic issues, track their resolution, and help build a smarter, cleaner Pakistan — one complaint at a time.
          </p>
          <div style={{ display:"flex", gap:16, justifyContent:"center", flexWrap:"wrap" }}>
            <button onClick={() => router.push("/auth/signup")} style={{ backgroundColor:"white", color:"#16a34a", border:"none", padding:"16px 40px", borderRadius:12, fontSize:17, fontWeight:800, cursor:"pointer", transition:"all 0.2s" }}
              onMouseEnter={e => { e.target.style.transform="translateY(-2px)"; e.target.style.boxShadow="0 8px 24px rgba(0,0,0,0.2)"; }}
              onMouseLeave={e => { e.target.style.transform="translateY(0)"; e.target.style.boxShadow="none"; }}>
              Register as Citizen →
            </button>
            <button onClick={() => router.push("/auth/login")} style={{ backgroundColor:"transparent", color:"white", border:"2px solid rgba(255,255,255,0.4)", padding:"16px 40px", borderRadius:12, fontSize:17, fontWeight:700, cursor:"pointer", transition:"all 0.2s" }}
              onMouseEnter={e => e.target.style.borderColor="white"}
              onMouseLeave={e => e.target.style.borderColor="rgba(255,255,255,0.4)"}>
              Admin Login
            </button>
          </div>
        </div>
      </section>

      {/* ── ABOUT ── */}
      <section id="about" data-observe style={{ padding:"80px 5vw", backgroundColor:"white" }}>
        <div style={{ maxWidth:900, margin:"0 auto", textAlign:"center" }}>
          <span style={{ backgroundColor:"#dcfce7", color:"#16a34a", padding:"4px 16px", borderRadius:99, fontSize:13, fontWeight:700 }}>ABOUT THE PROJECT</span>
          <h2 style={{ fontSize:"2.2rem", fontWeight:800, marginTop:16, color:"#111827", letterSpacing:"-0.5px" }}>Built at The Superior University</h2>
          <p style={{ color:"#6b7280", fontSize:16, lineHeight:1.8, marginTop:20, maxWidth:700, margin:"20px auto 0" }}>
            CiviAI is a Final Year Project developed by students of the Bachelor of Software Engineering program at The Superior University Lahore (Session 2026–2027). The system was built to address the critical gap in civic infrastructure management in Pakistani urban areas by providing an AI-powered, transparent, and accessible complaint management platform.
          </p>

          <div style={{ display:"flex", gap:20, justifyContent:"center", marginTop:40, flexWrap:"wrap" }}>
            {[
              { label:"Project ID", value:"BSSE-FYP-F26-024" },
              { label:"Supervisor", value:"Mr. Umer Khalil" },
              { label:"University", value:"The Superior University" },
              { label:"Program", value:"BSSE — 2026-2027" },
            ].map((item, i) => (
              <div key={i} style={{ backgroundColor:"#f0fdf4", border:"1px solid #bbf7d0", borderRadius:12, padding:"16px 24px", textAlign:"center", minWidth:160 }}>
                <div style={{ fontSize:12, color:"#6b7280", fontWeight:600, textTransform:"uppercase", letterSpacing:"0.05em" }}>{item.label}</div>
                <div style={{ fontSize:15, fontWeight:700, color:"#16a34a", marginTop:4 }}>{item.value}</div>
              </div>
            ))}
          </div>

          {/* Tech Stack */}
          <div style={{ marginTop:48 }}>
            <div style={{ fontSize:13, color:"#9ca3af", fontWeight:600, marginBottom:16, textTransform:"uppercase", letterSpacing:"0.05em" }}>Built With</div>
            <div style={{ display:"flex", gap:12, justifyContent:"center", flexWrap:"wrap" }}>
              {["Next.js 16","Supabase PostgreSQL","Python Flask","Imagga AI API","Leaflet.js","Vercel","Railway"].map((t,i) => (
                <span key={i} style={{ backgroundColor:"#f3f4f6", color:"#374151", padding:"6px 16px", borderRadius:99, fontSize:14, fontWeight:600 }}>{t}</span>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer style={{ backgroundColor:"#052e16", padding:"48px 5vw 32px" }}>
        <div style={{ maxWidth:1100, margin:"0 auto" }}>
          <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", flexWrap:"wrap", gap:32, marginBottom:40 }}>
            <div>
              <div style={{ display:"flex", alignItems:"center", gap:10, marginBottom:12 }}>
                <span style={{ fontSize:28 }}>🏙️</span>
                <span style={{ fontSize:22, fontWeight:800, color:"white" }}>CiviAI</span>
              </div>
              <p style={{ color:"rgba(255,255,255,0.6)", fontSize:14, lineHeight:1.6, maxWidth:260 }}>Smart City. Smarter Citizens.<br/>AI-powered civic complaint management for Pakistan.</p>
            </div>
            <div>
              <div style={{ color:"rgba(255,255,255,0.4)", fontSize:12, fontWeight:700, textTransform:"uppercase", letterSpacing:"0.1em", marginBottom:14 }}>Quick Links</div>
              {NAV_LINKS.map(l => (
                <button key={l.label} onClick={() => scrollTo(l.href)} style={{ display:"block", background:"none", border:"none", color:"rgba(255,255,255,0.6)", fontSize:14, cursor:"pointer", padding:"4px 0", textAlign:"left", transition:"color 0.2s" }}
                  onMouseEnter={e => e.target.style.color="white"}
                  onMouseLeave={e => e.target.style.color="rgba(255,255,255,0.6)"}>
                  {l.label}
                </button>
              ))}
            </div>
            <div>
              <div style={{ color:"rgba(255,255,255,0.4)", fontSize:12, fontWeight:700, textTransform:"uppercase", letterSpacing:"0.1em", marginBottom:14 }}>Access</div>
              <button onClick={() => router.push("/auth/login")} style={{ display:"block", background:"none", border:"none", color:"rgba(255,255,255,0.6)", fontSize:14, cursor:"pointer", padding:"4px 0", transition:"color 0.2s" }}
                onMouseEnter={e => e.target.style.color="white"} onMouseLeave={e => e.target.style.color="rgba(255,255,255,0.6)"}>
                Citizen Login
              </button>
              <button onClick={() => router.push("/auth/signup")} style={{ display:"block", background:"none", border:"none", color:"rgba(255,255,255,0.6)", fontSize:14, cursor:"pointer", padding:"4px 0", transition:"color 0.2s" }}
                onMouseEnter={e => e.target.style.color="white"} onMouseLeave={e => e.target.style.color="rgba(255,255,255,0.6)"}>
                Register
              </button>
              <button onClick={() => router.push("/admin/dashboard")} style={{ display:"block", background:"none", border:"none", color:"rgba(255,255,255,0.6)", fontSize:14, cursor:"pointer", padding:"4px 0", transition:"color 0.2s" }}
                onMouseEnter={e => e.target.style.color="white"} onMouseLeave={e => e.target.style.color="rgba(255,255,255,0.6)"}>
                Admin Portal
              </button>
            </div>
            <div>
              <div style={{ color:"rgba(255,255,255,0.4)", fontSize:12, fontWeight:700, textTransform:"uppercase", letterSpacing:"0.1em", marginBottom:14 }}>Project</div>
              <p style={{ color:"rgba(255,255,255,0.6)", fontSize:13, lineHeight:1.7 }}>
                FYP ID: BSSE-FYP-F26-024<br/>
                The Superior University<br/>
                Lahore, Pakistan<br/>
                Session 2026–2027
              </p>
            </div>
          </div>
          <div style={{ borderTop:"1px solid rgba(255,255,255,0.1)", paddingTop:24, display:"flex", justifyContent:"space-between", alignItems:"center", flexWrap:"wrap", gap:12 }}>
            <span style={{ color:"rgba(255,255,255,0.4)", fontSize:13 }}>© 2026 CiviAI — The Superior University Lahore. All rights reserved.</span>
            <span style={{ color:"rgba(255,255,255,0.4)", fontSize:13 }}>Supervised by Mr. Umer Khalil</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
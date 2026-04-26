@tailwind base;
@tailwind components;
@tailwind utilities;

* { box-sizing: border-box; }
body { background: #000; color: #fff; font-family: system-ui, -apple-system, sans-serif; }
::-webkit-scrollbar { width: 4px; }
::-webkit-scrollbar-track { background: #0a0a0a; }
::-webkit-scrollbar-thumb { background: #ff2d55; border-radius: 2px; }

.glass { background: rgba(255,255,255,0.04); backdrop-filter: blur(12px); border: 1px solid rgba(255,255,255,0.08); border-radius: 16px; }
.glass-red { background: rgba(255,45,85,0.08); border: 1px solid rgba(255,45,85,0.2); border-radius: 16px; }
.glass-blue { background: rgba(10,132,255,0.08); border: 1px solid rgba(10,132,255,0.2); border-radius: 16px; }

.neon-text-red { color: #ff2d55; text-shadow: 0 0 10px rgba(255,45,85,0.5); }
.neon-text-blue { color: #0a84ff; text-shadow: 0 0 10px rgba(10,132,255,0.5); }
.neon-text-cyan { color: #00d4ff; }

.btn-red { background: linear-gradient(135deg,#ff2d55,#c0002a); border:none; border-radius:10px; color:#fff; font-weight:600; cursor:pointer; transition:all 0.2s; }
.btn-red:hover { transform:translateY(-1px); box-shadow:0 4px 20px rgba(255,45,85,0.4); }
.btn-blue { background: linear-gradient(135deg,#0a84ff,#005ecb); border:none; border-radius:10px; color:#fff; font-weight:600; cursor:pointer; transition:all 0.2s; }
.btn-blue:hover { transform:translateY(-1px); box-shadow:0 4px 20px rgba(10,132,255,0.4); }
.btn-ghost { background:rgba(255,255,255,0.06); border:1px solid rgba(255,255,255,0.12); border-radius:10px; color:#fff; font-weight:500; cursor:pointer; transition:all 0.2s; }
.btn-ghost:hover { background:rgba(255,255,255,0.1); }

.sidebar-link { display:flex; align-items:center; gap:12px; padding:11px 14px; border-radius:12px; cursor:pointer; transition:all 0.2s; color:rgba(255,255,255,0.5); font-size:14px; font-weight:500; border:1px solid transparent; }
.sidebar-link:hover { background:rgba(255,255,255,0.06); color:#fff; }
.sidebar-link.active { background:rgba(255,45,85,0.12); border-color:rgba(255,45,85,0.25); color:#ff2d55; }

input,textarea,select { background:rgba(255,255,255,0.06); border:1px solid rgba(255,255,255,0.12); border-radius:10px; color:#fff; padding:10px 14px; font-size:14px; width:100%; outline:none; transition:border-color 0.2s; }
input:focus,textarea:focus,select:focus { border-color:rgba(255,45,85,0.5); }
input::placeholder { color:rgba(255,255,255,0.3); }
select option { background:#111; }

@keyframes fadeIn { from { opacity:0; transform:translateY(8px); } to { opacity:1; transform:translateY(0); } }
.fade-in { animation: fadeIn 0.3s ease forwards; }

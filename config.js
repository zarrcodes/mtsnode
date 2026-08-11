// API_BASE: kosong = localhost (Termux langsung)
//           isi   = URL Cloudflare Tunnel (misal: https://api.mtsmumarta.sch.id)
const API_BASE = (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1' || window.location.hostname === '0.0.0.0' || window.location.hostname.startsWith('192.168.'))
  ? ''
  : 'https://api.mtsmumarta.sch.id';   // <-- GANTI ini dengan URL tunnel kamu
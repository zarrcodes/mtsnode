// API_BASE: kosong = localhost (Termux langsung)
//           isi   = URL Cloudflare Tunnel
const API_BASE = (
  window.location.hostname === 'localhost' ||
  window.location.hostname === '127.0.0.1' ||
  window.location.hostname === '0.0.0.0' ||
  window.location.hostname.startsWith('192.168.')
)
  ? ''
  : 'https://api.mtsmuhammadiyahmartapura.sch.id';

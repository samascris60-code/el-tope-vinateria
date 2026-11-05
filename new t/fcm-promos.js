// fcm-promos.js  ->  se incluye en tu pagina con:  <script type="module" src="/fcm-promos.js"></script>
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import { getMessaging, getToken, deleteToken, onMessage, isSupported } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-messaging.js";
import { getFirestore, doc, setDoc, serverTimestamp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyBdCrNf7bPpq5h111JeGk0eEYySAxha9dg",
  authDomain: "tope-vinateria.firebaseapp.com",
  projectId: "tope-vinateria",
  storageBucket: "tope-vinateria.firebasestorage.app",
  messagingSenderId: "1011217846065",
  appId: "1:1011217846065:web:41c341bfd572214743ffbc",
  measurementId: "G-E77L0RD83G"
};
const VAPID_KEY = "BJqbPVZ2N-uyslV5YDqRkOGVOZ0PQU41pqZhfFsogQ_OnQadISfDNtj0BJ2BKKNaaxSWFg0QtgrDbXHoTKtNfIQ";
const LS_KEY = "tope_push_token";

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const btn = document.getElementById("bellbtn");

function toast(msg) {
  let t = document.getElementById("fcmtoast");
  if (!t) { t = document.createElement("div"); t.id = "fcmtoast"; t.className = "fcmtoast"; document.body.appendChild(t); }
  t.textContent = msg; t.classList.add("show");
  clearTimeout(t._h); t._h = setTimeout(() => t.classList.remove("show"), 3800);
}
function setUI(on) {
  if (!btn) return;
  btn.classList.toggle("on", on);
  btn.setAttribute("aria-pressed", on ? "true" : "false");
  btn.title = on ? "Alertas de promociones: ACTIVADAS (toca para desactivar)" : "Activar alertas de promociones";
}
async function saveToken(token, active) {
  try { await setDoc(doc(db, "fcmTokens", token), { active, ua: navigator.userAgent.slice(0, 120), updatedAt: serverTimestamp() }, { merge: true }); }
  catch (e) { console.warn("No se pudo guardar el token en Firestore:", e); }
}

(async () => {
  if (!(await isSupported()) || !("serviceWorker" in navigator)) { if (btn) btn.style.display = "none"; return; }
  const reg = await navigator.serviceWorker.register("/firebase-messaging-sw.js");
  const messaging = getMessaging(app);

  // Si ya estaba activado, refresca el token (puede cambiar con el tiempo)
  if (localStorage.getItem(LS_KEY) && Notification.permission === "granted") {
    try {
      const t = await getToken(messaging, { vapidKey: VAPID_KEY, serviceWorkerRegistration: reg });
      if (t) { localStorage.setItem(LS_KEY, t); await saveToken(t, true); setUI(true); }
    } catch (e) { console.warn(e); }
  } else setUI(false);

  async function enable() {
    const perm = await Notification.requestPermission();
    if (perm !== "granted") { toast("Las notificaciones están bloqueadas. Actívalas en los permisos del navegador."); return; }
    try {
      const token = await getToken(messaging, { vapidKey: VAPID_KEY, serviceWorkerRegistration: reg });
      if (!token) { toast("No se pudo activar. Intenta de nuevo."); return; }
      localStorage.setItem(LS_KEY, token); await saveToken(token, true); setUI(true);
      toast("¡Listo! Te avisaremos de las promociones de El Tope.");
    } catch (e) { console.error(e); toast("No se pudo activar las alertas."); }
  }
  async function disable() {
    const token = localStorage.getItem(LS_KEY);
    try { await deleteToken(messaging); } catch (e) { console.warn(e); }
    if (token) await saveToken(token, false);
    localStorage.removeItem(LS_KEY); setUI(false);
    toast("Alertas de promociones desactivadas.");
  }
  if (btn) btn.onclick = () => (localStorage.getItem(LS_KEY) ? disable() : enable());

  // Notificaciones con la pagina abierta
  onMessage(messaging, (p) => {
    const n = p.notification || p.data || {};
    toast((n.title || "El Tope") + (n.body ? " · " + n.body : ""));
  });
})();

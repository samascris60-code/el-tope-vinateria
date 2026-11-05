// firebase-messaging-sw.js -> debe quedar en la RAIZ de tu sitio (https://tudominio.com/firebase-messaging-sw.js)
importScripts("https://www.gstatic.com/firebasejs/10.12.2/firebase-app-compat.js");
importScripts("https://www.gstatic.com/firebasejs/10.12.2/firebase-messaging-compat.js");
firebase.initializeApp({
  apiKey: "AIzaSyBdCrNF7bPq5h111JeGk0eEYySaxha9dg",
  authDomain: "tope-vinateria.firebaseapp.com",
  projectId: "tope-vinateria",
  storageBucket: "tope-vinaterias.appspot.com",
  messagingSenderId: "1011217846065",
  appId: "1:1011217846065:web:41c341bfd572214743ffbc",
  measurementId: "G-E77L0RD83G"
});
const messaging = firebase.messaging();
messaging.usePublicVapidKey("BJqbPVZ2N-uYs1V5YDqRkOGV0ZQPQu41pqZhFfsOgQ_0nQaqISFDntjuBj2BkkNaaxSWFgo0tgrDbxHcTKTnFiQ");
messaging.onBackgroundMessage((payload) => {
  if (payload.notification) return;
  const d = payload.data || {};
  self.registration.showNotification(d.title || "El Tope Vinatería", {
    body: d.body || "",
    icon: d.icon || "/icon-192.png",
    badge: "/icon-192.png",
    data: { url: d.url || "/" }
  });
});
self.addEventListener("notificationclick", (event) => {
  event.notification.close();
  const data = event.notification.data || {};
  const fcm = (data.FCM_MSG && data.FCM_MSG.notification) || {};
  const link = data.url || (data.FCM_MSG && data.FCM_MSG.data && data.FCM_MSG.data.url) || fcm.click_action || "/";
  event.waitUntil(
    clients.matchAll({ type: "window", includeUncontrolled: true }).then((list) => {
      for (const c of list) {
        if ("focus" in c) {
          c.navigate(link);
          return c.focus();
        }
      }
      return clients.openWindow(link);
    })
  );
});
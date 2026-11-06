importScripts('https://www.gstatic.com/firebasejs/10.12.2/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/10.12.2/firebase-messaging-compat.js');

firebase.initializeApp({
  apiKey: "AIzaSyBdCrNf7bPpq5h111JeGk0eEYySAxha9dg",
  authDomain: "tope-vinateria.firebaseapp.com",
  projectId: "tope-vinateria",
  storageBucket: "tope-vinateria.firebasestorage.app",
  messagingSenderId: "1011217846005",
  appId: "1:1011217846005:web:41c341bfd572214743ffbc"
});

const messaging = firebase.messaging();

messaging.onBackgroundMessage((payload) => {
  if (payload.notification) return;
  const d = payload.data || {};
  self.registration.showNotification(d.title || "El Tope Vinatería", {
    body: d.body || "",
    icon: d.icon || "/icon-192.png",
    data: { url: d.url || "/" }
  });
});

self.addEventListener("notificationclick", (event) => {
  event.notification.close();
  const link = (event.notification.data && event.notification.data.url) || "/";
  event.waitUntil(clients.openWindow(link));
});

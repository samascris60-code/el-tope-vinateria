// send-test.js  (Node.js 18+)   Uso:  node send-test.js "TOKEN_DEL_CELULAR" "Título" "Mensaje"
// Requiere:  npm i firebase-admin   y   serviceAccountKey.json (Firebase > Configuración > Cuentas de servicio > Generar clave privada)
const admin = require("firebase-admin");
admin.initializeApp({ credential: admin.credential.cert(require("./serviceAccountKey.json")) });

const [token, title = "🔥 Promo El Tope", body = "Corona Familiar 1x$50 · 2x$90. ¡Pide a domicilio!"] = process.argv.slice(2);
if (!token) { console.error('Falta el token.  node send-test.js "TOKEN" "Título" "Mensaje"'); process.exit(1); }

admin.messaging().send({
  token,
  notification: { title, body },
  webpush: {
    fcmOptions: { link: "https://TU-DOMINIO.com/" },
    notification: { icon: "https://TU-DOMINIO.com/icon-192.png" }
  }
}).then((id) => { console.log("Enviada:", id); process.exit(0); })
  .catch((e) => { console.error("Error:", e.code || e.message); process.exit(1); });

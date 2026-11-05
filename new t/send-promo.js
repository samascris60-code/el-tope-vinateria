// send-promo.js  ->  envia una promo a TODOS los que activaron las alertas
// Uso:  node send-promo.js "Título" "Mensaje" "https://TU-DOMINIO.com/#Promos"
const admin = require("firebase-admin");
admin.initializeApp({ credential: admin.credential.cert(require("./serviceAccountKey.json")) });

(async () => {
  const [title = "🔥 Promo El Tope", body = "Mira las promociones de hoy.", link = "https://TU-DOMINIO.com/"] = process.argv.slice(2);
  const snap = await admin.firestore().collection("fcmTokens").where("active", "==", true).get();
  const tokens = snap.docs.map((d) => d.id);
  console.log("Destinatarios:", tokens.length);
  for (let i = 0; i < tokens.length; i += 500) {
    const chunk = tokens.slice(i, i + 500);
    const res = await admin.messaging().sendEachForMulticast({
      tokens: chunk,
      notification: { title, body },
      webpush: { fcmOptions: { link }, notification: { icon: "https://TU-DOMINIO.com/icon-192.png" } }
    });
    // limpia tokens que ya no existen
    const dead = [];
    res.responses.forEach((r, k) => { if (!r.success && /registration-token-not-registered|invalid-argument/.test(r.error?.code || "")) dead.push(chunk[k]); });
    await Promise.all(dead.map((t) => admin.firestore().collection("fcmTokens").doc(t).delete()));
    console.log(`Lote: ${res.successCount} enviadas, ${res.failureCount} fallidas, ${dead.length} tokens eliminados`);
  }
  process.exit(0);
})();

# Notificaciones push – El Tope Vinatería

## Archivos (todos van en la RAÍZ de tu sitio)
- `index.html` – tu tienda ya con la campana 🔔 y el módulo de alertas
- `fcm-promos.js` – pide permiso, obtiene el token y activa/desactiva alertas
- `firebase-messaging-sw.js` – service worker (recibe alertas en segundo plano)
- `manifest.json`, `icon-192.png`, `icon-512.png` – para instalar la tienda como app
- `send-test.js` / `send-test.sh` – prueba a un celular
- `send-promo.js` – promo a TODOS los suscritos
- `firestore.rules` – reglas de seguridad

## Pasos
1. Firebase Console > Build > **Firestore Database** > crear base de datos (modo producción) > pestaña **Reglas** > pega `firestore.rules`.
2. Sube los archivos con **Firebase Hosting** (`npm i -g firebase-tools`, `firebase login`, `firebase init hosting`, carpeta pública = esta, `firebase deploy`). Debe ser **HTTPS**.
3. Abre tu sitio, toca la campana, acepta el permiso. Abre la consola del navegador y copia el token: `localStorage.getItem("tope_push_token")`.
4. Prueba: `node send-test.js "TOKEN" "Título" "Mensaje"`.
5. Promo masiva: `node send-promo.js "🔥 2x90 en Corona" "Pide a domicilio" "https://TU-DOMINIO.com/"`.

## Seguridad
- `firebaseConfig` y la VAPID key SON públicas (van en la web). Restringe la API key por dominio en Google Cloud > Credenciales.
- `serviceAccountKey.json` es PRIVADA: no la subas al hosting ni la compartas.
- El método antiguo "Server key" (Authorization: key=...) ya no funciona; usa HTTP v1 o firebase-admin.

## iPhone
Las push web en iOS (16.4+) solo funcionan si el cliente **agrega la tienda a la pantalla de inicio**.

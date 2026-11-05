#!/usr/bin/env bash
# Prueba con cURL (API HTTP v1).  Necesitas gcloud:  gcloud auth login  (con la cuenta dueña del proyecto)
# Uso:  ./send-test.sh "TOKEN_DEL_CELULAR"
TOKEN="$1"
ACCESS=$(gcloud auth print-access-token)
curl -X POST "https://fcm.googleapis.com/v1/projects/tope-vinateria/messages:send" \
  -H "Authorization: Bearer $ACCESS" \
  -H "Content-Type: application/json" \
  -d '{
    "message": {
      "token": "'"$TOKEN"'",
      "notification": { "title": "🔥 Promo El Tope", "body": "Corona Familiar 1x$50 · 2x$90. ¡Pide a domicilio!" },
      "webpush": { "fcm_options": { "link": "https://TU-DOMINIO.com/" } }
    }
  }'

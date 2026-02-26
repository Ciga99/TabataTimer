## Tabata Timer

1. Install dependencies

   ```
   npm install
   ```

2. Start the app

   ```
   npx expo start
   ```

   Passo 1 — Login (una tantum)

eas login
Ti chiederà email e password del tuo account expo.dev. Se non hai un account, creane uno gratis sul sito prima.

Passo 2 — Avvia la build APK

cd C:\Progetti\TabataTimer
eas build --platform android --profile preview
Alla prima esecuzione:

Chiederà di collegare il progetto al tuo account Expo → premi Invio per confermare
Chiederà se generare un keystore automaticamente → Y
La build parte in cloud (10–20 min)
Alla fine ti dà un link diretto all'APK
Passo 3 — Installazione sul telefono
Scarica l'APK dal link (puoi aprirlo direttamente sul telefono o trasferirlo via USB)
Sul telefono: Impostazioni → App → Installa app sconosciute → abilita per il browser/file manager che usi
Apri il .apk e installa
Quando la build è partita, puoi monitorarla anche su expo.dev/builds.

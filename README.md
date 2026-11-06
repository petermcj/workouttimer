# CrossCage klocka

Intervallklocka för CrossCage-pass, byggd som en webbapp (PWA) som installeras på telefonens hemskärm och fungerar utan internet.

## Funktioner

- Valfritt antal stationer, övningar per station, set och varv
- Uppvärmning och genomgång av övningar, samlad eller vid varje station
- Räknar ut arbete och vila utifrån total tid, eller så sätter du arbetstiden själv
- Pauser för byte av övning, byte av station och mellan varv
- Ljud: startsignal, halvtidssignal (byt sida), nedräkning, slutsignal, volym och flera ljud att välja mellan
- Spara pass med namn (sparas i telefonen)
- Håller skärmen tänd under passet
- Svenska och engelska

## Installera på telefonen

Appen måste ligga på en webbadress med https, till exempel GitHub Pages (se nedan).

- **iPhone:** öppna adressen i Safari, tryck på Dela-knappen och välj *Lägg till på hemskärmen*.
- **Android:** öppna adressen i Chrome och tryck *Installera appen* i appen, eller välj *Installera app* i Chrome-menyn.

## Publicera med GitHub Pages

1. Gå till repots *Settings → Pages*.
2. Under *Build and deployment*, välj *Deploy from a branch*, gren `main` och mapp `/ (root)`.
3. Efter någon minut finns appen på `https://<användarnamn>.github.io/<repo>/`.

## Uppdatera appen

Ändra filerna och höj `VERSION` i `sw.js` (till exempel `crosscage-v2`). Då hämtar telefonerna den nya versionen nästa gång appen öppnas med internet.

## Filer

| Fil | Innehåll |
| --- | --- |
| `index.html` | Hela appen (HTML, CSS och JavaScript) |
| `manifest.webmanifest` | Appens namn, ikoner och färger |
| `sw.js` | Service worker som gör att appen fungerar offline |
| `icons/`, `apple-touch-icon.png` | App-ikoner |

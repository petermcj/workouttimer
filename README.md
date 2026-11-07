# CrossCage klocka

Intervallklocka för CrossCage-pass, byggd som en webbapp (PWA) som installeras på telefonens hemskärm och fungerar utan internet.

## Funktioner

- Valfritt antal stationer, övningar per station, set och varv
- Uppvärmning och genomgång av övningar: tid per övning eller en total tid, samlad eller vid varje station
- Räknar ut arbete och vila utifrån total tid, eller så sätter du arbetstiden själv
- Jämna tider (steg om 5 s) som passar i passets tid, med val av tid kvar i slutet eller hur mycket passet får dra över
- Håller sluttiden under passet: pausar du eller backar kortas resten av arbetet och setvilan så att passet ändå slutar i tid
- Samma tider alla varv eller olika arbete/vila per varv, inklusive egna tider för byten per varv
- Möjlighet att låta byten ta samma tid som vilan (till exempel 35/10 i varv 1 och 25/10 i varv 2)
- Olika antal set per varv
- Ordning på stationen: alla set av en övning i taget (A A B B) eller växla mellan övningarna (A B A B)
- Egna tider för arbete och vila per övning och varv
- Pauser för byte av övning, byte av station och mellan varv
- Ljud: startsignal, halvtidssignal (byt sida), nedräkning, slutsignal, volym och flera ljud att välja mellan
- Spara pass med namn (sparas i telefonen)
- Styr Spotify: spellista vid start, spela/pausa med passet, nästa låt och lägre volym under vila (kräver Premium, se [SPOTIFY.md](SPOTIFY.md))
- Valfri tid efter uppvärmning och genomgång för att gå till stationerna
- Knapp för att hålla skärmen tänd och fokusläge som döljer allt utom klockan
- Visning på låsskärmen (valfritt), så att klockan syns och piper även när skärmen är låst
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

Ändra filerna och höj `VERSION` i `sw.js` (till exempel `crosscage-v11`). Skriv samma värde i länken till skriptet i `index.html` (`app.js?v=crosscage-v11`), så att sidan aldrig kör ihop med ett gammalt skript. Då hämtar telefonerna den nya versionen nästa gång appen öppnas med internet.

## Filer

| Fil | Innehåll |
| --- | --- |
| `index.html` | Appens HTML och CSS, och säkerhetspolicyn (CSP) |
| `app.js` | All JavaScript |
| `fonts/` | Typsnitten Barlow och Barlow Condensed (SIL Open Font License, se `fonts/OFL.txt`) |
| `manifest.webmanifest` | Appens namn, ikoner och färger |
| `sw.js` | Service worker som gör att appen fungerar offline |
| `icons/`, `apple-touch-icon.png` | App-ikoner |

## Säkerhet och beroenden

Appen använder inga bibliotek och laddar ingen kod från andra servrar. Typsnitten ligger i `fonts/` i stället för att hämtas från Google Fonts. De enda externa anropen går till Spotifys API.

`index.html` har en Content-Security-Policy som bara tillåter skript och typsnitt från appens egen adress, och anrop till `api.spotify.com` och `accounts.spotify.com`. Den skyddar Spotify-inloggningen som sparas i telefonen om en bugg skulle släppa in främmande kod.

Tänk på detta när du ändrar appen:

- Lägg JavaScript i `app.js`. Skript direkt i `index.html` (`<script>...</script>` eller `onclick="..."`) blockeras av policyn.
- Skriv text från andra källor, till exempel namn från Spotify, med `textContent` och inte `innerHTML`.
- Behöver appen anropa en ny tjänst, lägg till adressen i `connect-src` i policyn.
- Lägg bibliotek och typsnitt i repot i stället för att länka till ett CDN. Om ett CDN ändå behövs, lås versionen och använd `integrity` (SRI).
- Nya filer ska också läggas till i listan i `sw.js`, annars fungerar de inte offline.

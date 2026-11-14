# WorkoutTimer

Intervallklocka för pass med stationer, byggd som en webbapp (PWA) som installeras på telefonens hemskärm och fungerar utan internet. Den passar för cirkelträning, CrossCage och andra stationspass.

- **Instruktörer** planerar ett pass så att uppvärmning, genomgång av övningar, stationsbyten, arbete och vila ryms i den tid passet har fått.
- **Tränar du själv** väljer du För egen träning under Inställningar. Då försvinner genomgång av övningar och instruktörstexter, och klockan blir enklare.

## Funktioner

- Valfritt antal stationer, övningar per station, set och varv
- Uppvärmning och genomgång av övningar: tid per övning eller en total tid, samlad eller vid varje station
- Räknar ut arbete och vila utifrån total tid, eller så sätter du arbetstiden själv
- Jämna tider (steg om 5 s) som passar i passets tid, med val av tid kvar i slutet eller hur mycket passet får dra över
- Tid kvar av passet räknas mot sluttiden från första Start, även under paus, och visar hur mycket planen ligger efter eller före
- Optimera anpassar resten av passet till tiden som är kvar: arbete, vila, byten, varvvila och stretch kortas eller förlängs lika mycket (minst 10 s arbete och 5 s övrigt, högst 50 % längre). Uppvärmning, genomgång och mellanövningar ändras inte, och det går att ångra
- Samma tider alla varv eller olika arbete/vila per varv, inklusive egna tider för byten per varv
- Möjlighet att låta byten ta samma tid som vilan (till exempel 35/10 i varv 1 och 25/10 i varv 2)
- Olika antal set per varv
- Ordning på stationen: alla set av en övning i taget (A A B B) eller växla mellan övningarna (A B A B)
- Egna tider för arbete och vila per övning och varv
- Pauser för byte av övning, byte av station och mellan varv
- Tydligt flöde: Nytt pass (namn och beskrivning) → Övningar (stationer som kort) → Tider → Kör
- Allt sparas automatiskt i passet. Det som ändras under ett pass som körs (paus, −30 s / +30 s) ändrar inte det sparade passet
- Meny längst ner: Pass, Klocka, Övningar och Inställningar
- Passlista med det senast använda överst: Kör, Redigera, Duplicera och Ta bort. Nya pass kan börja från dina standardvärden, en inbyggd mall eller en kopia
- Stationer läggs till genom att välja en övning ur övningsbanken (eller skriva en ny). Flera övningar på samma station blir A, B och så vidare
- Ångra efter större ändringar
- Övningarna är indelade efter kroppsdel (ben, rygg, bröst, axlar, armar, bål) samt kondition och helkropp, och varje grupp har en egen ikon
- Spotify på klockan: föregående, spela/pausa och nästa, samt volymreglage på enheter där Spotify tillåter det (inte iPhone)
- Utan internet (flygplansläge) går klockan som vanligt. Musikknapparna tonas ner med en rad om att musiken styrs i Spotify-appen, och kommer tillbaka när anslutningen gör det
- Snabbtimer: bara arbete, vila, antal set och stationer, utan att bygga ett pass. Klockan kan gå löpande eller vänta på dig vid varje stationsbyte
- Övningsbibliotek där appens 48 övningar har instruktioner (utförande och vad instruktören ska titta särskilt på) på svenska och engelska, och stretchövningarna har korta instruktioner. Skriv egna kommentarer på appens övningar eller lägg till egna övningar. Under genomgången visar klockan kommentar, utförande och vad man ska titta på
- Säkerhetskopia: exportera pass, övningar, plan och inställningar till en fil och läs in den igen
- Egna standardvärden för nya pass (Inställningar → Standard för nya pass) och knappen Nytt pass
- Röst som läser upp övningar, byten och stretch (valfritt)
- Knappar för −30 s och +30 s under passet
- Mellanövning som alla gör samtidigt, mellan varv eller efter var X:e station
- Stretch i slutet med förslag som anpassas efter passets övningar
- Övningsbank att välja övningar från, och knapp som fyller tomma stationer med förslag
- Välj om klockan visar övningens namn, Övning 1, 2, 3 eller Övning A, B (bra när deltagarna börjar på olika stationer)
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

Ändra filerna och höj `VERSION` i `sw.js` (till exempel `workouttimer-v20`). Skriv samma värde i länken till skriptet i `index.html` (`app.js?v=workouttimer-v20`), så att sidan aldrig kör ihop med ett gammalt skript. Ändringar i hur appen ser ut på hemskärmen (namn, ikon, statusrad) gäller först när appen läggs till på hemskärmen igen. Exportera en säkerhetskopia först, för när hemskärmsappen tas bort raderas dess data. Versionsnumret visas längst ner under Inställningar och sparas i säkerhetskopian. När en telefon har hämtat en ny version visas en rad med **Ladda om**, så att den nya versionen används direkt (dock inte mitt i ett pass som pågår). Då hämtar telefonerna den nya versionen nästa gång appen öppnas med internet.

## Filer

| Fil | Innehåll |
| --- | --- |
| `index.html` | Appens HTML och CSS, och säkerhetspolicyn (CSP) |
| `app.js` | All JavaScript |
| `tests/run.js` | Tester som körs i webbläsaren (`npm install` och sedan `npm test`). De körs också automatiskt i GitHub vid varje pull request |
| `fonts/` | Typsnitten Barlow och Barlow Condensed (SIL Open Font License, se `fonts/OFL.txt`) |
| `manifest.webmanifest` | Appens namn, ikoner och färger |
| `sw.js` | Service worker som gör att appen fungerar offline |
| `icons/`, `apple-touch-icon.png` | App-ikoner |

## Säkerhetskopia

Under Pass → Säkerhetskopia sparas allt i en JSON-fil. Läs in filen med Importera om appen har krånglat, på en ny telefon eller efter en ny version. Vid inläsning ersätts ett pass eller en övning med samma namn bara om kopian i filen är nyare. Passet i Plan och inställningarna återställs, och det går att ångra direkt efteråt.

## Säkerhet och beroenden

Appen använder inga bibliotek och laddar ingen kod från andra servrar. Typsnitten ligger i `fonts/` i stället för att hämtas från Google Fonts. De enda externa anropen går till Spotifys API.

`index.html` har en Content-Security-Policy som bara tillåter skript och typsnitt från appens egen adress, och anrop till `api.spotify.com` och `accounts.spotify.com`. Den skyddar Spotify-inloggningen som sparas i telefonen om en bugg skulle släppa in främmande kod.

Tänk på detta när du ändrar appen:

- Lägg JavaScript i `app.js`. Skript direkt i `index.html` (`<script>...</script>` eller `onclick="..."`) blockeras av policyn.
- Skriv text från andra källor, till exempel namn från Spotify, med `textContent` och inte `innerHTML`.
- Behöver appen anropa en ny tjänst, lägg till adressen i `connect-src` i policyn.
- Lägg bibliotek och typsnitt i repot i stället för att länka till ett CDN. Om ett CDN ändå behövs, lås versionen och använd `integrity` (SRI).
- Nya filer ska också läggas till i listan i `sw.js`, annars fungerar de inte offline.

### Sårbarheter i beroenden

Det enda beroendet är Playwright, som bara kör testerna och aldrig följer med appen. Det och GitHub Actions i CI kontrolleras så här:

- `package-lock.json` låser exakta versioner. CI installerar med `npm ci`, så testerna kör det som är granskat.
- Arbetsflödet **Sårbarheter** (`.github/workflows/security.yml`) kör `npm audit` (kända CVE:er) och `npm audit signatures` (att paketen är signerade av registret). Det körs när beroendena ändras i en PR, vid push till `main`, varje måndag och manuellt under Actions. En ny CVE stoppar alltså inte PR:er som bara ändrar appen.
- `.github/dependabot.yml` låter Dependabot föreslå nya versioner av Playwright och av GitHub Actions varje vecka, som PR:er som går igenom testerna.
- GitHub Actions är låsta till en commit (SHA) i stället för en tagg som kan flyttas. Dependabot uppdaterar dem.

Det mesta skyddet kommer från en inställning som inte går att lägga i repot. Slå på **Dependabot alerts** och **Dependabot security updates** under repots Settings → Code security. Då larmar GitHub och öppnar en PR med rättningen så fort en sårbarhet publiceras, i stället för att vänta på den veckovisa uppdateringen. Det är också reservplanen: GitHub stänger av schemalagda körningar i ett repo som inte har ändrats på 60 dagar. Får du ett mejl om det, slå på arbetsflödet igen under Actions.

Lägger du till ett beroende, kör `npm install paketet --save-dev` så att låsfilen uppdateras, och kör `npm audit` innan du committar.

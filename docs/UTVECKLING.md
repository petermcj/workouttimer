# Utveckling

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

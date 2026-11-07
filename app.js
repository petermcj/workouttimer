(function(){
// The app version is the one in the script link (app.js?v=crosscage-vN), which matches VERSION in sw.js.
const APP_VERSION=(/[?&]v=crosscage-v(\d+)/.exec((document.currentScript||{}).src||"")||[])[1]||"";
const $=id=>document.getElementById(id);
const EN={
"Plan":"Plan","Kör":"Run","Sparade pass":"Saved workouts","Ladda":"Load","Ta bort":"Delete",
"Namn, t.ex. Ben 45 min":"Name, e.g. Legs 45 min","Passets namn":"Workout name","Spara":"Save","Laddar sparade pass…":"Loading saved workouts…",
"Upplägg":"Structure","Stationer":"Stations","Minska":"Decrease","Öka":"Increase","st":"","Övningar per station":"Exercises per station",
"Set per övning":"Sets per exercise","Varv":"Rounds","Uppvärmning och genomgång":"Warm-up and demos","Uppvärmning":"Warm-up",
"i början av passet":"at the start of the workout","Instruktion per övning":"Demo per exercise","När instruktionen ges":"When demos happen",
"Samlad genomgång efter uppvärmning":"All demos after warm-up","Vid varje station i varv 1":"At each station in round 1",
"Fördelning arbete och vila":"Work and rest split","Läge":"Mode","Räkna från totaltid":"Calculate from total time","Sätt arbetstid själv":"Set work time myself",
"Total tid för passet":"Total workout time","inkl. alla pauser":"incl. all breaks","Arbete vs setvila":"Work vs set rest","andel arbete i varje set":"share of work in each set",
"Arbete per set":"Work per set","Vila mellan set":"Rest between sets","samma övning, set 1 → 2":"same exercise, set 1 → 2","Pauser vid byten":"Transition breaks",
"Byte övning A → B":"Switch exercise A → B","inom stationen":"within the station","Byte station":"Switch station","Vila mellan varv":"Rest between rounds",
"Arbete/set":"Work/set","Setvila":"Set rest","Per station":"Per station","Per varv":"Per round","Passet:":"Workout:","Arbete":"Work","Vila":"Rest",
"Uppv. + genomgång":"Warm-up + demos","Hela passet som tidslinje":"Whole workout as a timeline","Byte övning":"Exercise switch","Varvvila":"Round rest",
"Genomgång":"Demo","Ljud":"Sound","Nedräkning före slut":"Countdown before end","pip varje sekund de sista sekunderna av övningen":"a beep every second in the final seconds of the exercise",
"Nedräkning i vila":"Countdown during rest","Nedräkning bara i övning":"Countdown only during exercise","Även i vila och byten":"Also during rest and switches",
"Volym":"Volume","Välj ljud":"Choose sounds","Halvtidssignal":"Halfway signal","Halvtidssignal på (byt sida)":"Halfway signal on (switch sides)","Ingen halvtidssignal":"No halfway signal",
"Med musik i bakgrunden":"With music in the background","Ljud tillsammans med musik":"Sound with music","Blanda med musiken":"Mix with the music","Sänk musiken vid signal":"Lower the music during signals",
"Starta musiken i Spotify först och tryck sedan Start här. På iPhone: stäng av ljudlös-reglaget på sidan av telefonen, annars hörs inte klockan. Om det ändå är tyst, prova \"Sänk musiken vid signal\".":"Start the music in Spotify first, then press Start here. On iPhone, turn off the silent switch on the side of the phone, or the timer will not be heard. If it is still silent, try \"Lower the music during signals\".",
"Namnge övningar (valfritt)":"Name exercises (optional)","Till klockan →":"Go to timer →",
"Klockans ljud har stoppats av en annan app. Tryck här för att slå på ljudet igen.":"Another app has stopped the timer's sound. Tap here to turn it back on.",
"Redo":"Ready","Byt sida":"Switch sides","Tryck Start":"Press Start","Härnäst":"Up next","Föregående intervall":"Previous interval","◀ Bak":"◀ Back","Start":"Start",
"Nästa intervall":"Next interval","Fram ▶":"Next ▶","Gått":"Elapsed","Intervall":"Interval","Kvar":"Left","Börja om":"Restart","Öppna Spotify":"Open Spotify","Språk":"Language",
"Station {s} – övning {l}":"Station {s} – exercise {l}","Övning {l}":"Exercise {l}",
"Pauser, uppvärmning, genomgång, mellanövningar och stretch tar nästan hela tiden. Öka totaltiden eller dra ner på något av dem.":"Breaks, warm-up, demos, interval exercises and stretching take up almost all the time. Increase the total time or shorten one of them.",

"{st} stationer · {ex} övn · {sets} set · {rd} varv":"{st} stations · {ex} ex · {sets} sets · {rd} rounds",
"{n} övningar = {t}":"{n} exercises = {t}","{n} per varv":"{n} per round","{p} % arbete":"{p} % work",
"Ringklocka, tre slag":"Bell, three strikes","Ringklocka, ett slag":"Bell, one strike","Visselpipa":"Whistle","Tuta":"Horn","Summer":"Buzzer","Gong":"Gong",
"Trumslag":"Drum hits","Stigande pip":"Rising beeps","Fallande pip":"Falling beeps","Dubbelpip":"Double beep","Klockspel":"Chimes","Laser":"Laser","Inget ljud":"No sound",
"Pip":"Beep","Träkloss":"Wood block","Klick":"Click","Trumma":"Drum","Pling":"Ding",
"Övning startar":"Exercise starts","Halvtid":"Halfway","Nedräkning":"Countdown","Övning slut":"Exercise ends","Passet klart":"Workout done","Testa {x}":"Test {x}",
"Ljud: på":"Sound: on","Ljud: av":"Sound: off","Klart":"Done","Bra jobbat!":"Great work!","Varv {r}/{n}":"Round {r}/{n}",
"Gör dig redo":"Get ready","Passet startar":"Workout starting","Värm upp":"Warm up","Station {s} · före första set":"Station {s} · before the first set",
"Övning {n} av {t}":"Exercise {n} of {t}","Byt övning":"Switch exercise","Byt station":"Switch station",
"Varv {n} börjar med {x}":"Round {n} starts with {x}","Varv {n} klart":"Round {n} done","Genomgång: {x}":"Demo: {x}","Paus":"Pause","Fortsätt":"Resume",
"☀ Skärmen hålls tänd under passet.":"☀ The screen stays on during the workout.",
"Telefonen kan släcka skärmen. Stäng av automatiskt lås i telefonens inställningar under passet.":"The phone may turn off the screen. Turn off auto-lock in the phone's settings during the workout.",
"Sparas i ditt Claude-konto och följer med till andra enheter.":"Saved to your Claude account and available on your other devices.",
"Sparas i den här webbläsaren.":"Saved in this browser.",
"Kunde inte hämta sparade pass. Kontrollera anslutningen och ladda om sidan.":"Could not load saved workouts. Check your connection and reload the page.",
"Passet kunde inte läsas.":"The workout could not be read.","Laddade {x}.":"Loaded {x}.",
"Skriv ett namn på passet först.":"Enter a name for the workout first.","Uppdaterade {x}.":"Updated {x}.","Sparade {x}.":"Saved {x}.",
"Passet sparades inte. Kontrollera anslutningen och försök igen.":"The workout was not saved. Check your connection and try again.",
"Tog bort {x}.":"Deleted {x}.",
"Kunde inte ta bort passet. Försök igen.":"Could not delete the workout. Try again.","klocka":"timer","Tid per övning":"Time per exercise","En total tid":"One total time","Hur genomgången räknas":"How demo time is set","Genomgång totalt":"Total demo time","≈ {t} per övning":"≈ {t} per exercise","en samlad genomgång":"one combined demo","Alla övningar":"All exercises","{n} övningar":"{n} exercises","Blanda med musiken (tyst i ljudlöst läge)":"Mix with the music (silent in silent mode)","Hörs alltid, även i ljudlöst läge (kan pausa musiken)":"Always audible, even in silent mode (may pause music)","☀ Skärm tänd":"☀ Screen on","Skärm kan släckas":"Screen may turn off","Fokusläge":"Focus mode","Visa allt":"Show all","Tid för byten":"Time for switches","Egna tider för byten":"Own times for switches","Byten = vilan mellan set":"Switches = set rest","Vila och byten":"Rest and switches","Byte av övning och station tar lika lång tid som vilan mellan set i varje varv.":"Switching exercise and station takes as long as the set rest in each round.","Tider för byten ställs in per varv ovan.":"Switch times are set per round above.","gäller även byte av övning och station":"also used for switching exercise and station","Ordning på stationen":"Order at the station","Alla set av en övning i taget (A A B B)":"All sets of one exercise at a time (A A B B)","Växla övning mellan seten (A B A B)":"Switch exercise between sets (A B A B)","efter sista övningen, före nästa set":"after the last exercise, before the next set","mellan övningarna i varje set":"between the exercises in each set","Set per varv":"Sets per round","Samma antal set alla varv":"Same number of sets every round","Olika antal set per varv":"Different number of sets per round","Set per övning, varv {n}":"Sets per exercise, round {n}","Övningar: namn och egna tider":"Exercises: names and custom times","Tider per övning":"Times per exercise","Samma tider för alla övningar":"Same times for all exercises","Egna tider per övning":"Custom times per exercise","Lämna en ruta tom för att använda passets vanliga tid.":"Leave a box empty to use the workout's normal time.","Övningar med egna tider räknas bort först, och resten av totaltiden fördelas på de andra.":"Exercises with custom times are taken out first, and the rest of the total time is shared by the others.","({n} egna)":"({n} custom)","Tider per varv":"Times per round","Samma tider alla varv":"Same times every round","Olika tider per varv":"Different times per round","Varv {n}":"Round {n}","{w} s arbete / {p} s vila":"{w} s work / {p} s rest","Tid innan första övningen":"Time before the first exercise","efter uppvärmning och genomgång, för att gå till stationen":"after warm-up and demos, to get to the station","Gå till station 1":"Go to station 1","Passet börjar snart":"The workout starts soon","Till stationen":"To the station","Skapa en app på":"Create an app at","och välj Web API.":"and select Web API.","Lägg in den här adressen som Redirect URI:":"Add this address as the Redirect URI:","Kopiera adressen":"Copy address","Kopiera appens Client ID, klistra in här och tryck Anslut.":"Copy the app's Client ID, paste it here and press Connect.","Anslut":"Connect","Ansluten":"Connected","Koppla från":"Disconnect","Spellista vid start":"Playlist at start","Fortsätt med det som spelas":"Continue what is playing","Hämta spellistor och enheter igen":"Reload playlists and devices","Spela på":"Play on","Enheten som spelar just nu":"The device playing right now","Spotify och passet":"Spotify and the workout","Starta musiken när passet startar":"Start the music when the workout starts","Pausa musiken när passet pausas":"Pause the music when the workout pauses","Sänk volymen under vila":"Lower the volume during rest","Volym under arbete":"Volume during work","Volym under vila":"Volume during rest","Föregående låt":"Previous track","Spela eller pausa musiken":"Play or pause the music","Nästa låt":"Next track","Ansluten som {x}":"Connected as {x}","Klistra in ditt Client ID först.":"Paste your Client ID first.","Kopierad":"Copied","Markera adressen och kopiera den.":"Select the address and copy it.","Spotify-inloggningen avbröts. Försök igen.":"The Spotify sign-in was cancelled. Try again.","Inloggningen kunde inte slutföras. Starta anslutningen igen inifrån appen.":"The sign-in could not be completed. Start connecting again from inside the app.","Spotify svarade inte. Kontrollera Client ID och Redirect URI och försök igen.":"Spotify did not respond. Check the Client ID and Redirect URI and try again.","Kunde inte hämta spellistor.":"Could not load playlists.","Ingen Spotify-enhet är aktiv. Öppna Spotify, spela en låt en kort stund och försök igen.":"No Spotify device is active. Open Spotify, play a song briefly and try again.","Spotify Premium krävs, och ditt konto måste vara tillagt under User Management i Spotify-appen på utvecklarsidan.":"Spotify Premium is required, and your account must be added under User Management in your app on the developer site.","Volymen kan inte styras på den här enheten. Spotify på iPhone tillåter oftast inte det.":"The volume cannot be controlled on this device. Spotify on iPhone usually does not allow it.","Spotify: {x}":"Spotify: {x}","Inget spelas":"Nothing playing","Installera appen":"Install the app","Låsskärm och musik":"Lock screen and music","Musik i en annan app (rekommenderas)":"Music in another app (recommended)","Klockan på låsskärmen (pausar annan musik)":"Timer on the lock screen (pauses other music)","På iPhone kan bara en app i taget visas på låsskärmen. Med klockan på låsskärmen syns fas och tid där och klockan piper även när skärmen är låst, men musik i andra appar, till exempel Spotify, pausas när passet startar. Spelar du musik, välj det första alternativet och låt skärmen vara tänd.":"On iPhone only one app at a time can show on the lock screen. With the timer on the lock screen, the phase and time show there and the timer beeps while the screen is locked, but music in other apps, such as Spotify, is paused when the workout starts. If you play music, choose the first option and keep the screen on.","Klockan visas på låsskärmen, därför pausas musik i andra appar.":"The timer shows on the lock screen, so music in other apps is paused.","Stäng av":"Turn off","Titta på: {x}":"Watch: {x}","Med egna kommentarer":"With own comments","Har egna kommentarer":"Has own comments","Utförande":"How to do it","Titta särskilt på":"Watch especially","Egna kommentarer":"Own comments","T.ex. hur ni gör i er box, utrustning, lättare och tyngre varianter":"E.g. how you do it in your box, equipment, easier and harder versions","Hur övningen görs":"How the exercise is done","Vanliga fel och vad instruktören ska vara noga med":"Common faults and what the instructor should watch for","Appens övningar har instruktioner och vad du ska titta extra på. Skriv egna kommentarer på dem, eller lägg till egna övningar. Instruktionerna visas i klockan under genomgången.":"The app's exercises have instructions and what to watch for. Write your own comments on them, or add your own exercises. The instructions show on the timer during demos.","▶ Kör passet":"▶ Run the workout","▶ Kör":"▶ Run","Öppna passet":"Open the workout","Passet används som standard för nya pass.":"The workout is now the default for new workouts.","Använd öppet pass som standard":"Use the open workout as default","Nya pass kan börja med de här värdena: set, varv, tider, pauser, mellanövning, stretch och marginal. Ställ in ett pass som du vill ha det och tryck Använd öppet pass som standard. Stationer och övningar ingår inte.":"New workouts can start with these values: sets, rounds, times, breaks, interval exercise, stretching and margin. Set up a workout the way you want it and press Use the open workout as default. Stations and exercises are not included.","Spara allt i en fil: dina pass, övningar med beskrivningar, standardvärden och inställningar. Läs in filen igen om appen har krånglat, på en ny telefon eller efter en ny version.":"Save everything in one file: your workouts, exercises with descriptions, defaults and settings. Load the file again if the app has had problems, on a new phone or after a new version.","Allt du ändrar i ett pass sparas automatiskt. Det senast använda passet ligger överst.":"Everything you change in a workout is saved automatically. The most recently used workout is at the top.","Nästa: Övningar →":"Next: Exercises →","Nästa: Tider →":"Next: Times →","Mina standardvärden":"My defaults","Alla övningar togs bort.":"All exercises were removed.","Station":"Station","Ändringar sparas automatiskt.":"Changes are saved automatically.","Station {n}":"Station {n}","Flytta upp station {n}":"Move station {n} up","Flytta ned station {n}":"Move station {n} down","Ta bort station {n}":"Remove station {n}","Station {n} togs bort.":"Station {n} was removed.","Välj övning":"Choose exercise","station {n}":"station {n}","Ta bort {x} från station {n}":"Remove {x} from station {n}","+ Övning {l}":"+ Exercise {l}","Ny övning: {x}":"New exercise: {x}","Läggs till i Övningar":"Added to Exercises","Pass utan namn":"Untitled workout","Sparar…":"Saving…","Sparat":"Saved","Kunde inte spara":"Could not save","Inga pass än. Tryck Nytt pass för att börja.":"No workouts yet. Press New workout to start.","Öppet":"Open","kört {d}":"run {d}","{x} (kopia)":"{x} (copy)","Kopian {x} är öppen.":"The copy {x} is open.","Passet kunde inte sparas. Kontrollera anslutningen och försök igen.":"The workout could not be saved. Check the connection and try again.","Pass {d}":"Workout {d}","Kopia av {x}":"Copy of {x}","{x} (ändrad)":"{x} (changed)","Din plan sparades som {x}.":"Your plan was saved as {x}.","Klart: {n} pass och {e} övningar lästes in. Inställningarna återställdes.":"Done: {n} workouts and {e} exercises were loaded. The settings were restored.","Klocka":"Timer","‹ Alla pass":"‹ All workouts","Tider":"Times","Beskrivning":"Description","Duplicera":"Duplicate","Använd som standard för nya pass":"Use as default for new workouts","Ta bort passet":"Delete the workout","Lägg till en station genom att välja dess första övning. Flera övningar på samma station blir A, B och så vidare.":"Add a station by choosing its first exercise. Several exercises at the same station become A, B and so on.","+ Lägg till station":"+ Add station","Töm alla övningar":"Clear all exercises","Set och varv":"Sets and rounds","Nästa →":"Next →","+ Nytt pass":"+ New workout","Beskrivning (valfritt)":"Description (optional)","Börja från":"Start from","Avbryt":"Cancel","Skapa pass":"Create workout","Stäng":"Close","Steg":"Steps","T.ex. fokus, utrustning eller vem passet passar":"E.g. focus, equipment or who the workout suits","Sök, eller skriv en ny övning":"Search, or type a new exercise","Redigera":"Edit","Nytt":"New","Nytt pass":"New workout","Standard för nya pass":"Defaults for new workouts","Nytt pass börjar med de här värdena: upplägg, tider, pauser, mellanövning, stretch och marginal. Ställ in Plan som du vill ha det och tryck Använd Plan som standard. Övningarnas namn ingår inte.":"A new workout starts with these values: structure, times, breaks, interval exercise, stretching and margin. Set up Plan the way you want it and press Use Plan as default. Exercise names are not included.","Använd Plan som standard":"Use Plan as default","Återställ appens standard":"Reset to the app's defaults","Dina standardvärden":"Your defaults","Appens standard":"The app's defaults","{n} övn":"{n} ex","{n} set":"{n} sets","uppvärmning {n} min":"warm-up {n} min","Nytt pass med dina standardvärden.":"New workout with your defaults.","Nytt pass med appens standard.":"New workout with the app's defaults.","Nytt pass.":"New workout.","Plan används som standard för nya pass.":"Plan is now the default for new workouts.","Nya pass börjar med appens standard.":"New workouts start with the app's defaults.","Version {v}":"Version {v}","En ny version av appen finns.":"A new version of the app is available.","Ladda om":"Reload","Ändringarna är inte sparade":"The changes are not saved","Ändringar i {x} är inte sparade":"Changes to {x} are not saved","Skriv ett namn på passet och tryck Spara.":"Type a name for the workout and press Save.","Det gick inte att ångra. Kontrollera anslutningen.":"Could not undo. Check the connection.","Passen kunde inte sparas. Kontrollera anslutningen eller lagringsutrymmet och försök igen.":"The workouts could not be saved. Check the connection or storage space and try again.","Inläsningen ångrades.":"The import was undone.","Meny":"Menu","Pass":"Workouts","Övningar":"Exercises","Inställningar":"Settings","Passet":"Workout","Mina pass":"My workouts","Ett sparat pass innehåller upplägg, tider och övningar. Använd det som det är, eller som mall för ett nytt pass.":"A saved workout holds the structure, times and exercises. Use it as it is, or as a template for a new workout.","Inbyggda mallar":"Built-in templates","En inbyggd mall ställer in upplägget. Övningarna i Plan behålls.":"A built-in template sets up the structure. The exercises in Plan are kept.","Säkerhetskopia":"Backup","Spara allt i en fil: dina pass, övningar med beskrivningar, passet i Plan och inställningarna. Läs in filen igen om appen har krånglat, på en ny telefon eller efter en ny version.":"Save everything in one file: your workouts, exercises with descriptions, the workout in Plan and the settings. Load the file again if the app has had problems, on a new phone or after a new version.","Exportera":"Export","Importera":"Import","Sök övning":"Search exercises","Lägg till övning":"Add exercise","Svenska":"Svenska","English":"English","Inställningarna gäller den här telefonen och följer inte med när du laddar ett pass.":"The settings apply to this phone and do not change when you load a workout.","{n} stationer":"{n} stations","{n} varv":"{n} rounds","stretch {n} min":"stretching {n} min","mellanövning":"interval exercise","Öppna i Plan":"Open in Plan","Inga sparade pass än. Bygg ett pass i Plan och tryck Spara.":"No saved workouts yet. Build a workout in Plan and press Save.","Alla":"All","Ben":"Legs","Drag":"Pull","Press":"Push","Bål":"Core","Kondition":"Cardio","Egna":"Own","Egen":"Own","Namn":"Name","Grupp":"Group","Ingen grupp":"No group","Ta bort övningen":"Delete the exercise","Inga övningar matchar.":"No exercises match.","Ny övning":"New exercise","Säkerhetskopian är klar: {n} pass och {e} egna övningar och beskrivningar.":"The backup is ready: {n} workouts and {e} own exercises and descriptions.","Säkerhetskopian {f} har laddats ned: {n} pass och {e} egna övningar och beskrivningar.":"The backup {f} has been downloaded: {n} workouts and {e} own exercises and descriptions.","Filen är för stor för att vara en säkerhetskopia.":"The file is too large to be a backup.","Filen kunde inte läsas. Välj en säkerhetskopia från appen.":"The file could not be read. Choose a backup from the app.","Det här är inte en säkerhetskopia från appen.":"This is not a backup from the app.","Läser in…":"Loading…","Klart: {n} pass och {e} övningar lästes in. Passet i Plan och inställningarna återställdes.":"Done: {n} workouts and {e} exercises were loaded. The workout in Plan and the settings were restored.","Säkerhetskopian lästes in.":"The backup was loaded.","Mallar":"Templates","En mall ställer in upplägget. Namnen på övningarna behålls.":"A template sets up the structure. The exercise names are kept.","Mallen {x} används.":"Using the template {x}.","{m} min · {n} övningar":"{m} min · {n} stretches","Röst läser upp övningar":"Voice reads out exercises","Ingen röst":"No voice","Röst":"Voice","Rösten är på":"Voice is on","Passet är klart. Bra jobbat!":"The workout is done. Well done!","Gå till första stationen":"Go to the first station","Den här webbläsaren kan inte läsa upp text.":"This browser cannot read text aloud.","Rösten säger övningens namn när arbetet börjar, och vila, byten och stretch. Den använder telefonens talsyntes och hörs inte alltid när skärmen är låst.":"The voice says the exercise name when work starts, plus rest, switches and stretches. It uses the phone's speech and is not always heard while the screen is locked.","Ändra tiden":"Change the time","30 sekunder kortare":"30 seconds shorter","30 sekunder längre":"30 seconds longer","Nytt stretchförslag.":"New stretch suggestion.","Tomma övningar fylldes med förslag.":"Empty exercises were filled with suggestions.","Alla namn togs bort.":"All names were removed.","Ångra":"Undo","Nästa stretch":"Next stretch","De sista {x} får inte plats (minst 5 s per övning).":"The last {x} do not fit (at least 5 s each).","Stretch i slutet":"Stretching at the end","Stretch":"Stretching","efter sista varvet":"after the last round","Stretchövningar, en per rad. Tiden delas lika mellan dem.":"Stretches, one per line. The time is shared evenly between them.","Föreslå stretch":"Suggest stretches","Mellanövning":"Interval exercise","Ingen":"None","Mellan varv":"Between rounds","Efter stationer":"After stations","Efter var":"After every","station":"station","Tid för mellanövningen":"Time for the interval exercise","alla gör samma övning":"everyone does the same exercise","Mellanövningar, en per rad. De tas i tur och ordning.":"Interval exercises, one per line. They are used in turn.","till städning eller frågor":"for tidying up or questions","Uppv., genomgång, stretch":"Warm-up, demos, stretching","Visa i klockan":"Show on the timer","Övningens namn":"Exercise name","Övning 1, 2, 3":"Exercise 1, 2, 3","Övning A, B":"Exercise A, B","Namn på övningarna":"Exercise names","Skriv eller välj ur övningsbanken. Övningar du skrivit in själv kommer också med i listan.":"Type or pick from the exercise bank. Exercises you have typed yourself are in the list too.","Fyll tomma med förslag":"Fill empty with suggestions","Töm alla namn":"Clear all names","Klockan visar namnen nedan.":"The timer shows the names below.","Bra när deltagarna börjar på olika stationer. Klockan visar bara vilken övning på stationen det är, inte namnet.":"Good when participants start at different stations. The timer shows only which exercise at the station it is, not its name.","{n} mellanövningar i hela passet":"{n} interval exercises in the whole workout","Passet har bara ett varv, så det blir ingen mellanövning.":"The workout has only one round, so there is no interval exercise.","Före och efter mellanövningen räknas ett stationsbyte.":"A station switch is counted before and after the interval exercise.","Det blir ingen mellanövning med de här inställningarna.":"These settings give no interval exercise.","{n} övningar, {t} per övning. Klockan säger till när det är dags för nästa.":"{n} stretches, {t} each. The timer signals when it is time for the next one.","Till mellanövningen":"To the interval exercise","alla gör samma":"everyone does the same","Stretcha":"Stretch","{n} av {t}":"{n} of {t}","Tid kvar i slutet":"Time left at the end","Får dra över":"May run over","Får dra över med":"May run over by","om jämna tider inte går jämnt ut":"if even times do not add up exactly","Marginal":"Margin","Avrundning":"Rounding","Jämna tider (5 s)":"Even times (5 s)","Exakta sekunder":"Exact seconds","Under passet":"During the workout","Håll sluttiden":"Keep the end time","Följ planen":"Follow the plan","Om passet pausas eller du backar kortas arbete och setvila resten av passet så att det slutar senast {t} efter start.":"If the workout is paused or you go back, work and set rest are shortened for the rest of the workout so it ends no later than {t} after the start.","Om passet pausas eller du backar kortas arbete och setvila resten av passet så att det slutar på planerad tid.":"If the workout is paused or you go back, work and set rest are shortened for the rest of the workout so it ends at the planned time.","Arbete blir aldrig kortare än 10 s och vila aldrig kortare än 5 s.":"Work never gets shorter than 10 s and rest never shorter than 5 s.","Klockan kör tiderna som de är planerade, även om passet pausas.":"The timer runs the times as planned, even if the workout is paused.","Slutar precis på {t} min.":"Ends exactly at {t} min.","Slutar {x} före {t} min.":"Ends {x} before {t} min.","Drar över {x} (högst {m} min tillåtet).":"Runs over by {x} (at most {m} min allowed).","Jämna tider lämnar {x} oanvänt. Välj exakta sekunder, eller använd tiden till uppvärmning eller vila mellan varv.":"Even times leave {x} unused. Choose exact seconds, or use the time for warm-up or rest between rounds.","Slutar ca {t}":"Ends about {t}","{x} sent, går inte att korta mer":"{x} late, cannot shorten more","{x} efter planen":"{x} behind plan","arbete och vila kortade {x} för att hinna":"work and rest shortened by {x} to finish on time"
};
let lang="sv";
try{lang=localStorage.getItem("ccage_lang")||((navigator.language||"sv").toLowerCase().startsWith("sv")?"sv":"en")}catch(e){lang=(navigator.language||"sv").toLowerCase().startsWith("sv")?"sv":"en"}
function T(s,v){let r=(lang==="en"&&EN[s]!=null)?EN[s]:s;if(v)r=r.replace(/\{(\w+)\}/g,(_,k)=>v[k]);return r}
const staticNodes=[],staticAttrs=[];
(function collect(){
  const skip=n=>n.parentElement&&n.parentElement.closest("#sndList,#exList,select,script,style");
  const w=document.createTreeWalker(document.querySelector(".wrap"),NodeFilter.SHOW_TEXT);
  let n;while((n=w.nextNode())){const t=n.nodeValue.trim();if(t&&!skip(n)&&EN[t]!=null){const m=n.nodeValue.match(/^(\s*)[\s\S]*?(\s*)$/);staticNodes.push([n,t,m[1],m[2]])}}
  document.querySelectorAll(".wrap [placeholder],.wrap [aria-label]").forEach(el=>{["placeholder","aria-label"].forEach(a=>{const v=el.getAttribute(a);if(v&&EN[v]!=null)staticAttrs.push([el,a,v])})});
})();
function applyStatic(){
  document.documentElement.lang=lang;
  staticNodes.forEach(([n,t,a,b])=>{const v=T(t);n.nodeValue=(t==="klocka"&&lang==="en"?" ":a)+v+b});
  staticAttrs.forEach(([el,a,v])=>el.setAttribute(a,T(v)));
  document.querySelectorAll("[data-lang]").forEach(b=>b.setAttribute("aria-pressed",b.dataset.lang===lang));
}
applyStatic();
// Exercise bank: [Swedish, English, group]. The groups steer the fill-in and stretch suggestions.
const BANK=[
["Knäböj","Squats","legs"],["Utfall","Lunges","legs"],["Bulgarian split squat","Bulgarian split squat","legs"],["Goblet squat","Goblet squat","legs"],["Marklyft","Deadlift","legs"],["Raka marklyft","Romanian deadlift","legs"],["Kettlebell swing","Kettlebell swing","legs"],["Step-ups","Step-ups","legs"],["Höftlyft","Hip thrust","legs"],["Wall sit","Wall sit","legs"],["Upphopp","Jump squats","legs"],
["Rodd med hantel","Dumbbell row","pull"],["Rodd i ringar","Ring rows","pull"],["Chins","Chin-ups","pull"],["Pull-ups","Pull-ups","pull"],["Renegade row","Renegade row","pull"],["Bicepscurl","Biceps curl","pull"],["Face pulls","Face pulls","pull"],["High pull","High pull","pull"],
["Armhävningar","Push-ups","push"],["Axelpress","Shoulder press","push"],["Bänkpress","Bench press","push"],["Dips","Dips","push"],["Push press","Push press","push"],["Thrusters","Thrusters","push"],["Pike push-ups","Pike push-ups","push"],
["Planka","Plank","core"],["Sidoplanka","Side plank","core"],["Situps","Sit-ups","core"],["Russian twist","Russian twist","core"],["Dead bug","Dead bug","core"],["Hollow hold","Hollow hold","core"],["Mountain climbers","Mountain climbers","core"],["Farmers walk","Farmer's walk","core"],["Rygglyft","Back extensions","core"],
["Burpees","Burpees","cardio"],["Hopprep","Jump rope","cardio"],["Roddmaskin","Rowing machine","cardio"],["Airbike","Air bike","cardio"],["Box jumps","Box jumps","cardio"],["Jumping jacks","Jumping jacks","cardio"],["Höga knän","High knees","cardio"],["Skierg","SkiErg","cardio"],["Wall balls","Wall balls","cardio"],["Slam ball","Ball slams","cardio"],["Battle ropes","Battle ropes","cardio"]
];
const STRETCH=[
["Höftböjare i utfallsställning","Hip flexor lunge stretch","legs"],["Framsida lår stående","Standing quad stretch","legs"],["Baksida lår sittande","Seated hamstring stretch","legs"],["Vader mot vägg","Calf stretch against the wall","legs"],["Duvan (säte)","Pigeon pose (glutes)","legs"],["Fjärilen (ljumskar)","Butterfly (groin)","legs"],
["Arm över bröstet (bakre axel)","Cross-body shoulder stretch","pull"],["Sidosträck med armen över huvudet","Standing side bend","pull"],["Övre rygg, rund rygg","Upper back stretch","pull"],
["Bröst mot vägg","Chest stretch against the wall","push"],["Triceps över huvudet","Overhead triceps stretch","push"],["Framsida axel","Front shoulder stretch","push"],
["Kobran","Cobra","core"],["Katt och ko","Cat-cow","core"],["Bålrotation liggande","Lying spinal twist","core"],
["Barnets position","Child's pose","full"],["Nedåtgående hund","Downward dog","full"],["Djup knäböj, sittande","Deep squat hold","full"]
];
// Instructions for the built-in exercises: Swedish name → [how (sv), what to watch (sv), how (en), what to watch (en)].
// "What to watch" is for the instructor: common faults and easier versions.
const INFO={
"Knäböj":["Fötterna axelbrett, tårna lätt utåt. Sätt dig bakåt och ned tills låren är minst parallella med golvet, res dig genom hela foten.","Knäna följer tårna och faller inte inåt, hälarna kvar i golvet, rak och stolt rygg.","Feet shoulder-width, toes slightly out. Sit back and down until the thighs are at least parallel to the floor, stand up through the whole foot.","Knees track over the toes and don't cave in, heels stay down, back straight and proud."],
"Utfall":["Ta ett långt kliv framåt och sänk bakre knät mot golvet. Tryck ifrån med främre foten tillbaka till start.","Främre knät över foten och inte inåt, överkroppen upprätt, bakre knät nästan nere i golvet.","Take a long step forward and lower the back knee toward the floor. Push off the front foot back to the start.","Front knee over the foot and not inward, upper body upright, back knee nearly touching the floor."],
"Bulgarian split squat":["Bakre foten på en bänk, främre foten en bit framför. Sänk dig rakt ned och res dig genom främre hälen.","Lagom avstånd så att främre knät inte glider långt fram, höften rak, stabil balans.","Back foot on a bench, front foot well in front. Lower straight down and stand up through the front heel.","Enough distance that the front knee doesn't drift far forward, hips square, steady balance."],
"Goblet squat":["Håll kettlebell eller hantel mot bröstet med armbågarna nedåt. Gå ned i en djup knäböj med armbågarna innanför knäna.","Upprätt bröst, vikten kvar mot bröstet, knäna följer tårna.","Hold a kettlebell or dumbbell at the chest, elbows down. Squat deep with the elbows inside the knees.","Chest up, weight stays at the chest, knees track over the toes."],
"Marklyft":["Stången nära smalbenen, höftbrett grepp. Spänn bålen och lyft genom att pressa fötterna i golvet, sträck höft och knän samtidigt.","Neutral rygg hela vägen, stången nära kroppen, ingen rundad ländrygg och ingen bakåtlutning i toppen.","Bar close to the shins, hip-width grip. Brace the core and lift by pushing the feet into the floor, extending hips and knees together.","Neutral back all the way, bar close to the body, no rounded lower back and no leaning back at the top."],
"Raka marklyft":["Lätt böjda knän. Fäll i höften med vikten nära benen tills baksida lår sträcks, res dig genom att föra höften framåt.","Rörelsen sker i höften, ryggen förblir neutral, vikten nära benen.","Soft knees. Hinge at the hips with the weight close to the legs until the hamstrings stretch, stand up by driving the hips forward.","Movement comes from the hips, back stays neutral, weight close to the legs."],
"Kettlebell swing":["Fäll i höften och för klotet mellan benen, sträck sedan höften explosivt så att klotet svingar upp till bröst- eller ögonhöjd.","Kraften kommer från höften, inte från armarna eller en knäböj. Spänd bål och rak rygg i botten, stå rak i toppen.","Hinge and swing the bell between the legs, then extend the hips explosively so it floats to chest or eye height.","Power comes from the hips, not the arms or a squat. Braced core and flat back at the bottom, stand tall at the top."],
"Step-ups":["Hela foten upp på lådan, tryck dig upp tills du står rakt och kliv kontrollerat ned. Växla ben eller kör ett ben i taget.","Tryck genom foten på lådan i stället för att ta fart med nedre benet, knät över foten.","Whole foot on the box, drive up until standing tall and step down with control. Alternate legs or do one side at a time.","Push through the foot on the box rather than bouncing off the lower leg, knee over the foot."],
"Höftlyft":["Övre ryggen mot en bänk eller ligg på golvet, fötterna nära rumpan. Pressa höften upp tills knä, höft och axlar är i linje.","Kläm ihop sätet i toppen utan att svanka, hakan lätt indragen.","Upper back on a bench or lie on the floor, feet close to the hips. Drive the hips up until knees, hips and shoulders line up.","Squeeze the glutes at the top without arching the lower back, chin slightly tucked."],
"Wall sit":["Ryggen mot väggen, glid ned tills knäna är i ungefär rät vinkel och håll positionen.","Knäna över anklarna, hela ryggen mot väggen, jämn andning.","Back against the wall, slide down until the knees are at about a right angle and hold.","Knees over the ankles, whole back against the wall, steady breathing."],
"Upphopp":["Gå ned i en kvarts- till halv knäböj och hoppa explosivt rakt upp. Landa mjukt och gå direkt in i nästa.","Mjuk landning på hela foten med knäna i linje med tårna. Knäböj utan hopp vid ont i knän.","Dip into a quarter to half squat and jump straight up explosively. Land softly and go straight into the next.","Soft landing on the whole foot with knees in line with the toes. Squats without the jump for sore knees."],
"Rodd med hantel":["Ena handen och knät på en bänk, rak rygg. Dra hanteln mot höften med armbågen nära kroppen och sänk kontrollerat.","Ryggen stilla och parallell med golvet, dra med ryggen och inte bara armen, ingen vridning.","One hand and knee on a bench, flat back. Pull the dumbbell to the hip, elbow close to the body, and lower with control.","Back still and parallel to the floor, pull with the back and not just the arm, no twisting."],
"Rodd i ringar":["Häng i ringarna med rak kropp och hälarna i golvet. Dra bröstet mot ringarna och sänk kontrollerat.","Kroppen rak som en planka, skulderbladen bakåt och nedåt. Ju mer upprätt man står, desto lättare.","Hang from the rings with a straight body, heels on the floor. Pull the chest to the rings and lower with control.","Body straight like a plank, shoulder blades back and down. The more upright, the easier."],
"Chins":["Underhandsgrepp, axelbrett. Dra dig upp tills hakan är över stången och sänk dig hela vägen ned.","Hela rörelsebanan och ingen sparkning. Gummiband, eller hopp upp och långsam sänkning, som lättare variant.","Underhand grip, shoulder-width. Pull up until the chin clears the bar and lower all the way down.","Full range and no kicking. A band, or jumping up and lowering slowly, for an easier version."],
"Pull-ups":["Överhandsgrepp, lite bredare än axlarna. Dra bröstet mot stången och sänk dig till raka armar.","Starta rörelsen med skulderbladen, ingen gungning om inte kipping är tänkt. Gummiband som lättare variant.","Overhand grip, slightly wider than the shoulders. Pull the chest toward the bar and lower to straight arms.","Start with the shoulder blades, no swinging unless kipping is intended. A band for an easier version."],
"Renegade row":["Armhävningsposition med händerna på hantlar och fötterna brett. Ro en hantel i taget utan att höften vrider sig.","Höften stilla och i linje, spänd bål. Bredare fötter gör övningen stabilare.","Push-up position with hands on dumbbells, feet wide. Row one dumbbell at a time without the hips rotating.","Hips still and level, braced core. Wider feet make it more stable."],
"Bicepscurl":["Stå stadigt med armbågarna mot sidorna. Böj armarna och lyft vikten mot axlarna, sänk långsamt.","Armbågarna stilla, ingen gungning med ryggen.","Stand tall with the elbows at your sides. Curl the weight toward the shoulders and lower slowly.","Elbows stay still, no swinging with the back."],
"Face pulls":["Rep eller gummiband i ansiktshöjd. Dra mot ansiktet med armbågarna högt och för isär händerna i slutet.","Armbågarna högre än händerna, skulderbladen ihop, inget svank.","Rope or band at face height. Pull toward the face with high elbows and pull the hands apart at the end.","Elbows above the hands, shoulder blades together, no arching."],
"High pull":["Från höften: sträck explosivt i höft och knän och dra vikten mot bröstet med armbågarna högt och utåt.","Kraften kommer från benen, armbågarna över händerna, vikten nära kroppen.","From the hips: extend hips and knees explosively and pull the weight to the chest with the elbows high and out.","Power comes from the legs, elbows above the hands, weight close to the body."],
"Armhävningar":["Händerna under axlarna och kroppen rak. Sänk bröstet mot golvet och tryck upp till raka armar.","Rak linje från huvud till hälar, armbågarna snett bakåt och inte rakt ut. Knästående eller händerna på en bänk som lättare variant.","Hands under the shoulders, body straight. Lower the chest to the floor and press up to straight arms.","Straight line from head to heels, elbows angled back rather than straight out. On the knees or hands on a bench for an easier version."],
"Axelpress":["Vikten vid axlarna, spänd bål och säte. Pressa rakt upp tills armarna är raka över huvudet.","Inget svank, huvudet fram mellan armarna i toppen, kontrollerad sänkning.","Weight at the shoulders, core and glutes tight. Press straight up until the arms are straight overhead.","No arching, head through between the arms at the top, controlled lowering."],
"Bänkpress":["Ligg med fötterna i golvet och skulderbladen ihop. Sänk vikten till bröstet och pressa upp.","Handlederna rakt över armbågarna, kontrollerad sänkning och ingen studs. Passning vid skivstång.","Lie with the feet on the floor and shoulder blades together. Lower the weight to the chest and press up.","Wrists straight over the elbows, controlled lowering and no bounce. Use a spotter with a barbell."],
"Dips":["Raka armar på stängerna, eller händerna på en bänk. Sänk dig tills överarmarna är ungefär parallella med golvet och pressa upp.","Axlarna bort från öronen, inte för djupt vid ont i axlarna. Fötterna i golvet som lättare variant.","Straight arms on bars, or hands on a bench. Lower until the upper arms are about parallel to the floor, then press up.","Shoulders away from the ears, not too deep with sore shoulders. Feet on the floor for an easier version."],
"Push press":["Vikten vid axlarna. Gör en kort, rak knäböjning och pressa vikten upp med kraften från benen.","Knäböjningen kort och rakt ned, hälarna i golvet tills benen sträcks, inget svank i toppen.","Weight at the shoulders. Dip briefly straight down and drive the weight up with power from the legs.","Short, straight dip, heels down until the legs extend, no arching at the top."],
"Thrusters":["Frontknäböj med vikten vid axlarna, och pressa vikten över huvudet i samma rörelse när du reser dig.","Djup och kontrollerad knäböj, armbågarna högt, använd farten från benen.","Front squat with the weight at the shoulders, pressing overhead in the same movement as you stand.","Deep, controlled squat, elbows high, use the drive from the legs."],
"Pike push-ups":["Händer och fötter i golvet med höften högt. Böj armarna och sänk huvudet mot golvet framför händerna, tryck upp.","Höften kvar högt, armbågarna snett bakåt. Fötterna på en låda gör övningen tyngre.","Hands and feet on the floor, hips high. Bend the arms to lower the head toward the floor in front of the hands, press up.","Hips stay high, elbows angled back. Feet on a box makes it harder."],
"Planka":["Underarmarna i golvet under axlarna och kroppen rak från huvud till hälar. Håll.","Höften varken för högt eller hängande, spänd mage och säte, jämn andning.","Forearms on the floor under the shoulders, body straight from head to heels. Hold.","Hips neither too high nor sagging, abs and glutes tight, steady breathing."],
"Sidoplanka":["Underarmen under axeln, fötterna på varandra eller förskjutna. Lyft höften så att kroppen blir rak och håll, byt sida halvvägs.","Höften framåt och uppe, axeln rakt över armbågen. Nedre knät i golvet som lättare variant.","Forearm under the shoulder, feet stacked or staggered. Lift the hips so the body is straight and hold, switch sides halfway.","Hips forward and up, shoulder over the elbow. Bottom knee down for an easier version."],
"Situps":["Ligg med böjda knän och fötterna i golvet. Rulla upp till sittande och kontrollerat ned igen.","Dra inte i nacken, rörelsen kommer från magen. Förankrade fötter gör övningen lättare.","Lie with bent knees and feet on the floor. Roll up to sitting and back down with control.","Don't pull on the neck, the movement comes from the abs. Anchored feet make it easier."],
"Russian twist":["Sitt med bakåtlutad överkropp och böjda knän. Vrid överkroppen från sida till sida, med eller utan vikt.","Rak rygg och vridning från bålen, inte bara armarna. Fötterna i golvet som lättare variant.","Sit leaning back with bent knees. Rotate the upper body from side to side, with or without weight.","Straight back, rotate from the trunk and not just the arms. Feet on the floor for an easier version."],
"Dead bug":["Ligg på rygg med armarna rakt upp och knäna över höften. Sträck motsatt arm och ben mot golvet och växla.","Ländryggen kvar mot golvet hela tiden, långsamt och kontrollerat.","Lie on your back, arms straight up, knees over the hips. Extend the opposite arm and leg toward the floor and alternate.","Lower back stays on the floor the whole time, slow and controlled."],
"Hollow hold":["Ligg på rygg och lyft skuldror och ben från golvet med armarna sträckta bakåt. Håll.","Ländryggen pressad mot golvet. Böjda knän eller armarna längs sidorna som lättare variant.","Lie on your back and lift the shoulders and legs off the floor with the arms reaching overhead. Hold.","Lower back pressed into the floor. Bent knees or arms by the sides for an easier version."],
"Mountain climbers":["Armhävningsposition. Dra knäna växelvis mot bröstet i högt tempo.","Axlarna över händerna, höften låg och stilla.","Push-up position. Drive the knees alternately toward the chest at a fast pace.","Shoulders over the hands, hips low and steady."],
"Farmers walk":["Bär tunga vikter i händerna och gå med korta, kontrollerade steg.","Rak och stolt hållning, axlarna nere, spänd bål och ingen lutning åt sidan.","Carry heavy weights in the hands and walk with short, controlled steps.","Tall posture, shoulders down, core braced and no leaning to the side."],
"Rygglyft":["Ligg på mage eller i en ryggresningsbänk. Lyft överkroppen kontrollerat till rak kropp och sänk igen.","Lyft till rak linje utan överdrivet svank, nacken i linje med ryggen.","Lie face down or in a back extension bench. Raise the upper body with control to a straight line and lower again.","Lift to a straight line without over-arching, neck in line with the spine."],
"Burpees":["Ned i armhävningsposition med bröstet mot golvet, upp till fötterna och avsluta med ett hopp med händerna över huvudet.","Rak kropp i botten och mjuk landning. Kliv bakåt och fram i stället för att hoppa som lättare variant.","Down to push-up position with the chest to the floor, back to the feet and finish with a jump, hands overhead.","Straight body at the bottom and a soft landing. Step back and forward instead of jumping for an easier version."],
"Hopprep":["Små hopp på framfoten med repet roterande från handlederna.","Lätta hopp, armbågarna nära kroppen. Hoppa utan rep i samma rytm om repet krånglar.","Small hops on the balls of the feet with the rope turned from the wrists.","Light jumps, elbows close to the body. Jump without a rope in the same rhythm if it keeps tripping."],
"Roddmaskin":["Tryck med benen, luta dig lätt bakåt och dra handtaget till nedre revbenen. Tillbaka i omvänd ordning: armar, kropp, ben.","Benen först i draget, rak rygg, armarna raka tills benen nästan är sträckta.","Drive with the legs, lean back slightly and pull the handle to the lower ribs. Return in reverse: arms, body, legs.","Legs first in the drive, straight back, arms straight until the legs are almost extended."],
"Airbike":["Trampa och tryck och dra med armarna i jämn takt. Anpassa intensiteten efter intervallen.","Sadeln i höfthöjd, rak rygg, jämnt tempo i stället för att ta ut sig direkt.","Pedal while pushing and pulling with the arms at a steady pace. Match the intensity to the interval.","Seat at hip height, straight back, an even pace instead of going all out at once."],
"Box jumps":["Gör en kort knäböjning och hoppa upp på lådan, landa mjukt med hela foten och stå rakt. Kliv ned.","Mjuk landning med knäna i linje med tårna, kliv ned i stället för att hoppa ned. Lägre låda eller step-ups som lättare variant.","Dip and jump onto the box, land softly on the whole foot and stand tall. Step down.","Soft landing with the knees in line with the toes, step down rather than jumping down. A lower box or step-ups for an easier version."],
"Jumping jacks":["Hoppa ut med fötterna samtidigt som armarna går upp, och hoppa tillbaka in.","Lätta hopp på framfoten. Kliv åt sidan i stället för att hoppa som skonsammare variant.","Jump the feet out as the arms go up, and jump back in.","Light hops on the balls of the feet. Step to the side instead of jumping for a gentler version."],
"Höga knän":["Spring på stället och lyft knäna till höfthöjd med aktiva armar.","Upprätt överkropp och landning på framfoten. Marsch i stället för löpning som lättare variant.","Run on the spot lifting the knees to hip height with active arms.","Upright body, landing on the balls of the feet. March instead of run for an easier version."],
"Skierg":["Dra handtagen nedåt genom att fälla i höften och böja lätt i knäna, armarna följer med. Res dig upp mellan dragen.","Kraften kommer från höften och bålen, inte bara armarna, rak rygg.","Pull the handles down by hinging at the hips with a slight knee bend, the arms following. Stand tall between pulls.","Power comes from the hips and trunk, not just the arms, straight back."],
"Wall balls":["Bollen vid bröstet. Gå ned i en knäböj och kasta bollen mot målet när du reser dig. Ta emot den och gå direkt ned i nästa.","Hela knäböjen, kasta med benen, ta emot bollen högt och mjukt.","Ball at the chest. Squat and throw the ball to the target as you stand. Catch it and go straight into the next.","Full squat, throw with the legs, catch the ball high and softly."],
"Slam ball":["Lyft bollen över huvudet och kasta den i golvet framför fötterna med hela kroppen. Fäll i höften och plocka upp den.","Plocka upp bollen med rak rygg, och kasta inte så att den studsar upp mot ansiktet.","Lift the ball overhead and slam it into the floor in front of the feet with the whole body. Hinge and pick it up.","Pick the ball up with a straight back, and don't slam it so it bounces toward the face."],
"Battle ropes":["Halvt nedsittande med en repände i varje hand. Gör vågor växelvis eller samtidigt i högt tempo.","Stabil grundposition med böjda knän, rörelsen från axlarna, spänd bål.","Half-squat stance with a rope end in each hand. Make waves alternately or together at a fast pace.","Stable stance with bent knees, movement from the shoulders, braced core."]
};
// Instructions for the built-in stretches: Swedish name → [how (sv), how (en)].
const STRETCH_INFO={
"Höftböjare i utfallsställning":["Bakre knät i golvet, skjut höften framåt tills det sträcker i framsidan av höften. Byt sida halvvägs.","Back knee down, push the hips forward until the front of the hip stretches. Switch sides halfway."],
"Framsida lår stående":["Håll i foten bakom rumpan med knäna ihop och höften framåt. Byt sida halvvägs.","Hold the foot behind you with the knees together and the hips forward. Switch sides halfway."],
"Baksida lår sittande":["Sitt med ett ben rakt och luta dig framåt med rak rygg mot foten. Byt sida halvvägs.","Sit with one leg straight and lean forward over it with a straight back. Switch sides halfway."],
"Vader mot vägg":["Händerna mot väggen, bakre benet rakt med hälen i golvet. Byt sida halvvägs.","Hands on the wall, back leg straight with the heel down. Switch sides halfway."],
"Duvan (säte)":["Främre benet vikt framför dig och bakre benet rakt bakåt. Sänk överkroppen framåt. Byt sida halvvägs.","Front leg folded in front of you, back leg straight behind. Lower the upper body forward. Switch sides halfway."],
"Fjärilen (ljumskar)":["Sitt med fotsulorna ihop och låt knäna sjunka mot golvet, rak rygg.","Sit with the soles together and let the knees sink toward the floor, straight back."],
"Arm över bröstet (bakre axel)":["Dra ena armen över bröstet med andra handen och håll axeln nere. Byt sida halvvägs.","Pull one arm across the chest with the other hand and keep the shoulder down. Switch sides halfway."],
"Sidosträck med armen över huvudet":["Sträck ena armen över huvudet och luta dig åt motsatt sida. Byt sida halvvägs.","Reach one arm overhead and lean to the opposite side. Switch sides halfway."],
"Övre rygg, rund rygg":["Knäpp händerna framför dig, skjut ut armarna och runda övre ryggen.","Clasp the hands in front of you, push the arms away and round the upper back."],
"Bröst mot vägg":["Underarmen mot en vägg eller dörrkarm, vrid kroppen bort från armen. Byt sida halvvägs.","Forearm against a wall or door frame, turn the body away from the arm. Switch sides halfway."],
"Triceps över huvudet":["Böj armen bakom huvudet och tryck lätt armbågen nedåt med andra handen. Byt sida halvvägs.","Bend the arm behind the head and gently press the elbow down with the other hand. Switch sides halfway."],
"Framsida axel":["Knäpp händerna bakom ryggen, sträck armarna och öppna bröstet.","Clasp the hands behind the back, straighten the arms and open the chest."],
"Kobran":["Ligg på mage och tryck upp överkroppen med händerna, låt höften ligga kvar.","Lie face down and press the upper body up with the hands, keeping the hips down."],
"Katt och ko":["På alla fyra, växla långsamt mellan rund rygg och svank i takt med andningen.","On all fours, move slowly between a rounded and an arched back with the breath."],
"Bålrotation liggande":["Ligg på rygg och fäll båda knäna åt ena sidan med axlarna kvar i golvet. Byt sida halvvägs.","Lie on your back and drop both knees to one side with the shoulders down. Switch sides halfway."],
"Barnets position":["Sitt på hälarna, fäll överkroppen framåt med armarna sträckta och andas lugnt.","Sit back on the heels, fold forward with the arms stretched out and breathe calmly."],
"Nedåtgående hund":["Händer och fötter i golvet med höften högt, sträck ryggen och tryck hälarna mot golvet.","Hands and feet on the floor with the hips high, lengthen the back and press the heels toward the floor."],
"Djup knäböj, sittande":["Sitt djupt ned med hälarna i golvet och armbågarna mot knäna. Andas lugnt.","Sit deep with the heels down and the elbows against the knees. Breathe calmly."]
};
const GROUPS=["legs","pull","push","core","cardio"];
function bankName(x){return lang==="en"?x[1]:x[0]}
function groupOf(name){const n=(name||"").trim().toLowerCase();if(!n)return null;const x=BANK.find(b=>b[0].toLowerCase()===n||b[1].toLowerCase()===n);if(x)return x[2];
  const o=(typeof libList==="function"?libList():[]).find(e=>e.id&&e.id[0]==="u"&&!e.deleted&&(e.name||"").toLowerCase()===n);return o&&o.group?o.group:null}
let cfg={mode:"auto",st:8,ex:2,sets:2,rd:2,warm:10,instr:20,instrMode:"block",total:60,ratio:70,work:30,setRest:15,exRest:10,stRest:20,rdRest:60,sound:true,names:[],countdown:3,cdRest:false,vol:80,half:true,mix:"ambient",instrUnit:"per",instrTot:5,ready:60,perRound:false,rounds:[],exMode:false,exTimes:{},setsEach:false,roundSets:[],order:"block",oneRest:false,stretch:0,stretchList:[],mid:"off",midEvery:2,midTime:30,midList:[],nameStyle:"name",voice:false,stretchSeed:0,stretchAuto:false,marginMode:"buffer",margin:0,even:true,hold:true,lock:false,awake:true,spList:"",spStart:true,spPause:true,spDuck:false,spWorkVol:80,spRestVol:40,snd:{start:"bell",half:"double",rest:"fall",done:"chime",cd:"pip"}};
const DEFAULTS=JSON.parse(JSON.stringify(cfg));
try{if(localStorage.getItem("ccage")!=null&&localStorage.getItem("ccage_migrated")==null)localStorage.setItem("ccage_hadplan","true")}catch(e){}
try{const s=JSON.parse(localStorage.getItem("ccage")||"null");if(s)cfg=Object.assign(cfg,s)}catch(e){}
// Keep numbers inside the range of their input (and lists inside sane sizes), whatever was saved or imported.
function clampCfg(){
  const num=(v,mn,mx,d)=>typeof v==="number"&&isFinite(v)?Math.min(mx,Math.max(mn,v)):d;
  Object.keys(DEFAULTS).forEach(k=>{if(typeof DEFAULTS[k]!=="number")return;const el=document.getElementById(k);
    const mn=el&&el.min!==""?+el.min:-1e6,mx=el&&el.max!==""?+el.max:1e6;cfg[k]=num(cfg[k],mn,mx,DEFAULTS[k])});
  cfg.ratio=num(cfg.ratio,30,95,DEFAULTS.ratio);
  if(Array.isArray(cfg.roundSets))cfg.roundSets=cfg.roundSets.slice(0,6).map(v=>num(v,1,6,cfg.sets));
  if(Array.isArray(cfg.rounds))cfg.rounds=cfg.rounds.slice(0,6).map(x=>{const o=x&&typeof x==="object"?x:{};return{ratio:num(o.ratio,30,95,cfg.ratio),work:num(o.work,5,300,cfg.work),setRest:num(o.setRest,0,300,cfg.setRest),exRest:num(o.exRest,0,300,cfg.exRest),stRest:num(o.stRest,0,300,cfg.stRest)}});
  if(cfg.exTimes&&typeof cfg.exTimes==="object")Object.keys(cfg.exTimes).forEach(q=>{const o=cfg.exTimes[q];if(!o||typeof o!=="object"){delete cfg.exTimes[q];return}
    o.w=o.w==null?null:num(o.w,1,600,null);o.p=o.p==null?null:num(o.p,0,600,null)});
  if(Array.isArray(cfg.names))cfg.names=cfg.names.slice(0,20);
}
function fixCfg(){cfg.snd=Object.assign({},DEFAULTS.snd,cfg.snd||{});if(cfg.startStyle){cfg.snd.start=cfg.startStyle;delete cfg.startStyle}if(!Array.isArray(cfg.names))cfg.names=[];if(!Array.isArray(cfg.rounds))cfg.rounds=[];if(!cfg.exTimes||typeof cfg.exTimes!=="object")cfg.exTimes={};if(!Array.isArray(cfg.roundSets))cfg.roundSets=[];["stretchList","midList"].forEach(k=>{if(!Array.isArray(cfg[k]))cfg[k]=[]});clampCfg()}
fixCfg();
function save(){try{localStorage.setItem("ccage",JSON.stringify(cfg))}catch(e){}}
function isAlt(){return cfg.order==="alt"&&cfg.ex>1}
function exCount(){let n=0;for(let r=0;r<cfg.rd;r++)n+=isAlt()?cfg.st*(cfg.ex-1)*setsAt(r):cfg.st*(cfg.ex-1);return n}
function setsAt(r){return cfg.setsEach&&cfg.rd>1?Math.max(1,Math.min(6,cfg.roundSets[r]||cfg.sets)):cfg.sets}
function counts(){const ST=cfg.st,EX=cfg.ex,SETS=cfg.sets,RD=cfg.rd;let sw=0,sp=0;for(let r=0;r<RD;r++){sw+=setsAt(r);sp+=setsAt(r)-1}
  return{ST,EX,SETS,RD,W:ST*EX*sw,P:ST*EX*sp,E:ST*(EX-1)*RD,S:(ST-1)*RD,R:RD-1}}

const fmt=s=>{s=Math.max(0,Math.round(s));const m=Math.floor(s/60),r=s%60;return m+":"+String(r).padStart(2,"0")};
const fmtLong=s=>{s=Math.round(s);const m=Math.floor(s/60),r=s%60;return !m?r+" s":r?m+" min "+r+" s":m+" min"};
const L="ABCD";
// full: always the real name (used for demos and getting ready, where the coach needs to know the exercise).
function exName(st,e,full){
  if(!full&&cfg.nameStyle==="num")return T("Övning {l}",{l:e+1});
  if(!full&&cfg.nameStyle==="letter")return T("Övning {l}",{l:L[e]});
  const n=(cfg.names[st]||[])[e];return n&&n.trim()?n.trim():T("Station {s} – övning {l}",{s:st+1,l:L[e]})}
function lines(a){return (a||[]).map(x=>String(x).trim()).filter(Boolean)}
function midName(n){const l=lines(cfg.midList);return l.length?l[n%l.length]:T("Mellanövning")}
// Where the shared intermediate exercise goes: after every N stations within a round, or between rounds.
function midAfter(r,s){const c=counts();if(cfg.mid==="st")return s<c.ST-1&&(s+1)%Math.max(1,cfg.midEvery)===0;if(cfg.mid==="round")return s===c.ST-1&&r<c.RD-1;return false}
function midCount(r){let n=0;for(let s=0;s<cfg.st;s++)if(midAfter(r,s))n++;return n}

function instrTotal(){const c=counts();return cfg.instrUnit==="total"?cfg.instrTot*60:c.ST*c.EX*cfg.instr}
function instrEach(){const c=counts();return cfg.instrUnit==="total"?Math.round(cfg.instrTot*60/(c.ST*c.EX)):cfg.instr}
function syncRounds(){if(!Array.isArray(cfg.rounds))cfg.rounds=[];for(let r=0;r<cfg.rd;r++){const x=cfg.rounds[r]||{};cfg.rounds[r]={ratio:x.ratio??cfg.ratio,work:x.work??cfg.work,setRest:x.setRest??cfg.setRest,exRest:x.exRest??cfg.exRest,stRest:x.stRest??cfg.stRest}}}
function exV(r){return perRound()?cfg.rounds[r].exRest:cfg.exRest}
function stV(r){return perRound()?cfg.rounds[r].stRest:cfg.stRest}
function exCountR(r){return isAlt()?cfg.st*(cfg.ex-1)*setsAt(r):cfg.st*(cfg.ex-1)}
function ovAt(r,s,e){if(!cfg.exMode)return null;const o=cfg.exTimes[r+"-"+s+"-"+e];return o&&(o.w!=null||o.p!=null)?o:null}
function perRound(){return !!cfg.perRound&&cfg.rd>1}
// Latest allowed end of the workout in seconds: the total time minus the time to keep at the end, or plus the allowed overrun.
function autoLimit(){const m=Math.max(0,cfg.margin||0)*60;return cfg.marginMode==="over"?cfg.total*60+m:Math.max(0,cfg.total*60-m)}
// Round work and set rest to multiples of 5 s, then add 5 s steps while that brings the plan closer to its target:
// close to the planned end (never past the limit) and close to the chosen work/rest split.
// 1 percentage point off the split counts like 6 s off the end.
function evenOut(Wr,Pr,freeW,freeP,pr,fixW,fixP,base,aim,limit){
  const RD=Wr.length,groups=pr?Wr.map((_,r)=>[r]):[Wr.map((_,r)=>r)];
  const fr=r=>(pr?cfg.rounds[r].ratio:cfg.ratio)/100;
  for(let r=0;r<RD;r++){Wr[r]=Math.max(freeW[r]>0?5:0,Math.floor(Wr[r]/5)*5);Pr[r]=Math.floor(Pr[r]/5)*5}
  const tot=()=>{let s=base;for(let r=0;r<RD;r++)s+=fixW[r]+fixP[r]+freeW[r]*Wr[r]+freeP[r]*Pr[r];return s};
  const score=()=>{let e=0;groups.forEach(g=>{const r=g[0],w=Wr[r],p=Pr[r];e+=w+p>0?Math.abs(w/(w+p)-fr(r)):0});return Math.abs(tot()-aim)+600*e/groups.length};
  for(let guard=0;guard<400;guard++){
    let best=null,cur=score();
    groups.forEach(g=>["w","p"].forEach(k=>{
      const A=k==="w"?Wr:Pr,n=g.reduce((a,r)=>a+(k==="w"?freeW:freeP)[r],0);if(!n)return;
      g.forEach(r=>A[r]+=5);const ok=tot()<=limit,sc=score();g.forEach(r=>A[r]-=5);
      if(ok&&sc<cur&&(!best||sc<best.sc))best={g,A,sc}}));
    if(!best)break;best.g.forEach(r=>best.A[r]+=5)
  }
}
function compute(){
  const c=counts();let W,P,warn="",Wr=[],Pr=[];
  const pr=perRound();if(pr)syncRounds();
  const nW=c.W/c.RD,nP=c.P/c.RD;
  let fixed=c.R*cfg.rdRest;if(!cfg.oneRest)for(let r=0;r<c.RD;r++)fixed+=exCountR(r)*exV(r)+(c.ST-1)*stV(r);
  const setup=cfg.warm*60+instrTotal()+cfg.ready+cfg.stretch*60;
  // Each intermediate exercise adds its own time plus one more switch (to it and back again).
  let midW=0;for(let r=0;r<c.RD;r++){const m=midCount(r);midW+=m*cfg.midTime;if(!cfg.oneRest)fixed+=m*stV(r)}
  const fixW=[],fixP=[],freeW=[],freeP=[];
  for(let r=0;r<c.RD;r++){fixW[r]=fixP[r]=freeW[r]=freeP[r]=0;
    for(let s=0;s<c.ST;s++)for(let e=0;e<c.EX;e++){const o=ovAt(r,s,e);
      const S=setsAt(r);
      if(o&&o.w!=null)fixW[r]+=S*o.w;else freeW[r]+=S;
      const nr=isAlt()?(e===c.EX-1?S-1:0):S-1;
      if(o&&o.p!=null)fixP[r]+=nr*o.p;else freeP[r]+=nr}
    if(cfg.oneRest)freeP[r]+=exCountR(r)+(c.ST-1)+midCount(r)}
  const goal=cfg.total*60,limit=autoLimit(),aim=Math.min(goal,limit);
  if(cfg.mode==="auto"){
    let rem=aim-fixed-midW-setup,den=0;
    for(let r=0;r<c.RD;r++){rem-=fixW[r]+fixP[r];const f=(pr?cfg.rounds[r].ratio:cfg.ratio)/100;den+=freeW[r]*f+freeP[r]*(1-f)}
    const C=den>0?Math.max(0,rem/den):0;
    for(let r=0;r<c.RD;r++){const f=(pr?cfg.rounds[r].ratio:cfg.ratio)/100;Wr[r]=Math.max(0,Math.round(C*f));Pr[r]=Math.max(0,Math.round(C*(1-f)))}
    if(cfg.even&&rem>0)evenOut(Wr,Pr,freeW,freeP,pr,fixW,fixP,fixed+midW+setup,aim,limit);
    W=Wr[0];P=Pr[0];
    if(Wr.some((w,r)=>freeW[r]>0&&w<5)||rem<0)warn=T("Pauser, uppvärmning, genomgång, mellanövningar och stretch tar nästan hela tiden. Öka totaltiden eller dra ner på något av dem.");
  }else if(pr){for(let r=0;r<c.RD;r++){Wr[r]=cfg.rounds[r].work;Pr[r]=cfg.rounds[r].setRest}W=Wr[0];P=Pr[0]}
  else{W=cfg.work;P=cfg.setRest}
  if(!pr&&cfg.mode!=="auto")for(let r=0;r<c.RD;r++){Wr[r]=W;Pr[r]=P}
  let workTot=midW,restTot=fixed;for(let r=0;r<c.RD;r++){workTot+=fixW[r]+freeW[r]*Wr[r];restTot+=fixP[r]+freeP[r]*Pr[r]}
  const total=workTot+restTot+setup;
  return{W,P,Wr,Pr,pr,workTot,restTot,setup,total,warn,goal,limit};
}

function buildSeq(pl){
  const c=counts(),q=[];
  if(cfg.warm>0)q.push({type:"warm",d:cfg.warm*60});
  if(cfg.instrMode==="block"){if(cfg.instrUnit==="total"){if(cfg.instrTot>0)q.push({type:"instr",d:cfg.instrTot*60,all:true})}else if(cfg.instr>0)for(let s=0;s<c.ST;s++)for(let e=0;e<c.EX;e++)q.push({type:"instr",d:cfg.instr,s,e,n:s*c.EX+e})}
  if(cfg.ready>0)q.push({type:"go",d:cfg.ready});
  const ie=instrEach();let midN=0;
  for(let r=0;r<c.RD;r++)for(let s=0;s<c.ST;s++){
    const SR=setsAt(r);
    const wp=e=>{const o=ovAt(r,s,e);return[o&&o.w!=null?o.w:pl.Wr[r],o&&o.p!=null?o.p:pl.Pr[r]]};
    const add=(t,d,e,k,x)=>{if(t&&d>0)q.push(Object.assign({type:t,d,r,s,e,k},x))};
    const XR=cfg.oneRest?pl.Pr[r]:exV(r),SRest=cfg.oneRest?pl.Pr[r]:stV(r);
    const after=(e,k)=>{
      if(midAfter(r,s)){add("s",SRest,e,k,{toMid:true,m:midN});q.push({type:"mid",d:cfg.midTime,r,s,m:midN++})}
      if(s<c.ST-1)add("s",SRest,e,k);else if(r<c.RD-1)add("R",cfg.rdRest,e,k)};
    if(isAlt()){
      if(r===0&&ie>0&&cfg.instrMode==="station")for(let e=0;e<c.EX;e++)q.push({type:"instr",d:ie,s,e,n:s*c.EX+e,at:true});
      for(let k=0;k<SR;k++)for(let e=0;e<c.EX;e++){
        const[W,P]=wp(e);q.push({type:"work",d:W,r,s,e,k});
        if(e<c.EX-1)add("e",XR,e,k);else if(k<SR-1)add("p",P,e,k);else after(e,k);
      }
      continue;
    }
    for(let e=0;e<c.EX;e++){
    if(r===0&&ie>0&&cfg.instrMode==="station")q.push({type:"instr",d:ie,s,e,n:s*c.EX+e,at:true});
    for(let k=0;k<SR;k++){
      const o=ovAt(r,s,e),W=o&&o.w!=null?o.w:pl.Wr[r],P=o&&o.p!=null?o.p:pl.Pr[r];
      q.push({type:"work",d:W,r,s,e,k});
      if(k<SR-1)add("p",P,e,k);else if(e<c.EX-1)add("e",XR,e,k);else after(e,k);
    }
    }
  }
  // Stretch at the end: the time is shared evenly by the stretches in the list.
  if(cfg.stretch>0){const names=lines(cfg.stretchList),n=stretchN(),tot=cfg.stretch*60,base=Math.floor(tot/n);
    for(let i=0;i<n;i++)q.push({type:"cool",d:base+(i<tot-base*n?1:0),n:i,of:n,name:names[i]||""})}
  return q;
}

// --- Plan UI ---
const fields=["st","ex","sets","rd","warm","instr","instrTot","ready","stretch","midEvery","midTime","total","margin","work","setRest","exRest","stRest","rdRest","countdown","spWorkVol","spRestVol"];
const structural=["st","ex"];
function setField(f,v){const el=$(f);cfg[f]=Math.max(+el.min,Math.min(+el.max,v));
  if(f==="stretch"&&cfg.stretch>0&&(cfg.stretchAuto||!lines(cfg.stretchList).length)){suggestStretch(true);return}if(structural.includes(f))buildNames();render()}
fields.forEach(f=>{const el=$(f);el.value=cfg[f];
  el.addEventListener("input",()=>{const v=parseInt(el.value,10);if(!isNaN(v))setField(f,v)});
  el.addEventListener("blur",()=>{el.value=cfg[f]})});
document.querySelectorAll("[data-step]").forEach(b=>b.addEventListener("click",()=>{const[f,st]=b.dataset.step.split(":");setField(f,cfg[f]+ +st);$(f).value=cfg[f]}));
$("ratio").value=cfg.ratio;
$("ratio").addEventListener("input",e=>{cfg.ratio=+e.target.value;render()});
document.querySelectorAll("#ratioChips button").forEach(b=>b.addEventListener("click",()=>{cfg.ratio=+b.dataset.r;$("ratio").value=cfg.ratio;render()}));
function setMode(m){
  if(m==="manual"&&cfg.mode==="auto"){const c=compute();cfg.work=c.W;cfg.setRest=c.P;$("work").value=c.W;$("setRest").value=c.P;syncRounds();c.Wr.forEach((w,r)=>{cfg.rounds[r].work=w;cfg.rounds[r].setRest=c.Pr[r]})}
  if(m==="auto"&&cfg.mode==="manual"){const c=compute();cfg.total=Math.max(10,Math.round(c.total/60));$("total").value=cfg.total;syncRounds();c.Wr.forEach((w,r)=>{const t=w+c.Pr[r];if(t>0)cfg.rounds[r].ratio=Math.min(95,Math.max(30,Math.round(100*w/t)))})}
  cfg.mode=m;render();
}
$("oneOff").onclick=()=>{cfg.oneRest=false;render()};$("oneOn").onclick=()=>{cfg.oneRest=true;render()};
$("orderBlock").onclick=()=>{cfg.order="block";render()};$("orderAlt").onclick=()=>{cfg.order="alt";render()};
$("setsSame").onclick=()=>{cfg.setsEach=false;render()};$("setsEach").onclick=()=>{cfg.setsEach=true;for(let r=0;r<cfg.rd;r++)if(!cfg.roundSets[r])cfg.roundSets[r]=cfg.sets;render()};
$("exModeOff").onclick=()=>{cfg.exMode=false;render()};$("exModeOn").onclick=()=>{cfg.exMode=true;render()};
$("prSame").onclick=()=>{cfg.perRound=false;render()};
$("mgBuffer").onclick=()=>{cfg.marginMode="buffer";render()};$("mgOver").onclick=()=>{cfg.marginMode="over";render()};
$("evenOn").onclick=()=>{cfg.even=true;render()};$("evenOff").onclick=()=>{cfg.even=false;render()};
$("holdOn").onclick=()=>{cfg.hold=true;render()};
// Templates: a quick start. They set the structure; names, sounds and Spotify stay as they are.
const TPL_BASE={perRound:false,setsEach:false,exMode:false,oneRest:false,order:"block",instrUnit:"per",instrMode:"block",exRest:10,stRest:20,rdRest:60,midList:[],stretchList:[],stretchAuto:true};
const TEMPLATES=[
  ["45 min cirkel","45 min circuit",{mode:"auto",st:8,ex:2,sets:2,rd:2,warm:8,instr:15,ready:45,total:45,ratio:70,stretch:4,mid:"off"}],
  ["60 min med mellanövning","60 min with interval exercise",{mode:"auto",st:8,ex:2,sets:2,rd:2,warm:10,instr:20,ready:60,total:60,ratio:70,stretch:5,mid:"st",midEvery:2,midTime:30,midList:["Burpees","Hopprep"]}],
  ["Snabbt 30 min","Quick 30 min",{mode:"auto",st:6,ex:1,sets:3,rd:2,warm:5,instr:10,ready:30,total:30,ratio:75,stretch:3,mid:"off",stRest:15}],
  ["Tabata, 4 block","Tabata, 4 blocks",{mode:"manual",st:4,ex:1,sets:8,rd:1,work:20,setRest:10,stRest:60,warm:8,instr:15,ready:30,stretch:4,mid:"off"}]
];
// Collapsible sections: the summary line shows the current choice, and the open/closed state is remembered on this phone.
let folds={};try{folds=JSON.parse(localStorage.getItem("ccage_fold")||"{}")||{}}catch(e){}
document.querySelectorAll("details.fold").forEach(d=>{const id=d.dataset.fold;if(folds[id])d.open=true;d.addEventListener("toggle",()=>{folds[id]=d.open;try{localStorage.setItem("ccage_fold",JSON.stringify(folds))}catch(e){}})});
function foldSums(){
  const set=(id,v)=>{const el=$("sum_"+id);if(el)el.textContent=v};
  set("stretch",cfg.stretch>0?T("{m} min · {n} övningar",{m:cfg.stretch,n:stretchN()}):T("Ingen"));
  const n=Math.max(1,cfg.midEvery);
  set("mid",cfg.mid==="off"?T("Ingen"):(cfg.mid==="round"?T("Mellan varv"):(lang==="en"?(n===1?"After every station":"After every "+n+" stations"):"Efter var "+n+(n<=2?":a":":e")+" station"))+" · "+cfg.midTime+" s");
  set("hold",T(cfg.hold?"Håll sluttiden":"Följ planen"));
}
$("voiceOn").onclick=()=>{cfg.voice=true;render();ensureAudio();unlockVoice();say(T("Rösten är på"))};$("voiceOff").onclick=()=>{cfg.voice=false;try{speechSynthesis.cancel()}catch(e){}render()};
$("midOff").onclick=()=>{cfg.mid="off";render()};$("midRound").onclick=()=>{cfg.mid="round";render()};$("midSt").onclick=()=>{cfg.mid="st";render()};
$("nsName").onclick=()=>{cfg.nameStyle="name";render()};$("nsNum").onclick=()=>{cfg.nameStyle="num";render()};$("nsLetter").onclick=()=>{cfg.nameStyle="letter";render()};
["stretchList","midList"].forEach(k=>{$(k).value=cfg[k].join("\n");$(k).addEventListener("input",()=>{cfg[k]=$(k).value.split("\n");if(k==="stretchList")cfg.stretchAuto=false;render()})});
// Stretch suggestion: weighted towards the body parts the workout's exercises use, ending with a whole-body stretch.
// Stretch suggestion: the slots are shared by the body parts the workout's exercises use, in proportion to how often
// each is used, and it ends with a whole-body stretch. The seed is saved so an accepted suggestion stays the same.
function stretchN(){const tot=cfg.stretch*60;return Math.max(1,Math.min(Math.max(1,lines(cfg.stretchList).length),Math.floor(tot/5)))}
function suggestStretch(same){
  if(!same)cfg.stretchSeed=(cfg.stretchSeed||0)+1;
  const seed=cfg.stretchSeed||0,n=Math.max(1,Math.min(10,Math.round(cfg.stretch*60/45))),tally={};
  const count=x=>{const g=groupOf(x);if(g&&g!=="cardio")tally[g]=(tally[g]||0)+1};
  for(let s=0;s<cfg.st;s++)for(let e=0;e<cfg.ex;e++)count((cfg.names[s]||[])[e]);
  lines(cfg.midList).forEach(count);
  let gs=Object.keys(tally);if(!gs.length){gs=["legs","core","push","pull"];gs.forEach(g=>tally[g]=1)}
  const slots=n-1,sum=gs.reduce((a,g)=>a+tally[g],0),want={};
  gs.forEach(g=>want[g]=Math.floor(slots*tally[g]/sum));
  gs.slice().sort((a,b)=>(slots*tally[b]/sum%1)-(slots*tally[a]/sum%1)).forEach(g=>{if(Object.values(want).reduce((a,b)=>a+b,0)<slots)want[g]++});
  const pick=[],used=new Set();
  const take=g=>{const l=STRETCH.filter(x=>x[2]===g&&!used.has(x));if(!l.length)return false;const x=l[seed%l.length];used.add(x);pick.push(bankName(x));return true};
  gs.sort((a,b)=>tally[b]-tally[a]).forEach(g=>{for(let i=0;i<want[g];i++)if(!take(g))break});
  for(const g of ["legs","core","push","pull"])while(pick.length<slots&&take(g));
  take("full");
  cfg.stretchList=pick.slice(0,n);cfg.stretchAuto=true;$("stretchList").value=cfg.stretchList.join("\n");render();
}
$("stretchSuggest").onclick=()=>{const old=cfg.stretchList.slice(),oa=cfg.stretchAuto;suggestStretch(false);undoable(T("Nytt stretchförslag."),()=>{cfg.stretchList=old;cfg.stretchAuto=oa;$("stretchList").value=old.join("\n")})};
$("exFill").onclick=()=>{
  const before=JSON.parse(JSON.stringify(cfg.names));
  const used=new Set(),mark=v=>{v=(v||"").trim().toLowerCase();if(!v)return;used.add(v);const b=BANK.find(x=>x[0].toLowerCase()===v||x[1].toLowerCase()===v);if(b){used.add(b[0].toLowerCase());used.add(b[1].toLowerCase())}};
  for(let s=0;s<cfg.st;s++)for(let e=0;e<cfg.ex;e++)mark((cfg.names[s]||[])[e]);
  let i=0;for(let s=0;s<cfg.st;s++)for(let e=0;e<cfg.ex;e++){cfg.names[s]=cfg.names[s]||[];if((cfg.names[s][e]||"").trim()){i++;continue}
    const g=GROUPS[i++%GROUPS.length],x=BANK.find(b=>b[2]===g&&!used.has(bankName(b).toLowerCase()))||BANK.find(b=>!used.has(bankName(b).toLowerCase()));
    if(x){cfg.names[s][e]=bankName(x);mark(bankName(x))}}
  namesKey="";render();undoable(T("Tomma övningar fylldes med förslag."),()=>{cfg.names=before;namesKey=""});
};
$("exClear").onclick=()=>{const before=JSON.parse(JSON.stringify(cfg.names));cfg.names=[];namesKey="";render();undoable(T("Alla övningar togs bort."),()=>{cfg.names=before;namesKey=""})};
// A short "Undo" bar instead of asking first: the change happens at once and can be taken back for 8 seconds.
let undoFn=null,undoT=0;
function undoable(msg,fn,label){undoFn=fn;$("toastMsg").textContent=msg;$("toastUndo").hidden=!fn;$("toastUndo").textContent=label||T("Ångra");$("toast").hidden=false;clearTimeout(undoT);undoT=setTimeout(()=>{$("toast").hidden=true;undoFn=null},8000)}
$("toastUndo").onclick=async()=>{const fn=undoFn;undoFn=null;clearTimeout(undoT);if(!fn){$("toast").hidden=true;return}
  $("toastUndo").disabled=true;
  try{await fn();render();$("toast").hidden=true}
  catch(e){$("toastMsg").textContent=T("Det gick inte att ångra. Kontrollera anslutningen.");undoT=setTimeout(()=>{$("toast").hidden=true},6000)}
  $("toastUndo").disabled=false};

$("holdOff").onclick=()=>{cfg.hold=false;render()};$("prEach").onclick=()=>{cfg.perRound=true;syncRounds();render()};
let roundsKey="";
function stepper(id,val,min,max,step,onv){
  const wrap=document.createElement("div");wrap.className="num";
  const minus=document.createElement("button");minus.textContent="−";minus.setAttribute("aria-label",T("Minska"));
  const inp=document.createElement("input");inp.type="number";inp.inputMode="numeric";inp.id=id;inp.min=min;inp.max=max;inp.value=val;
  const plus=document.createElement("button");plus.textContent="+";plus.setAttribute("aria-label",T("Öka"));
  const clamp=v=>Math.max(min,Math.min(max,v));
  minus.onclick=()=>{const v=clamp((parseInt(inp.value,10)||0)-step);inp.value=v;onv(v)};
  plus.onclick=()=>{const v=clamp((parseInt(inp.value,10)||0)+step);inp.value=v;onv(v)};
  inp.addEventListener("input",()=>{const v=parseInt(inp.value,10);if(!isNaN(v))onv(clamp(v))});
  inp.addEventListener("blur",()=>{inp.value=clamp(parseInt(inp.value,10)||0)});
  wrap.append(minus,inp,plus);return wrap;
}
function transRows(r){
  const out=[];
  [["exRest",T("Byte övning"),cfg.ex>1],["stRest",T("Byte station"),cfg.st>1]].forEach(([k,t,show])=>{if(!show)return;
    const row=document.createElement("div");row.className="row";
    const l=document.createElement("label");l.htmlFor="rt_"+k+"_"+r;l.textContent=t;
    const u=document.createElement("span");u.className="unit";u.textContent="s";
    row.append(l,stepper("rt_"+k+"_"+r,cfg.rounds[r][k],0,300,5,v=>{cfg.rounds[r][k]=v;render()}),u);out.push(row)});
  return out;
}
function buildRounds(){
  const key=[cfg.rd,cfg.mode,perRound(),lang,cfg.oneRest,cfg.ex,cfg.st].join("|");if(key===roundsKey)return;roundsKey=key;
  const A=$("roundsAuto"),M=$("roundsManual");A.innerHTML="";M.innerHTML="";
  if(!perRound())return;syncRounds();
  for(let r=0;r<cfg.rd;r++){
    if(cfg.mode==="auto"){
      const box=document.createElement("div");box.style.cssText="display:flex;flex-direction:column;gap:6px";
      const head=document.createElement("div");head.className="row";
      const lab=document.createElement("label");lab.className="rlabel";lab.htmlFor="rr_"+r;lab.textContent=T("Varv {n}",{n:r+1});
      const val=document.createElement("span");val.className="rval";val.id="rv_"+r;
      head.append(lab,val);
      const rng=document.createElement("input");rng.type="range";rng.min=30;rng.max=95;rng.step=1;rng.id="rr_"+r;rng.value=cfg.rounds[r].ratio;
      rng.addEventListener("input",()=>{cfg.rounds[r].ratio=+rng.value;render()});
      const chips=document.createElement("div");chips.className="chips";
      [[50,"30/30"],[67,"40/20"],[75,"45/15"],[83,"50/10"]].forEach(([v,t])=>{const b=document.createElement("button");b.textContent=t;b.dataset.r=v;b.onclick=()=>{cfg.rounds[r].ratio=v;rng.value=v;render()};chips.appendChild(b)});
      box.append(head,rng,chips);
      if(!cfg.oneRest)transRows(r).forEach(x=>box.appendChild(x));
      A.appendChild(box);
    }else{
      const lab=document.createElement("div");lab.className="rlabel";lab.textContent=T("Varv {n}",{n:r+1});M.appendChild(lab);
      [["work",T("Arbete per set"),5,300],["setRest",T(cfg.oneRest?"Vila och byten":"Vila mellan set"),0,300]].forEach(([k,t,mn,mx])=>{
        const row=document.createElement("div");row.className="row";
        const l=document.createElement("label");l.htmlFor="rm_"+k+"_"+r;l.textContent=t;
        const u=document.createElement("span");u.className="unit";u.textContent="s";
        row.append(l,stepper("rm_"+k+"_"+r,cfg.rounds[r][k],mn,mx,5,v=>{cfg.rounds[r][k]=v;render()}),u);M.appendChild(row);
      });
      if(!cfg.oneRest)transRows(r).forEach(x=>M.appendChild(x));
    }
  }
}
$("modeAuto").onclick=()=>setMode("auto");$("modeManual").onclick=()=>setMode("manual");
$("cdWorkOnly").onclick=()=>{cfg.cdRest=false;render()};$("cdAll").onclick=()=>{cfg.cdRest=true;render()};
$("instrPer").onclick=()=>{cfg.instrUnit="per";render()};$("instrAll").onclick=()=>{cfg.instrUnit="total";render()};
$("lockOn").onclick=()=>{cfg.lock=true;render()};$("lockOff").onclick=()=>{cfg.lock=false;stopLock();render()};
$("instrBlock").onclick=()=>{cfg.instrMode="block";render()};$("instrStation").onclick=()=>{cfg.instrMode="station";render()};

function buildNames(){
  const box=$("exList");box.innerHTML="";
  for(let s=0;s<cfg.st;s++){
    const row=document.createElement("div");row.className="ex";row.style.setProperty("--n",cfg.ex);
    row.innerHTML='<b>'+(s+1)+'</b>';
    for(let e=0;e<cfg.ex;e++){
      const i=document.createElement("span");i.className="exn";i.textContent=((cfg.names[s]||[])[e]||"").trim()||T("Övning {l}",{l:L[e]});
      row.appendChild(i);
    }
    box.appendChild(row);
    if(cfg.exMode){
      const g=document.createElement("div");g.className="ot";
      const h0=document.createElement("span");const h1=document.createElement("span");h1.className="h";h1.textContent=T("Arbete");const h2=document.createElement("span");h2.className="h";h2.textContent=T("Vila");
      g.append(h0,h1,h2);
      for(let e=0;e<cfg.ex;e++)for(let r=0;r<cfg.rd;r++){
        const lab=document.createElement("span");lab.textContent=(cfg.ex>1?L[e]:"")+(cfg.ex>1&&cfg.rd>1?" · ":"")+(cfg.rd>1?T("Varv {n}",{n:r+1}):(cfg.ex>1?"":T("Station")+" "+(s+1)));
        g.appendChild(lab);
        ["w","p"].forEach(k=>{
          const inp=document.createElement("input");inp.type="number";inp.inputMode="numeric";inp.min=0;inp.max=600;
          inp.id="ot_"+k+"_"+r+"_"+s+"_"+e;inp.dataset.ovr=r;inp.dataset.ovk=k;
          inp.setAttribute("aria-label",(k==="w"?T("Arbete"):T("Vila"))+" "+lab.textContent+" "+T("Station")+" "+(s+1));
          const key=r+"-"+s+"-"+e,cur=cfg.exTimes[key];
          if(cur&&cur[k]!=null)inp.value=cur[k];
          if(k==="p"&&(setsAt(r)<2||(isAlt()&&e<cfg.ex-1))){inp.disabled=true;inp.style.opacity=.35}
          inp.addEventListener("input",()=>{
            const raw=inp.value.trim(),v=raw===""?null:Math.max(k==="w"?1:0,Math.min(600,parseInt(raw,10)));
            const o=Object.assign({w:null,p:null},cfg.exTimes[key]);o[k]=(v==null||isNaN(v))?null:v;
            if(o.w==null&&o.p==null)delete cfg.exTimes[key];else cfg.exTimes[key]=o;
            render();
          });
          g.appendChild(inp);
        });
      }
      box.appendChild(g);
    }
  }
}
let namesKey="",setsKey="";
buildNames();

let plan;
function render(){
  const k=counts();
  try{curBar()}catch(e){}
  $("sub").textContent=T("{st} stationer · {ex} övn · {sets} set · {rd} varv",{st:k.ST,ex:k.EX,sets:(cfg.setsEach&&k.RD>1?Array.from({length:k.RD},(_,r)=>setsAt(r)).join("/"):k.SETS),rd:k.RD});
  $("modeAuto").setAttribute("aria-pressed",cfg.mode==="auto");$("modeManual").setAttribute("aria-pressed",cfg.mode==="manual");
  $("volOut").textContent=cfg.vol+" %";
  $("mixAmb").setAttribute("aria-pressed",cfg.mix==="ambient");$("mixDuck").setAttribute("aria-pressed",cfg.mix==="transient");
  $("halfOn").setAttribute("aria-pressed",cfg.half);$("halfOff").setAttribute("aria-pressed",!cfg.half);
  $("cdWorkOnly").setAttribute("aria-pressed",!cfg.cdRest);$("cdAll").setAttribute("aria-pressed",cfg.cdRest);
  $("instrPer").setAttribute("aria-pressed",cfg.instrUnit!=="total");$("instrAll").setAttribute("aria-pressed",cfg.instrUnit==="total");
  $("instrPerRow").hidden=cfg.instrUnit==="total";$("instrTotRow").hidden=cfg.instrUnit!=="total";
  $("instrTotSum").textContent=cfg.instrMode==="station"?T("≈ {t} per övning",{t:fmt(instrEach())}):T("en samlad genomgång");
  if(typeof spRender==="function")spRender();
  $("lockOn").setAttribute("aria-pressed",!!cfg.lock);$("lockOff").setAttribute("aria-pressed",!cfg.lock);
  $("mixPlay").setAttribute("aria-pressed",cfg.mix==="playback");
  $("instrBlock").setAttribute("aria-pressed",cfg.instrMode==="block");$("instrStation").setAttribute("aria-pressed",cfg.instrMode==="station");
  $("autoBlock").hidden=cfg.mode!=="auto";$("manualBlock").hidden=cfg.mode!=="manual";
  $("instrSum").textContent=T("{n} övningar = {t}",{n:k.ST*k.EX,t:fmt(k.ST*k.EX*cfg.instr)});
  $("stRestSub").textContent=T("{n} per varv",{n:k.ST-1});
  $("rdRest").closest(".row").hidden=k.RD<2;
  const prNow=perRound();
  $("exRest").closest(".row").hidden=k.EX<2||cfg.oneRest||prNow;
  $("stRest").closest(".row").hidden=k.ST<2||cfg.oneRest||prNow;
  $("oneOff").setAttribute("aria-pressed",!cfg.oneRest);$("oneOn").setAttribute("aria-pressed",!!cfg.oneRest);
  $("oneHint").hidden=!(cfg.oneRest||prNow);
  $("oneHint").textContent=cfg.oneRest?T("Byte av övning och station tar lika lång tid som vilan mellan set i varje varv."):T("Tider för byten ställs in per varv ovan.");
  $("setRest").closest(".row").style.opacity=k.SETS<2?.4:1;
  $("ratioOut").textContent=T("{p} % arbete",{p:cfg.ratio});
  document.querySelectorAll("#ratioChips button").forEach(b=>b.classList.toggle("on",+b.dataset.r===cfg.ratio));
  const c=compute();plan=c;
  const pr=c.pr;
  foldSums();
  const nk=[cfg.st,cfg.ex,cfg.rd,cfg.sets,cfg.exMode,lang,cfg.order,cfg.setsEach,(cfg.roundSets||[]).join(",")].join("|");if(nk!==namesKey){namesKey=nk;buildNames()}
  const se=cfg.setsEach&&k.RD>1;
  $("setsPrGroup").hidden=k.RD<2;$("setsSame").setAttribute("aria-pressed",!se);$("setsEach").setAttribute("aria-pressed",se);
  $("setsRow").hidden=se;$("setsRounds").hidden=!se;
  const sk=[k.RD,se,lang].join("|");
  if(sk!==setsKey){setsKey=sk;const box=$("setsRounds");box.innerHTML="";
    if(se)for(let r=0;r<k.RD;r++){const row=document.createElement("div");row.className="row";
      const l=document.createElement("label");l.htmlFor="rs_"+r;l.textContent=T("Set per övning, varv {n}",{n:r+1});
      const u=document.createElement("span");u.className="unit";u.textContent=T("st");
      row.append(l,stepper("rs_"+r,setsAt(r),1,6,1,v=>{cfg.roundSets[r]=v;render()}),u);box.appendChild(row)}}
  let maxS=0;for(let r=0;r<k.RD;r++)maxS=Math.max(maxS,setsAt(r));
  $("orderBox").hidden=k.EX<2||maxS<2;
  $("orderBlock").setAttribute("aria-pressed",!isAlt());$("orderAlt").setAttribute("aria-pressed",isAlt());
  $("setRestSub").textContent=T(cfg.oneRest?"gäller även byte av övning och station":(isAlt()?"efter sista övningen, före nästa set":"samma övning, set 1 → 2"));
  $("exRestSub").textContent=T(isAlt()?"mellan övningarna i varje set":"inom stationen");
  $("exModeOff").setAttribute("aria-pressed",!cfg.exMode);$("exModeOn").setAttribute("aria-pressed",!!cfg.exMode);
  $("exHint").hidden=!cfg.exMode;
  $("exHint").textContent=T("Lämna en ruta tom för att använda passets vanliga tid.")+(cfg.mode==="auto"?" "+T("Övningar med egna tider räknas bort först, och resten av totaltiden fördelas på de andra."):"");
  let nOv=0;for(let r=0;r<k.RD;r++)for(let s2=0;s2<k.ST;s2++)for(let e=0;e<k.EX;e++)if(ovAt(r,s2,e))nOv++;
  $("exCount").textContent=cfg.exMode&&nOv?T("({n} egna)",{n:nOv}):"";
  document.querySelectorAll("[data-ovr]").forEach(i=>{const r=+i.dataset.ovr;i.placeholder=i.dataset.ovk==="w"?c.Wr[r]:c.Pr[r]});
  $("prGroup").hidden=k.RD<2;
  $("prSame").setAttribute("aria-pressed",!pr);$("prEach").setAttribute("aria-pressed",pr);
  buildRounds();
  $("roundsAuto").hidden=!(pr&&cfg.mode==="auto");$("ratioSingle").hidden=pr&&cfg.mode==="auto";
  $("roundsManual").hidden=!(pr&&cfg.mode==="manual");$("workRow").hidden=$("setRest").closest(".row").hidden=pr&&cfg.mode==="manual";
  if(pr&&cfg.mode==="auto")c.Wr.forEach((w,r)=>{const v=$("rv_"+r);if(v)v.textContent=T("{w} s arbete / {p} s vila",{w:w,p:c.Pr[r]});document.querySelectorAll("#roundsAuto .chips").forEach((ch,i)=>ch.querySelectorAll("button").forEach(b=>b.classList.toggle("on",+b.dataset.r===cfg.rounds[i].ratio)))});
  const uniq=a=>a.every(x=>x===a[0]);
  $("oWork").textContent=(uniq(c.Wr)?c.W:c.Wr.join("/"))+" s";$("oSet").textContent=(uniq(c.Pr)?c.P:c.Pr.join("/"))+" s";
  const xT=r=>cfg.oneRest?c.Pr[r]:exV(r),sT=r=>cfg.oneRest?c.Pr[r]:stV(r);
  const stR=c.Wr.map((w,r)=>{const S=setsAt(r);return isAlt()?k.EX*S*w+(S-1)*c.Pr[r]+S*(k.EX-1)*xT(r):k.EX*S*w+k.EX*(S-1)*c.Pr[r]+(k.EX-1)*xT(r)});
  const perStation=stR[0];
  $("oStation").textContent=uniq(stR)?fmt(perStation):stR.map(fmt).join(" / ");
  const rdR=stR.map((x,r)=>k.ST*x+(k.ST-1)*sT(r)+(cfg.mid==="st"?midCount(r)*(cfg.midTime+sT(r)):0));$("oRound").textContent=uniq(rdR)?fmt(rdR[0]):rdR.map(fmt).join(" / ");
  $("oTotal").textContent=fmtLong(c.total);$("oWorkTot").textContent=fmt(c.workTot);$("oRestTot").textContent=fmt(c.restTot);$("oSetup").textContent=fmt(c.setup);
  $("warn").hidden=!c.warn;$("warn").textContent=c.warn;
  const over=cfg.marginMode==="over";
  $("mgBuffer").setAttribute("aria-pressed",!over);$("mgOver").setAttribute("aria-pressed",over);
  $("marginLbl").textContent=T(over?"Får dra över med":"Tid kvar i slutet");
  $("marginSub").textContent=T(over?"om jämna tider inte går jämnt ut":"till städning eller frågor");
  $("evenOn").setAttribute("aria-pressed",!!cfg.even);$("evenOff").setAttribute("aria-pressed",!cfg.even);
  ["midOff","off","midRound","round","midSt","st"].forEach((x,i,a)=>{if(i%2===0)$(x).setAttribute("aria-pressed",cfg.mid===a[i+1])});
  ["nsName","name","nsNum","num","nsLetter","letter"].forEach((x,i,a)=>{if(i%2===0)$(x).setAttribute("aria-pressed",cfg.nameStyle===a[i+1])});
  $("nsHint").textContent=T(cfg.nameStyle==="name"?"Klockan visar namnen nedan.":"Bra när deltagarna börjar på olika stationer. Klockan visar bara vilken övning på stationen det är, inte namnet.");
  $("midBox").hidden=cfg.mid==="off";$("midEveryRow").hidden=cfg.mid!=="st";
  {let m=0;for(let r=0;r<k.RD;r++)m+=midCount(r);
   $("midEverySub").textContent=T("{n} mellanövningar i hela passet",{n:m});
   $("midHint").textContent=cfg.mid==="round"&&k.RD<2?T("Passet har bara ett varv, så det blir ingen mellanövning."):m?T("Före och efter mellanövningen räknas ett stationsbyte."):T("Det blir ingen mellanövning med de här inställningarna.")}
  $("stretchBox").hidden=!(cfg.stretch>0);
  {const n=stretchN(),all=lines(cfg.stretchList).length;$("stretchHint").textContent=cfg.stretch>0?T("{n} övningar, {t} per övning. Klockan säger till när det är dags för nästa.",{n:n,t:fmtLong(cfg.stretch*60/n)})+(all>n?" "+T("De sista {x} får inte plats (minst 5 s per övning).",{x:all-n}):""):"";}
  $("voiceOn").setAttribute("aria-pressed",!!cfg.voice);$("voiceOff").setAttribute("aria-pressed",!cfg.voice);
  $("voiceHint").textContent=!("speechSynthesis" in window)?T("Den här webbläsaren kan inte läsa upp text."):cfg.voice?T("Rösten säger övningens namn när arbetet börjar, och vila, byten och stretch. Den använder telefonens talsyntes och hörs inte alltid när skärmen är låst."):"";
  $("holdOn").setAttribute("aria-pressed",!!cfg.hold);$("holdOff").setAttribute("aria-pressed",!cfg.hold);
  $("holdHint").textContent=cfg.hold?(cfg.mode==="auto"?T("Om passet pausas eller du backar kortas arbete och setvila resten av passet så att det slutar senast {t} efter start.",{t:fmtLong(c.limit)}):T("Om passet pausas eller du backar kortas arbete och setvila resten av passet så att det slutar på planerad tid."))+" "+T("Arbete blir aldrig kortare än 10 s och vila aldrig kortare än 5 s."):T("Klockan kör tiderna som de är planerade, även om passet pausas.");
  $("fit").hidden=cfg.mode!=="auto"||!!c.warn;
  if(cfg.mode==="auto"&&!c.warn){const d=Math.round(c.total-c.goal);
    let s=d===0?T("Slutar precis på {t} min.",{t:cfg.total}):d<0?T("Slutar {x} före {t} min.",{x:fmtLong(-d),t:cfg.total}):T("Drar över {x} (högst {m} min tillåtet).",{x:fmtLong(d),m:cfg.margin});
    const spare=Math.round(Math.min(c.goal,c.limit)-c.total);
    if(cfg.even&&spare>=60&&d<=0)s+=" "+T("Jämna tider lämnar {x} oanvänt. Välj exakta sekunder, eller använd tiden till uppvärmning eller vila mellan varv.",{x:fmtLong(spare)});
    $("fit").textContent=s}
  const bar=$("bar");bar.innerHTML="";
  buildSeq(c).forEach(it=>{const i=document.createElement("i");i.className=it.type==="work"?"w":it.type;i.style.flexGrow=it.d;bar.appendChild(i)});
  save();
  try{if(!$("paneEx").hidden&&!$("plan").hidden)renderCards()}catch(e){}
  try{scheduleSave()}catch(e){}
  if(!started)resetRun();
}

// --- Tabs ---
const TABS={passes:"tabPass",plan:"tabPass",run:"tabRun",exlib:"tabEx",settings:"tabSet"};
function showTab(t){document.body.classList.toggle("onrun",t==="run");Object.keys(TABS).forEach(sec=>{$(sec).hidden=sec!==t});Object.entries(TABS).forEach(([sec,btn])=>{if(sec!=="plan")$(btn).setAttribute("aria-selected",sec===t||(t==="plan"&&sec==="passes"))});
  if(t==="exlib")renderLib();if(t==="passes")renderPasses();if(t==="plan"&&!$("paneEx").hidden)renderCards();curBar();$("scroller").scrollTo(0,0)}
Object.entries(TABS).forEach(([sec,btn])=>{if(sec!=="plan")$(btn).onclick=()=>showTab(sec)});

// --- Audio ---
let ac=null;
let master=null;
function setSession(){try{if(navigator.audioSession)navigator.audioSession.type=(cfg.lock&&running)?"playback":(cfg.mix||"ambient")}catch(e){}}
function makeCtx(){try{if(ac&&ac.close)ac.close()}catch(e){}ac=null;master=null;
  try{ac=new (window.AudioContext||window.webkitAudioContext)();
    const comp=ac.createDynamicsCompressor();comp.threshold.value=-18;comp.knee.value=6;comp.ratio.value=6;comp.attack.value=.002;comp.release.value=.15;
    master=ac.createGain();master.gain.value=1.6;master.connect(comp);comp.connect(ac.destination);
    ac.onstatechange=checkAudio;
    const b=ac.createBuffer(1,1,22050),s=ac.createBufferSource();s.buffer=b;s.connect(ac.destination);s.start(0);
    if(ac.state!=="running"&&ac.resume){const p=ac.resume();if(p&&p.then)p.then(checkAudio,checkAudio)}
  }catch(e){ac=null}}
function ensureAudio(){setSession();if(!ac||ac.state==="closed")makeCtx();
  else if(ac.state!=="running"){const p=ac.resume&&ac.resume();if(p&&p.then)p.then(checkAudio,()=>{makeCtx();checkAudio()})}
  checkAudio()}
function checkAudio(){const w=$("audioWarn");if(w)w.hidden=!(cfg.sound&&ac&&ac.state!=="running"&&running)}
function out(){return master||ac.destination}
function wake2(){if(ac&&ac.state!=="running"){try{ac.resume().then(checkAudio,checkAudio)}catch(e){}}}
$("audioWarn").onclick=()=>{makeCtx();setTimeout(checkAudio,300);play("start")};
["focus","pageshow"].forEach(ev=>window.addEventListener(ev,wake2));
document.addEventListener("visibilitychange",()=>{if(!document.hidden)wake2()});
function setMix(m){cfg.mix=m;render();setSession();makeCtx();play("start")}
$("mixAmb").onclick=()=>setMix("ambient");$("mixDuck").onclick=()=>setMix("transient");$("mixPlay").onclick=()=>setMix("playback");
["pointerdown","touchend","click","keydown"].forEach(ev=>document.addEventListener(ev,()=>{if(!ac||ac.state!=="running")ensureAudio()},{capture:true,passive:true}));
let catchUp=false;
function beep(f,dur,vol,delay,type,opt){if(!cfg.sound||!ac||catchUp)return;try{opt=opt||{};const o=ac.createOscillator(),g=ac.createGain();o.type=type||"square";const t=ac.currentTime+(delay||0);o.frequency.setValueAtTime(f,t);
  if(opt.to)o.frequency.exponentialRampToValueAtTime(opt.to,t+(opt.toT||dur));
  if(opt.vib){const l=ac.createOscillator(),lg=ac.createGain();l.frequency.value=opt.vib[0];lg.gain.value=opt.vib[1];l.connect(lg);lg.connect(o.frequency);l.start(t);l.stop(t+dur+.05)}
  if(ac.state!=="running")wake2();
  o.connect(g);g.connect(out());const v=Math.min(.9,(vol||.15)*cfg.vol/60);
  g.gain.setValueAtTime(0,ac.currentTime);g.gain.setValueAtTime(v,t);
  if(opt.sustain){g.gain.setValueAtTime(v,t+Math.max(0,dur-.06));g.gain.linearRampToValueAtTime(.0001,t+dur)}else g.gain.exponentialRampToValueAtTime(.0001,t+dur);
  o.start(t);o.stop(t+dur+.05)}catch(e){}}
function noise(dur,vol,delay,freq,kind){if(!cfg.sound||!ac||catchUp)return;try{const n=Math.ceil(ac.sampleRate*dur),buf=ac.createBuffer(1,n,ac.sampleRate),d=buf.getChannelData(0);for(let i=0;i<n;i++)d[i]=Math.random()*2-1;
  const src=ac.createBufferSource(),fl=ac.createBiquadFilter(),g=ac.createGain();src.buffer=buf;fl.type=kind||"bandpass";fl.frequency.value=freq||2000;src.connect(fl);fl.connect(g);g.connect(out());
  const t=ac.currentTime+(delay||0),v=Math.min(.9,vol*cfg.vol/60);g.gain.setValueAtTime(v,t);g.gain.exponentialRampToValueAtTime(.0001,t+dur);src.start(t);src.stop(t+dur+.02)}catch(e){}}
function bellHit(d){[[523,1],[1046,.6],[1443,.45],[2093,.25]].forEach(([f,a])=>beep(f,1.1,.35*a,d,"sine"))}
function drumHit(d,big){beep(big?150:180,.35,.7,d,"sine",{to:45});noise(.09,.35,d,big?900:1800)}
const SOUNDS={
  bell:["Ringklocka, tre slag",()=>{bellHit(0);bellHit(.22);bellHit(.44)}],
  bell1:["Ringklocka, ett slag",()=>bellHit(0)],
  whistle:["Visselpipa",()=>{beep(2800,.22,.22,0,"sine",{vib:[30,200],sustain:true});beep(2800,.6,.22,.32,"sine",{vib:[30,200],sustain:true})}],
  horn:["Tuta",()=>{[220,277,330].forEach((f,i)=>beep(f,.9,.2-i*.02,0,"sawtooth",{sustain:true}))}],
  buzzer:["Summer",()=>{beep(140,.8,.28,0,"sawtooth",{sustain:true});beep(147,.8,.22,0,"square",{sustain:true})}],
  gong:["Gong",()=>{[[110,1],[185,.6],[264,.4],[380,.25]].forEach(([f,a])=>beep(f,2.6,.4*a,0,"sine"))}],
  drum:["Trumslag",()=>{drumHit(0);drumHit(.18);drumHit(.36,true)}],
  rise:["Stigande pip",()=>{beep(784,.16,.3,0);beep(988,.16,.3,.18);beep(1318,.7,.35,.36)}],
  fall:["Fallande pip",()=>{beep(659,.25,.25,0);beep(440,.5,.25,.28)}],
  double:["Dubbelpip",()=>{beep(1568,.12,.3,0,"triangle");beep(1568,.12,.3,.18,"triangle");beep(2093,.3,.3,.36,"triangle")}],
  chime:["Klockspel",()=>{[1047,1319,1568,2093].forEach((f,i)=>beep(f,.9,.28,i*.13,"sine"))}],
  laser:["Laser",()=>{beep(1800,.35,.25,0,"sawtooth",{to:200})}],
  none:["Inget ljud",()=>{}]
};
const TICKS={
  pip:["Pip",l=>beep(l?1175:880,.13,.25)],
  wood:["Träkloss",l=>beep(l?2400:1900,.06,.5,0,"sine")],
  click:["Klick",l=>noise(.035,l?.8:.55,0,l?4500:3500,"highpass")],
  drum:["Trumma",l=>drumHit(0,l)],
  bellt:["Pling",l=>beep(l?1568:1175,.4,.3,0,"sine")],
  none:["Inget ljud",()=>{}]
};
const EVENTS=[["start","Övning startar",SOUNDS],["half","Halvtid",SOUNDS],["cd","Nedräkning",TICKS],["rest","Övning slut",SOUNDS],["done","Passet klart",SOUNDS]];
function play(ev,arg){const lib=ev==="cd"?TICKS:SOUNDS;const x=lib[cfg.snd[ev]]||lib.none;x[1](arg);if(ev==="start")hit()}
function startSignal(){play("start")}
function halfSignal(){play("half")}
function restSignal(){play("rest")}
function cdBeep(sec){play("cd",sec===1)}
function hit(){const f=$("face");f.classList.remove("hit");void f.offsetWidth;f.classList.add("hit")}
let flashT=0;function flash(txt){const el=$("rFlash");el.textContent=txt;el.hidden=false;clearTimeout(flashT);flashT=setTimeout(()=>{el.hidden=true},2000);hit()}
function testEv(ev){ensureAudio();if(ev==="cd"){const n=Math.max(1,Math.min(5,cfg.countdown||3));for(let i=n;i>=1;i--)setTimeout(()=>cdBeep(i),(n-i)*1000)}else play(ev)}
function buildSnd(){const box=$("sndList");box.innerHTML="";EVENTS.forEach(([ev,lab,lib])=>{
  const row=document.createElement("div");row.className="snd";
  const l=document.createElement("label");l.htmlFor="snd_"+ev;l.textContent=T(lab);
  const sel=document.createElement("select");sel.id="snd_"+ev;
  Object.entries(lib).forEach(([k,v])=>{const o=document.createElement("option");o.value=k;o.textContent=T(v[0]);sel.appendChild(o)});
  sel.value=cfg.snd[ev];sel.addEventListener("change",()=>{cfg.snd[ev]=sel.value;save();testEv(ev)});
  const b=document.createElement("button");b.className="btn";b.textContent="▶";b.setAttribute("aria-label",T("Testa {x}",{x:T(lab)}));b.onclick=()=>testEv(ev);
  row.append(l,sel,b);box.appendChild(row)})}
buildSnd();
$("vol").value=cfg.vol;$("vol").addEventListener("input",e=>{cfg.vol=+e.target.value;render()});
$("halfOn").onclick=()=>{cfg.half=true;render()};$("halfOff").onclick=()=>{cfg.half=false;render()};
function soundLbl(){$("bSound").textContent=T(cfg.sound?"Ljud: på":"Ljud: av")}
$("bSound").onclick=()=>{cfg.sound=!cfg.sound;soundLbl();save()};
soundLbl();

// --- Runner ---
let halfDone=false;
let seq=[],idx=0,remain=0,running=false,started=false,lastT=0,raf=0,lastBeepSec=-1,wake=null;
const PREP=10;
function seqTotal(){return seq.reduce((a,b)=>a+b.d,0)}
// Keeping the end time: when the workout starts, the latest end is fixed on the clock. After a pause or going back,
// the remaining work and set rest are shortened evenly (down to a floor) so the workout still ends in time.
let deadline=0,cut=0,late=0;
function runLimit(){return cfg.mode==="auto"?plan.limit:plan.total}
function rebalance(from){
  cut=0;late=0;if(!deadline)return;
  let avail=(deadline-Date.now())/1000;
  for(let i=idx;i<from;i++)avail-=i===idx?Math.max(0,remain):seq[i].d;
  const flex=[];
  for(let i=from;i<seq.length;i++){const it=seq[i];if(cfg.hold&&(it.type==="work"||it.type==="p"))flex.push(it);else{if(it.d0!=null)it.d=it.d0;avail-=it.d}}
  const full=flex.reduce((a,it)=>a+it.d0,0);
  const fl=it=>Math.min(it.d0,it.type==="work"?10:5);
  const sum=s=>flex.reduce((a,it)=>a+Math.max(fl(it),Math.floor(it.d0*s)),0);
  let s=1;
  if(full>avail){let lo=0,hi=1;for(let k=0;k<30;k++){const m=(lo+hi)/2;if(sum(m)<=avail)lo=m;else hi=m}s=lo}
  flex.forEach(it=>{it.d=s>=1?it.d0:Math.max(fl(it),Math.floor(it.d0*s))});
  // Hand back the seconds lost to rounding down, one at a time, so the cut is no bigger than needed.
  if(s<1){let spare=Math.floor(avail-flex.reduce((a,it)=>a+it.d,0));for(let i=0;i<flex.length&&spare>0;i++)if(flex[i].d<flex[i].d0){flex[i].d++;spare--}}
  const now=flex.reduce((a,it)=>a+it.d,0);cut=full-now;late=Math.max(0,Math.round(now-avail));
}
function endText(){
  if(!started||!deadline||idx>=seq.length)return "";
  let left=Math.max(0,remain);for(let i=idx+1;i<seq.length;i++)left+=seq[i].d;
  const end=new Date(Date.now()+left*1000),hm=String(end.getHours()).padStart(2,"0")+":"+String(end.getMinutes()).padStart(2,"0");
  let s=T("Slutar ca {t}",{t:hm});
  if(late>0)s+=" · "+T(cfg.hold?"{x} sent, går inte att korta mer":"{x} efter planen",{x:fmt(late)});
  else if(cut>=1)s+=" · "+T("arbete och vila kortade {x} för att hinna",{x:fmt(cut)});
  return s;
}
function resetRun(){deadline=0;cut=0;late=0;seq=buildSeq(plan);seq.forEach(it=>it.d0=it.d);seq.unshift({type:"prep",d:PREP,d0:PREP});idx=0;remain=seq[0].d;running=false;started=false;clearInterval(raf);stopLock();$("bMain").textContent=T("Start");draw()}
function label(it){
  const k=counts();
  if(!it)return{phase:T("Klart"),what:T("Bra jobbat!"),where:"",cls:"done"};
  const where=(k.RD>1?T("Varv {r}/{n}",{r:it.r+1,n:k.RD})+" · ":"")+"Station "+(it.s+1)+"/"+k.ST+(k.EX>1?" · "+(cfg.nameStyle==="num"?it.e+1:L[it.e]):"")+(setsAt(it.r)>1?" · Set "+(it.k+1)+"/"+setsAt(it.r):"");
  switch(it.type){
    case"prep":{const f=seq[1];return{phase:T("Gör dig redo"),what:f&&f.type==="warm"?T("Uppvärmning"):exName(0,0,true),where:T("Passet startar"),cls:"rest"}}
    case"go":return{phase:T("Gör dig redo"),what:T("Gå till station 1")+": "+exName(0,0,true),where:T("Passet börjar snart"),cls:"rest"};
    case"warm":return{phase:T("Uppvärmning"),what:T("Värm upp"),where:"",cls:"setup"};
    case"instr":if(it.all)return{phase:T("Genomgång"),what:T("Alla övningar"),where:T("{n} övningar",{n:k.ST*k.EX}),cls:"setup"};return{phase:T("Genomgång"),what:exName(it.s,it.e,true),where:it.at?T("Station {s} · före första set",{s:it.s+1}):T("Övning {n} av {t}",{n:it.n+1,t:k.ST*k.EX}),cls:"setup"};
    case"work":return{phase:T("Arbete"),what:exName(it.s,it.e),where,cls:"work"};
    case"p":return{phase:T("Vila"),what:"Set "+(it.k+2)+" – "+exName(it.s,isAlt()?0:it.e),where,cls:"rest"};
    case"e":return{phase:T("Byt övning"),what:"→ "+exName(it.s,it.e+1),where,cls:"rest"};
    case"s":if(it.toMid)return{phase:T("Till mellanövningen"),what:"→ "+midName(it.m),where,cls:"rest"};return{phase:T("Byt station"),what:"→ "+exName(it.s+1,0),where,cls:"rest"};
    case"mid":return{phase:T("Mellanövning"),what:midName(it.m),where:(k.RD>1?T("Varv {r}/{n}",{r:it.r+1,n:k.RD})+" · ":"")+T("alla gör samma"),cls:"mid"};
    case"cool":return{phase:T("Stretch"),what:it.name||T("Stretcha"),where:it.of>1?T("{n} av {t}",{n:it.n+1,t:it.of}):"",cls:"cool"};
    case"R":return{phase:T("Varvvila"),what:T("Varv {n} börjar med {x}",{n:it.r+2,x:exName(0,0)}),where:T("Varv {n} klart",{n:it.r+1}),cls:"round"};
  }
}
// The exercise description is shown during demos, and during work when the timer shows exercise names.
let descKey="",descVal="";
function descFor(it){const k=idx+"|"+(typeof libVer==="number"?libVer:0)+"|"+cfg.nameStyle+"|"+lang+"|"+seq.length;if(k===descKey)return descVal;descKey=k;descVal=descFor0(it);return descVal}
function descFor0(it){if(!it||typeof descOf!=="function")return "";
  if(it.type==="instr"&&!it.all){const i=exInfo(exName(it.s,it.e,true));return[i.how,i.look?T("Titta på: {x}",{x:i.look}):"",i.note].filter(Boolean).join("\n")}
  if(it.type==="work"&&cfg.nameStyle==="name")return noteOf(exName(it.s,it.e,true));
  if(it.type==="mid")return descOf(midName(it.m));
  if(it.type==="cool")return descOf(it.name);
  return ""}
function nextLabel(it){if(!it)return T("Passet klart");if(it.type==="mid")return T("Mellanövning")+": "+midName(it.m);if(it.type==="cool")return T("Stretch")+(it.name?": "+it.name:"");if(it.type==="work")return exName(it.s,it.e)+(setsAt(it.r)>1?" · set "+(it.k+1):"");if(it.type==="instr")return it.all?T("Genomgång"):T("Genomgång: {x}",{x:exName(it.s,it.e,true)});return label(it).phase}
function draw(){
  if(typeof updateLock==="function")updateLock(false);
  const it=seq[idx],lb=label(it);
  $("face").className="face "+lb.cls;
  $("rPhase").textContent=lb.phase;$("rWhat").textContent=lb.what;$("rWhere").textContent=lb.where;
  const ds=descFor(it);$("rDesc").hidden=!ds;$("rDesc").textContent=ds;$("rDesc").classList.toggle("long",!!it&&it.type==="instr");
  $("rClock").textContent=it?fmt(Math.ceil(remain-1e-6)):"0:00";
  $("rProg").style.width=it?(100*(1-remain/it.d))+"%":"100%";
  const nx=seq[idx+1];$("nWhat").textContent=nextLabel(nx);$("nDur").textContent=nx?fmt(nx.d):"";
  let done=0;for(let i=0;i<idx;i++)done+=seq[i].d;if(it)done+=it.d-remain;
  $("mEl").textContent=fmt(Math.max(0,done-PREP));$("mLeft").textContent=fmt(seqTotal()-done);
  const et=endText();$("mEnd").hidden=!et;$("mEnd").textContent=et;
  $("mIdx").textContent=seq.slice(0,idx+1).filter(x=>x.type==="work").length+"/"+counts().W;
}
function advance(){idx++;if(idx>=seq.length){running=false;clearInterval(raf);$("bMain").textContent=T("Start");draw();play("done");sayItem(null);spEnd();stopLock();if(!cfg.awake)releaseWake();return}remain=0;rebalance(idx);remain=seq[idx].d;lastBeepSec=-1;halfDone=false;
  if(isWorkT(seq[idx]))startSignal();else if(isWorkT(seq[idx-1]))restSignal();else if(seq[idx].type==="cool"&&seq[idx-1]&&seq[idx-1].type==="cool"){halfSignal();flash(T("Nästa stretch"))}
  sayItem(seq[idx],seq[idx-1]);spPhase();}
// Voice: the phone's built-in speech reads out each new phase, so the coach does not have to look at the screen.
function pickVoice(){try{const p=lang==="en"?"en":"sv";return speechSynthesis.getVoices().find(v=>(v.lang||"").toLowerCase().startsWith(p))||null}catch(e){return null}}
function say(txt){if(!cfg.voice||!cfg.sound||catchUp||!txt||!("speechSynthesis" in window))return;
  setTimeout(()=>{try{const u=new SpeechSynthesisUtterance(txt);u.lang=lang==="en"?"en-GB":"sv-SE";const v=pickVoice();if(v)u.voice=v;u.rate=1.05;u.volume=Math.max(.2,Math.min(1,(cfg.vol||80)/100));speechSynthesis.cancel();speechSynthesis.speak(u)}catch(e){}},400)}
function unlockVoice(){if(!cfg.voice||!("speechSynthesis" in window))return;try{const u=new SpeechSynthesisUtterance(" ");u.volume=0;speechSynthesis.speak(u)}catch(e){}}
function sayItem(it,prev){if(!it)return say(T("Passet är klart. Bra jobbat!"));
  switch(it.type){
    case"work":return say(exName(it.s,it.e));
    case"p":return say(T("Vila"));
    case"e":return say(T("Byt övning")+". "+exName(it.s,it.e+1));
    case"s":return say(it.toMid?T("Till mellanövningen")+". "+midName(it.m):T("Byt station"));
    case"mid":return say(T("Mellanövning")+". "+midName(it.m));
    case"R":return say(T("Varvvila"));
    case"warm":return say(T("Uppvärmning"));
    case"instr":return say(it.all?T("Genomgång"):T("Genomgång")+". "+exName(it.s,it.e,true));
    case"go":return say(T("Gå till första stationen"));
    case"cool":return say((prev&&prev.type==="cool"?"":T("Stretch")+". ")+(it.name||""));
  }}
function isWorkT(it){return !!it&&(it.type==="work"||it.type==="mid")}
let audioChk=0;
function tick(t){
  if(!running)return;
  if(t-audioChk>1000){audioChk=t;if(ac&&ac.state!=="running")wake2();checkAudio()}
  const dt=(t-lastT)/1000;lastT=t;remain-=dt;
  catchUp=dt>2;
  const sec=Math.ceil(remain);
  const cur=seq[idx];
  if(cur&&cfg.half&&!halfDone&&cur.type==="work"&&cur.d>=10&&remain<=cur.d/2){halfDone=true;halfSignal();flash(T("Byt sida"))}
  if(cur&&cfg.countdown>0&&sec<=cfg.countdown&&sec>=1&&sec!==lastBeepSec&&sec<cur.d&&(isWorkT(cur)||cfg.cdRest||(isWorkT(seq[idx+1])&&cur.type!=="warm"))){lastBeepSec=sec;cdBeep(sec)}
  while(running&&remain<=0){const over=-remain;advance();if(running)remain-=over}
  catchUp=false;
  draw();
}
let noSleep=null,nsOn=false;
function wakeMsg(ok){const m=$("wakeMsg");m.hidden=false;m.dataset.ok=ok?"1":"0";m.textContent=T(ok?"☀ Skärmen hålls tänd under passet.":"Telefonen kan släcka skärmen. Stäng av automatiskt lås i telefonens inställningar under passet.");m.style.color=ok?"":"var(--danger)"}
async function getWake(){
  let ok=false;
  try{if(navigator.wakeLock){wake=await navigator.wakeLock.request("screen");ok=true;wake.addEventListener&&wake.addEventListener("release",()=>{wake=null})}}catch(e){}
  if(!ok){try{if(!noSleep&&window.NoSleep)noSleep=new window.NoSleep();if(noSleep){const p=noSleep.enable();if(p&&p.then)await p;nsOn=true;ok=true}}catch(e){}}
  wakeMsg(ok);
}
function releaseWake(){try{wake&&wake.release();wake=null}catch(e){}try{if(noSleep&&nsOn){noSleep.disable();nsOn=false}}catch(e){}}
$("bMain").onclick=()=>{
  ensureAudio();unlockVoice();
  if(idx>=seq.length)resetRun();
  const firstStart=!started;
  running=!running;started=true;if(firstStart&&running)markRun();
  if(running&&!deadline){let done=0;for(let i=0;i<idx;i++)done+=seq[i].d;if(seq[idx])done+=seq[idx].d-remain;deadline=Date.now()+(runLimit()-(done-PREP))*1000}
  spOnToggle(running,firstStart);
  $("bMain").textContent=T(running?"Paus":"Fortsätt");
  rebalance(idx+1);draw();
  if(running){lastT=performance.now();if(cfg.awake)getWake();clearInterval(raf);raf=setInterval(()=>tick(performance.now()),200);startLock();lockMusicNote()}else{clearInterval(raf);raf=setInterval(()=>{rebalance(idx+1);draw()},1000);if(!cfg.awake)releaseWake();updateLock(true)}
  setSession();checkAudio();
};
$("bNext").onclick=()=>{if(idx<seq.length){started=true;advance();draw()}};
$("bPrev").onclick=()=>{if(seq[idx]&&remain<seq[idx].d-2){remain=seq[idx].d}else if(idx>0){idx--;remain=seq[idx].d}lastBeepSec=-1;halfDone=false;rebalance(idx+1);draw()};
// −30 s / +30 s on the running interval. With "Keep the end time" the rest of the workout absorbs the change.
function adjustNow(dlt){const it=seq[idx];if(!it)return;const nr=Math.max(1,remain+dlt),real=nr-remain;if(!real)return;it.d=Math.max(1,it.d+real);remain=nr;started=true;rebalance(idx+1);draw();flash((real>0?"+":"−")+fmt(Math.abs(real)))}
$("bPlus").onclick=()=>adjustNow(30);$("bMinus").onclick=()=>adjustNow(-30);
$("bReset").onclick=()=>{resetRun();if(!cfg.awake)releaseWake()};
document.addEventListener("visibilitychange",()=>{if(!document.hidden&&(running||cfg.awake)&&!$("run").hidden)getWake()});

// --- Keep screen on + focus mode ---
function awakeLbl(){$("bAwake").setAttribute("aria-pressed",!!cfg.awake);$("bAwake").textContent=T(cfg.awake?"☀ Skärm tänd":"Skärm kan släckas")}
$("bAwake").onclick=()=>{cfg.awake=!cfg.awake;save();awakeLbl();if(cfg.awake)getWake();else{releaseWake();$("wakeMsg").hidden=true}};
$("bFocus").onclick=()=>{const on=!document.body.classList.contains("focus");document.body.classList.toggle("focus",on);$("bFocus").setAttribute("aria-pressed",on);$("bFocus").textContent=T(on?"Visa allt":"Fokusläge")};
awakeLbl();

// --- Lock screen (Media Session) ---
let lockAudio=null,lockUrl=null,lockLast="";
function silentWav(){const sr=8000,n=sr*2,b=new ArrayBuffer(44+n*2),v=new DataView(b);const w=(o,t)=>{for(let i=0;i<t.length;i++)v.setUint8(o+i,t.charCodeAt(i))};
  w(0,"RIFF");v.setUint32(4,36+n*2,true);w(8,"WAVE");w(12,"fmt ");v.setUint32(16,16,true);v.setUint16(20,1,true);v.setUint16(22,1,true);v.setUint32(24,sr,true);v.setUint32(28,sr*2,true);v.setUint16(32,2,true);v.setUint16(34,16,true);w(36,"data");v.setUint32(40,n*2,true);
  for(let i=0;i<n;i++)v.setInt16(44+i*2,(Math.random()-.5)*4,true);return new Blob([b],{type:"audio/wav"})}
function startLock(){
  if(!cfg.lock||!("mediaSession" in navigator))return;
  try{
    if(!lockAudio){lockUrl=URL.createObjectURL(silentWav());lockAudio=new Audio(lockUrl);lockAudio.loop=true;lockAudio.setAttribute("playsinline","");lockAudio.volume=1}
    const p=lockAudio.play();if(p&&p.catch)p.catch(()=>{});
    const ms=navigator.mediaSession;
    ms.setActionHandler("play",()=>{if(!running)$("bMain").click()});
    ms.setActionHandler("pause",()=>{if(running)$("bMain").click()});
    try{ms.setActionHandler("nexttrack",()=>$("bNext").click())}catch(e){}
    try{ms.setActionHandler("previoustrack",()=>$("bPrev").click())}catch(e){}
    lockLast="";updateLock(true);
  }catch(e){}
}
// The lock screen player needs the phone's audio for itself, so iPhone pauses music in other apps. Say so once per
// app start, with a button that switches to mixing with the music instead.
let lockNoted=false;
function lockMusicNote(){if(!cfg.lock||lockNoted)return;lockNoted=true;
  undoable(T("Klockan visas på låsskärmen, därför pausas musik i andra appar."),()=>{cfg.lock=false;stopLock();setSession();render()},T("Stäng av"))}
function stopLock(){try{if(lockAudio){lockAudio.pause()}if("mediaSession" in navigator){navigator.mediaSession.metadata=null;navigator.mediaSession.playbackState="none"}}catch(e){}}
function updateLock(force){
  if(!cfg.lock||!lockAudio||!("mediaSession" in navigator))return;
  try{
    const it=seq[idx],lb=label(it),time=it?fmt(Math.ceil(remain-1e-6)):"0:00";
    const title=lb.phase+" · "+time;
    if(!force&&title===lockLast)return;lockLast=title;
    const ms=navigator.mediaSession;
    ms.metadata=new MediaMetadata({title,artist:lb.what,album:lb.where||"CrossCage",artwork:[{src:"icons/icon-512.png",sizes:"512x512",type:"image/png"},{src:"icons/icon-192.png",sizes:"192x192",type:"image/png"}]});
    ms.playbackState=running?"playing":"paused";
    if(it&&ms.setPositionState)ms.setPositionState({duration:it.d,position:Math.min(it.d,Math.max(0,it.d-remain)),playbackRate:1});
    if(running&&lockAudio.paused){const p=lockAudio.play();if(p&&p.catch)p.catch(()=>{})}
  }catch(e){}
}

// --- Saved passes, exercise library and backup ---
const PASS_KEY="ccage_passes",LIB_KEY="ccage_exlib";
let db=null,uid=null,passes=[];
// Settings that belong to this phone, not to a workout: loading a pass or template keeps them.
const DEVICE_KEYS=["sound","vol","mix","snd","half","countdown","cdRest","lock","awake","voice","spStart","spPause","spDuck","spWorkVol","spRestVol"];
function deviceOf(c){const d={};DEVICE_KEYS.forEach(k=>{if(c[k]!==undefined)d[k]=JSON.parse(JSON.stringify(c[k]))});return d}
function passMsg(t,bad){const m=$("passMsg");m.textContent=t;m.style.color=bad?"var(--danger)":""}
function where(){return T(db?"Sparas i ditt Claude-konto och följer med till andra enheter.":"Sparas i den här webbläsaren.")}
function passData(){const c=JSON.parse(JSON.stringify(cfg));DEVICE_KEYS.forEach(k=>delete c[k]);return c}
function coll(){return db.collection("data/users/"+uid)}
function useLocal(){db=null}
function withTimeout(p){return Promise.race([p,new Promise((_,r)=>setTimeout(()=>r(new Error("timeout")),10000))])}
function readLocal(k,def){try{const v=JSON.parse(localStorage.getItem(k)||"null");return v==null?def:v}catch(e){return def}}
function writeLocal(k,v){try{localStorage.setItem(k,JSON.stringify(v));return true}catch(e){return false}}
async function loadPasses(){
  try{
    if(db){try{await flushLib();const snap=await withTimeout(coll().get());const docs=snap.docs.map(d=>Object.assign({id:d.id},d.data()));
      passes=docs.filter(p=>p.name&&p.cfg);const l=docs.find(d=>d.id==="exlib");
      if(l&&l.lib){let remote=null;try{remote=JSON.parse(l.lib)}catch(e){}if(Array.isArray(remote)&&mergeLib(remote))saveLib()}}catch(e){useLocal()}}
    if(!db)passes=readLocal(PASS_KEY,[]);
  }catch(e){passes=[];passMsg(T("Kunde inte hämta sparade pass. Kontrollera anslutningen och ladda om sidan."),true);renderPasses();return}
  renderPasses();renderLib();renderDefs();passMsg(T("Ändringar sparas automatiskt.")+" "+where());
}
async function storePass(data,id){
  if(db){const ref=coll().doc(id||"pass_"+Date.now());await withTimeout(ref.set(data));return ref.id}
  id=id||"p"+Date.now()+Math.random().toString(36).slice(2,6);const list=readLocal(PASS_KEY,[]).filter(p=>p.id!==id);list.push(Object.assign({id},data));
  if(!writeLocal(PASS_KEY,list))throw new Error("storage");return id;
}
async function dropPass(id){
  if(db){await withTimeout(coll().doc(id).delete());return}
  if(!writeLocal(PASS_KEY,readLocal(PASS_KEY,[]).filter(x=>x.id!==id)))throw new Error("storage");
}
function cfgOf(p){try{return typeof p.cfg==="string"?JSON.parse(p.cfg):p.cfg}catch(e){return null}}
function passSummary(c){const parts=[T("{n} stationer",{n:c.st||0}),T("{n} varv",{n:c.rd||1})];if(c.mode==="auto"&&c.total)parts.push(c.total+" min");if(c.stretch)parts.push(T("stretch {n} min",{n:c.stretch}));if(c.mid&&c.mid!=="off")parts.push(T("mellanövning"));return parts.join(" · ")}
function syncInputs(){roundsKey="";namesKey="";setsKey="";fields.forEach(f=>{$(f).value=cfg[f]});$("ratio").value=cfg.ratio;$("vol").value=cfg.vol;$("stretchList").value=cfg.stretchList.join("\n");$("midList").value=cfg.midList.join("\n");buildNames();buildSnd()}


// --- Station cards ---
// Stations follow from the exercises you add: "+ Add station" picks the station's first exercise.
// All stations have the same number of exercise slots (A, B, …), which the timer needs; an empty slot shows as "Choose exercise".
function setStructure(st,ex){cfg.st=Math.max(1,Math.min(20,st));cfg.ex=Math.max(1,Math.min(4,ex));$("st").value=cfg.st;$("ex").value=cfg.ex;namesKey="";buildNames()}
// Station order changed: perm[newIndex] = oldIndex. Names and per-exercise times follow their station.
function reorder(perm){const names=perm.map(o=>(cfg.names[o]||[]).slice()),times={};
  Object.keys(cfg.exTimes).forEach(k=>{const [r,s,e]=k.split("-").map(Number);const ns=perm.indexOf(s);if(ns>=0)times[r+"-"+ns+"-"+e]=cfg.exTimes[k]});
  cfg.names=names;cfg.exTimes=times}
function trimSlots(){while(cfg.ex>1&&!Array.from({length:cfg.st},(_,s)=>((cfg.names[s]||[])[cfg.ex-1]||"").trim()).some(Boolean)){cfg.ex--;Object.keys(cfg.exTimes).forEach(k=>{if(+k.split("-")[2]>=cfg.ex)delete cfg.exTimes[k]})}}
function cardsChanged(trim){if(trim)trimSlots();setStructure(cfg.st,cfg.ex);render()}
function renderCards(){
  const box=$("stCards");if(!box)return;box.innerHTML="";
  for(let s=0;s<cfg.st;s++){
    const card=document.createElement("div");card.className="scard";
    const hd=document.createElement("div");hd.className="hd";const b=document.createElement("b");b.textContent=T("Station {n}",{n:s+1});hd.appendChild(b);
    const hb=(txt,label,fn,dis)=>{const x=document.createElement("button");x.textContent=txt;x.setAttribute("aria-label",label);x.disabled=!!dis;x.onclick=fn;hd.appendChild(x)};
    hb("↑",T("Flytta upp station {n}",{n:s+1}),()=>{const p=[...Array(cfg.st).keys()];[p[s-1],p[s]]=[p[s],p[s-1]];reorder(p);cardsChanged()},s===0);
    hb("↓",T("Flytta ned station {n}",{n:s+1}),()=>{const p=[...Array(cfg.st).keys()];[p[s+1],p[s]]=[p[s],p[s+1]];reorder(p);cardsChanged()},s===cfg.st-1);
    hb("✕",T("Ta bort station {n}",{n:s+1}),()=>{const before=JSON.parse(JSON.stringify({st:cfg.st,ex:cfg.ex,names:cfg.names,exTimes:cfg.exTimes}));
      if(cfg.st>1){const p=[...Array(cfg.st).keys()].filter(i=>i!==s);reorder(p);cfg.st--}else cfg.names=[];
      cardsChanged(true);undoable(T("Station {n} togs bort.",{n:s+1}),()=>{Object.assign(cfg,before);setStructure(cfg.st,cfg.ex)})});
    card.appendChild(hd);
    for(let e=0;e<cfg.ex;e++){
      const row=document.createElement("div");row.className="slot";
      if(cfg.ex>1){const lt=document.createElement("span");lt.className="lt";lt.textContent=L[e];row.appendChild(lt)}
      const nm=((cfg.names[s]||[])[e]||"").trim();
      const btn=document.createElement("button");btn.className="nmb"+(nm?"":" empty");btn.textContent=nm||T("Välj övning");
      btn.setAttribute("aria-label",(nm?T("Byt övning"):T("Välj övning"))+": "+T("station {n}",{n:s+1})+(cfg.ex>1?" "+L[e]:""));
      btn.onclick=()=>openPicker(T("Station {n}",{n:s+1})+(cfg.ex>1?" · "+L[e]:""),name=>{cfg.names[s]=cfg.names[s]||[];cfg.names[s][e]=name;cardsChanged()});
      row.appendChild(btn);
      if(cfg.ex>1&&nm){const x=document.createElement("button");x.className="x";x.textContent="✕";x.setAttribute("aria-label",T("Ta bort {x} från station {n}",{x:nm,n:s+1}));
        x.onclick=()=>{cfg.names[s][e]="";cardsChanged(true)};row.appendChild(x)}
      card.appendChild(row);
    }
    if(cfg.ex<4){const add=document.createElement("button");add.className="addex";add.textContent=T("+ Övning {l}",{l:L[cfg.ex]});
      add.onclick=()=>openPicker(T("Station {n}",{n:s+1})+" · "+L[cfg.ex],name=>{const e=cfg.ex;setStructure(cfg.st,cfg.ex+1);cfg.names[s]=cfg.names[s]||[];cfg.names[s][e]=name;cardsChanged()});
      card.appendChild(add)}
    box.appendChild(card);
  }
  $("stAdd").disabled=cfg.st>=20;
}
$("stAdd").onclick=()=>openPicker(T("Station {n}",{n:cfg.st===1&&!((cfg.names[0]||[]).some(x=>(x||"").trim()))?1:cfg.st+1}),name=>{
  // the first station of a new workout is the empty one it starts with
  const empty=cfg.st===1&&!((cfg.names[0]||[]).some(x=>(x||"").trim()));
  if(!empty)setStructure(cfg.st+1,cfg.ex);const s=empty?0:cfg.st-1;cfg.names[s]=[name];cardsChanged()});

// --- Exercise picker: search the library, filter by group, or type a new exercise ---
let pickCb=null,pickGroup="all";
function openPicker(title,cb){pickCb=cb;$("pickTitle").textContent=title;$("pickSearch").value="";pickGroup="all";renderPick();$("pickSheet").hidden=false;setTimeout(()=>$("pickSearch").focus(),50)}
function closePicker(){$("pickSheet").hidden=true;pickCb=null}
function choose(name){const cb=pickCb;closePicker();if(cb)cb(name)}
function renderPick(){
  const gs=$("pickGroups");gs.innerHTML="";
  [["all","Alla"]].concat(Object.entries(GROUP_NAMES)).concat([["own","Egna"]]).forEach(([k,v])=>{const b=document.createElement("button");b.textContent=T(v);b.classList.toggle("on",k===pickGroup);b.onclick=()=>{pickGroup=k;renderPick()};gs.appendChild(b)});
  const q=$("pickSearch").value.trim(),ql=q.toLowerCase(),box=$("pickList");box.innerHTML="";
  const items=libAll().filter(x=>(pickGroup==="all"||x.group===pickGroup||(pickGroup==="own"&&!x.builtin))&&(!ql||x.name.toLowerCase().includes(ql)||(x.alt||"").toLowerCase().includes(ql)));
  items.sort((a,b)=>a.name.localeCompare(b.name,lang));
  let newBtn=null;
  if(q&&!libAll().some(x=>x.name.toLowerCase()===ql)){const b=document.createElement("button");b.className="pick";b.dataset.new="1";newBtn=b;const s=document.createElement("span");s.className="nm";s.textContent=T("Ny övning: {x}",{x:q});const tg=document.createElement("span");tg.className="tag";tg.textContent=T("Läggs till i Övningar");b.append(s,tg);
    b.onclick=()=>{lib.push({id:"u"+Date.now(),name:q.slice(0,60),group:pickGroup in GROUP_NAMES?pickGroup:"",desc:"",updated:Date.now()});saveLib();choose(q.slice(0,60))}}
  items.slice(0,200).forEach(x=>{const b=document.createElement("button");b.className="pick";const s=document.createElement("span");s.className="nm";s.textContent=x.name;
    const line=x.desc||x.how;if(line){const sm=document.createElement("small");sm.textContent=line;s.appendChild(sm)}b.appendChild(s);
    if(x.group){const tg=document.createElement("span");tg.className="tag";tg.textContent=T(GROUP_NAMES[x.group]);b.appendChild(tg)}

    b.onclick=()=>choose(x.name);box.appendChild(b)});
  // a new exercise comes after the matches, or first when nothing matches
  if(newBtn){if(box.children.length)box.appendChild(newBtn);else box.prepend(newBtn)}
  if(!box.children.length){const s=document.createElement("div");s.className="sub";s.textContent=T("Inga övningar matchar.");box.appendChild(s)}
}
$("pickSearch").addEventListener("input",renderPick);
$("pickSearch").addEventListener("keydown",e=>{if(e.key!=="Enter")return;e.preventDefault();
  const q=$("pickSearch").value.trim().toLowerCase(),all=[...$("pickList").querySelectorAll(".pick")],named=all.filter(b=>!b.dataset.new);
  const exact=named.find(b=>b.querySelector(".nm").firstChild.textContent.toLowerCase()===q),add=all.find(b=>b.dataset.new);
  const f=exact||(named.length===1?named[0]:null)||add||named[0];if(f)f.click()});
$("pickClose").onclick=closePicker;
$("pickSheet").addEventListener("click",e=>{if(e.target===$("pickSheet"))closePicker()});
document.addEventListener("keydown",e=>{if(e.key==="Escape"){if(!$("pickSheet").hidden)closePicker();if(!$("newSheet").hidden)$("newSheet").hidden=true}});

// --- The open workout ---
// You always work in a named workout. Every change in Plan is saved to it automatically about a second later.
// What happens on the timer (pause, −30 s / +30 s) changes only that run, not the saved workout.
let curId=readLocal("ccage_cur",null),curMeta={name:"",desc:"",lastRun:0},lastStored="",saveT=0,saving=false,ready=false;
function curName(){try{return curId?(curMeta.name||T("Pass utan namn")):""}catch(e){return ""}}
function curKey(){return JSON.stringify([curMeta.name,curMeta.desc,passData()])}
function setSaveState(txt,bad){const s=$("saveState");s.textContent=txt;s.classList.toggle("bad",!!bad)}
function scheduleSave(){if(!curId||!ready)return;if(curKey()===lastStored)return;writeLocal("ccage_dirty",curId);setSaveState(T("Sparar…"));clearTimeout(saveT);saveT=setTimeout(saveNow,900)}
let savePromise=null;
async function saveNow(){
  clearTimeout(saveT);if(!curId||!ready)return;
  if(saving){await savePromise;if(curKey()===lastStored)return}
  const k=curKey();if(k===lastStored){setSaveState(T("Sparat"));return}
  const id=curId,rec={name:curMeta.name||T("Pass utan namn"),desc:curMeta.desc||"",cfg:JSON.stringify(passData()),updated:Date.now(),lastRun:curMeta.lastRun||0};
  saving=true;
  savePromise=(async()=>{
    try{await storePass(rec,id);
      const p=passes.find(x=>x.id===id);if(p)Object.assign(p,rec);else passes.push(Object.assign({id},rec));
      if(id===curId){lastStored=k;setSaveState(T("Sparat"));if(curKey()===k)try{localStorage.removeItem("ccage_dirty")}catch(e){}}
      if(!$("passes").hidden)renderPasses();}
    catch(e){if(id===curId)setSaveState(T("Kunde inte spara"),true)}
  })();
  await savePromise;saving=false;
  if(id===curId&&curKey()!==lastStored)scheduleSave();
}
function edHead(){$("edTitle").textContent=curName();curBar()}
// The banner at the top shows the open workout on every tab: tap it to edit, or Run to start.
function curBar(){const on=!!curId;$("curBar").hidden=!on;if(!on)return;
  $("curSum").textContent=passSummary(cfg);
  const onRun=!$("run").hidden;$("curRun").textContent=onRun?T("Redigera"):T("▶ Kör")}
$("curOpen").onclick=()=>{if(curId){showTab("plan")}};
$("curRun").onclick=()=>{if(!curId)return;if(!$("run").hidden){showTab("plan")}else{saveNow();showTab("run")}};
async function openPass(p,step){
  if(curId&&ready)await saveNow();
  p=passes.find(x=>x.id===p.id)||p;
  const c=cfgOf(p);if(!c){toastMsg(T("Passet kunde inte läsas."));return}
  if(running)$("bMain").click();started=false;
  cfg=Object.assign(JSON.parse(JSON.stringify(DEFAULTS)),c,deviceOf(cfg));fixCfg();
  curId=p.id;writeLocal("ccage_cur",curId);curMeta={name:p.name||"",desc:p.desc||"",lastRun:p.lastRun||0};
  $("passName").value=curMeta.name;$("passDesc").value=curMeta.desc;
  ready=true;syncInputs();lastStored=curKey();render();setSaveState(T("Sparat"));edHead();
  if(step==="run")showTab("run");else{showTab("plan");setStep(step||"ex")}
}
function toastMsg(m){undoable(m,null)}
$("passName").addEventListener("input",()=>{curMeta.name=$("passName").value.trim();edHead();render()});
$("passDesc").addEventListener("input",()=>{curMeta.desc=$("passDesc").value;scheduleSave()});
// When a workout is started on the timer, it moves to the top of the list.
function markRun(){if(!curId)return;curMeta.lastRun=Date.now();lastStored="";scheduleSave()}

// Steps inside a workout: 1 Workout, 2 Exercises, 3 Times, 4 Run.
const STEPS={pass:["panePass","stepPass"],ex:["paneEx","stepEx"],time:["paneTime","stepTime"]};
let step="ex";
function setStep(s,quiet){if(!STEPS[s])s="ex";step=s;writeLocal("ccage_step",s);
  Object.entries(STEPS).forEach(([k,[pane,btn]])=>{$(pane).hidden=k!==s;$(btn).setAttribute("aria-selected",k===s)});
  if(s==="ex")renderCards();
  $("stepRun").setAttribute("aria-selected","false");
  $("goBtn").textContent=T(s==="pass"?"Nästa: Övningar →":s==="ex"?"Nästa: Tider →":"▶ Kör passet");
  if(!quiet)$("scroller").scrollTo(0,0)}
document.querySelectorAll("[data-step-to]").forEach(b=>b.onclick=()=>{const s=b.dataset.stepTo;if(s==="run"){saveNow();showTab("run")}else setStep(s)});
$("goBtn").onclick=()=>{if(step==="pass")setStep("ex");else if(step==="ex")setStep("time");else{saveNow();showTab("run")}};
$("edBack").onclick=()=>{saveNow();showTab("passes")};

// The list: most recently used first, with Run, Edit, Duplicate and Delete.
const fmtDay=ts=>{try{return new Date(ts).toLocaleDateString(lang==="en"?"en-GB":"sv-SE",{day:"numeric",month:"short"})}catch(e){return ""}};
function lastUsed(p){return Math.max(p.updated||0,p.lastRun||0)}
function renderPasses(){
  const box=$("passList");if(!box)return;box.innerHTML="";
  passes.sort((a,b)=>lastUsed(b)-lastUsed(a)||a.name.localeCompare(b.name,lang));
  if(!passes.length){const s=document.createElement("div");s.className="sub";s.textContent=T("Inga pass än. Tryck Nytt pass för att börja.");box.appendChild(s);return}
  passes.forEach(p=>{const c=cfgOf(p)||{};
    const it=document.createElement("div");it.className="item";
    const top=document.createElement("div");top.className="top";const nm=document.createElement("div");nm.className="nm";nm.textContent=p.name;top.appendChild(nm);
    if(p.id===curId){const tg=document.createElement("span");tg.className="tag";tg.textContent=T("Öppet");top.appendChild(tg)}
    it.appendChild(top);
    if(p.desc){const d=document.createElement("div");d.className="desc";d.style.cssText="font-size:13px;-webkit-line-clamp:2";d.textContent=p.desc;it.appendChild(d)}
    const meta=document.createElement("div");meta.className="meta2";meta.textContent=passSummary(c)+(p.lastRun?" · "+T("kört {d}",{d:fmtDay(p.lastRun)}):"");it.appendChild(meta);
    const acts=document.createElement("div");acts.className="acts";
    const b=(txt,fn,cls)=>{const x=document.createElement("button");x.textContent=T(txt);if(cls)x.className=cls;x.onclick=fn;acts.appendChild(x)};
    b("Kör",()=>openPass(p,"run"),"primary");b("Redigera",()=>openPass(p,"ex"));
    b("Duplicera",()=>duplicatePass(p));b("Ta bort",()=>deletePass(p));
    it.appendChild(acts);box.appendChild(it)});
}
async function duplicatePass(p){
  const c=cfgOf(p);if(!c)return;if(p.id===curId)await saveNow();
  const rec={name:T("{x} (kopia)",{x:p.name}).slice(0,40),desc:p.desc||"",cfg:JSON.stringify(c),updated:Date.now(),lastRun:0};
  try{const id=await storePass(rec);await loadPasses();openPass(Object.assign({id},rec),"pass");toastMsg(T("Kopian {x} är öppen.",{x:rec.name}))}
  catch(e){toastMsg(T("Passet kunde inte sparas. Kontrollera anslutningen och försök igen."))}
}
async function deletePass(p){
  if(p.id===curId)await saveNow();
  const keep=Object.assign({},passes.find(x=>x.id===p.id)||p);delete keep.id;
  try{await dropPass(p.id)}catch(e){toastMsg(T("Kunde inte ta bort passet. Försök igen."));return}
  const wasOpen=p.id===curId;if(wasOpen){curId=null;writeLocal("ccage_cur",null);showTab("passes");curBar()}
  await loadPasses();
  undoable(T("Tog bort {x}.",{x:p.name}),async()=>{await storePass(keep,p.id);await loadPasses();if(wasOpen)openPass(Object.assign({id:p.id},keep),"pass")});
}
$("passDup").onclick=()=>{const p=passes.find(x=>x.id===curId);if(p)duplicatePass(p)};
$("passDel").onclick=()=>{const p=passes.find(x=>x.id===curId);if(p)deletePass(p)};
$("passDefault").onclick=()=>$("defSave").click();

// New workout: name, description and what to start from (your defaults, a built-in template or a copy).
let newFrom="defaults";
function openNew(){
  const d=new Date();$("newName").value=T("Pass {d}",{d:fmtDay(d)});$("newDesc").value="";newFrom="defaults";
  const box=$("newFrom");box.innerHTML="";
  const opt=(key,title,sub)=>{const b=document.createElement("button");b.className="opt";b.dataset.k=key;const s1=document.createElement("span");s1.textContent=title;const s2=document.createElement("small");s2.textContent=sub;b.append(s1,s2);
    b.onclick=()=>{newFrom=key;box.querySelectorAll(".opt").forEach(o=>o.setAttribute("aria-pressed",o.dataset.k===key))};b.setAttribute("aria-pressed",key===newFrom);box.appendChild(b)};
  const dc=userDefs?Object.assign({},DEFAULTS,cleanCfg(userDefs)):DEFAULTS;
  opt("defaults",T(userDefs?"Mina standardvärden":"Appens standard"),passSummary(dc));
  TEMPLATES.forEach((x,i)=>opt("tpl:"+i,lang==="en"?x[1]:x[0],passSummary(Object.assign({},DEFAULTS,x[2]))));
  passes.slice(0,8).forEach(p=>opt("copy:"+p.id,T("Kopia av {x}",{x:p.name}),passSummary(cfgOf(p)||{})));
  $("newSheet").hidden=false;setTimeout(()=>{$("newName").focus();$("newName").select()},50);
}
$("passNew").onclick=openNew;
$("newCancel").onclick=()=>{$("newSheet").hidden=true};
$("newSheet").addEventListener("click",e=>{if(e.target===$("newSheet"))$("newSheet").hidden=true});
$("newCreate").onclick=async()=>{
  const name=$("newName").value.trim()||T("Pass utan namn"),desc=$("newDesc").value.trim();
  let c=newPlanCfg();
  if(newFrom.indexOf("tpl:")===0){const x=TEMPLATES[+newFrom.slice(4)];c=Object.assign(c,JSON.parse(JSON.stringify(TPL_BASE)),JSON.parse(JSON.stringify(x[2])));c.st=1;c.ex=1}
  else if(newFrom.indexOf("copy:")===0){const p=passes.find(x=>x.id===newFrom.slice(5));if(p)c=Object.assign(JSON.parse(JSON.stringify(DEFAULTS)),cfgOf(p)||{})}
  else{c.st=1;c.ex=1}
  DEVICE_KEYS.forEach(k=>delete c[k]);
  const rec={name,desc,cfg:JSON.stringify(c),updated:Date.now(),lastRun:0};
  $("newCreate").disabled=true;
  try{const id=await storePass(rec);$("newSheet").hidden=true;await loadPasses();openPass(Object.assign({id},rec),"ex");if(cfg.stretch>0&&!lines(cfg.stretchList).length)suggestStretch(true)}
  catch(e){toastMsg(T("Passet kunde inte sparas. Kontrollera anslutningen och försök igen."))}
  $("newCreate").disabled=false;
};

// First start after this update: the plan you had becomes a workout, so nothing is lost.
async function ensureCurrent(){
  const migrated=readLocal("ccage_migrated",false);writeLocal("ccage_migrated",true);
  if(curId&&passes.some(p=>p.id===curId)){const p=passes.find(x=>x.id===curId);
    if(readLocal("ccage_dirty",null)===curId){
      // this phone has edits that were not saved yet (for example offline): keep them and save them now
      curMeta={name:p.name||"",desc:p.desc||"",lastRun:p.lastRun||0};$("passName").value=curMeta.name;$("passDesc").value=curMeta.desc;
      ready=true;lastStored="";setSaveState(T("Sparar…"));edHead();render();return}
    const tab=$("run").hidden?"plan":"run";await openPass(p,step);if(tab==="run")showTab("run");return}
  curId=null;writeLocal("ccage_cur",null);ready=true;
  if(migrated)return;
  const snap=readLocal("ccage_saved",null),hadPlan=!!readLocal("ccage_hadplan",false);
  if(snap&&snap.name){const p=passes.find(x=>x.name===snap.name);if(p&&snap.data===JSON.stringify(passData())){openPass(p,"ex");showTab("passes");return}}
  if(hadPlan&&(snap||passes.length)){
    const rec={name:(snap&&snap.name?T("{x} (ändrad)",{x:snap.name}):T("Pass utan namn")),desc:"",cfg:JSON.stringify(passData()),updated:Date.now(),lastRun:0};
    try{const id=await storePass(rec);await loadPasses();openPass(Object.assign({id},rec),"ex");showTab("passes");toastMsg(T("Din plan sparades som {x}.",{x:rec.name}))}catch(e){}
  }
  try{localStorage.removeItem("ccage_saved");localStorage.removeItem("ccage_hadplan")}catch(e){}
}

// Defaults for new workouts: what "New workout" starts from. Stored on this phone and in the backup.
// They hold the structure and times, not the exercise names or per-exercise times.
const DEF_KEY="ccage_defaults";
let userDefs=readLocal(DEF_KEY,null);
function defsFrom(c){const d=JSON.parse(JSON.stringify(c));["names","exTimes","stretchSeed","stretchAuto"].forEach(k=>delete d[k]);return d}
function newPlanCfg(){const c=Object.assign(JSON.parse(JSON.stringify(DEFAULTS)),userDefs?cleanCfg(userDefs):{},deviceOf(cfg));c.names=[];c.exTimes={};c.stretchAuto=true;return c}
function renderDefs(){const c=userDefs?Object.assign({},DEFAULTS,cleanCfg(userDefs)):DEFAULTS;
  const parts=[passSummary(c),T("{n} övn",{n:c.ex}),T("{n} set",{n:c.sets}),T("uppvärmning {n} min",{n:c.warm})];
  $("defSum").textContent=(userDefs?T("Dina standardvärden"):T("Appens standard"))+": "+parts.join(" · ");$("defReset").disabled=!userDefs}
$("defSave").onclick=()=>{const old=userDefs;userDefs=defsFrom(passData());writeLocal(DEF_KEY,userDefs);renderDefs();
  undoable(T("Passet används som standard för nya pass."),()=>{userDefs=old;if(old)writeLocal(DEF_KEY,old);else try{localStorage.removeItem(DEF_KEY)}catch(e){}renderDefs()})};
$("defReset").onclick=()=>{const old=userDefs;userDefs=null;try{localStorage.removeItem(DEF_KEY)}catch(e){}renderDefs();
  undoable(T("Nya pass börjar med appens standard."),()=>{userDefs=old;writeLocal(DEF_KEY,old);renderDefs()})};

// Exercise library: the built-in bank plus your own exercises, each with an optional description.
// Built-in entries are keyed "b:<Swedish name>" and only store a description; own entries are keyed "u…".
let lib=readLocal(LIB_KEY,[]);if(!Array.isArray(lib))lib=[];
const GROUP_NAMES={legs:"Ben",pull:"Drag",push:"Press",core:"Bål",cardio:"Kondition"};
function libList(){try{return lib}catch(e){return []}}
function libAll(){
  const lib=libList();
  const own=lib.filter(x=>x.id&&x.id[0]==="u"&&!x.deleted),over={};lib.forEach(x=>{if(x.id&&x.id[0]==="b")over[x.id]=x});
  const en=lang==="en";
  return BANK.map(b=>{const i=INFO[b[0]]||[];return{id:"b:"+b[0],name:bankName(b),alt:en?b[0]:b[1],group:b[2],how:(en?i[2]:i[0])||"",look:(en?i[3]:i[1])||"",desc:(over["b:"+b[0]]||{}).desc||"",builtin:true}})
    .concat(own.map(x=>Object.assign({builtin:false},x,{how:(x.how!=null?x.how:x.desc)||"",look:x.look||"",desc:""})));
}
function findEx(name){const n=(name||"").trim().toLowerCase();if(!n)return null;return libAll().find(x=>x.name.toLowerCase()===n||(x.alt||"").toLowerCase()===n)||null}
// What to show for an exercise: your own comment, how it is done, and what the instructor should watch.
function exInfo(name){const x=findEx(name);if(x)return{note:x.desc||"",how:x.how||"",look:x.look||""};
  const n=(name||"").trim().toLowerCase(),s=STRETCH.find(y=>y[0].toLowerCase()===n||y[1].toLowerCase()===n);
  if(s){const i=STRETCH_INFO[s[0]]||[];return{note:"",how:(lang==="en"?i[1]:i[0])||"",look:""}}return{note:"",how:"",look:""}}
function descOf(name){const i=exInfo(name);return i.note||i.how}
function noteOf(name){return exInfo(name).note}
// Each entry carries "updated"; deleting an own exercise keeps a small "deleted" marker so the deletion
// also wins over an older copy in the cloud or in a backup.
let libTimer=0,libDirty=false,libVer=0;
function mergeLib(other){let changed=false;
  other.forEach(x=>{if(!x||typeof x.id!=="string")return;const cur=lib.find(y=>y.id===x.id);
    if(!cur){lib.push(x);changed=true}else if((x.updated||0)>(cur.updated||0)){Object.assign(cur,x);changed=true}});
  if(other.length!==lib.length)changed=true;libVer++;return changed}
async function flushLib(){if(!libDirty||!db)return;clearTimeout(libTimer);libDirty=false;
  try{await withTimeout(coll().doc("exlib").set({lib:JSON.stringify(lib),updated:Date.now()}))}catch(e){libDirty=true}}
function saveLib(){libVer++;writeLocal(LIB_KEY,lib);libDirty=true;clearTimeout(libTimer);libTimer=setTimeout(flushLib,800)}
function setLib(id,patch){let x=lib.find(e=>e.id===id);if(!x){x={id};lib.push(x)}Object.assign(x,patch,{updated:Date.now()});saveLib()}
let exFilter="all",exOpen=null;
// Text you wrote yourself: a comment on an app exercise, or the instructions of your own exercise.
function hasOwnText(x){return !!(x.desc||(!x.builtin&&(x.how||x.look)))}
function renderLib(){
  const box=$("exItems");if(!box)return;
  const gs=$("exGroups");if(!gs.children.length||gs.dataset.lang!==lang){gs.innerHTML="";gs.dataset.lang=lang;
    [["all","Alla"]].concat(Object.entries(GROUP_NAMES)).concat([["own","Egna"],["desc","Med egna kommentarer"]]).forEach(([k,v])=>{const b=document.createElement("button");b.textContent=T(v);b.dataset.g=k;b.onclick=()=>{exFilter=k;renderLib()};gs.appendChild(b)})}
  gs.querySelectorAll("button").forEach(b=>b.classList.toggle("on",b.dataset.g===exFilter));
  const q=$("exSearch").value.trim().toLowerCase();
  const items=libAll().filter(x=>(exFilter==="all"||x.group===exFilter||(exFilter==="own"&&!x.builtin)||(exFilter==="desc"&&hasOwnText(x)))&&(!q||x.name.toLowerCase().includes(q)||(x.alt||"").toLowerCase().includes(q)||x.desc.toLowerCase().includes(q)));
  items.sort((a,b)=>a.name.localeCompare(b.name,lang));
  box.innerHTML="";
  if(!items.length){const s=document.createElement("div");s.className="sub";s.textContent=T("Inga övningar matchar.");box.appendChild(s);return}
  items.forEach(x=>{
    const d=document.createElement("details");d.className="item";if(exOpen===x.id)d.open=true;
    d.addEventListener("toggle",()=>{if(d.open)exOpen=x.id;else if(exOpen===x.id)exOpen=null});
    const sm=document.createElement("summary");const nm=document.createElement("span");nm.className="nm";nm.textContent=x.name;
    const tg=document.createElement("span");tg.className="tag";tg.textContent=x.group?T(GROUP_NAMES[x.group]||""):T("Egen");
    sm.append(nm);if(x.group)sm.append(tg);if(!x.builtin){const o=document.createElement("span");o.className="tag";o.textContent=T("Egen");sm.append(o)}
    if(hasOwnText(x)){const i=document.createElement("span");i.className="tag";i.textContent="✎";i.title=T("Har egna kommentarer");sm.append(i)}
    d.appendChild(sm);
    const body=document.createElement("div");body.style.cssText="display:flex;flex-direction:column;gap:8px;margin-top:8px";
    if(!x.builtin){
      const f1=document.createElement("label");f1.className="field";f1.append(T("Namn"));const ni=document.createElement("input");ni.maxLength=60;ni.value=x.name;ni.onchange=()=>{const v=ni.value.trim();if(v){setLib(x.id,{name:v});renderLib()}};f1.appendChild(ni);
      const f2=document.createElement("label");f2.className="field";f2.append(T("Grupp"));const gsel=document.createElement("select");
      [["",T("Ingen grupp")]].concat(Object.entries(GROUP_NAMES).map(([k,v])=>[k,T(v)])).forEach(([k,v])=>{const o=document.createElement("option");o.value=k;o.textContent=v;gsel.appendChild(o)});gsel.value=x.group||"";gsel.onchange=()=>{setLib(x.id,{group:gsel.value});renderLib()};f2.appendChild(gsel);
      body.append(f1,f2);
    }
    const area=(label,val,ph,rows,on)=>{const f=document.createElement("label");f.className="field";f.append(T(label));const ta=document.createElement("textarea");ta.maxLength=2000;ta.rows=rows;ta.value=val;ta.placeholder=T(ph);ta.oninput=()=>on(ta.value);f.appendChild(ta);body.appendChild(f)};
    if(x.builtin){
      [["Utförande",x.how],["Titta särskilt på",x.look]].forEach(([l,v])=>{if(!v)return;const d2=document.createElement("div");d2.className="info";const b2=document.createElement("b");b2.textContent=T(l);const s2=document.createElement("span");s2.textContent=v;d2.append(b2,s2);body.appendChild(d2)});
      area("Egna kommentarer",x.desc,"T.ex. hur ni gör i er box, utrustning, lättare och tyngre varianter",3,v=>setLib(x.id,{desc:v}));
    }else{
      area("Utförande",x.how,"Hur övningen görs",3,v=>setLib(x.id,{how:v,desc:""}));
      area("Titta särskilt på",x.look,"Vanliga fel och vad instruktören ska vara noga med",2,v=>setLib(x.id,{look:v}));
    }
    if(!x.builtin){const del=document.createElement("button");del.className="smallbtn";del.textContent=T("Ta bort övningen");del.style.alignSelf="flex-start";
      del.onclick=()=>{const keep=JSON.parse(JSON.stringify(lib.find(e=>e.id===x.id)));setLib(x.id,{deleted:true});renderLib();undoable(T("Tog bort {x}.",{x:x.name}),()=>{setLib(x.id,Object.assign(keep,{deleted:false}));renderLib()})};body.appendChild(del)}
    d.appendChild(body);box.appendChild(d)});
}
$("exSearch").addEventListener("input",renderLib);
$("exAdd").onclick=()=>{const q=$("exSearch").value.trim();const id="u"+Date.now();lib.push({id,name:q||T("Ny övning"),group:"",desc:"",updated:Date.now()});saveLib();exOpen=id;exFilter="all";$("exSearch").value="";renderLib();
  const d=[...document.querySelectorAll("#exItems details")].find(e=>e.open);if(d){const i=d.querySelector("input");if(i){i.focus();i.select()}d.scrollIntoView({block:"center"})}};

// Backup: one JSON file with saved workouts, the exercise library, the plan and this phone's settings.
function bkMsg(t,bad){const m=$("bkMsg");m.textContent=t;m.style.color=bad?"var(--danger)":""}
function backupData(){return{format:"crosscage-klocka",version:1,appVersion:APP_VERSION,exported:new Date().toISOString(),
  passes:passes.map(p=>({name:p.name,desc:p.desc||"",cfg:cfgOf(p),updated:p.updated||0,lastRun:p.lastRun||0})),exercises:lib,current:curId?curMeta.name:"",settings:deviceOf(cfg),defaults:userDefs,lang}}
$("expBtn").onclick=async()=>{
  const d=new Date(),stamp=d.getFullYear()+"-"+String(d.getMonth()+1).padStart(2,"0")+"-"+String(d.getDate()).padStart(2,"0");
  const name="crosscage-"+stamp+".json",text=JSON.stringify(backupData(),null,1);
  try{const file=new File([text],name,{type:"application/json"});
    if(matchMedia("(pointer:coarse)").matches&&navigator.canShare&&navigator.canShare({files:[file]})){await navigator.share({files:[file],title:name});bkMsg(T("Säkerhetskopian är klar: {n} pass och {e} egna övningar och beskrivningar.",{n:passes.length,e:lib.length}));return}
  }catch(e){if(e&&e.name==="AbortError")return}
  const a=document.createElement("a");a.href=URL.createObjectURL(new Blob([text],{type:"application/json"}));a.download=name;document.body.appendChild(a);a.click();
  setTimeout(()=>{URL.revokeObjectURL(a.href);a.remove()},1000);
  bkMsg(T("Säkerhetskopian {f} har laddats ned: {n} pass och {e} egna övningar och beskrivningar.",{f:name,n:passes.length,e:lib.length}));
};
$("impBtn").onclick=()=>{$("impFile").value="";$("impFile").click()};
// Only known settings with the expected type are taken from a file, so a damaged or foreign file cannot break the app.
const str=(v,n)=>typeof v==="string"?v.slice(0,n):"";
function cleanCfg(c){const out={};if(!c||typeof c!=="object")return out;
  Object.keys(DEFAULTS).forEach(k=>{if(!(k in c))return;const d=DEFAULTS[k],v=c[k];
    if(Array.isArray(d)){if(!Array.isArray(v))return;
      if(k==="names")out[k]=v.slice(0,20).map(r=>Array.isArray(r)?r.slice(0,4).map(x=>str(x,80)):[]);
      else if(k==="rounds")out[k]=v.slice(0,6).filter(x=>x&&typeof x==="object").map(x=>{const o={};["ratio","work","setRest","exRest","stRest"].forEach(q=>{if(typeof x[q]==="number"&&isFinite(x[q]))o[q]=x[q]});return o});
      else if(k==="roundSets")out[k]=v.slice(0,6).filter(x=>typeof x==="number"&&isFinite(x));
      else out[k]=v.slice(0,40).map(x=>str(x,80));
    }else if(d&&typeof d==="object"){if(v&&typeof v==="object"&&!Array.isArray(v)){const o={};Object.keys(v).slice(0,600).forEach(q=>{const x=v[q];if(k==="snd"){if(typeof x==="string")o[q]=x.slice(0,20)}else if(x&&typeof x==="object")o[q]={w:typeof x.w==="number"?x.w:null,p:typeof x.p==="number"?x.p:null}});out[k]=o}}
    else if(typeof v===typeof d&&(typeof v!=="number"||isFinite(v)))out[k]=typeof v==="string"?v.slice(0,200):v;
  });return out}
$("impFile").addEventListener("change",async()=>{
  const f=$("impFile").files[0];if(!f)return;
  if(f.size>3e6){bkMsg(T("Filen är för stor för att vara en säkerhetskopia."),true);return}
  let d;try{d=JSON.parse(await f.text())}catch(e){bkMsg(T("Filen kunde inte läsas. Välj en säkerhetskopia från appen."),true);return}
  if(!d||d.format!=="crosscage-klocka"){bkMsg(T("Det här är inte en säkerhetskopia från appen."),true);return}
  bkMsg(T("Läser in…"));
  let np=0,ne=0;const touched=[],libBefore=JSON.parse(JSON.stringify(lib)),langBefore=lang,defsBefore=userDefs;
  // Workouts: one with the same name is replaced only when the file's copy is newer.
  for(const p of (Array.isArray(d.passes)?d.passes:[]).slice(0,500)){
    const name=str(p&&p.name,40).trim();if(!name)continue;const c=cleanCfg(p.cfg);const up=typeof p.updated==="number"?p.updated:0;
    const ex=passes.find(x=>x.name.toLowerCase()===name.toLowerCase());if(ex&&(ex.updated||0)>=up)continue;
    let id;try{id=await storePass({name,desc:str(p.desc,500),cfg:JSON.stringify(c),updated:up||Date.now(),lastRun:typeof p.lastRun==="number"?p.lastRun:0},ex&&ex.id)}catch(e){bkMsg(T("Passen kunde inte sparas. Kontrollera anslutningen eller lagringsutrymmet och försök igen."),true);break}
    touched.push({id,before:ex?{name:ex.name,desc:ex.desc||"",cfg:ex.cfg,updated:ex.updated,lastRun:ex.lastRun||0}:null});np++}
  // Exercises: the newer copy of each entry wins.
  (Array.isArray(d.exercises)?d.exercises:[]).slice(0,2000).forEach(x=>{if(!x||typeof x.id!=="string")return;const id=x.id.slice(0,80);if(id[0]!=="u"&&id.indexOf("b:")!==0)return;
    const e={id,desc:str(x.desc,2000),updated:typeof x.updated==="number"?x.updated:0};if(id[0]==="u"){e.name=str(x.name,60).trim();e.group=GROUPS.includes(x.group)?x.group:"";e.deleted=x.deleted===true;e.how=str(x.how!=null?x.how:x.desc,2000);e.desc="";e.look=str(x.look,2000);if(!e.name)return}
    const cur=lib.find(y=>y.id===id);if(cur&&(cur.updated||0)>=e.updated)return;lib=lib.filter(y=>y.id!==id);lib.push(e);ne++});
  saveLib();
  const before=JSON.parse(JSON.stringify(cfg)),curBefore=curId;
  if(d.defaults&&typeof d.defaults==="object"){userDefs=defsFrom(cleanCfg(d.defaults));writeLocal(DEF_KEY,userDefs);renderDefs()}
  Object.assign(cfg,cleanCfg(d.settings));fixCfg();syncInputs();
  if(d.lang==="sv"||d.lang==="en")setLang(d.lang);else render();
  await loadPasses();renderLib();
  if(curId&&touched.some(x=>x.id===curId)){const p=passes.find(x=>x.id===curId);if(p){lastStored=curKey();await openPass(p,step)}}
  // with no workout open, open the one that was open when the backup was made
  if(!curId){const want=str(d.current,40).trim().toLowerCase();const p=passes.find(x=>want&&x.name.toLowerCase()===want)||passes[0];if(p){openPass(p,"ex");showTab("passes")}}
  bkMsg(T("Klart: {n} pass och {e} övningar lästes in. Inställningarna återställdes.",{n:np,e:ne}));
  undoable(T("Säkerhetskopian lästes in."),async()=>{
    for(const x of touched.reverse()){if(x.before)await storePass(x.before,x.id);else await dropPass(x.id)}
    userDefs=defsBefore;if(userDefs)writeLocal(DEF_KEY,userDefs);else try{localStorage.removeItem(DEF_KEY)}catch(e){}renderDefs();
    lib=libBefore;saveLib();cfg=before;started=false;syncInputs();if(lang!==langBefore)setLang(langBefore);
    if(!curBefore&&curId){curId=null;writeLocal("ccage_cur",null)}
    await loadPasses();renderLib();bkMsg(T("Inläsningen ångrades."))});
});

renderPasses();
(async()=>{
  try{
    const use=window.claude&&window.claude.use;
    if(use){const[d,u]=await Promise.all([window.claude.use("db"),window.claude.use("user")]);
      if(d&&u){const id=await u.id();if(id){db=d;uid=id}}}
  }catch(e){}
  await loadPasses();await ensureCurrent();renderPasses();
})();

function setLang(l){
  lang=l;try{localStorage.setItem("ccage_lang",l)}catch(e){}
  roundsKey="";setsKey="";applyStatic();buildNames();buildSnd();soundLbl();awakeLbl();if(spOn())spFill();$("bFocus").textContent=T(document.body.classList.contains("focus")?"Visa allt":"Fokusläge");renderPasses();renderLib();renderDefs();try{setStep(step,true);edHead()}catch(e){}
  const pm=$("passMsg");if(!pm.style.color)passMsg(where());
  const wm=$("wakeMsg");if(!wm.hidden)wakeMsg(wm.dataset.ok==="1");
  render();draw();
  $("bMain").textContent=T(running?"Paus":(started&&idx<seq.length?"Fortsätt":"Start"));
}
document.querySelectorAll("[data-lang]").forEach(b=>b.addEventListener("click",()=>setLang(b.dataset.lang)));

// --- Spotify ---
const SP_KEY="ccage_sp",SP_API="https://api.spotify.com/v1";
const SP_REDIRECT=location.origin+location.pathname.replace(/index\.html$/,"");
const SP_SCOPES="user-read-playback-state user-modify-playback-state user-read-currently-playing playlist-read-private playlist-read-collaborative user-read-private";
let sp={};try{sp=JSON.parse(localStorage.getItem(SP_KEY)||"{}")||{}}catch(e){sp={}}
let spLists=[],spDevs=[],spVolWarned=false,spNpT=0;
function spSave(){try{localStorage.setItem(SP_KEY,JSON.stringify(sp))}catch(e){}}
function spMsg(t,bad){const m=$("spMsg");m.textContent=t||"";m.style.color=bad?"var(--danger)":""}
function spOn(){return !!(sp.access&&sp.clientId)}
function b64url(buf){let b="";new Uint8Array(buf).forEach(x=>b+=String.fromCharCode(x));return btoa(b).replace(/\+/g,"-").replace(/\//g,"_").replace(/=+$/,"")}
async function spConnect(){
  const id=$("spClient").value.trim();
  if(!id){spMsg(T("Klistra in ditt Client ID först."),true);$("spClient").focus();return}
  const verifier=b64url(crypto.getRandomValues(new Uint8Array(64)));
  const challenge=b64url(await crypto.subtle.digest("SHA-256",new TextEncoder().encode(verifier)));
  const state=b64url(crypto.getRandomValues(new Uint8Array(16)));
  sp.clientId=id;sp.verifier=verifier;sp.state=state;spSave();
  location.href="https://accounts.spotify.com/authorize?"+new URLSearchParams({response_type:"code",client_id:id,scope:SP_SCOPES,redirect_uri:SP_REDIRECT,code_challenge_method:"S256",code_challenge:challenge,state});
}
async function spToken(params){
  const r=await fetch("https://accounts.spotify.com/api/token",{method:"POST",headers:{"Content-Type":"application/x-www-form-urlencoded"},body:new URLSearchParams(params)});
  const j=await r.json().catch(()=>({}));
  if(!r.ok){const e=new Error(j.error_description||j.error||("HTTP "+r.status));e.status=r.status;throw e}
  sp.access=j.access_token;if(j.refresh_token)sp.refresh=j.refresh_token;sp.exp=Date.now()+((j.expires_in||3600)-60)*1000;spSave();
}
let spRefreshing=null;
async function spAccess(){
  if(!sp.access)throw Object.assign(new Error("not connected"),{status:401});
  if(Date.now()>sp.exp){
    if(!spRefreshing)spRefreshing=spToken({grant_type:"refresh_token",refresh_token:sp.refresh,client_id:sp.clientId}).finally(()=>{spRefreshing=null});
    try{await spRefreshing}catch(e){if(e.status===400||e.status===401){spLogout(true)}throw e}
  }
  return sp.access;
}
async function spApi(method,path,body,retry){
  const tok=await spAccess();
  const h={Authorization:"Bearer "+tok};if(body)h["Content-Type"]="application/json";
  const r=await fetch(SP_API+path,{method,headers:h,body:body?JSON.stringify(body):undefined});
  if(r.status===401&&!retry){sp.exp=0;return spApi(method,path,body,true)}
  if(r.status===204||r.status===202)return null;
  const txt=await r.text();let j=null;try{j=txt?JSON.parse(txt):null}catch(e){}
  if(!r.ok){const e=new Error((j&&j.error&&j.error.message)||("HTTP "+r.status));e.status=r.status;e.reason=j&&j.error&&j.error.reason;throw e}
  return j;
}
function spDevQ(sep){return sp.device?(sep||"?")+"device_id="+encodeURIComponent(sp.device):""}
function spErr(e){
  if(e&&e.status===404)spMsg(T("Ingen Spotify-enhet är aktiv. Öppna Spotify, spela en låt en kort stund och försök igen."),true);
  else if(e&&e.status===403)spMsg(T("Spotify Premium krävs, och ditt konto måste vara tillagt under User Management i Spotify-appen på utvecklarsidan."),true);
  else spMsg(T("Spotify: {x}",{x:(e&&e.message)||"?"}),true);
}
async function spWithDevice(fn){
  try{return await fn()}catch(e){
    if(e.status===404&&!sp.device){
      try{const d=await spApi("GET","/me/player/devices");const dev=(d&&d.devices||[])[0];if(dev){await spApi("PUT","/me/player",{device_ids:[dev.id],play:false});return await fn()}}catch(e2){}
    }
    throw e;
  }
}
async function spPlay(first){
  const body=first&&cfg.spList?{context_uri:cfg.spList}:undefined;
  await spWithDevice(()=>spApi("PUT","/me/player/play"+spDevQ(),body));
  spNowSoon();
}
async function spPauseMusic(){await spApi("PUT","/me/player/pause"+spDevQ())}
async function spVolume(v){
  try{await spApi("PUT","/me/player/volume?volume_percent="+Math.round(v)+spDevQ("&"))}
  catch(e){if(!spVolWarned&&(e.status===403||e.status===400)){spVolWarned=true;spMsg(T("Volymen kan inte styras på den här enheten. Spotify på iPhone tillåter oftast inte det."),true)}}
}
function spOnToggle(nowRunning,first){
  if(!spOn())return;
  if(nowRunning){
    if(cfg.spStart)spPlay(first).then(()=>{if(cfg.spDuck)spPhase()}).catch(spErr);
    else if(cfg.spDuck)spPhase();
  }else if(cfg.spPause){spPauseMusic().catch(()=>{})}
}
let spLastVol=null;
function spPhase(){
  if(!spOn()||!cfg.spDuck||!running)return;
  const it=seq[idx];if(!it)return;
  const v=isWorkT(it)?cfg.spWorkVol:cfg.spRestVol;
  if(v!==spLastVol){spLastVol=v;spVolume(v)}
}
function spEnd(){if(spOn()&&cfg.spDuck){spLastVol=null;spVolume(cfg.spWorkVol)}}
async function spLoadLists(){
  try{
    const me=await spApi("GET","/me");$("spWho").textContent=T("Ansluten som {x}",{x:(me&&(me.display_name||me.id))||"Spotify"});
    let url="/me/playlists?limit=50",all=[];
    for(let i=0;i<4&&url;i++){const j=await spApi("GET",url);all=all.concat((j&&j.items)||[]);url=j&&j.next?j.next.replace(SP_API,""):null}
    spLists=all.filter(Boolean);
  }catch(e){spMsg(T("Kunde inte hämta spellistor."),true)}
  try{const d=await spApi("GET","/me/player/devices");spDevs=(d&&d.devices)||[]}catch(e){spDevs=[]}
  spFill();
}
function spFill(){
  const ls=$("spList");ls.innerHTML="";
  const o0=document.createElement("option");o0.value="";o0.textContent=T("Fortsätt med det som spelas");ls.appendChild(o0);
  spLists.forEach(p=>{const o=document.createElement("option");o.value=p.uri;o.textContent=p.name;ls.appendChild(o)});
  if(cfg.spList&&!spLists.some(p=>p.uri===cfg.spList)){const o=document.createElement("option");o.value=cfg.spList;o.textContent=cfg.spListName||cfg.spList;ls.appendChild(o)}
  ls.value=cfg.spList||"";
  const ds=$("spDev");ds.innerHTML="";
  const d0=document.createElement("option");d0.value="";d0.textContent=T("Enheten som spelar just nu");ds.appendChild(d0);
  spDevs.forEach(d=>{const o=document.createElement("option");o.value=d.id;o.textContent=d.name+" ("+d.type+")";ds.appendChild(o)});
  if(sp.device&&!spDevs.some(d=>d.id===sp.device)){const o=document.createElement("option");o.value=sp.device;o.textContent=sp.deviceName||sp.device;ds.appendChild(o)}
  ds.value=sp.device||"";
}
function spRender(){
  const on=spOn();
  $("spSetup").hidden=on;$("spReady").hidden=!on;$("musicBar").hidden=!on;
  $("spUri").textContent=SP_REDIRECT;
  if(!$("spClient").value&&sp.clientId)$("spClient").value=sp.clientId;
  ["spStart","spPause","spDuck"].forEach(k=>$(k).setAttribute("aria-pressed",!!cfg[k]));
  $("spWorkRow").hidden=$("spRestRow").hidden=!cfg.spDuck;
  const ls=$("spList");if(ls.options.length>1&&ls.value!==(cfg.spList||""))ls.value=cfg.spList||"";
}
function spLogout(expired){sp={clientId:sp.clientId};spSave();spLists=[];spDevs=[];spRender();if(!expired)spMsg("")}
async function spNow(){
  if(!spOn())return;
  try{
    const j=await spApi("GET","/me/player/currently-playing");
    const it=j&&j.item;
    $("npTitle").textContent=it?it.name:T("Inget spelas");
    $("npArtist").textContent=it?((it.artists||[]).map(a=>a.name).join(", ")||(it.show&&it.show.name)||""):"";
    $("mPlay").textContent=j&&j.is_playing?"⏸":"▶";
  }catch(e){}
}
function spNowSoon(){clearTimeout(spNpT);spNpT=setTimeout(spNow,800)}
setInterval(()=>{if(spOn()&&!document.hidden&&!$("run").hidden)spNow()},10000);
$("spConnect").onclick=()=>{spConnect().catch(()=>spMsg(T("Spotify svarade inte. Kontrollera Client ID och Redirect URI och försök igen."),true))};
$("spCopy").onclick=()=>{try{navigator.clipboard.writeText(SP_REDIRECT).then(()=>spMsg(T("Kopierad")),()=>spMsg(T("Markera adressen och kopiera den.")))}catch(e){spMsg(T("Markera adressen och kopiera den."))}};
$("spDisconnect").onclick=()=>spLogout(false);
$("spReload").onclick=()=>{spMsg("");spLoadLists()};
$("spList").addEventListener("change",e=>{cfg.spList=e.target.value;const o=e.target.selectedOptions[0];cfg.spListName=o&&e.target.value?o.textContent:"";save()});
$("spDev").addEventListener("change",e=>{sp.device=e.target.value;const o=e.target.selectedOptions[0];sp.deviceName=o&&e.target.value?o.textContent:"";spSave()});
["spStart","spPause","spDuck"].forEach(k=>$(k).onclick=()=>{cfg[k]=!cfg[k];render()});
$("mPlay").onclick=async()=>{try{const j=await spApi("GET","/me/player");if(j&&j.is_playing)await spPauseMusic();else await spPlay(false)}catch(e){spErr(e)}spNowSoon()};
$("mNext").onclick=()=>{spWithDevice(()=>spApi("POST","/me/player/next"+spDevQ())).then(spNowSoon,spErr)};
$("mPrev").onclick=()=>{spWithDevice(()=>spApi("POST","/me/player/previous"+spDevQ())).then(spNowSoon,spErr)};
(async()=>{
  const q=new URLSearchParams(location.search);
  if(q.get("error")&&sp.state){spMsg(T("Spotify-inloggningen avbröts. Försök igen."),true);history.replaceState(null,"",SP_REDIRECT)}
  else if(q.get("code")){
    const ok=sp.verifier&&q.get("state")===sp.state;
    history.replaceState(null,"",SP_REDIRECT);
    if(!ok)spMsg(T("Inloggningen kunde inte slutföras. Starta anslutningen igen inifrån appen."),true);
    else{try{await spToken({grant_type:"authorization_code",code:q.get("code"),redirect_uri:SP_REDIRECT,client_id:sp.clientId,code_verifier:sp.verifier});delete sp.verifier;delete sp.state;spSave()}catch(e){spMsg(T("Spotify svarade inte. Kontrollera Client ID och Redirect URI och försök igen."),true)}}
  }
  spRender();
  if(spOn()){spLoadLists();spNow()}
})();

let deferredPrompt=null;
window.addEventListener("beforeinstallprompt",e=>{e.preventDefault();deferredPrompt=e;$("installBtn").hidden=false});
$("installBtn").onclick=async()=>{if(!deferredPrompt)return;deferredPrompt.prompt();try{await deferredPrompt.userChoice}catch(e){}deferredPrompt=null;$("installBtn").hidden=true};
window.addEventListener("appinstalled",()=>{$("installBtn").hidden=true});
// iOS can leave the whole page shifted up after the keyboard, the share sheet or the file picker closes, which pushes
// the menu off the bottom of the screen. Only the middle part is meant to scroll, so put the page back in place.
function settle(){if(window.scrollX||window.scrollY)window.scrollTo(0,0);if(document.documentElement.scrollTop)document.documentElement.scrollTop=0;if(document.body.scrollTop)document.body.scrollTop=0}
["resize","orientationchange","pageshow","focus"].forEach(ev=>window.addEventListener(ev,()=>setTimeout(settle,60)));
document.addEventListener("focusout",()=>setTimeout(settle,60));
document.addEventListener("visibilitychange",()=>{if(document.visibilityState==="visible")setTimeout(settle,60)});
document.addEventListener("change",e=>{if(e.target&&e.target.type==="file")setTimeout(settle,60)},true);
if(window.visualViewport)window.visualViewport.addEventListener("resize",()=>setTimeout(settle,60));
window.addEventListener("scroll",()=>{if(!document.activeElement||!/^(INPUT|TEXTAREA|SELECT)$/.test(document.activeElement.tagName))settle()});
// When a new version's service worker takes over, offer a reload instead of waiting for the next start.
// Not during a running workout: the bar waits until the clock is paused or finished.
if("serviceWorker" in navigator){
  const hadController=!!navigator.serviceWorker.controller;let updReady=false;
  const showUpd=()=>{if(updReady)$("updBar").hidden=running};
  navigator.serviceWorker.addEventListener("controllerchange",()=>{if(hadController){updReady=true;showUpd()}});
  setInterval(showUpd,2000);
  $("updReload").onclick=()=>location.reload();
  window.addEventListener("load",()=>{navigator.serviceWorker.register("./sw.js").then(reg=>{
    document.addEventListener("visibilitychange",()=>{if(document.visibilityState==="visible")reg.update().catch(()=>{})})}).catch(()=>{})});
}

renderDefs();
$("appVer").textContent=APP_VERSION?T("Version {v}",{v:APP_VERSION}):"";
render();setStep(readLocal("ccage_step","ex"),true);showTab(curId?"plan":"passes");
})();

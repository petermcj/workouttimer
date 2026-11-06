# Koppla Spotify till CrossCage klocka

Appen kan starta och pausa musiken med passet, välja spellista, hoppa mellan låtar och sänka volymen under vila. Det kräver **Spotify Premium**.

## 1. Skapa en Spotify-app (en gång)

1. Gå till [developer.spotify.com/dashboard](https://developer.spotify.com/dashboard) och logga in med ditt Spotify-konto.
2. Tryck **Create app**.
3. Fyll i:
   - **App name:** till exempel `CrossCage klocka`
   - **App description:** till exempel `Intervallklocka`
   - **Redirect URI:** `https://petermcj.github.io/workouttimer/` (exakt så, med snedstreck på slutet). Tryck **Add**.
   - **Which API/SDKs are you planning to use?** Kryssa i **Web API**.
4. Godkänn villkoren och tryck **Save**.
5. Öppna appen du skapade, gå till **Settings** och kopiera **Client ID**.

## 2. Anslut i klockan

1. Öppna klockan, gå till Plan-fliken och scrolla ner till **Spotify**.
2. Klistra in ditt Client ID och tryck **Anslut**.
3. Logga in hos Spotify och godkänn. Du skickas tillbaka till klockan.

## 3. Ställ in

- **Spellista vid start:** spelas när du trycker Start. Välj *Fortsätt med det som spelas* om du vill styra musiken själv.
- **Spela på:** välj telefon, högtalare eller dator. Lämna tomt för att använda den enhet som spelar just nu.
- **Starta musiken när passet startar** och **Pausa musiken när passet pausas.**
- **Sänk volymen under vila:** välj volym för arbete och vila. Spotify på iPhone tillåter oftast inte att andra appar ändrar volymen, men det fungerar på Android, datorer och de flesta högtalare.

I Kör-vyn finns en musikrad med föregående låt, spela/pausa, nästa låt och vad som spelas.

## Om något inte fungerar

- **"Ingen Spotify-enhet är aktiv":** öppna Spotify på telefonen, spela en låt en kort stund och försök igen.
- **"Premium krävs" eller fel vid inloggning:** gå till din app på utvecklarsidan, öppna **User Management** och lägg till e-postadressen till ditt Spotify-konto.
- **Inloggningen fastnar på iPhone:** prova att ansluta i Safari på samma adress först. Om det inte hjälper, ta bort appen från hemskärmen, anslut i Safari och lägg till appen på hemskärmen igen.
- **Kompisar:** en Spotify-app i utvecklarläge kan användas av högst fem personer. Lägg till deras e-post under **User Management**. Varje person behöver Premium.

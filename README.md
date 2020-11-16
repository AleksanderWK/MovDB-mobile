# ![MovDB](assets/head.png)

# MovDB - En filmdatabaseapplikasjon

Mobil-applikasjonen MovDB skaffer brukere informasjon om over 2000 filmer! Gjennom søkefeltet øverst på siden, kan brukerne finne filmer ved å skrive inn nøkkelord fra filmens tittel eller beskrivelse. Deretter kan de trykke på de enkelte filmene fra resultatet av søket. Da åpnes en popup, hvor brukeren kan se hvilke produksjonsselskap som lagde den, se hvilke(t) land filmen ble spilt inn i og se lengden av filmen. Hvis brukeren ikke leter etter én bestemt film, kan den bruke applikasjonens filtrering og sortering til å finne filmer den vil se. Mens det er mulig å sortere på rating, lengde og lanseringsdato, kan man filtrere filmer på sjangre, produksjonsselskap, lanseringsdato og lendge. For å laste inn flere filmer som passer til søket/sorteringen/filtreringen, scroller man ned til bunnen av appen.  

<img src="assets/movDBApp.jpg"  width="375" height="667" >

## Installering og kjøring

#### 1 - Klon prosjektet
Åpne en terminal, og naviger til mappen du ønsker å installere prosjektet i.
Klon repoet ved å skrive: 

```
git clone https://gitlab.stud.idi.ntnu.no/aleksawk/prosjekt-4
```

#### 4 - Installer og kjør appen:
1. Åpne en ny terminal

2. I prosjektets rotmappe: 
    ``` 
    ...\movDB
    ```
    
3. Installer avhengighetene til appen med: 
    ``` 
    npm install
    ```
    
4. Start expo med: 
    ``` 
    expo start
    ```
5. Last ned expo appen på din mobil

6. Ta bilde av QR-koden på expo nettsiden (Pass på at mobilen og pcen er på samme nettverk)

## Verktøy og tredjepartskomponenter

* [React](https://reactjs.org/)
* [NativeBase]()
* [Apollo Client](https://www.apollographql.com/docs/react/)
* [GraphQL](https://graphql.org/)
* [Apollo Server](https://www.apollographql.com/docs/apollo-server/)
* [MongoDB](https://www.mongodb.com/)
* [React-native-multi-slider](https://openbase.io/js/@ptomasroos/react-native-multi-slider)
* [React-native-popup-dialog](https://reactnativeexample.com/a-highly-customizable-react-native-popup-dialog/)
* [React-native-chip-input](https://github.com/ramprasath25/react-native-chips)

# Bidragsytere

* **Aleksander** - aleksawk@stud.ntnu.no - Gitlab: [aleksawk](https://gitlab.stud.idi.ntnu.no/aleksawk)
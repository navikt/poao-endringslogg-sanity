# poao-endringslogg-sanity

Sanity-oppsett for PO arbeidsoppfølging sin endringslogg.
Innholdet er tilgjengeleg på [https://endringslogg.sanity.studio/production/structure](https://endringslogg.sanity.studio/production/structure)

## Bygg og deploy
For å få nye endringar i main ut i prod må appen deployast manuelt frå eiga maskin.

Før du kan gjere dette må du gje brukaren din rette tilgangar og logge inn i Sanity frå terminalen din.

### Tilgangar
Gå til sida for endringsloggen (lenka frå fyrste avsnitt), logg inn med SSO for navikt. Dette gjev lesetilgang til brukaren din.

Utviklarar treng rollene "Administrator" og "Developer".
For å redigere innhald trengs "Editor".

Be nokon i teamet som har Administrator-rolla om å oppdatere rollane til brukaren din.

Du kan sjekke kven som har kva tilgangar på organisasjons-sidene til Sanity: https://www.sanity.io/organizations/ojSsHMQGf/project/li581mqu/members-v2
Vel "Sign in with SSO" og skriv inn `navikt` som "Organization slug".

### Logge inn
For å logge inn med SSO køyrer du følgjande linje i terminalen:  
`npx sanity login --sso navikt`

#### Logge ut etterpå
`npx sanity logout`

### Deploy
Hent nyaste versjon av `main`-greina før du deployer.  
Appen vert deploya frå lokal maskin ved å køyre  
`npx sanity deploy`

## Kjøring lokalt
For å køyre opp appen lokalt gjer du:  
`npm install`  
`npm start`  

Dette skal gje deg tilgang til Sanity Studio frå http://localhost:3333. Logg på med SSO.

Den lokale versjonen er kopla på same Sanity-database som prod-versjonen. Endringar i tekstar frå eiga maskin også påverke tekstar i prod.

## Henvendelser

Ta kontakt i [#po-arbeidsoppfølging](https://nav-it.slack.com/archives/CKZ92LT24)
eller i [#team-obo-poao](https://nav-it.slack.com/archives/C02G0292ULW) om du lurer på noko.

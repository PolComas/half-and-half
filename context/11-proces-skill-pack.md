# Procés del Devpost Learn Skill Pack

**Font:** [repositori oficial](https://github.com/challengepost/learn-ai-basics), consultat el 2026-10-21. Aquest paquet només l’ha inspeccionat; no l’ha instal·lat ni executat.

Amb Node.js i Git disponibles, la instal·lació indicada és:

```sh
npx skills add challengepost/learn-ai-basics --all -y
```

Seqüència: `1-start` → `2-scope` → `3-prd` → `4-spec` → `5-build` → `6-ship`.

Els tres plans es generen a `devpost/scope.md`, `devpost/prd.md` i `devpost/spec.md`. El procés diferencia esborrany i aprovació; el silenci no és aprovació. La persona aporta decisions; l’agent pregunta i organitza. El text de candidatura i les respostes de reflexió els escriu la persona, amb correccions lingüístiques limitades per part de l’agent.

## Estat d’aquest lliurament

Cap etapa consta com a completada. No hi ha perfil d’aprenent, plans, checklist de construcció ni app map. El README de `devpost/` és només una nota.

**Actualització del 2026-10-22:** s’ha executat l’ordre d’instal·lació anterior dins del projecte. El primer intent ha fallat amb `EAI_AGAIN`; el segon, amb accés ampliat, ha instal·lat els sis skills a `.agents/skills/`. S’han llegit el `1-start` instal·lat i la seva plantilla i s’ha iniciat l’entrevista. `skills-lock.json` conserva la procedència i els hashes retornats per l’instal·lador. Instal·lar els sis skills no equival a completar-los: `1-start` continua en curs i no s’ha iniciat la construcció.

**Actualització posterior del mateix dia:** acabada l’entrevista essencial, s’ha desat el perfil local d’aprenent i s’ha completat `1-start`. S’han llegit `2-scope` i la seva plantilla i s’ha creat `devpost/scope.md` amb `status: draft`, a partir dels acords explícits disponibles. Format de revisió i aprovació pendents; no hi ha PRD ni spec i no s’ha iniciat `5-build`. Aquest estat posterior preval sobre la nota d’inici del procés.

**Estat posterior a la revisió del mateix dia:** l’usuari ha triat revisions en text o Markdown, ha revisat l’abast i l’ha aprovat explícitament per a la primera versió. `scope.md` consta com a `status: approved`; s’ha completat `2-scope` i comença l’entrevista de `3-prd`. Les millores futures queden condicionades al temps disponible, després del nucli. PRD i spec encara no existeixen i no s’ha iniciat `5-build`.

**Estat posterior durant l’entrevista de producte:** l’usuari ha concretat entrada sense compte per codi curt, direcció visual, cubell i pinzell, controls de correcció i absència de vista completa inicial. Ha afegit explícitament la descàrrega de l’obra final a la primera versió, mantenint la galeria fora; `scope.md` reflecteix aquest canvi. S’ha desat el primer `devpost/prd.md` amb `status: draft` i preguntes obertes. La revisió del PRD encara no està completada; no hi ha spec ni construcció.

**Estat posterior, PRD per revisar:** s’han concretat idees i edició, inici de generació, espera, errors, desament automàtic, finalització, dispositius, idioma i controls de pintura. L’usuari ha acceptat el topall global de generació de la demo i ajornar les quotes diàries individuals. `prd.md` està preparat per revisar, amb `status: draft`; encara no s’ha aprovat el document complet. Les concrecions de 3 intents totals per ronda i controls de correcció són propostes a validar en aquesta revisió. No hi ha spec ni construcció.

**Estat posterior, PRD aprovat:** després de mostrar el resum complet i l’enllaç al Markdown, l’usuari ha respost «Aquest PRD em sembla perfecte, podem passar a la següent fase i implementar-lo». S’ha marcat `prd.md` com a `status: approved`, incloses les concrecions mostrades. `3-prd` està completat i comença `4-spec`, després de llegir el skill real, la plantilla i els patrons tècnics. Encara no hi ha `spec.md`, arquitectura escollida ni implementació. La petició d’implementar no substitueix les decisions i la revisió del pla tècnic.

**Estat posterior, primera spec per revisar:** recollides les preferències tècniques i el pressupost, l’usuari ha acceptat la credencial privada en cookie per reprendre la plaça al mateix navegador, sense registre. S’ha creat `devpost/spec.md` amb `status: draft`: arquitectura proposada, contractes, dades, arxius, límits, riscos i verificacions amb dues sessions independents. Els nous detalls de model, quota, cubell i recuperació incerta estan marcats com a propostes de revisió. El pla complet encara no està aprovat. No s’ha implementat, creat infraestructura, gastat crèdit, executat `5-build` ni desplegat. Les ordres d’arrencada són especificacions futures, no una app executable actual.

**Estat posterior, spec aprovada i ordre de construcció per revisar:** després de revisar el pla complet i els compromisos destacats, l’usuari diu «Em sembla tot bé, podem seguir endevant». `spec.md` passa a `status: approved` i `4-spec` queda completat; aquesta mateixa resposta demana continuar amb `5-build`. Llegits el skill real de construcció i la seva plantilla, s’ha creat `devpost/checklist.md` amb `status: draft`, tres increments usables, comprovacions i commits. El skill demana aprovació de l’ordre abans d’implementar; mode learn/fast encara pendent. No cal repetir l’aprovació del PRD o de la spec. No s’ha iniciat cap increment, creat infraestructura, gastat crèdit ni desplegat. Aquesta instrucció posterior preval sobre la limitació inicial de quedar-se en planificació; desplegament i candidatura continuen fora.

**Estat posterior, construcció en mode fast:** l’usuari aprova l’ordre i tria explícitament mode ràpid, amb interès a provar l’app. Checklist aprovada. Primer increment implementat i comprovat amb unitàries, PostgreSQL temporal i dos navegadors, i dues generacions reals al projecte Supabase nou creat en pla gratuït. SaidChip s’ha pausat amb autorització explícita; no s’ha eliminat cap projecte. El primer increment encara espera comentaris de l’usuari al checkpoint abans del seu commit i marca de completat. No s’ha iniciat pintura o revelació, desplegament ni candidatura. Resultats, cost estimat i límits a `devpost/verification.md`.

**Estat posterior, després del primer feedback:** l’usuari ha provat les dues meitats i ha aportat captures: demana un únic subjecte híbrid, pintura funcional i més vida al fons. S’han resolt el prompt i l’ambient; els dos primers increments estan implementats, verificats i desats amb commits. L’editor inclou pinzell, cubell, Undo/Clear i desament privat al navegador. La finalització, revelació i descàrrega s’han implementat al tercer increment i s’estan verificant. No es marca el checkpoint final, ni `5-build` complet, abans dels comentaris reals de l’usuari i la confirmació explícita de preparació. No hi ha desplegament ni candidatura publicada.

**Confirmació posterior de la revisió final:** l’usuari confirma primer que pot pintar amb les dues eines, i després, en resposta a la prova de recàrrega, espera, revelació i descàrrega, diu «Si tot funciona ja». Es tanca la revisió de la prova de concepte i es registra l’últim increment. El resum d’aprenentatge i mapa corresponen al final de `5-build`; desplegament i candidatura continuen fora de l’autorització actual.

## Aplicació al nostre projecte

El context evita haver de repetir acords, però no substitueix les converses de planificació. Proposar un stack no l’aprova. La frase històrica sobre una “segona decisió” no autoritza inventar-la.

El prompt inicial autoritza preparar el procés i planificar. **No autoritza començar a construir l’app.** Arribat el moment, l’usuari decidirà continuar amb construcció. No cal una aprovació addicional per crear aquest ZIP: la seva petició ja l’autoritza.

Si no es pot instal·lar o carregar el pack real, informar de l’error concret; no crear documents substitutoris afirmant que provenen dels skills.

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

## Aplicació al nostre projecte

El context evita haver de repetir acords, però no substitueix les converses de planificació. Proposar un stack no l’aprova. La frase històrica sobre una “segona decisió” no autoritza inventar-la.

El prompt inicial autoritza preparar el procés i planificar. **No autoritza començar a construir l’app.** Arribat el moment, l’usuari decidirà continuar amb construcció. No cal una aprovació addicional per crear aquest ZIP: la seva petició ja l’autoritza.

Si no es pot instal·lar o carregar el pack real, informar de l’error concret; no crear documents substitutoris afirmant que provenen dels skills.

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

## Aplicació al nostre projecte

El context evita haver de repetir acords, però no substitueix les converses de planificació. Proposar un stack no l’aprova. La frase històrica sobre una “segona decisió” no autoritza inventar-la.

El prompt inicial autoritza preparar el procés i planificar. **No autoritza començar a construir l’app.** Arribat el moment, l’usuari decidirà continuar amb construcció. No cal una aprovació addicional per crear aquest ZIP: la seva petició ja l’autoritza.

Si no es pot instal·lar o carregar el pack real, informar de l’error concret; no crear documents substitutoris afirmant que provenen dels skills.

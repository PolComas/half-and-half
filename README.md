# Half & Half

Dues idees, dues meitats, una creació compartida.

Paquet documental preparat el **21 d’octubre de 2026** per iniciar un repositori nou per a Build With AI: Basics. El paquet original només contenia context. La ronda completa està implementada, comprovada mecànicament i confirmada per l’usuari en la revisió manual.

Actualització del **22 d’octubre de 2026**: el Devpost Learn Skill Pack s’ha instal·lat localment i s’han completat `1-start`, `2-scope`, `3-prd` i `4-spec`. L’usuari ha revisat i aprovat l’[abast de la primera versió](devpost/scope.md), al qual ha afegit posteriorment la descàrrega del resultat final, i el [PRD complet](devpost/prd.md). El [pla tècnic](devpost/spec.md) també està aprovat: React i servidor Node local, Supabase privat, pressupost limitat als crèdits existents i identitat sense compte. L’usuari ha aprovat la [checklist de construcció](devpost/checklist.md) i triat mode fast. El primer checkpoint ha aportat captures i correccions: idees fusionades en un sol híbrid i un fons amb moviment suau. Hi ha sala, generació real, editor privat amb desament local, finalització, revelació i descàrrega. L’usuari ha confirmat que tot el tram final funciona; s’han mostrat el resum d’API i el mapa del codi, i `5-build` queda completat. No hi ha desplegament. Resultats i límits a [verification.md](devpost/verification.md). L’usuari ha aportat la transcripció del vídeo, conservada en local al document 10. La transcripció completa, la conversa recuperada i el perfil d’aprenent estan exclosos del repositori públic; els resums de context es mantenen disponibles.

Per reinstal·lar els skills en un clon nou, amb Node.js i Git disponibles, executa `npx skills add challengepost/learn-ai-basics --all -y`. `skills-lock.json` registra la instal·lació inicial; les còpies locals dels skills queden fora dels commits.

## Executar l’app local

Requisit: **Node.js 24**, npm i Internet. Amb les dependències ja instal·lades i `.env` configurat:

```bash
npm run dev
```

Obre **http://localhost:5173**. Per aturar els dos processos, `Ctrl+C`. Obre la segona persona en un altre perfil o navegador; dues pestanyes del mateix perfil comparteixen plaça. Un perfil crea sala, l’altre entra amb el codi de sis caràcters. Cadascú escriu una idea i la confirma dues vegades. Apareixen les idees i només la meitat pròpia quan acaba una única generació compartida. Recarregar conserva plaça i base.

Pinta amb **Fill** (cubell) o **Brush**, tria color i gruix, desfés amb **Undo** o neteja amb **Clear colors**. Espera «Saved on this device» abans de recarregar o tancar. El color es conserva a IndexedDB d’aquest navegador; només una pestanya pot editar aquella meitat alhora. Les regions amb contorns oberts es poden omplir juntes: desfés i utilitza el pinzell si passa.

Quan estiguis satisfet, prem **I’m done** i confirma: es desa i congela la teva capa. Si falla, **Retry finishing** conserva el mateix final; no crearà una segona finalització. La primera persona espera veient només la seva meitat. Amb dues finalitzacions vàlides apareix l’obra completa i **Download your artwork** descarrega el mateix PNG en tots dos perfils. Les bases ja generades no canvien amb el prompt nou. Per provar una nova combinació, torna a Home després de revelar i crea una nova sala; consumirà una generació quan tots dos confirmin les idees.

La il·lustració de la home és un PNG híbrid d’exemple reutilitzat d’una generació de prova ja registrada; obrir-la no genera cap imatge ni exposa una partida privada. Les il·lustracions de les sales es generen amb l’API d’OpenAI. L’ambient del fons no fa crides d’IA. Inicialment segueix la reducció de moviment del navegador; el control de la capçalera permet activar o pausar explícitament només el fons.

**Home i partida nova:** el logo i l’enllaç Home obren la home sense perdre la sala activa; «Resume your room» torna al dibuix. Després de revelar, «Create a new room» o el formulari de codi permeten començar una altra sala amb credencial nova. La parella conserva el seu propi accés a la sala anterior. Si falla l’entrada, es conserva la sessió existent; repetir una resposta perduda recupera la mateixa operació. La quota global no es reinicia.

**Recent on this device:** els tres últims PNG revelats es desen automàticament a IndexedDB i es poden veure/descarregar des de la home. Només en aquest navegador i origen; esborrar-ne les dades o canviar de dispositiu no els recupera. Si no es pot desar una còpia local, s’explica l’error i es pot descarregar abans de continuar explícitament sense aquella còpia. Cap meitat pendent entra a l’historial.

En un clon nou:

```bash
npm ci
cp -n .env.example .env
```

Configura localment `SUPABASE_URL`, `SUPABASE_SECRET_KEY` i `OPENAI_API_KEY`. La clau Supabase ha de ser secreta (`sb_secret_…`) o una clau de servei antiga amb rol `service_role`, mai `anon`. Cap clau al xat, al frontend o al repositori. `APP_ORIGIN=http://localhost:5173` i `PORT=3001` són els valors de desenvolupament. No obrir la web amb `127.0.0.1` mentre l’origen configurat sigui `localhost`.

Abans de generar, comprova saldo, recàrrega i configuració de límits; només aleshores estableix `OPENAI_BILLING_VERIFIED=true` i `OPENAI_GENERATION_ENABLED=true` i reinicia el servidor. Les generacions reals consumeixen crèdits i compten al topall global de 20, inclosos reintents i proves. Amb el límit assolit, no s’engega cap generació nova. `npm run preflight` comprova presència/tipus de claus i connexió de dades sense imprimir secrets ni generar imatges; no consulta el saldo.

Per preparar un projecte Supabase nou buit, aplica en ordre els quatre SQL de `supabase/migrations/` des del SQL Editor d’aquell projecte; no els apliquis sobre una base aliena. El projecte Half & Half d’aquesta sessió ja està preparat i les versions locals coincideixen amb la seva història remota. Les quatre taules i el bucket són privats; només Node hi accedeix després de comprovar cada participant.

Execució compilada, també comprovada:

```bash
npm run build
APP_ORIGIN=http://localhost:3001 npm start
```

Obre http://localhost:3001. L’origen canviat afecta la identitat del navegador: tria una adreça estable per a cada prova. No canviïs de dispositiu o esborris dades esperant recuperar automàticament la plaça.

## Comprovacions

```bash
npm run typecheck
npm test
npm run build
```

Per a les proves d’integració i navegador cal PostgreSQL 16 o superior amb `pg_config`, `initdb` i `pg_ctl`, i Chrome instal·lat. Es crea una instància temporal exclusiva de tests a `127.0.0.1:5548`; els tests no llegeixen les claus de `.env` ni toquen Supabase de producció:

```bash
npm run test:db
npm run test:integration
npm run test:e2e
npm run test:db:stop
```

Els tests de navegador mostren «Test fixture — no AI was called». No són el mode real de l’app i no substitueixen les proves reals documentades a [verification.md](devpost/verification.md).

## Estat del procés

`1-start` → `2-scope` → `3-prd` → `4-spec` completats. `5-build` completat el **23 d’octubre de 2026**: construcció, proves mecàniques, revisió manual real, resum de la integració d’API i [mapa de l’app](devpost/app-map.html). El mapa es pot obrir directament com a fitxer local, sense servidor ni connexió. `6-ship` encara no s’ha iniciat. Desplegament i candidatura continuen fora d’aquesta fase.

**Iteració posterior del 23 d’octubre:** a petició de l’usuari es va reobrir `5-build` per Home/nova sala, tres PNG locals i refinament visual professional amb moviment de xarxa inspirat en el referent indicat. Implementat, verificat mecànicament i confirmat per l’usuari amb «Funciona tot bé» després de la prova sol·licitada. Aquesta revisió queda tancada. La finalització anterior del MVP queda registrada, no es reinicia el procés ni es considera iniciat `6-ship`.

**Segona revisió del fons, 23 d’octubre:** més figures amb trajectes continus d’entrada i sortida; control a la capçalera que es manté visible en desplaçar-se, amb preferència local. Sense elecció pròpia segueix el sistema; una activació o pausa explícita té prioritat només per al fons. La resta d’animacions continua respectant la reducció de moviment. Aquesta petició posterior reobre només la revisió afectada de `5-build`; el comentari manual sobre el nou fons encara està pendent. Sense generacions noves ni desplegament.

**Responsive i accessibilitat:** layouts comprovats a 390/768/1024/1440 px i toc emulat en Chrome. No equival a proves en mòbil/tauleta físics ni a suport verificat de Safari/WebKit/Firefox. Hi ha etiquetes, focus visible, diàlegs natius, estats anunciats i preferències de moviment. El canvas encara depèn del punter: el cubell no té alternativa amb teclat i la descripció de la imatge és genèrica. Queden pendents auditoria de contrast/zoom i proves amb lector de pantalla; no s’afirma conformitat WCAG.

## Què està acordat

Dues persones aporten una idea cadascuna. La IA combina les idees en una sola il·lustració en blanc i negre per pintar. Les dues idees es fan visibles quan apareix la il·lustració. La divisió és vertical, exactament al 50%: esquerra i dreta. Durant la pintura cadascú veu només la seva meitat, sense veure com pinta l’altra persona. L’obra completa es revela quan tots dos han acabat.

El nom **Half & Half** prové de la petició actual. El públic inicial són parelles, incloses les que estan a distància. No s’ha validat encara la demanda ni es promet un efecte sobre la relació.

## Com utilitzar aquest paquet

1. Descomprimeix-lo en una carpeta dedicada al projecte nou.
2. Llegeix [procedència i límits](context/00-procedencia-i-limits.md).
3. Revisa els acords i les propostes dels documents de context.
4. Obre aquesta carpeta amb Codex i enganxa [el prompt inicial](prompts/INICI_CODEX.md).
5. Completa el procés del Skill Pack abans de començar a implementar.
6. Crea el repositori GitHub i publica’l quan el contingut estigui revisat; aquest paquet no crea ni publica cap repositori.

La carpeta conté documentació de la idea, no codi reutilitzat d’un altre projecte. No esborris aquest context per simular una carpeta buida.

## Mapa de lectura

| Fitxer | Funció |
|---|---|
| [00 — Procedència](context/00-procedencia-i-limits.md) | Què s’ha recuperat, què falta i com resoldre contradiccions |
| [01 — Visió](context/01-visio-i-historia.md) | Motivació, públic i evolució de la idea |
| [02 — Mecànica](context/02-mecanica-acordada.md) | Regles confirmades i comportaments proposats |
| [03 — MVP](context/03-mvp-i-prioritats.md) | Nucli, límits i ordre de treball |
| [04 — Requisits](context/04-requisits-i-validacio.md) | Requisits candidats i proves d’acceptació |
| [05 — Arquitectura](context/05-arquitectura-suggerida.md) | Alternatives i proposta tècnica no aprovada |
| [06 — Disseny](context/06-disseny-i-experiencia.md) | Pantalles, interaccions i direcció visual proposada |
| [07 — Decisions i riscos](context/07-decisions-i-riscos.md) | Incògnites, recomanacions i mitigacions |
| [08 — Hackathon](context/08-hackathon-verificat.md) | Resum verificat i fonts oficials |
| [09 — Pla](context/09-pla-i-demostracio.md) | Calendari intern i evidències per mostrar |
| 10 — Vídeo (només local: `context/10-transcripcio-disponible.md`) | Transcripció recuperada i aportada per l’usuari; exclosa de Git |
| [11 — Skill Pack](context/11-proces-skill-pack.md) | Separació entre context i planificació |
| Arxiu recuperat (només local: `context/archive/conversa-recuperada.md`) | Text històric retornat, amb límits indicats; exclòs de Git |
| [Prompt](prompts/INICI_CODEX.md) | Instruccions completes per iniciar la planificació |
| [Estat de devpost](devpost/README.md) | Estat real del procés i documents pendents |

## Etiquetes d’autoritat

- **ACORDAT:** instrucció expressa recuperada de l’usuari o petició actual.
- **VERIFICAT:** dada contrastada amb una font oficial, amb data.
- **PROPOSTA:** recomanació d’aquest paquet, pendent de decidir amb l’usuari.
- **PENDENT:** no hi ha informació suficient.
- **HISTÒRIC:** context de la conversa, no necessàriament vigent.

Els documents de `context/` no substitueixen `devpost/scope.md`, `devpost/prd.md` ni `devpost/spec.md`. “Oficials” aquí vol dir els artefactes del procés requerit, no documents avalats individualment per Devpost.

## Publicació i idioma

El context de treball és en català. L’arxiu històric conté text en català i anglès, en l’estat retornat. Consulta els requisits lingüístics de la candidatura a [08](context/08-hackathon-verificat.md). Aquest paquet no inclou una llicència triada en nom de l’usuari: la selecció i l’autoria s’han de concretar abans de publicar la candidatura. La documentació històrica pot contenir material de tercers i no queda automàticament sota la futura llicència del codi.

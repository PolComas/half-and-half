# Verificació de construcció — primer increment

Estat: implementat i comprovat mecànicament; **pendent de prova i comentaris de l’usuari** al primer checkpoint de `5-build`. El primer increment encara no està marcat com a acabat a la checklist. L’editor, el desament de colors, la finalització, la revelació i la descàrrega corresponen als increments 2 i 3 i encara no existeixen.

## Serveis i autoritzacions reals

- Ordre de construcció i mode fast acceptats amb «Em va bé aquest mode ràpid, a sobre m’agrada testejar-ho i provar-ho».
- L’usuari ha triat Primary i ha autoritzat pausar SaidChip després d’explicar que interrompria temporalment el servei. Pausa executada sense eliminar dades; Half & Half creat a POL_COMAS, regió Paris, amb pressupost retornat de **0 USD/mes**. Videos ja estava inactiu.
- Claus configurades només en `.env` local ignorat. No s’ha mostrat cap valor al xat, al client o als logs. La clau de servei Supabase existent és del format JWT antic amb rol `service_role`; se n’ha comprovat la connexió. Les claus `anon` o `authenticated` no són acceptades com a clau del servidor.
- L’usuari ha confirmat saldo de 7 USD i recàrrega automàtica desactivada. Accés al snapshot acordat verificat amb una consulta de model de lectura, sense generar.
- No s’ha configurat ni comprovat un límit dur de facturació de projecte OpenAI de 5 USD des del connector; no afirmar el contrari. El control implementat a l’app és el comptador persistent de 20 reserves de 0,25 USD i sostre de planificació de 5 USD. Aquestes reserves no són el cobrament del proveïdor.
- Cap desplegament ni candidatura publicada.

## Resultats mecànics

Executats: `npm run typecheck`, `npm test` (**10** proves), `npm run test:integration` (**7** proves), `npm run test:e2e` (**2** proves) i `npm run build`. Tots han passat després de corregir una importació CSS buida i el tractament de versions de sala entre participants. Les proves s’executen amb PostgreSQL local temporal i imatge sintètica; el servidor de test s’identifica explícitament com a fixture. No substitueix les dues proves reals descrites a continuació.

Cobertura observada:

- Tall i reconstrucció pixel a pixel sense buit, columna duplicada o mirall.
- Dues places exclusives, retorn a plaça existent i tercera sessió denegada.
- Confirmació/edició/versionat, claim únic i publicació idempotent.
- Tres intents per ronda i topall global compartit entre sales, amb tests de concurrència.
- Resposta del proveïdor perduda: no es torna a generar. Original desat: es pot reprendre la preparació sense una segona crida.
- Accés `anon` a taules i funcions denegat en el test de permisos SQL.
- `.env`, sessions locals i context privat bloquejats també per HTTP al servidor de desenvolupament; establiment únic de cookie en StrictMode.
- Dues sessions Chrome independents amb confirmació, recàrrega durant generació i recepció de base pròpia. Alterar `side` no concedeix el costat aliè. El resultat complet continua denegat.
- Home sense desbordament horitzontal a 390 px i captures revisades en desktop i mòbil. Això no acredita encara pintura tàctil, tauleta o proves en un dispositiu mòbil físic.

## Dues generacions reals

Proves fetes a través de l’app local amb Supabase real i OpenAI, en contextos Chrome independents. Cada parella ha compartit una sola base i un sol intent. Recarregar durant generació no ha incrementat el comptador. Els arxius i les sessions de prova queden a `.local/` ignorat i Storage privat; no es publiquen originals ni credencials.

| Aportacions de prova de l’agent, no atribuïdes a l’usuari | Resultat | Ús retornat | Cost estimat |
| --- | --- | --- | --- |
| `a sleepy dragon` + `a moon garden` | Base en blanc i negre de 1024², dues meitats de 512 × 1024; reconstrucció exacta | 144 tokens de text d’entrada + 196 d’imatge de sortida | 0,006600 USD |
| `asjdfoasfn` + `a teapot in a garden` | Text original conservat, generació completada i escena pintable; no es rebutja la seqüència com si fos buida | 149 tokens de text d’entrada + 196 d’imatge de sortida | 0,006625 USD |

Total estimat: **0,013225 USD**, uns 1,3 cèntims de dòlar; **2 de 20 intents globals reservats**. Estimació a partir de `usage` i de les tarifes publicades de 5 USD/milió de tokens de text d’entrada i 30 USD/milió de tokens d’imatge de sortida. No s’ha llegit la factura ni verificat el saldo restant al compte. Fonts: [guia de costos d’imatge](https://developers.openai.com/api/docs/guides/image-generation#cost-and-latency), [preus oficials](https://developers.openai.com/api/docs/pricing).

La primera mostra té 96 regions blanques a l’esquerra i 163 a la dreta; 73 i 128, respectivament, tenen almenys 100 píxels. S’han inspeccionat els contorns i calculat les regions sobre la base real desada, sense regenerar per fer aquesta comprovació. No garanteix absència de petites obertures en totes les zones o en generacions futures. La prova de text aleatori acredita que el flux continua i conserva el text; no una detecció semàntica perfecta ni que sempre aparegui un objecte especialment estrany.

## Base de dades i advisors

Esquema provat primer en una instància PostgreSQL 16 temporal i aïllada, sense dades de producció. Fitxers creats amb `supabase migration new`; aplicats al projecte remot buit amb `apply_migration`, no simulats. Els timestamps locals s’han alineat amb els retornats per `list_migrations` perquè coincideixin amb la història remota. No s’ha afirmat haver executat `db pull --local`: l’entorn de proves natiu no és un stack Supabase Docker.

Advisors executats després de les migracions: cap avís de nivell WARNING/ERROR. Informatius esperats:

- [RLS habilitat sense polítiques](https://supabase.com/docs/guides/database/database-linter?lint=0008_rls_enabled_no_policy) a les quatre taules: intencionat, perquè l’accés públic està revocat i només el servidor amb rol de servei les utilitza. Les comprovacions de participant a Node són obligatòries.
- [Índexs encara no utilitzats](https://supabase.com/docs/guides/database/database-linter?lint=0005_unused_index) sobre les dues claus foranes: resultat d’un projecte acabat de crear, no motiu per retirar els índexs previstos.

## Direcció visual aplicada

- Tesi visual: paper càlid, tinta fosca, accent terracota i il·lustració amb aire de taller tranquil, seguint la spec aprovada.
- Contingut: home amb promesa breu i crear/unir; suport amb el recorregut de tres passos; dins la sala, l’acció i l’estat ocupen el centre. La il·lustració de la home és SVG original de codi i està identificada com a exemple; no consumeix OpenAI ni es presenta com una ronda real.
- Interacció: entrada breu del text i paper, resposta del botó en hover i moviment d’espera durant la generació; es desactiven amb reducció de moviment. No afegir biblioteques d’animació per aquestes transicions.

## Pendent abans del segon increment

L’usuari ha d’arrencar l’app i provar crear/unir, confirmar dues idees, veure les meitats i recarregar. Recollir què ha observat i què voldria canviar. Corregir, verificar i registrar el commit del primer increment; només aleshores marcar-lo complet i passar a la pintura. No registrar aquest checkpoint com a superat només perquè han passat les proves de l’agent.

## Revisió del primer checkpoint

L’usuari ha aportat captures de la seva ronda: la primera versió generava panda i drac separats. `hybrid-coloring-v2` exigeix un sol subjecte físicament fusionat, amb exemple concret i prohibició de personatges separats. Una única crida real nova (223 tokens de text d’entrada, 196 d’imatge de sortida) ha produït un sol panda amb ales, espines de cristall, cua i anatomia de drac; inspecció visual realitzada. Estimació amb les tarifes ja registrades: 0,006995 USD, no una lectura de factura. El comptador global queda a 4 peticions incloent la prova pròpia de l’usuari. S’han repetit typecheck, build, 10 tests de domini, 7 d’integració i 2 e2e: tots passen. Les dues meitats continuen sent 512 × 1024 i només s’obté la pròpia.

Fons: línies orgàniques i textura discreta, deriva amb transformacions CSS, `pointer-events: none`, `aria-hidden` i reducció de moviment global. No consumeix API. L’editor encara correspon al pas 2; no s’ha presentat el dibuix estàtic com a pintura funcional.

Fonts consultades per la revisió: [guia oficial de prompting d’imatges](https://developers.openai.com/api/docs/guides/image-prompting), [changelog de Supabase](https://supabase.com/changelog). Migració de valor per defecte aplicada; les versions de prompts antigues no es reescriuen. Advisors: només el mateix avís informatiu [RLS sense polítiques](https://supabase.com/docs/guides/database/database-linter?lint=0008_rls_enabled_no_policy), intencional amb permisos del navegador revocats i comprovació de participant al servidor.

## Pas 2 — pintura privada i esborranys

Implementats pinzell interpolat, cubell segons regions de base, paleta i selector natiu de color amb degradat, gruix 2–48, un Undo i Clear amb confirmació. Canvas fix de 512 × 1024, blanc/colors/contorns, sense rebre mai la meitat aliena. Les escritures d’IndexedDB són serialitzades, amb instantànies de píxels i Undo, configuració i revisió; es desa al final de cada acció i durant traços llargs aproximadament cada segon. Un Web Lock s’adquireix abans de llegir l’esborrany; la segona pestanya espera i rellegeix les dades quan l’obté. Si el navegador no admet Web Locks o IndexedDB, s’impedeix editar i s’explica com obrir-ho en un navegador compatible; no es promet un fallback no verificat.

Typecheck i build passen; 14 proves de domini inclouen regions, retall, pinzell sota contorns, Undo/Clear, escritures lentes i errors sense fals èxit. E2e en dues sessions Chrome: colors independents, cap pujada de pintura, recàrrega després de fill/brush/Undo/Clear amb igualtat exacta del canvas, error d’IndexedDB i reintent, una sola pestanya editora i recuperació de l’últim estat en tancar-la. Captures de 1440, 1024, 768 i 390 px sense overflow; reducció de moviment comprova animació desactivada. S’hi afegeix gest tàctil emulat; no acredita prova en mòbil físic.

També s’han pintat amb cubell i pinzell les dues meitats de la generació real del pas anterior, amb recàrrega i comparació exacta dels píxels. Cap nova petició d’OpenAI. Limitació observada: una obertura del contorn del panda connecta cos i fons; el cubell omple la regió connectada. Es conserva la base immutable, s’explica la correcció amb Undo/pinzell i es reforçarà el prompt de les rondes noves amb siluetes llises tancades. No s’afirma que el model garanteixi el tancament.

## Pas 3 — finalització i revelació verificades; checkpoint manual pendent

`I’m done` demana confirmació, congela una revisió concreta i espera una transacció local correcta abans de pujar. El commit i la revisió finals persisteixen a IndexedDB per reprendre el mateix enviament després d’un error o recàrrega. Durant un reintent, els colors continuen congelats. El servidor valida PNG estàtic 512 × 1024, límit 8 MiB i identitat/base; normalitza les dades, calcula hash, desa immutable i registra una finalització sota bloqueig de sala. Mateix commit/hash/revisió retorna l’estat existent; altres píxels o un altre commit després d’acabar es rebutgen.

Només dues places diferents amb finals de la mateixa base passen a `composing`. Blanc + colors esquerres + colors drets + contorns negres comuns creen un PNG immutable. Un error de composició es recupera des dels finals desats, sense cridar OpenAI; no publica un resultat parcial. Vista i descàrrega comparteixen objecte i autorització. La primera persona veu la seva pròpia capa congelada, també després de recarregar; la còpia del servidor preval sobre les dades locals.

Comprovacions executades: typecheck, build, 15 tests de domini, 12 d’integració i 2 e2e Chrome, tots passen. Les proves noves inclouen: PNG invàlid/mida errònia/base aliena/token desconegut, fallada de pujada i de commit sense finalització, resposta perduda després de commit recuperable, reintents incompatibles, dos finals simultanis, composició fallida i recuperada/concurrent, topall global assolit sense impedir acabar o revelar, absència de resultat amb un sol final, capa pròpia autoritzada sense poder demanar l’aliena i dues descàrregues idèntiques. L’e2e simula fallada d’IndexedDB: no hi ha cap pujada abans d’un desament local correcte; després simula una pujada fallida i una resposta perduda, amb el mateix `commitId` després de recarregar. La generació desactivada també impedeix enviar reserves pendents durant la recuperació d’un reinici.

Prova real nova amb `hybrid-coloring-v3`: un sol panda-drac amb contorns externs més continus; inspecció visual feta. 156 tokens de text d’entrada i 196 d’imatge de sortida; cost estimat 0,006660 USD. En dues sessions s’ha pintat amb les dues eines, recarregat amb igualtat del canvas i completat la ronda. La primera finalització continua rebent denegació de resultat; amb la segona apareix la mateixa obra. Els dos botons de descàrrega han generat PNG idèntics, i els píxels del resultat coincideixen exactament amb la unió de les dues meitats pintades. Recàrrega després de revelar superada. No s’ha regenerat cap base activa de l’usuari. Els contorns oberts continuen sent una limitació possible; no es garanteix la qualitat d’una resposta futura d’IA.

Comptador consultat al final: 5 intents globals, incloent la ronda pròpia de l’usuari; 818 tokens de text d’entrada i 980 d’imatge de sortida agregats. Amb les tarifes de referència ja registrades, aproximadament **0,033490 USD** en total per aquestes cinc generacions. No és consulta de factura ni de saldo del compte. Les dues crides noves d’aquesta revisió estimen 0,013655 USD conjuntament. Queden 15 reserves del topall de l’app; crear sales noves no el reinicia.

La migració `final_reveal` s’ha aplicat després de passar la integració local; la història local coincideix amb la remota. Advisors després de la migració: sense avisos de rendiment; seguretat només els quatre INFO de RLS sense polítiques, intencionals amb permisos de navegador revocats. [Explicació del linter](https://supabase.com/docs/guides/database/database-linter?lint=0008_rls_enabled_no_policy). Escaneig de patrons de credencials als candidats de publicació: zero coincidències. Els arxius privats segueixen ignorats i denegats per Vite.

`npm start` també s’ha arrencat al port 3002 per comprovar el frontend compilat, amb URL/clau Supabase buides i generació desactivada per no iniciar un segon coordinador sobre la sala real. La ronda real s’ha provat a l’adreça de desenvolupament estable, localhost:5173. Captures inspeccionades d’editor i revelació, també adaptació estreta, sense overflow. Gest tàctil emulat a Chrome; no prova física de mòbil/tablet ni prova Safari/Firefox. El servidor temporal de comprovació i PostgreSQL de tests es tanquen en acabar; el servidor de l’usuari no s’atura.

Estat del pack: primer feedback resolt i increments 1–2 amb commit i push. Increment 3 pendent de prova manual final, commit i marca de completat segons el checkpoint fast de `5-build`; no confondre proves de l’agent amb observacions de l’usuari. Aprenentatge final/app map encara pendents després de la revisió real. No desplegament ni publicació de candidatura.

### Retorn manual de l’usuari

Resposta real rebuda: «Ara si molt millor ja puc pintar amb el cubell fent fill i amb el pinzell». Confirma les dues eines de pintura. No s’infereix que hagi provat la recàrrega, les finalitzacions, la revelació o la descàrrega, ni que hagi aprovat tota la prova de concepte. Es demana continuar la mateixa ronda en dos perfils, sense generar una altra imatge.

### Confirmació de la revisió final

Després de la confirmació inicial de cubell i pinzell, s’ha demanat provar a la mateixa sala la recuperació després de «Saved», espera amb un sol final, revelació amb dos i descàrrega. L’usuari respon «Si tot funciona ja». Es registra com a confirmació manual del tram final i de la prova de concepte, sense inventar comprovacions més detallades que no hagi relatat. No s’han fet noves generacions ni canvis de codi després de les verificacions registrades.

## Tancament de `5-build` — 2026-10-23

Després de la interrupció de sessió, s’ha reprès el tancament sense modificar codi de l’app ni repetir generacions de pagament. El tercer increment està desat al commit `75fdcb1`; els tres increments i la revisió final estan marcats completats.

Mapa `devpost/app-map.html` generat a partir d’aquest commit: camins i ancoratges de codi comprovats, sense scripts ni recursos externs. Obert en Chrome sense JavaScript i amb xarxa desactivada a 1440 i 390 px; contingut i desplegable natiu visibles, cap petició externa ni desbordament horitzontal. Captura estreta inspeccionada. S’ha mostrat l’enllaç i explicat com reobrir-lo. El resum connecta el problema real de dos personatges amb el prompt híbrid, el contracte `n: 1`, la petició autenticada al servidor i el tall exacte; no es presenta com una pràctica guiada o un domini adquirit per l’usuari.

No s’han tornat a executar els 29 tests de l’app: el codi coincideix amb el que ja els havia passat i l’usuari ha confirmat funcional. La comprovació nova és proporcional als canvis exclusivament documentals del mapa. `5-build` completat; `6-ship`, desplegament i candidatura continuen pendents i fora d’aquesta execució.

## Iteració posterior — Home, nova sala i tres PNG locals

Peticions explícites del 2026-10-23: recuperar Home per jugar una altra vegada; conservar tres últims dibuixos al navegador; presentació professional i moviment suau amb el referent MazeMind. L’abast s’ha actualitzat sense reiniciar les aprovacions anteriors. Cada partida continua sent una sala independent d’una ronda, amb límits globals compartits.

Implementat: fragments `#home`/`#room` i represa de la plaça; després de revelar, entrada a sala nova amb canvi de cookie només després d’èxit. La credencial nova es deriva al servidor de la credencial privada anterior i l’operació, de manera idempotent. Respostes de polling d’una identitat anterior s’ignoren; les versions es comparen dins de cada sala. La fallada d’entrada manté l’accés anterior. No es canvia cap taula ni permís de Supabase.

IndexedDB separat conserva com a màxim tres PNG complets revelats, amb base, idees i data; transacció atòmica i cap duplicat per recàrrega. Miniatures i descàrregues amb Blob locals. Es comprova la base sol·licitada al resultat per impedir associacions equivocades entre sales durant navegació. Error de desament visible, reintent i alternativa explícita de descarregar/continuar sense còpia local. No se serveixen originals de partides actives ni pintura aliena al nou historial.

Disseny: xarxa SVG pròpia i camps de color suaus, moviment lent i reducció de moviment respectada. S’ha llegit el component de referència aportat al projecte local MazeMind; no s’ha importat el seu codi. Home amb composició d’il·lustració dominant, fulls superposats i accions agrupades; resultat i eines mantenen jerarquia clara. El PNG de mostra reutilitza `hybrid-coloring-v3` ja generat durant les proves anteriors, pesa aproximadament 48 KiB i està etiquetat com a exemple. No s’ha fet cap crida nova de pagament ni generat una imatge de marca nova.

Comprovacions: typecheck, build, 16 proves de domini, 12 d’integració i 2 e2e Chrome superats. El recorregut e2e ampliat prova Home/recarregar/represa, PNG guardat només després de revelar, fallada de desament local i reintent, entrada fallida sense canviar identitat, resposta perduda de sala nova, segona persona encara amb accés al resultat vell abans d’entrar a la nova sala, dos costats correctes, mateix PNG local després del canvi i límit de tres sense duplicats. Es comprova que començar una sala no provoca cap petició extra d’imatges i que l’historial rebutja una ronda no revelada. Els tests de quota global preexistents continuen passant.

Captures de home a 1280 i 390 px inspeccionades: composició llegible, imatge d’exemple diferenciada, sense overflow. Adaptacions d’editor i resultat, bloqueig de pestanyes, desament i revelació continuen passant dins del mateix e2e. És Chrome i emulació tàctil, sense afirmar una nova prova en dispositius físics. La validació manual de l’usuari per aquesta iteració queda pendent.

Fonts actuals consultades: [regles oficials](https://learn-ai-basics.devpost.com/rules) i [repositori del Skill Pack](https://github.com/challengepost/learn-ai-basics). El refinament es manté dins del procés de revisió i proves de `5-build`; cap candidatura publicada ni desplegament.

Comprovació addicional al servidor real existent: home oberta a 1440 i 390 px, moviment de la xarxa verificat per transformacions diferents entre fotogrames, `pointer-events: none` al fons i animació aturada amb reducció de moviment. Sense errors del navegador, overflow ni cap petició de crear sala o generar imatge en obrir-la. El mapa s’ha actualitzat amb els punts d’entrada de la nova sala i dels PNG locals, i els ancoratges s’han contrastat amb el codi.

### Confirmació manual i tancament de la iteració — 2026-10-23

S’ha demanat recarregar Half & Half, tornar a Home des del resultat, trobar-hi el PNG desat i començar una sala nova, i valorar la composició i el moviment de fons. L’usuari respon «Funciona tot bé». Es registra com a confirmació de les parts modificades i es tanca la revisió reoberta de `5-build`, sense inventar detalls sobre dispositius o comprovacions internes.

Només s’actualitza la documentació de l’estat i el peu del mapa; el codi de l’app continua al commit `7c8897e`, amb les 30 proves, typecheck i build ja superats. No es repeteixen proves de l’app ni generacions de pagament per aquest tancament documental. El resum d’aprenentatge i mapa ja lliurats continuen completats. `6-ship` no s’ha iniciat; cap desplegament ni candidatura publicada.


## Segona revisió del fons — 2026-10-23

Petició posterior a l’acceptació anterior: més figures que entrin i surtin de pantalla contínuament. Implementades 16 figures SVG (10 visibles a menys de 561 px), cinc formes, dues direccions, rotació lenta i durades de 68–118 segons. El reinici de cada trajecte té lloc fora del viewport. Sense timers, dependències o crides a OpenAI. El fons és decoratiu i no captura clics ni apareix a l’arbre accessible.

Botó de pausa al peu amb nom i estat accessibles, accionable amb teclat i preferència en localStorage quan és disponible. Pausa figures, xarxa i camps de color. La reducció de moviment del sistema té prioritat, també si canvia durant la visita: decoració estàtica distribuïda i botó que explica aquesta preferència. No s’atura el desament o la sincronització de la ronda.

Verificació executada: typecheck/build passen. Els dos e2e preexistents passen, inclosa la ronda completa en dos contextos independents i el toc emulat; una prova e2e nova passa després de corregir-ne el mostreig temporal (es retira el delay negatiu només de l’animació inspeccionada). Comprova entrada i sortida fora de pantalla, posicions distribuïdes, teclat/pausa, recàrrega, represa, canvis de preferència del sistema, recompte de figures i layouts 1440/768/390 sense overflow. Captures finals d’escriptori i mòbil inspeccionades amb la decoració pausada realment, en lloc de desactivar-la des del capturador. No s’han repetit els tests de backend, que no canvia. PostgreSQL temporal aturat després de les proves.

Abast real del suport: responsive i toc emulat de Chrome; sense nova prova física, Safari/WebKit o Firefox. Els binaris compatibles de Playwright per als altres motors no estan instal·lats (les versions locals són anteriors a les requerides), i no s’han descarregat per aquesta revisió de fons. Hi ha formularis i diàlegs natius, etiquetes de colors, focus visible general, missatges d’estat i reducció de moviment. Això no és una auditoria completa: el canvas no té alternativa de teclat per al cubell, la seva descripció és genèrica i falten comprovacions de contrast/zoom i lector de pantalla. No es declara conformitat WCAG.

Fonts revisades per a les respostes: [criteris del hackathon](https://learn-ai-basics.devpost.com/rules), [pack real](https://github.com/challengepost/learn-ai-basics), [pausa del moviment](https://www.w3.org/WAI/WCAG22/Understanding/pause-stop-hide.html) i [operació amb teclat](https://www.w3.org/WAI/WCAG22/Understanding/keyboard.html). No hi ha dades per estimar una probabilitat de victòria ni es presenta una opinió com a puntuació del jurat.

Plans i mapa actualitzats; ancoratges del mapa contrastats amb els fitxers. Revisió manual del nou fons pendent: no es reutilitza «Funciona tot bé» per aprovar canvis posteriors a aquella resposta. `6-ship` no iniciat, cap desplegament o candidatura publicada.


### Correcció després del feedback de moviment bloquejat

L’usuari confirma que veu figures, però no es mouen; veu només «Reduced motion enabled» desactivat i no troba el control des de dalt perquè era al peu. La primera implementació tractava la preferència del dispositiu com un bloqueig permanent, massa restrictiu per a l’elecció explícita demanada.

Corregit: sense preferència pròpia, el fons segueix el sistema. «Motion off» / ▷ permet activar-lo explícitament i «Motion on» / Ⅱ permet pausar-lo; l’elecció es conserva localment quan Storage està disponible. Aquesta excepció s’aplica només al fons: les animacions de contingut continuen reduïdes si el dispositiu ho demana. El botó ja no es desactiva. Capçalera sticky, control visible des del principi i en desplaçar-se, nom accessible complet i estat `aria-pressed` coherent amb moviment activat. En mòbil es mostra la icona compacta amb el mateix nom accessible.

Verificacions: typecheck i build passen. Les dues proves del fons comproven el cas de sistema reduït abans d’obrir l’app, activació amb teclat, transformacions que canvien realment, pausa/represa, recàrrega, prioritat de l’elecció manual, seguiment dels canvis del sistema sense elecció pròpia i control dins del viewport a dalt i al final en 320/390/768/1440 px. Captures d’escriptori i mòbil inspeccionades. La primera prova integrada va detectar que la capçalera tapava el punt de toc del canvas després del desplaçament; `scroll-padding-top` reserva espai i les dues proves preexistents tornen a passar, inclosa la ronda completa i el toc amb canvi de píxels verificat. La revisió té quatre e2e superats; no s’han repetit tests de backend ni fet crides d’OpenAI.

Aquest feedback es registra com una incidència resolta mecànicament, no com una aprovació manual de la correcció. Es demana recarregar i provar el control nou; la casella de revisió continua pendent. Cap desplegament ni inici de `6-ship`.


### Continuïtat de posició en pausar i reprendre

Feedback posterior: l’usuari confirma que l’activació ja funciona i demana que els objectes es quedin on són en pausar i continuïn des d’allí. La regla de moviment reduït eliminava les animacions i imposava una posició/rotació estàtica; en reprendre, es creava una animació nova. S’eliminen aquesta substitució i la variable de posició de repòs. El fons manté les mateixes animacions i només canvia `animation-play-state`; la reducció de moviment inicial continua deixant-les pausades, sense moviment previ, i la resta del contingut conserva la seva reducció.

Typecheck i build superats. Quatre proves del fons passen. Les dues proves de regressió noves comproven, amb i sense reducció del sistema, les 20 animacions (16 figures, dues xarxes i dos camps de color): mateixa identitat, temps i transformacions estables durant diversos fotogrames pausats, i represa amb temps continu i moviment real. Es repeteix dues vegades el cicle pausa/represa. S’actualitza l’assert de la ronda perquè el moviment reduït comprovi una animació pausada, en lloc d’eliminada. Les dues proves preexistents també tornen a passar, inclosa la ronda completa amb dues sessions i el toc: sis e2e superats en total. No es repeteixen tests de backend perquè no canvia.

La comprovació manual de la continuïtat encara està pendent; no es reutilitza l’acceptació del control anterior. Sense generacions d’OpenAI, desplegament ni inici de `6-ship`.


Confirmació manual posterior: a la petició de recarregar, seguir una figura, pausar i reprendre des del mateix punt, l’usuari respon «Vale si, ja funciona». Es tanca aquesta revisió i la casella global; els estats pendents anteriors es conserven com a història. No s’atribueixen a l’usuari els tests interns ni dispositius concrets. `5-build` completat; `6-ship` no iniciat. No es modifica més codi ni es repeteixen proves per aquest tancament documental.


## Preparació tècnica de `6-ship` — 2026-10-23

Iniciada per petició explícita després de completar `5-build`. Prerequisits llegits als arxius: plans aprovats, tots els increments, checkpoints, revisió final i resum/mapa complets. S’ha tornat a executar typecheck, suite de domini, build, 12 proves d’integració i 6 e2e; tot passa. L’última execució de `npm test` agrupa la sortida en cinc fitxers de domini; no s’inventa un nou recompte d’asserts. PostgreSQL temporal aturat després de les proves. El servidor de desenvolupament existent documentat respon a localhost:5173 amb `roomsReady: true`, `generationReady: true` i `testFixture: false`; no s’ha reiniciat ni generat una altra imatge.

Repositori comprovat amb el connector GitHub i amb un GET sense autenticació a l’API pública: HTTP 200 i `private: false`. Auditoria al commit `778a1b5`: 29 commits i 249 blobs de la història reachable de `main`, sense rutes privades excloses ni coincidències dels patrons de credencial revisats. Les cerques inclouen claus OpenAI/Supabase, JWT, tokens GitHub i claus privades; no són una garantia absoluta contra totes les formes de dades privades. S’han revisat els documents de publicació, els exemples d’entorn i els canvis previstos, mantenint el perfil i les fonts completes en local. No s’ha reescrit història.

L’usuari ha aprovat expressament MIT amb «PolComas» com a titular. Text oficial SPDX aplicat a `LICENSE`, metadades npm coherents; no s’ha escollit la llicència sense aprovació. Instruccions tècniques en anglès a `docs/SETUP.en.md`, amb fixture sintètica gratuïta clarament diferenciada de l’API real i amb limitacions documentades. Consulta de lectura a Supabase: 5 intents reservats de 20, en queden 15; cap canvi de quota, esquema, clau o infraestructura i cap consulta de saldo d’OpenAI.

Fonts actuals: portada, bases oficials i pack real. La vista pública de My projects no permet llegir el formulari amb sessió i no hi ha navegadors accessibles a l’eina d’UI. L’usuari ha aportat els camps de General info, Project Story i Project Media; enquesta i passos posteriors encara no visibles. S’ha conservat el tagline escrit per l’usuari, revisat només en gramàtica, en notes locals; no s’ha redactat ni reescrit cap resposta de candidatura. L’usuari confirma després que ha omplert els camps i li falten vídeo i fitxers; no s’ha inspeccionat el contingut. Vídeo, fitxers, accés per al jurat, enquesta i enviament continuen pendents de comprovació. Estat a `devpost/ship-checklist.md`; cap desplegament ni candidatura enviada.


Verificació posterior al push de preparació `d12a4a1`: consultes GitHub sense autenticació retornen HTTP 200 per a `LICENSE` (SPDX MIT detectat) i `docs/SETUP.en.md`. L’usuari confirma que els fitxers pendents són Image gallery, que vol destacar el dibuix final al vídeo i que utilitza el gravador integrat. S’ha deixat una guia tècnica local; sense vídeo, galeria definitiva o enllaç públic rebut, no es marquen completats aquests requisits. No s’ha publicat cap candidatura ni escrit cap narració.


## Vídeo rebut i comprovació prèvia a Submit — 2026-10-23

URL aportada per l’usuari: https://youtu.be/U4B9bVnwe8U; títol públic «Devpost half & half». L’eina de cerca no ha pogut recuperar les pàgines curta/canònica. La consulta HTTP directa sense credencials a oEmbed i watch funciona (200); `ytInitialPlayerResponse` informa `playabilityStatus: OK`, `lengthSeconds: 182` i no és una emissió en directe. Això acredita l’accés i les metadades observades, no un visionat del contingut.

Durada 3:02: s’ha indicat que les bases recomanen menys de tres minuts i que el jurat no està obligat a mirar més enllà. Es recomana un retall curt que conservi la revelació, sense inventar desqualificació automàtica. S’ha demanat confirmació de l’enquesta i del flux visible abans del minut tres. No es marca enviament ni `6-ship` completat només perquè l’usuari sigui a la pantalla de Submit. Cap canvi de codi ni noves proves de l’app per aquest registre.


Confirmació posterior: l’usuari respon «Si» a si ha completat l’enquesta de sortida i si el vídeo mostra generació, espera amb un sol participant acabat i revelació abans del minut tres. Es registra com a evidència de l’usuari, separada de la consulta tècnica d’accés i durada. No es dona per fet cap retall de 3:02, càrrega de galeria o enviament. El repositori i el vídeo estan disponibles; el desplegament continua sent opcional. `6-ship` queda pendent de la confirmació real de Submit.


## Lliurament confirmat i tancament de `6-ship` — 2026-10-23

L’usuari aporta el rebut de recepció de Devpost i l’enllaç canònic https://devpost.com/software/half-half-62fdrc, després de confirmar camps, vídeo i enquesta. L’eina web no pot recuperar la pàgina; GET directe sense autenticació retorna HTTP 403. Es registra la confirmació de l’usuari, sense atribuir una inspecció del contingut publicat a l’agent. No es desen el correu original, dades personals ni URL de seguiment.

`6-ship` i el procés guiat queden completats; els estats pendents anteriors es conserven com a història. Sense canvis de codi, noves generacions o desplegament. No es repeteixen proves de l’app per canvis exclusivament documentals; es comproven diff, manifest de sumes i absència de credencials o dades privades entre els fitxers públics.

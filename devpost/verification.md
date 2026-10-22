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

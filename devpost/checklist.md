---
doc: checklist
status: approved
---

# Half & Half — Build Checklist

Build mode: fast — triat explícitament per l’usuari: «Em va bé aquest mode ràpid, a sobre m’agrada testejar-ho i provar-ho». Ordre de construcció aprovat en aquesta resposta després de mostrar els tres passos. Es mantenen prova manual primerenca i revisió final, amb explicació pràctica de la crida a OpenAI.

Scope, PRD i spec estan aprovats. La resposta «Em sembla tot bé, podem seguir endevant» aprova la spec i autoritza passar a `5-build`; aquesta checklist recull l’ordre de construcció posteriorment revisat i aprovat per l’usuari. Els tres increments estan implementats, verificats i desats en Git. El primer checkpoint va recollir captures i correccions reals; al checkpoint final l’usuari confirma que tot el tram funciona. Resum de la integració d’API explicat al xat i mapa autònom generat, verificat i mostrat. `5-build` queda completat el 2026-10-23. Cada pas ha de deixar una app executable, passar les seves comprovacions i quedar registrat en un commit abans de continuar.

En tots els passos: conservar el context original, excloure perfil i secrets, respectar els 7 USD de crèdits existents i 0 USD addicionals, sense desplegar ni publicar la candidatura. Les proves sintètiques s’identifiquen com a tests i no substitueixen l’evidència de generació real. No donar per configurats els comptes, el saldo, les quotes o els permisos.

## Slices

- [x] **1. Dues persones entren amb codi i obtenen les seves meitats d’una generació real**
  Becomes usable: App local on A crea sala i B hi entra amb codi, cadascú confirma una idea i tots dos reben només la seva meitat d’una única il·lustració real. Les idees es revelen quan apareix la base; una recàrrega conserva plaça, fase i generació. Encara no hi ha editor ni botons de finalització sense implementar.
  Why now: Demostra aviat la integració que l’usuari vol aprendre i els riscos principals de cost, unicitat, sincronització i tall. La configuració inicial queda dins d’aquest comportament usable; no es construeixen capes desconnectades esperant integrar-les al final. Validar els contorns de la primera mostra abans de desenvolupar tot l’editor.
  PRD ref: `prd.md > The Core Journey` (passos 1–5), `Entrada amb codi curt`, `Escriure i confirmar les idees`, `Generació i recuperació de la ronda`, `Errors de generació i intents limitats`, `Topall global de generació de la demo`, `Dibuix compartit i visibilitat`.
  Spec ref: `spec.md > Home, sala i identitat sense registre`, `Idees, confirmacions i estat compartit`, `Coordinador de generació única`, `Preparació de base i tall exacte`, `OpenAI: petició, prompt i resposta`, `Pressupost i límits`, `Supabase: dades, arxius i permisos`, `Where It Runs and How Someone Tries It`, `Look and Feel`, `File Structure`.
  Build: Incloure bootstrap React/TypeScript/Vite + Node/Express, scripts reals i configuració sense secrets; aplicar la direcció visual aprovada des de la primera pantalla. Identificar projecte Supabase i permisos abans de modificar-lo i preparar esquema, funcions i bucket privats reproduïbles. Implementar cookie i ocupació atòmica, idees amb doble confirmació/edició, versions, consulta d’estat, reserva persistent de comptadors, claim únic, crida fetch sense reintents automàtics, tractament d’errors definitius/incerts, persistència de l’original, base 1024² i retall 512 × 1024. Completar la comprovació de facturació/model abans de la primera petició real; si falta informació, demanar només la necessària sense exposar secrets. Escriure la primera funció de regions i una comprovació executable de pintabilitat de la mostra per descobrir limitacions del cubell ara. Documentar arrencada real i seguir amb l’usuari el camí idees → petició del servidor → base64 → PNG, sense registrar ni mostrar claus.
  Verify (mechanical): Executar `npm run typecheck`, `npm test`, `npm run test:integration`, `npm run build` i la prova e2e d’aquesta fase amb `npm run test:e2e`. Comprovar que `npm run dev` i `npm start` arrenquen tal com diu el README i serveixen el frontend. En dos contextos de navegador independents, crear/unir/confirmar, recarregar durant generació i verificar una sola petició per intent, mateixa base, idees mostrades al moment correcte i només la meitat pròpia. Fer almenys una generació real dins del pressupost després del preflight i registrar cost disponible i qualitat observada; inspeccionar contorns i provar regions sobre la mostra sense una segona crida innecessària. Verificar reconstrucció exacta de les meitats pixel a pixel. Amb tests deterministes provar confirmació/edició simultànies, reintents, intents globals i per ronda, restart amb resposta perduda i denegacions d’accés amb token/costat alterat o clau pública. Inspeccionar bundle i respostes per detectar secrets, originals complets o dades alienes. Un servei simulat no acredita la integració real ni permet marcar aquest pas complet si falten els accessos.
  Learner check: Amb les ordres reals del README, obrir dos perfils separats, crear una sala i entrar amb el codi, confirmar idees diferents i observar que cada perfil mostra només la seva meitat. Recarregar un perfil i comprovar que no canvia el costat ni es torna a generar. Per evitar un càrrec extra, aprofitar la primera sessió real de verificació quan sigui possible. Explicar què s’observa de la combinació, el format per pintar i la claredat de l’entrada; podem ajustar-ho abans de construir l’editor.
  Commit: `feat: add shared image generation with private room halves`

- [x] **2. Cadascú pinta la seva meitat i recupera els colors en recarregar**
  Becomes usable: Cada participant pot pintar amb cubell o pinzell, triar colors, ajustar gruix, desfer i netejar només la seva pintura. Després de «Saved on this device», recarregar recupera els colors propis. L’altra sessió no veu cap traç; encara no es presenta una revelació o finalització simulada.
  Why now: Construeix sobre una base real i immutable, i comprova la segona part del nucli abans d’afegir la revelació. La mostra i els comentaris del primer pas permeten corregir el format del dibuix abans de dependre’n. Persistir cada acció forma part del comportament de pintar des del principi.
  PRD ref: `prd.md > The Core Journey` (pas 6), `Pintar i corregir`, `Desament automàtic de la pintura pròpia`, `Dibuix compartit i visibilitat`, `Prioritat de dispositius`, `Look and Feel`.
  Spec ref: `spec.md > Editor amb pinzell, cubell i correcció`, `Desament automàtic i recuperació pròpia`, `Preparació de base i tall exacte`, `Descàrrega i protecció de dades`, `Look and Feel`, `Verification Plan`.
  Build: Implementar capes blanc/colors/contorns, coordenades fixes, Pointer Events, pinzell interpolat i cubell per regions de la base dins de la meitat; marge central com a límit. Afegir cercles de colors i selector amb degradat, barra de gruix amb mostra circular, una instantània d’Undo i confirmació de Clear. Implementar IndexedDB serialitzat, guardat després d’accions i checkpoints de traços llargs, revisions i estats de desament fidels. Restaurar només dades compatibles amb la sala/base/costat; protegir contra dos editors del mateix participant en pestanyes. Adaptar eines i llenç a desktop, després mòbil i tauleta, sense reduir requisits de privacitat ni retirar el cubell. Si els contorns reals requereixen un canvi de comportament o arquitectura, discutir-lo i actualitzar els plans abans de continuar.
  Verify (mechanical): Executar typecheck, tests de domini d’editor/regions/historial, proves d’integració afectades, `npm run build` i e2e de pintura/desament. En dues sessions, pintar colors diferents i comprovar per píxels i xarxa que no s’envia pintura a l’altra. Provar cubell sobre regions tancades, obertes i que travessen el centre; el pinzell al marge, a diferents escales i amb touch no modifica base o costat aliè. Desar, recarregar i comparar píxels després de pinzell, fill, Undo i Clear; simular escriptures lentes/fallides i verificar que no es mostra un èxit fals ni ressuscita una revisió anterior. Provar dues pestanyes del mateix participant i la recuperació del bloqueig amb dades actualitzades. Verificar controls amb teclat i mides desktop 1440/1024, mòbil 390 i tauleta 768; distingir emulació de dispositiu real. Reutilitzar la mostra real desada del primer pas, sense generar de nou per a cada test.
  Learner check: Obrir la sala existent en els dos perfils, pintar amb cubell i pinzell, canviar color i gruix, desfer i netejar. Esperar «Saved on this device», recarregar i comprovar que els colors tornen. Confirmar que les eines s’entenen i que cap perfil permet veure com pinta l’altre. En learn, fer aquesta prova abans del commit; en fast, l’agent la verifica i l’usuari la provarà al recorregut final, tret que aparegui una incertesa que necessiti comentaris abans.
  Commit: `feat: add private painting with persistent browser drafts`

- [x] **3. Dues finalitzacions desades revelen la mateixa obra i permeten descarregar-la**
  Becomes usable: Ronda completa: confirmar «I’m done» desa i congela la capa pròpia; qui acaba primer només veu la seva meitat en espera. Només dues finalitzacions vàlides permeten revelar i descarregar el mateix PNG complet en tots dos perfils. Recarregar o repetir una petició no canvia el resultat ni compta una persona dues vegades.
  Why now: Uneix les dues pintures ja recuperables amb una condició de revelació verificable. La ronda completa es prova amb generació i pintura reals, sense crear galeria, nous modes o desplegament. La revisió final pot valorar el producte sencer i resoldre només els ajustos observats.
  PRD ref: `prd.md > The Core Journey` (passos 7–8), `Acabar, esperar i revelar`, `Descarregar el resultat`, `Generació i recuperació de la ronda`, `States and Boundaries`, `What We're Building`.
  Spec ref: `spec.md > Desament final vàlid, espera i revelació`, `Descàrrega i protecció de dades`, `Data Model`, `Application API Contracts`, `Important Failure Modes`, `Verification Plan`, `Where It Runs and How Someone Tries It`.
  Build: Confirmació accessible de finalització; tancar la revisió a enviar i completar desament local abans de pujar. Validar PNG, mida, participant i base al servidor; guardar objecte immutable i després registrar el commit atòmic/idempotent. Bloquejar edició després d’èxit, mostrar meitat pròpia en espera i conservar identitat/estat en recarregar. Amb dos finals compatibles, compondre colors i contorns, desar i publicar un únic resultat, amb recuperació de fallades de composició sense regenerar. Autoritzar vista i descàrrega només a participants amb revelació disponible. Completar adaptació visual i instruccions reals de prova; conservar límits i pressupost, sense publicar res.
  Verify (mechanical): Executar `npm run typecheck`, `npm test`, `npm run test:integration`, `npm run test:e2e` i `npm run build`; arrencar amb `npm start` per la comprovació final. En dos contextos independents, recórrer tot el flux amb una generació real registrada, reutilitzant-la quan sigui possible, i comparar hashes/bytes de les dues descàrregues. Simular fallada de desament local, pujada i commit: cap finalització falsa ni revelació. Provar resposta perduda després d’èxit, commits repetits/incompatibles, dues finalitzacions simultànies, intent d’editar després d’acabar i recàrrega en espera/revelació. Comprovar que una sola finalització no exposa el resultat i que no es poden obtenir fitxers aliens alterant peticions. Provar que arribar al topall global amb base disponible no impedeix pintar, finalitzar, revelar ni descarregar. Comprovar desktop i adaptacions tàctils, errors simples en anglès i absència de secrets al bundle/logs. Registrar les limitacions reals, sense marcar comprovacions no executades.
  Learner check: Amb A i B en dos perfils, completar la ronda, acabar només amb A i comprovar l’espera privada. Acabar amb B, veure la mateixa obra completa i descarregar-la en tots dos. Recarregar abans i després de revelar, provar entrades incòmodes i revisar també el llenç en una finestra estreta. Explicar què ha passat i què es canviaria; després de les correccions acordades, tornar a provar les parts afectades i confirmar si la prova de concepte està preparada.
  Commit: `feat: reveal and download artwork after two valid finishes`

Comprovació mecànica del pas 1: typecheck, build, 10 proves de domini, 7 d’integració i 2 de navegador superades; dues generacions reals, cost total estimat de 0,013225 USD. Vegeu `verification.md`. Checkpoint manual rebut amb captures i correccions resoltes: un sol híbrid i fons amb moviment. Vegeu el registre de revisió a `verification.md`.

## Hands-on Checkpoints

- [x] Early usable behavior explored — després del pas 1, provar la sala real, meitats i recuperació i recollir comentaris sobre la il·lustració i el flux. En fast aquesta pausa és obligatòria; en learn ja forma part del check del pas.
- [x] Final kick-the-tires exploration and feedback completed — després del pas 3, l’usuari arrenca i prova el recorregut sencer, informa del que observa i torna a provar les correccions acordades. És el checkpoint de revisió final, no una prova separada duplicada.

En learn, també s’espera la prova de l’usuari a cada pas abans de registrar-lo complet. En fast, no hi ha una pausa intermèdia addicional per defecte; només si un problema o canvi important necessita una decisió. Cap cas permet saltar-se la verificació mecànica o els commits de cada pas.

Feedback real de la revisió final: primer l’usuari confirma cubell i pinzell. Després de demanar-li provar «Saved», recàrrega, espera amb un sol final, revelació i descàrrega en dos perfils a la mateixa sala, respon «Si tot funciona ja». S’accepta com a confirmació del tram complet, sense atribuir-li tests interns, captures o mesuraments addicionals.

## Final Review

- [x] Final review complete — feedback resolved and learner confirms ready to ship

Revisió del MVP inicial completada: l’usuari confirma que tot el tram sol·licitat funciona, després de provar les correccions de pintura. Les 29 proves mecàniques inicials i la ronda real de l’agent consten a `verification.md`; la confirmació manual és evidència separada. La casella global es va reobrir per a la iteració posterior i es torna a tancar amb la confirmació del 2026-10-23 registrada a continuació. Aquesta acceptació tanca la prova de concepte, sense autoritzar desplegament o candidatura.

### Iteració posterior sol·licitada el 2026-10-23

La revisió anterior continua registrada com a completada per al MVP inicial. Es reobre `5-build` per petició explícita; `6-ship` no s’inicia.

- [x] Home navegable i recuperació de la sala activa; nova sala només després de revelar, amb canvi segur i recuperable de credencial i sense reiniciar quota global.
- [x] Tres PNG revelats conservats i descarregables en aquest navegador, desament local honest i prova després de començar una sala nova.
- [x] Refinament visual segons la preferència que indiqui l’usuari; actualització del mapa i prova manual de les parts modificades abans de tancar la iteració.

Confirmació manual del 2026-10-23: després de demanar recarregar, tornar a Home des del resultat, trobar el PNG desat, començar una sala nova i valorar composició i moviment de fons, l’usuari respon «Funciona tot bé». Es tanca aquesta iteració; no s’atribueixen a l’usuari els tests interns ni comprovacions més detallades que no hagi relatat. `5-build` completat; `6-ship` no iniciat.

Verificació: typecheck/build i proves d’entrada i sessió afectades; dos contextos independents per tornar a home/reprendre, acabar, començar nova sala i unir-s’hi. Provar resposta perduda i entrada fallida sense perdre sala anterior, polling entre identitats, topall global compartit, històric de màxim tres sense duplicats i absència d’arxius abans de revelar. No fer una generació de pagament només per provar navegació o desament.

### Segona revisió de fons — 2026-10-23

Després de confirmar la iteració anterior, l’usuari demana més figures que es moguin contínuament entrant i sortint de pantalla. També pregunta per responsive i accessibilitat. Es reobre només aquesta revisió; les aprovacions i el mapa anteriors es conserven.

- [x] Figures addicionals amb bucles sense salts visibles, menor densitat al mòbil i decoració sense interacció; pausa manual i reducció de moviment del sistema respectades. Verificar recorreguts fora del viewport, persistència de pausa, control amb teclat i layouts 390/768/1440, typecheck/build i e2e afectats; obtenir comentari manual abans de tancar.

Feedback real: «Vale si surten figures però no es mouen, i surt nomes reduced motion enabled, però no deixa canviar-ho, a més si estas a dalt de tot de la pàgina no es veu el peu de pàgina». El sistema reduïa el moviment i el control desactivat impedia canviar-lo. S’ajusta a preferència inicial del sistema amb elecció explícita local i control a la capçalera sticky, també visible en desplaçar-se. La comprovació manual de la correcció continua pendent.

Feedback posterior: l’usuari confirma que ara funciona i demana que en pausar/activar es conservi la posició de les figures. S’elimina la substitució per una composició estàtica amb moviment reduït: es congela i reprèn la mateixa animació, incloent figures, xarxa i camps de color. La confirmació anterior valida l’activació, no aquesta correcció posterior; prova manual de continuïtat pendent.

Confirmació manual posterior: en resposta a la prova de seguir una figura, pausar i reprendre sense salt, l’usuari diu «Vale si, ja funciona». Es tanca la segona revisió del fons i la revisió global; les notes de pendent anteriors descriuen l’estat d’aquell moment. Sis e2e, typecheck i build superats. `5-build` completat; `6-ship` no iniciat.

## Code Tour and App Map

- [x] Learning activity complete — guided route, focused alternative, prior practice connected, or brief recap
- [x] Optional edit and transfer reflection addressed — offered/declined/already covered/not applicable as appropriate
- [x] `devpost/app-map.html` generated from finished code, checked, and shown, including a project-grounded practice to reuse

Activity and evidence: resum breu basat en un cas real del build, relacionat amb la crida d’imatges. La revisió de captures va detectar que una sola imatge contenia dos subjectes separats. L’usuari va concretar un sol híbrid; es va corregir el prompt i comprovar una generació real. S’ha explicat al xat la distinció entre `n: 1` i el contingut del prompt, on viatja l’autenticació i com es valida/retalla la resposta. És un resum tècnic, sense afirmar domini o aprenentatge personal no declarat.

Route and stops: ruta de referència al mapa — `server/generationService.ts > GenerationService.run`, `server/openaiImages.ts > imagePrompt / generateImage` i `server/imageService.ts > prepareImage`. Els noms i camins coincideixen amb el codi del commit `75fdcb1`. No s’ha fet un recorregut interactiu nou per l’editor ni s’atribueix a l’usuari.

Edit outcome: no aplicable a l’alternativa de resum escollida; no s’ha proposat un canvi cosmètic addicional. El cas reutilitzat és la correcció real del prompt després del feedback, amb comprovació registrada.

Reflection: pregunta de transferència opcional no plantejada; no és requisit de sign-off. No hi ha resposta personal a registrar ni text de candidatura redactat.

Activity mode: recap basat en evidència existent, dins del mode fast aprovat. El mapa complementa les revisions de planificació en Markdown; no és un acompanyant HTML de la checklist ni una pàgina de l’app.

Map and checks: `devpost/app-map.html`, mostrat amb enllaç al xat i instruccions per reobrir-lo com a fitxer local. Camins i ancoratges de codi comprovats. Chrome sense JavaScript i en mode offline, amplades 1440 i 390: contingut i desplegable natiu accessibles, sense peticions externes ni overflow. Captura estreta inspeccionada visualment. Sense dependències remotes, credencials, dades de participants o contingut personal.

## Revisions

- S’han agrupat les mutacions de sala en `hh_room_command` i la lectura en `hh_state`, mantenint els mateixos endpoints i comportaments previstos — evita duplicar validació i bloquejos SQL entre funcions gairebé iguals. La spec reflecteix els noms reals.
- S’accepta la clau de servei JWT antiga de Supabase, a més de `sb_secret_…` — la credencial local configurada és `service_role`, compatible segons la documentació oficial. Les claus públiques continuen denegades i cap credencial arriba al client.
- Abans d’una mutació, el client refresca la versió i comprova que la idea pròpia no hagi canviat — la prova en dos navegadors va detectar conflictes normals causats per actualitzacions de l’altre participant. Una carrera restant continua retornant conflicte, sense ignorar una edició acceptada.

- Primer checkpoint real: l’usuari ha provat les dues meitats i ha aportat captures de panda + drac. Demana poder pintar (pas 2), fusionar les idees en un sol subjecte i enriquir el fons amb moviment suau. S’actualitzen prompt, plans i atmosfera abans de continuar. No s’atribueixen a l’usuari proves de recuperació no reportades.

- Pas 2: editor implementat amb dades locals serialitzades i Web Locks; proves sobre base real reutilitzada. El cubell segueix les regions connectades: s’ha observat una obertura real i s’explica Undo/pinzell. El prompt de rondes noves es reforçarà sense substituir cap base activa.

- Pas 3: el PNG final viatja com a cos binari amb tres capçaleres, en lloc de multipart; conserva el contracte previst i evita afegir un parser de formularis. El servidor valida format/dimensions/límit i calcula hash.
- La prova de longitud ha detectat que quotes repetides podien superar el límit del prompt tot i ser idees vàlides. S’escurcen les regles i es normalitzen controls només al prompt; es conserven els textos originals de les idees. `hybrid-coloring-v3` reforça siluetes tancades i sense traços de pèl interromputs.

- El botó de desactivar generació ara també protegeix la recuperació de reserves després de reiniciar el servidor. Les reserves queden pendents mentre estigui desactivat; no s’envia cap petició de pagament. Prova d’integració específica afegida.

- Iteració 2026-10-23: el logo només recarregava i la cookie restaurava la sala, cosa que impedia obrir la home. L’usuari amplia explícitament l’abast amb nova sala després de la ronda i tres PNG locals. La preferència visual s’ha aclarit: aparença professional i moviment suau de fons com el referent MazeMind; implementació verificada i confirmada manualment.

- Verificació de la iteració: 30 proves passen i build/typecheck correctes. Home real comprovada a 1440/390 px, moviment observat, reducció de moviment estàtica, cap overflow ni errors de navegador i cap petició de nova sala/generació en obrir-la. La resposta posterior «Funciona tot bé» completa el checkpoint manual; els elements nous queden marcats.

---
doc: checklist
status: approved
---

# Half & Half — Build Checklist

Build mode: fast — triat explícitament per l’usuari: «Em va bé aquest mode ràpid, a sobre m’agrada testejar-ho i provar-ho». Ordre de construcció aprovat en aquesta resposta després de mostrar els tres passos. Es mantenen prova manual primerenca i revisió final, amb explicació pràctica de la crida a OpenAI.

Scope, PRD i spec estan aprovats. La resposta «Em sembla tot bé, podem seguir endevant» aprova la spec i autoritza passar a `5-build`; aquesta checklist recull l’ordre de construcció posteriorment revisat i aprovat per l’usuari. El primer increment està implementat i comprovat mecànicament; espera la prova i els comentaris de l’usuari abans de registrar-ne el commit i marcar-lo complet. Els altres dos increments encara no s’han iniciat. Cada pas ha de deixar una app executable, passar les seves comprovacions i quedar registrat en un commit abans de continuar.

En tots els passos: conservar el context original, excloure perfil i secrets, respectar els 7 USD de crèdits existents i 0 USD addicionals, sense desplegar ni publicar la candidatura. Les proves sintètiques s’identifiquen com a tests i no substitueixen l’evidència de generació real. No donar per configurats els comptes, el saldo, les quotes o els permisos.

## Slices

- [ ] **1. Dues persones entren amb codi i obtenen les seves meitats d’una generació real**
  Becomes usable: App local on A crea sala i B hi entra amb codi, cadascú confirma una idea i tots dos reben només la seva meitat d’una única il·lustració real. Les idees es revelen quan apareix la base; una recàrrega conserva plaça, fase i generació. Encara no hi ha editor ni botons de finalització sense implementar.
  Why now: Demostra aviat la integració que l’usuari vol aprendre i els riscos principals de cost, unicitat, sincronització i tall. La configuració inicial queda dins d’aquest comportament usable; no es construeixen capes desconnectades esperant integrar-les al final. Validar els contorns de la primera mostra abans de desenvolupar tot l’editor.
  PRD ref: `prd.md > The Core Journey` (passos 1–5), `Entrada amb codi curt`, `Escriure i confirmar les idees`, `Generació i recuperació de la ronda`, `Errors de generació i intents limitats`, `Topall global de generació de la demo`, `Dibuix compartit i visibilitat`.
  Spec ref: `spec.md > Home, sala i identitat sense registre`, `Idees, confirmacions i estat compartit`, `Coordinador de generació única`, `Preparació de base i tall exacte`, `OpenAI: petició, prompt i resposta`, `Pressupost i límits`, `Supabase: dades, arxius i permisos`, `Where It Runs and How Someone Tries It`, `Look and Feel`, `File Structure`.
  Build: Incloure bootstrap React/TypeScript/Vite + Node/Express, scripts reals i configuració sense secrets; aplicar la direcció visual aprovada des de la primera pantalla. Identificar projecte Supabase i permisos abans de modificar-lo i preparar esquema, funcions i bucket privats reproduïbles. Implementar cookie i ocupació atòmica, idees amb doble confirmació/edició, versions, consulta d’estat, reserva persistent de comptadors, claim únic, crida fetch sense reintents automàtics, tractament d’errors definitius/incerts, persistència de l’original, base 1024² i retall 512 × 1024. Completar la comprovació de facturació/model abans de la primera petició real; si falta informació, demanar només la necessària sense exposar secrets. Escriure la primera funció de regions i una comprovació executable de pintabilitat de la mostra per descobrir limitacions del cubell ara. Documentar arrencada real i seguir amb l’usuari el camí idees → petició del servidor → base64 → PNG, sense registrar ni mostrar claus.
  Verify (mechanical): Executar `npm run typecheck`, `npm test`, `npm run test:integration`, `npm run build` i la prova e2e d’aquesta fase amb `npm run test:e2e`. Comprovar que `npm run dev` i `npm start` arrenquen tal com diu el README i serveixen el frontend. En dos contextos de navegador independents, crear/unir/confirmar, recarregar durant generació i verificar una sola petició per intent, mateixa base, idees mostrades al moment correcte i només la meitat pròpia. Fer almenys una generació real dins del pressupost després del preflight i registrar cost disponible i qualitat observada; inspeccionar contorns i provar regions sobre la mostra sense una segona crida innecessària. Verificar reconstrucció exacta de les meitats pixel a pixel. Amb tests deterministes provar confirmació/edició simultànies, reintents, intents globals i per ronda, restart amb resposta perduda i denegacions d’accés amb token/costat alterat o clau pública. Inspeccionar bundle i respostes per detectar secrets, originals complets o dades alienes. Un servei simulat no acredita la integració real ni permet marcar aquest pas complet si falten els accessos.
  Learner check: Amb les ordres reals del README, obrir dos perfils separats, crear una sala i entrar amb el codi, confirmar idees diferents i observar que cada perfil mostra només la seva meitat. Recarregar un perfil i comprovar que no canvia el costat ni es torna a generar. Per evitar un càrrec extra, aprofitar la primera sessió real de verificació quan sigui possible. Explicar què s’observa de la combinació, el format per pintar i la claredat de l’entrada; podem ajustar-ho abans de construir l’editor.
  Commit: `feat: add shared image generation with private room halves`

- [ ] **2. Cadascú pinta la seva meitat i recupera els colors en recarregar**
  Becomes usable: Cada participant pot pintar amb cubell o pinzell, triar colors, ajustar gruix, desfer i netejar només la seva pintura. Després de «Saved on this device», recarregar recupera els colors propis. L’altra sessió no veu cap traç; encara no es presenta una revelació o finalització simulada.
  Why now: Construeix sobre una base real i immutable, i comprova la segona part del nucli abans d’afegir la revelació. La mostra i els comentaris del primer pas permeten corregir el format del dibuix abans de dependre’n. Persistir cada acció forma part del comportament de pintar des del principi.
  PRD ref: `prd.md > The Core Journey` (pas 6), `Pintar i corregir`, `Desament automàtic de la pintura pròpia`, `Dibuix compartit i visibilitat`, `Prioritat de dispositius`, `Look and Feel`.
  Spec ref: `spec.md > Editor amb pinzell, cubell i correcció`, `Desament automàtic i recuperació pròpia`, `Preparació de base i tall exacte`, `Descàrrega i protecció de dades`, `Look and Feel`, `Verification Plan`.
  Build: Implementar capes blanc/colors/contorns, coordenades fixes, Pointer Events, pinzell interpolat i cubell per regions de la base dins de la meitat; marge central com a límit. Afegir cercles de colors i selector amb degradat, barra de gruix amb mostra circular, una instantània d’Undo i confirmació de Clear. Implementar IndexedDB serialitzat, guardat després d’accions i checkpoints de traços llargs, revisions i estats de desament fidels. Restaurar només dades compatibles amb la sala/base/costat; protegir contra dos editors del mateix participant en pestanyes. Adaptar eines i llenç a desktop, després mòbil i tauleta, sense reduir requisits de privacitat ni retirar el cubell. Si els contorns reals requereixen un canvi de comportament o arquitectura, discutir-lo i actualitzar els plans abans de continuar.
  Verify (mechanical): Executar typecheck, tests de domini d’editor/regions/historial, proves d’integració afectades, `npm run build` i e2e de pintura/desament. En dues sessions, pintar colors diferents i comprovar per píxels i xarxa que no s’envia pintura a l’altra. Provar cubell sobre regions tancades, obertes i que travessen el centre; el pinzell al marge, a diferents escales i amb touch no modifica base o costat aliè. Desar, recarregar i comparar píxels després de pinzell, fill, Undo i Clear; simular escriptures lentes/fallides i verificar que no es mostra un èxit fals ni ressuscita una revisió anterior. Provar dues pestanyes del mateix participant i la recuperació del bloqueig amb dades actualitzades. Verificar controls amb teclat i mides desktop 1440/1024, mòbil 390 i tauleta 768; distingir emulació de dispositiu real. Reutilitzar la mostra real desada del primer pas, sense generar de nou per a cada test.
  Learner check: Obrir la sala existent en els dos perfils, pintar amb cubell i pinzell, canviar color i gruix, desfer i netejar. Esperar «Saved on this device», recarregar i comprovar que els colors tornen. Confirmar que les eines s’entenen i que cap perfil permet veure com pinta l’altre. En learn, fer aquesta prova abans del commit; en fast, l’agent la verifica i l’usuari la provarà al recorregut final, tret que aparegui una incertesa que necessiti comentaris abans.
  Commit: `feat: add private painting with persistent browser drafts`

- [ ] **3. Dues finalitzacions desades revelen la mateixa obra i permeten descarregar-la**
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
- [ ] Final kick-the-tires exploration and feedback completed — després del pas 3, l’usuari arrenca i prova el recorregut sencer, informa del que observa i torna a provar les correccions acordades. És el checkpoint de revisió final, no una prova separada duplicada.

En learn, també s’espera la prova de l’usuari a cada pas abans de registrar-lo complet. En fast, no hi ha una pausa intermèdia addicional per defecte; només si un problema o canvi important necessita una decisió. Cap cas permet saltar-se la verificació mecànica o els commits de cada pas.

## Final Review

- [ ] Final review complete — feedback resolved and learner confirms ready to ship

Encara no hi ha app per revisar ni comentaris d’ús recollits. Aquí s’afegiran només correccions o refinaments acordats com a tasques no marcades, amb verificació, commit i nova prova de l’usuari abans de completar-les. No inventar ajustos si l’usuari confirma que no en calen.

## Code Tour and App Map

- [ ] Learning activity complete — guided route, focused alternative, prior practice connected, or brief recap
- [ ] Optional edit and transfer reflection addressed — offered/declined/already covered/not applicable as appropriate
- [ ] `devpost/app-map.html` generated from finished code, checked, and shown, including a project-grounded practice to reuse

Activity and evidence: pendent. Proposta centrada en l’objectiu declarat: seguir una petició real d’imatges i relacionar el prompt, l’autenticació al servidor, la resposta i la reserva de cost amb l’evidència registrada durant el build. La pràctica ja feta durant la construcció compta i no s’ha de repetir com un examen.

Route and stops: pendents de codi real; es preveu seguir els contractes de `server/generationService.ts`, `server/openaiImages.ts` i `server/imageService.ts`, sense afirmar que existeixen encara. Ajustar les rutes a la implementació acabada.

Edit outcome: encara no proposat ni executat; una edició pràctica és opcional, no una aprovació addicional.

Reflection: encara no oferta. La resposta personal, si n’hi ha, queda al perfil local ignorat, no en aquest fitxer públic ni al mapa.

Activity mode: pendent; per l’experiència de planificació declarada, una investigació breu sobre la crida real pot ser més útil que un recorregut genèric de tot el codi. El mapa del pack es farà a partir de l’app acabada; no és un acompanyant HTML d’aquesta checklist, que continua en Markdown.

## Revisions

- S’han agrupat les mutacions de sala en `hh_room_command` i la lectura en `hh_state`, mantenint els mateixos endpoints i comportaments previstos — evita duplicar validació i bloquejos SQL entre funcions gairebé iguals. La spec reflecteix els noms reals.
- S’accepta la clau de servei JWT antiga de Supabase, a més de `sb_secret_…` — la credencial local configurada és `service_role`, compatible segons la documentació oficial. Les claus públiques continuen denegades i cap credencial arriba al client.
- Abans d’una mutació, el client refresca la versió i comprova que la idea pròpia no hagi canviat — la prova en dos navegadors va detectar conflictes normals causats per actualitzacions de l’altre participant. Una carrera restant continua retornant conflicte, sense ignorar una edició acceptada.

- Primer checkpoint real: l’usuari ha provat les dues meitats i ha aportat captures de panda + drac. Demana poder pintar (pas 2), fusionar les idees en un sol subjecte i enriquir el fons amb moviment suau. S’actualitzen prompt, plans i atmosfera abans de continuar. No s’atribueixen a l’usuari proves de recuperació no reportades.

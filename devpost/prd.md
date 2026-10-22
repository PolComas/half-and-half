---
doc: prd
status: draft
---

# Half & Half — Requisits de producte

Activitat creativa per a parelles, incloses les que estan a distància: dues idees, una il·lustració i dues meitats pintades per separat abans de descobrir el resultat compartit.

Versió per a revisió de `3-prd`, basada en l’entrevista real i en `scope.md > The Unique Kernel`, `The Core Loop` i `The POC Boundary`. Les preguntes de producte s’han resolt; l’usuari encara ha de revisar i aprovar el document complet, incloses les concrecions d’intents i controls de correcció que s’indiquen com a propostes. L’estat continua sent `draft`. Les recomanacions del context no es converteixen en decisions de producte per aparèixer-hi.

## The Core Journey

Font: `scope.md > The Core Loop` i `What "Working" Looks Like`.

1. La persona obre una home neta que explica breument l’activitat i permet crear una sala o entrar-hi amb un codi curt. No cal compte.
2. Qui crea la sala obté el codi i pinta l’esquerra; la segona persona l’introdueix des de la seva sessió i pinta la dreta. La ronda és per a dues persones, amb assignació fixa de costats.
3. Cada persona escriu la seva idea en text lliure, prem «Confirm idea» i fa una segona confirmació de la idea pròpia. Abans de començar la generació, «Edit» permet modificar-la retirant la confirmació pròpia; cal confirmar-la de nou. No es pot confirmar text buit. Si una aportació no és interpretable, el prompt dona llibertat creativa per inventar un objecte estrany i combinar-lo amb l’altra aportació.
4. Amb totes dues idees confirmades s’inicia una única generació compartida, enviant-les juntes a l’API de generació d’imatges. Totes dues persones veuen «Your drawing is being generated. Please wait.». Recarregar la pàgina ha de recuperar aquesta mateixa ronda i generació, sense duplicar-la.
5. Quan apareix la imatge, es mostren les dues idees. Des d’aquest primer moment cadascú només veu el seu 50% del dibuix; no hi ha vista completa inicial.
6. Cadascú pinta la seva meitat amb cubell o pinzell i pot desfer o netejar la pintura pròpia, conservant el dibuix base. La pintura es desa automàticament abans d’acabar, perquè es pugui recuperar en recarregar la mateixa sessió.
7. Cada persona prem «I’m done» i confirma que vol tancar la seva pintura. Només després d’un desament correcte es confirma la finalització i es bloqueja l’edició per a aquesta ronda. Qui acaba primer pot mirar la seva meitat desada mentre espera, sense veure el resultat complet.
8. Amb dues finalitzacions vàlides de la mateixa ronda, totes dues sessions veuen la mateixa obra completa i poden descarregar-la. No hi ha galeria.

## Screens and Layout

Superfícies conegudes del recorregut; no impliquen una pàgina separada per a cada estat:

- **Home:** informació breu de Half & Half, acció principal per crear sala i entrada per codi curt. L’usuari ha acceptat aquesta proposta d’inici. No s’ha definit cap opció concreta de configuració.
- **Sala i idees:** codi per comunicar a l’altra persona, entrada de text per a la idea pròpia, botó «Confirm idea» i segona confirmació. No es confirma una entrada buida. El text no interpretable activa la llibertat creativa prevista al prompt. Presentació exacta dels controls pendent.
- **Generació:** missatge «Your drawing is being generated. Please wait.» per a totes dues persones, sense percentatges inventats. En cas d’error confirmat, explicació senzilla i recuperació amb intents limitats o edició de les idees; cap error tècnic cru com a missatge principal.
- **Pintura:** meitat pròpia com a element central, dues idees visibles, cercles de colors predefinits, selector de color amb degradat, cubell, pinzell, barra horitzontal de gruix amb previsualització circular, desfer, netejar i acció per acabar. Distribució pensada primer per a ordinador; la col·locació exacta dels controls encara s’ha de concretar.
- **Espera final:** la meitat pròpia desada es pot mirar sense editar-la, amb el missatge «Your half is saved. Waiting for your partner.». No s’ensenya pintura aliena ni el resultat complet. No s’afegeix un altre editor o activitat mentre s’espera.
- **Revelació:** obra completa i acció per descarregar-la, disponible després de dues finalitzacions vàlides.

### Prioritat de dispositius

Ordre indicat explícitament per l’usuari: **ordinador → mòbil → tauleta**. La primera experiència de pintura que es dissenya i valida és la d’ordinador, amb cubell, pinzell i controls de correcció accessibles. Les adaptacions a mòbil i tauleta segueixen aquest ordre i han de conservar el mateix recorregut, costat assignat, tall al 50% i privacitat.

Aquesta priorització no elimina automàticament mòbil o tauleta de l’abast ni incorpora aplicacions natives. La spec ha de concretar el suport i les comprovacions de cada entorn sense desplaçar la ronda completa de dues persones a l’ordinador.

## Look and Feel

Font: `scope.md > Inspiration & Identity`, concretada per les respostes de l’usuari.

- Interfície en anglès: textos, botons, confirmacions, estat de desament i errors. La conversa de treball i la documentació de planificació continuen en català. No es demana selector d’idioma ni funcionalitat multilingüe.
- Home neta, minimalista i maca, amb informació breu.
- Direcció de taller creatiu acceptada: fons clar amb toc de paper, espai generós, tipografia cuidada i color concentrat en la il·lustració. No hi ha encara paleta ni font concreta seleccionades.
- Es vol explorar una il·lustració generada pròpia per donar personalitat a la home. Cap asset concret creat o escollit; l’exemple de la home no és la generació de la ronda.
- Il·lustració de la ronda en blanc i negre, típica d’un llibre per pintar. El prompt haurà de combinar les idees i afavorir zones pintables. Cap prompt definitiu ni qualitat de resultat s’han provat encara.

## Features and Behavior

### Entrada amb codi curt

Font: `scope.md > The POC Boundary`, concretada durant l’entrevista.

No cal registre ni inici de sessió. Crear una sala dona un codi curt, que l’altra persona pot comunicar i escriure sense enviar-se un enllaç. El codi és la via principal; un enllaç addicional no està acordat.

En aquesta primera versió, qui crea la sala té l’esquerra i qui s’hi uneix té la dreta. No s’afegeix una elecció manual de costat. Aquesta assignació s’ha de mantenir durant tota la ronda, també en recarregar la mateixa sessió.

Criteri: dues sessions independents entren a la mateixa ronda mitjançant el codi, sense compartir una sessió de navegador ni ocupar una tercera plaça. Una recàrrega no ocupa una plaça nova ni canvia el costat. Format i caducitat del codi pendents de spec; no s’ha demanat traslladar una plaça a un altre dispositiu.

### Escriure i confirmar les idees

Font: `scope.md > The Core Loop`, concretada durant l’entrevista.

Cada persona introdueix una idea en text lliure i la confirma en dos passos. La segona confirmació revisa la idea pròpia; no anticipa la revelació de l’aportació de l’altra persona. «Confirm idea» és l’etiqueta anglesa de treball per al botó; la segona confirmació també serà en anglès.

Mentre no hagi començat la generació, una idea confirmada mostra «Edit». Activar-lo retira la confirmació d’aquella persona i torna el text propi a edició; la idea de l’altra persona manté el seu estat. Cal repetir la confirmació després d’editar. Durant aquesta edició ja no hi ha dues idees confirmades i no es pot iniciar la generació. Les idees que s’estan generant o ja s’estan pintant no es poden canviar. Si la generació falla, es permet tornar a editar les aportacions pròpies i tornar-les a confirmar, dins del mateix límit d’intents de la ronda.

Una entrada buida, inclòs text format només per espais, no pot quedar confirmada ni iniciar generació. Per a text no buit però incomprensible, com una seqüència aleatòria de lletres, l’usuari ha definit una alternativa creativa: el prompt dona llibertat per inventar un objecte especialment estrany o original i combinar-lo amb l’altra idea, mantenint una sola escena en blanc i negre pintable. Aquest cas no s’ha de tractar com si fos text buit ni exigeix que la persona reformuli l’aportació.

La regla orienta la generació; no pressuposa una classificació semàntica perfecta ni un resultat determinista. Una idea surrealista que sí que es pot interpretar s’ha de respectar. Les dues aportacions originals es conserven com a text i es mostren en el moment acordat; no s’inventa una nova aportació atribuïda a la persona. Encara no s’ha redactat ni provat el prompt definitiu.

Criteris coneguts: no hi ha confirmació de text buit; el text propi es pot revisar en el segon pas; una única persona llesta no basta per generar la composició de dues aportacions. Si s’accepta «Edit», la confirmació pròpia queda retirada i no es genera amb una idea que s’està modificant, tampoc quan l’altra persona confirma gairebé alhora. Amb totes dues idees confirmades comença la generació, sense un botó addicional. Provar visualment una combinació amb una idea comprensible i una seqüència de lletres per comprovar la resposta creativa i el format pintable.

### Generació i recuperació de la ronda

Font: `scope.md > What "Working" Looks Like`, concretada per la petició de no perdre la sincronització en recarregar.

S’envien totes dues idees juntes per obtenir una sola imatge comuna; les dues persones veuen el mateix estat d’espera. No són dues generacions independents. La referència de l’usuari a «ChatGPT per API» es recull com a generació d’imatges via API; model, crida i arquitectura es decidiran a la spec.

Si algú recarrega, recupera la mateixa sala, plaça, costat i fase, així com les idees confirmades i la generació que ja s’està fent o ha acabat. Si torna durant l’espera final o després de revelar, veu l’estat real de la mateixa ronda. No es creen una ronda nova, una tercera plaça o una generació addicional per la recàrrega. Desconnectar-se no equival a acabar ni permet saltar-se les dues finalitzacions vàlides.

Criteris: en dues sessions independents, recarregar A mentre B espera manté una única generació; si la imatge acaba durant la recàrrega, A arriba a la pintura de la mateixa base; recarregar després d’una finalització manté el bloqueig ja confirmat; recarregar després de dues finalitzacions vàlides mostra el mateix resultat. Durant la pintura es recupera la versió pròpia desada automàticament, sense haver de prémer «I’m done». Retenció i mecanismes de recuperació pendents de spec.

### Errors de generació i intents limitats

Font: `scope.md > What "Working" Looks Like`, concretada per la petició de repetir com a màxim «2 o 3 cops», explicar l’error sense tecnicismes i permetre idees diferents.

Un error confirmat de generació mostra una explicació breu i senzilla i els intents disponibles. Les dues persones poden tornar-ho a provar amb les idees confirmades o editar les aportacions pròpies; qualsevol idea editada ha de confirmar-se de nou abans del nou intent. No es mostra prematurament el text de l’altra persona en un missatge d’error o durant l’edició.

Concreció proposada en aquest esborrany, dins del rang indicat per l’usuari: **3 intents totals per ronda**, l’inicial i un màxim de **2 reintents**. El límit és compartit, no per persona. Canviar les idees o recarregar no reinicia el comptador. Sense intents disponibles no es permet una altra generació d’aquesta ronda i s’explica que s’han esgotat; no s’afegeixen noves rondes automàtiques per esquivar-lo.

Exemples de text d’interfície: «We couldn’t create your drawing. Try again or edit your ideas. 2 attempts left.» i «There are no attempts left for this round.» S’han d’adaptar a l’estat real; no s’inventa la causa de l’error. La interfície serà en anglès, segons la decisió de l’usuari. El redactat es pot polir sense canviar-ne el comportament.

Criteris: dos clics o reintents simultanis no creen dos intents nous; només hi ha una generació activa alhora; el comptador persisteix en recarregar i en editar idees; assolir el màxim impedeix noves peticions d’aquesta ronda. Una pèrdua de connexió per si sola no prova que la generació hagi fallat: primer cal recuperar l’estat compartit, sense reintentar cegament una generació que continua activa. No es regenera una base que ja s’està pintant.

### Topall global de generació de la demo

Font: `scope.md > The POC Boundary`, concretada amb l’acceptació explícita del control mínim de despesa durant l’entrevista.

S’ajornen les quotes diàries per persona. La primera versió inclou un topall global de peticions de generació de la demo, compartit entre totes les sales i comptant tant intents inicials com reintents. Crear una sala nova o recarregar no reinicia aquest topall. La xifra es decidirà a la spec segons el model i el pressupost de l’usuari; encara no s’ha configurat cap límit real.

En arribar-hi, no s’inicien generacions noves, encara que a una ronda li quedin intents propis. Es mostra un missatge senzill en anglès, com «The demo has reached its drawing limit. New drawings are unavailable for now.» Qui ja té dibuix pot continuar pintant, desar, acabar, revelar i descarregar. Una generació que ja estava en curs no es duplica ni es reinicia per aquest missatge.

Criteris: el topall s’aplica al conjunt de sales, sense duplicar permisos per dues peticions simultànies; els reintents hi compten; no es pot esquivar amb una sala nova; pintar i completar una ronda amb base ja disponible continua funcionant després d’assolir-lo. Política de retenció, reinici autoritzat del topall i mecanisme de control es concretaran a la spec.

### Dibuix compartit i visibilitat

Font: `scope.md > The Unique Kernel`, `The Core Loop` i `What "Working" Looks Like`.

Una il·lustració comuna combina les dues idees. Tall vertical exacte al 50%: una meitat esquerra i una dreta. Les idees es mostren quan apareix el dibuix. Abans i durant la pintura, cada persona només veu la seva meitat i mai la pintura de l’altra.

Criteris: una sola generació compartida activa alhora i una única base comuna per pintar; cap vista completa inicial; cap canvi de base mentre es pinta; tall sense buit ni solapament; protecció de la pintura aliena fins a la revelació. Les idees es poden editar abans de generar o després d’un error confirmat, mai mentre es genera o pinta. Els reintents de generació fallida tenen el límit descrit a «Errors de generació i intents limitats».

### Pintar i corregir

Font: `scope.md > The Core Loop`, concretada per petició expressa de totes dues eines.

Cubell per omplir regions tancades i pinzell per pintar a mà, amb color seleccionable. Desfer i netejar afecten només la pintura pròpia i conserven el dibuix base.

Controls definits per l’usuari:

- Paleta de cercles de colors predefinits i selector amb degradat per triar altres tons. El degradat s’interpreta com a selector de color; no s’ha demanat pintar traços multicolor. Es mostra quin color està seleccionat i el fan servir tant el cubell com el pinzell.
- Barra horitzontal per ajustar el gruix del pinzell. Una previsualització circular es fa més gran o més petita amb la barra. El gruix no afecta el cubell ni modifica allò ja pintat. Colors predefinits exactes i rang de gruixos es concretaran a la spec.

Concrecions de correcció proposades per l’agent, pendents de validar en la revisió del PRD: «Undo» desfà l’última acció de pintura completada (un traç, un ompliment o una neteja); «Clear colors» demana confirmació abans de treure la pintura pròpia. Cancel·lar conserva el que hi havia; confirmar deixa el dibuix base intacte i registra el canvi per al desament automàtic. Aquestes propostes concreten els controls ja demanats per l’usuari, sense afegir eines noves.

Criteris: triar un cercle o un color del selector actualitza el color utilitzat per totes dues eines; moure la barra actualitza el gruix i la previsualització, però no els traços anteriors. Tant el cubell com el pinzell queden dins de la meitat assignada, també quan una regió continua més enllà del centre; el dibuix base i l’altra meitat no canvien. Cal provar imatges generades reals: demanar contorns tancats al prompt no garanteix que cada regió es pugui omplir sense problemes. Una retirada del cubell requeriria revisar el requisit amb l’usuari.

### Desament automàtic de la pintura pròpia

Font: `scope.md > What "Working" Looks Like`, ampliada per la petició explícita de recuperar allò pintat abans de prémer «I’m done».

L’objectiu expressat per l’usuari és conservar tot el que ja havia pintat en recarregar la mateixa sessió. Ha suggerit desar al navegador cada segon o cada cert temps; mecanisme i freqüència exactes no estan triats. El desament automàtic forma part de la primera versió i no marca la persona com a acabada.

La interfície ha de distingir entre canvis encara pendents de desar, versió desada i error de desament. No ha de presentar com a desat allò que encara no s’ha confirmat. La recuperació ha de reflectir l’estat actual de la pintura pròpia, incloent ompliments, pinzell, desfer i netejar, associat a la mateixa ronda, base i costat. No recupera colors aliens ni permet saltar-se una finalització ja confirmada.

Criteris: fer diverses accions, esperar la confirmació de desament i recarregar abans d’acabar ha de restaurar la mateixa pintura; repetir després de desfer o netejar no ha de ressuscitar una versió anterior. Un error de desament no pot mostrar confirmació d’èxit. Amb la segona sessió oberta, aquesta recuperació no duplica la ronda ni exposa pintura aliena.

L’objectiu de conservar-ho tot no és una garantia de persistir un canvi que encara s’està desant si el navegador es tanca sobtadament. La spec ha de definir i explicar aquesta frontera i investigar una freqüència de desament que minimitzi la finestra de pèrdua. No s’ha promès recuperació després d’esborrar les dades del navegador ni en un altre dispositiu. La recuperació local no substitueix el desament i validació finals necessaris per revelar l’obra a totes dues persones.

### Acabar, esperar i revelar

Font: `scope.md > What "Working" Looks Like`.

«I’m done» demana confirmació i explica que la pintura quedarà tancada. Cancel·lar aquesta confirmació deixa la persona pintant. Confirmar-la inicia el desament: no es confirma que ha acabat ni es bloqueja definitivament l’edició fins que la seva versió s’ha desat correctament. Després queda tancada per a aquesta ronda; qui acaba primer pot contemplar només la seva meitat desada amb el missatge d’espera.

La revelació exigeix dues versions finals vàlides de participants diferents, de la mateixa ronda i il·lustració base. No s’inclou llenç lliure ni pintura de predicció durant l’espera.

Criteris: la primera finalització no revela res de l’altra pintura; un error de desament no compta com a finalització i permet recuperar el desament sense perdre la pintura; la versió final desada ja no es pot modificar; repeticions de l’acció no compten com una segona persona; finalitzacions gairebé simultànies donen el mateix resultat complet a les dues sessions. Una recàrrega manté les finalitzacions ja confirmades i recupera la pintura pròpia desada automàticament si encara estava en edició.

### Descarregar el resultat

Font: `scope.md > The POC Boundary`, actualitzada per la petició posterior explícita de l’usuari.

Després de la revelació, cadascú pot descarregar l’obra completa. L’arxiu correspon al resultat compartit, amb les dues meitats alineades i el dibuix base. La descàrrega completa no pot anticipar la revelació. No s’afegeix galeria ni publicació automàtica. Format del fitxer pendent de la spec.

## States and Boundaries

- **Falta la segona persona o una idea:** no es pot generar la composició de dues aportacions encara. Missatges i controls concrets pendents.
- **Generació en curs:** totes dues idees s’han enviat juntes; es mostra el missatge d’espera. Una recàrrega recupera aquesta mateixa generació.
- **Generació fallida:** explicació senzilla, intents restants i possibilitat de reintentar o canviar idees dins del mateix límit; no es pot pintar una base absent.
- **Intents esgotats:** s’explica que no es pot generar més en aquesta ronda; no es reinicia el comptador per recarregar o modificar idees.
- **Pintura:** només la meitat pròpia; cap previsualització completa ni pintura aliena.
- **Desament fallit:** no es confirma el final ni s’activa la revelació.
- **Una persona acabada:** pintura desada i bloquejada; pot mirar només la seva meitat fins a la revelació, sense retornar a edició ni iniciar una activitat addicional.
- **Dues finalitzacions vàlides:** revelació coherent i descàrrega habilitada.
- **Recarregar o reconnectar la mateixa sessió:** recuperar sala, plaça, fase reals i pintura pròpia desada automàticament, sense duplicar generació ni finalitzacions. No inventar finalitzacions per desconnexió o abandonament.
- **Desament automàtic pendent o fallit:** indicar-lo fidelment; no afirmar que els canvis estan desats ni marcar la persona com a acabada.
- **Cost de generació:** l’usuari ha acceptat ajornar les quotes diàries individuals i incloure un topall global de la demo que compta intents i reintents. Assolir-lo bloqueja generacions noves, sense impedir acabar rondes amb dibuix disponible. La xifra global i el pressupost es decidiran a la spec. L’esborrany proposa 3 intents totals per ronda; encara no s’ha configurat cap límit real.

## Product Decisions

Confirmades durant l’entrevista:

- Interfície en anglès, escollida per l’usuari per arribar a un públic internacional. Els exemples d’interfície anteriors en català s’han adaptat; l’idioma de treball continua sent el català.
- Prioritat de dispositius: ordinador, després mòbil i finalment tauleta; validar primer la pintura a l’ordinador.
- Inici sense compte, amb crear sala i codi curt com a via principal d’entrada; l’usuari vol poder comunicar-lo fàcilment des d’ordinadors.
- Assignació fixa: creador de sala a l’esquerra, persona que s’uneix a la dreta. L’usuari ha proposat aquest repartiment i ha considerat poc important l’elecció manual alternativa; s’adopta el repartiment simple per a la primera versió.
- Idea en text lliure amb botó «Confirm idea» i segona confirmació de la idea pròpia. Les entrades buides no s’accepten. Si una aportació no buida no s’entén, l’usuari vol que el prompt permeti inventar un objecte estrany i creatiu per combinar-lo amb l’altra idea.
- «Edit» després de confirmar retira la confirmació pròpia i permet canviar el text abans de generar. Cal confirmar-lo de nou; la confirmació de l’altra persona no es retira.
- Amb totes dues idees confirmades s’envien juntes a l’API per a una única generació. Durant l’espera es mostra «Your drawing is being generated. Please wait.», adaptació a l’anglès del text proposat per l’usuari.
- Recarregar ha de recuperar la mateixa sala, participant i estat compartit, sense desincronitzar les dues persones ni tornar a generar. L’usuari ha demanat recuperar també tot el que ja havia pintat, abans d’acabar; s’inclou desament automàtic amb freqüència i mecanisme pendents de spec, sense prometre persistència de canvis encara no desats.
- En un error de generació, reintents limitats, explicació senzilla i possibilitat de canviar les idees. L’usuari ha indicat «2 o 3 cops»; la concreció d’esborrany a revisar és 3 intents totals per ronda, sense reiniciar el comptador per canviar idees.
- Quotes diàries individuals ajornades i topall global de generacions de la demo acceptat explícitament. Inclou intents inicials i reintents de totes les sales; assolir-lo atura generacions noves, però permet acabar les rondes que ja tenen dibuix. Xifra i pressupost pendents de spec.
- Direcció visual neta i minimalista, amb aire de taller creatiu i interès per imatges generades pròpies.
- Imatge de ronda en blanc i negre amb estil de llibre per pintar.
- Cubell i pinzell dins de la primera versió, més desfer i netejar.
- Paleta de cercles de colors i selector amb degradat; barra horitzontal per fer més gran o petita la previsualització circular del pinzell i el seu gruix. Colors exactes i rang de mida pendents de spec.
- Veure només el 50% propi des de l’aparició del dibuix, també abans del primer traç; cap vista completa inicial.
- Descàrrega de l’obra final dins de la primera versió; la galeria continua fora. És una modificació explícita de l’ajornament inicial de l’exportació al scope.
- Confirmar «I’m done», desar correctament i després bloquejar la pintura per a la ronda. Durant l’espera només es contempla la meitat pròpia desada. L’usuari ha acceptat explícitament aquesta recomanació després d’explorar altres possibles activitats; no s’hi afegeix un segon editor.

Les quatre regles del nucli ja estaven acordades abans de l’entrevista. La revisió del PRD ha de validar la concreció numèrica dels intents i les propostes d’«Undo» i confirmació de «Clear colors». El control global de cost ja està acceptat; la spec en concretarà la xifra, així com la persistència de la pintura i la frontera observable del desament automàtic.

## What We're Building

Una ronda completa de dues persones en sessions independents: entrada amb codi, una idea cadascú, una generació real comuna, pintura privada de meitats amb les eines acordades, desament vàlid, espera, doble finalització, revelació i descàrrega.

## Deferred From the POC

Font: `scope.md > Later` i `Explicitly Cut`.

Mode individual i rondes addicionals: es prioritza completar la ronda compartida. Galeria, xarxa social, xat, videotrucada, pagaments i gamificació queden fora perquè afegeixen recorreguts independents. Les quotes diàries per persona s’ajornen per acord explícit; es manté el topall global de generació de la demo.

Elecció manual del costat: alternativa explorada però poc important segons l’usuari; el repartiment fix evita afegir un pas a l’entrada.

## Possible Later Enhancements

Iterar sobre el nucli si hi ha temps després que funcioni. Els extres ajornats no són compromisos de la primera versió; qualsevol incorporació nova s’ha de fer explícita.

## Non-Goals

No demostrar la integració d’IA amb una imatge fixa presentada com si s’hagués generat en directe. No convertir la descàrrega en una galeria ni en compartició pública automàtica. No afegir arquitectura o funcionalitats de comptes sense una decisió nova.

## Open Questions

No queden preguntes de producte imprescindibles sense resposta per preparar aquesta revisió. Això no equival a una aprovació del PRD complet.

La revisió ha de validar la concreció de **3 intents totals per ronda** dins del rang de reintents indicat per l’usuari, **«Undo» per última acció completa** i la **confirmació de «Clear colors»**. Aquestes propostes s’han mostrat com a tals, no com a decisions prèvies de l’usuari.

Pendents tècnics per a `4-spec`, abans de fixar arquitectura: on s’executarà la demo, tecnologia i eines, model i accés real a l’API, pressupost i topall global numèric, format/caducitat del codi, credencials de participant, retenció, desament i recuperació de pintura, límits i representació dels colors/traços, dimensions i tall exacte, ompliment de regions i format de descàrrega. Cal comprovar les incerteses tècniques rellevants, no donar-les per resoltes per haver escrit aquest PRD.

Encara no s’ha triat arquitectura ni s’ha implementat l’app. La generació, la recuperació, els permisos i els límits descrits són requisits a verificar durant la construcció, no proves ja superades.

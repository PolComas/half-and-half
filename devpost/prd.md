---
doc: prd
status: draft
---

# Half & Half — Requisits de producte

Activitat creativa per a parelles, incloses les que estan a distància: dues idees, una il·lustració i dues meitats pintades per separat abans de descobrir el resultat compartit.

Primer esborrany de `3-prd`, basat en l’entrevista real i en `scope.md > The Unique Kernel`, `The Core Loop` i `The POC Boundary`. L’entrevista continua: les preguntes obertes són explícites i aquest document encara no es pot donar per aprovat. Les recomanacions del context no es converteixen en decisions de producte per aparèixer-hi.

## The Core Journey

Font: `scope.md > The Core Loop` i `What "Working" Looks Like`.

1. La persona obre una home neta que explica breument l’activitat i permet crear una sala o entrar-hi amb un codi curt. No cal compte.
2. Qui crea la sala obté el codi; la segona persona l’introdueix des de la seva sessió. La ronda és per a dues persones. L’assignació esquerra/dreta encara està pendent.
3. Cada persona aporta una idea. Falta concretar la confirmació de les idees, quan poden editar-se i què inicia la generació.
4. S’espera una única generació compartida que combini totes dues idees en una il·lustració en blanc i negre per pintar.
5. Quan apareix la imatge, es mostren les dues idees. Des d’aquest primer moment cadascú només veu el seu 50% del dibuix; no hi ha vista completa inicial.
6. Cadascú pinta la seva meitat amb cubell o pinzell i pot desfer o netejar la pintura pròpia, conservant el dibuix base.
7. Cada persona prem «He acabat» i confirma que vol tancar la seva pintura. Només després d’un desament correcte es confirma la finalització i es bloqueja l’edició per a aquesta ronda. Qui acaba primer pot mirar la seva meitat desada mentre espera, sense veure el resultat complet.
8. Amb dues finalitzacions vàlides de la mateixa ronda, totes dues sessions veuen la mateixa obra completa i poden descarregar-la. No hi ha galeria.

## Screens and Layout

Superfícies conegudes del recorregut; no impliquen una pàgina separada per a cada estat:

- **Home:** informació breu de Half & Half, acció principal per crear sala i entrada per codi curt. L’usuari ha acceptat aquesta proposta d’inici. No s’ha definit cap opció concreta de configuració.
- **Sala i idees:** codi per comunicar a l’altra persona i aportació d’una idea cadascú. Controls de confirmació i distribució exacta pendents.
- **Generació:** estat d’espera comprensible; un error no s’ha de presentar com una imatge generada correctament. L’acció de recuperació està pendent.
- **Pintura:** meitat pròpia com a element central, dues idees visibles, selecció de color, cubell, pinzell, desfer, netejar i acció per acabar. Distribució dels controls i dispositiu prioritari pendents.
- **Espera final:** la meitat pròpia desada es pot mirar sense editar-la, amb el missatge «La teva part està desada. Esperem l’altra persona». No s’ensenya pintura aliena ni el resultat complet. No s’afegeix un altre editor o activitat mentre s’espera.
- **Revelació:** obra completa i acció per descarregar-la, disponible després de dues finalitzacions vàlides.

## Look and Feel

Font: `scope.md > Inspiration & Identity`, concretada per les respostes de l’usuari.

- Home neta, minimalista i maca, amb informació breu.
- Direcció de taller creatiu acceptada: fons clar amb toc de paper, espai generós, tipografia cuidada i color concentrat en la il·lustració. No hi ha encara paleta ni font concreta seleccionades.
- Es vol explorar una il·lustració generada pròpia per donar personalitat a la home. Cap asset concret creat o escollit; l’exemple de la home no és la generació de la ronda.
- Il·lustració de la ronda en blanc i negre, típica d’un llibre per pintar. El prompt haurà de combinar les idees i afavorir zones pintables. Cap prompt definitiu ni qualitat de resultat s’han provat encara.

## Features and Behavior

### Entrada amb codi curt

Font: `scope.md > The POC Boundary`, concretada durant l’entrevista.

No cal registre ni inici de sessió. Crear una sala dona un codi curt, que l’altra persona pot comunicar i escriure sense enviar-se un enllaç. El codi és la via principal; un enllaç addicional no està acordat.

Criteri: dues sessions independents entren a la mateixa ronda mitjançant el codi, sense compartir una sessió de navegador ni ocupar una tercera plaça. Format, caducitat i recuperació de l’entrada pendents.

### Dibuix compartit i visibilitat

Font: `scope.md > The Unique Kernel`, `The Core Loop` i `What "Working" Looks Like`.

Una il·lustració comuna combina les dues idees. Tall vertical exacte al 50%: una meitat esquerra i una dreta. Les idees es mostren quan apareix el dibuix. Abans i durant la pintura, cada persona només veu la seva meitat i mai la pintura de l’altra.

Criteris: una sola generació compartida; cap vista completa inicial; cap canvi de base mentre es pinta; tall sense buit ni solapament; protecció de la pintura aliena fins a la revelació. La política de canvi d’idees i de reintents s’ha de concretar abans d’aprovar el PRD.

### Pintar i corregir

Font: `scope.md > The Core Loop`, concretada per petició expressa de totes dues eines.

Cubell per omplir regions tancades i pinzell per pintar a mà, amb color seleccionable. Desfer i netejar afecten només la pintura pròpia i conserven el dibuix base.

Criteris: tant el cubell com el pinzell queden dins de la meitat assignada, també quan una regió continua més enllà del centre; el dibuix base i l’altra meitat no canvien. Cal provar imatges generades reals: demanar contorns tancats al prompt no garanteix que cada regió es pugui omplir sense problemes. Paleta, gruixos, abast de desfer i confirmació de neteja pendents de concretar. Una retirada del cubell requeriria revisar el requisit amb l’usuari.

### Acabar, esperar i revelar

Font: `scope.md > What "Working" Looks Like`.

«He acabat» demana confirmació i explica que la pintura quedarà tancada. Cancel·lar aquesta confirmació deixa la persona pintant. Confirmar-la inicia el desament: no es confirma que ha acabat ni es bloqueja definitivament l’edició fins que la seva versió s’ha desat correctament. Després queda tancada per a aquesta ronda; qui acaba primer pot contemplar només la seva meitat desada amb el missatge d’espera.

La revelació exigeix dues versions finals vàlides de participants diferents, de la mateixa ronda i il·lustració base. No s’inclou llenç lliure ni pintura de predicció durant l’espera.

Criteris: la primera finalització no revela res de l’altra pintura; un error de desament no compta com a finalització i permet recuperar el desament sense perdre la pintura; la versió final desada ja no es pot modificar; repeticions de l’acció no compten com una segona persona; finalitzacions gairebé simultànies donen el mateix resultat complet a les dues sessions. Com es reprèn una ronda interrompuda encara està pendent.

### Descarregar el resultat

Font: `scope.md > The POC Boundary`, actualitzada per la petició posterior explícita de l’usuari.

Després de la revelació, cadascú pot descarregar l’obra completa. L’arxiu correspon al resultat compartit, amb les dues meitats alineades i el dibuix base. La descàrrega completa no pot anticipar la revelació. No s’afegeix galeria ni publicació automàtica. Format del fitxer pendent de la spec.

## States and Boundaries

- **Falta la segona persona o una idea:** no es pot generar la composició de dues aportacions encara. Missatges i controls concrets pendents.
- **Generació en curs o fallida:** no es pot començar a pintar una base absent. Falta decidir el reintent i l’edició de les idees.
- **Pintura:** només la meitat pròpia; cap previsualització completa ni pintura aliena.
- **Desament fallit:** no es confirma el final ni s’activa la revelació.
- **Una persona acabada:** pintura desada i bloquejada; pot mirar només la seva meitat fins a la revelació, sense retornar a edició ni iniciar una activitat addicional.
- **Dues finalitzacions vàlides:** revelació coherent i descàrrega habilitada.
- **Recarregar, desconnectar-se o abandonar:** comportament de recuperació pendent; no inventar finalitzacions per arribar a la revelació.
- **Cost de generació:** l’usuari ha plantejat ajornar les quotes diàries. El topall global petit i els reintents limitats són recomanacions encara no aprovades. Cap pressupost o límit s’ha configurat.

## Product Decisions

Confirmades durant l’entrevista:

- Inici sense compte, amb crear sala i codi curt com a via principal d’entrada; l’usuari vol poder comunicar-lo fàcilment des d’ordinadors.
- Direcció visual neta i minimalista, amb aire de taller creatiu i interès per imatges generades pròpies.
- Imatge de ronda en blanc i negre amb estil de llibre per pintar.
- Cubell i pinzell dins de la primera versió, més desfer i netejar.
- Veure només el 50% propi des de l’aparició del dibuix, també abans del primer traç; cap vista completa inicial.
- Descàrrega de l’obra final dins de la primera versió; la galeria continua fora. És una modificació explícita de l’ajornament inicial de l’exportació al scope.
- Confirmar «He acabat», desar correctament i després bloquejar la pintura per a la ronda. Durant l’espera només es contempla la meitat pròpia desada. L’usuari ha acceptat explícitament aquesta recomanació després d’explorar altres possibles activitats; no s’hi afegeix un segon editor.

Les quatre regles del nucli ja estaven acordades abans de l’entrevista. L’assignació de costat i les polítiques de recuperació o cost encara no estan acordades.

## What We're Building

Una ronda completa de dues persones en sessions independents: entrada amb codi, una idea cadascú, una generació real comuna, pintura privada de meitats amb les eines acordades, desament vàlid, espera, doble finalització, revelació i descàrrega.

## Deferred From the POC

Font: `scope.md > Later` i `Explicitly Cut`.

Mode individual i rondes addicionals: es prioritza completar la ronda compartida. Galeria, xarxa social, xat, videotrucada, pagaments i gamificació queden fora perquè afegeixen recorreguts independents. Les quotes diàries per persona encara no tenen una decisió definitiva.

## Possible Later Enhancements

Iterar sobre el nucli si hi ha temps després que funcioni. Els extres ajornats no són compromisos de la primera versió; qualsevol incorporació nova s’ha de fer explícita.

## Non-Goals

No demostrar la integració d’IA amb una imatge fixa presentada com si s’hagués generat en directe. No convertir la descàrrega en una galeria ni en compartició pública automàtica. No afegir arquitectura o funcionalitats de comptes sense una decisió nova.

## Open Questions

Abans d’aprovar el PRD i passar a spec cal resoldre els punts de comportament que afecten la ronda:

1. Com s’assignen esquerra i dreta a les dues persones?
2. Com es confirmen les idees, fins quan poden canviar i què inicia la generació? Què poden fer si falla o el contingut no és acceptable?
3. Què es conserva si es recarrega la pàgina, es perd la connexió o algú abandona?
4. Quin és el dispositiu prioritari i quin idioma tindrà la interfície?
5. Quin mínim de controls de color, gruix i correcció necessita la primera versió?
6. S’ajornen les quotes diàries per persona? Quin control mínim de generació s’inclou i què veu qui arriba al límit?

La spec concretarà format de codi, credencials, dimensions, format de descàrrega, proveïdor/model, pressupost, topalls numèrics i mecanismes tècnics, després dels acords de producte. Encara no s’ha triat arquitectura ni s’ha implementat l’app.

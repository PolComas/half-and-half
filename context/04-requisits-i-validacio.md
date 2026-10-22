# Requisits candidats i validació

**Tipus: proposta informativa per al futur PRD i spec.**

## Requisits funcionals

| ID | Comportament verificable |
|---|---|
| R01 | La sala admet dues places i informa clarament si està plena o no existeix. |
| R02 | Les dues idees s’associen a participants diferents i s’utilitzen en la mateixa generació. |
| R03 | No es comença a pintar abans que la imatge comuna estigui disponible. |
| R04 | Les idees es mostren en el moment acordat; cada editor mostra només la seva meitat. |
| R05 | Els traços es limiten a la meitat assignada, també amb zoom o pantalla estreta. |
| R06 | La versió final es desa abans de confirmar “He acabat”. |
| R07 | La revelació exigeix dues versions finals vàlides de la mateixa ronda i imatge base. |
| R08 | Les dues sessions obtenen la mateixa composició final. |
| R09 | Un error d’API, de xarxa o de desament té missatge i acció de recuperació. |
| R10 | Les claus del proveïdor d’IA no arriben al navegador ni al repositori. |

## Requisits no funcionals proposats

- Una sola generació activa per ronda, protegida contra dobles clics i reintents.
- Navegació i controls accessibles: etiquetes, focus visible i noms de colors.
- Controls tàctils còmodes; l’estat no s’explica només amb color.
- Estats de càrrega honestos: no donar percentatges de progrés inventats.
- Límit de mida de text i de fitxers; validar format i dimensions de les imatges pujades.
- Accés a la sala limitat als seus participants; l’enllaç d’invitació no concedeix accés general a totes les sales.
- Retenció mínima per a una demo; termini concret pendent.
- Desament i recuperació simples abans que sincronització de cada traç.
- La latència de generació es mesurarà amb el proveïdor triat. No hi ha SLA ni pressupost aprovats.
- Una generació fallida no consumeix automàticament una cadena il·limitada de reintents.

## Escenaris d’acceptació

1. **Ronda real:** A i B entren des de contextos independents, escriuen idees diferents, pinten amb colors diferents i acaben. Veuen exactament el mateix resultat.
2. **Privacitat de pintura:** mentre A pinta, B no rep els traços ni una miniatura de A. Comprovar també respostes de xarxa i accés directe als recursos.
3. **Primer acabat:** A acaba abans; només veu espera. B encara pot pintar. No hi ha revelació prematura.
4. **Finalització simultània:** A i B acaben gairebé alhora. Hi ha una sola transició a revelat i un únic resultat.
5. **Error de pujada:** falla el desament de A. No queda marcat com a acabat fins que la versió s’ha persistit.
6. **Recàrrega:** si s’inclou recuperació, la identitat i el fragment desat es recuperen sense ocupar una tercera plaça.
7. **Tall exacte:** patró de prova que travessa el centre; després de compondre, no hi ha forat, duplicació ni desplaçament.
8. **Generació lenta o fallida:** es manté l’estat comprensible; el reintent no crea dues rondes ni sobreescriu una ronda ja pintada.
9. **Accés aliè:** un tercer context no pot llegir ni modificar una meitat usant un identificador conegut.
10. **Tacte i mida:** la posició del dit coincideix amb el traç, el llenç no provoca desplaçaments accidentals i els controls són visibles.

## Evidències a conservar quan s’implementi

Registrar navegador/dispositiu, escenari, resultat i incidència. Proves automatitzades sobretot per permisos, transicions, idempotència i composició. Proves manuals per pintura, tacte i comprensió del flux. No declarar proves superades abans d’executar-les.

La prova de funcionament amb imatge fixa i la prova de generació real s’han de registrar per separat.

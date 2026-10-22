# Mecànica acordada i comportaments per concretar

**Tipus: context informatiu.** Aquest document no és el PRD.

## Regles confirmades

| ID | Acord |
|---|---|
| A1 | Cada persona aporta una descripció: objecte, animal, personatge o una altra idea. |
| A2 | La IA combina les dues descripcions en una única il·lustració en blanc i negre per pintar. |
| A3 | Les dues idees són visibles quan es genera i apareix la il·lustració. |
| A4 | El dibuix es divideix verticalment en meitat esquerra i meitat dreta, al 50%. |
| A5 | Durant la pintura, cada persona veu només la seva meitat. No veu la pintura del company. |
| A6 | El resultat complet es revela quan tots dos han acabat. |

Una sola composició connectada és la interpretació de “combinar”; no dos dibuixos independents enganxats al final.

## Flux candidat

1. Una persona crea una sala i comparteix un enllaç.
2. L’altra hi entra; hi ha exactament dues places.
3. Cadascuna escriu una idea i la confirma. Proposta: ocultar-les fins que la imatge estigui disponible.
4. Amb totes dues idees, el servidor inicia una única generació.
5. Quan acaba, apareixen les dues idees i s’assigna una meitat a cada participant.
6. Cadascú pinta el seu fragment. Les idees poden continuar com a text visible.
7. Cadascú prem “He acabat”. Es desa i es confirma la seva versió final.
8. Si només n’ha acabat un, aquest espera i l’altre continua.
9. Amb totes dues versions finals confirmades, es revela l’obra sencera als dos.
10. Proposta posterior: descarregar el resultat o començar una nova ronda.

## Decisions que no hem de donar per fetes

- **Previsualització inicial:** mostrar les dues idees no implica necessàriament mostrar tot el dibuix sense pintar. Proposta mínima: mostrar directament la meitat pròpia. Preguntar si es vol una breu vista completa abans de pintar.
- **Assignació:** proposta, qui crea la sala pinta l’esquerra i qui entra pinta la dreta. No s’ha acordat sorteig ni elecció manual.
- **Acabar:** proposta, només es marca acabat després de desar; la meitat queda bloquejada per a aquesta ronda. Tornar a editar requereix una decisió explícita.
- **Espera:** mostrar només si el company ha acabat, sense miniatures, traços ni percentatge de pintura.
- **Abandonament:** no revelar automàticament per temps d’espera. O bé es reprèn la ronda o es cancel·la sense mostrar el fragment aliè.
- **Durada:** no hi ha temporitzador acordat. Evitar una cursa entre participants.
- **Canvi d’idees:** proposta, només abans d’iniciar la generació; no regenerar unilateralment mentre l’altre pinta.

## Geometria

Proposta tècnica: imatge base de dimensions fixes i amplada parella. Tall a x = W/2, sense franja perduda, solapament ni reflexió de la meitat dreta. La vista responsive escala el contingut, però no canvia les coordenades ni el tall. Les dues meitats conserven l’alineació original.

## Què vol dir “no veure”

Requisit visual confirmat: la interfície no mostra l’altra meitat durant la pintura. Recomanació addicional: el servidor tampoc lliura la capa de color de l’altre abans de la revelació. Tapar-la amb CSS mentre es descarrega en segon pla no és suficient per preservar la sorpresa davant una inspecció del navegador.

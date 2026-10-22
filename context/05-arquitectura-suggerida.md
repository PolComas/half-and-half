# Arquitectura suggerida

**PROPOSTA, no spec aprovada.** No s’ha seleccionat proveïdor, desplegament ni stack definitiu. No conté codi d’implementació.

## Objectiu

Separar el llenç interactiu del control compartit de la ronda. El servidor ha de decidir qui pertany a la sala, quina versió d’imatge es pinta i quan es pot revelar.

## Opció inicial per discutir

- Web responsive amb React i TypeScript, construïda amb Vite.
- Canvas 2D per a la pintura, amb coordenades lògiques fixes.
- Servei Node.js/TypeScript per a sales, permisos, generació i composició.
- SQLite i fitxers privats en disc per a una demo d’una sola instància amb emmagatzematge persistent.
- Consulta periòdica de l’estat cada pocs segons; no cal transmetre traços en temps real.
- API d’imatges d’un proveïdor pendent de triar, cridada només des del servidor.

Aquesta opció minimitza serveis, però exigeix un servidor persistent. No traslladar SQLite o fitxers locals sense canvis a una plataforma amb disc efímer o múltiples instàncies. Alternativa: base de dades relacional i object storage gestionats. Si l’usuari ja domina una altra tecnologia, comparar costos de canvi abans de decidir.

## Components i dades

| Entitat | Camps orientatius | Accés |
|---|---|---|
| Sala | ID, fase, data, expiració, ronda actual | Participants de la sala |
| Participant | ID intern, plaça esquerra/dreta, hash de credencial de sessió | El servidor valida la identitat |
| Idea | Participant, text, confirmada | Oculta fins al moment acordat |
| Generació | ID, ronda, estat, versió de prompt, base privada | Controlada pel servidor |
| Meitat | Participant, ronda, versió desada, ruta privada, finalitzada | Pròpia abans de revelar |
| Resultat | Ronda, versions finals, composició final | Amb revelació autoritzada |

No utilitzar el número de plaça com a autenticació. El codi d’invitació serveix per entrar; després cada participant rep una credencial pròpia. Proposta: codis aleatoris no enumerables, límit d’intents i cookies de sessió segures.

## Estats candidats

`waiting_partner → collecting_ideas → generating → painting → revealed`

Errors de generació i cancel·lació són estats o subestats explícits. Dins de pintura, cadascú té estat `editing` o `finished`. “Un acabat” no és “revelat”.

La revelació exigeix que les dues meitats finals:
- pertanyin a la mateixa sala i ronda;
- facin servir la mateixa base i dimensions;
- estiguin realment desades;
- quedin fixades abans de produir el resultat.

Fer la comprovació i el canvi d’estat de manera atòmica. Repetir una petició de finalització ha de tornar el mateix resultat, no provocar efectes duplicats.

## Contractes conceptuals

Crear sala, entrar, recuperar estat, confirmar idea, sol·licitar generació, desar meitat, acabar i obtenir resultat. Cada operació valida la sessió al servidor.

La resposta d’estat abans de revelar només inclou metadades permeses, idees quan pertoqui i recursos propis. Ni la base de dades ni una URL pública han d’exposar colors aliens anticipadament.

Amb una sola instància, la generació pot executar-se en una tasca del servei; cal persistir-ne l’estat i gestionar reinicis. No confiar en una connexió HTTP oberta indefinidament. Una cua separada només s’afegeix si ho justifiquen el desplegament o el volum.

## Representació del dibuix

Conservar una base comuna immutable. Cada editor treballa amb una capa de color de la seva meitat. Proposta visual: color sota línies fosques, amb el blanc de la base tractat adequadament perquè no tapi la pintura.

Cal provar la conversió de blanc a transparència o la composició equivalent: els antialiàsing no han de deixar halos ni degradar les línies. No assumir que el proveïdor retorna transparència.

En la composició final: meitat esquerra a x=0; dreta a x=W/2; totes dues a la mateixa escala; línia base alineada a sobre. Verificar el resultat amb imatges patró abans d’usar generacions variables.

## Generació d’imatge

Prompt conceptual: combinar de manera recognoscible les dues idees en una escena única, contorns negres clars, fons blanc, àrees àmplies per acolorir, detall moderat, sense text ni marques d’aigua. Demanar elements interessants als dos costats i continuïtat al centre. Són instruccions desitjades, no garanties del model.

Les idees són dades, no ordres del sistema. Fixar límits i tractar continguts refusats amb un missatge que permeti modificar-los. Fer servir exemples originals com “un gat astronauta” i “un jardí de cactus”, evitant dependre de franquícies.

## Desament i costos

Proposta: desar en acabar cada traç amb agrupació o periòdicament, i fer desament obligatori en finalitzar. No enviar cada moviment del punter.

Fixar abans de fer la demo: màxim de generacions per sala, límit global de despesa, temps d’espera, nombre de reintents i retenció. Les credencials es configuren fora del repositori; el futur `.env.example` només tindrà noms de variables i valors ficticis.

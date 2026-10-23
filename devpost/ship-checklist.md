# Seguiment de `6-ship`

Iniciat explícitament per l’usuari el **2026-10-23**. És un registre tècnic de preparació, no text de candidatura ni un nou pla de producte aprovat.

- [x] Prerequisits: scope, PRD i spec aprovats; construcció, checkpoints manuals, revisió final i resum/mapa complets.
- [x] Comprovació de preparació: typecheck, proves de domini, build, 12 proves d’integració i 6 e2e superats. Servidor local documentat accessible; `/api/health` retorna dades i generació preparades i `testFixture: false`. Cap generació nova durant aquesta revisió.
- [x] Repositori públic verificat sense autenticació: https://github.com/PolComas/half-and-half. Auditoria de `main` al commit `778a1b5`: 29 commits, 249 blobs, cap coincidència dels patrons de credencial revisats ni rutes privades excloses a la història. No és una garantia absoluta de detecció. La còpia privada no és el repositori de lliurament.
- [x] MIT aprovada explícitament per l’usuari amb «PolComas» com a titular, aplicada a `LICENSE` i a les metadades npm. Dependències i material aliè conserven els seus drets.
- [x] Instruccions tècniques en anglès disponibles a [`docs/SETUP.en.md`](../docs/SETUP.en.md), amb execució real i fixture sintètica clarament diferenciades.
- [ ] Vídeo curt amb funcionament real, pujat a YouTube/Vimeo i accessible sense autenticació. L’usuari confirma que encara no el té preparat.
- [ ] Formulari real complet revisat. L’usuari ha mostrat General info, Project Story i Project Media; l’enquesta i qualsevol pas posterior encara no s’han vist. Límit exacte del tagline no proporcionat. La vista pública de My projects no permet accedir al formulari amb sessió; els camps confirmats es registren més avall.
- [x] Nom i tagline breu escrits per l’usuari. Es conserva el nom indicat **Half & Half**; l’usuari ha escrit una frase anglesa de 47 caràcters i se n’ha comprovat la gramàtica sense modificar-la. No es dona per confirmat el desament al formulari. El text es conserva només en local.
- [x] L’usuari confirma que ha omplert la resta de camps i textos de Devpost; l’agent no n’ha llegit ni validat el contingut. Vídeo i fitxers continuen pendents. Cal comprovar llengua i requisits abans d’enviar.
- [ ] Enquesta de sortida completada per l’usuari. Preguntes exactes encara no disponibles.
- [ ] Disponibilitat de comprovació per al jurat fins al final de l’avaluació revisada. Sense desplegament triat ni URL pública de l’app; hi ha instruccions locals i una fixture gratuïta explícitament sintètica. La generació real requereix els serveis configurats i no es presenta la fixture com a substitut de la prova real.
- [ ] Lliurament confirmat a Devpost per l’usuari. No s’ha enviat ni publicat cap candidatura.

## Fonts consultades el 2026-10-23

- [Portada actual](https://learn-ai-basics.devpost.com/): vídeo d’1 a 3 minuts i repositori públic; no s’inventa un límit addicional del formulari.
- [Bases oficials](https://learn-ai-basics.devpost.com/rules): recomanació inferior a tres minuts, vídeo públic a YouTube/Vimeo, materials en anglès o traduïts i disponibilitat per al jurat. Data límit: **26 d’octubre de 2026, 22.00 Europe/Madrid**; avaluació fins al 30 d’octubre.
- [Pack real](https://github.com/challengepost/learn-ai-basics): vídeo i GitHub necessaris; desplegament i feedback extern opcionals. No es requereix cap publicació a Discord ni cap recompte de revisions.

Consulta de lectura a la quota interna del projecte: 5 intents reservats de 20; en queden 15. És capacitat interna de l’aplicació, no saldo verificat d’OpenAI. No s’ha reiniciat el comptador ni modificat infraestructura.

El skill real `6-ship` (`.agents/skills/6-ship/SKILL.md`, instal·lat només en local) exigeix autoria humana dels textos i de l’enquesta. L’agent pot identificar buits i corregir ortografia/gramàtica; no redactar, traduir o reescriure respostes finals ni la narració del vídeo. L’usuari informa posteriorment que ja ha omplert tots els camps de Devpost i només li falten vídeo i fitxers. No es continua l’entrevista del relat ni se’n reescriu el contingut. Intercanvi pendent: identificar el camp exacte de fitxers i després concretar què vol mostrar al vídeo.

## Camps confirmats a partir del formulari mostrat per l’usuari

- **General info:** Project name i Elevator pitch, marcats obligatoris.
- **Project Story / About the project:** camp obligatori en Markdown; instrucció de parlar d’inspiració, aprenentatge, construcció i reptes. Apartats proporcionats: Inspiration; What it does; How we built it; Challenges we ran into; Accomplishments that we're proud of; What we learned; What's next for Half & Half.
- **Built with:** obligatori, fins a 25 etiquetes. Els manifests permeten comprovar les tecnologies reals; l’usuari tria i introdueix les etiquetes.
- **Try it out links:** permet enllaços d’ús o codi. El repositori públic està disponible; no hi ha URL desplegada.
- **Image gallery:** JPG, PNG o GIF, màxim 5 MB per fitxer, fins a 15 imatges; proporció 3:2 recomanada. No s’ha marcat com a requisit completat ni s’han publicat captures de test com si fossin ús real.
- **Video demo link:** obligatori, incrustat al capdamunt de la pàgina. El fragment del formulari no afegeix durada; s’apliquen les indicacions actuals de portada i bases.

Hi ha una plantilla local amb els apartats reals a `.local/ship/project-story.md`. Encara no conté el relat final. Les notes personals i les reflexions no s’afegeixen al repositori públic per defecte.

# Half & Half — context inicial del projecte

Dues idees, dues meitats, una creació compartida.

Paquet documental preparat el **21 d’octubre de 2026** per iniciar un repositori nou per a Build With AI: Basics. El paquet original només contenia context. **Encara no hi ha una aplicació implementada.**

Actualització del **22 d’octubre de 2026**: el Devpost Learn Skill Pack s’ha instal·lat localment i s’han completat `1-start`, `2-scope` i `3-prd`. L’usuari ha revisat i aprovat l’[abast de la primera versió](devpost/scope.md), al qual ha afegit posteriorment la descàrrega del resultat final, i el [PRD complet](devpost/prd.md). Comença `4-spec`; spec encara no existeix, l’arquitectura no està escollida i no s’ha iniciat la construcció. L’usuari ha aportat la transcripció del vídeo, conservada en local al document 10. La transcripció completa, la conversa recuperada i el perfil d’aprenent estan exclosos del repositori públic; els resums de context es mantenen disponibles.

Per reinstal·lar els skills en un clon nou, amb Node.js i Git disponibles, executa `npx skills add challengepost/learn-ai-basics --all -y`. `skills-lock.json` registra la instal·lació inicial; les còpies locals dels skills queden fora dels commits.

## Què està acordat

Dues persones aporten una idea cadascuna. La IA combina les idees en una sola il·lustració en blanc i negre per pintar. Les dues idees es fan visibles quan apareix la il·lustració. La divisió és vertical, exactament al 50%: esquerra i dreta. Durant la pintura cadascú veu només la seva meitat, sense veure com pinta l’altra persona. L’obra completa es revela quan tots dos han acabat.

El nom **Half & Half** prové de la petició actual. El públic inicial són parelles, incloses les que estan a distància. No s’ha validat encara la demanda ni es promet un efecte sobre la relació.

## Com utilitzar aquest paquet

1. Descomprimeix-lo en una carpeta dedicada al projecte nou.
2. Llegeix [procedència i límits](context/00-procedencia-i-limits.md).
3. Revisa els acords i les propostes dels documents de context.
4. Obre aquesta carpeta amb Codex i enganxa [el prompt inicial](prompts/INICI_CODEX.md).
5. Completa el procés del Skill Pack abans de començar a implementar.
6. Crea el repositori GitHub i publica’l quan el contingut estigui revisat; aquest paquet no crea ni publica cap repositori.

La carpeta conté documentació de la idea, no codi reutilitzat d’un altre projecte. No esborris aquest context per simular una carpeta buida.

## Mapa de lectura

| Fitxer | Funció |
|---|---|
| [00 — Procedència](context/00-procedencia-i-limits.md) | Què s’ha recuperat, què falta i com resoldre contradiccions |
| [01 — Visió](context/01-visio-i-historia.md) | Motivació, públic i evolució de la idea |
| [02 — Mecànica](context/02-mecanica-acordada.md) | Regles confirmades i comportaments proposats |
| [03 — MVP](context/03-mvp-i-prioritats.md) | Nucli, límits i ordre de treball |
| [04 — Requisits](context/04-requisits-i-validacio.md) | Requisits candidats i proves d’acceptació |
| [05 — Arquitectura](context/05-arquitectura-suggerida.md) | Alternatives i proposta tècnica no aprovada |
| [06 — Disseny](context/06-disseny-i-experiencia.md) | Pantalles, interaccions i direcció visual proposada |
| [07 — Decisions i riscos](context/07-decisions-i-riscos.md) | Incògnites, recomanacions i mitigacions |
| [08 — Hackathon](context/08-hackathon-verificat.md) | Resum verificat i fonts oficials |
| [09 — Pla](context/09-pla-i-demostracio.md) | Calendari intern i evidències per mostrar |
| 10 — Vídeo (només local: `context/10-transcripcio-disponible.md`) | Transcripció recuperada i aportada per l’usuari; exclosa de Git |
| [11 — Skill Pack](context/11-proces-skill-pack.md) | Separació entre context i planificació |
| Arxiu recuperat (només local: `context/archive/conversa-recuperada.md`) | Text històric retornat, amb límits indicats; exclòs de Git |
| [Prompt](prompts/INICI_CODEX.md) | Instruccions completes per iniciar la planificació |
| [Estat de devpost](devpost/README.md) | Estat real del procés i documents pendents |

## Etiquetes d’autoritat

- **ACORDAT:** instrucció expressa recuperada de l’usuari o petició actual.
- **VERIFICAT:** dada contrastada amb una font oficial, amb data.
- **PROPOSTA:** recomanació d’aquest paquet, pendent de decidir amb l’usuari.
- **PENDENT:** no hi ha informació suficient.
- **HISTÒRIC:** context de la conversa, no necessàriament vigent.

Els documents de `context/` no substitueixen `devpost/scope.md`, `devpost/prd.md` ni `devpost/spec.md`. “Oficials” aquí vol dir els artefactes del procés requerit, no documents avalats individualment per Devpost.

## Publicació i idioma

El context de treball és en català. L’arxiu històric conté text en català i anglès, en l’estat retornat. Consulta els requisits lingüístics de la candidatura a [08](context/08-hackathon-verificat.md). Aquest paquet no inclou una llicència triada en nom de l’usuari: la selecció i l’autoria s’han de concretar abans de publicar la candidatura. La documentació històrica pot contenir material de tercers i no queda automàticament sota la futura llicència del codi.

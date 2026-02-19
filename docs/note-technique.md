# Note technique - EcoAction (2 pages max)

## 1. Contexte et objectif

EcoAction est un MVP mobile developpe avec Expo / React Native. Le besoin est de couvrir un flux utilisateur complet mais court:

- authentification (login / signup),
- consultation des missions,
- inscription et annulation,
- suivi dans "My Missions",
- affichage profil.

Le parti pris est de privilegier la clarte du code et la rapidite d'execution plutot qu'une architecture enterprise complexe.

## 2. Justification de l'architecture

### 2.1 Decoupage par responsabilite

- `app/`: routing et ecrans (Expo Router).
- `src/api/`: appels HTTP et adaptation minimale des donnees.
- `src/hooks/`: logique metier liee aux donnees distantes (TanStack Query).
- `src/context/`: etat de session (auth utilisateur).
- `src/providers/`: configuration globale (`QueryClientProvider`).
- `src/types/`: contrat de types centralise.
- `src/components/`: composants UI reutilisables.

Ce decoupage garde une separation nette entre:
- la navigation,
- la couche reseau,
- la logique de cache,
- la presentation.

### 2.2 Pourquoi ce choix

- Facile a lire pour un evaluateur: on localise vite chaque responsabilite.
- Evolutif: remplacement possible de JSON-Server par une API reelle sans toucher les ecrans.
- Testabilite: les fonctions API et hooks peuvent etre testes de maniere isolee.

## 3. Gestion des types complexes

Le projet est en TypeScript strict, avec contrats explicites dans `src/types/models.ts`.

### 3.1 Types coeur

- `Mission`: donnees brutes serveur.
- `Registration`: relation utilisateur <-> mission.
- `User` et `AuthUser`: separation entre donnees sensibles (mot de passe) et session.
- `MissionView`: vue enrichie pour l'UI.

### 3.2 Enrichissement type-safe

`MissionView` n'est pas stocke tel quel en base; il est derive de `Mission` + `Registration`:

- `registeredCount`,
- `remainingSpots`,
- `isRegistered`,
- `registrationId?`.

Ce choix evite de dupliquer des etats calculables et reduit le risque d'incoherence. Le mapping est centralise dans `src/api/missions-api.ts` (`toMissionView`), ce qui garantit une logique unique et typage coherent.

### 3.3 Types de mutation

Les payloads de mutation sont modeles avec interfaces dediees (`RegisterInput`, `UnregisterInput`) dans `src/hooks/use-missions.ts`. Le contexte de rollback (`RollbackContext`) est aussi type pour securiser les chemins d'erreur pendant les updates optimistes.

## 4. Strategie de cache avec TanStack Query

### 4.1 Configuration globale

Dans `src/providers/query-provider.tsx`:

- `staleTime = 2 min`,
- `gcTime = 10 min`,
- `queries.retry = 1`,
- `mutations.retry = 0`.

Raisonnement:
- 2 minutes de fraicheur evite les refetchs agressifs sur navigation rapide.
- 10 minutes de retention garde l'app reactive sans gonfler la memoire.
- mutations sans retry automatique pour eviter doubles actions utilisateur.

### 4.2 Scope du cache par utilisateur

La cle de query inclut l'utilisateur:

- `["missions", userId]` (ou `guest`).

Impact:
- isolation des donnees entre sessions,
- invalidation ciblee,
- reduction des effets de bord au login/logout.

### 4.3 Optimistic updates et coherence

Flux inscription/annulation:

1. `cancelQueries` sur la cle active.
2. Snapshot des donnees precedentes.
3. `setQueryData` immediat (UI optimiste).
4. Requete reseau (`joinMissionApi` / `cancelMissionApi`).
5. `onError`: rollback sur le snapshot.
6. `onSettled`: `invalidateQueries` pour resynchroniser serveur/cache.

Ce schema offre un bon compromis entre perception de performance et robustesse en cas d'echec reseau.

## 5. Limites assumees et evolutions

- Authentification mockee (pas de token/JWT).
- JSON-Server non adapte a la production.
- Peu de persistance locale hors cache memoire.

Evolutions naturelles:
- backend reel (NestJS/FastAPI/etc.),
- stockage securise session,
- tests E2E (Detox),
- pagination/cursor sur missions.

## 6. Conclusion

L'architecture retenue est volontairement simple, lisible et coherente avec un MVP. Le typage strict securise la transformation des donnees, et TanStack Query couvre efficacement chargement, cache, invalidation et optimistic updates avec rollback.

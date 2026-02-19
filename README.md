# EcoAction

Application mobile MVP (Expo + React Native) pour explorer des missions ecologiques et s'y inscrire.

## 1. Fonctionnalites MVP

- Authentification locale: login / signup
- Liste des missions: recherche + filtre par categorie
- Detail mission: informations et places restantes
- Inscription / annulation avec retour visuel immediat (optimistic UI)
- Ecran "My Missions"
- Ecran profil avec compteur

## 2. Stack technique

- Expo SDK 54
- React Native + Expo Router
- TypeScript strict
- TanStack Query v5 (`useQuery`, `useMutation`, cache, invalidation)
- NativeWind
- JSON-Server (API mock REST)

## 3. Structure du depot

```txt
app/                 Routes et ecrans Expo Router
src/api/             Couche appels HTTP et APIs metier
src/hooks/           Logique TanStack Query
src/context/         Etat session (auth)
src/providers/       Providers globaux (QueryClient)
src/types/           Modeles TypeScript
src/components/      Composants UI reutilisables
server/db.json       Donnees mock JSON-Server
docs/                Note technique + script de demonstration
demo/                Emplacement du fichier GIF/MP4 final
```

## 4. Installation et lancement

Prerequis:
- Node.js 18+ (22 fonctionne)
- npm
- Expo Go (mobile) ou emulateur

Installation:

```bash
npm install
```

Lancement (2 terminaux):

1. API mock:
```bash
npm run api
```
2. App Expo:
```bash
npm start
```

## 5. Configuration reseau (important sur telephone reel)

Creer un fichier `.env` a la racine:

```bash
EXPO_PUBLIC_API_URL=http://YOUR_LOCAL_IP:3001
```

Exemple:
`EXPO_PUBLIC_API_URL=http://192.168.1.20:3001`

Si aucun `.env` n'est defini, l'app tente d'inferer l'IP du host Expo.

## 6. Compte de demonstration

- Email: `sam@ecoaction.app`
- Mot de passe: `eco123`

## 7. Qualite et verification

```bash
npm run typecheck
npm run lint
```

## 8. Livrables demandes

1. Code source:
- Depot GitHub organise (ce projet)
- README clair (ce fichier)
- Strategie de commits explicites: `docs/commit-plan.md`

2. Demonstration:
- Script de passage: `docs/demo-script.md`
- Fichier attendu: `demo/ecoaction-demo.mp4` ou `demo/ecoaction-demo.gif`

3. Note technique (2 pages max):
- `docs/note-technique.md`

## 9. Proposition de convention de commits

Format recommande:
- `feat(auth): add signup flow with validation`
- `feat(missions): implement optimistic join/cancel`
- `fix(network): infer Expo host for API base URL`
- `docs(readme): detail setup and deliverables`

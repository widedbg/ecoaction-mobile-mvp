# Script de demonstration (GIF/MP4)

Objectif: montrer les flux principaux en 2 a 4 minutes.

## 1) Preparation

1. Terminal A:
```bash
npm run api
```
2. Terminal B:
```bash
npm start
```
3. Ouvrir l'app dans Expo Go ou emulateur.
4. Verifier que le compte demo fonctionne:
   - `sam@ecoaction.app`
   - `eco123`

## 2) Timeline de la video

### Sequence 1 - Login (20-30s)

- Montrer l'ecran Login.
- Saisir ou utiliser le compte demo.
- Cliquer `Login`.

Message oral possible:
"Je commence par l'authentification, puis j'arrive sur la liste des missions."

### Sequence 2 - Exploration des missions (35-45s)

- Scroller la liste.
- Changer la categorie dans le filtre.
- Saisir une recherche texte.

Message oral possible:
"La liste est chargee via TanStack Query, avec recherche locale et filtre categorie."

### Sequence 3 - Detail mission (20-30s)

- Ouvrir une mission.
- Montrer date, lieu, description, places restantes.

### Sequence 4 - Inscription avec optimistic UI (35-45s)

- Cliquer `Join Mission`.
- Montrer que l'etat visuel change immediatement.
- Revenir a la liste.

Message oral possible:
"L'inscription applique un optimistic update: l'UI se met a jour avant la reponse serveur."

### Sequence 5 - My Missions + annulation (30-40s)

- Ouvrir `My Missions`.
- Verifier la presence de la mission inscrite.
- Cliquer annulation/unregister.
- Verifier la mise a jour immediate.

### Sequence 6 - Profil + logout (15-25s)

- Ouvrir `Profile`.
- Montrer le compteur et les infos utilisateur.
- Cliquer `Logout`.

## 3) Points techniques a verbaliser (30-40s)

- Architecture: `app/` (navigation), `src/api/` (REST), `src/hooks/` (TanStack).
- TypeScript strict: types metier centralises.
- Cache TanStack: `staleTime` et `gcTime` configures.
- Optimistic update + rollback + invalidation.

## 4) Format du rendu

- Duree cible: 2 a 4 minutes.
- Format: MP4 ou GIF.
- Nom conseille:
  - `demo/ecoaction-demo.mp4`
  - ou `demo/ecoaction-demo.gif`

## 5) Option conversion MP4 -> GIF

Si vous enregistrez en MP4 et voulez un GIF:

```bash
ffmpeg -i demo/ecoaction-demo.mp4 -vf "fps=12,scale=900:-1:flags=lanczos" demo/ecoaction-demo.gif
```

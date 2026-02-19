# Plan de commits explicites

Ce plan permet de produire un historique Git lisible pour l'evaluation.

## Convention recommandee

Format:

`type(scope): message court et explicite`

Types utiles:
- `feat`: nouvelle fonctionnalite
- `fix`: correction de bug
- `refactor`: changement interne sans changement fonctionnel
- `docs`: documentation
- `chore`: maintenance outillage/config

## Sequence suggeree

1. `chore(init): setup expo router nativewind and project structure`
2. `feat(auth): implement login and signup flows with context`
3. `feat(missions): add missions list filtering and detail screen`
4. `feat(registration): implement join and cancel mission`
5. `feat(query): add tanstack query with optimistic updates and rollback`
6. `fix(network): improve API base URL for Expo Go physical devices`
7. `docs(note): add technical note on architecture typing and cache strategy`
8. `docs(demo): add demo script and delivery instructions`
9. `docs(readme): clarify setup architecture and requested deliverables`

## Bonnes pratiques de commit

- Un commit = une intention.
- Eviter les messages vagues (`update`, `fix stuff`).
- Inclure les fichiers lies a la meme fonctionnalite dans le meme commit.
- Verifier avant commit:
  - `npm run typecheck`
  - `npm run lint`

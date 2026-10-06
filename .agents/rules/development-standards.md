# Standards de Développement & Protocole Mémoire

Ce fichier de règle régit les comportements attendus sur l'ensemble du projet `super4c2`.

## 1. Persistance Mémoire Obligatoire
Tout agent travaillant sur ce projet doit :
- Lire `memory-bank/activeContext.md` dès son arrivée.
- Mettre à jour les fichiers de `memory-bank/` à chaque progression importante.

## 2. Processus d'Ingénierie Structuré
Ne jamais développer de fonctionnalité majeure sans :
1. Avoir documenté ou validé les directives de marque / design (`docs/brand/`).
2. Avoir rédigé et fait valider le document de spécification technique (`docs/specs/*.md`).
3. Appliquer les standards TypeScript stricts (aucun `any` toléré) et le design system Shadcn UI / Tailwind CSS.

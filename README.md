# Thème Appui pour Shopify

## Mettre le thème sur GitHub

1. Crée un nouveau repo sur GitHub (ex: `appui-shopify-theme`), vide, sans README ni .gitignore.
2. Depuis ton iPhone, dans l'appli GitHub ou via l'upload web (github.com > ton repo > "Add file" > "Upload files") :
   glisse tout le contenu de ce dossier (les dossiers `layout`, `templates`, `sections`, `snippets`, `assets`, `config`, `locales` doivent être à la racine du repo, pas dans un sous-dossier supplémentaire).
3. Commit sur la branche `main`.

## Connecter le thème à Shopify

1. Dans l'admin Shopify : **Boutique en ligne > Thèmes**.
2. Clique **Ajouter un thème > Connecter depuis GitHub**.
3. Connecte-toi à GitHub si demandé, choisis le repo `appui-shopify-theme` et la branche `main`.
4. Le thème apparaît dans ta bibliothèque de thèmes. Publie-le quand tu es prêt.

## Ensuite, pour modifier le site

Deux façons, comme avec tes autres projets :
- Modifie les fichiers directement sur GitHub → ça se synchronise automatiquement sur Shopify en quelques secondes.
- Ou modifie dans l'éditeur de thème Shopify (Personnaliser) → ça crée automatiquement un commit sur ta branche GitHub.

## Brancher tes produits

Le thème attend deux produits en avant sur la page d'accueil (section "Produits en avant").
Dans l'admin Shopify : **Personnaliser le thème > section "Produits en avant"**, puis choisis tes vrais produits Appui Confort et Appui Chaleur dans les blocs.

## Personnaliser le texte des fiches produit (optionnel)

Pour afficher la petite phrase sous le nom du produit (ex: "Semelle de soutien quotidien"), crée un metafield produit personnalisé :
`custom.tagline` (type: texte à ligne unique).

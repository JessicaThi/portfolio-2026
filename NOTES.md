# Nouveau portfolio (novembre 2026)

L'ancien site (2020) est gardé tel quel dans `portfolio-2020/`.

Ouvrir `index.html` dans le navigateur. Le site est en HTML, CSS et JavaScript, sans outil de build.

## L'accueil (`index.html`)

- **En haut** : texte façon terminal (carré qui clignote), en FR / EN / 한. Bassin de koïs aquarelle avec des nuages qui passent, des gouttes d'eau au clic et un curseur « cierge magique ». Au défilement, le bassin s'éloigne et se fond dans la page.
- **Parcours** : un « plan de vol » de Bruxelles à Séoul. L'avion suit le tracé et chaque étape sort du flou quand il passe. Lien vers infinique.kr sur l'étape actuelle.
- **Projets** : 8 vignettes animées au survol, qui mènent aux pages projets, puis la liste « Autres projets ». Apparition douce au défilement.
- **Contact** : le memoji sort de derrière l'ordinateur, passe au sourire avec un pop d'étincelles, puis la bulle s'écrit. Carte d'embarquement en mode clair, billet en verre en mode sombre.
- **Bas de page** : « Retour à la porte d'embarquement » scanne le billet avant de remonter.
- Mode clair / sombre (ciel de nuit). La langue et le thème choisis sont gardés pour les pages projets.

Si l'appareil demande moins d'animations, les animations sont coupées ou remplacées par des images fixes.

## Les pages projets (`projets/`)

Clor AI, Otoctone, Pando2, Le Plein, Skade, Ouipharma, Nomiks, Dotworld. Chaque page a son dossier d'images.

- `commun.css` : l'ouverture (ordinateur + téléphone), les vitrines de téléphones, l'apparition au défilement.
- `apparition.js` : l'apparition douce au défilement, par blocs.

## Les fichiers

- `koi-body.png`, `koi-fin-top.png`, `koi-fin-bottom.png` : le koï découpé (corps et nageoires avant).
- `logo-jt.svg`, `logo-jt-anim.webp` : le logo JT, fixe et animé.
- `memoji/` : les poses du memoji (ordinateur, sourire, sourire animé, victoire).
- `404.html` : la page « Ce vol n'existe pas ».

## Avant la mise en ligne

- Faire relire les textes coréens.
- Ajouter le titre, la description et l'image d'aperçu pour le partage (LinkedIn, KakaoTalk).
- Tester sur téléphone.
- Hébergement : le domaine passe par Cloudflare (probablement Cloudflare Pages relié au dépôt GitHub).

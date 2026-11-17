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

Clor AI, Otoctone, Pando2, Le Plein, Skade, Ouipharma, Nomiks, Dotworld. Chaque page existe en français (`nom.html`), en anglais (`nom.en.html`) et en coréen (`nom.ko.html`), et a son dossier d'images.

- `commun.css` : l'ouverture (ordinateur + téléphone), les vitrines de téléphones, l'apparition au défilement, le contour visible des liens et boutons quand on navigue au clavier (Tab).
- `apparition.js` : l'apparition douce au défilement, par blocs.

## Les fichiers

- `koi-body.webp`, `koi-fin-top.webp`, `koi-fin-bottom.webp` : le koï découpé (corps et nageoires avant).
- `logo-jt.svg`, `logo-jt-anim.webp` : le logo JT, fixe et animé.
- `memoji/` : les poses du memoji (ordinateur, sourire, sourire animé, victoire).
- `miniatures/` : les vignettes des projets sur l'accueil, en deux tailles selon l'écran.
- `fonts/` : les polices du site (Inter, JetBrains Mono), hébergées sur le site.
- `chargement.js` : l'écran de chargement, affiché seulement si la page tarde. Page d'essai : `outils/chargement.html`.
- `pdf/` : le portfolio court en PDF. Les pages `portfolio.html` (FR, EN, KO) servent à fabriquer les fichiers `jessica-thielemans-portfolio-fr/ko/en.pdf`, téléchargeables depuis le lien « Portfolio (PDF) » du contact. À refaire à chaque changement d'un projet : export avec « Imprimer » dans Chrome, puis compression des images (environ 10 Mo → 2 Mo).
- `404.html` : la page « Ce vol n'existe pas ».
- `apercu.jpg` : l'image d'aperçu quand on partage le lien (LinkedIn, KakaoTalk).
- `sitemap.xml`, `robots.txt` : pour Google. `outils/`, `pdf/` et `portfolio-2020/` ne sont pas indexés.
- `_headers` : durée de cache des fichiers et sécurité de base (Cloudflare Pages).

## Mise en ligne

Le site est hébergé sur Cloudflare Pages, relié au dépôt GitHub : un push sur `master` le met en ligne en une trentaine de secondes.

## Reste à faire

- Faire relire les textes coréens par une personne coréenne.
- Tester sur de vrais téléphones, dont le navigateur intégré de KakaoTalk.

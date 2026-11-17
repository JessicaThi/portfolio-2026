/* Écran de chargement : une petite lumière mauve et rose au centre, qui change doucement de forme, avec le pourcentage de chargement en dessous.
   Chargé dans le <head> de l'accueil et des pages projets.

   Fonctionnement, pour ne jamais voir « la page, puis l'écran, puis la page » :
   - dès le début, un fond uni de la couleur de la page cache tout (on ne voit rien de plus qu'une page blanche qui charge) ;
   - dès que le haut de la page est prêt (texte, polices, images visibles à l'écran), ce fond s'efface et la page apparaît, une seule fois ;
   - si ça prend plus de 0,8 seconde, la lumière et le pourcentage apparaissent sur ce fond, restent au moins 0,9 seconde
     (sinon on les voit juste clignoter), puis tout s'efface en fondu lent ;
   - tant que le fond est là, le défilement est bloqué ; une fois la page montrée, l'écran ne revient jamais.
   Les images plus bas dans la page n'attendent pas : elles continuent de charger pendant qu'on lit le haut.

   Pour le voir et retoucher son style : page outils/chargement.html, ou ajouter à l'adresse d'une page
   ?chargement (reste affiché à 42 %), ?chargement=73 (autre pourcentage) ou ?chargement=sim (0 → 100 % en boucle).

   Le pourcentage est une estimation : le navigateur ne donne pas la progression réelle d'une page.
   On compte la page elle-même, les polices et les images visibles à l'écran ;
   le chiffre ne recule jamais et n'atteint 100 % qu'une fois le haut de la page prêt. */
(() => {
  const DELAI = 800;          // ms avant d'afficher la lumière (en dessous, on ne voit qu'un fond uni très bref)
  const MINI = 900;           // ms : durée minimale de la lumière une fois apparue, pour éviter un clignotement
  const POLICES = 3000;       // ms : au-delà, on n'attend plus les polices (le texte s'affiche avec la police de secours)
  const MAX = 10000;          // ms : on montre la page quoi qu'il arrive, même si une image traîne
  const param = new URLSearchParams(location.search).get("chargement");
  const essai = param !== null;                                     // mode essai : l'écran reste affiché
  const sim = param === "sim";                                      // simulation : 0 → 100 % en boucle
  const fixe = /^\d+$/.test(param || "") ? Math.min(100, +param) : 42;
  if (document.readyState === "complete" && !essai) return;
  const t0 = performance.now();

  // thème clair ou sombre choisi sur le site (lu ici directement, avant que la page l'applique)
  let sombre = false;
  try { sombre = localStorage.getItem("theme") === "dark"; } catch (e) {}

  const css = `
    #chargement {
      position: fixed; inset: 0; z-index: 10000;
      display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 40px;
      /* même fond que la page dès que son style est lu (blanc sur les pages projets, lavande sur l'accueil, nuit en sombre) */
      background: ${sombre ? "#0f1126" : "var(--bg, #f4f1fb)"};
      transition: opacity .35s ease;
    }
    #chargement.fin { opacity: 0; pointer-events: none; }
    #chargement.lent.fin { transition-duration: .7s; }
    /* la lumière et le pourcentage n'apparaissent que si la page tarde */
    #chargement .lumiere, #chargement .pourcent { opacity: 0; transition: opacity .5s ease; }
    #chargement.lent .lumiere, #chargement.lent .pourcent { opacity: 1; }

    /* la lumière : une petite goutte mauve et rose au centre, qui respire et change doucement de forme */
    #chargement .lumiere { position: relative; width: 46px; height: 46px; }
    #chargement .halo, #chargement .goutte { position: absolute; border-radius: 50%; animation: ch-forme 6s ease-in-out infinite; }
    #chargement .halo {
      inset: -26px; filter: blur(14px); opacity: ${sombre ? ".55" : ".4"};
      background: radial-gradient(circle, ${sombre ? "#a78bfa" : "#b9a2f5"} 0 35%, #f08cb8 60%, transparent 75%);
      animation: ch-forme 7s ease-in-out infinite reverse, ch-respire 2.8s ease-in-out infinite alternate;
    }
    #chargement .goutte {
      inset: 0; filter: blur(1.5px); opacity: ${sombre ? ".9" : ".8"};
      background: radial-gradient(circle at 40% 38%, #fff 0 14%, ${sombre ? "#c4b5fd" : "#b9a2f5"} 44%, #f3a6c8 78%, #f08cb8 100%);
    }
    /* forme qui varie : les coins s'arrondissent chacun à leur rythme, et la goutte tourne très lentement */
    @keyframes ch-forme {
      0%   { border-radius: 58% 42% 60% 40% / 44% 60% 40% 56%; rotate: 0deg; }
      33%  { border-radius: 42% 58% 45% 55% / 60% 40% 58% 42%; }
      66%  { border-radius: 60% 40% 40% 60% / 42% 56% 44% 58%; }
      100% { border-radius: 58% 42% 60% 40% / 44% 60% 40% 56%; rotate: 360deg; }
    }
    @keyframes ch-respire { from { scale: .92; } to { scale: 1.08; } }
    #chargement .pourcent {
      font-family: "JetBrains Mono", ui-monospace, monospace; font-size: 13px; letter-spacing: .14em;
      color: ${sombre ? "#9a98b8" : "#7a7590"}; font-variant-numeric: tabular-nums;
    }
    /* moins d'animations demandé : la lumière reste immobile */
    @media (prefers-reduced-motion: reduce) {
      #chargement .halo, #chargement .goutte { animation: none; }
    }
    @media print { #chargement { display: none !important; } }
  `;

  // ---------- le haut de la page est-il prêt ? ----------
  const aLEcran = el => { const r = el.getBoundingClientRect(); return r.width > 0 && r.bottom > 0 && r.top < innerHeight; };
  const policesPretes = () => !document.fonts || document.fonts.status === "loaded" || performance.now() - t0 > POLICES;
  const etat = () => {
    const imgs = [...document.images].filter(img => img.src && aLEcran(img));
    const pretes = imgs.filter(img => img.complete).length;           // complete = chargée (ou en erreur : on n'attend pas)
    const dom = document.readyState !== "loading";
    const polices = policesPretes();
    return { pret: dom && polices && pretes === imgs.length, part: (pretes + dom + polices) / (imgs.length + 2) };
  };
  let affiche = 0;
  const progression = () => {
    const { pret, part } = etat();
    affiche = Math.max(affiche, pret ? 100 : Math.min(95, Math.round(part * 100)));   // ne recule jamais
    return affiche;
  };

  // ---------- défilement bloqué tant que l'écran est là ----------
  const TOUCHES = [" ", "PageUp", "PageDown", "Home", "End", "ArrowUp", "ArrowDown"];
  const bloquer = e => { if (e.type !== "keydown" || TOUCHES.includes(e.key)) e.preventDefault(); };
  const EVTS = ["wheel", "touchmove", "keydown"];
  EVTS.forEach(t => addEventListener(t, bloquer, { passive: false, capture: true }));
  const debloquer = () => EVTS.forEach(t => removeEventListener(t, bloquer, { capture: true }));

  // ---------- l'écran, posé tout de suite (avant que le moindre bout de page s'affiche) ----------
  const style = document.createElement("style");
  style.textContent = css;
  document.head.appendChild(style);
  const ecran = document.createElement("div");
  ecran.id = "chargement";
  ecran.innerHTML = '<div class="lumiere" aria-hidden="true"><div class="halo"></div><div class="goutte"></div></div><div class="pourcent"></div>';
  const chiffre = ecran.querySelector(".pourcent");
  // le <body> n'existe pas encore : l'écran est accroché à <html>, en position fixe par-dessus tout
  document.documentElement.appendChild(ecran);

  const ecrire = p => { chiffre.textContent = document.documentElement.lang === "fr" ? p + " %" : p + "%"; };
  let lent = false, fini = false, debut = 0, montre = 0, simP = 0;
  ecrire(0);

  // la lumière apparaît seulement si la page tarde
  const montrerLumiere = () => {
    if (fini || lent) return;
    lent = true;
    debut = performance.now();
    ecran.setAttribute("role", "status");
    ecran.setAttribute("aria-label", document.documentElement.lang === "ko" ? "로딩 중" : document.documentElement.lang === "en" ? "Loading" : "Chargement");
    ecran.classList.add("lent");
  };

  // la page apparaît : une seule fois, l'écran ne revient plus
  const enlever = () => { clearInterval(minuteur); ecran.remove(); debloquer(); };
  const finir = () => {
    if (fini || essai) return;
    fini = true;
    clearTimeout(attente);
    if (!lent) {                                                       // page prête tout de suite : simple fondu du fond uni
      ecran.classList.add("fin");
      debloquer();                                                     // on peut défiler pendant le fondu
      setTimeout(enlever, 400);
      return;
    }
    ecrire(100);
    const reste = Math.max(250, debut + MINI - performance.now());     // on laisse voir « 100 % » un instant
    setTimeout(() => {
      ecran.classList.add("fin");                                      // fondu de sortie (0,7 s)
      debloquer();
      setTimeout(enlever, 750);
    }, reste);
  };

  const attente = setTimeout(montrerLumiere, essai ? 0 : DELAI);
  // toutes les 40 ms : le chiffre monte en douceur vers l'estimation, et on vérifie si le haut de la page est prêt
  const minuteur = setInterval(() => {
    if (sim) {                                                         // simulation : monte, s'efface, recommence
      if (simP >= 100) return;
      simP = Math.min(100, simP + 1 + Math.floor(Math.random() * 3));
      ecrire(simP);
      if (simP === 100) setTimeout(() => {
        ecran.classList.add("fin");
        setTimeout(() => { simP = 0; ecrire(0); ecran.classList.remove("fin"); }, 1400);
      }, 300);
      return;
    }
    const p = essai ? fixe : progression();
    if (lent && montre < p) { montre += Math.max(1, Math.round((p - montre) / 6)); ecrire(Math.min(montre, p)); }
    if (!essai && p === 100) finir();
  }, 40);
  addEventListener("load", finir);
  setTimeout(finir, MAX);
  // retour arrière depuis la page suivante : la page revient du cache, pas d'écran
  addEventListener("pageshow", e => { if (e.persisted) { fini = true; enlever(); } });
})();

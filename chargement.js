/* Écran de chargement : une petite lumière mauve et rose au centre, qui change doucement de forme, avec le pourcentage de chargement en dessous.
   Il n'apparaît que si la page met plus de 0,8 seconde à se charger. Une fois apparu, il reste au moins 0,9 seconde
   (sinon on le voit juste clignoter), puis s'efface en fondu lent.
   Chargé dans le <head> de l'accueil et des pages projets.
   Pour le voir et retoucher son style : page outils/chargement.html, ou ajouter à l'adresse d'une page
   ?chargement (reste affiché à 42 %), ?chargement=73 (autre pourcentage) ou ?chargement=sim (0 → 100 % en boucle).

   Le pourcentage est une estimation : le navigateur ne donne pas la progression réelle d'une page.
   On compte les images (sauf celles chargées plus tard, au défilement) et les polices déjà arrivées ;
   le chiffre ne recule jamais et n'atteint 100 % qu'une fois la page prête. */
(() => {
  const DELAI = 800;          // ms avant d'afficher l'écran (en dessous, on ne montre rien)
  const MINI = 900;           // ms : durée minimale à l'écran une fois apparu, pour éviter un clignotement
  const MAX = 10000;          // ms : on l'enlève quoi qu'il arrive, même si une image traîne
  const param = new URLSearchParams(location.search).get("chargement");
  const essai = param !== null;                                     // mode essai : l'écran reste affiché
  const sim = param === "sim";                                      // simulation : 0 → 100 % en boucle
  const fixe = /^\d+$/.test(param || "") ? Math.min(100, +param) : 42;
  if (document.readyState === "complete" && !essai) return;

  // thème clair ou sombre choisi sur le site (lu ici directement, avant que la page l'applique)
  let sombre = false;
  try { sombre = localStorage.getItem("theme") === "dark"; } catch (e) {}

  const css = `
    #chargement {
      position: fixed; inset: 0; z-index: 10000;
      display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 40px;
      background: ${sombre ? "#0f1126" : "#f4f1fb"};
      opacity: 0; transition: opacity .7s ease; pointer-events: none;
    }
    #chargement.on { opacity: 1; pointer-events: auto; transition-duration: .5s; }

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

  // ---------- estimation du pourcentage ----------
  const lazyPasLance = img => img.loading === "lazy" && !img.complete && img.getBoundingClientRect().top > innerHeight;
  let affiche = 0;
  const progression = () => {
    const imgs = [...document.images].filter(img => img.src && !lazyPasLance(img));
    const total = imgs.length + 1;                                     // + 1 pour les polices
    let pret = imgs.filter(img => img.complete).length;
    if (!document.fonts || document.fonts.status === "loaded") pret++;
    const cible = document.readyState === "complete" ? 100 : Math.min(95, Math.round(pret / total * 100));
    affiche = Math.max(affiche, cible);                                // ne recule jamais
    return affiche;
  };

  let ecran, chiffre, minuteur, debut = 0;
  const ecrire = p => { chiffre.textContent = document.documentElement.lang === "fr" ? p + " %" : p + "%"; };
  const montrer = () => {
    if (ecran || (document.readyState === "complete" && !essai)) return;
    const style = document.createElement("style");
    style.textContent = css;
    document.head.appendChild(style);
    ecran = document.createElement("div");
    ecran.id = "chargement";
    debut = performance.now();
    // même fond que la page (blanc sur les pages projets, lavande sur l'accueil), si son style est déjà lu
    if (!sombre) {
      const fond = getComputedStyle(document.documentElement).getPropertyValue("--bg").trim();
      if (fond) ecran.style.background = fond;
    }
    ecran.setAttribute("role", "status");
    ecran.setAttribute("aria-label", document.documentElement.lang === "ko" ? "로딩 중" : document.documentElement.lang === "en" ? "Loading" : "Chargement");
    ecran.innerHTML = '<div class="lumiere" aria-hidden="true"><div class="halo"></div><div class="goutte"></div></div><div class="pourcent"></div>';
    chiffre = ecran.querySelector(".pourcent");
    (document.body || document.documentElement).appendChild(ecran);
    // le chiffre monte en douceur vers l'estimation, d'un point à la fois
    let montre = 0;
    ecrire(0);
    let simP = 0;
    minuteur = setInterval(() => {
      if (sim) {                                                       // simulation : monte, s'efface, recommence
        if (simP >= 100) return;
        simP = Math.min(100, simP + 1 + Math.floor(Math.random() * 3));
        ecrire(simP);
        if (simP === 100) setTimeout(() => {
          ecran.classList.remove("on");
          setTimeout(() => { simP = 0; ecrire(0); ecran.classList.add("on"); }, 1400);
        }, 300);
        return;
      }
      const p = essai ? fixe : progression();
      if (montre < p) { montre += Math.max(1, Math.round((p - montre) / 6)); ecrire(Math.min(montre, p)); }
    }, 40);
    requestAnimationFrame(() => requestAnimationFrame(() => ecran.classList.add("on")));
  };
  const cacher = () => {
    if (!ecran || essai) return;
    ecrire(100);
    clearInterval(minuteur);
    const reste = Math.max(250, debut + MINI - performance.now());     // on laisse voir « 100 % » un instant
    setTimeout(() => {
      ecran.classList.remove("on");                                    // fondu de sortie (0,7 s)
      setTimeout(() => ecran && ecran.remove(), 750);
    }, reste);
  };

  setTimeout(montrer, essai ? 0 : DELAI);
  addEventListener("load", cacher);
  setTimeout(cacher, MAX);
  // retour arrière depuis la page suivante : la page revient du cache, pas d'écran
  addEventListener("pageshow", e => { if (e.persisted && ecran) { clearInterval(minuteur); ecran.remove(); ecran = null; } });
})();

/* Apparition douce au défilement, comme la section Projets de l'accueil.
   Chargé dans le <head> : il cache les blocs avant le premier affichage, puis les fait apparaître
   l'un après l'autre quand ils arrivent à l'écran. Rien ne bouge si l'appareil demande moins d'animations. */
(() => {
  if (matchMedia("(prefers-reduced-motion: reduce)").matches) return;
  // liens vers une autre page du site (projet suivant, tous les projets) : la page se fond avant de partir
  document.addEventListener("click", e => {
    const a = e.target.closest?.("a[href]");
    if (!a || a.target === "_blank" || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey || e.button !== 0) return;
    const href = a.getAttribute("href");
    if (!/^[^:]*\.html(#.*)?$/.test(href)) return;                   // seulement nos pages, pas les sites externes
    e.preventDefault();
    const dark = document.documentElement.dataset.theme === "dark";
    // vers l'accueil : fond lavande (ou nuit) ; vers un autre projet : fond de page projet
    document.documentElement.style.setProperty("--leave-bg", href.includes("index.html") && !dark ? "#f4f1fb" : "var(--bg)");
    document.documentElement.classList.add("leaving");
    setTimeout(() => { location.href = a.href; }, 350);
  });
  addEventListener("pageshow", e => { if (e.persisted) document.documentElement.classList.remove("leaving"); });
})();
(() => {
  if (matchMedia("(prefers-reduced-motion: reduce)").matches || !("IntersectionObserver" in window)) return;
  // par blocs : chaque morceau de section apparaît d'un coup (titre + texte ensemble) ;
  // seules les images (captures, téléphones) gardent le petit décalage l'une après l'autre
  const IMAGES = ".gallery, .showcase, .duos, .shots";
  const SEL = [
    ".intro > *", ".stage .scene > *", ".stage figcaption",
    `section > *:not(${IMAGES.split(", ").join("):not(")})`,
    "section .gallery > *", "section .showcase .row > *", "section .showcase > p",
    "section .duos > *", "section .shots > *", ".next"
  ].map(s => "main " + s).join(", ");
  document.addEventListener("DOMContentLoaded", () => {
    const all = new Set(document.querySelectorAll(SEL));
    // on garde le bloc le plus large : si un parent apparaît déjà, ses enfants ne s'animent pas en plus
    const els = [...all].filter(el => { for (let p = el.parentElement; p; p = p.parentElement) if (all.has(p)) return false; return true; });
    const io = new IntersectionObserver(entries => {
      entries.filter(e => e.isIntersecting).forEach((e, i) => {
        e.target.style.setProperty("--d", Math.min(i * 0.1, 0.6) + "s");
        e.target.classList.add("in");
        io.unobserve(e.target);
      });
    }, { threshold: .08 });
    els.forEach(el => { el.classList.add("rv"); io.observe(el); });
    document.addEventListener("transitionend", e => { if (e.target.classList?.contains("in")) e.target.style.removeProperty("--d"); });
  });
})();
// Version PDF : on imprime toujours en thème clair, avec toutes les images chargées
(() => {
  let theme;
  addEventListener("beforeprint", () => {
    theme = document.documentElement.dataset.theme;
    delete document.documentElement.dataset.theme;
    document.querySelectorAll('img[loading="lazy"]').forEach(img => { img.loading = "eager"; });
  });
  addEventListener("afterprint", () => { if (theme) document.documentElement.dataset.theme = theme; });
})();
// Images « lazy » : le navigateur (surtout Safari) attend qu'elles soient presque à l'écran pour les charger,
// elles apparaissent donc en retard. On lance leur chargement un peu avant, environ deux écrans plus tôt.
(() => {
  if (!("IntersectionObserver" in window)) return;
  document.addEventListener("DOMContentLoaded", () => {
    const io = new IntersectionObserver(entries => {
      entries.filter(e => e.isIntersecting).forEach(e => { e.target.loading = "eager"; io.unobserve(e.target); });
    }, { rootMargin: "200% 0px" });
    document.querySelectorAll('img[loading="lazy"]').forEach(img => { img.decoding = "async"; io.observe(img); });
  });
})();

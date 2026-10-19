(() => {
  if (!window.matchMedia('(max-width:680px)').matches) return;
  history.scrollRestoration = 'manual';
  function openHomeAtTop() {
    const url = new URL(location.href);
    url.hash = 'home';
    history.replaceState(history.state, '', url.href);
    window.scrollTo({top: 0, left: 0, behavior: 'instant'});
    requestAnimationFrame(() => requestAnimationFrame(() => {
      window.scrollTo({top: 0, left: 0, behavior: 'instant'});
    }));
  }
  // Run before layout and again when Safari restores a saved page.
  openHomeAtTop();
  window.addEventListener('pageshow', openHomeAtTop);
  window.addEventListener('load', openHomeAtTop, {once:true});
})();

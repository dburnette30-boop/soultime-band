(() => {
  const section = document.getElementById('members');
  const portraits = [...document.querySelectorAll('#members .member-grid > article > img')];
  if (!section || !portraits.length) return;
  let queued = false;
  function alignFloor() {
    queued = false;
    const top = section.getBoundingClientRect().top;
    const bottom = Math.max(...portraits.map(image => image.getBoundingClientRect().bottom));
    if (bottom > top) section.style.setProperty('--band-stage-height', `${Math.round(bottom - top)}px`);
  }
  function schedule() {
    if (!queued) { queued = true; requestAnimationFrame(alignFloor); }
  }
  const observer = new ResizeObserver(schedule);
  observer.observe(section);
  portraits.forEach(image => { observer.observe(image); image.addEventListener('load', schedule); });
  window.addEventListener('resize', schedule);
  window.addEventListener('pageshow', schedule);
  document.fonts?.ready.then(schedule);
  schedule();
})();

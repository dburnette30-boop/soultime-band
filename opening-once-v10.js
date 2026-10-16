(() => {
  const video = document.querySelector('video.hero-film');
  const logo = document.querySelector('.hero-still');
  const button = document.getElementById('film-toggle');
  if (!video || !logo) return;
  let finished = false, started = false, pausedByVisitor = false, timer;
  const clipLength = 62;
  function finish() {
    if (finished) return;
    finished = true;
    clearTimeout(timer);
    video.autoplay = false;
    video.removeAttribute('autoplay');
    video.loop = false;
    video.pause();
    video.style.opacity = '0';
    logo.classList.add('is-visible');
    if (button) button.hidden = true;
    // Permanently remove the player after the dissolve: it cannot loop or restart.
    setTimeout(() => { video.remove(); }, 1700);
  }
  window.finishSoulTimeOpening = finish;
  function start() {
    if (finished || pausedByVisitor || document.hidden) return;
    video.muted = true;
    video.play().catch(() => label());
  }
  function label() {
    if (!button || finished) return;
    button.innerHTML = video.paused ? '▶ <span>Play film</span>' : 'Ⅱ <span>Pause film</span>';
    button.setAttribute('aria-label', video.paused ? 'Play background video' : 'Pause background video');
  }
  function armStop() {
    clearTimeout(timer);
    const duration = Number.isFinite(video.duration) ? video.duration : clipLength;
    timer = setTimeout(finish, Math.max(0, duration - video.currentTime) * 1000);
  }
  video.muted = true;
  video.defaultMuted = true;
  video.playsInline = true;
  video.loop = false;
  video.removeAttribute('loop');
  video.addEventListener('ended', finish);
  video.addEventListener('playing', () => {
    if (finished) { video.pause(); return; }
    started = true;
    video.style.animationPlayState = 'running';
    armStop(); label();
  });
  video.addEventListener('pause', () => { clearTimeout(timer); video.style.animationPlayState = 'paused'; label(); });
  video.addEventListener('timeupdate', () => {
    if (finished) return;
    const duration = Number.isFinite(video.duration) ? video.duration : clipLength;
    if (video.currentTime >= duration - 0.12) finish();
  });
  ['loadedmetadata', 'loadeddata', 'canplay'].forEach(event => video.addEventListener(event, () => { if (!started) start(); }));
  // Restoring the same page must never replay a finished opening.
  window.addEventListener('pageshow', () => { if (!started) start(); });
  document.addEventListener('visibilitychange', () => { if (!started) start(); });
  ['touchend', 'pointerdown', 'keydown'].forEach(event => document.addEventListener(event, e => {
    if (!started && !button?.contains(e.target)) start();
  }, { passive: true }));
  button?.addEventListener('click', () => {
    if (finished) return;
    pausedByVisitor = !video.paused;
    if (pausedByVisitor) video.pause(); else start();
  });
  start();
})();

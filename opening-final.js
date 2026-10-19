(() => {
  const video = document.querySelector('video.hero-film');
  const still = document.querySelector('.hero-still');
  if (!video || !still) return;
  const headline = document.querySelector('.hero-headline');
  const shade = document.querySelector('.hero-shade');
  const playButton = document.createElement('button');
  playButton.className = 'opening-play';
  playButton.textContent = '▶ Play opening video';
  playButton.hidden = true;
  video.parentElement.append(playButton);
  let finished = false, starting = false, stopTimer;
  video.muted = video.defaultMuted = true;
  video.playsInline = true;
  const desktopOpening = window.matchMedia('(min-width:1001px) and (hover:hover) and (pointer:fine)').matches;
  const backdropReady = desktopOpening ? new Promise(resolve => {
    const backdrop = new Image();
    backdrop.onload = () => backdrop.decode().catch(() => {}).then(resolve);
    backdrop.onerror = resolve;
    backdrop.src = 'assets/continuous-curtain-v224.png';
  }) : Promise.resolve();
  video.autoplay = !desktopOpening;
  if (desktopOpening) video.pause();
  video.loop = false;
  function sync() {
    if (finished) return;
    // Fade the overlay as the opening drummer shot dissolves to Cherry.
    const hideTitle = video.currentTime >= 5.4;
    const fadeOpacity = Math.max(0, Math.min(1, (5.4-video.currentTime)/0.8));
    [headline,shade].forEach(element => {
      if (!element) return;
      element.style.transition = 'none';
      element.style.opacity = String(fadeOpacity);
    });
    const logoPhase = video.currentTime >= 10.9666;
    headline?.classList.toggle('is-faded', hideTitle);
    shade?.classList.toggle('is-faded', hideTitle);
    video.classList.toggle('is-logo-phase', logoPhase);
    // Dissolve from the moving light-show logo, before the plain logo segment.
    if (video.currentTime >= 17.0) finish(true);
  }
  function finish(keepMotion = false) {
    if (finished) return;
    finished = true;
    clearTimeout(stopTimer);
    if (keepMotion === true) stopTimer = setTimeout(() => video.pause(), 800);
    else video.pause();
    still.classList.add('is-visible');
    video.classList.add('is-dissolving');
    [headline,shade].forEach(element => {
      element?.style.removeProperty('transition');
      element?.style.removeProperty('opacity');
    });
    headline?.classList.remove('is-faded');
    shade?.classList.remove('is-faded');
    playButton.hidden = true;
  }
  async function start() {
    if (finished || starting || document.hidden || !video.paused) return;
    starting = true;
    try {
      await backdropReady;
      if (finished || document.hidden) return;
      if (desktopOpening) {
        await new Promise(requestAnimationFrame);
        video.closest('.hero')?.classList.add('pc-opening-ready');
      }
      await video.play(); playButton.hidden = true;
    }
    catch { if (!finished) playButton.hidden = false; }
    finally { starting = false; }
  }
  function replay() {
    clearTimeout(stopTimer);
    video.pause();
    finished = false;
    video.currentTime = 0;
    video.classList.remove('is-dissolving', 'is-logo-phase');
    still.classList.remove('is-visible');
    [headline,shade].forEach(element => {
      element?.style.removeProperty('transition');
      element?.style.removeProperty('opacity');
    });
    headline?.classList.remove('is-faded');
    shade?.classList.remove('is-faded');
    playButton.hidden = true;
    start();
  }
  window.replaySoulTimeOpening = replay;
  window.finishSoulTimeOpening = finish;
  video.addEventListener('timeupdate', sync);
  // Follow the video's own clock so the title and filmed drum fade together.
  if (video.requestVideoFrameCallback) {
    const frame = () => { sync(); video.requestVideoFrameCallback(frame); };
    video.requestVideoFrameCallback(frame);
  }
  video.addEventListener('ended', finish);
  video.addEventListener('playing', () => { playButton.hidden = true; });
  ['loadeddata', 'canplay', 'canplaythrough'].forEach(event => video.addEventListener(event, start));
  playButton.addEventListener('click', start);
  ['touchend', 'pointerdown', 'keydown'].forEach(event => document.addEventListener(event, start, {passive:true}));
  // Resume interrupted playback without replaying the opening on Home or tab return.
  document.addEventListener('visibilitychange', () => {
    if (document.hidden) video.pause();
    else start();
  });
  window.addEventListener('pageshow', start);
  const navigation = performance.getEntriesByType('navigation')[0];
  const returningFromSitePage = document.referrer &&
    new URL(document.referrer).origin === location.origin &&
    navigation?.type !== 'reload';
  const url = new URL(location.href);
  const requestedReplay = url.searchParams.get('opening') === 'replay';
  if (requestedReplay) {
    url.searchParams.delete('opening');
    history.replaceState(history.state, '', url.href);
    replay();
  } else {
    if (returningFromSitePage) finish();
    start();
  }
})();

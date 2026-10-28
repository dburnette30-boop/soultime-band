(() => {
 const video=document.querySelector('video.hero-film');
 const sound=document.getElementById('opening-sound');
 document.getElementById('replay-opening').addEventListener('click',()=>window.replaySoulTimeOpening?.());
 document.getElementById('skip-opening').addEventListener('click',()=>window.finishSoulTimeOpening?.());
 sound.addEventListener('click',()=>{
  video.muted=!video.muted;
  sound.setAttribute('aria-pressed',String(!video.muted));
  sound.textContent=video.muted?'Turn sound on':'Turn sound off';
  if(video.classList.contains('is-dissolving'))window.replaySoulTimeOpening?.();
 });
})();

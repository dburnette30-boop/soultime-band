(() => {
 const hero=document.querySelector('.home-page .hero');
 const header=document.querySelector('.home-page > header');
 const caption=hero?.querySelector('.hero-description');
 if(!hero||!header||!caption)return;
 // Use the stable viewport so Safari's changing toolbars cannot shift the overlay.
 const viewportMeasure=document.createElement('div');
 viewportMeasure.setAttribute('aria-hidden','true');
 viewportMeasure.style.cssText='position:absolute;visibility:hidden;pointer-events:none;width:0;height:100svh;inset:0 auto auto 0';
 document.body.append(viewportMeasure);
 let queued=false;
 function fit(){
  queued=false;
  const width=hero.clientWidth;
  const viewport=viewportMeasure.getBoundingClientRect().height||window.innerHeight;
  const available=viewport-header.getBoundingClientRect().height-caption.getBoundingClientRect().height-12;
  // On PCs, reserve room for the header and caption even on short laptop screens.
  const desktop=window.matchMedia('(min-width:1001px) and (hover:hover) and (pointer:fine)').matches;
  const height=desktop ? Math.min(width*9/16,Math.max(120,viewport-header.getBoundingClientRect().height-20)) : Math.min(width*9/16,Math.max(120,available));
  hero.style.setProperty('--opening-media-height',`${height}px`);
  hero.style.setProperty('--opening-media-width',`${Math.min(width,height*16/9)}px`);
 }
 function schedule(){if(!queued){queued=true;requestAnimationFrame(fit)}}
 const observer=new ResizeObserver(schedule);observer.observe(header);observer.observe(caption);
 window.addEventListener('resize',schedule);window.addEventListener('pageshow',schedule);
 // Camera cuts only affect the video; the title keeps the freeze-frame coordinates.
 document.fonts?.ready.then(schedule);fit();
})();

(() => {
 if (!window.matchMedia('(min-width:1001px) and (hover:hover) and (pointer:fine)').matches) return;
 history.scrollRestoration='manual';
 const top=()=>window.scrollTo({top:0,left:0,behavior:'instant'});
 top();
 window.addEventListener('pageshow',()=>{top();requestAnimationFrame(top)});
})();

const menu=document.querySelector('.menu-toggle'),nav=document.querySelector('nav');
menu.addEventListener('click',()=>{const open=nav.classList.toggle('open');menu.setAttribute('aria-expanded',open);menu.setAttribute('aria-label',open?'Close navigation':'Open navigation')});
nav.querySelectorAll('a').forEach(a=>a.addEventListener('click',()=>{nav.classList.remove('open');menu.setAttribute('aria-expanded','false')}));
const dialog=document.getElementById('media-dialog'),content=document.getElementById('dialog-content'),caption=document.getElementById('dialog-caption');
document.querySelectorAll('[data-video]').forEach(b=>b.addEventListener('click',()=>{const iframe=document.createElement('iframe');iframe.src='https://www.youtube-nocookie.com/embed/'+b.dataset.video+'?autoplay=1&rel=0';iframe.title=b.dataset.title;iframe.allow='autoplay; encrypted-media; picture-in-picture';iframe.allowFullscreen=true;content.replaceChildren(iframe);caption.textContent=b.dataset.title;dialog.showModal()}));
const photos=[...document.querySelectorAll('[data-image]')];
let photoIndex=-1;
const photoNav=document.createElement('div');photoNav.className='photo-navigation';photoNav.hidden=true;
const previous=document.createElement('button'),next=document.createElement('button'),count=document.createElement('span');
previous.type=next.type='button';previous.textContent='←';next.textContent='→';previous.setAttribute('aria-label','Previous photo');next.setAttribute('aria-label','Next photo');count.setAttribute('aria-live','polite');
photoNav.append(previous,count,next);caption.after(photoNav);
function showPhoto(index){
 photoIndex=(index+photos.length)%photos.length;const b=photos[photoIndex];const img=document.createElement('img');
 img.src=b.dataset.image;img.alt=b.dataset.caption;content.replaceChildren(img);caption.textContent=b.dataset.caption;
 count.textContent=`${photoIndex+1} / ${photos.length}`;photoNav.hidden=false;
}
photos.forEach((b,index)=>b.addEventListener('click',()=>{showPhoto(index);dialog.showModal()}));
previous.addEventListener('click',()=>showPhoto(photoIndex-1));next.addEventListener('click',()=>showPhoto(photoIndex+1));
dialog.addEventListener('keydown',event=>{if(photoNav.hidden)return;if(event.key==='ArrowLeft'){event.preventDefault();showPhoto(photoIndex-1)}if(event.key==='ArrowRight'){event.preventDefault();showPhoto(photoIndex+1)}});
dialog.addEventListener('close',()=>{photoIndex=-1;photoNav.hidden=true});
dialog.querySelector('.dialog-close').addEventListener('click',()=>dialog.close());dialog.addEventListener('click',e=>{if(e.target===dialog){const r=dialog.getBoundingClientRect();if(e.clientX<r.left||e.clientX>r.right||e.clientY<r.top||e.clientY>r.bottom)dialog.close()}});dialog.addEventListener('close',()=>content.replaceChildren());
document.getElementById('year').textContent=new Date().getFullYear();



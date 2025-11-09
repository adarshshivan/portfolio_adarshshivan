// Small JS for interactions
document.addEventListener('DOMContentLoaded',function(){
  // set year in footer
  const y = new Date().getFullYear();
  const el = document.getElementById('year');
  if(el) el.textContent = y;

  // mobile nav toggle
  const btn = document.querySelector('.nav-toggle');
  const nav = document.querySelector('.site-nav');
  if(btn && nav){
    // ensure proper ARIA state
    btn.setAttribute('aria-expanded', 'false');
    btn.addEventListener('click', (e)=>{
      const isOpen = nav.classList.toggle('show');
      btn.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
    });

    // close menu when a nav link is clicked (mobile)
    nav.querySelectorAll('a').forEach(a=>{
      a.addEventListener('click', ()=>{
        if(nav.classList.contains('show')){
          nav.classList.remove('show');
          btn.setAttribute('aria-expanded', 'false');
        }
      });
    });

    // close when clicking outside the nav on small screens
    document.addEventListener('click', (evt)=>{
      const target = evt.target;
      if(nav.classList.contains('show')){
        if(!nav.contains(target) && target !== btn){
          nav.classList.remove('show');
          btn.setAttribute('aria-expanded','false');
        }
      }
    });
  }

  // Typewriter effect for the name (only the name)
  (function(){
    const el = document.getElementById('type-name');
    if(!el) return;
    const full = el.textContent.trim();
    // guard: if empty or already typed, do nothing
    if(!full || el.dataset.typed === 'true') return;
    el.textContent = '';
    el.classList.add('typing');
    let i = 0;
    const speed = 110; // ms per char
    const timer = setInterval(()=>{
      el.textContent += full.charAt(i);
      i += 1;
      if(i >= full.length){
        clearInterval(timer);
        el.dataset.typed = 'true';
        // keep caret blinking after typing; remove .typing after short pause to stop any "typing" state styles
        setTimeout(()=> el.classList.remove('typing'), 900);
      }
    }, speed);
  })();
});
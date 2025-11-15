// Small JS for interactions
document.addEventListener('DOMContentLoaded',function(){
  // set year in footer
  const y = new Date().getFullYear();
  const el = document.getElementById('year');
  if(el) el.textContent = y;

  // mobile nav toggle
  const btn = document.querySelector('.nav-toggle');
  const nav = document.querySelector('.site-nav');
  const header = document.querySelector('.site-header');
  const headerInner = document.querySelector('.header-inner');
  const logo = document.querySelector('.logo');

  if(btn && nav && header && headerInner && logo){
    // ensure proper ARIA state
    btn.setAttribute('aria-expanded', 'false');

    // toggle handler (works both in compact/mobile and when forced by JS)
    btn.addEventListener('click', (e)=>{
      const isOpen = nav.classList.toggle('show');
      // also toggle an 'open' class on the button so it can animate into an X
      btn.classList.toggle('open', isOpen);
      // when opened ensure nav is visible
      if(isOpen){
        nav.style.display = 'flex';
      } else {
        // when closing, hide the inline display for compact mode, otherwise clear the inline style
        if(header.classList.contains('compact')) {
          nav.style.display = 'none';
        } else {
          nav.style.display = '';
        }
      }
      btn.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
    });

    // ensure focus is cleared when toggling closed so links don't stay highlighted
    // (we keep this separate so it runs after the toggle handler above)
    btn.addEventListener('click', ()=>{
      // if nav is now closed, clear any focused nav item and move focus to the toggle
      if(!nav.classList.contains('show')){
        clearNavFocus();
        try { btn.focus(); } catch(e){}
      }
    });

    // helper to clear focus inside nav (removes persistent :focus highlighting)
    function clearNavFocus(){
      try{
        const active = document.activeElement;
        if(active && nav.contains(active)){
          active.blur();
        }
      }catch(e){ /* ignore */ }
    }

    // close menu when a nav link is clicked
    nav.querySelectorAll('a').forEach(a=>{
      a.addEventListener('click', ()=>{
        if(nav.classList.contains('show')){
          nav.classList.remove('show');
          nav.style.display = header.classList.contains('compact') ? 'none' : '';
          btn.setAttribute('aria-expanded', 'false');
          btn.classList.remove('open');
          clearNavFocus();
        }
      });
    });

    // close when clicking outside the nav (useful for compact/mobile)
    document.addEventListener('click', (evt)=>{
      const target = evt.target;
      if(nav.classList.contains('show')){
        if(!nav.contains(target) && target !== btn){
          nav.classList.remove('show');
          nav.style.display = header.classList.contains('compact') ? 'none' : '';
          btn.setAttribute('aria-expanded','false');
          btn.classList.remove('open');
          clearNavFocus();
        }
      }
    });

    // Decide when to show burger vs full nav based on available space
    let resizeTimer = null;
    function checkNavOverflow(){
      // mobile breakpoint uses CSS to show burger — let CSS control when <=768px
      const isMobile = window.matchMedia('(max-width: 768px)').matches;
      if(isMobile){
        header.classList.remove('compact');
        nav.style.display = '';
        btn.style.display = '';
        nav.classList.remove('show');
        btn.setAttribute('aria-expanded','false');
        return;
      }

      // compute available space for nav inside header-inner
      const available = headerInner.clientWidth - logo.offsetWidth - 40; // 40px buffer for gaps
      const needed = nav.scrollWidth;

      if(needed > available){
        // compact mode: show burger, hide full nav
        header.classList.add('compact');
        nav.classList.remove('show');
        nav.style.display = 'none';
        btn.style.display = 'inline-flex';
        btn.setAttribute('aria-expanded','false');
        btn.classList.remove('open');
      } else {
        header.classList.remove('compact');
        nav.style.display = 'flex';
        btn.style.display = 'none';
        nav.classList.remove('show');
        btn.setAttribute('aria-expanded','false');
        btn.classList.remove('open');
      }
    }

    // run on load and when resizing (debounced)
    checkNavOverflow();
    window.addEventListener('resize', ()=>{
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(checkNavOverflow, 120);
    });
    // also check after fonts load (typewriter could affect width)
    if(document.fonts && document.fonts.ready){
      document.fonts.ready.then(checkNavOverflow);
    }
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

  // Projects: show only a single row initially, add toggle to reveal more
  (function(){
    const projectsSection = document.getElementById('projects');
    if(!projectsSection) return;
    const grid = projectsSection.querySelector('.projects-grid');
    if(!grid) return;

    const cards = Array.from(grid.querySelectorAll('.project-card'));
    if(cards.length <= 3) return; // nothing to collapse

    // helper: compute current columns in the grid (fall back to 3)
    function columnsCount(){
      try{
        const cols = getComputedStyle(grid).gridTemplateColumns;
        if(!cols) return 3;
        return cols.split(' ').length || 3;
      }catch(e){ return 3; }
    }

    // create toggle button container and button
    const toggleWrap = document.createElement('div');
    toggleWrap.className = 'projects-toggle';
    const btn = document.createElement('button');
    btn.type = 'button';
    btn.id = 'projects-toggle';
    btn.className = 'btn btn-secondary';
    btn.textContent = 'Show me'; // initial label per request
    btn.setAttribute('aria-expanded','false');
    toggleWrap.appendChild(btn);
    grid.insertAdjacentElement('afterend', toggleWrap);

    let expanded = false;

    function applyCollapse(){
      const cols = columnsCount();
      // show only first 'cols' cards
      cards.forEach((c,i)=>{
        if(i < cols) c.classList.remove('hidden'); else c.classList.add('hidden');
      });
      btn.textContent = 'Show me';
      btn.setAttribute('aria-expanded','false');
      expanded = false;
    }

    function expandAll(){
      cards.forEach(c=> c.classList.remove('hidden'));
      btn.textContent = 'Show less';
      btn.setAttribute('aria-expanded','true');
      expanded = true;
    }

    // initialize collapsed view
    applyCollapse();

    // toggle handler
    btn.addEventListener('click', ()=>{
      if(expanded) {
        applyCollapse();
        // scroll into view the projects section so collapse is visible
        projectsSection.scrollIntoView({behavior:'smooth', block:'start'});
      } else {
        expandAll();
      }
    });

    // Reapply collapse on resize if currently collapsed (columns may change)
    let resizeTimer2 = null;
    window.addEventListener('resize', ()=>{
      clearTimeout(resizeTimer2);
      resizeTimer2 = setTimeout(()=>{
        if(!expanded) applyCollapse();
      }, 120);
    });
  })();
});
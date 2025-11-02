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
    btn.addEventListener('click',()=>{
      nav.classList.toggle('show');
    });
  }
});
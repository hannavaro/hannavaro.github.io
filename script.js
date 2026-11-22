'use strict';
document.documentElement.classList.add('js');

const progress = document.querySelector('#progressBar');
let ticking = false;
function updateProgress() {
  const total = Math.max(1, document.documentElement.scrollHeight - window.innerHeight);
  progress.style.width = `${Math.min(100, Math.max(0, scrollY / total * 100))}%`;
  ticking = false;
}
window.addEventListener('scroll', () => {
  if (!ticking) { requestAnimationFrame(updateProgress); ticking = true; }
}, { passive: true });
window.addEventListener('resize', updateProgress);
updateProgress();

const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)');
const reveals = [...document.querySelectorAll('.reveal')];
if ('IntersectionObserver' in window && !prefersReduced.matches) {
  const observer = new IntersectionObserver(entries => {
    for (const entry of entries) {
      if (entry.isIntersecting) { entry.target.classList.add('is-visible'); observer.unobserve(entry.target); }
    }
  }, { rootMargin: '0px 0px -25px 0px', threshold: .08 });
  for (const el of reveals) observer.observe(el);
} else { for (const el of reveals) el.classList.add('is-visible'); }

const toggle = document.querySelector('.menu-toggle');
const mobileNav = document.querySelector('#mobileMenu');
function closeMenu() { mobileNav.hidden = true; toggle.setAttribute('aria-expanded', 'false'); toggle.setAttribute('aria-label','Открыть меню'); }
toggle.addEventListener('click', () => {
  const opening = mobileNav.hidden;
  mobileNav.hidden = !opening;
  toggle.setAttribute('aria-expanded', String(opening));
  toggle.setAttribute('aria-label', opening ? 'Закрыть меню' : 'Открыть меню');
});
mobileNav.addEventListener('click', e => { if (e.target.closest('a')) closeMenu(); });
window.addEventListener('keydown', e => { if(e.key === 'Escape') closeMenu(); });
window.addEventListener('resize', () => { if (window.innerWidth > 750) closeMenu(); });

let activeTrigger = null;
for (const trigger of document.querySelectorAll('.detail-trigger')) {
  trigger.addEventListener('click', () => {
    const target = document.getElementById(trigger.dataset.dialog);
    if (target && typeof target.showModal === 'function') {
      activeTrigger = trigger;
      target.showModal();
      document.body.style.overflow = 'hidden';
    }
  });
}
for (const dialog of document.querySelectorAll('.case-dialog')) {
  dialog.querySelector('.close-dialog').addEventListener('click', () => dialog.close());
  dialog.addEventListener('click', e => { if(e.target === dialog) dialog.close(); });
  dialog.addEventListener('close', () => {
    document.body.style.overflow = '';
    if(activeTrigger){activeTrigger.focus({preventScroll:true});activeTrigger=null;}
  });
}

// Deliberately no analytics, tracking, cookies, external scripts or paid APIs.

// Deep link to a particular case, e.g. #case-refrag, without routing or a paid backend.
function openCaseFromHash(){ const id=location.hash.slice(1);if(!id.startsWith('case-'))return;const dialog=document.getElementById(id);if(dialog && !dialog.open){dialog.showModal();document.body.style.overflow='hidden';}}
window.addEventListener('hashchange',openCaseFromHash);
openCaseFromHash();

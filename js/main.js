const menuToggle = document.getElementById('menu-toggle');
const navLinks = document.getElementById('nav-links');
const navAnchors = [...document.querySelectorAll('.nav-links a')];
const sections = [...document.querySelectorAll('main section[id]')];

function setMenu(open) {
  menuToggle.classList.toggle('open', open);
  navLinks.classList.toggle('open', open);
  menuToggle.setAttribute('aria-expanded', String(open));
  menuToggle.setAttribute('aria-label', open ? '关闭菜单' : '打开菜单');
}

menuToggle.addEventListener('click', () => setMenu(!navLinks.classList.contains('open')));
navAnchors.forEach((link) => link.addEventListener('click', () => setMenu(false)));
document.addEventListener('keydown', (event) => { if (event.key === 'Escape') setMenu(false); });

const activeSectionObserver = new IntersectionObserver((entries) => {
  const visible = entries.filter((entry) => entry.isIntersecting).sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
  if (!visible) return;
  navAnchors.forEach((link) => {
    const isActive = link.getAttribute('href') === `#${visible.target.id}`;
    link.classList.toggle('active', isActive);
    if (isActive) link.setAttribute('aria-current', 'page');
    else link.removeAttribute('aria-current');
  });
}, { rootMargin: '-20% 0px -65%', threshold: [0, 0.25, 0.5] });

sections.forEach((section) => activeSectionObserver.observe(section));

if (!window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add('visible');
      revealObserver.unobserve(entry.target);
    });
  }, { threshold: 0.12 });
  document.querySelectorAll('.section, .project-feature').forEach((element) => {
    element.classList.add('reveal');
    revealObserver.observe(element);
  });
}

document.getElementById('year').textContent = new Date().getFullYear();

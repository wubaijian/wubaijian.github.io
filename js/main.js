const menuToggle = document.getElementById('menu-toggle');
const navLinks = document.getElementById('nav-links');
const navAnchors = [...document.querySelectorAll('.nav-links a')];
const sections = [...document.querySelectorAll('main section[id]')];
const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

const typedElement = document.getElementById('typed');
const phrases = ['AI 产品经理', '独立开发者', '设计者', '创作者'];

if (typedElement) {
  if (reduceMotion) {
    typedElement.textContent = phrases[0];
  } else {
    let phraseIndex = 0;
    let charIndex = 0;
    let deleting = false;
    const typeLoop = () => {
      const current = phrases[phraseIndex];
      charIndex += deleting ? -1 : 1;
      typedElement.textContent = current.slice(0, charIndex);
      if (!deleting && charIndex === current.length) {
        deleting = true;
        window.setTimeout(typeLoop, 1600);
      } else if (deleting && charIndex === 0) {
        deleting = false;
        phraseIndex = (phraseIndex + 1) % phrases.length;
        window.setTimeout(typeLoop, 350);
      } else {
        window.setTimeout(typeLoop, deleting ? 55 : 105);
      }
    };
    typeLoop();
  }
}

const canvas = document.getElementById('orb-canvas');
if (canvas) {
  const context = canvas.getContext('2d');
  let particles = [];
  let width = 0;
  let height = 0;
  let radius = 0;
  let angle = 0;

  const setupCanvas = () => {
    const rect = canvas.getBoundingClientRect();
    const pixelRatio = Math.min(window.devicePixelRatio || 1, 2);
    width = rect.width;
    height = rect.height;
    radius = Math.min(width, height) * .3;
    canvas.width = Math.round(width * pixelRatio);
    canvas.height = Math.round(height * pixelRatio);
    context.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0);
    particles = Array.from({ length: Math.min(280, Math.floor(width * height / 3300)) }, () => ({
      theta: Math.random() * Math.PI * 2,
      phi: Math.acos(2 * Math.random() - 1),
      distance: radius * (.84 + Math.random() * .28),
      size: .6 + Math.random() * 1.4
    }));
  };

  const drawOrb = () => {
    context.clearRect(0, 0, width, height);
    angle += reduceMotion ? 0 : .003;
    particles.forEach((particle) => {
      const theta = particle.theta + angle;
      const x3 = particle.distance * Math.sin(particle.phi) * Math.cos(theta);
      const y3 = particle.distance * Math.sin(particle.phi) * Math.sin(theta);
      const z3 = particle.distance * Math.cos(particle.phi);
      const depth = (z3 + particle.distance) / (2 * particle.distance);
      context.beginPath();
      context.arc(width / 2 + x3, height / 2 + y3, particle.size * (.5 + depth), 0, Math.PI * 2);
      context.fillStyle = `rgb(23 107 77 / ${.16 + depth * .42})`;
      context.fill();
    });
    if (!reduceMotion) window.requestAnimationFrame(drawOrb);
  };

  setupCanvas();
  drawOrb();
  window.addEventListener('resize', setupCanvas, { passive: true });
}

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

if (!reduceMotion) {
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

// ===== 打字机效果 =====
const typedElement = document.getElementById('typed');
const phrases = ['AI产品经理', '开发者', '设计师', '创作者', '终身学习者'];
let phraseIndex = 0;
let charIndex = 0;
let deleting = false;

function typeLoop() {
  const current = phrases[phraseIndex];

  if (!deleting) {
    charIndex++;
    typedElement.textContent = current.slice(0, charIndex);
    if (charIndex === current.length) {
      deleting = true;
      setTimeout(typeLoop, 1800);
      return;
    }
    setTimeout(typeLoop, 120);
  } else {
    charIndex--;
    typedElement.textContent = current.slice(0, charIndex);
    if (charIndex === 0) {
      deleting = false;
      phraseIndex = (phraseIndex + 1) % phrases.length;
      setTimeout(typeLoop, 400);
      return;
    }
    setTimeout(typeLoop, 60);
  }
}

if (typedElement) typeLoop();

// ===== 粒子数据球（生物荧光） =====
const canvas = document.getElementById('orb-canvas');
if (canvas) {
  const ctx = canvas.getContext('2d');
  let particles = [];
  let width, height, centerX, centerY, radius;

  const COLORS = [
    'rgba(23, 25, 28, 0.55)',   // 墨黑
    'rgba(93, 42, 26, 0.55)',   // 桔棕
    'rgba(119, 123, 134, 0.5)', // 石板灰
    'rgba(251, 225, 209, 0.95)',// 暖桃（少量高光）
  ];

  function resize() {
    const rect = canvas.parentElement.getBoundingClientRect();
    width = canvas.width = rect.width;
    height = canvas.height = rect.height;
    centerX = width / 2;
    centerY = height / 2;
    radius = Math.min(width, height) * 0.32;
  }

  function initParticles() {
    particles = [];
    const count = Math.min(420, Math.floor((width * height) / 2200));
    for (let i = 0; i < count; i++) {
      // 球面均匀分布
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      particles.push({
        theta,
        phi,
        r: radius * (0.85 + Math.random() * 0.3),
        size: 0.6 + Math.random() * 1.6,
        color: COLORS[Math.floor(Math.random() * COLORS.length)],
        speed: 0.0006 + Math.random() * 0.0012,
      });
    }
  }

  let angleY = 0;

  function draw() {
    ctx.clearRect(0, 0, width, height);
    angleY += 0.004;

    for (const p of particles) {
      const theta = p.theta + angleY;
      const phi = p.phi;

      // 3D -> 2D 投影
      const x3 = p.r * Math.sin(phi) * Math.cos(theta);
      const y3 = p.r * Math.sin(phi) * Math.sin(theta);
      const z3 = p.r * Math.cos(phi);

      const depth = (z3 + p.r) / (2 * p.r); // 0（后）~ 1（前）

      const x = centerX + x3;
      const y = centerY + y3;

      const alpha = 0.25 + depth * 0.65;
      const size = p.size * (0.5 + depth * 0.8);

      ctx.beginPath();
      ctx.arc(x, y, size, 0, Math.PI * 2);
      ctx.fillStyle = p.color.replace(/[\d.]+\)$/, alpha + ')');
      ctx.fill();
    }

    requestAnimationFrame(draw);
  }

  resize();
  initParticles();
  draw();

  window.addEventListener('resize', () => {
    resize();
    initParticles();
  });
}

// ===== 导航栏滚动效果 =====
const navbar = document.querySelector('.navbar');
window.addEventListener('scroll', () => {
  updateActiveLink();
});

// ===== 移动端菜单 =====
const menuToggle = document.getElementById('menu-toggle');
const navLinks = document.getElementById('nav-links');

menuToggle.addEventListener('click', () => {
  menuToggle.classList.toggle('open');
  navLinks.classList.toggle('open');
});

navLinks.querySelectorAll('a').forEach((link) => {
  link.addEventListener('click', () => {
    menuToggle.classList.remove('open');
    navLinks.classList.remove('open');
  });
});

// ===== 当前区块高亮导航 =====
const sections = document.querySelectorAll('section[id]');
const navAnchors = document.querySelectorAll('.nav-links a');

function updateActiveLink() {
  let currentId = 'home';
  sections.forEach((section) => {
    const top = section.offsetTop - 140;
    if (window.scrollY >= top) {
      currentId = section.id;
    }
  });
  navAnchors.forEach((a) => {
    a.classList.toggle('active', a.getAttribute('href') === '#' + currentId);
  });
}

// ===== 数字滚动动画 =====
function animateCounters() {
  const counters = document.querySelectorAll('.stat-number');
  counters.forEach((counter) => {
    const target = +counter.dataset.target;
    const duration = 1500;
    const start = performance.now();

    function update(now) {
      const elapsed = now - start;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      counter.textContent = Math.floor(eased * target);
      if (progress < 1) {
        requestAnimationFrame(update);
      } else {
        counter.textContent = target;
      }
    }
    requestAnimationFrame(update);
  });
}

// ===== 滚动进入动画 =====
const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');

        if (entry.target.querySelector('.stat-number')) {
          animateCounters();
        }
        revealObserver.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.15 }
);

document.querySelectorAll('.section').forEach((section) => {
  section.classList.add('reveal');
  revealObserver.observe(section);
});

// ===== 页脚年份 =====
document.getElementById('year').textContent = new Date().getFullYear();

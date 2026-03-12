/* =====================================================
   Hobbying — Website Script
   ===================================================== */

(function () {
  'use strict';

  // ─── Nav: scroll state ───
  const nav = document.getElementById('nav');
  const SCROLL_THRESHOLD = 40;

  function updateNav() {
    nav.classList.toggle('scrolled', window.scrollY > SCROLL_THRESHOLD);
  }
  window.addEventListener('scroll', updateNav, { passive: true });
  updateNav();

  // ─── Mobile hamburger ───
  const hamburger = document.getElementById('hamburger');
  const mobileNav = document.getElementById('mobileNav');

  hamburger.addEventListener('click', function () {
    const isOpen = mobileNav.classList.toggle('open');
    hamburger.setAttribute('aria-expanded', String(isOpen));
    hamburger.setAttribute('aria-label', isOpen ? '메뉴 닫기' : '메뉴 열기');
  });

  mobileNav.querySelectorAll('a').forEach(function (link) {
    link.addEventListener('click', function () {
      mobileNav.classList.remove('open');
      hamburger.setAttribute('aria-expanded', 'false');
      hamburger.setAttribute('aria-label', '메뉴 열기');
    });
  });

  // ─── Reveal on scroll ───
  const reveals = document.querySelectorAll('.reveal');

  const revealObserver = new IntersectionObserver(
    function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          revealObserver.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.1, rootMargin: '0px 0px -48px 0px' }
  );

  reveals.forEach(function (el) {
    revealObserver.observe(el);
  });

  // ─── Hero elements: staggered entrance on load ───
  const heroReveals = document.querySelectorAll('.reveal-hero');
  heroReveals.forEach(function (el, i) {
    setTimeout(function () {
      el.classList.add('visible');
    }, 180 + i * 110);
  });

  // ─── Progress bar: animate fill on scroll into view ───
  const statusFills = document.querySelectorAll('.status-bar__fill');

  const progressObserver = new IntersectionObserver(
    function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          var el = entry.target;
          var target = getComputedStyle(el).getPropertyValue('--progress').trim();
          // Start from 0, let CSS transition handle the animation
          requestAnimationFrame(function () {
            el.style.width = target;
          });
          progressObserver.unobserve(el);
        }
      });
    },
    { threshold: 0.5 }
  );

  statusFills.forEach(function (el) {
    progressObserver.observe(el);
  });

  // ─── Smooth scroll for anchor links ───
  document.querySelectorAll('a[href^="#"]').forEach(function (anchor) {
    anchor.addEventListener('click', function (e) {
      var id = this.getAttribute('href').slice(1);
      if (!id) return;
      var target = document.getElementById(id);
      if (target) {
        e.preventDefault();
        var navH = parseInt(
          getComputedStyle(document.documentElement).getPropertyValue('--nav-h'),
          10
        ) || 66;
        var top = target.getBoundingClientRect().top + window.scrollY - navH;
        window.scrollTo({ top: top, behavior: 'smooth' });
      }
    });
  });

  // ─── Active nav link on scroll ───
  var sections = document.querySelectorAll('main section[id]');
  var navLinks = document.querySelectorAll('.nav__links a, .nav__mobile a');

  var sectionObserver = new IntersectionObserver(
    function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          var id = entry.target.id;
          navLinks.forEach(function (link) {
            link.classList.remove('active');
            if (link.getAttribute('href') === '#' + id) {
              link.classList.add('active');
            }
          });
        }
      });
    },
    { rootMargin: '-35% 0px -55% 0px' }
  );

  sections.forEach(function (section) {
    sectionObserver.observe(section);
  });

  // ─── Game card: subtle mouse-tracking tilt ───
  var gameCard = document.querySelector('.game-card');
  if (gameCard) {
    var artPanel = gameCard.querySelector('.game-card__art');

    gameCard.addEventListener('mousemove', function (e) {
      var rect = gameCard.getBoundingClientRect();
      var cx = rect.left + rect.width / 2;
      var cy = rect.top + rect.height / 2;
      var dx = (e.clientX - cx) / (rect.width / 2);   // -1 to 1
      var dy = (e.clientY - cy) / (rect.height / 2);  // -1 to 1

      // Very subtle tilt — 2deg max
      var rotX = -dy * 2;
      var rotY =  dx * 2;
      gameCard.style.transform = 'perspective(1200px) rotateX(' + rotX + 'deg) rotateY(' + rotY + 'deg)';

      // Shift the radial glow inside the art panel with the cursor
      if (artPanel) {
        var ax = ((e.clientX - rect.left) / rect.width) * 100;
        var ay = ((e.clientY - rect.top) / rect.height) * 100;
        artPanel.style.setProperty('--mx', ax + '%');
        artPanel.style.setProperty('--my', ay + '%');
      }
    });

    gameCard.addEventListener('mouseleave', function () {
      gameCard.style.transform = '';
      gameCard.style.transition = 'transform 0.6s cubic-bezier(0.16, 1, 0.3, 1), border-color 0.28s, box-shadow 0.28s';
      setTimeout(function () {
        gameCard.style.transition = '';
      }, 600);
    });

    gameCard.addEventListener('mouseenter', function () {
      gameCard.style.transition = 'transform 0.12s linear, border-color 0.28s, box-shadow 0.28s';
    });
  }

  // ─── Pill parallax on hero scroll ───
  // Uses a CSS variable --scroll-y on each pill so we don't fight
  // the @keyframes pillFloat animation (which uses transform directly).
  // The CSS animation handles the floating; parallax is layered via
  // a translateY on the pill's --py custom property read by a wrapper.
  // Simplest approach: just nudge opacity + a tiny translateY on the
  // parent .hero__bg element itself, which sits below the content.
  var heroBg = document.querySelector('.hero__bg');
  var heroSection = document.getElementById('hero');

  if (heroBg && heroSection && window.matchMedia('(prefers-reduced-motion: no-preference)').matches) {
    window.addEventListener('scroll', function () {
      var progress = Math.min(window.scrollY / heroSection.offsetHeight, 1);
      // Subtle downward drift of the whole pill layer as user scrolls
      var offset = progress * heroSection.offsetHeight * 0.12;
      heroBg.style.transform = 'translateY(' + offset + 'px)';
    }, { passive: true });
  }

})();

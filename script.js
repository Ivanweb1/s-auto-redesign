const menuButton = document.querySelector('.menu-toggle');
const nav = document.querySelector('.nav');
const modal = document.querySelector('#request-modal');
const form = document.querySelector('#request-form');

menuButton.addEventListener('click', () => {
  const open = menuButton.getAttribute('aria-expanded') === 'true';
  menuButton.setAttribute('aria-expanded', String(!open));
  nav.classList.toggle('open', !open);
});

nav.querySelectorAll('a').forEach((link) => link.addEventListener('click', () => {
  nav.classList.remove('open');
  menuButton.setAttribute('aria-expanded', 'false');
}));

document.querySelectorAll('.js-open-modal').forEach((button) => {
  button.addEventListener('click', () => modal.showModal());
});

document.querySelector('.modal-close').addEventListener('click', () => modal.close());
modal.addEventListener('click', (event) => {
  if (event.target === modal) modal.close();
});

form.addEventListener('submit', (event) => {
  event.preventDefault();
  form.hidden = true;
  modal.querySelector('.success').hidden = false;
});

const slider = document.querySelector('.hero-slider');
const slides = [...slider.querySelectorAll('[data-slide]')];
const dots = [...slider.querySelectorAll('[data-slide-to]')];
const count = slider.querySelector('.slider-count b');
let activeSlide = 0;
let autoplay;

function showSlide(index) {
  activeSlide = (index + slides.length) % slides.length;
  slides.forEach((slide, slideIndex) => {
    const active = slideIndex === activeSlide;
    slide.classList.toggle('is-active', active);
    slide.setAttribute('aria-hidden', String(!active));
  });
  dots.forEach((dot, dotIndex) => {
    const active = dotIndex === activeSlide;
    dot.classList.toggle('is-active', active);
    dot.setAttribute('aria-selected', String(active));
  });
  count.textContent = String(activeSlide + 1).padStart(2, '0');
}

function stopAutoplay() {
  window.clearInterval(autoplay);
}

function startAutoplay() {
  stopAutoplay();
  if (!window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    autoplay = window.setInterval(() => showSlide(activeSlide + 1), 6500);
  }
}

slider.querySelector('[data-prev]').addEventListener('click', () => {
  showSlide(activeSlide - 1);
  startAutoplay();
});
slider.querySelector('[data-next]').addEventListener('click', () => {
  showSlide(activeSlide + 1);
  startAutoplay();
});
dots.forEach((dot) => dot.addEventListener('click', () => {
  showSlide(Number(dot.dataset.slideTo));
  startAutoplay();
}));
slider.addEventListener('pointerenter', stopAutoplay);
slider.addEventListener('pointerleave', startAutoplay);
slider.addEventListener('focusin', stopAutoplay);
slider.addEventListener('focusout', startAutoplay);
document.addEventListener('visibilitychange', () => document.hidden ? stopAutoplay() : startAutoplay());

showSlide(0);
startAutoplay();

const moneyFormatter = new Intl.NumberFormat('ru-RU', { maximumFractionDigits: 0 });

document.querySelectorAll('.car-card[data-price]').forEach((card) => {
  const price = Number(card.dataset.price);
  const downPayment = Number(card.dataset.downPayment);
  const paymentOutput = card.querySelector('[data-payment]');
  const termButtons = [...card.querySelectorAll('[data-term]')];

  function updatePayment(term) {
    const monthlyPayment = Math.ceil((price - downPayment) / term);
    paymentOutput.textContent = `${moneyFormatter.format(monthlyPayment)} ₽`;
    termButtons.forEach((button) => {
      const active = Number(button.dataset.term) === term;
      button.classList.toggle('is-active', active);
      button.setAttribute('aria-pressed', String(active));
    });
  }

  termButtons.forEach((button) => {
    button.addEventListener('click', () => updatePayment(Number(button.dataset.term)));
  });

  updatePayment(24);
});

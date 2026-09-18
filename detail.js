const menuButton = document.querySelector('.menu-toggle');
const nav = document.querySelector('.nav');
const modal = document.querySelector('#request-modal');
const form = document.querySelector('#request-form');

menuButton?.addEventListener('click', () => {
  const open = menuButton.getAttribute('aria-expanded') === 'true';
  menuButton.setAttribute('aria-expanded', String(!open));
  nav?.classList.toggle('open', !open);
});

nav?.querySelectorAll('a').forEach((link) => link.addEventListener('click', () => {
  nav.classList.remove('open');
  menuButton?.setAttribute('aria-expanded', 'false');
}));

document.querySelectorAll('.js-open-modal').forEach((button) => {
  button.addEventListener('click', () => modal?.showModal());
});

document.querySelector('.modal-close')?.addEventListener('click', () => modal?.close());
modal?.addEventListener('click', (event) => {
  if (event.target === modal) modal.close();
});

form?.addEventListener('submit', (event) => {
  event.preventDefault();
  form.hidden = true;
  modal.querySelector('.success').hidden = false;
});

const calculator = document.querySelector('.vehicle-summary[data-price]');

if (calculator) {
  const price = Number(calculator.dataset.price);
  const downPayment = calculator.querySelector('[data-down-payment]');
  const downOutput = calculator.querySelector('[data-down-output]');
  const monthlyOutput = calculator.querySelector('[data-monthly-output]');
  const termButtons = [...calculator.querySelectorAll('[data-term]')];
  const money = new Intl.NumberFormat('ru-RU', { maximumFractionDigits: 0 });
  let activeTerm = 24;

  function updateCalculation() {
    const down = Number(downPayment.value);
    const payment = Math.ceil((price - down) / activeTerm);
    const progress = ((down - Number(downPayment.min)) / (Number(downPayment.max) - Number(downPayment.min))) * 100;
    downOutput.textContent = `${money.format(down)} ₽`;
    monthlyOutput.textContent = `${money.format(payment)} ₽`;
    downPayment.style.setProperty('--range-progress', `${progress}%`);
  }

  termButtons.forEach((button) => button.addEventListener('click', () => {
    activeTerm = Number(button.dataset.term);
    termButtons.forEach((item) => {
      const active = item === button;
      item.classList.toggle('is-active', active);
      item.setAttribute('aria-pressed', String(active));
    });
    updateCalculation();
  }));

  downPayment.addEventListener('input', updateCalculation);
  updateCalculation();
}

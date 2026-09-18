const menuButton = document.querySelector('.menu-toggle');
const nav = document.querySelector('.nav');
const modal = document.querySelector('#request-modal');
const requestForm = document.querySelector('#request-form');

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

requestForm?.addEventListener('submit', (event) => {
  event.preventDefault();
  requestForm.hidden = true;
  modal.querySelector('.success').hidden = false;
});

const calculator = document.querySelector('#installment-calculator');

if (calculator) {
  const priceInput = calculator.querySelector('[name="car_price"]');
  const firstPaymentInput = calculator.querySelector('[name="first_pay"]');
  const termSelect = calculator.querySelector('[name="time_pay"]');
  const paymentOutput = calculator.querySelector('#monthly-payment');
  const errorOutput = calculator.querySelector('#calculator-error');
  const submitButton = calculator.querySelector('.calculator-submit');
  const money = new Intl.NumberFormat('ru-RU', { maximumFractionDigits: 0 });

  const numberFromInput = (input) => Number(input.value.replace(/[^0-9]/g, '')) || 0;
  const formatInput = (input) => {
    const value = numberFromInput(input);
    input.value = value ? money.format(value) : '';
  };

  function monthlyPayment(sum, months) {
    const rate = 0.06;
    const growth = Math.pow(1 + rate, months);
    return Math.floor(sum * rate * growth / (growth - 1));
  }

  function calculate() {
    const price = numberFromInput(priceInput);
    const firstPayment = numberFromInput(firstPaymentInput);
    const months = Number(termSelect.value);
    const minimumPercent = price >= 1000000 ? 0.25 : 0.3;
    const minimumFirstPayment = Math.floor(price * minimumPercent);
    const financedAmount = price - firstPayment;
    let error = '';

    if (price < 350000) error = 'Минимальная цена автомобиля — 350 000 ₽.';
    else if (firstPayment < minimumFirstPayment) error = `Первоначальный платёж — минимум ${minimumPercent * 100}% от стоимости автомобиля.`;
    else if (financedAmount < 150000) error = 'Минимальная сумма рассрочки — 150 000 ₽.';

    if (error) {
      paymentOutput.textContent = 'Расчёт недоступен';
      paymentOutput.classList.add('is-error');
      errorOutput.textContent = error;
      errorOutput.hidden = false;
      submitButton.hidden = true;
      return;
    }

    paymentOutput.textContent = `${money.format(monthlyPayment(financedAmount, months))} ₽`;
    paymentOutput.classList.remove('is-error');
    errorOutput.hidden = true;
    submitButton.hidden = false;

    localStorage.setItem('s-auto-calculator', JSON.stringify({ price, firstPayment, months }));
  }

  [priceInput, firstPaymentInput].forEach((input) => {
    input.addEventListener('input', () => {
      formatInput(input);
      calculate();
    });
  });

  priceInput.addEventListener('blur', () => {
    const price = numberFromInput(priceInput);
    const minimumPercent = price >= 1000000 ? 0.25 : 0.3;
    firstPaymentInput.value = money.format(Math.floor(price * minimumPercent));
    calculate();
  });

  termSelect.addEventListener('change', calculate);
  calculate();
}

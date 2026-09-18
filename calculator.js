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
  const priceRange = calculator.querySelector('[data-price-range]');
  const downRange = calculator.querySelector('[data-down-range]');
  const downPercent = calculator.querySelector('[data-down-percent]');
  const downMinimum = calculator.querySelector('[data-down-min]');
  const termOptions = [...calculator.querySelectorAll('[data-term-option]')];
  const money = new Intl.NumberFormat('ru-RU', { maximumFractionDigits: 0 });
  const guidePrice = document.querySelector('[data-guide-price]');
  const guideDown = document.querySelector('[data-guide-down]');
  const guideMonthly = document.querySelector('[data-guide-monthly]');
  const guideShare = document.querySelector('[data-guide-share]');
  const guideRing = document.querySelector('.guide-ring');
  const guideTerms = document.querySelectorAll('[data-guide-term]');

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

  function setRangeProgress(range) {
    const min = Number(range.min);
    const max = Number(range.max);
    const progress = max > min ? ((Number(range.value) - min) / (max - min)) * 100 : 0;
    range.style.setProperty('--progress', `${progress}%`);
  }

  function calculate() {
    const price = numberFromInput(priceInput);
    const firstPayment = numberFromInput(firstPaymentInput);
    const months = Number(termSelect.value);
    const minimumPercent = price >= 1000000 ? 0.25 : 0.3;
    const minimumFirstPayment = Math.floor(price * minimumPercent);
    const financedAmount = price - firstPayment;
    const share = price ? Math.round(firstPayment / price * 100) : 0;
    let error = '';

    priceRange.value = Math.min(Math.max(price, Number(priceRange.min)), Number(priceRange.max));
    downRange.min = minimumFirstPayment;
    downRange.max = Math.max(minimumFirstPayment, Math.floor(price * 0.7));
    downRange.value = Math.min(Math.max(firstPayment, Number(downRange.min)), Number(downRange.max));
    downPercent.textContent = `${share}%`;
    downMinimum.textContent = `${minimumPercent * 100}% минимум`;
    setRangeProgress(priceRange);
    setRangeProgress(downRange);
    termOptions.forEach((button) => {
      const active = Number(button.dataset.termOption) === months;
      button.classList.toggle('is-active', active);
      button.setAttribute('aria-pressed', String(active));
    });

    guidePrice.textContent = `${money.format(price)} ₽`;
    guideDown.textContent = `${money.format(firstPayment)} ₽`;
    guideTerms.forEach((item) => { item.textContent = months; });
    guideShare.textContent = `${share}%`;
    guideRing.style.setProperty('--share', `${Math.min(Math.max(share, 0), 100)}%`);

    if (price < 350000) error = 'Минимальная цена автомобиля — 350 000 ₽.';
    else if (firstPayment < minimumFirstPayment) error = `Первоначальный платёж — минимум ${minimumPercent * 100}% от стоимости автомобиля.`;
    else if (financedAmount < 150000) error = 'Минимальная сумма рассрочки — 150 000 ₽.';

    if (error) {
      paymentOutput.textContent = 'Расчёт недоступен';
      paymentOutput.classList.add('is-error');
      errorOutput.textContent = error;
      errorOutput.hidden = false;
      submitButton.hidden = true;
      guideMonthly.textContent = '—';
      return;
    }

    const payment = monthlyPayment(financedAmount, months);
    paymentOutput.textContent = `${money.format(payment)} ₽`;
    guideMonthly.textContent = `${money.format(payment)} ₽`;
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

  priceRange.addEventListener('input', () => {
    priceInput.value = money.format(Number(priceRange.value));
    calculate();
  });

  downRange.addEventListener('input', () => {
    firstPaymentInput.value = money.format(Number(downRange.value));
    calculate();
  });

  priceInput.addEventListener('blur', () => {
    const price = numberFromInput(priceInput);
    const minimumPercent = price >= 1000000 ? 0.25 : 0.3;
    firstPaymentInput.value = money.format(Math.floor(price * minimumPercent));
    calculate();
  });

  termSelect.addEventListener('change', calculate);
  termOptions.forEach((button) => button.addEventListener('click', () => {
    termSelect.value = button.dataset.termOption;
    calculate();
  }));
  calculate();
}
